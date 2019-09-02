import request from '@/utils/request'
import { getTree } from '@/api/dept'
const UpmsModule = process.env.LOGIN_MODULE

export function getDeptTree() {
  return request({
    url: UpmsModule + 'deptree',
    method: 'get',
    params: {}
  })
}

export function getSessionDeptTree() {
  if (sessionStorage.getItem('DeptTree')) {
    return JSON.parse(sessionStorage.getItem('DeptTree'))
  }
  return []
}
export function setSessionDeptTree() {
  request({
    url: UpmsModule + 'deptree',
    method: 'get',
    params: {}
  }).then((res) => {
    if (res.data && res.data.length > 0) {
      sessionStorage.setItem('DeptTree', JSON.stringify(res.data))
    }
  })
  return []
}

export function getDeptSelect(params) {
  return request({
    url: UpmsModule + 'department',
    method: 'get',
    params: params
  })
}

export function getSessionDeptSelect() {
  if (sessionStorage.getItem('DeptSelect')) {
    return JSON.parse(sessionStorage.getItem('DeptSelect'))
  }
  return []
}
export function setSessionDeptSelect() {
  request({
    url: UpmsModule + 'api/department',
    method: 'get',
    params: {}
  }).then((res) => {
    const arr = []
    if (res.data && res.data.length > 0) {
      const data = res.data
      for (let i = 0; i < data.length; i++) {
        const obj = data[i]
        arr.push({
          id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
          depCode: obj.dep_code, parentCode: obj.super_dep_code
        })
      }
      sessionStorage.setItem('DeptSelect', JSON.stringify(arr))
      sessionStorage.setItem('DeptTree', JSON.stringify(getTree(arr)))
    }
  })
  return []
}

export function getUsersByDep(depts) {
  return request({
    url: UpmsModule + 'api/userbydepcode',
    method: 'post',
    data: {
      depts: depts || []
    }
  })
}

export function getUsersByIds(ids) {
  return request({
    url: UpmsModule + 'api/userbydepcode',
    method: 'post',
    data: {
      ids: ids || []
    }
  })
}

export function getUserExt() {
  return request({
    url: UpmsModule + 'userext',
    method: 'get',
    params: {}
  })
}
