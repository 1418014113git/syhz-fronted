import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getMessagesPage(para) {
  return request({
    url: ModuleName + 'page/messages',
    method: 'get',
    params: para
  })
}
// 单条修改
export function getMessagesUpd(para) {
  return request({
    url: ModuleName + 'messagesupd/' + para.id,
    method: 'post',
    data: para
  })
}
// 批量修改
export function getBatchMessagesUpd(para) {
  return request({
    url: ModuleName + 'batchmessageupd/0',
    method: 'post',
    data: para
  })
}

// 查询是否有未读消息
export function getMessagesCount(para) {
  return request({
    url: ModuleName + 'messagescount',
    method: 'get',
    params: para
  })
}
