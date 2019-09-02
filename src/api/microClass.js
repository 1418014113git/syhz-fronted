import request from '@/utils/request'
import Attachment from '@/api/attachment'
const ModuleName = process.env.SYHZ_MODULE

export function loginCms() {
  return request({
    url: ModuleName + 'cms/login',
    method: 'post'
  })
}

// 分页查询
export function getAttachmentList(para) {
  return request({
    url: Attachment.getVideoUrl,
    method: 'post',
    data: para
  })
}

// 单条查询
export function getTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'get',
    data: {
      id: para.id
    }
  })
}

// 编辑
export function editTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'post',
    data: para
  })
}

// 删除
export function removeTztg(para) {
  return request({
    url: ModuleName + 'tztg/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}
