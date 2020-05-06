import Vue from 'vue'
import './plugins/element.js'
import App from './App.vue'
import router from './router'

import './plugins/axios'
// main.js
import filter from './plugins/filters'
for (let key in filter){  //一定要放在 new Vue之前
  Vue.filter(key, filter[key])
}

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
