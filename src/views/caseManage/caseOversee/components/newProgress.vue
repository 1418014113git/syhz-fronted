<template>
  <section>
    <div class="auditInfo">
      <title-pub :title="title" url=""></title-pub>
      <div class="stepsWrap">
        <div v-if="dataList && dataList.length < 1">
          <p style="line-height: 150px; text-align: center">暂无数据</p>
        </div>
        <div class="jzBox">
          <div v-for="(item,index) in dataList" :key="index">
            <p>
              <span class="circle"></span>
              <span style="color:#B2DDF3;margin: 0 20px 0 10px;">{{item.createTime}}</span>
              <span>{{item.userName}}：{{item.actionType}}</span>
              <i class="el-icon-success" v-if="item.actionType.indexOf('审核通过')>-1"></i>
              <i class="el-icon-error" v-if="item.actionType.indexOf('不通过')>-1"></i>
            </p>
            <p class="line"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
 </template>
<script>
import titlePub from './titlePub'
import { getAJDETAILBUNCH } from '@/api/caseManage'
export default {
  props: ['zxjzData'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '最新进展',
      dataList: []
    }
  },
  watch: {
    zxjzData(val) {
      this.loading = true
      if (val) {
        this.dataList = val
      }
    }
  },
  methods: {
    init(flag) {
      if (this.ajbh) {
        this.loading = true
        this.AJBH = this.ajbh
        getAJDETAILBUNCH({
          pageNum: flag ? 1 : this.page,
          pageSize: this.pageSize,
          AJBH: this.AJBH
        }).then((res) => {
          this.loading = false
          if (res.code === '000000') {
            this.dataList = res.data.list
            this.total = res.data.totalCount
            this.pageSize = res.data.pageSize
            if (this.dataList.length > 0) {
              this.$resetSetItem('aj9', this.total) // 将总数存在session中
            }
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    initData() { // 初始化数据
      this.dataList = []
      this.page = 1
      this.total = 0
      this.pageSize = 5
    },
    formatTime(time) {
      return this.$handlerDateTime(time)
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.init()
    }
  },
  mounted() {
    this.init(true)
  }
}

</script>
<style  rel="stylesheet/scss" lang="scss">
.auditInfo {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  border-radius: 8px;
  .stepsWrap {
    max-height: 400px;
    margin: 20px 0 20px 100px;
    overflow-y: auto;
    .circle {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 20px;
      background: #9cc7da;
      vertical-align: middle;
    }
    .line {
      background: #9cc7da;
      width: 2px;
      height: 30px;
      margin: -10px 6px 0px 6px;
      opacity: 0.8;
    }
    .el-icon-success {
      margin-left: 20px;
      color: #67c23a;
    }
    .el-icon-error {
      margin-left: 20px;
      color: #f56c6c;
    }
    .jzBox div:first-child p:first-child .circle {
      background: #e6a23c;
    }
    .jzBox div:last-child .line {
      display: none;
    }
  }
}
</style>
