<script setup lang="ts">
import { ref } from 'vue'
import { useUploaderStore } from '/src/stores/uploader'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime } from '@/utils'
const uploaderStore = useUploaderStore()

const fileStore = useFileStore()
fileStore.getList()
const { list } = storeToRefs(fileStore)
const isOpen = ref(true)

const type_list = ref([
  {
    title: '文档',
    icon: 'x-wendang',
    show: true
  },
  {
    title: '视频',
    icon: 'x-shipin',
    show: true
  },
  {
    title: '音频',
    icon: 'x-audio',
    show: true
  },
  {
    title: '其他',
    icon: 'x-qita',
    show: true
  },
  {
    title: '图片',
    icon: 'x-tupian',
    show: true
  }
])
</script>

<template>
  <main class="main">
    <div class="sub">
      <div class="sub-top">
        <div class="file-list">
          <div class="all cursor is-active">
            <x-xiala
              class="my-icon"
              :class="{
                'is-open': !isOpen
              }"
              @click="isOpen = !isOpen"
            />
            我的文件
          </div>
          <div class="file-list-body" v-if="isOpen">
            <template v-for="item in type_list" :key="item.title">
              <div v-if="item.show" class="file-item cursor">
                <x-wendang v-if="item.icon == 'x-wendang'" class="icon" />
                <x-shipin v-if="item.icon == 'x-shipin'" class="icon" />

                <x-audio v-if="item.icon == 'x-audio'" class="icon" />

                <x-qita v-if="item.icon == 'x-qita'" class="icon" />
                <x-tupian v-if="item.icon == 'x-tupian'" class="icon" />

                {{ item.title }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="sub-bottom"></div>
    </div>
    <div class="main-layout">
      <div class="main-header-tool">
        <div class="main-header-tool-left">
          <button class="upload u-button" @click="uploaderStore.open">
            上传
          </button>
        </div>
        <div class="main-header-tool-right">
          <div class="wp-s-search">
            <div
              class="u-input u-input--primary u-input--small u-input--suffix"
            >
              <input
                type="text"
                autocomplete="off"
                placeholder="搜索我的文件"
                class="u-input__inner"
              /><span class="u-input__suffix"
                ><span class="u-input__suffix-inner"
                  ><p>
                    <span class="wp-s-search__search-text"> 搜索 </span>
                  </p></span
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="pan__body">
        <div class="pan__body_file_header">
          <div class="file-header-title">全部文件</div>
        </div>
        <div class="pan-table">
          <div class="pan-table-header">
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
          <div class="pan-table-body">
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
                      <div draggable="true">
                        <div>
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
                          <a :title="item.name"> {{ item.name }} </a>
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
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped lang="less">
.my-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  position: relative;
  top: -1px;
}
.icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 3px;
  position: relative;
  top: -2px;
}
.is-open {
  transform: rotateZ(270deg);
}
.main {
  height: 100%;
}
.main-layout {
  height: 100%;
  display: inline-block;
  width: calc(100% - 200px);
  overflow: auto;
  .main-header-tool {
    margin-top: 20px;
    padding: 4px 24px;
    display: flex;
    justify-content: space-between;
    .main-header-tool-left {
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
    }
  }
  .main-header-tool-right {
    .wp-s-search {
      width: 270px;
    }
    .u-input--primary {
      caret-color: #06a7ff;
    }
    .u-input--small {
      font-size: 13px;
    }
    .u-input__inner {
      font-size: 13px;
    }
    .wp-s-search .u-input--small .u-input__inner {
      height: 32px;
      line-height: 32px;
      background-color: #f1f3f8;
      border-color: #f1f3f8;
      border-radius: 18px;
      padding-right: 70px;
    }
    .u-input__suffix {
      right: 14px;
      transition: all 0.3s;
      pointer-events: none;
    }
    .u-input__suffix {
      position: absolute;
      top: 0;
      color: #a2abbd;
      -webkit-transition: all 0.3s;
      height: 100%;
      text-align: center;
      font-size: 13px;
    }
    .wp-s-search__search-text {
      padding-left: 6px;
      vertical-align: middle;
      border-left: 1px solid rgba(3, 11, 26, 0.05);
      font-size: 12px;
      line-height: 32px;
      cursor: pointer;
    }
  }
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
.sub {
  height: 100%;
  display: inline-block;
  position: relative;
  z-index: 100;
  width: 200px;
  padding-top: 20px;
  display: inline-block;
  position: relative;
  height: 100%;
  border-right: 1px solid #f1f2f4;

  .sub-top {
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    max-height: calc(100% - 60px);
    .all {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      width: 177px;
      border-radius: 10px;
      padding-left: 24px;
      padding-right: 18px;
      margin-left: 12px;
      font-weight: 700;
      color: #636d7e;
      background-color: #fff;
      font-size: 14px;
      &.is-active {
        color: #06a7ff;
        background-color: #eef9fe;
      }
    }
    .file-item {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      margin-left: 12px;
      width: 177px;
      font-size: 14px;
      font-weight: 700;
      position: relative;
      color: #636d7e;
      border-radius: 0;
      font-weight: 400;
      padding-left: 50px;
      font-size: 12px;
      border-radius: 10px;
      &.is-active {
        color: #06a7ff;
        background-color: #eef9fe;
      }
      &:hover {
        background-color: #fafafc;
      }
    }
  }

  .sub-bottom {
    position: absolute;
    bottom: 25px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
}
</style>
