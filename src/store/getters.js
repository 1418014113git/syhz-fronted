const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  refreshToken: state => state.user.refreshToken,
  userToken: state => state.user.userToken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  istotop: state => state.app.istotop,
  rightfixeddata: state => state.app.rightfixeddata,
  curAppName: state => state.app.curAppName,
  curAppCode: state => state.app.curAppCode,
  menuData: state => state.app.menuData
}
export default getters

