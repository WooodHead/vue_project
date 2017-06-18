<template>
  <nodata v-show="!StudentList||StudentList.length<1"></nodata>
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
  <group title="学生列表">
    <cell v-for="item in StudentList" :title="item.UserName" :value="item.ResultScoreTxt"
          :link="{ path:'user/'+item.UserId + '?typeCode=' + mTypeCode + '&typeName='+mTypeName, append:true}">
      <my-rater :items="item.myRater"></my-rater>
    </cell>
  </group>
</template>
<script>
  import PopupPicker from 'vux-src/popup-picker'
  import Card from 'vux-src/card'
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'

  import MyRater from './myRater'
  import AppHelper from 'util/apphelper'
  const _ = require('lodash')
  const pagePrefix = 'Rating'
  // 全局变量,重定向后可保存页面数据
  let mExamsId = ''
  // let mClassId = AppHelper.getClassId()
  export default {
    components: {
      Group,
      PopupPicker,
      Cell,
      MyRater,
      Card
    },
    created() {
      // if (mExamsId !== AppHelper.getParams('masterId') || mClassId !== AppHelper.getClassId()) {
      mExamsId = AppHelper.getParams('masterId')
      this.loadData(1)
      // }
    },
    methods: {
      loadData(type) {
        const cfg = {
          ratingMasterId: mExamsId
        }
        AppHelper.post2(AppHelper.ApiUrls.rating_detail, cfg, pagePrefix).then((jsonData) => {
          delete this.StudentList
          this.$data = Object.assign({}, this.$data, jsonData.data)
          if (this.StudentList && this.StudentList.length > 0) {
            _(this.StudentList).forEach(function (item) {
              if (item.ResultCode) {
                item.myRater = [{
                  ResultCode: item.ResultCode,
                  ResultName: item.ResultName
                }]
              } else {
                item.myRater = []
              }
              if (item.ResultScore) {
                item.ResultScoreTxt = item.ResultScore + ' 分'
              }
            })
          }
        })
      }
    },
    data() {
      return {
        mTypeCode: AppHelper.getParams('typeCode', '100'),
        mTypeName: AppHelper.getParams('typeName', '')
      }
    }
  }
</script>
