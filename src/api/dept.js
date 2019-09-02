// 查询市
export function getMSDept(deptList) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode) {
      if (dept.depCode.substring(4, 6) === '00' && dept.depCode.substring(8, 12) === '0000') {
        arry.push(dept)
      }
    }
  }
  return getTree(arry)
}

// 查询下级
export function getQXDept(deptList, deptCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (getXj(dept, deptCode)) {
      arry.push(dept)
    }
    // if (dept.depCode && dept.parentCode.substring(0, 8) === deptCode.substring(0, 8)) { // 前8 保证内设部门同样能查询
    //   if (dept.depCode.substring(0, 6) !== deptCode.substring(0, 6)) { // 不包括内设
    //     arry.push(dept)
    //   }
    // }
  }
  return getTree(arry)
}

// 查询案件认领下发部门
export function getAjrlDept(deptList, deptCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (deptCode.substring(0, 4) === '1500') {
      if (dept.parentCode.substring(0, 8) === deptCode.substring(0, 8)) {
        arry.push(dept)
      }
    } else {
      if (dept.parentCode.substring(0, 4) === deptCode.substring(0, 4)) {
        arry.push(dept)
      }
    }
  }
  return arry
}
// 查询案件认领上报部门
export function getAjrlParentDept(deptList, parentCode, depCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode !== depCode && dept.depCode !== '150000532500' && dept.depCode !== '150000533100' && dept.depCode !== '150000000000') {
      if (dept.depCode.substr(0, 6) === parentCode.substr(0, 6) || dept.depCode.substr(0, 6) === depCode.substr(0, 6) || getNs(dept.depCode, depCode)) {
        arry.push(dept)
      }
    }
  }
  return arry
}

export function getAjrlNSXJ(deptList, deptCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode === deptCode || getXj(dept, deptCode) || getNs(dept.depCode, deptCode)) {
      arry.push(dept)
    }
  }
  return arry
}
// 案件认领列表
export function ajrlListDepts(deptList, deptCode) {
  const level = getDeptLevel(deptCode)
  const arry = []
  if (level === 1) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode === '150000530000' || dept.depCode === '150000535300' || dept.depCode === '150000535400' || dept.depCode === '150000535500') {
        dept.name = dept.name.replace(/内蒙古自治区公安厅/g, '')
        arry.push(dept)
      }
    }
  }
  if (level === 2 || level === 3) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode && dept.depCode === deptCode) {
        arry.push(dept)
      }
    }
  }
  return getTree(arry)
}

// 只查询上级
export function getParentDept(deptList, deptCode) {
  const arry = []
  if (deptCode === '150000000000') { // 目前总队只显示总队
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode === '150000530000') {
        arry.push(dept)
      }
    }
    return getTree(arry)
  }
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (getSj(dept.depCode, deptCode)) {
      arry.push(dept)
    }
  }
  return getTree(arry)
}
// 只查询上级
export function getParentDeptArray(deptList, deptCode) {
  const arry = []
  if (deptCode === '150000000000') { // 目前总队只显示总队
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode === '150000530000') {
        arry.push(dept)
      }
    }
    return getTree(arry)
  }
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (getSj(dept.depCode, deptCode)) {
      arry.push(dept)
    }
  }
  return arry
}

function getXj(dept, str2) {
  if (str2.substring(0, 6) === '150000') {
    return dept.parentCode === str2
  } else {
    return dept.depCode.substring(0, 4) === str2.substring(0, 4) && dept.depCode.substring(4, 6) !== '00'
  }
}
function getSj(str1, str2) {
  if (str2.substring(0, 6) === '150000') {
    return str1 === str2
  } else {
    return str1.substring(0, 6) === str2.substring(0, 6) && str1.substring(8, 10) === '00'
  }
}
function getNs(str1, str2) {
  return str1.substring(0, 4) === str2.substring(0, 4) && str1.substring(8, 10) !== '00'
}

// 查询同级和下级
export function getTJXJ(deptList, parentCode, deptCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode === deptCode || getXj(dept, deptCode) || dept.parentCode.substring(0, 8) === parentCode.substring(0, 8)) {
      if (deptCode.substr(4, 2) === '00' && getXj(dept, deptCode)) {
        dept.parentCode = deptCode
      }
      const s2 = dept.depCode.substring(8, 12) // s2 过滤掉内设部门
      if (s2 === '0000') {
        arry.push(dept)
      }
    }
  }
  console.info(arry)
  return getTree(arry)
}

// 返回部门等级 1 省厅  2 市  3 淇县
export function getDeptLevel(deptCode) {
  if (deptCode.substring(2, 6) === '0000') {
    return 1
  } else if (deptCode.substring(4, 6) === '00') {
    return 2
  } else {
    return 3
  }
}

// 将列表转换为树结构
export function getTree(treeArray) {
  const r = []
  const tmpMap = {}
  for (let i = 0, l = treeArray.length; i < l; i++) {
    tmpMap[treeArray[i]['depCode']] = treeArray[i]
  }
  for (let i = 0, l = treeArray.length; i < l; i++) {
    const key = tmpMap[treeArray[i]['parentCode']]
    if (key) {
      if (!key['children']) {
        key['children'] = []
        key['children'].push(treeArray[i])
      } else {
        key['children'].push(treeArray[i])
      }
    } else {
      r.push(treeArray[i])
    }
  }
  return r
}

// 个性化查询同级和下级
export function getGXHTJXJ(deptList, parentCode, deptCode) {
  const array = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode === deptCode || getXj(dept, deptCode) || dept.parentCode.substring(0, 8) === parentCode.substring(0, 8)) {
      const s2 = dept.depCode.substring(8, 12)
      if (s2 === '0000') { // 非内设
        array.push(dept)
      } else { // 内设
        dept.parentCode = dept.depCode.substring(0, 8) + '0000'
        array.push(dept)
      }
    }
  }
  return getTree(array)
}

// 全国协查详情参与部门，内设，下级
export function getAssistTaskDepts(deptList, params) {
  const array = []
  const codes = []
  for (let j = 0; j < params.length; j++) {
    for (let i = 0; i < deptList.length; i++) {
      const pdept = params[j]
      const dept = deptList[i]
      if (pdept.id === dept.id) {
        codes.push(dept.depCode)
      }
    }
  }
  for (let j = 0; j < codes.length; j++) {
    const code = codes[j]
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode === code) {
        array.push(dept)
      }
    }
  }
  return getTree(array)
}

// 专项任务 参与部门，承办部门
export function getSpecialTaskDepts(deptList, params) {
  const array = []
  const codes = []
  for (let j = 0; j < params.length; j++) {
    for (let i = 0; i < deptList.length; i++) {
      const pdept = params[j]
      const dept = deptList[i]
      if (pdept.id === dept.id) {
        codes.push(dept.depCode)
      }
    }
  }
  for (let j = 0; j < codes.length; j++) {
    const code = codes[j]
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode === code) {
        array.push(dept)
      }
    }
  }
  return getTree(array)
}

// 线索流转选择部门 省厅显示:下级;市显示:上级/下级/同级;旗县显示:上级/同级
export function getClueCheckDepts(deptList, curCode, parentCode) {
  const array = []
  if (curCode.substring(2, 6) === '0000') { // 省厅 不含内设
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.parentCode === curCode && dept.depCode.substring(8, 12) === '0000') {
        array.push(dept)
      }
    }
    return getTree(array)
  }
  if (curCode.substring(4, 6) === '00') { // 市 不含内设
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i]
      if (dept.depCode.substring(8, 12) === '0000') {
        if (dept.depCode === parentCode || dept.parentCode.substr(0, 8) === parentCode.substr(0, 8) || dept.depCode.substr(0, 4) === curCode.substr(0, 4)) {
          if (getXj(dept, curCode)) {
            dept.parentCode = curCode
          }
          array.push(dept)
        }
      }
    }
    return getTree(array)
  }
  // 旗县显示:上级/同级
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (getSj(dept.depCode, parentCode) || getXj(dept, parentCode)) {
      array.push(dept)
    }
  }
  return getTree(array)
}

// 根据市查询下级列表
export function querySonDeptByCity(deptList, cityCode) {
  const arry = []
  for (let i = 0; i < deptList.length; i++) {
    const dept = deptList[i]
    if (dept.depCode) {
      if (cityCode === '150000') {
        if (dept.depCode.substring(0, 6) === cityCode && dept.depCode !== '150000000000' && dept.depCode !== '150000532500' && dept.depCode !== '150000533100') {
          arry.push(dept)
        }
      } else {
        if (dept.depCode.substring(0, 6) === cityCode || dept.parentCode.substring(0, 6) === cityCode) {
          arry.push(dept)
        }
      }
    }
  }
  return arry
}
