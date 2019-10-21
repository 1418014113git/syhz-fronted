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
