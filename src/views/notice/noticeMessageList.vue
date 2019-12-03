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
          <el-button type="primary" v-on:click="add()" v-if="$isViewBtn('159002')">发消息</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="list" ref="multipleTable" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="8%" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<p :title="scope.row.title" class="ellipsis-word" @click="handleDetail(scope.$index, scope.row)" style="cursor: pointer; text-decoration: underline">{{scope.row.title}}</p>-->
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="8%" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<p :title="scope.row.content" class="ellipsis-word" style="cursor: pointer;">{{scope.row.content}}</p>-->
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allName" label="接收人" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<p :title="scope.row.allName" class="ellipsis-word">{{scope.row.firstName}}</p>-->
          <span>{{scope.row.firstName}}</span>
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
          <el-input v-model="addForm.title" maxlength="50" size="small" placeholder="最多可输入50个字符！"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" type="textarea" maxlength="500" size="small" placeholder="最多可输入500个字符！" class="add_content"></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="recipientUser" class="transfer">
          <el-radio-group v-model="addForm.sendType" @change="radioChange">
            <el-radio label="1">选人</el-radio>
            <el-radio label="2">选组</el-radio>
          </el-radio-group><br>
          <el-input v-model="searchKey" maxlength="50" size="small" placeholder="请输入关键字" @input="searchKeyChange"></el-input>
          <el-transfer
            ref="transfer"
            v-loading="transferLoading"
            v-model="addForm.recipientUser"
            :titles="title"
            :left-default-checked="leftCheck"
            :right-default-checked="rightCheck"
            :filterable="true"
            :filter-method="filterMethod"
            filter-placeholder="模糊匹配"
            @change="transferChange"
            :data="transferLXRData"></el-transfer>
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

    <el-dialog title="设置常用组" :visible.sync="groupDialogVisible" :close-on-click-modal="false" class="group_dialog" @close="closeDialog">
      <el-form :model="noticeGroupForm" ref="noticeGroupForm" :rules="rules" v-loading="groupLoading" label-width="100px">
        <el-form-item label="组名" prop="groupName">
          <el-input v-model="noticeGroupForm.groupName" auto-complete="off" clearable maxlength="20" v-loading="titleLoading"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="noticeGroupForm.desc" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个字符！"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">取 消</el-button>
        <el-button type="primary" class="saveBtn" @click="groupSubmit()" :loading="groupLoading">保 存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  export default {
    name: 'list',
    data() {
      return {
        title: ['人员名称', '人员名称'],
        transferLoading: false,
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
        searchKey: '',
        addForm: {
          title: '',
          content: '',
          recipientUser: [],
          sendType: '1',
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
              if (value.length > 500) {
                return callback(new Error('消息内容最多可输入500个字符！'))
              }
              return callback()
            }
          }],
          recipientUser: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (this.addForm.recipientUser === undefined || this.addForm.recipientUser === null || this.addForm.recipientUser.length === 0) {
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
        leftCheck: [],
        rightCheck: [],
        groupDialogVisible: false,
        groupLoading: false,
        noticeGroupForm: {
          groupName: '',
          desc: '',
          receiveDept: [],
          type: 1
        },
        titleLoading: false,
        rules: {
          groupName: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regCnName = this.$regCnName
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入组名'))
              } else if (value.length > 0 && (!regCnName.test(value))) {
                callback(new Error('组名只能输入汉字'))
              } else if (value.length > 20) {
                callback(new Error('组名长度不能超过 20个字符'))
              } else {
                return this.titleCheckAsyns(callback)
              }
            }
          }]
        }
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        this.titleLoading = true
        // 同步处理
        const response = await this.$updateAsyns('group/checkGroupNameRepeat', { groupName: this.noticeGroupForm.groupName, creatorId: this.curUser.id })
        const data = response.data
        if (this.id !== '') {
          if (data.type !== 1) {
            callback = callback()
          } else {
            callback = callback(Error('组名不能重复'))
          }
        } else {
          if (data.type !== 1) {
            callback = callback()
          } else {
            callback = callback(Error('组名不能重复'))
          }
        }
        this.titleLoading = false
        return callback
      },
      radioChange(val) {
        this.transferLoading = true
        this.addForm.recipientUser = []
        if (val === '2') {
          this.checkCYLXR()
          this.title = ['常用联系人组', '常用联系人组']
        } else if (val === '1') {
          this.checkLXR(this.curDept.depCode)
          this.title = ['人员名称', '人员名称']
        }
      },
      checkCYLXR() {
        // 调用查询常用联系人接口
        this.$query('group/groupinfo', { creatorId: this.curUser.id, deptCode: this.curDept.depCode, type: 1 }).then(response => {
          if (response.data === null || response.data === undefined || response.data.length === 0) {
            // 没有常用联系人
          } else {
            this.lXRData = response.data
            const tData = []
            for (let i = 0; i < response.data.length; i++) {
              const item = response.data[i]
              tData.push({ label: item.groupName, key: item.groupId })
            }
            this.transferLXRData = tData
          }
          this.transferLoading = false
        })
      },
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
          sendType: '1',
          recipientUser: []
        }
        this.searchKey = ''
        this.checkLXR(this.curDept.depCode)
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
        this.groupDialogVisible = false
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
          sendType: '1',
          recipientUser: []
        }
        this.searchKey = ''
        this.checkLXR(this.curDept.depCode)
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
            if (this.addForm.sendType === '2' && this.addForm.recipientUser.length > 1) {
              this.$message({
                message: '消息发送只能选择一个组',
                type: 'warning'
              })
              this.addBtnLoading = false
              return false
            }
            if (this.addForm.sendType === '1' && this.addForm.recipientUser.length > 50) {
              this.$message({
                message: '消息发送一次最多不能超过50人',
                type: 'warning'
              })
              this.addBtnLoading = false
              return false
            }
            const data = []
            if (this.addForm.sendType === '2') {
              for (let i = 0; i < this.lXRData.length; i++) {
                const item = this.lXRData[i]
                for (let j = 0; j < this.addForm.recipientUser.length; j++) {
                  const userId = this.addForm.recipientUser[j]
                  if (item.id === userId) {
                    for (let k = 0; k < item.detail.length; k++) {
                      const detailItem = item.detail[k]
                      data.push({ id: detailItem.id, name: detailItem.realName })
                    }
                  }
                }
              }
            } else if (this.addForm.sendType === '1') {
              for (let i = 0; i < this.lXRData.length; i++) {
                const item = this.lXRData[i]
                for (let j = 0; j < this.addForm.recipientUser.length; j++) {
                  const userId = this.addForm.recipientUser[j]
                  if (item.id === userId) {
                    data.push({ id: item.id, name: item.realName })
                  }
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
              if (this.addForm.sendType === '1') {
                this.closeDialog()
                this.$confirm('是否需要将当前消息的接收人设定为常用联系人组？', '提示', {
                  type: 'warning',
                  cancelButtonText: '否',
                  confirmButtonText: '是'
                }).then(() => {
                  this.noticeGroupForm.receiveDept = data
                  this.groupDialogVisible = true
                }).catch(() => {
                  this.query()
                  this.closeDialog()
                })
              } else {
                const _this = this
                setTimeout(function() {
                  _this.addBtnLoading = false
                  _this.query()
                  _this.closeDialog()
                }, 2000)
              }
            }).catch(() => {
              this.addBtnLoading = false
            })
          } else {
            this.addBtnLoading = false
          }
        })
      },
      groupSubmit() {
        this.groupLoading = true
        this.$refs.noticeGroupForm.validate(valid => {
          if (valid) {
            this.noticeGroupForm.creatorId = this.curUser.id
            this.noticeGroupForm.creatorName = this.curUser.realName
            this.noticeGroupForm.deptId = this.curDept.id
            this.noticeGroupForm.deptName = this.curDept.depName
            this.noticeGroupForm.deptCode = this.curDept.depCode
            this.noticeGroupForm.itemCount = this.noticeGroupForm.receiveDept.length
            this.noticeGroupForm.personList = this.noticeGroupForm.receiveDept
            this.$save('group', this.noticeGroupForm).then((response) => {
              const _this = this
              setTimeout(function() {
                _this.groupLoading = false
                _this.query()
                _this.closeDialog()
              }, 2000)
              this.$message({
                message: '常用联系人组保存成功！',
                type: 'success'
              })
            }).catch(() => {
              this.groupLoading = false
            })
          } else {
            this.groupLoading = false
            console.log('error submit!!')
            return false
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
      transferChange(value, direction, movedKeys) {
        this.$refs.addForm.validateField('recipientUser')
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      searchKeyChange(value) {
        if (value === undefined || value === null || value === '') {
          this.$refs.transfer.$children['0']._data.query = ''
          return
        }
        this.$refs.transfer.$children['0']._data.query = value
        if (this.addForm.sendType === '1') {
          this.$query('departuser', { type: 0, name: value }, true).then(response => {
            for (let i = 0; i < response.data.length; i++) {
              const item = response.data[i]
              let flag = true
              for (let j = 0; j < this.lXRData.length; j++) {
                const itemJ = this.lXRData[j]
                if (item.userName === itemJ.userName) {
                  flag = false
                  break
                }
              }
              if (flag) {
                this.lXRData.unshift(item)
                this.transferLXRData.unshift({ label: '（' + item.userName + '）' + item.realName, key: item.id })
              }
            }
          })
        }
      },
      async queryLXR(query) {
        const response = await this.$queryAsyns('departuser', { type: 0, name: query }, true)
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i]
          this.lXRData.push(item)
          this.transferLXRData.push({ label: '（' + item.userName + '）' + item.realName, key: item.id })
        }
      },
      checkLXR(departCode) {
        this.$query('departuser', { type: 0, departCode: departCode }, true).then(response => {
          this.lXRData = response.data
          const tData = []
          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i]
            tData.push({ label: '（' + item.userName + '）' + item.realName, key: item.id })
          }
          this.transferLXRData = tData
          this.transferLoading = false
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
  .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner{
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
  .noticeMessageList .group_dialog .el-dialog{
    width: 40%;
  }
  .noticeMessageList .add_dialog .el-transfer-panel__filter.el-input.el-input--small.el-input--prefix {
    display: none;
  }
  .noticeMessageList .add_dialog .el-transfer-panel__list.is-filterable{
    height: 100%;
    padding-top: 6px;
  }
  .noticeMessageList .add_dialog .transfer.is-error .el-transfer-panel {
    border-color: #f56c6c;
  }
  .noticeMessageList .add_dialog .transfer.is-success .el-transfer-panel {
    border-color: #67c23a;
  }
  .noticeMessageList .add_dialog .transfer.is-success .el-input__inner, .noticeMessageList .add_dialog .transfer.is-error .el-input__inner{
    border: 1px solid #00a0e9;
  }
  @media screen and (min-width: 1700px) and (max-width: 1920px) {
    .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner {
      width: 44%;
    }
  }
  @media screen and (min-width: 1280px) and (max-width: 1599px) {
    .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner {
      width: 41%;
    }
    .noticeMessageList .el-dialog{
      width: 55%;
    }
  }
  @media screen and (min-width: 1152px) and (max-width: 1279px) {
    .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner {
      width: 43%;
    }
    .noticeMessageList .el-dialog{
      width: 60%;
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1151px) {
    .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner {
      width: 42%;
    }
    .noticeMessageList .el-dialog{
      width: 70%;
    }
  }
  @media screen and (max-width: 1023px) {
    .noticeMessageList .el-transfer-panel, .noticeMessageList .transfer .el-input__inner {
      width: 40%;
    }
    .noticeMessageList .el-dialog{
      width: 75%;
    }
  }
</style>
