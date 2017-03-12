<template>
  <group title="维修列表">
    <nodata v-if="!rows || rows.length<1 "></nodata>
    <cell v-else v-for="item in rows" :title="item.FromContent" :value="item.StatusDesc"
          :inline-desc="item.CreateTime"
          @click="onClick(item)"></cell>
  </group>
  <box gap="10px 10px">
    <x-button type="primary" @click="addNew">我要报修</x-button>
  </box>
  <style>
    .weui_cell_primary {
     text-overflow:ellipsis;
     white-space:nowrap;
     overflow:hidden;
    }



  </style>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'
  import Box from 'vux-src/box'
  import XButton from 'vux-src/x-button'

  // 全局变量,注意不要与其他页面重名
  const pagePrefix = 'platform'

  const visitList = {
    components: {
      Group,
      Cell,
      Box,
      XButton
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
          fromTypeId: 'logisticsRepair',
          isForParent: '1'
        }
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_list, cfg, pagePrefix).then((jsonData) => {
          this.$data = jsonData.data
        })
      },
      addNew () {
        this.onClick({FromId: 'new'})
      },
      onClick (item) {
        this.$store.dispatch('putData', item)
        this.$route.router.go('/repair/' + item.FromId)
      }
    }
  }
  export default visitList
</script>