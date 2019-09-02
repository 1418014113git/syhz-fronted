<template>
<div>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back"> <!--返回-->
    </el-row>
    <div class="investigation">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card" style="height: 500px;">
          <el-row>
            <el-col :span="16" class="card_title">
              <span style="margin-right:50px;">案件信息</span>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="mini" v-if="Number(investigation.status) >= 5 && showQsBtn && isPartake && $isViewBtn('101017')"
                         v-loading.fullscreen.lock="doStateLoading" @click="doStateDb(0)">签收
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">开始时间：</el-col>
            <el-col :span="10">{{ investigation.create_time}}</el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col>任务案件</el-col>
          </el-row>
          <div v-if="caseInfo.AJMC">
            <el-row style="margin-top: 10px;" type="flex" justify="center">
              <el-col class="text_c" style="font-size: 18px;"> {{caseInfo.AJMC}}</el-col>
            </el-row>
            <el-row style="margin-top: 10px;" type="flex" justify="center">
              <el-col class="text_c" style="font-size: 18px;">{{caseInfo.AJBH}}</el-col>
            </el-row>
            <el-row style="margin-top: 20px;" type="flex" justify="center">
              <el-col :span="6">
                <p class="p_htl1">
                  <el-button v-if="!isConcern" type="warning" icon="el-icon-star-off" circle @click="saveConcern"></el-button>
                  <el-button v-else type="success" icon="el-icon-star-off" circle @click="saveConcern"></el-button>
                </p>
                <p v-if="!isConcern" class="p_htl2">关注</p>
                <p v-else class="p_htl2">已关注</p>
              </el-col>
              <el-col :span="6">
                <p class="p_htl1">状态</p>
                <p class="p_htl2">{{ caseInfo.AJZT_NAME}}</p>
              </el-col>
              <el-col :span="6">
                <p class="p_htl1">涉案价值 </p>
                <p class="p_htl2">¥{{ caseInfo.SAJZ }}</p>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px;border:1px solid #00a0e9; padding:10px;">
              <el-row style="margin-top: 10px;">
                <el-col :span="2"></el-col>
                <el-col :span="10">案件类型: {{caseInfo.AJXZ_NAME}}</el-col>
              </el-row>
              <el-row style="margin-top: 10px;">
                <el-col :span="6">案件类别:</el-col>
                <el-col :span="16">{{caseInfo.AJLB_NAME }}</el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col :span="6">立案日期:</el-col>
                <el-col :span="16">{{$handlerDateTime(caseInfo.LARQ) }}</el-col>
              </el-row>
            </el-row>
          </div>
          <div v-else style="height: 302px; line-height: 100px; text-align: center; font-size: 16px;">
            无关联案件
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card" style="height: 500px; overflow-y: auto">
          <!-- <div><el-button style="position: absolute; right: 20px;" size="small" @click="back">返回</el-button></div> -->
          <div class="header_title">{{ investigation.assist_title }}</div>
          <el-row class="header_time">
            <el-col :span="2" style="text-align: right">发布者：</el-col>
            <el-col :span="3">{{ investigation.apply_person_name }}</el-col>
            <el-col :span="3" style="text-align: right">发布时间：</el-col>
            <el-col :span="5">{{ investigation.create_time }}</el-col>
            <el-col :span="3" style="text-align: right">信息来源：</el-col>
            <el-col :span="8">
              <p :title="investigation.apply_dept_name" class="ellipsis-word">{{ investigation.apply_dept_name }}</p>
            </el-col>
          </el-row>
          <div class="content e-p-line ql-editor" v-html="investigation.assist_content"></div>
          <div class="footer" v-if="attachment.length > 0">
          相关下载：
            <div v-for="(item,index) in attachment" :key="index">
              <p v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0">
                <a v-preview="item.path" preview-title-enable="true" preview-nav-enable="true" >{{item.name}}</a>
              </p>
              <p v-else>
                <a @click="downFile(item.path)">{{item.name}}</a>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col style="min-height: 200px; margin-bottom: 50px;">
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="情报信息" name="first">
              <ineg-mapping :deptIds="cyDeptsStr" :depts="cyDepts" :state="investigation.status" :if-sign="!showQsBtn"></ineg-mapping>
            </el-tab-pane>
            <el-tab-pane label="案件信息" name="second">
              <case-mapping :deptIds="cyDeptsStr" :depts="cyDepts" :state="investigation.status" :if-sign="!showQsBtn"></case-mapping>
            </el-tab-pane>
            <el-tab-pane label="最新进展" name="third">
              <div style="max-height: 600px; overflow-y: auto; padding-bottom: 100px;">
                <time-line-small :caseId="caseId" :type="4"></time-line-small>
              </div>
            </el-tab-pane>
            <el-tab-pane label="指令信息" name="fourth">
              <instruct-feedback :deptIds="cyDeptsStr" :depts="cyDepts" :state="investigation.status" :if-sign="!showQsBtn" :btnState="showXfBtn"></instruct-feedback>
            </el-tab-pane>
            <el-tab-pane label="审核信息" name="fifth">
              <ineg-examine :id="id" type="0004"></ineg-examine>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
  import {
    getConcernCase, concernCase, cancelConcern
  } from '@/api/common'
  import {
    getOne
  } from '@/api/investigation'
  import {
    getAJJBXXSYHID
  } from '@/api/caseManage'
  import {
    updBusinessSignIneg, getBisSignOne
  } from '@/api/workSignList'
  import {
    parseTime
  } from '@/utils/index'
  import InegMapping from './components/InegMapping'
  import CaseMapping from './components/CaseMapping'
  import InstructFeedBack from './components/instructFeedBack'
  import InegExamine from '../common/ExamineList'
  import timeLineSmall from '../common/timeLineSmall'

  export default {
    name: 'casedb',
    components: {
      'time-line-small': timeLineSmall,
      'ineg-mapping': InegMapping,
      'case-mapping': CaseMapping,
      'instruct-feedback': InstructFeedBack,
      'ineg-examine': InegExamine
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      return {
        isPartake: true,
        showQsBtn: false,
        showXfBtn: false,
        cyDepts: [],
        cyDeptsStr: '',
        doStateLoading: false,
        rightLoad: false,
        dialogVisible: false,
        filterText: '',
        id: '',
        caseId: '',
        activeName: 'first',
        total: 0,
        page: 1,
        reportCaseTotal: 0,
        reportCasePage: 1,
        dept: '',
        listLoading: false,
        selectedData: [],
        investigation: {
          assist_title: '',
          start_date: '',
          end_date: '',
          partake_dept: '',
          assist_content: '',
          duty_person: '',
          partake_person: '',
          case_id: '',
          status: '0',
          create_time: '',
          apply_dept_name: ''
        },
        caseInfo: {
          AJMC: '',
          AJBH: '',
          SYH_FLLB: '',
          AJLB: '',
          LARQ: '',
          SAJZ: '',
          AJZT: '',
          AJLB_NAME: '',
          AJZT_NAME: '',
          AJXZ_NAME: ''
        },
        reportCaseList: [],
        deptData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        attachment: [],
        caseCheckNode: 0,
        caseCheckText: '',
        totalReportCaseNum: 0,
        currentReportCaseNum: 0,
        childrenReportCaseNum: 0,
        curUserId: '',
        isConcern: false,
        bsId: '',
        curDept: {},
        curUser: {}
      }
    },
    methods: {
      handleClick(tab, event) {
      },
      caseCurrentChange(val) {
        this.page = val
        this.query()
      },
      detailInvestigation() {
        this.caseId = this.id
        const para = {
          id: this.id
        }
        getOne(para).then((response) => {
          const data = response.data
          this.investigation = data
          if (data.attachment) {
            this.attachment = JSON.parse(data.attachment)
          }
          if (data.partake_dept) {
            this.cyDepts = JSON.parse(data.partake_dept)
          }
          this.cyDeptsStr = data.partake_dept_ids
          if (data.partake_dept_ids.indexOf('[' + this.curDept.id + ']') > -1) {
            this.isPartake = true
          }
          this.showXfBtn = data.apply_dept_id === this.curDept.id
          if (data.case_id) {
            getAJJBXXSYHID({
              id: data.case_id
            }).then((response) => {
              const data = response.data
              this.caseInfo = {
                AJMC: data.AJMC,
                AJBH: data.AJBH,
                SYH_FLLB: data.SYH_FLLB,
                AJLB: data.AJLB,
                LARQ: data.LARQ,
                SAJZ: data.SAJZ,
                AJZT: data.AJZT,
                AJLB_NAME: data.AJLB_NAME,
                AJZT_NAME: data.AJZT_NAME,
                AJXZ_NAME: data.AJXZ_NAME
              }
              this.getConcern()
            })
          } else {
            this.caseInfo = {}
          }
        })
      },
      downFile(path) {
        window.open(path)
      },
      saveConcern() {
        if (this.concernId) {
          const flag = this.isConcern ? 0 : 1
          const msg = this.isConcern ? '取消关注' : '关注成功'
          cancelConcern({
            id: this.concernId, enable: flag
          }).then((res) => {
            if (res.code === '000000') {
              this.$message({
                message: msg,
                type: 'success'
              })
              this.isConcern = flag
            }
          })
        } else if (!this.concernId && !this.isConcern) {
          concernCase({
            AJBH: this.caseInfo.AJBH, userId: this.curUserId
          }).then((res) => {
            if (res.code === '000000') {
              this.$message({
                message: '关注成功',
                type: 'success'
              })
              this.isConcern = true
              this.concernId = res.data
            }
          })
        }
      },
      getConcern() {
        getConcernCase({
          ajbh: this.caseInfo.AJBH, userId: this.curUserId
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            const data = res.data[0]
            if (data['enable'] === 1) {
              this.isConcern = true
            } else {
              this.isConcern = false
            }
            this.concernId = data['id']
          }
        })
      },
      doStateDb(type) {
        const req = {
          id: this.id
        }
        let msg = ''
        if (type === 0) {
          req.status = 6
          msg = '确认要签收吗?'
        }
        if (!this.bsId) {
          return false
        }
        this.$confirm(msg, '提示', {
          type: 'warning'
        }).then(() => {
          updBusinessSignIneg({
            id: this.bsId,
            status: 2,
            inegId: this.id,
            signUserId: this.curUser.id,
            signTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            updateUserId: this.curUser.id,
            deptId: this.curDept.id,
            bizType: 4,
            action: '签收全国性协查',
            bizId: this.id,
            userId: this.curUser.id,
            userName: this.curUser.realName
          }).then((res) => {
            if (res.code === '000000') {
              this.$message({
                message: '签收成功',
                type: 'success'
              })
              location.reload()
            }
          }).catch(() => {
            this.doStateLoading = false
          })
        }).catch(() => {
          this.listLoading = false
        })
      },
      getBisSign(id) {
        getBisSignOne({
          businessValue: id,
          businessTable: 'aj_investigation', noticeOrgId: this.curDept.id, businessType: 7, status: 1
        }).then((res) => {
          if (res.code === '000000' && res.data) {
            if (res.data.length > 0) {
              this.bsId = res.data[0]['id']
              this.showQsBtn = true
            }
          }
        })
      },
      back() {
        this.$router.back(-1)
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curUser) {
        this.curUserId = this.curUser.id
      }
      if (this.$route.params.id) {
        this.id = this.$route.params.id
        this.detailInvestigation()
        this.getBisSign(this.id)
      }
    }
  }
</script>

<style scoped>


  .investigation .footer p {
    margin: 3px 0 0 20px;
  }

  .investigation .footer p a {
    color: #1b75ba;
    text-decoration: underline;
  }

  .investigation .footer p a:hover {
    color: #1e98d2;
  }

  .investigation .header_title{
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 20px;
  }
  .investigation .header_time{
    color: #fff;
  }

  .investigation .text_c {
    text-align: center;
  }

  .investigation .p_htl1 {
    height: 33px;
    text-align: center;
    line-height: 33px;
  }

  .investigation .p_htl2 {
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .investigation .box-card {
    margin: 2px 2px 0 2px;
  }

  .investigation .box-card .card_title {
    display: inline-block;
    height: 40px;
    line-height: 45px;
  }

</style>
