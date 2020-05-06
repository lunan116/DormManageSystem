<template>
    <div>
       <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
        <el-breadcrumb-item>房间状态管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格 -->
      <el-card>
        <el-select @change="handleChange" :popper-append-to-body="false" v-model="query.dormNo" clearable placeholder="请选择宿舍楼" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="handleChange1" :popper-append-to-body="false" v-model="query.roomStatus" clearable placeholder="请选择房间状态" popper-class="selectOption">
          <el-option
            v-for="item in selectDataList1"
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
                  :closable="false"
                  type="success"
                  :disable-transitions="false"
                  @close="handleClose(tag,scope.row._id)"
                  >
                  {{tag}}
                </el-tag>
                <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新的配置</el-button> -->
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
                icon="el-icon-warning-outline"
                size="mini"
                 type="primary"
                @click="moreInfo(scope.$index, scope.row)">入住详情</el-button>
              <el-button
                icon="el-icon-check"
                size="mini"
                type="danger"
                :disabled="scope.row.stayInPeopleList.length == scope.row.maxNo?true:false"  
                @click="addOne(scope.$index, scope.row)">入住登记</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出框 -->
        <el-dialog title="登记入住" :visible.sync="dialogAddFormVisible">
          <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="addRuleForm">
            <el-form-item label="姓名" prop="guestName">
              <el-input  v-model="addRuleForm.guestName"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="belongToCompany">
              <el-input  v-model="addRuleForm.belongToCompany"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNo">
              <el-input  v-model="addRuleForm.phoneNo" type="number"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="IDNo">
              <el-input  v-model="addRuleForm.IDNo"></el-input>
            </el-form-item>
            <!-- <el-form-item label="楼层号" prop="floorNo">
              <el-input  v-model="addRuleForm.floorNo"  type='number'></el-input>
            </el-form-item> -->
            <el-form-item label="电表读数" prop="startNo">
              <el-input  v-model="addRuleForm.startNo"  type='number'></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio v-model="addRuleForm.gender" label="male">男</el-radio>
              <el-radio v-model="addRuleForm.gender" label="female">女</el-radio>
            </el-form-item>
            <el-form-item label="职等" prop="rank">
              <el-select v-model="addRuleForm.rank" placeholder="请选择职等">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入住时间" prop="addTime">
              <el-date-picker
                v-model="addRuleForm.addTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="入住详情" customClass="customWidth" :visible.sync="dialogInfoFormVisible">
          <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="tableData1"
          border
          style="width: 100%">
            <el-table-column
            fixed
              header-align="center" 
              prop="guestName"
              label="姓名"
              min-width="100">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="gender"
              label="性别"
              min-width="50">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="belongToCompany"
              label="所在公司"
              min-width="100">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="IDNo"
              label="身份证号"
              min-width="190">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="rank"
              label="职等"
              min-width="80">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="phoneNo"
              label="联系方式"
              min-width="120">
            </el-table-column>
            <el-table-column
              header-align="center" 
              prop="startNo"
              label="起始度数"
              min-width="120">
            </el-table-column>
            <el-table-column
              header-align="center" 
              label="入住时间"
              min-width="180">
              <template slot-scope="scope">{{scope.row.startTime|formatDate}}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="300" header-align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit-outline"
                size="mini"
                 type="info"
                @click="editInfo(scope.$index, scope.row)">修改信息</el-button>
              <el-button
                icon="el-icon-document-checked"
                size="mini"
                type="warning" 
                @click="checkOut(scope.$index, scope.row)">退房登记</el-button>
            </template>
          </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogInfoFormVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="handleSave">保存</el-button> -->
          </div>
        </el-dialog>
        <el-dialog title="修改信息" :visible.sync="dialogEditFormVisible">
          <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px" class="editRuleForm">
            <el-form-item label="姓名" prop="guestName">
              <el-input  v-model="editRuleForm.guestName"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="belongToCompany">
              <el-input  v-model="editRuleForm.belongToCompany"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNo">
              <el-input  v-model="editRuleForm.phoneNo" type="number"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="IDNo">
              <el-input  v-model="editRuleForm.IDNo"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio v-model="editRuleForm.gender" label="male">男</el-radio>
              <el-radio v-model="editRuleForm.gender" label="female">女</el-radio>
            </el-form-item>
            <el-form-item label="职等" prop="rank">
              <el-select v-model="editRuleForm.rank" placeholder="请选择职等">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="退房登记" :visible.sync="dialogCheckOutFormVisible">
          <el-form :model="checkOutRuleForm" :rules="checkOutRules" ref="checkOutRuleForm" label-width="100px" class="checkOutRuleForm">
            <el-form-item label="姓名" prop="guestName">
              <el-input disabled="true" v-model="checkOutRuleForm.guestName"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="belongToCompany">
              <el-input disabled="true" v-model="checkOutRuleForm.belongToCompany"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNo">
              <el-input disabled="true" v-model="checkOutRuleForm.phoneNo" type="number"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="IDNo">
              <el-input disabled="true" v-model="checkOutRuleForm.IDNo"></el-input>
            </el-form-item>
            <el-form-item label="电表读数" prop="endNo">
              <el-input type="number" v-model="checkOutRuleForm.endNo"></el-input>
            </el-form-item>
            <el-form-item label="退房时间" prop="endTime">
              <el-date-picker
                v-model="checkOutRuleForm.endTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCheckOutFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCheckOut">保存</el-button>
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
        dormNo:"",
        roomStatus:""
      },
      currentPage4: 1,
      total:0,
      tableData:[],

      dialogAddFormVisible:false,
      addRuleForm: {
          _id:'',
          guestName: '',
          belongToCompany:'',
          phoneNo:'',
          IDNo:'',
          // floorNo: '',
          gender:'male',
          rank:'',
          addTime:'',
          startNo:''
          
      },
      addRules: {
          guestName: [
            { required: true, message: '请输入住客姓名', trigger: 'blur' }
          ],
          belongToCompany: [
            { required: true, message: '请输入住客所在公司', trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:11,min:11, message: '长度为 11 个字符', trigger: 'blur' }
          ],
          IDNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:18,min:18, message: '长度为 18 个字符', trigger: 'blur' }
          ],
          // floorNo: [
          //   { required: true, message: '请输入楼层号', trigger: 'blur' },
          //   { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
          // ],
          startNo: [
            { required: true, message: '请输入电表起始读数', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请输入职等', trigger: 'blur' }
          ],
          addTime: [
            { required: true, message: '请输入入住时间', trigger: 'blur' }
          ],
      },

      dialogEditFormVisible:false,
      editRuleForm: {
          _id:'',
          guestName: '',
          belongToCompany:'',
          phoneNo:'',
          IDNo:'',
          gender:'male',
          rank:'',
          roomId:'',
      },
      editRules: {
          guestName: [
            { required: true, message: '请输入住客姓名', trigger: 'blur' }
          ],
          belongToCompany: [
            { required: true, message: '请输入住客所在公司', trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:11,min:11, message: '长度为 11 个字符', trigger: 'blur' }
          ],
          IDNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:18,min:18, message: '长度为 18 个字符', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请输入职等', trigger: 'blur' }
          ],
      },

      dialogCheckOutFormVisible:false,
      checkOutRuleForm: {
          _id:'',
          guestName: '',
          belongToCompany:'',
          phoneNo:'',
          IDNo:'',
          endNo:'',
          endTime:'',
          roomId:'',
      },
      checkOutRules: {
          guestName: [
            { required: true, message: '请输入住客姓名', trigger: 'blur' }
          ],
          belongToCompany: [
            { required: true, message: '请输入住客所在公司', trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:11,min:11, message: '长度为 11 个字符', trigger: 'blur' }
          ],
          IDNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max:18,min:18, message: '长度为 18 个字符', trigger: 'blur' }
          ],
          endNo: [
            { required: true, message: '请输入最新的电表读数', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请输入退房时间', trigger: 'blur' }
          ],
      },

      dialogInfoFormVisible:false,
      tableData1:[],

      options: [{
          value: '一职等',
          label: '一职等'
        },{
          value: '二职等',
          label: '二职等'
        },{
          value: '三职等',
          label: '三职等'
        },{
          value: '四职等',
          label: '四职等'
        },{
          value: '五职等',
          label: '五职等'
        },{
          value: '六职等',
          label: '六职等'
        }],


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
          label: '空房'
        },{
            value: '1',
            label: '半满'
        },{
            value: '2',
            label: '满客'
        }],
    }
  },
  created(){
    this.getDataLists()
    this.getBuildings()
  },
  computed:{
    
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
            console.log(this.addRuleForm)
            const {data:res} = await this.$axios.post("/addDormGuest",this.addRuleForm)
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
    handleChange1(){
      this.getDataLists()
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
    moreInfo(index,val){
      console.log('dofheio')
      this.dialogInfoFormVisible = true

      this.tableData1 = val.stayInPeopleList.slice(0)
      this.tableData1.forEach(item=>{
        item.gender = ((item.gender == 'male' || item.gender == '男')?'男':'女')
      })
    },
    addOne(index,val){
      this.dialogAddFormVisible = true
      this.addRuleForm._id = val._id
    },
    editInfo(index,val){
      console.log(val)
      this.dialogEditFormVisible = true
      this.editRuleForm.guestName = val.guestName
      this.editRuleForm.belongToCompany = val.belongToCompany
      this.editRuleForm.phoneNo = val.phoneNo
      this.editRuleForm.IDNo = val.IDNo
      console.log(val.gender)
      this.editRuleForm.gender = ((val.gender=="男"||val.gender== "male")?'male':'female')
      this.editRuleForm.rank = val.rank
      this.editRuleForm._id = val._id
      this.tableData.forEach(item=>{
        item.stayInPeopleList.forEach(item1=>{
          if(item1.IDNo == val.IDNo){
            this.editRuleForm.roomId = item._id
          }
        })
      })
    },
    handleEdit(){
      this.$refs.editRuleForm.validate(async (valid) => {
          if (valid) {
            console.log(this.editRuleForm)
            const {data:res} = await this.$axios.post("/modifyDormGuest",this.editRuleForm)
            console.log(res)
            if(res.errorCode ==200){
                this.$refs.editRuleForm.resetFields();
                this.dialogEditFormVisible = false
                this.dialogInfoFormVisible = false
                this.$message.success('修改住客信息成功！')
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
    checkOut(index,val){
      this.dialogCheckOutFormVisible = true
      this.checkOutRuleForm.guestName = val.guestName
      this.checkOutRuleForm.belongToCompany = val.belongToCompany
      this.checkOutRuleForm.phoneNo = val.phoneNo
      this.checkOutRuleForm.IDNo = val.IDNo
    },
    handleCheckOut(){
      this.$refs.checkOutRuleForm.validate(async (valid) => {
          if (valid) {
            console.log(this.checkOutRuleForm)
            const {data:res} = await this.$axios.post("/checkOut",this.checkOutRuleForm)
            console.log(res)
            if(res.errorCode ==200){
                this.dialogCheckOutFormVisible = false
                this.dialogInfoFormVisible = false
                this.$message.success('退房登记成功！')
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
.customWidth{width:80% !important;}
</style>
