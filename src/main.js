import Vue from 'vue'
import App from './App'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  // debug: true,
  connection: 'https://salty-waters-87382.herokuapp.com',
}))

new Vue({
  render: h => h(App)
}).$mount('#app')
