<template>
  <div class="message-list">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <div class="msg-list">
        <div class="tabList">
          <span :class="{'on':curIndex === 0}" @click="checkTab(0, 0)">&nbsp;&nbsp;全部({{countData.list}})</span>
          <em></em>
          <span :class="{'on':curIndex === 1}" @click="checkTab(9, 1)">已读({{countData.list1}})</span>
          <em></em>
          <span :class="{'on':curIndex === 2}" @click="checkTab(8, 2)">未读({{countData.list0}})</span>
          <em></em>
          <span :class="{'on':curIndex === 3}" @click="checkTab(1, 3)">案件管理({{countData.bussionType1}})</span>
          <em></em>
          <span :class="{'on':curIndex === 4}" @click="checkTab(2, 4)">情报管理({{countData.bussionType2}})</span>
          <em></em>
          <span :class="{'on':curIndex === 5}" @click="checkTab(3, 5)">教育训练({{countData.bussionType3}})</span>
          <em></em>
          <span :class="{'on':curIndex === 6}" @click="checkTab(4, 6)">基础业务({{countData.bussionType4}})</span>
          <span></span>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <el-table ref="multipleTable" :data="dataList" v-loading="loading" tooltip-effect="dark" style="width: 100%;overflow-y:auto;" :max-height="tableHeight"
                  @selection-change="handleSelectionChange" :show-header="showHeader" id="msg-table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-row style="padding: 18px 0 17px;" type="flex" justify="space-between">
                <el-col :span="18">
                  <el-button type="text" @click="toDetail(scope.row)">
                    <span style="color: #1b89bd;">[{{getBizTypeText(scope.row.bussionType)}}]</span>
                    <span class="fontFFF">{{scope.row.title}}</span>
                    <span class="fontFFF">[{{formatTime(scope.row.creatorDate)}}]</span>
                    <span class="fontFFF isMessage" style="position: relative;" v-if="scope.row.status === 0">[未读]</span>
                    <span class="fontFFF" v-if="scope.row.status === 1">[已读]</span>
                  </el-button>
                </el-col>
                <el-col :span="4" style="text-align: right">
                  <el-button title="删除" type="primary" @click="deleteMessage(scope.row)" icon="el-icon-delete" circle></el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="padding: 10px 0 18px;" v-if="total > 0">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                     style="padding: 0 14px; color:#1E98D2">全选
        </el-checkbox>
        <el-button type="primary" @click="batchDeleteMessage()"><i class="el-icon-delete"></i>删除</el-button>
        <el-button type="primary" @click="batchUpdateMessage()"><i class="el-icon-message"></i>已读</el-button>
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right; padding-bottom: 20px;">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="detail.title" :visible.sync="dialogVisible" :close-on-click-modal="false" class="audit_dialog" @close="closeDialog">
      <el-form :model="detail" label-width="100px" style="padding-left: 20px; padding-right: 15px;" v-loading="dialogLoading">
        <el-form-item label="消息内容">{{detail.content}}</el-form-item>
        <el-form-item label="发送时间">{{detail.creatorDate}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Messages',
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      loading: false,
      checkAll: false,
      isIndeterminate: false,
      showHeader: false,
      curIndex: 0,
      allData: {},
      dataList: [],
      countData: {
      },
      tabList: [
        { title: '全部', type: 0 },
        { title: '已读', type: 9 },
        { title: '未读', type: 8 },
        { title: '案件管理', type: 1 },
        { title: '情报管理', type: 2 },
        { title: '教育训练', type: 3 },
        { title: '基础业务', type: 4 }
      ],
      multipleSelection: [],
      total: 0,
      pageSize: 15,
      page: 1,
      curDept: {},
      curUser: {},
      bizType: 0,
      tableHeight: document.documentElement.clientHeight - 300,
      detail: {}
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
      this.detail = {}
    },
    callback() {
      this.$router.push({ path: '/portal' })
    },
    formatTime(time) {
      return this.$parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    getBizTypeText(type) {
      let rs = ''
      this.tabList.forEach((item) => {
        if (item.type === type) {
          rs = item.title
          return true
        }
      })
      return rs
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryData()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryData()
    },
    queryCount() {
      const para = {
        userId: this.curUser.id,
        deptCode: this.curDept.depCode
      }
      this.$query('sysMessages', para).then((res) => {
        this.loading = false
        if (res.code === '000000' && res.data) {
          this.countData = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },
    queryData() {
      this.loading = true
      this.dataList = []
      this.checkAll = false
      this.isIndeterminate = false
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        userId: this.curUser.id,
        deptCode: this.curDept.depCode
      }
      if (this.bizType === 9) {
        para.status = 1
      } else if (this.bizType === 8) {
        para.status = 0
      } else if (this.bizType !== 0) {
        para.bussionType = this.bizType
      }
      this.$query('page/sysMessagesPage', para).then((res) => {
        this.loading = false
        if (res.code === '000000' && res.data) {
          this.dataList = res.data.list
          this.total = res.data.totalCount
          this.total = res.data.totalCount
        }
      }).catch(() => {
        this.loading = false
      })
    },
    checkTab(type, index) { // 点击tab菜单
      this.curIndex = index
      this.bizType = type
      this.page = 1
      this.total = 0
      this.queryData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const checkedCount = val.length
      this.checkAll = checkedCount === this.dataList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataList.length
    },
    handleCheckAllChange(val) {
      if (val) {
        this.dataList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    toDetail(row) {
      this.dialogLoading = true
      if (row.status === 0) {
        this.updMessage(row.messagesId, 1)
      }
      this.dialogVisible = true
      this.$query('sysmessagesdetail/' + row.messagesId, {}).then(response => {
        this.dialogLoading = false
        this.detail = response.data
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    updMessage(id) {
      this.loading = true
      const para = {
        messagesId: [id]
      }
      this.$update('sysmessagesstatus/1', para).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.$message({
            message: '操作成功', type: 'success'
          })
          this.query()
        }
      })
    },
    deleteMessage(row) {
      this.loading = true
      const para = {
        messagesId: [row.messagesId]
      }
      this.$update('sysmessagesdel/1', para).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.$message({
            message: '操作成功', type: 'success'
          })
          this.query()
        }
      })
    },
    batchDeleteMessage() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请勾选信息', type: 'warning'
        })
        return false
      }
      const params = {
        messagesId: []
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        params.messagesId.push(this.multipleSelection[i]['messagesId'])
      }
      this.loading = true
      this.$update('sysmessagesdel/1', params).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.$message({
            message: '操作成功', type: 'success'
          })
          this.query()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    batchUpdateMessage() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请勾选信息', type: 'warning'
        })
        return false
      }
      const params = {
        messagesId: []
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].status === 0) {
          params.messagesId.push(this.multipleSelection[i]['messagesId'])
        }
      }
      if (params.messagesId.length === 0) {
        this.$message({
          message: '没有未读的消息', type: 'warning'
        })
        return false
      }
      this.loading = true
      this.$update('sysmessagesstatus/1', params).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.$message({
            message: '操作成功', type: 'success'
          })
          this.query()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    query() {
      this.queryCount()
      this.queryData()
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curDept) {
      this.queryCount()
      this.queryData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.msg-list {
  .tabList {
    width: 100%;
    height: 40px;
    border-bottom: 2px solid #00a0e9;
    line-height: 40px;
    span {
      font-size: 17px;
      color: rgba(0, 160, 233, 0.5);
      cursor: pointer;
      padding: 5px 15px;
    }
    em {
      display: inline-block;
      width: 26px;
      height: 26px;
      box-sizing: border-box;
    }
    em::before {
      content: "";
      display: inline-block;
      width: 24px;
      height: 24px;
      box-sizing: border-box;
      border-bottom: 1px solid #00a0e9;
      transform-origin: bottom center;
      transform: rotateZ(-58deg) scale(1.414);
    }
  }
  .on {
    color: #bce8fc !important;
    text-shadow: 0 0 2px #fff;
  }
  .zbMainTit {
    display: flex;
    justify-content: space-between;
  }
  .text {
    width: 70%;
    overflow: hidden;
  }
  .fontFFF {
    color: #ffffff;
  }
}

#msg-table .el-table__body-wrapper tr:nth-child(even) {
  color: #bce8fc !important;
}

.isMessage {
  &::before {
    display: inline-block;
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 1px;
    right: -8px;
  }
}
</style>
