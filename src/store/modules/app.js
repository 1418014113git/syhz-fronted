// import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: [],
    istotop: 0, // 是否回到顶部，0:否，1：是
    rightfixeddata: [
      // { 'name': '舆情分析', 'path': '/lyricalInfo/alarmInfo', 'appcode': 'A', 'icon': '/static/image/portal_images/zhyp.png', 'src': '/static/image/portal_newImg/zhyp.png' },
      // { 'name': '案件管理', 'path': '/caseManage', 'appcode': 'B', 'icon': '/static/image/portal_images/ajgl.png', 'src': '/static/image/portal_newImg/ajgl.png' },
      // { 'name': '基础业务', 'path': '/baseInfoCount/index', 'appcode': 'C', 'icon': '/static/image/portal_images/zxrw.png', 'src': '/static/image/portal_newImg/zxrw.png' },
      // { 'name': '刑嫌信息', 'path': '/inforCollection', 'appcode': 'D', 'icon': '/static/image/portal_images/xxcj.png', 'src': '/static/image/portal_newImg/xxcj.png' },
      // { 'name': '检验鉴定', 'path': '/inspection', 'appcode': 'E', 'icon': '/static/image/portal_images/jyjd.png', 'src': '/static/image/portal_newImg/jyjd.png' },
      // { 'name': '教育训练', 'path': '/handlingGuide/knowLedgeBase', 'appcode': 'F', 'icon': '/static/image/portal_images/bazy.png', 'src': '/static/image/portal_newImg/bazy.png' },
      // { 'name': '情报管理', 'path': '/intellSystem', 'appcode': 'G', 'icon': '/static/image/portal_images/qbcj.png', 'src': '/static/image/portal_newImg/qbhcfx.png' }
      { 'name': '案件管理', 'path': '/caseManage', 'appcode': 'B', 'icon': '/static/image/portal_newImg/ajgl_new.png', 'src': '/static/image/portal_newImg/ajgl_new.png' },
      { 'name': '情报管理', 'path': '/intellSystem', 'appcode': 'G', 'icon': '/static/image/portal_newImg/qbgl_new.png', 'src': '/static/image/portal_newImg/qbgl_new.png' },
      { 'name': '教育训练', 'path': '/handlingGuide/knowLedgeBase', 'appcode': 'F', 'icon': '/static/image/portal_newImg/jyxl_new.png', 'src': '/static/image/portal_newImg/jyxl_new.png' },
      { 'name': '基础业务', 'path': '/basicService/deptInfo/detail', 'appcode': 'C', 'icon': '/static/image/portal_newImg/jcyw_new.png', 'src': '/static/image/portal_newImg/jcyw_new.png' }
    ],
    menuIcons: ['xgcx', 'gxhcx', 'afqs', 'gwdqaffx', 'gfhyfx', 'whclgjfx', 'ztajmxfxyc', 'dyatslb', 'gfajlbtj', 'zdrylkgl', 'ajrl', 'ajlb', 'ajdb', 'ajxc',
      'qgxxc', 'zxrwlb', 'tjzxrw', 'zxrwfxzx', 'jyjdlb', 'sqjyjd', 'qgjyjdjgml', 'flfg', 'hybz', 'alzy', 'spwkt', 'xslb', 'xscj', 'xstjfx', 'hycj', 'rycj',
      'shzhzytj', 'dlrz', 'xtczrz'], // 功能导航全部菜单icon图标名称
    menuData: [], // 每个页面顶部导航菜单数据
    curAppName: '', // 当前应用标题
    curAppCode: '', // 当前应用编码
    clickAll: false, // 是否点击了导航菜单“全部”按钮
    reReqCollect: false, // 是否重新请求收藏列表接口
    ISshowWorkMenu: false, // 是否显示工作菜单编辑页
    personeltotop: '', // 人员档案升级版页面点击左侧区域，保存当前class值
    moduleClass: '', // 人员档案滑动右侧区域时，当当前模块距离顶部距离为0时，存储该class值
    ajdatotop: '', // 案件档案升级版页面点击左侧区域，保存当前class值
    ajmoduleClass: '' // 人员档案滑动右侧区域时，当当前模块距离顶部距离为0时，存储该class值
  },
  mutations: {
    TOTOP_STATUS: (state, status) => {
      state.istotop = status
    },
    RIGHT_FIXEDDATA: (state, ogjdata) => {
      state.rightfixeddata[ogjdata.index] = ogjdata.name
    },
    CHANGE_APP: (state, status) => {
      if (status !== state.curAppName) {
        localStorage.setItem('curAppName', status) // 存储到localStorage，避免页面刷新后，获取不到curAppCode
      }
      state.curAppName = status
    },
    APP_CODE: (state, ogjdata) => {
      if (ogjdata !== state.curAppCode) {
        localStorage.setItem('curAppCode', ogjdata) // 存储到localStorage，避免页面刷新后，获取不到curAppCode
      }
      state.curAppCode = ogjdata
    },
    NAVCHANGE_APP: (state, ogjdata) => {
      if (ogjdata !== state.curAppName) {
        localStorage.setItem('curAppName', ogjdata) // 存储到localStorage，避免页面刷新后，获取不到curAppCode
      }
      state.curAppName = ogjdata
    },
    NAVAPP_CODE: (state, ogjdata) => {
      if (ogjdata !== state.curAppCode) {
        localStorage.setItem('curAppCode', ogjdata) // 存储到localStorage，避免页面刷新后，获取不到curAppCode
      }
      state.curAppCode = ogjdata
    },
    MENU_DATA: (state, ogjdata) => {
      state.menuData = ogjdata
    },
    CLICK_ALL: (state, status) => {
      state.clickAll = status
    },
    REREQ_COLLECT: (state, status) => {
      state.reReqCollect = status
    },
    ISSHOW_WORKMENU: (state, status) => {
      state.ISshowWorkMenu = status
    },
    PERSONAL_TOTOP: (state, status) => {
      state.personeltotop = status
    },
    MOULE_CLASS: (state, status) => {
      state.moduleClass = status
    },
    AJDA_TOTOP: (state, status) => {
      state.ajdatotop = status
    },
    AJ_MOULE_CLASS: (state, status) => {
      state.ajmoduleClass = status
    }
  },
  actions: {
    ToTop: ({ commit }, status) => {
      commit('TOTOP_STATUS', status)
    },
    ChangeApp: ({ commit }, status) => {
      commit('CHANGE_APP', status)
    },
    AppCode: ({ commit }, ogjdata) => {
      commit('APP_CODE', ogjdata)
    },
    NavChangeApp: ({ commit }, ogjdata) => {
      commit('NAVCHANGE_APP', ogjdata)
    },
    NavAppCode: ({ commit }, ogjdata) => {
      commit('NAVAPP_CODE', ogjdata)
    },
    MenuData: ({ commit }, ogjdata) => {
      commit('MENU_DATA', ogjdata)
    },
    ClickAll: ({ commit }, status) => {
      commit('CLICK_ALL', status)
    },
    ReReqCollect: ({ commit }, status) => {
      commit('REREQ_COLLECT', status)
    },
    ISshowWorkMenu: ({ commit }, status) => {
      commit('ISSHOW_WORKMENU', status)
    },
    Personeltotop: ({ commit }, status) => {
      commit('PERSONAL_TOTOP', status)
    },
    MouleClass: ({ commit }, status) => {
      commit('MOULE_CLASS', status)
    },
    Ajdatotop: ({ commit }, status) => {
      commit('AJDA_TOTOP', status)
    },
    AjMouleClass: ({ commit }, status) => {
      commit('AJ_MOULE_CLASS', status)
    }
  }
}

export default app
