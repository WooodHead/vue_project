<template>
  <div id="app">
    <router-view></router-view>
    <style lang="less">
      .vux-popup-picker-header {
        color: #007aff;
      }

      .weui_btn_primary {
        background-color: #3385ff;
      }

      .weui_btn_dialog.primary {
        color: #3385ff;
      }
    </style>
  </div>
</template>
<style lang="less">
  @import '~vux/src/styles/index.less';
  @import '~vux/src/styles/reset';
  @import "~vux/src/styles/weui/icon/weui_icon_font";
  @import '~vux/src/styles/weui/widget/weui_cell/weui_uploader';

  body {
    background-color: #fbf9fe;
  }
  .weui_gallery {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000000;
    z-index: 1000;
  }

  .weui_gallery_img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 60px;
    left: 0;
    background: center center no-repeat;
    background-size: contain;
  }
</style>
<script>
  import store from './vuex/store' // import 我们刚刚创建的 store
  export default {
    store // 在根组件加入 store，让它的子组件和 store 连接
  }
</script>
