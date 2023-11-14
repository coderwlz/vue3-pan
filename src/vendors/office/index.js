// import Vue from 'vue';
import OfficeView from './OfficeView.vue'
import { createApp, h } from 'vue'

export default async function renderPdf(buffer, target, file_id) {
  const app = createApp({
    render() {
      return h(OfficeView, { file_id })
    }
  })
  return app.mount(target)
}
