<template>
  <div class="comPullRefresh" :style="{ height: pullRefreshHeight + 'rem'}">
    <van-search
      v-model="selectValue"
      show-action
      :placeholder="'请输入' + (listConfig.selectTitle || '关键字') "
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <div class="comPullRefresh_head" v-if="showHead">
      <div
        v-if="showHead.showAdd"
        @click="handleAdd"
      >
        新增
        <img
          style="position: relative; top: -1px"
          src="../assets/icon/addBtn.png"
          @click="handleAdd"
          width="15"
        > </div>
      <div v-else></div>
      <div v-if="showHead.showDel" @click="schemaTranslation">管理</div>
      <div v-else></div>
    </div>
    <div class="comPullRefresh_List">
      <van-pull-refresh
        v-model="isLoading"
        :style="{ height: pullRefreshHeight + 'rem', overflowY: 'auto' }"
        :head-height="40"
        @refresh="onRefresh"
      >
        <van-list
          v-model="isLoading"
          :finished="finished"
          :offset="1"
          :immediate-check="false"
          :error.sync="error"
          finished-text="已全部加载完成"
          error-text="请求失败，点击重新加载"
          @load="onLoadList"
          v-if="RefreshState"
        >
          <!-- 单选或者多选操作列表 -->
          <van-checkbox-group
            v-if="showType.listStyleType === 'checkout'"
            @change="changeCheckoutItem"
            v-model="result"
            :max="maxSelect"
            class="checkoutList"
            ref="checkboxGroup"
          >
            <van-checkbox
              :name="index" v-for="(item, index) in pullRefreshList"
              :key="item.id"
              style="padding: 0 10px"
            >
              <div class="list-item">
                <div class="img-box" v-if="showHeaderImg">
                  <img
                    v-if="showHeaderImg.key"
                    :src="item[showHeaderImg.key]"
                    :style="{ top: headerImgHeight + 'rem' }"
                    class="item-img"
                    alt=""
                  >
                  <img
                    v-else :src="require(`../assets/icon/${listConfig.icon || 'sericveIcon'}.png`)"
                    :style="{ top: headerImgHeight + 'rem' }"
                    class="item-img"
                    alt=""
                  >
                </div>
                <div @click.stop="clickCheckoutListItem(item)" style="position:relative; left: 10px; padding: 0.1rem 0; text-align: left">
                  <div
                    class="hiddenText"
                    :style="{ width: (showHeaderImg && showDetail) ? '2.1rem' : '2.4rem' }"
                    v-for="(formatItem) in showTextFormat" :key="formatItem.key"
                  >
                    {{ formatItem.title }}
                    <span
                      v-if="
                      Object.prototype.toString.call(formatItem) === '[object Object]' &&
                      (formatItem.key !== 'classesName' &&
                      !formatItem.transformValue)"
                    >
                      {{ formatItem.interior ? (item[formatItem.key] ? item[formatItem.key][formatItem.interior] : item[formatItem.key]) : item[formatItem.key] }}
                    </span>
                    <span v-else-if="formatItem.key === 'classesName'"> <!-- 假设需要显示一个数组里面的内容 这里可以做进一步可以配置化 -->
                      {{ item['countDownWithClass'].length ?
                         item['countDownWithClass'].reduce((pre, cur) => { return pre += cur.classesName + ' / ' }, '') :
                         item[formatItem.key]
                      }}
                    </span>
                    <span v-else-if="formatItem.transformValue">
                      {{ formatItem[item[formatItem.key]] }}
                    </span>
                    <span v-else>{{ item[formatItem] }} </span>
                  </div>
                </div>
                <van-divider />
                <div v-if="showDetail" style="width: 0.8rem; font-size: 14px; padding-top: 15px">
                  <span @click.stop="handleClickDetails(item)">
                    详情
                    <van-icon name="arrow" style="position: relative; top: 2px" />
                  </span>
                </div>
              </div>
            </van-checkbox>
          </van-checkbox-group>
          <!-- 默认 -->
          <div v-if="showType.listStyleType === 'default'" class="defaultList">
            <div v-for="(item, index) in pullRefreshList"
              @click="defaultChangeItem(item)"
              style="padding: 0 10px"
              class="list-item"
              :key="index"
            >
              <div class="img-box" v-if="showHeaderImg">
                <img
                  v-if="showHeaderImg.key"
                  :src="item[showHeaderImg.key]"
                  :style="{ top: headerImgHeight + 'rem' }"
                  class="item-img"
                  alt=""
                >
                <img
                  v-else :src="require(`../assets/icon/${listConfig.icon || 'sericveIcon'}.png`)"
                  :style="{ top: headerImgHeight + 'rem' }"
                  class="item-img"
                  alt=""
                >
              </div>
              <div style="position:relative; left: 4px; padding: 0.1rem 0; text-align: left">
                <div v-if="Object.prototype.toString.call(showTextFormat[0]) === '[object Object]'">
                  <p
                    class="hiddenText"
                    :style="{ width: (showHeaderImg && showDetail) ? '2.1rem' : '2.6rem' }"
                    v-for="(formatItem) in showTextFormat"
                    :key="formatItem.key"
                  >
                    {{ formatItem.title }}
                    <span v-if="!formatItem.transformValue && formatItem.key !== 'classesName'">
                      {{
                        formatItem.interior ?
                        (item[formatItem.key] ? item[formatItem.key][formatItem.interior] : item[formatItem.key]) :
                        item[formatItem.key]
                      }}
                    </span>
                    <span v-if="formatItem.key === 'classesName'">
                      {{ item['countDownWithClass'].length ?
                         item['countDownWithClass'].reduce((pre, cur) => { return pre += cur.classesName + ' / ' }, '') :
                         item[formatItem.key]
                      }}
                    </span>
                    <span v-if="formatItem.transformValue">
                      {{ formatItem[item[formatItem.key]] }}
                    </span>
                    <span v-else>{{ item[formatItem] }} </span>
                  </p>
                </div>
                <div v-else class="hiddenText" v-for="(key) in showTextFormat" :key="key">{{ item[key] }}</div>
              </div>
              <van-divider />
              <div v-if="showDetail" style="width: 0.8rem; font-size: 14px; padding-top: 15px">
                <span @click.stop="handleClickDetails(item)">
                  详情
                  <van-icon name="arrow" style="position: relative; top: 2px" />
                </span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div
      v-if="showHead.showDel"
      v-show="showType.listStyleType === 'checkout'"
      class="comPullRefresh_bottom"
      :style="{ bottom: footerBottom + 'px' }"
    >
      <van-radio-group v-model="isCheckAll" style="margin-top: 11px">
        <van-radio v-if="!isCheckAll" :name="true">全选</van-radio>
        <van-radio v-else :name="false">取消全选</van-radio>
      </van-radio-group>
      <slot name="button"> <van-button round @click="selectDelete" type="danger">删除</van-button> </slot>
    </div>
    <!-- 新增修改弹窗 -->
    <van-popup
      v-model="showPopup"
      closeable
      @close="clearData('insert')"
      position="bottom"
      :style="{ height: listConfig.insertPopupHeight }"
    >
      <div v-for="(item, index) in popupList" :key="index">
        <comSelectBox
          v-if="item.comType === 'comSelectBox' && item.interfaceObj"
          :required="item.required"
          :label="item.label"
          :ref="item.refName"
          :interface-obj="item.interfaceObj"
          :key="item.refName"
        />
        <comSelectBox
          v-else-if="item.comType === 'comSelectBox' && item.selectList"
          :required="item.required"
          :label="item.label"
          :ref="item.refName"
          :key="item.refName"
        />
        <comSelectTime
          v-else-if="item.comType === 'comSelectTime'"
          :type="item.type"
          :required="item.required"
          :ref="item.refName"
          :key="item.refName"
        />
        <van-field
          v-else-if="item.comType === 'field'"
          v-model="fieldParams[item.key]"
          :required="item.required"
          :name="item.label"
          :label="item.label"
          :placeholder="item.placeholder"
          :key="item.key"
        />
        <van-field
          v-else-if="item.comType === 'textarea'"
          v-model="fieldParams[item.key]"
          rows="2"
          autosize
          :label="item.label"
          type="textarea"
          :placeholder="item.placeholder"
          style="font-size: 14px"
          :required="item.required"
          :key="item.key"
        />
        <div style="position: fixed; bottom: 10px;padding: 0 1rem; width: 100%;">
          <van-button style="width: 100%" @click="insertData" round type="info">新增</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 修改弹窗 -->
    <van-popup
      v-model="showUpdatePopup"
      closeable
      position="bottom"
      @close="clearData('change')"
      :style="{ height: listConfig.insertPopupHeight }"
    >
      <div v-for="(item, index) in changePopupList" :key="index">
        <comSelectBox
          v-if="item.comType === 'comSelectBox' && item.interfaceObj"
          :required="item.required"
          :label="item.label"
          :ref="'change' + item.refName"
          :comSelectBoxConfig="item.interfaceObj"
          :params="item.params"
          :selectKey="item.selectKey"
          :key="'change' + item.refName"
        />
        <comSelectBox
          v-else-if="item.comType === 'comSelectBox' && item.selectList"
          :required="item.required"
          :label="item.label"
          :ref="'change' + item.refName"
          :params="item.params"
          :key="'change' + item.refName"
        />
        <comSelectTime
          v-else-if="item.comType === 'comSelectTime'"
          :type="item.type"
          :required="item.required"
          :ref="'change' + item.refName"
          :key="'change' + item.refName"
        />
        <van-field
          v-else-if="item.comType === 'field'"
          v-model="changeFieldParams[item.key]"
          :required="item.required"
          :name="item.label"
          :label="item.label"
          :placeholder="item.placeholder"
          :key="'change' + item.key"
        />
        <van-field
          v-else-if="item.comType === 'textarea'"
          v-model="changeFieldParams[item.key]"
          rows="2"
          autosize
          :label="item.label"
          type="textarea"
          :placeholder="item.placeholder"
          style="font-size: 14px"
          :required="item.required"
          :key="'change' + item.key"
        />
        <div style="position: fixed; bottom: 10px;padding: 0 1rem; width: 100%;">
          <van-button style="width: 100%" @click="changeData" round type="info">修改</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { post, get } from '../utils/axios'
import config from '../config'
import { deleteList as batchDel } from '../utils/batchRemove'
import comSelectBox from './comSelectBox'
import comSelectTime from './comSelectTime'
export default {
  name: 'comList',
  components: {
    comSelectBox,
    comSelectTime
  },
  props: {
    listConfig: { // 接口参数 api 接口地址 请求类型 (GET POST) params 接口参数 interfaceObj
      type: Object,
      require: false,
      default: () => {}
    },
    popupList: {
      type: Array,
      require: true
    },
    changePopupList: {
      type: Array,
      require: true
    },
    deleteFormat: { // 删除的格式
      type: Object,
      require: false,
      default: () => {}
    },
    params: { // 参数
      type: Object,
      require: false,
      default: () => {}
    },
    showType: { // 是否需要复选框，单选或者多选 { type: 'checkout', type: 'MultipleChoice(单选) / multipleChoice(多选)' }
      type: Object,
      require: false,
      default: () => {}
    },
    showTextFormat: { // 渲染的数据key ['keyName1', 'keyName2, ...] 也可以传对象
      type: Array,
      require: false,
      default: () => []
    },
    headerImgHeight: {
      type: Number,
      require: false,
      default: 0.2
    },
    showHeaderImg: {
      type: Boolean,
      require: false,
      default: true
    },
    showDetail: {
      type: Boolean,
      require: false,
      default: false
    },
    showHead: {
      type: Object,
      require: false,
      default: () => {}
    },
    pullRefreshHeight: {
      type: Number,
      require: false,
      default: 5.5
    },
    footerBottom: {
      type: Number,
      require: false,
      default: 0
    }
  },
  watch: {
    isCheckAll (newV) {
      if (newV) {
        this.unCheckAll()
      } else {
        this.checkAll()
      }
    }
  },
  data () {
    return {
      baseUrl: config.baseUrl,
      pullRefreshList: [],
      selectData: [],
      delList: [],
      fieldParams: {},
      changeFieldParams: {},
      showUpdatePopup: false,
      showPopup: false,
      isLoading: false,
      finished: false,
      error: false,
      RefreshState: true,
      result: [],
      pageSize: 10,
      pageNum: 1,
      maxSelect: 0,
      isCheckAll: false,
      selectValue: ''
    }
  },
  methods: {
    insertData () {
      for (let i = 0, len = this.popupList.length; i < len; i++) {
        const item = this.popupList[i]
        if (item.required) { // 校验是否必填选项
          if (item.comType !== 'field' && item.comType !== 'textarea') { // 区分是选择器组件还是输入框类型
            if (this.$refs[item.refName][0].selectValue === undefined) return this.$toast.fail(item.errPlaceholder || '请选择' + item.label)
          } else {
            if (!this.fieldParams[item.key]?.trim()) return this.$toast.fail(item.errPlaceholder || item.placeholder)
          }
        }
      }
      // 处理参数
      const params = {
        ...this.fieldParams
      }
      this.popupList.forEach((item) => {
        if (item.comType !== 'field' && item.comType !== 'textarea') {
          params[item.key] = this.$refs[item.refName][0].selectValue
        }
      })
      this.listConfig.insertRequestFn(params).then((res) => {
        if (res.stateCode === 200 && res.result) {
          this.$toast.success('操作成功')
          this.onRefresh() // 刷新列表
          // 清除数据
          this.clearData('insert')
        } else {
          this.$toast.fail(res.message)
        }
      })
    },
    changeData () {
      for (let i = 0, len = this.changePopupList.length; i < len; i++) {
        const item = this.changePopupList[i]
        if (item.required) { // 校验是否必填选项
          if (item.comType !== 'field' && item.comType !== 'textarea') { // 区分是选择器组件还是输入框类型
            if (!this.$refs['change' + item.refName][0].selectValue === undefined) return this.$toast.fail(item.errPlaceholder || '请选择' + item.label)
          } else {
            if (!this.changeFieldParams[item.key]?.trim()) return this.$toast.fail(item.errPlaceholder || item.placeholder)
          }
        }
      }
      // 处理参数
      const params = {
        ...this.changeFieldParams
      }
      this.changePopupList.forEach((item) => {
        if (item.comType !== 'field' && item.comType !== 'textarea') {
          params[item.key] = this.$refs['change' + item.refName][0].selectValue
        }
      })
      this.listConfig.changeRequestFn(params).then((res) => {
        if (res.stateCode === 200 && res.result) {
          this.$toast.success('操作成功')
          this.onRefresh() // 刷新列表
          // 清除数据
          this.clearData('change')
        } else {
          this.$toast.fail(res.message)
        }
      })
    },
    clearData (type) {
      // 清除数据
      if (type === 'insert') {
        for (const key in this.fieldParams) this.fieldParams[key] = ''
        this.popupList.forEach((item) => {
          if (item.comType !== 'field' && item.comType !== 'textarea') {
            this.$refs[item.refName][0].selectValue = undefined
          }
        })
      } else {
        for (const key in this.changeFieldParams) this.changeFieldParams[key] = ''
        this.changePopupList.forEach((item) => {
          if (item.comType !== 'field' && item.comType !== 'textarea') {
            this.$refs['change' + item.refName][0].selectValue = undefined
          }
        })
      }
    },
    onLoadList () {
      this.pageNum++
      this.getList(false)
      this.isLoading = false
    },
    onRefresh (params) {
      this.result = []
      this.pageNum = 1
      this.getList(true, params)
      this.isLoading = false
    },
    onSearch () {
      if (this.selectValue) this.onRefresh({ [this.listConfig.selectKey]: this.selectValue })
      else this.onRefresh()
    },
    getList (isRefresh, params) {
      this.$loading.show()
      new Promise((resolve, reject) => {
        if (this.listConfig.reqestType === 'POST') {
          resolve(post)
        } else {
          resolve(get)
        }
      }).then((request) => {
        request(this.listConfig.api, {
          ...this.listConfig.params, // 请求参数
          ...params,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }).then((res) => {
          if (isRefresh) {
            this.pullRefreshList = res.data.list
          } else {
            this.pullRefreshList = this.pullRefreshList.concat(res.data.list)
          }
          // 判断是否单选
          if (this.showType.astrict === 'pluralChoice') { // 多选
            this.maxSelect = 0 // 允许多选
          } else {
            this.maxSelect = 1 // 单选
          }
          if (res.data.list.length < this.pageSize) {
            this.finished = true
          }
        })
      })
      this.$loading.hide()
    },
    changeCheckoutItem (indexArr) {
      this.delList = []
      indexArr.forEach((index) => {
        this.delList.push(this.pullRefreshList[index])
      })
      // this.$emit('changeCheckoutItem', dataArr)
    },
    defaultChangeItem (data) {
      this.$emit('defaultChangeItem', data)
    },
    clickCheckoutListItem (data) {
      this.selectData = data
      this.$emit('clickCheckoutListItem', data)
    },
    handleClickDetails (data) { // 点击详情修改信息
      if (this.changePopupList.length) {
        this.showUpdatePopup = true
        this.$nextTick(() => {
          this.changePopupList.forEach((item) => {
            if (item.comType === 'comSelectBox') {
              if (!this.$refs['change' + item.refName][0].selectList.length) this.$refs['change' + item.refName][0].selectList = item.selectList
              this.$refs['change' + item.refName][0].selectValue = data[item.key]
            } else if (item.comType === 'comSelectTime') {
              this.$refs['change' + item.refName][0].selectValue = data[item.key]
            } else {
              this.$set(this.changeFieldParams, [item.key], data[item.key])
            }
          })
        })
      } else {
        this.$emit('clickListItemDetail', data)
      }
    },
    handleAdd () {
      if (this.popupList.length) {
        this.showPopup = true
        this.$nextTick(() => {
          this.popupList.forEach((item) => {
            if (item.comType === 'comSelectBox' && !item.interfaceObj && !this.$refs[item.refName]?.selectList?.length) {
              this.$refs[item.refName][0].selectList = item.selectList
              // ?? 只会判断 null undefined
              if (item.selectDefaultValue ?? undefined) this.$refs[item.refName][0].selectValue = item
            }
          })
        })
      } else { // 总会有些特殊的界面，所以说还是需要说提供别的解决方案
        this.$emit('handleAdd')
      }
    },
    schemaTranslation () { // 转换模式
      if (this.showType.listStyleType === 'checkout') {
        this.$refs.checkboxGroup.toggleAll(false)
        this.showType.listStyleType = 'default'
      } else {
        this.showType.listStyleType = 'checkout'
      }
      // this.$emit('clickMore')
    },
    selectDelete () {
      const defaultDelFormat = {
        requestFn: () => {},
        state: true, // 刷新动画
        deleteKey: 'id',
        apiType: undefined,
        unselectedPlaceholder: '请先选择',
        successPlaceholder: '操作成功',
        errorPlaceholder: '操作失败'
      }
      if (this.delList.length === 0) return this.$toast.fail(this.deleteFormat.unselectedPlaceholder || defaultDelFormat.unselectedPlaceholder)
      batchDel(
        this.delList,
        this.deleteFormat.requestFn,
        () => { this.$toast.success(this.deleteFormat.successPlaceholder || defaultDelFormat.successPlaceholder); this.onRefresh(this.deleteFormat?.state || true) },
        () => { this.$toast.fail(this.deleteFormat.errorPlaceholder || defaultDelFormat.errorPlaceholder) },
        this.deleteFormat.deleteKey || defaultDelFormat.deleteKey,
        this.deleteFormat.apiType || defaultDelFormat.apiType
      )
    },
    checkAll () { // 全选
      this.$refs.checkboxGroup.toggleAll(false)
    },
    unCheckAll () { // 取消全选
      this.$refs.checkboxGroup.toggleAll()
    }
  }
}
</script>

<style lang="less" scoped>
  .comPullRefresh {
    width: 100%;
    .comPullRefresh_head {
      padding: 5px 12px 5px 12px;
      display: flex;
      justify-content: space-between;
    }
    .comPullRefresh_List {
      .checkoutList {
        .list-item {
          display: flex;
          margin-bottom: 0.03rem;
          background: #FFFFFF;
          .img-box {
            position: relative;
            width: 0.4rem;
            .item-img {
              display: block;
              position: absolute;
              border-radius: 50%;
              top: 0.2rem;
              width: 0.4rem;
              height: 0.4rem;
            }
          }
          .item-rightBox {
            position: relative;
            right: 30px;
            top: 10px;
            width: 0.5rem;
          }
          .hiddenText {
            width: 2.6rem;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            height: 0.2rem;
            color: #333333;
          }
        }
      }
    }
    .defaultList {
      .list-item {
        display: flex;
        margin-bottom: 0.03rem;
        min-height: 0.8rem;
        background: #FFFFFF;
        .img-box {
          position: relative;
          width: 0.7rem;
          .item-img {
            display: block;
            position: absolute;
            top: 0.2rem;
            left: 16px;
            width: 0.4rem;
            height: 0.4rem;
          }
        }
      }
    }
    .comPullRefresh_bottom {
      position: fixed;
      bottom: 0px;
      padding: 5px 12px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      background: #FFFFFF;
    }
    .hiddenText {
      width: 2.6rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      height: 0.2rem;
      color: #333333;
    }
  }
  /deep/ .van-list {
    padding-bottom: 100px;
  }
</style>
