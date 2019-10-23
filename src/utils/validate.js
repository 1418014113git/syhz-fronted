/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'kaven', 'editor', 'syh']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function identityCodeValid(code) {
  const city = {
    11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 '
  }
  let pass = true
  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    pass = false
  } else {
    if (code.length === 18) {
      code = code.split('')
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      const last = parity[sum % 11]
      if (String(last) !== String(code[17])) {
        pass = false
      }
    }
  }
  return pass
}

export function validatePhone(rule, value, callback) {
  const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  if (rule.required) {
    if (value === '' || value === undefined) {
      return callback(new Error('请输入手机号'))
    }
  }
  if (value !== '' && value !== undefined) {
    if (value.replace(/\s/g, '') === '') {
      return callback(new Error('不能输入纯空格'))
    } else if (!reg.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

export function validateBankCard(rule, value, callback) {
  const reg = /^([1-9]{1})(\d{14}|\d{18})$/
  if (rule.required) {
    if (value === '' || value === undefined) {
      return callback(new Error('请输入银行卡号码'))
    }
  }
  if (value !== '' && value !== undefined) {
    if (value.replace(/\s/g, '') === '') {
      return callback(new Error('不能输入纯空格'))
    } else if (!reg.test(value)) {
      return callback(new Error('银行卡号码输入不合法'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * 验证身份证号
 */
export function validateIdCard(rule, num, callback) {
  if (rule.required) {
    if (!num) {
      return callback(new Error('请输入身份证号码！'))
    }
  } else if (!num) {
    return callback()
  }
  num = num.toUpperCase()
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
    // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
    return callback(new Error('请输入正确的身份证号码！'))
  }
  // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  // 下面分别分析出生日期和校验位
  var len, re
  len = num.length
  if (len === 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    var arrSplit = num.match(re)
    // 检查生日日期是否正确
    var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
    var bGoodDay
    bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
    if (!bGoodDay) {
      // alert('输入的身份证号里出生日期不对！')
      return callback(new Error('请输入正确的身份证号码！'))
    } else {
      // 将15位身份证转成18位
      // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var nTemp = 0
      num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
      for (var i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i]
      }
      num += arrCh[nTemp % 11]
      return callback()
    }
  }
  if (len === 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    var arrSplits = num.match(re)
    // 检查生日日期是否正确
    var dtmBirths = new Date(arrSplits[2] + '/' + arrSplits[3] + '/' + arrSplits[4])
    var bGoodDay1
    bGoodDay1 = (dtmBirths.getFullYear() === Number(arrSplits[2])) && ((dtmBirths.getMonth() + 1) === Number(arrSplits[3])) && (dtmBirths.getDate() === Number(arrSplits[4]))
    if (!bGoodDay1) {
      return callback(new Error('请输入正确的身份证号码！'))
    } else {
      // 检验18位身份证的校验码是否正确。
      // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum
      var arrInts = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var arrChs = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var nTemps = 0
      for (var j = 0; j < 17; j++) {
        nTemps += num.substr(j, 1) * arrInts[j]
      }
      valnum = arrChs[nTemps % 11]
      if (valnum !== num.substr(17, 1)) {
        // alert('18位身份证的校验码不正确！应该为：' + valnum)
        return callback(new Error('请输入正确的身份证号码！'))
      }
      return callback()
    }
  }
  return callback(new Error('请输入正确的身份证号码！'))
}

export const regEnCnNumber = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
export const regNumber = /^\d+(\.\d{1,2})?$/
export const regCn = /^[\u4e00-\u9fa5]+$/
export const regEn = /^[A-Za-z]+$/
export const regEnNumber = /^[A-Za-z0-9]+$/
export const regCnNumber = /^[0-9\u4e00-\u9fa5]+$/
export const regEmail = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,5}$/
export const regQQ = /^[1-9][0-9]{4,}$/
export const regWx = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
export const regAddress = /^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/
export const regEnCode = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/
export const regCnCode = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/
export const regW = /^\w$/
export const regCode = /[！@#￥%……&]/
export const regCnName = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/ // 判断是否包含生僻字的中文姓名
export const regIp = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
