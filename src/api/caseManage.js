import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 案件认领分页查询
export function getAJJBXXETLRLPage(para) {
  return request({
    url: ModuleName + 'ajrllist/pageList',
    method: 'get',
    params: para
  })
}

export function getAJJBXXETLRLTJPAGE(para) {
  return request({
    url: ModuleName + 'ajrllist/pageTjList',
    method: 'get',
    params: para
  })
}

// 单条查询
export function getAJJBXXETLRL(para) {
  return request({
    url: ModuleName + 'ajjbxxetlrl/' + para.id,
    method: 'get',
    data: {
      id: para.id
    }
  })
}
// 案件认领
export function addAJJBXXSYH(para) {
  return request({
    url: ModuleName + 'ajjbxxsyh',
    method: 'put',
    data: para
  })
}
// 案件认领2
export function addAJJBXXSYHRL(para) {
  return request({
    url: ModuleName + 'ajrl',
    method: 'put',
    data: para
  })
}
// 指定管辖
export function addAJJBXXSYHZDGX(para) {
  return request({
    url: ModuleName + 'ajzdgx',
    method: 'put',
    data: para
  })
}
// 修改签收表状态
export function editAJJBXXSYH(para) {
  return request({
    url: ModuleName + 'ajjbxxsyh/' + para.id,
    method: 'post',
    data: para
  })
}
// 案件业务列表
export function getAJJBXXSYHPage(para) {
  return request({
    url: ModuleName + 'page/ajjbxxsyh',
    method: 'get',
    params: para
  })
}
// 单条查询案件业务表
export function getAJJBXXSYH(para) {
  return request({
    url: ModuleName + 'ajjbxxsyh/' + para.AJBH,
    method: 'get',
    data: para
  })
}

// 单条查询案件业务表通过ID
export function getAJJBXXSYHID(para) {
  return request({
    url: ModuleName + 'ajjbxxsyhid/' + para.id,
    method: 'get',
    data: para
  })
}

// ETL单条查询案件业务表通过AJBH
export function getAjJbxxEtlAjbh(para) {
  return request({
    url: ModuleName + 'ajjbxxetlajbh/' + para.AJBH,
    method: 'get'
  })
}

// 模型查询
export function getAJJBXXBYMODE(para) {
  return request({
    url: ModuleName + 'page/ajjbxxbymode',
    method: 'get',
    params: para
  })
}

// 案件详情涉案财物查询
export function getAJDETAILASSETS(para) {
  return request({
    url: ModuleName + 'page/ajdetailassets',
    method: 'get',
    params: para
  })
}
// 案件详情串并案列表查询
export function getAJDETAILBUNCH(para) {
  return request({
    url: ModuleName + 'page/ajdetailbunch',
    method: 'get',
    params: para
  })
}
// 案件详情接处警信息查询
export function getAJDETAILRECEIVE(para) {
  return request({
    url: ModuleName + 'ajdetailreceive',
    method: 'get',
    params: para
  })
}

// 案件详情情报线索信息查询
export function getQbxsByAjId(para) {
  return request({
    url: ModuleName + 'page/qbxsbyajid',
    method: 'get',
    params: para
  })
}

// 案件详情接处警信息查询
export function getAjDeptByAjId(para) {
  return request({
    url: ModuleName + 'page/ajdeptbyajid',
    method: 'get',
    params: para
  })
}

// 案件详情接处警信息查询
export function getXyrByAjbh(para) {
  return request({
    url: ModuleName + 'page/ajdetailxyr',
    method: 'get',
    params: para
  })
}
// 案件详情接处警信息查询
export function getZjqdByAjbh(para) {
  return request({
    url: ModuleName + 'page/ajjszjqd',
    method: 'get',
    params: para
  })
}

// 同类案件
export function getSimilarCase(para) {
  return request({
    url: ModuleName + 'page/ajdetailsimilarcase',
    method: 'get',
    params: para
  })
}
