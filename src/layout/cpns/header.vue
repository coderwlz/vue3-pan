<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useUploaderStore } from '@/stores/uploader'
import { storeToRefs } from 'pinia'
import { sizeTostr, timestampToTime, renderSize } from '@/utils'
import { useElementHover } from '@vueuse/core'

const myHoverableElement = ref()
const isHovered = useElementHover(myHoverableElement)

const uploaderStore = useUploaderStore()

const uploaderList = computed(() => {
  return uploaderStore.list
})

const uploadNum = computed(() => {
  let count = 0
  for (let i = 0; i < uploaderStore.list.length; i++) {
    const item = uploaderStore.list[i]
    const STATUS_MAP = ['uploading', 'merging', 'decoding', 'checksum']
    if (STATUS_MAP.includes(item.status)) {
      count++
    }
  }
  return count
})

const uploadOverNum = computed(() => {
  let count = 0
  for (let i = 0; i < uploaderStore.list.length; i++) {
    const item = uploaderStore.list[i]
    const STATUS_MAP = ['success', 'success2']
    if (STATUS_MAP.includes(item.status)) {
      count++
    }
  }
  return count
})

const isShowList = ref(false)

// 监听点击事件
const handleClickOutside = (event: any) => {
  if (
    !event.target.closest('.upload-transfer_list') &&
    !event.target.closest('.common-icon-container')
  ) {
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
    <div class="header-left">
      <img src="/src/assets/icons/logo.svg" alt="" />网盘
    </div>
    <div class="header-content"></div>
    <div class="header-right">
      <a title="传输列表" class="upload-transfer_list" @click="openList"
        ><x-chuanshuliebiao class="icon cursor" />
        <div v-if="isShowList" class="transfer_list">
          <section class="upload-dialog-left">
            <p class="upload-dialog-left-title">传输列表</p>
            <a class="upload-dialog-left-btn is-active cursor"
              >文件上传（{{ uploadNum }}）</a
            >
            <!-- <a class="upload-dialog-left-btn cursor">离线下载（0）</a> -->
          </section>
          <section class="middle"></section>
          <section class="upload-dialog-right">
            <div class="dialog-header">
              上传完成（{{ uploadOverNum }}/{{ uploaderList.length }}）
            </div>
            <div class="dialog-body">
              <div class="uploader-list-wrapper">
                <div class="uploader-list">
                  <ul id="uploaderList" class="container">
                    <li
                      class="status-pause file-list"
                      v-for="(item, index) in uploaderList"
                      :key="item.name"
                    >
                      <div class="info">
                        <div class="file-name">
                          <div class="file-icon">
                            <img
                              src="https://staticwx.cdn.bcebos.com/mini-program/images/ic_other_v2.png"
                            />
                          </div>
                          <div
                            class="file-progress"
                            v-if="
                              item.status != 'error' ||
                              item.status != 'success' ||
                              item.status != 'success2'
                            "
                          >
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
                                {{
                                  item.status == 'checksum'
                                    ? '正在计算文件大小'
                                    : sizeTostr(item.size)
                                }}
                                <span
                                  class="err_text"
                                  v-if="item.status == 'error'"
                                  >{{ item.err }}</span
                                >
                              </div>
                              <span
                                class="speed"
                                v-if="item.status == 'uploading'"
                                >{{
                                  `${renderSize(item.currentSpeed)}/s`
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                        <div class="file-operate">
                          <span
                            title="暂停"
                            v-if="
                              item.status == 'checksum' ||
                              item.status == 'uploading'
                            "
                            class="common-icon-container"
                            ><img
                              @click="item.pause()"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAD20lEQVRoQ+WbzYsUVxDAfzW6PRfZ9Ahm/4AcjIkoqKis6CFoiGDExEDM1YBfd8l60MTkEIN3o4HkGgU/ghEi2ZDDiosrUTAkfoD+AaOw09l46R4zFV7vzO7s7PT0x/TMNL19W7peVf1ev3mv6lWt0INnxtU3/4MDIoygjKgwIjCC+ds8SlmhLEoZoaxKeRlcHC7K47TdkbQUOp5uQHgX5SNgY0K99xAuo/xqW3I/oY4Fw7oGrHh6UOAQsCUNh5p0TCl8V7Lkh270JgacdtUswWMC27txIGyswi1Vzq0sysUw2XbvYwNOv9L3C8oxlPeSGEw8RrhZE86tXC4/x9ERC7Di6kkRvoxjIG1ZVU6VivJVVL2RAR1PzRL5OKriHstdsi05EMVGJMCKq3+J8HYUhf2SUeXvUlHWhtkLBXQ81TAlg3xvW9KRoeNLx9NxYOcgASLY/s22ZFeQXCDgP66e1AFvKBHgfBFRTr0WsPG0BXQ8PQJ8G9VARuSO2pacb/VlEaB/ztW4nhGnY7lRK7C39ZxcBOhU9Ze+H+KxMDoICzftIdndLLEA0IRfBeHHtOwNQk9N+aQ5rFsAWPF0otexZa+hTexasmRHw84cYD0r+L7XDvRDv8KnjSxkDtDxdArY3A8H+mDjrm2Jn775gDNVHa0pt/tguG8mCsK24SGZ9AEdV88gfJaW9bMP4eyjWW3H18Dxt9prjiqXyC/lG7soYz5g2sH061fmXVo9DLcCAqnt4/BkZl72+f5EKG0HNYJxeenqulfCg7RUT76AfRMLtQU53jwRZsRPO2B0VVqewHJlvVRc/UKEz9NSmyVAVU6L46mJOU3smcqTJUDgvDiuXkX4IBU6IFOAyjWpeHpbYDSPgAqTZok+Bd7IIyDwTJyq/ouyIpeAwsslAJj3JZr/TSbvx0TuD/rch2qmGlsT6slN94dFliKZgrJmNh/09I8uqrKLZqU5S1hfgvF32k/crt/hQaU36RJwz7Zk0yxgVcdQvu7++81qiJrIRpVL5Jdwwh6SM40vuMEQJ1KU3UEbTZ2/+dLpTg/q7IPCn7It2WqML51rQ0Ob64tfA5j7q/v6jprf4ov/FfNePvN/ixloF4m7/Qa1lwSWsDPWNhLGG9hW0rEJIe0b7zAvk7wPaydZ2m0kjRnNaDtJx/aRhu+hX7AhmKW2kk5tI63LPDJgPa3KQntJ23aRoN9vLMC5czKv7ZTNs5TbhtjWpVBvXjjcg/r+XYULA2tpbgX16/w19irsSdp6ac40gRuFAtdNfT3JudjVJhPVoKkaV+HDOP9WMARXVxTlz6g2osr9D+sJ5wx+0id2AAAAAElFTkSuQmCC"
                              alt=""
                          /></span>
                          <span
                            title="继续上传"
                            v-if="item.status == 'paused'"
                            class="common-icon-container"
                            ><img
                              @click="item.resume()"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAEaklEQVRoQ+WbXYgbVRSAv5PdnagsdVKoC6JPilgVC61Y2WIRccWCLlQE66M/VC2+FutDW38erPRV2rWor1aQKqvYYkWwsotbXKHiH2qflEKoNGMtaibdHLmTzDZJM8lM9k4ypPM2mTPnnO/eO/eee8+JkMJ1vqy3LsE2ESZQJlSYEJjA3JtLKSoURSkiFFUpjsDhVXn52bY7Ykuh5+t6hAdRHgM29Kh3EeEDlM9cR77tUUfTaysGLPn6lMB2YKMNhxp0LCgcKjjy7kr09gx4rqxmCO4QuHclDnR7V+ErVQ6szsvhbrLtnicGPHdRH8kpO1Ae6sVgz+8Ix6rCgdWj8nESHYkAS2XdLcKrSQzYllVlTyEvr8XVGxvQ89UMkcfjKk5Z7n3XkW1xbMQCLJX1exFuj6OwXzKq/FDIyx3d7HUF9HzVbkoG+dx1pCNDx4eer8eBBwYJEMP2564jU1FykYB/lXW3DnhCiQEXiIiy59qIiactoOfrc8DBuAYyIve868hMqy+XAQbrXJXZjDidyI1qjunWdfIyQK+iR/u+iCfC6CAsHHPHZEujRBOgCb9ywnu27A1CT1V5ojGsawIs+Xoi7dgybWgTuxYc2RzaWQas7wreScuBo2fg0G817dtvhi3Xp2XJbDd5OtyFLAN6vi4Ad6dhdvYPeMZob7je3gjTN6RhLdB50nUk2L4FgOcrOllV5tIw1w4utJMmZE7YtGpM5gNAr6z7EF60DdgJLnVI5Q03L7sCwDSC6ThwaUKGwbhcKOudF4VTNnsvCVyakKPKOimV9WUR9toCjILbtAbmzna2YvubVOUV8Xw1MaeJPa1cU1/AqVKzqp1rYf7PZkDz2/6fmuXWFeD4/VbcCJXMiFfWIwhbbaltBTQgO2+DrSeaAT/aXLtvhLQOqHwoJV/nBCZtAe7/seb01SPwwi01OHO1A5xcA0b+zV/g3yUIG8OWLwrzZoia+OImW0pDPf8twVUjl7RGARqJVlmLvpwWr6J/o4xbVNpWVSfA1GwLF64AwJSGaGuvDKQH4bT1SSZquA0CsDbJWF4msgSIWSZsL/SZAoQZ66FalgCDUM1kY6tCS9Bkf+IexDeYU9bW9oO+frOCrGys1hgA4KLryF01wIruQnk9lqc9CvUdUHjJHZN9YQ+uBxZ79D3Wa30HhA0mz9946PR1Cnn2ZfiDv8Le72q3N14DX07B+GistulFaMF15B7zYt+ODefPwqdn4Pd/4L7r4Enr4f2ldmh7bGgeD/XBrwEc+qP7+ow6vMmXoBeHPX0WfIsZKBdJOnVGlZdEprAzVjbSjTeyrKRjEUIaJ97dPE36vFs5yZVdRhK2ZkbLSTqWj4S+d+3BUDBLZSWdykZah3hswPq2KgvlJW3LRaK+3USAy+vksJZTNrbS0BbEtg6FevHCsynk908qvDWwkuZW0CDPX2Va4eFeSy/NmibwSS7HrMmvJ10T28kn/gbjGDVZ4wo8muRvBWNwZDwv9S1xHCvxZP4HTO/3DJGuOoEAAAAASUVORK5CYII="
                          /></span>
                          <span title="取消" class="common-icon-container"
                            ><img
                              @click="uploaderStore.close(index)"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAEPUlEQVRoQ+WbT4jcVBjAf9/YzVyWNVsoi1BEENGqVGiLyhZ7sqWCLiiK9aqgbc8W20Nrqwdbeq9V0IMIVpBVqmCpoqDs4i62UPHfweLBgwyFndj2kkydr7x0ZpudnSQvM8nMkM1tyPfvl7y89733fSMUcF319YH/YY8IUyhTKkwJTGF+m0upKdREqSHUVKndAWcmqvJn3uFIXga9QLcg7EJ5Htjao90LCJ+hnHcdudijjRVqfQPWA31Z4FXgsTwCithYUHh/0pEP+7HbM+CSr2YI7hd4op8A0nQVflTl1PqqnEmT7XY/M+DSDX2mouxH2d2Lw551hHNN4dT6dfJlFhuZAOu+HhbhrSwO8pZV5chkVd62tWsN6AVqhsiLtoYLlvvUdWSPjQ8rwLqvv4rwkI3BQcmo8ttkVR5O85cK6AWqaUaGed91JJEh8aYX6DfAk8MEsPD9revIzji5WMD/fD2sQ55QLOBCEVGO3Bkz8XQF9ALdC7xr62BE5Pa5jpzujGUVYLjONTk7IkFnCqNZYaZznVwF6DX064Ev4pkwEoSFc+6YPBWVWAFo0q+K8Ele/oZhp6m8FE3rVgDWA/2h6NyyaGiTu046sqPtZxmwtSv4oOgABmFf4ZX2LmQZ0At0AXh0EAEMwMei60i4fQsBrzZ0uqnMDcDxwFxUhO0TYzIfAnq+Hkd4Iw/v81dg7grcPwEzG+0s9qKTalk54VblYAiYVzJ9qQ47v7vt+sAmOPBgcignf4eTf9yW+WIHTG9IDT9VoJ2My3VfN98QLqVqWAh0BmtUkiC7yR/bDPvus3BmIbJOeUTqvh4V4U0L+VSRi0uw+/vVYt0gu8EZzY+nYdddqa6sBFQ5Jl6gJuc0uWcuV1zgUUgbmVyCgdPi+TqL8GxOBkMzSQDh/cg31/Zr871mjlH5XOqBzglMZ1ZOUYiD7KZWCFx4vsy8GaJ/AffmDZj0JqO+ioJr+bgsXkOvoYwXAZgGWTCcSWOurwHAsg/R8k8yZV8mSr/Q55mqzf4Dexf7S9XySrZNFGGqZqqxTaFLbpF94cgj2c5z6agom27tBwP9uY+q7PKT+OhveD1Sl7UJtqjtEnDBdWTbLcCGHkR5J/s7W61x/l8w+8LtG+z3dWZoX74G94zDC3fnEUV4VnHIHZPj7Te4xRDnZHpUzGw1df7oodNPBdTZhwW74DryuHG+do4NDW2pD34NYOmP7lszanmLL+FbLHv5LPwWR6BdJOv0G9deElvCHrG2kTTe2LaSxCaEvE6806Lr535aO8nabiNpP9kRbSdJbB9px576BtuCo9RWktQ20jncrQFb26pRaC/p2i4S9x1nAlxeJ8vaThl9SqVtiO0cCq3mhdcKqO8vKrw3tJbmTtCwzt9kRuHpXlsvzZom8FWlwllTX+9nfcw8i2ZxZqrGDXguy98KxmB2vCq/ZPFjI3sTsZPrDHEK5X0AAAAASUVORK5CYII="
                              alt=""
                          /></span>
                        </div>
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
      <div ref="myHoverableElement" class="ellipsis cursor">
        <x-ellipsis-v class="icons cursor" />
        <!-- <div class="ellipsis-body"></div> -->
        <div class="ellipsis-body" v-if="isHovered">
          <div class="ellipsis-item">系统通知</div>
          <div class="ellipsis-item">问题反馈</div>
        </div>
      </div>
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
.header-left {
  font-size: 30px;
  img {
    width: 42px;
    margin-right: 8px;
  }
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

.ellipsis {
  position: relative;
  padding: 5px;
}
.ellipsis-body {
  position: absolute;
  width: 130px;
  height: 74px;
  padding: 5px 4px;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
  top: 32px;
  right: 13px;
  &::before {
    position: absolute;
    right: 8px;
    top: -5px;
    content: '';
    width: 10px;
    height: 10px;
    background: #fff;
    transform: rotate(135deg);
    box-shadow: 1px -2px 5px rgba(0, 0, 0, 0.2);
  }
  &::after {
    position: absolute;
    right: 5px;
    top: 0px;
    content: '';
    width: 20px;
    height: 20px;
    background: #fff;
  }
  .ellipsis-item {
    height: 32px;
    line-height: 32px;
    position: relative;
    z-index: 222;
    border-radius: 8px;
    padding-left: 5px;
    font-size: 14px;
    cursor: pointer;
    color: #606266;
    &:hover {
      background: #f1f3f8;
    }
  }
}
.common-icon-container {
  background: #f0faff;
  border-radius: 13.28px;
  display: inline-block;
  width: 28px;
  height: 28px;
  position: relative;
  color: #06a7ff;
  margin-left: 12px;
  cursor: pointer;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
