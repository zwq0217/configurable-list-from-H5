<template>
  <comList
    ref="comList"
    :list-config="comListConfig"
    :showType="showType"
    :showTextFormat="showTextFormat"
    :showHead="showHead"
    :deleteFormat="deleteFormat"
    :popupList="popupList"
    :changePopupList="changePopupList"
    showDetail
    :headerImgHeight="0.3"
    :footerBottom="50"
  />
</template>

<script>
import comList from '../components/comList'
import { httpDeleteListById, changeRequestFn, insertRequestFn } from '../api/user'

export default {
  name: 'comListTest',
  components: {
    comList
  },
  data () {
    return {
      comListConfig: { // 列表配置
        selectTitle: '前端语言', // 搜索框搜索的值
        selectKey: 'lang', // 搜索框搜索的值对应的接口key
        reqestType: 'POST', // 列表数据请求的方式
        api: 'http://localhost:8099/testList', // 接口地址
        params: { // 接口默认参数
          name: 'jen'
        },
        icon: undefined, // 先后图标,
        insertPopupHeight: '60%', // 新增 修改 弹窗高度 百分百
        insertRequestFn: insertRequestFn, // 新增接口
        changeRequestFn: changeRequestFn // 修改接口
      },
      showType: { // 是否需要复选框，单选或者多选 { listStyleType: 'checkout', astrict(约束): 'MultipleChoice(单选) / multipleChoice(多选)' }
        listStyleType: 'default',
        astrict: 'multipleChoice'
      },
      showTextFormat: [ // 可以是数组 ['name','position','hireDate', 'status ]
        {
          key: 'name',
          title: '姓名: '
        },
        {
          transformValue: true, // 是否需要将数子转换为中文
          key: 'position',
          title: '职位: ',
          1: '前端程序员',
          2: '后端程序员',
          3: '技术总监'
        },
        {
          key: 'hireDate',
          title: '入职时间: '
        },
        {
          transformValue: true, // 是否需要将数子转换为中文
          key: 'status',
          title: '在职状态: ',
          0: '离职',
          1: '在职'
        }
      ],
      showHead: { // 列表数据头部按钮
        showAdd: true,
        showDel: true
      },
      deleteFormat: { // 删除格式
        requestFn: httpDeleteListById, // 接口函数
        state: true, // 刷新动画
        deleteKey: 'id', // 刷新的key
        apiType: 'formData', // 删除的传参类型
        unselectedPlaceholder: '请先选择',
        successPlaceholder: '操作成功',
        errorPlaceholder: '操作失败'
      },
      popupList: [ // 新增弹窗元素
        {
          key: 'name', // key
          required: true, // 是否必填
          label: '姓名', // label
          placeholder: '请输入姓名', // 提示语
          comType: 'field' // 元素类型
        },
        {
          key: 'position',
          required: true, // 是否必填
          label: '职位',
          comType: 'comSelectBox',
          refName: 'selectPosition',
          interfaceObj: null, // 可以传入对应接口
          selectList: [ // 简单模拟一下后端数据
            {
              value: 1,
              text: '前端程序员'
            },
            {
              value: 2,
              text: '后端程序员'
            },
            {
              value: 3,
              text: '技术总监'
            }
          ]
        },
        {
          key: 'hireDate',
          required: true, // 是否必填
          label: '入职时间',
          comType: 'comSelectTime',
          refName: 'selectHireDate'
        },
        {
          key: 'status',
          required: true, // 是否必填
          label: '状态',
          comType: 'comSelectBox',
          refName: 'selectStatus',
          interfaceObj: null, // 可以传入对应接口
          defaultOption: 1,
          selectList: [ // 简单模拟一下后端数据
            {
              value: 0,
              text: '离职'
            },
            {
              value: 1,
              text: '在职'
            }
          ]
        }
      ],
      changePopupList: [ // 新增弹窗元素
        {
          key: 'name', // key
          required: true, // 是否必填
          label: '姓名', // label
          placeholder: '请输入姓名', // 提示语
          comType: 'field' // 元素类型
        },
        {
          key: 'position',
          required: true, // 是否必填
          label: '职位',
          comType: 'comSelectBox',
          refName: 'selectPosition',
          interfaceObj: null, // 可以传入对应接口
          selectList: [ // 简单模拟一下后端数据
            {
              value: 1,
              text: '前端程序员'
            },
            {
              value: 2,
              text: '后端程序员'
            },
            {
              value: 3,
              text: '技术总监'
            }
          ]
        },
        {
          key: 'hireDate',
          required: true, // 是否必填
          label: '入职时间',
          comType: 'comSelectTime',
          refName: 'selectHireDate'
        },
        {
          key: 'status',
          required: true, // 是否必填
          label: '状态',
          comType: 'comSelectBox',
          refName: 'selectStatus',
          interfaceObj: null, // 可以传入对应接口
          defaultOption: 1,
          selectList: [ // 简单模拟一下后端数据
            {
              value: 0,
              text: '离职'
            },
            {
              value: 1,
              text: '在职'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.$refs.comList.onRefresh() // 用的是本地接口的， 所以是没数据的，所以这里收到添加几条数据方便测试
    this.$refs.comList.pullRefreshList = [
      {
        id: 1,
        name: 'jen',
        position: 1,
        hireDate: '2020-10-26',
        status: 0 // 0: 已离职 1: 在职
      },
      {
        id: 2,
        name: '张三',
        position: 1,
        hireDate: '2020-10-27',
        status: 1 // 0: 已离职 1: 在职
      },
      {
        id: 3,
        name: '李四',
        position: 2,
        hireDate: '2020-10-27',
        status: 1 // 0: 已离职 1: 在职
      },
      {
        id: 4,
        name: '王五',
        position: 2,
        hireDate: '2020-10-27',
        status: 1 // 0: 已离职 1: 在职
      }
    ]
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
