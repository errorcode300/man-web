import request from '@/axios/request'
// 登录
function login (params) {
  return request.get('logon', params)
}
// 获得平台名称
function getLogicInfo () {
  return request.postOneParam('getLogicInfo')
}
// test
function test (params) {
  return request.post('/work/require/getCfg', params)
}

export default{
  login,
  getLogicInfo,
  test
}
