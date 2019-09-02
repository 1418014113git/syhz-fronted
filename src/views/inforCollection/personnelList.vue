<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input size="small" v-model="filters.name" placeholder="人员名称/身份证号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="filters.mzname" placeholder="请选择民族" clearable>
          <el-option v-for="item in getMZSelectList" :label="item.label" :value="item.label"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="filters.hyzkname" placeholder="婚姻状况" clearable>
          <el-option label="未婚" value="未婚"></el-option>
          <el-option label="已婚" value="已婚"></el-option>
          <el-option label="初婚" value="初婚"></el-option>
          <el-option label="再婚" value="再婚"></el-option>
          <el-option label="复婚" value="复婚"></el-option>
          <el-option label="丧偶" value="丧偶"></el-option>
          <el-option label="离婚" value="离婚"></el-option>
          <el-option label="未说明的婚姻状况" value="未说明的婚姻状况"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="filters.isblackList" placeholder="是否黑名单" clearable>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)" v-if="$isViewBtn('111001')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resultFrom">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="excelImport" v-if="$isViewBtn('111002')">Excel导入</el-button>
      </el-form-item>
      <el-form-item>
        <a :href="exportDataUrl+'ajperson?name='+filters.name+'&type=3'" download="t.xlsx">
          <el-button type="primary" v-if="$isViewBtn('111003')">Excel导出</el-button>
        </a>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd" v-if="$isViewBtn('111004')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tasks" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="id" label="人员编号" min-width="4%"></el-table-column>
      <el-table-column prop="XM" label="人员名称" min-width="5%"></el-table-column>
      <el-table-column prop="GMSFHM" label="身份证号码" min-width="10%"></el-table-column>
      <el-table-column prop="XBNAME" label="性别" min-width="3%"></el-table-column>
      <el-table-column prop="MZNAME" label="民族" min-width="3%"></el-table-column>
      <el-table-column prop="HYZKNAME" label="婚姻状况" min-width="4%"></el-table-column>
      <el-table-column prop="HJDSSXQ_NAME" label="籍贯详址" min-width="10%"></el-table-column>
      <el-table-column prop="isblackList" label="是否黑名单" min-width="4%"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" v-if="$isViewBtn('111007') && scope.row.GMSFHM" size="mini" type="primary"
                     icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" v-if="$isViewBtn('111008') && scope.row.GMSFHM" size="mini" type="primary"
                     icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="注销" v-if="$isViewBtn('111009')" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"></el-button>
          <el-button title="加入黑名单" type="warning" icon="el-icon-plus" circle size="mini" v-if="$isViewBtn('111005')"
                     :disabled="'是' === scope.row.isblackList"
                     @click="blackListEdit(scope.$index, scope.row)"></el-button>
          <el-button title="移出黑名单" type="danger" icon="el-icon-minus" circle size="mini" v-if="$isViewBtn('111006')"
                     :disabled="'否' === scope.row.isblackList"
                     @click="blackListdelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="人员信息导入" :visible.sync="dialogImportVisible" size="small">
      <el-form class="ajInfoForm" style="width: 400px;margin:0 auto" ref="form" size="small" label-width="100px"
               @submit.prevent="onSubmit">
        <el-form-item label="下载模板：" prop="noticeOrgId">
          <a :href="downLoadUrl+'个人信息导入模板.xlsx'" download="个人信息导入模板.xlsx">
            <el-button type="primary" size="medium">下载模板</el-button>
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

  </section>
</template>

<script>
  import { getMZSelect } from '@/utils/codetotext'
  import { getPageList, deletePerson } from '@/api/collect/personCollect'
  import importexport from '@/api/importexport'

  export default {
    name: 'personnelList',
    data() {
      return {
        getMZSelectList: getMZSelect(), // 民族
        importAction: importexport.importUrl + '?type=3',
        exportTemplateUrl: importexport.exportTemplateUrl + '3',
        exportDataUrl: importexport.exportDataUrl,
        downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
        uploadImgs: [],
        dialogImportVisible: false,
        filters: {
          name: '',
          mzname: '',
          hyzkname: '',
          isblackList: ''
        },
        total: 0,
        page: 1,
        pageSize: 15,
        scopePageSize: 0,
        listLoading: false,
        tasks: [],
        tableHeight: null
      }
    },
    methods: {
      otherImport() {
      },
      excelImport() {
        this.dialogImportVisible = true
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
      handleAdd() {
        this.$router.push({ path: '/inforCollection/personnelEdit' })
      },
      query(flag) {
        this.listLoading = true
        this.page = flag ? 1 : this.page
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          name: this.filters.name,
          mzname: this.filters.mzname,
          hyzkname: this.filters.hyzkname,
          isblackList: this.filters.isblackList
        }
        getPageList(para).then(response => {
          this.listLoading = false
          this.tasks = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
          // this.initDictionary(this.tasks)
        }).catch(() => {
          this.listLoading = false
        })
      },
      resultFrom() {
        this.filters.name = ''
        this.filters.mzname = ''
        this.filters.hyzkname = ''
        this.filters.isblackList = ''
        this.query(true)
      },
      /**
       * 处理有数字字典的字段
       * initDictionary(tasks) {
      if (tasks.length > 0) {
        tasks.forEach((item, index) => {
          if (item.XB === '1') {
            item.XB = '男'
          } else if (item.XB === '2') {
            item.XB = '女'
          } else {
            item.XB = '其它'
          }
        })
      }
    },
       * **/
      handleCurrentChange(val) {
        this.page = val
        this.query(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(false)
      },
      handleDetail(index, row) {
        this.$router.push({
          path: '/personnelFile/index', query: { cardId: row.GMSFHM }
        })
      },
      handleEdit(index, row) {
        this.$router.push({
          path: '/inforCollection/personnelEdit/', query: { id: row.id }
        })
      },
      blackListEdit(index, row) {
        this.$router.push({
          path: '/views/inforCollection/personAddBlack', query: { id: row.id, flag: 'add' }
        })
      },
      blackListdelete(index, row) {
        // this.$router.push({ path: '/views/inforCollection/personAddBlack', query: { id: row.id, flag: 'delete' }
        this.$router.push({
          path: '/inforCollection/personRemoveBlackList', query: { id: row.id, flag: 'delete' }
        })
      },
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          const para = { id: row.id }
          deletePerson(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.query(false)
          })
        }).catch(() => {
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.query(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.query(true)
    }
  }
</script>

<style scoped>
</style>
