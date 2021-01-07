import Vue from 'vue'

import {Upload,CheckboxGroup,CheckboxButton,Checkbox,Steps,Tabs,TabPane,Alert,Cascader,Option,Select,Tree,Tag,MessageBox,Dialog, Pagination,Tooltip,Table,TableColumn,Switch,Row,Col,Card, Breadcrumb,BreadcrumbItem, Button,Form,FormItem,Input,Icon,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem, Step} from 'element-ui'

Vue.use(Upload);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(CheckboxButton);
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
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.use(Steps);
Vue.use(Step);

// 挂载到原型对象 可以用this访问$message进行弹框提示
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

