<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>电费管理</el-breadcrumb-item>
        <el-breadcrumb-item>月度房间用电量统计</el-breadcrumb-item>
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
        <el-date-picker
          @change="handleChange1"
          v-model="query.dateVal"
          type="month"
          placeholder="选择月"
          value-format="yyyy.M">
        </el-date-picker>
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
            v-if="!isLastMonth"
            header-align="center" 
            prop="usedNo"
            label="用电量"
            min-width="60">
          </el-table-column>
          <el-table-column
            v-if="isLastMonth"
            header-align="center" 
            label="用电量"
            min-width="60">
            <template slot-scope="scope">
              <el-input v-if="scope.row.usedNo !=''" @change="handleSave1(scope.row)" :disabled="isdisabled" type="number" v-model="scope.row.usedNo"  placeholder="请输入用电量1"></el-input>
              <el-input type="number" @change="handleSave(scope.row)" v-else placeholder="请输入用电量" v-model="scope.row.usedNo1"></el-input>
            </template>
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
      isLastMonth:true,
      query:{
        pageSize:10,
        currentPage:1,
        dormNo:"",
        dateVal:d.getFullYear()+"."+(d.getMonth()),
        isLastMonth:"true"
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
    this.isdisabled1()
  },
  methods:{
    isdisabled1(){
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth()
      let day = d.getDate()
      if(year+"."+month == this.query.dateVal && day > 0 && day < 9 ){
        console.log(false+"owhg")
        this.isdisabled = false
      }else{
        console.log(true+"woegh")
        this.isdisabled = true
      }
    },
    async getDataLists(){
      console.log(this.isLastMonth)
      console.log("query:"+this.query.dateVal)
      const {data:res} = await this.$axios.get('/getMonthlyRoomUsedNoList',{params:this.query})
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取月度房间用电量成功！')
        this.tableData = res.errorMessage
        this.total = res.total
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
      console.log(year+" "+month)
      if(d.getMonth()>1){
        if(year<d.getFullYear() || year == d.getFullYear() && month < d.getMonth()){
          this.isLastMonth = false
          this.query.currentPage = 1
          this.query.isLastMonth = "false"
          this.getDataLists()
        }else if(year == d.getFullYear() && month == d.getMonth()){
          this.isLastMonth = true
          this.query.currentPage = 1
          this.query.isLastMonth = "true"
          this.getDataLists()
        }else{
          this.tableData = ""
          this.$message.error("您选择的时间有误，请重新选择！")
        }
      }else if(d.getMonth() == 0){
        if(year+1<d.getFullYear() || year+1 == d.getFullYear() && month < d.getMonth()+12){
          this.isLastMonth = false
          this.query.currentPage = 1
          this.query.isLastMonth = "false"
          this.getDataLists()
        }else if(year+1 == d.getFullYear() && month == d.getMonth()+12){
          this.isLastMonth = true
          this.query.currentPage = 1
          this.query.isLastMonth = "true"
          this.getDataLists()
        }else{
          this.tableData = ""
          this.$message.error("您选择的时间有误，请重新选择！")
        }
      }else{
        if(year+1<d.getFullYear() || year+1 == d.getFullYear() && month < d.getMonth()+12){
          this.isLastMonth = false
          this.query.currentPage = 1
          this.query.isLastMonth = "false"
          this.getDataLists()
        }else if(year == d.getFullYear() && month == d.getMonth()){
          this.isLastMonth = true
          this.query.currentPage = 1
          this.query.isLastMonth = "true"
          this.getDataLists()
        }else{
          this.tableData = ""
          this.$message.error("您选择的时间有误，请重新选择！")
        }
      }
      
      
    },
    async handleSave(val){
      console.log(val)
      if(val.usedNo1 == "" || undefined){
        this.$message.error("输入框中的用电量不能为空！")
      }else{
        let obj = {
          dormNo:val.dormNo,
          roomNo:val.roomNo,
          electricNo:val.usedNo1
        }
        if(d.getDate() >8){
          this.$message.error("登记失败，登记日期只能是每个月的1日-8日！")
        }else{
          const {data:res} = await this.$axios.post('/saveRoomUsedNo',obj) 
          console.log(res)
          if(res.errorCode == 200){
            this.$message.success('登记房间用电量成功！')
            this.getDataLists()
            sessionStorage.setItem("token",res.token)
          }else{
            this.$message.error(res.errorMessage)
          }
        }
      }

    },
    async handleSave1(val){
      console.log(val)
      if(val.usedNo == "" || undefined){
        this.$message.error("输入框中的用电量不能为空！")
      }else{
        let obj = {
          dormNo:val.dormNo,
          roomNo:val.roomNo,
          electricNo:val.usedNo
        }
        if(d.getDate() >8){
          this.$message.error("登记失败，登记日期只能是每个月的1日-8日！")
        }else{
          const {data:res} = await this.$axios.post('/saveRoomUsedNo',obj) 
          console.log(res)
          if(res.errorCode == 200){
            this.$message.success('登记房间用电量成功！')
            this.getDataLists()
            sessionStorage.setItem("token",res.token)
          }else{
            this.$message.error(res.errorMessage)
          }
        }
      }

    }
    

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
.el-select{margin-left: 20px;margin-right: 20px;}
.el-popper{display:absolute !important;top:0px !important;margin-top: 50px !important;}
</style>
