<template>

    <div>
      <!-- //面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容展示 -->
      <el-card>
        <el-form   :model="modifyForm" :rules="modifyFormrules" ref="modifyForm" label-width="100px" class="modifyForm">
            <el-card class="modify_card">
                <!-- <el-form-item  label="用户名" prop="username">
                    <el-input v-model="modifyForm.username"></el-input>
                </el-form-item> -->
                <p>修改密码</p>
                <el-form-item label="新密码" prop="password">
                    <el-input show-password v-model="modifyForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="refferpassword">
                    <el-input show-password v-model="modifyForm.refferpassword"></el-input>
                </el-form-item>
                <el-form-item class="item__content">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button type="warning" @click="reset(modifyForm)">重置</el-button>
                </el-form-item>
            </el-card>
        </el-form>
      </el-card>
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
export default {
  data(){
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.modifyForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        modifyForm: {
              //username:'',
              password:'',
              refferpassword:''
        }, 
        modifyFormrules: {
          // username: [
          //   { required: true, message: '请输入用户名', trigger: 'blur' },
          //   { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          // ],
          password: [
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          refferpassword: [
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
             { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
  },
  methods:{
      reset(formName){
        this.$refs.modifyForm.resetFields();
      },
     onSubmit(){
          this.$refs.modifyForm.validate(async (valid) => {
          if (valid) {
          
           const res = await  this.axios.post('/modifyPassword',this.modifyForm)
           //console.log(res)
           if(res.data.errorCode == "200"){
               if(!window.sessionStorage.getItem("token")){
                   window.sessionStorage.setItem("token",res.data.token)
               }else{
                   window.sessionStorage.setItem("token",res.data.token)
               }
               this.$message.success('修改密码成功！')
           }else{
               this.$message.error(res.data.errorMessage)
               this.$message.error("修改密码失败！")
           }
          } else {
              this.$message.error("验证失败")
            return false;
          }
        });
      }
  }
  
}

</script>

<style scoped lang="less">
.el-breadcrumb{margin-bottom: 30px;}
.el-card{box-shadow: 0px 1px 1px rgba(0, 0, 0, .15);}
.modifyForm{max-width: 500px;margin:20px auto;text-align: center;
  p{margin:20px 0px;}
}
</style>
