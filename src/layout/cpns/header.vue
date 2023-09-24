<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useUploaderStore } from '/src/stores/uploader'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime, renderSize } from '@/utils'

const uploaderStore = useUploaderStore()

const uploaderList = computed(() => {
  return uploaderStore.list
})

const isShowList = ref(false)

// 监听点击事件
const handleClickOutside = (event: any) => {
  if (!event.target.closest('.upload-transfer_list')) {
    isShowList.value = false
  }
}

const openList = () => {
  isShowList.value = true
}

onMounted(() => {
  // 组件挂载时绑定点击事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 组件卸载时解绑点击事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="p-header">
    <div class="header-left">网盘</div>
    <div class="header-content"></div>
    <div class="header-right">
      <a title="传输列表" class="upload-transfer_list" @click="openList"
        ><x-chuanshuliebiao class="icon cursor" />
        <div v-if="isShowList" class="transfer_list">
          <section class="upload-dialog-left">
            <p class="upload-dialog-left-title">传输列表</p>
            <a class="upload-dialog-left-btn is-active cursor">文件上传（0）</a>
            <a class="upload-dialog-left-btn cursor">离线下载（0）</a>
          </section>
          <section class="middle"></section>
          <section class="upload-dialog-right">
            <div class="dialog-header">上传完成（0/0）</div>
            <div class="dialog-body">
              <div class="uploader-list-wrapper">
                <div class="uploader-list">
                  <ul id="uploaderList" class="container">
                    <li
                      class="status-pause file-list"
                      v-for="item in uploaderList"
                      :key="item.name"
                    >
                      <div class="info">
                        <div class="file-name">
                          <div class="file-icon">
                            <img
                              src="https://staticwx.cdn.bcebos.com/mini-program/images/ic_other_v2.png"
                            />
                          </div>
                          <div class="file-progress">
                            <div :title="item.name" class="name-text">
                              {{ item.name }}
                            </div>
                            <div class="progress-all progress-common"></div>
                            <div
                              class="progress-now progress-common"
                              :style="{
                                width: `${item.progress * 100}%`
                              }"
                            >
                              <div
                                class="animation"
                                style="display: none"
                              ></div>
                            </div>
                            <div class="status">
                              <span class="file-status"
                                ><span class="error" style="display: none"
                                  ><span class="cursor-p"></span></span
                              ></span>
                              <div class="file-size">
                                {{ sizeTostr(item.size) }}
                              </div>
                              <span class="speed">{{
                                `${renderSize(item.currentSpeed)}/s`
                              }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="file-operate"></div>
                      </div>
                    </li>
                  </ul>
                  <span class="always-tip">- 仅展示本次上传任务 -</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </a>
      <div>
        <img class="avater cursor" src="/src/assets/img/avater.webp" alt="" />
      </div>
      <x-ellipsis-v class="icons cursor" />
    </div>
  </div>
</template>
<style scoped lang="less">
a {
  background: transparent;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  color: #05082c;
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
.upload-transfer_list {
  position: relative;
  background: #f1f3f8;
  border-radius: 32px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  width: 14px;
  height: 14px;
  display: inline-block;
}
.header-right {
  display: flex;
  align-items: center;
  .avater {
    width: 32px;
    height: 32px;
    margin-left: 15px;
    border: 1px solid #f1f2f4;
    border-radius: 50%;
  }
}
.icons {
  width: 22px;
  height: 22px;
  margin: 0 10px;
  display: inline-block;
}
.transfer_list {
  position: absolute;
  width: 704px;
  height: 408px;
  font-size: 12px;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  top: 55px;
  right: -10px;

  .middle {
    width: 1px;
    background-color: #f4f4f4;
    height: 100%;
    position: absolute;
    left: 144px;
    top: 0;
  }

  .upload-dialog-left {
    display: inline-block;
    position: absolute;
    line-height: 1;
    width: 144px;
    padding: 12px;
    .upload-dialog-left-title {
      color: #878c9c;
      letter-spacing: 0;
      line-height: 16px;
    }
    .upload-dialog-left-btn {
      margin-top: 8px;
      border-radius: 10px;
      padding-left: 12px;
      display: block;
      width: 120px;
      height: 32px;
      line-height: 32px;
    }
    .upload-dialog-left-btn.is-active {
      color: #06a7ff;
      background-color: #eef9fe;
    }
  }
  .upload-dialog-right {
    display: inline-block;
    position: absolute;
    right: 0;
    width: 560px;
    left: 145px;
    .dialog-header {
      font-size: 14px;
      font-weight: 600;
      border-bottom-width: 1px;
      border-color: #f4f4f4;
      border-bottom-style: solid;
      height: 40px;
      line-height: 24px;
      padding: 8px 16px;
    }
    .uploader-list-wrapper {
      position: relative;
      .uploader-list {
        position: relative;
        overflow: hidden;
        overflow-y: auto;
        height: 368px;
        .always-tip {
          text-align: center;
          width: 100%;
          display: inline-block;
          color: #afb3bf;
          margin-bottom: -12px;
        }
        .file-list {
          position: relative;
          border-bottom: 1px solid #f2f6fd;
          height: 72px;
          line-height: 72px;
          .info {
            position: absolute;
            width: 100%;
            height: 100%;
            .file-name {
              position: relative;
              overflow: hidden;
              width: 416px;
              height: 72px;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;
              .status {
                padding-top: 10px;
                position: relative;
                .file-size {
                  font-size: 12px;
                  color: #878c9c;
                  display: inline-block;
                }
                .speed {
                  position: absolute;
                  right: 8px;
                  color: #06a7ff;
                }
              }
              .file-icon {
                position: absolute;
                top: 15px;
                left: 10px;
                width: 40px;
                height: 40px;
                img {
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  right: 0;
                }
              }
              .file-progress {
                display: inline-block;
                position: absolute;
                left: 56px;
                line-height: 1;
                width: 360px;
              }
              .name-text {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: #03081a;
                padding: 10px 0;
              }
              .progress-all {
                width: 100%;
                background-color: #f5f6fa;
              }
              .progress-common {
                height: 3px;
                border-radius: 10px;
              }
              .progress-now {
                position: absolute;
                top: 34px;
                background-image: linear-gradient(
                  90deg,
                  #22d4ff 6%,
                  #009dff 95%
                );
              }
              .animation {
                position: absolute;
                height: 100%;
                width: 10px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAGCAYAAAB3nUiSAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQqADAAQAAAABAAAABgAAAABF3n+eAAABKElEQVQ4Ea3UCW6DUAwEUOh+/9N2S6gfZSoXAaJVLBlv47H/D2ScpuluGIb70ofSp8WPfV7yqbHw8npeljh1fanLwYTrsXy5YFkCM5Z+CkrYj9L3xV7KUjGr/lZ6LYULVvxaCpM6rD42fZ0rtYulp1LWMqT735nfzxygZ3MYy+gn+DqnXLhTw+WC5PnJl/vz4+zx2XtPtnbs2M7Jn9+GDoh/NCSYboPPQcR0PVBPP7A6lctl4ugHERM2vJkzF27xyKKd65ZDckGdv/tb83v9jJ+LOoOF2Txfv/kQ5dYT/9XqXw+T89kQ36oLkIsv9u1mtjyfxPLDKxe+Xof5l1gAOdKzhJbck3Cp92WzdOaoUVxy/vBy+NTSv+4t6Nxz9DYd7YjXpZPMGL8Ail5bIbRRf0IAAAAASUVORK5CYII=);
                background-size: 100% 100%;
                animation: bling-1c12ef74 1.5s linear infinite;
              }
            }
            .file-operate {
              display: inline-block;
              padding: 0;
              padding-left: 8px;
              width: calc(100% - 416px);
              display: inline-block;
              height: 72px;
            }
          }
        }
      }
    }
  }
}
</style>
