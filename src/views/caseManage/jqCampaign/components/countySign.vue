<template>
  <section>
    <!-- 地市签收 -->
    <div class="countySign pubStyle">
      <title-pub :title="title"></title-pub>
      <div style="max-height:260px;overflow: auto;">
        <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
          <el-table-column type="index" label="序号" width="60" ></el-table-column>
          <el-table-column prop="createDeptName" label="下发单位"   min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createDate" label="下发日期"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="clueNum" label="线索数量" >
            <template slot-scope="scope">
              <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.clueNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveDeptName" label="接收单位"   min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="signStatus" label="签收状态" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if='scope.row.signStatus'>{{$getDictName(scope.row.signStatus+'','qszt')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveUserName" label="签收人" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="receiveDate" label="签收时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作"  width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" title="签收"  type="primary" circle icon="el-icon-edit-outline"  v-if="contrlollistqsbtn(scope.row) && $isViewBtn('101907')"  @click="handleSign(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import Bus from '@/utils/bus.js'
export default {
  props: ['info'],
  name: 'countySign',
  components: {
    titlePub
  },
  data() {
    return {
      title: '区县签收表',
      curUser: {},
      curDept: {}, // 当前登录的部门
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 地市签收表
      listLoading: false, // 页面loading
      pageSize: 5,
      page: 1,
      total: 0,
      baseInfo: {}, // 基础信息
      clusterId: '', // 存储列表传递过来的集群战役id
      pcsParentDeptcode: '' // 派出所的上上级code
    }
  },
  watch: {
    info(val) {
      if (val.clusterId) {
        this.clusterId = val.clusterId
        this.baseInfo = val
        this.queryList()
      }
    }
  },
  methods: {
    init() {
      if (this.info.clusterId) {
        this.clusterId = this.info.clusterId
        this.baseInfo = this.info
        this.queryList()
      }
    },
    queryList() {
      if (this.curDept.depType === '4') { // 派出所
        this.querysjdw() // 查上上级单位
      } else {
        this.query(true)
      }
    },
    querysjdw() {
      // 查询派出所的上上级(把派出所当大队，查大队的上级单位 )
      this.$query('hsyzparentdepart/' + this.curDept.parentDepCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.pcsParentDeptcode = response.data.departCode
          this.query(true)
        }
      }).catch(() => {

      })
    },
    contrlollistqsbtn(row) { // 控制列表行的签收按钮显隐
      return ((this.curDept.depType === '4' && this.curDept.parentDepCode === row.receiveDeptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.receiveDeptCode)) && Number(this.baseInfo.status) >= 4 && row.signStatus + '' === '1'
    },
    query(flag) {
      this.listLoading = true
      var param = {
        assistId: this.clusterId,
        // deptCode: this.curDept.depType === '4' ? this.pcsParentDeptcode : this.curDept.parentDepCode, // 派出所取上上级部门code， 非派出所取本部门上级code
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      if (this.baseInfo.cityCode !== this.curDept.areaCode && this.curDept.depType === '3') { // 只有大队传当前部门
        param.deptCode = this.curDept.depCode
      }
      // if (this.baseInfo.cityCode !== this.curDept.areaCode) {
      //   param.deptCode = this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode // 派出所取上级部门code， 非派出所取本部门code
      // }
      this.$query('casecluster/signList', param).then((res) => {
        this.listLoading = false
        this.listData = res.data.list
        this.total = res.data.totalCount
        this.pageSize = res.data.pageSize
        this.controlBtn(this.listData)
        this.$resetSetItem('t4', this.total) // 将总数存在session中
      }).catch(() => {
        this.$resetSetItem('t4', 0) // 将总数存在session中
        Bus.$emit('isShowqsbtn', false)
        this.listLoading = false
        this.initData()
      })
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的签收按钮
      Bus.$emit('isShowqsbtn', false)
      if (data.length > 0) {
        data.forEach(item => {
          if ((this.curDept.depType === '4' && this.curDept.parentDepCode === item.receiveDeptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === item.receiveDeptCode) && item.signStatus + '' === '1') { // 当前登录的是派出所时，用他的父级单位的id去判断 1：待签收
            Bus.$emit('isShowqsbtn', true) // 控制详情页上方的签收按钮显隐
          }
        })
      }
    },
    initData() {
      this.listData = []
      this.total = 0
      this.pageSize = 5
      this.page = 1
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    gotoxslist(row) {
      this.$router.push({
        path: '/jqcampaign/clueList', query: { id: row.assistId, type: '', deptCode: row.createDeptCode, cityCode: row.cityCode, curDeptCode: row.receiveDeptCode } // 线索列表页面
      })
    },
    handleSign(index, row) { // 签收
      const param = {
        userId: this.curUser.id, // 当前用户Id
        userName: this.curUser.realName, // 当前用户真实姓名
        // deptCode: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode, // 当前部门Code 派出所取它的父级单位code
        deptCode: row.receiveDeptCode, // 当前行的接收单位code
        assistId: row.assistId, // 集群id
        signId: row.assistSignId // 签收表id
      }
      this.$update('casecluster/signup', param).then((response) => {
        this.$alert('请尽快反馈线索核查情况', '签收成功', {
          type: 'success',
          confirmButtonText: '知道了',
          callback: action => {
            location.reload()
          }
        })
      }).catch(() => {
      })
    },
    querypcssj() { // 如果是派出所，派出所当大队，则查的是派出所的上上级
      this.$query('hsyzparentdepart/' + this.curDept.parentDepCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.pcsParentDept = response.data
        }
      }).catch(() => {

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
<style  rel="stylesheet/scss" lang="scss">
.areaSign{

}
</style>
