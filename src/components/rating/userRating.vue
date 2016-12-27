<template>
  <nodata v-show="!RatingItems||RatingItems.length<1"></nodata>
  <card>
    <div slot="content" style="padding: 15px;">
      <h3>{{RatingName}}</h3>
      <div>
        <p v-if="BeginTime">时间: {{BeginTime + ' 至 ' + EndTime}}</p>
        <p v-if="SelectItems">图例:
          <my-rater :isshowall="true" :items="SelectItems"></my-rater>
        </p>
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
    <div class="weui_cells">
      <cell v-show="isItemShow(item.RatingItemId,u.RatingType)" v-for="u in RatingUsers" :title="u.Title">
        <my-rater v-if="currentType===1" :disabled="u.RatingType!==1"
                  :data="{ItemId:item.RatingItemId,UserType:u.RatingType}"
                  @item-select="itemSelect"
                  :select-item="getOneItem(item.RatingItemId,u.RatingType)[0]"
                  :items="u.RatingType!==1||!CanPingJia?getOneItem(item.RatingItemId,u.RatingType):SelectItems"></my-rater>
        <my-rater v-else :disabled="u.RatingType===1"
                  :data="{ItemId:item.RatingItemId,UserType:u.RatingType}"
                  @item-select="itemSelect"
                  :select-item="getOneItem(item.RatingItemId,u.RatingType)[0]"
                  :items="u.RatingType===1||!CanPingJia?getOneItem(item.RatingItemId,u.RatingType):SelectItems"></my-rater>
      </cell>
    </div>
  </div>
  <box gap="10px 10px" v-show="CanPingJia">
    <x-button :disabled="!isCanSubmit" type="warn" @click="isAskShow=true">提交评价</x-button>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" title="您确定要提交评价?" @on-confirm="postRating">
  </confirm>
  <style>
    .weui_btn_dialog.primary {
        color: #3385ff;
    }
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
      margin-right: 15px;
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

  import AppHelper from 'util/apphelper'
  import MyRater from './myRater'
  import dealString from 'util/dealString'

  const _ = require('lodash')
  const pagePrefix = 'Rating'

  let mStudentId = ''
  export default {
    components: {
      Group,
      Panel,
      Card,
      Cell,
      MyRater,
      XButton,
      Box,
      Confirm
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
        ResultItmes: [],
        currentType: AppHelper.getUserType()
      }
    },
    created() {
      mStudentId = AppHelper.getParams('studentId')
      this.currentType = AppHelper.getUserType()
      this.loadData()
    },
    computed: {
      isCanSubmit() {
        // console.log('ResultItmes====>', this.CanPingJia, this.isChanged)
        if (this.CanPingJia && this.isChanged) {
          var count = this.RatingItems.length
          // 投票有学生参与
          if (this.currentType !== 1 && (this.UserType & 4) === 4) {
            // 家长要投2个人的
            count = count * 2
          }
          return this.ResultItmes.length === count
        }
        return false
      }
    },
    methods: {
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
        let cfg = {
          studentIds: [mStudentId],
          ratingMasterId: this.RatingMasterId,
          RatingItmes: this.ResultItmes
        }
        AppHelper.post2(AppHelper.ApiUrls.rating_post, cfg, pagePrefix).then((jsonData) => {
          // console.log('post2====>jsonData ', jsonData)
          AppHelper.showMsg(jsonData.data)
          let backPath = {path: '/rating/', append: true}
          if (this.currentType === 1 && this.RatingMasterId) {
            backPath.path = backPath.path + this.RatingMasterId
          }
          this.$route.router.go(backPath)
        })
      },
      itemSelect(item, ratingItem) {
        if (item) {
          this.isChanged = true
          if (this.ResultItmes.length > 0) {
            let one = _.find(this.ResultItmes, {ItemId: ratingItem.ItemId, UserType: ratingItem.UserType})
            if (one) {
              // 从队列中找出,改变
              one.ResultId = item.RatingItemResultId
              return
            }
          }
          ratingItem.ResultId = item.RatingItemResultId
          // 加入选择队列
          this.ResultItmes.push(ratingItem)
        }
      },
      loadData() {
        const cfg = {
          studentId: mStudentId,
          ratingMasterId: AppHelper.getParams('masterId')
        }
        var objData = this.$data
        AppHelper.post2(AppHelper.ApiUrls.rating_student, cfg, pagePrefix).then((jsonData) => {
          objData = Object.assign({}, objData, jsonData.data)
          this.$data = objData
          this.ResultItmes = []
          if (this.ItemResults && this.ItemResults.length > 0) {
            let newItems = null
            if (this.currentType === 1) {
              // 教师只返回教师
              newItems = _.filter(this.ItemResults, {UserType: 1})
            } else {
              // 家长返回学生和家长
              newItems = _.filter(this.ItemResults, function (n) {
                return n.UserType === 2 || n.UserType === 4
              })
            }
            if (newItems && newItems.length > 0) {
              for (var i in newItems) {
                var item = newItems[i]
                let one = _.find(this.ResultItmes, {ItemId: item.RatingItemId, UserType: item.UserType})
                if (!one) {
                  this.ResultItmes.push({
                    ItemId: item.RatingItemId,
                    ResultId: item.RatingItemResultId,
                    UserType: item.UserType
                  })
                }
              }
            }
          }
        })
      },
      getOneItem(ratingItemId, type) {
        if (this.ItemResults && this.ItemResults.length > 0) {
          let item = _.find(this.ItemResults, {RatingItemId: ratingItemId, UserType: type})
          if (item) {
            return [item]
          }
        }
        return [{starImg: '∅'}]
      },
      isItemShow(ratingItemId, type) {
        // 是老师,评价项也是老师填写的
        if (AppHelper.getUserType() === 1 && type === 1) {
          return true
        }
        if (AppHelper.getUserType() !== 1 && type !== 1) {
          return true
        }
        return this.getOneItem(ratingItemId, type).length > 0
      }
    }
  }
</script>