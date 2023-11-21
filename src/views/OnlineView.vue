<template>
  <div :class="{ hidden }" class="edit">
    <div class="p-header">
      <div class="header-left" :title="route.query.filename">
        <img src="/src/assets/icons/logo.svg" alt="" @click="openHome" />{{
          route.query.filename
        }}
      </div>
      <div class="header-content"></div>
      <div class="header-right"></div>
    </div>

    <div class="containers w-full" id="npg">
      <div v-show="loading" class="well loading">
        {{ '正在加载' }}
      </div>
      <div v-show="!loading" class="well" ref="output">
        <div v-if="errTxt" class="text-xl pt-5 text-red-600 text-center">
          {{ errTxt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getExtend, readBuffer, render } from '@/components/onlinefile/util.js'
import { onMounted, ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { api } from '@/service/service.js'
import { useFileStore } from '@/stores/file'

const fileStore = useFileStore()

const router = useRouter()
const route = useRoute()

const openHome = () => {
  router.push('/home')
}

defineProps({
  msg: {
    type: String
  }
})
const { proxy } = getCurrentInstance()
const loading = ref(false) // 加载状态跟踪
const last = ref(null) // 上个渲染实例
const hidden = ref(false) // 隐藏头部，当基于消息机制渲染，将隐藏
const output = ref()
const errTxt = ref('')
let img = ['gif', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'png', 'svg']
let txt = [
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
]
let pdf = ['pdf']
let xlsx = ['xls', 'xlsx', 'csv']
let ppt = ['pptx', 'ppt']
let docx = ['doc', 'docx']
const options = ref({})

let flag = ref(false)
// 初始化获取 数据操作
const getContent = async (id) => {
  const name = route.query.filename
  const extend = name && getExtend(name)

  if (xlsx.includes(extend) || ppt.includes(extend) || docx.includes(extend)) {
    loading.value = true
    flag.value = true
  } else if (id) {
    if (extend == 'mp4') {
      displayResult()
      return
    }
    loading.value = true
    let data = await fileStore.getFileContent(id)
    handleChange(data)
    loading.value = false
  }
}

onMounted(async () => {
  await getContent(route.query.file_id)

  // 判断是否是office三件套
  if (flag.value) {
    setOfficeView()
      .then(() => {
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }
})

// 挂载office渲染组件
const setOfficeView = async () => {
  const name = route.query.filename
  const extend = getExtend(name)
  const node = document.createElement('div')
  node.style.height = '100%'
  // 添加孩子，防止vue实例替换dom元素
  if (last.value) {
    output.value.removeChild(output.value.firstElementChild)
    last.value.$.appContext.app.unmount()
  }
  const child = output.value.appendChild(node)
  return new Promise((resolve, reject) =>
    render(undefined, extend, child, route.query.file_id)
      .then(resolve)
      .catch(reject)
  )
}

const handleChange = async (e) => {
  loading.value = true
  try {
    // const [file] = e.target.files
    const arrayBuffer = await readBuffer(e)
    last.value = await displayResult(arrayBuffer)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const displayResult = (buffer) => {
  // 取得文件名
  const name = route.query.filename
  // 取得扩展名
  const extend = getExtend(name)
  // 输出目的地
  // const { output } = proxy.$refs
  // 生成新的dom
  const node = document.createElement('div')
  // 添加孩子，防止vue实例替换dom元素
  node.style.height = '100%'
  if (last.value) {
    output.value.removeChild(output.value.firstElementChild)
    last.value.$.appContext.app.unmount()
  }
  const child = output.value.appendChild(node)
  // 调用渲染方法进行渲染
  return new Promise((resolve, reject) =>
    render(buffer, extend, child, route.query.file_id)
      .then(resolve)
      .catch(reject)
  )
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.banner {
  overflow: auto;
  text-align: center;
  /* background-color: #12b6ff; */
  color: #000;
}

.hidden .banner {
  display: none;
}

.hidden .well {
  height: calc(100vh - 12px);
}

.file-selects {
  position: absolute;
  left: 5%;
  top: 17px;
  margin-left: 20px;
}

.banner h1 {
  font-size: 20px;
  line-height: 2;
  margin: 0.5em 0;
}

.well {
  display: block;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  margin: 5px;
  height: calc(100vh - 70px);
  overflow: auto;
  & > div {
    height: 100%;
  }
}

.loading {
  text-align: center;
  padding-top: 50px;
}

.messages .warning {
  color: #cc6600;
}

.p-header {
  height: 56px;
  box-shadow: -7px 3px 10px 0 rgba(0, 0, 0, 0.06);
  padding-left: 24px;
  padding-right: 28px;
  position: relative;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  font-size: 18px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  cursor: pointer;
  img {
    width: 35px;
    margin-right: 8px;
    cursor: pointer;
  }
}
</style>

<style>
.pptx-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
