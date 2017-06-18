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
      <div v-if="item.Memo" class="weui_cell_ft">
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
      <div v-show="isItemShow(item,u.RatingType)" v-for="u in RatingUsers">
        <div v-if="item.ContentType===3">
          <cell v-if="isDisabled(item)">
            {{ textItmes[item.RatingItemId][u.RatingType].Memo || '未填写' }}
          </cell>
          <x-textarea
            v-else
            placeholder="请输入内容"
            :max="200"
            @on-change="textChange(item,u.RatingType)"
            :value.sync="textItmes[item.RatingItemId][u.RatingType].Memo">
          </x-textarea>
        </div>
        <cell v-if="item.ContentType===2" :title="u.Title">
          <rater
            slot="value"
            :disabled="isDisabled(item)"
            @click="textChange(item,u.RatingType)"
            :value.sync="textItmes[item.RatingItemId][u.RatingType].RatingScore"
            :max="item.MaxScore">
          </rater>
        </cell>
        <cell v-if="item.ContentType===1" :title="u.Title">
          <my-rater v-if="currentType===1" :disabled="u.RatingType!==1"
                    :data="{ItemId:item.RatingItemId,UserType:u.RatingType}"
                    @item-select="itemSelect"
                    :select-item="getOneItem(item.RatingItemId,u.RatingType)"
                    :items="u.RatingType!==1||!CanPingJia?[getOneItem(item.RatingItemId,u.RatingType)]:SelectItems"></my-rater>
          <my-rater v-else :disabled="u.RatingType===1"
                    :data="{ItemId:item.RatingItemId,UserType:u.RatingType}"
                    @item-select="itemSelect"
                    :select-item="getOneItem(item.RatingItemId,u.RatingType)"
                    :items="u.RatingType===1||!CanPingJia?[getOneItem(item.RatingItemId,u.RatingType)]:SelectItems"></my-rater>
        </cell>
      </div>
    </div>
  </div>
  <box gap="10px 10px" v-show="CanPingJia">
    <x-button type="warn" @click="isCanSubmit">提交评价</x-button>
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
  import XTextarea from 'vux-src/x-textarea'
  import Rater from 'vux-src/rater'

  import AppHelper from 'util/apphelper'
  import MyRater from './myRater'
  import dealString from 'util/dealString'

  const _ = require('lodash')
  const pagePrefix = 'Rating'

  let mStudentId = ''
  export default {
    components: {
      Group,
      XTextarea,
      Rater,
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
        submitCount: 0,
        SelectItems: null,
        panelClass: {},
        dropDownClass: {},
        isAskShow: false,
        ResultItmes: [],
        textItmes: {},
        currentType: AppHelper.getUserType()
      }
    },
    created() {
      mStudentId = AppHelper.getParams('studentId')
      this.currentType = AppHelper.getUserType()
      this.loadData()
    },
    methods: {
      isCanSubmit() {
        if (this.CanPingJia && this.ResultItmes.length === this.submitCount) {
          // 用户需要提交的选项总数量
          this.isAskShow = true
          return
        }
        AppHelper.alert('请填写完所有评价项目再提交!')
      },
      textChange(item, UserType) {
        let curItem = this.textItmes[item.RatingItemId][UserType]
        // 加入到提交数组
        this.itemSelect(curItem, {ItemId: item.RatingItemId, UserType: UserType})
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
        let cfg = {
          studentIds: [mStudentId],
          ratingMasterId: this.RatingMasterId,
          RatingItmes: this.ResultItmes
        }
        AppHelper.post2(AppHelper.ApiUrls.rating_post, cfg, pagePrefix).then((jsonData) => {
          AppHelper.showMsg(jsonData.data)
          let backPath = {path: '/rating/', append: true}
          if (this.currentType === 1 && this.RatingMasterId) {
            backPath.path = backPath.path + this.RatingMasterId
          }
          let typeCode = AppHelper.getParams('typeCode', '100')
          if (typeCode) {
            backPath.path += '?typeCode=' + typeCode
            typeCode = AppHelper.getParams('typeName', '')
            if (typeCode) {
              backPath.path += '&typeName=' + typeCode
            }
          }
          this.$route.router.go(backPath)
        })
      },
      itemSelect(item, ratingItem) {
        if (item) {
          let one
          if (this.ResultItmes.length > 0) {
            one = _.find(this.ResultItmes, {ItemId: ratingItem.ItemId, UserType: ratingItem.UserType})
          }
          let isAdd = false
          if (!one) {
            isAdd = true
            one = ratingItem
          }
          if (item.RatingItemResultId) {
            one.ResultId = item.RatingItemResultId
          } else {
            Object.assign(one, item)
          }
          if (one.ContentType === 2 && (!one.RatingScore || one.RatingScore === 0)) {
            if (isAdd) {
              isAdd = false
            } else {
              _.remove(this.ResultItmes, one)
            }
          }
          if (one.ContentType === 3 && (!one.Memo || one.Memo.length < 1)) {
            if (isAdd) {
              isAdd = false
            } else {
              _.remove(this.ResultItmes, one)
            }
          }
          if (isAdd) {
            this.ResultItmes.push(one)
          }
        }
      },
      loadData() {
        const cfg = {
          studentId: mStudentId,
          ratingMasterId: AppHelper.getParams('masterId')
        }
        var objData = this.$data
        this.submitCount = 0
        AppHelper.post2(AppHelper.ApiUrls.rating_student, cfg, pagePrefix).then((jsonData) => {
          objData = Object.assign({}, objData, jsonData.data)
          this.$data = objData
          // 评价项目
          for (var j = 0; j < this.RatingItems.length; j++) {
            var rtItem = this.RatingItems[j]
            rtItem.ContentType = rtItem.ContentType || 1
            // 指定了该选项哪些用户可以提交
            let mUserType = rtItem.UserType || this.UserType
            if ((mUserType & this.currentType) === this.currentType) {
              // 教师或家长
              this.submitCount++
            }
            // 投票有学生参与
            if (this.currentType !== 1 && (mUserType & 4) === 4) {
              // 家长要投2个人的
              this.submitCount++
            }
            if (rtItem.ContentType === 2 || rtItem.ContentType === 3) {
              this.textItmes[rtItem.RatingItemId] = {
                '1': {RatingScore: 0, ContentType: rtItem.ContentType},
                '2': {RatingScore: 0, ContentType: rtItem.ContentType},
                '4': {RatingScore: 0, ContentType: rtItem.ContentType}
              }
              let subItems = _.filter(this.ItemResults, {RatingItemId: rtItem.RatingItemId})
              if (subItems && subItems.length > 0) {
                j = 0
                for (j in subItems) {
                  this.textItmes[rtItem.RatingItemId][subItems[j].UserType] = {
                    ContentType: rtItem.ContentType,
                    RatingScore: subItems[j].ResultScore,
                    Memo: subItems[j].Memo
                  }
                }
              }
            }
          }
          // 提交的评价数据
          this.ResultItmes = []
          // 评价结果
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
              for (var i = 0; i < newItems.length; i++) {
                var item = newItems[i]
                let one = _.find(this.ResultItmes, {ItemId: item.RatingItemId, UserType: item.UserType})
                if (!one) {
                  this.ResultItmes.push({
                    ItemId: item.RatingItemId,
                    ResultId: item.RatingItemResultId,
                    UserType: item.UserType,
                    Memo: item.Memo,
                    RatingScore: item.RatingScore
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
            return item
          }
        }
        return {starImg: '∅'}
      },
      isDisabled(item) {
        if (this.CanPingJia) {
          let mUserType = item.UserType || this.UserType
          console.log(item.ItemName, mUserType, this.currentType, (mUserType & this.currentType) === this.currentType)
          if ((mUserType & this.currentType) === this.currentType) {
            return false
          }
          // 投票有学生参与
          if (this.currentType !== 1 && (mUserType & 4) === 4) {
            // 家长要投2个人的
            return false
          }
        }
        return true
      },
      isItemShow(item, mainType) {
        if (item.UserType) {
          if ((mainType & item.UserType) !== item.UserType) {
            return false
          }
        }
        // 是老师,评价项也是老师填写的
        if (this.currentType === 1 && mainType === 1) {
          return true
        }
        if (this.currentType !== 1 && mainType !== 1) {
          return true
        }
        return this.getOneItem(item.RatingItemId, mainType)
      }
    }
  }
</script>