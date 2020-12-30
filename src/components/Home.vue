<template>
    
    <el-container class="home-container">
        <!-- 头部区 -->
        <el-header >
            <div>
                <img src="../assets/pic1.png"  alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">登出 </el-button>
        </el-header>
        <!-- 主体区 -->
        <el-container>
            <!-- 侧边栏 -->
          <el-aside :width="isCollapse ? '64px' : '200px'">
              <div class="toggle-button" @click="toggleCollapse">|||</div>
              <!-- 侧边栏菜单区 -->
            <el-menu
            router
            :collspace-transition="false"
            :collapse="isCollapse"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-open
            :default-active="activePath"
            >
            <!-- 一级菜单 -->
            <el-submenu v-for="item in menuList " :key ="item.id" :index="item.id + ''">

                <!-- 一级菜单模板区 -->
                <template slot="title">
                  <!-- 图标 -->
                <i :class="iconsObj[item.id] + ''"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                    <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="'/' + subitem.path "
                    @click="saveNaveState('/' + subitem.path)">
                        <template slot="title">
                            <!-- 图标 -->
                          <i class="el-icon-menu"></i>
                          <!-- 文本 -->
                          <span>{{subitem.authName}}</span>
                          </template>
                    </el-menu-item>
                    </el-submenu>
          
            </el-menu-item>
          </el-menu>
          </el-aside>
          <!-- 右侧主题 -->
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>
<script>
    export default {
        data(){
            return{
                // 左侧菜单数据
                menuList:[],
                iconsObj:{
                    '125':'el-icon-user-solid',
                    '103':'el-icon-s-check',
                    '101':'el-icon-s-goods',
                    '102':'el-icon-s-order',
                    '145':'el-icon-s-data'
                },
                isCollapse:false,
                // 被激活的链接地址
                activePath:''
            }
        },
        created(){
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem("activePath")
        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push("/login");
                this.$message.success("成功登出")
            },
            async getMenuList(){
                // 获取所有菜单
            const {data:res} =  await this.$http.get('menus');
            // console.log(res);
            if(res.meta.status !==200) {
                return this.$message.error(res.meta.msg)
            }
            else{
                this.menuList = res.data
            }
            },
            toggleCollapse(){
                // 点击按钮切换菜单折叠与展开
               return  this.isCollapse = !this.isCollapse

            },
            saveNaveState(activePath){
                // 保存链接激活状态
                window.sessionStorage.setItem("activePath",activePath);
                this.activePath = activePath
            }
        }
    }
</script>
<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div {
            display: flex;
            align-items:center;
            span {
                margin-left:15px ;
            }
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu {
            border-right: none ;
        }
    }
    .el-main{
        background-color: #EAEDF1;
    }
    .toggle-button{
        background-color: #4a5064;
        color: #fff;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>