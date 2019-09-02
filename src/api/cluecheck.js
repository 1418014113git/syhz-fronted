import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 添加
export function saveClueCheck(para) {
  return request({
    url: ModuleName + 'cluecheck',
    method: 'put',
    data: para
  })
}

// 编辑
export function editAssistCase(para) {
  return request({
    url: ModuleName + 'caseassist/' + para.id,
    method: 'post',
    data: para
  })
}

// 查询流转列表
export function getClueChecks(para) {
  return request({
    url: ModuleName + 'page/cluecheck',
    method: 'get',
    params: para
  })
}
// 查询反馈列表
export function getClueCheckResult(para) {
  return request({
    url: ModuleName + 'cluecheckinfo/list',
    method: 'post',
    data: para
  })
}

// 线索签收
export function updBusinessSign(para) {
  return request({
    url: ModuleName + 'cluechecksign/' + para.id,
    method: 'post',
    data: para
  })
}

// 反馈
export function saveCheckResult(para) {
  return request({
    url: ModuleName + 'cluecheckinfo',
    method: 'put',
    data: para
  })
}

