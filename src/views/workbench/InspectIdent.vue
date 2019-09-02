<template>
  <div class="InspectIdent">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="batchSign()" v-if="$isViewBtn('122002')">批量签收</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" @selection-change="clueSelectionChange" :max-height="tableHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="检验机构" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.organizationName" class="ellipsis-word">{{scope.row.organizationName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="检材名称" min-width="8%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" :title="scope.row.checkName"
             @click="toDetail(scope.row.id)">{{scope.row.checkName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="送检要求" min-width="15%">
        <template slot-scope="scope">
          <p :title="scope.row.checkReason" class="ellipsis-word">{{scope.row.checkReason}}</p>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.caseName" class="ellipsis-word">{{scope.row.caseName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="送检民警" min-width="5%">
        <template slot-scope="scope">
          <p :title="scope.row.copyPerson" class="ellipsis-word">{{scope.row.copyPerson}}</p>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="120px">
        <template slot-scope="scope">
          {{formatTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="warning" v-if="$isViewBtn('122001')"
                     @click="handleReceive(scope.row.bsId, scope.row.id)" style="margin-top: 5px;">签收
          </el-button>
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
    getWorkSignInspectList, saveBatchSignJYJD, updBusinessSignJYJD
  } from '@/api/workSignList'

  export default {
    name: 'InspectIdent',
    data() {
      return {
        type: '',
        curDept: {},
        curUser: {},
        filters: {
          XSXXBH: '',
          XSZT: '',
          TBDW: '',
          TBSJ: '',
          STATUS: ''
        },
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
        return this.$parseTime(date, '{y}-{m}-{d}')
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
        this.filters = {
          XSXXBH: '',
          XSZT: '',
          TBDW: '',
          TBSJ: '',
          STATUS: ''
        }
      },
      clueSelectionChange(val) {
        const array = []
        val.forEach((item, i) => {
          array.push({
            aid: item.id, id: item.bsId, bizId: item.id
          })
        })
        this.selectClues = array
      },
      getData() {
        this.listLoading = true
        const para = {
          pageNum: this.page,
          noticeOrgId: this.curDept.id,
          businessType: this.type,
          pageSize: this.pageSize
        }
        getWorkSignInspectList(para).then((response) => {
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
          updBusinessSignJYJD({
            id: bsId,
            status: 2,
            aid: id,
            signUserId: this.curUser.id,
            signTime: this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            updateUserId: this.curUser.id,
            // bizType: 7,
            // action: '签收检验鉴定',
            // bizId: id,
            userId: this.curUser.id,
            userName: this.curUser.realName
          }).then((res) => {
            this.listLoading = false
            if (res.code === '000000') {
              this.$message({
                message: '签收成功',
                type: 'success'
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
            message: '请勾选要签收的信息',
            type: 'warning'
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
            // this.selectClues[i].bizType = 7
            // this.selectClues[i].action = '签收检验鉴定'
            this.selectClues[i].userId = this.curUser.id
            this.selectClues[i].userName = this.curUser.realName
          }
          this.listLoading = true
          saveBatchSignJYJD({
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
          path: '/inspectIdent/detail/' + id
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.type = this.$route.params.type
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept) {
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
