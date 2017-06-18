<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown
              @pullup:loading="loadMore"
              @pulldown:loading="refresh"
              :pullup-status.sync="pullupStatus"
              :pulldown-config="pulldowncfg"
              :pullup-config="pullupcfg"
              :height="h"
              v-ref:scroller>
      <div class="myscrollerrootin">
        <div v-if="dataSource.rows&&dataSource.rows.length>0">
          <slot></slot>
        </div>
        <nodata v-else></nodata>
      </div>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" class="pullFix">
        <span v-show="pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="showNoData === true" style="color:#999;">没有数据了</span>
        <span v-show="pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
  </div>
</template>
<script>
  import AppHelper from 'util/apphelper'
  import scroller from 'vux-src/scroller'
  import Spinner from 'vux-src/Spinner'

  let dataSet = {rows: []}
  export default {
    components: {
      scroller,
      Spinner
    },
    props: {
      pageConfig: { // 分页配置，包括url，limit 每页大小，offset 分页便宜量
        type: Object,
        default () {
          return {
            limit: 10,
            offset: 1
          }
        }
      },
      searchConfig: { // 查询条件配置
        type: Object,
        twoWay: true,
        default () {
          return {}
        }
      },
      h: {
        type: String,
        default: 'auto'
      },
      dataSource: {
        type: Object,
        twoWay: true,
        default () {
          return {}
        }
      }
    },
    ready() {
      this.currentUuid = this.$refs.scroller.uuid
      // console.log('currentUuid=', this.currentUuid)
      if (this.pageConfig.readyIsLoad) {
        this.loadData()
      }
    },
    methods: {
      loadData(pullAction) {
        let self = this
        let cfg = Object.assign({}, self.searchConfig)
        cfg.limit = this.pageConfig.limit || 10
        cfg.offset = this.pageConfig.offset || 1
        let resultBack = (jsonData) => {
          if (cfg.offset === 1) {
            // 第一页，不数据清空为服务器端返回的数据
            dataSet = jsonData.data
          } else if (jsonData.data && jsonData.data.rows && jsonData.data.rows.length > 0) {
            // 其它页 则将现有数据与本次从数据库加载出来的数据进行合并
            dataSet.rows = dataSet.rows.concat(jsonData.data.rows)
          }
          this.dataSource = dataSet
          // 重置scroller
          this.$refs.scroller.reset()
          // 处理下啦刷新控件的状态
          this.$nextTick(() => {
            if (pullAction === 'pullup') {
              this.$broadcast('pullup:reset', self.currentUuid)
            } else {
              this.$broadcast('pulldown:reset', self.currentUuid)
            }
          })
          this.showNoData = dataSet.rows.length === dataSet.total && !this.isFirsLoad
          if (dataSet.rows.length < 1 || this.showNoData) {
            this.$broadcast('pullup:disable', self.currentUuid)
          }
          if (dataSet.total === 0) {
            this.showNoData = false
          }
          this.isFirsLoad = false
        }
        if (this.pageConfig.urlOld) {
          AppHelper.post(this.pageConfig.urlOld, cfg, 'platform').then(resultBack)
        } else {
          AppHelper.post2(this.pageConfig.url, cfg, 'platform').then(resultBack)
        }
      },
      loadMore(uuid) {
        if (!this.dataSource.rows || this.dataSource.rows.length < 1) {
          this.$broadcast('pullup:disable', uuid)
          return
        }
        this.pageConfig.limit = this.pageConfig.limit || 10
        this.pageConfig.offset = this.pageConfig.offset || 1
        this.pageConfig.offset++
        this.loadData('pullup')
      },
      refresh(uuid) {
        console.log('refresh')
        this.pageConfig.offset = 1
        this.isFirsLoad = true
        this.loadData('pulldown')
        this.$broadcast('pullup:enable', this.currentUuid)
      }
    },
    data() {
      return {
        pullupStatus: 'default',
        showDeleteConfirm: false,
        showNoData: false, // 是否显示‘没有数据了’
        isFirsLoad: true, // 是否第一次加载数据
        currentUuid: '',
        pulldowncfg: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉',
          upContent: '松开刷新',
          loadingContent: '刷新中...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        // 上拉配置
        pullupcfg: {
          content: '上拉加载',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '松开加载',
          upContent: '上拉加载',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        }
      }
    }
  }

</script>
<style>
  .pullFix {
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: -60px;
    text-align: center;
  }

  .myscrollerrootin {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
  }

  .emptydiv {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: center;
    -webkit-align-items: center;

    height: 200px;
  }



</style>
