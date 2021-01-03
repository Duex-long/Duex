<template>
    <div>
         <!-- 面包屑导航 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
          </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col><el-button type="primary">添加角色</el-button></el-col>
            </el-row>
            <!-- 角色列表区 -->
            <el-table :data="rolelist" border="1" stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '' ,'vcenter']"  v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 一级权限 -->
                        <el-col :span="5">
                         <el-tag >{{item1.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级三级权限 -->
                        <el-col :span="19" >
                           <!-- for循环嵌套 -->
                           <el-row :class="[ i2 === 0 ? '' : 'bdtop','vcenter']" v-for = "(item2,i2) in item1.children" :key="item2.id">
                               <el-col :span="6">
                                   <el-tag type="success">
                                       {{item2.authName}}
                                   </el-tag>
                                   <i class="el-icon-caret-right"></i>
                               </el-col>
                               <el-col :span="18">
                                    <el-tag closable @close="removeRightByid(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
                                        {{item3.authName}}
                                    </el-tag>
                               </el-col>
                           </el-row>
                        </el-col>
                    </el-row>
                    
                </template>
            </el-table-column>
                <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column lable = "角色" prop="roleName"></el-table-column>
            <el-table-column lable = "角色描述" prop="roleDesc"></el-table-column>
            <el-table-column lable = "操作" >
                <template slot-scope = "scope">
                    <el-button type="primary" icon="el-icon-edit" size="min">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete"  size="min">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting"  width="300px">分配权限</el-button>
                </template>
            </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                // 所有角色列表
                rolelist:[],
            }
        },
        created(){
            this.getRolesList()
        },
        methods:{
            async getRolesList(){
               const {data:res} =await this.$http.get("roles")
               if(res.meta.status !== 200){return this.$message.error("获取数据失败")} 
               this.rolelist = res.data
               console.log(this.rolelist)
            },
            async removeRightByid(role,rightId){
                // 根据id删除权限 弹框提示用户是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm'){return this.$message.info("取消删除")}
                // console.log("确认删除")
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !== 200){
                    return this.$message.error("删除失败")
                }
                this.getRolesList();
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
        
    }
    .bdtop{border-top: 1px solid #eee;}
    .bdbottom{border-bottom:1px solid #eee ;}
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>