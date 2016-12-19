import AppHelper from 'util/apphelper'

export default function (router) {
  // router.beforeEach(function (transition) {
  //   console.log(transition)
  //   transition.next()
  // })
  router.map({
    '/select': {
      title: '考试成绩',
      component: (resolve) => {
        require(['components/examsSelect'], resolve)
      }
    },
    '/': {
      title: '测试页面',
      component: (resolve) => {
        require(['components/Index'], resolve)
      }
    },
    '/exams/:examId': {
      title: '考试成绩',
      component: (resolve) => {
        require(['components/classScore'], resolve)
      }
    },
    '/exams/:examId/user/:studentId': {
      title: '考试成绩',
      component: (resolve) => {
        require(['components/userScore'], resolve)
      }
    },
    '/rating': {
      title: '品德发展',
      component: (resolve) => {
        require(['components/rating/ratingSelect'], resolve)
      }
    },
    '/rating/:masterId': {
      component: (resolve) => {
        require(['components/rating/classRating'], resolve)
      }
    },
    '/rating/:masterId/user/:studentId': {
      component: (resolve) => {
        require(['components/rating/userRating'], resolve)
      }
    }
  })
  // 默认找不到页面,全部重定向到首页
  router.redirect({
    '*': '/index'
  })
  router.afterEach(function (transition) {
    let myTitle = transition.to.title
    if (myTitle) {
      if (myTitle === '品德发展') {
        var typeCode = AppHelper.getParams('typeCode', '100')
        if (typeCode === '101') {
          myTitle = '对父母的评价'
        }
      }
      document.title = myTitle
    }
  })
}
