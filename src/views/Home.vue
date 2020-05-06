<template>
  <div class="home">
    <el-container class="home_content">
      <el-header>
        <p class="title">智见控股宿舍管理系统</p>
        <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!-- <el-row class="tac">
            <el-col :span="24">
              <el-menu
                background-color="#293846"
                text-color="#fff"
                :unique-opened="true"
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-house"></i>
                    <span>宿舍管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1">宿舍楼管理</el-menu-item>
                    <el-menu-item index="1-2">宿舍房间管理</el-menu-item>
                    <el-menu-item index="1-3">房间状态管理</el-menu-item>
                    <el-menu-item index="1-4">入住记录</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-lightning"></i>
                    <span>电费管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="2-1">月度房间用电量统计</el-menu-item>
                    <el-menu-item index="2-2">月度个人用电量统计</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-postcard"></i>
                    <span>房费管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="3-1">房型收费标准</el-menu-item>
                    <el-menu-item index="3-2">月度个人房租费用统计</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-user"></i>
                    <span>权限管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="4-1">修改密码</el-menu-item>
                    <el-menu-item index="4-2">权限管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
            
          </el-row> -->


          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                background-color="#293846"
                text-color="#fff"
                :unique-opened="true"
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :router="true"
                
                >
                <el-submenu :index="item.pageId+''" v-for="item in menuLists" :key="item.pageId">
                  <template slot="title">
                    <i :class="iconLists[item.pageId]"></i>
                    <span>{{item.pageName}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item :index="item1.path+''"  v-for="item1 in item.children" :key="item1.pageId">{{item1.pageName}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                
              </el-menu>
            </el-col>
            
          </el-row>






        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    
  },
  data(){
    return {
      menuLists:[],
      iconLists:{
        "101":"el-icon-house",
        "201":"el-icon-lightning",
        "301":"el-icon-postcard",
        "401":"el-icon-user"
      }
    }
  },
  methods:{
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
    handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    async getInfo(){
      const res =  await this.axios.post('/getMenuList')
      //console.log(res)
      if(res.data.errorCode == "200"){
        this.$message.success("请求菜单数据成功！")
        this.menuLists=res.data.data.pageRights
        if(!window.sessionStorage.getItem("token")){
            window.sessionStorage.setItem("token",res.data.token)
        }else{
          window.sessionStorage.setItem("token",res.data.token)
        }
      }else{
        this.$router.push("/login")
        this.$message.error("请求失败，请重新登录或者稍后请求！")
      }
    },
    loginOut(){
      sessionStorage.clear()
      this.$message.success("退出成功！")
      this.$router.push("/login")
    }
    
  },
  created(){
    this.getInfo()
  }
}
</script>
<style lang="css" scoped>
.home_content{height: 100vh;}
body{height: 100%;}
.home{height:100%;}
.el-header , .el-aside{background-color: #2f4050;}
.el-menu{border-right-width: 0;}
.el-submenu__title{border-bottom-color:#409EFF !important;}
.is-opened  .el-submenu__title{color:#409EFF !important;}
.title{color:white;font-weight: bold;}
.el-header{display: flex;justify-content: space-between;align-items: center;position:fixed;z-index: 1500;width: 100%;}
.el-aside{position:fixed;z-index: 1500;top: 60px;min-height: 100%;}
.el-button{height: 42px;}
.el-main{margin-left: 200px;margin-top: 60px;}
</style>
