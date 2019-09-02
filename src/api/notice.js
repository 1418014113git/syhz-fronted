import request from '@/utils/request'

const ModuleName = process.env.SYHZ_MODULE

// 通知通告添加
export function addTztg(para) {
  return request({
    url: ModuleName + 'tztg',
    method: 'put',
    data: para
  })
}

// 分页查询
export function getTztgListPage(para) {
  return request({
    url: ModuleName + 'page/tztg',
    method: 'get',
    params: para
  })
}

// 单条查询
export function getTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'get',
    data: para
  })
}
// list方式取单条
export function getTztgOne(para) {
  return request({
    url: ModuleName + 'tztgone',
    method: 'get',
    params: para
  })
}
// 获取对应的签收列表
export function getTztgSigns(para) {
  return request({
    url: ModuleName + 'tztgsign',
    method: 'get',
    params: para
  })
}

// 编辑
export function editTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'post',
    data: para
  })
}

// 删除
export function removeTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 分页查询接收的通知通告
export function getTztgReceiveListPage(para) {
  return request({
    url: ModuleName + 'page/tztgreceive',
    method: 'get',
    params: para
  })
}

// 分页查询接收的通知通告
export function getTztgmhPage(para) {
  return request({
    url: ModuleName + 'page/tztgmhreceive',
    method: 'get',
    params: para
  })
}

// 查询单条接收的通知通告
export function getTztgReceive(para) {
  return request({
    url: ModuleName + 'tztgreceiveone',
    method: 'get',
    params: para
  })
}

// 签收添加
export function addTztgSign(para) {
  return request({
    url: ModuleName + 'tztgsign',
    method: 'put',
    data: para
  })
}

// 签收通知通告
export function editTztgSign(para) {
  return request({
    url: ModuleName + 'tztgsign/' + para.id,
    method: 'post',
    data: para
  })
}

// 签收列表查询
export function getTztgSignListPage(para) {
  return request({
    url: ModuleName + 'tztgsign',
    method: 'get',
    params: para
  })
}

// 通告统计
export function getTztgCount(para) {
  return request({
    url: ModuleName + 'tztgcount',
    method: 'get',
    params: para
  })
}
