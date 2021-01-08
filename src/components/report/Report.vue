<template>
    <div>
         <!-- 面包屑导航 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
          </el-breadcrumb>
          <el-card>
            
            <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 600px;height:400px;"></div>
          </el-card>
    </div>
</template> 

<script>        
    import echarts from 'echarts'
    export default {
        data(){
            return{}
        },
        created(){
        }, 
        mounted(){
            // DOM被渲染完成
            try{
           var myChart = echarts.init(document.getElementById('main'))}
           catch(err){
               this.$message.error("数据报表未上传")
           };
           
            var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
            myChart.setOpiton(option)
        },
        methods:{},
      
    }

</script>

<style lang="less" scoped>

</style>