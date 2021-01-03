import { loginClearKeys } from './key'
/***
 * 数组数据去重
 * arr
 * {Array}
 */
function removeArr (arr) {
  const temp = {}
  const newArr = []

  for (let i = 0; i < arr.length; i++) {
    if (!temp[arr[i]]) {
      temp[arr[i]] = true
      newArr.push(arr[i])
    }
  }
  return newArr
}

class localStorageService {
  constructor () {
    const keyArr = window.localStorage.getItem('keyArr')
    if (keyArr) {
      this.arr = removeArr(JSON.parse(keyArr))
    } else {
      this.arr = []
      window.localStorage.setItem('keyArr', JSON.stringify(this.arr))
    }
  }

  /***
   * 启动清理器
   */
  startClear () {
    this.cleanBeOverdue()
  }

  /**
   * 清除过期本地存储
   */
  cleanBeOverdue () {
    // 不存在本地存储，继续轮询
    // console.log(this.arr)
    if (this.arr.length === 0) {
      return false
    }

    const nowTime = new Date().getTime()
    for (let i = 0; i < this.arr.length; i++) {
      const key = this.arr[i]
      let item = window.localStorage.getItem(key)
      item = JSON.parse(item)

      // 存在时间
      if (typeof item === 'object' && item && item.time) {
        // 删除到期本地存储
        if (nowTime * 1 >= item.time * 1) {
          this.remove(key)
        }
      }
    }

    setTimeout(() => {
      this.cleanBeOverdue()
    }, 1000)
  }

  /**
   * 设置本地存储
   * key    键名
   * value  值
   * time   存储时间 (毫秒)
   */
  set (key, value, time = 1000 * 60 * 60 * 24 * 7) {
    const futureTime = new Date().getTime() * 1 + time // 到期时间
    let data = {
      data: value,
      time: futureTime
    }
    data = JSON.stringify(data)
    window.localStorage.setItem(key, data)
    // 存储本地
    this.arr.push(key)
    window.localStorage.setItem('keyArr', JSON.stringify(removeArr(this.arr)))
  }

  /**
   * 获取本地存储
   * key  键名
   */
  get (key) {
    const getValue = window.localStorage.getItem(key)
    return getValue == null ? null : JSON.parse(getValue).data
  }

  /**
   * 删除某个存储
   * key  键名
   */
  remove (key) {
    window.localStorage.removeItem(key)
    for (let i = 0; i < this.arr.length; i++) {
      const item = this.arr[i]
      if (item === key) {
        this.arr.splice(i, 1)
      }
    }
    window.localStorage.setItem('keyArr', JSON.stringify(this.arr))
  }

  /**
   * 删除所有存储
   */
  clearAll () {
    window.localStorage.clear()
  }

  /**
   * 登陆清除
   */
  loginClear () {
    loginClearKeys.forEach((item) => this.remove(item))
  }
}

// eslint-disable-next-line new-cap
export default new localStorageService()
