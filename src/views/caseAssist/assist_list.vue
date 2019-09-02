<template>
  <section>
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="ajbh">   <!--返回-->
    <el-form :inline="true" :model="filters">
      <el-form-item label="案件协查状态">
        <el-select v-model="filters.status" placeholder="请选择协查状态" clearable>
          <el-option v-for="item in statusData"
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker v-model="filters.create_time" clearable type="date" placeholder="申请日期"
                        size="small" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <!--<el-form-item label="申请部门">-->
        <!--<el-input v-model="filters.apply_dept_id" clearable placeholder="申请部门" size="small"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100901')" v-on:click="query(true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="handleAdd('approve')">申请</el-button>
        <el-button type="primary" v-if="$isViewBtn('100903') && xfBtnShow" size="small" v-on:click="handleAdd('')">下发</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="statisticCollect" :max-height="tableHeight">
      <el-table-column label="案件编号" min-width="9%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.caseId)">{{scope.row.ajbh}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="18%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.caseId)">{{scope.row.ajmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="立案日期" min-width="8%">
        <template slot-scope="scope">
          {{$handlerDateTime(scope.row.larq)}}
        </template>
      </el-table-column>
      <el-table-column prop="ajlbName" label="案件类别" min-width="7%"></el-table-column>
      <el-table-column prop="applyDeptName" label="申请部门" min-width="10%"></el-table-column>
      <el-table-column prop="applyPersonName" label="申请人" min-width="5%"></el-table-column>
      <el-table-column prop="assistType" label="协查级别" min-width="6%" :formatter="formatType"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" min-width="9%">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="协查状态" :formatter="formatStatus" min-width="6%"></el-table-column>
      <el-table-column label="操作" width="124">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" type="primary" circle
                     @click="handleDetail(scope.$index, scope.row)" v-if="$isViewBtn('100904')" ></el-button>
          <el-button v-if="(scope.row.status === '0' || scope.row.status === '2') && scope.row.applyDeptId === curDeptId && $isViewBtn('100905')" title="编辑" size="mini" type="primary"
                     icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="(scope.row.status === '0' || scope.row.status === '2') && scope.row.applyDeptId === curDeptId && $isViewBtn('100906')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"></el-button>

          <!--add-->
          <el-button v-if="(scope.row.status === '7' || scope.row.status === '8') && scope.row.applyDeptId === curDeptId && $isViewBtn('100906')" title="综合评价" size="mini" type="danger" icon="el-icon-edit-outline" circle
                     @click="handleDialog(scope.$index, scope.row, 1)"></el-button>
          <el-button v-if="(scope.row.status === '7' || scope.row.status === '8') && scope.row.applyDeptId === curDeptId && $isViewBtn('100906')" title="考核打分" size="mini" type="danger" icon="el-icon-star-off" circle
                     @click="handleDialog(scope.$index, scope.row, 2)"></el-button>
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
  getAssistCasePage, deleteAssistCase
} from '@/api/assistCase'
import {
  getAssistLevelText, getAssistStatusText, getStatusSelect
} from '@/utils/codetotext'
import { parseTime } from '@/utils/index'
import AssessScores from './components/assessScores'

export default {
  name: 'assistlist',
  components: {
    AssessScores
  },
  data() {
    return {
      assessForm: {
        content: ''
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
        create_time: '',
        apply_dept_id: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      listData: [],
      statusData: [],
      ajbh: '', // 案件编号
      tableHeight: null
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },
  methods: {
    handleDialog(index, row, type) {
      if (type === 1) {
        this.assessVisible = true
      } else {
        this.assessScoresVisible = true
        if (this.$refs.assessScores) {
          if (row.rate) {
            this.$refs.assessScores.init(row.rate)
          }
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
    },
    assessSubmit() {
      this.assessLoading = true
      this.listData[this.assessForm.index].assessContent = this.assessForm.content
      const _this = this
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
      const s = getAssistStatusText(row.status)
      if (s === '进行中') {
        return '反馈中'
      }
      return s
    },
    formatType(row, column) {
      return getAssistLevelText(row.assistType)
    },
    query(flag) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        curDepId: this.curDeptId,
        status: this.filters.status,
        createTime: this.filters.create_time,
        applyDeptId: this.filters.apply_dept_id,
        ajbh: this.ajbh || '' // 案件编号
      }
      getAssistCasePage(para).then((response) => {
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
      this.query(false)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.query(false)
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const para = {
          id: row.id
        }
        deleteAssistCase(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(false)
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd(type) {
      var param = {
        type: type
      }
      this.$gotoid('/caseAssist/add', JSON.stringify(param))
    },
    handleDetail(index, row) {
      this.$router.push({
        path: '/caseAssist/detail/' + row.id
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/caseAssist/edit/' + row.id
      })
    },
    clear() {
      this.filters = {
        status: '',
        assist_title: '',
        create_time: '',
        apply_dept_id: ''
      }
      this.ajbh = ''
      this.query(true)
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
    sessionStorage.removeItem('/caseAssist/list')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.statusData = getStatusSelect()
    for (let i = 0; i < this.statusData.length; i++) {
      if (this.statusData[i]['value'] === '6') {
        this.statusData[i]['label'] = '反馈中'
      }
    }
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.curDept) {
      this.curDeptId = this.curDept.id
      this.query(false)
      if (this.curDept.depCode.substr(4, 2) === '00') {
        this.xfBtnShow = true
      }
    }
  },
  activated: function() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.statusData = getStatusSelect()
    for (let i = 0; i < this.statusData.length; i++) {
      if (this.statusData[i]['value'] === '6') {
        this.statusData[i]['label'] = '反馈中'
      }
    }
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.curDept) {
      this.curDeptId = this.curDept.id
      this.query(false)
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
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
