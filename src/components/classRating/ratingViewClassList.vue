<template>
	<style>
		.item-content {
			flex-direction: row;
			width: 100%;
			display: flex;
			background-color: #fff;
			justify-content: space-between;
			font-size: 14px;
		}

		.item-content div {
			padding: 2px 10px;
		}

		.bold {
			font-weight: 700
		}

		.mome {
			color: #888;

		}

		.start {
			color:red;
		}

		.time {
			font-weight: 400;
		}

		.split {
			height: 1px;
			background-color: #e0e0e0;
			border: none;
		}

		.lineline {
			border: none;
			height: 1px;
			margin-top: 8px;
			background-color: #aaa;
		}
	</style>
	<div style="margin: 0px 6px;background-color: #fff;padding: 2px 10px; line-height: 40px;height: 40px;">{{className}} 评价列表</div>
	<hr class="split" />
	<my-Scroller :data-source.sync="dataSource" :search-config.sync="searchConfig" :page-config.once="pageConfig">
		<div>
			<div v-for="item in dataSource.rows" style="margin: 0px 6px;padding:5px 0px">
				<div class="item-content bold">
					<div class="left">{{item.ItemName}} <span >{{{item.RatingResultDesc}}}</span></div>
					<div class="right time">{{item.RationgDateTime}}</div>
				</div>
				<div class="item-content mome">
					<div class="left ">{{item.ChineseName}}</div>
					<div class="right ">{{item.Mome}}</div>
				</div>
				<hr class="split" />
			</div>
		</div>
	</my-Scroller>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import AppHelper from 'util/apphelper'
  import Nodata from 'components/NoData'
  import myScroller from 'components/myScroller'

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
        selectIndex: 1,
        dataSource: {},
        className: AppHelper.getParams('className', ''),
        pageConfig: {
          urlOld: AppHelper.ApiUrls.rating_GetClassRatingList,
          readyIsLoad: true
        },
        searchConfig: {
          classId: AppHelper.getClassId()
        }
      }
    }
  }
</script>