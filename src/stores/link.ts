import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getShareList } from '@/service/modules/link'
import { useRoute, useRouter } from 'vue-router'

export const useLinkStore = defineStore('link', () => {
  const route = useRoute()

  const router = useRouter()

  const list = ref<any[]>([])

  const all = computed(() => {
    return list.value.some((item) => item.is_active)
  })

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

  return {
    list,
    getList,
    all
  }
})
