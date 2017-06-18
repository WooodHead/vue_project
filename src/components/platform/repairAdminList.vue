<template>
  <group title="维修列表">
    <my-Scroller :data-source.sync="dataSource"
                 :page-config.once="pageConfig"
                 h="-50px"
                 :search-config.sync="searchConfig">
      <cell v-for="item in dataSource.rows"
            :title="item.FromContent"
            :value="item.StatusDesc"
            @click="onClick(item)">
        <div v-show="item.Status<3" class="vux-reddot" slot="icon"></div>
        <p class="vux-label-desc" slot="after-title">{{item.ClassName + ' ' + item.UserName}}</p>
        <p class="vux-label-desc" slot="value">{{item.CreateTime}}</p>
      </cell>
    </my-Scroller>
  </group>
  <style>
    .weui_cell_primary {
     text-overflow:ellipsis;
     white-space:nowrap;
     overflow:hidden;
    }
    .vux-label-desc {
     padding:5px 0px 0px 0px
    }
    .vux-reddot{
     top:-20px;
     right:5px;
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
          isManage: '1',
          fromTypeId: 'logisticsRepair'
        }
      }
    },
    methods: {
      onClick (item) {
        this.$store.dispatch('putData', item)
        this.$route.router.go('/repairAdmin/' + item.FromId)
      }
    }
  }
  export default visitList
</script>