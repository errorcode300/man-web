import Vue from 'vue'
import Router from 'vue-router'
// import store from '../vuex/index'
import login from '@/components/login'
import index from '@/components/index'
import home from '@/pages/home'
import workPlat from '@/pages/workPlat'
import baseInfo from '@/pages/baseInfo'
import viewInfo from '@/pages/viewInfo'
import clockInfo from '@/pages/clockInfo'
import workInfo from '@/pages/workInfo'
import workingProcess from '@/pages/workInfo/workingProcess'
import requireInfo from '@/pages/workInfo/requireInfo'
import prodProblem from '@/pages/workInfo/prodProblem'
import workRecore from '@/pages/workInfo/workRecore'
import clockInfoSel from '@/pages/clockInfoSel'
import sysInfo from '@/pages/sysInfo'

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
          path: 'workingProcess',
          name: 'workingProcess',
          component: workingProcess,
          meta: {
            tabName: '工作流程管理',
            requiresAuth: true
          }
        },
        {
          path: 'requireInfo',
          name: 'requireInfo',
          component: requireInfo,
          meta: {
            tabName: '需求信息管理',
            requiresAuth: true
          }
        },
        {
          path: 'prodProblem',
          name: 'prodProblem',
          component: prodProblem,
          meta: {
            tabName: '生产问题管理',
            requiresAuth: true
          }
        },
        {
          path: 'workRecore',
          name: 'workRecore',
          component: workRecore,
          meta: {
            tabName: '工作记录管理',
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
