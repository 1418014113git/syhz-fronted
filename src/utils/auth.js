
const AccessTokenKey = 'accessToken'
const RefreshTokenKey = 'refreshToken'
const UserToken = 'userToken'
const MenuToken = 'menuToken'
const ResToken = 'resToken'
const AppToken = 'appToken'
const DepToken = 'depToken'
const RoleToken = 'roleToken'
const UserInfo = 'userInfo'

export function getToken() {
  return sessionStorage.getItem(AccessTokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(AccessTokenKey, token)
}

export function removeToken() {
  return sessionStorage.setItem(AccessTokenKey, '')
}

export function getRefreshToken() {
  return sessionStorage.getItem(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return sessionStorage.setItem(RefreshTokenKey, refreshToken)
}

export function removeRefreshToken() {
  return sessionStorage.setItem(RefreshTokenKey, '')
}

export function getUserToken() {
  return sessionStorage.getItem(UserToken)
}

export function setUserToken(userToken) {
  return sessionStorage.setItem(UserToken, userToken)
}

export function removeUserToken() {
  return sessionStorage.setItem(UserToken, '')
}

export function getMenuToken() {
  return sessionStorage.getItem(MenuToken)
}

export function setMenuToken(menuToken) {
  return sessionStorage.setItem(MenuToken, menuToken)
}

export function removeMenuToken() {
  return sessionStorage.setItem(MenuToken, '')
}

export function getResToken() {
  return sessionStorage.getItem(ResToken)
}

export function setResToken(resToken) {
  return sessionStorage.setItem(ResToken, resToken)
}

export function removeResToken() {
  return sessionStorage.setItem(ResToken, '')
}

export function getAppToken() {
  return sessionStorage.getItem(AppToken)
}

export function setAppToken(appToken) {
  return sessionStorage.setItem(AppToken, appToken)
}

export function removeAppToken() {
  return sessionStorage.setItem(AppToken, '')
}

export function getDepToken() {
  return sessionStorage.getItem(DepToken)
}

export function setDepToken(depToken) {
  return sessionStorage.setItem(DepToken, depToken)
}

export function removeDepToken() {
  return sessionStorage.setItem(DepToken, '')
}

export function getRoleToken() {
  return sessionStorage.getItem(RoleToken)
}

export function setRoleToken(roleToken) {
  return sessionStorage.setItem(RoleToken, roleToken)
}

export function removeRoleToken() {
  return sessionStorage.setItem(RoleToken, '')
}
export function getUserInfo() {
  return sessionStorage.getItem(UserInfo)
}

export function setUserInfo(userInfo) {
  return sessionStorage.setItem(UserInfo, userInfo)
}

export function removeUserInfo() {
  return sessionStorage.setItem(UserInfo, '')
}

export function isResView(code) {
  var resData = JSON.parse(getResToken())
  var isView = false
  if (resData[code] !== undefined) {
    isView = true
  }
  return isView
}

export function isResDisabled(code) {
  var resData = JSON.parse(getResToken())
  var isView = true
  if (resData[code] !== undefined) {
    isView = false
  }
  return isView
}
