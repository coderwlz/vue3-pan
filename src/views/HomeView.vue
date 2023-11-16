<script setup lang="ts">
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime, getFileSuffix } from '@/utils'
import noneView from '@/components/home/none.vue'
import subView from '@/components/home/sub.vue'
import mainHeader from '@/components/home/main-header.vue'
import delFile from '@/components/home/del-file.vue'
import fileAction from '@/components/home/file-action.vue'
import addLink from '@/components/home/add-link.vue'
import { preview } from 'v-preview-image'
import { Dropdown, Menu } from 'ant-design-vue'

const MenuItem = Menu.Item

const fileStore = useFileStore()
fileStore.getList()
const { list, path, parent_id, all, category, urlList, imgList } =
  storeToRefs(fileStore)
const img_type = ['gif', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'png', 'svg']
const openImg = (current: any, list: any) => {
  preview(current, list)
}

const hideMenu = (item: any) => {
  if (!item.menuHover) {
    item.showMenu = false
  }
}
</script>

<template>
  <main class="main">
    <sub-view />
    <div class="main-layout">
      <main-header />
      <div class="pan__body" v-if="category != '5'">
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
                      class="u-checkbox is-checked hide-checkbox"
                      :class="{
                        'is-checked': all
                      }"
                      @click="fileStore.setAll"
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
                <Dropdown
                  v-for="item in list"
                  :key="item.id"
                  :trigger="['contextmenu']"
                >
                  <tr
                    class="table-body-row cursor"
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
                        <div draggable="true" style="overflow: hidden">
                          <div
                            style="
                              width: calc(100% - 150px);
                              display: inline-block;
                            "
                          >
                            <img
                              v-if="img_type.includes(getFileSuffix(item.name))"
                              :src="`/w/api/thumbnail?id=${item.id}`"
                              alt="share"
                              class="file-icon"
                            />
                            <img
                              v-else-if="item.is_dir == 2"
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
                                <button @click="fileStore.addFolerOnOk">
                                  √
                                </button>
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
                                @click="fileStore.openCreateLink(item)"
                              >
                                <x-fenxiang class="file-action-icon" />
                              </div>
                              <div
                                v-if="item.is_dir == 2"
                                style="margin-right: 5px"
                                @click="fileStore.download(item.id)"
                              >
                                <x-download class="file-action-icon" />
                              </div>
                              <div
                                style="margin-right: 5px"
                                @click="fileStore.openDelModel(item.id)"
                              >
                                <x-shanchu class="file-action-icon" />
                              </div>
                              <div
                                style="margin-right: 5px"
                                @click="fileStore.openActionModel(item.id, 1)"
                              >
                                <x-fuzhi class="file-action-icon" />
                              </div>
                              <div
                                style="margin-right: 5px"
                                @click="fileStore.openActionModel(item.id, 2)"
                              >
                                <x-yidong class="file-action-icon" />
                              </div>
                              <div
                                v-if="item.is_dir == 2"
                                style="margin-right: 5px"
                                @click="fileStore.openFileView(item)"
                              >
                                <x-dakai class="file-action-icon" />
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
                        {{ item.is_dir == 1 ? '-' : sizeTostr(item.size) }}
                      </section>
                    </td>
                  </tr>
                  <template #overlay>
                    <Menu>
                      <menu-item key="1">打开</menu-item>
                      <menu-item key="2">移动</menu-item>
                      <menu-item key="3">3rd menu item</menu-item>
                    </Menu>
                  </template>
                </Dropdown>
              </tbody>
            </table>
          </div>
          <none-view v-else />
        </div>
      </div>
      <div class="pan__body" v-else>
        <div class="img_body">
          <div
            class="content-item"
            v-for="(item, index) in imgList"
            @click="openImg(index, urlList)"
            :key="item.id"
          >
            <div
              class="img-container"
              :style="{
                'background-image': `url(${item.src})`
              }"
            ></div>

            <div @mouseover="item.showMenu = true" @mouseleave="hideMenu(item)">
              <x-qita class="content-item_ation" />

              <div
                v-show="item.showMenu"
                class="action_g"
                @mouseover="item.menuHover = true"
                @mouseleave="item.menuHover = false"
              >
                <div class="g_box_item" @click="fileStore.download(item.id)">
                  下载
                </div>
                <div
                  class="g_box_item"
                  @click="fileStore.openActionModel(item.id, 1)"
                >
                  复制
                </div>
                <div
                  class="g_box_item"
                  @click="fileStore.openActionModel(item.id, 2)"
                >
                  移动
                </div>
                <div
                  class="g_box_item"
                  @click="fileStore.openDelModel(item.id)"
                >
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <del-file />
  <file-action />
  <add-link />
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
            width: calc(100% - 32px);
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
            position: absolute;
            right: 0px;
            top: 0px;
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
  .img_body {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: 20px 10px 0px;
    overflow-y: auto;
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

.content-item {
  display: block;
  width: 128px;
  height: 128px;
  line-height: 128px;
  margin: 0 5px 5px 0;
  outline: none;
  text-align: center;
  background: #f1f1f1;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  position: relative;
  .img-container {
    width: 100%;
    height: 100%;
    -webkit-transition: opacity 0.15s linear;
    transition: opacity 0.15s linear;
    background-position: 50%;
    background-repeat: no-repeat;
  }
}
.content-item:hover .content-item_ation {
  display: block;
}
.content-item_ation {
  display: none;
  position: absolute;
  top: 2px;
  right: 6px;
  width: 16px;
  height: 16px;
  color: #06a7ff;
}
.action_g {
  position: absolute;
  top: 15px;
  right: 2px;
  width: 74px;
  height: 140px;
  padding: 6px 0;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}
.g_box_item {
  height: 32px;
  padding-left: 2px;
  line-height: 32px;
  &:hover {
    background: #f1f1f1;
  }
}
</style>
