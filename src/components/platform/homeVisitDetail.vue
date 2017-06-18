<template>
  <group>
    <cell title="学生姓名" :value="MemberName"></cell>
    <cell title="家访教师" :value="UserName"></cell>
    <cell title="访问时间" :value="HappenTime.substring(0,10)"></cell>
  </group>
  <group title="交流沟通(在校)" v-show="ExtTxt3&&ExtTxt3.length>0">
    <div class="weui_cell weui_cells_title">{{{ ExtTxt3 }}}</div>
  </group>
  <group title="基本情况">
    <x-input title="受访家长" :min="1" :max="20" placeholder="必填" :value.sync="MemberName1"></x-input>
    <x-input title="联系电话" :min="1" :max="20" placeholder="必填" keyboard="number" is-type="china-mobile"
             :value.sync="MemberPhone1"></x-input>
    <div v-for="item in ExtTxt2">
      <x-input :title="item.title" :min="1" placeholder="必填" :max="50"
               :value.sync="item.desc"></x-input>
    </div>
  </group>
  <group :title="item.title" v-for="item in ExtTxt5">
    <x-textarea :max="200" placeholder="必填" :value.sync="item.desc"></x-textarea>
  </group>
  <group title="家长反馈">
    <x-textarea :max="200" placeholder="必填" :value.sync="ExtTxt4"></x-textarea>
  </group>
  <box gap="10px 10px" v-show="Status!==2">
    <x-button :disabled="!isCanSubmit" type="warn" @click="isAskShow=true">提交</x-button>
  </box>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消" title="您确定要提交?" @on-confirm="postData">
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

  import AppHelper from 'util/apphelper'

  const pagePrefix = 'platform'

  let dataSet = {
    isAskShow: false,
    HappenTime: '',
    ExtTxt2: [
      {
        title: '家庭地址',
        desc: ''
      },
      {
        title: '工作单位',
        desc: ''
      },
      {
        title: '家庭结构',
        desc: ''
      },
      {
        title: '学习环境',
        desc: ''
      },
      {
        title: '教育现状',
        desc: ''
      }
    ],
    ExtTxt5: [
      {
        title: '行为习惯',
        desc: ''
      },
      {
        title: '学习情况',
        desc: ''
      },
      {
        title: '其它情况',
        desc: ''
      }
    ]
  }
  export default {
    components: {
      Group,
      Panel,
      Cell,
      XButton,
      Confirm,
      XInput,
      Box,
      XTextarea
    },
    data() {
      return dataSet
    },
    created() {
      this.loadData()
    },
    computed: {
      isCanSubmit() {
        if (this.MemberName1 && this.MemberName1.length > 0) {
          if (this.ExtTxt4 && this.ExtTxt4.length > 0) {
            if (this.ExtTxt2 && this.ExtTxt2.length > 0) {
              for (var i = 0; i < this.ExtTxt2.length; i++) {
                if (!this.ExtTxt2[i].desc || this.ExtTxt2[i].desc.length < 1) {
                  return false
                }
              }
              if (this.ExtTxt5 && this.ExtTxt5.length > 0) {
                for (i = 0; i < this.ExtTxt5.length; i++) {
                  if (!this.ExtTxt5[i].desc || this.ExtTxt5[i].desc.length < 1) {
                    return false
                  }
                }
                return true
              }
            }
          }
        }
        return false
      }
    },
    methods: {
      postData() {
        let postData = {}
        postData.MemberName1 = this.MemberName1
        postData.MemberPhone1 = this.MemberPhone1
        postData.ExtTxt4 = this.ExtTxt4
        postData.MemberId1 = AppHelper.getUserId() // 家长ID
        postData.FromTypeId = 'familyCommunication' // 家访类型
        postData.ExtTxt2 = JSON.stringify(this.ExtTxt2)
        postData.ExtTxt5 = JSON.stringify(this.ExtTxt5)
        postData.FromId = AppHelper.getParams('fromId')
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_post, postData, pagePrefix).then(() => {
          AppHelper.showMsg('提交成功')
          let backPath = {path: '/homeVisit', append: true}
          this.$route.router.go(backPath)
        })
      },
      loadData() {
        const cfg = {
          fromId: AppHelper.getParams('fromId')
        }
        AppHelper.post2(AppHelper.ApiUrls.homeVisit_detail, cfg, pagePrefix).then((jsonData) => {
          if (jsonData.data.ExtTxt2 && jsonData.data.ExtTxt2.length > 0) {
            jsonData.data.ExtTxt2 = JSON.parse(jsonData.data.ExtTxt2)
          }
          if (jsonData.data.ExtTxt5 && jsonData.data.ExtTxt5.length > 0) {
            jsonData.data.ExtTxt5 = JSON.parse(jsonData.data.ExtTxt5)
          }
          if (jsonData.data.ExtTxt3 && jsonData.data.ExtTxt3.length > 20) {
            jsonData.data.ExtTxt3 = jsonData.data.ExtTxt3.replace(/\n/g, '<br/><br/>')
          } else {
            delete jsonData.data.ExtTxt3
          }
          dataSet = Object.assign({}, dataSet, jsonData.data)
          this.$data = dataSet
        })
      }
    }
  }
</script>