<template>
    <div class="comSelectTime">
      <van-field
        v-model="selectValue"
        :name="label"
        :label="label"
        :required='required'
        @click="showSelectTime = true"
        :placeholder="'请选择' + label"
        style="font-size: 14px"
        readonly
      />
      <!-- 弹出层 -->
      <van-popup v-model="showSelectTime" closeable position="bottom" :style="{ height: '60%' }">
        <van-datetime-picker
          v-if="type !== 'time'"
          v-model="currentDate"
          :type="type"
          :title="label"
          :minDate='minDate'
          @confirm='confirm'
          @cancel='showSelectTime = false'
        />
        <van-datetime-picker
          v-else
          v-model="currentDate"
          :type="type"
          :title="label"
          @confirm='confirm'
          @cancel='showSelectTime = false'
        />
       </van-popup>
    </div>
</template>
<script>
export default {
  name: 'comSelectTime',
  props: {
    label: {
      type: String,
      required: false,
      default: '选择时间'
    },
    type: {
      type: String,
      required: false,
      default: 'datetime'
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      selectValue: '',
      showSelectTime: false,
      currentDate: '',
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  },
  methods: {
    confirm (value) {
      if (this.type === 'time') this.selectValue = value + ':00'
      if (this.type === 'datetime') this.selectValue = this.util.TimeFormat(value)
      this.showSelectTime = false
    }
  }
}
</script>
<style scoped>
  >>>.van-picker__toolbar {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      height: 0.44rem;
      margin-top: 40px;
  }
</style>
