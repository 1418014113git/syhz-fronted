<template>
<!-- 基本信息 -->
  <div class="baseInfo pubStyle" v-loading="loading">
    <div class="titleWrap">
      <div class="left">{{title}}</div>
      <div class="right">
        <!--
          基本信息-【审核】，审核单位人员，有审核权限，且存在待审核记录时显示，点击显示审核页面进行审核工作。其他情况隐藏。
          基本信息-【申请上级督办】，审核单位人员，有审核权限，且不存在待审核、审核中、督办中、督办结束、评价打分的上一级（督办级别）督办记录（部督办、厅督办、市督办三级从上到下排序）时可申请上级督办。其他情况隐藏。
          基本信息-【上报结案报告】，申请单位人员，案件督办状态为督办中、督办结束或评价打分，且不存在审核通过的结案报告时可上报结案报告。其他情况隐藏。
          基本信息-【下发催办】，审核单位人员，案件督办状态为督办中、督办结束或评价打分时可下发催办给申请单位。其他情况隐藏。
          基本信息-【签收】，申请单位人员，案件督办状态为督办中、督办结束或评价打分时，且本单位未签收时可点击签收。其他情况隐藏。
          基本信息-【申请部门】，所有人可见，案件督办状态为督办中、督办结束或评价打分时，且申请单位未签收时显示“待签收”。申请单位签收后，显示“已签收”。
        -->
        <el-button v-if="$isViewBtn('100813')&&deptInfo.depCode===baseInfo.superviseDepartCode && dsh_Info.applyDate"
          type="primary" size="small" @click="handleAudit">审核</el-button>
        <el-button v-if="$isViewBtn('100807')&&deptInfo.depCode===baseInfo.superviseDepartCode&&(deptInfo.wdStauts===0||deptInfo.wdStauts===4)"
          type="primary" size="small" @click="handleApplyToUp">申请上级督办</el-button>
        <el-button v-if="$isViewBtn('100814')&&((deptInfo.depType!=='4'&&baseInfo.applyDepartCode === deptInfo.depCode)||(deptInfo.depType==='4'&&baseInfo.applyDepartCode === deptInfo.parentDepCode))&&
          (baseInfo.dbStatus===5||baseInfo.dbStatus===6||baseInfo.dbStatus===7) && !baseInfo.jabgTitle"
          type="primary" size="small"  @click="handleReport">上报结案报告</el-button>
        <el-button v-if="$isViewBtn('100816')&&deptInfo.depCode===baseInfo.superviseDepartCode && (baseInfo.dbStatus===5||baseInfo.dbStatus===6||baseInfo.dbStatus===7)"
          type="primary" size="small"  @click="handleIssueUrge">下发催办</el-button>
        <el-button v-if="$isViewBtn('100819')&&baseInfo.signStatus==='1' && ((deptInfo.depType!=='4'&&baseInfo.applyDepartCode === deptInfo.depCode)||(deptInfo.depType==='4'&&baseInfo.applyDepartCode === deptInfo.parentDepCode))"
          type="primary" size="small"  @click="handleDbSign">签收</el-button>
      </div>
     </div>
     <el-row class="xddw zwbj">
        <el-form ref="form" :model="baseInfo" size="small" label-width="115px" label-position="left">
          <el-col :span="8">
            <el-form-item label="督办级别：" prop="superviseLevel">
                <span class="whiteColor">{{$getDictName(baseInfo.superviseLevel+'','dbjb')}}</span>
              </el-form-item>
            <el-form-item label="申请人：" prop="applyUserName">
              <span class="whiteColor">{{baseInfo.applyUserName}}</span>
            </el-form-item>
            <el-form-item label="申请时间：" prop="applyDate">
              <span class="whiteColor">{{baseInfo.applyDate}}</span>
            </el-form-item>
            <el-form-item label="开始日期：" prop="sg">
              <span class="whiteColor">{{baseInfo.sg}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-col :span="12">
              <el-form-item label="督办状态：" prop="status">
                <span class="whiteColor">{{$getDictName(baseInfo.status+'','dbajzt')}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="督办签收状态：" prop="status" label-width="126px">
                <span style="color:#409EFF" v-if="baseInfo.signStatus==='1'">待签收</span>
                <span style="color:#67C23A" v-if="baseInfo.signStatus==='2'">已签收</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申请部门：" prop="applyDepartName">
                  <span class="whiteColor">{{baseInfo.applyDepartName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="督办负责人：" prop="supervisePerson">
                <span class="whiteColor">{{baseInfo.supervisePerson}}</span>
              </el-form-item>
              <el-form-item label="截止日期：" prop="endDate">
                <span class="whiteColor">{{baseInfo.endDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人联系电话：" prop="personLiablePhone" label-width="140px">
                <span class="whiteColor">{{baseInfo.personLiablePhone}}</span>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请原因：" prop="superviseDesc">
              <span class="whiteColor" v-html="baseInfo.superviseDesc"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件名称：" prop="ajmc">
              <span class="whiteColor">{{baseInfo.ajmc}}</span>
            </el-form-item>
            <el-form-item label="案件类别：" prop="zylbMc">
              <span class="whiteColor">{{baseInfo.zylbMc}}</span>
            </el-form-item>
            <el-form-item label="涉案价值" prop="sajz">
              <span class="whiteColor">{{baseInfo.sajz}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件编号：" prop="ryztMc">
              <span class="whiteColor">{{baseInfo.ryztMc}}</span>
            </el-form-item>
            <el-form-item label="案件类型：" prop="ajlb">
              <span class="whiteColor">{{baseInfo.ajlb}}</span>
            </el-form-item>
            <el-form-item label="嫌疑人数" prop="zars">
              <span class="whiteColor">{{baseInfo.zars}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件状态：" prop="ryztMc">
              <span class="whiteColor">{{baseInfo.ryztMc}}</span>
            </el-form-item>
            <el-form-item label="立案单位：" prop="ladw">
              <span class="whiteColor">{{baseInfo.ladw}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简要案情：" prop="jyaq">
              <span class="whiteColor">{{baseInfo.jyaq}}</span>
            </el-form-item>
            <el-form-item label="附件：" prop="">
              <span class="whiteColor">{{baseInfo.attachment}}</span>
              <span v-for="item in fjList" :key="item.id">
                 <a class="fjlink" @click="upLoadFile(item)">{{item.fileName}}</a>&nbsp;&nbsp;&nbsp;
              </span>
            </el-form-item>
          </el-col>
        </el-form>
    </el-row>

    <!-- 审核弹框-->
    <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" :close-on-click-modal="false">
      <audit-com  :isShowDialog="isShowshDialog" :dbId="baseInfo.dbId" :dsh="dsh_Info" @closeDialog="closeshDialog"></audit-com>
    </el-dialog>
    <!-- 下发催办 -->
    <!-- <el-dialog title="下发催办" :visible.sync="xfcbDiaVisible">
      <issued-urge :bcbData="bcbData"></issued-urge>
    </el-dialog> -->
    <!-- 结案报告 -->



  </div>
</template>

<script>
import Bus from '@/utils/bus.js'
import titlePub from './titlePub'
import auditCom from './auditCom' // 审核弹框
export default {
  props: ['jbxxData', 'dshData'],
  name: 'baseInfo',
  data() {
    return {
      title: '基本信息',
      baseInfo: {}, // 基础信息
      curUser: {}, // sessionStorage获取用户信息
      dsh_Info: {}, // 待审核的督办
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      loading: false, // 页面加载进度条
      isShowshDialog: false, // 是否显示审核弹框
      cardNumber: '', // 存储身份证号
      downLoadUrl: process.env.ATTACHMENT_MODULE + 'file/downloadTemplate/', // 下载附件
      fjList: [ // 附件列表
        {
          id: 1,
          fileName: '附件1.doc'
        },
        {
          id: 2,
          fileName: '附件2.doc'
        }
      ],
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  components: {
    titlePub,
    auditCom
  },
  computed: {

  },
  watch: {
    jbxxData(val) {
      if (val) {
        this.baseInfo = val
        this.init()
      }
      // this.detail()
    },
    dshData(val) {
      if (val) {
        this.dsh_Info = val
        this.init()
      }
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        var val = value.substring(0, 4) + '.' + parseInt(value.substring(4, 6)) + '.' + parseInt(value.substr(6))
      }
      return val
    }
  },
  methods: {
    init() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.paramDept = JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode
      if (this.dshData) {
        this.dsh_Info = this.dshData
      }
      if (this.jbxxData) {
        this.baseInfo = this.jbxxData
      }
    },
    detail() {
      this.baseInfo = {}
      // 根据身份证号码查询人员详细信息
      // const para = {
      //   method: 'Query',
      //   byUserCard: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName
      // }
      // this.loading = true
      // personByCardId(para).then((response) => {
      //   this.loading = false
      //   this.baseInfo = response.data
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleAudit() { // 审核
      this.isShowshDialog = true
    },
    handleApplyToUp() { // 申请上级督办
      this.$router.push({ path: '/caseManage/toup/dbApply', query: { dbId: this.baseInfo.dbId, type: 'up' }})
    },
    handleReport() { // 上报结案报告
      Bus.$emit('shangbaoJabg')
    },
    handleIssueUrge() { // 下发催办
      Bus.$emit('xiafaCuiban')
    },
    handleDbSign() { // 督办签收
      const req = {
        id: this.baseInfo.signId,
        dbId: this.baseInfo.dbId,
        signUserId: this.userInfo.id,
        updateUserId: this.userInfo.id,
        status: 2,
        userId: this.userInfo.id,
        userName: this.userInfo.realName
      }
      this.$update('CaseSuperviseSign/' + this.baseInfo.signId, req).then((response) => {
        if (response.code === '000000') {
          this.$alert('<p><i class="el-icon-success" style="color:#67c23a;margin-right:20px;font-size:20px;"></i><span style="font-size:16px;">签收催办成功</span></p>', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '知道了'
          })
          this.init()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    upLoadFile(item) { // 下载附件
      window.open(this.downLoadUrl + item.fileName)
    },
    closeshDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      this.isShowshDialog = val
      location.reload()
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      // if (this.curDept.depType === '1') { //  省厅 总队
      //   this.roleType = 1
      // } else if (this.curDept.depType === '2') { //地市  支队
      //   this.roleType = 2
      // }
    }
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.baseInfo {
  width: 100%;
  .el-form-item__label {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .cardcom {
    position: absolute;
    bottom: 1px;
    left: 318px;
  }
}
.whiteColor {
  color: #fff;
}
.beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.zwbj {
  padding: 18px 0 0 45px;
}
.fjlink {
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  text-decoration: underline;
  cursor: pointer;
}
.fjlink:hover {
  text-decoration: underline;
}
.stshForm {
  .el-dialog {
    width: 40%;
  }
  .el-form {
    padding: 10px 20px;
  }
}
@media only screen and (max-width: 1367px) {
}
</style>

