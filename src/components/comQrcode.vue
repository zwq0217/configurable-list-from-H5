<template>
  <div :id="id"></div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'comQrcode',
  data () {
    return {
      id: ''
    }
  },
  created () {
    this.id = String(Date.now() * Math.random())
  },
  methods: {
    // 创建二维码
    createCode ({ url, width, height, colorDark = '#000', colorLight = '#fff' }) {
      document.getElementById(this.id).innerHTML = ''
      // eslint-disable-next-line no-new
      new QRCode(this.id, {
        width: width,
        height: height,
        text: url, // 二维码地址
        colorDark: colorDark,
        colorLight: colorLight
      })
    }
  }
}
</script>
