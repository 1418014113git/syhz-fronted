import request from '@/utils/request'
import { parseTime } from '@/utils/public'
import axios from 'axios'
const ModuleName = process.env.SYHZ_MODULE

export function getConfig(para) {
  return request({
    url: ModuleName + 'trainruleconfig',
    method: 'get',
    params: para
  })
}

export function checkFileName(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(ModuleName + url, {
      params: params
    }).then((res) => {
      if (res.data.data !== null && res.data.data.length > 0) {
        reject('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！')
      } else {
        resolve(res)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
// 知识库详情学习积分（不是附件，是详情）
export function addJF(type, belongType, tableId, playType) {
  // 0登陆 1学习资料 2资料上传 3资料下载 4学习时长
  const config = JSON.parse(sessionStorage.getItem('config'))
  const currentTypeConfig = config['ruleType' + type]
  const param = {}
  const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
  const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  param.creationId = curUser.id
  param.creationName = curUser.realName
  param.areaCode = curDept.areaCode
  param.belongDepCode = curDept.depCode
  param.belongDepName = curDept.depName
  param.depType = curDept.depType
  const para = {
    belongSys: '0', // 0知识库 1网上培训
    belongMode: playType,
    belongType: belongType,
    tableId: tableId,
    branch: currentTypeConfig.oneNumber,
    maxBranch: currentTypeConfig.maxNumber,
    fractionType: type,
    fractionReckon: '0',
    fractionTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
    fractionUserId: param.creationId,
    fractionUserName: param.creationName,
    fractionAreaCode: param.areaCode,
    fractionDeptCode: param.belongDepCode,
    fractionDeptName: param.belongDepName,
    creationId: param.creationId,
    creationName: param.creationName,
    remark: '获得积分'
  }
  return request({
    url: ModuleName + 'trainFraction',
    method: 'put',
    data: para
  })
}
