<template>
  <div style="margin-bottom:50px">
    <group :title="headTitle">
      <nodata v-show="!subjects||subjects.length<1"></nodata>
      <div v-show="subjects&&subjects.length>0">
        <flexbox :gutter="0" class="flex-tab flex-tab-head">
          <flexbox-item :span="1/3">科目</flexbox-item>
          <flexbox-item :span="itemSpan">得分</flexbox-item>
          <flexbox-item v-if="(itemType&2)===2" :span="itemSpan">平均分</flexbox-item>
          <flexbox-item v-if="(itemType&4)===4" :span="itemSpan">表现分</flexbox-item>
        </flexbox>
        <div class="hr_line"></div>
        <flexbox v-for="item in subjects" class="flex-tab" :gutter="0">
          <flexbox-item :span="1/3">{{ item.subName }}</flexbox-item>
          <flexbox-item :span="itemSpan">{{ item.score }}</flexbox-item>
          <flexbox-item v-if="(itemType&2)===2" :span="itemSpan">{{ item.avgScore }}</flexbox-item>
          <flexbox-item v-if="(itemType&4)===4" :span="itemSpan">{{ item.showScore }}</flexbox-item>
        </flexbox>
      </div>
    </group>
    <group title="成绩分析图" v-show="indicators&&indicators.length>3">
      <div id="mainChart" style="margin-bottom:20px;height:350px;padding:0 10px 10px 10px"></div>
    </group>
    <group title="教师评语" v-show="comments&&comments.length>0">
      <panel :list="comments" :type="type"></panel>
    </group>
  </div>
  <tabbar v-show="isCanComment" style="position:fixed">
    <box gap="5px 5px" style="width:100%">
      <x-button type="primary" @click="showPopup=true">填写评价</x-button>
    </box>
  </tabbar>
  <popup :show.sync="showPopup">
    <div>
      <group>
        <x-textarea :max="200" placeholder="我想对自己说" :value.sync="studentComment"></x-textarea>
        <x-textarea :max="200" placeholder="爸爸妈妈的话" :value.sync="parentComment"></x-textarea>
      </group>
      <box gap="5px">
        <x-button type="primary" :disabled="submitDisable" @click="isAskShow=true">提交评价</x-button>
      </box>
    </div>
  </popup>
  <confirm :show.sync="isAskShow" confirm-text="确定" cancel-text="取消"
           title="注意,评价提交后不可更改!" @on-confirm="submitData">
    <p style="text-align:center;">您确定要提交?</p>
  </confirm>
</template>
<script>
  import XTextarea from 'vux-src/x-textarea'
  import Group from 'vux-src/group'
  import Panel from 'vux-src/panel'
  import Cell from 'vux-src/cell'
  import {Flexbox, FlexboxItem} from 'vux-src/flexbox'
  import {Tabbar, TabbarItem} from 'vux-src/tabbar'
  import XButton from 'vux-src/x-button'
  import Box from 'vux-src/box'
  import Popup from 'vux-src/popup'
  import Confirm from 'vux-src/confirm'

  import AppHelper from 'util/apphelper'
  const pagePrefix = 'Exams'
  let mMyChart
  export default {
    components: {
      Group,
      Confirm,
      Panel,
      XTextarea,
      Cell,
      Flexbox,
      FlexboxItem,
      Tabbar,
      TabbarItem,
      XButton,
      Popup,
      Box
    },
    data() {
      return {
        type: '2',
        showPopup: false,
        isAskShow: false,
        itemSpan: 1 / 3,
        itemType: 2,
        submitDisable: true,
        isCanComment: false,
        studentComment: '',
        parentComment: '',
        indicators: []
      }
    },
    created() {
      AppHelper.script('echarts', () => {
        // 基于准备好的dom，初始化echarts实例
        const nodeDom = document.getElementById('mainChart')
        if (nodeDom) {
          nodeDom.innerHTML = ''
          nodeDom.style.width = window.innerWidth + 'px'
          mMyChart = window.echarts.init(nodeDom)
          this.loadData(mMyChart)
        }
      })
    },
    watch: {
      studentComment (txt) {
        if (txt && txt.length > 0) {
          if (this.parentComment && this.parentComment.length > 0) {
            this.submitDisable = false
          }
        } else {
          this.submitDisable = true
        }
      },
      parentComment (txt) {
        if (txt && txt.length > 0) {
          if (this.studentComment && this.studentComment.length > 0) {
            this.submitDisable = false
          }
        } else {
          this.submitDisable = true
        }
      }
    },
    methods: {
      txt1changed(txt) {
        if (txt && txt.length > 0) {

        } else {
          this.submitDisable = false
        }
      },
      txt2changed(txt) {
        if (txt && txt.length > 0) {

        } else {
          this.submitDisable = false
        }
      },
      submitData() {
        const option = {
          studentId: AppHelper.getParams('studentId'),
          scoreId: AppHelper.getParams('examId'),
          studentComment: this.studentComment,
          parentComment: this.parentComment
        }
        AppHelper.post(AppHelper.ApiUrls.exams_postcomment, option, pagePrefix).then((jsonData) => {
          console.log('exams_postcomment', jsonData)
          this.studentComment = ''
          this.parentComment = ''
          this.isCanComment = false
          AppHelper.showMsg('评价提交成功')
          this.loadData(mMyChart)
        })
        this.showPopup = false
      },
      loadData(myChart) {
        const cfg = {
          studentId: AppHelper.getParams('studentId'),
          currentUserId: AppHelper.getUserId(),
          examId: AppHelper.getParams('examId')
        }
        var objData = this.$data
        this.indicators = []
        AppHelper.post(AppHelper.ApiUrls.exams_student, cfg, pagePrefix).then((jsonData) => {
          objData = Object.assign({}, objData, jsonData.data)
          this.$data = objData
          if (this.itemType === 2 || this.itemType === 4) {
            this.itemSpan = 1 / 3
          } else {
            this.itemSpan = 2 / 9
          }
          if (!this.subjects || this.subjects.length < 4) {
            return
          }
          const userScores = []
          const avgScores = []
          const len = this.subjects.length
          for (let i = 0; i < len; i++) {
            const one = this.subjects[i]
            let score = 0
            if (one.isShowChart === true && one.score && one.score !== '') {
              try {
                score = parseFloat(one.score)
              } catch (e) {
              }
            }
            if (score > 0) {
              let maxScore = one.maxValue
              if (one.score > maxScore) {
                maxScore = one.score
              }
              if (one.avgScore > maxScore) {
                maxScore = one.avgScore
              }
              this.indicators.push({
                name: one.subName,
                max: maxScore
              })
              userScores.push(one.score)
              avgScores.push(one.avgScore)
            }
          }
          // 数据太少不用绘图
          if (this.indicators.length < 4) {
            return
          }
          // 绘制图表
          myChart.setOption({
            title: {
              show: false
            },
            legend: {
              top: 'bottom',
              padding: [10, 0, 0, 0],
              data: ['个人得分', '班级评均分']
            },
            radar: {
              // shape: 'circle',
              indicator: this.indicators
            },
            series: [{
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [{
                value: userScores,
                name: '个人得分'
              }, {
                value: avgScores,
                name: '班级评均分'
              }]
            }]
          })
        })
      }
    }
  }
</script>
<style>
  .flex-tab-head {
    background-color: #fbf9fe;
  }

  .flex-tab {
    padding-left: 15px;
  }

  .hr_line {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

</style>
