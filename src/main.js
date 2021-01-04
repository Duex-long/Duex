import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from "axios"
Vue.config.productionTip = false

Vue.prototype.$http = axios
// 配置请求根路径

// 可用API
    axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/' 
    // axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
    // axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/ '

axios.interceptors.request.use(config=>{
  // console.log(config) 
  // 拦截器
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})
Vue.prototype.$http = axios
// 配置请求根路径
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
