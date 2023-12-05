<script setup lang="ts">
import { computed, ref } from 'vue'
import { login, signup } from '@/service/modules/login'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { Base64 } from 'js-base64'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  email: '',
  nickname: ''
})
const type = ref('login')
const submit = async (e: any) => {
  e.preventDefault()

  if (!formData.value.username) {
    message.error('请输入用户名')
    return
  }
  if (!formData.value.password) {
    message.error('请输入密码')
    return
  }
  if (!formData.value.nickname && type.value != 'login') {
    message.error('请输入昵称')
    return
  }
  if (!formData.value.email && type.value != 'login') {
    message.error('请输入邮箱')
    return
  }
  const pwd = Base64.encode(formData.value.password)
  // console.log(Base64.decode(pwd))
  // MTIzNDU2
  let res = {} as any
  if (type.value == 'login') {
    res = await login({
      ...formData.value,
      password: pwd
    })
    if (res.code == 200) {
      router.push('/home')
    } else {
      message.error(res.message)
    }
  } else {
    res = await signup({
      ...formData.value,
      password: pwd
    })
    if (res.code == 200) {
      message.success('注册成功')
    }
  }
}

const typeStr = computed(() => {
  return type.value == 'login' ? '登录' : '注册'
})

const changeType = () => {
  type.value = type.value == 'login' ? 'signup' : 'login'
}
</script>
<template>
  <div class="pan">
    <div class="p-header">
      <div class="header-left">
        <img src="/src/assets/icons/logo.svg" alt="" />网盘
      </div>
      <div class="header-content"></div>
      <div class="header-right"></div>
    </div>
    <div class="welcome-img-container">
      <img src="https://pan.baidu.com/h5-static/h5-welcome/images/slide0.png" />
    </div>
    <div class="p-content">
      <div class="p-content-bg">
        <div class="bg-icon"></div>
      </div>
      <div class="login">
        <div class="login-body">
          <form>
            <h1>账号{{ typeStr }}</h1>
            <div>
              <label for="username">
                <input
                  type="text"
                  id="username"
                  class="wl-input"
                  v-model="formData.username"
                  placeholder="账号：admin"
                />
              </label>
            </div>
            <div v-if="type != 'login'">
              <label for="nickname">
                <input
                  type="text"
                  class="wl-input"
                  v-model="formData.nickname"
                  placeholder="请输入昵称"
                />
              </label>
            </div>
            <div>
              <label for="password">
                <input
                  type="password"
                  class="wl-input"
                  v-model="formData.password"
                  placeholder="密码：123456"
                />
              </label>
            </div>
            <div v-if="type != 'login'">
              <label for="email">
                <input
                  type="text"
                  class="wl-input"
                  v-model="formData.email"
                  placeholder="请输入邮箱"
                />
              </label>
            </div>

            <div class="u-link">
              <a @click="changeType">{{
                type == 'login' ? '没有账号去注册?' : '已有账号去登录'
              }}</a>
            </div>
            <div>
              <button class="u-button login-btn" type="submit" @click="submit">
                {{ typeStr }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
@media screen and (max-width: 576px) {
  @import url(/src/assets/css/xs/login.less);
}
@media screen and (min-width: 576px) {
  @import url(/src/assets/css/login.less);
}
</style>
