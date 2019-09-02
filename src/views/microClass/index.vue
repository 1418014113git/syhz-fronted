<template>
  <div class="classIndex" v-loading="loading">
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-row>
          <el-col :span="4">
            <el-card>
              <ul>
                <li class="menu" @click="getList('document',1)" :class="active === '0'?'':'activeSpan'">
                  <i class="el-icon-document"></i>
                  <span>培训资料</span>
                </li>
                <!--<li class="menu">食品安全</li>-->
                <!--<li class="menu">药品安全</li>-->
                <!--<li class="menu">环境相关</li>-->
              </ul>
              <ul>
                <li class="menu" @click="getList('video',1)" :class="active === '0'?'activeSpan':''">
                  <i class="el-icon-picture"></i>
                  <span>在线课堂</span>
                </li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="18" class="content">
            <el-card style="overflow:auto;" :style="{maxHeight:countHeight}">
              <el-row class="row">
                <el-col v-if="type==='video'" :span="6" v-for="(o, index) in listData" :key="index" class="item">
                  <el-card :body-style="{ padding: '0px'}">
                    <div @click="toPlayer(index)">
                      <!--<img :src="o.img" class="image" >-->
                      <!--<svg-icon icon-class="screen" class="img_video"/>-->
                      <div class="img_video">
                        <i style="color: #00b0ff">V</i>
                        <i style="color: #00b0ff">i</i>
                        <i style="color: #00b0ff">d</i>
                        <i style="color: #ffffff">e</i>
                        <i style="color: #f1f1f1">o</i>
                      </div>
                      <div class="box">
                        <el-tooltip class="item"  placement="bottom-start" >
                          <div slot="content">{{filterTxt(o.name)}}</div>
                          <span style="cursor: default">{{filterTxt(o.name)}}</span>
                        </el-tooltip>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                <el-col v-if="type==='document'">
                  <ul>
                    <li class="file-li" @click="downFile(o.path)" v-for="(o, index) in listData" :key="index">
                      <span>{{index+1}}.</span>{{filterTxt(o.name)}}
                    </li>
                  </ul>
                </el-col>
                <el-col v-if="emptyData">
                  <div style="line-height: 100px; text-align: center;">暂无数据</div>
                </el-col>
              </el-row>
            </el-card>
            <div class="paginationWrap">
              <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                             :page-size="pageSize" :total="total" :current-page="page"></el-pagination>
            </div>
          </el-col>
          <!-- 上传 -->
          <el-col :span="2">
            <el-button type="primary" plain @click="uploadBtn" v-if="$isViewBtn('101001')"> 上  传 </el-button>
            <el-dialog title="上传资料" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" :close-on-click-modal="false">
              <span>类型&emsp;</span>
              <el-select v-model="value" placeholder="请选择" @change="typeChange">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- 上传视频 -->
              <el-upload v-if="uploadVideoElement" class="upload-demo" drag :action="uploadvideoAction" multiple
              :on-success="pictureSuccess"
              :on-preview="pictureCardPreview"
              :on-remove="pictureRemove"
              :beforeUpload="beforeUploadVideo">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传MP4文件，且不超过1024M</div>
              </el-upload>
              <!-- 上传文档 -->
              <el-upload v-else-if="uploadDocElement" class="upload-demo" drag :action="uploaddocumentAction" multiple
              :on-success="pictureSuccess"
              :on-preview="pictureCardPreview"
              :on-remove="pictureRemove"
              :beforeUpload="beforeUploadDoc">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传txt、word(doc,docx)、ppt、excel文件，且不超过500M</div>
              </el-upload>
              <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDialog">确 定</el-button>
              </span> -->
            </el-dialog>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getAttachmentList
} from '@/api/microClass'
import Attachment from '@/api/attachment'

export default {
  name: 'classIndex',
  components: {},
  data() {
    return {
      active: '0',
      uploadvideoAction: Attachment.uploadFilesUrl + '/video',
      uploaddocumentAction: Attachment.uploadFilesUrl + '/document',
      type: 'video',
      category: '',
      listData: [],
      loading: false,
      emptyData: false,
      dialogVisible: false,
      uploadVideoElement: false,
      uploadDocElement: false,
      total: 0,
      page: 1,
      pageSize: 15,
      options: [{
        value: '0',
        label: '在线课堂'
      }, {
        value: '1',
        label: '培训资料'
      }],
      value: '',
      countHeight: null
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      if (this.active === '0') {
        this.getList('video')
      } else if (this.active === '1') {
        this.getList('document')
      }
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      if (this.active === '0') {
        this.getList('video')
      } else if (this.active === '1') {
        this.getList('document')
      }
    },
    filterTxt(text) {
      if (text && text.indexOf('.') > 0) {
        return text
        // return text.substring(0, text.indexOf('.'))
      }
      return text
    },
    getList(type, haspage) {
      // haspage 标志从菜单进第一页
      this.type = type
      if (type === 'video') {
        this.active = '0'
      } else {
        this.active = '1'
      }
      const para = {
        type: type,
        name: haspage || this.page,
        pageSize: this.pageSize
      }
      this.loading = true
      this.listData = []
      getAttachmentList(para).then((response) => {
        this.loading = false
        if (response.data) {
          this.listData = response.data.list
          this.listData.length > 0 ? this.emptyData = false : this.emptyData = true

          this.total = response.data.totalCount // 总条数
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
        } else {
          this.emptyData = true
        }
      }).catch(() => {
        this.loading = false
        this.emptyData = true
      })
      // for (let i = 0; i < 10; i++) {
      //   this.listData.push({
      //     name: '假按揭发到付骄傲建瓯啊大家佛i较为发反馈发 觉得佛骄傲i废物发',
      //     path: 'http://pic.qiantucdn.com/58pic/32/21/53/50958PICdQNGxa8WdeaU2.mp4_10s.mp4'
      //   })
      // }
    },
    toPlayer(index) {
      this.$router.push({
        path: '/micro/player',
        query: {
          path: this.listData[index]['path']
        }
      })
    },
    downFile(path) {
      window.open(path)
    },
    uploadBtn() {
      this.dialogVisible = true
      this.uploadVideoElement = false
      this.uploadDocElement = false
      this.value = ''
    },
    typeChange(val) {
      if (val === '0') { // 视频资料
        this.uploadVideoElement = true
        this.uploadDocElement = false
      } else if (val === '1') { // 文档资料
        this.uploadVideoElement = false
        this.uploadDocElement = true
      } else {
        this.uploadVideoElement = false
        this.uploadDocElement = false
      }
    },
    confirmDialog() {
      this.dialogVisible = false
    },
    handleClose(done) {
      done()
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
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
        if (response.data.type === 'document') { // 此次上传的是文档
          this.getList('document', 1)
        } else if (response.data.type === 'video') { // 此次上传的是视频
          this.getList('video', 1)
        }
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
    // console.log(this.uploadvideoAction)
    if (this.$route.query.t) { // 视频播放返回列表
      this.getList('video')
    } else {
      this.getList('document')
    }
    // this.style.height = window.innerHeight - 200 + 'px'
    // this.style.maxHeight = window.innerHeight - 200 + 'px'
    // this.style.overflowY = 'scroll'
  }
}
</script>

<style scoped>
.classIndex .content {
  padding: 0 10px;
}

.classIndex .is-always-shadow {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.classIndex .item {
  padding: 20px;
}

.classIndex .item .box {
  font-size: 12px;
  width: 100%;
  padding: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.classIndex .img_video {
  font-family: Cambria;
  width: 100%;
  padding: 35px;
  background-color: #3c4043;
  color: #fff;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
}

.classIndex .file-li {
  cursor: pointer;
  font-size: 14px;
  padding: 10px 20px;
}

.classIndex .file-li:hover {
  background-color: rgba(0, 160, 233, 0.6);
}

.classIndex .file-li span {
  font-size: 14px;
  padding-right: 10px;
  font-weight: bold;
}

.classIndex .el-menu {
  border-right: 0;
}

.classIndex .menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}
.classIndex .menu:hover {
  background-color: rgba(188, 232, 252, 0.1);
}

.classIndex .menu i {
  font-size: 18px;
  width: 24px;
}
.classIndex .upload-demo {
  margin-top: 20px;
}
.classIndex .paginationWrap {
  text-align: right;
}
.classIndex .activeSpan {
  background-color: rgba(0, 160, 233, 0.6);
}
.classIndex div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(152, 182, 200, 0.4);
  box-shadow: inset 0 0 5px rgba(239, 241, 243, 0.4);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.4);
}
</style>
