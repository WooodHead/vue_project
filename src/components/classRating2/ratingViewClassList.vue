<template>
  <style>
		.vux-flexbox {
			font-size: 14px;
			padding: 5px 0px 5px 0px;
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
    .with_arrow:after {
      content: " ";
      display: inline-block;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      height: 6px;
      width: 6px;
      border-width: 2px 2px 0 0;
      border-color: #C8C8CD;
      border-style: solid;
      position: relative;
      left: 40px;
      top: 10px;
    }
    .btn_mini{
       font-size: 12px;
       margin:5px 0px 5px 10px;
    }



  </style>
  <div class="weui_gallery" v-show.sync='imageShow' @click="imageShow=!imageShow">
      <span class="weui_gallery_img"
            :style="{'backgroundImage': 'url(' + imageurl + ')'}"></span>
  </div>
  <group :title="className+'评价列表'">
    <my-Scroller :data-source.sync="dataSource" :search-config.sync="searchConfig" :page-config.once="pageConfig">
      <div>
        <div v-for="item in dataSource.rows" style="margin:0px 10px 0px 10px">
          <flexbox :gutter="0" align="stretch">
            <flexbox-item :span="1/4">
              <flexbox orient="vertical" :gutter="0">
                <flexbox-item class="time">
                  {{item.ItemName}}<span>{{item.RatingResultForAvg>0 ? ' ('+item.RatingResultForAvg + '☆)':'' }}</span>
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
            <flexbox-item @click="itemClick(item)">
              <flexbox orient="vertical" :gutter="0" align="stretch">
                <flexbox-item class="time with_arrow">
                  {{item.RationgDateTime.substring(5)}}
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
  <popup :show.sync="openShow">
    <div class="popup0">
      <group :title="'评价项: '+current.ItemName">
        <cell title="评分">
          <rater
            :disabled="true"
            :value="current.RatingResultForAvg"
            :max="5">
          </rater>
        </cell>
      </group>
      <group v-if="current.openItems&&current.openItems.length>0" title="不合格的项目">
        <flexbox :gutter="0" align="center" wrap="wrap">
          <flexbox-item v-for="name in current.openItems" :span="1/3">
            <x-button class="btn_mini"
                      type="primary"
                      style="width:88%"
                      :text="name">
            </x-button>
          </flexbox-item>
        </flexbox>
      </group>
      <group v-if="current.ImgPath" title="图片文件">
        <div class="imgBox weui_uploader_file_status"
             @click="imgClick(current.ImgPath)"
             style="margin-left:15px;"
             :style="{'backgroundImage': 'url(' + current.ImgPath + ')'}">
        </div>
      </group>
      <group title="评价描述:">
        <box gap="10px 0px 10px 15px">
          {{ current.Mome || '未填写' }}
        </box>
      </group>
      <group :title="current.ChineseName+' '+current.RationgDateTime"></group>
    </div>
  </popup>
</template>
<script>
  import Group from 'vux-src/group'
  import PopupPicker from 'vux-src/popup-picker'
  import Cell from 'vux-src/cell'
  import XImg from 'vux-src/x-img'
  import {Flexbox, FlexboxItem} from 'vux-src/flexbox'
  import Divider from 'vux-src/divider'
  import Popup from 'vux-src/popup'
  import Rater from 'vux-src/rater'
  import Box from 'vux-src/box'
  import XButton from 'vux-src/x-button'

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
      Popup,
      Box,
      XButton,
      Rater,
      myScroller
    },
    data() {
      return {
        selectIndex: 1,
        imageurl: '',
        current: {},
        openShow: false,
        imageShow: false,
        dataSource: {},
        className: AppHelper.getParams('className', ''),
        pageConfig: {
          urlOld: AppHelper.ApiUrls.rating2_GetClassRatingList,
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
      },
      itemClick: function (item) {
        this.current = item
        if (item.RatingSubItemDesc) {
          this.current.openItems = item.RatingSubItemDesc.split(',')
        }
        this.openShow = true
      }
    }
  }
</script>