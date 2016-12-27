<template>
  <group title="考试详情">
    <popup-picker title="已选择科目" :data="subjects" :columns="(subjects && subjects.length>0)?1:0" :value.sync="selectValue" show-name></popup-picker>
    <cell v-show="avgScoreStr" title="平均分" :value="avgScoreStr"></cell>
    <cell v-show="maxScoreStr" title="最高分" :value="maxScoreStr" :link="maxuserurl" ></cell>
    <cell v-show="minScoreStr" title="最低分" :value="minScoreStr" :link="minuserurl"></cell>
  </group>
  <group title="成绩列表">
    <nodata v-show="!studentList"></nodata>
    <cell v-for="item in studentList" :title="item.ranking + ' ' + item.name" :value="typeof item.score ==='number' ? item.score+'分':item.score" :link="{ path: 'user/'+item.userId, append: true}"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'
  const pagePrefix = 'Exams'

  // 全局变量,重定向后可保存页面数据
  let mLoadType = 0
  let mExamsId = ''
  let mCourseId = ''
  let dataSet = {
    selectValue: []
  }
  export default {
    components: {
      Group,
      PopupPicker,
      Cell
    },
    created() {
      if (mLoadType === 0 || mExamsId !== AppHelper.getParams('examId')) {
        mExamsId = AppHelper.getParams('examId')
        this.loadData(1)
      }
    },
    watch: {
      selectValue(val, oldVal) {
        if (!oldVal || oldVal.length === 0 || val === oldVal) {
          return
        }
        if (val && val.length > 0) {
          mCourseId = val[0]
          this.loadData(2)
        }
      }
    },
    methods: {
      loadData(type) {
        if (type === 1) {
          dataSet = {
            selectValue: []
          }
        }
        mLoadType = type
        const cfg = {
          examId: mExamsId,
          loadType: mLoadType,
          courseId: mCourseId
        }
        AppHelper.post(AppHelper.ApiUrls.exams_detail, cfg, pagePrefix).then((jsonData) => {
          delete dataSet.avgScore
          delete dataSet.maxScore
          delete dataSet.minScore

          dataSet = Object.assign({}, dataSet, jsonData.data)
          this.$data = dataSet
          if (this.selectValue.length < 1 && this.subjects.length > 0) {
            mCourseId = this.subjects[0].value
            this.selectValue = [mCourseId]
          }
          delete this.avgScoreStr
          delete this.maxScoreStr
          delete this.maxuserurl
          delete this.minScoreStr
          delete this.minuserurl
          if (this.avgScore) {
            this.avgScoreStr = this.avgScore + '分'
          }
          if (this.maxScore && this.maxScore.name) {
            this.maxuserurl = {
              path: 'user/' + this.maxScore.userId,
              append: true
            }
            this.maxScoreStr = this.maxScore.name + '(' + this.maxScore.score + '分)'
          }
          if (this.minScore && this.minScore.name) {
            this.minuserurl = {
              path: 'user/' + this.minScore.userId,
              append: true
            }
            this.minScoreStr = this.minScore.name + '(' + this.minScore.score + '分)'
          }
        })
      }
    },
    data() {
      return dataSet
    }
  }
</script>
