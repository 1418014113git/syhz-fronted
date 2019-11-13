<template>
  <section>
    <!-- 审核信息 -->
    <div class="auditInfo">
      <title-pub :title="title" url=""></title-pub>

    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import { getAJDETAILBUNCH } from '@/api/caseManage'
export default {
  props: ['ajbh'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '评价打分',
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      dataList: [],
      AJBH: '' // 案件编号
    }
  },
  watch: {
    ajbh(val) {
      this.loading = true
      this.initData() // 初始化数据
      if (val) {
        this.AJBH = val
        this.init(true)
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
}
</style>
