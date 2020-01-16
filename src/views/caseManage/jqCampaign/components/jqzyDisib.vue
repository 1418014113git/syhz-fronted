<template>
  <section class="jqzyDisib">
   <!--线索分发-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
      <el-tooltip effect="dark" :content="filters.receiveName" placement="top-start" :popper-class="(filters.receiveName&&filters.receiveName.length>10)===true?'tooltipShow':'tooltipHide'">
        <el-form-item label="接收单位">
          <el-input v-model="filters.receiveName" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip effect="dark" :content="filters.address" placement="top-start" :popper-class="(filters.address&&filters.address.length>10)===true?'tooltipShow':'tooltipHide'">
        <el-form-item label="地址" label-width="55px">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
       </el-tooltip>
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
        <el-form-item label="分类" label-width="55px">
          <el-select  v-model="filters.qbxsCategory" size="small" placeholder="全部" clearable>
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
          class="qkts"
          placement="right"
          width="300"
          trigger="hover">
            <div>
              <span>线索分发步骤：</span><br>
              <span>1、列表勾选需要分发线索。</span><br>
              <span>2、选择线索接收单位。</span><br>
              <span>3、点击【线索分发】，向接收单位分发线索。</span><br>
              <span>线索删除说明：</span><br>
              <span>删除线索会删除对应线索反馈内容。</span><br>
            </div>
            <el-button  type="primary" size="mini" circle  slot="reference"><svg-icon icon-class="wenhao"></svg-icon></el-button>
          </el-popover>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="tableBox"  style="maxHeight:490px">
      <el-table :data="listData" v-loading="listLoading" ref="multipleTable" style="width: 100%;"  @select="handleselectRow" @select-all="handleselectAll">
        <el-table-column type="selection" width="50" :selectable='selectInit'></el-table-column>
        <el-table-column type="index" width="60" label="序号" ></el-table-column>
        <el-table-column prop="serialNumber"  label='线索序号'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveName"  label='接收单位'  min-width="250" show-overflow-tooltip >
          <template slot-scope="scope">
            <span @click="rowClick(scope.row.receiveName)">{{scope.row.receiveName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qbxsCategory"  label='线索分类'  min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if='scope.row.qbxsCategory'>{{$getDictName(scope.row.qbxsCategory+'','fllb')}}</span>
          </template>
        </el-table-column>
        <el-table-column  v-for="(item, index) in tableHead" :key="index" :label="item"   min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="rowClick(scope.row.data[index+1])">{{scope.row.data[index+1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="130" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" title="取消分发"  type="primary" circle  v-if="getDeptType(scope.row.qbxsDistribute,scope.row.receiveCode)" @click="handleCancel(scope.$index, scope.row)"><svg-icon icon-class="quxiao"></svg-icon></el-button>
            <el-button size="mini" title="删除线索" type="primary" icon="el-icon-delete" circle  v-if="pageSource!=='detail'"  @click="handleDel(scope.$index,scope.row)"></el-button>
            <el-button size="mini" title="线索流转记录"  type="primary" circle   v-if="pageSource==='detail'"  @click="handlelzDetail(scope.$index, scope.row)"><svg-icon icon-class="move"></svg-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <!--工具条-->
    <el-col :span="24" class="toolbar" >
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--线索流转记录弹出层-->
    <el-dialog title="线索流转记录" :visible.sync="isShowlzrecord" class="xslzdialog" append-to-body>
      <cluelz-detail :isShowdialog="isShowlzrecord" :row="curRow"></cluelz-detail>
    </el-dialog>
  </section>
</template>
<script>
import CluelzDetail from '../cluelzDetail' // 线索流转记录
export default {
  props: ['id', 'isShowDialog', 'source', 'fastatus', 'jsdw', 'xcstatus', 'faxsflag'],
  name: 'jqzyDisib',
  components: {
    CluelzDetail
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
      // checkIdRow: [], // 存储当前行被点击选中的项
      listData: [], // 线索列表
      ffbtnLoading: false, // 线索分发按钮加载loading
      listLoading: false, // 列表加载loading
      isShowlzrecord: false, // 是否显示线索流转记录弹框
      total: 0,
      page: 1,
      pageSize: 15,
      exDeptData: [], // 接收单位下拉框数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null,
      tableHead: [], // 表头
      pcsParentDept: {}, // 上级部门
      pageSource: '', // 进入页面的来源,
      xichastatus: '', // 如果是从详情页.列表页列表项过来的，会传递协查状态xcstatus
      faxs: '' // 详情页反馈列表点击当前行的是否是总队
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
        if (val) {
          setTimeout(() => {
            this.getParam()
            this.query(true)
          }, 500)
        }
      }
    },
    source: {
      handler: function(val, oldeval) {
        this.pageSource = val
      }
    },
    fastatus: { // 分发状态
      handler: function(val, oldeval) {
        if (val) {
          this.filters.qbxsDistribute = val + ''
        }
      }
    },
    jsdw: {
      handler: function(val, oldeval) {
        if (val) {
          this.filters.receiveName = val
        }
      }
    },
    xcstatus: { // 协查状态
      handler: function(val, oldeval) {
        if (val) {
          this.xichastatus = val + ''
        }
      }
    },
    faxsflag: { // 详情页反馈列表点击当前行的是否是总队
      handler: function(val, oldeval) {
        if (val) {
          this.faxs = val
        }
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
        assistId: this.assistId // 协查id 也就是集群id，
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
        // this.checkId = []
      }
      if (this.pageSource === 'detail') { // 详情页进来的
        para.queryType = 'execute'
      } else { // 申请或下发集群时
        para.queryType = 'create'
      }

      if (this.pageSource === 'detail' && Number(this.xichastatus) > 3 && Number(this.curDept.depType) > 1) { // 详情页进来的， 协查状态>3 是审核不通过以及通过以后的状态，需要传递当前部门code 厅级不用传，支队大队传当前部门
        para.deptCode = this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode // 当前部门code  如果是派出所，传它的父部门code
      }
      this.$query('ajglQbxs', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
          var titles = response.data.titles // 表头
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
    clearData() {
      this.filters = {
        address: '', // 地址
        receiveName: '', // 接收单位
        qbxsResult: '', // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '', // 分类
        qbxsDistribute: '' // 分发状态
      }
      this.xsNum = 0 // 已选线索数初始化
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
      this.checkId = []
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
          assistId: this.assistId,
          qbxsDeptId: row.qbxsDeptId ? row.qbxsDeptId : '',
          receiveCode: row.receiveCode ? row.receiveCode : '',
          curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName, // 当前部门名称
          curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode, // 当前部门code
          userId: this.curUser.id, // 用户id
          userName: this.curUser.realName // 用户名称
        }
        if (Number(this.xichastatus) > 3) {
          param.opt = 'addRecord'
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
      var tips = ''
      if (this.pageSource === 'detail') { // 详情页面进来的
        if (row.qbxsResult === 2) { // 已反馈的线索
          tips = '本条线索已反馈，是否要继续取消分发，分发后会清空已反馈内容！'
        } else { // 未反馈的线索
          tips = '是否确定取消分发该线索？'
        }
      } else { // 列表页，申请、下发创建时
        tips = '确定要取消分发到该单位吗？'
      }

      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          qbxsId: row.qbxsId,
          assistId: this.assistId,
          qbxsDeptId: row.qbxsDeptId ? row.qbxsDeptId : '',
          receiveCode: row.receiveCode ? row.receiveCode : '',
          curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName, // 当前部门名称
          curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode, // 当前部门code
          userId: this.curUser.id, // 用户id
          userName: this.curUser.realName // 用户名称
        }
        if (Number(this.xichastatus) > 3) {
          param.opt = 'addRecord'
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
        if (this.pageSource === 'detail' && Number(this.xichastatus) > 3) { // 详情页进来的， 协查状态>3 是审核通过以及通过以后的状态，需要以下参数
          param.curDeptName = this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName // 当前部门名称  如果是派出所，传它的父部门名称
          param.curDeptType = this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType // 当前部门类型  如果是派出所，传它的父部门类型
          param.userId = this.curUser.id
          param.userName = this.curUser.realName
        }
        this.ffbtnLoading = true
        this.$update('caseassistclue/distribute', param).then((response) => {
          this.xsNum = 0 // 已选线索数值初始化
          this.checkId = [] // 已选线索线索集合初始化
          this.ffbtnLoading = false
          this.$confirm('线索分发成功', '', {
            confirmButtonText: '继续分发',
            cancelButtonText: '完成分发',
            type: 'success'
          }).then(() => { // 继续分发
            this.query(true, true)
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
        qbxsCategory: '', // 分类
        qbxsDistribute: '' // 分发状态
      }
      this.deptCode = '' // 接收单位code
      this.acceptDeptName = '' // 接收单位名称
      this.initData()
      this.query(true)
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
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
    handleselectAll(selection) { // 全选
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
        if (this.faxs) { // 详情页反馈列表当前行是总队
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
      } else { // 申请，下发页面进来的
        param = {
          areaCode: '610000', // 传省厅的区域code， 查所有的地市支队
          curType: '1' // 传总队的类型
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
    getDeptType(qbxsDistribute, deptCode) { // 获取当前行的部门类型
      if (qbxsDistribute === 2) { // 已分发
        if (this.pageSource === 'detail') { // 从详情页点'线索分发'进来的
          const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
          for (let i = 0; i < deptArr.length; i++) {
            const item = deptArr[i]
            if (item.depCode === deptCode) {
              if (item.depType === '2') { // 支队
                return false
              } else {
                return true
              }
            }
          }
        } else {
          return true
        }
      } else { // 未分发
        return false
      }
    },
    getParam() {
      if (this.id) {
        this.assistId = this.id
      }
      if (this.source) {
        this.pageSource = this.source
      }
      if (this.curDept.depType === '4') { // 派出所
        this.querypcssj() // 查询派出所的上级 把上级单位当做自己单位
      } else {
        this.queryCubordinate() // 查接收单位
      }
      if (this.fastatus) { // 分发状态
        this.filters.qbxsDistribute = this.fastatus
      }
      if (this.jsdw) { // 接收单位
        this.filters.receiveName = this.jsdw
      }
      if (this.xcstatus) {
        this.xichastatus = this.xcstatus
      }
      if (this.faxsflag) {
        this.faxs = this.faxsflag
      }
    },
    selectInit(row, index) { // 控制当前的行的复选框是否可选
      if (row.distributeAble === 2) { // 已分发过的线索
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    controllzBtn(row) { // 控制反馈线索流转记录按钮显示
      return true
    },
    handlelzDetail(index, row) { // 显示线索流转记录弹框
      this.isShowlzrecord = true
      row.clusterId = row.assistId
      this.curRow = row
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.getParam()
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
  .tableBox{
    width: 100%;
    overflow: auto;
  }
}
.qkts{
  margin-left: 10px;
  .el-button--mini.is-circle, .el-button--small.is-circle {
    padding: 0;
  }
  .svg-icon[data-v-5d4549d3] {
    width: 1.3em;
    height: 1.3em;
  }
}
.xslzdialog{
  .el-dialog{
    width: 80%;
    max-height: 80vh;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
</style>
