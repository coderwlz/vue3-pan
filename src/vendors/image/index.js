// import Vue from 'vue';
import { createApp, h } from 'vue'
import ImageViewer from './ImageViewer.vue'
import { readDataURL } from '@/components/onlinefile/util.js'

/**
 * 图片渲染
 */
export default async function renderImage(buffer, target) {
  const url = await readDataURL(buffer)
  const app = createApp({
    render() {
      return h(ImageViewer, { image: url })
    }
  })
  return app.mount(target)
}
