<template>
  <div class="comSelectList">
    <van-field v-model="value" :required="required" :label="label" style="font-size: 14px" :placeholder="placeholder" @click="show = true" />
    <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
      <van-search
        v-model="value"
        show-action
        :placeholder="placeholder"
        style="padding: 5px 0; font-size: 14px"
      >
        <template #left>
          <div @click="show = false" style="font-size: 13px">{{ searchLabel }}</div>
        </template>
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <comPullRefresh
        ref="comPullRefresh"
        :params="params"
        :interfaceObj="api.interfaceObj"
        :showType="api.showType"
        :showTextFormat="api.showTextFormat"
        @changeCheckoutItem="changeCheckoutItem"
      />
      <div class="comPullRefresh_bottom">
        <van-radio-group v-model="isCheckAll" style="margin-top: 11px">
          <van-radio v-if="!isCheckAll" :name="true">全选</van-radio>
          <van-radio v-else :name="false">取消全选</van-radio>
        </van-radio-group>
        <van-button round @click="confirm" type="info">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import comPullRefresh from './comPullRefresh/comPullRefresh'

export default {
  name: 'comSelectList',
  components: {
    comPullRefresh
  },
  props: {
    label: {
      type: String,
      require: false,
      default: ''
    },
    placeholder: {
      type: String,
      require: false,
      default: ''
    },
    api: {
      type: Object,
      require: false,
      default: () => {}
    },
    params: {
      type: Object,
      require: false,
      default: () => {}
    },
    searchLabel: {
      type: String,
      require: false,
      default: '关闭'
    },
    searchKey: {
      type: String,
      require: false,
      default: ''
    },
    required: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  data () {
    return {
      value: '',
      show: false,
      isCheckAll: false,
      selectList: []
    }
  },
  watch: {
    isCheckAll (newV) {
      if (newV) {
        this.$refs.comPullRefresh.toggleAll()
      } else {
        this.$refs.comPullRefresh.checkAll()
      }
    },
    show (newV) {
      if (newV) {
        this.$nextTick(() => {
          this.$refs.comPullRefresh.onRefresh({ ...this.params, [this.searchKey]: this.value ? this.value : undefined })
        })
      }
    }
  },
  methods: {
    changeCheckoutItem (list) {
      this.selectList = list
    },
    onSearch () {
      this.$refs.comPullRefresh.onRefresh({ ...this.params, [this.searchKey]: this.value ? this.value : undefined })
    },
    clearList () {
      this.$refs.comPullRefresh.clearList()
    },
    confirm () {
      this.$refs.comPullRefresh.checkAll()
      this.show = false
      this.$emit('getSelectList', this.selectList)
    }
  }
}
</script>

<style>
.comPullRefresh_bottom {
  position: fixed;
  bottom: 0px;
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #FFFFFF;
}
</style>
