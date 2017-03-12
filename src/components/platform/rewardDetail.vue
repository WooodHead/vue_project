<template>
  <group>
    <x-input title="奖项名称"
             :min="1"
             :max="50"
             placeholder="必填"
             :value.sync="FromTitle">
    </x-input>
    <datetime title="获奖时间"
              :min-year="currentYear-1"
              :max-year="currentYear"
              :value.sync="HappenTime"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              @on-change="datechange"
              year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
    <popup-picker title="获奖学生"
                  :data="studentList"
                  :columns="(studentList && studentList.length>0)?1:0"
                  :value.sync="selectStudent" show-name>
    </popup-picker>
    <popup-picker title="奖项级别"
                  :data="gjjx"
                  :columns="(gjjx && gjjx.length>0)?1:0"
                  :value.sync="selectGjjx" show-name>
    </popup-picker>
  </group>
  <group title="情况介绍">
    <x-textarea :max="200" placeholder="请简单描述下情况" :value.sync="FromContent"></x-textarea>
  </group>
  <group v-show="Status<2 || ExtTxt4.length>1" title="图片上传">
    <uploader :readonly="Status>1" :imageurl="ExtTxt4" @select="onFileSelect" @success="onUpSuccess"
              @error="onFileError"></uploader>
  </group>
  <div v-show="Status>1">
    <cell title="当前状态" :value="StatusDesc"></cell>
    <x-textarea :value.sync="FromMemo"></x-textarea>
  </div>
  <box gap="10px 10px" v-show="Status<2">
    <x-button :disabled="!isCanSubmit" type="warn" @click="isAskShow=true">{{ButtonTxt}}</x-button>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" :title="'您确定要'+ButtonTxt+'?'"
           @on-confirm="uploadFile">
  </confirm>
</template>
<script>
  import Panel from 'vux-src/panel'
  import XButton from 'vux-src/x-button'
  import Datetime from 'vux-src/datetime'
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import Confirm from 'vux-src/confirm'
  import XInput from 'vux-src/x-input'
  import XTextarea from 'vux-src/x-textarea'
  import Box from 'vux-src/box'
  import PopupPicker from 'vux-src/popup-picker'
  import DateFormatter from 'vux-src/datetime/format'

  import Uploader from 'components/uploader'
  import AppHelper from 'util/apphelper'

  const pagePrefix = 'platform'

  var NOW = new Date()

  let fileHandle = null
  export default {
    filters: {
      DateFormatter
    },
    components: {
      Group,
      Datetime,
      Panel,
      Cell,
      XButton,
      Confirm,
      XInput,
      Box,
      XTextarea,
      PopupPicker,
      Uploader
    },
    data() {
      return {
        currentYear: NOW.getFullYear(),
        isAskShow: false,
        HappenTime: DateFormatter(NOW, 'YYYY-MM-DD'),
        FromTitle: '',
        ExtTxt4: '', // 图片路径
        FromContent: '',
        Status: 0,
        FromId: '',
        ButtonTxt: '提交',
        studentList: [],
        selectStudent: [],
        gjjx: [],
        selectGjjx: []
      }
    },
    created() {
      // 获取上页详细内容
      this.FromId = AppHelper.getParams('fromId')
      let fromData = this.$store.state.data
      if (fromData) {
        this.$data = Object.assign({}, this.$data, fromData)
      }
      this.ButtonTxt = this.Status === 0 ? '提交' : '修改'
      this.loadData()
    },
    computed: {
      isCanSubmit() {
        if (this.FromTitle && this.FromTitle.length > 0) {
          if (this.FromContent && this.FromContent.length > 0) {
            return true
          }
        }
        return false
      }
    },
    methods: {
      datechange (value) {
        console.log('datechange', value)
      },
      onFileSelect(file) {
        fileHandle = file
      },
      onUpSuccess(file, ret) {
        this.ExtTxt4 = ret.info
        this.postData()
      },
      onFileError(file, err) {
        AppHelper.showMsg('图片上传失败,请重试')
      },
      uploadFile() {
        if (this.selectStudent.length < 1) {
          AppHelper.showMsg('请选择学生')
          return
        }
        if (fileHandle) {
          fileHandle.upload()
        } else {
          this.postData()
        }
      },
      postData() {
        let postData = this.$data
        postData.MemberId = this.selectStudent[0]
        postData.ExtNum1 = this.selectGjjx[0]
        postData.Status = 1
        postData.FromTypeId = 'studentReward' // 维修
        if (postData.FromId && postData.FromId.length < 10) {
          delete postData.FromId // 新增
        }
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_post, postData, pagePrefix).then(() => {
          AppHelper.showMsg('提交成功')
          let backPath = {path: '/reward', append: true}
          this.$route.router.go(backPath)
        }).catch((error) => {
          AppHelper.showMsg('提交失败' + error)
        })
      },
      loadData() {
        const cfg = {
          action: 'familyStudentList,gjjx'
        }
        AppHelper.post2(AppHelper.ApiUrls.getCommInfo, cfg, pagePrefix).then((jsonData) => {
          let cList = jsonData.data.familyStudentList
          if (cList && cList.length > 0) {
            this.studentList = []
            for (var i in cList) {
              this.studentList.push({value: cList[i].UserId, name: cList[i].ChineseName})
            }
            if (!this.MemberId) {
              this.MemberId = this.studentList[0].value
            }
          }
          this.$data = Object.assign({}, this.$data, jsonData.data)
          if (this.MemberId) {
            this.selectStudent = [this.MemberId]
          }
          if (this.ExtNum1) {
            this.selectGjjx = [this.ExtNum1 + '']
          }
        })
      }
    }
  }
</script>