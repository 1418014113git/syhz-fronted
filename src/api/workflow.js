import request from '@/utils/request'

const ModuleName = process.env.SYHZ_MODULE

// 案件协查分页查询
export function getWorkOrderPage(para) {
  return request({
    url: ModuleName + 'page/workorder',
    method: 'get',
    params: para
  })
}

// 查询
export function getExamineList(para) {
  return request({
    url: ModuleName + 'page/examinelist',
    method: 'get',
    params: para
  })
}

// 查询单条
export function getDetailForExamine(para) {
  return request({
    url: ModuleName + 'workexamine/' + para.id,
    method: 'get'
  })
}

// 编辑
export function workExaminePass(para) {
  return request({
    url: ModuleName + 'examinepass/' + para.id,
    method: 'post',
    data: para
  })
}
// 编辑
export function workExamineReject(para) {
  return request({
    url: ModuleName + 'examinereject/' + para.id,
    method: 'post',
    data: para
  })
}
// 编辑
export function workExamineContinue(para) {
  return request({
    url: ModuleName + 'examinecontinue/' + para.id,
    method: 'post',
    data: para
  })
}
