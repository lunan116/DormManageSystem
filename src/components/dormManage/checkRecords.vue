<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
        <el-breadcrumb-item>入住记录</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-select @change="handleChange" :popper-append-to-body="false" v-model="query.dormNo" clearable placeholder="请选择" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="handleChange1" :popper-append-to-body="false" v-model="query.type" clearable placeholder="请选择" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="tableData"
          border
          style="width: 100%">
          <!-- <el-table-column
            header-align="center" 
            type="expand"
            
            min-width="8%">
              <template slot-scope="scope">
                <el-tag
                  v-for="tag in scope.row.roomInventory"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag,scope.row._id)"
                  >
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                 
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row._id)"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新的配置</el-button>
              </template>
          </el-table-column> -->
          <el-table-column
            header-align="center" 
            prop="guestName"
            label="姓名"
            min-width="100">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="gender"
            label="性别"
            min-width="60">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="IDNo"
            label="身份证号"
            min-width="200">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="phoneNo"
            label="联系方式"
            min-width="150">
          </el-table-column>
          <el-table-column
            header-align="center" 
            label="起始时间"
            min-width="200">
            <template slot-scope="scope">{{scope.row.startTime|formatDate}}</template>
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="startNo"
            label="起始电表读数"
            min-width="200">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="dormNo"
            label="宿舍楼号"
            min-width="100">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="roomNo"
            label="宿舍号"
            min-width="100">
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
export default {
  name: 'buildingManage',
  data(){
    return {
      query:{
        pageSize:10,
        currentPage:1,
        dormNo:"",
        type:'0'
      },
      currentPage4: 1,
      total:0,
      tableData:[],

      

      dynamicTags:[],
      inputVisible: false,
      inputValue: '',

      expands:[],
      getRowKeys(row) {
        //console.log(row._id)
        return row._id
      },

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
      const {data:res} = await this.$axios.get('/getGuest',{params:this.query})
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取入住记录数据成功！')
        let arr = res.errorMessage.slice(0)
        arr.filter(item=>item.gender = ((item.gender == 'male' || item.gender == '男')?'男':'女'))
        this.tableData = arr
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
      this.getDataLists()
    },
    handleChange1(){
      this.getDataLists()
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
.el-select{margin-left: 20px;}
.el-popper{display:absolute !important;top:0px !important;margin-top: 50px !important;}
</style>
