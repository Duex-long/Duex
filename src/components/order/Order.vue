<template>
    <div> 
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
           <el-row>
               <el-col :span="8">
                <el-input placeholder="请输入内容" >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
               </el-col>
           </el-row>
           <!-- 列表订单数据 -->
           <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status == '1' " type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template> 
                </el-table-column>  
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" class="el-icon-edit" @click="showBox"></el-button>
                        <el-button @click="showProgressBox" type="success" size="mini" class="el-icon-location"></el-button>
                    </template>
                </el-table-column> 
           </el-table>
           <!-- 分页区域 -->
           <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="queryInfo.pagenum"
           :page-sizes="[5, 10, 15]"
           :page-size="queryInfo.pagesize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="400">
         </el-pagination>
        </el-card>
        <!-- 修改属性对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%" 
        @close="addressDialogClosed"
        >
        <span>
            <el-form :model="addressForm" :rules="addressFormRules" refs="ruleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="address1">
                <el-cascader :options = "cityData" v-model="addressForm.adress1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                <el-input v-model="address2"></el-input>
                </el-form-item>
            </el-form></span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span> 
        </el-dialog>
        <!-- 展示物流进度 -->
        <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
        >
        <span>
            <!-- 时间线 -->
            <el-timeline >
                <el-timeline-item
                  v-for="(activity, index) in progressInfo"
                  :key="index"
                  :timestamp="activity.time">
                  {{activity.context}}
                </el-timeline-item>
              </el-timeline>
        </span>
      
        </el-dialog>
        </div>
</template>
<script>
    import cityData from './citydata.js'
    export default {
        data(){
            return{
                
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                total:0,
                orderlist:[],
                addressVisible:false,
                addressForm:{adress1:[],
                            adress2:''},
                addressFormRules:{
                    address1:[{
                        require:true,message:'请选择市省市区/县' , trigger:'blur'
                    }],
                    address2:[{
                        require:true,message:'请选填写详细地址' , trigger:'blur'
                    }]
                },
                cityData,
                progressVisible:false,
                progressInfo:[],
            }
        },
        created(){
            this.getOrderList()
        },
        methods:{
            async getOrderList(){
               const{data:res} = await this.$http.get('orders',{params:this.queryInfo})
               if(res.meta.status !== 200){return this.$message.error("获取列表失败")}
               this.total = res.data.total
               this.orderlist = res.data.goods
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            showBox(){
                this.addressVisible = true
            },
            addressDialogClosed(){
                this.$refs.addressFormRef.resetField()
            },
            async showProgressBox(){
               console.log("1")
                const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
         
                if(res.meta.status !== 200){return this.$message.error("获取物流信息失败")}
                this.progressInfo = res.data
                this.progressVisible = true
            }
        }
    }
</script>
<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>