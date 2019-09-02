<template>
  <section class="curriculumManage">
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-row>
          <el-col :span="4">
            <el-card style="overflow:auto;" :style="{maxHeight:countHeight}">
              <ul>
                <li class="menu" @click="getList('1')" :class="active === '1'?'activeSpan':''">
                  <i class="el-icon-document"></i>
                  <span>食品安全</span>
                </li>
              </ul>
              <ul>
                <li class="menu" @click="getList('2')" :class="active === '2'?'activeSpan':''">
                  <i class="el-icon-picture"></i>
                  <span>药品安全</span>
                </li>
              </ul>
              <ul>
                <li class="menu" @click="getList('3')" :class="active === '3'?'activeSpan':''">
                  <i class="el-icon-picture"></i>
                  <span>环境相关</span>
                </li>
              </ul>
              <ul>
                <li class="menu" @click="getList('4')" :class="active === '4'?'activeSpan':''">
                  <i class="el-icon-picture"></i>
                  <span>食药相关</span>
                </li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="18" class="content">
            <el-card>
              <el-table :data="curriculumData" v-loading="listLoading" style="width: 100%; margin-top: 5px;">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="授课教师：">
                        <span>{{ scope.row.teacher }}</span>
                      </el-form-item>
                      <el-form-item label="使用范围：">
                        <span>{{ scope.row.ranger }}</span>
                      </el-form-item>
                      <el-form-item label="上线时间：">
                        <span>{{ scope.row.onlineTime }}</span>
                      </el-form-item>
                      <el-form-item label="课程提供单位：">
                        <span>{{ scope.row.provider }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="time" label="时长"></el-table-column>
                <el-table-column prop="publish" label="发布状态" >
                  <template slot-scope="scope">
                    <span>{{ getPublish(scope.row.publish) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="审批状态">
                  <template slot-scope="scope">
                    <span>{{ getStatus(scope.row.status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- 待审核 -->
                    <template v-if="scope.row.status === 1">
                      <!-- 修改 -->
                      <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleRowEdit(scope.$index, scope.row)"></el-button>
                      <!-- 删除 -->
                      <el-button size="mini" type="primary" icon="el-icon-delete" circle @click="handleRowDel(scope.$index, scope.row)"></el-button>
                    </template>
                    <!-- 审核中 -->
                    <template v-if="scope.row.status === 2">
                      <!-- 审核 -->
                      <el-button size="mini" type="primary" icon="el-icon-tickets" circle @click="handleRowAudit(scope.$index, scope.row)"></el-button>
                    </template>
                    <!-- 通过 -->
                    <template v-if="scope.row.status === 3">
                      <!-- 发布 -->
                      <el-button v-if="scope.row.publish === 1" size="mini" type="primary" icon="el-icon-upload2" circle @click="handleRowPublish(scope.$index, scope.row)"></el-button>
                      <!-- 取消发布 -->
                      <el-button v-else-if="scope.row.publish === 2" size="mini" type="primary" icon="el-icon-download" circle @click="handleRowUnpublish(scope.$index, scope.row)"></el-button>
                    </template>
                    <!-- 驳回 -->
                    <template v-if="scope.row.status === 4">
                      <!-- 修改 -->
                      <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleRowEdit(scope.$index, scope.row)"></el-button>
                      <!-- 删除 -->
                      <el-button size="mini" type="primary" icon="el-icon-delete" circle @click="handleRowDel(scope.$index, scope.row)"></el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <div class="paginationWrap">
              <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                             :page-size="pageSize" :total="total" :current-page="page"></el-pagination>
            </div>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" plain @click="uploadBtn" > 上传 </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 添加和编辑 -->
    <el-dialog :title="titleText[dialogStatus]" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form ref="formDataRef" v-model="formData" label-width="110px" :rules="rules">
            <el-form-item label="课程名称：" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="课程分类：" prop="type">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程时长：" prop="time">
              <el-input v-model="formData.time"></el-input>
            </el-form-item>
            <el-form-item label="授课教师：" prop="teacher">
              <el-input v-model="formData.teacher"></el-input>
            </el-form-item>
            <el-form-item label="使用范围：" prop="ranger">
              <el-input v-model="formData.ranger"></el-input>
            </el-form-item>
            <el-form-item label="提供单位：" prop="provider">
              <el-input v-model="formData.provider"></el-input>
            </el-form-item>
            <el-form-item label="资料类型：" prop="resType">
              <el-select v-model="formData.resType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-upload v-if="formData.resType === '0'" class="upload-demo" drag :action="uploadvideoAction" multiple
                :on-success="pictureSuccess"
                :on-preview="pictureCardPreview"
                :on-remove="pictureRemove"
                :beforeUpload="beforeUploadVideo">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传MP4文件，且不超过1024M</div>
                </el-upload>
                <el-upload v-else-if="formData.resType === '1'" class="upload-demo" drag :action="uploaddocumentAction" multiple
                  :on-success="pictureSuccess"
                  :on-preview="pictureCardPreview"
                  :on-remove="pictureRemove"
                  :beforeUpload="beforeUploadDoc">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传txt、word(doc,docx)、ppt、excel文件，且不超过500M</div>
                  </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialog('formDataRef')">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'curriculumManage',
  data() {
    return {
      active: '1',
      uploadvideoAction: '',
      uploaddocumentAction: '',
      uploadVideoElement: false,
      uploadDocElement: false,
      titleText: {
        'add': '上传资料',
        'edit': '编辑资料'
      },
      dialogStatus: '',
      dialogVisible: false,
      formData: {
        name: '',
        time: '',
        teacher: '',
        ranger: '',
        provider: '',
        resType: '',
        type: '1'
      },
      listLoading: false,
      curriculumData: [],
      total: 0,
      page: 1,
      pageSize: 15,
      options: [{
        value: '0',
        label: '视频资源'
      }, {
        value: '1',
        label: '文档资料'
      }],
      options1: [{
        value: '1',
        label: '食品安全'
      }, {
        value: '2',
        label: '药品安全'
      }, {
        value: '3',
        label: '环境相关'
      }, {
        value: '4',
        label: '食药相关'
      }],
      typeTextMap: {
        '1': '食品安全',
        '2': '药品安全',
        '3': '环境相关',
        '4': '食药相关'
      },
      value: '',
      countHeight: null,
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        time: [{ required: true, message: '请输入课程时长', trigger: 'blur' }],
        teacher: [{ required: true, message: '请输入授课教师', trigger: 'blur' }],
        ranger: [{ required: true, message: '请输入使用范围', trigger: 'blur' }],
        provider: [{ required: true, message: '请输入提供单位', trigger: 'blur' }],
        resType: [{ required: true, message: '请输入资源类型', trigger: 'blur' }],
        type: [{ required: true, message: '请输入课程分类', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getStatus(status) {
      let retText = '未知'
      switch (status) {
        case 1:
          retText = '待审核'
          break
        case 2:
          retText = '审核中'
          break
        case 3:
          retText = '通过'
          break
        case 4:
          retText = '驳回'
          break
        default:
          break
      }
      return retText
    },
    getPublish(publish) {
      let retText = '未知'
      switch (publish) {
        case 1:
          retText = '未发布'
          break
        case 2:
          retText = '已发布'
          break
        default:
          break
      }
      return retText
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.active)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getList(this.active)
    },
    getList(type) {
      // haspage 标志从菜单进第一页
      this.active = type
      this.listLoading = true
      if (type === '1') {
        this.curriculumData = [
          { name: '食品安全基础知识', type: '1', time: '30分钟', teacher: '张教授', ranger: '全部', provider: '省厅', status: 1, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '食品安全法律法规', type: '1', time: '40分钟', teacher: '王教授', ranger: '全部', provider: '省厅', status: 2, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '食品安全标准', type: '1', time: '90分钟', teacher: '王教授', ranger: '全部', provider: '省厅', status: 3, publish: 2, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '食品安全风险管理与突发事件应急管理', type: '1', time: '90分钟', teacher: '王教授', ranger: '全部', provider: '省厅', status: 3, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '食品安全管理实务', type: '1', time: '30分钟', teacher: '王教授', ranger: '全部', provider: '省厅', status: 4, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' }
        ]
      } else if (type === '2') {
        this.curriculumData = [
          { name: '药物的电子监管', type: '2', time: '30分钟', teacher: '李老师', ranger: '全部', provider: '省厅', status: 1, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '有关药品的基本知识', type: '2', time: '30分钟', teacher: '赵老师', ranger: '全部', provider: '省厅', status: 2, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' },
          { name: '冷藏、冷冻药品的质量管理', type: '2', time: '30分钟', teacher: '赵老师', ranger: '全部', provider: '省厅', status: 3, publish: 1, onlineTime: '2019-04-01 09：00：01', resType: '1' }
        ]
      } else {
        this.curriculumData = []
      }
      this.total = this.curriculumData.length
      this.listLoading = false
    },
    confirmDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          return false
        }
      })
    },
    handleRowEdit(index, row) {
      this.dialogStatus = 'edit'
      this.formData = row
      this.dialogVisible = true
    },
    handleRowDel(index, row) {
      this.curriculumData.splice(index, index + 1)
    },
    handleRowAudit(index, row) {
      this.$confirm('确认通过此培训资料?', '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
        type: 'warning'
      }).then(() => {
        row.status = 3
        this.$message({
          type: 'success',
          message: '审批成功'
        })
      }).catch(() => {
        row.status = 3
        this.$message({
          type: 'error',
          message: '驳回成功'
        })
      })
    },
    handleRowPublish(index, row) {
      this.$confirm('确认发布此培训资料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.publish = 2
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消发布操作'
        })
      })
    },
    handleRowUnpublish(index, row) {
      this.$confirm('确认下架此培训资料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.publish = 1
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架操作'
        })
      })
    },
    uploadBtn() {
      this.formData = {
        name: '',
        time: '',
        teacher: '',
        ranger: '',
        provider: '',
        resType: '',
        type: '1'
      }
      this.dialogVisible = true
      this.value = ''
      this.dialogStatus = 'add'
    },
    pictureSuccess(response, file, fileList) {
      // this.cerBean.imgs.push(response.data)
      if (response.code === '000000') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.uploadVideoElement = false
        this.uploadDocElement = false
        this.value = ''
      } else {
        this.$message.error('上传失败')
      }
    },
    pictureRemove(file, fileList) {
      // this.cerBean.imgs.splice(this.cerBean.imgs.indexOf(file.url), 1)
    },
    pictureCardPreview(file) {
      // this.pictureDialog.dialogImageUrl = file.url
      // this.pictureDialog.dialogVisible = true
    },
    beforeUploadVideo(file) { // 上传视频限制
      var name = file.name.split('.')
      var arrayLength = name.length
      var fileType = name[arrayLength - 1]
      // const reg = /^(image\/jpg)|(image\/jpeg)|(image\/png)|(text\/plain)|(application\/octet-stream)$/
      const reg = /^(mp4)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传视频只支持MP4格式',
          type: 'warning'
        })
        return false
      }
    },
    beforeUploadDoc(file) { // 上传文件限制
      var name = file.name.split('.')
      var arrayLength = name.length
      var fileType = name[arrayLength - 1]
      // const reg = /^(image\/jpg)|(image\/jpeg)|(image\/png)|(text\/plain)|(application\/octet-stream)$/
      const reg = /^(txt)|(doc)|(docx)|(ppt)|(xlsx)|(xls)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传文件只支持txt、word(doc,docx)、ppt、excel',
          type: 'warning'
        })
        return false
      }
    }
  },
  mounted() {
    this.countHeight = document.documentElement.clientHeight - 180 + 'px'
    this.getList('1')
  }
}
</script>

<style scoped>
.curriculumManage .content {
  padding: 0 10px;
}
.curriculumManage .activeSpan {
  background-color: rgba(0, 160, 233, 0.6);
}
.curriculumManage .menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}
.curriculumManage .menu:hover {
  background-color: rgba(188, 232, 252, 0.1);
}

.curriculumManage .menu i {
  font-size: 18px;
  width: 24px;
}
.curriculumManage .paginationWrap {
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
</style>
