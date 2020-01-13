// 引入axios
import axios from 'axios'

// 创建axios实例:httpService
const httpService = axios.create({
  baseURL: 'http://10.240.88.106:12104/man-web/',
  // 请求超时时间
  timeout: 900000
})

/* 网络请求部分 */
/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'get',
      params: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post (url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/*
 *  post请求
 *  url:请求地址
 *  无参接口
 * */
export function postOneParam (url) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url + '?d=' + new Date(),
      method: 'post'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload (url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function fileDownload (url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params,
      responseType: 'blob'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  get,
  post,
  postOneParam,
  httpService,
  fileUpload,
  fileDownload
}
