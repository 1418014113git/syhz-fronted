<template>
<!-- 基本信息 -->
  <div class="baseInfo pubStyle" v-loading="loading">
    <div class="title">
      <div class="left">基本信息</div>
      <div class="right">
        <el-button type="primary" size="small" v-if="(curDept.depType === '1' || curDept.depType === '2') && isShowpjbtn && $isViewBtn('101911')"   @click="zhpj">综合评价</el-button>
        <el-button type="primary" size="small" v-if="isShowsqbtn && $isViewBtn('101901')"  @click="cxsq">重新申请</el-button>
        <el-button type="primary" size="small" v-if="isShowshbtn && $isViewBtn('101908')"  @click="audit">审核</el-button>
        <el-button type="primary" size="small" v-if="isShowffbtn && $isViewBtn('101909')"  @click="xsff">线索分发</el-button>
        <el-button type="primary" size="small" v-if="isShowfkbtn && $isViewBtn('101910')"  @click="xsfk">线索反馈</el-button>
        <el-button type="primary" size="small" v-if="isShowqsbtn && $isViewBtn('101907')"  @click="qs">签收</el-button>
        <!-- <span style="color: #67C23A;" v-if="!isShowqsbtn" @click="qs">已签收</span> -->
      </div>
     </div>
     <el-row class="xddw zwbj">
        <el-form ref="form" :model="baseInfo" size="small" label-width="115px" label-position="left">
          <el-col :span="8">
            <el-form-item label="标题：" prop="">
              <span class="whiteColor">{{baseInfo.title}}</span>
            </el-form-item>
            <el-form-item label="发起日期：" prop="">
              <span class="whiteColor" v-if="baseInfo.createDate">{{baseInfo.createDate}}</span>
            </el-form-item>
            <el-form-item label="编号：" prop="">
              <span class="whiteColor" v-if="baseInfo.clusterNumber">{{baseInfo.clusterNumber}}</span>
            </el-form-item>
            <el-form-item label="涉及省/市数：" prop="">
              <span class="whiteColor">{{baseInfo.clusterCitys}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发起单位：" prop="">
              <span class="whiteColor">{{baseInfo.applyDeptName}}</span>
            </el-form-item>
            <el-form-item label="发起人：" prop="">
                <span class="whiteColor">{{baseInfo.applyPersonName}}</span>
            </el-form-item>
            <el-form-item label="开始时间：" prop="">
              <span class="whiteColor" v-if="baseInfo.startDate">{{baseInfo.startDate}}</span>
            </el-form-item>
            <el-form-item label="" prop=""></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="">
              <span v-if="baseInfo.status">{{ $getDictName(baseInfo.status+'', 'jqzyzt') }}</span>
            </el-form-item>
            <el-form-item label="发起人电话：" prop="">
              <span class="whiteColor">{{baseInfo.applyPersonPhone}}</span>
            </el-form-item>
            <el-form-item label="结束时间" prop="">
              <span class="whiteColor" v-if="baseInfo.endDate">{{baseInfo.endDate}}</span>
            </el-form-item>
            <el-form-item label="" prop=""></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="正文：" prop="">
              <span v-html="baseInfo.assistContent"></span>
            </el-form-item>
            <el-form-item label="附件：" prop="">
              <span v-if="baseInfo.attachment && baseInfo.attachment.length>0">
                 <span v-for="(item, index) in baseInfo.attachment" :key="index">
                    <a @click="downFile(item)" style="text-decoration: underline;">{{item.name}}</a>&nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </el-form-item>
          </el-col>
        </el-form>
    </el-row>

    <!-- 审核弹框-->
    <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" :close-on-click-modal="false">
      <audit-com  :isShowDialog="isShowshDialog"  @closeDialog="closeshDialog" :id="clusterId" :info="baseInfo" :row="shlbRow"></audit-com>
    </el-dialog>

    <!-- 分发线索-->
    <el-dialog title="分发线索" :visible.sync="isShowffxsDialog"  class="ffxsForm" :close-on-click-modal="false">
      <jqzy-disib  :isShowDialog="isShowffxsDialog"  @closeDialog="closeffxsDialog" :id="clusterId"  :xcstatus="baseInfo.status"  source="detail"></jqzy-disib>
    </el-dialog>
  </div>
</template>

<script>
import titlePub from './titlePub'
import auditCom from './auditCom' // 审核弹框
import JqzyDisib from './jqzyDisib' // 分发线索
import Bus from '@/utils/bus.js'
export default {
  props: ['info'],
  name: 'baseInfo',
  data() {
    return {
      baseInfo: {}, // 基础信息
      shlbRow: {}, // 审核列表当前行的审核按钮显示时，将当前行数据传递过来
      qsRow: {}, // 签收列表当前行信息
      curDept: {},
      curUser: {}, // sessionStorage获取用户信息
      stshForm: { // 省厅审核
        num: '', // 编号
        startTime: '', // 开始时间
        endTime: '', // 截止时间
        remark: '' // 审核意见
      },
      isShowyqs: false, // 是否显示'已签收'文字
      isShowsqbtn: false, // 是否显示申请按钮
      isShowshbtn: false, // 是否显示审核按钮
      isShowqsbtn: false, // 是否显示签收按钮
      isShowffbtn: false, // 是否显示线索分发按钮
      isShowfkbtn: false, // 是否显示线索反馈按钮
      isShowpjbtn: false, // 是否显示综合评价按钮
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      loading: false, // 页面加载进度条
      isShowshDialog: false, // 是否显示审核弹框
      isShowffxsDialog: false, // 是否显示分发线索弹出框
      clusterId: '', // 存储列表传递过来的id
      xsfkRow: {} // 线索反馈当前行数据
    }
  },
  components: {
    titlePub,
    auditCom,
    JqzyDisib
  },
  computed: {

  },
  watch: {
    info(val) {
      if (val.clusterId) {
        this.clusterId = val.clusterId
        this.baseInfo = val
        this.baseInfo.attachment = this.baseInfo.attachment ? JSON.parse(this.baseInfo.attachment) : []
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
      if (this.info.clusterId) {
        this.clusterId = this.info.clusterId
        this.baseInfo = this.info
        this.baseInfo.attachment = this.baseInfo.attachment ? JSON.parse(this.baseInfo.attachment) : []
      }
      this.controlBtnShow()
    },
    zhpj() { // 综合评价
      if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省厅，总队
        this.$store.dispatch('Personeltotop', 'dsfk') // 定位到地市反馈
      } else if (this.curDept.depType === '2') { // 地市
        this.$store.dispatch('Personeltotop', 'qxfk') // 定位到区县反馈
      }
    },
    cxsq() { // 重新申请
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: 'detail', id: this.clusterId }}) // 跳转到集群战役申请页
    },
    audit() { // 审核
      this.isShowshDialog = true
    },
    xsff() { // 线索分发
      if (this.isShowqsbtn) { // 签收列表有签收按钮，表示有未签收的线索
        this.$alert('请先签收线索后，再反馈线索。', '提示', {
          type: 'warning',
          confirmButtonText: '确定'
        })
        return false
      }
      this.isShowffxsDialog = true
    },
    xsfk() { // 线索反馈
      if (this.isShowqsbtn) { // 签收列表有签收按钮，表示有未签收的线索
        this.$alert('请先签收线索后，再反馈线索。', '提示', {
          type: 'warning',
          confirmButtonText: '确定'
        })
        return false
      }
      var deptCode = ''
      if (this.xsfkRow.deptCode !== this.baseInfo.applyDeptCode && this.curDept.depType !== '1') {
        deptCode = this.xsfkRow.deptCode
      }
      this.$router.push({ path: '/jqcampaign/clueFeedback', query: { id: this.clusterId, deptCode: deptCode }}) // 跳转到线索反馈页
    },
    qs() { // 签收, 定位到签收列表
      if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 总队，支队
        this.$store.dispatch('Personeltotop', 'dsqs') // 定位到地市签收
        this.$store.dispatch('AjMouleClass', 'dsqs')
      } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 大队，派出所
        this.$store.dispatch('Personeltotop', 'qxqs') // 定位到区县签收
        this.$store.dispatch('AjMouleClass', 'qxqs')
      }
    },
    downFile(item) { // 下载附件
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    closeshDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      this.isShowshDialog = val
      location.reload()
    },
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowffxsDialog = val
      location.reload()
    },
    controlBtnShow() {
      Bus.$on('isShowsqbtn', (data) => { // 重新申请按钮
        this.isShowsqbtn = data
      })
      Bus.$on('isShowshbtn', (data) => { // 审核按钮
        this.isShowshbtn = data
      })
      Bus.$on('row', (data) => { // 审核列表当前行信息
        this.shlbRow = data
      })
      Bus.$on('isShowqsbtn', (data) => { // 签收按钮
        this.isShowqsbtn = data
      })
      Bus.$on('qsRow', (data) => { // 签收列表当前行信息
        this.qsRow = data
      })
      Bus.$on('isShowffbtn', (data) => { // 线索分发按钮
        this.isShowffbtn = data
      })
      Bus.$on('isShowfkbtn', (data) => { // 线索反馈按钮
        this.isShowfkbtn = data
      })
      Bus.$on('isShowpjbtn', (data) => { // 评价打分按钮
        this.isShowpjbtn = data
      })
      Bus.$on('xsfkRow', (data) => { // 线索反馈当前行数据
        this.xsfkRow = data
      })
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
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
  .ffxsForm{
    .el-dialog{
      width: 80%;
      max-height: 80vh;
      overflow: auto;
    }
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
  .baseInfo .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>

