<template>
<!-- 案件进度 -->
  <div class="ajStatus" v-loading="loading">
    <el-row type="flex" class="ajStatusCont">
      <el-col v-for="(item,index) in statusData" :key="index">
         <div class="itemName">{{item.name}}</div>
         <img :src="item.icon">
         <div v-if="item.date" class="dateStyle">
           <div>{{item.date}}</div>
           <div v-if="item.time">{{item.time}}</div>
         </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['AjInfo', 'ajbh'],
  name: 'ajStatus',
  data() {
    return {
      ajInfo: {}, // 基础信息
      loading: false, // 页面加载进度条
      statusData: [ // 案件进度列表
        {
          type: 'BASJ',
          name: '报案',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'SLSJ',
          name: '受案',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'LARQ',
          name: '立案',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/la.png'
        },
        {
          type: 'PARQ',
          name: '破案',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/pa.png'
        },
        {
          type: 'YSQSRQ',
          name: '移诉',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'AJYSSJ',
          name: '一审',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'ESSJ',
          name: '二审',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'GDRQ',
          name: '归档',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        },
        {
          type: 'CZSJ',
          name: '操作时间',
          date: '',
          time: '',
          icon: '/static/image/caseFile_images/default.png'
        }
      ]
    }
  },
  watch: {
    ajbh(val) {
      this.loading = true
      this.ajInfo = {}
      if (val) {
        this.ajInfo = this.AjInfo
        this.getTime()
      }
    }
  },
  methods: {
    init() {
      if (this.ajbh) {
        this.loading = true
        this.ajInfo = this.AjInfo
        this.getTime()
      }
    },
    getTime() { // 获取案件状态对应的时间
      this.loading = false
      this.statusData.forEach(item => {
        if (item.type === 'BASJ') {
          var date1 = this.ajInfo.BASJ ? this.$handlerDateTime(this.ajInfo.BASJ) : ''
          if (date1) {
            item.date = date1.substring(0, 10)
            item.time = date1.length > 10 ? date1.substr(11) : ''
          }
        }
        if (item.type === 'SLSJ') {
          var date2 = this.ajInfo.SLSJ ? this.$handlerDateTime(this.ajInfo.SLSJ) : ''
          if (date2) {
            item.date = date2.substring(0, 10)
            item.time = date2.length > 10 ? date2.substr(11) : ''
          }
        }
        if (item.type === 'LARQ') {
          var date3 = this.ajInfo.LARQ ? this.$handlerDateTime(this.ajInfo.LARQ) : ''
          if (date3) {
            item.date = date3.substring(0, 10)
            item.time = date3.length > 10 ? date3.substr(11) : ''
          }
        }
        if (item.type === 'PARQ') {
          var date4 = this.ajInfo.PARQ ? this.$handlerDateTime(this.ajInfo.PARQ) : ''
          if (date4) {
            item.date = date4.substring(0, 10)
            item.time = date4.length > 10 ? date4.substr(11) : ''
          }
        }
        if (item.type === 'YSQSRQ') {
          var date5 = this.ajInfo.YSQSRQ ? this.$handlerDateTime(this.ajInfo.YSQSRQ) : ''
          if (date5) {
            item.date = date5.substring(0, 10)
            item.time = date5.length > 10 ? date5.substr(11) : ''
          }
        }
        if (item.type === 'AJYSSJ') {
          var date6 = this.ajInfo.AJYSSJ ? this.$handlerDateTime(this.ajInfo.AJYSSJ) : ''
          if (date6) {
            item.date = date6.substring(0, 10)
            item.time = date6.length > 10 ? date6.substr(11) : ''
          }
        }
        if (item.type === 'ESSJ') {
          var date7 = this.ajInfo.ESSJ ? this.$handlerDateTime(this.ajInfo.ESSJ) : ''
          if (date7) {
            item.date = date7.substring(0, 10)
            item.time = date7.length > 10 ? date7.substr(11) : ''
          }
        }
        if (item.type === 'GDRQ') {
          var date8 = this.ajInfo.GDRQ ? this.$handlerDateTime(this.ajInfo.GDRQ) : ''
          if (date8) {
            item.date = date8.substring(0, 10)
            item.time = date8.length > 10 ? date8.substr(11) : ''
          }
        }
        if (item.type === 'CZSJ') {
          var date9 = this.ajInfo.CZSJ ? this.$handlerDateTime(this.ajInfo.CZSJ) : ''
          if (date9) {
            item.date = date9.substring(0, 10)
            item.time = date9.length > 10 ? date9.substr(11) : ''
          }
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ajStatus{
  width: 100%;
  max-height: 170px;
  border: 2px solid rgb(0, 160, 233);
  padding: 18px 10px 18px 13px;
  text-align: center;
  .ajStatusCont{
     background:url('../../../assets/caseFile_images/ajline.png')no-repeat center 37px;
     background-size: 100% 5px;
    .itemName{
      color: #bce8fc;
      text-shadow: 0 0 1px #fff;
      margin-bottom: 6px;
    }
    img{
      width: 18px;
      margin-bottom: 5px;
    }
  }

}
.dateStyle{
  font-size: 14px;
  color: #fff;
}
@media only screen and (max-width: 1367px){

}
</style>

