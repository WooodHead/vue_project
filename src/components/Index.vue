<template>
  <div>
    <group title="查看成绩">
      <cell title="教师测试" :link="'/select/?userType=1&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
      <cell title="家长测试" :link="'/select/?userType=2&uid=71c466a3-156a-4a23-bd8c-d8f560b5ce40_temp'"></cell>
    </group>
    <group title="我的品德发展">
      <cell title="教师测试" :link="'/rating/?userType=1&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
      <cell title="家长测试" :link="'/rating/?userType=2&uid=71c466a3-156a-4a23-bd8c-d8f560b5ce40_temp'"></cell>
    </group>
    <group title="对父母的评价">
      <cell title="教师测试" :link="'/rating/?userType=1&typeCode=101&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
      <cell title="家长测试" :link="'/rating/?userType=2&typeCode=101&uid=71c466a3-156a-4a23-bd8c-d8f560b5ce40_temp'"></cell>
    </group>
    <group title="创新展台">
      <cell title="教师测试" :link="'/platform/?userType=1&typeCode=102&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
    </group>
    <group title="家访工作">
      <cell title="家长测试" :link="'/homeVisit/?userType=2&uid=81cb14c5-621d-41b9-b031-94a6de024ebf_temp'"></cell>
    </group>
  </div>
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
      return {
      }
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
