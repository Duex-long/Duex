<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 卡片视图 -->
          <el-card>
            <!-- 搜索与添加区域 -->
              <el-row :gutter="20">
                  <el-col :span="8">
                    <el-input @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.query"   clearable>
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                  </el-col>
              </el-row>
              <!-- 用户列表区 -->
              <el-table :data="userlist" border="1" stripe>
                  <el-table-column label="#" type="index"></el-table-column>
                  <el-table-column label="姓名" prop="username"></el-table-column>
                  <el-table-column label="邮箱" prop="email"></el-table-column>
                  <el-table-column label="电话" prop="mobile"></el-table-column>
                  <el-table-column label="角色" prop="role_name"></el-table-column>
                  <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <!-- scope.row是当前的数据 -->
                      <el-switch v-model="scope.row.mg_state" @change="userstateChange(scope.row)">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"  width="175">
                      <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button @click="showEditDialog(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <!-- 删除 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserByid(scope.row.id)"></el-button>
                        <!-- 分配 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                             <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                          </el-tooltip>
                      </template>
                  </el-table-column>
                  
              </el-table>
              <!-- 分页区域 -->
              <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.page-size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-card>
          <!-- 添加用户对话框 -->
          <el-dialog
          @close="addDialogVisibleClosed"
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%">
  <!-- 内容主体区 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
    <!--修改用户  -->
    
            <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editFormCloesd"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" >
                  <el-input v-model="editForm.username"  disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" >
                    <el-input v-model="editForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile" >
                    <el-input v-model="editForm.mobile"></el-input>
                  </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            // 验证邮箱规则
            // var checkEmail =(rule,value,callback)=>{
            //     // 验证邮箱的正则表达式
            //     const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            //     if(regEmail.test(value)){
            //         return callback()
            //     }
            //     else {
            //         callback(new Error('请输入正确的邮箱格式'))
            //     }
            // }
            // // 验证手机规则
            // var checkMobile= (rule,value,callback)=>{
            //     const regMobile = /^(0|86|17951)?(13[0-9]|15)[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            //     if(regMobile.test(value)){
            //         return callback()
            //     }else{
            //         callback(new Error("请输入正确的手机号"))
            //     }
            // }
            return{
                // 获取用户列表参数对象
                queryInfo:{
                    query:'',
                    // 当前的页数
                    pagenum:1,
                    // 当前每页显示多少数据
                    pagesize:1
                },
                userlist:[],
                total:0,
                // 控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
                // 添加用户表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                // 表单验证规则
                addFormRules:{
                   username:[
                       {required:true,message:'请输入用户名',trigger:'blur'},
                       {min:3,max:10,message:'用户名长度至小三位至多十位',trigger:'blur'}
                    ] ,password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:15,message:'用户名长度至小六位至多十五位',trigger:'blur'}
                    ],
                    email:[
                        {rquired:true,message:'请输入邮箱',trigger:'blur'},
                       
                    ],
                    mobile:[
                        {rquired:true,message:'请输入邮箱',trigger:'blur'},
                        
                    ]
                
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible:false ,
                // 查询到的用户信息对象
                editForm:{},
                editFormRules:{
                    email:[
                    {rquired:true,message:'请输入邮箱',trigger:'blur'},
                    // {validator:checkEmail,trigger:'blur'}
                    ],
                    mobile:[
                    {rquired:true,message:'请输入手机',trigger:'blur'},
                    // {validator:checkMobile,trigger:'blur'}
                    ]
                }  
            
            }
        },
        created(){
            this.getUserList()
        },
        methods:{
            async  getUserList(){
            const {data:res} =  await this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error("获取用户列表失败")
            }
            this.userlist=res.data.users 
            this.total=res.data.total
        },
        handleSizeChange(newSize){
            // 监听pagesize改变的事件
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage){
            // 监听页码值改变的事件
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        async userstateChange(userInfo){
            // 监听switch开关状态改变
            // console.log(userInfo)
          const{data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !=200){
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error("更新用户状态失败")
            }
            this.$message.success("状态更新成功")
        },
        addDialogVisibleClosed(){
            // 监听添加用户对话框关闭事件
            // 关闭对话框后重置表单
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            // 点击按钮添加新用户
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                    // 验证通过 可以发起请求添加数据
               const {data:res} = await this.$http.post('users',this.addForm)
               if(res.meta.status !== 201){
                   this.$message.error("添加用户失败")
               }

                   this.$message.success("添加用户成功")
                //    隐藏添加对话框
                   this.addDialogVisible = false
                //    重新获取数据
                   this.getUserList()
            })
        },
        async showEditDialog(id){
            // 展示编辑用户对话框
            const {data:res} = await this.$http.get("users/" + id)
            if(res.meta.status !==200) {
                return this.$message.error("查询信息失败")
            }
            this.editForm = res.data
            this.editDialogVisible=true
        },
        editFormCloesd(){
            // 监听修改用户对话框的关闭事件
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            // 修改登陆信息并提交
            this.$refs.editFormRef.validate(async valid=>{
                console.log(valid)
                if(!valid) return
                // // 发起修改用户信息的数据请求
                const {data:res} = await this.$http.put('users/'+ this.editForm.id,{email:
                this.editForm.email , mobile :
                this.editForm.mobile})
                if(res.meta.status !== 200){
                        return this.$message.error("更新用户信息失败")
                    }
                    // 
                    this.editDialogVisible = false
                    // 
                    this.getUserList()
                    // 
                    this.$message.success("信息更新成功")

            })
        },
        async removeUserByid(id){
            // 
         const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=> err)
            // 如果确认 接收到confirm 字符串 如果取消 会报错所以用catch捕获后传出去
            // 如果用户取消删除 则返回一共字符串cancel
            if(confirmResult !== 'confirm'){
                    return this.$message.info("删除取消")
            }
             const {data:res}=await this.$http.delete("users/"+id)
                if(res.meta.status !==200){
                    return this.$message.error("删除失败")
                }
                this.$message.success("删除成功")
                this.getUserList();
            
        }
        }
    }
</script>

<style lang="less" scoped>

</style>