import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import RouteLoad from './routes'

Vue.use(VueRouter)
// Vue.component('app-head', require('components/Head'))
const router = new VueRouter()
RouteLoad(router)
router.start(App, '#app')
