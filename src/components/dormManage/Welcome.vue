<template>
  
    <div class="welcome">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置:首页</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card class="el-card1">
        <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>总房间数</p>
             <el-tag
             type="success"
                effect="dark">
                今天
              </el-tag>
          </div>
          <div  class="text item">
            {{tdata.all}}
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>空房间数</p>
             <el-tag
              type="danger"
                effect="dark">
                今天
              </el-tag>
          </div>
          <div class="text item">
            {{tdata.empty}}
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>床位数量</p>
             <el-tag
                type="warming"
                effect="dark">
                今天
              </el-tag>
          </div>
          <div  class="text item">
            {{tdata.chuangwei}}
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>在住人数</p>
             <el-tag
             type="info"
                effect="dark">
                今天
              </el-tag>
          </div>
          <div class="text item">
            {{tdata.stayInPeopleNum }}
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
      </el-row>
        
        <el-row :gutter="20" class="tableRow">
          <el-col :span="12">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>每月在住人数变化</p>
            <el-select v-model="query1.date" @change="changeVal(query1)" placeholder="请选择时间点">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div  class="text item">
            <div id="myChart2" :style="{width: '100%', height: '300px'}"></div>
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        <el-col :span="12">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>每月房间数量变化</p>
            <el-select v-model="query2.date" @change="changeVal(query2)" placeholder="请选择时间点">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div  class="text item">
            <div id="myChart3" :style="{width: '100%', height: '300px'}"></div>
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <el-row :gutter="20" class="tableRow">
          <el-col :span="12">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>每月新增入住与退房人数变化</p>
            <el-select v-model="query3.date" @change="changeVal(query3)" placeholder="请选择时间点">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div  class="text item">
            <div id="myChart4" :style="{width: '100%', height: '300px'}"></div>
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        <el-col :span="12">
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>每月房间房间入住率</p>
            <el-select v-model="query4.date" @change="changeVal(query4)" placeholder="请选择时间点">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div  class="text item">
            <div id="myChart5" :style="{width: '100%', height: '300px'}"></div>
          </div>
        </el-card>
        <div class="grid-content bg-purple"></div></el-col>
        </el-row>
        
      </el-card>
      
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'hello',
  data () {
    return {
      tdata:{},
      hdata:{},
      msg: 'Welcome to Your Vue.js App',
      query1:{
        date:"3",
        type:"peopleNumbers"
      },
      query2:{
        date:"3",
        type:"roomNumbers"
      },
      query3:{
        date:"3",
        type:"newPeopleNum"
      },
      query4:{
        date:"3",
        type:"occupancyRate"
      },
      options: [{
          value: '3',
          label: '近三个月'
        }, {
          value: '6',
          label: '近六个月'
        }, {
          value: '12',
          label: '近一年'
        }, {
          value: '36',
          label: '近三年'
        }],
    }
  },
  mounted(){
    this.drawLine();
    this.getDataViews(this.query1)
    this.getDataViews(this.query2)
    this.getDataViews(this.query3)
    this.getDataViews(this.query4)
  },
  created(){
    //this.getDataViews()
  },
  methods: {
    async drawLine(){
        const {data:res} = await this.$axios.get('/getDatas')
          if(res.errorCode == 200){
            this.$message.success('获取数据成功！')
              sessionStorage.setItem("token",res.token)
              this.tdata = res.data
              
          }else{
            this.$message.error(res.errorMessage)
          }
        
        //console.log(this.tdata.table.time.length)
        
        
    },
    changeVal(query){
      this.getDataViews(query)
    },
    async getDataViews(query){
     const {data:res} = await this.$axios.get('/getDataViews',{params: query})
     if(res.errorCode == 200){
       this.$message.success('获取数据成功！')
        sessionStorage.setItem("token",res.token)
        if(query.type == "peopleNumbers"){
          // 基于准备好的dom，初始化echarts实例
          let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
          var lineoption = {
                                title : {
                                    text: ''
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['在住人数']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : res.data.month
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} 人'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'在住人数',
                                        type:'line',
                                        data:res.data.arr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
              };
              myChart2.setOption(lineoption);
            }else if(query.type == "roomNumbers"){
              let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        
              var lineOption1 = {
                tooltip: {},
                xAxis: {
                    data: res.data.month
                },
                yAxis: {
                          type : 'value',
                          axisLabel : {
                          formatter: '{value} 间'
                          }
                        },
                series: [{
                    name: '房间数',
                    type: 'bar',
                    data: res.data.arr
                }]
              }
              myChart3.setOption(lineOption1)
            }else if(query.type == "newPeopleNum"){
          // 基于准备好的dom，初始化echarts实例
          let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
          var lineoption = {
                                title : {
                                    text: ''
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['新增人数','退房人数']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : res.data.month
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} 人'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'新增人数',
                                        type:'line',
                                        data:res.data.arr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    },
                                    {
                                        name:'退房人数',
                                        type:'line',
                                        data:res.data.arr1,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
              };
              myChart4.setOption(lineoption);
            }else if(query.type == "occupancyRate"){
          // 基于准备好的dom，初始化echarts实例
          let myChart5 = this.$echarts.init(document.getElementById('myChart5'))
          var lineoption = {
                                title : {
                                    text: ''
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['入住率']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : res.data.month
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} %'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'入住率',
                                        type:'line',
                                        data:res.data.arr.map(item=>{return Number(item)*100}),
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
              };
              myChart5.setOption(lineoption);
            }
        
     }else{
       this.$message.error(res.errorMessage)
     }
    }
  }
}

</script>

<style scoped lang="less">
.text {
    font-size: 42px;
    margin-bottom: 0px;
  }

  .clearfix{
    p{margin:0px;font-size: 16px;}
    display:flex;
    line-height: 40px;
    justify-content: space-between;
  }
  .tableRow{margin-top: 20px;}
  .box-card {
    width: 480px;
  }
  .el-card{
    width:100%;
  }
  .el-card1{
    padding:10px;
  }
  .welcome{padding:10px;}
  .el-breadcrumb{margin-bottom: 20px;}
  .el-tag{line-height: 18px !important;height: 18px !important;}
</style>
