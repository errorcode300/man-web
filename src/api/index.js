import request from '@/axios/request'

// 修改密码
function pwdEdit (params) {
  return request.post('changePwd', params)
}
// 注销登录
function logout (params) {
  return request.post('logout', params)
}

export default {
  pwdEdit,
  logout
}
