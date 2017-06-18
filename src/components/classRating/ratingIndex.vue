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
      height: 50px;
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
      padding-left: 10px;
      padding-bottom: 15px;
      margin-top: 10px;
    }

    .pingItemDiv .itemName {
      padding: 10px 0px 8px 6px;
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
      height: 480px;
    }
    .weui_cells_title {
      margin-top: .2em;
      margin-bottom: .2em;
      padding-left: 15px;
      padding-right: 15px;
      color: #000;
      font-size: 15px;
    }

  </style>
  <div style="background-color: #fff;margin-top: -15px;padding-top: 5px;">
    <group :title="today">
      <popup-picker title="选择评价项" :data="ratingItemList" :columns="(ratingItemList && ratingItemList.length>0)?1:0"
                    :value.sync="ratingItemSelectedId"
                    @on-show="onShow" @on-hide="onHide" show-name></popup-picker>
    </group>
  </div>
  <div class="pingItemDiv">
    <div class="itemName">选择班级进行评价</div>
    {{{gridHtml}}}
  </div>
  <popup :show.sync="openShow" @on-show="onPingJiaShow" @on-hide="onPingJiaHide">
    <div class="popup0">
      <group title="选择评价结果">
        <radio :options="openItems" :value.sync="openItemValue"></radio>
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
        <x-button type="primary" @click="onClosePingJia">关闭</x-button>
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

  import Uploader from 'components/uploader'

  let tempRatingItemId = null
  let $ = null
  const _ = require('lodash')
  let fileHandle = null

  export default {
    components: {
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
        buttomShow: true, // 显示底部buttom
        buttomMaxtShowTwoButton: true, // 显示'查看评价记录'和'班级评价'按钮
        buttomMaxtShowOneButton: false, // 显示 '提交班级评价'按钮
        loadType: 1, // "数据加载类型：1,初始加载，需要加载评价项信息,ratingItemId此时为""，2只加载班级信息",
        ratingItemId: '', // 当前评价项id
        orderMome: '', // 评价说明
        openShow: false, // 显示评价对话框
        openItems: ['合格(☆)', '待改进(△)', '不合格(⊙)'], // 评价对话框中 评价结果的数据源
        openItemValue: '合格(☆)', // 评价结果
        classList: [], // 班级列表
        ratingItemSelectedId: [], // 评价项目初始值
        watchRatingItemId: '',
        ratingItemList: [], // 评价项数据源
        selectedClassIds: [],
        today: '今日: ' + AppHelper.formatDate(),
        userId: AppHelper.getUserId(),
        imgPath: '' // 附加图片
      }
    },
    created () {
      if (tempRatingItemId) {
        this.ratingItemId = tempRatingItemId
      }
      this.imgPath = ''
      AppHelper.setCompanyId(AppHelper.getCompanyId())
      AppHelper.script('jquery', () => {
        $ = window.$
        this.loadData()
      })
    },
    watch: {
      ratingItemSelectedId(val, oldVal) {
        // console.log(val)
        // console.log(oldVal)
        if (!oldVal || oldVal.length === 0 || val[0] === oldVal[0]) {
          return
        }

        // console.log('self.loadType=' + this.loadType)
        if (val && val.length > 0 && this.loadType === 2) {
          // console.log('ratingItemSelectedId....')
          this.ratingItemId = val[0]
          this.loadData()
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
        AppHelper.post2(AppHelper.ApiUrls.rating_index_list, cfg).then((jsonData) => {
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
        self.openItemValue = ''
        self.orderMome = ''
        if (self.selectedClassIds.length === 1) {
          let tempInfo = _.find(self.classList, function (item) {
            return item.ClassId === self.selectedClassIds[0]
          })
          if (tempInfo && tempInfo.RatingDetails) {
            self.openItemValue = (tempInfo.RatingDetails.RatingResultDesc === '☆') ? '合格(☆)' : (tempInfo.RatingDetails.RatingResultDesc === '△' ? '待改进(△)' : '不合格(⊙)')
            self.orderMome = tempInfo.RatingDetails.Mome || ''
            self.imgPath = tempInfo.RatingDetails.ImgPath || ''
          }
        }
        this.openShow = true
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
        if (this.openItemValue === '') {
          AppHelper.alert('请选择评价结果')
          return
        }
        if (fileHandle) {
          fileHandle.upload()
        } else {
          this.onSubmitPingJia()
        }
      },
      onSubmitPingJia (imgPath) {
        let self = this
        if (self.openItemValue === '') {
          AppHelper.alert('请选择评价结果')
          return
        }
        let cfg = {
          companyId: AppHelper.getCompanyId(),
          userId: AppHelper.getUserId(),
          classIds: self.selectedClassIds.join(','),
          ratingItemId: self.ratingItemId,
          ratingMome: self.orderMome
        }
        if (imgPath) {
          cfg.imgPath = imgPath // 图片路径
        } else {
          cfg.imgPath = ''
        }
        if (self.openItemValue === '合格(☆)') {
          cfg.ratingItemResult = 1
        } else if (self.openItemValue === '待改进(△)') {
          cfg.ratingItemResult = 2
        } else {
          cfg.ratingItemResult = 3
        }
        // console.log(cfg)
        AppHelper.post(AppHelper.ApiUrls.rating_save_new, cfg).then((jsonData) => {
          // console.log(self.selectedClassIds)
          let tempClass = _.filter(self.classList, function (item) {
            return (_.indexOf(self.selectedClassIds, item.ClassId) > -1)
          })
          _.each(tempClass, function (item) {
            item.RatingDetails = {
              RatingResultDesc: (cfg.ratingItemResult === 1) ? '☆' : (cfg.ratingItemResult === 2 ? '△' : '⊙'),
              Mome: cfg.ratingMome,
              ImgPath: cfg.imgPath
            }
            let thisTd = $('#' + item.ClassId)
            thisTd.html(item.ClassName + '<span style="color:red">' + item.RatingDetails.RatingResultDesc + '</span>')
            thisTd.css('background-color', '#eee')
            // self.onItemClick(item.ClassId)
          })
          self.watchRatingItemId = new Date().getTime()
          self.openShow = false
          self.imgPath = ''
        })
      },
      onClosePingJia () {
        this.openShow = false
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
        AppHelper.link('/rating/index/list?uid=' + this.userId)
      }
    },
    computed: {
      gridHtml: function () {
        if (!this.classList || this.classList.length < 1) {
          return ''
        }
        let html = '<table class="classTb ' + this.ratingItemId + '" cellspacing="10">'
        let rowCount = 3
        let self = this
        // console.log('classList==>', self.classList)
        for (let i = 0; i < self.classList.length; i++) {
          if (i % rowCount === 0) {
            html += '<tr>'
          }
          let className = self.classList[i].ClassName
          if (self.classList[i].RatingDetails) {
            className = className + '<span style="color:red">' + self.classList[i].RatingDetails.RatingResultDesc + '</span>'
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