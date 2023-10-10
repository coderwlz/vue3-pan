<template>
  <viewer :images="images">
    <img
      v-for="item in images"
      :key="item.index"
      alt="图片"
      :src="item.src"
      class="image"
    />
  </viewer>
</template>

<script>
import { component as Viewer } from 'v-viewer'
import { getExtend } from '@/components/onlinefile/util.js'

export default {
  name: 'ImageViewer',
  components: { Viewer },
  props: {
    image: String
  },
  computed: {
    images() {
      const name = getQueryString('filename')
      const extend = name && getExtend(name)
      console.log('extend', extend, this.image)
      if (extend == 'svg') {
        console.log('---------------------')
        const byteCharacters = atob(this.image.split(',')[1])
        const blob = new Blob([byteCharacters], { type: 'image/svg+xml' })
        const fileURL = URL.createObjectURL(blob)
        return [{ src: fileURL }]
      }
      return this.image ? [{ src: this.image }] : []
    }
  }
}
function getQueryString(key) {
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var r = window.location.href.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
</script>

<style scoped>
.image {
  display: block;
  width: auto;
  height: 100%;
  max-height: calc(100vh - 100px);
  margin: 0 auto;
}
</style>
