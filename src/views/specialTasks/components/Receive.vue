<template>
  <div class="Receive">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="" name="first">
        <span slot="label">已签收部门({{receiveNum}})</span>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label">未签收部门({{noReceiveNum}})</span>
      </el-tab-pane>
    </el-tabs>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="noticeOrgName" label="签收部门" min-width="20%"></el-table-column>
      <el-table-column prop="signUserName" label="签收人" min-width="5%"></el-table-column>
      <el-table-column prop="signTime" label="签收时间" min-width="10%"></el-table-column>
      <el-table-column v-if="$isViewBtn('102016') && activeName === 'second' " label="签收" width="100px">
        <template slot-scope="scope">
          <el-button v-if="curDeptId === Number(scope.row.noticeOrgId) && scope.row.bsStatus === '1'" size="mini" type="primary" @click="addReceive(scope.row.bsId)">签收</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"-->
                   <!--:total="total"-->
                   <!--style="float:right;">-->
    <!--</el-pagination>-->
  </div>
</template>

<script>
  import {
    specialTaskAccept, taskReceiveList, editTask
  } from '@/api/specialTasks'

  export default {
    name: 'Receive',
    props: [
      'id'
    ],
    data() {
      return {
        receiveNum: 0,
        noReceiveNum: 0,
        activeName: 'first',
        receiveData: [],
        noReceiveData: [],
        listData: [],
        listLoading: false,
        total: 0,
        pageSize: 10,
        page: 1,
        curDeptId: '',
        saveBean: {},
        received: false,
        curDept: {},
        curUser: {}
      }
    },
    methods: {
      handleClick(tab) {
        if (tab.name === 'first') {
          this.listData = this.receiveData
        }
        if (tab.name === 'second') {
          this.listData = this.noReceiveData
        }
      },
      handleCurrentChange(val) {
        this.page = val
        this.receiveList()
      },
      addReceive(bsId) {
        this.$confirm('确认要签收吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.saveBean.id = bsId
          this.saveBean.signUserId = this.curUser.id
          this.saveBean.signUserName = this.curUser.realName
          this.saveBean.updateUserId = this.curUser.id
          this.saveBean.status = 2
          this.saveBean.bizType = 6
          this.saveBean.action = '签收专项任务'
          this.saveBean.bizId = this.saveBean.taskId
          specialTaskAccept(this.saveBean).then((response) => {
            if (response.code === '000000') {
              this.$message({
                message: '签收成功',
                type: 'success'
              })
              // 修改专项任务状态
              this.updTask() // 成果上报中
              this.receiveList()
            }
          })
        })
      },
      updTask() {
        editTask({
          id: this.saveBean.taskId,
          status: 6
        }).then((res) => {})
      },
      receiveList() {
        this.activeName = 'first'
        this.listLoading = true
        const para = {}
        para.taskId = this.saveBean.taskId
        taskReceiveList(para).then((response) => {
          this.listLoading = false
          if (response.code === '000000' && response.data.list) {
            this.noReceiveData = []
            this.receiveData = []
            const list = response.data.list
            for (let i = 0; i < list.length; i++) {
              const obj = list[i]
              if (obj.bsStatus === '1') {
                this.noReceiveData.push(obj)
              } else if (obj.bsStatus === '2') {
                this.receiveData.push(obj)
              }
            }
            this.receiveNum = this.receiveData.length
            this.noReceiveNum = this.noReceiveData.length
            this.listData = this.receiveData
            // this.total = this.receiveNum
          }
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curDept && this.curUser) {
        this.curDeptId = this.curDept.id
        this.saveBean.deptId = this.curDept.id
        this.saveBean.deptName = this.curDept.depName
        this.saveBean.receiverId = this.curUser.id
        this.saveBean.receiverName = this.curUser.realName
        this.saveBean.userId = this.curUser.id
        this.saveBean.userName = this.curUser.realName
      }
    },
    watch: {
      id(val) {
        this.saveBean.taskId = val
        this.receiveList()
      }
    }
  }
</script>

<style scoped>

</style>
