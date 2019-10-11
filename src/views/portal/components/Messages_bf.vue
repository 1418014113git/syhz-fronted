<template>
  <div class="message-list">
    <div class="cardCount">
      <el-col class="carddiv">
        <el-card class="box-card" v-loading="loading">
          <div class="msg-list">
            <div class="tabList">
              <span :class="{'on':curIndex === 0}" @click="checkTab(0, 0)">&nbsp;&nbsp;全部&nbsp;&nbsp;</span>
              <em></em>
              <span :class="{'on':curIndex === 1}" @click="checkTab(1, 1)">案件认领</span>
              <em></em>
              <span :class="{'on':curIndex === 2}" @click="checkTab(3, 2)">案件督办</span>
              <em></em>
              <span :class="{'on':curIndex === 3}" @click="checkTab(4, 3)">全国协查</span>
              <em></em>
              <span :class="{'on':curIndex === 4}" @click="checkTab(5, 4)">案件协查</span>
              <em></em>
              <span :class="{'on':curIndex === 5}" @click="checkTab(6, 5)">专项任务</span>
              <em></em>
              <span :class="{'on':curIndex === 6}" @click="checkTab(7, 6)">情报线索</span>
              <em></em>
            </div>
          </div>
          <div style="margin-bottom: 10px;">
            <el-table ref="multipleTable" :data="dataList" tooltip-effect="dark" style="width: 100%;overflow-y:auto;" :max-height="tableHeight"
                      @selection-change="handleSelectionChange" :show-header="showHeader" id="msg-table">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-row style="padding: 18px 0 17px;" type="flex" justify="space-between">
                    <!--border-bottom: 1px dashed #00a0ec;-->
                    <el-col :span="18">
                      <el-button v-if="bizType === 0" type="text" @click="toDetail(scope.row)">
                        <span style="color: #1b89bd;">[{{getBizTypeText(scope.row.businessType)}}]</span>
                        <span class="fontFFF">{{scope.row.actionType}}</span>
                        <span class="fontFFF">[{{formatTime(scope.row.createTime)}}]</span>
                        <span class="fontFFF isMessage" style="position: relative;" v-if="scope.row.msgStatus === 0">[未读]</span>
                        <span class="fontFFF" v-if="scope.row.msgStatus === 1">[已读]</span>
                      </el-button>
                      <el-button v-if="bizType > 0" type="text" @click="toDetail(scope.row)">
                        <span style="color: #1b89bd;">[{{getBizTypeText(scope.row.business_type)}}]</span>
                        <span class="fontFFF">{{scope.row.action_type}}</span>
                        <span class="fontFFF">[{{formatTime(scope.row.create_time)}}]</span>
                        <span class="fontFFF isMessage" style="position: relative;" v-if="scope.row.msg_status === 0">[未读]</span>
                        <span class="fontFFF" v-if="scope.row.msg_status === 1">[已读]</span>
                      </el-button>
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                      <el-button type="primary" @click="updMessage(scope.row.id, 2)"><i class="el-icon-delete"></i>删除
                      </el-button>
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
            <el-button type="primary" @click="batchUpdMessage(2)"><i class="el-icon-delete"></i>删除</el-button>
            <el-button type="primary" @click="batchUpdMessage(1)"><i class="el-icon-message"></i>已读</el-button>
            <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                           :page-size="pageSize" :total="total" :current-page="page" style="float:right; padding-bottom: 20px;">
            </el-pagination>
          </div>

        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script>
import {
  getMessagesPage, getMessagesUpd, getBatchMessagesUpd
} from '@/api/messages'

export default {
  name: 'Messages',
  data() {
    return {
      loading: false,
      checkAll: false,
      isIndeterminate: false,
      showHeader: false,
      curIndex: 0,
      dataList: [],
      tabList: [
        {
          title: '全部', type: 0
        },
        {
          title: '案件认领', type: 1
        },
        {
          title: '案件督办', type: 3
        },
        {
          title: '全国协查', type: 4
        },
        {
          title: '案件协查', type: 5
        },
        {
          title: '专项任务', type: 6
        },
        {
          title: '情报线索', type: 7
        }
      ],
      multipleSelection: [],
      total: 0,
      pageSize: 15,
      page: 1,
      curDept: {},
      bizType: 0,
      tableHeight: document.documentElement.clientHeight - 300
    }
  },
  methods: {
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
    queryData() {
      this.loading = true
      this.dataList = []
      this.checkAll = false
      this.isIndeterminate = false
      getMessagesPage({
        type: this.bizType,
        pageNum: this.page,
        pageSize: this.pageSize,
        deptId: this.curDept.id
      }).then((res) => {
        this.loading = false
        if (res.code === '000000' && res.data) {
          this.dataList = res.data.list
          this.total = res.data.totalCount
          this.pageSize = res.data.pageSize
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
      this.updMessage(row.id, 1)
      let uri = ''
      if (row.business_type === 1) {
        uri = '/caseManage/detail/' + row.business_id
      }
      if (row.business_type === 3) {
        uri = '/caseManage/dbdetail/' + row.business_id
      }
      if (row.business_type === 4) {
        uri = '/caseManage/investigation/detail/' + row.business_id
      }
      if (row.business_type === 5) {
        uri = '/caseAssist/detail/' + row.business_id
      }
      if (row.business_type === 6) {
        uri = '/specialTasks/total/'
      }
      if (row.business_type === 7) {
        uri = '/intellSystem/edit/' + row.business_id
      }
      this.$router.push({
        path: uri
      })
    },
    updMessage(id, status) {
      this.loading = true
      getMessagesUpd({
        id: id,
        status: status
      }).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          if (status === 2) {
            this.$message({
              message: '操作成功', type: 'success'
            })
          }
          this.queryData()
        }
      })
    },
    batchUpdMessage(type) {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请勾选信息', type: 'warning'
        })
        return false
      }
      const params = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        params.push({
          id: this.multipleSelection[i]['id'], status: type
        })
      }
      this.loading = true
      getBatchMessagesUpd({
        params: params
      }).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.$message({
            message: '操作成功', type: 'success'
          })
          this.queryData()
        }
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.curDept) {
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
