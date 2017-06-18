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
<script>
  import compressImg from './image'
  import upload from './upload'
  import AppHelper from 'util/apphelper'

  const moment = require('moment')

  let _id = 0
  let mupToken
  const URL = window.URL || window.webkitURL || window.mozURL
  const options = {
    url: 'http://upload.qiniu.com',
    type: 'file',
    fileVal: 'file',
    compress: {
      width: 1500,
      height: 1500,
      quality: 0.92
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
      if (!mupToken) {
        AppHelper.getUptoken().then(token => {
          mupToken = token
        })
      }
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
      GetRandomNum(min, max) {
        var Range = max - min
        var Rand = Math.random()
        return (min + Math.round(Rand * Range))
      },
      onBeforeSend(file, data, headers) {
        if (!file.keyName) {
          var filename = file.name
          var mime = filename.toLowerCase().substr(filename.lastIndexOf('.'))
          file.keyName = 'qiniu_' + moment().format('YYMM/DD/HHmmssSSS') + this.GetRandomNum(100, 999) + mime // 上传文件名
        }
        data.key = file.keyName
        data.token = mupToken // 上传凭证
        console.log(data)
      },
      onProgress(file, procent) {
        // this.content = procent + '%'
        AppHelper.loading('正在上传...')
      },
      onSuccess(file, ret) {
        AppHelper.loading(false)
        if (ret.state && ret.info) {
          this.$emit('success', file, ret)
        } else {
          this.onError(file, ret)
        }
      },
      onError(file, err) {
        // console.log('onError:', err)
        AppHelper.loading(false)
        this.$emit('error', file, err)
        this.content = '<i class="weui_icon_warn"></i>'
        // return true; // 阻止默认行为，不使用默认的失败态
      }
    }
  }

</script>
