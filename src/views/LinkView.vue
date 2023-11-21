<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getLinkInfo, closeShareLink } from '@/service/modules/link'
import { sizeTostr, timestampToTime, getFileSuffix } from '@/utils'
import { getExtend, readBuffer, render } from '@/components/onlinefile/util.js'
import { useFileStore } from '@/stores/file'
import noneView from '@/components/home/none.vue'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import fileAction from '@/components/link/file-action.vue'
import { useFileList } from '@/hooks/useFileList'

const { $message } = useCurrentInstance()
const fileStore = useFileStore()

const router = useRouter()
const route = useRoute()
const openHome = () => {
  router.push('/home')
}

const isOk = ref(true)
const key = ref(route.params.key || '')
const pwd = ref(
  route.query.pwd || localStorage.getItem('route.params.key') || ''
)

const info = ref()
const list = ref<any>([])
const bodyInfo = ref()
const init = async () => {
  const data = await getLinkInfo(key.value as string, pwd.value as string)

  if (data.code === 200) {
    isOk.value = true
    info.value = data.data
    cId.value = info.value?.linkInfo?.file_id
  } else {
    isOk.value = false
  }
  if (info.value?.file?.is_dir != 1) {
    await getContent(info.value?.linkInfo?.file_id, info.value?.linkInfo?.name)

    // 判断是否是office三件套
    if (flag.value) {
      setOfficeView(info.value.linkInfo?.name)
        .then(() => {
          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }
  } else {
    bodyInfo.value = useFileList({
      item: info.value.file
    })
  }
}
init()

const output = ref()
const last = ref<any>(null) // 上个渲染实例
const loading = ref(false) // 加载状态跟踪
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
let flag = ref(false)
// 初始化获取 数据操作
const getContent = async (id: any, filename: string) => {
  const name = filename
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
  // await getContent(route.query.file_id)
  // // 判断是否是office三件套
  // if (flag.value) {
  //   setOfficeView()
  //     .then(() => {
  //       loading.value = false
  //     })
  //     .catch(() => {
  //       loading.value = false
  //     })
  // }
})

// 挂载office渲染组件
const setOfficeView = async (filename: string) => {
  const name = filename
  const extend = name && getExtend(name)
  const node = document.createElement('div')
  node.style.height = '100%'
  // 添加孩子，防止vue实例替换dom元素
  if (last.value) {
    output.value.removeChild(output.value.firstElementChild)
    last.value.$.appContext.app.unmount()
  }
  const child = output.value.appendChild(node)
  return new Promise((resolve, reject) =>
    render(undefined, extend, child, info.value?.linkInfo?.file_id)
      .then(resolve)
      .catch(reject)
  )
}

const handleChange = async (e: any) => {
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

const displayResult = (buffer?: any) => {
  // 取得文件名
  const name = info.value.linkInfo?.name
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
    render(buffer, extend, child, info.value?.linkInfo?.file_id)
      .then(resolve)
      .catch(reject)
  )
}

// 取消分享
const cancelLink = async () => {
  try {
    await closeShareLink(info.value?.linkInfo.id)
    $message.success('取消成功')
    openHome()
  } catch (e) {
    $message.error('取消失败')
  }
}

const download = async () => {
  const id = info.value?.linkInfo.file_id
  const url =
    window.location.origin +
    `/w/api/download?id=${id}&timeout=${new Date().getTime()}`
  window.open(url)
}

const showModel = ref(false)
const cId = ref()
const mClose = () => {
  showModel.value = false
}
const open = () => {
  showModel.value = true
}

const getRoot = () => {
  bodyInfo.value = useFileList({
    item: info.value.file
  })
}
</script>
<template>
  <div class="link">
    <div class="p-header">
      <div class="header-left">
        <img src="/src/assets/icons/logo.svg" alt="" @click="openHome" /> 网盘
      </div>
      <div class="header-content"></div>
      <div class="header-right"></div>
    </div>
    <div class="link_show_body">
      <div class="bd_left">
        <div class="link_file_header">
          <div class="link_title">
            <div class="link_file_name">
              <!-- <img
                src="/src/assets/img/qita.png"
                alt="share"
                class="file-icon"
              /> -->
              <div
                class="file-icon"
                :class="`${getFileSuffix(info?.file?.name)}`"
              ></div>
              <!-- <img
                src="/src/assets/img/folder.png"
                alt="share"
                class="file-icon"
              /> -->
              {{ info?.file?.name }}
            </div>
            <div class="link_file_action">
              <span class="g-button" @click="cancelLink"
                ><x-cancel-link /> 取消分享</span
              >
              <span class="g-button" @click="download"><x-down /> 下载</span>
              <span class="g-button" @click="open">保存到我的网盘</span>
            </div>
          </div>
          <div class="slide-show-other-infos">
            <x-link-time /> <span>2023-10-14 20:23</span>
            <span>过期时间：7天后</span>
          </div>
        </div>
        <div class="show_body" ref="output">
          <div class="show_body_header" v-if="info?.file?.is_dir == 1">
            <span style="cursor: pointer" @click="getRoot">全部文件</span>
            <span
              v-for="item in bodyInfo?.levelList"
              :key="item.id"
              @click="bodyInfo.openFoler(item.id, item.name)"
              class="show_body_header_item"
              ><div class="show_body_header_item-l">></div>
              {{ item.name }}</span
            >
          </div>
          <div class="pan-table" v-if="info?.file?.is_dir == 1">
            <div class="pan-table-header">
              <table style="width: 100%">
                <colgroup>
                  <col width="45%" />
                  <col width="23%" />
                  <col width="22%" />
                </colgroup>
                <thead>
                  <tr class="table-header-row">
                    <th class="table-header-th">
                      <div style="margin-left: 10px">
                        <span>文件名</span>
                        <div><i></i><i></i></div>
                      </div>
                    </th>
                    <th class="table-header-th">
                      <div>
                        <span>修改时间</span>
                        <div></div>
                      </div>
                    </th>
                    <th class="table-header-th">
                      <div>
                        <span>大小</span>
                        <div></div>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="pan-table-body" v-if="bodyInfo.list.length">
              <table style="width: 100%">
                <colgroup>
                  <col width="45%" />
                  <col width="23%" />
                  <col width="22%" />
                </colgroup>
                <tbody>
                  <tr
                    class="table-body-row cursor"
                    v-for="item in bodyInfo.list"
                    :key="item.id"
                  >
                    <td class="pan-table_td">
                      <div style="margin-left: 10px">
                        <div draggable="true" style="display: flex">
                          <div style="flex: 1">
                            <img
                              v-if="item.is_dir == 2"
                              src="/src/assets/img/qita.png"
                              alt="share"
                              class="file-icon"
                            />
                            <img
                              v-else
                              src="/src/assets/img/folder.png"
                              alt="share"
                              class="file-icon"
                            />
                            <a
                              class="filename text-ellip"
                              :title="item.name"
                              @click="bodyInfo.openFoler(item.id, item.name)"
                            >
                              {{ item.name }}
                            </a>
                          </div>
                          <div class="file-action">
                            <div v-if="item.is_dir == 2" style="display: flex">
                              <div style="margin-right: 5px">
                                <x-download class="file-action-icon" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="pan-table_td">
                      <div class="wp-s-pan-list__time-column">
                        <p class="">{{ timestampToTime(item.create_at) }}</p>
                      </div>
                    </td>
                    <td class="pan-table_td">
                      <section class="">
                        {{ item.is_dir == 1 ? '-' : sizeTostr(item.size) }}
                      </section>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <none-view v-else />
          </div>
        </div>
      </div>
      <div class="bd_right"></div>
    </div>
  </div>
  <file-action
    v-if="showModel"
    :cId="cId"
    :showModel="showModel"
    @close="mClose"
  />
</template>
<style scoped lang="less">
.link {
  width: 100%;
  height: 100%;
  background: #f7f7f7;
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
.link_show_body {
  height: calc(100% - 56px);
  width: 100%;
  padding: 20px 24px;
  display: flex;
  .bd_left {
    flex: 1;
    height: 100%;
    background: #fff;

    .link_file_header {
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid #f6f6f6;
      .link_title {
        display: flex;
        justify-content: space-between;
        .link_file_name {
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
        }
      }
    }

    .show_body {
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .bd_right {
    margin-left: 10px;
    width: 215px;
    flex-shrink: 0;
    height: 100%;
    background: #fff;
  }
}
.g-button {
  text-decoration: none;
  color: #09aaff;
  border: 1px solid #c3eaff;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  svg {
    position: relative;
    top: -2px;
  }
}
.file-icon {
  width: 32px;
  height: 32px;
  background: url('/src/assets/img/qita.png');
  background-size: cover !important;
  display: inline-block;
}

.slide-show-other-infos {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  display: inline-block;
  margin-top: 7px;
  svg {
    position: relative;
    top: -1px;
  }
  span {
    margin-left: 8px;
  }
}

.pan-table {
  height: calc(100% - 40px);
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .pan-table-header {
    .table-header-row {
      height: 50px;
      line-height: 50px;
      color: #818999;
      text-align: left;
      font-size: 12px;
      .table-header-select {
        padding-left: 0;
        width: 80px;
        text-align: center;
      }
      .table-header-th {
        line-height: 1;
        cursor: pointer;
        border-bottom: 1px solid #f7f8fa;
      }
    }
  }
  .pan-table-body {
    height: calc(100% - 58px);
    position: relative;
    overflow: auto;
    user-select: none;
    .table-body-row {
      height: 50px;
      line-height: 50px;
      color: #03081a;
      font-size: 12px;
      .aichat-width {
        padding-left: 0;
        width: 80px;
        text-align: center;
      }
      &:hover {
        background-color: #f7f9fc;
        border-color: #f7f9fc;
      }
      &:hover .w-checkbox {
        visibility: visible;
      }
      .w-checkbox {
        visibility: hidden;
      }
      &.selected .w-checkbox {
        visibility: visible;
      }
      &.selected {
        background: #f2faff;
      }
      .item-action {
        display: inline-block;
        height: 24px;
        .action-edit {
          display: flex;
          height: 24px;

          input {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            outline: 0;
            border-color: #06a7ff;
          }
          button {
            background-color: #06a7ff;
            border-radius: 4px;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            color: #fff;
            outline: 0;
            border: none;
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }

      .filename {
        width: 84%;
        display: inline-block;
        &:hover {
          color: #06a7ff;
        }
      }
      &:hover .file-action {
        display: block;
      }
      .file-action {
        display: none;
      }
    }
    .file-icon {
      width: 32px;
      height: 32px;
    }
    .pan-table_td {
      border-bottom: 1px solid #f7f8fa;
      position: relative;
    }
  }
}
.wp-s-file-contain-list__empty {
  height: calc(100% - 51px);
}
.show_body_header {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background-color: #fafafc;
  color: #afb3bf;
}
.show_body_header_item {
  display: inline-block;
  cursor: pointer;
  font-size: 12px;
}
.show_body_header_item:last-child {
  color: #06a7ff;
}
.show_body_header_item-l {
  display: inline-block;
  margin-left: 5px;
}
</style>
