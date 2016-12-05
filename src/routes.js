export default function (router) {
  // router.beforeEach(function (transition) {
  //   console.log(transition)
  //   transition.next()
  // })
  router.map({
    '/select': {
      component: (resolve) => {
        require(['components/examsSelect'], resolve)
      }
    },
    '/': {
      component: (resolve) => {
        require(['components/Index'], resolve)
      }
    },
    '/exams/:examId': {
      component: (resolve) => {
        require(['components/classScore'], resolve)
      }
    },
    '/exams/:examId/user/:studentId': {
      component: (resolve) => {
        require(['components/userScore'], resolve)
      }
    }
  })
  // 默认找不到页面,全部重定向到首页
  router.redirect({
    '*': '/index'
  })
}
