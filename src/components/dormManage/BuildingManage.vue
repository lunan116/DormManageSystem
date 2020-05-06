<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍楼管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-button type="primary" @click="dialogAddFormVisible = true">添加宿舍楼</el-button>
        <el-table
          :data="tableData"
          :span-method="cellMerge"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          border
          style="width: 100%; margin-top: 20px">
          <el-table-column
            prop="_id"
            label="ID"
            min-width="25%">
          </el-table-column>
          <el-table-column
            prop="dormNo"
            label="宿舍楼号"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="floors"
            label="楼层数"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="peopleNo"
            label="x人间"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="pay"
            label="收费标准(元/人/月)"
            min-width="20%">
          </el-table-column>
          <el-table-column label="操作" min-width="20%" header-align="center" >
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="edit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="deleteOne(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="添加宿舍楼" :visible.sync="dialogAddFormVisible">
          <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="addRuleForm">
            <el-form-item label="宿舍楼号" prop="dormNo">
              <el-input v-model="addRuleForm.dormNo"></el-input>
            </el-form-item>
            <el-form-item label="楼层数" prop="floors">
              <el-input v-model="addRuleForm.floors" type='number'></el-input>
            </el-form-item>
            <div class="inline" >
              <el-form-item  :inline="true" label="x人间" prop="peopleNo">
                <el-input v-model="addRuleForm.peopleNo" type='number'></el-input>
              </el-form-item>
              <el-form-item :inline="true" label="收费标准" prop="pay">
                <el-input v-model="addRuleForm.pay" type='number'></el-input>
              </el-form-item>
            </div>
            <div class="inline" v-for="(item, index) in addRuleForm.dynamicItem" :key="index">
            <el-form-item
                label="x人间"
                :prop="'dynamicItem.' + index + '.peopleNo'"
                :rules="{
                    required: true, message: '请输入几人间', trigger: 'blur'
                }"
            >
                <el-input v-model="item.peopleNo" type='number'></el-input>
            </el-form-item>
            <el-form-item
                label="收费标准"
                :prop="'dynamicItem.' + index + '.pay'"
                :rules="[
                    {required: true, message: '请输入收费标准', trigger: 'blur'}
                  ]"
                >
                <el-input v-model="item.pay" type='number'></el-input>
            </el-form-item>
            <el-form-item>
                <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
            </el-form-item>
         </div>
          </el-form>
          
          <el-button class="elAdd"  @click="addItem" type="primary">增加</el-button>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改宿舍楼" :visible.sync="dialogEditFormVisible">
          <el-form :model="editRuleForm" :rules="addRules" ref="editRuleForm" label-width="100px" class="editRuleForm">
            <el-form-item label="宿舍楼号" prop="dormNo">
              <el-input v-model="editRuleForm.dormNo"></el-input>
            </el-form-item>
            <el-form-item label="楼层数" prop="floors">
              <el-input v-model="editRuleForm.floors" type='number'></el-input>
            </el-form-item>
            <div class="inline" >
              <el-form-item  :inline="true" label="x人间" prop="peopleNo">
                <el-input v-model="editRuleForm.peopleNo" type='number'></el-input>
              </el-form-item>
              <el-form-item :inline="true" label="收费标准" prop="pay">
                <el-input v-model="editRuleForm.pay" type='number'></el-input>
              </el-form-item>
            </div>
            <div class="inline" v-for="(item, index) in editRuleForm.dynamicItem" :key="index">
            <el-form-item
                label="x人间"
                :prop="'dynamicItem.' + index + '.peopleNo'"
                :rules="{
                    required: true, message: '请输入几人间', trigger: 'blur'
                }"
            >
                <el-input v-model="item.peopleNo" type='number'></el-input>
            </el-form-item>
            <el-form-item
                label="收费标准"
                :prop="'dynamicItem.' + index + '.pay'"
                :rules="[
                    {required: true, message: '请输入收费标准', trigger: 'blur'}
                  ]"
                >
                <el-input v-model="item.pay" type='number'></el-input>
            </el-form-item>
            <el-form-item>
                <i class="el-icon-delete" @click="deleteItem1(item, index)"></i>
            </el-form-item>
          </div>
          </el-form>
          
          <el-button class="elAdd"  @click="addItem1" type="primary">增加</el-button>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleModify">修改</el-button>
          </div>
       </el-dialog>
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
        currentPage:1
      },
      currentPage4: 1,
      total:0,
      tableData:[],
      spanArr:[],
      pos:'',

      dialogAddFormVisible:false,
      addRuleForm: {
          dormNo: '',
          floors: '',
          peopleNo:'',
          pay:'',
          dynamicItem: []
      },
      addRules: {
           dormNo: [
            { required: true, message: '请输入宿舍楼号', trigger: 'blur' }
          ],
          floors: [
            { required: true, message: '请输入楼层数', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 2 个字符', trigger: 'blur' }
          ],
          peopleNo: [
            { required: true, message: '请输入几人间', trigger: 'blur' },
          ],
          pay: [
            { required: true, message: '请输入收费标准', trigger: 'blur' },
          ],
          
      },

      dialogEditFormVisible:false,
      editRuleForm: {
          dormNo: '',
          floors: '',
          peopleNo:'',
          pay:'',
          dynamicItem: []
      },
      editRules: {
          dormNo: [
            { required: true, message: '请输入宿舍楼号', trigger: 'blur' }
          ],
          floors: [
            { required: true, message: '请输入楼层数', trigger: 'blur' },
            { type: 'number', message: '必须为数字'},
            { min: 1, max: 12, message: '长度在 1 到 2 个字符', trigger: 'blur' }
          ],
          peopleNo: [
            { required: true, message: '请输入几人间', trigger: 'blur' },
            { type: 'number', message: '必须为数字'},
          ],
          pay: [
            { required: true, message: '请输入收费标准', trigger: 'blur' },
            { type: 'number', message: '必须为数字'},
          ],
          
      },
    }
  },
  created(){
    this.getBuildings()
  },
  methods:{
    async getBuildings(){
      this.spanArr = []
      this.pos = ""
      const {data:res} = await this.$axios.get('/getBuildings',{params:this.query})
      console.log(res)
      if(res.errorCode == 200){
        this.$message.success('获取宿舍楼数据成功！')
        this.tableData = res.data.buildingsList 
        this.total = res.data.total
        sessionStorage.setItem("token",res.token)
        this.getSpanArr(this.tableData)
      }else{
        this.$message.error('获取宿舍楼数据失败！')
      }
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 5) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
      }
    },
    getSpanArr(tableData) {　
      for (var i = 0; i < tableData.length; i++) {
            if (i === 0) {
                  this.spanArr.push(1);
                  this.pos = 0
            } else {
              // 判断当前元素与上一个元素是否相同
        if (tableData[i]._id === tableData[i - 1]._id) {
                    this.spanArr[this.pos] += 1;
                    this.spanArr.push(0);
                  } else {
                    this.spanArr.push(1);
                    this.pos = i;
                  }
            }
        }
      console.log(this.spanArr)
    },
    handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.getBuildings()
        //console.log(this.query)
    },
    handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.query.currentPage = val
        this.getBuildings()
        //console.log(this.query)
    },
    addItem () {
      console.log("oghwir")
      this.addRuleForm.dynamicItem.push({
        pay: '',
        peopleNo: ''
      })
    },
    addItem1 () {
      console.log("oghwir")
      this.editRuleForm.dynamicItem.push({
        pay: '',
        peopleNo: ''
      })
    },
    unique(array){
      return Array.from(new Set(array));
    },
    deleteItem (item, index) {
      this.addRuleForm.dynamicItem.splice(index, 1)
    },
    deleteItem1 (item, index) {
      this.editRuleForm.dynamicItem.splice(index, 1)
    },
    handleSave(){
      this.$refs.addRuleForm.validate(async (valid) => {
          if (valid) {
            let arr = []
            this.addRuleForm.dynamicItem.forEach(item => {
              arr.push(item.peopleNo)
            })
            arr.push(this.addRuleForm.peopleNo)
            if(this.unique(arr).length != this.addRuleForm.dynamicItem.length+1){
              this.$message.error("表单验证失败，房间床位数不能重复！")
            }else{
            console.log(this.addRuleForm)
             let arrobj = []
             arrobj = this.addRuleForm.dynamicItem.slice(0)
             arrobj.push({pay:this.addRuleForm.pay,peopleNo:this.addRuleForm.peopleNo})
              let addObj = {
                dormNo: this.addRuleForm.dormNo,
                floors: this.addRuleForm.floors,
                recharges:arrobj
              } 
              const {data:res} = await this.$axios.post('/addBuildings',addObj)
              console.log(res)
              if(res.errorCode ==200){
                this.$refs.addRuleForm.resetFields();
                this.dialogAddFormVisible = false
                this.$message.success('添加宿舍楼成功！')
                this.currentPage4 = 1
                this.query.currentPage = 1
                this.getBuildings()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error(res.errorMessage)
              }
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
            let arr = []
            this.editRuleForm.dynamicItem.forEach(item => {
              arr.push(item.peopleNo)
            })
            arr.push(this.editRuleForm.peopleNo)
            if(this.unique(arr).length != this.editRuleForm.dynamicItem.length+1){
              this.$message.error("表单验证失败，房间床位数不能重复！")
            }else{
            console.log(this.editRuleForm)
             let arrobj = []
             arrobj = this.editRuleForm.dynamicItem.slice(0)
             arrobj.push({pay:this.editRuleForm.pay,peopleNo:this.editRuleForm.peopleNo})
              let addObj = {
                dormNo: this.editRuleForm.dormNo,
                floors: this.editRuleForm.floors,
                recharges:arrobj
              } 
              const {data:res} = await this.$axios.post('/modifyBuildings',addObj)
              console.log(res)
              if(res.errorCode ==200){
                this.$refs.editRuleForm.resetFields();
                this.dialogEditFormVisible = false
                this.$message.success('修改宿舍楼成功！')
                this.getBuildings()
                sessionStorage.setItem("token",res.token)
              }else{
                this.$message.error(res.errorMessage)
              }
            }
          }else{
            this.$message.error("表单验证失败，请输入正确格式的表单数据！")
          }
      })
    },
    deleteOne(index,val){
      this.$confirm('此操作将永久删除该宿舍楼, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$axios.post("/deleteBuilding",{_id:val._id})
          console.log(res.errorCode)
          if(res.errorCode == "200"){
            this.query.currentPage = 1
            this.currentPage4 = 1
            this.getBuildings()
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
    }

  }
  
}

</script>

<style scoped lang="less">
.el-table{margin-top: 20px;}
.el-breadcrumb{margin-bottom: 30px;}
.el-card{box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
.el-pagination{margin-top: 20px;}
.inline{display: flex;}
.elAdd{display:block;margin:0 auto}
</style>
