<template>
  <style>
    .imgBox {
        margin: 5px;
        width: 50px;
        height: 50px;
        background: no-repeat center center;
        background-size: cover;
    }
  </style>
  <div class="weui_gallery" v-show.sync='imageShow' @click="imageShow=!imageShow">
      <span class="weui_gallery_img"
            :style="{'backgroundImage': 'url(' + imageurl + ')'}"></span>
  </div>
  <group>
    <cell title="报修人" :value="UserName"></cell>
    <cell title="联系电话" :value="UserPhone"></cell>
    <cell title="报修班级" :value="ClassName"></cell>
  </group>
  <group title="维修地址">
    <box gap="10px 0px 10px 15px">
      {{Address}}
    </box>
  </group>
  <group title="情况描述">
    <box gap="10px 0px 10px 15px">
      {{FromContent}}
    </box>
  </group>
  <group title="图片附件">
    <box gap="10px 0px 10px 15px" v-if="ExtTxt2 && ExtTxt2.length>1" class="imgBox weui_uploader_file_status"
         @click="imgClick(ExtTxt2)"
         :style="{'backgroundImage': 'url(' + ExtTxt2 + ')'}">
    </box>
    <box gap="10px 0px 10px 15px" v-else >
      无图片
    </box>
  </group>
  <group title="处理意见">
    <x-textarea :max="200" placeholder="请输入处理意见" :value.sync="FromMemo"></x-textarea>
  </group>
  <popup-picker title="处理状态"
                :data="statusList"
                :columns="1"
                :value.sync="selectIndex"
                show-name>
  </popup-picker>
  <box gap="10px 10px">
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click="isAskShow=true">{{ButtonTxt}}</x-button>
      </flexbox-item>
    </flexbox>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" :title="'您确定要'+ButtonTxt+'?'"
           @on-confirm="postData">
  </confirm>
</template>
<script>
  import Panel from 'vux-src/panel'
  import XButton from 'vux-src/x-button'
  import Confirm from 'vux-src/confirm'
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import XInput from 'vux-src/x-input'
  import XTextarea from 'vux-src/x-textarea'
  import Box from 'vux-src/box'
  import PopupPicker from 'vux-src/popup-picker'
  import {Flexbox, FlexboxItem} from 'vux-src/flexbox'

  import Uploader from 'components/uploader'
  import AppHelper from 'util/apphelper'

  const pagePrefix = 'platform'
  const moment = require('moment')

  export default {
    components: {
      Group,
      Panel,
      Cell,
      XButton,
      Confirm,
      XInput,
      Box,
      XTextarea,
      Flexbox,
      FlexboxItem,
      PopupPicker,
      Uploader
    },
    data() {
      return {
        isAskShow: false,
        UserName: '',
        UserPhone: '',
        ClassName: '',
        Address: '',
        ExtTxt2: '', // 图片路径
        FromContent: '',
        FromMemo: '',
        Status: 0,
        FromId: '',
        ButtonTxt: '提交',
        statusList: [{
          value: '2',
          name: '已受理'
        }, {
          value: '3',
          name: '拒绝受理'
        }, {
          value: '4',
          name: '维修完成'
        }],
        imageurl: '',
        imageShow: false,
        selectIndex: ['2']
      }
    },
    created() {
      // 获取上页详细内容
      this.FromId = AppHelper.getParams('fromId')
      let fromData = this.$store.state.data
      if (fromData) {
        this.$data = Object.assign({}, this.$data, fromData)
      }
      if (this.Status > 1) {
        this.selectIndex = [this.Status + '']
      }
    },
    methods: {
      imgClick: function (src) {
        this.imageShow = !this.imageShow
        this.imageurl = src
      },
      postData() {
        let postData = {}
        postData.Status = this.selectIndex[0]
        postData.FromTypeId = 'logisticsRepair' // 维修
        postData.FromId = this.FromId
        postData.FromMemo = this.FromMemo // 维修意见
        postData.MemberId = AppHelper.getUserId() // 处理人
        postData.ExtTime1 = moment().format('YYYY-MM-DD HH:mm:ss') // 提交日期
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_post, postData, pagePrefix).then(() => {
          AppHelper.showMsg('提交成功')
          let backPath = {path: '/repairAdmin', append: true}
          this.$route.router.replace(backPath)
        })
      }
    }
  }
</script>