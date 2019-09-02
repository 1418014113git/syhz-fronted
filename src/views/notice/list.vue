<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="标题：">
        <el-input v-model="filters.title" placeholder="标题" size="small"></el-input>
      </el-form-item>
      <el-form-item label="时间范围：">
        <el-date-picker v-model="filters.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" size="small"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search" v-if="$isViewBtn('115001')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="goAdd()" v-if="$isViewBtn('115002')">发站内信息</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="标题" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.title" class="ellipsis-word">{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="发布者" min-width="8%"></el-table-column>
      <el-table-column prop="update_time" label="发布时间" min-width="6%"></el-table-column>
      <el-table-column label="信息来源" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.info_source" class="ellipsis-word">{{scope.row.info_source}}</p>
        </template>
      </el-table-column>
      <el-table-column label="分类" min-width="3%">
        <template slot-scope="scope">
          <span v-if="String(scope.row.type) === '1'">食品</span>
          <span v-if="String(scope.row.type) === '2'">药品</span>
          <span v-if="String(scope.row.type) === '3'">环境</span>
          <span v-if="String(scope.row.type) === '4'">综合</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="views" label="阅读数" sortable min-width="4%"></el-table-column> -->
      <el-table-column label="通知部门" min-width="10%">
        <template slot-scope="scope">
          <p v-if="scope.row.orgNames && String(scope.row.orgNames) !== ''" :title="formatTxt(scope.row.orgNames)" class="ellipsis-word">{{formatTxt(scope.row.orgNames)}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle v-if="$isViewBtn('115003')"
                     @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" v-if="String(currentDep) === String(scope.row.create_org_id) && scope.row.notice_status === 0 && $isViewBtn('115004')" size="mini" type="primary" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="删除" v-if="String(currentDep) === String(scope.row.create_org_id) && scope.row.notice_status === 0 && $isViewBtn('115005')"  size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
  import { getTztgListPage, removeTztg } from '@/api/notice'
  import { getDepToken } from '@/utils/auth'
  export default {
    name: 'list',
    data() {
      return {
        filters: {
          title: '',
          date: ''
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        list: [],
        currentDep: '',
        tableHeight: null
      }
    },
    methods: {
      formatTxt(str) {
        return str.replace(',', '，')
      },
      handleDetail: function(index, row) {
        this.$router.push({ path: '/tztg/detail/' + row.id })
      },
      handleEdit: function(index, row) {
        this.$router.push({ path: '/tztg/edit/' + row.id })
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = {
            id: row.id
          }
          removeTztg(para).then((response) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.page = 1
            this.query()
          })
        }).catch(() => {
        })
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
        this.query()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query()
      },
      query() {
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          title: this.filters.title,
          orgId: this.currentDep
        }
        if (this.filters.date) {
          para.startTime = this.filters.date[0]
          para.endTime = this.filters.date[1]
        }
        this.listLoading = true
        getTztgListPage(para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.list = data.list
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      search() {
        this.page = 1
        this.query()
      },
      goAdd() {
        this.$router.push({ path: '/tztg/save' })
      },
      setCurrentOrg() {
        const a = JSON.parse(getDepToken())
        this.currentDep = a[0].id
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.setCurrentOrg()
      this.query()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>
<style scoped>
</style>
