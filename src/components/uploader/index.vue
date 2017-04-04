<template>
  <div>
    <div class="weui_gallery" v-show.sync='imageShow' @click="imageShow=!imageShow">
      <span class="weui_gallery_img"
            :style="{'backgroundImage': 'url(' + imageurl + ')'}"></span>
    </div>
    <div class="weui_uploader" style="padding:15px;">
      <div class="weui_uploader_bd">
        <ul class="weui_uploader_files" id="uploaderFiles" v-show.sync="imageurl && imageurl.length>1">
          <li :class="classImg"
              @click="imageShow=!imageShow"
              :style="{'backgroundImage': 'url(' + imageurl + ')'}">
            <div class="weui_uploader_file_content">{{{content}}}</div>
          </li>
        </ul>
        <div v-if="!readonly" class="weui_uploader_input_wrp">
          <input id="uploaderInput" class="weui_uploader_input" type="file" accept="image/png,image/jpeg" multiple
                 @change="fileChange"/>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
  @import "~vux/src/styles/weui/icon/weui_icon_font";
  @import '~vux/src/styles/weui/widget/weui_cell/weui_uploader';

  .weui_gallery {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000000;
    z-index: 1000;
  }

  .weui_gallery_img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 60px;
    left: 0;
    background: center center no-repeat;
    background-size: contain;
  }
</style>
<script>
  import compressImg from './image'
  import upload from './upload'
  let _id = 0
  const URL = window.URL || window.webkitURL || window.mozURL
  const options = {
    url: 'http://www.jyapp.cn/SH_AjaxRequest/UploadImg.ashx',
    type: 'file',
    fileVal: 'Filedata',
    compress: {
      width: 1000,
      height: 750,
      quality: 0.8
    }
  }
  export default{
    props: {
      imageurl: String,
      readonly: false
    },
    data() {
      return {
        classImg: 'weui_uploader_file weui_uploader_file_status',
        content: '', // <i class="weui_icon_warn"></i>
        imageShow: false
      }
    },
    created () {
      // 暴露给android客户端调用
      window.onPhotoSelected = this.onPhotoSelected
    },
    methods: {
      fileChange: function (evt) {
        const files = evt.target.files
        if (files.length === 0) {
          return
        }
        options.onBeforeSend = this.onBeforeSend
        options.onSuccess = this.onSuccess
        options.onProgress = this.onProgress
        options.onError = this.onError
        const f = files[0]
        options.file = f

        f.id = ++_id
        if (f.size > 500 * 1024) { // 将大于200kb的图片压缩
          // const self = this
          compressImg(f, options, (blob) => {
            this.setUploadFile(blob)
          })
        } else {
          this.setUploadFile(f)
        }
      },
      onPhotoSelected(fullUrl) {
        this.imageurl = fullUrl
        // 返回给页面事件
        this.$emit('success', null, {info: fullUrl})
      },
      // 设置上传
      setUploadFile(file) {
        // this.classImg = 'weui_uploader_file weui_uploader_file_status'
        file.url = URL.createObjectURL(file)
        this.imageurl = file.base64 || file.url
        file.status = 'ready'
        file.upload = () => {
          upload(options)
        }
        file.stop = function () {
          this.xhr.abort()
        }
        this.$emit('select', file)
        // console.log(file.name)
        // file.upload()
      },
      onBeforeSend() {
      },
      onProgress(file, procent) {
        this.content = procent + '%'
      },
      onSuccess(file, ret) {
        if (ret.state && ret.info) {
          this.$emit('success', file, ret)
        } else {
          this.onError(file, ret)
        }
      },
      onError(file, err) {
        // console.log('onError:', err)
        this.$emit('error', file, err)
        this.content = '<i class="weui_icon_warn"></i>'
        // return true; // 阻止默认行为，不使用默认的失败态
      }
    }
  }

</script>
