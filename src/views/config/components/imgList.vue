<template>
  <div class="dictList">
    <el-form :inline="true" :model="imgQuery">
      <el-form-item label="类型Code">
        <el-input v-model="imgQuery.key" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100903')" v-on:click="queryData(true,true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="showAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="图片" min-width="30%">
        <template slot-scope="scope">
          <img :src="scope.row.url" alt="" style="width: 150px;height: 150px">
        </template>
      </el-table-column>
      <el-table-column prop="key" label="类型code" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="$isViewBtn('100903')" title="编辑" size="mini" type="primary"
                     icon="el-icon-edit" circle @click="showEdit(scope.row)"></el-button>
          <el-button v-if="$isViewBtn('100903')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handlerDel(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog :title="diaTitle" :visible.sync="dialogVisible" width="700px" @close="handleClose(false)">
      <el-form ref="imgFileForm" :model="imgBean" :rules="rules" label-width="160px">
        <el-form-item label="Code" prop="configKey">
          <el-input v-model="imgBean.configKey" clearable style="width: 60%" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="attachment">
          <el-upload class="upload-demo" drag
                     :action="uploadAction"
                     :file-list="attachment"
                     :on-success="imgSuccess"
                     :on-remove="imgRemove"
                     :on-preview="imgPreview"
                     :before-remove="imgBfRemove"
                     :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">上传png、jpg格式文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="saveImg" :loading="imgLoading">提 交</el-button>
          <el-button @click="handleClose(false)">取 消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dictList',
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      attachment: [],
      diaTitle: '',
      codeLxList: [],
      imgQuery: {
        configGroup: 'worker_icon', key: '', category: 2
      },
      imgBean: {
        id: '', configKey: '', configValue: '',
        configGroup: 'worker_icon', category: 2
      },
      listData: [],
      page: 1,
      total: 0,
      pageSize: 15,
      listLoading: false,
      imgLoading: false,
      dialogVisible: false,
      tableHeight: null,
      rules: {
        configKey: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const code = value
            this.imgBean.configKey = code
            if (code && code.length > 0) {
              const para = {
                configGroup: 'worker_icon', configKey: this.imgBean.configKey, category: 2, id: this.imgBean.id
              }
              this.$query('sysconfig', para).then((response) => {
                if (response.code === '000000') {
                  if (response.data && response.data.length > 0) {
                    callback(new Error('此code已存在，请重新输入！'))
                  } else {
                    callback()
                  }
                }
              })
            } else {
              callback(new Error('请输入类型code'))
            }
          }
        }],
        attachment: [
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (this.attachment.length === 0) {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    dictChange(val) {
      for (let i = 0; i < this.codeLxList.length; i++) {
        const lx = this.codeLxList[i]
        if (lx.value === val) {
          this.imgBean.codeDesc = lx.label
          return false
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryData(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryData(false, true)
    },
    queryData(flag, hand) {
      this.page = flag ? 1 : this.page
      const para = this.imgQuery
      para.configGroup = 'worker_icon'
      para.category = 2
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (hand) {
        para.logFlag = 1 // 是否写日志
      }
      this.listLoading = true
      this.$query('page/sysconfig', para).then((response) => {
        this.listLoading = false
        this.listData = []
        const datas = response.data.list
        for (let i = 0; i < datas.length; i++) {
          const bean = datas[i]
          this.listData.push({
            id: bean.id, url: bean.configValue, key: bean.configKey
          })
        }
        this.total = response.data.totalCount
        this.pageSize = response.data.pageSize
      }).catch(() => {
        this.listLoading = false
      })
    },
    clear() {
      this.imgQuery.key = ''
      this.queryData(true, true)
    },
    showAdd() {
      this.diaTitle = '新增'
      this.dialogVisible = true
    },
    showEdit(row) {
      this.diaTitle = '修改'
      this.dialogVisible = true
      this.imgBean.id = row.id
      this.imgBean.configKey = row.key
      this.imgBean.configValue = row.url
      this.attachment = [{
        url: row.url, name: row.key
      }]
    },
    handlerDel(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$remove('sysconfig/' + id, {}).then((response) => {
          this.listLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.queryData(false)
            const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
            this.$save('trestrictedperson', {
              userName: curUser.userName,
              userId: curUser.id,
              realName: curUser.realName
            }).then((response) => { })
          }
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    hideDialog(flag) {
      this.$refs.imgFileForm.resetFields()
      this.imgBean.id = ''
      this.imgBean.configKey = ''
      this.imgBean.configValue = ''
      this.attachment = []
      this.dialogVisible = false
      if (flag) {
        this.queryData(false)
      }
    },
    saveImg() {
      this.$refs.imgFileForm.validate(valid => {
        if (valid) {
          this.imgBean.configValue = this.attachment[0].url
          if (this.imgBean.id) {
            this.handlerEdit()
          } else {
            this.handlerSave()
          }
        }
      })
    },
    handlerSave() {
      this.imgBean.logFlag = 1 // 是否写日志
      this.imgLoading = true
      this.$save('sysconfig', this.imgBean).then((response) => {
        this.imgLoading = false
        if (response.code === '000000') {
          this.handleClose(true)
        }
      }).catch(() => {
        this.imgLoading = false
      })
    },
    handlerEdit() {
      this.imgBean.logFlag = 1 // 是否写日志
      this.imgLoading = true
      this.$update('sysconfig/' + this.imgBean.id, this.imgBean).then((response) => {
        this.imgLoading = false
        if (response.code === '000000') {
          this.handleClose(true)
        }
      }).catch(() => {
        this.imgLoading = false
      })
    },
    handleClose(flag) {
      this.hideDialog(flag)
    },
    imgSuccess(res, file, fileList) {
      this.attachment = [{
        url: res.data, name: file.name
      }]
    },
    imgRemove(file, fileList) {
      this.attachment = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) { },
    beforeUpload(file) {
      const name = file.name.split('.')
      const arrayLength = name.length
      const fileType = name[arrayLength - 1]
      const reg = /^(png)|(jpg)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传png、jpg格式文件', type: 'warning'
        })
        return false
      }
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 240
    // console.info(this.uploadAction)
  }
}
</script>

<style scoped>
</style>
