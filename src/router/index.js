import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import login from '../views/Login.vue'
import element from 'element-ui'
import buildingManage from '../components/dormManage/BuildingManage.vue'
import welcome from '../components/dormManage/Welcome.vue'
import checkRecords from '../components/dormManage/checkRecords.vue'
import dormsStatus from '../components/dormManage/dormsStatus.vue'
import dormsManage from '../components/dormManage/dormsManage.vue'
import MonthlyPeopleUsedNo from '../components/usedNoManage/MonthlyPeopleUsedNo.vue'
import MonthlyRoomUsedNo from '../components/usedNoManage/MonthlyRoomUsedNo.vue'
import MonthlyPeopleRoomFee from '../components/roomFeeManage/MonthlyPeopleRoomFee.vue'
import roomCharges from '../components/roomFeeManage/roomCharges.vue'
import rightsManage from '../components/rightsManage/rightsManage.vue'
import modifyPassword from '../components/rightsManage/modifyPassword.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/home',
    redirect:'/welcome',
    component: Home,
    children:[
      //宿舍管理
      {path:'/welcome',component:welcome},
      {path:'/buildingManage',component:buildingManage},
      {path:'/dormsManage',component:dormsManage},
      {path:'/dormsStatus',component:dormsStatus},
      {path:'/checkRecords',component:checkRecords},
      //电费管理
      {path:'/getMonthlyPeopleUsedNo',component:MonthlyPeopleUsedNo},
      {path:'/getMonthlyRoomUsedNo',component:MonthlyRoomUsedNo},
      //房费管理
      {path:'/getMonthlyPeopleRoomFee',component:MonthlyPeopleRoomFee},
      {path:'/roomCharges',component:roomCharges},
      //权限管理
      {path:'/rightsManage',component:rightsManage},
      {path:'/modifyPassword',component:modifyPassword}
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
]

const router = new VueRouter({
  routes
})
//element.$message.error("未登录！")
// element.Message({
//   title: '警告回',
//   message: '网页还没下载完毕，请稍等一答下再操作',
//   type: 'warning'
// })
//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
          next()//不要在next里面加"path:/",会陷入死循环
  }else {
    if(!window.sessionStorage.getItem("token")){
      //this.$message.error("未登录！")
      element.Message({
        title: '警告回',
        message: '还未登录，请先登录！',
        type: 'warning'
      })
      next({
        path: '/login',
        query: {redirect: to.fullPath}//将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }else if(window.sessionStorage.getItem("token") == ""){
      //this.$message.error("未登录！")
      next({
        path: '/login',
        query: {redirect: to.fullPath}//将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }else{
      //this.$message.error("未登录！")
      
      next()
      
    }
  }
  
})


export default router
