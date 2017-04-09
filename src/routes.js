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
    },
    '/platform': {
      title: '创新展台',
      component: (resolve) => {
        require(['components/platform/list'], resolve)
      }
    },
    '/platform/:masterId': {
      component: (resolve) => {
        require(['components/platform/detailStar'], resolve)
      }
    },
    '/homeVisit': {
      title: '家庭访问',
      component: (resolve) => {
        require(['components/platform/homeVisitList'], resolve)
      }
    },
    '/homeVisit/:fromId': {
      component: (resolve) => {
        require(['components/platform/homeVisitDetail'], resolve)
      }
    },
    '/repair': {
      title: '后勤报修',
      component: (resolve) => {
        require(['components/platform/repairList'], resolve)
      }
    },
    '/repair/:fromId': {
      component: (resolve) => {
        require(['components/platform/repairDetail'], resolve)
      }
    },
    '/reward': {
      title: '我的奖状',
      component: (resolve) => {
        require(['components/platform/rewardList'], resolve)
      }
    },
    '/reward/:fromId': {
      component: (resolve) => {
        require(['components/platform/rewardDetail'], resolve)
      }
    },
    '/rating/index': {
      title: '班级评比',
      component: (resolve) => {
        require(['components/classRating/ratingIndex'], resolve)
      }
    },
    '/rating/index/list': {
      component: (resolve) => {
        require(['components/classRating/ratingViewIndexList'], resolve)
      }
    },
    '/rating/class/list': {
      component: (resolve) => {
        require(['components/classRating/ratingViewClassList'], resolve)
      }
    },
    '/rating/class/week': {
      component: (resolve) => {
        require(['components/classRating/ratingWeekList'], resolve)
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
