// import Vue from 'vue';
import OfficeView from './OfficeView.vue'
import { createApp, h } from 'vue'

export default async function renderPdf(buffer, target) {
  const app = createApp({
    render() {
      return h(OfficeView)
    }
  })
  return app.mount(target)
}
