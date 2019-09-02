<template>
  <div class="CaseMapping">
    <el-row>
      <el-col :span="8" style="padding: 5px 10px 20px; max-height: 500px; overflow: auto">
        <el-tree class="filter-tree" :data="deptData" :props="defaultProps" default-expand-all ref="tree"
                 highlight-current :filter-node-method="filterNode" @node-click="getCurrentNode"
                 :default-checked-keys="selectedData" :expand-on-click-node="false" node-key="id"
                 style="margin-top: 5px;">
        </el-tree>
      </el-col>
      <el-col :span="16" style="padding: 5px 20px;">
        <div v-loading="rightLoad">
          <el-button v-if="caseCheckNode == curDeptId && $isViewBtn('102015')" class="float_r" type="primary" size="small" @click="openReport">上报案件</el-button>
          <div class="dept_name">{{caseCheckText}}</div>
          <div class="dept_investigation_num">
            <span>上报案件总数：{{totalReportCaseNum}}</span>
            <span>本级上报案件总数：{{currentReportCaseNum}}</span>
            <span>下级上报案件总数：{{childrenReportCaseNum}}</span>
          </div>
          <el-table :data="reportCaseList" v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="AJMC" label="案件名称"></el-table-column>
            <el-table-column prop="code_name" label="案件类型"></el-table-column>
            <el-table-column prop="create_date" label="上报时间"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="reportCaseTotal > 0" layout="prev, pager, next" @current-change="caseCurrentChange"
                           :page-size="20" :total="reportCaseTotal" :current-page="reportCasePage" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
      <el-dialog title="上报案件" :visible.sync="dialogVisible" @close="reClickNode">
        <reportCase ref="reportCaseQuery" :id="taskId" :caseCheckNode="curDeptId" @refreshList="reClickNode"></reportCase>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import {
    getSessionDeptSelect
  } from '@/api/depts'
  import {
    getSpecialTaskDepts
  } from '@/api/dept'
  import {
    getReportCaseListPage, getReportCaseTotal
  } from '@/api/specialTasks'
  import reportCase from '../reportCase'

  export default {
    name: 'CaseMapping',
    props: [
      'id', 'depts'
    ],
    components: {
      reportCase
    },
    data() {
      return {
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
        selectedData: [],
        selectedNode: {},
        queryArr: [],
        caseCheckText: '',
        caseInfo: {},
        reportCaseList: [],
        reportCaseTotal: 0,
        reportCasePage: 1,
        caseCheckNode: 0,
        curDeptId: '',
        taskId: '',
        deptList: []
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
            message: '请选择上报部门', type: 'warning'
          })
        } else {
          this.dialogVisible = true
        }
      },
      caseCurrentChange(val) {
        this.page = val
        this.queryCase()
      },
      queryCase() {
        const para = {
          pageNum: this.reportCasePage,
          deptIds: this.queryArr,
          taskId: this.id
        }
        getReportCaseListPage(para).then((response) => {
          this.listLoading = false
          this.reportCaseList = response.data.list
          this.reportCaseTotal = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
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
        this.reportCasePage = 0
        this.reportCaseList = []

        const all = this.queryArr
        all.push(this.caseCheckNode)
        if (value.children && value.children !== null) {
          this.queryCase()
          getReportCaseTotal({
            deptIds: all, taskId: this.id
          }).then((response) => {
            this.rightLoad = false
            this.totalReportCaseNum = response.data[0].total
            getReportCaseTotal({
              deptIds: [this.caseCheckNode], taskId: this.id
            }).then((response) => {
              this.rightLoad = false
              this.currentReportCaseNum = response.data[0].total
              this.childrenReportCaseNum = this.totalReportCaseNum - this.currentReportCaseNum
            }).catch(() => {
              this.rightLoad = false
            })
          })
        } else {
          this.queryArr = [this.caseCheckNode]
          this.queryCase()
          getReportCaseTotal({
            deptIds: [this.caseCheckNode], taskId: this.id
          }).then((response) => {
            this.totalReportCaseNum = response.data[0].total
            this.currentReportCaseNum = response.data[0].total
            this.childrenReportCaseNum = 0
            this.rightLoad = false
          }).catch(() => {
            this.rightLoad = false
          })
        }
      },
      getDepts() {
        // this.curDept.parentDepCode, this.curDept.depCode
        this.deptData = getSpecialTaskDepts(getSessionDeptSelect(), this.deptList)
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
      const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (curDept) {
        this.curDeptId = curDept.id
      }
    },
    watch: {
      id(val) {
        this.taskId = val
      },
      depts(val) {
        this.deptList = val
        this.getDepts()
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
