import Vue from 'vue'

import {Tag,MessageBox,Dialog, Pagination,Tooltip,Table,TableColumn,Switch,Row,Col,Card, Breadcrumb,BreadcrumbItem, Button,Form,FormItem,Input,Icon,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem} from 'element-ui'


Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);

// 挂载到原型对象 可以用this访问$message进行弹框提示
Vue.prototype.$message = Message

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Main);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);

// 挂载到原型对象 可以用this访问$message进行弹框提示
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

