<template>
  <section>
    <!-- 审核信息 -->
    <div class="verifyInfo pubStyle">
      <title-pub :title="title"></title-pub>
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="statisticCollect" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="AJMC" label="申请单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SYH_FLLB" label="申请人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AJZT_NAME" label="申请时间"></el-table-column>
        <el-table-column prop="JYAQ" label="审核单位" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SYH_FLLB" label="审核人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AJZT_NAME" label="审核时间"></el-table-column>
        <el-table-column prop="AJZT_NAME" label="审核状态">
          <!-- <template slot-scope="scope">
            <span v-if='scope.row.userSort'>{{$getDictName(scope.row.userSort+'','rylx')}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="AJZT_NAME" label="审核意见"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" title="重新申请"  type="primary" circle  @click="handleApply(scope.$index, scope.row)"><svg-icon icon-class="shenqing"></svg-icon></el-button>
            <el-button size="mini" title="审核"  type="primary" circle  @click="handleVerify(scope.$index, scope.row)"><svg-icon icon-class="audit"></svg-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>

       <!-- 审核弹框-->
      <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" :close-on-click-modal="false">
        <audit-com  :isShowDialog="isShowshDialog"  @closeDialog="closeshDialog"></audit-com>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import auditCom from './auditCom' // 审核弹框
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub,
    auditCom
  },
  data() {
    return {
      title: '审核信息',
      curUser: {},
      curRow: {},
      isShowshDialog: false, // 是否显示审核弹框
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 审核信息列表
      listLoading: false, // 页面loading
      pageSize: 5,
      page: 1,
      total: 0,
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.query(true)
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    init() {
      if (this.cardId) {
        this.cardNumber = this.cardId
      }
      this.query(true)
    },
    query(flag) {
      this.listLoading = true
      var param = {
        cardNumber: this.cardNumber,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('page/personallcase', param).then((res) => {
        this.listLoading = false
        this.listData = res.data.list
        this.total = res.data.totalCount
        this.pageSize = res.data.pageSize
        this.$resetSetItem('t1', this.total) // 将总数存在session中
      }).catch(() => {
        this.$resetSetItem('t1', 0) // 将总数存在session中
        this.listLoading = false
        this.initData()
      })
    },
    initData() {
      this.listData = []
      this.total = 0
      this.pageSize = 5
      this.page = 1
    },
    handleCurrentChange(val) { // 涉案信息
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    handleApply(index, row) { // 重新申请
      // this.$router.push({
      //   path: '/jqCampaign/jqApply', query: { id: row.id } // 申请集群战役页面
      // })
    },
    handleVerify(index, row) { // 审核
      // this.curRow = row
      // this.isShowshDialog = true
    },
    closeshDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      this.isShowshDialog = val
      location.reload()
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.verifyInfo{
  .stshForm{
    .el-dialog{
      width: 40%;
    }
    .el-form{
      padding: 10px 20px;
    }
  }
}
</style>
