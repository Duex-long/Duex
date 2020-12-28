import Vue from 'vue'
import { Button,Form,FormItem,Input,Icon,Message} from 'element-ui'

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);
// 挂载到原型对象 可以用this访问$message进行弹框提示
Vue.prototype.$message = Message
