<template>
  <div class="comSelectBox">
    <div class="from-sex">
      <van-field :border="false" :required="required" style="width: 1.1rem; font-size: 14px" :label="label">
      </van-field>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="selectValue"
          @open="handleClick"
          @change="handelSelect"
          :options="selectList"
        />
      </van-dropdown-menu>
      <div v-if="showReset" class="clear" @click="reset">重置</div>
    </div>
  </div>
</template>

<script>
import { post } from '../utils/axios'

export default {
  name: 'comSelectBox',
  props: {
    comSelectBoxConfig: {
      type: Object,
      require: false,
      default: () => {}
    },
    params: { // 参数
      type: Object,
      require: false,
      default: () => {}
    },
    label: {
      type: String,
      require: false,
      default: '班级'
    },
    defaultOption: { // 默认选择的值
      type: Boolean,
      require: false,
      default: false
    },
    required: { // 必填
      type: Boolean,
      require: false,
      default: false
    },
    showReset: { // 显示重置按钮
      type: Boolean,
      require: false,
      default: false
    },
    selectKey: { // 需要绑定的key
      type: String,
      require: false,
      default: ''
    }
  },
  data () {
    return {
      selectValue: undefined,
      selectList: [],
      selectData: []
    }
  },
  created () {
    this.refresh({})
  },
  methods: {
    handleClick () {
      this.$emit('handleClickField')
    },
    handelSelect (id) {
      // eslint-disable-next-line no-unused-vars
      let data = {}
      for (let i = 0, len = this.selectData.length; i < len; i++) {
        if (id === this.selectData[i][this.selectKey || 'id']) {
          data = this.selectData[i]
        }
      }
      this.$emit('selectItem', data)
    },
    getList (params = {}) {
      if (!this.comSelectBoxConfig) return
      const ApiParams = Object.assign(this.comSelectBoxConfig.params || {}, this.params, params)
      post(this.comSelectBoxConfig.api, ApiParams).then((res) => {
        if (res.stateCode === 200 && res.result) {
          this.selectData = res.data.list
          if (this.selectData[0]?.['serviceId']) {
            this.selectData = this.removeArr(this.selectData, 'serviceId')
          }
          for (let i = 0, len = this.selectData.length; i < len; i++) {
            this.selectList.push({
              text: this.selectData[i]?.[this.comSelectBoxConfig?.['textKey'] || 'name'],
              value: this.selectData[i]?.[this.selectKey || 'id']
            })
          }
          if (this.defaultOption) { // 默认值
            this.$emit('selectItem', this.selectData[0])
            this.selectValue = this.selectData[0]?.[this.selectKey || 'id']
          }
        }
      })
    },
    removeArr (list, key) {
      const newObj = {}
      const newList = list.reduce((preVal, curVal) => {
        if (!newObj[curVal[key]]) {
          newObj[curVal[key]] = preVal.push(curVal)
        }
        return preVal
      }, [])
      return newList
    },
    refresh (params) {
      this.selectList = []
      this.getList(params)
    },
    reset () {
      this.selectValue = null
      this.$emit('resetSelection')
    }
  }
}
</script>

<style scoped>
  .from-sex {
    display: flex;
  }
  .clear {
    margin-left: 20px;
    line-height: 40px;
  }
  >>>.van-dropdown-menu__item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    min-width: 2rem;
    width: 2rem;
    cursor: pointer;
  }
  >>>.van-dropdown-menu__bar {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 0.48rem;
    background-color: #fff;
    box-shadow: none;
    text-align: left;
  }
  >>>.van-dropdown-menu__title {
    position: absolute;
    left: 0;
    box-sizing: border-box;
    max-width: 100%;
    padding: 0 0.08rem;
    color: #323233;
    font-size: 0.15rem;
    line-height: 0.22rem;
  }
</style>
