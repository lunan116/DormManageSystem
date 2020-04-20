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
        <el-button type="primary" @click="dialogAddFormVisible = true">添加管理员</el-button>
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="managerList"
          border
          style="width: 100%">
          <el-table-column
            header-align="center" 
            prop="_id"
            label="#"
            width="220"
            min-width="20%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="manageName"
            label="姓名"
            min-width="12%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="belongToCompany"
            label="所在公司"
            min-width="12%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="phoneNo"
            label="联系方式"
            min-width="16%">
          </el-table-column>
          <el-table-column
            header-align="center" 
            prop="password"
            label="密码"
            min-width="10%">
          </el-table-column>
          <el-table-column label="操作" min-width="30%" header-align="center" >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                size="mini"
                 type="primary"
                @click="editManage(scope.$index, scope.row)">编辑</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="deleteManage(scope.$index, scope.row)">删除</el-button>
              <el-button
                icon="el-icon-setting"
                size="mini"
                type="success"
                @click="setRights(scope.$index, scope.row)">设置权限</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 模态框 -->
        <el-dialog title="添加管理员" :visible.sync="dialogAddFormVisible">
          <el-form :model="addManagerRuleForm" :rules="addManagerRules" ref="addManagerRuleForm" label-width="100px" class="addManagerRuleForm">
            <el-form-item label="管理员姓名" prop="username">
              <el-input v-model="addManagerRuleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="初始密码" prop="password">
              <el-input v-model="addManagerRuleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNo">
              <el-input v-model="addManagerRuleForm.phoneNo"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="belongToCompany">
              <el-input v-model="addManagerRuleForm.belongToCompany"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑管理员" :visible.sync="dialogEditFormVisible">
          <el-form :model="editManagerRuleForm" :rules="editManagerRules" ref="editManagerRuleForm" label-width="100px" class="editManagerRuleForm">
            <el-form-item label="管理员姓名" prop="username">
              <el-input :disabled="true" v-model="editManagerRuleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="初始密码" prop="password">
              <el-input v-model="editManagerRuleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNo">
              <el-input v-model="editManagerRuleForm.phoneNo"></el-input>
            </el-form-item>
            <el-form-item label="所在公司" prop="belongToCompany">
              <el-input v-model="editManagerRuleForm.belongToCompany"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit">修 改</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑权限" :visible.sync="dialogRightsFormVisible">
          <el-tree
            :data="rightsList"
            :show-checkbox="true"
            default-expand-all
            node-key="pageId"
            ref="pageRightsTree"
            highlight-current
            :props="pageRightsProps">
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRightsFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditRights">修 改</el-button>
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
  data(){
    return {
      managerList:[],
      rightsList:[],
      pageRightsProps:{
        label:'pageName',
        children:'children',
        disabled:true
      },
      dialogRightsFormVisible:false,
      rightsActiveDialogId:'',

      dialogAddFormVisible: false,
      addManagerRuleForm: {
          username: '',
          password: '',
          phoneNo: '',
          belongToCompany: ''
      },
      addManagerRules: {
          username: [
            { required: true, message: '请输入管理员姓名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入初始密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
          ],
          belongToCompany: [
            { required: true, message: '请输入所在公司', trigger: 'blur' }
          ]
      },

      dialogEditFormVisible: false,
      editManagerRuleForm: {
          username: '',
          password: '',
          phoneNo: '',
          belongToCompany: ''
      },
      editManagerRules: {
          username: [
            { required: true, message: '请输入管理员姓名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入初始密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
          ],
          belongToCompany: [
            { required: true, message: '请输入所在公司', trigger: 'blur' }
          ]
      },

      query:{
        pageSize:10,
        currentPage:1
      },
      currentPage4: 1,
      total:0
    }
  },
  methods:{
    async getManagerList(){
      const res = await this.$axios.get('/getManagerList',{params:this.query})
      console.log(res)
      if(res.data.errorCode == "200"){
        //console.log(res.data.data)
        this.managerList = res.data.data.managerList
        this.total = res.data.data.total
        window.sessionStorage.setItem("token",res.data.token)
      }else{
        console.log(res.data.errorMessage)
        this.$message.error(res.data.errorMessage)
      }
    },
    handleSave(){
      this.$refs.addManagerRuleForm.validate(async (valid) => {
          if (valid) {
            //alert('submit!');
            const res = await this.$axios.post('/addManager',this.addManagerRuleForm)
            console.log(res)
            if(res.data.errorCode == "200"){
              this.$refs.addManagerRuleForm.resetFields();
              this.$message.success('添加成功！')
              window.sessionStorage.setItem("token",res.data.token)
              this.getManagerList()
              this.dialogAddFormVisible = false
            }else{
              this.$message.error(res.data.errorMessage)
            }
          } else {
            console.log('请输入正确格式的数据！');
            return false;
          }
        });
    },
    handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.getManagerList()
        //console.log(this.query)
    },
    handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.query.currentPage = val
        this.getManagerList()
        //console.log(this.query)
    },
    deleteManage(index,val){
      this.openMessageBox(index,val)
      //console.log(index+val._id)
    },
    editManage(index,val){
      this.dialogEditFormVisible = true
      this.editManagerRuleForm.username = val.manageName
      this.editManagerRuleForm.password = val.password
      this.editManagerRuleForm.phoneNo = val.phoneNo
      this.editManagerRuleForm.belongToCompany = val.belongToCompany
    },
    handleEdit(){
      this.$refs.editManagerRuleForm.validate(async (valid) => {
          if (valid) {
            //alert('submit!');
            const res = await this.$axios.post('/editManager',this.editManagerRuleForm)
            console.log(res)
            if(res.data.errorCode == "200"){
              //this.$refs.addManagerRuleForm.resetFields();
              this.$message.success('修改成功！')
              window.sessionStorage.setItem("token",res.data.token)
              this.getManagerList()
              this.dialogEditFormVisible = false
            }else{
              this.$message.error(res.data.errorMessage)
            }
          } else {
            console.log('请输入正确格式的数据！');
            return false;
          }
        });
    },
    openMessageBox(index,val) {
        this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$axios.post("/deleteManager",{_id:val._id})
          console.log(res)
          if(res.data.errorCode == "200"){
            this.query.currentPage = 1
            this.getManagerList()
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            window.sessionStorage.setItem("token",res.data.token)
          }else{
            this.$message({
                type: 'error',
                message: res.data.errorMessage
            });
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    setRights(index,val){
        this.rightsActiveDialogId = val._id
        this.rightsList = val.pageRightsList
        //this.$refs.pageRightsTree.setCheckedKeys([101]);
        var showArr = []
        this.rightsList.forEach(item=>{
          if(item.isShow == "true"){
            //showArr.push(item.pageId)
            item.children.forEach(item1=>{
              if(item1.isShow == "true"){
                showArr.push(item1.pageId)
              }
            })
          }
        })
        console.log("showArr:"+showArr)
        this.$nextTick(() => {
          this.$refs.pageRightsTree.setCheckedKeys(showArr) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
        })
        this.dialogRightsFormVisible = true
    },
    async handleEditRights(){
        let checkedArr = []
        // this.$nextTick(() => {
        //   checkedArr = this.$refs.pageRightsTree.getCheckedKeys() // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
        // })
        
        checkedArr = this.$refs.pageRightsTree.getCheckedKeys()
        console.log(checkedArr)
        let _this = this

        
          this.rightsList.forEach((item1,index)=>{
            let showmsg = false
           
            item1.children.forEach(item2=>{
              //console.log(showmsg)
              if(showmsg == true){
                item1.isShow = "true"
              }
              //console.log("index:"+index+"   "+"item1.isShow:"+item1.isShow)
              let showmsg1 = false
              checkedArr.forEach(item=>{
              //console.log("item:"+item+"   "+"item2.pageId:"+item2.pageId)
              if(item == item2.pageId){
                item2.isShow = "true"
                showmsg1 = true
                showmsg = true
              }else{
                if(showmsg1 == true){
                  item2.isShow = "true"
                }else{
                  item2.isShow = "false"
                }
              }
            })
          })
        })

        //console.log(this.rightsList)
        const {data:res} = await this.$axios.post('/editRights',{_id:this.rightsActiveDialogId,pageRightsList:this.rightsList})
        //console.log(res)
        if(res.errorCode == "200"){
          this.$message.success('修改成功！')
          window.sessionStorage.setItem("token",res.token)
          this.getManagerList()
          this.dialogRightsFormVisible = false
        }else{
          this.$message.error(res.errorMessage)
        }

    }
      
  },
  created(){
    this.getManagerList()
  }
  
}

</script>

<style scoped lang="less">
.el-table{margin-top: 20px;}
.el-breadcrumb{margin-bottom: 30px;}
.el-card{box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
.el-pagination{margin-top: 20px;}
</style>
