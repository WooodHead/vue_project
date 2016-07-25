<template>
  <group title="考试详情">
    <popup-picker title="已选择科目" :data="subjects" :columns="1" :value.sync="selectValue" show-name></popup-picker>
    <cell title="平均分" :value="avgScore"></cell>
    <cell title="最高分" :value="maxScore.name + '(' + maxScore.score + '分)'" :link="{ path: 'user/'+maxScore.userId, append: true}" ></cell>
    <cell title="最低分" :value="minScore.name + '(' + minScore.score + '分)'" :link="{ path: 'user/'+minScore.userId, append: true}"></cell>
  </group>
  <group title="成绩列表">
    <cell v-for="item in studentList" :title="item.ranking + ' ' + item.name" :value="item.score" :link="{ path: 'user/'+item.userId, append: true}"></cell>
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
    data: function() {
      return {
        avgScore: '88',
        maxScore: {
          userId: '1',
          name: '小明',
          score: '98'
        },
        minScore: {
          userId: '2',
          name: '小红',
          score: '68'
        },
        selectValue: ['1'],
        subjects: [{
          name: '总分',
          value: '0'
        }, {
          name: '语文',
          value: '1'
        }, {
          name: '数学',
          value: '2'
        }, {
          name: '英语',
          value: '3'
        }],
        studentList: [{
          userId: '1',
          name: '小明',
          ranking: '1',
          score: '98'
        }, {
          userId: '2',
          name: '陈鑫',
          ranking: '2',
          score: '90'
        }, {
          userId: '3',
          name: '陈鑫',
          ranking: '2',
          score: '90'
        }, {
          userId: '4',
          name: '陈鑫',
          ranking: '4',
          score: '80'
        }, {
          userId: '5',
          name: '陈鑫',
          ranking: '5',
          score: '79'
        }, {
          userId: '6',
          name: '小红',
          ranking: '6',
          score: '68'
        }]
      }
    }
  }
</script>
