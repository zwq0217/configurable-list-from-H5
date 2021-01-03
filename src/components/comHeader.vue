<template>
  <div class="comHeader">
    <!-- 返回箭头 -->
    <div v-if="routerMeta.showGoBack" class="goBackIcon" @click="goBack">
      <van-icon style="font-size: 20px" name="arrow-left"/>
    </div>
    <div v-else></div>
    <!-- 中间标题 -->
    <div style="margin: 0 auto">{{ routerMeta.title }}</div>
    <!-- 右边返回主页图标 -->
    <div v-if="!path.includes($route.path)" style="position:absolute; right: 10px" @click="goHome">
      <img src="../assets/icon/home.png" width="25" height="25" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'comHeader',
  data () {
    return {
      path: [ // 需要过滤不需要返回主页图标的页面路由
        '/login'
      ]
    }
  },
  props: {
    routerMeta: {
      type: Object,
      require: false,
      default: () => {}
    }
  },
  methods: {
    goBack () {
      if (this.routerMeta.showGoBack) {
        if (this.routerMeta.goUrl) {
          this.$router.push({
            path: this.routerMeta.goUrl,
            query: this.$route.query
          })
        } else {
          this.$router.go(-1)
        }
      }
    },
    goHome () {
      this.$router.push({
        path: '/home'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.comHeader {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 18px;
  text-align: center;
  .goBackIcon {
    position: absolute;
    left: 8px;
    top: 7px;
  }
}
</style>
