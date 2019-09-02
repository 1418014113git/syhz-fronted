import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

/* 问答列表 */
export function getLearningPage(para) {
  return request({
    url: ModuleName + 'page/learning',
    method: 'get',
    params: para
  })
}
/* 问题详情 */
export function getLearnDetail(para) {
  return request({
    url: ModuleName + 'learning/' + para.id,
    method: 'get'
  })
}
/* 发布问题 */
export function addLearning(para) {
  return request({
    url: ModuleName + 'learning',
    method: 'put',
    data: para
  })
}
/* 修改浏览数 */
export function editLearnBrows(para) {
  return request({
    url: ModuleName + 'learnbrowse/' + para.id,
    method: 'post',
    data: para
  })
}
/* 发布回答 */
export function addAnswer(para) {
  return request({
    url: ModuleName + 'learnaq',
    method: 'put',
    data: para
  })
}
/* 发布回答 */
export function getAnswerPage(para) {
  return request({
    url: ModuleName + 'page/learnaq',
    method: 'get',
    params: para
  })
}
/* 我的回答 */
export function getMineAnswerPage(para) {
  return request({
    url: ModuleName + 'page/learnaqmine',
    method: 'get',
    params: para
  })
}
