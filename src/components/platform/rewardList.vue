<template>
  <group title="获奖列表">
    <my-Scroller :data-source.sync="dataSource"
                 :page-config.once="pageConfig"
                 h="-100px"
                 :search-config.sync="searchConfig">
      <cell v-else v-for="item in dataSource.rows" :title="item.FromTitle" :value="item.StatusDesc"
            :inline-desc="item.ExtTxt3"
            @click="onClick(item)"></cell>
    </my-Scroller>
  </group>
  <box gap="10px 10px">
    <x-button type="primary" @click="addNew">添加奖状</x-button>
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

  import myScroller from 'components/myScroller'

  const visitList = {
    components: {
      Group,
      Cell,
      Box,
      XButton,
      myScroller
    },
    data() {
      return {
        dataSource: {},
        pageConfig: {
          url: AppHelper.ApiUrls.homeVisit_list,
          readyIsLoad: true,
          limit: 10,
          offset: 1
        },
        searchConfig: {
          fromTypeId: 'studentReward',
          isForParent: '1'
        }
      }
    },
    methods: {
      addNew () {
        this.onClick({FromId: 'new'})
      },
      onClick (item) {
        this.$store.dispatch('putData', item)
        this.$route.router.go('/reward/' + item.FromId)
      }
    }
  }
  export default visitList
</script>