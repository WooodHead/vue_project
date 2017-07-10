<template>
  <style>
    body {
      background-color: #eee;
    }
    .classTb {
      width: 100%;
      background-color: #fff;
    }

    .classTb td {
      border-radius: 7px;
      height: 40px;
      background-color: #eee;
      text-align: center;
      width: 25%;
    }

    .selectBorder {
      color: white;
    }

    .panelDiv {
      border-radius: 7px;
      margin: 10px;
    }

    .bottom-mask {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      color: #000;
      z-index: 200;
      border-top: 1px solid #e5e5e5;
      height: 40px;
      line-height: 40px;
      padding: 10px;
      margin-left: auto;
      margin-right: auto;
      max-width: 700px;
    }

    .bottom-mask button {
      height: 40px;
      margin-right: 10px;
      font-size: 14px;
    }

    .pingItemDiv {
      background-color: #ffffff;
      padding-left: 5px;
      padding-bottom: 15px;
      margin-top: 10px;
    }

    .pingItemDiv .itemName {
      padding: 10px 0px 8px 10px;
    }

    .lineline {
      border: none;
      height: 1px;
      margin-top: 8px;
      background-color: #eee;
    }

    .vux-no-group-title {
      margin-top: 0px;
    }

    .popup0 {
      padding-bottom: 15px;
      margin-bottom:50px;
      height: 500px;
      overflow-y:auto;
    }
    .weui_cells_title {
      margin-top: .2em;
      margin-bottom: .2em;
      padding-left: 15px;
      padding-right: 15px;
      color: #000;
      font-size: 15px;
    }
    .btn_mini{
       font-size: 12px;
       margin:5px 0px 5px 10px;
    }
  </style>
  <group :title="today" style="background-color: #fff;padding-top: 5px;">
    <popup-picker title="选择评价项" :data="ratingItemList" :columns="(ratingItemList && ratingItemList.length>0)?1:0"
                  :value.sync="ratingItemSelectedId"
                  @on-show="onShow" @on-hide="onHide" show-name></popup-picker>
  </group>
  <div class="pingItemDiv">
    <div class="itemName">选择班级进行评价</div>
    {{{gridHtml}}}
  </div>
  <popup :show.sync="openShow" @on-show="onPingJiaShow" @on-hide="onPingJiaHide">
    <div class="popup0">
      <group :title="'当前评价项: '+ratingItemValue">
        <cell title="评分">
          <rater
            :value.sync="ratingItemResult"
            :max="5">
          </rater>
        </cell>
      </group>
      <group title="不合格的项目">
        <flexbox v-if="openItems&&openItems.length>0" :gutter="0" align="center" wrap="wrap">
          <flexbox-item v-for="b in openItems" :span="1/2">
            <x-button class="btn_mini" @click="onBtnSelect(b)"
                      style="width:88%"
                      :type="b.typeName"
                      :text="b.ItemName">
            </x-button>
          </flexbox-item>
        </flexbox>
        <div style="margin:5px 0px 5px 15px;" v-else>未配置</div>
      </group>
      <group title="图片上传">
        <uploader :imageurl="imgPath" @select="onFileSelect"
                  @success="onUpSuccess"
                  @error="onFileError">
        </uploader>
      </group>
      <group title="评价描述:">
        <x-textarea :max="200" placeholder="请填写详细信息" :value.sync="orderMome"></x-textarea>
      </group>
    </div>
  </popup>
  <div style="line-height: 40;height: 40px;"></div>
  <div class="bottom-mask" v-show="buttomShow">
    <flexbox v-show="buttomMaxtShowTwoButton">
      <flexbox-item>
        <x-button type="primary" @click="onView">查看评价记录</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="warn" @click="onOpenPingJia" style="background-color: #F75224">班级评价</x-button>
      </flexbox-item>
    </flexbox>
    <flexbox v-show="buttomMaxtShowOneButton">
      <flexbox-item>
        <x-button type="primary" @click="openShow=false">关闭</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="warn" @click="uploadFile" style="background-color: #F75224">提交班级评价</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<script>
  import AppHelper from 'util/apphelper'
  import XButton from 'vux-src/x-button'
  import Divider from 'vux-src/divider'
  import PopupPicker from 'vux-src/popup-picker'
  import Popup from 'vux-src/popup'
  import Group from 'vux-src/group'
  import Radio from 'vux-src/radio'
  import XTextarea from 'vux-src/x-textarea'
  import {Flexbox, FlexboxItem} from 'vux-src/flexbox'
  import Rater from 'vux-src/rater'
  import Cell from 'vux-src/cell'
  import Box from 'vux-src/box'

  import Uploader from 'components/uploader'

  let tempRatingItemId
  let $
  const _ = require('lodash')
  let fileHandle = null

  export default {
    components: {
      Rater,
      Box,
      Cell,
      XButton,
      Divider,
      Flexbox,
      FlexboxItem,
      PopupPicker,
      Group,
      Popup,
      Radio,
      XTextarea,
      Uploader
    },
    data () {
      return {
        subItemlist: {}, // 评价项子项
        buttomShow: true, // 显示底部buttom
        buttomMaxtShowTwoButton: true, // 显示'查看评价记录'和'班级评价'按钮
        buttomMaxtShowOneButton: false, // 显示 '提交班级评价'按钮
        loadType: 1, // "数据加载类型：1,初始加载，需要加载评价项信息,ratingItemId此时为""，2只加载班级信息",
        ratingItemId: '', // 当前评价项id
        ratingItemValue: '', // 当前评价项文字
        orderMome: '', // 评价说明
        openShow: false, // 显示评价对话框
        openItems: [], // 评价对话框中 评价结果的数据源
        ratingItemResult: 0, // 评价结果
        classList: [], // 班级列表
        ratingItemSelectedId: [], // 评价项目初始值
        watchRatingItemId: '',
        ratingItemList: [], // 评价项数据源
        selectedClassIds: [],
        today: '今日: ' + AppHelper.formatDate(),
        userId: AppHelper.getUserId(),
        subItemIds: '',
        imgPath: '' // 附加图片
      }
    },
    created () {
      if (tempRatingItemId) {
        this.ratingItemId = tempRatingItemId
      }
      this.imgPath = ''
      if (!$) {
        AppHelper.script('jquery', () => {
          $ = window.$
          this.loadData()
        })
      } else {
        this.loadData()
      }
    },
    watch: {
      ratingItemSelectedId(val, oldVal) {
        if (val && val.length > 0 && oldVal && oldVal.length) {
          this.ratingItemId = val[0]
          this.ratingItemValue = _.find(this.ratingItemList, {value: this.ratingItemId}).name
          if (this.loadType === 2) {
            this.loadData()
          }
        }
      },
      watchRatingItemId () {
        var self = this
        $('.gridTd').removeClass('selectBorder')
        $('.gridTd').unbind('click')
        $('.gridTd').bind('click', function () {
          let id = $(this).attr('id')
          // console.log(id)
          self.onItemClick(id)
        })
      }
    },
    methods: {
      loadData: function () {
        var self = this
        var cfg = {
          companyId: AppHelper.getCompanyId(),
          userId: this.userId,
          loadType: this.loadType,
          ratingItemId: this.ratingItemId
        }
        AppHelper.post2(AppHelper.ApiUrls.rating2_index_list, cfg).then((jsonData) => {
          self.classList = jsonData.data.classList
          self.watchRatingItemId = jsonData.data.ratingItemId
          // console.log('ratingItems:', jsonData.data.ratingItems)
          if (self.loadType === 1) {
            if (jsonData.data.ratingItems) {
              self.ratingItemList = jsonData.data.ratingItems
              self.ratingItemSelectedId = [jsonData.data.ratingItemId]
              self.ratingItemId = jsonData.data.ratingItemId
            }
            AppHelper.setUserId(cfg.userId)
            self.loadType = 2
          }
          tempRatingItemId = self.ratingItemId
        })
      },
      onBtnSelect: function (b) {
        if (b.typeName === 'primary') {
          b.typeName = 'default'
          var reg = new RegExp(b.RatingSubItemId + ',', 'g')
          this.subItemIds.replace(reg, '')
        } else {
          b.typeName = 'primary'
          this.subItemIds += (b.RatingSubItemId + ',')
        }
      },
      onItemClick: function (itemId) {
        // console.log(itemId)
        let thisTd = $('#' + itemId)
        if (thisTd.hasClass('selectBorder')) {
          thisTd.css('background-color', '#eee')
        } else {
          thisTd.css('background-color', '#5cb85c')
        }
        thisTd.toggleClass('selectBorder')
      },
      onOpenPingJia: function () {
        // console.log('dddd')
        // AppHelper.link('/pingbi/create')
        let self = this
        self.selectedClassIds = []
        $('.gridTd').each(function () {
          let thisTd = $(this)
          if (thisTd.hasClass('selectBorder')) {
            // console.log(thisTd.attr('id'))
            self.selectedClassIds.push(thisTd.attr('id'))
          }
        })
        if (self.selectedClassIds.length === 0) {
          AppHelper.alert('请至少选择一个班级')
          return
        }
        self.orderMome = ''
        if (self.selectedClassIds.length === 1) {
          let tempInfo = _.find(self.classList, function (item) {
            return item.ClassId === self.selectedClassIds[0]
          })
          if (tempInfo && tempInfo.RatingDetails) {
            self.ratingItemResult = tempInfo.RatingDetails.RatingResultForAvg || 0
            self.orderMome = tempInfo.RatingDetails.Mome || ''
            self.imgPath = tempInfo.RatingDetails.ImgPath || ''
            self.subItemIds = ''
            if (tempInfo.RatingDetails.RatingSubDetaiList && tempInfo.RatingDetails.RatingSubDetaiList.length > 0) {
              var subItems = tempInfo.RatingDetails.RatingSubDetaiList
              for (var x = 0; x < subItems.length; x++) {
                self.subItemIds += (subItems[x].RatingSubItemId + ',')
              }
            }
          }
        }
        if (!this.subItemlist || !this.subItemlist[this.ratingItemId]) {
          var cfg = {
            userId: this.userId,
            ratingItemId: this.ratingItemId
          }
          AppHelper.post2(AppHelper.ApiUrls.rating2_subItemlist, cfg).then((jsonData) => {
            if (jsonData && jsonData.data) {
              for (var i = 0; i < jsonData.data.length; i++) {
                jsonData.data[i].typeName = 'default'
                if (this.subItemIds && this.subItemIds.length > 1) {
                  if (this.subItemIds.indexOf(jsonData.data[i].RatingSubItemId) > -1) {
                    jsonData.data[i].typeName = 'primary'
                  }
                }
              }
              this.subItemlist[this.ratingItemId] = jsonData.data
              this.openItems = jsonData.data
              this.openShow = true
              return
            }
          })
        } else {
          this.openItems = this.subItemlist[this.ratingItemId]
          if (this.subItemIds && this.subItemIds.length > 1) {
            for (var i = 0; i < this.openItems.length; i++) {
              this.openItems[i].typeName = 'default'
              if (this.subItemIds.indexOf(this.openItems[i].RatingSubItemId) > -1) {
                this.openItems[i].typeName = 'primary'
              }
            }
          }
          this.openShow = true
        }
      },
      onFileSelect(file) {
        fileHandle = file
      },
      onUpSuccess(file, ret) {
        fileHandle = null
        if (file) { // 上传文件后自动提交数据
          this.onSubmitPingJia(ret.info)
        }
      },
      onFileError(file, err) {
        AppHelper.showMsg({type: 'warn', width: '12em', msg: '图片上传失败!'})
      },
      uploadFile() {
        if (this.ratingItemResult < 1) {
          AppHelper.alert('请评分')
          return
        }
        if (fileHandle) {
          fileHandle.upload()
        } else {
          this.onSubmitPingJia()
        }
      },
      onSubmitPingJia (imgPath) {
        if (this.ratingItemResult < 1) {
          AppHelper.alert('请评分')
          return
        }
        let self = this
        let cfg = {
          companyId: AppHelper.getCompanyId(),
          userId: AppHelper.getUserId(),
          classIds: self.selectedClassIds.join(','),
          ratingItemId: self.ratingItemId,
          ratingItemResult: self.ratingItemResult,
          ratingMome: self.orderMome
        }
        if (imgPath) {
          cfg.imgPath = imgPath // 图片路径
        } else {
          cfg.imgPath = ''
        }
        if (self.subItemIds && self.subItemIds.lastIndexOf(',') > 0) {
          cfg.subItemIds = self.subItemIds
        }
        // console.log(cfg)
        AppHelper.post(AppHelper.ApiUrls.rating2_save_new, cfg).then((jsonData) => {
          // console.log(self.selectedClassIds)
          let tempClass = _.filter(self.classList, function (item) {
            return (_.indexOf(self.selectedClassIds, item.ClassId) > -1)
          })
          _.each(tempClass, function (item) {
            item.RatingDetails = {
              RatingResultForAvg: cfg.ratingItemResult,
              Mome: cfg.ratingMome,
              ImgPath: cfg.imgPath
            }
            let thisTd = $('#' + item.ClassId)
            thisTd.html(item.ClassName + '<span style="color:red">' + item.RatingDetails.RatingResultForAvg + '☆</span>')
            thisTd.css('background-color', '#eee')
          })
          if (self.openItems && self.openItems.length > 0) {
            for (var i = 0; i < self.openItems.length; i++) {
              self.openItems[i].typeName = 'default'
            }
          }
          self.ratingItemResult = 0
          self.subItemIds = ''
          self.watchRatingItemId = new Date().getTime()
          self.openShow = false
          self.imgPath = ''
        })
      },
      onShow () {
        this.buttomShow = false
      },
      onHide (type) {
        this.buttomShow = true
      },
      onPingJiaShow () {
        this.buttomMaxtShowTwoButton = false
        this.buttomMaxtShowOneButton = true
      },
      onPingJiaHide (type) {
        this.buttomMaxtShowTwoButton = true
        this.buttomMaxtShowOneButton = false
      },
      onView() {
        AppHelper.link('/rating2/index/list?uid=' + this.userId)
      }
    },
    computed: {
      gridHtml: function () {
        if (!this.classList || this.classList.length < 1) {
          return ''
        }
        let html = '<table class="classTb ' + this.ratingItemId + '" cellspacing="5" cellpadding="0">'
        let rowCount = 3
        let self = this
        // console.log('classList==>', self.classList)
        for (let i = 0; i < self.classList.length; i++) {
          if (i % rowCount === 0) {
            html += '<tr>'
          }
          let className = self.classList[i].ClassName
          if (self.classList[i].RatingDetails) {
            className = className + '<span style="color:red"> ' + self.classList[i].RatingDetails.RatingResultForAvg + '☆</span>'
            // console.log(className)
          }
          html += '<td class="gridTd" id="' + self.classList[i].ClassId + '" >' + className + '</td>'
          if (i % rowCount === (rowCount - 1)) {
            html += '</tr>'
          }
        }
        html += '</table>'
        // console.log('gridHtml....')
        return html
      }
    }
  }
</script>