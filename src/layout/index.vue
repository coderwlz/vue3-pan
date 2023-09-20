<script setup lang="ts">
import { RouterView } from 'vue-router'
import headerView from './cpns/header.vue'
</script>
<template>
  <div class="pan">
    <header-view />
    <div class="p-content">
      <div class="content-nav">
        <div class="nav"></div>
      </div>
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
    .content-nav {
      display: inline-block;
      background-color: #fff;
      width: 80px;
      z-index: 2;
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.06);
      position: relative;
      height: 100%;
      border-right: 1px solid #f1f2f4;
      .nav {
        display: inline-flex;
        flex-direction: column;
        height: 100%;
        font-size: 12px;
        text-align: center;
      }
    }
    .content-body {
      height: 100%;
      display: inline-block;
      width: calc(100% - 80px);
      overflow: auto;
    }
  }
}
</style>
