import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getShareList, closeShareLink } from '@/service/modules/link'
import { useRoute, useRouter } from 'vue-router'

export const useLinkStore = defineStore('link', () => {
  const route = useRoute()

  const router = useRouter()

  const list = ref<any[]>([])

  const all = computed(() => {
    if (list.value.length) {
      return (
        list.value.filter((item) => item.is_active).length == list.value.length
      )
    }
    return false
  })

  const setAll = () => {
    const is = all.value
    list.value.forEach((Item) => {
      Item.is_active = !is
    })
  }

  const getList = async () => {
    const res = await getShareList()
    if (res?.code === 200) {
      list.value = res.data.map((item: any) => {
        return {
          ...item,
          is_active: false
        }
      })
    }
  }

  const closeLink = async (id: string) => {
    await closeShareLink(id)
    await getList()
  }

  const allClose = async () => {
    for (const link of list.value) {
      await closeShareLink(link.lid)
    }
    await getList()
  }

  const detail = ref<any>()
  const showDetails = computed(() => {
    const l = list.value.filter((item) => item.is_active)
    return l.length == 1
  })

  const showNone = computed(() => {
    return !list.value.some((item) => item.is_active)
  })

  const checkItem = (item: any) => {
    if (showDetails.value) {
      detail.value = item
    }
  }

  const activeNum = computed(
    () => list.value.filter((item) => item.is_active).length
  )

  const handleClickitem = (item: any) => {
    if (showDetails.value && item.is_active) {
      item.is_active = false
      detail.value = ''
      return
    }
    list.value.forEach((val) => {
      val.is_active = false
    })
    item.is_active = true
    detail.value = item
  }

  return {
    list,
    getList,
    all,
    closeLink,
    allClose,
    setAll,
    showDetails,
    detail,
    checkItem,
    handleClickitem,
    showNone,
    activeNum
  }
})
