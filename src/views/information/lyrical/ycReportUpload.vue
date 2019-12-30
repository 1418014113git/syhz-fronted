<template xmlns="http://www.w3.org/1999/html">
  <section>
    <el-form :inline="true" :model="filters" label-width="80px">
      <el-form-item label="报告类型">
        <el-select v-model="query.category" placeholder="请选择" clearable>
          <el-option
            :label="item.label"
            :value="item.code"
            v-for="item in categoryList"
            :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成时间" prop="createTimeStart">
        <el-date-picker
          v-model="query.createTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions"
          @change="startDateChange"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="createTimeEnd" label-width="36px">
        <el-date-picker
          v-model="query.createTimeEnd"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="endDateChange"
          :picker-options="endPickerOptions"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="getList(true,true)" v-if="$isViewBtn('103501')">检索</el-button>
        <el-button size="small" @click="add" v-if="$isViewBtn('103502')">上传</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="table_th_center">
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="title" label="报告标题" min-width="8%" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span @click="previewReport(scope.row.attachment)" :class="$isViewBtn('103504')?'linkColor':''" >{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="生成时间" min-width="6%" format="yyyy-MM-dd" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime.substring(0,10)}}
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime"  label="上传时间"  min-width="6%"  format="yyyy-MM-dd" align="center">
        <!-- <template slot-scope="scope">
          {{scope.row.uploadTime.substring(0,10)}}
        </template> -->
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="下载" size="mini" type="primary" icon="el-icon-download" circle @click="handleDownLoad(scope.$index, scope.row)" v-if="$isViewBtn('103505')"></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.row)" v-if="$isViewBtn('103503')"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper"  @current-change="handleCurrentChange" :page-sizes="[15, 30, 50, 100]"
        :page-size="pageSize" @size-change="handleSizeChange" :total="total" :current-page="page" style="float:right;"></el-pagination>
    </el-col>
    <el-dialog title="上传舆情报告" :visible.sync="uploadDialogVisible" @close="resetForm('ycReportForm')">
      <el-form :model="ycReportForm" ref="ycReportForm" label-width="90px" style="width:94%;margin:10px auto 0;" v-loading="saveLoading">
        <el-form-item label="报告类型" prop="category">
          <el-select v-model="ycReportForm.category" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.code"
              v-for="item in categoryList"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告文件" prop="attachment" v-if="firstSubmitVisible">
          <el-upload ref="upload" drag multiple
            :action="uploadAction"
            :limit="10"
            :auto-upload="true"
            :file-list="uploadImgs"
            :on-success="imgSuccess"
            :on-remove="imgRemove"
            :on-preview="imgPreview"
            :before-remove="imgBfRemove"
            :before-upload="beforeUpload"
            :disabled="noauth">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">{{ UploadAttachment.tipText_ycReport_style }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button @click="cancelEdit" class="cancelBtn" :disabled="saveLoading">取 消</el-button>
          <el-button type="primary" class="saveBtn" @click="onSubmit(0)" :loading="saveLoading" :disabled="saveLoading">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
// import importexport from '@/api/importexport'
// import { uploadImg } from '@/utils/editorUpload'
export default {
  name: 'analysis',
  data() {
    return {
      nameCheckFlag: false, // true为重复
      uploadDialogVisible: false, // 上传弹框
      firstSubmitVisible: true,
      uploadAction: this.UploadAttachment.uploadFileUrl,
      noauth: false,
      category: '',
      saveLoading: false, // 弹框保存loading
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
      ycReportForm: {
        category: ''
      }, // 上传弹框表单
      listData: [],
      uploadImgs: [],
      query: {
        category: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      endPickerOptions: {},
      startPickerOptions: {}
    }
  },
  methods: {
    previewReport(item) { // 预览
      if (this.$isViewBtn('103504')) {
        item = JSON.parse(item)
        if (item.name) {
          var arr = item.name.split('.')
          if (arr[1] === 'doc' || arr[1] === 'docx') {
            this.$message({
              message: 'word暂不支持预览',
              type: 'warning'
            })
            return false
          }
        }
        window.open(item.path)
      }
    },
    onSubmit(state) {
      this.$refs.ycReportForm.validate(valid => {
        if (valid) {
          this.handleImg()
          if (this.uploadImgs.length === 0) {
            this.$message({
              message: '请至少选择一个文件',
              type: 'error'
            })
            return
          }
          const param = {
            attachment: this.ycReportForm.attachment,
            category: this.ycReportForm.category
          }
          this.saveLoading = true
          if (!this.nameCheckFlag) {
            // 不重复
            this.saveLoading = true
            this.$save('yqreport', param).then(response => {
              if (response.code === '000000') {
                this.saveLoading = false
                setTimeout(() => {
                  this.uploadDialogVisible = false
                }, 2000)
                this.$message({
                  message: '报告上传成功',
                  type: 'success'
                })
                this.getList() // 页面刷新
              }
            }).catch(() => {
              this.saveLoading = false
            })
          } else {
            this.$message({
              message: '文件名重复，请确认后重新上传',
              type: 'error'
            })
            this.saveLoading = false
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
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
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
    imgPreview(file) { },
    beforeUpload(file) {
      const fileName = file.name
      var type = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      if (this.uploadImgs.length > 0) {
        for (let i = 0; i < this.uploadImgs.length; i++) {
          if (this.uploadImgs[i].name === fileName) {
            console.log('文件名重复')
            this.nameCheckFlag = true
            return
          }
        }
      }
      // if(type.)
      // alert (fileName)
      // const wordReg = /^(application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(application\/msword)$/
      // const pdfReg = /^(application\/vnd.openxmlformats-officedocument.presentationml.presentation)|(application\/pdf)$/
      // const pptReg = /^(application\/vnd.ms-powerpoint)$/
      // const videoReg = /^(video\/mp4)|(video\/avi)|(video\/x-ms-wmv)$/
      // const audioReg = /^(audio\/mp3)$/

      let flag = false
      if (type === 'doc' || type === 'docx' || type === 'DOC' || type === 'DOCX' || type === 'pdf' || type === 'PDF') {
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

      this.$query('YQFILENAMECHECK', param).then(res => {
        this.btnLoading = false
        if (res.code === '000000') {
          if (Number(res.data[0].count) > 0) {
            this.nameCheckFlag = true
            return false
          } else {
            this.nameCheckFlag = false
          }
        }
      }).catch(() => {
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
      this.getList(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getList(true, true)
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
        this.ycReportForm.attachment = JSON.stringify(arr)
      }
    },
    getList(flag, hand) {
      this.page = flag ? 1 : this.page
      // 可以只输入开始或者结束；只输入结束时，开始默认2019-12-01
      if (this.query.createTimeStart && !this.query.createTimeEnd) { // 选择了开始时间,结束时间为空
        // this.query.createTimeEnd = this.$parseTime(new Date(), '{y}-{m}-{d}')
      } else if (!this.query.createTimeStart && this.query.createTimeEnd) {
        this.query.createTimeStart = '2019-12-01'
      }
      this.listLoading = true
      var para = {
        createTimeStart: this.query.createTimeStart,
        createTimeEnd: this.query.createTimeEnd,
        category: this.query.category
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      para.createTimeStart = para.createTimeStart ? para.createTimeStart + ' 00:00:00' : '' // 开始时间
      para.createTimeEnd = para.createTimeEnd ? para.createTimeEnd + ' 23:59:59' : '' // 结束时间
      this.$query('page/yqreport', para).then(response => {
        this.listLoading = false
        if (response.data) {
          this.listData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置
    reset() {
      this.filters = {}
    },
    // 添加
    add() {
      this.uploadImgs = []
      this.resetForm('ycReportForm')
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
      var item = JSON.parse(row.attachment)
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    // 删除
    handleDel(row) {
      this.$confirm('是否确定要删除当前报告', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$remove('YQREPORT/' + row.id, {}).then(response => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList(true) // 页面刷新
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    startDateChange(val) {
      if (val) {
        // this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.query.createTimeEnd = '' // 结束时间清空
        // this.endDateDisabled = true
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    }
  },
  mounted: function() {
    this.getList(true)
  }
}
</script>
