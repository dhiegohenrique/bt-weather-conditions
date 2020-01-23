import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import { store } from './store/store'
import Toasted from 'vue-toasted'
import VueLodash from 'vue-lodash'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(Toasted, { singleton: true })
Vue.use(VueLodash)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
