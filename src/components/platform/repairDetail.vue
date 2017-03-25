<template>
  <group>
    <cell title="报修人" :value="UserName"></cell>
    <cell v-if="Status>1" title="联系电话" :value="UserPhone"></cell>
    <x-input v-else title="联系电话"
             :min="1"
             :max="20"
             placeholder="必填"
             keyboard="number"
             is-type="china-mobile"
             :value.sync="UserPhone"
             v-ref:inputphone></x-input>
    <cell v-if="Status>1" title="报修班级" :value="ClassName"></cell>
    <popup-picker v-else title="报修班级"
                  :data="classList"
                  :columns="(classList && classList.length>0)?1:0"
                  :value.sync="selectClass" show-name>
    </popup-picker>
  </group>
  <group title="维修地址">
    <x-textarea :max="100" placeholder="如:本班教室" :value.sync="Address"></x-textarea>
  </group>
  <group title="情况描述">
    <x-textarea :max="200" placeholder="请简单描述下情况" :value.sync="FromContent"></x-textarea>
  </group>
  <group v-show="Status<2 || ExtTxt2.length>1" title="图片上传">
    <uploader :readonly="Status>1" :imageurl="ExtTxt2" @select="onFileSelect" @success="onUpSuccess"
              @error="onFileError"></uploader>
  </group>
  <div v-show="Status>0">
    <cell title="当前状态" :value="StatusDesc"></cell>
    <x-textarea v-show="Status>1" :value.sync="FromMemo"></x-textarea>
  </div>
  <box gap="10px 10px" v-show="Status<2">
    <flexbox>
      <flexbox-item>
        <x-button :disabled="!isCanSubmit" type="primary" @click="isAskShow=true">{{ButtonTxt}}</x-button>
      </flexbox-item>
      <flexbox-item v-show="Status>0">
        <x-button type="warn" @click="isAskdel=true">删除</x-button>
      </flexbox-item>
    </flexbox>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" :title="'您确定要'+ButtonTxt+'?'"
           @on-confirm="uploadFile">
  </confirm>
  <confirm :show.sync="isAskdel" confirm-text="确定" cancel-text="取消" :title="'您确定要删除?'"
           @on-confirm="deletePost">
  </confirm>
</template>
<style>
  .weui_input{
    /*text-align: right;*/
  }
</style>
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
  let fileHandle = null
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
        isAskdel: false,
        UserName: '',
        UserPhone: '',
        ClassName: '',
        Address: '',
        ExtTxt2: '', // 图片路径
        FromContent: '',
        Status: 0,
        FromId: '',
        ButtonTxt: '提交',
        classList: [],
        selectClass: []
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
        if (this.UserPhone && this.UserPhone.length > 0 && this.$refs.inputphone && this.$refs.inputphone.valid) {
          if (this.Address && this.Address.length > 0) {
            if (this.FromContent && this.FromContent.length > 0) {
              if (this.selectClass && this.selectClass.length > 0) {
                return true
              }
            }
          }
        }
        return false
      }
    },
    methods: {
      onFileSelect(file) {
        fileHandle = file
      },
      onUpSuccess(file, ret) {
        fileHandle = null
        this.ExtTxt2 = ret.info
        this.postData()
      },
      onFileError(file, err) {
        AppHelper.showMsg({type: 'warn', width: '12em', msg: '图片上传失败!'})
      },
      deletePost() {
        AppHelper.post2(AppHelper.ApiUrls.workFlow_delete, {fromId: this.FromId}, pagePrefix).then(() => {
          AppHelper.showMsg('删除成功')
          let backPath = {path: '/repair', append: true}
          this.$route.router.replace(backPath)
        }).catch((error) => {
          AppHelper.showMsg('删除失败' + error)
        })
      },
      uploadFile() {
        if (this.selectClass.length < 1) {
          AppHelper.showMsg('请选择班级')
          return
        }
        if (fileHandle) {
          fileHandle.upload()
        } else {
          this.postData()
        }
      },
      postData() {
        let postData = {}
        Object.assign(postData, this.$data)
        postData.classId = this.selectClass[0]
        postData.Status = 1
        postData.FromTypeId = 'logisticsRepair' // 维修
        if (postData.FromId && postData.FromId.length < 10) {
          delete postData.FromId // 新增
        }
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_post, postData, pagePrefix).then(() => {
          AppHelper.showMsg('提交成功')
          let backPath = {path: '/repair', append: true}
          this.$route.router.replace(backPath)
        })
      },
      loadData() {
        const cfg = {
          action: 'bzrClass'
        }
        if (this.Status === 0) {
          cfg.action += ',ownerInfo'
        }
        AppHelper.post2(AppHelper.ApiUrls.getCommInfo, cfg, pagePrefix).then((jsonData) => {
          this.$data = Object.assign({}, this.$data, jsonData.data)
          let cList = jsonData.data.bzrClassList
          if (cList && cList.length > 0) {
            this.classList = []
            for (var i in cList) {
              this.classList.push({value: cList[i].ClassId, name: cList[i].ClassName})
            }
            if (!this.ClassId) {
              this.ClassId = this.classList[0].value
            }
          }
          if (this.ClassId) {
            this.selectClass = [this.ClassId]
          }
          let ownerInfo = jsonData.data.ownerInfo
          if (ownerInfo && ownerInfo.UserId) {
            this.$data = Object.assign({}, this.$data, ownerInfo)
          }
        })
      }
    }
  }
</script>