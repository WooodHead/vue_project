<template>
  <group title="筛选条件">
    <popup-picker v-if="this.userType==1 && classList && classList.length>0" title="已选择班级" :data="classList"
                  :columns="(classList && classList.length>0)?1:0"
                  :value.sync="selectClass" show-name></popup-picker>
    <popup-picker v-if="this.userType==2 && studentList && studentList.length>0" title="已选择学生" :data="studentList"
                  :columns="(studentList && studentList.length>0)?1:0"
                  :value.sync="selectClass" show-name></popup-picker>
    <popup-picker title="已选择学年" :data="yearsList" :columns="(yearsList && yearsList.length>0)?1:0"
                  :value.sync="selectYear" show-name></popup-picker>
  </group>
  <group title="评价列表">
    <nodata v-show="!ratings"></nodata>
    <cell v-for="item in ratings" :title="item.RatingName" :value="item.RatingStatus"
          :inline-desc="item.BeginTime + ' 至 ' + item.EndTime"
          :link="'/rating/'+item.RatingMasterId + (userType===1?'':'/user/'+selectClass[0]) + '?typeCode=' + mTypeCode + '&typeName='+mTypeName">
    </cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'
  const _ = require('lodash')
  const pagePrefix = 'Rating'
  // 全局变量,注意不要与其他页面重名
  // 重定向后可保存页面数据
  let mExamsLoadType = 0
  let mExamsYear = ''
  const ratingSelect = {
    components: {
      Group,
      PopupPicker,
      Cell
    },
    data() {
      return {
        selectYear: [],
        selectClass: [],
        yearsList: [],
        classList: [],
        studentList: [],
        studentStore: {},
        mTypeCode: AppHelper.getParams('typeCode', '100'),
        mTypeName: AppHelper.getParams('typeName', ''),
        userType: AppHelper.getUserType()
      }
    },
    created() {
      this.loadData(1)
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
          } else if (this.userType === 2) {
            // 切换学生
            var classId = this.studentStore[val[0]]
            AppHelper.setStudentId(val[0], pagePrefix)
            AppHelper.setClassId(classId, pagePrefix)
          }
          this.loadData(2)
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
        }
        mExamsLoadType = type
        switch (mExamsLoadType) {
          case 1: // 第一次加载
            break
          case 2: // 切换班级或者学生
            mExamsYear = ''
            this.selectYear = []
            this.yearsList = []
            delete this.ratings
            break
          case 3: // 切换学年
            delete this.ratings
            break
        }
        const cfg = {
          loadType: mExamsLoadType,
          semesterYear: mExamsYear,
          ratingTypeCode: AppHelper.getParams('typeCode', '100')
        }
        AppHelper.post2(AppHelper.ApiUrls.rating_index, cfg, pagePrefix).then((jsonData) => {
          this.$data = Object.assign({}, this.$data, jsonData.data)
          if (this.classList && this.classList.length > 0 && this.userType !== 1) {
            this.userType = 1
            AppHelper.setUserType(1)
          } else if (this.studentList && this.studentList.length > 0 && this.userType !== 2) {
            this.userType = 2
            AppHelper.setUserType(2)
          }
          if (this.selectYear.length < 1 && this.yearsList.length > 0) {
            mExamsYear = this.yearsList[0].value
            this.selectYear = [mExamsYear]
          }
          if (this.userType === 1) {
            if (this.classList.length > 0) {
              if (!AppHelper.getClassId(pagePrefix) || !_.some(this.classList, {value: AppHelper.getClassId(pagePrefix)})) {
                AppHelper.setClassId(this.classList[0].value, pagePrefix)
              }
              if (this.selectClass.length < 1 && AppHelper.getClassId(pagePrefix)) {
                this.selectClass = [AppHelper.getClassId(pagePrefix)]
              }
            }
          } else {
            if (this.studentList.length > 0) {
              if (!AppHelper.getStudentId(pagePrefix) || !_.some(this.studentList, {value: AppHelper.getStudentId(pagePrefix)})) {
                AppHelper.setStudentId(this.studentList[0].value, pagePrefix)
                AppHelper.setClassId(this.studentList[0].classId, pagePrefix)
              }
              if (this.selectClass.length < 1) {
                this.selectClass = [AppHelper.getStudentId(pagePrefix)]
              }
              this.studentStore = {}
              for (var i = 0; i < this.studentList.length; i++) {
                var student = this.studentList[i]
                this.studentStore[student.value] = student.classId
              }
            }
          }
        })
      }
    }
  }
  export default ratingSelect
</script>