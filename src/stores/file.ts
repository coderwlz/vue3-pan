import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFileList } from '@/service/modules/file'
import { useRoute } from 'vue-router'

export const useFileStore = defineStore('file', () => {
  const route = useRoute()

  const list = ref<any[]>([])

  const parent_id = ref('')

  const category = ref('all')
  if (route.query?.category) {
    category.value = route.query?.category as string
  }

  const getList = async () => {
    const res = await getFileList(parent_id.value || '1')
    if (res?.code === 200) {
      list.value = res.data
    }
  }

  return { list, getList, category }
})
