/**
 * Created by outman on 17/3/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: {}
  },
  mutations: {
    putData (state, data) {
      state.data = data
    }
  }
})
