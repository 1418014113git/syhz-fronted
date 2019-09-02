import request from '@/utils/request'

const ModuleName = process.env.SYHZ_MODULE

// 查询
export function getPageData(para) {
  return request({
    url: ModuleName + 'page/inegfeedback',
    method: 'get',
    params: para
  })
}

// 添加指令
export function saveInstruct(para) {
  return request({
    url: ModuleName + 'inegfeedback',
    method: 'put',
    data: para
  })
}
// 直接下发指令
export function directSave(para) {
  return request({
    url: ModuleName + 'instruct/directSave',
    method: 'put',
    data: para
  })
}

// 下发通知 接受 反馈
export function instructNotice(para) {
  return request({
    url: ModuleName + 'instruct/' + para.type,
    method: 'post',
    data: para
  })
}
// 修改数据
export function updInstruct(para) {
  return request({
    url: ModuleName + 'inegfeedback/' + para.id,
    method: 'post',
    data: para
  })
}

// 删除记录
export function delInstruct(para) {
  return request({
    url: ModuleName + 'inegfeedback/' + para.id,
    method: 'delete'
  })
}
