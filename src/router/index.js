import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import home from '@/components/home'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: '/man-web/',
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index,
      redirect: '/index/home',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
          meta: {
            tabName: '首页',
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '*',
      name: '404',
      redirect: '/index/home'
    }
  ]
})
