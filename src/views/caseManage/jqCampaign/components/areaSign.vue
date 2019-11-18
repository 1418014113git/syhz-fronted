<template>
  <section>
    <!-- 地市签收 -->
    <div class="areaSign pubStyle">
      <title-pub :title="title"></title-pub>
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="" max-height="260">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="AJMC" label="下发单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SYH_FLLB" label="下发日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AJZT_NAME" label="线索数量" align="center">
          <template slot-scope="scope">
            <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.AJZT_NAME}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveDeptName" label="接收单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signStatus" label="签收状态" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.signStatus'>{{$getDictName(scope.row.signStatus+'','qszt')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AJZT_NAME" label="签收人" align="center"></el-table-column>
        <el-table-column prop="AJZT_NAME" label="签收时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" title="签收"  type="primary" circle icon="el-icon-edit-outline" @click="handleSign(scope.$index, scope.row)"></el-button>
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
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
export default {
  props: ['id'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '地市签收表',
      curUser: {},
      curDept: {}, // 当前登录的部门
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 地市签收表
      listLoading: false, // 页面loading
      pageSize: 5,
      page: 1,
      total: 0,
      pcsParentDept: {}, // 派出所的上级部门
      clusterId: '' // 存储列表传递过来的集群战役id
    }
  },
  watch: {
    id(val) {
      this.clusterId = val
      this.query(true)
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.clusterId = this.id
      }
      this.query(true)
    },
    query(flag) {
      this.listLoading = true
      var param = {
        clusterId: this.clusterId,
        deptCode: this.curDept.depCode,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('page/casecluster/signList', param).then((res) => {
        this.listLoading = false
        this.listData = res.data.list
        this.total = res.data.totalCount
        this.pageSize = res.data.pageSize
        this.$resetSetItem('t2', this.total) // 将总数存在session中
      }).catch(() => {
        this.$resetSetItem('t2', 0) // 将总数存在session中
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
    gotoxslist(row) {
      this.$router.push({
        path: ' /jqcampaign/clueList', query: { id: row.id } // 线索列表页面
      })
    },
    handleSign(index, row) { // 签收
      const param = {
        userId: this.curUser.id,
        realName: this.filters.realName,
        deptCode: this.curDept.depCode,
        assistId: row.assistId, // 集群id
        signId: row.assistSignId // 签收表id
      }
      this.$update('casecluster/signup', param).then((response) => {
        this.$alert('请尽快反馈线索核查情况', '签收成功', {
          type: 'success',
          confirmButtonText: '知道了'
        })
        this.query(true)
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
