<script setup lang="ts">
import { ref, watch } from 'vue'
import { getTimestampAfterNDays } from '@/utils'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'

const fileStore = useFileStore()

const { createLink, linkFileInfo, isLinkOver, link, linkPwd } =
  storeToRefs(fileStore)

const link_time = ref(7)
const link_pwd = ref('')
const link_pwd_type = ref(1)

const createLinks = () => {
  const data = {
    exprie_at: 0,
    pwd: ''
  }
  if (link_time.value !== 0) {
    data.exprie_at = getTimestampAfterNDays(link_time.value)
  }
  if (link_pwd_type.value == 2) {
    data.pwd = link_pwd.value
  }

  fileStore.addLinks(data)
}

watch(link_pwd_type, (value: any) => {
  if (value == 1) {
    link_pwd.value = ''
  }
})

const copyLinks = () => {
  let inputs = document.createElement('input') //创建节点
  inputs.value = link.value //给节点赋值
  document.body.appendChild(inputs) //渲染节点(要不然不起作用,可以添加隐藏属性)
  inputs.select() //选中节点
  let actions = document.execCommand('Copy') //指定复制命令(返回的是一个boolean类型)
  // actions && Message({ type: 'success', message: '复制成功' })
  inputs && inputs?.parentNode?.removeChild(inputs)
}
</script>

<template>
  <div
    class="u-dialog__wrapper wp-s-dialog-skin-hoc wp-s-share-hoc__dialog is-no-padding is-transparent-bg is-no-header-border"
    style="z-index: 2049"
    v-if="createLink"
    @click.self="fileStore.cacelLink"
  >
    <div
      class="u-dialog u-dialog__large is-default share-dialog-warp"
      style="
        top: 231.5px;
        background-image: url('https://staticsns.cdn.bcebos.com/amis/2022-5/1653722723001/svip%402x.png');
      "
    >
      <div class="u-dialog__header">
        <span class="u-dialog__title"
          >分享文件(夹):{{ linkFileInfo?.name }}</span
        ><button
          type="button"
          aria-label="Close"
          class="u-dialog__headerbtn"
          @click.stop="fileStore.cacelLink"
        >
          <x-close class="u-dialog__close u-icon u-icon-close"></x-close>
        </button>
      </div>
      <div class="u-dialog__body">
        <div class="link_header">链接分享</div>
        <div v-if="!isLinkOver">
          <div class="link_create">
            <div class="link_create_item">
              <div class="link_create_item_label">有效期</div>
              <div class="link_create_item_form">
                <label for="time1">
                  <input
                    type="radio"
                    id="time1"
                    name="time"
                    :value="1"
                    v-model="link_time"
                  /><span class="time_label">1天</span>
                </label>
                <label for="time7">
                  <input
                    type="radio"
                    id="time7"
                    name="time"
                    :value="7"
                    v-model="link_time"
                  /><span class="time_label">7天</span>
                </label>
                <label for="time30">
                  <input
                    type="radio"
                    id="time30"
                    name="time"
                    :value="30"
                    v-model="link_time"
                  /><span class="time_label">30天</span>
                </label>
                <label for="time">
                  <input
                    type="radio"
                    id="time"
                    name="time"
                    :value="0"
                    v-model="link_time"
                  /><span class="time_label">永久有效</span>
                </label>
              </div>
            </div>
            <div class="link_create_item">
              <div class="link_create_item_label">提取码</div>
              <div class="link_create_item_form">
                <div>
                  <label for="time2">
                    <input
                      type="radio"
                      id="time2"
                      name="pwd"
                      :value="1"
                      v-model="link_pwd_type"
                    />
                    <span class="time_label">系统随机生成提取码</span>
                  </label>
                </div>
                <div class="link_create_item_form_pwd">
                  <label for="time3">
                    <input
                      type="radio"
                      id="time3"
                      name="pwd"
                      :value="2"
                      v-model="link_pwd_type"
                    />
                    <input
                      type="text"
                      class="u-input__inner"
                      maxlength="4"
                      placeholder="请输入4位提取码"
                      :disabled="link_pwd_type == 1"
                      :style="{
                        background: link_pwd_type == 1 ? '#ccc' : '#fff'
                      }"
                      v-model="link_pwd"
                    />
                    <span class="time_label">仅支持数字及英文字母</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="link-submit">
            <button class="upload u-button" @click="createLinks">
              创建链接
            </button>
          </div>
        </div>

        <div style="padding: 20px" v-else>
          <div class="over_title">
            <span class="over_title_d">
              成功创建分享链接，访问者无需提取码可直接查看分享文件
            </span>
          </div>
          <div class="link-info-url">
            <input
              type="text"
              readonly
              autocomplete="off"
              class="u-input__inner"
              style="background-color: #f5f6fa; height: 32px"
              v-model="link"
            />
          </div>
          <div class="pwd_over_body">
            提取码
            <div class="pwd_over">
              <input
                type="text"
                readonly
                autocomplete="off"
                class="u-input__inner"
                v-model="linkPwd"
                style="background-color: #f5f6fa; height: 32px"
              />
            </div>
          </div>
          <div v-if="link_time != 0" class="over_time">
            链接<span>{{ link_time + '天' }}</span
            >后失效
          </div>
          <div class="link-submit">
            <button class="upload u-button" @click="copyLinks">
              复制链接及提取码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.wp-s-dialog-skin-hoc.is-transparent-bg {
  background: 0 0;
}
.u-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}
.u-dialog.share-dialog-warp {
  background-repeat: no-repeat;
  background-position: 100% 0;
  background-size: 100% auto;
}
.u-dialog.share-dialog-warp {
  overflow: hidden;
  background-color: #f5f6fa;
}
.u-dialog__large {
  width: 752px;
}
.u-dialog {
  position: relative;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}
.wp-s-dialog-skin-hoc.is-no-header-border .u-dialog .u-dialog__header {
  border: none;
}

.u-dialog__header {
  text-align: left;
  height: 48px;
  box-sizing: border-box;
  padding: 15px 50px 15px 24px;
  border-bottom: 1px solid #f1f3f8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wp-s-dialog-skin-hoc.is-no-padding .u-dialog .u-dialog__body {
  padding: 0;
}
.u-dialog__body {
  color: #606266;
  font-size: 14px;
}
.u-dialog__body {
  word-break: break-all;
}
.u-dialog__title {
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
}
.u-dialog__headerbtn {
  position: absolute;
  top: 15px;
  right: 24px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px;
}
.u-dialog__headerbtn .u-dialog__close {
  font-size: 16px;
  color: #979797;
  font-weight: 700;
}
.link_create {
  padding: 24px 20px;
}
.link_create_item {
  display: flex;
  margin-top: 18px;
}
.link_create_item_label {
  width: 120px;
  text-align: left;
}
.link_create_item_form {
  flex: 1;
  label {
    margin-right: 20px;
    cursor: pointer;
  }
}
.link_create_item_form_pwd {
  margin-top: 14px;
  label > input[type='text'] {
    margin-left: 12px;
  }
  .u-input__inner {
    width: 200px;
  }
}
.upload {
  font-weight: 700;
  padding: 8px 24px;
  height: 32px;
  font-size: 14px;
  border-radius: 16px;
  border: none;
  color: #fff;
  background-color: #06a7ff;
}
.link-submit {
  text-align: center;
  padding-bottom: 12px;
}
.link_header {
  height: 48px;
  line-height: 48px;
  font-weight: 700;
  color: #06a7ff;
  padding: 0 20px;
}
.time_label {
  margin-left: 10px;
  color: #03081a;
}

.over_title {
  color: #06a7ff;
}
.over_title_d {
  margin-left: 4px;
  font-size: 12px;
  vertical-align: middle;
}
.link-info-url {
  margin-top: 19px;
  width: 390px;
  font-size: 13px;
}
.pwd_over {
  display: inline-block;
  margin-left: 8px;
  width: 94px;
  font-size: 13px;
}
.pwd_over_body {
  margin-top: 16px;
}
.over_time {
  margin-top: 12px;
  span {
    color: #06a7ff;
  }
}
</style>
