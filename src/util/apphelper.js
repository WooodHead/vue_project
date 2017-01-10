import LocalStore from 'util/localStore'

const AppHelper = {}
const Vue = require('vue')
const VueResource = require('vue-resource')
Vue.use(VueResource)
// Vue.http.options.root = 'http://jyapp.cn'

let myToast = null
AppHelper.showMsg = obj => {
  if (!myToast) {
    const Toast = require('vux-src/toast')
    const MyToast = Vue.extend({
      components: {
        Toast
      },
      template: '<toast :show.sync="show" :width="width" :type="type">{{msg}}</toast>',
      data() {
        return {
          show: false,
          type: 'success',
          width: '7.6em',
          msg: ''
        }
      },
      created() {
        // 加载到主界面上
        this.$mount().$appendTo('body')
      },
      methods: {
        showMsg(args) {
          if (typeof args === 'object') {
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
          text: '',
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
          onshow() {
          },
          onhide() {
          },
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
  echarts: '//cdn.bootcss.com/echarts/3.2.2/echarts.min.js',
  jquery: '//cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
  amazeui: '//cdn.bootcss.com/amazeui/2.7.2/js/amazeui.min.js',
  amazeui_css: '//cdn.bootcss.com/amazeui/2.7.2/css/amazeui.css'
}
AppHelper.WebRoot = 'http://jyapp.cn/api/'
var ApiUrls = {
  exams_index: AppHelper.WebRoot + 'exam.aspx/Index', // 加载首页数据
  exams_detail: AppHelper.WebRoot + 'exam.aspx/Exams',  // 教师加载某次考试
  exams_student: AppHelper.WebRoot + 'exam.aspx/StudentExam',  // 加载学生某次考试信息
  exams_postcomment: AppHelper.WebRoot + 'exam.aspx/SaveComment'  // 家长填写评价
}
AppHelper.WebApiRoot = 'http://jyapp.cn:30005/api/'
ApiUrls.rating_post = AppHelper.WebApiRoot + 'ComRating/PostRating' // 提交评价
ApiUrls.rating_index = AppHelper.WebApiRoot + 'ComRating/GetComRating' // 加载首页数据
ApiUrls.rating_detail = AppHelper.WebApiRoot + 'ComRating/GetRatingClassDetail' // 教师加载某次评价
ApiUrls.rating_student = AppHelper.WebApiRoot + 'ComRating/GetRatingStudentDetail'  // 加载学生某次评价
AppHelper.ApiUrls = ApiUrls

var isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
const $script = require('scriptjs')
AppHelper.script = (name, fn) => {
  if (isArray(name)) {
    var arrList = []
    for (var i in name) {
      arrList.push(cndJs[name[i]])
    }
    $script(arrList, 'bundle')
    $script.ready('bundle', fn)
  } else {
    $script(cndJs[name], name, fn)
  }
}
AppHelper.post = (url, jsonData, prefix) => {
  // 传递用户ID等数据
  jsonData = Object.assign({}, AppHelper.getLocalUser(prefix), jsonData)
  // console.log('post====>', url)
  AppHelper.loading(true)
  return Vue.http.post(url, jsonData || {}, {
    timeout: 30000, // 30s超时
    emulateJSON: false
  }).then((response) => {
    // success callback

    AppHelper.loading(false)
    const resData = JSON.parse(response.json().d)
    console.log(resData)

    if (resData && !resData.data) {
      return Promise.resolve({
        code: 200,
        data: resData
      })
    }
    if (resData && resData.code === 200) {
      return Promise.resolve(resData)
    } else {
      let errorStr = resData.msg
      if (!errorStr) {
        errorStr = '出错了,网络异常(' + resData.code + ')!'
      }
      AppHelper.showMsg({type: 'text', width: '12em', msg: errorStr})
      return Promise.reject(resData)
    }
  }).catch((response) => { // error callback
    AppHelper.loading(false)
    AppHelper.showMsg({type: 'text', width: '12em', msg: '出错了,网络异常(' + response.status + ')!'})
    return Promise.reject(response)
  })
}
AppHelper.post2 = (url, jsonData, prefix) => {
  // 传递用户ID等数据
  jsonData = Object.assign({}, AppHelper.getLocalUser(prefix), jsonData)
  AppHelper.loading(true)
  return Vue.http.post(url, jsonData || {}, {
    timeout: 30000, // 30s超时
    emulateJSON: true
  }).then((response) => {
    // success callback
    AppHelper.loading(false)
    const resData = response.json()
    // console.log('response====>', resData)
    if (resData && resData.State === true) {
      return Promise.resolve({
        code: 200,
        data: resData.ResultContent
      })
    }
    return Promise.reject(resData)
  }).catch((response) => { // error callback
    AppHelper.loading(false)
    let errorStr = response.Message
    if (!errorStr) {
      errorStr = '出错了,网络异常!'
    }
    AppHelper.showMsg({type: 'text', width: '12em', msg: errorStr})
    return Promise.reject(response)
  })
}
let mUserType = 0 // 1教师 2家长
// 返回用户类型
AppHelper.getUserType = () => {
  let typeInt = 0
  if (mUserType === 0) {
    typeInt = LocalStore.get('userType')
    if (typeInt) {
      mUserType = parseInt(typeInt)
    }
  }
  if (AppHelper.getParams('userType')) {
    typeInt = parseInt(AppHelper.getParams('userType'))
    if (mUserType !== typeInt) {
      LocalStore.clear()
      LocalUser = {}
      mUserType = typeInt
      AppHelper.setUserType(mUserType)
    }
  }
  if (mUserType === 0) {
    return 2
  }
  return mUserType
}
let LocalUser = {}
AppHelper.getLocalUser = (prefix) => {
  // LocalStore.clear()
  LocalUser.userId = AppHelper.getUserId()
  LocalUser.userType = AppHelper.getUserType()
  LocalUser.classId = AppHelper.getClassId(prefix)
  LocalUser.studentId = AppHelper.getStudentId(prefix)
  return LocalUser
}
AppHelper.getQueryString = (name, defStr, prefix) => {
  if (name && name.length > 0) {
    let newName = name
    if (prefix) {
      newName = prefix + '_' + newName
    }
    // 优先查找本地存储
    let str = LocalStore.get(newName)
    // console.log('getQueryString====>', newName, '=', str)
    if (str && str.length > 0) {
      LocalUser[name] = str
      return str
    }
    let aliasName = name
    switch (name) {
      // case 'userId':
      //   aliasName = 'uid'
      //   break
      case 'classId':
        aliasName = 'cid'
        break
      case 'studentId':
        aliasName = 'sid'
        break
    }
    // 查找URL参数
    str = AppHelper.getParams(aliasName)
    if (str && str.length > 0) {
      AppHelper.setStore(name, str, prefix)
      return str
    }
  }
  return defStr
}
AppHelper.getParams = (name, defStr) => {
  if (AppHelper.getRoute()) {
    if (AppHelper.getRoute().params && AppHelper.getRoute().params[name]) {
      // 查找URL参数
      return AppHelper.getRoute().params[name]
    }
    if (AppHelper.getRoute().query && AppHelper.getRoute().query[name]) {
      // 查找URL参数
      return AppHelper.getRoute().query[name]
    }
  }
  return defStr
}
// 用户ID
AppHelper.getUserId = () => {
  // 本地存储
  const storeUid = LocalStore.get('userId')
  // console.log('storeUid====>', storeUid)
  // 页面传值
  const pageUid = AppHelper.getParams('uid', '')
  // console.log('pageUid====>', pageUid)
  if (pageUid && pageUid.length > 0 && storeUid !== pageUid) {
    // 用户发生了变化,清空本地缓存
    LocalStore.clear()
    LocalUser = {}
    AppHelper.setUserId(pageUid)
    return pageUid
  }
  return storeUid
}
AppHelper.setStore = (name, value, prefix) => {
  let aliasName = name
  if (prefix) {
    aliasName = prefix + '_' + name
  }
  LocalUser[name] = value
  LocalStore.set(aliasName, value)
  // console.log('setStore====>', aliasName, '=', value)
}
AppHelper.setUserId = (value) => {
  AppHelper.setStore('userId', value)
}
// 班级ID
AppHelper.getClassId = (prefix) => {
  return AppHelper.getQueryString('classId', '', prefix)
}
AppHelper.setClassId = (value, prefix) => {
  AppHelper.setStore('classId', value, prefix)
}
// 学生ID
AppHelper.getStudentId = (prefix) => {
  return AppHelper.getQueryString('studentId', '', prefix)
}
AppHelper.setStudentId = (value, prefix) => {
  AppHelper.setStore('studentId', value, prefix)
}
AppHelper.setUserType = (value) => {
  AppHelper.setStore('userType', value)
}
export default AppHelper
