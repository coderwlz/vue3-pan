import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getFileList,
  addHandleFoler,
  getFileInfo,
  delFile,
  getFolerList
} from '@/service/modules/file'
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

  const getList = async () => {
    const type = category.value === 'all' ? undefined : category.value
    const res = await getFileList(parent_id.value || '1', type)
    if (res?.code === 200) {
      list.value = res.data
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
    if (name == undefined) {
      path.value = []
      getList()
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
  const target_id = ref('')
  const getActionList = async (id?: string | undefined) => {
    const res = await getFolerList(id || '1')
    if (res?.code === 200) {
      actionList.value = res.data
    }
  }
  const openActionModel = async (id: string, type: number) => {
    actionModel.value = true
    cId.value = id
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
    actionList
  }
})
