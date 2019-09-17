<template>
<div>
  <el-row>
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="ajbh">   <!--返回-->
  </el-row>
   <div class="special_index">
    <el-form :inline="true" :model="filters">
      <el-form-item label="任务名称">
        <el-input v-model="filters.task_name" placeholder="任务名称" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="人员信息">
        <el-input v-model="filters.personName" placeholder="人员信息" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="企业信息">
        <el-input v-model="filters.companyName" placeholder="企业信息" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="线索任务">
        <el-input v-model="filters.qbxs" placeholder="线索任务" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker v-model="filters.create_date" type="date" placeholder="创建日期" clearable value-format="yyyy-MM-dd" size="small"></el-date-picker>
      </el-form-item>
      <!--<el-form-item label="发布部门">-->
        <!--<el-input v-model="filters.create_dept_name" placeholder="发布部门" size="small"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true,true)" v-if="$isViewBtn('102001')" >查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd" v-if="$isViewBtn('102003') && xfBtnShow" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tasks"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <!--<el-table-column type="expand">-->
        <!--<template slot-scope="props">-->
          <!--<p><span>任务负责人：{{ props.row.release }}</span><span>{{props.row.taskState}}</span></p>-->
          <!--<p><span>任务参与人：{{ props.row.jsonPersonnel }}</span><span>{{props.row.taskState}}</span></p>-->
          <!--<p><span>任务简要：{{ props.row.task_describe }}</span></p>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="task_name" label="任务名称" min-width="15%">
        <template slot-scope="scope">
          <p :title="scope.row.task_name" class="ellipsis-word">{{scope.row.task_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="110">
        <template slot-scope="scope">
          {{scope.row.start_date | filterDate}}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="110">
        <template slot-scope="scope">
          {{scope.row.end_date | filterDate}}
        </template>
      </el-table-column>
      <el-table-column label="参与部门" min-width="15%">
        <template slot-scope="scope">
          <p :title="formatDept(scope.row.dept_list)" class="ellipsis-word">{{formatDept(scope.row.dept_list)}}</p>
        </template>
      </el-table-column>
      <el-table-column label="发布部门" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.create_dept_name" class="ellipsis-word">{{scope.row.create_dept_name}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="任务状态" :formatter="formatStatus" width="100"></el-table-column>
      <el-table-column label="创建时间" width="110">
        <template slot-scope="scope">
          {{scope.row.create_date | filterDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button v-if="validDept(scope.row) && scope.row.bsStatus === '1' && scope.row.bsId" size="mini" type="text" @click="handSign(scope.row.bsId, scope.row.id,true)">签收</el-button>
          <el-button v-if="scope.row.status !== '0'" size="mini" type="text" @click="toReportSave(scope.row.id)">成果上报</el-button>
          <el-button v-if="scope.row.status !== '0' && $isViewBtn('102004')" size="mini" type="text" @click="reportResult(scope.$index, scope.row)">成果列表</el-button>
          <el-button v-if="$isViewBtn('102005')" type="primary" title="详情" size="mini" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.create_dept_id === curDeptId && scope.row.status === '0' && $isViewBtn('102006')" title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.create_dept_id === curDeptId && scope.row.status === '0' && $isViewBtn('102007')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.$index, scope.row,true)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</div>
</template>

<script>
import {
  parseTime
} from '@/utils/index'
import {
  taskListPage, deleteTask, specialTaskAccept
} from '@/api/specialTasks'

export default {
  name: 'index',
  data() {
    return {
      xfBtnShow: false,
      filters: {
        task_name: '',
        title: '',
        create_date: '',
        create_dept_name: '',
        personName: '',
        companyName: '',
        qbxs: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tasks: [],
      curDeptId: '',
      curDept: {},
      curUser: {},
      ajbh: '', // 案件编号
      tableHeight: null
    }
  },
  filters: {
    filterDate(date) {
      return parseTime(new Date(date), '{y}-{m}-{d}')
    }
  },
  methods: {
    validDept(row) {
      if (row.dept_list) {
        const arr = JSON.parse(row.dept_list)
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]['id'] === this.curDeptId) {
            return true
          }
        }
      }
      return false
    },
    formatStatus(row, column) {
      if (row.status === '0') {
        return '草稿'
      }
      if (row.status === '1') {
        return '待审核'
      }
      if (row.status === '2') {
        return '审核未通过'
      }
      if (row.status === '3') {
        return '待上级审核'
      }
      if (row.status === '4') {
        return '审核通过'
      }
      if (row.status === '5') {
        return '签收中'
      }
      if (row.status === '6') {
        return '成果上报阶段'
      }
      if (row.status === '7') {
        return '任务结束'
      }
      return ''
    },
    formatDept(deptList) {
      let dept_str = ''
      if (deptList) {
        const deptArr = JSON.parse(deptList)
        deptArr.forEach(function(item, index) {
          dept_str += item.name + (index === deptArr.length - 1 ? '' : '，\r\n')
        })
      }
      return dept_str
    },
    excelImport() {

    },
    otherImport() {

    },
    handleAdd: function() {
      this.$router.push({ path: '/specialTasks/add/' })
    },
    query(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        deptId: this.curDeptId,
        pageSize: this.pageSize,
        ajbh: this.ajbh || '' // 案件编号
      }
      if (this.filters.task_name) {
        para.taskName = this.filters.task_name
      }
      if (this.filters.create_date) {
        para.createDate = this.filters.create_date
      }
      if (this.filters.personName) {
        para.personName = this.filters.personName
      }
      if (this.filters.companyName) {
        para.companyName = this.filters.companyName
      }
      if (this.filters.qbxs) {
        para.qbxs = this.filters.qbxs
      }
      if (hand) {
        para.logFlag = 1
      }
      taskListPage(para).then((response) => {
        this.listLoading = false
        this.tasks = response.data.list
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

    handleDetail: function(index, row) {
      this.$router.push({ path: '/specialTasks/total/' })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/specialTasks/edit/' + row.id })
    },
    handleDel: function(index, row, hand) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = { id: row.id }
        if (hand) {
          para.logFlag = 1
        }
        deleteTask(para).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(false)
        })
      }).catch(() => {

      })
    },
    handSign(bsId, id, hand) {
      const req = {
        id: bsId,
        signUserId: this.curUser.id,
        signUserName: this.curUser.realName,
        updateUserId: this.curUser.id,
        status: 2,
        bizType: 6,
        action: '签收专项任务',
        bizId: id,
        userId: this.curUser.id,
        userName: this.curUser.realName
      }
      if (hand) {
        req.logFlag = 1
      }
      specialTaskAccept(req).then((res) => {
        this.listLoading = false
        if (res.code === '000000') {
          this.$message({
            message: '提交成功', type: 'success'
          })
          this.query(false)
        }
      })
    },
    reportResult(index, row) {
      this.$router.push({ path: '/specialTasks/results/' + row.id })
    },
    toReportSave(id) {
      this.$router.push({ path: '/specialTasks/reportResults/' + id })
    },
    clear() {
      this.filters = {
        task_name: '',
        title: '',
        create_date: '',
        create_dept_name: ''
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
    sessionStorage.removeItem('/specialTasks')
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
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
