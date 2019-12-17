<template>
  <section class="caseAssist">
    <el-form :inline="true" :model="filters" ref="filters" label-width="106px">
      <el-form-item label="行政区划">
        <el-tooltip effect="dark" :content="selectCurArea.cityName" placement="top-start" :popper-class="(selectCurArea.cityName&&selectCurArea.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
          <el-cascader :options="areaOptions" :disabled="areaDisabled" :clearable="!areaDisabled && String(curDept.depType) !== '2'" v-model="filters.area" :props="areaProps" change-on-select @change="handleAreaChange" :show-all-levels="false" placeholder="全部" popper-class="caseAssist_cascader"></el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="参与单位">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader :options="deptOptions" :disabled="deptDisabled" :clearable="!deptDisabled" v-model="filters.department" :props="deptProps" change-on-select :show-all-levels="false" @change="handleDeptChange" placeholder="全部"></el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="全部" clearable>
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('jqzyzt')" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" style="margin-left: -4px;">
        <el-input v-model="filters.title" size="small" placeholder="请输入标题" clearable maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="发起日期">
        <el-date-picker v-model="filters.createStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" @change="startDateChange($event, 'createEndDate')"></el-date-picker>
        <el-form-item label="至" class="time_left">
          <el-date-picker :disabled="filters.createStartDate === undefined || filters.createStartDate === null || filters.createStartDate === ''" v-model="filters.createEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" @change="endDateChange($event, 'createEndDate')"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="filters.endStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" @change="startDateChange($event, 'endEndDate')"></el-date-picker>
        <el-form-item label="至" class="time_left" label-width="102px">
          <el-date-picker :disabled="filters.endStartDate === undefined || filters.endStartDate === null || filters.endStartDate === ''" v-model="filters.endEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" @change="endDateChange($event, 'endEndDate')"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true, true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
        <el-button type="primary" v-if="$isViewBtn('100901') && (String(curDept.depType) === '2' || String(curDept.depType) === '3')" size="small" v-on:click="handleAdd">申请</el-button>
        <el-button type="primary" v-if="$isViewBtn('100902') && (String(curDept.depType) === '1' || (String(curDept.depType) === '2' && curDept.areaCode !== '611400' && curDept.areaCode !== '616200'))" size="small" v-on:click="handleLowerHair">下发</el-button>
        <el-button type="primary" v-if="$isViewBtn('100904')" size="small" v-on:click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" ref="listTable" v-loading="listLoading" style="width: 100%;" class="statisticCollect" :max-height="tableHeight" @selection-change="handleSelectionChange" :row-class-name="getRowClassName">
      <el-table-column type="expand" width="30">
        <template slot-scope="scope">
          <el-table :data="scope.row.deptList">
            <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
            <el-table-column prop="deptName" align="center" label="地市" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xsNum" align="center" label="检查线索数量（已核查/总）">
              <template slot-scope="scopeChild">
                <span>
                  <a v-if="scopeChild.row.hc && childEnableTo(scope.row, scopeChild.row)" @click="toXS(scopeChild.row, '2', true, scope.row)" class="text_url">{{scopeChild.row.hc}}</a>
                  <span v-else>{{scopeChild.row.hc || 0}}</span>
                </span>
                      /
                <span>
                  <a v-if="scopeChild.row.xsNum && childEnableTo(scope.row, scopeChild.row)" @click="toXS(scopeChild.row, '', true, scope.row)" class="text_url">{{scopeChild.row.xsNum}}</a>
                  <span v-else>{{scopeChild.row.xsNum || 0}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="hcl" align="center" label="检查率">
              <template slot-scope="scopeChild">
                {{scopeChild.row.hcl}} %
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="52"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="10%" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="handleDetail(scope.$index, scope.row)" class="title_link">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyDeptName" label="发起单位" min-width="12%"></el-table-column>
      <el-table-column prop="startDate" label="发起日期" min-width="5%">
        <template slot-scope="scope">
          {{$parseTime(scope.row.startDate, '{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="结束日期" min-width="5%">
        <template slot-scope="scope">
          {{$parseTime(scope.row.endDate, '{y}-{m}-{d}')}}
        </template>
      </el-table-column>

      <el-table-column label="线索数量（已核查/总）" min-width="8%">
        <template slot-scope="scope">
          <span>
            <a v-if="scope.row.hcCount && enableTo(scope.row)" @click="toXS(scope.row, '2', false)" class="text_url">{{scope.row.hcCount}}</a>
            <span v-else>{{scope.row.hcCount || 0}}</span>
          </span>
          /
          <span>
            <a v-if="scope.row.xsCount && enableTo(scope.row)" @click="toXS(scope.row, '', false)" class="text_url">{{scope.row.xsCount}}</a>
            <span v-else>{{scope.row.xsCount || 0}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="6%">
        <template slot-scope="scope">
          <span v-if='scope.row.status'>{{$getDictName(String(scope.row.status), 'jqzyzt')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tCount" label="厅评价" min-width="5%"></el-table-column>
      <el-table-column prop="sCount" label="市评价" min-width="5%"></el-table-column>
      <el-table-column label="操作" width="124">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" type="primary" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button v-if="$isViewBtn('100905') && (String(scope.row.status) === '0' || String(scope.row.status) === '1' || String(scope.row.status) === '3') && scope.row.applyDeptCode === curDept.depCode && $isViewBtn('100905')" title="编辑" @click="handleEdit(scope.$index, scope.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button v-if="$isViewBtn('100906') && (String(scope.row.status) === '0' || String(scope.row.status) === '1' || String(scope.row.status) === '3') && scope.row.applyDeptCode === curDept.depCode && $isViewBtn('100906')" title="删除" @click="handleDel(scope.$index, scope.row)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog title="查阅密码" :visible.sync="detailDialogVisible" :close-on-click-modal="false" class="password_dialog" @close="closeDialog">
      <el-form :model="detailPassForm" ref="detailPassForm" :rules="detailPassRules" label-width="100px">
        <el-form-item label="查阅密码" prop="password">
          <el-input v-model="detailPassForm.password" type="password" maxlength="20" minlength="6" size="small" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">取消</el-button>
        <el-button type="primary" @click="checkDialogPass" class="saveBtn" :loading="detailPassBtnLoading">验证</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导出协查战果反馈" :visible.sync="exportDialogVisible" :close-on-click-modal="false" class="export_dialog" @close="closeDialog">
      <el-radio v-model="exportRadio" label="1" @change="exportRadioChange">全部查询结果</el-radio>
      <el-radio v-model="exportRadio" label="2" @change="exportRadioChange" :disabled="multipleSelection.length === 0">选中记录</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">取消</el-button>
        <el-button type="primary" @click="executeExport" class="saveBtn" :loading="exportBtnLoading">导出</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
export default {
  name: 'assistlist',
  data() {
    return {
      filters: {
        area: [],
        department: [],
        status: '',
        title: '',
        createStartDate: null,
        createEndDate: null,
        endStartDate: null,
        endEndDate: null
      },
      noCheck: false,
      initArea: [],
      initDepartment: [],
      areaOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      selectCurDep: { name: '' }, // 当前选中的部门
      selectCurArea: { cityName: '' }, // 当前行政区划
      areaProps: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      deptDisabled: false,
      areaDisabled: false,
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      listData: [],
      tableHeight: null,
      detailDialogVisible: false,
      detailPassForm: {
        password: ''
      },
      detailPassBtnLoading: false,
      detailPassRules: {
        password: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请输入查阅密码！'))
            }
            if (!this.$regEnNumber.test(value)) {
              return callback(new Error('查阅密码只支持输入6~20位英文和数字！'))
            }
            return callback()
          }
        }]
      },
      multipleSelection: [],
      oldMultipleSelection: [],
      exportBtnLoading: false,
      exportRadio: '1',
      exportDialogVisible: false
    }
  },
  methods: {
    enableTo(row) {
      if (this.curDept.depType === '1') { // 总队可查看所有
        return true
      }
      if (this.curDept.depType === '2') { // 支队
        if (row.cityCode === this.curDept.areaCode) {
          return true
        }
      }
      if (row.applyDeptCode === this.curDept.depCode) { // 当前登录部门是申请部门
        return true
      }
      if (String(row.category) === '2') { // 申请
        if (row.auditDeptCode === this.curDept.depCode) { // 当前登录部门是审核部门
          return true
        }
      }
      return false
    },
    childEnableTo(row, childRow) {
      if (this.curDept.depType === '1') { // 总队可查看所有
        return true
      }
      if (this.curDept.depType === '2') { // 支队
      }
      if (row.applyDeptCode === this.curDept.depCode) { // 当前登录部门是：申请部门(申请协查)、发起部门(下发协查)
        return true
      }
      if (String(row.category) === '2') {
        if (row.auditDeptCode === this.curDept.depCode) {
          return true
        }
      }
      if (childRow.deptCode === this.curDept.depCode) { // 本地市部门
        return true
      }
      return false
    },
    getRowClassName({ row, rowIndex }) {
      if (row.groupSize === 0) {
        return 'row-expand-cover'
      }
    },
    query(flag, clear) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        curDeptCode: this.curDept.depCode,
        status: this.filters.status,
        start1: this.filters.createStartDate,
        end1: this.filters.createEndDate,
        start2: this.filters.endStartDate,
        end2: this.filters.endEndDate,
        isCheck: this.$isViewBtn('100908'),
        noCheck: this.noCheck && !clear ? 'noCheck' : ''
      }
      para.queryDeptCode = this.filters.department.length > 0 ? this.filters.department[this.filters.department.length - 1] : ''
      para.provinceCode = this.filters.area[0] ? this.filters.area[0] : ''
      para.cityCode = this.filters.area[1] ? this.filters.area[1] : ''
      para.reginCode = this.filters.area[2] ? this.filters.area[2] : ''
      this.$query('caseAssist/list', para).then((response) => {
        this.listLoading = false
        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.total = response.data.totalCount
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.query(false)
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const para = {
          assistId: row.assistId
        }
        this.$update('caseAssist/delete', para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(false)
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$gotoid('/caseAssist/add', JSON.stringify({ type: 'add', category: '2' }))
    },
    handleLowerHair() {
      this.$gotoid('/caseAssist/lowerHair', JSON.stringify({ type: 'add', category: '3' }))
    },
    handleExport() {
      this.exportDialogVisible = true
      if (this.multipleSelection.length > 0) {
        this.exportRadio = '2'
      } else {
        this.exportRadio = '1'
        this.exportRadioChange('1')
      }
    },
    handleDetail(index, row) {
      if (row.havePwd === 0) {
        this.$gotoid('/caseAssist/detail', row.assistId)
      } else {
        this.detailDialogVisible = true
        this.detailPassForm.id = row.assistId
      }
    },
    handleEdit(index, row) {
      this.$gotoid('/caseAssist/edit', JSON.stringify({ type: 'edit', category: String(row.category), id: row.assistId }))
    },
    clear() {
      this.filters = {
        area: this.initArea,
        department: this.initDepartment,
        status: '',
        title: '',
        createStartDate: null,
        createEndDate: null,
        endStartDate: null,
        endEndDate: null
      }
      this.query(true, true)
    },
    toXS(row, type, flag, parentRow) {
      const para = {
        id: row.assistId,
        type: type,
        assistType: '1',
        deptCode: '',
        cityCode: row.cityCode
      }
      if (flag) {
        if (String(parentRow.category) === '3' && String(this.curDept.depType) === '2') {
          const apply = this.findParentDept(parentRow.applyDeptCode)
          if (String(apply.depType) === '2') {
            para.cityCode = parentRow.cityCode
          } else {
            para.cityCode = row.deptCode.substring(0, 6)
          }
        } else {
          para.cityCode = row.deptCode.substring(0, 6)
        }
      } else {
        if (row.deptList.length > 1) {
          para.cityCode = '610000'
        } else {
          const apply = this.findParentDept(row.applyDeptCode)
          para.cityCode = apply.parentCode.substring(0, 6)
        }
      }
      this.$router.push({
        path: '/caseAssist/clueList', query: para // 线索列表页面
      })
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
    closeDialog() {
      this.detailDialogVisible = false
      this.detailPassForm = {
        password: ''
      }
      if (this.$refs.detailPassForm) {
        this.$refs.detailPassForm.resetFields()
      }
      this.exportDialogVisible = false
      this.$refs.listTable.clearSelection()
    },
    executeExport() {
      this.exportBtnLoading = true
      if (this.exportRadio === '2') {
        if (this.multipleSelection.length === 0) {
          this.$alert('请勾选需要导出的记录', '提示', { type: 'warning' })
          this.exportBtnLoading = false
          return false
        }
      }
      const ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const item = this.multipleSelection[i]
        ids.push(item.assistId)
      }
      const para = {
        assistIds: ids.join(','),
        curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName,
        realName: this.curUser.realName,
        curUserPhone: this.curUser.phone ? this.curUser.phone : '',
        fileName: '涉案线索协查参与地战果反馈表'
      }
      this.$download('caseAssist/export', para)
      const _this = this
      setTimeout(function() {
        _this.$message({
          message: '导出协查战果反馈信息成功！',
          type: 'success'
        })
        _this.exportBtnLoading = false
        _this.exportDialogVisible = false
        _this.$refs.listTable.clearSelection()
      }, 2000)
    },
    exportRadioChange(val) {
      if (String(val) === '1') {
        if (this.multipleSelection.length > 0) {
          this.oldMultipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
        }
        this.listData.forEach(row => {
          if (this.multipleSelection.indexOf(row) === -1) {
            this.$refs.listTable.toggleRowSelection(row)
          }
        })
      }
      if (String(val) === '2' && this.oldMultipleSelection.length > 0) {
        this.listData.forEach(row => {
          let flag = false
          for (let i = 0; i < this.oldMultipleSelection.length; i++) {
            const item = this.oldMultipleSelection[i]
            if (row.assistId === item.assistId) {
              flag = true
              break
            }
          }
          if (!flag) {
            this.$refs.listTable.toggleRowSelection(row)
          }
          // if (this.oldMultipleSelection.indexOf(row) === -1) {
          //   this.$refs.listTable.toggleRowSelection(row)
          // }
        })
        this.multipleSelection = JSON.parse(JSON.stringify(this.oldMultipleSelection))
      }
    },
    checkDialogPass() {
      this.detailPassBtnLoading = true
      this.$refs.detailPassForm.validate(valid => {
        if (valid) {
          const para = {
            pwd: this.detailPassForm.password,
            assistId: this.detailPassForm.id
          }
          this.$update('caseAssist/detailPwd', para).then(response => {
            this.detailDialogVisible = false
            this.$gotoid('/caseAssist/detail', this.detailPassForm.id)
          })
        }
      })
    },
    initData() { // 初始化筛选条件
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          const arr = response.data ? response.data : []
          if (String(this.curDept.depType) === '2') {
            arr[0].disabled = true
            for (let i = 0; i < arr[0].children.length; i++) {
              const item = arr[0].children[i]
              if (String(item.cityCode) !== String(this.curDept.areaCode)) {
                item.disabled = true
              }
            }
          }
          this.areaOptions = arr
          let currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
          } else if (this.curDept.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            this.deptDisabled = true
            this.areaDisabled = true
          } else if (this.curDept.depType === '4') {
            this.areaDisabled = true
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.initArea = currentArea
          this.filters.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          let currentDepartment = []
          if (this.curDept.depType === '-1') { // 省
            currentDepartment = [this.curDept.depCode]
          } else if (this.curDept.depType === '1') { // 总队
            currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentDepartment = [this.curDept.depCode]
          } else if (this.curDept.depType === '3') { // 大队
            currentDepartment = [this.curDept.depCode]
          } else if (this.curDept.depType === '4') { // 派出所
            currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
          }
          this.initDepartment = currentDepartment
          this.filters.department = currentDepartment
        }
        this.query(false)
      }).catch(() => {
      })
    },
    handleAreaChange(val) { // 行政区划
      this.selectCurDep = { name: '' } // 当前选中的部门
      this.filters.department = []
      if (val.length > 0) {
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        const param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              var arr = []
              const data = response.data
              for (let i = 0; i < data.length; i++) {
                const obj = data[i]
                if (obj.depType !== '4') { // 不展示派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
              }
              this.deptOptions = getTree(arr) // 机构
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    handleDeptChange(val) { // 单位机构名称鼠标移上去显示全部
      if (val.length > 0) {
        const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.department = []
        this.selectCurDep = { name: '' }
      }
    },
    startDateChange(val, key) {
      if (val === undefined || val === null || val === '') {
        this.filters[key] = ''
      }
    },
    endDateChange(val, key) {
      console.info(val, key)
    },
    handleSelectionChange(val) {
      // val 为整个{}
      this.multipleSelection = val
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
      const param = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (param) {
        if (param.noCheck) {
          this.noCheck = param.noCheck
        }
      }
      sessionStorage.setItem(this.$route.path, '')
    }
    this.initData()
  }
}
</script>

<style>
  .caseAssist .el-form .el-cascader.el-cascader--small,
  .caseAssist .el-form .el-input.el-input--small,
  .caseAssist .el-form .el-select.el-select--small,
  .caseAssist .el-date-editor.el-input,
  .caseAssist .el-date-editor.el-input__inner{
    width: 222px;
  }
  .caseAssist .time_left{
    padding-left: 10px;
    margin-right: 0;
    margin-bottom: 0;
  }
  .export_dialog .el-dialog{
    width: 25%;
  }
  .export_dialog .el-dialog__body{
    padding-left: 20px;
  }
  .caseAssist .text_url{
    text-decoration: underline;
    color: #009bda;
  }
  .caseAssist .row-expand-cover .el-table__expand-icon{
    visibility:hidden;
  }
  .password_dialog .el-dialog{
    width: 30%;
  }
  .password_dialog .el-dialog__body{
    padding: 20px 20px 0;
  }
  .caseAssist_cascader .el-cascader-menu__item.is-disabled {
    background-color: #00537d;
  }
  .caseAssist_cascader .el-cascader-menu__item.is-disabled:hover{
    color: #1E98D2;
  }
  .caseAssist .title_link{
    text-decoration: underline;
    cursor: pointer;
  }
  .caseAssist .title_link:hover{
    color: #009bda;
  }
</style>
