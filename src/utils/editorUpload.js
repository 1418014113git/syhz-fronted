import request from '@/utils/request'
import Attachment from '@/api/attachment'

export function uploadImg(para) {
  return request({
    url: Attachment.uploadFileUrl,
    method: 'post',
    data: para
  })
}
