import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import RouteLoad from './routes'
import AppHelper from 'util/apphelper'

Vue.use(VueRouter)
Vue.component('nodata', require('components/NoData'))
const router = new VueRouter()
RouteLoad(router)
router.start(App, '#app')

AppHelper.getRoute = () => {
  return router._currentRoute
}
