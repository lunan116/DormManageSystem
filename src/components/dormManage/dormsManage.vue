<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍房间管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-button type="primary" @click="dialogAddFormVisible = true">添加宿舍</el-button>
        <el-select @change="handleChange" :popper-append-to-body="false" v-model="query.dormNo" clearable placeholder="请选择" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-table
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @expand-change="expandChange"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
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
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="dormNo"
            label="宿舍楼"
            min-width="12%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="electricNo"
            label="电表读数"
            min-width="8%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="roomNo"
            label="房间号"
            min-width="8%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="createTime"
            label="创建时间"
            min-width="18%">
            <template slot-scope="scope">{{scope.row.createTime|formatDate}}</template>
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="maxNo"
            label="床位数"
            min-width="7%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="recharges"
            label="收费标准"
            min-width="10%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="stayInPeopleList.length"
            label="在住人数"
            min-width="10%">
          </el-table-column>
          <el-table-column label="操作" min-width="25%" header-align="center" >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                size="mini"
                 type="primary"
                 :disabled="scope.row.stayInPeopleList.length>0?true:false"
                @click="editOne(scope.$index, scope.row)">编辑</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                :disabled="scope.row.stayInPeopleList.length>0?true:false"  
                @click="deleteOne(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出框 -->
        <el-dialog title="添加宿舍房间" :visible.sync="dialogAddFormVisible">
          <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="addRuleForm">
            <el-form-item label="宿舍楼号" prop="dormNo">
              <el-select  :popper-append-to-body="false" v-model="addRuleForm.dormNo" clearable placeholder="请输入" popper-class="selectOption">
                <el-option
                  v-for="item in selectDataList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层" prop="floors">
              <el-input  v-model="addRuleForm.floors"  type='number'></el-input>
            </el-form-item>
            <el-form-item label="房间号"  prop="roomNo">
              <el-input v-model="addRuleForm.roomNo"></el-input>
            </el-form-item>
            <el-form-item label="床位数"   prop="maxNo">
              <el-input type='number' v-model="addRuleForm.maxNo"></el-input>
            </el-form-item>
            <el-form-item label="电表读数"   prop="electricNo">
              <el-input type='electricNo' v-model="addRuleForm.electricNo"></el-input>
            </el-form-item>
            <el-form-item label="收费标准"  prop="recharges">
              <el-input type='number' v-model="addRuleForm.recharges"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改宿舍房间" :visible.sync="dialogEditFormVisible">
          <el-form :model="editRuleForm" :rules="addRules" ref="editRuleForm" label-width="100px" class="editRuleForm">
            <el-form-item label="宿舍楼号" prop="dormNo">
              <el-select disabled   :popper-append-to-body="false" v-model="editRuleForm.dormNo" clearable placeholder="请输入" popper-class="selectOption">
                <el-option
                  v-for="item in selectDataList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层" prop="floors">
              <el-input  v-model="editRuleForm.floors"  type='number'></el-input>
            </el-form-item>
            <el-form-item label="房间号"  prop="roomNo">
              <el-input v-model="editRuleForm.roomNo"></el-input>
            </el-form-item>
            <el-form-item label="床位数"   prop="maxNo">
              <el-input type='number' v-model="editRuleForm.maxNo"></el-input>
            </el-form-item>
            <el-form-item label="收费标准"  prop="recharges">
              <el-input type='number' v-model="editRuleForm.recharges"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleModify">修改</el-button>
          </div>
       </el-dialog>
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
        dormNo:""
      },
      currentPage4: 1,
      total:0,
      tableData:[],

      dialogAddFormVisible:false,
      addRuleForm: {
          dormNo: '',
          floors: '',
          electricNo:'',
          roomNo:'',
          maxNo:'',
          recharges:''
      },
      addRules: {
          dormNo: [
            { required: true, message: '请输入宿舍楼号', trigger: 'blur' }
          ],
          floors: [
            { required: true, message: '请输入楼层', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 2 个字符', trigger: 'blur' }
          ],
          electricNo: [
            { required: true, message: '请输入电表读数', trigger: 'blur' },
          ],
          roomNo: [
            { required: true, message: '请输入房间号', trigger: 'blur' },
          ],
          maxNo: [
            { required: true, message: '请输入床位数', trigger: 'blur' },
          ],
          recharges: [
            { required: true, message: '请输入收费标准', trigger: 'blur' },
          ],
          
      },

      dialogEditFormVisible:false,
      editRuleForm: {
          dormNo: '',
          floors: '',
          roomNo:'',
          maxNo:'',
          recharges:'',
          _id:''
      },
      editRules: {
          dormNo: [
            { required: true, message: '请输入宿舍楼号', trigger: 'blur' }
          ],
          floors: [
            { required: true, message: '请输入楼层', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 2 个字符', trigger: 'blur' }
          ],
          roomNo: [
            { required: true, message: '请输入房间号', trigger: 'blur' },
          ],
          maxNo: [
            { required: true, message: '请输入床位数', trigger: 'blur' },
          ],
          recharges: [
            { required: true, message: '请输入收费标准', trigger: 'blur' },
          ],
          
      },

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
        SelectValue: ''
    }
  },
  created(){
    this.getDataLists()
    this.getBuildings()
  },
  methods:{
    async getDataLists(){
      const {data:res} = await this.$axios.get('/getDormRooms',{params:this.query})
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取宿舍房间数据成功！')
        this.tableData = res.data.lists 
        this.total = res.data.total
        sessionStorage.setItem("token",res.token)
      }else{
        this.tableData = []
        this.$message.error(res.errorMessage)
      }
    },
    async getBuildings(){
      const {data:res} = await this.$axios.get('/getDormNo')
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取宿舍楼数据成功！')
        this.selectDataList=[]
        this.unique(res.data.buildingsList).forEach(item => {
          this.selectDataList.push({value:item,label:item})
        })
        
        console.log(res)
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
    handleSave(){
      this.$refs.addRuleForm.validate(async (valid) => {
          if (valid) {
            console.log("sodghwuieg")
            const {data:res} = await this.$axios.post("/addDormRoom",this.addRuleForm)
            console.log(res)
            if(res.errorCode ==200){
                this.$refs.addRuleForm.resetFields();
                this.dialogAddFormVisible = false
                this.$message.success('添加宿舍成功！')
                this.currentPage4 = 1
                this.query.currentPage = 1
                this.getDataLists()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error(res.errorMessage)
              }
          }else{
            this.$message.error("表单验证失败，请输入正确格式的表单数据！")
          }
      })
    },
    edit(index,val){
      console.log(index+val._id)
      let obj = {}
      obj._id = val._id
      obj.dormNo = val.dormNo
      obj.floors = val.floors
      obj.recharges = []
      this.tableData.forEach(item => {
        if(item._id == val._id){
          obj.recharges.push({peopleNo:item.peopleNo,pay:item.pay})
        }
      })
      console.log(obj)
      this.editRuleForm.dormNo = obj.dormNo
      this.editRuleForm.floors = obj.floors
      this.editRuleForm.peopleNo = obj.recharges[0].peopleNo
      this.editRuleForm.pay = obj.recharges[0].pay
      this.editRuleForm.dynamicItem = obj.recharges.slice(1)
      this.dialogEditFormVisible = true
    },
    handleModify(){
      this.$refs.editRuleForm.validate(async (valid) => {
          if (valid) {
              const {data:res} = await this.$axios.post('/modifyDormRoom',this.editRuleForm)
              console.log(res)
              if(res.errorCode ==200){
                this.$refs.editRuleForm.resetFields();
                this.dialogEditFormVisible = false
                this.$message.success('修改宿舍房间成功！')
                this.getDataLists()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error(res.errorMessage)
              }
          }else{
            this.$message.error("表单验证失败，请输入正确格式的表单数据！")
          }
      })
    },
    handleChange(){
      this.getDataLists()
    },
    deleteOne(index,val){
      this.$confirm('此操作将永久删除该宿舍, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$axios.post("/deleteDormRoom",{_id:val._id})
          console.log(res.errorCode)
          if(res.errorCode == "200"){
            this.query.currentPage = 1
            this.currentPage4 = 1
            this.getDataLists()
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            window.sessionStorage.setItem("token",res.token)
          }else{
            this.$message({
                type: 'error',
                message: res.errorMessage
            });
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleClose(tag,_id) {
          this.tableData.forEach(async (item,index) =>{
            if(item._id == _id){
              let arr = this.tableData[index].roomInventory.slice(0)
              arr.splice(this.tableData[index].roomInventory.indexOf(tag), 1);
              const {data:res} = await this.$axios.post('/editRoomInventory',{_id:this.tableData[index]._id,roomInventory:arr})
              if(res.errorCode == 200){
                this.$message.success('房间配置修改成功')
                this.getDataLists()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error('房间配置修改失败，请稍后再试')
              }
              this.tableData[index].roomInventory.splice(this.tableData[index].roomInventory.indexOf(tag), 1);
            }
          })
          
          //console.log(this.tableData)
        

      //this.dynamicTags.splice(this.tableData.roomInventory.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
      this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(_id) {
      let inputValue = this.inputValue;
      console.log(inputValue)
        if (inputValue) {
          this.tableData.forEach(async (item,index) =>{
            if(item._id == _id){
              let arr = this.tableData[index].roomInventory.slice(0)
              arr.push(inputValue)
              const {data:res} = await this.$axios.post('/editRoomInventory',{_id:this.tableData[index]._id,roomInventory:arr})
              if(res.errorCode == 200){
                this.$message.success('房间配置添加成功')
                this.getDataLists()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error('房间配置添加失败，请稍后再试')
              }
              this.tableData[index].roomInventory.push(inputValue);
            }
          })
          
          console.log(this.tableData)
        }
        this.inputVisible = false;
        this.inputValue = '';
    },
    expandChange(row,expandedRows){
      // console.log('expandedRows', expandedRows)
      // console.log('row', row)
      var that = this
      if (expandedRows.length == 1) {
        that.expands = []
        if (row) {
          that.expands.push(row._id)// 每次push进去的是每行的ID
        }
      }else if(expandedRows.length > 1){
        that.expands = []
        if (row) {
          that.expands.push(row._id)// 每次push进去的是每行的ID
        }
      } else {
        that.expands = []// 默认不展开
      }

    },
    editOne(index,val){
      console.log('dofheio')
      this.dialogEditFormVisible = true
      this.editRuleForm.dormNo = val.dormNo
      this.editRuleForm.floors = val.floorNo
      this.editRuleForm.roomNo = val.roomNo
      this.editRuleForm.maxNo = val.maxNo
      this.editRuleForm.recharges = val.recharges
      this.editRuleForm._id = val._id
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
.el-select{margin-left: 20px;}
.el-popper{display:absolute !important;top:0px !important;margin-top: 50px !important;}
</style>
