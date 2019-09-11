<template>
  <div class="dblist">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="ajbh">   <!--返回-->
    <el-form ref="dbqueryForm" :inline="true" :model="filters">
      <el-form-item label="案件名称">
        <el-input v-model="filters.caseName" clearable placeholder="案件名称" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="filters.createTime" type="date"
                        placeholder="申请日期" size="small" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100801')"  v-on:click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  v-on:click="resetForm">重置</el-button>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-button type="primary" size="small" v-if="$isViewBtn('100803')"  v-on:click="saveDBInfo('demand')">发起督办</el-button>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100804')" v-on:click="saveDBInfo('apply')">申请督办</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dbData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="案件编号" min-width="10%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="10%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
      <el-table-column label="立案时间" width="140">
        <template slot-scope="scope">
          {{$handlerDateTime(scope.row.LARQ)}}
        </template>
      </el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类别" min-width="10%"></el-table-column>
      <el-table-column label="发起时间" width="150">
        <template slot-scope="scope">
          {{scope.row.create_time | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="apply_dept_name" label="发起部门" min-width="15%"></el-table-column>
      <el-table-column prop="supervise_level" label="督办级别" :formatter="formatterLevel" width="100"></el-table-column>
      <el-table-column label="督办状态" width="100">
        <template slot-scope="scope">
          {{filterStateText(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="截止时间" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.end_date">{{scope.row.end_date | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" v-if="$isViewBtn('100805')"
                     @click="handleDetail(scope.$index, scope.row)" icon="el-icon-tickets" circle>
          </el-button>
          <el-button v-if="(scope.row.status === '0' || scope.row.status === '2')  && $isViewBtn('100806') && scope.row.apply_dept_id === String(currentDeptId)" title="修改" size="mini" type="primary"
                     @click="editDBInfo(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button v-if="(scope.row.status === '0' || scope.row.status === '2') && $isViewBtn('100807') && scope.row.apply_dept_id === String(currentDeptId)" title="删除" size="mini" type="danger"
                     @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete" circle></el-button>
          <el-button v-if="(scope.row.status === '7' || scope.row.status === '8') && $isViewBtn('100806') && scope.row.apply_dept_id === String(currentDeptId)" title="考核打分" size="mini" type="danger"
                     @click="handleDialog(scope.$index, scope.row)" icon="el-icon-star-off" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="listTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;"></el-pagination>
    </el-col>

    <el-dialog title="考核打分" :visible.sync="assessScoresVisible" width="1340px" @close="closeDialog">
      <AssessScores ref="assessScores" @setAssessScores="setAssessScores" @closeDialog="closeDialog"></AssessScores>
    </el-dialog>
  </div>
</template>

<script>
import { getSupervisePage, deleteSupervise } from '@/api/supervise'
import {
  getDBLevelText, getAssistStatusText
} from '@/utils/codetotext'
import {
  parseTime
} from '@/utils/index'
import AssessScores from '@/views/caseAssist/components/assessScores'
export default {
  name: 'dblist',
  components: {
    AssessScores
  },
  data() {
    return {
      assessForm: {
        content: ''
      },
      assessScoresForm: {},
      assessScoresVisible: false,
      currentDeptId: '',
      filters: {
        caseName: '',
        createTime: '',
        deptName: ''
      },
      ajbh: '',
      toEdit: {},
      pageSize: 15,
      listTotal: 0,
      page: 1,
      listLoading: false,
      dbAddDiaVisible: false,
      dbAddDiaTitle: '',
      dbData: [],
      deptTree: [],
      tableHeight: null
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(new Date(time), '{y}-{m}-{d} {h}:{i}')
    }
  },
  methods: {
    handleDialog(index, row) {
      this.assessScoresVisible = true
      if (this.$refs.assessScores) {
        if (row.rate) {
          this.$refs.assessScores.init(row.rate)
        }
      }
      this.assessForm.index = index
    },
    closeDialog() {
      this.assessScoresVisible = false
    },
    setAssessScores(rate) {
      this.dbData[this.assessForm.index].rate = rate
      this.closeDialog()
    },
    formatterLevel(row) {
      return getDBLevelText(row.supervise_level)
    },
    filterStateText(state) {
      return getAssistStatusText(state)
    },
    handleDetail(index, row) {
      this.$router.push({
        path: '/caseManage/dbdetail/' + row.id
      })
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const para = {
          id: row.id,
          logFlag: 1
        }
        deleteSupervise(para).then((res) => {
          this.listLoading = false
          if (res.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.query(true)
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false, true)
    },
    query(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = this.filters
      para.ajbh = this.ajbh || '' // 案件编号
      para.pageNum = this.page
      para.pageSize = this.pageSize
      para.deptId = this.currentDeptId
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      getSupervisePage(para).then((response) => {
        this.listLoading = false
        this.dbData = response.data.list
        this.listTotal = response.data.totalCount
        this.pageSize = response.data.pageSize
      }).catch(() => {
        this.listLoading = false
      })
    },
    saveDBInfo(type) {
      this.$router.push({
        path: '/caseManage/dbedit/' + type
      })
    },
    editDBInfo(index, row) {
      if (row.category === 'apply') {
        this.$router.push({
          path: '/caseManage/dbedit/apply/' + row.id
        })
      } else if (row.category === 'demand') {
        this.$router.push({
          path: '/caseManage/dbedit/demand/' + row.id
        })
      }
    },
    resetForm() {
      this.filters = {
        caseName: '',
        createTime: '',
        deptName: ''
      }
      this.ajbh = ''
      this.query(true, true)
    },
    toAjDetail(id) {
      // this.$router.push({ path: '/caseManage/detailSyh/' + id })
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    toback() {
      // this.$router.back(-1)
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/dblist')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    if (depToken) {
      this.currentDeptId = depToken['id']
      this.query(true)
    }
  },
  activated: function() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    if (depToken) {
      this.currentDeptId = depToken['id']
      this.query(true)
    }
  }
}
</script>

<style scoped>
.dblist .breakWord span {
  word-wrap: break-word;
}
</style>
