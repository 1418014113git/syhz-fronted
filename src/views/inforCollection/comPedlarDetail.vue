<template>
  <section>
    <!-- 摊贩信息 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>摊贩基础信息</span>
        <!-- <el-button style="float: right;" type="primary" @click="back()">返回</el-button> -->
        <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
      </div>
      <el-form :model="filters" size="small" label-width="110px" label-position="left">
        <el-row>
          <el-col :span="8">
            <el-form-item label="摊位名称：">
              {{curComInfo.name}}
            </el-form-item>
            <el-form-item label="负责人：">
              {{curComInfo.personName}}
            </el-form-item>
            <el-form-item label="联系电话：">
              {{curComInfo.phone}}
            </el-form-item>
            <el-form-item label="行政区划：">
              {{curComInfo.area}}
            </el-form-item>
            <el-form-item label="风险等级：">
              {{curComInfo.grade}}
            </el-form-item>
            <el-form-item label="备案登记号：">
              {{curComInfo.registerNumber}}
            </el-form-item>
            <el-form-item label="填报人：">
              {{curComInfo.createName}}
            </el-form-item>
          </el-col>
          <el-col :span="8" class="xddw">
            <el-form-item label="经营状态：">
              {{curComInfo.status}}
            </el-form-item>
            <el-form-item label="身份证号码：">
              <span v-if="curComInfo.cardNumber" class="zjhm"  @click="showTipsC(curComInfo.cardNumber)">{{curComInfo.cardNumber}}</span>
              <!-- <el-button v-if="curComInfo.cardNumber" style="margin-left:10px;" type="success" @click="toMesh(curComInfo.cardNumber)">挖掘</el-button> -->
              <card-com v-if="showCardCom" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com>
            </el-form-item>
            <el-form-item label="从业人数：">
              {{curComInfo.personNumber}}
            </el-form-item>
            <el-form-item label="摊位位置：">
              {{curComInfo.address}}
            </el-form-item>
            <el-form-item label="分类等级：">
              {{curComInfo.type}}
            </el-form-item>
            <el-form-item label="填报单位：" class="moreTextWrap">
              <el-tooltip class="item" effect="dark" :content="curComInfo.createDept" placement="right">
                {{curComInfo.createDept}}
              </el-tooltip>
            </el-form-item>
            <el-form-item label="填报时间：">
              {{curComInfo.createDate}}
            </el-form-item>
          </el-col>
          <br>
          <el-col :span="16">
            <el-form-item label="经营项目：">
              {{curComInfo.manageProject}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </section>
</template>

<script>
import { getComArchivesApproveStatus } from '@/utils/codetotext'
import importexport from '@/api/importexport'
import Http from '@/api/http'
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  name: 'index',
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      ModuleName: Http.ModuleName,
      listLoading: false, // 列表数据loading
      pedlarList: [], // 列表数据
      filters: {
        name: '',
        personName: '',
        cardNumber: '',
        phone: '',
        address: ''
      },
      curComInfo: {}, // 跳转携带的参数
      total: 0,
      page: 1,
      pageSize: 10,
      dialogImportVisible: false, // 导入弹框
      enterprise_nature: [],
      importInfo: {}, // 导入表单
      innerErrorInfoVisible: false, // 导入错误信息提示框
      errorData: [], // 导入错误信息提示
      importLoading: false, // 导入loading
      fileCon: '', // 上传的文件
      param: {}, // 携带的参数
      userInfo: {}, // 当前登录用户信息
      dept: {}, // 当前登录用户部门信息
      curCardId: '', // 当前被点击的身份证号
      showCardCom: false // 身份证查询旁的快捷查询组件是否显示
    }
  },
  components: {
    cardCom
  },
  methods: {
    back() {
      if (this.param.type === 'personalized') { // 跳转到个性化查询
        this.$router.push({ path: '/comanalysis/perserch' })
      } else if (this.param.type === 'ajDetail') { // 跳转到案件档案
        // this.$router.push({ path: '/caseManage/detailSyh/' + this.param.ajId })
        this.$router.push({
          path: '/caseFile/index', query: { id: this.param.ajId }
        })
      } else if (this.param.type === 'perArchive') { // 跳转到人员档案
        // this.$router.push({ path: '/personnelFile/index' + this.param.ajId })
        // this.$gotoid('/personnelFile/index', JSON.stringify({ idCard: this.cardId }))
        this.$router.push({
          path: '/personnelFile/index', // 升级版人员档案
          query: { cardId: this.cardId }
        })
      } else {
        this.$router.push({ path: '/inforCollection/comPedlarArchives' })
      }
    },
    formatStatus(status) {
      return getComArchivesApproveStatus(status + '')
    },
    toMesh(cardId) { // 根据身份证号跳转挖掘
      this.$router.push({
        path: '/mesh', query: { type: 1, bm: cardId }
      })
    },
    queryPedlarDetail(id) {
      this.$query('companyDetail/pitch/' + id, {}).then((response) => {
        this.formLoading = false
        this.curComInfo = response.data
      }).catch(() => {
        this.formLoading = false
      })
    },
    showTipsC(val) {
      this.curCardId = val
      this.showCardCom = true
    },
    clickBlank() {
      this.showCardCom = false
    }
  },
  mounted() {
    // this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.dept = JSON.parse(sessionStorage.getItem('depToken'))[0]

    // this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
    // if (this.param.type && this.param.type === 'personalized') { // 个性化查询过来的
    //   this.queryPedlarDetail(this.param.id)
    // } else if (this.param.type && this.param.type === 'ajDetail') { // 案件档案过来的
    //   this.queryPedlarDetail(this.param.id)
    // } else {
    //   this.curComInfo = JSON.parse(sessionStorage.getItem(this.$route.path))// 批次列表页传递过来的参数
    // }
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.showCardCom = false
    this.curComInfo = {}
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.dept = JSON.parse(sessionStorage.getItem('depToken'))[0]

    this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
    if (this.param.type && this.param.type === 'personalized') { // 个性化查询过来的
      this.queryPedlarDetail(this.param.id)
    } else if (this.param.type && this.param.type === 'ajDetail') { // 案件档案过来的
      this.queryPedlarDetail(this.param.id)
    } else if (this.param.type && this.param.type === 'perArchive') { // 人员档案过来的
      this.queryPedlarDetail(this.param.id)
    } else {
      this.curComInfo = JSON.parse(sessionStorage.getItem(this.$route.path))// 批次列表页传递过来的参数
    }
  }
}
</script>

<style>
p > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.comDialog .el-dialog__body {
  padding: 10px 20px 10px 20px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.moreTextWrap .el-form-item__content {
  width: 100%;
}
.cardcom{
  position: absolute;
  top: -25px;
  right: 47%;
}
.zjhm {
  cursor: pointer;
}
.zjhm:hover {
  color: #3da1ff;
}
@media only screen and (max-width: 1366px) {
  .cardcom {
    right: 15%;
  }
}
</style>
