<template>
  <div>
    <div class="p-header">
      <div class="header-left" :title="route.query.filename">
        <img src="/src/assets/icons/logo.svg" alt="" @click="openHome" />{{
          route.query.filename
        }}
      </div>
      <div class="header-content"></div>
      <div class="header-right"></div>
    </div>
  </div>
</template>
<style scoped lang="less">
.banner {
  overflow: auto;
  text-align: center;
  color: #000;
}

.hidden .banner {
  display: none;
}

.hidden .well {
  height: calc(100vh - 12px);
}

.file-selects {
  position: absolute;
  left: 5%;
  top: 17px;
  margin-left: 20px;
}

.banner h1 {
  font-size: 20px;
  line-height: 2;
  margin: 0.5em 0;
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
</style>
