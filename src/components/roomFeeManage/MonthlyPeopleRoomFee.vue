<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房费管理</el-breadcrumb-item>
        <el-breadcrumb-item>月度个人房租费用统计</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-select @change="handleChange" :popper-append-to-body="false" v-model="query.dormNo" clearable placeholder="请选择宿舍楼号" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="handleChange" :popper-append-to-body="false" v-model="query.status"  placeholder="请选择入住状态" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          @change="handleChange1"
          v-model="query.dateVal"
          type="month"
          placeholder="选择月"
          value-format="yyyy.M">
        </el-date-picker>
        <el-input class="keyword" @input="handleChange"  clearable v-model="query.keyword" placeholder="请输入关键字"></el-input>
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            header-align="center" 
            prop="dormNo"
            label="宿舍楼号"
            min-width="70">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="roomNo"
            label="宿舍房间号"
            min-width="60">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="guestName"
            label="住客姓名"
            min-width="60">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="belongToCompany"
            label="所在公司"
            min-width="60">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="IDNo"
            label="身份证号"
            min-width="90">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="rank"
            label="职等"
            min-width="40">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="phoneNo"
            label="联系方式"
            min-width="60">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="roomFee"
            label="租房费用"
            min-width="50">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
let d = new Date()
export default {
  name: 'buildingManage',
  data(){
    return {
      query:{
        pageSize:10,
        currentPage:1,
        dormNo:"",
        dateVal:d.getFullYear()+"."+(d.getMonth()),
        status:'',
        keyword:""
      },
      currentPage4: 1,
      total:0,
      tableData:[],
      roomUsedNo:'',
      
      dynamicTags:[],
      inputVisible: false,
      inputValue: '',

      expands:[],
      getRowKeys(row) {
        //console.log(row._id)
        return row._id
      },
      isdisabled:false,

      selectDataList:[{
          value: '暂无数据',
          label: '暂无数据'
      }],
      selectDataList1:[{
          value: '0',
          label: '入住中'
      },{
          value: '1',
          label: '已退房'
      }],

    }
  },
  created(){
    this.getDataLists()
    this.getBuildings()
  },
  methods:{
    async getDataLists(){
      console.log("query:"+this.query.dateVal)
      const {data:res} = await this.$axios.get('/getPeopleMonthlyRoomFeeList',{params:this.query})
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取月度房间用电量成功！')
        this.tableData = res.data.managerList
        console.log(this.tableData)
        this.total = res.data.total
        sessionStorage.setItem("token",res.token)
      }else{
        this.tableData = []
        this.$message.error(res.errorMessage)
      }
    },
    async getBuildings(){
      const {data:res} = await this.$axios.get('/getDormNo')
      //console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取宿舍楼数据成功！')
        this.selectDataList=[]
        this.unique(res.data.buildingsList).forEach(item => {
          this.selectDataList.push({value:item,label:item})
        })
        
        //console.log(res)
        sessionStorage.setItem("token",res.token)
      }else{
        this.$message.error('获取宿舍楼数据失败！')
      }
    },
    unique(array){
      return Array.from(new Set(array));
    },
    handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.getDataLists()
        //console.log(this.query)
    },
    handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.query.currentPage = val
        this.getDataLists()
        //console.log(this.query)
    },
    handleChange(){
      this.query.currentPage = 1
      this.getDataLists()
    },
    handleChange1(){
      
      let year = this.query.dateVal.substring(0,4)
      let month = this.query.dateVal.slice(5)
      if(year < d.getFullYear() || (year == d.getFullYear() && Number(month) <= Number(Number(d.getMonth())+1)) ){
        console.log(month+"  "+Number(Number(d.getMonth())+1))
        this.getDataLists()
      }else{
        this.$message.error("您选择的时间有误，请重新选择！")
      }
      
      
    },
    
    

  }
  
}

</script>

<style scoped  lang="less">
.el-table{margin-top: 20px;}
.el-breadcrumb{margin-bottom: 30px;}
.el-card{box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
.el-pagination{margin-top: 20px;}
.inline{display: flex;}
.elAdd{display:block;margin:0 auto}
 .el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.el-select,.el-input{margin-left: 20px;}
.el-popper{display:absolute !important;top:0px !important;margin-top: 50px !important;}
.keyword{width: 20%;margin-left: 20px;}
</style>
