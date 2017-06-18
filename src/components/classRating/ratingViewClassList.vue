<template>
  <style>
		.vux-flexbox {
			font-size: 14px;
			padding: 5px;
		}
		.bold {
			font-weight: 700
		}
		.mome {
			color: #888;
		}

		.time {
			font-weight: 400;
		}
		.split {
			height: 1px;
			background-color: #e0e0e0;
			border: none;
		}
    .imgBox {
        margin: 5px;
        width: 50px;
        height: 50px;
        background: no-repeat center center;
        background-size: cover;
    }
  </style>
  <div class="weui_gallery" v-show.sync='imageShow' @click="imageShow=!imageShow">
      <span class="weui_gallery_img"
            :style="{'backgroundImage': 'url(' + imageurl + ')'}"></span>
  </div>
  <group :title="className+'评价列表'">
    <my-Scroller :data-source.sync="dataSource" :search-config.sync="searchConfig" :page-config.once="pageConfig">
      <div>
        <div v-for="item in dataSource.rows">
          <flexbox :gutter="0" align="stretch">
            <flexbox-item :span="1/4">
              <flexbox orient="vertical" :gutter="0">
                <flexbox-item class="bold">
                  {{item.ItemName}}<span>{{{item.RatingResultDesc}}}</span>
                </flexbox-item>
                <flexbox-item class="mome">
                  {{item.ChineseName}}
                </flexbox-item>
              </flexbox>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div v-if="item.ImgPath" class="imgBox weui_uploader_file_status"
                   @click="imgClick(item.ImgPath)"
                   :style="{'backgroundImage': 'url(' + item.ImgPath + ')'}">
              </div>
            </flexbox-item>
            <flexbox-item>
              <flexbox orient="vertical" :gutter="0" align="stretch">
                <flexbox-item class="time">
                  {{item.RationgDateTime}}
                </flexbox-item>
                <flexbox-item class="mome">
                  {{item.Mome}}
                </flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
          <hr class="split"/>
        </div>
      </div>
    </my-Scroller>
  </group>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import XImg from 'vux-src/x-img'
  import {Flexbox, FlexboxItem} from 'vux-src/flexbox'
  import Divider from 'vux-src/divider'

  import AppHelper from 'util/apphelper'
  import Nodata from 'components/NoData'
  import myScroller from 'components/myScroller'

  export default {
    components: {
      Group,
      PopupPicker,
      Cell,
      XImg,
      Flexbox,
      FlexboxItem,
      Divider,
      Nodata,
      myScroller
    },
    data() {
      return {
        selectIndex: 1,
        imageurl: '',
        imageShow: false,
        dataSource: {},
        className: AppHelper.getParams('className', ''),
        pageConfig: {
          urlOld: AppHelper.ApiUrls.rating_GetClassRatingList,
          readyIsLoad: true
        },
        searchConfig: {
          classId: AppHelper.getParams('classId')
        }
      }
    },
    methods: {
      imgClick: function (src) {
        this.imageShow = !this.imageShow
        this.imageurl = src
      }
    }
  }
</script>