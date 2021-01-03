import { post } from '../utils/axios/index'

export const httpDeleteListById = (params) => {
  const result = post('http://localhost:8099/comListDel/byId', params)
  return result
}

export const insertRequestFn = (params) => {
  const result = post('http://localhost:8099/comListDel/insertItem', params)
  return result
}
export const changeRequestFn = (params) => {
  const result = post('http://localhost:8099/comListDel/updataItem', params)
  return result
}
