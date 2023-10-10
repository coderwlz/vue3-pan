import { readText } from '@/components/onlinefile/util.js'
// import Vue from 'vue';
import CodeViewer from './CodeViewer.vue'
import { createApp, h } from 'vue'

/**
 * 渲染文本
 * @param buffer 文本二进制内容
 * @param target 目标
 */
export default async function renderText(buffer, target) {
  const text = await readText(buffer)
  // return new Vue({
  //   render: h => h(CodeViewer, { props: { value: text } })
  // }).$mount(target)
  const app = createApp({
    render() {
      return h(CodeViewer, { value: text })
    }
  })
  return app.mount(target)
}
