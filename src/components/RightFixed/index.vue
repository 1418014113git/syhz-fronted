<!--右侧固定浮层-->
<template>
  <div class="right-wrap">
    <div class="right-fixed" ref="rightFixed">
      <div @click="changesystem" @mouseover="overShow" @mouseout="outHide" >
        <span>切换</span>
        <span>系统</span>
      </div>
      <!--<div class="right-help" @click="help">帮助</div>-->
      <div @click="totop">
        <span>返回</span>
        <span>顶部</span>
      </div>
    </div>
    <!--hover浮层-->
    <ul class="rightHoverMenu" v-if="isShow"   @mouseover="overShow" @mouseout="outListHide">
      <li v-for="(item, index) in rightfixeddata" :key="index"  :class="{'active':curIndex === index}"  @click="clickHovList(index,item)">{{item.name}}</li>
    </ul>

</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isShow: false, // 是否显示浮层二级菜单
      curIndex: ''
    }
  },
  computed: {
    ...mapGetters([
      'istotop',
      'rightfixeddata'
    ])
  },
  mounted() {
  },

  methods: {
    changesystem() {
      // console.log('切换系统')
    },
    help() {
      const _this = this
      _this.$router.push({ path: '/404' })
    },
    totop() {
      // console.log('回到顶部')
      this.$store.dispatch('ToTop', 1)
      // console.log('点击totop提交状态', this.istotop)
    },
    overShow() {
      this.isShow = !this.isShow
    },
    outHide() {
      this.isShow = !this.isShow
    },
    outListHide() {
      this.isShow = !this.isShow
    },
    clickHovList(index, item) {
      this.curIndex = index
      this.isShow = false
      const _this = this
      _this.$router.push({ path: item.path })
      this.$store.dispatch('ChangeApp', item.name)
      this.$store.dispatch('AppCode', item.appcode)
    },
    overListShow() {
      this.isShow = !this.isShow
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/vars.scss';
.right-wrap{
  position: fixed;
  top:40%;
  right: 0;
  z-index: 999;
  .right-fixed {
    width: 38px;
    background: $color-primary;
    color: #fff;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    div{
      padding: 4px 0;
      &:hover{
        color: brown
      }
    }
    .right-help{
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
  }
  .rightHoverMenu{
    width: 85px;
    position: absolute;
    right: 38px;
    top: 0px;
    color: #fff;
    background: rgba(0, 89, 130, 1);
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #00a0e9;
    border-bottom: 0;
    cursor: pointer;
    li{
      padding: 4px 0;
      border-bottom: 1px solid #00a0e9;
       &:hover{
         color: #bce8fc;
      }
    }
  }
  .active{
    color: #E6A23C;
  }
}


</style>
