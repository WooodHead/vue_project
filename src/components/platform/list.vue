<template>
  <group title="筛选条件">
    <popup-picker title="已选择学期" :data="yearsList" :columns="(yearsList && yearsList.length>0)?1:0"
                  :value.sync="selectYear" show-name></popup-picker>
  </group>
  <group :title="listTitle">
    <nodata v-show="!ratings"></nodata>
    <cell v-for="item in ratings" :title="item.RatingName" :value="item.RatingStatus"
          :inline-desc="item.RatingCount>0?'平均分: ' + item.RatingAvgScore + '&nbsp;&nbsp;&nbsp;&nbsp;(共' + item.RatingCount + '人)':'暂无评价'"
          :link="'/platform/'+item.RatingMasterId"></cell>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'

  // 全局变量,注意不要与其他页面重名
  const pagePrefix = 'platform'
  // 重定向后可保存页面数据
  let mExamsLoadType = 0
  let mExamsYear = ''
  let dataSet = {
    listTitle: '创新展台',
    selectYear: [],
    yearsList: []
  }
  const platformList = {
    components: {
      Group,
      PopupPicker,
      Cell
    },
    data() {
      return dataSet
    },
    created() {
      if (this.$route.query && this.$route.query.typeName) {
        this.listTitle = this.$route.query.typeName
      }
      this.loadData(1)
    },
    watch: {
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
        mExamsLoadType = type
        switch (mExamsLoadType) {
          case 1: // 第一次加载
            break
          case 3: // 切换学年
            delete dataSet.ratings
            break
        }
        const cfg = {
          loadType: mExamsLoadType,
          semesterYear: mExamsYear,
          ratingTypeCode: AppHelper.getParams('typeCode', '102')
        }
        AppHelper.post2(AppHelper.ApiUrls.platform_list, cfg, pagePrefix).then((jsonData) => {
          dataSet = Object.assign({}, dataSet, jsonData.data)
          this.$data = dataSet
          if (this.selectYear.length < 1 && this.yearsList.length > 0) {
            mExamsYear = this.yearsList[0].value
            this.selectYear = [mExamsYear]
          }
        })
      }
    }
  }
  export default platformList
</script>