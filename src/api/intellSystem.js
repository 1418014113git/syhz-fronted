import request from '@/utils/request'
// import { parseTime } from '@/utils/index'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getIntellListPage(para) {
  return request({
    url: ModuleName + 'page/qbxsjbxx',
    method: 'get',
    params: para
  })
}

// 查询
export function getIntellList(para) {
  return request({
    url: ModuleName + 'qbxsjbxx',
    method: 'get',
    params: para
  })
}

// 删除
export function deleteIntell(para) {
  return request({
    url: ModuleName + 'qbxsjbxx/' + para.id,
    method: 'delete',
    data: {
      id: para.id
    }
  })
}

// 添加
export function addIntell(para) {
  return request({
    url: ModuleName + 'qbxsjbxx',
    method: 'put',
    data: {
      taskName: para.task_name,
      startDate: para.start_time,
      endDate: para.end_time,
      deptList: para.dept_list,
      taskDesription: para.task_desription,
      dutyPerson: para.duty_person,
      partakePerson: para.partake_person,
      taskKey: para.task_key,
      attachment: para.attachment,
      status: para.status
    }
  })
}

// 编辑
export function editIntell(para) {
  return request({
    url: ModuleName + 'qbxsjbxx/' + para.id,
    method: 'post',
    data: {
      id: para.id,
      XSLX: para.XSLX
    }
  })
}

// 单条
export function getIntell(para) {
  return request({
    url: ModuleName + 'qbxsjbxx/' + para.id,
    method: 'get',
    data: para
  })
}

// 分页查询
export function getKeyWordListPage(para) {
  return request({
    url: ModuleName + 'page/qbxsjbxxtype',
    method: 'get',
    params: {
      pageNum: para.page,
      NAME: para.name
    }
  })
}

// 删除
export function deleteKeyWord(para) {
  return request({
    url: ModuleName + 'qbxsjbxxtype/',
    method: 'delete',
    data: {
      id: para.id,
      enable: false
    }
  })
}

// 单条
export function getKeyWord(para) {
  return request({
    url: ModuleName + 'qbxsjbxxtype/' + para.id,
    method: 'get',
    data: para
  })
}
// 添加
export function addKeyWord(para) {
  return request({
    url: ModuleName + 'qbxsjbxxtype',
    method: 'put',
    data: {
      name: para.name,
      typeName: para.type_name,
      type: para.type_value,
      description: para.description,
      indexNumber: para.index_number,
      wirterType: para.wirter_type,
      enable: para.enable,
      createId: '1000',
      createName: '张三'
    }
  })
}

// 编辑
export function editKeyWord(para) {
  return request({
    url: ModuleName + 'qbxsjbxxtype/' + para.id,
    method: 'post',
    data: {
      id: para.id,
      name: para.name,
      typeName: para.type_name,
      type: para.type_value,
      description: para.description,
      indexNumber: para.index_number,
      wirterType: para.wirter_type,
      enable: para.enable
    }
  })
}

// 添加情报线索
export function addIntellInfo(para) {
  return request({
    url: ModuleName + 'intell',
    method: 'put',
    data: para
  })
}

// 情报线索走势
export function getIntellCount(para) {
  return request({
    url: ModuleName + 'intellcount',
    method: 'get',
    params: para
  })
}
// 情报线索走势
export function getIntellCountYear(para) {
  return request({
    url: ModuleName + 'intellcountbyyear',
    method: 'get',
    params: para
  })
}

// 线索要素查看
export function getQbxsJbxxTypeQueryHandle(para) {
  return request({
    url: ModuleName + 'qbxsJbxxTypeEle',
    method: 'get',
    params: para
  })
}

// 分页线索要素查看
export function getQbxsJbxxTypeQueryHandlePage(para) {
  return request({
    url: ModuleName + 'page/qbxsJbxxTypeEle',
    method: 'get',
    params: para
  })
}

// 线索关联的案件
export function getQbxsjBxxCasecIds(para) {
  return request({
    url: ModuleName + 'investigationmappingids', // qbxsjbxxcasecids
    method: 'get',
    params: para
  })
}

// 添加情报线索
export function editQbxsJbxxCaseRela(para) {
  return request({
    url: ModuleName + 'qbxsjbxxcaserela',
    method: 'put',
    data: para
  })
}

// 线索关系协查
export function getQbAssist(para) {
  return request({
    url: ModuleName + 'page/qbxsmappqbassist',
    method: 'get',
    params: para
  })
}
