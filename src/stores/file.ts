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
  addLink,
  editFile,
  getDelList,
  removeFile,
  resetFile,
  search
} from '@/service/modules/file'
import { getFileSuffix, groupByDate } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

export const useFileStore = defineStore('file', () => {
  const userStore = useUserStore()

  const route = useRoute()

  const router = useRouter()

  const list = ref<any[]>([])

  const parent_id = ref((route.query.id as string) || '')

  const path = ref<any[]>([])

  const q = ref('')
  const isQ = ref(false)
  const loading = ref(false)
  const category = ref('all')
  if (route.query?.category) {
    category.value = route.query?.category as string
  }

  const all = computed(() => {
    return (
      list.value.filter((item) => item.is_active).length == list.value.length
    )
  })

  const isActive = computed(() => {
    return list.value.some((item) => item.is_active)
  })

  const setAll = () => {
    const is = all.value
    list.value.forEach((Item) => {
      Item.is_active = !is
    })
  }

  const urlList = ref()

  const imgList = ref<any>()

  const searchList = async () => {
    loading.value = true
    try {
      const type = category.value === 'all' ? undefined : category.value

      if (q.value.length == 0) {
        isQ.value = false
      } else {
        isQ.value = true
      }
      const res = await search(type, q.value)
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
          imgList.value = groupByDate(imgList.value)
        }
      }
    } finally {
      loading.value = false
    }
  }

  const getList = async (id?: string) => {
    loading.value = true
    const type = category.value === 'all' ? undefined : category.value
    try {
      if (type == 'del') {
        const res = await getDelList()
        list.value = res.data.map((item: any) => {
          return {
            ...item,
            is_active: false
          }
        })
        return
      }
      const res = await getFileList(id || parent_id.value || '', type)
      if (res?.code === 200) {
        list.value = res.data.map((item: any) => {
          return {
            ...item,
            is_active: false,
            img: `/w/api/thumbnail?id=${item.id}`
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
          imgList.value = groupByDate(imgList.value)
        }
      }
    } finally {
      loading.value = false
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
      size: 0,
      isAdd: true
    })
  }

  const addFolerOnOk = async () => {
    const [flag] = list.value.filter((item) => item.is_edit)
    let paths = ''
    if (!flag) {
      return
    }
    if (parent_id.value) {
      paths = JSON.stringify(path.value)
    }
    if (flag?.isAdd) {
      await addHandleFoler(
        flag.name,
        parent_id.value || userStore.user.id,
        paths
      )
    } else {
      await editFile(flag.name, flag.id)
    }
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
    const item = list.value[count]
    item.is_edit = false
    if (item?.isAdd) {
      list.value.splice(count, 1)
      return
    }
  }

  const openFoler = (id: string, name?: string | undefined) => {
    parent_id.value = id
    q.value = ''
    isQ.value = false
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
    await removeFile(delId.value)
    // await delFile(delId.value)
    getList()
    handleCloseDel()
  }

  const delAllFile = async () => {
    loading.value = true
    try {
      for (const item of list.value) {
        await removeFile(item.id)
      }
      await getList()
    } finally {
      loading.value = false
    }
  }

  const handRemoveFile = async (id: string) => {
    await delFile(id)
    getList()
  }

  const handleCloseDel = () => {
    openDel.value = false
    delId.value = ''
  }

  // 回收站
  const resetFileItem = async (id: string) => {
    await resetFile(id)
    getList()
  }

  const handleAllDel = async () => {
    loading.value = true
    try {
      for (const item of list.value) {
        await delFile(item.id)
      }
      await getList()
    } finally {
      loading.value = false
    }
  }

  const resetActive = async () => {
    loading.value = true
    try {
      for (const item of list.value) {
        if (item.is_active) {
          await resetFile(item.id)
        }
      }
      await getList()
    } finally {
      loading.value = false
    }
  }

  // 下载
  const download = async (id: string) => {
    const url = window.location.origin + `/w/api/download?id=${id}`
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
    target_id.value = id || userStore.user.id || ''
    const res = await getFolerList(id || userStore.user.id || '')
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
      await fileCopy(
        cId.value,
        target_id.value ?? (parent_id.value || userStore.user.id)
      )
    } else {
      await fileMove(
        cId.value,
        target_id.value ?? (parent_id.value || userStore.user.id)
      )
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
      return
    }
    if (
      img.includes(getFileSuffix(data.name)) ||
      txt.includes(getFileSuffix(data.name)) ||
      pdf.includes(getFileSuffix(data.name))
    ) {
      window.open(`#/view?mode=view&filename=${data.name}&file_id=${data.id}`)
      return
    }
    if (
      xlsx.includes(getFileSuffix(data.name)) ||
      ppt.includes(getFileSuffix(data.name)) ||
      docx.includes(getFileSuffix(data.name))
    ) {
      window.open(`#/view?mode=view&filename=${data.name}&file_id=${data.id}`)
      return
    }
    if (getFileSuffix(data.name) == 'mp3') {
      const res = await getFileContent(data.id)
      const blob = res //处理文档流
      const link = URL.createObjectURL(blob)
      window.open(link)
      return
    }
    message.warning('暂不支持该类型预览')
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
    const res = await addLink(linkFileInfo.value.id, data.exprie_at, data.pwd)
    linkPwd.value = res.data.pwd
    link.value =
      window.location.origin +
      '/#/link/' +
      res.data.key +
      '?pwd=' +
      res.data.pwd
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
    imgList,
    setAll,
    handRemoveFile,
    resetFileItem,
    handleAllDel,
    resetActive,
    q,
    isQ,
    searchList,
    getPath,
    delAllFile,
    isActive,
    loading
  }
})
