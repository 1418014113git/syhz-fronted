<template>
  <section class="examNotice">
    <el-form :inline="true" :model="filterQuery" size="small" label-position="left" label-width="82px">
      <el-form-item label="类型：" prop="tableName">
        <el-select v-model="filterQuery.tableName" placeholder="请选择" size="small" @change="changeTableName">
          <el-option v-for="(item,index) in typeData" :value="item.value" :label="item.label" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBoundary(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success"  @click="toAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="400" show-overflow-tooltip></el-table-column>
      <el-table-column prop="syhSjldsj" label="采集时间" min-width="200"></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle plain @click="handleDetail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  data() {
    return {
      loading: false, // 列表loading
      typeData: [{
        value: 'd_nmgs_ggjd',
        label: '陕西工商-广告监督'
      }, {
        value: 'd_nmzj_zljd',
        label: '陕西质监-质量监督'
      }, {
        value: 'd_nmnmyt_xxgk',
        label: '陕西农牧业厅-信息公开'
      }, {
        value: 'd_sa_cjxx',
        label: '食安-抽检信息'
      }, {
        value: 'd_hhhtsyj_xzcfjds',
        label: '西安食药局-行政处罚决定书'
      }, {
        value: 'd_nmzj_zfjd',
        label: '陕西质检-执法监督'
      }],
      filterQuery: {
        tableName: 'd_nmgs_ggjd'
      },
      listData: [],
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryBoundary(true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryBoundary(false)
    },
    changeTableName(val) {
      this.queryBoundary(true)
    },
    queryBoundary(flag) {
      this.loading = true
      this.page = flag ? 1 : this.page
      var param = {
        tableName: this.filterQuery.tableName,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$query('page/border', param).then((response) => {
        this.loading = false
        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.page = response.data.pageNum
        this.total = response.data.totalCount
      }).catch(() => {
        this.loading = false
      })
    },
    toAdd() { // 添加
      this.$gotoid('/interfaceDataCollect/interfaceSave')
    },
    handleDetail(row) { // 详情
      const param = {
        id: row.id,
        tableName: this.filterQuery.tableName
      }
      this.$gotoid('/interfaceDataCollect/interfaceDetail', JSON.stringify(param))
    }
  },
  components: {},
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    if (sessionStorage.getItem(this.$route.path)) {
      this.filterQuery.tableName = sessionStorage.getItem(this.$route.path)
    }
    this.queryBoundary(true)
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.examNoticeContainer .el-dialog__body {
  padding: 30px 20px 30px 10px;
}
.name {
  top: 412px;
  left: 265px;
}
</style>
