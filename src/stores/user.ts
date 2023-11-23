import { ref } from 'vue'
import { defineStore } from 'pinia'
import { info } from '@/service/modules/login'
export const useUserStore = defineStore('user', () => {
  const user = ref<any>({})

  const getUserInfo = async () => {
    const res = await info()
    if (res.code === 200) {
      user.value = res.data
    }
  }

  return { user, getUserInfo }
})
