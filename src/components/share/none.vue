<template>
  <div class="wp-s-file-contain-list__empty">
    <div class="wp-s-main__empty">
      <div class="u-empty">
        <div class="u-empty__image" style="width: 120px">
          <img
            src="https://staticsns.cdn.bcebos.com/amis/2022-5/1651673636548/%E6%97%A0%E5%86%85%E5%AE%B9.png"
            ondragstart="return false"
          />
        </div>
        <div class="u-empty__description">
          <span class="wp-s-main__empty-title">
            当前列表为空，快去创建分享吧！
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.wp-s-file-contain-list__empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
.wp-s-main__empty {
  margin: auto 0;
}
.u-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  padding: 40px 0;
}
.u-empty__image img {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: top;
  -o-object-fit: contain;
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.u-empty__description {
  margin-top: 20px;
}
.wp-s-main__empty-title {
  font-size: 12px;
  color: #818999;
  line-height: 12px;
}

.wp-s-main-empty-action__empty-body,
.wp-s-main-empty-action__empty-body-action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wp-s-main-empty-action__empty-body .u-card {
  background-color: #f7f9fc;
  border: unset;
  width: 94px;
  height: 94px;
  margin: 0 8px;
  cursor: pointer;
}
.u-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}
.wp-s-main-empty-action__empty-body .u-card .u-card__body {
  padding: 0;
}
.wp-s-main-empty-action__empty-upload {
  position: relative;
  cursor: pointer;
}
.wp-s-main-empty-action__empty-body-action {
  flex-direction: column;
}
.wp-s-main-empty-action__empty-body,
.wp-s-main-empty-action__empty-body-action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wp-s-main-empty-action__empty-body-action {
  -webkit-box-orient: vertical;
}
.u-image {
  width: 42px;
  height: 42px;
  border: unset;
  margin-top: 16px;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.wp-s-main-empty-action__empty-body-action-desc {
  flex: 1;
  font-size: 12px;
  line-height: 12px;
  color: #495366;
  margin-top: 8px;
  margin-bottom: 16px;
}
.u-image__inner {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>
