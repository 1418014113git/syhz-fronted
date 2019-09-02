<template>
  <section>
    <!-- 服务信息 -->
    <div class="ImportInfo">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="fwxxData" style="width: 100%;" v-loading="serviceLoading" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="信息分类" width="100px">
          <template slot-scope="scope">
            {{getFwlxName(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="zh" label="账号" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nc" label="昵称" min-width="8%"></el-table-column>
        <el-table-column prop="lxmc" label="所在网站或分类" min-width="10%"></el-table-column>
        <el-table-column prop="cjdwName" label="登记单位" min-width="14%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="登记人" min-width="6%"></el-table-column>
        <el-table-column prop="createDate" label="登记时间" width="170px"></el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
                        :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import {
  getFwlxText
} from '@/utils/codetotext'
import {
  getSessionDeptSelect
} from '@/api/depts'
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '服务信息',
      activeName: 'first',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '152224199005230516',
      fwxxData: [], // 服务
      serviceLoading: false, // 服务loading
      pageSize: 5,
      page: 1,
      total: 0,
      depts: getSessionDeptSelect(),
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.init()
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    init() {
      this.handleFwxx(true)
    },
    handleFwxx(flag) {
      if (!this.cardNumber) {
        this.$message.error('身份证信息不能为空-服务信息')
        return false
      }
      this.serviceLoading = true
      var param = {
        sfzhm: this.cardNumber,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('page/personnmserviceinfo', param).then((res) => {
        if (res.code === '000000') {
          this.serviceLoading = false
          if (res.code === '000000') {
            this.fwxxData = res.data.list
            this.total = res.data.totalCount
            this.pageSize = res.data.pageSize
            this.$resetSetItem('t7', this.total) // 将总数存在session中
          }
        } else {
          this.$resetSetItem('t7', 0) // 将总数存在session中
        }
      }).catch(() => {
        this.serviceLoading = false
      })
    },
    handleCurrentChange(val) { // 服务信息
      this.page = val
      this.handleFwxx(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.handleFwxx(false)
    },
    getFwlxName(type) {
      return getFwlxText(type)
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.show-word4 {
  cursor: default;
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 4;
  overflow: hidden;
}
</style>
