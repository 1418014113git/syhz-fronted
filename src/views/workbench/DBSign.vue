<template>
  <div class="DBSign">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="batchSign()" v-if="$isViewBtn('122002')">批量签收</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData"  v-loading="listLoading" style="width: 100%;" @selection-change="clueSelectionChange" :max-height="tableHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="案件编号" min-width="8%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" :title="scope.row.AJBH" @click="toDetail(scope.row.id)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="8%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" :title="scope.row.AJMC" @click="toDetail(scope.row.id)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
      <el-table-column label="发起部门" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.apply_dept_name" class="ellipsis-word">{{scope.row.apply_dept_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="5%">
        <template slot-scope="scope">
          {{formatTime(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="warning" v-if="$isViewBtn('122001')"
                     @click="handleReceive(scope.row.bsId, scope.row.id)" style="margin-top: 5px;">签收</el-button>
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
</template>

<script>
  import {
    getWorkSignDBList, saveBatchSignDB, updBusinessSignDB
  } from '@/api/workSignList'
  import { parseTime } from '@/utils/index'
  export default {
    name: 'DBSign',
    data() {
      return {
        type: '',
        currentDep: {},
        curUser: {},
        filters: {},
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        listData: [],
        selectClues: [],
        tableHeight: null
      }
    },
    methods: {
      formatTime(date) {
        return parseTime(date, '{y}-{m}-{d}')
      },
      handleCurrentChange(val) {
        this.page = val
        this.getData()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getData()
      },
      clear() {
        this.filters = {}
      },
      clueSelectionChange(val) {
        const array = []
        val.forEach((item, i) => {
          array.push({
            dbId: item.id, id: item.bsId, bizId: item.id
          })
        })
        this.selectClues = array
      },
      getData() {
        this.listLoading = true
        const para = {
          pageNum: this.page,
          noticeOrgId: this.currentDep.id,
          businessType: this.type,
          pageSize: this.pageSize
        }
        getWorkSignDBList(para).then((response) => {
          this.listLoading = false
          if (response.code === '000000') {
            this.listData = response.data.list
            this.pageSize = response.data.pageSize
            this.total = response.data.totalCount
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleReceive(bsId, id) {
        this.$confirm('确认要签收吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          updBusinessSignDB({
            id: bsId,
            status: 2,
            dbId: id,
            signUserId: this.curUser.id,
            updateUserId: this.curUser.id,
            bizType: 3,
            action: '签收督办案件',
            bizId: this.db_id,
            userId: this.curUser.id,
            userName: this.curUser.realName
          }).then((res) => {
            this.listLoading = false
            if (res.code === '000000') {
              this.$message({
                message: '签收成功', type: 'success'
              })
              this.getData()
            }
          }).catch(() => {
            this.listLoading = false
          })
        })
      },
      batchSign() {
        if (this.selectClues.length === 0) {
          this.$message({
            message: '请勾选要签收的信息', type: 'warning'
          })
          return false
        }
        this.$confirm('确认要签收吗?', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.selectClues.length; i++) {
            this.selectClues[i].status = 2
            this.selectClues[i].signUserId = this.curUser.id
            this.selectClues[i].updateUserId = this.curUser.id
            this.selectClues[i].bizType = 3
            this.selectClues[i].action = '签收督办案件'
            this.selectClues[i].userId = this.curUser.id
            this.selectClues[i].userName = this.curUser.realName
          }
          this.listLoading = true
          saveBatchSignDB({
            params: this.selectClues
          }).then((res) => {
            this.listLoading = false
            if (res.code === '000000') {
              this.$message({
                message: '签收成功', type: 'success'
              })
              this.getData()
            }
          }).catch(() => {
            this.listLoading = false
          })
        })
      },
      toDetail(id) {
        this.$router.push({
          path: '/caseManage/dbdetail/' + id
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.type = this.$route.params.type
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.currentDep) {
        this.getData()
      }
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>

</style>
