<template>
 <!--案件统计表---督办列表 -->
  <div class="dblist">
    <el-col :span="24">
       <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
    </el-col>
    <el-form ref="dbqueryForm" :inline="true" :model="filters">
      <el-form-item label="案件名称">
        <el-input v-model="filters.caseName" clearable placeholder="案件名称" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="filters.createTime" type="date"
         placeholder="申请日期" size="small" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100801')"  @click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" size="small"  @click="goBack">返回</el-button>
      </el-form-item> -->
    </el-form>
    <!--列表1  通过查询条件查显示-->
     <el-table v-if="isShow1" :data="dbData1" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="案件编号" width="210">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
      <el-table-column label="立案时间" width="160">
        <template slot-scope="scope">
          {{$handlerDateTime(scope.row.LARQ)}}
        </template>
      </el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类别"></el-table-column>
      <el-table-column label="发起时间" width="160">
        <template slot-scope="scope">
          {{scope.row.create_time | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="apply_dept_name" label="发起部门"></el-table-column>
      <el-table-column prop="supervise_level" label="督办级别" :formatter="formatterLevel1"></el-table-column>
      <el-table-column label="督办状态">
        <template slot-scope="scope">
          {{filterStateText(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="截止时间" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.end_date">{{scope.row.end_date | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" v-if="$isViewBtn('100805')" @click="handleDetail(scope.row.id)" icon="el-icon-tickets" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="isShow1&&table1.listTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange1" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange1"
      :page-size="table1.pageSize" :total="table1.listTotal" :current-page="table1.page" style="float:right;"></el-pagination>
    </el-col>

    <!--列表2  从案件侦办统计表跳转过来查询显示-->
    <el-table v-if="isShow2" :data="dbData2" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="案件编号" width="210">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="立案时间" width="180">
        <template slot-scope="scope">
          {{$handlerDateTime(scope.row.larq)}}
        </template>
      </el-table-column>
      <el-table-column prop="ajlbName" label="案件类别"></el-table-column>
      <el-table-column label="发起时间" width="160">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="applyDeptName" label="发起部门"></el-table-column>
      <el-table-column prop="level" label="督办级别" :formatter="formatterLevel2"></el-table-column>
      <el-table-column label="督办状态">
        <template slot-scope="scope">
          {{filterStateText(scope.row.dbStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="截止时间" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.endDate">{{scope.row.endDate | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" v-if="$isViewBtn('100805')"
            @click="handleDetail(scope.row.dbId)" icon="el-icon-tickets" circle>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="isShow2&&table2.listTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange2" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange2"
      :page-size="table2.pageSize" :total="table2.listTotal" :current-page="table2.page" style="float:right;"></el-pagination>
    </el-col>
  </div>
</template>

<script>
  import { getSupervisePage } from '@/api/supervise'
  import { getDBLevelText, getAssistStatusText } from '@/utils/codetotext'
  import { parseTime } from '@/utils/index'
  export default {
    name: 'dblist',
    data() {
      return {
        currentDeptId: '',
        filters: {
          caseName: '',
          createTime: '',
          deptName: ''
        },
        table1: {
          pageSize: 15,
          listTotal: 0,
          page: 1
        },
        table2: {
          pageSize: 15,
          listTotal: 0,
          page: 1
        },
        listLoading: false,
        dbData1: [],
        dbData2: [],
        param: {},
        isShow1: false,
        isShow2: false,
        tableHeight: null
      }
    },
    filters: {
      formatDate(time) {
        return parseTime(new Date(time), '{y}-{m}-{d} {h}:{i}')
      }
    },
    methods: {
      query(flag) {
        if (!this.filters.caseName && !this.filters.createTime) {
          this.getCaseNew(flag)
        } else {
          this.getCase(flag)
        }
      },
      formatterLevel1(row) {
        return getDBLevelText(row.supervise_level)
      },
      formatterLevel2(row) {
        return getDBLevelText(row.level)
      },
      filterStateText(state) {
        return getAssistStatusText(state)
      },
      handleDetail(id) { // 跳转督办详情
        this.$router.push({
          path: '/caseManage/dbdetail/' + id
        })
      },
      handleCurrentChange1(val) {
        this.table1.page = val
        this.getCase()
      },
      handleCurrentChange2(val) {
        this.table2.page = val
        this.getCaseNew()
      },
      handleSizeChange1(val) {
        this.table1.page = 1
        this.table1.pageSize = val
        this.getCase()
      },
      handleSizeChange2(val) {
        this.table2.page = 1
        this.table2.pageSize = val
        this.getCaseNew()
      },
      getCase(flag) { // 通过查询条件查询
        this.isShow1 = true
        this.isShow2 = false
        this.listLoading = true
        this.table1.page = flag ? 1 : this.table1.page
        const para = this.filters
        para.pageNum = this.page
        para.pageSize = this.table1.pageSize
        para.deptId = this.currentDeptId
        getSupervisePage(para).then((response) => {
          this.listLoading = false
          this.dbData1 = response.data.list
          this.table1.listTotal = response.data.totalCount
          this.table1.pageSize = response.data.pageSize
        }).catch(() => {
          this.listLoading = false
        })
      },
      getCaseNew(flag) { // 从案件统计情况表跳转过来查询
        this.isShow1 = false
        this.isShow2 = true
        this.listLoading = true
        this.table2.page = flag ? 1 : this.table2.page
        const para = {
          level: this.param.level,
          status: this.param.status,
          cityCode: this.param.cityCode,
          startTime: this.param.startTime,
          endTime: this.param.endTime,
          pageNum: this.table2.page,
          pageSize: this.table2.pageSize
        }
        this.$query('statistics/list/supervise', para).then((response) => {
          this.listLoading = false
          this.dbData2 = response.data.list
          this.table2.listTotal = response.data.totalCount
          this.table2.pageSize = response.data.pageSize
        }).catch(() => {
          this.listLoading = false
        })
      },
      resetForm() {
        this.filters = {
          caseName: '',
          createTime: '',
          deptName: ''
        }
        this.getCaseNew(true)
      },
      toAjDetail(id) { // 跳转案件详情
        // this.$router.push({ path: '/caseManage/detailSyh/' + id })
        this.$router.push({
          path: '/caseFile/index', query: { id: id }
        })
      },
      goBack() { // 返回案件统计情况报表
        this.filters = {
          caseName: '',
          createTime: '',
          deptName: ''
        }
        this.$router.back(-1)
        // this.$gotoid('/caseManage/statistics')
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (this.param) {
        this.getCaseNew(true)
      } else if (depToken) {
        this.currentDeptId = depToken['id']
        this.getCase(true)
      }
    },
    activated: function() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (depToken) {
        this.currentDeptId = depToken['id']
      }
      if (!this.filters.caseName && !this.filters.createTime) {
        this.getCaseNew(true)
      } else {
        this.getCase(true)
      }
    }
  }
</script>

<style scoped>
.dblist .breakWord span {
	word-wrap: break-word;
}
</style>
