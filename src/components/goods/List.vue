<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList">
                        <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加按钮 -->
                <el-col :span="4">
                    <el-button @click="goAddpage" type="primary">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- Table表格区 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column width="95px" label="商品价格(元)" prop="goods_price"></el-table-column>
                <el-table-column width="70px" label="商品重量(Kg)" prop="goods_weight"></el-table-column>
                <el-table-column width="140px" label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column width="130px" label="操作">
                    <template slot-scope="scope">
                        <el-button class="el-icon-edit" type="primary" size="mini"></el-button>
                        <el-button @click="removeByid(scope.row.goods_id)" class="el-icon-delete" type="danger"  size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
    export default {
        data(){
            return{
                // 查询参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                // 总数居条数
                total:0,
                // 商品列表
                goodslist:[]
            }

        },
        created(){
            this.getGoodsList()
        },
        methods:{
            // 根据分页获取对应的商品列表
            async getGoodsList(){
                const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
                if(res.meta.status !==200){return this.$message.error("获取商品列表失败")}
                this.$message.success("获取商品列表成功")
                this.goodslist = res.data.goods
                this.total = res.data.total
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            // 接受页码
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            async removeByid(id){
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                if(confirmResult !=='confirm'){return this.$message.info("已经取消删除")}
                const{data:res} = await this.$http.delete(`goods/${id}`)
                if(res.meta.status !== 200) {return this.$message.error("删除失败")}
                this.$message.success("删除成功")
                this.getGoodsList()
            },
        //    
            goAddpage(){
                this.$router.push('/goods/add')
            }
        }
    }
</script>

<style lang="less" scoped>

</style>