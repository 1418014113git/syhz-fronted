import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 大要案查询
export function getDYAListPage(para) {
  return request({
    url: ModuleName + 'page/dyaj',
    method: 'get',
    params: para
  })
}

// 大要案查询
export function getDYAList(para) {
  return request({
    url: ModuleName + 'dyaj',
    method: 'get',
    params: para
  })
}

// 案件统计（侦办城市统计）
export function getCaseTotalList(para) {
  return request({
    url: ModuleName + 'totalcase',
    method: 'get',
    params: para
  })
}
// 案件统计（月）
export function getMonthCaseTotalList(para) {
  return request({
    url: ModuleName + 'monthtotalcase',
    method: 'get',
    params: para
  })
}
// 案件统计（案件性质）
export function getMonthCaseFllbList(para) {
  return request({
    url: ModuleName + 'casebyfllb',
    method: 'get',
    params: para
  })
}
// 企业性质
export function getTCode(para) {
  return request({
    url: ModuleName + 'tcode',
    method: 'get',
    params: {
      codeLx: para.codeLx
    }
  })
}
// 分页查询接收的通知通告
export function getTztgReceiveListPage(para) {
  return request({
    url: ModuleName + 'page/tztgmhreceive',
    method: 'get',
    params: para
  })
}

// 关注案件
export function concernCase(para) {
  return request({
    url: ModuleName + 'ajconcern',
    method: 'put',
    data: {
      AJBH: para.AJBH,
      userId: para.user_id
    }
  })
}

// 高发案件类型
export function getHeightCaseTypeList(para) {
  return request({
    url: ModuleName + 'heightcasetype',
    method: 'get',
    params: {}
  })
}

// 待签收信息
export function getSignCount(para) {
  return request({
    url: ModuleName + 'signcount',
    method: 'get',
    params: para
  })
}

// 待签收信息
export function getSignAjrl(para) {
  return request({
    url: ModuleName + 'signcounajrl',
    method: 'get',
    params: para
  })
}

// 待审核信息signcounajrl
export function getWorkGroup(para) {
  return request({
    url: ModuleName + 'workgroup',
    method: 'get',
    params: para
  })
}

// 催办个数
export function getCBCount(para) {
  return request({
    url: ModuleName + 'dbcbajnum/' + para.deptId,
    method: 'get'
  })
}

export function geGetAjOne(para) {
  return request({
    url: ModuleName + 'ajjbxxsyh/' + para.ajbh,
    method: 'get',
    params: para
  })
}

export function geWjWTotal() {
  return request({
    url: ModuleName + 'wjwtotalcount',
    method: 'get'
  })
}

// 社会单位共享数据资源
export function socialIntegrationResources() {
  return request({
    url: ModuleName + 'socialintegrationresources',
    method: 'get'
  })
}

// 破获案件数
export function citysajorderlist() {
  return request({
    url: ModuleName + 'citysajorderlist',
    method: 'get'
  })
}

// 破获案件数考核表1 -环境食品药品统计
export function getTjAjKh1(para) {
  return request({
    url: ModuleName + 'tjajcity',
    method: 'get',
    params: para
  })
}
// 破获案件数考核表2  大要案统计
export function getTjAjKh2(para) {
  return request({
    url: ModuleName + 'tjajdya',
    method: 'get',
    params: para
  })
}
// 破获案件数考核表3  全国协查统计
export function getTjAjKh3(para) {
  return request({
    url: ModuleName + 'tjajineg',
    method: 'get',
    params: para
  })
}
// 破获案件数考核表4  督办破获
export function getTjAjKh4(para) {
  return request({
    url: ModuleName + 'tjajdbph',
    method: 'get',
    params: para
  })
}
// 破获案件数考核表5  督办未破获
export function getTjAjKh5(para) {
  return request({
    url: ModuleName + 'tjajdbwph',
    method: 'get',
    params: para
  })
}
