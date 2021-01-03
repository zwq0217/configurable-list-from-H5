import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  {
    path: '/comListTest',
    component: () => import('../views/comListTest'),
    meta: {
      showHeader: true, // 是否需要显示顶部
      title: '测试列表', // 标题
      showGoBack: true, // 显示返回图标
      showTabbar: true, // 显示底部tabs
      query: { active: 0 }, // 底部tabs 激活的位置
      keepAlive: false, // 是否需要keepAlive 缓存
      requireAuth: false // 是否需要鉴权
    }
  }
]

const router = new VueRouter({
  mode: 'history', // 模式，默认hash
  routes,
  scrollBehavior: () => ({ y: 0 })
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (localStorage.getItem('loginToken')) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    if (to.path === '/') {
      localStorage.clear()
      next({
        path: '/comListTest'
      })
    }
    next()
  }
})

export default router
