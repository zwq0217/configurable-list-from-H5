import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import '../src/core/asyncComponents'
import './assets/css/reset.css'
import './assets/css/common.css'
import './components/icon/index'

import Dialog from './components/dialog'
import Loading from './components/loading'
import toast from './components/toast'

import './tool/plugin'
import './tool/FastClick'
import filters from './tool/filter'
import utils from './tool/utils'
Vue.use(utils)
Vue.prototype.$dialog = Dialog
Vue.prototype.$loading = Loading
Vue.prototype.$toast = toast
// 注入全局过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

Vue.config.productionTip = false

export default new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
