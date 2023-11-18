<script setup lang="ts">
import { ref } from 'vue'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const route = useRoute()

const fileStore = useFileStore()
// fileStore.getList()
const isOpen = ref(true)

const type_list = ref([
  {
    title: '文档',
    icon: 'x-wendang',
    show: true,
    type: '1'
  },
  {
    title: '视频',
    icon: 'x-shipin',
    show: true,
    type: '2'
  },
  {
    title: '音频',
    icon: 'x-audio',
    show: true,
    type: '3'
  },
  {
    title: '其他',
    icon: 'x-qita',
    show: true,
    type: '4'
  },
  {
    title: '图片',
    icon: 'x-tupian',
    show: true,
    type: '5'
  }
])

const { category } = storeToRefs(fileStore)

const open = (type: string) => {
  category.value = type
  fileStore.parent_id = ''
  fileStore.path = []
  fileStore.getList()
  router.push({
    name: 'home',
    query: {
      category: type
    }
  })
}

const clickOpen = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="sub">
    <div class="sub-top">
      <div class="file-list">
        <div
          class="all cursor"
          :class="{
            'is-active': category == 'all'
          }"
          @click="open('all')"
        >
          <x-xiala
            class="my-icon"
            :class="{
              'is-open': !isOpen
            }"
            @click="clickOpen"
          />
          我的文件
        </div>
        <div class="file-list-body" v-if="isOpen">
          <template v-for="item in type_list" :key="item.title">
            <div
              v-if="item.show"
              class="file-item cursor"
              :class="{
                'is-active': category == item.type
              }"
              @click="open(item.type)"
            >
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
      <div class="nav-divider"></div>

      <div
        class="file-item cursor"
        style="font-size: 14px; font-weight: 700"
        @click="open('del')"
        :class="{
          'is-active': category == 'del'
        }"
      >
        回收站
      </div>
    </div>
    <div class="sub-bottom"></div>
  </div>
</template>

<style scoped lang="less">
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
.nav-divider {
  margin-left: 30px;
  display: inline-block;
  width: 70%;
  height: 1px;
  background-color: #f1f2f4;
}
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
</style>
