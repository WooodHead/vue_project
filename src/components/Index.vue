<template>
  <group >
    <cell title="教师角色测试" :link="'/select/?userType=1'" ></cell>
    <cell title="家长角色测试" :link="'/select/?userType=2'"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  export default {
    components: {
      Group,
      Cell
    },
    data() {
      return {}
    }
  }
</script>
