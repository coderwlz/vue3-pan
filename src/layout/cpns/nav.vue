<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const open = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="content-nav">
    <div class="nav">
      <div class="nav-top">
        <a
          href="javascript:;"
          class="u-tooltip item wp-s-aside-nav__main-item router-link-exact-active wp-s-aside-nav__main-item"
          :class="{
            'is-active': route.path == '/home'
          }"
          @click="open('/home')"
          ><div class="wp-s-aside-nav__main-item-wrap">
            <img
              src="data:image/png;base64,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"
              alt=""
              class="wp-s-aside-nav__main-item-img"
            />
            <img
              src="https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-active.158e32eb.png"
              alt=""
              class="wp-s-aside-nav__main-item-img is-active-img"
            />
            <p class="wp-s-aside-nav__main-item-text text-ellip">首页</p>
          </div></a
        >

        <a
          href="javascript:;"
          class="u-tooltip item wp-s-aside-nav__main-item wp-s-aside-nav__main-item"
          :class="{
            'is-active': route.path == '/share'
          }"
          @click="open('/share')"
          ><div class="wp-s-aside-nav__main-item-wrap">
            <img
              src="data:image/png;base64,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"
              alt=""
              class="wp-s-aside-nav__main-item-img"
            />
            <img
              src="https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-share-active.8080707e.png"
              alt=""
              class="wp-s-aside-nav__main-item-img is-active-img"
            />
            <p class="wp-s-aside-nav__main-item-text text-ellip">收发</p>
          </div></a
        >
        <!--
        <a
          href="javascript:;"
          active-class="is-active"
          class="u-tooltip item wp-s-aside-nav__main-item wp-s-aside-nav__main-item"
          ><div class="wp-s-aside-nav__main-item-wrap">
            <img
              src="data:image/png;base64,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"
              alt=""
              class="wp-s-aside-nav__main-item-img"
            />
            <img
              src="data:image/png;base64,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"
              alt=""
              class="wp-s-aside-nav__main-item-img is-active-img"
            />
            <p class="wp-s-aside-nav__main-item-text text-ellip">同步</p>
          </div></a
        >

        <a
          href="javascript:;"
          class="u-tooltip item wp-s-aside-nav__main-item wp-s-aside-nav__main-item"
          ><div class="wp-s-aside-nav__main-item-wrap">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAATlBMVEUAAACjq72frL+iq72iq72fqL+iq72jq76jq7ufq7yiq72hqbuhqr2iq76iq7yiqbyhq7ufq7ujq7+irL2irLyhrL+hq7yfq7ehqbyiq71gH3O4AAAAGXRSTlMAvyCg3xDvX0AwkIDfz89wgEB/r65vUCCwOiZMMgAAAWxJREFUWMPtlsl2wjAMReUxdiaGttD3/z/a01PA2FiJHDZd5K5gkRfpaQrt7PxbTmc1Al71YdvjCg9sR624HhlKUxN6RoFtUnAWL/gWBYMK1pGUDlV6kmJRR8sDeC+EDzB4IrqGuOqFB0f8s3da7qsIlo4GQWsGsAzJn/O7AjhsEwiCztQLHjyrmw1VCFmPsOVUYBiJBmDdhQsYTGqyxRwcl4PO01Otw2CKClmiJhdGXSwKRSxurG2kssLfxKNfFHx8WRSLI+VMZSufC0+lV+E2waWoIZ6YPZ4mWI+yAL6YMjqiI+4c+fQVGKxOCkZ0lHiFiU3AzcCyQn8LQYuPUnmeptvPg9S/snjxydUS7bFGeCQBTE6YQDGDznMKGgK65/f0bAA8KlsLF+4sL7vg618NASKGLNSBEgNEqGzpzdwm4/G52zEJzJBxJaqfBw8ZMdmdzyWEhCxY1R6BTnblAlFJ+PxNuk9/T7Szc+cHZ2+X6jE8QbAAAAAASUVORK5CYII="
              alt=""
              class="wp-s-aside-nav__main-item-img"
            />
            <img
              src="data:image/png;base64,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"
              alt=""
              class="wp-s-aside-nav__main-item-img is-active-img"
            />
            <p class="wp-s-aside-nav__main-item-text text-ellip">消息</p>
          </div></a
        > -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.content-nav {
  display: inline-block;
  width: 80px;
  z-index: 100;
  position: relative;
  height: 100%;
  .nav {
    display: inline-flex;
    flex-direction: column;
    background-color: #fff;
    width: 80px;
    font-size: 12px;
    text-align: center;
    z-index: 2;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.06);
    position: relative;
    height: 100%;
    border-right: 1px solid #f1f2f4;

    .nav-top {
      padding-top: 40px;
      padding-bottom: 30px;
      background-color: #fff;
      position: relative;
      z-index: 1;
      .wp-s-aside-nav__main-item:first-child {
        margin-top: 0;
      }
      .wp-s-aside-nav__main-item.is-active {
        color: #06a7ff;
      }
      .is-active {
        font-weight: 700;
      }
      .wp-s-aside-nav__main-item {
        margin-top: 30px;
        display: inline-block;
        color: #636d7e;
        width: 100%;
        position: relative;
      }
      a {
        background: transparent;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        color: #05082c;
      }
      .wp-s-aside-nav__main-item .wp-s-aside-nav__main-item-wrap {
        position: relative;
      }
      .wp-s-aside-nav__main-item-img.is-active-img,
      .wp-s-aside-nav__main-item.is-active .wp-s-aside-nav__main-item-img {
        display: none;
      }
      .wp-s-aside-nav__main-item-img {
        width: 36px;
        height: auto;
      }
      img {
        border: 0;
        vertical-align: middle;
      }
      .wp-s-aside-nav__main-item.is-active
        .wp-s-aside-nav__main-item-img.is-active-img {
        display: inline-block;
      }
      .text-clip,
      .text-ellip,
      .text-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .wp-s-aside-nav__main-item-text {
        margin-top: 6px;
        max-width: 80px;
      }
    }
  }
}
</style>
