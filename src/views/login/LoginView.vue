<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/service/modules/login'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  password: ''
})

const submit = async (e: any) => {
  e.preventDefault()
  let res = await login(formData.value)
  if (res.code == 200) {
    router.push('/home')
  }
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
    <div class="p-content">
      <div class="p-content-bg">
        <div class="bg-icon"></div>
      </div>
      <div class="login">
        <div class="login-body">
          <form>
            <h1>账号登录</h1>
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
            <div>
              <button class="u-button login-btn" type="submit" @click="submit">
                登录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.pan {
  width: 100%;
  height: 100%;
  .p-content {
    height: calc(100% - 56px);
    overflow: hidden;
    width: 100%;
    display: flex;
    .p-content-bg {
      position: relative;
      flex: 1;
      .bg-icon {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 500px;
        height: 360px;
        background: url('/src/assets/icons/login.svg') no-repeat;
        background-size: cover;
      }
    }
    .login {
      position: relative;
      flex: 1;
      .login-body {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 350px;
        height: 310px;
      }
    }
  }
}
.p-header {
  height: 56px;
  box-shadow: -7px 3px 10px 0 rgba(0, 0, 0, 0.06);
  padding-left: 24px;
  padding-right: 28px;
  position: relative;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wl-input {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  outline: none;
  margin-bottom: 20px;
  &:focus {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    border-inline-end-width: 1px;
  }
}
.header-left {
  font-size: 30px;
  img {
    width: 42px;
    margin-right: 8px;
  }
}
.login-btn {
  width: 100%;
  background-color: #09aaff;
  border-radius: 24px;
  box-shadow: unset;
  color: #ffffff;
}
h1 {
  text-align: center;
}
</style>
