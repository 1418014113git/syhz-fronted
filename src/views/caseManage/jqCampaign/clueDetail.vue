<template>
  <section class="clueDetail">
   <!--线索列表详情-->
      <el-form label-width="120px" class="form">
        <el-form-item label="核查情况：">
          <!-- <span v-if="hcqk.status">{{ $getDictName(hcqk.status+'', 'qbxsfkzt') }}</span> -->
          <span>查实</span>
        </el-form-item>
        <el-form-item label="移送案件">
          <el-table :data="yslistData" v-loading="yslistLoading" style="width: 100%;" class="">
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="" align="center" label='案件名称'  show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='案件编号'  show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='案件类别'  show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="侦办刑事案件">
          <el-table :data="zblistData" v-loading="zblistLoading" style="width: 100%;" class="" show-summary>
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="" align="center" label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='案件编号'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='立案'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='破案'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='捣毁窝点'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='批准逮捕'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" align="center" label='涉案金额'  min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
  </section>
</template>
<script>
export default {
  props: ['row'],
  name: 'clueDetail',
  data() {
    return {
      hcqk: {}, // 存储线索列表当前行的数据
      yslistData: [], // 移送案件列表
      zblistData: [], // 侦办刑事案件列表
      yslistLoading: false, // 移送案件列表加载loading
      zblistLoading: false, // 侦办刑事案件列表加载loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {} // 存储当前被点击行数据
    }
  },
  watch: { // 监听state状态变化
    row: {
      handler: function(val, oldeval) {
        this.hcqk = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.queryysaj() // 移送案件列表
      this.queryzbxsaj() // 侦办刑事案件
    },
    queryysaj() { // 移送案件列表数据查询
      this.yslistLoading = true
      const para = {

      }
      this.$query('', para).then((response) => {
        this.yslistLoading = false
        this.yslistData = response.data
      }).catch(() => {
        this.yslistLoading = false
        this.yslistData = []
      })
    },
    queryzbxsaj() { // 侦办刑事案件列表数据查询
      this.zblistLoading = true
      const para = {

      }
      this.$query('', para).then((response) => {
        this.zblistLoading = false
        this.zblistData = response.data
      }).catch(() => {
        this.zblistLoading = false
        this.zblistData = []
      })
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // this.hcqk = this.row
    // this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueDetail{
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
