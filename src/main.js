import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Toasted from 'vue-toasted'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(Toasted, { singleton: true })

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
