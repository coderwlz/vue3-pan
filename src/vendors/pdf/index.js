// import Vue from 'vue';
import PdfView from './PdfView.vue'
import { createApp, h } from 'vue'

export default async function renderPdf(buffer, target) {
  // return new Vue({
  //   render: h => h(PdfView, { props: { data: buffer } }),
  // }).$mount(target)
  const app = createApp({
    render() {
      return h(PdfView, { data: buffer })
    }
  })
  return app.mount(target)
}
