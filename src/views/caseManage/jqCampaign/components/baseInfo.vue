<template>
<!-- 基本信息 -->
  <div class="baseInfo pubStyle" v-loading="loading">
    <div class="title">
      <div class="left">基本信息</div>
      <div class="right">
        <el-button type="primary" size="small"  @click="zhpj">综合评价</el-button>
        <el-button type="primary" size="small"  @click="cxsq">重新申请</el-button>
        <el-button type="primary" size="small"  @click="audit">审核</el-button>
        <el-button type="primary" size="small"  @click="xsff">线索分发</el-button>
        <el-button type="primary" size="small"  @click="xsfk">线索反馈</el-button>
        <el-button type="primary" size="small"  @click="qs">签收</el-button>
      </div>
     </div>
     <el-row class="xddw zwbj">
        <el-form ref="form" :model="baseInfo" size="small" label-width="115px" label-position="left">
          <el-col :span="8">
            <el-form-item label="标题：" prop="xm">
              <span class="whiteColor">{{baseInfo.xm}}</span>
            </el-form-item>
            <el-form-item label="发起日期：" prop="cym">
              <span class="whiteColor">{{baseInfo.cym}}</span>
            </el-form-item>
            <el-form-item label="编号：" prop="mzMc">
              <span class="whiteColor">{{baseInfo.mzMc}}</span>
            </el-form-item>
            <el-form-item label="涉及省/市数：" prop="sg">
              <span class="whiteColor" v-if="baseInfo.sg">{{baseInfo.sg}}(cm)</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发起单位：" prop="xbMc">
              <span class="whiteColor">{{baseInfo.xbMc}}</span>
            </el-form-item>
            <el-form-item label="发起人：" prop="csrq">
                <span class="whiteColor">{{baseInfo.xbMc}}</span>
            </el-form-item>
            <el-form-item label="开始时间：" prop="hyzkMc">
              <span class="whiteColor">{{baseInfo.hyzkMc}}</span>
            </el-form-item>
            <el-form-item label="" prop=""></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="ryztMc">
              <span class="whiteColor">{{baseInfo.ryztMc}}</span>
            </el-form-item>
            <el-form-item label="发起人电话：" prop="zylbMc">
              <span class="whiteColor">{{baseInfo.zylbMc}}</span>
            </el-form-item>
            <el-form-item label="结束时间" prop="hyzkMc">
              <span class="whiteColor">{{baseInfo.hyzkMc}}</span>
            </el-form-item>
            <el-form-item label="" prop=""></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="正文：" prop="csdssxqMc">
              <span></span>
            </el-form-item>
            <el-form-item label="附件：" prop="">
              <span v-for="item in fjList" :key="item.id">
                 <a class="fjlink" @click="upLoadFile(item)">{{item.fileName}}</a>&nbsp;&nbsp;&nbsp;
              </span>
            </el-form-item>
          </el-col>
        </el-form>
    </el-row>

    <!-- 审核弹框-->
    <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" :close-on-click-modal="false">
      <audit-com  :isShowDialog="isShowshDialog"  @closeDialog="closeshDialog"></audit-com>
    </el-dialog>
  </div>
</template>

<script>
import titlePub from './titlePub'
import auditCom from './auditCom' // 审核弹框
export default {
  props: ['cardId'],
  name: 'baseInfo',
  data() {
    return {
      baseInfo: {}, // 基础信息
      curUser: {}, // sessionStorage获取用户信息
      stshForm: { // 省厅审核
        num: '', // 编号
        startTime: '', // 开始时间
        endTime: '', // 截止时间
        remark: '' // 审核意见
      },
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
        },
        {
          id: 3,
          fileName: '附件3.zip'
        }
      ]
    }
  },
  components: {
    titlePub,
    auditCom
  },
  computed: {

  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.detail()
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
      if (this.cardId) {
        this.cardNumber = this.cardId
        this.detail()
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
    zhpj() { // 综合评价

    },
    cxsq() { // 重新申请
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { id: 1 }}) // 跳转到集群战役申请页
    },
    audit() { // 审核
      // this.isShowshDialog = true
    },
    xsff() { // 线索分发

    },
    xsfk() { // 线索反馈

    },
    qs() { // 签收

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
  .title {
    width: 100%;
    padding: 7px 0 7px 7px;
    border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    .left {
      float: left;
      letter-spacing: 3px;
    }
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
.zwbj{
  padding: 18px 0 0 45px;
}
.fjlink{
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  text-decoration:underline;
  cursor: pointer;
}
.fjlink:hover{
  text-decoration:underline;
}
.stshForm{
  .el-dialog{
    width: 40%;
  }
  .el-form{
    padding: 10px 20px;
  }
}
@media only screen and (max-width: 1367px) {

}
</style>

