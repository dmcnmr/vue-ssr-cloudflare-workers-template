import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp() {
  Vue.config.productionTip = false

  const router = createRouter()

  const app = new Vue({
    router,
    // the root instance simply renders the App component.
    render: h => h(App)
  })

  return { app, router }
}
