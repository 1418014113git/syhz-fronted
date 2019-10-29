<template>
  <section class="noticeList">
    <el-form :inline="true" :model="filters" label-width="80px">
      <el-row>
        <el-form-item label="标题">
          <el-input placeholder="请输入关键字" v-model="filters.title" clearable maxlength="50" style="width: 222px"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="filters.messageStatus" placeholder="请选择" clearable>
            <el-option label="未提交" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="签收状态">
          <el-select v-model="filters.signStatus" placeholder="请选择" clearable>
            <el-option label="未签收" value="1"></el-option>
            <el-option label="已签收" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="query(true)" v-if="$isViewBtn('149001')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="resetFrom">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="add()" v-if="$isViewBtn('149002')">发布通知</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column label="标题" min-width="8%">
        <template slot-scope="scope">
          <span :title="scope.row.title" class="ellipsis-word">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="8%">
        <template slot-scope="scope">
          <span class="ellipsis-word">{{scope.row.content.replace(/<\/?.+?>/g, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="200"></el-table-column>
      <el-table-column label="审核状态" width="150">
        <template slot-scope="scope">
          <span v-if="String(scope.row.messageStatus) === '0'">未提交</span>
          <span v-if="String(scope.row.messageStatus) === '1'">待审核</span>
          <span v-if="String(scope.row.messageStatus) === '2'">审核通过</span>
          <span v-if="String(scope.row.messageStatus) === '3'">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="签收状态" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.signStatus === undefined">-</span>
          <span v-else-if="(String(scope.row.messageStatus) === '1' && scope.row.creatorId !== curUser.id) || (scope.row.creatorId === curUser.id) || (String(scope.row.messageStatus) === '3')">-</span>
          <span v-else>
            <span v-if="String(scope.row.signStatus) === '1'">未签收</span>
            <span v-if="String(scope.row.signStatus) === '2'">已签收</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" v-if="$isViewBtn('149004')" @click="handleDetail(scope.$index, scope.row)" size="mini" type="primary" circle icon="el-icon-document"></el-button>
          <el-button title="编辑" v-if="$isViewBtn('149003') && scope.row.creatorId === curUser.id && String(scope.row.messageStatus) === '0'" @click="handleEdit(scope.$index, scope.row)" size="mini" type="primary" circle icon="el-icon-edit" ></el-button>
          <el-button title="签收" v-if="$isViewBtn('149007') && isSign(scope.row)" @click="handleReceive(scope.$index, scope.row)" size="mini" type="primary" circle icon="el-icon-edit-outline" ></el-button>
          <el-button title="审核" v-if="$isViewBtn('149005') && (String(scope.row.messageStatus) === '1')" @click="handleAudit(scope.$index, scope.row)" size="mini" type="primary" circle ><svg-icon icon-class="audit"></svg-icon></el-button>
          <el-button title="删除" v-if="$isViewBtn('149006') && scope.row.creatorId === curUser.id && (String(scope.row.messageStatus) === '0' || String(scope.row.messageStatus) === '1' || String(scope.row.messageStatus) === '3')"  @click="handleDel(scope.$index, scope.row)" size="mini" type="primary" circle icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="审核" :visible.sync="auditDialogVisible" :close-on-click-modal="false" class="audit_dialog" @close="closeDialog">
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="100px">
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model="auditForm.remark" type="textarea" maxlength="500" size="small" placeholder="最多可输入500个字符！"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="executeAudit('4')" class="cancelBtn" :loading="auditBtnLoading">不通过</el-button>
        <el-button type="primary" @click="executeAudit('3')" class="saveBtn" :loading="auditBtnLoading">通过</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  export default {
    name: 'list',
    data() {
      return {
        filters: {
          title: '',
          time: '',
          messageStatus: '',
          signStatus: ''
        },
        auditBtnLoading: false,
        auditDialogVisible: false,
        auditForm: {
          messageId: '',
          remark: ''
        },
        auditRules: {
          remark: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('请输入审核意见！'))
              }
              if (value.length > 500) {
                return callback(new Error('审核意见最多可输入500个字符！'))
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
        checkFlag: this.$isViewBtn('149007')
      }
    },
    methods: {
      isSign(row) {
        let flag = false
        const recArr = JSON.parse(row.recipient)
        for (let i = 0; i < recArr.length; i++) {
          const list = recArr[i].list
          for (let j = 0; j < list.length; j++) {
            const item = list[j]
            if (item === this.curDept.id) {
              flag = true
              break
            }
          }
        }
        const reFlag = String(row.messageStatus) === '2' && row.creatorId !== this.curUser.id && flag
        if (reFlag) {
          return String(row.signStatus) !== '2'
        }
        return reFlag
      },
      handleDetail: function(index, row) {
        this.$gotoid('/notice/detail', JSON.stringify({ id: row.messageId }))
      },
      handleEdit: function(index, row) {
        this.$gotoid('/notice/edit', JSON.stringify({ id: row.messageId }))
      },
      handleReceive: function(index, row) {
        this.$gotoid('/notice/detail', JSON.stringify({ id: row.messageId }))
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = {
            id: row.messageId,
            creatorId: this.curUser.id
          }
          this.$update('notice/delete', para).then((response) => {
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
      handleAudit: function(index, row) {
        this.auditDialogVisible = true
        this.auditForm.messageId = row.messageId
        this.auditForm.remark = ''
      },
      closeDialog() {
        this.auditDialogVisible = false
        this.auditForm = {
          remark: ''
        }
        if (this.$refs.auditForm) {
          this.$refs.auditForm.resetFields()
        }
      },
      executeAudit(auditStatus) {
        this.auditBtnLoading = true
        if (auditStatus === '3' && this.auditForm.remark === '') {
          this.auditForm.remark = '审核通过'
        }
        this.$refs.auditForm.validate(valid => {
          if (valid) {
            this.$update('/notice/examineInfo', { id: this.auditForm.messageId, curDeptId: this.curDept.id }).then(response => {
              // 调用审核接口
              const para = {
                noticeId: this.auditForm.messageId,
                content: this.auditForm.remark,
                flowId: response.data[0].flowId,
                wdId: response.data[0].wdId,
                userName: this.curUser.realName,
                flowStatus: auditStatus,
                userId: this.curUser.id,
                curDeptCode: this.curDept.depCode,
                curDeptName: this.curDept.depName
              }
              this.$update('/notice/examineSubmit', para).then(response => {
                this.$message({
                  message: '审核成功',
                  type: 'success'
                })
                this.auditBtnLoading = false
                this.auditDialogVisible = false
                this.auditForm = {
                  auditId: '',
                  remark: '',
                  workId: '',
                  userId: '',
                  title: ''
                }
                this.query()
              }).catch(() => {
                this.auditBtnLoading = false
              })
            })
          } else {
            this.auditBtnLoading = false
          }
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
          title: '',
          date: '',
          auditStatus: '',
          signStatus: ''
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
          title: this.filters.title,
          checkFlag: this.checkFlag,
          messageStatus: this.filters.messageStatus,
          signStatus: this.filters.signStatus,
          startTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00') : '',
          endTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59') : ''
        }
        para.userId = this.curUser.id
        para.curDeptId = this.curDept.id
        this.$query('notice/list', para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.list = data.list
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      add() {
        this.$gotoid('/notice/add')
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      if (sessionStorage.getItem(this.$route.path)) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param.messageStatus) {
          this.filters.messageStatus = param.messageStatus
        }
        if (param.signStatus) {
          this.filters.signStatus = param.signStatus
        }
        sessionStorage.setItem(this.$route.path, '')
      }
      this.query()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>
<style>
  .noticeList .ellipsis-word{
    margin-bottom: 0;
    position: relative;
    top: 3px;
  }
  .noticeList .el-dialog__body{
    padding: 10px 25px;
  }
</style>
