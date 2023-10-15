<script setup lang="ts">
import { ref } from 'vue'
import subView from '@/components/share/sub.vue'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime } from '@/utils'
import noneView from '@/components/share/none.vue'
import delFile from '@/components/home/del-file.vue'
import fileAction from '@/components/home/file-action.vue'

import { useLinkStore } from '@/stores/link'

const linkStore = useLinkStore()
linkStore.getList()

const { list, all } = storeToRefs(linkStore)

const copyLinks = (data: any) => {
  let inputs = document.createElement('input') //创建节点
  inputs.value =
    window.location.origin + '#/link/' + data.key + '?pwd=' + data.pwd //给节点赋值
  document.body.appendChild(inputs) //渲染节点(要不然不起作用,可以添加隐藏属性)
  inputs.select() //选中节点
  let actions = document.execCommand('Copy') //指定复制命令(返回的是一个boolean类型)
  // actions && Message({ type: 'success', message: '复制成功' })
  inputs && inputs?.parentNode?.removeChild(inputs)
}
</script>
<template>
  <main class="main">
    <sub-view />
    <div class="main-layout">
      <div class="pan__body">
        <div class="pan__body_header">
          <button class="upload u-button" v-if="all">
            <X-cancel-link style="color: #fff" @click="linkStore.allClose" />
            取消分享
          </button>
          <div v-else>链接分享</div>
        </div>
        <div class="pan__body_file_header">
          <div class="file-header-title">
            <span class="cursor"> 全部文件 </span>
          </div>
        </div>
        <div class="pan-table">
          <div class="pan-table-header" v-if="list.length">
            <table style="width: 100%">
              <colgroup>
                <col width="8%" />
                <col width="45%" />
                <col width="23%" />
                <col width="22%" />
              </colgroup>
              <thead>
                <tr class="table-header-row">
                  <th class="table-header-select">
                    <label
                      class="u-checkbox is-checked hide-checkbox"
                      :class="{
                        'is-checked': all
                      }"
                      ><span
                        class="u-checkbox__input w-checkbox"
                        :class="{
                          'is-checked': all
                        }"
                        ><span class="u-checkbox__inner"></span></span
                    ></label>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>分享文件</span>
                      <div><i></i><i></i></div>
                    </div>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>分享时间</span>
                      <div></div>
                    </div>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>过期时间</span>
                      <div></div>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="pan-table-body" v-if="list.length">
            <table style="width: 100%">
              <colgroup>
                <col width="8%" />
                <col width="45%" />
                <col width="23%" />
                <col width="22%" />
              </colgroup>
              <tbody>
                <tr
                  class="table-body-row cursor"
                  v-for="item in list"
                  :key="item.id"
                  :class="{
                    selected: item.is_active
                  }"
                >
                  <td class="aichat-width">
                    <label
                      class="u-checkbox is-checked hide-checkbox"
                      :class="{
                        'is-checked': item.is_active
                      }"
                      @click="item.is_active = !item.is_active"
                      ><span
                        class="u-checkbox__input w-checkbox"
                        :class="{
                          'is-checked': item.is_active
                        }"
                        ><span class="u-checkbox__inner"></span></span
                    ></label>
                  </td>
                  <td class="pan-table_td">
                    <div>
                      <div draggable="true" style="display: flex">
                        <div style="flex: 1">
                          <img
                            v-if="item.is_dir == 2"
                            src="/src/assets/img/qita.png"
                            alt="share"
                            class="file-icon"
                          />
                          <img
                            v-else
                            src="/src/assets/img/folder.png"
                            alt="share"
                            class="file-icon"
                          />
                          <a class="filename text-ellip" :title="item.name">
                            {{ item.name }}
                          </a>
                        </div>
                        <div class="file-action">
                          <div style="display: flex">
                            <div style="margin-right: 5px">
                              <x-copy-link
                                class="file-action-icon"
                                @click="copyLinks(item)"
                              />
                            </div>
                            <div style="margin-right: 5px">
                              <x-cancel-link
                                class="file-action-icon"
                                @click="linkStore(item.lid)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="pan-table_td">
                    <div class="wp-s-pan-list__time-column">
                      <p class="">{{ timestampToTime(item.create_at) }}</p>
                    </div>
                  </td>
                  <td class="pan-table_td">
                    <section class="">
                      {{
                        item.expire_at != 0
                          ? timestampToTime(item.expire_at)
                          : '永久有效'
                      }}
                    </section>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <none-view v-else />
        </div>
      </div>
    </div>
  </main>
  <del-file />
  <file-action />
</template>
<style scoped lang="less">
.main {
  height: 100%;
}
.main-layout {
  height: 100%;
  display: inline-block;
  width: calc(100% - 200px);
  overflow: auto;
  .pan__body {
    height: calc(100% - 60px);
    .pan__body_file_header {
      position: relative;
      border-radius: 4px 4px 0 0;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      padding: 0 0 0 24px;
      display: flex;
      margin-top: 10px;
      .file-header-title {
        font-size: 12px;
        color: #03081a;
        font-weight: 700;
        .all {
          color: #06a7ff;
          &.item-active {
            color: #818999;
          }
        }
      }
    }
    .pan-table {
      height: calc(100% - 40px);
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      .pan-table-header {
        .table-header-row {
          height: 50px;
          line-height: 50px;
          color: #818999;
          text-align: left;
          font-size: 12px;
          .table-header-select {
            padding-left: 0;
            width: 80px;
            text-align: center;
          }
          .table-header-th {
            line-height: 1;
            cursor: pointer;
            border-bottom: 1px solid #f7f8fa;
          }
        }
      }
      .pan-table-body {
        height: calc(100% - 58px);
        position: relative;
        overflow: auto;
        user-select: none;
        .table-body-row {
          height: 50px;
          line-height: 50px;
          color: #03081a;
          font-size: 12px;
          .aichat-width {
            padding-left: 0;
            width: 80px;
            text-align: center;
          }
          &:hover {
            background-color: #f7f9fc;
            border-color: #f7f9fc;
          }
          &:hover .w-checkbox {
            visibility: visible;
          }
          .w-checkbox {
            visibility: hidden;
          }
          &.selected .w-checkbox {
            visibility: visible;
          }
          &.selected {
            background: #f2faff;
          }
          .item-action {
            display: inline-block;
            height: 24px;
            .action-edit {
              display: flex;
              height: 24px;

              input {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                outline: 0;
                border-color: #06a7ff;
              }
              button {
                background-color: #06a7ff;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                color: #fff;
                outline: 0;
                border: none;
                margin-left: 8px;
                cursor: pointer;
              }
            }
          }

          .filename {
            width: 84%;
            display: inline-block;
            &:hover {
              color: #06a7ff;
            }
          }
          &:hover .file-action {
            display: block;
          }
          .file-action {
            display: none;
          }
        }
        .file-icon {
          width: 32px;
          height: 32px;
        }
        .pan-table_td {
          border-bottom: 1px solid #f7f8fa;
          position: relative;
        }
      }
    }
  }
}
.file-action-icon {
  display: inline-block;
  width: 20px;
  font-size: 15px;
}
.u-checkbox {
  color: #03081a;
  font-size: 14px;
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.u-checkbox__input {
  cursor: pointer;
  outline: 0;
  line-height: 1;
  vertical-align: middle;
  display: inline-block;
  position: relative;
  white-space: nowrap;
}
.u-checkbox__input.is-checked .u-checkbox__inner {
  background-color: #06a7ff;
  border-color: #06a7ff;
}
.u-checkbox__inner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  background-color: #fff;
  z-index: 1;
  vertical-align: top;
  transition:
    border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.u-checkbox__input.is-checked .u-checkbox__inner:after {
  transform: rotate(45deg) scaleY(1);
}
.u-checkbox__inner:after {
  box-sizing: content-box;
  content: '';
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 5px;
  position: absolute;
  top: 2px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
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
.pan__body_header {
  margin-top: 18px;
  padding-left: 22px;
  height: 32px;
  line-height: 32px;
}
</style>
