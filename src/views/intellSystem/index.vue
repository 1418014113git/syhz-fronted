<template>
  <div class="intell-list">
    <el-form :inline="true" :model="filters">
      <el-form-item label="编号/关键字">
        <el-input v-model="filters.XSXXBH" placeholder="线索编号/线索关键字" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item label="填报时间">
        <el-date-picker v-model="filters.TBSJ" type="date" placeholder="填报时间" size="small"></el-date-picker>
      </el-form-item>
      <el-form-item label="填报单位">
        <el-input v-model="filters.TBDW" placeholder="填报单位" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item label="线索类型">
        <el-cascader placeholder="请选择类型" v-model="XSLX" change-on-select filterable :options="xslxList" clearable @change="xslxChange"></el-cascader>
      </el-form-item>
      <el-form-item label="完善状态">
        <el-select size="small" v-model="filters.STATUS" clearable placeholder="请选择状态">
          <el-option label="已完善" value="1"></el-option>
          <el-option label="未完善" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)" v-if="$isViewBtn('106001')" >查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="excelImport" v-if="$isViewBtn('106003')" >Excel导入</el-button>
      </el-form-item>
      <el-form-item><!--/syhz/excel/exporFile/qbxsjbxx-->
        <a :href="''+exportDataUrl+'qbxsjbxx?XSXXBH='+filters.XSXXBH+'&type=2'"  download="t.xlsx"  >
          <el-button type="primary" v-if="$isViewBtn('106004')" >Excel导出</el-button>
        </a>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd" v-if="$isViewBtn('106005')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="XSXXBH" label="线索编号" min-width="10%"></el-table-column>
      <el-table-column label="线索标题" min-width="14%">
        <template slot-scope="scope">
          <p :title="scope.row.BT" class="ellipsis-word">{{scope.row.BT}}</p>
        </template>
      </el-table-column>
      <el-table-column label="线索来源" min-width="5%">
        <template slot-scope="scope">
          <p :title="scope.row.XSXXLY_NAME" class="ellipsis-word">{{scope.row.XSXXLY_NAME}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="SSLB_NAME" label="线索分类" min-width="5%"></el-table-column>
      <el-table-column prop="JJCD_NAME" label="线索紧急程度" min-width="6%"></el-table-column>
      <el-table-column prop="XSZT_NAME" label="采集方式" :formatter="formatCJFS" min-width="5%"></el-table-column>
      <!--<el-table-column label="流转状态" min-width="5%">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.STATUS === 2">未签收</span>-->
          <!--<span v-if="scope.row.STATUS === 3">未反馈</span>-->
          <!--<span v-if="scope.row.STATUS === 4">已反馈</span>-->
          <!--<span v-if="scope.row.STATUS === 1 || scope.row.STATUS === 0">未流转</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="XSLX" label="线索类型" :formatter="formatXSLX" min-width="5%"></el-table-column>
      <el-table-column prop="STATUS" label="完善状态" :formatter="formatStatus" min-width="5%"></el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleBindAj(scope.$index, scope.row)" v-if="$isViewBtn('106006')">绑定案件</el-button>
          <!--<el-button size="small" type="primary" @click="handleEle(scope.$index, scope.row)" v-if="$isViewBtn('106007')">提取要素</el-button>-->
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)" v-if="$isViewBtn('106008')">
            {{scope.row.XSLX && scope.row.XSLX!=='' && scope.row.STATUS!==0? '详细信息' : '完善信息'}}
          </el-button>
          <!--<el-button size="small" type="primary" @click="handleCade(scope.$index, scope.row)" v-if="$isViewBtn('106009')" style="margin-top: 5px;">线索串并</el-button>-->
          <el-button size="small" type="warning" @click="toCheck(scope.row.id)" v-if="$isViewBtn('106011')" style="margin-top: 5px;">流转</el-button>
          <el-button size="small" type="warning"
                     @click="handleReceive(scope.row.bsId, scope.row.id)"
                     v-if="scope.row.STATUS === 2 && scope.row.noticeOrgId === currentDep.id && $isViewBtn('106012')" style="margin-top: 5px;">签收</el-button>
          <el-button size="small" type="warning"
                     @click="handleDelete(scope.row.id)"
                     v-if="$isViewBtn('106017')" style="margin-top: 5px;">删除</el-button>
          <el-button size="small" type="warning"
                     @click="handleShare(scope.row.id)" style="margin-top: 5px;">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <!--案件列表对话框-->
    <el-dialog :visible.sync="ajDialogVisible" width="80%"> <!--:visible.sync="personsDialogVisible"-->
      <el-form :inline="true" :model="filters2">
        <el-form-item label="案件名称">
          <el-input v-model="filters2.AJMC" placeholder="案件名称" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="searchAJ()">查询</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="AJBH" label="案件编号" width="120">
        </el-table-column>
        <el-table-column label="案件名称" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.AJMC" class="ellipsis-word">{{scope.row.AJMC}}</p>
          </template>
        </el-table-column>
        <el-table-column label="简要案情" min-width="30%">
          <template slot-scope="scope">
            <p :title="scope.row.JYAQ" class="ellipsis-word">{{scope.row.JYAQ}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="AJLB_NAME" label="案件类别" min-width="10%">
        </el-table-column>
        <el-table-column prop="name" label="市" min-width="20%">
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="total2 > 0" layout="prev, pager, next" @current-change="handleCurrentChange2"
                       :page-size="pageSize2" :current-page="page2" :total="total2" style="float:right;">
        </el-pagination>
      </el-col>
      <div style="text-align: center">
        <el-button size="small" type="primary" @click="save()"> 保 存 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="线索导入" :visible.sync="dialogImportVisible" size="small">
      <!--<a href="http://127.0.0.1:9003/file/downloadTemplate/1"  download="t"  >
        <el-button type="primary" size="medium" >下载模板</el-button>
      </a>-->
      <el-form class="ajInfoForm" style="width: 400px;margin:0 auto"   ref="form"   size="small" label-width="100px"
               @submit.prevent="onSubmit">
        <el-form-item label="下载模板：" >
          <a :href="downLoadUrl+'情报线索导入模板.xlsx'"  download="情报线索导入模板.xlsx"  >
            <el-button type="primary" size="medium" >下载模板</el-button>
          </a>
        </el-form-item>
        <el-form-item label="导入文件：">
          <el-upload
            :action="importAction"
            class="upload-demo" drag multiple
            :auto-upload="true"
            :file-list="uploadImgs"
            :on-success="imgSuccess"
            :on-remove="imgRemove"
            :on-preview="imgPreview"
            :before-remove="imgBfRemove"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls、xlsx格式文件，且大小不超过500M</div>
          </el-upload>
        </el-form-item>

      </el-form>
    </el-dialog>
    <el-dialog title="线索流转" :visible.sync="clueCheckDialog" @close="diaClose('checkDia')">
      <clue-check ref="checkDia" @cancel="closeCheck"></clue-check>
    </el-dialog>
    <el-dialog title="线索反馈" :visible.sync="clueCheckResultDialog" @close="diaClose('resultDia')">
      <clue-back-result ref="resultDia" @cancel="closeBackDia"></clue-back-result>
    </el-dialog>
    <el-dialog title="线索分享" :visible.sync="clueShareDialog">
      <el-form>
        <el-form-item label="接收部门：" prop="acceptOrgId">
          <el-cascader v-model="acceptOrgIds" :options="depData" :show-all-levels="false" :props="props"
                       style="width:80%" :change-on-select="true" clearable @change="acceptDeptChange"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit">确认</el-button>
          <el-button size="small" v-on:click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getIntellListPage, getQbxsjBxxCasecIds, editQbxsJbxxCaseRela, deleteIntell } from '@/api/intellSystem'
import {
  getSYHText, getSYHFLLBList
} from '@/utils/codetotext'
import {
  updBusinessSign
} from '@/api/cluecheck'
// import { getAJJBXXSYHPage } from '@/api/caseManage'
import { getUserInfo } from '@/utils/auth'
import importexport from '@/api/importexport'
import ClueCheck from './components/ClueCheck'
import ClueBackResult from './components/ClueBackResult'
import { parseTime } from '@/utils/index'
import {
  getSessionDeptSelect
} from '@/api/depts'
import {
  getClueCheckDepts
} from '@/api/dept'
export default {
  name: 'index',
  components: {
    'clue-check': ClueCheck,
    'clue-back-result': ClueBackResult
  },
  data() {
    return {
      importAction: importexport.importUrl + '?type=2',
      exportTemplateUrl: importexport.exportTemplateUrl + '2',
      exportDataUrl: importexport.exportDataUrl,
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      exportAction: '',
      uploadImgs: [],
      XSLX: [],
      xslxList: getSYHFLLBList(),
      dialogImportVisible: false,
      filters: {
        XSXXBH: '',
        XSZT: '',
        TBDW: '',
        TBSJ: '',
        STATUS: ''
      },
      filters2: {
        AJMC: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      total2: 0,
      page2: 1,
      pageSize2: 3,
      listLoading: false,
      data: [],
      pData: [],
      cData: [],
      ajDialogVisible: false,
      cases: [],
      caseIds: [],
      selectedCases: [],
      qbxsId: '',
      isInitCaseData: false,
      clueCheckDialog: false,
      clueCheckResultDialog: false,
      selectClues: [],
      clueCheckId: '',
      curUser: {},
      currentDep: {},
      tableHeight: null,
      clueShareDialog: false,
      curDept: {},
      depData: [],
      acceptOrgIds: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  methods: {
    xslxChange(val) {
      if (val && val.length > 0) {
        this.filters.XSLX = val.join(',')
      } else {
        this.filters.XSLX = ''
      }
    },
    imgSuccess(res, file, fileList) {
      this.uploadImgs = fileList
      this.$message({
        message: '导入成功',
        type: 'success'
      })
    },
    imgRemove(file, fileList) {
      this.uploadImgs = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      var name = file.name.split('.')
      var arrayLength = name.length
      var fileType = name[arrayLength - 1]
      // const reg = /^(image\/jpg)|(image\/jpeg)|(image\/png)|(text\/plain)|(application\/octet-stream)$/
      const reg = /^(xlsx)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传文件只支持xls、xlsx',
          type: 'warning'
        })
        return false
      }
    },
    formatXSLX(row) {
      if (row.XSLX && row.XSLX.length > 0) {
        return getSYHText(row.XSLX.substring(0, 1))
      }
      return ''
    },
    formatStatus(row, column) {
      return row.STATUS === 0 ? '未完善' : '已完善'
    },
    excelImport() {
      this.dialogImportVisible = true
    },
    otherImport() {
    },
    toCheck(id) {
      this.clueCheckId = id
      this.clueCheckDialog = true
    },
    closeCheck() {
      this.clueCheckDialog = false
      this.onRefresList()
    },
    closeBackDia() {
      this.clueCheckResultDialog = false
      this.onRefresList()
    },
    onRefresList() {
      this.query(true)
    },
    handleAdd: function() {
      this.$router.push({ path: '/intellSystem/intellAdd' })
    },
    query(flag) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        XSXXBH: this.filters.XSXXBH,
        XSZT: this.filters.XSZT,
        TBDW: this.filters.TBDW,
        TBSJ: this.filters.TBSJ,
        STATUS: this.filters.STATUS
      }
      if (this.filters.XSLX) {
        para.XSLX = this.filters.XSLX
      }
      getIntellListPage(para).then((response) => {
        this.listLoading = false
        this.data = response.data.list
        this.pageSize = response.data.pageSize
        this.total = response.data.totalCount
      }).catch(() => {
        this.listLoading = false
      })
    },
    getCase() {
      this.listLoading = true
      this.$query('page/searchsyhaj', {
        ajmc: this.filters2.AJMC,
        depCode: this.currentDep.depCode,
        pageNum: this.page2,
        type: 'qbxs',
        pageSize: this.pageSize2
      }).then((response) => {
        const data = response.data
        this.total2 = data.totalCount
        this.cases = data.list
        this.listLoading = false
        this.initAj()
      }).catch(() => {
        this.listLoading = false
      })
    },
    getCase2() {
      this.listLoading = true
      this.$query('page/searchsyhaj', {
        ajmc: this.filters2.AJMC,
        depCode: this.currentDep.depCode,
        pageNum: this.page2,
        type: 'qbxs',
        pageSize: this.pageSize2
      }).then((response) => {
        const data = response.data
        this.total2 = data.totalCount
        this.cases = data.list
        this.listLoading = false
        this.selectedCases = []
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection(this.selectedCases)
        })
        const _this = this
        this.isInitCaseData = true
        _this.caseIds.forEach(function(item) {
          _this.cases.forEach(function(item2) {
            if (item === item2.id) {
              _this.$nextTick(() => {
                _this.selectedCases.push(item2)
                _this.$refs.multipleTable.toggleRowSelection(item2)
              })
            }
          })
        }).catch(() => {
          this.listLoading = false
        })
        this.isInitCaseData = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    handleCurrentChange2(val) {
      this.page2 = val
      this.getCase2()
    },
    handleDetail: function(index, row) {
      this.$router.push({ path: '/intellSystem/edit/' + row.id })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/intellSystem/edit/' + row.id })
    },
    handleCade: function(index, row) {
      this.$router.push({ path: '/intell/cascade/' + row.id })
    },
    handleEle: function(index, row) {
      this.$router.push({ path: '/intellSystem/companyPersonList/' + row.id, query: { xslx: row.XSLX.substring(0, 1) }})
    },
    handleBindAj: function(index, row) {
      this.filters2.AJMC = ''
      this.page2 = 1
      this.caseIds = []
      this.qbxsId = row.id
      this.getCase()
    },
    searchAJ() {
      this.page2 = 1
      this.getCase2()
    },
    initAj() {
      // 获取已经关联的案件
      this.ajDialogVisible = true
      this.selectedCases = []
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection(this.selectedCases)
      })
      // 获取已经关联的案件
      this.isInitCaseData = true
      const _this = this
      _this.caseIds.forEach(function(item) {
        _this.cases.forEach(function(item2) {
          if (item === item2.id) {
            _this.selectedCases.push(item2)
            _this.$refs.multipleTable.toggleRowSelection(item2)
          }
        })
      })
      this.isInitCaseData = false
      getQbxsjBxxCasecIds({ qbxsId: this.qbxsId, category: '1' }).then((response) => {
        const _this = this
        response.data.forEach(function(item) {
          _this.caseIds.push(item.caseId)
        })
        this.isInitCaseData = true
        _this.caseIds.forEach(function(item) {
          _this.cases.forEach(function(item2) {
            if (item === item2.id) {
              _this.selectedCases.push(item2)
              _this.$refs.multipleTable.toggleRowSelection(item2)
            }
          })
        })
        this.isInitCaseData = false
      })
    },
    clear() {
      this.filters = {
        XSXXBH: '', XSZT: '', TBDW: '', TBSJ: '', STATUS: ''
      }
      this.query(true)
    },
    handlePersonnelEdit() {
      this.$router.push({ path: '/inforCollection/personnelEdit' })
    },
    handleCompanylEdit() {
      this.$router.push({ path: '/inforCollection/add' })
    },
    clueSelectionChange(val) {
      const array = []
      val.forEach((item, i) => {
        array.push(item.id)
      })
      this.selectClues = array
    },
    handleSelectionChange(val) {
      // 列表中有的全部删除
      if (!this.isInitCaseData) {
        const _this = this
        for (let i = 0; i < _this.caseIds.length; i++) {
          _this.cases.forEach(function(item2) {
            if (_this.caseIds[i] === item2.id) {
              _this.caseIds[i] = 0
            }
          })
        }
        val.forEach(function(item) {
          _this.caseIds.push(item.id)
        })
      }
    },
    save() {
      const caseIds = []
      this.caseIds.forEach(function(item) {
        if (item) {
          caseIds.push(item)
        }
      })
      const a = JSON.parse(getUserInfo())
      const para = {
        caseIds: caseIds,
        qbxsId: this.qbxsId,
        enable: 1,
        createUserId: a.id,
        createUserName: a.realName
      }
      editQbxsJbxxCaseRela(para).then((response) => {
        if (response.success === true) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.ajDialogVisible = false
        }
      })
    },
    handleReceive(bsId, id) {
      updBusinessSign({
        id: bsId,
        status: 2,
        clueId: id,
        signUserId: this.curUser.id,
        signTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
        updateUserId: this.curUser.id
      }).then((res) => {
        if (res.code === '000000') {
          this.$message({
            message: '签收成功',
            type: 'success'
          })
          this.query(true)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteIntell({
          id: id
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.query(false)
          }
        })
      })
    },
    diaClose(type) {
      this.$refs[type].cancel()
    },
    formatCJFS: function(row) {
      if (!row.XSZT_NAME) {
        return '摸排线索'
      }
    },
    handleShare: function(rowId) {
      this.clueShareDialog = true
    },
    onSubmit: function() {
      this.$message({
        message: '分享成功',
        type: 'success'
      })
      this.clueShareDialog = false
    },
    cancel: function() {
      this.clueShareDialog = false
    },
    acceptDeptChange: function() {
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.query(true)
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.depData = getClueCheckDepts(getSessionDeptSelect(), this.curDept.depCode, this.curDept.parentDepCode)
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>

<style scoped>
p > span {
  display: inline-block;
  height: 30px;
}
</style>
