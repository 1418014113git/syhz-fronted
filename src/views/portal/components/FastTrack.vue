<template>
<div class="fastTrack">
  <div class="trackBox" :class="{'showShadow':isShowList}">
      <div class="kstdtit">快速通道</div>
      <ul class="trackList" :class="{'isExpend':isShowList}">
        <li class="kstdcon"  v-for="(item,index) in MenuData"  :key='index'>
          <span @click="collect(item)">
            <img  class="collect" src="/static/image/portal_images/noCollect.png"  v-show="!item.isCollect" >
            <img  class="collect" src="/static/image/portal_images/collect.png" v-show="item.isCollect">
          </span>
          <router-link :to="item.path" style="color:#333;">{{item.name}}</router-link>
        </li>
      </ul>
    <img src="/static/image/portal_images/flexible.png" @click="toggleFold" class="toggleFold" :class="{'is-active':isActive}">
  </div>
</div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        name: sessionStorage.getItem('realName'), // 用户名
        isActive: false, // 快速通道展开收起按钮的旋转控制
        isShowList: false, // 是否显示隐藏的快速通道列表
        MenuData: [], // 存储快递通道菜单数据
        userId: sessionStorage.getItem('userId') // 获取userId
      }
    },
    methods: {
      init() { // 查询收藏列表
        var params = { userId: this.userId }
        this.$query('follow', params).then((response) => {
          if (response.data && response.data.length > 0) {
            this.dealMenData(response.data) // 如果有收藏菜单，则对权限菜单进行处理
          } else {
            this.MenuData = this.getAllMenus() // 否则展示全部菜单
          }
        })
      },
      dealMenData(collectData) { // 将查询出来的收藏列表与从sessionStorage里拿出的权限菜单比较，若权限菜单里含有收藏列表的菜单，则将其删除，然后将收藏列表数据添加到权限菜单列表前面，优先显示。
        var allMenData = this.getAllMenus() // 获取处理后的权限菜单列表
        var delWithCollectData = []
        for (var i = 0; i < collectData.length; i++) {
          for (var j = 0; j < allMenData.length; j++) {
            if (collectData[i].path === allMenData[j].path) {
              collectData[i].isCollect = true
              delWithCollectData.push(collectData[i]) // 将含有收藏菜单的数据push到新数组里。
              allMenData.splice(j, 1) // 如何权限菜单中的某个菜单id和收藏菜单的id相等，就删除该菜单
            }
          }
        }
        var newDelWithData = delWithCollectData.concat(allMenData) // 将权限菜单数据拼接到收藏菜单数据后面
        this.MenuData = newDelWithData
      },
      getAllMenus() {
        const menuData = JSON.parse(sessionStorage.getItem('menusData'))
        const newMenuData = []
        for (var i = 0; i < menuData.length; i++) {
          var menuList = {}
          if (menuData[i].children && menuData[i].children.length > 0) {
            var children = menuData[i].children
            for (var j = 0; j < children.length; j++) {
              menuList = {
                name: children[j].name,
                path: children[j].path,
                id: children[j].id,
                isCollect: false
              }
            }
          } else {
            menuList = {
              name: menuData[i].menuName,
              path: menuData[i].url,
              id: menuData[i].id,
              isCollect: false
            }
          }
          newMenuData.push(menuList)
        }
        return newMenuData
      },
      goOut() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      },
      toggleFold() {
        this.isActive = !this.isActive
        this.isShowList = !this.isShowList
      },
      // 添加&收藏
      collect(item) {
        var params = {}
        if (item.isCollect) { // 取消收藏
          params = { id: item.id }
          this.$remove('follow/' + item.id, '').then((response) => {
            item.isCollect = false
            this.$message({
              message: '取消收藏',
              type: 'success'
            })
          })
        } else { // 添加收藏
          params = {
            name: item.name,
            path: item.path,
            sort: 0, // 固定不定
            enable: 0, // 固定不定
            userId: this.userId
          }
          this.$save('follow', params).then((response) => {
            item.isCollect = true
            this.$message({
              message: '添加收藏',
              type: 'success'
            })
          })
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .fastTrack{
   width: 100%;
   z-index: 100;
   position: relative;
   left: 0;
   top: -39px;
   .trackBox{
     display: flex;
     width: 75%;
     margin: 0 auto;
     background: #fff;
     border-top: 1px solid #cacbd0;
     position: relative;
     .kstdtit{
       padding: 11px 13px 6px 10px;
       font-size: 15px;
       color: #1E98D2;
       letter-spacing: 2px;
     }
      .trackList{
      height: 40px;
      overflow: hidden;
      flex: 1;
      padding: 5px 0;
      transition: .38s;
      .kstdcon{
        float: left;
        padding: 7px 15px;
        cursor: pointer;
         &:hover{
          color: #1E98D2;
        }
      }
    }
   }

   .toggleFold {
      display: inline-block;
      cursor: pointer;
      width: 20px;
      height: 20px;
      position: absolute;
      bottom:10px;
      right: 8px;
      transition: .38s;
    }
    .is-active {
      transform: rotate(180deg);
    }
    .collect{
      width: 15px;
      margin-top: -3px;
    }
  }
  .showShadow{
    box-shadow:0 2px 2px #ddd;
  }
  .isExpend{
    height: 190px !important;
  }
  @media only screen and (max-width: 1025px) {
    .kstdcon{
      padding: 7px 13px !important;
    }
  }
</style>
