<template>
  <group title="筛选条件">
    <popup-picker v-if="userType===1" title="已选择班级" :data="classList" :columns="(classList && classList.length>0)?1:0"
                  :value.sync="selectClass" show-name></popup-picker>
    <popup-picker v-else title="已选择学生" :data="studentList" :columns="(studentList && studentList.length>0)?1:0"
                  :value.sync="selectClass" show-name></popup-picker>
    <popup-picker title="已选择学年" :data="yearsList" :columns="(yearsList && yearsList.length>0)?1:0"
                  :value.sync="selectYear" show-name></popup-picker>
  </group>
  <group title="考试列表" v-if="userType===1">
    <nodata v-show="!exams"></nodata>
    <cell v-for="item in exams" :title="item.name" :inline-desc="item.gradeName" :value="item.time"
          :link="'/exams/'+item.id"></cell>
  </group>
  <group title="考试列表" v-else>
    <nodata v-show="!exams"></nodata>
    <cell v-for="item in exams" :title="item.name" :inline-desc="item.gradeName" :value="item.time"
          :link="'/exams/'+item.id + '/user/'+selectClass[0]"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'
  const _ = require('lodash')
  const pagePrefix = 'Exams'

  // 全局变量,注意不要与其他页面重名
  // 重定向后可保存页面数据
  let mExamsLoadType = 0
  let mExamsYear = ''
  let dataSet = {
    yearsList: [],
    selectYear: [],
    selectClass: [],
    classList: [],
    studentList: []
  }
  const examsSelect = {
    components: {
      Group,
      PopupPicker,
      Cell
    },
    data() {
      return dataSet
    },
    created() {
      // if (mExamsLoadType === 0) {
      this.loadData(1)
      // }
    },
    watch: {
      selectClass(val, oldVal) {
        if (!oldVal || oldVal.length === 0 || val === oldVal) {
          return
        }
        if (val && val.length > 0) {
          // 选择班级结束
          if (this.userType === 1) {
            // 切换班级
            AppHelper.setClassId(val[0], pagePrefix)
            this.loadData(2)
          } else if (this.userType === 2) {
            // 切换学生
            AppHelper.setStudentId(val[0], pagePrefix)
            this.loadData(2)
          }
        }
      },
      selectYear(val, oldVal) {
        if (!oldVal || oldVal.length === 0 || val === oldVal) {
          return
        }
        if (val && val.length > 0) {
          // 切换学年
          if (mExamsYear !== val[0]) {
            mExamsYear = val[0]
            this.loadData(3)
          }
        }
      }
    },
    methods: {
      loadData(type) {
        if (this.userType !== AppHelper.getUserType()) {
          this.userType = AppHelper.getUserType()
          this.selectClass = []
          this.classList = []
          this.studentList = []
          delete dataSet.exams
        }
        mExamsLoadType = type
        switch (mExamsLoadType) {
          case 1: // 第一次加载
            break
          case 2: // 切换班级或者学生
            mExamsYear = ''
            this.selectYear = []
            dataSet.yearsList = []
            delete dataSet.exams
            break
          case 3: // 切换学年
            delete dataSet.exams
            break
        }
        const cfg = {
          // isFirseLoad: true,
          loadType: mExamsLoadType,
          examsYear: mExamsYear
        }
        AppHelper.post(AppHelper.ApiUrls.exams_index, cfg, pagePrefix).then((jsonData) => {
          dataSet = Object.assign({}, dataSet, jsonData.data)
          this.$data = dataSet
          if (this.selectYear.length < 1 && this.yearsList.length > 0) {
            mExamsYear = this.yearsList[0].value
            this.selectYear = [mExamsYear]
          }
          if (this.userType === 1) {
            if (this.classList.length > 0) {
              if (AppHelper.getClassId(pagePrefix).length < 1 || !_.some(this.classList, {value: AppHelper.getClassId(pagePrefix)})) {
                AppHelper.setClassId(this.classList[0].value, pagePrefix)
              }
              if (this.selectClass.length < 1) {
                this.selectClass = [AppHelper.getClassId(pagePrefix)]
              }
            }
          } else if (this.userType === 2) {
            if (this.studentList.length > 0) {
              if (AppHelper.getStudentId(pagePrefix).length < 1 || !_.some(this.studentList, {value: AppHelper.getStudentId(pagePrefix)})) {
                AppHelper.setStudentId(this.studentList[0].value, pagePrefix)
              }
              if (this.selectClass.length < 1) {
                this.selectClass = [AppHelper.getStudentId(pagePrefix)]
              }
            }
          }
        })
      }
    }
  }
  export default examsSelect
</script>
