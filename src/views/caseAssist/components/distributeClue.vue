<template>
  <section class="caseAssist_distributeClue">
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
          <el-select  v-model="filters.qbxsCategory" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('fllb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="分发状态">
          <el-select  v-model="filters.qbxsDistribute" size="small" placeholder="全部" clearable :disabled="disabled">
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
          <el-button type="primary" size="small" :loading="btnLoading" @click="distribute">线索分发</el-button>
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
              <p>线索删除说明：</p>
              <p>删除线索会删除对应线索反馈内容。</p>
            </div>
            <el-button  type="primary" size="small" slot="reference"><svg-icon icon-class="wenhao"></svg-icon> 分发步骤</el-button>
          </el-popover>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="dis_table_div">
      <el-table :data="listData" v-loading="listLoading" ref="multipleTable" style="width: 100%;"  @select="handleselectRow" @select-all="handleselectAll">
        <el-table-column type="selection" width="50" :selectable='selectInit'></el-table-column>
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
        <el-table-column label="操作" align="center" width="130" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" title="取消分发"  type="primary" circle v-if="enable(scope.row)" @click="handleCancel(scope.$index, scope.row)"><svg-icon icon-class="quxiao"></svg-icon></el-button>
            <el-button size="mini" title="删除线索" type="primary" icon="el-icon-delete" circle  v-if="enableDelete(scope.row)"  @click="handleDel(scope.$index,scope.row)"></el-button>
            <!--<el-button v-if="pageSource==='detail'" size="mini" title="线索流转记录" type="primary" icon="el-icon-s-unfold" circle  @click="handleClueMove(scope.$index, scope.row)"><svg-icon icon-class="move"></svg-icon></el-button>-->
            <el-button v-if="pageSource==='detail' || Number(assistStatus) > 3" size="mini" title="线索流转记录" type="primary" icon="el-icon-s-unfold" circle  @click="handleClueMove(scope.$index, scope.row)"><svg-icon icon-class="move"></svg-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-top:10px; float: none;">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style=" text-align: right">
      </el-pagination>
    </el-col>

    <el-dialog title="线索流转记录" :visible.sync="clueMoveDialogVisible" class="clueMove" :close-on-click-modal="false">
      <clueMoveList :assistId="curAssistId" :qbxsId="qbxsId"></clueMoveList>
    </el-dialog>
  </section>
</template>
<script>
import clueMoveList from '@/views/caseAssist/clue/clueMoveList.vue'
export default {
  props: ['assistId', 'source', 'fastatus', 'jsdw', 'assistStatus', 'category', 'sDisabled'],
  name: 'distributeClue',
  components: {
    clueMoveList
  },
  data() {
    return {
      curAssistId: '',
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
      xsNum: 0, // 选择的线索条数
      checkId: [], // 复选框选中的列表id
      checkIdRow: [], // 存储当前行被点击选中的项
      listData: [], // 线索列表
      btnLoading: false, // 线索分发按钮加载loading
      listLoading: false, // 列表加载loading
      total: 0,
      page: 1,
      pageSize: 15,
      exDeptData: [], // 接收单位下拉框数据
      curUser: JSON.parse(sessionStorage.getItem('userInfo')), // 当前登录用户
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null,
      tableHead: [], // 表头
      pcsParentDept: {}, // 派出所的上级部门
      pageSource: '', // 进入页面的来源,
      lycategory: '', // 是从主页的下发还是申请  2：申请，  3：下发
      clueMoveDialogVisible: false,
      qbxsId: '',
      disabled: false
    }
  },
  watch: {
    assistId: {
      handler: function(val, oldeval) {
        this.curAssistId = val
      }
    },
    source: {
      handler: function(val, oldeval) {
        this.pageSource = val
      }
    },
    category: {
      handler: function(val, oldeval) {
        this.lycategory = val
      }
    },
    sDisabled: {
      handler: function(val, oldeval) {
        this.disabled = val
      }
    }
  },
  methods: {
    enable(row) {
      if (row.qbxsDistribute === 2) {
        if (this.pageSource === 'detail') {
          const dept = this.findParentDept(row.receiveCode)
          if (dept.depType === '2') {
            return false
          }
          return true
        } else {
          return true
        }
      }
      return false
    },
    enableDelete(row) {
      if (this.pageSource !== 'detail') {
        // if (this.assistStatus === '0' || this.assistStatus === undefined) {
        //   return true
        // }
        if (this.curDept.depType === '1' && this.sDisabled) {
          return false
        }
        return true
      }
      return false
    },
    findParentDept(paramCode) {
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (item.depCode === paramCode) {
          return item
        }
      }
    },
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
        type: 1, // 1 案件协查
        assistId: this.assistId, // 协查id
        assistStatus: this.assistStatus // 协查状态
      }
      para.queryType = this.pageSource === 'detail' ? 'execute' : 'create'
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      if (this.pageSource === 'detail' && Number(this.assistStatus) > 3) { // 详情页进来的， 协查状态>3 是审核不通过以及通过以后的状态，需要传递当前部门code
        para.deptCode = this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode // 当前部门code  如果是派出所，传它的父部门code
      }
      this.$query('ajglQbxs', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
          const titles = response.data.titles // 表头
          this.tableHead = []
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
    handleDel(index, row) { // 删除线索
      this.$confirm('确定要删除线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let departCode = ''
        if (row.receiveCode) {
          const dept = this.findParentDept(row.receiveCode)
          console.info(dept)
          departCode = ',' + dept.parentCode
        }
        const param = {
          qbxsId: row.qbxsId,
          qbxsDeptId: row.qbxsDeptId ? row.qbxsDeptId : '',
          assistId: this.assistId,
          receiveCode: row.receiveCode ? (row.receiveCode + departCode) : '',
          assistType: 1,
          curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName,
          curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode,
          userId: this.curUser.id,
          userName: this.curUser.realName,
          opt: this.pageSource === 'detail' && Number(this.assistStatus) > 3 ? 'addRecord' : ''
        }
        this.$update('caseassistclue/delete', param).then((response) => {
          this.listLoading = false
          this.$emit('result', response.data)
          this.$emit('closeDialog', true)
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
      let mes = '确定要取消分发到该单位吗？'
      if (row.qbxsResult === 2) {
        mes = '当前的线索已经反馈，是否确认取消分发，取消后会清空反馈内容？'
      }
      this.$confirm(mes, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$query('hsyzparentdepart/' + row.receiveCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            const param = {
              qbxsId: row.qbxsId,
              qbxsDeptId: row.qbxsDeptId ? row.qbxsDeptId : '',
              assistId: this.assistId,
              receiveCode: row.receiveCode ? row.receiveCode : '',
              assistType: 1,
              receiveDept: response.data.departCode,
              receiveDeptName: response.data.departName,
              receiveDeptType: response.data.departType,
              curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName,
              curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode,
              userId: this.curUser.id,
              userName: this.curUser.realName,
              opt: Number(this.assistStatus) > 3 ? 'addRecord' : ''
            }
            if (this.pageSource !== 'detail') {
              param.toBoss = '1'
            }
            this.$update('caseassistclue/cancelDistribute', param).then((response) => {
              this.$emit('closeDialog', true)
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
          }
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    distribute() { // 线索分发
      if (this.checkId.length > 0 && this.deptCode) {
        const ids = this.checkId.join(',')
        let feedBackFlag = false
        for (let j = 0; j < this.checkId.length; j++) {
          const id = this.checkId[j]
          for (let i = 0; i < this.listData.length; i++) {
            const item = this.listData[i]
            if (Number(id) === Number(item.qbxsId) && item.qbxsResult === 2) {
              feedBackFlag = true
              break
            }
          }
          if (feedBackFlag) {
            break
          }
        }
        if (feedBackFlag) {
          this.$confirm('选中的线索中存在已经反馈的线索，是否要继续分发，分发后会清空反馈内容？', '提示', {
            type: 'warning',
            cancelButtonText: '否',
            confirmButtonText: '是'
          }).then(() => {
            this.executeMethod(ids)
          })
        } else {
          this.executeMethod(ids)
        }
      } else if (this.checkId.length === 0) { // 未勾选线索列表
        this.$message.error('请选择“线索”后分发线索。')
      } else if (!this.deptCode) { // 未选接收单位
        this.$message.error('请选择“接收单位”后分发线索。')
      }
    },
    executeMethod(ids) {
      const param = {
        assistId: this.assistId, // 协查id
        ids: ids, // 选择的线索唯一标识集合 英文逗号隔开
        acceptDeptCode: this.deptCode, // 接收的部门code
        acceptDeptName: this.acceptDeptName, // 接收的部门Name
        type: 1, // 1案件协查  2集群战役
        curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode, // 当前部门code  如果是派出所，传它的父部门code
        opt: Number(this.assistStatus) > 3 ? 'addRecord' : ''
      }
      if (this.pageSource === 'detail' && Number(this.assistStatus) > 3) { // 详情页进来的， 协查状态>3 是审核不通过以及通过以后的状态，需要以下参数
        param.curDeptName = this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName // 当前部门名称  如果是派出所，传它的父部门名称
        param.curDeptType = this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型  如果是派出所，传它的父部门类型
        param.userId = this.curUser.id
        param.userName = this.curUser.realName
      }
      if (Number(this.assistStatus) > 3) {
        param.curDeptName = this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName // 当前部门名称  如果是派出所，传它的父部门名称
        param.curDeptType = this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型  如果是派出所，传它的父部门类型
        param.userId = this.curUser.id
        param.userName = this.curUser.realName
      }
      this.btnLoading = true
      this.$update('caseassistclue/distribute', param).then((response) => {
        this.btnLoading = false
        this.$confirm('线索分发成功', '', {
          confirmButtonText: '继续分发',
          cancelButtonText: '完成分发',
          type: 'success'
        }).then(() => { // 继续分发
          this.checkId = []
          this.xsNum = 0
          this.deptCode = ''
          this.query(true)
          this.$emit('result', response.data)
          this.$emit('closeDialog', true)
        }).catch(() => { // 完成分发
          this.checkId = []
          this.xsNum = 0
          this.deptCode = ''
          this.query(true)
          this.$emit('result', response.data)
          this.$emit('closeDialog', false) // 关闭弹
        })
      }).catch(() => {
        this.btnLoading = false
      })
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
      let param = {}
      if (this.pageSource === 'detail') { // 如果是详情页按钮点击进来的 查当前地市下的大队
        param = {
          areaCode: this.curDept.areaCode, // 当前区域code
          curType: this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型
        }
      } else if (this.lycategory === '2') { // 主页点申请进来
        param = {
          areaCode: '610000', // 传省厅的区域code， 查所有的地市支队
          curType: '1' // 传总队的类型
        }
      } else {
        param = {
          areaCode: this.curDept.areaCode, // 当前区域code
          curType: this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型
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
    selectInit(row, index) { // 控制当前的行的复选框是否可选
      if (row.distributeAble === 2 || (this.pageSource !== 'detail' && row.qbxsDistribute === 2 && Number(this.assistStatus) > 3)) { // 以及分发过的线索
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    init(fastatus, jsdw, pageSource, disabled) {
      this.clearData()
      this.checkId = []
      this.xsNum = 0
      if (fastatus && fastatus !== '0') { // 分状态
        this.filters.qbxsDistribute = fastatus + ''
      }
      if (jsdw) {
        this.filters.receiveName = jsdw
      }
      if (pageSource) {
        this.pageSource = pageSource
      }
      if (disabled) {
        this.disabled = disabled
      }
      if (this.curDept.depType === '4') { // 派出所
        this.querypcssj() // 查询派出所的上级 把上级单位当做自己单位
      } else {
        this.queryCubordinate()
      }
      this.query(true)
    },
    handleClueMove(index, row) { // 线索流转记录
      this.qbxsId = row.qbxsId
      this.$emit('handleClueMove', this.qbxsId)
    }
  },
  mounted() {
    if (this.assistId) {
      this.curAssistId = this.assistId
    }
    if (this.source) {
      this.pageSource = this.source
    }
    if (this.category) {
      this.lycategory = this.category
    }
    if (this.sDisabled) {
      this.disabled = this.sDisabled
    }
    this.init(this.fastatus, this.jsdw)
  },
  activated() {

  }
}
</script>

<style>
  .caseAssist_distributeClue{
    padding: 0 10px;
  }
  .caseAssist_distributeClue .el-dialog__body {
    padding: 10px 0 15px 20px;
  }
  .caseAssist_distributeClue .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .caseAssist_distributeClue .el-table--border,
  .caseAssist_distributeClue .el-table--group {
    border: 1px solid #2f627a;
  }
  .caseAssist_distributeClue .el-table--border td {
   /* border-right: 1px solid #2f627a; */
    border-right-color: #2f627a;
  }
  .caseAssist_distributeClue .el-table--border::after,
  .caseAssist_distributeClue .el-table--group::after {
    width: 0;
  }
  .caseAssist_distributeClue .inputW{
    width: 400px;
  }
  .caseAssist_distributeClue .dis_table_div {
    width: 100%;
    overflow: auto;
  }
  .caseAssist_distributeClue .el-button [class*=el-icon-]+span{
    margin-left: 0;
  }
  .caseAssist_distributeClue .clueMove .el-dialog{
    width: 70%;
    overflow: auto;
  }
</style>
