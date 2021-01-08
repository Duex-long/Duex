<template>
    <div>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 卡片视图区 -->
            <el-card>
                <!-- 提示区 -->
                <el-alert title="添加商品信息" center show-icon :closable="false" type="info"></el-alert>
                <!-- 步骤条区域 -->
                <el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <!-- tab栏区 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef " label-width="100px" >
                    <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" v-model="activeIndex   " :tab-position="`left`" label-position="top">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader
                                expand-trigger="hover"
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"></el-cascader>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name="1">
                            <!-- 渲染表单item项 -->
                            <el-form-item :label="item.attr_name"  v-for="item in manyTableData" :key="item.attr_id">
                                <br>
                                <!-- 复选框组 -->
                                <el-checkbox-group  v-model="item.attr_vals">
                                    <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                                  </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals">
                                </el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <!-- 图片上传api地址 -->
                            <el-upload
                            :on-success ="handleSuccess"
                            :headers="headerObj"
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name="4">
                            <!-- 富文本编辑器组件 -->
                            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                            <!-- 添加按钮 -->
                            <el-button type="primary" class="btnAdd" @click="add" >添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-card>
            <!-- 图片预览 -->
            <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%"
            >
            <span><img class="previewImg" :src="previewPath" alt=""></span>
          
            </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data(){
            return{
                activeIndex : '0',
                addForm:{
                    goods_name:'',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    // 商品所属的分类数组
                    goods_cat:[],
                    pics:[],
                    // 商品详情描述
                    goods_introduce:'',
                    attrs:[]
                },
                addFormRules:{
                    goods_name:[{
                        required:true,message:'请输入商品名称',trigger:'blur'
                    }],
                    goods_price:[{
                        required:true,message:'请输入商品价格',trigger:'blur'
                    }],
                    goods_weight:[{
                        required:true,message:'请输入商品重量',trigger:'blur'
                    }],
                    goods_number:[{
                        required:true,message:'请输入商品数量',trigger:'blur'
                    }],
                    goods_cat:[{
                        required:true,message:'请输选择商品分类',trigger:'blur'
                    }]
                },
               CateList:[],
               cateProps:{
                   label:'cat_name',
                   value:'cat_id',
                   childern:'children'
               },
               cateList:[],
               manyTableData:[],
               onlyTableData:[],
            //    上传地址
               uploadURL :'https://www.liulongbin.top:8888/api/private/v1/upload',
            //    图片上传组件的header请求头对象
               headerObj:{
                   Authorization:window.sessionStorage.getItem('token')
               },
            previewPath:'', 
            previewVisible:false
     

            }
        },
        created(){
            this.getCateList()
        },
        methods:{
            // 获取所有商品分类数据
            async getCateList(){
                const{data:res} = await this.$http.get('categories')
                if(res.meta.status !==200){return this.$message.error("获取商品分类数据失败")}
                this.cateList = res.data
            },
            // 级联选择器选中项变化
            handleChange(){
                if(this.addForm.goods_cat.length !== 3 ){this.addForm.goods_cat = []}
            },
            beforeTabLeave(activeName,oldActiveName){
                if(oldActiveName == 0 && this.addForm.goods_cat.length !== 3)
                {   this.$message.error("请先选择商品分类")
                    // return false
                 }
            },
            async tabClicked(){
                // 证明访问的是动态参数面板
                if(this.activeIndex == '1'){
                    const{data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                    if(res.meta.status !==200){return this.$message.error("获取信息失败")}
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] :item.attr_vals.split(' ')
                    })
                    this.manyTableData = res.data
                }else if(this.activeIndex ==2){
                    const{data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                    if(res.meta.status !== 200) {return this.$message.error("获取静态属性失败")}
                    this.onlyTableData = res.data
                }
                
                
            },
            // 处理图片预览效果
            handlePreview(file){
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            // 处理移除图片的操作
            handleRemove(file){
                // 获取图片路径
                const filePath=file.response.data.tmp_path
                // 从数组中找到图片
                const i = this.addForm.pics.findIndex(x=>{
                    x.pic === filePath 
                })
                // 将图片的信息对象从数组中移除
                this.addForm.pics.splice(i,1)
            },
            // 监听图片上传成功的事件
            handleSuccess(response){
                console.log(response)
                // 得到一个图片信息对象
                const picInfo = {pic:response.data.tmp_path}
                // 将图片信息对象push进数组里
                this.addForm.pics.push(picInfo)
            },
            add(){
                    this.$refs.addFormRef.validate(async valid=>{
                    if(!valid){return this.$message.error("请填写必要的表单项!")}
                    // 执行添加逻辑
                    // lodash cloneDeep(obj)
                    const form = _.cloneDeel(this.addForm)
                    this.Form.goods_cat = Form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTableData.forEach(item=>{
                        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
                        ths.addForm.attrs.push(newInfo)
                    })
                    // 和静态属性
                    this.onlyTableData.forEach(item=>{
                        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs=this.addForm.attrs
                    const {data:res} = await this.$http.post(`goods`,form)
                    if(res.meta.status !==201){return this.$message.error("添加商品失败")}
                    this.$message.success("添加商品成功")
                    this.$router.push('/goods')
                })
            }
        },
        computed:{
            cateId(){
                if(this.addForm.goods_cat.length === 3){
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>

<style lang="less" scoped>
.el-step{
    margin: 15px 0;
}
.el-checkbox{
    margin: 0 10px
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}
</style>