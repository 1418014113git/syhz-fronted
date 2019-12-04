<template>
  <section class="trainMaterial">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-row>
          <el-col :span="4">
            <el-card>
              <div slot="header"><span>资料分类</span></div>
              <div class="all">全部（{{ totalData.total }}）</div>
              <ul><li class="menu" @click="handleMenuClick('3')" :class="active === '3'?'activeSpan':''"><i class="el-icon-picture"></i><span>环境相关（{{ totalData.type3 }}）</span></li></ul>
              <ul><li class="menu" @click="handleMenuClick('1')" :class="active === '1'?'activeSpan':''"><i class="el-icon-document"></i><span>食品安全（{{ totalData.type1 }}）</span></li></ul>
              <ul><li class="menu" @click="handleMenuClick('2')" :class="active === '2'?'activeSpan':''"><i class="el-icon-picture"></i><span>药品安全（{{ totalData.type2 }}）</span></li></ul>
              <ul><li class="menu" @click="handleMenuClick('4')" :class="active === '4'?'activeSpan':''"><i class="el-icon-picture"></i><span>综合相关（{{ totalData.type4 }}）</span></li></ul>
            </el-card>
          </el-col>
          <el-col :span="20" class="content">
            <el-card>
              <el-form :inline="true" :model="filters" label-width="80px">
                <el-form-item label="资料名称">
                  <el-input placeholder="请输入关键字" v-model="filters.title" maxlength="50" style="width: 222px"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                  <el-select v-model="filters.type" placeholder="请选择" clearable style="width: 222px">
                    <el-option label="环境" value="3"></el-option>
                    <el-option label="食品" value="1"></el-option>
                    <el-option label="药品" value="2"></el-option>
                    <el-option label="综合" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                  <el-select v-model="filters.auditStatus" placeholder="请选择" clearable style="width: 222px">
                    <el-option label="未提交" value="4"></el-option>
                    <el-option label="待审核" value="0"></el-option>
                    <el-option label="审核中" value="1"></el-option>
                    <el-option label="审核通过" value="2"></el-option>
                    <el-option label="审核不通过" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上传单位"><!--clearable-->
                  <el-select v-model="filters.belongDepCode" placeholder="请选择" @change="deptChange" clearable :disabled="isNormal" style="width: 222px">
                    <el-option v-for="item in deptList" :key="item.index" :value="item.departCode" :label="item.departName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上传者">
                  <el-select v-model="filters.creationId" placeholder="请选择" clearable :disabled="isNormal" style="width: 222px">
                    <el-option v-for="item in deptUserList" :key="item.index" :value="item.id" :label="item.realName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上传时间">
                  <el-date-picker v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-if="$isViewBtn('139006')" @click="query(true)" icon="el-icon-search">查询</el-button>
                  <el-button type="primary" v-if="$isViewBtn('139001')" @click="uploadFile" icon="el-icon-upload">上传资料</el-button>
                  <el-button type="primary" v-if="$isViewBtn('139010') && curDept.depType !== '4'" @click="batchAudit"><svg-icon icon-class="audit" style="margin-right:2px;"></svg-icon>批量审核</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="curriculumData" v-loading="listLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="enName" label="资料名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="$isViewBtn('139007')" @click="handleRowView(scope.$index, scope.row)" class="url_text">{{scope.row.enName}}</span>
                    <span v-else>{{scope.row.enName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="enType" label="资料类型" width="100px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.enType === 1">视频</span>
                    <span v-if="scope.row.enType === 2">音频</span>
                    <span v-if="scope.row.enType === 0">文档</span>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类别" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">食品</span>
                    <span v-if="scope.row.type === 2">药品</span>
                    <span v-if="scope.row.type === 3">环境</span>
                    <span v-if="scope.row.type === 4">综合</span>
                  </template>
                </el-table-column>
                <el-table-column prop="belongOrgName" label="上传单位" width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="creationName" label="上传者" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="creationTime" label="上传时间" width="120px"></el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" width="100px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.auditStatus === '0'">待审核</span>
                    <span v-if="scope.row.auditStatus === '1'">审核中</span>
                    <span v-if="scope.row.auditStatus === '2'">审核通过</span>
                    <span v-if="scope.row.auditStatus === '3'">审核不通过</span>
                    <span v-if="scope.row.auditStatus === '4'">未提交</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                  <template slot-scope="scope">
                    <el-button size="mini" v-if="$isViewBtn('139007')" title="查看" type="primary" icon="el-icon-view" circle @click="handleRowView(scope.$index, scope.row)"></el-button>
                    <el-button size="mini" v-if="$isViewBtn('139008') && editBtn(scope.row)" title="编辑" type="primary" icon="el-icon-edit" circle @click="handleRowEdit(scope.$index, scope.row)"></el-button>
                    <el-button size="mini" v-if="removeBtn(scope.row)" title="删除" type="primary" icon="el-icon-delete" circle @click="handleRowDel(scope.$index, scope.row)"></el-button>
                    <el-button size="mini" v-if="$isViewBtn('139010') && scope.row.auditStatus2 === '0' && scope.row.auditStatus !== '4' && curDept.depType !== '4'" title="审核" type="primary" circle @click="handleAudit(scope.$index, scope.row)"><svg-icon icon-class="audit"></svg-icon></el-button>
                    <el-button size="mini" v-if="$isViewBtn('139011') && scope.row.auditStatus !== '4'" title="审核记录" type="primary" icon="el-icon-document" circle @click="handleAuditList(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <div class="paginationWrap">
              <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                             :page-size="pageSize" :total="total" :current-page="page"></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="审核" :visible.sync="auditDialogVisible" :close-on-click-modal="false" class="audit_dialog" @close="closeDialog">
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="100px">
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model="auditForm.remark" type="textarea" maxlength="500" size="small" placeholder="最多可输入500个字符！"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="executeAudit('3')" class="cancelBtn">不通过</el-button>
        <el-button type="primary" @click="executeAudit('2')" class="saveBtn" v-loading.fullscreen.lock="loading">通过</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核记录" :visible.sync="auditListDialogVisible">
      <el-table :data="auditList" v-loading="auditListLoading">
        <el-table-column property="auditDeptName" label="审核单位" width="200"></el-table-column>
        <el-table-column property="auidtUserName" label="审核者" width="100"></el-table-column>
        <el-table-column property="auditTime" label="审核时间" width="150"></el-table-column>
        <el-table-column property="auditStatus" label="审核结果" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus === '0'">待审核</span>
            <span v-if="scope.row.auditStatus === '1'">审核中</span>
            <span v-if="scope.row.auditStatus === '2'">审核通过</span>
            <span v-if="scope.row.auditStatus === '3'">审核不通过</span>
            <span v-if="scope.row.auditStatus === '4'">未提交</span>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="审核意见"></el-table-column>
      </el-table>
      <div class="paginationWrap">
        <el-pagination v-if="auditTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange_audit" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange_audit"
                       :page-size="auditPageSize" :total="auditTotal" :current-page="auditPage"></el-pagination>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'trainMaterial',
    data() {
      return {
        loading: false,
        totalData: {
          total: 0,
          type1: 0,
          type2: 0,
          type3: 0,
          type4: 0
        },
        active: '3',
        deptList: [],
        deptUserList: [],
        noCheck: false,
        filters: {
          title: '',
          type: '3',
          auditStatus: '',
          belongDepCode: '',
          creationId: '',
          time: [],
          startTime: '',
          endTime: ''
        },
        listLoading: false,
        curriculumData: [],
        total: 0,
        page: 1,
        pageSize: 15,
        value: '',
        countHeight: null,
        auditListDialogVisible: false,
        auditList: [],
        auditPage: 1,
        auditPageSize: 15,
        auditTotal: 0,
        auditListLoading: false,
        auditDialogVisible: false,
        auditForm: {
          auditId: '',
          remark: '',
          workId: '',
          userId: '',
          title: ''
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
        multipleSelection: [],
        isBatchAudit: false,
        curDept: {},
        curUser: {},
        curRowId: '',
        isNormal: false // true 普通民警， false 审核者
      }
    },
    methods: {
      editBtn(row) {
        if (!this.isNormal) {
          return true
        }
        if (this.curUser.id === row.userId) {
          return row.auditStatus === '0' || row.auditStatus === '3' || row.auditStatus === '4'
        } else {
          return true
        }
      },
      removeBtn(row) {
        if (this.curDept.depType === '1' && this.$isViewBtn('139009') && !this.isNormal) {
          return true
        } else {
          if (this.$isViewBtn('139009')) {
            if (this.curUser.id === row.userId) {
              return row.auditStatus === '0' || row.auditStatus === '3' || row.auditStatus === '4'
            } else {
              return false
            }
          } else {
            return false
          }
        }
      },
      handleCurrentChange(val) {
        this.page = val
        this.query()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query()
      },
      handleMenuClick(type) {
        this.filters.type = type
        this.active = type
        this.query(true)
      },
      uploadFile() {
        const para = {
          auditView: true,
          param: this.filters,
          jumpType: 'trainMaterial',
          active: this.active
        }
        this.$gotoid('/micro/uploadFile', JSON.stringify(para))
      },
      query(flag) {
        this.listLoading = true
        this.page = flag ? 1 : this.page
        this.active = this.filters.type
        const para = {
          title: this.filters.title.trim(),
          type: this.filters.type,
          auditStatus: this.filters.auditStatus,
          noCheck: this.noCheck ? 'noCheck' : '',
          creationId: this.filters.creationId,
          startTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00') : '',
          endTime: this.filters.time && this.filters.time.length > 0 ? (this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59') : '',
          pageSize: this.pageSize,
          pageNum: this.page
        }
        para.currentDeptCode = this.curDept.depCode
        para.personId = this.curUser.id
        para.depType = this.curDept.depType
        para.belongDeptCode = this.filters.belongDepCode
        this.$query('page/traincourseaudit', para).then((response) => {
          this.listLoading = false
          this.curriculumData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
          this.$emit('changeList', this.videoList, this.audioList, this.documentList, response.data.pageNum, response.data.totalCount)
        }).catch(() => {
          this.listLoading = false
        })
      },
      queryTotal() {
        const para = {}
        para.creationId = this.filters.creationId
        para.currentDeptCode = this.curDept.depCode
        para.personId = this.curUser.id
        para.depType = this.curDept.depType
        para.belongDeptCode = this.filters.belongDepCode
        this.$query('traincoursetotal', para).then((response) => {
          this.totalData.total = response.data.totalCount
          this.totalData.type1 = response.data.totalCount1
          this.totalData.type2 = response.data.totalCount2
          this.totalData.type3 = response.data.totalCount3
          this.totalData.type4 = response.data.totalCount4
        })
      },
      handleRowView(index, row) {
        const para = {
          auditView: true,
          enType: row.enType + '',
          filters: this.filters,
          jumpType: 'trainMaterial',
          id: row.id,
          active: this.active
        }
        if (row.enType === 0) {
          this.$gotoid('/micro/documentPlayer', JSON.stringify(para))
        }
        if (row.enType === 1) {
          this.$gotoid('/micro/videoPlayer', JSON.stringify(para))
        }
        if (row.enType === 2) {
          this.$gotoid('/micro/audioPlayer', JSON.stringify(para))
        }
      },
      handleRowEdit(index, row) {
        const para = {
          param: this.filters,
          jumpType: 'trainMaterial',
          id: row.id,
          active: this.active
        }
        this.$gotoid('/micro/uploadFile', JSON.stringify(para))
      },
      handleRowDel(index, row) {
        this.$confirm('资料删除后将无法再找回，确定是否要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$update('traincoursedelete/' + row.id, {}).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
              const arr = []
              for (let i = 0; i < response.data.length; i++) {
                const item = response.data[i]
                arr.push(item.newPath)
                arr.push(item.oldPath)
              }
              // 调用删除硬盘附件接口
              this.$updateFile('/upload/delFile', { files: arr.join(';') }).then(response => {
              })
            }
            this.query()
          })
        }).catch(() => {
        })
      },
      handleAudit: function(index, row) {
        this.auditDialogVisible = true
        this.auditForm.auditId = row.id
        this.auditForm.workId = row.workId
        this.auditForm.userId = row.userId
        this.auditForm.title = row.title
        this.auditForm.belongType = row.enType
      },
      closeDialog() {
        this.auditDialogVisible = false
        this.auditForm = {
          auditId: '',
          remark: '',
          workId: '',
          userId: '',
          title: ''
        }
        this.isBatchAudit = false
        this.$refs.auditForm.resetFields()
      },
      executeAudit(auditStatus) {
        this.loading = true
        if (auditStatus === '2' && this.auditForm.remark === '') {
          this.auditForm.remark = '审核通过'
        }
        this.$refs.auditForm.validate(valid => {
          if (valid) {
            // 调用审核接口
            let para = {
              tableId: this.auditForm.auditId,
              belongMode: '1',
              belongType: this.auditForm.belongType,
              belongSys: '2',
              workId: this.auditForm.workId,
              currentAuditType: auditStatus,
              remark: this.auditForm.remark,
              userId: this.auditForm.userId,
              title: this.auditForm.title
            }
            para = this.$setCurrentUser(para)
            para.deptAreaCode = para.areaCode
            para.deptCode = para.belongDepCode
            para.deptName = para.belongDepName
            if (this.isBatchAudit) {
              const tableIds = []
              const workIds = []
              for (let i = 0; i < this.multipleSelection.length; i++) {
                const item = this.multipleSelection[i]
                tableIds.push(item.id)
                workIds.push(item.workId)
              }
              para.tableId = tableIds.join(',')
              para.workId = workIds.join(',')
              this.$update('/work/node', para).then(response => {
                this.$message({
                  message: '审核成功',
                  type: 'success'
                })
                this.loading = false
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
                this.loading = false
              })
            } else {
              this.isBatchAudit = false
              this.$update('/work/node', para).then(response => {
                this.$message({
                  message: '审核成功',
                  type: 'success'
                })
                this.loading = false
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
                this.loading = false
              })
            }
          } else {
            this.loading = false
          }
        })
      },
      handleAuditList(index, row) {
        this.auditListDialogVisible = true
        this.curRowId = row.id
        this.queryAuditList(row.id)
      },
      queryAuditList(id) {
        this.auditListLoading = true
        const para = {
          crouseId: this.curRowId === '' ? id : this.curRowId,
          belongMode: '1',
          belongType: this.active,
          belongSys: '2'
        }
        this.$query('page/traincrouseauditlog', para).then(response => {
          this.auditListLoading = false
          this.auditList = response.data.list
          this.auditPage = response.data.pageNum
          this.auditPageSize = response.data.pageSize
          this.auditTotal = response.data.totalCount
        }).catch(() => {
          this.auditListLoading = false
        })
      },
      handleCurrentChange_audit(val) {
        this.auditPage = val
        this.queryAuditList()
      },
      handleSizeChange_audit(val) {
        this.auditPage = 1
        this.auditPageSize = val
        this.queryAuditList()
      },
      handleSelectionChange(val) {
        // val 为整个{}
        this.multipleSelection = val
      },
      batchAudit() {
        if (this.multipleSelection.length === 0) {
          this.$alert('请勾选需要审核的记录', '提示')
          return false
        }
        this.auditDialogVisible = true
        this.isBatchAudit = true
      },
      queryDept() {
        // 如果没有审核权限，说明为普通民警
        if (this.isNormal) {
          // 上传单位：登录时默认展示本单位，不允许修改
          // 上传者：登录时默认本人，不允许修改
          // 列表数据权限说明：可查看本人上传记录
          this.deptList.push({ departCode: this.curDept.depCode, id: this.curDept.id, departName: this.curDept.depName, parentDepCode: this.curDept.parentDepCode, parentDepId: this.curDept.parentDepId })
          this.filters.belongDepCode = this.curDept.depCode
          this.queryDeptUser()
        } else {
          const para = this.$setCurrentUser({})
          para.departCode = para.belongDepCode
          this.$query('departchildren', para, true).then(response => {
            this.deptList = response.data
            if (this.filters.belongDepCode !== '') {
              this.queryDeptUser()
            }
          })
        }
      },
      deptChange(val) {
        this.queryDeptUser()
      },
      queryDeptUser() {
        const para = this.$setCurrentUser({})
        para.departCode = this.filters.belongDepCode
        this.$query('departuser', para, true).then(response => {
          this.deptUserList = response.data
          if (this.isNormal) {
            this.filters.creationId = this.curUser.id
          }
        })
      },
      selectable(row, index) {
        return row.auditStatus2 === '0' && row.auditStatus !== '4' && this.curDept.depType !== '4'
      }
    },
    mounted() {
      this.isNormal = !this.$isViewBtn('139010')
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.countHeight = document.documentElement.clientHeight - 230
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param) {
          this.active = param.active
          this.filters = param.filters
        }
        sessionStorage.setItem(this.$route.path, '')
      }
      if (this.isNormal) {
        this.filters.creationId = this.curUser.id
      }
      this.queryDept()
      this.queryTotal()
      this.query()
    }
  }
</script>

<style>
  .trainMaterial .content {
    padding: 0 10px;
  }
  .trainMaterial .menu {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
  }
  .trainMaterial .menu.activeSpan, .trainMaterial .menu.activeSpan:hover {
    background-color: rgba(0, 160, 233, 0.6);
  }
  .trainMaterial .menu:hover {
    background-color: rgba(188, 232, 252, 0.1);
  }
  .trainMaterial .menu i {
    font-size: 18px;
    width: 24px;
  }
  .trainMaterial .paginationWrap {
    text-align: right;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .trainMaterial .el-card.is-always-shadow .el-card__body > div.all{
    height: 50px;
  }
  .trainMaterial .el-card.is-always-shadow .el-card__body ul{
    margin-left: 20px;
  }
  .trainMaterial .package_customClass {
    width: 25%;
  }
  .trainMaterial .package_customClass .el-message-box__input {
    padding-left: 36px;
    padding-right: 12px;
  }
  .trainMaterial .package_customClass .el-message-box__input .el-textarea {
    width: 100%;
  }
  .trainMaterial .auditClass{
    padding: 2px;
    top: 4px;
    position: absolute;
    margin-left: 14px;
  }
  .trainMaterial .auditClass svg{
    width: 18px;
    height: 18px;
  }
  .trainMaterial .el-dialog__wrapper.audit_dialog{

  }
  .trainMaterial .el-dialog__wrapper.audit_dialog .el-dialog .el-dialog__body{
    padding-left: 40px;
    padding-right: 40px;
  }
  .trainMaterial .url_text{
    cursor: pointer;
  }
</style>
