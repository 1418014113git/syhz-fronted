const logView = false
const parentId = -1
export function handleMenu(menus) {
  // var menuData = menus
  // isLog('menuData', menuData)
  // var menuNode = []

  // menuItemData(menuData, parentId, menuNode)
  // isLog('menuNode', menuNode)

  // menuNode.forEach(function(item) {
  //   var index = menuNode.indexOf(item)
  //   var id = item.id
  //   menuItemChildData(menuData, id, item)
  //   menuNode[index] = item
  // })

  // isLog('menuNode1', menuNode)

  // // var setMenuData = setMenu(menuNode)
  // return JSON.stringify(menuNode)
  // const _this = this
  const newMenuData = []
  menus.forEach(item => {
    if (item['parentId'] === parentId) {
      var menuObj = menusData(item)
      newMenuData.push(buildChildren(menuObj, menus))
    }
  })
  return JSON.stringify(newMenuData)
}
export function buildChildren(parent, data) {
  const newChildren = []
  data.forEach(item => {
    var menuObj = menusData(item)
    if (parent.id === item['parentId']) {
      newChildren.push(buildChildren(menuObj, data))
    }
  })
  if (newChildren.length > 0) {
    parent.children = newChildren
    parent.leaf = 1
  }
  return parent
}

export function setMenu(menuNode) {
  var menuData = []
  for (var i in menuNode) {
    var item = menuNode[i]
    menuData.push(item)
  }
  return menuData
}

export function menuItemData(menuData, parentId, menuNode) {
  menuData.forEach(function(item) {
    var thisParentId = item.parentId
    if (thisParentId === parentId) {
      item.children = []
      var menuObj = menusData(item)
      menuNode.push(menuObj)
    }
  })
  return menuNode
}

export function menuItemChildData(menuData, parentId, menuNode) {
  menuData.forEach(function(item) {
    var thisParentId = item.parentId
    if (thisParentId === parentId) {
      item.children = []
      menuNode.leaf = 1
      var menuObj = menusData(item)
      menuNode.children.push(menuObj)
    }
  })
  return menuNode
}

export function menusData(menuItem) {
  var menuObj = {}
  menuObj.menuCode = menuItem.menuCode
  menuObj.id = menuItem.id
  menuObj.name = menuItem.menuName
  menuObj.icon = 'example'
  menuObj.path = menuItem.url
  menuObj.leaf = 0
  // menuObj.appId = menuItem.appId
  menuObj.sort = menuItem.sorted
  menuObj.parentId = menuItem.parentId
  menuObj.children = menuItem.children
  return menuObj
}

export function getAppMenus(name, menus) {
  var retMenus = []
  if (menus[name] !== undefined) {
    // console.log('menusData', menus[name])
    retMenus = menus[name].menus
  }
  return retMenus
}

export function setAppMenus(menus) {
  var menusData = JSON.parse(menus)
  const appObj = {}
  for (var i = 0; i < menusData.length; i++) {
    if (menusData[i].parentId === -1) {
      if (!appObj[menusData[i].menuCode]) {
        appObj[menusData[i].menuCode] = {}
        appObj[menusData[i].menuCode].menus = []
        appObj[menusData[i].menuCode].menuCode = menusData[i].menuCode
      }
    }
    var code = menusData[i].menuCode.substring(0, 1)
    if (appObj[code].menuCode === code) {
      appObj[code].menus.push(menusData[i])
    }
  }
  return JSON.stringify(appObj)
}

export function handleApp(appData) {
  const appObj = {}
  appData.forEach(function(item) {
    var appCode = item.appCode
    item.menus = []
    appObj[appCode] = item
  })
  return JSON.stringify(appObj)
}

export function handleRes(resData) {
  /**
    const resNode = {}
   resData.forEach(function(item) {
    var thisId = item.id
    resNode[thisId] = item
  })
   */
  return JSON.stringify(resData)
}

export function isLog(name, data) {
  if (logView) {
    // console.log(name, data)
  }
}
