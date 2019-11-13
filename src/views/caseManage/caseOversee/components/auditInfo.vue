<template>
  <section>
    <!-- 审核信息 -->
    <div class="auditInfo">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="shDataList" style="width: 100%;" v-loading="loading" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="applyDepartName" label="申请部门"></el-table-column>
        <el-table-column prop="applyUserName" label="申请人"></el-table-column>
        <el-table-column prop="applyDate" label="申请时间"></el-table-column>
        <el-table-column prop="superviseLevel" label="督办级别" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="auditDepartName" label="审核部门" ></el-table-column>
        <el-table-column prop="auditUserName" label="审核人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditTime" label="审核时间"></el-table-column>
        <el-table-column prop="flowStatus" label="审核状态"></el-table-column>
        <el-table-column prop="auditContent" label="审核意见" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <!-- v-if="$isViewBtn('100805')" -->
             <!-- v-if="(scope.row.status === 0) &&((deptInfo.depType!=='4'&&scope.row.applyDeptCode === deptInfo.depCode)||(deptInfo.depType==='4'&&scope.row.applyDeptCode === deptInfo.parentDepCode))" -->
            <el-button
                      title="审核" size="mini" type="primary" @click="handlerAudit(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作时间">
          <template slot-scope="scope">
            <span v-if="scope.row.CZSJ">{{formatTime(scope.row.CZSJ)}}</span>
          </template>
        </el-table-column> -->
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
  props: ['shxxData'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '审核信息',
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      shDataList: [], // 审核数据
      AJBH: '' // 案件编号
    }
  },
  watch: {
    shxxData(val) {
      // this.loading = true
      // this.initData() // 初始化数据
      if (val) {
        this.shDataList = val
        // this.AJBH = val
        // this.init(true)
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
    },
    handlerAudit() { // 审核

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
