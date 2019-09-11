<template>
  <section>
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="ajbh">   <!--返回-->
    <el-form :inline="true" :model="filters">
      <el-form-item label="申请单位" prop="applyDeptId" >
        <el-select clearable v-model="filters.applyDeptId" placeholder="请选择" style="width:100%">
          <el-option  v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期：">
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.createTime" type="daterange" range-separator="-" start-placeholder="开始日期"
          end-placeholder="结束日期" size="small" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search" v-if="$isViewBtn('104001')" >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="goAdd()" v-if="$isViewBtn('104002')">申请</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="申请单位" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.apply_dept_name" class="ellipsis-word">{{scope.row.apply_dept_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="检材名称" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.check_name" class="ellipsis-word">{{scope.row.check_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="送检要求" min-width="15%">
        <template slot-scope="scope">
          <p :title="scope.row.check_reason" class="ellipsis-word">{{scope.row.check_reason}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="apply_person_name" label="申请人" width="130"></el-table-column>
      <el-table-column prop="create_time" label="申请时间" width="180"></el-table-column>
      <el-table-column prop="statusStr" label="审批状态" width="100"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button title="详情" size="small" type="primary"
                     @click="handleDetail(scope.$index, scope.row)" v-if="$isViewBtn('104003')">详情</el-button>
          <!--<el-button title="检验鉴定委托书" size="mini" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">检验鉴定委托书</el-button>-->
          <!-- <el-button title="审批" size="mini" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">审批</el-button> -->
          <!--<el-button title="鉴定报告" size="mini" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">鉴定报告</el-button>-->
          <el-button v-if="(scope.row.status === 0 || scope.row.status === 2) && $isViewBtn('104004') && scope.row.apply_dept_id === String(curDept.id)" title="修改" size="small" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button v-if="(scope.row.status === 0 || scope.row.status === 2) && $isViewBtn('104006') && scope.row.apply_dept_id === String(curDept.id)" title="删除" size="small" type="danger"
                     @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <a v-if="Number(scope.row.status) >= 4 && $isViewBtn('104005')" style="margin:0 10px" :href="exportDataUrl+'/'+scope.row.id"  download="检验鉴定报告.docx"  >
            <el-button size="small" type="success"><i class="el-icon-download"></i>介绍信</el-button>
          </a>
          <el-button v-if="Number(scope.row.status) >= 4 && $isViewBtn('104005')" title="修改" size="small" type="primary"
                     @click="handleDialog(scope.$index, scope.row)">流程跟踪</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="流程跟踪" :visible.sync="dialogVisible" width="1300px" @close="closeDialog">
      <img src="/static/image/syh_images/lct.png" style="width: 100%">
    </el-dialog>
  </section>
</template>
<script>
import {
  getAuthenticatePage, removeAuthenticate
} from '@/api/inspectIdent'
import {
  getSessionDeptSelect
} from '@/api/depts'
import {
  getAssistStatusText
} from '@/utils/codetotext'
import importexport from '@/api/importexport'
export default {
  name: 'InspectIdentList',
  data() {
    return {
      dialogVisible: false,
      exportDataUrl: importexport.exportAuthenDocUrl,
      filters: {
        applyDeptId: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      list: [],
      deptList: [],
      curDept: {},
      ajbh: '', // 案件编号
      tableHeight: null
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    handleDialog() {
      this.dialogVisible = true
      // 请求参数时，添加埋点参数
      // logFlag = 1
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/inspectIdent/detail/' + row.id })
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/inspectIdent/apply/' + row.id })
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        removeAuthenticate({ // 手动点击时，添加埋点参数
          id: row.id,
          logFlag: 1
        }).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query(true)
        })
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(true, true)
    },
    query(flag, hand) {
      const date = {
        startTime: '',
        endTime: ''
      }
      if (this.filters.createTime) {
        date.startTime = this.filters.createTime[0]
        date.endTime = this.filters.createTime[1]
      }
      const para = {
        pageNum: flag ? 1 : this.page,
        pageSize: this.pageSize,
        curDepId: this.curDept.id,
        applyDeptId: this.filters.applyDeptId,
        startTime: date.startTime,
        endTime: date.endTime,
        ajbh: this.ajbh || '' // 案件编号
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      getAuthenticatePage(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        this.list = data.list
        const that = this
        this.list.forEach(function(item) {
          item.statusStr = that.applyStatus(item.status)
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.page = 1
      this.query(true, true)
    },
    resetSearch() {
      this.filters.applyDeptId = ''
      this.filters.createTime = ''
      this.ajbh = ''
      this.page = 1
      this.query(true, true)
    },
    goAdd() {
      this.$router.push({ path: '/inspectIdent/apply/0' })
    },
    initList() {
      this.deptList = getSessionDeptSelect()
    },
    applyStatus(s) {
      if (String(s) === '6') {
        return '结果反馈中'
      }
      if (String(s) === '7') {
        return '结果已反馈'
      }
      return getAssistStatusText(String(s))
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
    sessionStorage.removeItem('/inspectIdent/list')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    if (this.$route.query.ajbh) {
      this.ajbh = this.$route.query.ajbh
    }
    this.initList()
    this.query(true)
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style scoped>
.el-button+.el-button {
  margin-left: 5px;
}
</style>
