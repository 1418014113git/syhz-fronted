import request from '@/utils/request'
const ModuleName = process.env.YQXX_MODULE

// 分页查询
export function getListPage(para) {
  return request({
    url: ModuleName + 'elastic/search',
    method: 'post',
    data: para
  })
}
