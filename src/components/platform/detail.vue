<template>
  <nodata v-show="!RatingItems||RatingItems.length<1"></nodata>
  <card>
    <div slot="content" style="padding: 15px;">
      <h3>{{RatingName}}</h3>
      <div>
        <p v-if="BeginTime">时间: {{BeginTime + ' 至 ' + EndTime}}</p>
        <p v-if="Memo">说明: {{Memo}}</p>
      </div>
    </div>
  </card>
  <div v-for="item in RatingItems">
    <div class="weui_cells_title" @click="dropDown(item.RatingItemId)">
      <div class="weui_cell_bd weui_cell_primary">{{item.ItemName}}</div>
      <div class="weui_cell_ft">
          <span class="demo_arrow"
                :class="dropDownClass[item.RatingItemId]?dropDownClass[item.RatingItemId]:'normal'"></span>
      </div>
    </div>
    <div v-if="item.Memo" class="weui_panel"
         :class="panelClass[item.RatingItemId]?panelClass[item.RatingItemId]:'panel_hide'">
      <div class="weui_media_box">
        <p class="weui_media_desc">{{{item.Memo | dealString}}}</p>
      </div>
    </div>
    <x-number class="weui_cells" :fillable="!CanPingJia"
              :title="getTitle(item)"
              @on-change="onchanged(item)"
              :value.sync="item.RatingScore" :min="item.MinScore" :max="item.MaxScore">
    </x-number>
  </div>
  <box gap="10px 10px" v-show="CanPingJia">
    <x-button :disabled="!isCanSubmit" type="warn" @click="isAskShow=true">提交评价</x-button>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" title="您确定要提交评价?" @on-confirm="postRating">
  </confirm>
  <style>
    .weui_cells {
      margin-top: .1em;
      font-size: 14px;
    }
    .weui_cells_title {
      position: relative;
      display: flex;
      color: #000;
      font-size: 17px;
      height: 20px;
      align-items: center;
      margin-top: .5em;
    }
    .weui_media_box{
      padding: 5px 15px 5px 15px;
    }
    .weui_media_box .weui_media_desc {
      -webkit-line-clamp: 100;
    }
    .panel_hide {
      height:0px;
    }
    @-webkit-keyframes Expand {
        from { -webkit-transform:scaleY(0); }
        to { -webkit-transform:scaleY(1); }
    }
    @keyframes Expand {
        from { transform:scaleY(0); }
        to { transform:scaleY(1); }
    }
    @-webkit-keyframes Callapse {
        from { -webkit-transform:scaleY(1); }
        to { -webkit-transform:scaleY(0); }
    }
    @keyframes Callapse {
        from { transform:scaleY(1); }
        to { transform:scaleY(0); }
    }
    .panel_callapse {
      height:0px;
      -webkit-transform-origin:top;
      -webkit-animation:Callapse 0.4s;
      -webkit-animation-fill-mode:forwards;
      transform-origin:top;
      animation:Callapse 0.4s;
      animation-fill-mode:forwards;
    }
    .panel_expand {
      -webkit-transform-origin:top;
      -webkit-animation:Expand 0.4s;
      -webkit-animation-fill-mode:forwards;
      transform-origin:top;
      animation:Expand 0.4s;
      animation-fill-mode:forwards;
    }
    .demo_arrow {
      display: inline-block;
      height: 6px;
      width: 6px;
      border-width: 2px 2px 0 0;
      border-color: #C8C8CD;
      border-style: solid;
      position: relative;
      top: -1px;
      margin-left: .3em;
    }
    .normal {
      transform: rotate(135deg);
      background-color: none;
      -webkit-transform:rotate(135deg);
    }
    .rotateDown {
      -webkit-transform-origin: 50% 40%;
      transform-origin: 50% 40%;
      -webkit-transform:rotate(-45deg);
      -webkit-transition:all .3s ease-in .1s;
      transform:rotate(-45deg);
      transition:all .3s ease-in .1s;
    }

    .rotateUp {
      -webkit-transform-origin: 50% 40%;
      transform-origin: 50% 40%;
      -webkit-transform:rotate(135deg);
      -webkit-transition:all .3s ease-in .1s;
      transform:rotate(135deg);
      transition:all .3s ease-in .1s;
    }

  </style>
</template>
<script>
  import Panel from 'vux-src/panel'
  import XButton from 'vux-src/x-button'
  import Box from 'vux-src/box'
  import Confirm from 'vux-src/confirm'
  import Card from 'vux-src/card'
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import XNumber from 'vux-src/x-number'

  import AppHelper from 'util/apphelper'
  import dealString from 'util/dealString'

  const pagePrefix = 'platform'

  export default {
    components: {
      Group,
      Panel,
      Card,
      Cell,
      XButton,
      Box,
      Confirm,
      XNumber
    },
    filters: {
      dealString
    },
    data() {
      return {
        SelectItems: null,
        panelClass: {},
        dropDownClass: {},
        isAskShow: false,
        isChanged: false,
        ResultItmes: []
      }
    },
    created() {
      this.loadData()
    },
    computed: {
      isCanSubmit() {
        if (this.CanPingJia && this.isChanged) {
          this.isChanged = false
          if (this.RatingItems.length > 0) {
            for (var i = 0; i < this.RatingItems.length; i++) {
              let one = this.RatingItems[i]
              if (!one.RatingScore || one.RatingScore < 1) {
                return false
              }
            }
            return true
          }
        }
        return false
      }
    },
    methods: {
      getTitle(item) {
        let str = '平均分: '
        if (item.RatingAvgScore > 0) {
          str += item.RatingAvgScore
        } else {
          str += '无'
        }
        // if (item.RatingCount > 0) {
        //   str += ' <span style="color: #CCC;">共' + item.RatingCount + '人</span>'
        // }
        return str
      },
      onchanged(item) {
        if (item) {
          if (item.RatingScore === 1 && !item.changed) {
            item.RatingScore = item.MaxScore
            item.changed = true
          }
        }
        this.isChanged = true
      },
      dropDown(itemId) {
        if (itemId) {
          var newval = false
          if (!this.panelClass[itemId] || this.panelClass[itemId] === 'panel_callapse') {
            newval = true
          }
          var newObj = {}
          newObj[itemId] = newval ? 'panel_expand' : 'panel_callapse'
          this.panelClass = Object.assign({}, this.panelClass, newObj)
          newObj[itemId] = newval ? 'rotateDown' : 'rotateUp'
          this.dropDownClass = Object.assign({}, this.dropDownClass, newObj)
        }
      },
      postRating() {
        let postItems = []
        for (var i = 0; i < this.RatingItems.length; i++) {
          let one = this.RatingItems[i]
          postItems.push({ItemId: one.RatingItemId, RatingScore: one.RatingScore})
        }
        let cfg = {
          ratingMasterId: this.RatingMasterId,
          RatingItmes: postItems
        }
        AppHelper.post2(AppHelper.ApiUrls.rating_post, cfg, pagePrefix).then((jsonData) => {
          // console.log('post2====>jsonData ', jsonData)
          AppHelper.showMsg(jsonData.data)
          let backPath = {path: '/platform/', append: true}
          this.$route.router.go(backPath)
        })
      },
      loadData() {
        const cfg = {
          ratingMasterId: AppHelper.getParams('masterId')
        }
        var objData = this.$data
        AppHelper.post2(AppHelper.ApiUrls.platform_detail, cfg, pagePrefix).then((jsonData) => {
          objData = Object.assign({}, objData, jsonData.data)
          this.$data = objData
        })
      }
    }
  }
</script>