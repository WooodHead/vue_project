<template>
  <group title="筛选条件">
    <popup-picker v-if="userType===1" title="已选择班级" :data="classList" :columns="1" :value.sync="selectClass" show-name></popup-picker>
    <popup-picker v-else title="已选择学生" :data="studentList" @on-hide="onHide" :columns="1" :value.sync="selectClass" show-name></popup-picker>
    <popup-picker title="已选择学年" :data="yearsList" :columns="1" :value.sync="selectYear" show-name></popup-picker>
  </group>
  <group title="考试列表" v-if="userType===1">
    <cell v-for="item in exams" :title="item.name" :value="item.time" :link="'/exams/'+item.id"></cell>
  </group>
  <group title="考试列表" v-else>
    <cell v-for="item in exams" :title="item.name" :value="item.time" :link="'/exams/'+item.id + '/user/' + selectUser.value"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'

  export default {
    components: {
      Group,
      PopupPicker,
      Cell
    },
    created: function() {
      if (this.$route.query.userType) {
        this.userType = parseInt(this.$route.query.userType)
      }
    },
    data: function() {
      return {
        userType: 1,
        selectClass: ['1'],
        selectYear: ['2012'],
        exams: [{
          id: '1',
          name: '2015年下学期期末考试',
          time: '2016-01-30'
        }, {
          id: '2',
          name: '2015年下学期期末考试',
          time: '2016-01-30'
        }, {
          id: '3',
          name: '2015年上学期期末考试',
          time: '2015-06-30'
        }, {
          id: '4',
          name: '2015年上学期期末考试',
          time: '2015-06-30'
        }],
        classList: [{
          name: '2012级1班',
          value: '1'
        }, {
          name: '2012级2班',
          value: '2'
        }, {
          name: '2012级3班',
          value: '3'
        }, {
          name: '2012级4班',
          value: '4'
        }],
        yearsList: [{
          name: '2012学年',
          value: '2012'
        }, {
          name: '2013学年',
          value: '2013'
        }, {
          name: '2014学年',
          value: '2014'
        }, {
          name: '2015学年',
          value: '2015'
        }],
        studentList: [{
          name: '张三',
          value: '1'
        }, {
          name: '陈鑫',
          value: '2'
        }, {
          name: '小强',
          value: '3'
        }, {
          name: '黎明',
          value: '4'
        }],
        selectUser: {
          value: '1'
        }
      }
    },
    methods: {
      onHide(type) {
        if (this.userType === 2) {
          const _ = require('lodash')
          this.selectUser = _.find(this.studentList, {
            value: this.selectClass[0]
          })
        }
      }
    }
  }
</script>
