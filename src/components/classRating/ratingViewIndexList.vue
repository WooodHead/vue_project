<template>
  <group>
    <popup-picker title="日期范围" :data="dataRanges" :columns="1" :value.sync="dateRangeType" show-name></popup-picker>
  </group>
  <div style="background-color: #fff;padding:10px;">
    <!--<cell v-for="item in dataSource.rows" :title="item.ClassName" :value="item.RatingDesc" :link="'/rating/class/week?classId='+item.ClassId+'&className='+item.ClassName"
      inline-desc=''></cell>-->

    <div  v-for="item in dataSource.rows">
      <div class="weui_cell vux-tap-active" v-link="'/rating/class/week?classId='+item.ClassId+'&className='+item.ClassName">
        <div class="weui_cell_hd">
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>
            {{item.ClassName}}
          </p>
          <span class="vux-label-desc"></span>
        </div>
        <div class="weui_cell_ft with_arrow">
          {{{item.RatingDesc}}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Group from 'vux-src/group'
import PopupPicker from 'vux-src/popup-picker'
import Cell from 'vux-src/cell'
import AppHelper from 'util/apphelper'
import Nodata from 'components/NoData'
import myScroller from 'components/myScroller'
let tempDateRangeType = null
let tempSelectedDateRangeType = null

export default {
  components: {
    Group,
    PopupPicker,
    Cell,
    Nodata,
    myScroller
  },
  data() {
    return {
      dataRanges: [{name: '今天', value: '7'}, {name: '昨天', value: '8'}, {name: '本周', value: '2'}, {name: '上周', value: '5'}, {name: '本月', value: '3'}, {name: '上月', value: '6'}, {name: '本学期', value: '1'}, {name: '上学期', value: '4'}],
      dateRangeType: ['2'],
      dataSource: {},
      selectedDateRangeType: 2,
      userId: AppHelper.getUserId()
    }
  },
  created() {
    // console.log(tempDateRangeType)
    if (tempDateRangeType) {
      this.dateRangeType = tempDateRangeType
      this.selectedDateRangeType = tempSelectedDateRangeType
    }
    this.loadData()
  },
  watch: {
    dateRangeType(val, oldVal) {
      // console.log('dataRangeType...')
      if (!oldVal || oldVal.length === 0 || val[0] === oldVal[0]) {
        return
      }
      this.selectedDateRangeType = parseInt(val[0])
      this.loadData()
    }
  },
  methods: {
    loadData () {
      // console.log('loadData...')
      let self = this
      let cfg = {
        companyId: AppHelper.getCompanyId(),
        userId: self.userId,
        dateRangeType: self.selectedDateRangeType
      }
      AppHelper.post(AppHelper.ApiUrls.rating_GetClassSata, cfg).then(function(jsonData) {
        // console.log(jsonData)
        tempDateRangeType = self.dateRangeType
        tempSelectedDateRangeType = self.selectedDateRangeType
        self.dataSource = jsonData.data
      })
    }
  }
}
</script>