<template>
  <section class="cluelz">
   <!--线索流转记录-->
      <el-table :data="listData" v-loading="listLoading"  style="width: 100%;margin-top:10px;">
        <el-table-column type="index" width="80" label="序号" ></el-table-column>
        <el-table-column prop=""  label='操作单位'  min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop=""  label='操作人'  min-width="150"></el-table-column>
        <el-table-column prop=""  label='操作时间'  min-width="180"></el-table-column>
        <el-table-column prop=""  label='操作内容'  min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop=""  label='接收单位'  min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop=""  label='原因'  min-width="250" show-overflow-tooltip ></el-table-column>
      </el-table>
     <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" >
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col> -->
  </section>
</template>
<script>
export default {
  props: ['row', 'isShowlzrecord'],
  name: 'cluelz',
  components: {
  },
  data() {
    return {
      listData: [], // 线索流转记录列表
      listLoading: false, // 列表加载loading
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      xslzRow: {}, // 存储当前被点击行数据
      pageSource: '' // 进入页面的来源,
      // total: 0,
      // page: 1,
      // pageSize: 15,

      // tableHeight: null,
      // tableHead: [], // 表头
      // pcsParentDept: {}, // 派出所的上级部门

    }
  },
  watch: {
    row: {
      handler: function(val, oldeval) {
        this.xslzRow = val
      }
    },
    isShowlzrecord: {
      handler: function(val, oldeval) {
        if (val) {
          // this.query() // 列表数据查询
        }
      }
    }
  },
  methods: {
    query(flag) { // 列表数据查询
      this.listLoading = true
      // this.page = flag ? 1 : this.page
      const para = {

      }

      this.$query('', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          // this.total = response.data.totalCount
          // this.page = response.data.pageNum
          // this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.page = 1
      this.total = 0
      this.pageSize = 15
      this.listData = []
      this.tableHead = []
      this.checkId = []
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    }
    // querypcssj() { // 查询派出所的上级
    //   this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
    //     if (response.code === '000000') {
    //       this.pcsParentDept = response.data
    //       this.queryCubordinate()
    //     }
    //   }).catch(() => {
    //     this.caseLoading = false
    //   })
    // },
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.xslzRow = this.row
    // this.query(true)
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.cluelz{
  .el-dialog__body {
    padding: 10px 0 15px 20px;
  }
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
}

</style>
