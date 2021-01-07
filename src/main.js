import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 导入全局样式表
import './assets/css/global.css'
import axios from "axios"
Vue.config.productionTip = false

Vue.prototype.$http = axios
// 配置请求根路径

// 可用API
    axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/' 
    // axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
    // axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/ ' 失效

axios.interceptors.request.use(config=>{
  // console.log(config) 
  // 拦截器
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})
Vue.prototype.$http = axios
// 配置请求根路径
Vue.component('tree-table',TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// 注册过滤器
Vue.filter("dateFormat",function(originVal){
    const dt = new Date(originVal)
    const y=dt.getFullYear()
    const m =(dt.getMonth() + 1+'').padStart(2,'0')
    const d =(dt.getDate() + '').padStart(2,'0')
    const hh = (dt.getHours()+"").padStart(2,'0')
    const mm = (dt.getMinutes()+"").padStart(2,'0')
    const ss = (dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
