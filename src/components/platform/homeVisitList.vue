<template>
  <group title="家访列表">
    <nodata v-if="!rows || rows.length<1 "></nodata>
    <cell v-else v-for="item in rows" :title="item.HappenTime" :value="item.StatusDesc"
          :inline-desc="'学生:'+ item.MemberName + '    家访教师: ' + item.UserName "
          :link="'/homeVisit/'+item.FromId"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'

  // 全局变量,注意不要与其他页面重名
  const pagePrefix = 'platform'

  const visitList = {
    components: {
      Group,
      Cell
    },
    data() {
      return {
        rows: []
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        const cfg = {
          fromTypeId: 'familyCommunication',
          isForParent: '1'
        }
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_list, cfg, pagePrefix).then((jsonData) => {
          this.$data = jsonData.data
        })
      }
    }
  }
  export default visitList
</script>