import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getSupervisePage(para) {
  return request({
    url: ModuleName + 'page/dbaj',
    method: 'get',
    params: para
  })
}

// 查询
export function getSuperviseList(para) {
  return request({
    url: ModuleName + 'dbaj',
    method: 'get',
    params: para
  })
}

// 查询
export function getDBAJHome(para) {
  return request({
    url: ModuleName + 'page/dbajhome',
    method: 'get',
    params: para
  })
}
// 查询单条
export function getSupervise(para) {
  return request({
    url: ModuleName + 'dbaj/' + para.id,
    method: 'get'
  })
}

// 删除
export function deleteSupervise(para) {
  return request({
    url: ModuleName + 'dbaj/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 添加督办申请
export function addSupervise(para) {
  para.serverType = '0003'
  para.userId = para.applyPersonId
  para.userName = para.applyPersonName
  para.deptName = para.applyDeptName
  para.deptId = para.applyDeptId
  para.acpDept = para.superviseExamDeptId
  para.acpDeptName = para.superviseExamDept
  para.bizType = 3
  para.action = '添加督办案件'
  return request({
    url: ModuleName + 'workFlow/dbaj',
    method: 'put',
    data: para
  })
}

// 上级发布督办通知调用handler
export function dbOnlySave(para) {
  return request({
    url: ModuleName + 'dbaj',
    method: 'put',
    data: para
  })
}

// 上级发布督办通知调用handler
export function addSuperviseDirect(para) {
  return request({
    url: ModuleName + 'directdbaj',
    method: 'put',
    data: para
  })
}

// 编辑调用handler
export function editSupervise(para) {
  return request({
    url: ModuleName + 'directdbaj/' + para.id,
    method: 'post',
    data: para
  })
}

// 驳回重新编辑
export function superviseReject(para) {
  return request({
    url: ModuleName + 'assistreject/' + para.id,
    method: 'post',
    data: para
  })
}

// 分页查询
export function getDbCbPage(para) {
  return request({
    url: ModuleName + 'page/dbcbaj',
    method: 'get',
    params: para
  })
}

// 删除
export function deleteDbCb(para) {
  return request({
    url: ModuleName + 'dbcbaj/' + para.id,
    method: 'post',
    data: {
      id: para.id,
      enable: '0'
    }
  })
}

// 添加
export function addDbCb(para) {
  return request({
    url: ModuleName + 'dbcbaj',
    method: 'put',
    data: para
  })
}

// 编辑
export function editDbCb(para) {
  return request({
    url: ModuleName + 'dbcbaj/' + para.id,
    method: 'post',
    data: para
  })
}
// 编辑
export function editDbCbAccept(para) {
  return request({
    url: ModuleName + 'dbcbaccept/' + para.id,
    method: 'post',
    data: para
  })
}

// 单条
export function getDbCb(para) {
  return request({
    url: ModuleName + 'dbcbaj/' + para.id,
    method: 'get',
    data: para
  })
}

// 添加通知签收
export function addBusinessSign(para) {
  return request({
    url: ModuleName + 'businesssign',
    method: 'put',
    data: para
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

export function getDBCase(para) {
  return request({
    url: ModuleName + 'dbcase',
    method: 'get',
    params: para
  })
}

// 上传结案报告
export function saveSuperviseReport(para) {
  para.serverType = '0008' // 审核单类型
  para.userId = para.createUser
  para.userName = para.createUserName
  para.deptName = para.createDeptName
  para.deptId = para.createDept
  para.acpDept = para.examineDeptId
  para.acpDeptName = para.examineDeptName
  return request({
    url: ModuleName + 'workFlow/dbajreport',
    method: 'put',
    data: para
  })
}

// 获取结案报告
export function getSuperviseReportByid(para) {
  return request({
    url: ModuleName + 'dbajreport/' + para.id,
    method: 'get',
    params: para
  })
}
// 获取结案报告
export function getSuperviseReport(para) {
  return request({
    url: ModuleName + 'dbajreport',
    method: 'get',
    params: para
  })
}
// 修改结案报告
export function updateSuperviseReport(para) {
  return request({
    url: ModuleName + 'dbajreport/' + para.id,
    method: 'post',
    data: para
  })
}
// 驳回结案报告重新编辑
export function saveReportReject(para) {
  return request({
    url: ModuleName + 'assistreject/' + para.id,
    method: 'post',
    data: para
  })
}
