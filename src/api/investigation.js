import request from '@/utils/request'

const ModuleName = process.env.SYHZ_MODULE

// 查询
export function getListPage(para) {
  return request({
    url: ModuleName + 'page/investigation',
    method: 'get',
    params: para
  })
}

// 添加工作流
export function add(para) {
  para.serverType = '0004'
  para.userId = para.applyPersonId
  para.userName = para.applyPersonName
  para.deptName = para.applyDeptName
  para.deptId = para.applyDeptId
  para.acpDept = para.approveDept
  para.acpDeptName = para.approveDeptName
  return request({
    url: ModuleName + 'workFlow/investigation',
    method: 'put',
    data: para
  })
}
// 只保存
export function saveInge(para) {
  return request({
    url: ModuleName + 'investigation',
    method: 'put',
    data: para
  })
}

// 编辑
export function edit(para) {
  return request({
    url: ModuleName + 'investigation/' + para.id,
    method: 'post',
    data: para
  })
}

// 驳回重申请
export function reject(para) {
  return request({
    url: ModuleName + 'assistreject/' + para.id,
    method: 'post',
    data: para
  })
}

// 单条
export function getOne(para) {
  return request({
    url: ModuleName + 'investigation/' + para.id,
    method: 'get',
    data: para
  })
}

// 删除
export function deleteOne(para) {
  return request({
    url: ModuleName + 'investigation/' + para.id,
    method: 'delete',
    data: {
      id: para.id,
      enable: false
    }
  })
}

export function getInvestigationCaseListPage(para) {
  return request({
    url: ModuleName + 'inegcasemapp/pagebycid',
    method: 'post',
    data: para
  })
}

export function getInvestigationCaseTotal(para) {
  return request({
    url: ModuleName + 'inegcasemapp/count',
    method: 'post',
    data: para
  })
}

// 上报案件
export function addReportCase(para) {
  return request({
    url: ModuleName + 'inegcasemapping',
    method: 'put',
    data: para
  })
}

export function getCaseListPage(para) {
  return request({
    url: ModuleName + 'page/investigationreportcase',
    method: 'get',
    params: para
  })
}

export function getCaseList(para) {
  return request({
    url: ModuleName + 'investigationreportcase',
    method: 'get',
    params: {
      pageNum: para.page,
      AJLB: para.AJLB,
      dept: para.dept
    }
  })
}

// 全国性协查到期提醒
export function getInegLastDay(para) {
  return request({
    url: ModuleName + 'ineglastday',
    method: 'get',
    params: para
  })
}
