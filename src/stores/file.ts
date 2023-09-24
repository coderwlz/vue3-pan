import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFileList } from '@/service/modules/file'

export const useFileStore = defineStore('file', () => {
  const list = ref<any[]>([])

  const parent_id = ref('')

  const getList = async () => {
    const res = await getFileList(parent_id.value || '1')
    if (res?.code === 200) {
      list.value = res.data
    }
  }

  return { list, getList }
})
