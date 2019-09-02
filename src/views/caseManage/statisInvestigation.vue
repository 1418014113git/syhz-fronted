<template>
<!--案件统计表---全国性协查 -->
  <section class="investigation">
    <el-col :span="24">
       <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
    </el-col>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.title" clearable placeholder="协查标题" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.status" clearable placeholder="请选择状态">
          <el-option v-for="item in statusData"
                     :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.time" type="date" clearable placeholder="申请日期" size="small"
          value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true)"  v-if="$isViewBtn('101001')">查询</el-button>
        <el-button type="primary" size="small" @click="clear">重置</el-button>
        <!-- <el-button type="primary" size="small"  @click="goBack">返回</el-button> -->
      </el-form-item>
    </el-form>
    <!--列表1  通过查询条件查显示-->
    <el-table v-if="isShow1"  :data="listData1" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="assist_title" label="全国性协查标题"></el-table-column>
      <el-table-column prop="apply_dept_name" label="申请部门"></el-table-column>
      <el-table-column prop="create_time" label="申请时间" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus"  width="120"></el-table-column>
      <el-table-column label="操作"  width="80">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" icon="el-icon-document" circle
            @click="handleDetail(scope.row.id)" v-if="$isViewBtn('101004')"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="isShow1&&table1.total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange1" :page-size="table1.pageSize" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange1"
          :total="table1.total" :current-page="table1.page" style="float:right;">
      </el-pagination>
    </el-col>

     <!--列表2  通过查询条件查显示-->
    <el-table v-if="isShow2"  :data="listData2" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="title" label="全国性协查标题"></el-table-column>
      <el-table-column prop="applyDeptName" label="申请部门"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" icon="el-icon-document" circle
            @click="handleDetail(scope.row.inegId)" v-if="$isViewBtn('101004')"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="isShow2&&table2.total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange2" :page-size="table2.pageSize" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange2"
          :total="table2.total" :current-page="table2.page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import { getListPage } from '@/api/investigation'
  import { getAssistStatusText, getStatusSelect } from '@/utils/codetotext'
  export default {
    name: 'qgxxc',
    data() {
      return {
        curDeptId: '',
        filters: {
          status: '',
          title: '',
          time: '',
          deptId: ''
        },
        statusData: getStatusSelect(),
        table1: {
          total: 0,
          page: 1,
          pageSize: 15
        },
        table2: {
          total: 0,
          page: 1,
          pageSize: 15
        },
        listLoading: false,
        listData1: [],
        listData2: [],
        isShow1: false,
        isShow2: false,
        tableHeight: null
      }
    },
    methods: {
      query(flag) {
        if (!this.filters.status && !this.filters.title && !this.filters.time) {
          this.getCaseNew(flag)
        } else {
          this.getCase(flag)
        }
      },
      formatStatus(row, column) {
        return getAssistStatusText(row.status)
      },
      getCase(flag) {
        this.isShow1 = true
        this.isShow2 = false
        this.listLoading = true
        this.table1.page = flag ? 1 : this.table1.page
        const para = this.filters
        para.pageNum = this.table1.page
        para.curDepId = this.curDeptId
        para.pageSize = this.table1.pageSize
        getListPage(para).then((response) => {
          this.listLoading = false
          this.listData1 = response.data.list
          this.table1.pageSize = response.data.pageSize
          this.table1.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      getCaseNew(flag) {
        this.isShow1 = false
        this.isShow2 = true
        this.listLoading = true
        this.table2.page = flag ? 1 : this.table2.page
        const para = {
          type: this.param.type,
          fllb: this.param.fllb,
          cityCode: this.param.cityCode,
          startTime: this.param.startTime,
          endTime: this.param.endTime,
          pageNum: this.table2.page,
          pageSize: this.table2.pageSize
        }
        this.$query('statistics/list/assist', para).then((response) => {
          this.listLoading = false
          this.listData2 = response.data.list
          this.table2.pageSize = response.data.pageSize
          this.table2.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
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
      handleDetail(id) {
        this.$router.push({
          path: '/caseManage/investigation/detail/' + id
        })
      },
      clear() {
        this.filters = {
          status: '', title: '', time: '', deptId: ''
        }
        this.getCaseNew(true)
      },
      goBack() { // 返回案件统计情况报表
        this.filters = {
          status: '', title: '', time: '', deptId: ''
        }
        this.$router.back(-1)
        // this.$gotoid('/caseManage/statistics')
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.param) {
        this.getCaseNew(true)
      } else if (depToken) {
        this.curDeptId = depToken.id
        this.getCase(true)
      }
    },
    activated: function() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (depToken) {
        this.curDeptId = depToken.id
      }
      if (!this.filters.status && !this.filters.title && !this.filters.time) {
        this.getCaseNew(true)
      } else {
        this.getCase(true)
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
