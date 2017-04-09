<template>
  <style>
        body {
            background-color:#dedede;
        }

  </style>
  <div style="background-color:#dedede;">
    <group style="margin-top: -21px;">
      <popup-picker :title="className" :data="dataRanges" :columns="2" :value.sync="dateRangeType"
                    show-name></popup-picker>
    </group>
    <div style="padding: 10px;">
      <div v-for="item in dataSource">
        <div class="panel" @click="onViewDetias">
          <div class="panel-header item lineBorder fontWeight">
            {{item.DateDesc}}
          </div>
          <div class="panel-middle">
            <div class="items" v-if="$index === 0">
              <div class="item" v-for="subItem in item.RatingDetailsList">
                <div class="item-text">{{subItem.ItemName}}</div>
                <div class="item-value">{{{subItem.RatingDesc}}}</div>
              </div>
            </div>
            <div class="items" v-else>
              <div class="item" v-for="subItem in item.RatingDetailsList">
                <div class="item-text">{{subItem.ItemName}} {{{subItem.RatingResultDesc}}}</div>
                <div class="item-value">{{subItem.ChineseName}} {{subItem.CreateTimeDesc}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
    .panel * {
        font-family: "microsoft yahei";
        /*font-size: 14px;*/
    }

    .panel {
        padding: 12px;
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        width: 100;
    }

    .lineBorder {
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
        margin-bottom: 5px;
    }

    .colorSelected {
        color: #ff7043;
    }

    .panel-middle {
        display: flex;
        width: 100%;
    }

    .items {
        width: 100%;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:35px;
        line-height:35px;
    }

    .item-value {
        text-align: right;
        /*font-size: 14px;*/
    }

    .mXImg {
        width: 80px;
        height: 80px;
        margin: 10px;
    }

    .fontSize18 {
        font-size: 18px;
    }

    .fontWeight {
        font-weight: 600;
    }

</style>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import AppHelper from 'util/apphelper'
  import Nodata from 'components/NoData'
  const _ = require('lodash')

  let tempRatingYearId = null
  let tempRatingWeekId = null
  export default {
    components: {
      Group,
      PopupPicker,
      Nodata
    },
    created () {
      if (tempRatingYearId) {
        this.ratingYearId = tempRatingYearId
        this.ratingWeekId = tempRatingWeekId
      }
      this.loadData()
    },
    methods: {
      loadData: function () {
        let self = this
        let cfg = {
          companyId: AppHelper.getCompanyId(),
          ratingYearId: self.ratingYearId,
          ratingWeekId: self.ratingWeekId
        }
        AppHelper.post(AppHelper.ApiUrls.rating_GetClassWeekRatingList, cfg).then((jsonData) => {
          _.each(jsonData.data.ratingWeeks, function (item) {
            if (item.parent === '0') {
              item.parent = 0
            }
          })
          if (self.isFistLoad) {
            self.ratingYearId = jsonData.data.ratingYearId
            self.ratingWeekId = jsonData.data.ratingWeekId
            self.dateRangeType = [self.ratingYearId, self.ratingWeekId]
            self.isFistLoad = true
          }
          // console.log(jsonData.data.ratingWeeks)
          self.dataRanges = jsonData.data.ratingWeeks
          self.dataSource = jsonData.data.sataList
          tempRatingYearId = self.ratingYearId
          tempRatingWeekId = self.ratingWeekId
          // console.log(self.dataRanges)
        })
      },
      onViewDetias () {
        AppHelper.link('/rating/class/list' + '?classId=' + this.searchConfig.classId + '&className=' + this.className)
      }
    },
    watch: {
      dateRangeType(val, oldVal) {
        //   console.log(val)
        //   console.log(oldVal)
        if (!oldVal || oldVal.length === 0 || val[1] === oldVal[1]) {
          return
        }
        this.ratingYearId = val[0]
        this.ratingWeekId = val[1]
        this.loadData()
      }
    },
    data() {
      return {
        ratingYearId: '',
        ratingWeekId: '',
        isFistLoad: true,
        dataRanges: [],
        dateRangeType: [],
        dataSource: [],
        className: AppHelper.getParams('className', ''),
        pageConfig: {
          urlOld: AppHelper.ApiUrls.rating_GetClassRatingList,
          readyIsLoad: true
        },
        searchConfig: {
          classId: AppHelper.getParams('classId')
        }
      }
    }
  }
</script>