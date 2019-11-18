/**
 * 根据字典类型名取值
 */
export function getDictName(value, dictType) {
  var dict
  var result = ''
  // dict = this.$store.state.dictionary.dict
  dict = JSON.parse(sessionStorage.getItem('dictdata'))
  if (!dict[dictType]) {
    // console.log('找不到字典类型：' + dictType)
  } else {
    dict[dictType].forEach(item => {
      if (item.dictKey === value) {
        result = item.dictName
      }
    })
  }

  return result
}

export function getUser() {
  var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  var userType = userInfo.user.userType

  if (userType === -1) { // 超级管理员

  } else if (userType === 0) { // 机构用户
    userInfo.isCompany = false
  } else if (userType === 1) { // 企业用户
    userInfo.isCompany = true
  } else { // 运维

  }

  return userInfo
}

export function setArea(param) {
  var userObj = JSON.parse(sessionStorage.getItem('userInfo'))
  var userInfo = userObj.user
  var userType = userInfo.userType
  var provinceCode
  var cityCode
  var areaCode
  if (userType === -1) { // 超级管理员

  } else if (userType === 0) { // 机构用户
    var orgObj = userObj.org
    provinceCode = orgObj.provinceCode
    cityCode = orgObj.cityCode
    areaCode = orgObj.areaCode
    var orgId = orgObj.id
    param.orgId = orgId
    param.orgName = orgObj.orgName
  } else if (userType === 1) { // 企业用户
    var comObj = userObj.company
    param.comBelong = comObj.comBelong

    // 如果用户 添加时绑定了 省市区 则获取当前人的 省市区
    provinceCode = userInfo.provinceCode === undefined ? '' : userInfo.provinceCode
    cityCode = userInfo.cityCode === undefined ? '' : userInfo.cityCode
    areaCode = userInfo.areaCode === undefined ? '' : userInfo.areaCode
    // 如果用户 未绑定 省市区 则直接去 企业的 省市区
    if (provinceCode === '') {
      provinceCode = comObj.provinceCode
      cityCode = comObj.cityCode
      areaCode = comObj.areaCode
    }
    var comId = comObj.id
    param.comId = comId
    param.comName = comObj.comName
  } else { // 运维

  }

  var roleList = userObj.role
  var roleListLen = roleList.length
  if (roleListLen >= 1) {
    var roleObj = roleList[0]
    param.roleId = roleObj.id
  }

  param.provinceCode = provinceCode === undefined ? '' : provinceCode
  param.cityCode = cityCode === undefined ? '' : cityCode
  param.areaCode = areaCode === undefined ? '' : areaCode
  param.userType = userType
  param.userId = userInfo.id
  return param
}

/**
 * 如果是 运维用户 查询当前用户是否是 营业厅用户
 * @param param
 */
export function getFacilitator(param) {
  var roleId = param.roleId
  if (roleId === 902) { // 移动
    return '1'
  }
  if (roleId === 901) { // 联通
    return '2'
  }
  if (roleId === 903) { // 电信
    return '3'
  }
}

/**
 * 根据字典名取字典
 */
export function getDicts(dictType) {
  var dict
  // dict = this.$store.state.dictionary.dict
  dict = JSON.parse(sessionStorage.getItem('dictdata'))
  if (!dict[dictType]) {
    // console.log('找不到字典类型：' + dictType)
    return []
  }
  return dict[dictType]
}

/**
 * 获取用户id
 */
export function getUserId() {
  return sessionStorage.getItem('userid')
}

/**
 * 页面跳转公共方法
 */
export function goto(path, params) {
  if (params) {
    this.$router.push({
      name: path,
      params: params
    })
  } else {
    this.$router.push({
      path: path
    })
  }
}

/**
 * 页面跳转公共方法（存储传递的id，在使用的页面从sessionStorage中获取）
 */
export function gotoid(path, id) {
  sessionStorage.setItem(path, id || '')
  this.$router.push({
    path: path
  })
}

/**
 * 根据用户权限id控制页面按钮显隐
 */
export function isViewBtn(code) {
  const resources = JSON.parse(sessionStorage.getItem('resToken'))
  return resources.indexOf(code.trim()) >= 0
}

/**
 * 时间格式处理
 * @param time {object || string}
 * @param cFormat  日期格式
 */
export function parseTime(time, cFormat) {
  if (!time) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 时间结果特殊处理
 * @param time {string}
 * @param option  日期格式
 */
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 根据传过来的字符串返回时间格式的字符串：年月日时分秒
 * 201410101224,如果大于13位就显示秒，小于13位就不显示秒
 * return 2014-10-10 12:24
 * @param da {String} 201410101224
 */
export function getDateString(da) {
  var year = da.substring(0, 4)
  var month = da.substring(4, 6)
  var day = da.substring(6, 8)
  var hour = da.substring(8, 10)
  var minute = da.substring(10, 12)
  var ordertime = ''
  if (da.length > 13) {
    var ss = da.substring(12, 14)
    ordertime = year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + ss
  } else {
    ordertime = year + '-' + month + '-' + day + '  ' + hour + ':' + minute
  }
  return ordertime
}

/**
 * 获取省市区JSON数据
 */
export function getCity() {
  return JSON.parse(sessionStorage.getItem('citytree'))
}

export function getCityByCode(province) {
  var retCityData = []
  var cityTreeData = JSON.parse(sessionStorage.getItem('citytree'))
  cityTreeData.forEach((item) => {
    var thisCityCode = item.cityCode
    if (province === thisCityCode) {
      retCityData.push(item)
    }
  })
  return retCityData
}

/**
 * 当前路由是否在路由列表中
 */
function isActive(route, _this) {
  return route.path === _this.$route.path || route.name === _this.$route.name
}

/**
 * 关闭当前路由
 */
export function closeTag(view, _this) {
  const viewObj = {
    path: view
  }
  _this.$store.dispatch('delVisitedViews', viewObj).then((views) => {
    if (isActive(viewObj, _this)) {
      const latestView = views.slice(-1)[0]
      if (latestView) {
        _this.$router.push(latestView.path)
      } else {
        _this.$router.push('/')
      }
    }
  })
}

/**
 * 关闭当前路由并跳转到目标页面
 * @param path {String} 当前要关闭的路由地址
 * @param _this {Object} 当前页面对象
 * @param toPath {String} 要跳转的目标路由地址
 * @param id {String} 跳转目标页面携带的参数
 */
export function closePath(path, _this, toPath, id) {
  closeTag(path, _this)
  setTimeout(() => {
    this.$gotoid(toPath, id || '')
  }, 1)
}

/*
 * 金额格式化 千分位
 */
export function getThousandNum(num) {
  return num.toString().replace(/\d+/, function(n) { // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) { // 对整数部分添加分隔符
      return $1 + ','
    })
  })
}

/*
 * 金额千位分割 加逗号
 */
export function thousSplit(val) {
  val = val.replace(/\s+/g, '').replace(/[\s|\~|`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\|\[|\]|\{|\}|\;|\:|\"|\'|\。|\,|\<|\，|\>|\/|\?]/g, '')
  const re = /\d{1,3}(?=(\d{3})+$)/g
  const n1 = val.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2, s3) {
    return s1.replace(re, '$&,') + s2
  })
  return n1
}

// 格式化时间
export function handlerDateTime(dateTime) {
  if (!dateTime) {
    return ''
  }
  if (dateTime.indexOf('-') !== -1) {
    return dateTime
  } else {
    if (dateTime.substring(0, 1) === '0') {
      return ''
    }
    let str = ''
    if (dateTime.length >= 4) {
      str = dateTime.substring(0, 4)
    }
    if (dateTime.length >= 6) {
      str += '-' + dateTime.substring(4, 6)
    }
    if (dateTime.length >= 8) {
      str += '-' + dateTime.substring(6, 8)
    }
    if (dateTime.length >= 10) {
      str += ' ' + dateTime.substring(8, 10)
    }
    if (dateTime.length >= 12) {
      str += ':' + dateTime.substring(10, 12)
    }
    if (dateTime.length >= 14) {
      str += ':' + dateTime.substring(12, 14)
    }
    return str
  }
}
// 把字符串转换成数字流
export function str2ArrBuf(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  } else {
    const buf = new Array(s.length)
    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
}

export function resetSetItem(key, newVal) { // sessionStorage监听事件
  // 创建一个StorageEvent事件
  var newStorageEvent = document.createEvent('StorageEvent')
  const storage = {
    setItem: function(k, val) {
      sessionStorage.setItem(k, val)

      // 初始化创建的事件
      newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)

      // 派发对象
      window.dispatchEvent(newStorageEvent)
    }
  }
  return storage.setItem(key, newVal)
}

// 绘制水印
export function drawWaterMark() {
  if (sessionStorage.getItem('userInfo')) {
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    var str1 = userInfo.realName
    if (str1.length > 6) { // 大于6位的姓名，只显示前五个字
      str1 = str1.substring(0, 5) + '...'
    }
    var str2 = userInfo.userName
    var str3 = this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    str3 = str3.replace(/-/g, '.')
    var str4 = sessionStorage.getItem('currentIp') || ''
    var str4Arr = str4.split('.') // 将ip分为四段，最后一位前面加空格，第一位后面加空格，中间的两边加空格
    // for (let index = 0; index < str4Arr.length; index++) {
    // var item = str4Arr[index]
    // if (index < 3) {
    //   str4Arr[index] = item + '.'
    // }
    // if (index === 3) {
    //   if (item.length === 1) {
    //     str4Arr[index] = '    ' + item
    //   } else if (item.length === 2) {
    //     str4Arr[index] = '  ' + item
    //   }
    // } else if (index === 0) {
    //   if (item.length === 1) {
    //     str4Arr[index] = item + '    '
    //   } else if (item.length === 2) {
    //     str4Arr[index] = item + '  '
    //   }
    // } else {
    //   if (item.length === 1) {
    //     str4Arr[index] = '  ' + item + '  '
    //   } else if (item.length === 2) {
    //     str4Arr[index] = ' ' + item + ' '
    //   }
    // }
    // }
    // str4 = str4Arr.join('.').replace(/\./g, ' . ')
    this.$Watermark.set(str1, str2, str3, str4Arr[0], str4Arr[1], str4Arr[2], str4Arr[3])
  }
}

// echart切换为数据视图时自定义
export function echartOptionToContent(opt) {
  const axisData = opt.xAxis[0].data // 坐标数据
  const series = opt.series // 折线图数据
  let tdHeads = '<td  style="padding: 0 10px">时间</td>' // 表头
  let tdBodys = '' // 数据
  series.forEach(function(item) {
    // 组装表头
    tdHeads += `<td style="padding: 0 10px">${item.name}</td>`
  })
  let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center;width:90%;line-height:30px;"><tbody><tr>${tdHeads} </tr>`
  for (let i = 0, l = axisData.length; i < l; i++) {
    for (let j = 0; j < series.length; j++) {
      // 组装表数据
      tdBodys += `<td>${series[j].data[i]}</td>`
    }
    table += `<tr><td style="padding: 0 10px;">${axisData[i]}</td>${tdBodys}</tr>`
    tdBodys = ''
  }
  table += '</tbody></table>'
  return table
}

// 通过value和数组 取当前选中的label
export function getLabelByValue(value, array) {
  var result = ''
  array.forEach(item => {
    if (item.value === value) {
      result = item.label
    }
  })
  return result
}

// 开始时间和结束时间 是否可选限制
export function pickerOptionChange(val, pickerName, type) {
  if (type === 'end') {
    return Object.assign({}, pickerName, {
      disabledDate: (time) => {
        return (time.getTime() < new Date(val).getTime() - 86400000) || (time.getTime() > Date.now())
      }
    })
  } else if (type === 'start') {
    return Object.assign({}, pickerName, {
      disabledDate: (time) => {
        return (time.getTime() > new Date(val).getTime()) || (time.getTime() > Date.now())
      }
    })
  } else if (type === 'default') {
    return Object.assign({}, pickerName, {
      disabledDate: (time) => {
        return time.getTime() > Date.now() // 今天之前的时间不可选
      }
    })
  }
}

export function setCurrentUser(param) {
  const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
  const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  param.creationId = curUser.id
  param.creationName = curUser.realName
  param.areaCode = curDept.areaCode
  param.belongDepCode = curDept.depCode
  param.belongDepName = curDept.depName
  param.depType = curDept.depType
  return param
}

export function buildTime(time) {
  var secondTime = parseInt(time) // 秒
  var minuteTime = 0 // 分
  var hourTime = 0 // 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60)
    }
  }
  var result = '' + parseInt(secondTime) + '秒'
  if (minuteTime > 0) {
    result = '' + parseInt(minuteTime) + '分' + result
  }
  if (hourTime > 0) {
    result = '' + parseInt(hourTime) + '小时' + result
  }
  return result
}
