<template>
  <section class="groupList">
    <el-form :inline="true" :model="filterQuery" size="small"  label-width="76px">
      <el-row>
        <el-col style="text-align:center">
        <el-form-item>
          <el-input size="large" placeholder="请输入关键字进行检索" v-model="filterQuery.keywords" style="width:700px;margin:0 auto;" @keydown.enter.native="searchFun">
            <el-button slot="append" v-on:click="queryGroup(true)" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 30px;background-color: #1e98d2;"></el-button>
          </el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="text-align:right">
          <el-form-item>
            <el-button class="addBtn" type="primary" @click="setReceive">设置通知消息接收人</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="addBtn" type="primary" icon="el-icon-plus" @click="toAdd">添加组</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="groupName" label="组名" min-width="200">
        <template slot-scope="scope">
          <span :title="scope.row.groupName" class="ellipsis-word">{{scope.row.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" label="组成员" min-width="150"  ></el-table-column>
      <el-table-column prop="createTime" label="建组时间" min-width="150">
        <template slot-scope="scope"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="说明" min-width="200">
        <template slot-scope="scope">
          <span :title="scope.row.desc" class="ellipsis-word">{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" icon="el-icon-document" circle @click="handleDetail(scope.row)"></el-button>
          <el-button title="修改" v-if="String(scope.row.type) === '2'" size="mini" type="primary" icon="el-icon-edit" circle @click="toNoticeEdit(scope.row)"></el-button>
          <el-button title="删除" size="mini" type="primary" icon="el-icon-delete"  circle  @click="handleDel(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[15,30,50,100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :page-size="pageSize" :total="total" :current-page="page" style="float:right;" ></el-pagination>
    </el-col>
    <el-dialog :title="(opType === 0 ? '添加常用组' : (opType === 1 ? '编辑常用组' : '常用组详情'))" :visible.sync="groupDialogVisible" :close-on-click-modal="false" class="group_dialog" @close="handleCloseDialog">
      <noticeGroupEdit ref="noticeGroupEdit" @closeDialog="closeDialog" :opType="opType" :groupId="groupId"></noticeGroupEdit>
    </el-dialog>
    <el-dialog title="设置通知消息接收人" :visible.sync="setReceiveDialogVisible" :close-on-click-modal="false" class="receive_dialog">
      <el-form :model="receiveForm" ref="receiveForm" :rules="rules" v-loading="setReceiveLoading" label-width="80px">
        <el-form-item label="接收人" prop="receiveUser">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="receiveForm.receiveUser" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in receiveUserList" :key="item.key" :label="item.id" :title="'(' + item.userName + ')' + item.realName">{{'(' + item.userName + ')' + item.realName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="btn" style="text-align: center">
          <el-button @click="cancelEdit" class="cancelBtn">取 消</el-button>
          <el-button type="primary" class="saveBtn" @click="onSubmit()" :loading="setReceiveBtnLoading">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
  import noticeGroupEdit from '@/views/notice/noticeGroupEdit'
  export default {
    data() {
      return {
        loading: false, // 列表loading
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
        deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
        filterQuery: {
          keywords: ''
        },
        listData: [],
        pageSize: 15,
        page: 1,
        total: 0,
        tableHeight: null,
        groupDialogVisible: false,
        opType: 0,
        groupId: '',
        isIndeterminate: false,
        checkAll: false,
        receiveUserList: [],
        setReceiveDialogVisible: false,
        setReceiveLoading: false,
        setReceiveBtnLoading: false,
        receiveForm: {
          receiveUser: []
        },
        rules: {
          receiveUser: [{ required: true, trigger: 'blur', message: '请选择接收人' }]
        },
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
        curUser: JSON.parse(sessionStorage.getItem('userInfo'))
      }
    },
    methods: {
      searchFun(e) {
        const keyCode = window.event ? e.keyCode : e.which
        if (keyCode === 13) {
          this.page = 1
          this.queryGroup()
        }
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.queryGroup(false, true)
      },
      handleCurrentChange(val) {
        this.page = val
        this.queryGroup(false, true)
      },
      changeKeyWords(val) {
        this.queryGroup(true, true)
      },
      closeDialog() {
        this.groupDialogVisible = false
        if (this.opType !== 2) {
          this.queryGroup()
        }
        this.$refs.noticeGroupEdit.clear()
      },
      handleCloseDialog() {
        this.groupDialogVisible = false
        this.$refs.noticeGroupEdit.clear()
      },
      queryGroup(flag, hand) {
        this.loading = true
        this.page = flag ? 1 : this.page
        const param = {
          keywords: this.filterQuery.keywords,
          pageNum: this.page,
          pageSize: this.pageSize,
          creatorId: this.userInfo.id,
          deptCode: this.deptInfo.depCode
        }
        if (hand) {
          param.logFlag = 1 // 是否写日志
        }
        this.$query('group/groupinfopage', param).then(response => {
          this.loading = false
          // 去除HTML标签

          this.listData = response.data.list
          this.pageSize = response.data.pageSize
          this.page = response.data.pageNum
          this.total = response.data.totalCount
        }).catch(() => {
          this.loading = false
        })
      },
      clearForm() {
        this.filterQuery.keywords = ''
        this.queryGroup(true, true)
      },
      toAdd() {
        this.opType = 0
        this.groupDialogVisible = true
        if (this.$refs.noticeGroupEdit) {
          this.$refs.noticeGroupEdit.clear()
          this.$refs.noticeGroupEdit.queryDept()
        }
      },
      toNoticeEdit(row) {
        this.groupId = row.groupId
        this.opType = 1
        this.groupDialogVisible = true
        if (this.$refs.noticeGroupEdit) {
          this.$refs.noticeGroupEdit.queryDept()
          this.$refs.noticeGroupEdit.detail(this.groupId)
        }
      },
      handleDetail(row) {
        this.groupId = row.groupId
        this.opType = 2
        this.groupDialogVisible = true
        if (this.$refs.noticeGroupEdit) {
          this.$refs.noticeGroupEdit.detail(this.groupId)
        }
      },
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = {
            groupId: row.groupId,
            delFlag: 1
          }
          this.$query('group/delgroup', para).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.page = 1
            this.queryGroup()
          })
        }).catch(() => {
        })
      },
      setReceive() {
        this.setReceiveDialogVisible = true
        this.setReceiveLoading = true
        const para = {
          curDeptCode: this.curDept.depCode
        }
        this.$query('mreplace/query', para).then(response => {
          const arr = []
          if (response.data.replaceIds !== undefined && response.data.replaceIds !== null && response.data.replaceIds !== '') {
            const replaceIds = JSON.parse(response.data.replaceIds)
            for (let j = 0; j < replaceIds.length; j++) {
              const item = replaceIds[j]
              arr.push(item.id)
            }
            this.receiveForm.receiveUser = arr
            if (this.receiveForm.receiveUser.length > 0) {
              this.isIndeterminate = true
            }
          }
          this.setReceiveLoading = false
        }).catch(() => {
          this.setReceiveLoading = false
        })
      },
      cancelEdit() {
        this.$confirm('是否要放弃当前设置的通知消息接收人信息？', '提示', {
          type: 'warning',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
          this.callBack()
        })
      },
      callBack() {
        this.setReceiveDialogVisible = false
        this.receiveForm = {
          receiveUser: []
        }
      },
      onSubmit() {
        this.setReceiveLoading = true
        this.setReceiveBtnLoading = true
        this.$refs.receiveForm.validate(valid => {
          if (valid) {
            const arr = []
            for (let j = 0; j < this.receiveUserList.length; j++) {
              const item = this.receiveUserList[j]
              if (this.receiveForm.receiveUser.indexOf(item.id) > -1) {
                arr.push(item)
              }
            }
            const para = {
              curDeptId: this.curDept.id,
              curDeptCode: this.curDept.depCode,
              userId: this.curUser.id,
              replaceIds: JSON.stringify(arr)
            }
            this.$update('mreplace/save', para).then(response => {
              this.timeOutBack()
              this.$message({
                message: '通知消息接收人设置成功！',
                type: 'success'
              })
            }).catch(() => {
              this.setReceiveLoading = false
              this.setReceiveBtnLoading = false
            })
          } else {
            this.setReceiveLoading = false
            this.setReceiveBtnLoading = false
          }
        })
      },
      timeOutBack() {
        const _this = this
        setTimeout(function() {
          _this.setReceiveLoading = false
          _this.setReceiveBtnLoading = false
          _this.callBack()
        }, 2000)
      },
      getReceiveUserList() {
        const para = {
          thisDepartCode: this.curDept.depCode
        }
        this.$query('departuserrole', para, true).then(response => {
          if (response.data.length === 0) {
            this.$alert('未查询到当前部门下的普通用户', '提示', {
              callback: action => {
                this.callBack()
              }
            })
          } else {
            this.receiveUserList = response.data
          }
        })
      },
      handleCheckAllChange(val) {
        if (val) {
          const arr = []
          for (let i = 0; i < this.receiveUserList.length; i++) {
            arr.push(this.receiveUserList[i].id)
          }
          this.receiveForm.receiveUser = arr
        } else {
          this.receiveForm.receiveUser = []
        }
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.receiveUserList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.receiveUserList.length
      }
    },
    components: {
      noticeGroupEdit
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.queryGroup(true)
      this.getReceiveUserList()
    },
    activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>
<style>
.groupList .addBtn {
  float: right;
}
.groupList .noticeGroupEdit{
  padding: 0 30px;
}
.groupList .noticeGroupEdit .el-col-18{
  width: 100%;
}
.groupList .el-dialog__header{
  text-align: center;
}
.groupList .noticeGroupEdit .btn{
  text-align: right;
  width: 100%;
  padding-right: 0;
  margin-bottom: 0;
}
.groupList .el-dialog{
  width: 57%;
}
.groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
  width: 44%;
}
.groupList .receive_dialog .el-checkbox{
  margin-left: 30px;
  min-width: 200px;
}
.groupList .receive_dialog .el-checkbox__label{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 180px;
  position: absolute;
  top: 6px;
}
.groupList .receive_dialog .el-checkbox-group{
  overflow: auto;
  max-height: 450px;
}
.groupList .receive_dialog .el-dialog__body{
  padding: 20px 25px 10px;
}
@media screen and (min-width: 1700px) and (max-width: 1920px) {
  .groupList .noticeCard .el-transfer-panel {
    width: 45%;
  }
  .groupList .group{
    left: 46%;
  }
  .groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
    width: 45%;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1599px) {
  .groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
    width: 42%;
  }
}
@media screen and (min-width: 1152px) and (max-width: 1279px) {
  .groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
    width: 43%;
  }
  .groupList .el-dialog{
    width: 70%;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1151px) {
  .groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
    width: 41%;
  }
  .groupList .el-dialog{
    width: 70%;
  }
}
@media screen and (max-width: 1023px) {
  .groupList .noticeGroupEdit .el-transfer-panel, .groupList .noticeGroupEdit .transfer .el-input__inner {
    width: 39%;
  }
  .groupList .el-dialog{
    width: 75%;
  }
}
</style>
