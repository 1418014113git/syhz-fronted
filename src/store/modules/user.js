import { login, logout, getInfo } from '@/api/login'
import {
  getToken,
  setToken,
  // removeToken,
  getRefreshToken,
  setRefreshToken,
  // removeRefreshToken,
  getUserToken,
  setUserToken,
  // removeUserToken,
  getMenuToken,
  setMenuToken,
  // removeMenuToken,
  getResToken,
  setResToken,
  // removeResToken,
  getAppToken,
  // setAppToken,
  // removeAppToken,
  getDepToken,
  setDepToken,
  // removeDepToken,
  getRoleToken,
  setRoleToken,
  // removeRoleToken,
  setUserInfo
  // removeUserInfo
} from '@/utils/auth'
import { handleMenu, handleRes, setAppMenus } from '@/utils/menus'

const user = {
  state: {
    token: getToken(),
    refreshToken: getRefreshToken(),
    userToken: getUserToken(),
    name: '',
    avatar: '',
    roles: getRoleToken(), // 角色列表
    apps: getAppToken(), // 应用列表
    departments: getDepToken(), // 部门列表
    menus: getMenuToken(), // 菜单列表
    resources: getResToken(), // 资源列表
    userId: '' // 当前用户ID
    // roleCodeList: ['syh_admin']
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refreshToken = token
    },
    SET_USER_TOKEN: (state, token) => {
      state.userToken = token
    },
    SET_NAME: (state, name) => {
      sessionStorage.setItem('realName', name)
      state.name = name
    },
    SET_ID: (state, userId) => {
      sessionStorage.setItem('userId', userId)
      state.userId = userId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      // if (roles) {
      //   sessionStorage.setItem('roleCode', roles[0].roleCode)
      // } else {
      //   sessionStorage.setItem('roleCode', roles)
      // }
      sessionStorage.setItem('roles', JSON.stringify(roles))
      state.roles = roles
    },
    // SET_APPS: (state, apps) => {
    //   state.apps = apps
    // },
    SET_DEPS: (state, deps) => {
      state.departments = deps
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_RES: (state, resources) => {
      state.resources = resources
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          sessionStorage.setItem('userpass', userInfo.password)
          sessionStorage.setItem('username', username)
          if (data.accessToken) {
            setToken(data.accessToken)
            commit('SET_TOKEN', data.accessToken)

            setRefreshToken(data.refreshToken)
            commit('SET_REFRESH_TOKEN', data.refreshToken)

            setUserToken(data.userToken)
            commit('SET_USER_TOKEN', data.userToken)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    UKLogin({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        const data = userInfo
        if (userInfo && userInfo.userName) {
          const username = userInfo.userName.trim()
          sessionStorage.setItem('username', username)
        }
        if (data.accessToken) {
          setToken(data.accessToken)
          commit('SET_TOKEN', data.accessToken)

          setRefreshToken(data.refreshToken)
          commit('SET_REFRESH_TOKEN', data.refreshToken)

          setUserToken(data.userToken)
          commit('SET_USER_TOKEN', data.userToken)
        }
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        const param = {
          token: state.userToken
        }
        getInfo(param).then(response => {
          const data = response.data
          if (data) { // 验证返回的
            const roles = data.roles
            setRoleToken(roles)
            commit('SET_ROLES', roles) // 角色列表
            const deps = data.deps
            const depStr = JSON.stringify(deps)
            setDepToken(depStr)
            commit('SET_DEPS', depStr) // 部门列表
            data.menus.forEach(function(item) {
              if (item.menuName === '要素查询') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '业务查询') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '关联查询') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '新谷查询') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '从案到人分析') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '从人到案分析') {
                item.url = 'http://znjs.gat.nm'
              } else if (item.menuName === '人案关联引擎') {
                item.url = 'http://znjs.gat.nm'
              }
            })
            const menus = handleMenu(data.menus)
            sessionStorage.setItem('menusData', JSON.stringify(data.menus))
            // const apps = handleApp(data.apps)
            // setAppToken(apps)
            // commit('SET_APPS', apps) // 应用列表
            const menuData = setAppMenus(menus)
            setMenuToken(menuData)
            commit('SET_MENUS', menuData) // 菜单列表
            const resources = handleRes(data.resources)
            setResToken(resources)
            commit('SET_RES', resources) // 资源列表
            setUserInfo(JSON.stringify(data.user))
            commit('SET_ID', data.user.id)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.user.realName) // 昵称
          commit('SET_AVATAR', data.user.realName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      const params = {
        userId: sessionStorage.getItem('userId')
      }
      return new Promise((resolve, reject) => {
        logout(params)
          .then(() => {
            sessionStorage.clear()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        sessionStorage.clear()
        resolve()
      })
    }
  }
}

export default user
