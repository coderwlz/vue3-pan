import VideoView from './VideoView.vue'
import { createApp, h } from 'vue'
/**
 * 渲染mp4
 */
export default async function (buffer, target) {
  const app = createApp({
    render() {
      return h(VideoView, { src: URL.createObjectURL(new Blob([buffer])) })
    }
  })
  return app.mount(target)
}
