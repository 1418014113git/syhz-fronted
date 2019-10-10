<template>
  <div class="AnjianBox">
    <el-carousel trigger="click" class="echart_carousel" indicator-position="none"  arrow="never">
      <el-carousel-item v-for="item in ajData" :key="item.id">
        <person v-if="item.content=='person'" :ajlistData='ajlistData'></person>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import Person from './Person'
export default {
  data() {
    return {
      ajlistData: {
        zhrs: 0,
        xsjl: 0,
        dbrs: 0,
        qbhs: 0
      },

      ajData: [
        { 'id': 1, 'title': '案件1', 'content': 'person' }
      ]
    }
  },
  components: {
    Person
  },
  methods: {
    query() {
      this.$query('ryclcscount', {}).then(response => {
        var datas = response.data
        datas.forEach(item => { // 9996 刑事拘留 9997 取保候审 9999 逮捕 1001 抓获（需求155）
          if (item.cslb === '9996' && item.count) {
            this.ajlistData.xsjl = item.count
          } else if (item.cslb === '9997' && item.count) {
            this.ajlistData.qbhs = item.count
          } else if (item.cslb === '9999' && item.count) {
            this.ajlistData.dbrs = item.count
          } else if (item.cslb === '1001' && item.count) {
            this.ajlistData.zhrs = item.count
          }
        })
      })
    }
  },
  created() {
    this.query()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss"  scoped>
.AnjianBox {
  width: 100%;
  height: 100%;
}
</style>
