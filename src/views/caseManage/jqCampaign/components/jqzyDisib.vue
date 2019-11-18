<template>
  <section class="jqzyDisib">
   <!--线索分发-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="接收单位">
          <el-input v-model="filters.receiveName" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="核查情况">
          <el-select  v-model="filters.qbxsResult" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('qbxsfkzt')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="线索序号">
          <el-input v-model="filters.serialNumber" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select  v-model="filters.type" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('fllb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="分发状态">
          <el-select  v-model="filters.qbxsDistribute" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('qbxsffzt')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="">
          <span>已选<span style="">{{xsNum}}</span>条线索，</span>
        </el-form-item>
        <el-form-item label="接收单位">
          <el-select  v-model="deptCode" size="small" placeholder="请选择"  class="inputW"  @change="deptChange">
            <el-option v-for="(item,index) in exDeptData" :key="index" :label="item.deptName" :value="item.deptCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" :loading="ffbtnLoading" @click="distribute">线索分发</el-button>
        </el-form-item>
        <el-form-item>
          <el-popover
          placement="right"
          width="300"
          trigger="hover">
            <div>
              <p>线索分发步骤：</p>
              <p>1、列表勾选需要分发线索。</p>
              <p>2、选择线索接收单位。</p>
              <p>3、点击【线索分发】，向接收单位分发线索。</p>
            </div>
            <el-button  type="primary" size="small" slot="reference"><svg-icon icon-class="wenhao"></svg-icon> 分发步骤</el-button>
          </el-popover>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" ref="multipleTable" style="width: 100%;overflow:auto;" max-height="490"  @select="handleselectRow" @select-all="handleselectAll">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="serialNumber" align="center" label='线索序号'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveName" align="center" label='接收单位'  min-width="250" show-overflow-tooltip >
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.receiveName)">{{scope.row.receiveName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qbxsCategory" align="center" label='线索分类'  min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.qbxsCategory'>{{$getDictName(scope.row.qbxsCategory+'','fllb')}}</span>
        </template>
      </el-table-column>
      <el-table-column  v-for="(item, index) in tableHead" :key="index" :label="item"  align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.data[index+1])">{{scope.row.data[index+1]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" title="取消分发"  type="primary" circle  @click="handleCancel(scope.$index, scope.row)"><svg-icon icon-class="quxiao"></svg-icon></el-button>
          <el-button size="mini" title="删除线索" type="primary" icon="el-icon-delete" circle  v-if="pageSource!=='edit'"  @click="handleDel(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

     <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-top:10px;">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  props: ['id', 'isShowDialog', 'source', 'fastatus', 'jsdw', 'xcstatus'],
  name: 'jqzyDisib',
  components: {
  },
  data() {
    return {
      filters: {
        receiveName: '', // 接收单位
        address: '', // 地址
        qbxsResult: '', // 核查情况
        serialNumber: '', // 线索序号
        qbxsCategory: '', // 分类
        qbxsDistribute: '' // 分发状态
      },
      deptCode: '', // 接收单位code
      acceptDeptName: '', // 接收单位名称
      assistId: '', // 集群id
      xsNum: 0, // 选择的线索条数
      checkId: [], // 复选框选中的列表id
      checkIdRow: [], // 存储当前行被点击选中的项
      listData: [], // 线索列表
      ffbtnLoading: false, // 线索分发按钮加载loading
      listLoading: false, // 列表加载loading
      total: 0,
      page: 1,
      pageSize: 15,
      exDeptData: [], // 接收单位下拉框数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null,
      tableHead: [], // 表头
      pcsParentDept: {}, // 派出所的上级部门
      pageSource: '', // 进入页面的来源,
      xichastatus: '' // 如果是从详情页过来的，会传递协查状态xcstatus
    }
  },
  watch: {
    id: {
      handler: function(val, oldeval) {
        this.assistId = val
      }
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        // console.log('显示弹框')
      }
    },
    source: {
      handler: function(val, oldeval) {
        this.pageSource = val
      }
    },
    fastatus: { // 分发状态
      handler: function(val, oldeval) {
        if (val !== '0') {
          this.filters.qbxsDistribute = val + ''
        } else {
          this.filters.qbxsDistribute = ''
        }
        this.filters.receiveName = ''
        this.query(true)
      }
    },
    jsdw: {
      handler: function(val, oldeval) {
        if (val) {
          this.filters.receiveName = val
        }
        this.filters.qbxsDistribute = ''
        this.query(true)
      }
    },
    xcstatus: { // 协查状态
      handler: function(val, oldeval) {
        if (val) {
          this.xichastatus = val
        }
        this.query(true)
      }
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        address: this.filters.address, // 地址
        receiveName: this.filters.receiveName,	// 接收单位
        qbxsResult: this.filters.qbxsResult, // 协查情况
        serialNumber: this.filters.serialNumber, //  序号
        qbxsCategory: this.filters.qbxsCategory, // 分类
        qbxsDistribute: this.filters.qbxsDistribute ? this.filters.qbxsDistribute : '', // 分发状态
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        assistId: this.assistId // 协查id
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      if (this.pageSource === 'detail' && Number(this.xichastatus) > 3) { // 详情页进来的， 协查状态>3 是审核不通过以及通过以后的状态，需要传递当前部门code
        para.deptCode = this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode // 当前部门code  如果是派出所，传它的父部门code
      }
      this.$query('ajglQbxs', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
          var titles = response.data.titles // 表头
          titles.forEach((item, index) => {
            if (index > 0) {
              this.tableHead.push(item) // 表头数据只取序号之后的
            }
          })
          this.$nextTick(function() {
            this.memoryChecked() // 记忆复选框被选中的列表
          })
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    clearData() {
      this.filters = {
        address: '', // 地址
        receiveName: '', // 接收单位
        qbxsResult: '', // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '' // 分类
      }
      this.deptCode = '' // 接收单位code
      this.acceptDeptName = '' // 接收单位名称
      this.initData()
    },
    initData() {
      this.page = 1
      this.total = 0
      this.pageSize = 15
      this.listData = []
      this.tableHead = []
    },
    handleDel(index, row) { // 删除线索
      this.$confirm('确定要删除线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          qbxsId: row.qbxsId,
          assistId: this.assistId
        }
        this.$update('caseassistclue/delete', param).then((response) => {
          this.listLoading = false
          this.$emit('result', response.data)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCancel(index, row) { // 取消分发
      this.$confirm('确定要取消分发到该单位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          qbxsId: row.qbxsId,
          assistId: this.assistId
        }
        this.$update('caseassistclue/cancelDistribute', param).then((response) => {
          this.listLoading = false
          this.$emit('result', response.data)
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    distribute() { // 线索分发
      if (this.checkId.length > 0 && this.deptCode) {
        var ids = this.checkId.join(',')
        const param = {
          assistId: this.assistId, // 协查id
          ids: ids, // 选择的线索唯一标识集合 英文逗号隔开
          acceptDeptCode: this.deptCode, // 接收的部门code
          acceptDeptName: this.acceptDeptName, // 接收的部门Name
          curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode // 当前部门code  如果是派出所，传它的父部门code
        }
        if (this.pageSource === 'detail' && Number(this.xichastatus) > 3) { // 详情页进来的， 协查状态>3 是审核不通过以及通过以后的状态，需要以下参数
          param.curDeptName = this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName // 当前部门名称  如果是派出所，传它的父部门名称
          param.curDeptType = this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型  如果是派出所，传它的父部门类型
          param.userId = this.curUser.id
          param.userName = this.curUser.realName
        }
        this.ffbtnLoading = true
        this.$update('caseassistclue/distribute', param).then((response) => {
          this.ffbtnLoading = false
          this.$confirm('线索分发成功', '', {
            confirmButtonText: '继续分发',
            cancelButtonText: '完成分发',
            type: 'success'
          }).then(() => { // 继续分发

          }).catch(() => { // 完成分发
            this.$emit('closeDialog', false) // 关闭弹
          })
        }).catch(() => {
          this.ffbtnLoading = false
        })
      } else if (this.checkId.length === 0) { // 未勾选线索列表
        this.$message.error('请选择“线索”后分发线索。')
      } else if (!this.deptCode) { // 未选接收单位
        this.$message.error('请选择“接收单位”后分发线索。')
      }
    },
    resetForm() { // 重置
      this.filters = {
        address: '', // 地址
        receiveName: '', // 接收单位
        qbxsResult: '', // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '' // 分类
      }
      this.deptCode = '' // 接收单位code
      this.acceptDeptName = '' // 接收单位名称
      this.initData()
      this.query(true)
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      this.checkIdRow = []
      if (selection.length > 0) {
        selection.forEach((item, index) => {
          this.checkIdRow.push(item.qbxsId)
        })
      }

      if (this.checkId.length === 0 && selection.length > 0) {
        this.checkId.push(row.qbxsId)
      } else {
        var checkId_ = this.checkId
        checkId_.forEach((qbxsId) => {
          if (row.qbxsId === qbxsId) {
            this.removeByValue(this.checkId, row.qbxsId)
          } else {
            if (!this.temp(row.qbxsId)) {
              this.checkId.push(row.qbxsId)
            }
          }
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    handleselectAll(selection) {
      var allSelect = selection
      if (selection.length > 0) {
        var checkId_1 = this.checkId
        allSelect.forEach((item, index) => {
          checkId_1.forEach((it, i) => {
            if (it !== item.qbxsId) {
              if (!this.temp(item.qbxsId)) {
                this.checkId.push(item.qbxsId)
              }
            }
          })
        })
        if (this.checkId.length === 0) {
          allSelect.forEach((item, i) => {
            this.checkId.push(item.qbxsId)
          })
        }
      } else {
        this.listData.forEach((item) => {
          this.checkId.forEach((it) => {
            if (item.qbxsId === it) {
              this.removeByValue(this.checkId, item.qbxsId)
            }
          })
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    removeByValue(arr, val) { // 去重
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
        }
      }
    },
    temp(id) {
      if (this.checkId.indexOf(id) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 记忆函数
    memoryChecked() {
      // console.log('jiyi', JSON.stringify(this.checkId))
      if (this.listData.length > 0) {
        this.listData.forEach((item, index) => {
          if (this.checkId.indexOf(item.qbxsId) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    },
    querypcssj() { // 查询派出所的上级
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.pcsParentDept = response.data
          this.queryCubordinate()
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    queryCubordinate() { // 查询接收单位
      var param = {}
      if (this.pageSource === 'detail') { // 如果是详情页按钮点击进来的 查当前地市下的大队
        param = {
          areaCode: this.curDept.areaCode, // 当前区域code
          curType: this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型
        }
      } else {
        param = {
          areaCode: '610000', // 传省厅的区域code， 查所有的地市支队
          curType: 1 // 传总队的类型
        }
      }
      this.$query('dept/subordinate', param, 'upms').then((response) => {
        if (response.code === '000000') {
          this.exDeptData = response.data
        }
      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['deptCode']) {
            this.acceptDeptName = this.exDeptData[i]['deptName'] // 接收部门名称
            return true
          }
        }
      } else {
        this.acceptDeptName = null // 审核部门名称
      }
    },
    rowClick(text) {
      this.$alert(text, '内容', {
        confirmButtonText: '关闭'
      })
    }
  },
  mounted() {
    this.clearData()
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.curDept.depType === '4') { // 派出所
      this.querypcssj() // 查询派出所的上级 把上级单位当做自己单位
    }
    if (this.id) {
      this.assistId = this.id
    }
    if (this.source) {
      this.pageSource = this.source
    }

    if (this.fastatus && this.fastatus !== '0') { // 分状态
      this.filters.qbxsDistribute = this.fastatus + ''
    }
    if (this.jsdw) {
      this.filters.receiveName = this.jsdw
    }
    this.query(true)
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.jqzyDisib{
  padding: 0 10px;
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
  .inputW{
    width: 400px;
  }
}
</style>
