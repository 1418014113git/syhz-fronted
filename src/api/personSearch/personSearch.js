import request from '@/utils/request'
const ModuleName = process.env.TRAJECTORY_SEARCH_MODULE
const SYHZ_ModuleName = process.env.SYHZ_MODULE

// 根据身份证号码查人员详情
export function personByCardId(para) {
  return request({
    url: ModuleName + 'person/personByCardId',
    method: 'post',
    data: para
  })
}

// 根据身份证号码查车辆信息
export function carByCardId(para) {
  return request({
    url: ModuleName + 'car/carByCardId',
    method: 'post',
    data: para
  })
}
// 根据身份证号码查网吧上网信息
export function netBarByCardId(para) {
  return request({
    url: ModuleName + 'netBar/netBarByCardId',
    method: 'post',
    data: para
  })
}

// 根据身份证号码查旅店信息
export function passengerByCardId(para) {
  return request({
    url: ModuleName + 'passenger/passegerByCardId',
    method: 'post',
    data: para
  })
}

// 根据身份证号码查航班信息
export function flightInfoByCardId(para) {
  return request({
    url: ModuleName + 'flightInfo/flightInfoByCardId',
    method: 'post',
    data: para
  })
}

// 根据身份证号码查所拥有的企业
export function companyByCardId(para) {
  return request({
    url: SYHZ_ModuleName + 'personallcompany',
    method: 'get',
    params: para
  })
}

// 根据身份证号码查所涉及的案件
export function caseByCardId(para) {
  return request({
    url: SYHZ_ModuleName + 'personallcase',
    method: 'get',
    params: para
  })
}

// 根据身份证号码查所涉及的行政处罚
export function xzcfByCardId(para) {
  return request({
    url: SYHZ_ModuleName + 'personallxzcf',
    method: 'get',
    params: para
  })
}

// 根据身份证号码查所涉及的行政处罚
export function toAnalysis(para) {
  return request({
    url: ModuleName + '/analysis',
    method: 'post',
    data: para
  })
}

// 根据身份证号码查火车票信息
export function trainInfoByCardId(para) {
  return request({
    url: ModuleName + 'trainTickets/byCardId',
    method: 'post',
    data: para
  })
}
