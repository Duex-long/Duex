<template>
    <div>
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert show-icon :closable="false" type="warning" title="注意：只允许为第三季分类设置相关参数"></el-alert>

            <!-- 选择商品分类 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                    expand-tigger="hover"
                      v-model="selectedCateKeys"
                      :options="catelist"
                      :props="cateProps"
                      @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- Tab页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="用户管理" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
                        <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"> 
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                     <!-- 输入文本框 -->  
                                <el-tag closable  @close="handleClose(i,scope.row)" v-for = "(item,i) in scope.row.attr_vals" :key="i">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                    </el-input>
                                        <!-- 添加按钮 -->
                                     <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                              
                            </template>
                        </el-table-column>
                            <!-- 索引列 -->
                            <el-table-column type="index"> </el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
                            <el-table-column label="操作" > 
                                <template slot-scope = " scope">
                                    <el-button class="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)" size="mini">编辑</el-button>
                                    <el-button type="danger" class="el-icon-delete"  @click="removeParams(scope.row.attr_id)" size="mini">删除</el-button>
                                </template>    
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
            
                <!-- 添加静态属性面板 -->
                    <el-tab-pane label="静态属性" name="only">
                        <!-- 添加属性按钮 -->
                        <el-button type="primary" size="mini"  :disabled="isBtnDisable"  @click="addDialogVisible = true">添加属性</el-button>
                        <!-- 静态参数表格 -->
                        <el-table :data="onlyTableData" border stripe>
                             <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                     <!-- 输入文本框 -->  
                                <el-tag closable  @close="handleClose(i,scope.row)" v-for = "(item,i) in scope.row.attr_vals" :key="i">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                    </el-input>
                                        <!-- 添加按钮 -->
                                     <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                              
                            </template>    
                        </el-table-column>
                            <!-- 索引列 -->
                            <el-table-column type="index"> </el-table-column>
                            <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
                            <el-table-column label="操作" > 
                                <template slot-scope = " scope">
                                    <el-button class="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)" size="mini">编辑</el-button>
                                    <el-button type="danger" class="el-icon-delete" @click="removeParams(scope.row.attr_id)" size="mini">删除</el-button>
                                </template>    
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    </el-tab-pane>
               </el-tabs>
        </el-card>
        <!-- 添加参数Dialog 对话框 -->
            <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close = "addDialogClosed"
               >
               <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
                    <el-form-item :label="titleText"  prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog
                :title="'修改' + titleText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close = "editDialogClosed"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
                    <el-form-item :label="titleText"  prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                // 商品分类列表
                catelist:[],
                // /级联选择框的配置对象
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                // 级联选择框双向绑定到的数组
                selectedCateKeys:[],
                // 被激活的页签的name
                activeName:'many',
                // 动态参数数据
                manyTableData:[],
                // 静态属性数据
                onlyTableData:[],
                // 控制添加对话框的显示与隐藏
                addDialogVisible:false,
                // 添加参数表单数据对象
                addForm:{
                    attr_name:''
                },
                // 添加表单验证规则对象
                addFormRules:{
                    attr_name:[{
                        required:true,message:'请输入参数名称',tigger:'blur'
                    }]
                },
                // 控制修改对话框的显示与隐藏
                editDialogVisible:false,
                // 修改的表单数据对象
                editForm:{},
                // 修改表单的验证规则
                editFormRules:{
                    attr_name:[{
                        required:true,message:'请输入参数名称',tigger:'blur'
                    }]
                },
                // // 控制按钮与文本框的切换显示
                // inputVisible:false,
                // // 文本框中输入的内容
                // inputValue:'',
            }
        },
        created(){
            // 获取所有商品分类列表
            this.getCateList()
        },
        methods:{
            async getCateList(){
               const {data:res} = await this.$http.get(`categories`)
               if(res.meta.status !== 200){return this.$message.error("获取商品分类失败")}
                this.catelist = res.data
                console.log(res.data)
            },
            // 级联选择框选中项变化后触发该函数
            handleChange(){
                this.getParamasData()
            },
            // 获取参数的列表数据
            async getParamasData(){
                // console.log(this.selectedCateKeys)
                // 证明选中的不是三级分类
                if(this.selectedCateKeys.length !== 3 ) { this.selectedCateKeys = []
                    this.manyTableData = [],
                    this.onlyTableData = []
                     return }
                    //  根据所选分类的id和当前所处的面板获取对应的参数
                    const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
                    if(res.meta.status!== 200){return this.$message.error("获取参数列表失败")}

                    // 判断是否为空
                    res.data.forEach(item=>{
                        item.attr_vals =  item.attr_vals ? 
                        item.attr_vals.split(' ') :[]
                        // 控制文本框的显示与隐藏
                        item.inputVisible = false
                        // 文本框输入的值
                        item.inputValue = ''
                    })
                    if(this.activeName == 'many'){
                        this.manyTableData = res.data
                    }else{
                        this.onlyTableData = res.data
                    }
            },
            // Tab页签点击事件的处理函数
            handleTabClick(){
                console.log(this.activeName)
                this.getParamasData()
            },
            // 监听添加对话框的关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加参数
            addParams(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid){return}
                    const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,   attr_sel:this.activeName})
                    if(res.meta.status !==201) {return this.$message.error("添加参数失败") }
                    this.$message.success("添加参数成功")
                    this.addDialogVisible = false
                    this.getParamasData()
                })
            },
            // 点击按钮展示修改的对话框
            async showEditDialog(attr_id){
                // 查询当前参数的信息
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
                if(res.meta.status !== 200){return this.$message.error("获取参数信息失败")}
                this.editForm = res.data
                this.editDialogVisible = true
            },
            // 关闭对话框后
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            // 点击按钮修改参数信息
            editParams(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid){return}
                    const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
                    if(res.meta.status !==200){return this.$message.error("修改参数失败")}
                    this.$message.success("获取数据成功")
                    this.getParamasData()
                    this.editDialogVisible = false
                })
            },
            // 根据ID删除对应的参数项
            async removeParams(attr_id){
                const confirmResult =  await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).catch(err =>err)
                    // 用户取消删除操作
                if(confirmResult !== 'confirm') {return this.$message.info("已取消删除")}
                const{data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if(res.meta.status !== 200) {return this.$message.error("删除失败")}
                this.$message.success("删除成功")
                this.getParamasData()
            },
            // 文本框失去对焦（enter或者blur）
            handleInputConfirm(row){
                // console.log("占位")
                if(row.inputValue.trim().length == 0 ){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
            // 如果没有return 说明用户输入真实内容
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                // 还需要发起请求在数据库中保存
                this.saveAttrVals(row)
                    
            },
            // 将对attr_vals的操作保存到数据库
            async saveAttrVals(row){
                const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join('')})
                    if(res.meta.status !== 200){return this.$message.error("修改参数项失败")}
                    this.$message.success("修改参数项成功!")
                    
            },
            // 点击按钮展示文本框
            showInput(row){
                row.inputVisible = true
                // $nextTick 当页面上元素被重新渲染后才会 callback
                // 让文本框自动获得焦点
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 删除对应参数可选项
            handleClose(i,row ){
                row.attr_vals.splice(i,1)
               this.saveAttrVals(row)
            }
        },
        computed:{
            // 如果按钮需要被禁用则返回true 否则 false
            isBtnDisable(){
                if(this.selectedCateKeys.length !==3)
                {return true}
                return false
            },
            // 当前选中的三级分类的id
            cateId(){
                if(this.selectedCateKeys.length ==3){
                    return this.selectedCateKeys[2]
                }
                return null
            },
            titleText(){
                if(this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>

<style lang="less" scoped>
    .cat_opt{
   margin: 15px 0;
}
.el-tag{
    margin:  5px;
}
.input-new-tag{
    width: 120px;
}
</style>