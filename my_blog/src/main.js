import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from "./axios"
import 'element-ui/lib/theme-chalk/index.css';
import bg from "./component/user/canvas/js/ribbon"

import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
Vue.use(QuillEditor)

bg();



Vue.config.productionTip = false;
Vue.use(ElementUI);


Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    // console.log(el.dataset);
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
