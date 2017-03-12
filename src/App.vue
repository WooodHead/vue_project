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
  @import '~vux/src/styles/reset';
  body {
    background-color: #fbf9fe;
  }
</style>
<script>
  import store from './vuex/store' // import 我们刚刚创建的 store
  export default {
    store // 在根组件加入 store，让它的子组件和 store 连接
  }
</script>
