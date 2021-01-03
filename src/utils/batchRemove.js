const requestApi = (require, id) => {
  return new Promise((resolve, reject) => {
    require(id).then((res) => {
      if (res.stateCode === 200 && res.result) {
        resolve(res)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(false)
      }
    }, err => {
      reject(err)
    })
  })
}
// list 选择的数据 requireApi 接口 deleteKey 删除的key 默认 id apiType 接口类型
export const deleteList = (list, requireApi, successCallback, errCallback, deleteKey, apiType) => {
  const allPromise = []
  const key = deleteKey || 'id'
  const formData = new FormData()
  list.forEach((item, index) => {
    if (apiType === 'formData') {
      formData.append(deleteKey, item[key])
    } else {
      allPromise.push(requestApi(requireApi, item[key]))
    }
  })
  if (apiType === 'formData') {
    allPromise.push(requestApi(requireApi, formData))
  }
  return Promise.all(allPromise).then(res => {
    successCallback && successCallback()
  }).catch(() => {
    errCallback && errCallback()
  })
}
