<template>
  <section class="noticeMessageList">
    <el-form :inline="true" :model="filters" label-width="80px">
        <el-form-item label="接收人">
          <el-select v-model="filters.recipientId" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDeptUser_receive" :loading="depUserLoading_receive">
            <el-option v-for="item in deptUserList_receive" :key="item.index" :value="item.id" :label="'（' + item.userName + '）' + item.realName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="query(true)" v-if="$isViewBtn('159001')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="resetFrom" >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="add()" v-if="
          ('159002')">发消息</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="list" ref="multipleTable" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column label="标题" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.title" class="ellipsis-word" @click="handleDetail(scope.$index, scope.row)" style="cursor: pointer; text-decoration: underline">{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.content" class="ellipsis-word" style="cursor: pointer;">{{scope.row.content}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="接收人" width="200">
        <template slot-scope="scope">
          <p :title="scope.row.allName" class="ellipsis-word">{{scope.row.firstName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="creatorDate" label="发布时间" width="200"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="复制" v-if="$isViewBtn('159002')" size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">复制</el-button>
          <el-button title="删除" v-if="$isViewBtn('159003')"  size="small" type="primary" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-row>
      <el-col :span="4" style="padding-left: 14px; padding-top: 10px;">
        <el-checkbox v-model="checkBox" @change="checkBoxChange">全选</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button v-if="$isViewBtn('159003')" title="删除" size="small" type="primary" class="disabledBtn" @click="batchDelete" :disabled="multipleSelection.length === 0">批量删除</el-button>
      </el-col>
      <el-col :span="20" class="toolbar">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :current-page="page" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog title="发送消息" :visible.sync="addDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="add_dialog" @close="closeDialog">
      <el-form :model="addForm" ref="addForm" :rules="addRules" v-loading="addBtnLoading" label-width="90px" style="margin-top: 15px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" maxlength="50" size="small" placeholder="最多可输入500个字符！"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" type="textarea" maxlength="200" size="small" placeholder="最多可输入200个字符！" class="add_content"></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="recipientUser">
          <el-transfer
            ref="transfer"
            v-model="addForm.recipientUser"
            :titles="['人员名称', '人员名称']"
            filterable
            :filter-method="filterMethod"
            :left-default-checked="leftCheck"
            :right-default-checked="rightCheck"
            :data="transferLXRData"></el-transfer>
          <!--<el-select v-model="addForm.recipient" clearable filterable multiple remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDeptUser" :loading="depUserLoading" style="width: 100%;">-->
            <!--<el-option v-for="item in deptUserList" :key="item.index" :value="item.id" :label="item.realName"></el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit" class="cancelBtn">取 消</el-button>
        <el-button type="primary" class="saveBtn" @click="onSubmit()" :loading="addBtnLoading">发 送</el-button>
        <!--遮罩整个页面的-->
        <!--<el-button type="primary" class="saveBtn" @click="onSubmit()" v-loading.fullscreen.lock="addBtnLoading">发 送</el-button>-->
      </div>
    </el-dialog>

    <el-dialog :title="detailRow.title" :visible.sync="dialogVisible" :close-on-click-modal="false" class="detail_dialog" @close="closeDialog">
      <el-form :model="detailRow" label-width="100px" style="padding-left: 20px; padding-right: 15px;" v-loading="dialogLoading">
        <el-form-item label="消息内容"><span class="break-word">{{detailRow.content}}</span></el-form-item>
        <el-form-item label="发送时间">{{detailRow.creatorDate}}</el-form-item>
        <el-form-item label="接收人"><span class="break-word">{{detailRow.allName}}</span></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  export default {
    name: 'list',
    data() {
      return {
        dialogVisible: false,
        dialogLoading: false,
        detailRow: {
          title: '',
          content: ''
        },
        checkBox: false,
        filters: {
          recipientId: '',
          time: ''
        },
        depUserLoading_receive: false,
        deptUserList_receive: [],
        depUserLoading: false,
        deptUserList: [],
        lXRData: [],
        transferLXRData: [],
        addBtnLoading: false,
        addDialogVisible: false,
        addForm: {
          title: '',
          content: '',
          recipientUser: [],
          recipient: ''
        },
        addRules: {
          title: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regEnCode = this.$regCode
              const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入标题'))
              } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                callback(new Error('标题不能输入特殊字符'))
              } else if (value.length > 50) {
                callback(new Error('标题长度不能超过 50个字符'))
              } else {
                return callback()
              }
            }
          }],
          content: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('请输入消息内容！'))
              }
              if (value.length > 200) {
                return callback(new Error('消息内容最多可输入200个字符！'))
              }
              return callback()
            }
          }],
          recipientUser: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value.length === 0) {
                return callback(new Error('请选择接收人'))
              }
              return callback()
            }
          }]
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        list: [],
        tableHeight: null,
        curUser: {},
        curDept: {},
        multipleSelection: [],
        checkFlag: this.$isViewBtn('149007'),
        leftCheck: [],
        rightCheck: []
      }
    },
    methods: {
      showUserName(remark, flag) {
        if (remark === undefined || remark === null || remark === '') {
          return ''
        }
        let names = ''
        const arr = remark.split(',')
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          names += item.split('_')[1]
          if (!flag) {
            break
          }
          if (i < arr.length - 1) {
            names += '，'
          }
        }
        return names
      },
      handleDetail: function(index, row) {
        this.detailRow = row
        this.dialogVisible = true
      },
      handleEdit: function(index, row) {
        this.addDialogVisible = true
        this.addForm = {
          title: row.title,
          content: row.content,
          recipientUser: []
        }
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = {
            messagesId: [row.id],
            userId: this.curUser.id
          }
          this.$update('message/delete', para).then((response) => {
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
      batchDelete() {
        if (this.multipleSelection.length === 0) {
          this.$alert('请勾选需要删除的记录', '提示')
          return false
        }
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const item = this.multipleSelection[i]
          ids.push(item.id)
        }
        const para = {
          messagesId: ids,
          userId: this.curUser.id
        }
        this.$update('message/delete', para).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query()
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
      resetFrom() {
        this.filters = {
          recipientId: '',
          time: ''
        }
      },
      query(flag) {
        this.listLoading = true
        if (flag) {
          this.page = 1
        }
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          checkFlag: this.checkFlag,
          userId: this.curUser.id,
          startTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00') : '',
          endTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59') : ''
        }
        for (let i = 0; i < this.lXRData.length; i++) {
          const item = this.lXRData[i]
          if (item.id === this.filters.recipientId) {
            para.name = item.id + '_' + item.realName
            break
          }
        }
        this.$query('message/query', para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i]
            item.firstName = this.showUserName(item.remark)
            item.allName = this.showUserName(item.remark, true)
          }
          this.list = data.list
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      closeDialog() {
        this.dialogVisible = false
        this.addDialogVisible = false
        this.addForm = {
          title: '',
          content: '',
          recipientUser: []
        }
        if (this.$refs.addForm) {
          this.$refs.addForm.resetFields()
        }
        if (this.$refs.transfer) {
          this.$refs.transfer.clearQuery('left')
          this.$refs.transfer.clearQuery('right')
          this.$refs.transfer.$children['0']._data.checked = []
          this.$refs.transfer.$children['2']._data.checked = []
        }
      },
      add() {
        this.addDialogVisible = true
        this.addForm = {
          title: '',
          content: '',
          recipientUser: []
        }
        this.checkLXR()
      },
      cancelEdit() {
        this.$confirm('是否放弃当前编辑的通知信息？', '提示', {
          type: 'warning',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
          this.closeDialog()
        })
      },
      onSubmit() {
        this.addBtnLoading = true
        this.$refs.addForm.validate(valid => {
          if (valid) {
            if (this.addForm.recipientUser.length > 20) {
              this.$message({
                message: '消息发送一次最多不能超过20人',
                type: 'warning'
              })
              this.addBtnLoading = false
              return false
            }
            const data = []
            for (let i = 0; i < this.lXRData.length; i++) {
              const item = this.lXRData[i]
              for (let j = 0; j < this.addForm.recipientUser.length; j++) {
                const userId = this.addForm.recipientUser[j]
                if (item.id === userId) {
                  data.push({ id: item.id, name: item.realName })
                }
              }
            }
            this.addForm.recipient = JSON.stringify(data)
            this.addForm.userId = this.curUser.id
            this.addForm.userName = this.curUser.realName
            this.addForm.curDeptId = this.curDept.id
            this.addForm.curDeptName = this.curDept.depName
            this.addForm.curDeptCode = this.curDept.depCode
            this.$save('message/send', this.addForm).then(response => {
              this.$message({
                message: '消息发送成功！',
                type: 'success'
              })
              const _this = this
              setTimeout(function() {
                _this.addBtnLoading = false
                _this.query()
                _this.closeDialog()
              }, 2000)
            }).catch(() => {
              this.addBtnLoading = false
            })
          } else {
            this.addBtnLoading = false
          }
        })
      },
      remoteMethodDeptUser_receive(query) {
        if (query !== '') {
          const para = {}
          para.name = query
          para.departCode = this.curDept.depCode
          this.$query('departuser', para, true).then(response => {
            this.deptUserList_receive = response.data
          })
        } else {
          this.deptUserList_receive = []
        }
      },
      remoteMethodDeptUser(query) {
        if (query !== '') {
          const para = {}
          para.name = query
          this.$query('departuser', para, true).then(response => {
            this.deptUserList = response.data
          })
        } else {
          this.deptUserList = []
        }
      },
      handleSelectionChange(val) {
        // val 为整个{}
        this.multipleSelection = val
      },
      checkBoxChange(value) {
        if (value) {
          this.toggleSelection(true)
        } else {
          this.toggleSelection(false)
        }
      },
      toggleSelection(status) {
        for (let i = 0; i < this.list.length; i++) {
          this.$refs.multipleTable.toggleRowSelection(this.list[i], status)
        }
        // this.$refs.multipleTable.clearSelection()
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      checkLXR() {
        this.$query('departuser', {}, true).then(response => {
          this.lXRData = response.data
          const tData = []
          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i]
            tData.push({ label: '（' + item.userName + '）' + item.realName, key: item.id })
          }
          this.transferLXRData = tData
        })
      },
      clear() {
        if (this.filters.recipientId === '') {
          this.deptUserList_receive = []
        }
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.checkLXR()
      this.query()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style>
  .noticeMessageList .el-dialog__body{
    padding: 10px 25px 0;
  }
  .noticeMessageList .el-dialog__footer{
    padding: 10px 25px 20px;
  }
  .noticeMessageList .add_content {
    margin-bottom: 10px;
  }
  .noticeMessageList p{
    margin-bottom: 0;
  }
  .noticeMessageList .el-transfer-panel{
    width: 43%;
  }
  .noticeMessageList .detail_dialog .break-word{
    word-wrap: break-word;
    word-break: break-all;
  }
  .noticeMessageList .disabledBtn.el-button--primary.is-disabled, .noticeMessageList .disabledBtn.el-button--primary.is-disabled:hover{
    background-color: rgb(3, 94, 151);
    color: #bbb;
    border-color: #ccc;
  }
  @media screen and (min-width: 1700px) and (max-width: 1920px) {
    .noticeMessageList .el-transfer-panel {
      width: 44%;
    }
  }
  @media screen and (min-width: 1280px) and (max-width: 1599px) {
    .noticeMessageList .el-transfer-panel {
      width: 41%;
    }
    .noticeMessageList .el-dialog{
      width: 55%;
    }
  }
  @media screen and (min-width: 1152px) and (max-width: 1279px) {
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 43%;
    }
    .noticeMessageList .el-dialog{
      width: 60%;
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1151px) {
    .noticeMessageList .el-transfer-panel {
      width: 42%;
    }
    .noticeMessageList .el-dialog{
      width: 70%;
    }
  }
  @media screen and (max-width: 1023px) {
    .noticeMessageList .el-transfer-panel {
      width: 40%;
    }
    .noticeMessageList .el-dialog{
      width: 75%;
    }
  }
</style>
