<template>
    <div>
      <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房费管理</el-breadcrumb-item>
        <el-breadcrumb-item>房型收费标准</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="Id"
            label="Id"
            width="180">
          </el-table-column>
          <el-table-column
            prop="maxNo"
            label="床位数"
            width="180">
          </el-table-column>
          <el-table-column
            prop="recharges"
            label="收费(元/人/月)">
          </el-table-column>
        </el-table>
      </el-card>
      
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
export default {
    data() {
      return {
        tableData: [{
          Id: '1',
          maxNo: '2',
          recharges: '800'
        }, {
          Id: '2',
          maxNo: '3',
          recharges: '700'
        }, {
          Id: '3',
          maxNo: '4',
          recharges: '600'
        }, {
          Id: '4',
          maxNo: '5',
          recharges: '500'
        },
        {
          Id: '5',
          maxNo: '6',
          recharges: '400'
        }]
      }
    }
  }

</script>

<style scoped lang="less">
.el-table{margin-top: 20px;}
.el-breadcrumb{margin-bottom: 30px;}
.el-card{width:50%;margin-left:25%;margin-top:100px;box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
</style>
