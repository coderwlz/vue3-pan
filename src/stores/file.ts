import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getFileList,
  addHandleFoler,
  getFileInfo,
  delFile,
  getFolerList,
  fileCopy,
  fileMove,
  fileContent,
  addLink
} from '@/service/modules/file'
import { getFileSuffix } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

export const useFileStore = defineStore('file', () => {
  const route = useRoute()

  const router = useRouter()

  const list = ref<any[]>([])

  const parent_id = ref((route.query.id as string) || '')

  const path = ref<any[]>([])

  const category = ref('all')
  if (route.query?.category) {
    category.value = route.query?.category as string
  }

  const all = computed(() => {
    return list.value.some((item) => item.is_active)
  })

  const urlList = ref()

  const imgList = ref()

  const getList = async () => {
    const type = category.value === 'all' ? undefined : category.value
    const res = await getFileList(parent_id.value || '1', type)
    if (res?.code === 200) {
      list.value = res.data.map((item: any) => {
        return {
          ...item,
          is_active: false
        }
      })
      if (category.value == '5') {
        urlList.value = res.data.map(
          (item: any) => `/w/api/content?id=${item.id}`
        )
        imgList.value = res.data.map((item: any) => {
          return {
            src: `/w/api/thumbnail?id=${item.id}`,
            ...item,
            showMenu: false,
            menuHover: false
          }
        })
      }
    }
  }

  const getPath = async () => {
    if (parent_id.value) {
      const { data } = await getFileInfo(parent_id.value)
      path.value = []
      if (data.path) {
        path.value.push(...JSON.parse(data.path))
      }
      path.value.push({
        id: data.id,
        name: data.name
      })
    }
  }
  getPath()

  const addFoler = () => {
    const [flag] = list.value.filter((item) => item.is_edit)
    if (flag) {
      return
    }
    list.value.push({
      id: new Date().getTime(),
      name: '',
      is_edit: true,
      create_at: new Date().getTime(),
      is_dir: 1,
      size: 0
    })
  }

  const addFolerOnOk = async () => {
    const [flag] = list.value.filter((item) => item.is_edit)
    console.log('flag', flag)
    let paths = ''
    if (!flag) {
      return
    }
    if (parent_id.value) {
      paths = JSON.stringify(path.value)
    }
    const res = await addHandleFoler(flag.name, parent_id.value || '1', paths)
    console.log('addFolerOnOk', res)
    addFolerClose()
    getList()
  }

  const addFolerClose = () => {
    let count: any = undefined
    list.value.forEach((item, index) => {
      if (item.is_edit) {
        count = index
      }
      return item.is_edit
    })

    if (count == undefined) {
      return
    }
    list.value.splice(count, 1)
  }

  const openFoler = (id: string, name?: string | undefined) => {
    parent_id.value = id
    console.log('id', id)
    console.log('name', name)

    if (name == undefined) {
      path.value = []
      getList()
      router.push({
        name: 'home',
        query: {
          id: parent_id.value
        }
      })
      return
    }
    let count = undefined
    path.value.forEach((item, index) => {
      if (item.id == id) {
        count = index
      }
    })

    if (count != undefined) {
      path.value = path.value.slice(0, count + 1)
    } else {
      path.value.push({
        name,
        id
      })
    }

    router.push({
      name: 'home',
      query: {
        id: parent_id.value
      }
    })

    getList()
  }

  // 删除
  const delId = ref('')
  const openDel = ref(false)
  const openDelModel = (id: string) => {
    openDel.value = true
    delId.value = id
  }

  const handDelFile = async () => {
    await delFile(delId.value)
    getList()
    handleCloseDel()
  }

  const handleCloseDel = () => {
    openDel.value = false
    delId.value = ''
  }

  // 下载
  const download = async (id: string) => {
    const url =
      window.location.origin +
      `/w/api/download?id=${id}&timeout=${new Date().getTime()}`
    window.open(url)
  }

  // 复制 / 移动
  const cId = ref('')
  const actionTitle = ref()
  const actionList = ref()
  const actionModel = ref(false)
  const target_id = ref()
  const action_type = ref()
  const getActionList = async (id?: string | undefined) => {
    target_id.value = id || '1'
    const res = await getFolerList(id || '1')
    if (res?.code === 200) {
      actionList.value = res.data
    }
  }

  const openActionModel = async (id: string, type: number) => {
    actionModel.value = true
    cId.value = id
    action_type.value = type
    if (type == 1) {
      actionTitle.value = '复制到'
    } else {
      actionTitle.value = '移动到'
    }
    await getActionList()
  }

  const closeActionModel = () => {
    actionModel.value = false
    cId.value = ''
    actionTitle.value = ''
    action_type.value = undefined
    target_id.value = undefined
  }

  const actionOnOk = async () => {
    if (action_type.value == 1) {
      await fileCopy(cId.value, target_id.value ?? (parent_id.value || '1'))
    } else {
      await fileMove(cId.value, target_id.value ?? (parent_id.value || '1'))
    }
    closeActionModel()
    await getList()
  }

  const getFileContent = async (id: string) => {
    return await fileContent(id)
  }

  const img = ['gif', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'png', 'svg']
  const txt = [
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
  const pdf = ['pdf']
  const xlsx = ['xls', 'xlsx', 'csv']
  const ppt = ['pptx', 'ppt']
  const docx = ['doc', 'docx']

  const openFileView = async (data: any) => {
    if (getFileSuffix(data.name) == 'mp4') {
      window.open(`#/view?mode=view&filename=${data.name}&file_id=${data.id}`)
    }
    if (
      img.includes(getFileSuffix(data.name)) ||
      txt.includes(getFileSuffix(data.name)) ||
      pdf.includes(getFileSuffix(data.name))
    ) {
      window.open(`#/view?mode=view&filename=${data.name}&file_id=${data.id}`)
    }
    if (
      xlsx.includes(getFileSuffix(data.name)) ||
      ppt.includes(getFileSuffix(data.name)) ||
      docx.includes(getFileSuffix(data.name))
    ) {
      window.open(`#/view?mode=view&filename=${data.name}&file_id=${data.id}`)
    }
    if (getFileSuffix(data.name) == 'mp3') {
      const res = await getFileContent(data.id)
      const blob = res //处理文档流
      const link = URL.createObjectURL(blob)
      window.open(link)
    }
  }

  // 分享
  const linkFileInfo = ref()
  const createLink = ref(false)
  const isLinkOver = ref(false)
  const link = ref()
  const linkPwd = ref()
  const openCreateLink = (data: any) => {
    linkFileInfo.value = data
    createLink.value = true
  }

  const cacelLink = () => {
    createLink.value = false
    linkFileInfo.value = {}
    isLinkOver.value = false
  }

  const addLinks = async (data: any) => {
    console.log('addLinks', data)

    const res = await addLink(linkFileInfo.value.id, data.exprie_at, data.pwd)
    linkPwd.value = res.data.pwd
    link.value =
      window.location.origin + '#/link/' + res.data.key + '?pwd=' + res.data.pwd
    isLinkOver.value = true
  }

  return {
    list,
    getList,
    category,
    addFoler,
    addFolerClose,
    addFolerOnOk,
    openFoler,
    parent_id,
    path,
    handDelFile,
    openDelModel,
    openDel,
    handleCloseDel,
    download,
    openActionModel,
    closeActionModel,
    actionModel,
    actionTitle,
    actionList,
    actionOnOk,
    getActionList,
    action_type,
    getFileContent,
    openFileView,
    all,
    addLinks,
    cacelLink,
    openCreateLink,
    createLink,
    linkFileInfo,
    isLinkOver,
    link,
    linkPwd,
    urlList,
    imgList
  }
})
