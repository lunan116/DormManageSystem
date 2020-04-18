<template>
  <div class="home">
    <el-form   :model="loginForm" :rules="loginFormrules" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <el-card class="login_card">
            <img class="logo" src="../assets/logo.png" alt="">
            <el-form-item  label="用户名" prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input show-password v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item class="item__content">
                <el-button type="primary" @click="onSubmit">登录</el-button>
                <el-button type="warning" @click="reset(loginForm)">重置</el-button>
            </el-form-item>
        </el-card>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {
    
  },
  data(){
      return {
        loginForm: {
              username:'',
              password:''
        }, 
        loginFormrules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
  },
  methods:{
      reset(formName){
        this.$refs.loginForm.resetFields();
      },
     onSubmit(){
          this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
           const res = await  this.axios.get('/login',{params:this.loginForm})
           //console.log(res)
           if(res.data.errorCode == "200"){
               if(!window.sessionStorage.getItem("token")){
                   window.sessionStorage.setItem("token",res.data.token)
               }else{
                   window.sessionStorage.setItem("token",res.data.token)
               }
               
               this.$router.push({path:"/home"})
               return this.$message.success("登录成功")
           }
           this.$message.error("登录失败")
          } else {
              this.$message.error("登录失败")
            return false;
          }
        });
      }
  }
}
</script>

<style lang="css" scoped>
    .home{position: absolute;top:50%;left: 50%;-webkit-transform:translate(-50%,-60%);-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}
    .logo{width: 80px;position: absolute;top: -20%;z-index: 12000;left: 50%;margin-left: -50px;border-radius: 50%;padding: 10px;border: 1px solid rgba(0,0,0,.1);background: rgba(253,253,253,1);box-shadow: 0 1px 7px 0 rgba(0,0,0,.1);}
    .login_card[data-v-26084dc2] {width: 450px;padding-top: 50px;}
    .el-button+.el-button {margin-left: 40px;}
    .item__content{display: flex;justify-content: flex-end;}
</style>
