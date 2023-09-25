<script setup lang="ts">
import { RouterView } from 'vue-router'
import headerView from './cpns/header.vue'
import navView from './cpns/nav.vue'
</script>
<template>
  <div class="pan">
    <header-view />
    <div class="p-content">
      <nav-view />
      <div class="content-body">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.pan {
  width: 100%;
  height: 100%;
  .p-content {
    height: calc(100% - 56px);
    overflow: hidden;
    width: 100%;

    .content-body {
      height: 100%;
      display: inline-block;
      width: calc(100% - 80px);
      overflow: auto;
    }
  }
}
</style>
