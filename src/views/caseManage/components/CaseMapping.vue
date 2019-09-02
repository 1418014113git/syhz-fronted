<template>
  <div class="CaseMapping">
    <el-row>
      <el-col :span="8" style="padding: 5px 10px; max-height: 500px; overflow: auto">
        <el-tree class="filter-tree" :data="deptData" :props="defaultProps" default-expand-all ref="tree"
                 highlight-current :filter-node-method="filterNode" @node-click="getCurrentNode"
                 :default-checked-keys="selectedData" :expand-on-click-node="false" node-key="id"
                 style="margin-top: 5px;">
        </el-tree>
      </el-col>
      <el-col :span="16" style="padding: 5px 20px;">
        <div v-loading="rightLoad">
          <el-button v-if="enableBtn && $isViewBtn('101010') && ifSign && inegState" class="float_r" type="primary" size="small" @click="openReport">上报案件</el-button>
          <div class="dept_name">{{caseCheckText}}</div>
          <div class="dept_investigation_num">
            <span>上报案件总数：{{totalReportCaseNum}}</span>
            <span>本级上报案件总数：{{currentReportCaseNum}}</span>
            <span>下级上报案件总数：{{childrenReportCaseNum}}</span>
          </div>
          <el-table :data="reportCaseList" v-loading="listLoading" style="width: 100%; margin-top: 5px;">
            <el-table-column prop="AJMC" label="案件名称"></el-table-column>
            <el-table-column prop="code_name" label="案件类型"></el-table-column>
            <el-table-column prop="create_date" label="上报时间"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="reportCaseTotal > 0" layout="prev, pager, next" @current-change="caseCurrentChange"
                           :page-size="pageSize" :total="reportCaseTotal" :current-page="reportCasePage" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
      <el-dialog title="上报案件" :visible.sync="dialogVisible" @close="reClickNode">
        <reportCase ref="reportCaseQuery" :id="id" :caseCheckNode="curDeptId" @refreshList="reClickNode"></reportCase>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import {
    getSessionDeptSelect
  } from '@/api/depts'
  import {
    getAssistTaskDepts
  } from '@/api/dept'
  import {
    getInvestigationCaseListPage, getInvestigationCaseTotal
  } from '@/api/investigation'
  import reportCase from '@/views/caseManage/reportCase'

  export default {
    name: 'CaseMapping',
    props: ['deptIds', 'depts', 'state', 'ifSign'],
    components: {
      reportCase
    },
    data() {
      return {
        enableBtn: false,
        inegState: false,
        totalReportCaseNum: 0,
        currentReportCaseNum: 0,
        childrenReportCaseNum: 0,
        rightLoad: false,
        listLoading: false,
        dialogVisible: false,
        filterText: '',
        deptData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        id: '',
        selectedData: [],
        selectedNode: {},
        queryArr: [],
        caseCheckText: '',
        caseInfo: {},
        reportCaseList: [],
        reportCaseTotal: 0,
        reportCasePage: 1,
        caseCheckNode: 0,
        pageSize: 10,
        curDeptId: '',
        cusDept: {},
        deptIdsStr: ''
      }
    },
    methods: {
      getArray(data) {
        const arr = []
        for (const i in data) {
          arr.push(data[i].id)
          this.getArray(data[i].children)
        }
        return arr
      },
      openReport() {
        if (this.caseCheckNode === 0) {
          this.$message({
            message: '请选择上报部门',
            type: 'warning'
          })
        } else {
          this.dialogVisible = true
        }
      },
      caseCurrentChange(val) {
        this.reportCasePage = val
        this.queryCase()
      },
      queryCase() {
        const para = {
          pageNum: this.reportCasePage,
          deptIds: this.queryArr,
          investigationId: this.id
        }
        getInvestigationCaseListPage(para).then((response) => {
          this.listLoading = false
          this.reportCaseList = response.data.list
          this.reportCaseTotal = response.data.totalCount
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      getCurrentNode(value, data) {
        this.selectedNode = value
        this.rightLoad = true
        this.caseCheckNode = value.id
        this.caseCheckText = value.name
        this.queryArr = []
        if (value.children) {
          this.queryArr = this.getArray(value.children)
        } else {
          this.queryArr.push(value.id)
        }
        this.dept = this.queryArr.toString()
        this.reportCasePage = 1
        this.reportCaseList = []

        const all = this.queryArr
        all.push(this.caseCheckNode)
        if (value.children && value.children !== null) {
          this.queryCase()
          getInvestigationCaseTotal({
            deptIds: all, investigationId: this.id
          }).then((response) => {
            this.totalReportCaseNum = response.data[0].num
            getInvestigationCaseTotal({
              deptIds: [this.caseCheckNode], investigationId: this.id
            }).then((response) => {
              this.rightLoad = false
              this.currentReportCaseNum = response.data[0].num
              this.childrenReportCaseNum = this.totalReportCaseNum - this.currentReportCaseNum
            })
          })
        } else {
          this.queryArr = [this.caseCheckNode]
          this.queryCase()
          getInvestigationCaseTotal({
            deptIds: [this.caseCheckNode], investigationId: this.id
          }).then((response) => {
            this.totalReportCaseNum = response.data[0].num
            this.currentReportCaseNum = response.data[0].num
            this.childrenReportCaseNum = 0
            this.rightLoad = false
          })
        }
        if (this.deptIdsStr && this.deptIdsStr.indexOf('[' + this.cusDept.id + ']') > -1 && this.selectedNode.id === this.cusDept.id) {
          this.enableBtn = true
        } else {
          this.enableBtn = false
        }
      },
      getDepts() {
        this.deptData = getAssistTaskDepts(getSessionDeptSelect(), this.deptList)
      },
      reClickNode() {
        this.dialogVisible = false
        this.getCurrentNode(this.selectedNode, '')
        if (this.$refs.reportCaseQuery) {
          this.$refs.reportCaseQuery.query(true)
        }
      }
    },
    mounted() {
      this.cusDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.cusDept) {
        this.curDeptId = this.cusDept.id
        this.id = this.$route.params.id
      }
    },
    watch: {
      deptIds(val) {
        this.deptIdsStr = val
      },
      depts(val) {
        this.deptList = val
        this.getDepts()
      },
      state(val) {
        if (val && val !== '') {
          if (Number(val) >= 5 && Number(val) < 7) {
            this.inegState = true
          }
        }
      }
    }
  }
</script>

<style scoped>
  .CaseMapping .float_r {
    float: right;
  }

  .CaseMapping .dept_name {
    font-weight: bold;
    font-size: 22px;
  }

  .CaseMapping .dept_investigation_num span {
    padding: 5px 35px 5px 0;
  }

  .CaseMapping .filter-tree {
    width: 550px;
  }
</style>
