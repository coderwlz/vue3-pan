<script setup lang="ts">
import { RouterView } from 'vue-router'
import headerView from './cpns/header.vue'
</script>
<template>
  <div class="pan">
    <header-view />
    <div class="p-content">
      <div class="content-nav">
        <div class="nav">
          <div class="nav-top">
            <a
              href="javascript:;"
              class="u-tooltip item wp-s-aside-nav__main-item router-link-exact-active is-active wp-s-aside-nav__main-item is-active"
              ><div class="wp-s-aside-nav__main-item-wrap">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAAEi6oPRAAAABGdBTUEAALGPC/xhBQAABwtJREFUeAHtW19oHEUYn9mLTXJtbcWaqCCKIFZCsSaXWotYCkqaS0vFJqsIFQUL9qEPUvpYLIgPovalSh8UBAXRvUQoNZdUC8WiVZq71iL1D4IIQm2DYkvT/Km5Hb85M8fc3ny7M3t76VUmEGbmN9+/+e3c7Mw3d4Qk9UdlQ97xc8vI9PQVjrkDvZU+RxYSAhzzRieY6KtIy6Do5CW3WG1J7pXqWkKSfNNUKxTwiGQalGTmRotbsNDLloaPFlb78+zHoJCwVuZJJSC7LwtRSuaDVsptZ8lqJX79wSouVeEAfQcYZTsJcba42e4vVTIcQw3JDyioLCiW8RpD3snf28nfF6ZlIVU9aKzKUFgUKmMcEwZbMAGOU0rnhrKZNiET5qgqIq4QJiwMlktKvnGzvRuqMNtYHAZqnprs1mMsRcYKP1BCz8M02CT3BeuoIeU0CHnkypU7NzrxddBjuc3II0ocQKUheNWgE00ZqcpQbrRwFfMqcIh4v6iLsoojzJsQriopnXKzmeUCqwxtJF9cL0CtkrFlslzFkM/8z+UO03plGWGUHiWMDcoGxFojsLChx+cIrMuOKkPjXltb224X3qNK2UiUrO23DNygDFR90EzGkMsXLjLGOjAdeFvsHBrIvIf1Y7hxQGHLiNKJQw+4/Zk9yj4FaBSQcTDCISWfwO7nGdEMK6uWtDDB3Fjh3bD+0D5Gng7tlzpDGfLyE4OEkZwkn0R1BtbnNGYIDSj248E8BfFU6jl3c/eHQVj5yHL5iWNBwcTbpdIHKpuVF7XcyRjpkttYHc7e78Cp4EKwH5aDvfCobw7iOm0lQ+1pukZHmTCaIj5rCf5Thp/ZJLslqV6ponMon/+ldYpdmq1IJlkJ2RGjAcn+Yb85Apvbp2QsRr1EnCVdbv+DP8fQtSqWAcuAZcAy0DQMaL06sGi9/OmNlPj74bWSIYSdp8wZZdnuvS6lyhcnZkfGYwUE+ZYXGWHolhbSlJOQn+qUHenWjQOCbe1J2Ougaacqx+n0cndT11QVFtFQ7ocwHZ7A1g6GG1m4mcHsqXCjgBjxX1YZCcPQ5B6ipB0QPKqPERuhcFiSUKWoHRA8Ku2zVdCRN14YCGJYWz8gzIIGDnvsJzXEyiKRnzKeLgXaX9E1iMlB8mGa3dK5yt1w1wwmw/HQgOCwyC9k2sMMGPdRMgTn/GFMDw3IyxeuQEK1Km2LGTHFnRb6wGBf5ieVnnIOeeOndzQqGB4EdhPJ+5QBEeSYyxWS+oM71IdVttQBqSQTxliJvaYyed0CgnVtnSogZbJBJViDwYUHXDi/XoMz0gHJht01eBAA/SDE27EDkm9fgoZhe7IDticrg7jchrVNeYGFBcQ3WCnZQLAOy8IUZezNIA5L221RwXCd9nayq1YXYwiSAsS/plwnKkYYW6pewQGN+OPfLdi6KfOnSkw5qcsZCkiZqBSSwJaSleiCqwyIOy1fYjcgKH55lc3eN4cNDH11CAVv7Oz98PjOQTt0Tgl5rARHnw4N9G7H+i1uGbAMWAYsA5YBy4BlwDJgGbAM1MtA5Pa+XgdBff4Vfjo7u4cwfzd8M+DWYL+qDSe4vwh1DrK2trdMM94qeybYohDEL/+vkkuHgJAXTILDZIGw9+GUuSvsYIfpmuINJQjSMc7wWPEwlFtMA9ORh8udzwb7e7ZB6evIx5FpGEHDo6czjPqngJyG+eADBnLgdwzOusGB7kIcAqJ00JxHlGJYP7/R8ElpotHk8Bi4D+7L5BYlLPZgX+JPd+F3VJPgKNl7iGDkte0Zkk53JL2IJz6D6MzMS9eBHE5X+4LvWurqQBKbQd4XhRXkH/IsGNwH0/6OOmKKrQrr0R+Q9n2V3EQ+cp/IXI5tSFKsiyDvaLGHlNgwLAT3SDabp0rpbyRFB92+nmLcoGIR5I0XN1PfPwL7GuwuIm48DdHjVwXMcba6m3vGTR0YEcTfGLmx4gmYMY+aOmoKeUq/GurveYxvDXTjMSIIbsnPgOG1usabVO47+D75Q7qxab/F4EcS+/4H5HBe1i6MRYsjbYLgY/W8lsUbQchgLNoEwYf27hth7DoxmoxF/y1E6VmYRd06AUTJpFpSG7f3dZ+IkpP7R8bO9Jb8+VMyFrvOx6L5pz2D4Ej4tqbNSDHfL2n7FcaYY64jdGtKSg/WYAhg9BZL6HcTSCiLA8OAje7ljZ4kv/CHPYQ2+4szZH0vPHbTLy0YzSARyuFj33fOXZv7tmmPGCJQUcKRo3VJ6/ptj6+5KCDdMhZBwvh/qdTLb0BWZlezHTv48QLSaYeWkhV760nN1kWQIEqUR44XVs1O062Q4ssCdi/MsDshSPgFLjP6KAt70SVPtbJJSCueB9lf4UWSb0uzI9hXtKLtWQnLgGXAMmAZsAxYBiwDlgHBwL92fhrJ4t8RXAAAAABJRU5ErkJggg=="
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
          </div>
        </div>
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
    .content-body {
      height: 100%;
      display: inline-block;
      width: calc(100% - 80px);
      overflow: auto;
    }
  }
}
</style>
