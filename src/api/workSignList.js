import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 查询检验鉴定签收列表
export function getWorkSignList(para) {
  return request({
    url: ModuleName + 'page/worksignlist',
    method: 'get',
    params: para
  })
}

// 查询督办催办签收列表
export function getWorkSignDBList(para) {
  return request({
    url: ModuleName + 'page/worksigndblist',
    method: 'get',
    params: para
  })
}

// 查询催办签收列表
export function getWorkSignCBList(para) {
  return request({
    url: ModuleName + 'page/worksigncblist',
    method: 'get',
    params: para
  })
}

// 查询案件协查签收列表
export function getWorkSignAssistList(para) {
  return request({
    url: ModuleName + 'page/worksignassist',
    method: 'get',
    params: para
  })
}

// 查询案件协查签收列表
export function getWorkSignInegList(para) {
  return request({
    url: ModuleName + 'page/worksignineg',
    method: 'get',
    params: para
  })
}

// 查询案件协查签收列表
export function getWorkSignInspectList(para) {
  return request({
    url: ModuleName + 'page/worksigninsplist',
    method: 'get',
    params: para
  })
}

// 单线索签收
export function updBusinessSign(para) {
  return request({
    url: ModuleName + 'cluechecksign/' + para.id,
    method: 'post',
    data: para
  })
}
// 批量线索流转签收
export function saveBatchSign(para) {
  return request({
    url: ModuleName + 'batchqbsign/id',
    method: 'post',
    data: para
  })
}

// 批量督办签收
export function saveBatchSignDB(para) {
  return request({
    url: ModuleName + 'batchdbsign/id',
    method: 'post',
    data: para
  })
}

// 单督办案件签收
export function updBusinessSignDB(para) {
  return request({
    url: ModuleName + 'dbajchecksign/' + para.id,
    method: 'post',
    data: para
  })
}

// 批量协查签收
export function saveBatchSignAssist(para) {
  return request({
    url: ModuleName + 'batchlasign/id',
    method: 'post',
    data: para
  })
}

// 单案件协查签收
export function updBusinessSignAssist(para) {
  return request({
    url: ModuleName + 'caseassistsign/' + para.id,
    method: 'post',
    data: para
  })
}

// 获取签收信息
export function getBisSignOne(para) {
  return request({
    url: ModuleName + 'businesssignone',
    method: 'get',
    params: para
  })
}

// 批量全国性协查签收
export function saveBatchSignIneg(para) {
  return request({
    url: ModuleName + 'batchinegsign/id',
    method: 'post',
    data: para
  })
}

// 单案件全国性协查签收
export function updBusinessSignIneg(para) {
  return request({
    url: ModuleName + 'investigationsign/' + para.id,
    method: 'post',
    data: para
  })
}

// 批量全国性协查签收
export function saveBatchSignCB(para) {
  return request({
    url: ModuleName + 'batchdbcbsign/id',
    method: 'post',
    data: para
  })
}

// 单案件全国性协查签收
export function updBusinessSignCB(para) {
  return request({
    url: ModuleName + 'dbcbaccept/' + para.id,
    method: 'post',
    data: para
  })
}

// 批量检验鉴定签收
export function saveBatchSignJYJD(para) {
  return request({
    url: ModuleName + 'batchinspectsign/id',
    method: 'post',
    data: para
  })
}

// 单案件检验鉴定签收
export function updBusinessSignJYJD(para) {
  return request({
    url: ModuleName + 'authenticateappect/' + para.id,
    method: 'post',
    data: para
  })
}
