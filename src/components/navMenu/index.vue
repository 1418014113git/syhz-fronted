<template>
<div class="navMenu">
  <el-menu class="navMenuBox"
      mode="horizontal"
      :show-timeout="200"
      text-color="#fff"
      background-color="transparent"
      >
          <template v-for="item in rightfixeddata">
      <sidebar-item :item="item" :key="item.name"  @click.native="clickNavList(item)"></sidebar-item>
          </template>
    </el-menu>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    SidebarItem: {
      name: 'SidebarItem',
      props: {
        item: {
          type: Object,
          required: true
        }
      },
      template: `<el-menu-item  :key="item.path" :index="item.path">
        <img v-if="item.icon" :src="item.icon" class="navIcon"></img>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>`
    }
  },
  data() {
    return {
      // menuData: [
      //   { 'id': 1, 'name': '工作台', 'path': '/portal', 'leaf': 0 },
      //   { 'id': 2, 'name': '综合研判', 'path': '/synthesizeAnalysis', 'leaf': 0 },
      //   { 'id': 3, 'name': '案件管理', 'path': '/caseManage', 'leaf': 0 },
      //   { 'id': 4, 'name': '专项任务', 'path': '/specialTasks', 'leaf': 0 },
      //   { 'id': 5, 'name': '检验鉴定', 'path': '/inspection', 'leaf': 0 },
      //   { 'id': 6, 'name': '情报分析', 'path': '/intellSystem', 'leaf': 0 },
      //   { 'id': 7, 'name': '办案指引', 'path': '/handlingGuide', 'leaf': 0 },
      //   { 'id': 8, 'name': '信息采集', 'path': '/inforCollection', 'leaf': 0 }
      // ]

    }
  },
  computed: {
    ...mapGetters([
      'rightfixeddata'
    ])
  },
  methods: {
    clickNavList(item) {
      const _this = this
      // console.info(item.name)
      // if (item.name === '信息查询') {
      //   // window.location.href = 'http://znjs.gat.nm'
      //   window.open('http://www.baidu.com')
      //   return
      // }
      _this.$router.push({ path: item.path })
      this.$store.dispatch('NavChangeApp', item.name)
      this.$store.dispatch('NavAppCode', item.appcode)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "src/styles/vars.scss";
.navMenu {
  width: 100%;
  height: 40px;
  position: absolute;
  left: 0;
  top: 275px;
  .navMenuBox {
    border: 1px solid #85cde0;
    background-image: url(/static/image/portal_images/navbg.png);
    background-repeat: no-repeat;
    background-size: 100% 40px;
    li {
      &:hover {
        background-color: #187aa8 !important;
      }
    }
  }
  .navIcon {
    width: 20px;
    margin-right: 4px;
  }
}
@media only screen and (max-width: 1367px) {
  .navMenu {
    top: 202px;
  }
  .navMenu .el-menu-item {
    padding: 0 14px !important;
    font-size: 16px;
  }
}
</style>

