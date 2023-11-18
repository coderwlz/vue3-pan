<script setup lang="ts">
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
const fileStore = useFileStore()

const { openDel } = storeToRefs(fileStore)
</script>
<template>
  <div class="nd-delete" v-if="openDel" @click="fileStore.handleCloseDel">
    <div
      class="u-dialog__wrapper nd-dialog-common-header"
      style="z-index: 2049"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="确定删除"
        class="u-dialog u-dialog__mini"
        style="top: 344.5px; width: 464px"
      >
        <div class="u-dialog__header">
          <span class="u-dialog__title">确定删除</span
          ><button type="button" aria-label="Close" class="u-dialog__headerbtn">
            <i class="u-dialog__close u-icon u-icon-close"></i>
          </button>
        </div>
        <div class="u-dialog__body">
          <div class="nd-dialog-common-body nd-delete__tip">
            <img
              src="data:image/png;base64,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"
              class="nd-delete__tip-warn-icon"
            />
            <p class="nd-delete__tip-confirm">确定删除所选的文件吗？</p>
            <p class="nd-delete__svip-text">
              删除的文件可在35天内通过回收站还原
            </p>
          </div>
        </div>
        <div class="u-dialog__footer">
          <div class="nd-dialog-footer-center">
            <div>
              <button
                type="button"
                class="u-button nd-delete__action-item u-button--week u-button--medium is-round"
                @click="fileStore.handleCloseDel"
              >
                <span>取消</span></button
              ><button
                type="button"
                class="u-button nd-delete__action-item u-button--primary u-button--medium is-round"
                @click="fileStore.handDelFile"
              >
                <span>删除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.u-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background-color: rgba(85, 85, 85, 0.4);
}
.nd-dialog-common-header .u-dialog {
  border-radius: 12px;
}
.u-dialog {
  position: relative;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}
.nd-dialog-common-header .u-dialog__header {
  -webkit-box-shadow: 0 1px 0 0 #f5f6fa;
  box-shadow: 0 1px 0 0 #f5f6fa;
  position: relative;
  font-weight: 700;
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
.u-dialog__body {
  padding: 0 24px;
}
.u-dialog__body,
.u-dropdown {
  color: #606266;
  font-size: 14px;
}
.u-dialog__body {
  word-break: break-all;
}
.nd-delete .u-dialog__footer {
  padding-top: 24px;
}
.u-dialog__footer {
  padding: 24px 24px 32px 24px;
}
.u-dialog__footer {
  text-align: center;
}
.nd-dialog-common-header .u-dialog__title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 18px;
  font-weight: 700;
}
.nd-dialog-common-header .u-dialog__headerbtn {
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.nd-dialog-common-header .u-dialog__headerbtn {
  right: 24px;
  color: #979797;
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
.nd-delete__tip {
  text-align: center;
}
.nd-dialog-common-body {
  margin-top: 32px;
  text-align: center;
  color: #424e67;
}
.nd-delete__tip-confirm {
  margin-top: 12px;
  margin-bottom: 4px;
}
.nd-delete__svip-text {
  color: #ca963b;
}
.nd-dialog-footer-center {
  text-align: center;
}
.u-button--medium,
.u-button--medium.is-round {
  padding: 10px 36px;
}
.u-button.is-round {
  border-radius: 20px;
  padding: 12px 36px;
}
.nd-delete__action-item {
  width: 128px;
}
.u-button {
  font-weight: 700;
}
.u-button--week {
  color: #06a7ff;
  background-color: #f2faff;
  border-color: #f2faff;
}
.u-button--medium {
  font-size: 14px;
}
.nd-delete__action-item + .nd-delete__action-item {
  margin-left: 20px;
}
.u-button--primary {
  color: #fff;
  background-color: #06a7ff;
  border-color: #06a7ff;
}
.nd-delete__tip-warn-icon {
  width: 50px;
  height: auto;
}
</style>
