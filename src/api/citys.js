import request from '@/utils/request'
const UpmsModule = process.env.LOGIN_MODULE

export function getCityTree() {
  return request({
    url: UpmsModule + 'api/cityTree',
    method: 'get',
    params: {}
  })
}
