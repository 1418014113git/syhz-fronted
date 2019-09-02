<template>
  <section>
    <!-- 案件串并 -->
    <div class="ajParallel">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="dataList" style="width: 100%;" v-loading="loading" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="CBABH" label="串并编号"></el-table-column>
        <el-table-column prop="CAZT_NAME" label="串案状态"></el-table-column>
        <el-table-column prop="CBFXBH" label="分析编号"></el-table-column>
        <el-table-column prop="AJMC" label="案件名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AJLB_NAME" label="案件类别" ></el-table-column>
        <el-table-column prop="CZDW_NAME" label="操作单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CZR_NAME" label="操作人"></el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="scope">
            <span v-if="scope.row.CZSJ">{{formatTime(scope.row.CZSJ)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[5,10,15,20]"  @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
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
      title: '案件串并',
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
.ajParallel {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  border-radius: 8px;
}
</style>
