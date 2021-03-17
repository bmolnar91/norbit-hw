import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'
import store from './store/index'

const socket = io(
  `ws://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/`
)

Vue.config.productionTip = false

Vue.use(VueSocketIOExt, socket, { store })

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
