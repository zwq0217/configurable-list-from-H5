import axios from 'axios'
import vm from '../../main'
import { baseApi } from '../../config'
import router from '../../router'
import { Toast } from 'vant'

// 可以封装错误日志上传 这次忽略
class HttpRequest {
  constructor () {
    this.baseUrl = baseApi
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: this.getToken()
      }
    }
    return config
  }

  getToken = () => {
    return 'Basic ' + require('js-base64').Base64.encode(':' + sessionStorage.getItem('loginToken'))
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) vm.$loading.hide()
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 全局添加loading 判断header里面是否有 showLoading 属性
      if (config.headers.showLoading) {
        vm.$loading.show()
      }
      delete config.headers.showLoading
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      return res.data
    }, error => { // 看是否需要错误日志上传
      this.destroy(url)
      // 登录失效
      if (error.response.status) {
        switch (error.response.status) {
          // 401: 未登录
          // 未登录则跳转登录页面，并携带当前页面的路径
          // 在登录成功后返回当前页面，这一步需要在登录页操作。
          case 401:
            Toast.fail(error.response.data.message)
            router.replace({
              path: '/login'
            })
            break
          // 403 token过期
          // 登录过期对用户进行提示
          // 清除本地token和清空vuex中token对象
          // 跳转登录页面
          case 403:
            Toast.fail('登录过期，请重新登录')
            // 清除token
            localStorage.clear()
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
              router.replace({
                path: '/login'
              })
            }, 1000)
            break
          // 404请求不存在
          case 404:
            Toast.fail('网络请求不存在')
            break
          // 其他错误，直接抛出错误提示
          default:
            Toast.fail(error.response.data.message)
        }
      }
    })
  }

  request (option) {
    const instance = axios.create()
    option = Object.assign(this.getInsideConfig(), option)
    this.interceptors(instance, option.url)
    return instance(option)
  }
}

export default new HttpRequest()
