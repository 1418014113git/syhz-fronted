<template>
  <section class="investigation">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="ajbh">   <!--返回-->
    <el-form :inline="true" :model="filters">
      <el-form-item label="集群战役标题">
        <el-input v-model="filters.title" clearable placeholder="集群战役标题" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" clearable placeholder="请选择状态">
          <el-option v-for="item in statusData"
                     :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker v-model="filters.time" type="date" clearable placeholder="申请日期" size="small"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-cascader-->
          <!--:options="depts"-->
          <!--:props="props"-->
          <!--:change-on-select="true"-->
          <!--:show-all-levels="false"-->
          <!--v-model="selectedDept"-->
          <!--clearable-->
          <!--@change="deptChange">-->
        <!--</el-cascader>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true,true)"  v-if="$isViewBtn('101001')">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd('approve')">申请</el-button>
        <el-button type="primary" size="small" v-if="xfBtnShow" v-on:click="handleAdd('')">下发</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="assist_title" label="集群战役标题" min-width="23%"></el-table-column>
      <el-table-column prop="apply_dept_name" label="申请部门" min-width="20%"></el-table-column>
      <el-table-column prop="create_time" label="申请时间" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="126">
        <template slot-scope="scope">
          <!--<el-button title="审核列表" size="mini" type="text" @click="reviewList(scope.$index, scope.row)" >审核列表</el-button>-->
          <el-button title="详情" size="mini" type="primary" icon="el-icon-document" circle
                     @click="handleDetail(scope.$index, scope.row)" v-if="$isViewBtn('101004')"></el-button>
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)"
                     v-if="(scope.row.status === '0' || scope.row.status === '2') && scope.row.apply_dept_id === curDeptId && $isViewBtn('101005')" ></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"
                     v-if="(scope.row.status === '0' || scope.row.status === '2') && scope.row.apply_dept_id === curDeptId && $isViewBtn('101006')"></el-button>

          <el-button title="综合评价" size="mini" type="danger" icon="el-icon-edit-outline" circle
                     @click="handleDialog(scope.$index, scope.row, 1)"
                     v-if="(scope.row.status === '7' || scope.row.status === '8') && scope.row.apply_dept_id === curDeptId && $isViewBtn('101006')"></el-button>
          <el-button title="考核打分" size="mini" type="danger" icon="el-icon-star-off" circle
                     @click="handleDialog(scope.$index, scope.row, 2)"
                     v-if="(scope.row.status === '7' || scope.row.status === '8') && scope.row.apply_dept_id === curDeptId && $isViewBtn('101006')"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--add-->
    <el-dialog title="综合评价" :visible.sync="assessVisible" width="740px" @close="closeDialog">
      <el-form :model="assessForm">
        <el-form-item>
          <el-input v-model="assessForm.content" type="textarea" placeholder="输入500字以内" :rows="10"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button @click="assessSubmit()" :loading="assessLoading" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="考核打分" :visible.sync="assessScoresVisible" width="1340px" @close="closeDialog">
      <AssessScores ref="assessScores" @setAssessScores="setAssessScores" @closeDialog="closeDialog"></AssessScores>
    </el-dialog>
  </section>
</template>

<script>
import {
  getListPage, deleteOne
} from '@/api/investigation'
import {
  getAssistStatusText, getStatusSelect
} from '@/utils/codetotext'
// import {
//   getDeptTree
// } from '@/api/depts'
import AssessScores from '@/views/caseAssist/components/assessScores'
export default {
  name: 'index',
  components: {
    AssessScores
  },
  data() {
    return {
      assessForm: {
        content: '',
        index: 0
      },
      assessScoresForm: {},
      assessLoading: false,
      assessVisible: false,
      assessScoresVisible: false,
      xfBtnShow: false,
      curDept: {},
      curDeptId: '',
      filters: {
        status: '',
        title: '',
        time: '',
        deptId: ''
      },
      selectedDept: [],
      depts: [],
      statusData: getStatusSelect(),
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      listData: [],
      marqueeText: '',
      props: {
        value: 'id',
        label: 'name'
      },
      ajbh: '',
      tableHeight: null
    }
  },
  methods: {
    handleDialog(index, row, type) {
      if (type === 1) {
        this.assessVisible = true
      } else {
        this.assessScoresVisible = true
        if (this.$refs.assessScores) {
          this.$refs.assessScores.init(row.rate)
        }
      }
      if (row.assessContent) {
        this.assessForm.content = row.assessContent
      }
      this.assessForm.index = index
    },
    closeDialog() {
      this.assessVisible = false
      this.assessScoresVisible = false
      this.assessForm = {
        content: '',
        index: 0
      }
    },
    assessSubmit() {
      this.assessLoading = true
      this.listData[this.assessForm.index].assessContent = this.assessForm.content
      const _this = this
      // const param = { // 手动点击时，添加埋点参数
      //   logFlag: 1
      // }

      setTimeout(function() {
        _this.$message({
          message: '综合评价提交成功！',
          type: 'success'
        })
        _this.assessLoading = false
        _this.closeDialog()
      }, 1000)
    },
    setAssessScores(rate) {
      this.listData[this.assessForm.index].rate = rate
      this.assessLoading = false
      this.closeDialog()
    },
    formatStatus(row, column) {
      return getAssistStatusText(row.status)
    },
    // deptChange(val) {
    //   if (val[val.length - 1]) {
    //     this.filters.deptId = val[val.length - 1]
    //   }
    // },
    query(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = this.filters
      para.pageNum = this.page
      para.pageSize = this.pageSize
      para.curDepId = this.curDeptId
      para.ajbh = this.ajbh || '' // 案件编号
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      getListPage(para).then((response) => {
        this.listLoading = false
        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.total = response.data.totalCount
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
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const para = {
          id: row.id,
          logFlag: 1 // 手动点击时，添加埋点参数
        }
        deleteOne(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(false)
        })
      }).catch(() => {

      })
    },
    handleAdd(type) {
      var param = {
        type: type
      }
      this.$gotoid('/caseManage/investigation/add', JSON.stringify(param))
    },
    handleDetail(index, row) {
      this.$router.push({
        path: '/caseManage/investigation/detail/' + row.id
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/caseManage/investigation/edit/' + row.id
      })
    },
    reviewList(index, row) {
      this.$router.push({
        path: '/caseManage/investigation/' + row.id
      })
    },
    clear() {
      this.filters = {
        status: '', title: '', time: '', deptId: ''
      }
      this.ajbh = ''
      this.query(true, true)
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
    sessionStorage.removeItem('/caseManage/investigation')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    if (this.curDept) {
      this.curDeptId = this.curDept.id
      this.query(true)
      if (this.curDept.depCode.substr(4, 2) === '00') {
        this.xfBtnShow = true
      }
    }
  },
  activated: function() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    if (this.curDept) {
      this.curDeptId = this.curDept.id
      this.query(true)
      if (this.curDept.depCode.substr(4, 2) === '00') {
        this.xfBtnShow = true
      }
    }
  }
}
</script>

<style scoped>
p > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
}
</style>
