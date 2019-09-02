import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getSpecialmodePage(para) {
  return request({
    url: ModuleName + 'page/specialmode',
    method: 'get',
    params: para
  })
}

// 查询
export function getSpecialmodeList(para) {
  return request({
    url: ModuleName + 'specialmode',
    method: 'get',
    params: para
  })
}

// 删除
export function delSpecialmode(para) {
  return request({
    url: ModuleName + 'specialmode/' + para.id,
    method: 'delete',
    data: para
  })
}
// 添加
export function addSpecialmode(para) {
  console.info(para)
  return request({
    url: ModuleName + 'specialmode',
    method: 'put',
    data: para
  })
}

// 编辑
export function editSpecialmode(para) {
  return request({
    url: ModuleName + 'specialmode/' + para.id,
    method: 'post',
    data: para
  })
}
