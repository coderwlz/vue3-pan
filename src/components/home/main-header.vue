<script setup lang="ts">
import { ref } from 'vue'
import { useUploaderStore } from '@/stores/uploader'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
const uploaderStore = useUploaderStore()

const fileStore = useFileStore()
fileStore.getList()
const { category } = storeToRefs(fileStore)
</script>
<template>
  <div class="main-header-tool">
    <div class="main-header-tool-left">
      <button
        v-if="category != 'del'"
        class="upload u-button"
        @click="uploaderStore.open"
      >
        上传
      </button>

      <button
        v-if="category == 'all'"
        class="add-foler u-button"
        @click="fileStore.addFoler"
      >
        新建文件夹
      </button>

      <button
        v-if="category == 'del'"
        class="upload u-button"
        @click="fileStore.handleAllDel"
      >
        清空回收站
      </button>

      <button
        v-if="category == 'del'"
        class="add-foler u-button"
        @click="fileStore.resetActive"
      >
        还原选中
      </button>
    </div>
    <div class="main-header-tool-right">
      <div class="wp-s-search">
        <div class="u-input u-input--primary u-input--small u-input--suffix">
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
</template>
<style scoped lang="less">
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
    .add-foler {
      font-weight: 700;
      padding: 8px 24px;
      height: 32px;
      font-size: 14px;
      border-radius: 16px;
      border: none;
      color: #06a7ff;
      margin-left: 12px;
      background-color: #f0faff;
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
</style>
