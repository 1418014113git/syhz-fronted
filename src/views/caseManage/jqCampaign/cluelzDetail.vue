<template>
  <section class="cluelz">
   <!--线索流转记录-->
      <el-table :data="listData" v-loading="listLoading"  style="width: 100%;margin-top:10px;">
        <el-table-column type="index" width="80" label="序号" ></el-table-column>
        <el-table-column prop="createName"  label='操作单位'  min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="creatorName"  label='操作人'  min-width="150"></el-table-column>
        <el-table-column prop="createTime"  label='操作时间'  min-width="180"></el-table-column>
        <el-table-column prop="optCategory"  label='操作内容'  min-width="250" show-overflow-tooltip >
          <template slot-scope="scope">
            <span v-if='scope.row.optCategory'>{{$getDictName(scope.row.optCategory+'','qbxsjl')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveName"  label='接收单位'  min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="remark"  label='原因'  min-width="250" show-overflow-tooltip ></el-table-column>
      </el-table>
  </section>
</template>
<script>
export default {
  props: ['row', 'isShowdialog'],
  name: 'cluelz',
  components: {
  },
  data() {
    return {
      listData: [], // 线索流转记录列表
      listLoading: false, // 列表加载loading
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      xslzRow: {} // 存储当前被点击行数据
      // pageSource: '' // 进入页面的来源,
      // tableHeight: null,
      // pcsParentDept: {}, // 派出所的上级部门

    }
  },
  watch: {
    row: {
      handler: function(val, oldeval) {
        this.xslzRow = val
      }
    },
    isShowdialog: {
      handler: function(val, oldeval) {
        if (val) {
          this.query() // 列表数据查询
        }
      }
    }
  },
  methods: {
    query() { // 列表数据查询
      this.listLoading = true
      const para = {
        assistType: 2, // 集群标识
        assistId: this.xslzRow.clusterId, // 集群id
        qbxsId: this.xslzRow.qbxsId // 线索id
      }
      this.$query('caseassistclue/ajglQbxsRecord', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.listData = response.data // 列表
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.listData = []
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.xslzRow = this.row
    this.query()
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.cluelz{
  .el-dialog__body {
    padding: 10px 0 15px 0px;
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
