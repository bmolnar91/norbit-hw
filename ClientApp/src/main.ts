// import { createApp } from 'vue'
// import App from './App.vue'
// import store from './store'
// import VueSocketIOExt from 'vue-socket.io-extended'
// import { io } from 'socket.io-client'
//
// const socket = io(process.env.VUE_APP_SERVER_DOMAIN)
//
// createApp(App).use(VueSocketIOExt, socket, { store }).mount('#app')
// // createApp(App).use(store).mount('#app')

import Vue from "vue";
import "./plugins/vueSocketIo";
import App from "./App.vue";
import store from "./store";
import Vuetify from "vuetify";
import { Ripple } from "vuetify/lib/directives";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.min.css";
import "vuetify/dist/vuetify.min.css";
const vueTouch = require( "vue-touch" );
Vue.use( vueTouch, { name: "v-touch" });
new Vue({
  store,
  i18n,
  render: h => h( App ),
  vuetify: new Vuetify({
    iconfont: "md",
    directives: {
      Ripple
    }
  })
}).$mount( "#app" )
