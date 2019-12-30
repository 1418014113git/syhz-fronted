<template>
  <section  class="ajMergeList">
    <!--重复合并列表-->
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" v-if="showBackBtn" @click="back">   <!--返回-->
    </el-col>
    <!-- 默认展示 本单位下发和重复合并案件记录 -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="90px">
        <el-form-item label="认领单位" prop="areaRl">
          <el-cascader
            :options="xzqhOptionsRl"
            v-model="filters.areaRl"
            :props="props"
            change-on-select
            @change="handleAreaChange($event,'rl')"
            :show-all-levels="false"
            placeholder="全部"
            :clearable="Number(curDept.depType)<2"
            :disabled="Number(curDept.depType)>2">
          </el-cascader>
          <el-tooltip effect="dark" :content="selectCurDepRl.name" placement="top-start" :popper-class="(selectCurDepRl.name&&selectCurDepRl.name.length>9)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptionsRl"
              v-model="filters.departmentRl"
              :props="deptProps"
              change-on-select
              :show-all-levels="false"
              @change="handleDeptChange($event,'rl')"
              clearable placeholder="全部"
              :disabled="curDept.depType>3">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="合并状态" prop="status">
          <el-select clearable v-model="filters.status" placeholder="全部">
            <el-option v-for="item in $getDicts('hbzt')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因" prop="remarkType">
          <el-select clearable v-model="filters.remarkType" placeholder="全部">
            <el-option v-for="item in $getDicts('hbyy')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="下发单位" prop="examStatus">
          <el-cascader
            :options="xzqhOptionsXf"
            v-model="filters.areaXf"
            :props="props"
            change-on-select
            @change="handleAreaChange($event,'xf')"
            :show-all-levels="false"
            placeholder="全部"
            clearable>
          </el-cascader>
          <el-tooltip effect="dark" :content="selectCurDepXf.name" placement="top-start" :popper-class="(selectCurDepXf.name&&selectCurDepXf.name.length>9)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptionsXf"
              v-model="filters.departmentXf"
              :props="deptProps"
              change-on-select
              :show-all-levels="false"
              @change="handleDeptChange($event,'xf')"
              clearable placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="操作日期" prop="startDate">
          <el-date-picker
            v-model="filters.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="czStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="endDate">
            <el-date-picker
            v-model="filters.endDate"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            :picker-options="czEndPickerOptions"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="endDateDisabled">
          </el-date-picker>
        </el-form-item>
        <!-- $isViewBtn('100701') -->
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="getCaseMerge(true,true)" v-if="$isViewBtn('103201')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="reset()" v-if="$isViewBtn('103201')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight"
      :row-key='getRowKeys' :expand-row-keys="expandstab" @expand-change="handleExpand">
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <p>重复案件</p>
          <el-table :data="mergeCases" v-loading="mergeLoading" style="width:700px;">
            <el-table-column label="案件名称">
              <template slot-scope="expandProps">
                <a class="ajbh-color" @click="handleAjDetail(expandProps.$index, expandProps.row)">{{expandProps.row.ajmc}}</a>
              </template>
            </el-table-column>
            <el-table-column label="案件编号">
              <template slot-scope="expandProps">
                <a class="ajbh-color" @click="handleAjDetail(expandProps.$index, expandProps.row)">{{expandProps.row.ajbh}}</a>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="案件名称" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件编号" width="230" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajbh}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="ajlb" label="案件类别" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ajzt" label="案件状态" width="100" align="center"></el-table-column>
      <el-table-column prop="larq" label="立案日期" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.larq">{{$handlerDateTime(scope.row.larq)}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="applyDeptName" label="认领单位" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creationDeptName" label="下发单位" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status"  label="合并状态" width="100" align="center">
        <template slot-scope="scope">
          {{$getDictName(scope.row.status+'','hbzt')}}
          <!-- <el-tag :type="scope.row.status==3?'':(scope.row.status==5?'success':(scope.row.status==9?'warning':'danger'))">{{getStatusName(scope.row)}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="原因" prop="remarkType" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.remark">{{$getDictName(scope.row.remarkType+'','hbyy')}}（{{scope.row.remark}}）</span>
          <span v-else>{{$getDictName(scope.row.remarkType+'','hbyy')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mergeDate" label="操作日期" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <!--
            合并（认领单位可操作、已合并 不合并案件不显示该按钮）、
            操作记录（能查到人都能看）、
            修改、删除（待合并、不合并记录下发单位可修改或删除，待合并的删除后待办事项记录也删除）

            下发案件重复合并流程中只有下发单位有权限移除案件、修改案件和添加案件。如果已合并，不允许修改或删除
           -->
          <el-button v-if="scope.row.applyDeptCode===curDept.depCode && scope.row.status===1 && $isViewBtn('103202')"
            size="small" plain circle @click="handleCaseMerge(scope.$index, scope.row)" icon="el-icon-rank" title="合并"></el-button>
          <el-button v-if="$isViewBtn('103203')" size="small" plain circle @click="handleOperateRecord(scope.row)" icon="el-icon-tickets" title="操作记录"></el-button>
          <el-button v-if="scope.row.creationDeptCode===curDept.depCode && scope.row.status!==2 && $isViewBtn('103204')"
            size="small" plain circle @click="handleMergeEdit(scope.row)" icon="el-icon-edit" title="编辑"></el-button>
          <el-button v-if="scope.row.creationDeptCode===curDept.depCode && scope.row.status!==2 && $isViewBtn('103205')"
            size="small" plain circle @click="handleMergeDelete(scope.row)" icon="el-icon-delete" title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 重复合并弹框 -->
    <!-- <el-dialog title="重复合并案件" :visible.sync="isShowDialog"  class="stshForm" width="60%" @close="closeDialog" :close-on-click-modal="false">
      <case-merge :curCaseData="curCase" @closeMerge="closeDialog" ></case-merge>
    </el-dialog> -->
    <!-- 操作记录 -->
    <el-dialog title="操作记录" :visible.sync="isShowRecordDialog"  class="stshForm" width="60%" @close="closeDialog" :close-on-click-modal="false" :modal-append-to-body="false">
      <el-table :data="mergeRecoeds" highlight-current-row v-loading="recordsLoading" style="width: 100%;" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="deptName" label="操作单位" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creationName" label="操作人" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creationTime" label="操作时间" width="170" show-overflow-tooltip></el-table-column>
        <el-table-column label="保留/移除案件编号" width="230" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajbh}}</a>
          </template>
        </el-table-column>
        <el-table-column label="保留/移除案件名称" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajmc}}</a>
          </template>
        </el-table-column>
        <el-table-column label="原因" prop="remarkType" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{$getDictName(scope.row.remarkType+'','hbyy')}}（{{scope.row.remark}}）</span>
            <span v-else>{{$getDictName(scope.row.remarkType+'','hbyy')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作" width="100" align="center">
          <template slot-scope="scope">
            {{$getDictName(scope.row.type+'','cfhbcz')}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            {{$getDictName(scope.row.status+'','hbzt')}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>
<script>
import { parseTime } from '@/utils/index'
import { getTree } from '@/api/dept'

export default {
  data() {
    return {
      filters: {
        status: '' // 合并状态
      },
      xzqhOptionsRl: [], // 认领单位 行政区划数据
      deptOptionsRl: [],
      xzqhOptionsXf: [], // 下发单位 行政区划数据
      deptOptionsXf: [],
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      cases: [], // 列表数据
      listLoading: false, // 列表loading
      total: 0,
      page: 1,
      pageSize: 15,
      pcsParentDept: {}, // 派出所的父级
      endDateDisabled: true, // 操作日期结束时间禁用
      selectCurDepRl: {}, // 认领单位
      selectCurDepXf: {}, // 下发单位 当前选择的机构
      czStartPickerOptions: { // 操作日期 开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      czEndPickerOptions: {}, // 操作日期 结束时间的picker限制
      curCase: {}, // 点击的当前案件
      isShowDialog: true, // 重复合并案件弹框
      showBackBtn: false, // 是否展示返回按钮（只有从统计跳转过来 才展示返回按钮）
      tableHeight: null,
      ajlxFirst: '', // 当前选中的案件类别第一级
      isShowRecordDialog: false, // 操作记录弹框
      mergeRecoeds: [], // 操作记录
      recordsLoading: false, // 操作记录弹框loading
      expandstab: [], // 设置当前的展开行
      mergeCases: [], // 展开行的合并案件
      mergeLoading: false, // 展开行的loading
      getRowKeys(row) {
        return row.id
      },
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  filters: {
    formatDate(time) {
      if (time) {
        return parseTime(time, '{y}-{m}-{d}')
      } else {
        return ''
      }
    }
  },
  methods: {
    initList(hand) {
      var _this = this
      this.listLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptionsRl = response.data ? JSON.parse(JSON.stringify(response.data)) : [] // 防止response data被改
          this.xzqhOptionsXf = response.data ? JSON.parse(JSON.stringify(response.data)) : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
            // _this.xzqhOptionsRl[0].disabled = true
            for (let index = 0; index < this.xzqhOptionsRl[0].children.length; index++) { // 支队 不能选择其他市
              const element = this.xzqhOptionsRl[0].children[index]
              if (element.cityCode === this.curDept.areaCode) {
                _this.xzqhOptionsRl[0].children[index].disabled = false
              } else {
                _this.xzqhOptionsRl[0].children[index].disabled = true
              }
            }
          } else if (this.curDept.depType === '3') { // 大队
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') { // 派出所
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          if (this.curDept.depType === '1') { // 总队，下发单位选自己
            this.filters.areaXf = currentArea
            this.handleAreaChange(currentArea, 'xf') // 查单位机构--认领单位
          } else if (this.curDept.depType === '2') { // 支队
            this.filters.areaRl = currentArea
            this.handleAreaChange(currentArea, 'rl') // 查单位机构--认领单位
          } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 大队或者派出所
            this.filters.areaRl = currentArea
            this.handleAreaChange(currentArea, 'rl') // 查单位机构--认领单位
          }
          // 默认选择本单位
          if (this.curDept.depType === '-1') { // 省
            this.filters.departmentXf = [this.curDept.depCode]
          } else if (this.curDept.depType === '1') { // 总队
            this.filters.departmentXf = [this.curDept.parentDepCode, this.curDept.depCode]
          } else if (this.curDept.depType === '2') { // 支队
            if (this.carryParam && this.carryParam.origin === 'portal') { // 从首页跳转来，支队选自己，别的地方来 支队只选到市
              this.filters.departmentRl = [this.curDept.depCode]
            }
          } else if (this.curDept.depType === '3') { // 大队
            this.filters.departmentRl = [this.curDept.depCode]
          } else if (this.curDept.depType === '4') { // 派出所
            this.filters.departmentRl = [this.curDept.parentDepCode] // 派出所当作上级处理
            // 调接口查 派出所的上级
            this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
              if (response.code === '000000') {
                this.pcsParentDept = response.data
              }
            }).catch(() => {
              this.caseLoading = false
            })
          }
          if (this.curDept.depType === '1') {
            this.handleDeptChange(this.filters.departmentXf, 'xf')
          } else {
            this.handleDeptChange(this.filters.departmentRl, 'rl')
          }
          if (hand) {
            this.getCaseMerge(true, true)
          } else {
            this.getCaseMerge(true)
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDeptChange(val, type) {
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            if (type === 'rl') {
              this.selectCurDepRl = dept
            } else if (type === 'xf') {
              this.selectCurDepXf = dept
            }
            break
          }
        }
      } else {
        if (type === 'rl') {
          this.selectCurDepRl = { name: '' }
        } else if (type === 'xf') {
          this.selectCurDepXf = { name: '' }
        }
      }
    },
    handleAreaChange(val, type) {
      if (type === 'rl') {
        this.filters.departmentRl = []
        this.deptOptionsRl = []// 清空单位机构数据
        this.selectCurDepRl = { name: '' } // 清空当前选中的单位机构
      } else if (type === 'xf') {
        this.filters.departmentXf = []
        this.deptOptionsXf = []
        this.selectCurDepXf = { name: '' } // 清空当前选中的单位机构
      }
      if (val.length > 0) {
        var param = {
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
              if (type === 'rl') {
                this.deptOptionsRl = getTree(arr) // 机构
              } else if (type === 'xf') {
                this.deptOptionsXf = getTree(arr) // 机构
              }
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        if (type === 'rl') {
          this.deptOptionsRl = [] // 机构
        } else if (type === 'xf') {
          this.deptOptionsXf = [] // 机构
        }
      }
    },
    getCaseMerge(flag, hand) {
      this.expandstab = [] // 展开行 全收起来
      this.page = flag ? 1 : this.page
      var para = JSON.parse(JSON.stringify(this.filters))
      para.areaRl = ''
      para.departmentRl = ''
      para.areaXf = ''
      para.departmentXf = ''

      // 认领单位
      para.applyAreaCode = this.filters.areaRl ? this.filters.areaRl[this.filters.areaRl.length - 1] : ''
      para.applyDeptCode = this.filters.departmentRl ? this.filters.departmentRl[this.filters.departmentRl.length - 1] : ''
      // 下发单位
      para.creationAreaCode = this.filters.areaXf ? this.filters.areaXf[this.filters.areaXf.length - 1] : ''
      para.creationDeptCode = this.filters.departmentXf ? this.filters.departmentXf[this.filters.departmentXf.length - 1] : ''
      para.departType = this.curDept.depType === '4' ? this.pcsParentDept.depType : this.curDept.depType // 当前部门类型

      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (this.filters.startDate && !this.filters.endDate) { // 选择了开始时间,结束时间为空
        this.$message({
          message: '结束时间不能为空', type: 'error'
        })
        return false
      }
      para.startDate = para.startDate ? para.startDate + ' 00:00:00' : '' // 开始时间
      para.endDate = para.endDate ? para.endDate + ' 23:59:59' : '' // 结束时间
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      this.$query('caseMerge/list', para).then((response) => {
        if (response.code === '000000') {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.cases = data.list
          this.listLoading = false
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleExpand(row, expands) { // 展开行 查合并的案件
      if (expands.length) {
        this.expandstab = []
        if (row) {
          this.expandstab.push(row.id)
        } else {
          this.expandstab = []
        }
      }
      this.mergeLoading = true
      // 查重复案件（详情接口）
      this.$query('caseMerge/detail/' + row.id, {}).then((response) => {
        this.mergeLoading = false
        if (response.code === '000000') {
          var data = response.data.caseList
          var arr = []
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (element.type === 2) { // 展开项只展示 合并的案件
              arr.push(element)
            }
          }
          this.mergeCases = arr // 案件
        }
      }).catch(() => {
        this.mergeLoading = false
      })
    },
    handleCaseMerge(index, row) { // 案件合并
      var param = {
        type: 'isMerge',
        id: row.id
      }
      // this.$router.push({ path: '/caseManage/caseMergeForm', query: param })
      this.$gotoid('/caseManage/caseMergeForm', JSON.stringify(param))
    },
    handleMergeEdit(row) { // 编辑
      var param = {
        type: 'edit',
        id: row.id
      }
      this.$gotoid('/caseManage/caseMergeForm', JSON.stringify(param))
    },
    handleOperateRecord(row) { // 操作记录
      this.isShowRecordDialog = true
      this.mergeRecoeds = []
      this.recordsLoading = true
      this.$query('caseMerge/logList', { id: row.id }).then((response) => {
        this.recordsLoading = false
        if (response.code === '000000') {
          this.mergeRecoeds = response.data
        }
      }).catch(() => {
        this.recordsLoading = false
      })
    },
    closeDialog() { // 关闭操作记录的弹框
      this.isShowRecordDialog = false
    },
    handleMergeDelete(row) { // 删除
      this.$confirm('确认要删除该条记录？', '提示', {
        type: 'warning',
        cancelButtonText: '否',
        confirmButtonText: '是'
      }).then(() => {
        this.$update('caseMerge/delete/' + row.id, {}).then((response) => {
          if (response.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getCaseMerge(true)
          }
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          message: '已取消',
          type: 'info'
        })
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getCaseMerge(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getCaseMerge(false, true)
    },
    startDateChange(val) { // 操作开始时间change事件
      if (val) {
        this.endDateDisabled = false
        this.czEndPickerOptions = this.$pickerOptionChange(val, this.czEndPickerOptions, 'end')
      } else {
        this.filters.larqStart = ''
        this.filters.larqEnd = ''
        this.endDateDisabled = true
        this.czStartPickerOptions = this.$pickerOptionChange('', this.czStartPickerOptions, 'default')
      }
    },
    endDateChange(val) { // 操作结束时间change事件
      if (val) {
        this.czStartPickerOptions = this.$pickerOptionChange(val, this.czStartPickerOptions, 'start')
      } else {
        this.czStartPickerOptions = this.$pickerOptionChange('', this.czStartPickerOptions, 'default')
      }
    },
    reset() {
      this.filters = {}
      this.initList()
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detail/' + row.id })
      if (row.status === '5' || row.status === '已认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, rlDept: row.noticeOrgCode, isRl: '1' } // 展示申请督办等按钮
        })
      } else if (row.status === '3' || row.status === '待认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '0', rlId: row.id, rlDept: row.noticeOrgCode } // 展示 待认领按钮
        })
      } else {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
        })
      }
    },
    hasAccess(row) {
      // 判断是否可以操作案件
      if (this.curDept.depType === '4') {
        if (this.pcsParentDept && this.pcsParentDept.departCode === row.noticeOrgCode) {
          return true
        } else {
          return false
        }
      } else {
        if (this.curDept.depCode === row.noticeOrgCode) {
          return true
        } else {
          return false
        }
      }
    },
    back() {
      // if (this.carryParam.ajbh) { // 返回案件档案
      this.$router.back(-1)
      // } else { // 返回统计
      //   var param = {
      //     yearDate: this.carryParam.yearDate || '', // 筛选框的值
      //     quarterDate: this.carryParam.quarterDate || '',
      //     monthDate: this.carryParam.monthDate || '',
      //     queryType: this.carryParam.queryType || '',
      //     startTime: this.carryParam.startTime || '',
      //     endTime: this.carryParam.endTime || ''
      //   }
      //   this.$gotoid('/caseManage/caseClaimStatistical', JSON.stringify(param))
      // }
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseMergeList')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // alert(JSON.stringify(this.filters))
    if (sessionStorage.getItem(this.$route.path)) {
      this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (this.carryParam.origin) {
        this.showBackBtn = true // 显示返回按钮
      }
      if (this.carryParam.origin === 'portal') { // 从首页跳转来
        this.filters.status = '1'
      }
      //   if (this.carryParam.type) {
      //     this.qsStatus = this.carryParam.type
      //     this.qsStatusChange(this.qsStatus)
      //   }
      //   if (this.carryParam.deptCode.substring(0, 6) === '610000') {
      //     if (this.carryParam.deptLevel === 'first') {
      //       this.tingOrgCode = [this.carryParam.deptCode]
      //     } else {
      //       this.tingOrgCode = [this.carryParam.curFirstLevelCode, this.carryParam.deptCode]
      //     }
      //   } else {
      //     if (this.carryParam.deptLevel === 'first') {
      //       this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4)]
      //     } else {
      //       this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4), this.carryParam.deptCode]
      //       if (this.carryParam.deptCode.substring(4, 6) !== '00') {
      //         this.qiOrgCode = this.carryParam.deptCode
      //       }
      //     }
      //   }
      //   this.shiDepChange(this.shiOrgCode)
      //   if (this.carryParam.filtStartTime) { // 开始时间
      //     this.filters.rlStartTime = this.carryParam.filtStartTime
      //   }
      //   if (this.carryParam.filtEndTime) { // 结束时间
      //     this.filters.rlEndTime = this.carryParam.filtEndTime
      //   }
      //   if (this.carryParam.queryType) { // 认领时间筛选类型
      //     this.filters.dType = this.carryParam.queryType
      //   }
      //   // if (this.carryParam.ajbh) { // 案件档案跳转过来的
      //   //   this.filters.AJBH = this.carryParam.ajbh
      //   // }
      // } else if (this.$route.query.ajbh) { // 案件档案跳转过来的
      //   this.filters.AJBH = this.$route.query.ajbh
      //   this.showBackBtn = true // 显示返回按钮
      // } else {
      //   this.showBackBtn = false // 默认隐藏返回按钮
    }
    this.initList()
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" >
.ajMergeList {
  .tooltipShow {
    opacity: 1;
  }
  .tooltipHide {
    opacity: 0;
  }
  .el-cascader--small {
    font-size: 16px;
  }
  .el-button + .el-button {
    margin-left: 0px;
    margin-bottom: 4px;
  }
  .el-form .el-cascader.el-cascader--small,
  .el-form .el-input.el-input--small,
  .el-form .el-select.el-select--small {
    width: 222px;
  }
}
</style>

