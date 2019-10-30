<template>
  <section class="equipNorm">
    <el-form :inline="true" :model="equipNormForm" label-width="78px" label-position="left" class="clearfix">
      <el-form-item  label="装备分类">
        <el-select v-model="equipNormForm.groupId" clearable filterable placeholder="全部" @change="equipGroupChange">
          <el-option v-for="item in classifyOptions" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配备项目">
        <el-select v-model="equipNormForm.allocateId" clearable filterable placeholder="全部">
          <el-option v-for="item in projectOptions" :key="item.id" :label="item.allocateName" :value="item.id"></el-option>
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
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight"
       :span-method="objectSpanMethod" class="table_th_center equipNormTable">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="groupName" label="装备分类" align="center" width="160"></el-table-column>
      <el-table-column prop="allocateName" label="配备项目" align="center" width="200"></el-table-column>
      <el-table-column prop="unitType" label="单位" align="center" width="100">
        <template slot-scope="scope">
            {{$getDictName(scope.row.unitType+'','zbjl')}}
        </template>
      </el-table-column>
      <el-table-column prop="provinceCondition" label="总队（省）" align="center" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.provinceCondition === 1">- -</span>
          <span v-else-if="scope.row.provinceCondition === 2">{{equipCondition[scope.row.provinceCondition-1].label}}</span>
          <span v-else-if="scope.row.provinceCondition === 3">{{scope.row.provinceValue1}} / {{scope.row.provinceValue2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cityCondition" label="支队（市）" align="center" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.cityCondition === 1">- -</span>
          <span v-else-if="scope.row.cityCondition === 2">{{equipCondition[scope.row.cityCondition-1].label}}</span>
          <span v-else-if="scope.row.cityCondition === 3">{{scope.row.cityValue1}} / {{scope.row.cityValue2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaCondition" label="大队（区县）" align="center" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.areaCondition === 1">- -</span>
          <span v-else-if="scope.row.areaCondition === 2 ">{{equipCondition[scope.row.areaCondition-1].label}}</span>
          <span v-else-if="scope.row.areaCondition === 3">{{scope.row.areaValue1}} / {{scope.row.areaValue2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateYear" label="参考更新年限" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.updateYear">{{scope.row.updateYear}}</span>
          <span v-else>- -</span>
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled===0">停用</span>
          <span v-else-if="scope.row.enabled===1">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocateType" label="配备类型" align="center" width="120">
        <template slot-scope="scope">
          <span>{{$getDictName(scope.row.allocateType+'','zblx')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="说明" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.enabled===0">{{(scope.row.remark||'')+" 停用时间："+ formatDateTime(scope.row.stopTime)}}</span>
          <span v-else-if="scope.row.enabled===1">{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" circle icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.enabled===1" title="停用" size="mini" type="primary" circle icon="el-icon-minus" @click="handleEnable(scope.$index, scope.row)"></el-button>
          <el-button v-else-if="scope.row.enabled===0" title="启用" size="mini" type="primary" circle icon="el-icon-caret-right" @click="handleEnable(scope.$index, scope.row)"></el-button>
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
      <equipped-project ref="myEquip" :equipItem="curEquip" @closeDia="closeDia"></equipped-project>
    </el-dialog>

  </section>
</template>
<script>
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
      tableData: [],
      options: [],
      tableHeight: null,
      spanArr: [],
      position: 0,
      classifyOptions: [], // 装备分类
      projectOptions: [], // 配备项目
      equipCondition: [{ value: 1, label: '无要求' }, { value: 2, label: '按相关规定配备' }, { value: 3, label: '设定数量' }], // 不同部门配备的设置
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  components: {
    equippedProject
  },
  methods: {
    equipGroupChange(val) { // 装备分类change
      this.equipNormForm.allocateId = '' // 清空配备项目
      if (val) {
        //
        this.initPbxm(val)
      } else {
        this.projectOptions = []
      }
    },
    rowspan() {
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.tableData[index].groupName === this.tableData[index - 1].groupName) {
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
      this.curEquip = row
    },
    handleEnable(index, row) {
      var tipText = ''
      var param = {
        lastId: this.userInfo.id,
        lastName: this.userInfo.userName
      }
      if (row.enabled === 0) {
        param.enabled = '1' // 启用
        tipText = '启用'
      } else if (row.enabled === 1) {
        param.enabled = '0' // 停用
        tipText = '停用'
      }
      this.$confirm('确认' + tipText + '该配备项目吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$update('basicAllocateEnabled/' + row.id, param).then((response) => {
          this.formLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '配备项目' + tipText + '成功', type: 'success'
            })
            this.queryEquipList(true) // 刷新列表
          } else {
            this.$message({
              message: '配备项目保存失败，请联系管理员！', type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '配备项目保存失败，请联系管理员！', type: 'error'
          })
          this.formLoading = false
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
      this.spanArr = []
      this.position = 0
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        groupId: this.equipNormForm.groupId || '', // 装备分类
        allocateId: this.equipNormForm.allocateId || '' // 配备项目
        // userId: this.userInfo.id
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('basicEquipAllocateList', para).then((response) => {
        this.listLoading = false
        if (response.data) {
          this.tableData = response.data
          this.rowspan()
        }
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.listLoading = false
      })
    },
    formatDateTime(value) {
      var val = value.substring(0, 4) + '年' + parseInt(value.substring(5, 7)) + '月' + parseInt(value.substring(8, 10)) + '日' + value.substr(10)
      return val
    },
    closeDia(type) { // 关闭弹框
      this.dialogVisible = false
      this.$refs.myEquip.resetForm('allocateForm') // 调用子组件的清空表单方法
      this.curEquip = {} // 清空curEquip，以免点击两次相同的行 不触发watch
      if (type === '1') {
        this.queryEquipList(true, true) // 刷新列表
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
      // this.$refs.myEquip.resetForm('allocateForm') // 调用子组件的清空表单方法
      this.curEquip = {}
    },
    init() {
      this.initZbfl()
    },
    initZbfl() {
      this.$query('basicequipgroup', {}).then((response) => {
        this.formLoading = false
        if (response.data) {
          this.classifyOptions = response.data
        }
      }).catch(() => {
        this.classifyOptions = []
        this.formLoading = false
      })
    },
    initPbxm(groupId) {
      this.$query('BASICEQUIPALLOCATENAME', { groupId: groupId }).then((response) => {
        this.formLoading = false
        if (response.data) {
          this.projectOptions = response.data
        }
      }).catch(() => {
        this.classifyOptions = []
        this.formLoading = false
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.queryEquipList()
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
