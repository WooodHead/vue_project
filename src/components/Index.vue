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
      <cell title="教师测试" :link="'/rating/?typeCode=101&uid=1335ba2d-b2a6-422f-8060-5bb9ce0049cd_temp'"></cell>
      <cell title="家长测试" :link="'/rating/?typeCode=101&uid=71c466a3-156a-4a23-bd8c-d8f560b5ce40_temp'"></cell>
    </group>
  </div>
</template>
<script>
  import {Group, Panel, Cell} from 'vux-src'

  export default {
    components: {
      Group,
      Cell,
      Panel
    },
    data() {
      return {
        jisuanmoney: false,
        panelClass: 'panel_hide',
        dropDownClass: 'normal'
      }
    },
    watch: {
      // 如果要估价，该方法将内容自动上滑动
      jisuanmoney(newval) {
        if (newval) {
          // document.getElementById('solticon').style.transform = 'rotate(180deg)'
        } else {
          // document.getElementById('solticon').style.transform = 'rotate(0deg)'
        }
        this.panelClass = newval ? 'panel_expand' : 'panel_callapse'
        this.dropDownClass = newval ? 'rotateDown' : 'rotateUp'
        console.log('jisuanmoney====> ', newval, this.dropDownClass)
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
