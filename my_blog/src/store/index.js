import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    articleInfo:{}
  },
  mutations: {
    increment(state,data){
      state.articleInfo = data;
    }
  },
  actions: {
  },
  modules: {
  },
  getters:{
    getArticleInfo:state => {
      return state.articleInfo;
    }
  }
})
