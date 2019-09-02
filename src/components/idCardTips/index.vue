<template>
<!-- 所有用到身份证查询的身份证旁边的关系挖掘入口组件 -->
  <ul class="idCard">
    <i class="el-icon-close" @click="close"></i>
    <li v-for="(item,index) in list" :key="index" @click="toPage(item.url,index)">{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  props: ['cardId'],
  data() {
    return {
      curIndexs: 0, // 导航栏当前被点击项的索引值。默认是0
      list: [
        { name: '信息检索' },
        { name: '关系挖掘' },
        { name: '全息档案' },
        { name: '轨迹分析' },
        { name: '临时管控' }
      ]
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    showActive(index) {
      this.curIndex = index
    },
    close() {
      this.$emit('close', false)
    },
    toPage(url, index) {
      switch (index) {
        case 0: // 信息检索---带着身份证号去个性化查询（所有）
          this.$gotoid('/comanalysis/perserch', JSON.stringify({ idCard: this.cardId }))
          break
        case 1: // 关系挖掘--带着身份证号去关系挖掘
          this.$router.push({
            path: '/mesh', query: { type: 1, bm: this.cardId }
          })
          break
        case 2: // 全息档案--打开人员档案页面
          this.$router.push({
            path: '/personnelFile/index', query: { cardId: this.cardId }
          })
          break
        case 3: // 轨迹分析--轨迹分析页面（正在设计，暂不做，菜单有，点击提示建设中）
          this.$alert('建设中......', '提示', {
            confirmButtonText: '确定'
          })
          break
        case 4: // 临时管控--进入管控（正在设计，暂不做，菜单有，点击提示建设中）
          this.$alert('建设中......', '提示', {
            confirmButtonText: '确定'
          })
          break
        default:
          break
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.idCard{
  width: 90px;
  max-height: 168px;
	text-align: right;
  font-size: 14px;
  color: #fff;
  background-color: #014169;
  border: 1px solid #00a0e9;
  z-index: 999;
  cursor: pointer;
  padding-bottom: 5px;
  -moz-border-radius: 6px;
-webkit-border-radius: 6px;
 border-radius: 6px;
  li{
    line-height: 26px;
    text-align: center;
    &:hover {
      color: #00a0e9;
      background-color: #01355d;
    }
  }
  .el-icon-close{
    margin-right: 2px;
    margin-top: 4px;
    display: block;
  }
}
@media only screen and (max-width: 1367px){

}
</style>

