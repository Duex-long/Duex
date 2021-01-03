import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'

Vue.use(VueRouter)
const router= new VueRouter({
   routes:[
     {path:'/',redirect:'login'},
     { path:'/login', component:Login },
     {
       path:'/home',
       component:()=>
          import ("@/components/Home"),
          children:[
            {
              path:'/welcome',
              component:()=> import ("@/components/Welcome")
            },
            {
              path:'/users',
              component: ()=> import("@/components/user/Users")
            },
            {
              path:'/rights',
              component:()=> import ("@/components/power/Rights")
            },
            {
              path:'/roles',
              component:()=> import ("@/components/power/Roles")
            }
          ]
     },
    
     
  ],
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to from next  去哪 从哪来 放行
  if(to.path==='/login'){
    return next();
  }else{
    // 获取token
   const tokenstr = window.sessionStorage.getItem('token' )
    if(!tokenstr){
      return next('/login')
    }else{
      next()
    }
  }
    
  next()
})
export default router