// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// 引入css
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex'
import axios from 'axios'

Vue.use(ElementUI)

// 关闭生产模式下给出的提示
Vue.config.productionTip = false

// 注册axios
Vue.prototype.$axios = axios
Vue.prototype.HOME = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
