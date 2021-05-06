import Vue from 'vue'
import App from './App.vue'
import router from './router'

// createApp(App).mount('#app')
Vue.config.productionTip=false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
