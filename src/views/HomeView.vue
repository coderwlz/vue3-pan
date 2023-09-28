<script setup lang="ts">
import { ref } from 'vue'
import { useUploaderStore } from '@/stores/uploader'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime } from '@/utils'
import noneView from '@/components/home/none.vue'
import subView from '@/components/home/sub.vue'
import mainHeader from '@/components/home/main-header.vue'
import delFile from '@/components/home/del-file.vue'
import fileAction from '@/components/home/file-action.vue'
const uploaderStore = useUploaderStore()

const fileStore = useFileStore()
fileStore.getList()
const { list, path, parent_id } = storeToRefs(fileStore)
</script>

<template>
  <main class="main">
    <sub-view />
    <div class="main-layout">
      <main-header />
      <div class="pan__body">
        <div class="pan__body_file_header">
          <div class="file-header-title">
            <span
              class="cursor"
              :class="{
                all: parent_id != ''
              }"
              @click="fileStore.openFoler('')"
            >
              全部文件
            </span>
            <span
              v-for="item in path"
              class="cursor all"
              :class="{
                'item-active': parent_id == item.id
              }"
              :key="item.id"
              @click="fileStore.openFoler(item.id, item.name)"
            >
              > {{ item.name }}</span
            >
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
                      ><span
                        ><span></span
                        ><input
                          type="checkbox"
                          aria-hidden="false"
                          class="u-checkbox__original"
                          value="" /></span
                    ></label>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>文件名</span>
                      <div><i></i><i></i></div>
                    </div>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>修改时间</span>
                      <div></div>
                    </div>
                  </th>
                  <th class="table-header-th">
                    <div>
                      <span>大小</span>
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
                >
                  <td class="aichat-width">
                    <input
                      type="checkbox"
                      aria-hidden="false"
                      class="w-checkbox"
                      value=""
                    />
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
                          <a
                            class="filename text-ellip"
                            v-if="!item.is_edit"
                            :title="item.name"
                            @click="fileStore.openFoler(item.id, item.name)"
                          >
                            {{ item.name }}
                          </a>
                          <div v-else class="item-action">
                            <div class="action-edit">
                              <input
                                type="text"
                                class="u-input__inner"
                                v-model="item.name"
                              />
                              <button @click="fileStore.addFolerOnOk">√</button>
                              <button @click="fileStore.addFolerClose">
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="file-action">
                          <div style="display: flex">
                            <div
                              style="margin-right: 5px"
                              @click="fileStore.download(item.id)"
                            >
                              下
                            </div>
                            <div
                              style="margin-right: 5px"
                              @click="fileStore.openDelModel(item.id)"
                            >
                              删
                            </div>
                            <div
                              style="margin-right: 5px"
                              @click="fileStore.openActionModel(item.id, 1)"
                            >
                              复
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
                    <section class="">{{ sizeTostr(item.size) }}</section>
                  </td>
                </tr>
                <!-- <tr class="table-body-row selected cursor">
                  <td class="aichat-width">
                    <input
                      type="checkbox"
                      aria-hidden="false"
                      class="w-checkbox"
                      value=""
                    />
                  </td>
                  <td class="pan-table_td">
                    <div>
                      <div draggable="true">
                        <div>
                          <img
                            src="/src/assets/img/folder.png"
                            alt="share"
                            class="file-icon"
                          />
                          <a title="共享给我的文件夹"> 共享给我的文件夹 </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="pan-table_td">
                    <div class="wp-s-pan-list__time-column">
                      <p class="">-</p>
                    </div>
                  </td>
                  <td class="pan-table_td">
                    <section class="">-</section>
                  </td>
                </tr> -->
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
</style>
