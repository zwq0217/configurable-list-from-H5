<template>
  <div id="app">
    <!-- 头部 -->
    <comHeader v-if="routerMeta.showHeader" :routerMeta="routerMeta"/>
    <!-- 中间部分 -->
    <router-view
      v-if="!$route.meta.keepAlive"
      :class="{ showHeader: $route.meta.showHeader, hiddenHeader: !$route.meta.showHeader }"
    />
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        :class="{ showHeader: $route.meta.showHeader, hiddenHeader: !$route.meta.showHeader }"
      />
    </keep-alive>
    <!-- 底部 -->
    <comTabBar v-if="routerMeta.showTabbar" :routerList="usersTabList[type]"></comTabBar>
  </div>
</template>

<script>
import comHeader from './components/comHeader'
import comTabBar from './components/comTabbar'
export default {
  name: 'App',
  data () {
    return {
      type: 'test',
      routerMeta: {},
      usersTabList: {
        test: [
          {
            path: 'test1',
            title: '测试1',
            iconList: {
              active: 'classSchedule-active',
              inactive: 'classSchedule-NoActive'
            }
          },
          {
            path: 'test2',
            title: '测试2',
            iconList: {
              active: 'activate-list',
              inactive: 'inactive-list'
            }
          },
          {
            path: 'test3',
            title: '测试3',
            iconList: {
              active: 'activate-user',
              inactive: 'inactive-user'
            }
          }
        ]
      }
    }
  },
  components: {
    comHeader,
    comTabBar
  },
  watch: {
    '$route' (to) {
      this.routerMeta = to.meta
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  width: 100% !important;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
  background: #fff;
  box-sizing: border-box;
  text-align: center;
}
  .showHeader {
    height: calc(100% - 0.5rem);
  }
  .hiddenHeader {
    height: 100%;
  }
</style>
