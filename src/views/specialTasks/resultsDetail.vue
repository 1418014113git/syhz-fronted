<template>
  <div>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toBack">   <!--返回-->
    </el-row>
    <div class="resultsDetail">
      <el-card style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>成果信息</span>
          <!-- <el-button type="text" @click="toBack" style="float: right;">返回</el-button> -->
        </div>
        <div style="clear: both ;width: 90%">
          <div class="header_title">{{ form.title }}</div>
          <el-row type="flex" justify="center">
            <el-col :span="4" style="text-align: right">上报部门：</el-col>
            <el-col :span="10">{{form.create_dept_name}}</el-col>
            <el-col :span="2" style="text-align: right">上报时间：</el-col>
            <el-col :span="8">{{form.create_date}}</el-col>
          </el-row>
          <div class="content e-p-line ql-editor" v-html="form.desription"></div>
          <div class="footer" v-if="attachmentList.length > 0">
            相关下载：
            <p v-for="(item,index) in attachmentList" :key="index">
              <a @click="downFile(item.path)">{{item.name}}</a>
            </p>
          </div>
          <div style="padding: 10px 0;">
            侦办刑事案件{{ form.xsajnum }}起，抓获犯罪嫌疑人{{ form.zhxyrnum }}人（其中刑事拘留{{ form.xsjlnum }}人，逮捕{{ form.dbnum }}人，取保候审{{ form.qbhsnum }}人，判刑{{ form.pxnum }}人）
          </div>
          <div style="height: 100px;"></div>
        </div>
      </el-card>
      <el-card v-if="type === 'examine'" style="margin-top: 20px; margin-bottom: 50px">
        <div slot="header" class="clearfix">
          <span>审核</span>
        </div>
        <el-row v-if="examined" style="padding: 20px;">
          <el-col :span="6" style="text-align: right;">是否通过：</el-col>
          <el-col :span="14" style="padding-left: 20px;">
            <el-tag type="success" v-if="bean.status === 'pass'">通过</el-tag>
            <el-tag type="warning" v-if="bean.status === 'reject'">驳回</el-tag>
          </el-col>
        </el-row>
        <el-row v-if="!examined" style="padding: 20px;">
          <el-col :span="6" style="text-align: right;">是否通过：</el-col>
          <el-col :span="14" style="padding-left: 20px;">
            <el-radio v-model="bean.status" label="pass">通过</el-radio>
            <el-radio v-model="bean.status" label="reject">驳回</el-radio>
          </el-col>
        </el-row>
        <el-row style="padding: 20px;" v-show="bean.status === 'reject'">
          <el-col :span="6" style="text-align: right;">
            驳回理由：
          </el-col>
          <el-col :span="14" style="padding-left: 20px;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              v-model="bean.content"
              :disabled="examined"
              clearable>
            </el-input>
          </el-col>
        </el-row>
        <el-row v-if="!examined" style="padding: 20px;">
          <el-col :span="8" style="text-align: right">
            <el-button type="primary" @click="onSubmit">审 核</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { getReport, getReportExamine } from '@/api/specialTasks'
  import { workExaminePass, workExamineReject } from '@/api/workflow'
  export default {
    data() {
      return {
        form: {},
        attachmentList: [],
        type: '',
        bean: {},
        curDept: {},
        curUser: {},
        examined: false,
        taskId: null
      }
    },
    methods: {
      detailReport() {
        const para = {
          id: this.$route.params.id
        }
        getReport(para).then((response) => {
          const data = response.data
          this.form = data
          if (data.attachment) {
            this.attachmentList = JSON.parse(data.attachment)
          }
          this.bean.id = data.id
          this.taskId = data.task_id
        })
        getReportExamine({
          pageNum: 1,
          pageSize: 1,
          id: this.$route.params.id,
          deptId: this.curDept.id
        }).then((response) => {
          if (response.data && response.data.length > 0) {
            const data = response.data[0]
            this.bean.flowId = data.wfId + ''
            this.bean.wdId = data.wdId + ''
            this.bean.content = data.content
            if (data.wdfStatus === '4') {
              this.bean.status = 'reject'
            } else if (data.wdfStatus === '3') {
              this.bean.status = 'pass'
            }
            if (data.wdfStatus !== '1') {
              this.examined = true
            }
          }
        })
      },
      downFile(path) {
        window.open(path)
      },
      onSubmit() {
        if (!this.bean.status) {
          this.$message({
            message: '请审核', type: 'warning'
          })
          return false
        }
        if (this.bean.status === 'pass') {
          workExaminePass(this.bean).then((res) => {
            this.toList()
          })
        }
        if (this.bean.status === 'reject') {
          if (!this.bean.content) {
            this.$message({
              message: '请输入驳回理由', type: 'warning'
            })
            return false
          }
          workExamineReject(this.bean).then((res) => {
            this.toList()
          })
        }
      },
      toList() {
        this.$router.push({
          path: '/specialTasks/results/' + this.$route.params.taskId
        })
      },
      toBack() {
        this.$router.push({
          path: '/specialTasks/results/' + this.taskId
        })
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curUser && this.curDept) {
        this.bean.userId = this.curUser.id
        this.bean.userName = this.curUser.realName
        this.bean.deptId = this.curDept.id
        this.bean.deptName = this.curDept.depName
        this.bean.type = 'SPECIALTASKREPORT'
        this.bean.serverType = '0007'
        this.bean.businessId = this.$route.params.taskId
        this.detailReport()
        if (this.$route.params.type) {
          this.type = this.$route.params.type
        }
      }
    }
  }
</script>

<style scoped>
  .resultsDetail, .resultsDetail div{
    margin: 0 auto;
  }
  .resultsDetail {
    width: 70%;
    min-height: 400px;
  }
  .resultsDetail h2{
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }
  .resultsDetail h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .resultsDetail .header_title{
    text-align: center;
    font-weight: bold;
    font-size: 22px;
    color: #0099ff;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .resultsDetail .content{
    clear: both;
    padding: 20px 0;
    text-indent: 2em;
  }
  .resultsDetail .footer{
    font-size: 12px;
  }
  .resultsDetail .footer p{
    margin: 3px 0 0 20px;
  }
  .resultsDetail .footer p a{
    color: #1b75ba;
    text-decoration: underline;
  }
  .resultsDetail .footer p a:hover{
    color: #1e98d2;
  }
  .resultsDetail .title{
    text-align: right;
  }
</style>
