import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Options from './components/options/Options.vue'
import OnlineOptions from './components/options/OnlineOptions.vue'
import AIGame from './components/AIGame.vue'
import OnlineGame from './components/OnlineGame.vue'
import NotFound from './components/NotFound.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Options },
    { path: '/ai', component: AIGame },
    { path: '/online', component: OnlineOptions },
    { path: '/online/game/:gameID', name: 'game', component: OnlineGame },
    { path: '*', component: NotFound  }
  ],
  mode: 'history'
})

Vue.prototype.innerWidth = window.innerWidth;

Vue.config.productionTip = false

export const bus = new Vue()

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
