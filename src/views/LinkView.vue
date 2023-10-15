<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { getLinkInfo } from '@/service/modules/link'
import { sizeTostr, timestampToTime } from '@/utils'

const router = useRouter()
const route = useRoute()
const openHome = () => {
  router.push('/home')
}

const isOk = ref(true)
const key = ref(route.params.key || '')
const pwd = ref(
  route.query.pwd || localStorage.getItem('route.params.key') || ''
)

const info = ref()
const list = ref([])
const init = async () => {
  const data = await getLinkInfo(key.value, pwd.value)
  if (data.data.code === 200) {
    isOk.value = true
    info.value = data.data
  } else {
    isOk.value = false
  }
}
init()
</script>
<template>
  <div class="link">
    <div class="p-header">
      <div class="header-left">
        <img src="/src/assets/icons/logo.svg" alt="" @click="openHome" /> 网盘
      </div>
      <div class="header-content"></div>
      <div class="header-right"></div>
    </div>
    <div class="link_show_body">
      <div class="bd_left">
        <div class="link_file_header">
          <div class="link_title">
            <div class="link_file_name">
              <!-- <img
                src="/src/assets/img/qita.png"
                alt="share"
                class="file-icon"
              /> -->
              <img
                src="/src/assets/img/folder.png"
                alt="share"
                class="file-icon"
              />
              高薪webGL工程师
            </div>
            <div class="link_file_action">
              <span class="g-button"><x-cancel-link /> 取消分享</span>
              <span class="g-button"><x-down /> 下载</span>
              <span class="g-button">保存到我的网盘</span>
            </div>
          </div>
          <div class="slide-show-other-infos">
            <x-link-time /> <span>2023-10-14 20:23</span>
            <span>过期时间：7天后</span>
          </div>
        </div>
        <div class="show_body">
          <div class="pan-table">
            <div class="pan-table-header">
              <table style="width: 100%">
                <colgroup>
                  <col width="45%" />
                  <col width="23%" />
                  <col width="22%" />
                </colgroup>
                <thead>
                  <tr class="table-header-row">
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
                                <x-download class="file-action-icon" />
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
                </tbody>
              </table>
            </div>
            <none-view v-else />
          </div>
        </div>
      </div>
      <div class="bd_right"></div>
    </div>
  </div>
</template>
<style scoped lang="less">
.link {
  width: 100%;
  height: 100%;
  background: #f7f7f7;
}

.loading {
  text-align: center;
  padding-top: 50px;
}

.messages .warning {
  color: #cc6600;
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

.header-left {
  font-size: 18px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  cursor: pointer;
  img {
    width: 35px;
    margin-right: 8px;
    cursor: pointer;
  }
}
.link_show_body {
  height: calc(100% - 56px);
  width: 100%;
  padding: 20px 24px;
  display: flex;
  .bd_left {
    flex: 1;
    height: 100%;
    background: #fff;

    .link_file_header {
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid #f6f6f6;
      .link_title {
        display: flex;
        justify-content: space-between;
        .link_file_name {
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
        }
      }
    }

    .show_body {
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .bd_right {
    margin-left: 10px;
    width: 215px;
    flex-shrink: 0;
    height: 100%;
    background: #fff;
  }
}
.g-button {
  text-decoration: none;
  color: #09aaff;
  border: 1px solid #c3eaff;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  svg {
    position: relative;
    top: -2px;
  }
}
.file-icon {
  width: 32px;
  height: 32px;
}

.slide-show-other-infos {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  display: inline-block;
  margin-top: 7px;
  svg {
    position: relative;
    top: -1px;
  }
  span {
    margin-left: 8px;
  }
}
</style>
