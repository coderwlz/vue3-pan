<script setup lang="ts">
import { useFileActions } from '@/hooks/useFileActions'
import { fileCopy } from '@/service/modules/file'
import useCurrentInstance from '@/hooks/useCurrentInstance'

const { $message } = useCurrentInstance()

const emits = defineEmits(['close'])

const props = defineProps(['cId', 'showModel'])

const { list, openFoler, success, level } = useFileActions({
  cId: props.cId,
  ok: async (cId: any, target_id: any) => {
    try {
      await fileCopy(cId, target_id)
      $message.success('保存成功')
      close()
    } catch (e) {
      $message.error('保存失败')
    }
  }
})

const close = () => {
  emits('close')
}
</script>
<template>
  <div
    class="u-dialog__wrapper nd-dialog-common-header nd-folder-selector-dialog"
    style="z-index: 2001"
    v-if="showModel"
    @click.self="close"
  >
    <div class="u-dialog u-dialog__mini" style="top: 229.5px; width: 720px">
      <div class="u-dialog__header">
        <div class="nd-folder-selector-dialog__title">保存文件</div>
        <button type="button" aria-label="Close" class="u-dialog__headerbtn">
          <i class="u-dialog__close u-icon u-icon-close"></i>
        </button>
      </div>
      <div class="u-dialog__body">
        <div class="nd-folder-selector-dialog__body">
          <div class="nd-folder-selector-dialog__selector-wrapper">
            <div class="nd-file-selector__body">
              <div class="nd-file-selector__nav">
                <div class="nd-file-selector__nav-left">
                  <div class="nav-item-group">
                    <span
                      class="nd-file-selector__nav-item cursor"
                      @click="openFoler('')"
                    >
                      全部文件
                    </span>
                    <span
                      class="nd-file-selector__nav-item"
                      v-for="item in level"
                      :key="item?.id"
                      @click="openFoler(item.id, item.name)"
                    >
                      <div class="nd-file-selector__nav-item-l">></div>
                      {{ item.name }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="nd-file-selector__list">
                <div class="nd-table">
                  <div
                    class="nd-table__body mouse-choose-list"
                    v-if="list && list.length > 0"
                  >
                    <table class="nd-table__body-table mouse-choose-box">
                      <colgroup>
                        <col width="100%" />
                      </colgroup>
                      <tbody>
                        <tr
                          class="nd-table__body-row mouse-choose-item"
                          v-for="item in list"
                          :key="item.id"
                          @click.stop="openFoler(item.id, item.name)"
                        >
                          <td class="text-ellip nd-table__td">
                            <div class="nd-list-name cursor-p">
                              <div
                                class="pointer-events-all cursor-p"
                                draggable="true"
                              >
                                <img
                                  src="https://staticwx.cdn.bcebos.com/mini-program/images/ic_file2.png"
                                  class="nd-list-name__title-icon img-before-icon iconfont icon-pure-color"
                                /><a
                                  :title="item.name"
                                  class="nd-list-name__title-text inline-block-v-middle text-ellip"
                                >
                                  {{ item.name }}
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    v-if="list && list.length == 0"
                    class="nd-table__body-empty"
                  >
                    <div class="nd-folder-selector__empty">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAflBMVEUAAAD/137/zF3/7sv/7sz/8Mz/78z/ylj/78z/1Xv/8Mz/8tH/8MH/1n3/133/7sv/7sz/1X7/78z/1X7/78z/1X7/13//78z/1oD/3YP/14D/8sv/1oD/887/xUn+1X3/7sv/14H+x03/z2f+1Hf+yFL+zWD+0nL+0G3+yliWAl5hAAAAHnRSTlMAbf33xUH7+5aTWiYI9vLx5N3bxK+shXxkSkA7MhWzZ/O0AAABAUlEQVRYw+3TWW6DQBBFUQJ4SOzM8/Tc6QnY/wazATdYtO5f3QUclUp6jWVZlkW16TtXavu0P1TIbr7uZjXdu6U2a+lukX44rqTdcu8cff+L0W7P0dsDRrsXjnbfHN1ztFuzyb/Lurs628fPDK0LC6fzvR6raX8q9FZNKxfox3rax4JdT6vlaA0cPXG0Ro5OHK3A0Z6jFTjaR4xW5mhFjp44WgNHJ47WyNGJoxU42nO0Mkf7iNFqOVoDR08crZGjE0crcLTnaAWO9hGjlTlakaMnjtbA0YmjNXJ04mgFjvYcrTxD+8qz422R3qmu8Fykr2vpr6Zs72p+0n42lmVZFtQ/4NqoU3Oa6doAAAAASUVORK5CYII="
                        class="nd-folder-selector__empty-icon"
                      />
                      <p class="nd-folder-selector__empty-text">暂无文件夹</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="nd-dialog-common-footer nd-folder-selector-dialog__footer"
          >
            <button
              type="button"
              class="u-button nd-second-primary-btn nd-btn-fix-size-middle u-button--week u-button--medium is-round"
              @click="close"
            >
              <span>取消</span></button
            ><button
              type="button"
              class="u-button nd-btn-fix-size-middle u-button--primary u-button--medium is-round"
              @click="success"
            >
              <span>保存到此</span>
            </button>
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
.nd-folder-selector-dialog .u-dialog__body {
  padding: 0;
}
.u-dialog__body,
.u-dropdown {
  color: #606266;
  font-size: 14px;
}
.u-dialog__body {
  word-break: break-all;
}
.nd-folder-selector-dialog__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
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
.nd-folder-selector-dialog__selector-wrapper {
  height: 340px;
}
.nd-folder-selector-dialog__footer {
  padding: 24px 24px 24px 0;
  text-align: right;
}
.nd-file-selector__body {
  height: 100%;
}
.nd-file-selector__nav {
  background-color: #fafafc;
  border-radius: 4px 4px 0 0;
  height: 40px;
  line-height: 40px;
  border-bottom-width: 0;
  overflow: hidden;
  padding: 0 14px 0 24px;
  color: #afb3bf;
}
.nd-file-selector__nav-left {
  float: left;
}
.nd-file-selector__nav-left .nav-item-group {
  display: inline-block;
}
.nd-file-selector__nav-item {
  display: inline-block;
  cursor: pointer;
  font-size: 12px;
}
.nd-file-selector__list {
  height: calc(100% - 40px);
}
.nd-table {
  height: 100%;
}
.nd-table__body {
  height: 100%;
  overflow: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.nd-table__body-table {
  width: 100%;
  table-layout: fixed;
  color: #424e67;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.nd-table td,
.nd-table th,
.nd-table tr {
  line-height: 1;
}
.nd-table__body-row {
  border-bottom: 1px solid #f9f9f9;
  height: 50px;
  line-height: 50px;
  color: #03081a;
  font-size: 12px;
}
.nd-table__td {
  position: relative;
}
.nd-folder-selector-dialog .nd-list-name {
  padding-left: 24px;
}
.cursor-p {
  cursor: pointer;
}
.pointer-events-all {
  pointer-events: all;
}
.nd-list-name__title-icon.iconfont {
  font-size: 22px;
}
.nd-list-name__title-icon {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  position: relative;
  color: hsla(0, 0%, 74.1%, 0.28);
  line-height: 1;
}
.img-before-icon {
  position: relative;
  overflow: hidden;
}
.nd-list-name__title-text {
  padding-left: 5px;
  line-height: 40px;
  max-width: calc(100% - 3.66032vw);
}
.nd-list-name__title-text {
  color: #03081a;
}
.inline-block-v-middle {
  display: inline-block;
  vertical-align: middle;
}
.nd-table__body-row:hover {
  background-color: #f7f9fc;
  border-color: #f7f9fc;
}
.u-button--medium,
.u-button--medium.is-round {
  padding: 10px 36px;
}
.u-button.is-round {
  border-radius: 20px;
  padding: 12px 36px;
}
.u-button {
  font-weight: 700;
}
.u-button--week {
  color: #06a7ff;
  background-color: #f2faff;
  border-color: #f2faff;
}
.u-button--large,
.u-button--medium {
  font-size: 14px;
  border-radius: 4px;
}
.u-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 36px;
  font-size: 14px;
  border-radius: 4px;
}
.nd-dialog-common-footer .u-button + .u-button {
  margin-left: 24px;
}
.u-button--medium,
.u-button--medium.is-round {
  padding: 10px 36px;
}
.u-button--primary {
  color: #fff;
  background-color: #06a7ff;
  border-color: #06a7ff;
}
.nd-table__body-empty {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  overflow: auto;
}
.nd-folder-selector__empty {
  padding: 90px;
  text-align: center;
}
.nd-folder-selector__empty-icon {
  width: 90px;
  height: auto;
}
.nd-folder-selector__empty-text {
  font-size: 14px;
  color: #afb3bf;
  line-height: 18px;
  margin-top: 8px;
}
.nd-file-selector__nav-item:last-child {
  color: #06a7ff;
}
.nd-file-selector__nav-item-l {
  display: inline-block;
  margin-left: 5px;
}
</style>
