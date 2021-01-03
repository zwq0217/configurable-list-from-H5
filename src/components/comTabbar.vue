<template>
  <van-tabbar v-model="active">
    <van-tabbar-item v-for="(item) in routerList" :to="item.path" :key="item.path">
      <span>{{ item.title }}</span>
      <template #icon="props">
        <img :src="require(`../assets/icon/${props.active ? item.iconList.active : item.iconList.inactive}.png`)" alt="">
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: 'comTabbar',
  props: {
    routerList: {
      type: Array,
      require: false,
      default: () => {}
    }
  },
  watch: {
    '$route' (newV) {
      this.active = newV.query.active ? newV.query.active : newV.meta.query.active
    }
  },
  created () {
    this.active = this.$route.meta.query.active
  },
  data () {
    return {
      active: 0
    }
  }
}
</script>
