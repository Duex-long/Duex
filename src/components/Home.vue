<template>
    <div>
        Home 组件
        <el-button type="info" @click="logout">
            登出
        </el-button>
    </div>
</template>
<script>
    export default {

        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push("/login");
                this.$message.success("成功登出")
            }
        }
    }
</script>
<style lang="less" scoped>

</style>