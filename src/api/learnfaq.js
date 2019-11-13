import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE
const UpmsModule = process.env.LOGIN_MODULE

/* 问答列表 */
export function getLearningPage(para) {
  return request({
    url: ModuleName + 'page/learning',
    method: 'get',
    params: para
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

/* 我的回答 */
export function getMineAnswerPage(para) {
  return request({
    url: ModuleName + 'page/learnaqmine',
    method: 'get',
    params: para
  })
}
/* 问题详情 */
export function getQuestion(para) {
  return request({
    url: ModuleName + 'question/info/',
    method: 'get',
    params: para
  })
}
/* 查询回答附带默认5条层回答 */
export function getAnswerWithChild(para) {
  return request({
    url: ModuleName + 'question/page/answerWithChild',
    method: 'get',
    params: para
  })
}
/* 查询层回答 */
export function getChildAnswer(para) {
  return request({
    url: ModuleName + 'question/page/answer',
    method: 'get',
    params: para
  })
}
/* 发布回答 */
export function addAnswer(para) {
  return request({
    url: ModuleName + 'question/save/answer',
    method: 'put',
    data: para
  })
}
/* 保存日志记录 */
export function saveQuestionLog(para) {
  return request({
    url: ModuleName + 'question/save/questionLog',
    method: 'put',
    data: para
  })
}
/* 保存日志记录 */
export function editQuestionLogViewTime(para) {
  return request({
    url: ModuleName + 'question/edit/questionLogViewTime',
    method: 'post',
    data: para
  })
}
/* 获取敏感词字典信息 */
export function getSensitive(para) {
  return request({
    url: UpmsModule + 'dicts',
    method: 'get',
    params: para
  })
}

// 查询问题列表
export function getQuestionPage(para) {
  return request({
    url: ModuleName + 'question/page',
    method: 'get',
    params: para
  })
}

// 删除问题
export function questionDelete(para) {
  return request({
    url: ModuleName + 'question/delete',
    method: 'delete',
    data: para
  })
}

// 添加问题
export function questionSave(para) {
  return request({
    url: ModuleName + 'question/save',
    method: 'put',
    data: para
  })
}

// 添加问题
export function questionEdit(para) {
  return request({
    url: ModuleName + 'question/edit',
    method: 'post',
    data: para
  })
}
