import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'

Vue.use(Vuex)
const state = {
  userInfo: null,
  orgList: null,
  selectedOrg: null,
  isCollapse: true,
  tabList: [ // 标签栏
    {
      name: 'home',
      tabName: '首页',
      path: '/index/home'
    }
  ],
  currentPage: { // 当前页面
    name: 'home',
    tabName: '首页',
    path: '/index/home'
  },
  closingPage: ''
}
const mutations = {
  getUserInfo: function (state) { // 获取用户信息
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    state.userInfo = userInfo
  },
  getOrgList: function (state) { // 获取机构列表
    let orgList = JSON.parse(sessionStorage.getItem('orgList'))
    state.orgList = orgList
  },
  getSelectedOrg: function (state) { // 获取默认机构
    let selectedOrg = JSON.parse(sessionStorage.getItem('selectedOrg'))
    state.selectedOrg = selectedOrg
  },
  // setSelectedOrg: function (state, selectedOrg) { // 更新默认机构
  //   state.selectedOrg = selectedOrg
  // },
  LOGOUT: function () { // 注销登录，删除本地token，携url跳转登录页面
    localStorage.removeItem('_token')
    if (router.currentRoute.fullPath !== '/index/home') {
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
    } else {
      router.replace({
        path: '/login'
      })
    }
  },
  // 左侧菜单展开关闭
  handleChange: function (state) {
    state.isCollapse = !state.isCollapse
  },
  // 多tab页
  tabRemove: function (state, name) {
    // 关闭标签
    let tabIndex = state.tabList.findIndex(s => s.name === name)
    if (tabIndex > -1) {
      // 清理 keep alive
      state.closingPage = state.tabList[tabIndex].name
      state.tabList.splice(tabIndex, 1)
    }
    if (name === state.currentPage.name) {
      // // 切换高亮标签
      // let tabIndex = state.tabList.findIndex(s => s.name === name)
      // state.currentPage = (tabIndex !== state.tabList.length - 1) ? state.tabList[tabIndex + 1] : state.tabList[tabIndex - 1]
      // router.push(state.currentPage.path) // 跳转新页面
      // 是当前页，返回上一页
      router.back()
    }
  },
  tabRoute (state, route) {
    let tabIndex = state.tabList.findIndex(s => s.name === route.to.name)
    if (tabIndex > -1) {
      // 标签已存在
      state.currentPage = state.tabList[tabIndex]
    } else {
      // 标签不存在，现在新建
      state.tabList.push(route.to)
      state.currentPage = route.to
    }
    state.closingPage = ''
  }
}
const actions = {
  tabRemove ({commit}, params) {
    commit('tabRemove', params)
  },
  tabRoute ({commit}, params) {
    commit('tabRoute', params)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})
