import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 添加工作流
export function addAssistCaseFlow(para) {
  para.serverType = '0005'
  para.userId = para.applyPersonId
  para.userName = para.applyPersonName
  para.deptName = para.applyDeptName
  para.deptId = para.applyDeptId
  para.acpDept = para.approveDept
  para.acpDeptName = para.approveDeptName
  return request({
    url: ModuleName + 'workFlow/caseassist',
    method: 'put',
    data: para
  })
}

// 添加
export function saveAssistCase(para) {
  return request({
    url: ModuleName + 'caseassist',
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

// 驳回重新编辑
export function assistreject(para) {
  return request({
    url: ModuleName + 'assistreject/' + para.id,
    method: 'post',
    data: para
  })
}

// 分页查询
export function getAssistCasePage(para) {
  return request({
    url: ModuleName + 'page/caseassist',
    method: 'get',
    params: para
  })
}

// 查询
export function getAssistCaseList(para) {
  return request({
    url: ModuleName + 'caseassist',
    method: 'get',
    params: para
  })
}
// 查询单条
export function getAssistCase(para) {
  return request({
    url: ModuleName + 'caseassist/' + para.id,
    method: 'get'
  })
}

// 删除
export function deleteAssistCase(para) {
  return request({
    url: ModuleName + 'caseassist/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 修改通知签收
export function updBusinessSign(para) {
  return request({
    url: ModuleName + 'businesssign/' + para.id,
    method: 'post',
    data: para
  })
}
// 查询通知签收
export function getSignList(para) {
  return request({
    url: ModuleName + 'businesssign',
    method: 'get',
    params: para
  })
}

// 查询协查反馈列表
export function getLocalInegFeed(para) {
  return request({
    url: ModuleName + 'page/linegfeed',
    method: 'get',
    params: para
  })
}

// 添加反馈列表
export function saveLocalInegFeed(para) {
  return request({
    url: ModuleName + 'linegfeed',
    method: 'put',
    data: para
  })
}
// 修改反馈列表
export function updLocalInegFeed(para) {
  return request({
    url: ModuleName + 'linegfeed/' + para.id,
    method: 'post',
    data: para
  })
}
// 修改反馈列表
export function delLocalInegFeed(para) {
  return request({
    url: ModuleName + 'linegfeed/' + para.id,
    method: 'delete',
    data: para
  })
}

// 案件协查到期提醒
export function getLInegLastDay(para) {
  return request({
    url: ModuleName + 'lineglastday',
    method: 'get',
    params: para
  })
}
