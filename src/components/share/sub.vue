<template>
  <div class="sub">
    <div class="sub-top">
      <div class="file-list">
        <div class="all cursor is-active">分享记录</div>
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
      // padding-left: 24px;
      text-align: center;
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
