<script setup lang="ts">
import { computed } from 'vue'
import subView from '@/components/share/sub.vue'
import { storeToRefs } from 'pinia'
import { timestampToTime, getTimeUntilExpiration, getFileSuffix } from '@/utils'
import noneView from '@/components/share/none.vue'
import delFile from '@/components/home/del-file.vue'
import fileAction from '@/components/home/file-action.vue'
import { Tooltip, message } from 'ant-design-vue'
import { useLinkStore } from '@/stores/link'

const linkStore = useLinkStore()
linkStore.getList()

const { list, all, detail } = storeToRefs(linkStore)

const copyLinks = (data: any) => {
  let inputs = document.createElement('input') //创建节点
  inputs.value =
    window.location.origin + '/#/link/' + data.key + '?pwd=' + data.pwd //给节点赋值
  document.body.appendChild(inputs) //渲染节点(要不然不起作用,可以添加隐藏属性)
  inputs.select() //选中节点
  let actions = document.execCommand('Copy') //指定复制命令(返回的是一个boolean类型)
  actions && message.success('复制成功')
  inputs && inputs?.parentNode?.removeChild(inputs)
}

const clickItem = (item: any) => {
  item.is_active = !item.is_active
  linkStore.checkItem(item)
}

const title = computed(() => {
  return linkStore.activeNum > 1
    ? `共选中${linkStore.activeNum}个文件`
    : '分享详情'
})
</script>
<template>
  <main class="main">
    <sub-view />
    <div class="main-layout">
      <div class="pan__body">
        <div class="pan__body_header">
          <button
            class="upload u-button"
            v-if="all"
            @click="linkStore.allClose"
          >
            <X-cancel-link style="color: #fff" />
            取消分享
          </button>
          <div v-else>链接分享</div>
        </div>
        <div class="pan__body_file_header">
          <div class="file-header-title">
            <span class="cursor"> 全部文件 </span>
          </div>
        </div>
        <div class="share-link-body">
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
                        @click="linkStore.setAll"
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
                    @click="linkStore.handleClickitem(item)"
                  >
                    <td class="aichat-width">
                      <label
                        class="u-checkbox is-checked hide-checkbox"
                        :class="{
                          'is-checked': item.is_active
                        }"
                        @click.stop="clickItem(item)"
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
                            <div
                              v-if="item.is_dir == 2"
                              alt="share"
                              class="file-icon"
                              :class="`${getFileSuffix(item.name)}`"
                            ></div>
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
                                <Tooltip>
                                  <template #title>复制链接</template>
                                  <x-copy-link
                                    class="file-action-icon"
                                    @click="copyLinks(item)"
                                  />
                                </Tooltip>
                              </div>
                              <div style="margin-right: 5px">
                                <Tooltip>
                                  <template #title>取消分享</template>
                                  <x-cancel-link
                                    class="file-action-icon"
                                    @click="linkStore.closeLink(item.lid)"
                                  />
                                </Tooltip>
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
                            ? getTimeUntilExpiration(item.expire_at)
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
          <div class="share-info">
            <div class="detail__title">
              {{ title }}
            </div>
            <div v-if="linkStore.showDetails" class="nd-share-content">
              <div class="nd-share-content__divider title"></div>
              <div class="nd-share-content__title text-ellip">
                <img
                  src="https://staticwx.cdn.bcebos.com/mini-program/images/ic_image_v2.png"
                  class="nd-share-content__thumb"
                /><span>{{ detail?.name }}</span>
              </div>

              <div class="nd-share-content__item">
                <div class="nd-share-content__label">分享时间</div>
                <div class="nd-share-content__value">
                  {{ timestampToTime(detail?.create_at) }}
                </div>
              </div>
              <div class="nd-share-content__item">
                <div class="nd-share-content__label">有效期</div>
                <div class="nd-share-content__value">
                  {{
                    detail.expire_at != 0
                      ? getTimeUntilExpiration(detail?.expire_at)
                      : '永久有效'
                  }}
                </div>
              </div>
              <div class="nd-share-content__item">
                <div class="nd-share-content__label">提取码</div>
                <div class="nd-share-content__value">{{ detail?.pwd }}</div>
              </div>

              <div class="nd-share-content__divider"></div>
              <div class="nd-share-content__item">
                <div class="nd-share-content__label">浏览</div>
                <div class="nd-share-content__value">0次</div>
              </div>
              <!-- <div class="nd-share-content__item">
                <div class="nd-share-content__label">保存</div>
                <div class="nd-share-content__value">0次</div>
              </div>
              <div class="nd-share-content__item">
                <div class="nd-share-content__label">下载</div>
                <div class="nd-share-content__value">0次</div>
              </div> -->
            </div>
            <div v-if="linkStore.showNone">
              <div class="nd-detail__empty">
                <img
                  src="https://nd-static.bdstatic.com/m-static/v20-main/home/img/empty-folder.55c81ea2.png"
                  class="img"
                />
                <p>选中文件，查看详情</p>
              </div>
              <div></div>
            </div>
            <div v-if="linkStore.activeNum > 1">
              <div class="nd-detail__img bg">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUxpcf/MOv/OP//JNP/DKf+4EP/XUP/CKf+6Ff++Hf/RQ//VS//TR//aVf+3Ef+9FP+5A//DJP/fi//14P/ln/+xDf/dZ//ief/Rcf/pvP/GSpk9oQ4AAAAKdFJOUwD////H4/8in2nKcBCgAAAER0lEQVR42u2ai5LbKgyGCyRO4luabb2393/QY5AAgbEtEtxp5/BjY4Ftfb/Y7Uy64cePqqqqqqqqqqqqqr9Xlx0dC79+gt4TGlDN6XYU/tSgull91xu1s2QrQQJ0jIWbTq2EcnrottBdt/sBDm4u+5zfKxgQXYuv/z1Tp8IGThzoSAfnS/kFGM05Yjgumg3gUtTBFdIHmAVZH+OIgY7Pp+u2bpecnwBwgGARlgpof2XrzPz3ct5Kkk0NdGWtwniQJr0Il+IGJsg8dxPEeMGINt2dcgxMySIcdbKxHs39NFGSmZzspI2mifF7gJmhv38X0IOYOO8bIOa/v34V0df35HRjGLDr9jm/GiZaBMHEF70XPvLpDFx5BqD+Hf3+4sutwZlv4O13Qb25tGwDj7eiemQbUJ9FpdgGrOXNBdXH3Nb0AS2Q/UC5a2CFuAFcwoBozveP6BMtewU2UhPGu2WEnGFu+sOzDgb3Kdpo10AaZCgfEQLbAIyQs6pdAzFk4OcuY2A4WP8nAw02F5hBGQNNENjOAAJc4AGeyTXQBDyM4qqww7DBx+F/l/ioE89AQywTFBwwh7nd/ZSGMBxYBvw6Do09B09LZvfjhZWFs30DmxpY88NGBs4KYIJhP9sTenEF/iEDnTlt37lLIQMddoBoKMK0jj4HT+KdfAPdMj/++YjAuw4ZcC7kJ1kGOsJ1C9hgZQlCE2Gtp5SbXQNYS/DusjCHTNa7Vj3XwGpl26l5yjJQBlnUQIZ6e+11CH/rnMNSBnpPoLzesxAYj5430Ls+lTsWFB4OjXYN9Ijo+o1S/LBbsFJeiBgG4jr6Lq7iFeUZOEB/wkA7N+jshB60oFIGWne2kB55COo9MVKGgTauqsVaTB8AVmCu8j7HQJjSlriufsdD7goE8AWoz4I9a+BFBJF82sCTMAOUUuovt2zgbkkTPG9AuqtNKm2MAxgbrI/d92wotgGbW+e1V4llQU4kShz4aKGWRAwD7pXWv2sv5JtDuYVc166BTfsFxDOAP8AixJdXoJAEdkcbENgLiIWbsN2LBgTphEMIC6Yx3jb3iTgGSIIwuSRTcBHCViuEPROSruMYEIKsIg6EryhKu0Kjo7wViJLIRHoZLKtcdZIUywCumIyrklmoFwwcqT9hQJn9F+ZqAmUvuhUxoHxPIBSjhMcGLyiWAfI8JbrSRFiWOUxoNp74DSjCHjjSEcOAogBPoSQY+7QujnF2zu+J2TdgagCS5TgEzCvCIKWKBU4EliDYNaBUgFCkPEGwIp5WKnhzmQYD3grgUtMlTCBU2um29rdwPJWWrf0dBFd1qPa/vL68injg1q/0BjDGJo5TDiO1x2xFZmsYZ9/XJdjCls94rG87Y+54um0AMP/jzt3v9VM3J+ZWolvWXrZxDCHrGtlb/y7nGMFlbOmUs+Pscj3/LCrmNqqsTa05qluEq6qqqqqqqqqq/mL9B15hMo40ijfcAAAAAElFTkSuQmCC"
                  alt="folder"
                  class="category u-file-icon u-file-icon--grid"
                />
              </div>
            </div>
          </div>
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
      flex: 1;
      // height: calc(100% - 40px);
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
          background: url('/src/assets/img/qita.png');
          background-size: cover !important;
          display: inline-block;
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
.share-link-body {
  display: flex;
  height: calc(100% - 40px);
}
.share-info {
  width: 272px;
  margin: 0 16px;
  height: 95%;
  background: #f5f6fa;
  padding: 16px 24px 24px 24px;
  border-radius: 8px;
  position: relative;
}
.detail__title {
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  color: #03081a;
  font-weight: 600;
  padding-bottom: 15px;
}
.nd-share-content__divider.title {
  margin: 0;
}
.nd-share-content__divider {
  border-bottom: 1px solid #d4d7de;
}
.nd-share-content__title {
  padding: 15px 0 7px;
  width: 100%;
  font-size: 14px;
}
.text-ellip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nd-share-content__thumb {
  width: 20px;
  height: 20px;
}
.nd-share-content__item {
  padding: 7px 0;
  line-height: 20px;
}
.nd-share-content__label {
  color: #878c9c;
}
.nd-detail__empty {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  text-align: center;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.nd-detail__empty img {
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
}
.nd-detail__empty p {
  color: #818999;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
}
.nd-detail__img.bg {
  background: rgba(214, 220, 224, 0.15);
}
.nd-detail__img {
  width: 100%;
  min-height: 134px;
  border-radius: 13px;
  position: relative;
}
.nd-detail__img .category {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 128px;
  height: 128px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border-radius: 12.8px;
}
.u-file-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
