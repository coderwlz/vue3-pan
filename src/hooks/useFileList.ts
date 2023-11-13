import { ref, computed } from 'vue'
import { getFileList } from '@/service/modules/file'

export const useFileList = (option: any) => {
  const { headerItem, isInit, item } = option

  const list = ref<any>([])
  if (item) {
    list.value.push(item)
  }

  const target_id = ref<any>('1')

  const level = ref<any[]>([])

  const getList = async (id?: string | undefined) => {
    target_id.value = id || '1'
    const res = await getFileList(target_id.value)
    if (res?.code === 200) {
      list.value = res.data
    }
  }
  if (isInit) {
    getList()
  }

  const openFoler = async (id: string, name?: string | undefined) => {
    target_id.value = id || '1'

    if (name == undefined) {
      level.value = []
      getList()
      return
    }
    let count = undefined
    level.value.forEach((item, index) => {
      if (item.id == id) {
        count = index
      }
    })

    if (count != undefined) {
      level.value = level.value.slice(0, count + 1)
    } else {
      level.value.push({
        name,
        id
      })
    }

    getList(target_id.value)
  }

  const levelList = computed(() => {
    if (headerItem) {
      return [headerItem].concat(level.value)
    }
    return level.value
  })

  return {
    list,
    openFoler,
    levelList
  }
}
