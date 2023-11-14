<template>
  <div class="flex justify-center pt-4">
    <vue3videoPlay
      v-bind="options"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
    />
  </div>
</template>
<script setup>
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css
import { toRefs, reactive } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  }
})
const { src } = toRefs(props)
const options = reactive({
  width: '800px', //播放器高度
  height: '450px', //播放器高度
  color: '#409eff', //主题色
  muted: false, //静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制器
  title: '', //视频名称
  //   src: src.value, //视频源
  src: src.value,
  poster: '' //封面
})
const onPlay = (ev) => {
  console.log('播放')
}
const onPause = (ev) => {
  console.log(ev, '暂停')
}

const onTimeupdate = (ev) => {
  console.log(ev, '时间更新')
}
const onCanplay = (ev) => {
  console.log(ev, '可以播放')
}
function getQueryString(key) {
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var r = window.location.href.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
</script>

<style scoped lang="less">
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.pt-4 {
  padding-top: 12px;
}
</style>
