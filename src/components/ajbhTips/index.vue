<template>
<!-- 所有用到案件编号查询的组件 -->
  <ul class="ajbhTips">
    <i class="el-icon-close" @click="close"></i>
    <li v-for="(item,index) in list" :key="index" @click="toPage(item.url,index)">{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  props: ['ajbh', 'id', 'interfaceType', 'isRl', 'source'],
  data() {
    return {
      curIndexs: 0, // 导航栏当前被点击项的索引值。默认是0
      list: [
        { name: '信息检索' },
        { name: '关系挖掘' },
        { name: '全息档案' },
        { name: '地图分析' }
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
        case 0: // 信息检索---带着案件编号去个性化查询（所有）
          if (this.id) {
            if (this.isRl) {
              this.$router.push({
                path: '/comanalysis/perserch', query: { ajbh: this.ajbh, id: this.id, source: this.source, isRl: this.isRl } // 传递案件id
              })
            } else {
              this.$router.push({
                path: '/comanalysis/perserch', query: { ajbh: this.ajbh, id: this.id, source: this.source } // 传递案件id
              })
            }
          } else if (this.ajbh) {
            if (this.interfaceType) {
              this.$router.push({
                path: '/comanalysis/perserch', query: { ajbh: this.ajbh, source: this.source, interfaceType: this.interfaceType } // 传递案件编号
              })
            } else if (this.isRl) {
              this.$router.push({
                path: '/comanalysis/perserch', query: { ajbh: this.ajbh, source: this.source, isRl: this.isRl } // 传递案件编号
              })
            }
          }
          break
        case 1: // 关系挖掘--跳转关系挖掘页面
          if (this.id) {
            if (this.isRl) {
              this.$router.push({
                path: '/mesh', query: { type: '2', bm: this.ajbh, id: this.id, source: this.source, isRl: this.isRl } // 传递案件id
              })
            } else {
              this.$router.push({
                path: '/mesh', query: { type: '2', bm: this.ajbh, id: this.id, source: this.source } // 传递案件id
              })
            }
          } else if (this.ajbh) {
            if (this.interfaceType) {
              this.$router.push({
                path: '/mesh', query: { type: '2', bm: this.ajbh, source: this.source, interfaceType: this.interfaceType } // 传递案件编号
              })
            } else if (this.isRl) {
              this.$router.push({
                path: '/mesh', query: { type: '2', bm: this.ajbh, source: this.source, isRl: this.isRl } // 传递案件编号
              })
            }
          }
          break
        case 2: // 全息档案--跳转案件档案v2.0新版页面
          if (this.id) {
            if (this.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { id: this.id, isRl: this.isRl } // 传递案件id
              })
            } else {
              this.$router.push({
                path: '/caseFile/index', query: { id: this.id } // 传递案件id
              })
            }
          } else if (this.ajbh) {
            if (this.interfaceType) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: this.ajbh, interfaceType: this.interfaceType } // 传递案件编号
              })
            } else if (this.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: this.ajbh, isRl: this.isRl } // 传递案件编号
              })
            }
          }
          break
        case 3: // 地图分析--跳转高危地区案发分析页面
          if (this.id) {
            if (this.isRl) {
              this.$router.push({
                path: '/comanalysis/highriskarea', query: { id: this.id, isRl: this.isRl, source: this.source } // 传递案件id
              })
            } else {
              this.$router.push({
                path: '/comanalysis/highriskarea', query: { id: this.id, source: this.source } // 传递案件id
              })
            }
          } else if (this.ajbh) {
            if (this.interfaceType) {
              this.$router.push({
                path: '/comanalysis/highriskarea', query: { ajbh: this.ajbh, interfaceType: this.interfaceType } // 传递案件编号
              })
            } else if (this.isRl) {
              this.$router.push({
                path: '/comanalysis/highriskarea', query: { ajbh: this.ajbh, isRl: this.isRl } // 传递案件编号
              })
            }
          }
          break
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ajbhTips{
  width: 85px;
  max-height: 133px;
	text-align: right;
  font-size: 14px;
  color: #fff;
  background-color: #014169;
  z-index: 999;
  cursor: pointer;
  padding-bottom: 8px;
  border: 1px solid #00a0e9;
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

