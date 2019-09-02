<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-inner">
      <el-breadcrumb-item :to="{path:'/portal'}"  @click.native="removeItem">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in routeMatched" :key="item.path">
        <span>{{item.name}}</span>
      </el-breadcrumb-item>
      <!-- <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect" @click.native="removeItem">{{item.name}}</span>
        <router-link v-else :to="item.redirect||item.path"  @click.native="removeItem">{{item.name}}</router-link>
      </el-breadcrumb-item> -->
	</el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    routeMatched: function() {
      return this.$route.matched.filter(function(item) {
        return item.name !== '首页'
      })
    }
  },
  mounted() {
    // console.log('menuData', this.menuData)
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name) {
        matched = [{ path: '/portal', name: '食药环' }].concat(matched)
      }
      this.levelList = matched
    },
    removeItem() {
      var storage = window.sessionStorage
      for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i)
        // var value = storage.getItem(key)
        if (key && key.indexOf('/') > -1) {
          sessionStorage.removeItem(key) // 清除sessionStorage里以路由为key的数据。
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 16px;
  line-height: 50px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
