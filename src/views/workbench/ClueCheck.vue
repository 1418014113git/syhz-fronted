<template>
  <div class="ClueCheck">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="batchSign()" v-if="$isViewBtn('122002')">批量签收</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" @selection-change="clueSelectionChange" :max-height="tableHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="线索标题" min-width="8%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" :title="scope.row.BT"
             @click="toDetail(scope.row.xsId)">{{scope.row.BT}}</a>
        </template>
      </el-table-column>
      <el-table-column label="发起部门" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.createOrgName" class="ellipsis-word">{{scope.row.createOrgName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="核查要求" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.checkRequire" class="ellipsis-word">{{scope.row.checkRequire}}</p>
        </template>
      </el-table-column>
      <el-table-column label="反馈时限" min-width="5%">
        <template slot-scope="scope">
          {{formatTime(scope.row.replyTime)}}
        </template>
      </el-table-column>
      <el-table-column label="发起时间" min-width="5%">
        <template slot-scope="scope">
          {{formatTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="staffName" label="核查联系人" min-width="5%"></el-table-column>
      <el-table-column prop="staffPhone" label="联系人电话" min-width="5%"></el-table-column>
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
    getWorkSignList, saveBatchSign
  } from '@/api/workSignList'
  import {
    updBusinessSign
  } from '@/api/cluecheck'
  import { parseTime } from '@/utils/index'

  export default {
    name: 'ClueCheck',
    data() {
      return {
        type: '',
        currentDep: {},
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
            clueId: item.id, id: item.bsId, bizId: item.xsId
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
        getWorkSignList(para).then((response) => {
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
          updBusinessSign({
            id: bsId,
            status: 2,
            clueId: id,
            signUserId: this.curUser.id,
            signTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            updateUserId: this.curUser.id,
            bizType: 7,
            action: '签收情报线索',
            bizId: id,
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
            this.selectClues[i].bizType = 7
            this.selectClues[i].action = '签收情报线索'
            this.selectClues[i].userId = this.curUser.id
            this.selectClues[i].userName = this.curUser.realName
          }
          this.listLoading = true
          saveBatchSign({
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
          path: '/intellSystem/edit/' + id
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
