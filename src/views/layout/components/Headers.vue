<template>
  <div class="headers">
    <el-row>
      <!--左侧logo-->
      <el-col :span="7" class="logo">
        <img src="@/assets/header/mainhead.png" alt="">
			</el-col>
      <!--导航菜单区域-->
      <el-col :span="15">
        <sidebar class="sidebar-container"></sidebar>
      </el-col>
      <!--右侧用户登录区域-->
      <el-col :span="2">
        <el-dropdown class="avatar-container" trigger="hover">
          <div class="avatar-wrapper">
            <!--<img class="user-avatar" :src="avatar">-->
            <span  class="userinfo-inner">{{name}}</span>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/portal">
              <el-dropdown-item style="font-size:14px;">
                主页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item style="font-size:14px;" divided>
              <span @click="logout" style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './Sidebar'
export default {
  data() {
    return {
      name: sessionStorage.getItem('realName')
    }
  },
  components: {
    Sidebar
  },
  computed: {
    ...mapGetters([
      'logoname',
      'avatar'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/vars.scss';
.headers {
  width: 100%;
  height: 60px;
  // background: rgba(0, 89, 130, 0.7);
  background:url('../../../assets/header/navbg.png') no-repeat center center;
  background-size: 100% 100%;
  // border-bottom: 3px solid rgba(0, 160, 233, 0.7);
  // color: #bce8fc;
  .logo{
    width: 27.5% !important;
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    img{
      width: 325px;
      height: 28px;
    }
  }
  .avatar-container {
    height: 60px;
    display: inline-block;
    position: absolute;
    right: 15px;
    .avatar-wrapper {
      height: 100%;
      cursor: pointer;
      position: relative;
       .userinfo-inner{
      color: #bce8fc;
      font-size: 16px;
      display: inline-block;
      margin-top: 20px;
    }
     img{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 0px 10px;
        float: right;
      }

    .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .sidebar-container{
    li:hover,li>div:hover{
      // background: #005982 !important;
    }
  }
}
</style>

