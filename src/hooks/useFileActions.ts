import { ref } from 'vue'
import { getFolerList } from '@/service/modules/file'

export const useFileActions = (option: any) => {
  const { ok, cId } = option

  const list = ref([])

  const target_id = ref<any>('1')

  const level = ref<any[]>([])

  const getList = async (id?: string | undefined) => {
    target_id.value = id || '1'
    const res = await getFolerList(target_id.value)
    if (res?.code === 200) {
      list.value = res.data
    }
  }
  getList()

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

  const success = () => {
    ok && ok(cId, target_id.value)
  }

  return {
    list,
    openFoler,
    success,
    level
  }
}
