<template>
  <group :title="headTitle">
    <nodata v-show="!subjects||subjects.length<1"></nodata>
    <div v-show="subjects&&subjects.length>0">
      <flexbox :gutter="0" class="flex-tab flex-tab-head">
        <flexbox-item :span="5">科目</flexbox-item>
        <flexbox-item :span="3">得分</flexbox-item>
        <flexbox-item :span="4">平均分</flexbox-item>
      </flexbox>
      <div class="hr_line"></div>
      <flexbox v-for="item in subjects" class="flex-tab" :gutter="0">
        <flexbox-item :span="5">{{ item.subName }}</flexbox-item>
        <flexbox-item :span="3">{{ item.score }}</flexbox-item>
        <flexbox-item :span="4">{{ item.avgScore }}</flexbox-item>
      </flexbox>
    </div>
  </group>
  <group title="成绩分析图" v-show="subjects&&subjects.length>0">
    <div id="mainChart" style="margin-bottom:20px;height:350px;padding:0 10px 10px 10px"></div>
  </group>
  <group title="教师评语" v-show="comments&&comments.length>0">
    <panel :list="comments" :type="type"></panel>
  </group>
</template>
<script>
  import { Panel, Group, Cell, Flexbox, FlexboxItem } from 'vux-src'
  import AppHelper from 'util/apphelper'

  export default {
    components: {
      Group,
      Panel,
      Cell,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        type: '2'
      }
    },
    created() {
      AppHelper.script('echarts', () => {
        // 基于准备好的dom，初始化echarts实例
        const nodeDom = document.getElementById('mainChart')
        if (nodeDom) {
          nodeDom.innerHTML = ''
          nodeDom.style.width = window.innerWidth + 'px'
          this.loadData(window.echarts.init(nodeDom))
        }
      })
    },
    methods: {
      loadData(myChart) {
        const cfg = {
          studentId: AppHelper.getParams('studentId'),
          examId: AppHelper.getParams('examId')
        }
        var objData = this.$data
        AppHelper.post(AppHelper.ApiUrls.exams_student, cfg).then((jsonData) => {
          objData = Object.assign({}, objData, jsonData.data)
          this.$data = objData
          if (!this.subjects || this.subjects.length < 4) {
            return
          }
          const indicators = []
          const userScores = []
          const avgScores = []
          const len = this.subjects.length
          for (let i = 0; i < len; i++) {
            const one = this.subjects[i]
            if (one.isShowChart === true) {
              indicators.push({
                name: one.subName,
                max: one.maxValue
              })
              userScores.push(one.score)
              avgScores.push(one.avgScore)
            }
          }
          // 数据太少不用绘图
          if (indicators.length < 4) {
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
              indicator: indicators
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
