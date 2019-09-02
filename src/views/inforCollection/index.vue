<template>
  <section>
    <el-form :inline="true" :model="filters" size="small" v-loading="upFileLoad">
      <el-form-item>
        <el-input size="small" clearable v-model="filters.DWMC" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" clearable filterable v-model="filters.DWXZ" placeholder="企业性质··">
          <el-option v-for="item in enterprise_nature" :key="item.value" :label="item.code_name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" clearable filterable v-model="filters.DWLB" placeholder="企业类型">
          <el-option value="01" label="新闻单位"></el-option>
          <el-option value="02" label="交通枢纽"></el-option>
          <el-option value="03" label="国防科技工业重要产品的研制、生产单位"></el-option>
          <el-option value="04" label="电信、邮政、金融（银行、证券、保险）单位"></el-option>
          <el-option value="05" label="大型能源动力设施、水利设施和城市水电燃气热力供应设施"></el-option>
          <el-option value="06" label="大型物资储备单位和大型商贸中心"></el-option>
          <el-option value="07" label="教育、科研、医疗单位和大型文化、体育场所"></el-option>
          <el-option value="08" label="博物馆、档案馆和重点文物保护单位"></el-option>
          <el-option value="09" label="研制、生产、销售、储存危险物品或者实验、保藏传染性菌、毒种"></el-option>
          <el-option value="10" label="国家重点建设工程单位"></el-option>
          <el-option value="11" label="党政机关单位"></el-option>
          <el-option value="12" label="工矿企业"></el-option>
          <el-option value="13" label="高等院校"></el-option>
          <el-option value="14" label="中小学校、幼儿园"></el-option>
          <el-option value="15" label="敬老院"></el-option>
          <el-option value="16" label="大型储备仓库"></el-option>
          <el-option value="99" label="其它"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" clearable filterable v-model="filters.XYLB" placeholder="行业类别">
          <el-option value="010000" label="农、林、牧、渔业"></el-option>
          <el-option value="010100" label="农业"></el-option>
          <el-option value="010101" label="谷物及其他作物的种植"></el-option>
          <el-option value="010102" label="蔬菜、园艺作物的种植"></el-option>
          <el-option value="010103" label="水果、坚果、饮料和香料作物的种植"></el-option>
          <el-option value="010104" label="中药材的种植"></el-option>
          <el-option value="010200" label="林业"></el-option>
          <el-option value="010201" label="林木的培育和种植"></el-option>
          <el-option value="010202" label="木材和竹材的采运"></el-option>
          <el-option value="010300" label="畜牧业"></el-option>
          <el-option value="010301" label="牲畜的饲养"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item>
        <el-select size="small" clearable v-model="filters.SFNS" placeholder="是否年审">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-select size="small" clearable v-model="filters.BLACK" placeholder="是否黑名单">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)" v-if="$isViewBtn('110001')">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="excelImport" v-if="$isViewBtn('110002')">Excel导入</el-button>
      </el-form-item>
      <el-form-item>
        <a :href="exportDataUrl+'blacklist?DWMC='+filters.DWMC+'&type=1'" download="t.xlsx"  >
          <el-button type="primary" v-if="$isViewBtn('110003')">Excel导出</el-button>
        </a>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd" v-if="$isViewBtn('110004')">新增</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="tasks"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="id" label="企业ID"></el-table-column>
      <el-table-column prop="DWMC" label="名称"></el-table-column>
      <el-table-column prop="DWXZ_NAME" label="企业性质"></el-table-column>
      <el-table-column prop="XYLB_NAME" label="行业类别"></el-table-column>
      <el-table-column prop="DWLB_NAME" label="企业类型"></el-table-column>
      <el-table-column prop="YYZZBH" label="营业执照编号"></el-table-column>
      <el-table-column prop="FRDBXM" label="法人名称"></el-table-column>
      <!--<el-table-column prop="SFNS" label="是否年审" :formatter="formatterNS"></el-table-column>-->
      <el-table-column prop="ENABLE" label="是否黑名单" ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="text" @click="reviewResult(scope.$index, scope.row)" >审核黑名单</el-button>-->
          <el-button title="详情" size="mini" type="info" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle  v-if="$isViewBtn('110007')" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle v-if="$isViewBtn('110008')" @click="handleDel(scope.$index, scope.row)"></el-button>
          <el-button title="加入黑名单" size="mini" type="warning" icon="el-icon-plus" circle v-if="$isViewBtn('110005')" :disabled="'是' == scope.row.ENABLE" @click="addBlack(scope.$index, scope.row)" ></el-button>
          <el-button title="移出黑名单" size="mini" type="danger" icon="el-icon-minus" circle v-if="$isViewBtn('110006')" :disabled="'否' == scope.row.ENABLE" @click="removeBlackList(scope.$index, scope.row)" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="企业导入" :visible.sync="dialogImportVisible" size="small" @close="dialogClose">
      <!--<a href="http://127.0.0.1:9003/file/downloadTemplate/1"  download="t"  >
        <el-button type="primary" size="medium" >下载模板</el-button>
      </a>-->
      <el-form class="ajInfoForm" style="width: 400px;margin:0 auto"   ref="form"   size="small" label-width="100px"
               @submit.prevent="onSubmit">
        <el-form-item label="下载模板："  >
          <a :href="downLoadUrl+'企业基础信息导入模板.xlsx'"  download="企业基础信息导入模板.xlsx">
            <el-button type="primary">下载模板</el-button>
          </a>
          <a :href="downLoadUrl+'黑名单企业导入模板.xlsx'"  download="黑名单企业导入模板.xlsx">
            <el-button type="primary">下载黑名单模板</el-button>
          </a>
        </el-form-item>
        <el-form-item label="类型：">

          <el-radio-group v-model="uploadType">
            <el-radio label="1">企业</el-radio>
            <el-radio label="4">黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导入文件：">
            <el-upload v-if="uploadType==='1'"
              :action="importAction1"
              class="upload-demo" drag multiple
              :auto-upload="true"
              :file-list="uploadImgs"
              :on-success="imgSuccess"
              :before-upload="beforeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls、xlsx格式文件，且大小不超过500M</div>
            </el-upload>
            <el-upload v-if="uploadType==='4'"
              :action="importAction4"
              class="upload-demo" drag multiple
              :auto-upload="true"
              :file-list="uploadImgs"
              :on-success="imgSuccess"
              :before-upload="beforeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls、xlsx格式文件，且大小不超过500M</div>
            </el-upload>
          <!--:on-remove="imgRemove"-->
          <!--:on-preview="imgPreview"-->
          <!--:before-remove="imgBfRemove"-->
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { getListPage, deleteCompany, getTCode } from '@/api/inforCollection'
import importexport from '@/api/importexport'
export default {
  name: 'index',
  data() {
    return {
      uploadType: '1',
      importAction1: importexport.importUrl + '?type=1',
      importAction4: importexport.importUrl + '?type=4',
      exportTemplateUrl1: importexport.exportTemplateUrl + '1',
      exportTemplateUrl4: importexport.exportTemplateUrl + '4',
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      exportDataUrl: importexport.exportDataUrl,
      exportAction: '',
      uploadImgs: [],
      dialogImportVisible: false,
      filters: {
        DWMC: '',
        DWXZ: '',
        DWLB: '',
        XYLB: '',
        SFNS: '',
        BLACK: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      upFileLoad: false,
      enterprise_nature: [],
      tasks: [],
      tableHeight: null
    }
  },
  methods: {
    imgSuccess(res, file, fileList) {
      this.upFileLoad = false
      if (res.code === '000000') {
        this.uploadImgs = fileList
        this.$message({
          message: '导入成功', type: 'success'
        })
      } else {
        this.uploadImgs = []
        this.$message({
          message: '导入失败！请检查导入数据是否正确', type: 'error'
        })
      }
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
      const name = file.name.split('.')
      const arrayLength = name.length
      const fileType = name[arrayLength - 1]
      const reg = /^(xlsx)$/
      if (!reg.test(fileType)) {
        this.$message({ message: '上传文件只支持xls、xlsx', type: 'warning' })
        return false
      }
      this.upFileLoad = true
    },
    formatterNS(row, index) {
      return row.SFNS === 1 ? '是' : '否'
    },
    excelImport() {
      this.dialogImportVisible = true
    },
    otherImport() {

    },
    handleAdd: function() {
      this.$router.push({ path: '/inforCollection/add' })
    },
    query(flag) {
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        DWMC: this.filters.DWMC,
        DWXZ: this.filters.DWXZ,
        DWLB: this.filters.DWLB,
        XYLB: this.filters.XYLB,
        SFNS: this.filters.SFNS,
        BLACK: this.filters.BLACK
      }
      this.listLoading = true
      getListPage(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        this.tasks = data.list
        this.listLoading = false
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
    handleDetail: function(index, row) {
      this.$router.push({ path: '/inforCollection/detail/' + row.id })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/inforCollection/edit/' + row.id })
    },
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = { id: row.id }
        deleteCompany(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(false)
        })
      }).catch(() => {

      })
    },
    removeBlackList: function(index, row) {
      this.$router.push({ path: '/inforCollection/removeBlackList/' + row.id, query: row })
    },
    addBlack: function(index, row) {
      this.$router.push({
        path: '/inforCollection/addBlack',
        query: {
          id: row.id, DWMC: row.DWMC
        }
      })
    },
    clear() {
      this.filters = {
        DWMC: '', DWXZ: '', DWLB: '', XYLB: '', SFNS: ''
      }
      this.query(true)
    },
    tcode(type) {
      const para = {
        codeLx: type
      }
      getTCode(para).then((response) => {
        if (type === 'qyxz') {
          this.enterprise_nature = response.data
        } else {
          this.stateArr = response.data
        }
      })
    },
    dialogClose() {
      this.query(true)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
    this.tcode('qyxz')
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
    this.tcode('qyxz')
  }
}
</script>

<style scoped>
p > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
}
</style>
