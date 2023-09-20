<template>
  <div class="p-header">
    <div class="header-left">网盘</div>
    <div class="header-content"></div>
    <div class="header-right">
      <div>
        <a id="upload-transfer_list" title="传输列表" class="icon"
          ><i class="red-dot" style="display: none">0</i
          ><i class="iconfont icon-uploader-trans"></i
        ></a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
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
</style>
