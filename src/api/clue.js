import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 查询线索列表
export function getCluePage(para) {
  return request({
    url: ModuleName + 'clue/page',
    method: 'post',
    data: para
  })
}

