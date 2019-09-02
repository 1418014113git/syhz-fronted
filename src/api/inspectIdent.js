import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 检查机构列表
export function getCheckOrgList(para) {
  return request({
    url: ModuleName + 'checkorglist',
    method: 'get',
    params: para
  })
}
// 案件列表
export function getAjJbxxSyh() {
  return request({
    url: ModuleName + 'ajjbxxsyh',
    method: 'get',
    params: {}
  })
}
// 提交工作流审核
export function addAuthenticateFlow(para) {
  para.serverType = '0006'
  para.userId = para.applyPersonId
  para.userName = para.applyPersonName
  para.deptName = para.applyDeptName
  para.deptId = para.applyDeptId
  para.acpDept = para.approveDept
  para.acpDeptName = para.approveDeptName
  return request({
    url: ModuleName + 'workFlow/authenticate',
    method: 'put',
    data: para
  })
}
// 申请检验鉴定
export function addAuthenticate(para) {
  return request({
    url: ModuleName + 'authenticate',
    method: 'put',
    data: para
  })
}
// 分页查询
export function getAuthenticatePage(para) {
  return request({
    url: ModuleName + 'page/authenticate',
    method: 'get',
    params: para
  })
}

// 修改单条查询
export function getAuthenticate(para) {
  return request({
    url: ModuleName + 'authenticatebyid/' + para.id,
    method: 'get',
    data: {
      id: para.id
    }
  })
}

// 详情单条查询
export function getAuthenticateDetail(para) {
  return request({
    url: ModuleName + 'authenticate/' + para.id,
    method: 'get',
    data: {
      id: para.id
    }
  })
}

// 编辑
export function editAuthenticate(para) {
  return request({
    url: ModuleName + 'authenticate/' + para.id,
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

// 删除
export function removeAuthenticate(para) {
  return request({
    url: ModuleName + 'authenticate/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 全国检验鉴定机构名录列表
export function getAjCheckOrganization(para) {
  return request({
    url: ModuleName + 'page/ajcheckorganization',
    method: 'get',
    params: para
  })
}
// 单条查询全国检验鉴定机构名录
export function getAjCheckOrganizationOne(para) {
  return request({
    url: ModuleName + 'ajcheckorganization/' + para.id,
    method: 'get',
    data: para
  })
}
// 编辑全国检验鉴定机构名录
export function editAjCheckOrganization(para) {
  return request({
    url: ModuleName + 'ajcheckorganization/' + para.id,
    method: 'post',
    data: para
  })
}
// 添加全国检验鉴定机构名录
export function addAjCheckOrganization(para) {
  return request({
    url: ModuleName + 'ajcheckorganization',
    method: 'put',
    data: para
  })
}
// 删除全国检验鉴定机构名录
export function removeAjCheckOrganization(para) {
  return request({
    url: ModuleName + 'ajcheckorganization/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 添加检验鉴定报告
export function addCheckResult(para) {
  return request({
    url: ModuleName + 'authresult',
    method: 'put',
    data: para
  })
}

export function getCheckResult(para) {
  return request({
    url: ModuleName + 'authresultbyaid',
    method: 'get',
    params: para
  })
}
