<template>
  <section>
    <!-- 催办信息 -->
    <div class="auditInfo">
      <title-pub :title="title" url=""></title-pub>
       <el-table :data="cbDataList" style="width: 100%;" v-loading="loading" max-height="156" class="table_th_center">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="urgentDeptName" label="催办部门"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="urgentPersonName" label="催办人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="urgedContent" label="催办内容"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate" label="催办时间"  width="170" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signUserName" label="签收人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signTime" label="签收时间" width="170" align="center"></el-table-column>
        <el-table-column prop="feedbackContent" label="反馈内容" width="170" align="center"></el-table-column>
        <el-table-column prop="feekbackTime" label="反馈时间" width="170" align="center"></el-table-column>
        <el-table-column prop="feedbackPersonName" label="反馈人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="催办状态"  width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictName(scope.row.status+'','dbajzt')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <!-- v-if="$isViewBtn('100805')" -->
            <!-- v-if="scope.row.auditDeptCode === deptInfo.depCode && scope.row.flowStatus==='1'" -->
            <el-button
                      title="反馈" size="mini" type="primary" @click="handlerAudit(scope.$index, scope.row)" circle>
                      </el-button>
            <el-button
                      title="签收" size="mini" type="primary" @click="handlerAudit(scope.$index, scope.row)" circle>
                      </el-button>
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
export default {
  props: ['dbId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '催办信息',
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      cbDataList: [],
      AJBH: '' // 案件编号
    }
  },
  watch: {
    dbId(val) {
      this.loading = true
      this.initData() // 初始化数据
      if (val) {
        this.db_Id = val
        this.init(true)
      }
    }
  },
  methods: {
    init(flag) {
      if (this.dbId) {
        this.loading = true
        this.db_Id = this.dbId
        this.$query('page/casesuperviseurgent', { id: this.db_Id }).then((response) => {
          if (response.code === '000000') {
            this.loading = false
            this.cbDataList = response.data.list
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    initData() { // 初始化数据
      this.cbDataList = []
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
