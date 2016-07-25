<template>
  <group :title="headTitle">
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
  </group>
  <group v-if="subjects.length > 3" title="成绩分析图">
    <div id="mainChart" style="width:100%;height:350px;padding:0 10px 10px 10px"></div>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import Cell from 'vux-src/cell'
  import Flexbox from 'vux-src/flexbox'
  import FlexboxItem from 'vux-src/flexbox-item'
  import AppHelper from 'util/apphelper'

  export default {
    components: {
      Group,
      Cell,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        headTitle: '小明的2015学年半期考试',
        subjects: [{
          subName: '总分',
          score: 388,
          avgScore: 270,
          maxValue: 400
        }, {
          subName: '语文',
          score: 81,
          avgScore: 80,
          maxValue: 120
        }, {
          subName: '数学',
          score: 91,
          avgScore: 85,
          maxValue: 120
        }, {
          subName: '英语',
          score: 90,
          avgScore: 82,
          maxValue: 100
        }, {
          subName: '科学',
          score: 70,
          avgScore: 82,
          maxValue: 100
        }]
      }
    },
    created() {
      if (this.subjects.length < 4) {
        return
      }
      const indicator = []
      const userScores = []
      const avgScores = []
      for (var i in this.subjects) {
        const one = this.subjects[i]
        if (one.subName !== '总分') {
          indicator.push({
            name: one.subName,
            max: one.maxValue
          })
          userScores.push(one.score)
          avgScores.push(one.avgScore)
        }
      }
      AppHelper.script('echarts', () => {
        // 基于准备好的dom，初始化echarts实例
        const myChart = window.echarts.init(document.getElementById('mainChart'))
          // 绘制图表
        myChart.setOption({
          title: {
            show: false
          },
          legend: {
            top: 'bottom',
            padding: [10, 0, 0, 0],
            data: ['个人得分', '班级评价分']
          },
          radar: {
            // shape: 'circle',
            indicator: indicator
          },
          series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [{
              value: userScores,
              name: '个人得分'
            }, {
              value: avgScores,
              name: '班级评价分'
            }]
          }]
        })
      })
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
