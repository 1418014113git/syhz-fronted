import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 黑名单申请添加
export function addBlacklist(para) {
  return request({
    url: ModuleName + 'blacklist',
    method: 'put',
    data: para
  })
}
// 移出黑名单RemoveBlackList
export function removeBlackList(para) {
  return request({
    url: ModuleName + 'blacklist/' + para.id,
    method: 'post',
    data: para
  })
}

// 分页查询企业信息带黑名单
export function getListPage(para) {
  return request({
    url: ModuleName + 'page/blacklist',
    method: 'get',
    params: para
  })
}
// 查询某企业的黑名单信息
export function getBlacklistcompany(para) {
  return request({
    url: ModuleName + 'blacklistcompany',
    method: 'get',
    params: para
  })
}
// 查询
export function getList(para) {
  return request({
    url: ModuleName + 'ajcompany',
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

// 删除
export function deleteCompany(para) {
  return request({
    url: ModuleName + 'ajcompany/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 添加
export function addCompany(para) {
  console.info(para)
  return request({
    url: ModuleName + 'ajcompany',
    method: 'put',
    data: para
  })
}

// 编辑
export function editCompany(para) {
  return request({
    url: ModuleName + 'ajcompany/' + para.id,
    method: 'post',
    data: para
  })
}

// 单条
export function getCompany(para) {
  return request({
    url: ModuleName + 'ajcompany/' + para.id,
    method: 'get',
    data: para
  })
}

// 分页查询黑名单企业
export function getBlackListPage(para) {
  return request({
    url: ModuleName + 'page/blackComplist',
    method: 'get',
    params: para
  })
}

// 分页查询黑名单人员
export function getBlankPersonListPage(para) {
  return request({
    url: ModuleName + 'page/blankpersonlist',
    method: 'get',
    params: para
  })
}

// 详情 企业关联案件列表
export function getQyGLAJ(para) {
  return request({
    url: ModuleName + 'page/qyglaj',
    method: 'get',
    params: para
  })
}

// 详情 企业关联人员列表
export function getQyGLRY(para) {
  return request({
    url: ModuleName + 'page/companyperson',
    method: 'get',
    params: para
  })
}

// 详情 人员关联企业列表
export function getRYGLQY(para) {
  return request({
    url: ModuleName + 'personcompany',
    method: 'get',
    params: para
  })
}
