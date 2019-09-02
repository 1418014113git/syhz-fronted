<template>
  <div>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card height_500">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="专项任务列表" name="first">
              <ul class="case_ul" v-loading="listLoading">
                <li v-for="(data,index) in taskList" :key="index" class="case_li" :class="{ active:changeRed === data.id}"
                    @click="detailTask(data.id)">
                  <span class="content">
                    <a :title="data.task_name" class="ellipsis-word">
                      <span class="el-radio__input"><span class="el-radio__inner"></span></span>
                      {{ data.task_name }}
                    </a>
                  </span>
                </li>
              </ul>
              <el-col :span="24">
                <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="taskCurrentChange"
                              :page-size="pageSize" :total="total" :current-page="page" style="float:right; padding:0;">
                </el-pagination>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card height_500" v-loading="infoLoading">
          <div v-if="info.task_name">
            <!-- <div>
              <el-button style="position: absolute; right: 20px;" size="small" @click="back">返回</el-button>
            </div> -->
            <p class="card_title">
              <span style="margin-right:50px;">任务信息</span>
            </p>
            <div class="report">
              <div class="header_title">{{ info.task_name }}</div>
              <el-row>
                <el-col :span="4" style="text-align: right">任务时间：</el-col>
                <el-col :span="10">{{ $parseTime(info.start_date, '{y}-{m}-{d}') }} 至 {{ $parseTime(info.end_date, '{y}-{m}-{d}') }}&nbsp;</el-col>
                <el-col :span="4" style="text-align: right">签发人：</el-col>
                <el-col :span="4">
                  <p :title="convertName(info.duty_person_json)" class="ellipsis-word">{{ convertName(info.duty_person_json) }}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" style="text-align: right">承办单位：</el-col>
                <el-col :span="10"><p :title="info.create_dept_name" class="ellipsis-word">{{ info.create_dept_name }}</p></el-col>
                <el-col :span="4" style="text-align: right">联系电话：</el-col>
                <el-col :span="4">{{ info.partake_phone}}&nbsp;</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" style="text-align: right">承办人：</el-col>
                <el-col :span="10">
                  <p :title="convertName(info.partake_person_json)" class="ellipsis-word">{{ convertName(info.partake_person_json) }}</p>
                </el-col>
              </el-row>
              <div class="content e-p-line ql-editor" v-html="info.task_description"></div>
              <div v-if="attachmentList.length > 0" class="footer">
                相关下载：
                <p v-for="(item,index) in attachmentList" :key="index">
                  <a @click="downFile(item.path)">{{item.name}}</a>
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top: 10px;">
        <el-card class="box-card">
          <el-tabs v-model="activeName1" @tab-click="handleClick">
            <el-tab-pane label="最新进展" name="first" class="timeLine_w">
              <time-line-small :caseId="changeRed" :type="6"></time-line-small>
            </el-tab-pane>
            <el-tab-pane label="案件信息" name="second">
              <case-mapping :id="changeRed" :depts="taskDepts"></case-mapping>
            </el-tab-pane>
            <el-tab-pane label="情报信息" name="qbxsmapper">
              <qbxs-mapping :speTaskId="changeRed" :depts="taskDepts" :deptIds="info.dept_ids" :state="info.status" :ifSign="1"></qbxs-mapping>
            </el-tab-pane>
            <el-tab-pane label="签收情况" name="third">
              <receive :id="changeRed"></receive>
            </el-tab-pane>
            <el-tab-pane label="成果情况" name="fourth">
              <achievement :id="changeRed"></achievement>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getTaskListPage, getTask, getReportCaseListPage
  } from '../../api/specialTasks'
  import timeLineSmall from '../common/timeLineSmall'
  import CaseMapping from './components/CaseMapping'
  import Receive from './components/Receive'
  import Achievement from './components/Achievement'
  import QbxsMapping from './components/QbxsMapping'

  export default {
    name: 'casedb',
    components: {
      'time-line-small': timeLineSmall,
      'case-mapping': CaseMapping,
      'receive': Receive,
      'achievement': Achievement,
      'qbxs-mapping': QbxsMapping
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      return {
        curDeptId: '',
        attachmentList: [],
        changeRed: 0,
        dialogVisible: false,
        filterText: '',
        id: 0,
        activeName: 'first',
        activeName1: 'first',
        total: 0,
        page: 1,
        pageSize: 10,
        reportCaseTotal: 0,
        reportCasePage: 1,
        reportPageSize: 10,
        listLoading: false,
        taskList: [],
        selectedData: [],
        info: {},
        infoLoading: false,
        reportForm: {
          task_id: '',
          title: '',
          dept: '',
          create_date: '',
          description: '',
          attachment: ''
        },
        reportCaseList: [],
        points: [],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        caseCheckNode: 0,
        caseCheckText: '',
        totalReportCaseNum: 0,
        currentReportCaseNum: 0,
        childrenReportCaseNum: 0,
        reportCheckNode: 0,
        reportCheckText: '',
        taskDepts: []
      }
    },
    methods: {
      handleClick(tab, event) {
      },
      convertName(text) {
        if (!text || text === '') {
          return ''
        }
        const arr = JSON.parse(text)
        let result = ''
        for (let i = 0; i < arr.length; i++) {
          result += arr[i]['name'] + '；'
        }
        return result
      },
      taskCurrentChange(val) {
        this.page = val
        this.query()
      },
      caseCurrentChange(val) {
        this.page = val
        this.query()
      },
      query() {
        this.listLoading = true
        const para = {
          pageNum: this.page,
          deptId: this.curDeptId
        }
        getTaskListPage(para).then((response) => {
          this.listLoading = false
          this.taskList = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
          this.detailTask(response.data.list[0].id)
          this.id = response.data.list[0].id
        }).catch(() => {
          this.listLoading = false
        })
      },
      detailTask(id) {
        this.infoLoading = true
        this.changeRed = id
        this.id = id
        this.info = {}
        getTask({
          id: id
        }).then((response) => {
          this.infoLoading = false
          const data = response.data
          this.info = data
          if (data.dept_list) {
            const array = JSON.parse(data.dept_list)
            array.push({
              id: data.create_dept_id
            })
            this.taskDepts = array
          }
          if (data.attachment) {
            this.attachmentList = JSON.parse(data.attachment)
          }
        }).catch(() => {
          this.infoLoading = false
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      queryCase(arr) {
        const para = {
          pageNum: this.reportCasePage,
          dept: arr,
          taskId: this.id
        }
        getReportCaseListPage(para).then((response) => {
          this.listLoading = false
          this.reportCaseList = response.data.list
          this.reportPageSize = response.data.pageSize
          this.reportCaseTotal = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      getArray(data) {
        const arr = []
        for (const i in data) {
          arr.push(data[i].id)
          this.getArray(data[i].children)
        }
        return arr
      },
      addReport() {
        this.$router.push({
          path: '/specialTasks/reportResults/' + this.id
        })
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
      downFile(path) {
        window.open(path)
      },
      back() {
        this.$router.back(-1)
      }
    },
    mounted() {
      const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (curDept) {
        this.curDeptId = curDept.id
        this.query()
      }
    }
  }
</script>

<style scoped>
  .case_ul {
    padding: 0;
    font-size: 14px;
    margin-top: 2px;
  }

  .case_li {
    list-style: none;
    cursor: pointer;
    padding-left: 10px;
  }

  .case_li.active,
  .case_li:hover {
    /* background-color: rgba(0, 160, 233, 0.6); */
    background-color: rgba(188, 232, 252, 0.1);
  }

  .case_li.active .el-radio__inner {
    border-color: #1b75ba;
  }

  .case_li .content {
    display: inline-block;
    width: 100%;
    height: 37px;
    line-height: 37px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .case_li > p {
    display: inline-block;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .case_db > p span {
    width: 30%;
    display: inline-block;
  }

  .case_db > p span:first-child {
    margin-right: 5em;
    text-align: right;
  }

  .float_r {
    float: right;
  }

  .height_500 {
    height: 500px;
    overflow-y: auto;
  }

  .box-card {
    margin: 2px 2px 0 2px;
  }

  .box-card .card_title {
    display: inline-block;
    height: 40px;
    line-height: 45px;
  }

  .report {
    width: 95%;
    margin: 0 auto;
  }

  .report h2 {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }

  .report h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .report .header_title {
    text-align: center;
    font-weight: bold;
    font-size: 22px;
    width: 80%;
    color: #dddddd;
    margin: 0 auto 20px;
  }

  .report .content {
    clear: both;
    padding: 20px 0;
    text-indent: 2em;
  }

  .report .footer {
    font-size: 12px;
  }

  .report .footer p {
    margin: 3px 0 0 20px;
  }

  .report .footer p a {
    color: #1b75ba;
    text-decoration: underline;
  }

  .report .footer p a:hover {
    color: #1e98d2;
  }

  .dept_name {
    font-weight: bold;
    font-size: 22px;
  }

  .dept_report_num {
    padding: 5px 0;
  }

  .dept_report_num span {
    margin-right: 20px;
    font-weight: bold;
  }

  .timeLine_w {
    width: 90%;
    margin: 0 auto;
    max-height: 500px;
    overflow-y: auto;
    padding: 30px 20px 100px;
  }
</style>
