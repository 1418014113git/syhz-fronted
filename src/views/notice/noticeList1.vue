<template>
  <section class="noticeList">
    <el-form :inline="true" :model="filters" label-width="80px">
      <el-row>
        <el-form-item label="标题">
          <el-input placeholder="请输入关键字" v-model="filters.title" maxlength="50" style="width: 222px"></el-input>
        </el-form-item>
        <!--<el-form-item label="发布单位">-->
          <!--<el-select v-model="filters.belongDepCode" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDept" :loading="depLoading" :disabled="isNormal">-->
            <!--<el-option v-for="item in deptList" :key="item.index" :value="item.departCode" :label="item.departName"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="发布人">-->
          <!--<el-select v-model="filters.creationId" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDeptUser" :loading="depUserLoading" :disabled="isNormal">-->
            <!--<el-option v-for="item in deptUserList" :key="item.index" :value="item.id" :label="item.realName"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="发布时间">
          <el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="接收单位">-->
          <!--<el-select v-model="filters.belongDepCode" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDept_receive" :loading="depLoading_receive" :disabled="isNormal">-->
            <!--<el-option v-for="item in deptList_receive" :key="item.index" :value="item.departCode" :label="item.departName"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="接收人">-->
          <!--<el-select v-model="filters.creationId" clearable filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethodDeptUser_receive" :loading="depUserLoading_receive" :disabled="isNormal">-->
            <!--<el-option v-for="item in deptUserList_receive" :key="item.index" :value="item.id" :label="item.realName"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="审核状态">
          <el-select v-model="filters.auditStatus" placeholder="请选择" clearable>
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
            <el-option label="未签收" value="0"></el-option>
            <el-option label="已签收" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="query(true)" v-if="$isViewBtn('115001')">检索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="resetFrom" v-if="$isViewBtn('115001')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="add()" v-if="$isViewBtn('115002')">发布通知</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column label="标题" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.title" class="ellipsis-word">{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="8%">
        <template slot-scope="scope">
          <p :title="scope.row.content" class="ellipsis-word">{{scope.row.content}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column prop="deptName" label="发布单位" width="200"></el-table-column>-->
      <!--<el-table-column prop="creatorName" label="发布人" width="150"></el-table-column>-->
      <el-table-column prop="createTime" label="发布时间" width="200"></el-table-column>
      <el-table-column label="审核状态" width="150">
        <template slot-scope="scope">
          <span v-if="String(scope.row.messageStatus) === '0'">未提交</span>
          <span v-if="String(scope.row.messageStatus) === '1'">待审核</span>
          <span v-if="String(scope.row.messageStatus) === '2'">审核通过</span>
          <span v-if="String(scope.row.messageStatus) === '3'">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle v-if="$isViewBtn('115003')" @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" v-if="$isViewBtn('115004')" size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="签收" v-if="$isViewBtn('115004') && String(scope.row.messageStatus) === '2'" size="mini" type="primary" icon="el-icon-check" circle @click="handleRevice(scope.$index, scope.row)"></el-button>
          <el-button title="审核" v-if="$isViewBtn('115004') && (String(scope.row.messageStatus) === '1' || String(scope.row.messageStatus) === '3')" size="mini" type="primary" circle @click="handleEdit(scope.$index, scope.row)"><svg-icon icon-class="audit"></svg-icon></el-button>
          <el-button title="删除" v-if="$isViewBtn('115005')"  size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.$index, scope.row)"></el-button>
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
        <el-button @click="executeAudit('3')" class="cancelBtn" v-loading.fullscreen.lock="auditBtnLoading">不通过</el-button>
        <el-button type="primary" @click="executeAudit('2')" class="saveBtn" v-loading.fullscreen.lock="auditBtnLoading">通过</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发布通知" :visible.sync="addDialogVisible" :close-on-click-modal="false" class="add_dialog" @close="closeDialog">
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
          date: '',
          auditStatus: '',
          signStatus: ''
        },
        depLoading: false,
        depUserLoading: false,
        deptList: [],
        deptUserList: [],
        depLoading_receive: false,
        depUserLoading_receive: false,
        deptList_receive: [],
        deptUserList_receive: [],
        auditListLoading: false,
        auditBtnLoading: false,
        auditDialogVisible: false,
        auditForm: {
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
        addDialogVisible: false,
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        list: [],
        tableHeight: null,
        isNormal: false,
        curUser: {},
        curDept: {}
      }
    },
    methods: {
      remoteMethodDept(query) {
        if (query !== '') {
          this.queryDept(1)
        } else {
          this.deptList = []
          this.deptUserList = []
          this.filters.creationId = ''
        }
      },
      remoteMethodDeptUser(query) {
        if (query !== '') {
          this.queryDeptUser(1)
        } else {
          this.deptUserList = []
        }
      },
      remoteMethodDept_receive(query) {
        if (query !== '') {
          this.queryDept(2)
        } else {
          this.deptList_receive = []
          this.deptUserList_receive = []
          this.filters.creationId = ''
        }
      },
      remoteMethodDeptUser_receive(query) {
        if (query !== '') {
          this.queryDeptUser(2)
        } else {
          this.deptUserList_receive = []
        }
      },
      queryDept(type) {
        const para = this.$setCurrentUser({})
        para.departCode = para.belongDepCode
        this.depLoading = true
        this.$query('departchildren', para).then((response) => {
          if (type === 1) {
            this.depLoading = false
            this.deptList = response.data
            this.deptUserList = []
            this.filters.creationId = ''
          }
          if (type === 2) {
            this.depLoading_receive = false
            this.deptList_receive = response.data
            this.deptUserList_receive = []
            this.filters.creationId = ''
          }
        })
      },
      queryDeptUser(type) {
        const para = this.$setCurrentUser({})
        para.departCode = this.filters.belongDepCode
        this.$query('departuser', para, true).then(response => {
          if (type === 1) {
            this.deptUserList = response.data
          }
          if (type === 2) {
            this.deptUserList_receive = response.data
          }
        })
      },
      handleDetail: function(index, row) {
        this.$router.push({ path: '/tztg/detail/' + row.id })
      },
      handleEdit: function(index, row) {
        this.auditDialogVisible = true
      },
      handleRevice: function(index, row) {
        this.$router.push({ path: '/tztg/edit/' + row.id })
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = {
            id: row.id
          }
          this.$remove('', para).then((response) => {
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
        this.auditForm.remark = ''
      },
      closeDialog() {
        this.auditDialogVisible = false
        this.auditForm = {
          remark: ''
        }
        this.$refs.auditForm.resetFields()
        this.addDialogVisible = false
      },
      executeAudit(auditStatus) {
        this.auditBtnLoading = true
        if (auditStatus === '2' && this.auditForm.remark === '') {
          this.auditForm.remark = '审核通过'
        }
        this.$refs.auditForm.validate(valid => {
          if (valid) {
            // 调用审核接口
            let para = {
              id: this.auditForm.auditId,
              remark: this.auditForm.remark
            }
            para = this.$setCurrentUser(para)
            para.deptAreaCode = para.areaCode
            para.deptCode = para.belongDepCode
            para.deptName = para.belongDepName
            this.$update('', para).then(response => {
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
          auditStatus: this.filters.auditStatus,
          creationId: this.filters.creationId,
          startTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00') : '',
          endTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59') : ''
        }
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
        this.addDialogVisible = true
      }
    },
    mounted() {
      this.isNormal = !this.$isViewBtn('139010')
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
  .add_dialog {

  }

</style>
