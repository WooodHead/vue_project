<template>
  <group >
    <cell title="教师角色测试" :link="'/select/?userType=1'" ></cell>
    <cell title="家长角色测试" :link="'/select/?userType=2'"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  // import AppHelper from 'util/apphelper'
  // import LocalStore from 'util/localStore'
  export default {
    components: {
      Group,
      Cell
    },
    ready() {
      // LocalStore.clear()
      // AppHelper.post(AppHelper.ApiUrls.exams_index, {
      //   examsYear: ''
      // }).then((ok) => {
      //   console.log(ok)
      // })
    }
  }
</script>
