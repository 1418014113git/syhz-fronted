<template>
  <section class="equipNorm">
    <el-form :inline="true" :model="equipNormForm" label-width="78px" label-position="left" class="clearfix">
      <el-form-item  label="装备分类">
        <el-select v-model="equipNormForm.departLevel" placeholder="全部">
          <option label="警用车辆" value="1"></option>
          <!-- <el-option v-for="item in $getDicts('zyzz')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="配备项目">
        <el-select v-model="equipNormForm.departLevel" placeholder="全部">
          <!-- <el-option v-for="item in $getDicts('zyzz')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryEquipList" icon="el-icon-search">查询</el-button>
        <!-- <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button> -->
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" @click="addProject" icon="el-icon-plus">添加配备项目</el-button>
        <el-button type="primary" size="small" @click="goEquipClassify" icon="el-icon-menu">装备分类管理</el-button>
      </el-form-item>
    </el-form>
    <!-- :cell-class-name="tableRowClassName" -->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight"
       :span-method="objectSpanMethod" class="table_th_center equipNormTable">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="XZQH" label="装备分类" align="center" width="160"></el-table-column>
      <el-table-column prop="SL" label="配备项目" align="center" width="200"></el-table-column>
      <el-table-column prop="DSL" label="单位" align="center" width="100"></el-table-column>
      <el-table-column prop="TSL" label="总队（省）" align="center" width="140"></el-table-column>
      <el-table-column prop="TSL" label="支队（市）" align="center" width="140"></el-table-column>
      <el-table-column prop="TSL" label="大队（区县）" align="center" width="140"></el-table-column>
      <el-table-column prop="TSL" label="参考更新年限" align="center" width="120"></el-table-column>
      <el-table-column prop="TSL" label="配备类型" align="center" width="100"></el-table-column>
      <el-table-column prop="TSL" label="说明" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" circle icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="停用" size="mini" type="primary" circle icon="el-icon-minus" @click="handleStatus(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 配备项目弹框 -->
    <el-dialog title="配备项目信息" :visible.sync="dialogVisible" size="small" @close="closeDia" :close-on-click-modal="false" class="comDialog" width="50%">
      <equipped-project :equipItem="curEquip" @closeDia="closeDia"></equipped-project>
    </el-dialog>

  </section>
</template>
<script>
import { removeAjCheckOrganization } from '@/api/inspectIdent'
// import { getCityTree } from '@/api/citys'
import equippedProject from './equippedProject'
export default {
  name: 'list',
  data() {
    return {
      equipNormForm: {},
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      dialogVisible: false, // 弹框是否显示
      curEquip: {},
      list: [],
      options: [],
      tableHeight: null,
      spanArr: [],
      position: 0
    }
  },
  components: {
    equippedProject
  },
  methods: {
    rowspan() {
      this.list.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.list[index].XZQH === this.list[index - 1].XZQH) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 合并行
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    goEquipClassify() { // 装备分类管理
      this.$router.push({ path: '/basicService/equipNorm/classify' })
    },
    handleEdit(index, row) {
      this.dialogVisible = true
    },
    handleStatus: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.ID
        }
        removeAjCheckOrganization(para).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query()
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryEquipList(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryEquipList(true, true)
    },
    queryEquipList(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        userId: this.userInfo.id
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/hsyzdepart', para, 'upms').then((response) => {
        this.listLoading = false
        if (response.data) {
          // && response.data.list.length > 0
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.tableData = response.data.list
          this.rowspan()
        }
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.listLoading = false
      })
    },
    closeDia(type) { // 关闭弹框
      // this.resetForm('')
      this.dialogVisible = false
      if (type === '1') {
        this.query() // 刷新列表
      }
    },
    resetSearch() {
      this.filters = {
        name: '', ywfw: '', citys: []
      }
      this.queryEquipList(true)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addProject() { // 添加配备项目
      this.dialogVisible = true
    },
    init() {

    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query()
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.equipNorm {
  // table 样式
  .equipNormTable {
    table {
      border: 1px solid #2f627a;
      border-bottom: none;
    }
    thead th {
      border-right: 1px solid #2f627a;
    }
    .el-table__body td {
      // border: 1px solid #3c7996;
      border-right: 1px solid #2f627a;
      border-bottom: 1px solid #2f627a;
    }
    .el-table__body-wrapper tr:nth-child(even) {
      background-color: transparent;
    }
  }
  .toolbar {
    margin: 8px 0 12px;
  }
}
</style>
