<template>
  <el-menu
    mode="horizontal"
    :show-timeout="200"
    @select="handleSelect"
    text-color="#bce8fc"
    :default-active="activeIndex">
    <template v-for="item in menuData">
      <sidebar-item :item="item" :key="item.name"  :menuLength="menuDataLength" style="background-color: transparent; text-shadow: 0 0 2px #fff;"></sidebar-item>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuToken } from '@/utils/auth'
import { xglogin } from '@/api/login'

export default {
  components: {
    SidebarItem: {
      name: 'SidebarItem',
      props: {
        item: {
          type: Object,
          required: true
        },
        menuLength: {
          type: Number,
          default: 0
        }
      },
      // template: `<el-submenu :index="item.id+''" v-if="item.leaf==1">
      // <template slot="title"><span  slot="title">{{item.name}}</span></template>
      //     <template v-for="(child, index) in item.children">
      //     <sidebar-item :item="child"></sidebar-item>
      //   </template>
      // </el-submenu>
      // <el-menu-item  v-else :key="item.path" :index="item.path" >
      //   <span slot="title">{{item.name}}</span>
      // </el-menu-item>`
      template: `<el-submenu :index="item.id+''" v-if="item.leaf==1">
        <template slot="title"><span  slot="title">{{item.name}}</span></template>
          <template v-for="(child, index) in item.children">
            <sidebar-item :item="child"></sidebar-item>
          </template>
        </el-submenu>
          <el-tooltip  v-else-if="menuLength>5 && item.name.length>6"  effect="dark" :content="item.name" placement="top" >
            <el-menu-item :key="item.path" :index="item.path" class="ellips">
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-tooltip>
           <el-menu-item v-else :key="item.path" :index="item.path" >
             <span slot="title">{{item.name}}</span>
           </el-menu-item>
        `
    }},
  data() {
    return {
      activeIndex: '1',
      menuDataLength: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
    watchAppCode() {
      return this.$store.state.app.curAppCode
    }
  },
  watch: { // 监听state状态变化
    watchAppCode(tmpAppCode) {
      // console.log('tmpAppCode=', tmpAppCode)
      this.delwithMenus(tmpAppCode)
    }
  },
  methods: {
    handleSelect: function(key, keyPath) {
      if (key === 'http://znjs.gat.nm') {
        var ukStr = sessionStorage.getItem('uk')
        console.info('uk String value:' + ukStr)
        if (ukStr) {
          const para = {
            uk: ukStr
          }
          xglogin(para).then((res) => {
            console.info('uk return value:' + res.data)
            window.open(res.data)
          })
        } else {
          window.open(key)
        }
        return
      }
      this.$router.push({ path: key })
    },
    getAppMenus: function(name, menus) {
      var retMenus = []
      if (menus[name] !== undefined) {
        retMenus = menus[name].menus
      }
      return retMenus
    },
    delwithMenus(tmpAppCode) {
      var menuData = []
      var menuDatas = []
      menuDatas = this.getAppMenus(tmpAppCode, JSON.parse(getMenuToken()))
      if (menuDatas.length > 0 && menuDatas[0].children.length > 0) {
        this.menuDataLength = menuDatas[0].children.length
        menuDatas[0].children.forEach(function(item) {
          menuData.push(item)
        })
      }
      this.$store.dispatch('MenuData', menuData)
    },
    getAppCode() {
      var tmpAppCode = localStorage.getItem('curAppCode')
      if (tmpAppCode) {
        this.delwithMenus(tmpAppCode)
      }
    }
  },
  mounted() {
    this.getAppCode() // 初始化页面，根据获取到的curAppCode，渲染对应页面的导航菜单数据
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ellips {
  width: 120px;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
