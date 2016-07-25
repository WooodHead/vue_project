const AppHelper = {}
const Vue = require('vue')
let myToast = null
AppHelper.showMsg = obj => {
  if (!myToast) {
    const Toast = require('vux-src/toast')
    const MyToast = Vue.extend({
      components: {
        Toast
      },
      template: '<toast :show.sync="show" :type="type">{{msg}}</toast>',
      data() {
        return {
          show: false,
          type: 'success',
          msg: ''
        }
      },
      created() {
        // 加载到主界面上
        this.$mount().$appendTo('body')
      },
      methods: {
        showMsg(args) {
          if (args && args.show) {
            this.$data = Object.assign({}, this.$data, args)
            this.msg = this.$data.msg
          } else {
            this.msg = args
          }
          this.show = true
        }
      }
    })
    myToast = new MyToast()
  }
  myToast.showMsg(obj)
}
let myLoading = null
AppHelper.loading = obj => {
  if (!myLoading) {
    const Loading = require('vux-src/loading')
    const MyLoading = Vue.extend({
      components: {
        Loading
      },
      template: '<loading :show="show" :text="text"></loading>',
      data() {
        return {
          text: '加载中...',
          show: false
        }
      },
      created() {
        // 加载到主界面上
        this.$mount().$appendTo('body')
      },
      methods: {
        loading(args) {
          if (typeof args === 'object') {
            this.$data = Object.assign({}, this.$data, args)
          } else if (typeof args === 'string') {
            this.text = args
            this.show = true
          } else if (args === false) {
            this.show = false
          } else {
            this.show = true
          }
        }
      }
    })
    myLoading = new MyLoading()
  }
  myLoading.loading(obj)
}
let myAlert = null
AppHelper.alert = obj => {
  if (!myAlert) {
    const Alert = require('vux-src/alert')
    const MyAlert = Vue.extend({
      components: {
        Alert
      },
      template: '<alert :show.sync="show" :title="title" @on-show="onshow" @on-hide="onhide" :button-text="buttonText">{{msg}}</alert>',
      data() {
        return {
          title: '',
          show: false,
          onshow() { },
          onhide() { },
          msg: '',
          buttonText: '确定'
        }
      },
      created() {
        // delete this.$options.el
        // 加载到主界面上
        this.$mount().$appendTo('body')
      },
      methods: {
        showMsg(args) {
          if (args && args.msg) {
            this.$data = Object.assign({}, this.$data, args)
            this.msg = this.$data.msg
          } else {
            this.msg = args
          }
          this.show = true
        }
      }
    })
    myAlert = new MyAlert()
  }
  myAlert.showMsg(obj)
}
const cndJs = {
  echarts: 'http://cdn.bootcss.com/echarts/3.2.2/echarts.min.js',
  jquery: 'http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js'
}
const $script = require('scriptjs')
AppHelper.script = (name, fn) => {
  $script(cndJs[name], name, fn)
}
export default AppHelper
