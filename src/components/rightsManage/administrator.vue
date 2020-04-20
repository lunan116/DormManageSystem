<template>

    <div>
      <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容展示 -->
      <el-card>
        card
      </el-card>
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
export default {
  created(){
    console.log("owseghorgho")
  }
  
}

</script>

<style scoped lang="less">
.el-breadcrumb{margin-bottom: 30px;}
.el-card{box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
</style>
