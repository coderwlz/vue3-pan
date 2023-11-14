import VideoView from './VideoView.vue'
import { createApp, h } from 'vue'
/**
 * 渲染mp4
 */
export default async function (buffer, target, file_id) {
  const src = `/w/api/content?id=${file_id}`
  const app = createApp({
    render() {
      return h(VideoView, { src })
    }
  })
  return app.mount(target)
}
