import request from '@/utils/request'
import { parseTime } from '@/utils/index'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getTaskListPage(para) {
  return request({
    url: ModuleName + 'page/specialtask',
    method: 'get',
    params: para
  })
}
// 分页查询
export function taskListPage(para) {
  return request({
    url: ModuleName + 'page/specialtasksign',
    method: 'get',
    params: para
  })
}

// 查询
export function getTaskList(para) {
  return request({
    url: ModuleName + 'specialtask',
    method: 'get',
    params: para
  })
}

// 删除
export function deleteTask(para) {
  return request({
    url: ModuleName + 'specialtask/' + para.id,
    method: 'delete',
    data: {
      id: para.id,
      enable: false
    }
  })
}

// 添加
export function addTask(para) {
  return request({
    url: ModuleName + 'specialtasksave',
    method: 'put',
    data: para
  })
}

// 编辑
export function editTask(para) {
  return request({
    url: ModuleName + 'specialtaskupd/' + para.id,
    method: 'post',
    data: para
  })
}

// 单条
export function getTask(para) {
  return request({
    url: ModuleName + 'specialtask/' + para.id,
    method: 'get',
    data: para
  })
}

// 分页查询
export function getReportListPage(para) {
  return request({
    url: ModuleName + 'page/specialtaskreport',
    method: 'get',
    params: {
      pageNum: para.page,
      title: para.title,
      createDate: para.create_date === null || para.create_date === '' ? '' : parseTime(para.create_date, '{y}-{m}-{d}'),
      createDeptName: para.create_dept_name,
      deptId: para.deptId,
      taskId: para.taskId,
      reportStatus: para.reportStatus
    }
  })
}

// 删除
export function deleteReport(para) {
  return request({
    url: ModuleName + 'specialtaskreport/',
    method: 'delete',
    data: {
      id: para.id,
      enable: false
    }
  })
}

// 添加
export function addReport(para) {
  para.serverType = '0007'
  para.deptName = para.createDeptName
  para.deptId = para.createDeptId
  return request({
    url: ModuleName + 'workFlow/specialtaskreport',
    method: 'put',
    data: para
  })
}

// 添加
export function onlySaveReport(para) {
  return request({
    url: ModuleName + 'specialtaskreport',
    method: 'put',
    data: para
  })
}
// 编辑
export function editReport(para) {
  return request({
    url: ModuleName + 'specialtaskreport/' + para.id,
    method: 'post',
    data: para
  })
}

// 编辑
export function flowUpdReport(para) {
  para.serverType = '0007'
  para.deptName = para.createDeptName
  para.deptId = para.createDeptId
  return request({
    url: ModuleName + 'workFlow/specialtaskreport/' + para.id,
    method: 'post',
    data: para
  })
}

// 驳回重新编辑
export function taskReportReject(para) {
  para.serverType = '0007'
  para.deptName = para.createDeptName
  para.deptId = para.createDeptId
  return request({
    url: ModuleName + 'assistreject/' + para.id,
    method: 'post',
    data: para
  })
}

// 单条
export function getReport(para) {
  return request({
    url: ModuleName + 'specialtaskreport/' + para.id,
    method: 'get'
  })
}

export function getReportExamine(para) {
  return request({
    url: ModuleName + 'specialtaskreportexamine',
    method: 'get',
    params: para
  })
}

// 审核
export function review(para) {
  return request({
    url: ModuleName + 'specialtaskreport/' + para.id,
    method: 'post',
    data: {
      id: para.id,
      taskId: para.task_id,
      title: para.title,
      dept: para.dept,
      desription: para.desription,
      attachment: para.attachment,
      enable: para.enable
    }
  })
}

// 上报案件
export function addReportCase(para) {
  return request({
    url: ModuleName + 'specialtaskcase',
    method: 'put',
    data: para
  })
}

export function getReportCaseListPage(para) {
  return request({
    url: ModuleName + 'specialtaskcase/pagebycid',
    method: 'post',
    data: para
  })
}

export function getReportCaseTotal(para) {
  return request({
    url: ModuleName + 'specialtaskcase/count',
    method: 'post',
    data: para
  })
}

export function getCaseListPage(para) {
  return request({
    url: ModuleName + 'page/specialtaskreportcase',
    method: 'get',
    params: para
  })
}
// 专项任务分析展现
export function getTaskQbxsAjCount(para) {
  return request({
    url: ModuleName + 'taskCount',
    method: 'get',
    params: para
  })
}

// 部门签收列表
export function taskReceiveList(para) {
  return request({
    url: ModuleName + 'page/specialtaskdetailsign',
    method: 'get',
    params: para
  })
}

// 签收
export function specialTaskAccept(para) {
  return request({
    url: ModuleName + 'specialtaskaccept/' + para.id,
    method: 'post',
    data: para
  })
}
