import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getPageList(para) {
  return request({
    url: ModuleName + 'page/ajperson',
    method: 'get',
    params: para
  })
}
export function save(para) {
  return request({
    url: ModuleName + 'ajperson',
    method: 'put',
    data: para
  })
}
// 单条查询
export function getPersonById(para) {
  return request({
    url: ModuleName + 'ajperson/' + para.id,
    method: 'get',
    data: para
  })
}

// 编辑
export function update(para) {
  return request({
    url: ModuleName + 'ajperson/' + para.id,
    method: 'post',
    data: para
  })
}
// 删除用户 逻辑删除
export function deletePerson(para) {
  return request({
    url: ModuleName + 'ajperson/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}
// 根据用户id获取黑名单列表
export function getBlackListById(para) {
  return request({
    url: ModuleName + 'ajpersonbacklist/' + para.id,
    method: 'get',
    data: para
  })
}
// 增加用户黑名单
export function saveBlackList(para) {
  return request({
    url: ModuleName + 'ajpersonbacklist',
    method: 'put',
    data: para
  })
}
// 编辑用户黑名单
export function updateBlackList(para) {
  return request({
    url: ModuleName + 'ajpersonbacklist/' + para.id,
    method: 'post',
    data: para
  })
}
// 分页查询用户黑名单表
export function PersonblackPageList(para) {
  return request({
    url: ModuleName + 'page/ajpersonbacklist',
    method: 'get',
    params: {
      currentPage: para.page,
      pageSize: para.pageSize
    }
  })
}
export function deleteblackListById(para) {
  return request({
    url: ModuleName + 'ajpersonbacklist/' + para.person_id,
    method: 'delete',
    data: {
      person_id: para.person_id
    }
  })
}
// 查询某人员的黑名单信息
export function getBlacklistPerson(para) {
  return request({
    url: ModuleName + 'blanklistperson',
    method: 'get',
    params: para
  })
}
// 移出黑名单RemoveBlackList
export function removeBlackList(para) {
  return request({
    url: ModuleName + 'blacklistperson/' + para.id,
    method: 'post',
    data: para
  })
}
