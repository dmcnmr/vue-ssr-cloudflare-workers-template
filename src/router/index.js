import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Vue from 'vue'

Vue.use(VueRouter)

export const createRouter = () => {
  const routes = [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/about',
      name: 'about',
      component: About
    },
    { path: '*', redirect: '/' }
  ]

  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}
