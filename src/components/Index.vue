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
      <cell title="教师测试"
            :link="'/rating/?userType=1&typeCode=101&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
      <cell title="家长测试"
            :link="'/rating/?userType=2&typeCode=101&uid=71c466a3-156a-4a23-bd8c-d8f560b5ce40_temp'"></cell>
    </group>
    <group title="创新展台">
      <cell title="教师测试"
            :link="'/platform/?userType=1&typeCode=102&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
    </group>
    <group title="家访工作">
      <cell title="家长测试" :link="'/homeVisit/?userType=2&uid=81cb14c5-621d-41b9-b031-94a6de024ebf_temp'"></cell>
    </group>
    <group title="后勤报修">
      <cell title="教师测试"
            :link="'/repair/?userType=1&typeCode=102&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
    </group>
    <group title="我的奖状">
      <cell title="家长测试" :link="'/reward/?userType=2&uid=81cb14c5-621d-41b9-b031-94a6de024ebf_temp'"></cell>
      <uploader @select="onFileSelect"
                @success="onUpSuccess"
                @error="onFileError">
      </uploader>
    </group>
    <group title="班级评比">
      <cell title="教师测试"
            :link="'/rating/index/?uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp&companyId=0d81a477-0e48-4231-bb46-3888e55a4d2f_temp'"></cell>
    </group>
  </div>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import Uploader from 'components/uploader'
  import AppHelper from 'util/apphelper'

  export default {
    components: {
      Group,
      Cell,
      Uploader
    },
    data() {
      return {}
    },
    methods: {
      onFileSelect(file) {
        // file.upload()
        AppHelper.showMsg(file.name)
      },
      onUpSuccess(file, ret) {
        AppHelper.showMsg('图片上传成功')
        console.log('onSuccess:', ret)
      },
      onFileError(file, err) {
        AppHelper.showMsg('图片上传失败')
        console.log('onError:', err)
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
