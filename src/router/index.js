import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    { path: '*', redirect: '/' }
  ]

  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}
