import Vue from 'vue'
import Router from 'vue-router'
// import store from '../vuex/index'
import login from '@/components/login'
import index from '@/components/index'
import home from '@/components/home'
import workPlat from '@/components/workPlat'
import baseInfo from '@/components/baseInfo'
import viewInfo from '@/components/viewInfo'
import clockInfo from '@/components/clockInfo'
import workInfo from '@/components/workInfo'
import clockInfoSel from '@/components/clockInfoSel'
import sysInfo from '@/components/sysInfo'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: '/man-web/',
  routes: [
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
        },
        {
          path: 'workPlat',
          name: 'workPlat',
          component: workPlat,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'baseInfo',
          name: 'baseInfo',
          component: baseInfo,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'viewInfo',
          name: 'viewInfo',
          component: viewInfo,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'clockInfo',
          name: 'clockInfo',
          component: clockInfo,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'workinfo',
          name: 'workInfo',
          component: workInfo,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'clockInfoSel',
          name: 'clockInfoSel',
          component: clockInfoSel,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'sysInfo',
          name: 'sysInfo',
          component: sysInfo,
          meta: {
            tabName: '工作信息管理',
            requiresAuth: true
          }
        }
      ]
    }
  ]
})

export default router
