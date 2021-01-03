<template>
  <div>
    <van-field
      readonly
      clickable
      :border="false"
      name="area"
      :value="value"
      label="地区选择"
      placeholder="点击选择省市区"
      @click="showArea = true"
      :required="required"
      style="font-size: 14px"
    />
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script>
import AreaList from '../assets/js/area'
export default {
  name: '',
  data () {
    return {
      showArea: false,
      value: '',
      locationParams: {},
      areaList: AreaList
    }
  },
  props: {
    label: {
      type: String,
      required: false,
      default: '详细地址'
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onConfirm (values) {
      this.value = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join('/')
      this.locationParams = {
        provice: values[0].name,
        city: values[1].name,
        district: values[2].name
      }
      this.showArea = false
    }
  }
}
</script>

<style>
</style>
