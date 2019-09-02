import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 高发行业分页查询
export function getAJDEPTCOUNTPage(para) {
  return request({
    url: ModuleName + 'page/ajdeptcount',
    method: 'get',
    params: para
  })
}

