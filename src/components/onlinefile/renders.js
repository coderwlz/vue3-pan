// import { defaultOptions, renderAsync } from "docx-preview";
// import renderPptx from "@/vendors/pptx";
// import renderSheet from "@/vendors/xlsx";
import renderPdf from '@/vendors/pdf'
import renderImage from '@/vendors/image/index.js'
import renderText from '@/vendors/text'
import renderOffice from '@/vendors/office'
import renderMp4 from '@/vendors/mp4'

// 假装构造一个vue的包装，让上层统一处理销毁和替换节点
const VueWrapper = (el) => ({
  $el: el,
  $destroy() {
    // 什么也不需要 nothing to do
  }
})

const handlers = [
  // 办公三件套
  {
    accepts: ['xls', 'xlsx', 'csv', 'pptx', 'ppt', 'doc', 'docx'],
    handler: async (buffer, target) => {
      return renderOffice(buffer, target)
    }
  },
  // 图片过滤器
  {
    accepts: ['gif', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'png', 'svg'],
    handler: async (buffer, target) => {
      return renderImage(buffer, target)
    }
  },
  // 使用pdfjs，渲染pdf，效果最好
  {
    accepts: ['pdf'],
    handler: async (buffer, target) => {
      return renderPdf(buffer, target)
    }
  },
  // 使用mp4
  {
    accepts: ['mp4'],
    handler: async (buffer, target) => {
      return renderMp4(buffer, target)
    }
  },
  // 纯文本预览
  {
    accepts: [
      'txt',
      'json',
      'js',
      'css',
      'java',
      'py',
      'html',
      'jsx',
      'ts',
      'tsx',
      'xml',
      'md',
      'log'
    ],
    handler: async (buffer, target) => {
      return renderText(buffer, target)
    }
  },
  // 错误处理
  {
    accepts: ['error'],
    handler: async (buffer, target, type) => {
      target.innerHTML = `<div style="text-align: center; margin-top: 80px">不支持.${type}格式的在线预览，请下载后预览或转换为支持的格式</div>
<div style="text-align: center">支持docx, xlsx, pptx, pdf, 以及纯文本格式和各种图片格式的在线预览</div>`
      return VueWrapper(target)
    }
  }
]

// 匹配
export default handlers.reduce((result, { accepts, handler }) => {
  accepts.forEach((type) => (result[type] = handler))
  return result
}, {})
