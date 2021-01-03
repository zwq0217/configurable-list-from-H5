import HttpRequest from './ajax'

// post 请求
export const get = (url, params, showLoading = false) => {
  return new Promise((resolve, reject) => {
    HttpRequest.request({
      url: url,
      method: 'GET',
      data: params,
      contentType: 'application/json; charset=utf-8'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const post = (url, data, showLoading = false) => {
  return new Promise((resolve, reject) => {
    HttpRequest.request({
      showLoading,
      url: url,
      method: 'POST',
      data: data,
      contentType: 'application/json; charset=utf-8'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getBlob = (url, params) => {
  return new Promise((resolve, reject) => {
    HttpRequest.request({
      url: url,
      method: 'GET',
      data: params,
      contentType: 'application/json; charset=utf-8',
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getPostBlob = (url, params) => {
  return new Promise((resolve, reject) => {
    HttpRequest.request({
      url: url,
      method: 'POST',
      data: params,
      contentType: 'application/json; charset=utf-8',
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getArrayBuffer = (url, params) => {
  return new Promise((resolve, reject) => {
    HttpRequest.request({
      url: url,
      method: 'get',
      data: params,
      contentType: 'application/json; charset=utf-8',
      responseType: 'arraybuffer'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
