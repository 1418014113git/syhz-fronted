<template xmlns="http://www.w3.org/1999/html">
  <section>
    <el-form :inline="true" :model="filters" label-width="80px">
      <el-form-item label="报告类型">
        <el-select v-model="query.category" placeholder="请选择">
          <el-option
            :label="item.label"
            :value="item.code"
            v-for="item in categoryList"
            :key="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成时间" prop="createTimeStart">
        <el-date-picker
          v-model="query.createTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间"
          @change="createTimeStartChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="createTimeEnd">
        <el-date-picker
          v-model="query.createTimeEnd"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
          @change="createTimeEndChange"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="getList">检索</el-button>
        <el-button size="small" @click="add">上传</el-button>
        <!-- <el-button size="small" @click="exportExcel">导出线索</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column
        prop="title"
        label="报告标题"
        min-width="10%"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="生成时间"
        min-width="5%"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      ></el-table-column>
      <el-table-column
        prop="uploadTime"
        label="上传时间"
        min-width="5%"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      ></el-table-column>

      <el-table-column label="操作" width="165">
        <template slot-scope="scope">
          <el-button
            title="下载"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleDownLoad(scope.$index, scope.row)"
          ></el-button>
          <el-button
            title="删除"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDel(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        v-if="total > 0"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        :total="total"
        :current-page="page"
        style="float:right;"
      >
      </el-pagination>
    </el-col>
    <el-dialog
      title="提示"
      :visible.sync="uploadDialogVisible"
      width="30%"
      center
      @close="resetForm('ycReportForm')"
    >
      <el-form :model="filters" ref="ycReportForm">
        <el-form-item label="报告类型">
          <el-select v-model="filters.category" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.code"
              v-for="item in categoryList"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="报告文件" v-if="firstSubmitVisible">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            multiple
            :action="uploadAction"
            :limit="10"
            :auto-upload="true"
            :file-list="uploadImgs"
            :on-success="imgSuccess"
            :on-remove="imgRemove"
            :on-preview="imgPreview"
            :before-remove="imgBfRemove"
            :before-upload="beforeUpload"
            :disabled="noauth"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip" style="text-align:center">
              {{ UploadAttachment.tipText_ycReport_style }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="cancelEdit"
            class="cancelBtn"
            :disabled="formLoading"
            >取 消</el-button
          >
          <el-button
            type="primary"
            class="saveBtn"
            @click="onSubmit(0)"
            :loading="saveBtnLoading"
            :disabled="saveBtnDisabled"
            >保 存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import { getCluePage } from '@/api/clue';
import importexport from '@/api/importexport';
import { uploadImg } from '@/utils/editorUpload';
export default {
  name: 'analysis',
  data() {
    return {
      saveBtnDisabled: false,
      nameCheckFlag: false, // true为重复
      formLoading: false,
      uploadDialogVisible: false,
      firstSubmitVisible: true,
      uploadAction: this.UploadAttachment.uploadFileUrl,
      noauth: false,
      category: '',
      saveBtnLoading: false,
      applyBtnLoading: false,
      defaultTime: ['00:00:00', '23:59:59'],
      categoryList: [
        { code: '1', label: '日报' },
        { code: '2', label: '周报' },
        { code: '3', label: '月报' }
      ],
      total: '',
      page: 1,
      pageSize: 15,
      listLoading: '',
      statusData: [],
      filters: {
        fileName: '',
        category: '',
        title: '',
        createTime: '', // 生成时间，根据文件名获取
        attachment: ''
      },
      listData: [],
      uploadImgs: [],
      query: {
        category: '',
        createTimeStart: '',
        createTimeEnd: ''
      }
    }
  },
  methods: {
    createTimeStartChange(val) {},
    createTimeEndChange(val) {},
    onSubmit(state) {
      this.formLoading = true
      this.$refs.ycReportForm.validate(valid => {
        if (valid) {
          this.handleImg()
          if (this.uploadImgs.length === 0) {
            this.$message({
              message: '请至少选择一个文件',
              type: 'error'
            })
            this.formLoading = false
            return;
          }
          const param = {
            attachment: this.filters.attachment,
            category: this.filters.category
          }
          if (!this.nameCheckFlag) {
            // 不重复
            this.saveBtnDisabled = false
            this.saveBtnLoading = true
            this.$save('yqreport', param)
              .then(response => {
                if (response.code === '000000') {
                  this.saveBtnLoading = false
                  this.formLoading = false
                  setTimeout(() => {
                    this.uploadDialogVisible = false
                  }, 2000)
                  this.$message({
                    message: '报告上传成功',
                    type: 'success'
                  })
                }
              })
              .catch(() => {
                this.btnLoading = false
              })

            /*
          "[{\"name\":\"4bf32c45c1df4437a7164dd87bbffe9c (1).doc\",\"path\":\"http://192.168.43.32:9003/file/downloadFile/5e005f6356c8270910f24d50\"}]"
          */
          } else {
            this.$message({
              message: '文件名重复，请确认后重新上传',
              type: 'error'
            })
            this.formLoading = false
          }
        }
      })
    },

    // checkFileName(url, params) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get(ModuleName + url, {
    //         params: params
    //       })
    //       .then(res => {
    //         if (res.data.data !== null && res.data.data.length > 0) {
    //           reject(
    //             '您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！'
    //           )
    //         } else {
    //           resolve(res)
    //         }
    //       })
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        setTimeout(() => {
          this.uploadDialogVisible = false
        }, 500)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    imgSuccess(res, file, fileList) {
      this.uploadImgs = fileList
    },
    imgRemove(file, fileList) {
      this.uploadImgs = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {},
    beforeUpload(file) {
      const fileName = file.name
      var type = file.name.substring(
        file.name.lastIndexOf('.') + 1,
        file.name.length
      )
      // if(type.)
      // alert (fileName)
      // const wordReg = /^(application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(application\/msword)$/
      // const pdfReg = /^(application\/vnd.openxmlformats-officedocument.presentationml.presentation)|(application\/pdf)$/
      // const pptReg = /^(application\/vnd.ms-powerpoint)$/
      // const videoReg = /^(video\/mp4)|(video\/avi)|(video\/x-ms-wmv)$/
      // const audioReg = /^(audio\/mp3)$/

      let flag = false
      if (
        type === 'doc' ||
        type === 'docx' ||
        type === 'DOC' ||
        type === 'DOCX' ||
        type === 'pdf' ||
        type === 'PDF'
      ) {
        // this.uploadFileType = '0';
        flag = true
        if (file.size / 1024 / 1024 > 64) {
          this.$message({
            message: '文件上传失败！上传文档大小不得超过64M！',
            type: 'error'
          })
          return false
        }
      }
      if (!flag) {
        this.$message({
          message: '仅支持Word、PDF文件',
          type: 'error'
        })
        return false
      }
      if (this.uploadImgs.length === 5) {
        this.$message({
          message: '最多可一次性上传5个文件！',
          type: 'error'
        })
        return false
      }

      const param = {
        fileName: fileName
      }

      this.$query('YQFILENAMECHECK', param)
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000') {
            if (Number(res.data[0].count) > 0) {
              this.nameCheckFlag = true
              return false
            }
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
      // {
      // const rejected = checkFileName('YQFILENAMECHECK', {
      //   belongMode: '3',
      //   enName: file.name.substring(0, file.name.lastIndexOf('.')),
      //   enClass: file.name.substring(
      //     file.name.lastIndexOf('.'),
      //     file.name.length
      //   )
      // })
      //   rejected.catch(() => {
      //     this.nameCheckFlag = true
      //     this.$alert(
      //       '您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！',
      //       '提示',
      //       {
      //         confirmButtonText: '知道了',
      //         callback: action => {}
      //       }
      //     )
      //   })
      //   return rejected
      // }
      // },
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getList()
    },
    handleImg() {
      if (this.uploadImgs.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]

          if (img.status === 'success') {
            arr.push({
              name: img.name,
              path: img.path ? img.path : img.response.data
            })
          }
        }
        this.filters.attachment = JSON.stringify(arr)
      }
    },

    // 下载按钮控制显示
    // downLoadBtn(row) {
    //   return (
    //     row.submitPersonId === JSON.parse(sessionStorage.getItem('userId'))
    //   )
    // },
    // // 删除按钮控制显示
    // delBtn(row) {
    //   if (row.shareStatus + '' === '0') {
    //     // 删除按钮编号
    //     return (
    //       (this.$isViewBtn('100901') &&
    //         row.submitDeptId + '' ===
    //           JSON.parse(sessionStorage.getItem('depToken'))[0].id + '') ||
    //       row.submitPersonId + '' ===
    //         JSON.parse(sessionStorage.getItem('userId')) + ''
    //     )
    //   }
    //   return false
    // },
    // 查询
    getList(flag) {
      this.listLoading = true
      const para = {
        createTimeStart: this.query.createTimeStart,
        createTimeEnd: this.query.createTimeEnd,
        category: this.query.category
      }
      this.$query('page/yqreport', para)
        .then(response => {
          this.listLoading = false
          if (response.data.list && response.data.list.length > 0) {
            this.listData = response.data.list
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
          } else {
            this.listData = []
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 查询请求
    queryRequest(param) {
      this.listLoading = true
      getCluePage(param)
        .then(response => {
          if (response.data) {
            this.total = response.data.totalCount
            this.listData = response.data.list
            this.page = response.data.pageNum
            this.pageSize = response.data.pageSize
            this.listLoading = false
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 重置
    reset() {
      this.filters = {}
    },
    // 添加
    add() {
      // alert(this.$refs.ycReportForm)
      this.uploadImgs = []
      this.filters.category = '1';
      this.uploadDialogVisible = true
    },
    // 分享
    handleShare(index, row) {
      this.$router.push({
        path: '/information/clueShare?',
        query: { id: row.id }
      })
    },
    // 详情
    handleDetail(index, row) {
      this.$router.push({
        path: '/information/clueDetai?',
        query: { id: row.id }
      })
    },
    // 下载
    handleDownLoad(index, row) {
      var attach = JSON.parse(row.attachment)
      console.log(attach)
      window.open(attach.path)
    },
    // 删除
    handleDel(row) {
      this.$confirm('是否确定要删除当前报告', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          alert('shi')
          // this.listLoading = true
          this.$remove('YQREPORT/' + row.id, {})
            .then(response => {
              alert('ok')
              this.listLoading = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList(true)
            })
            .catch(() => {
              this.listLoading = false
            })
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    dateTimeFormat() {},
    // 线索来源格式化
    collectionTypeFormat(row) {
      var list = this.$getDicts('xsly')
      for (let i = 0; i < list.length; i++) {
        if (list[i].dictKey + '' === row.collectionTypeId + '') {
          return list[i].dictName
        }
      }
    },
    // 线索分类格式化
    clueSortFormat(row) {
      var list = this.$getDicts('xsfl')
      for (let i = 0; i < list.length; i++) {
        if (list[i].dictKey + '' === row.clueSortId + '') {
          return list[i].dictName
        }
      }
    },

    // 初始化
    init() {
      var param = {
        currentPage: this.page,
        pageSize: this.pageSize,
        submitPersonId: JSON.parse(sessionStorage.getItem('userId')),
        submitDeptId: JSON.parse(sessionStorage.getItem('depToken'))[0].id,
        currentDeptId: JSON.parse(sessionStorage.getItem('depToken'))[0].id,
        currentUserId: JSON.parse(sessionStorage.getItem('userId'))
      }
      this.queryRequest(param)
    }
  },
  mounted: function() {
    this.getList()
  }
}
</script>
