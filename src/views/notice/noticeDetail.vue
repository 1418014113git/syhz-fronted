<template>
<div class="noticeDetail">
  <el-row class="noticeCard">
    <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
  </el-row>
  <el-card class="noticeCard" v-loading="loading">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <div class="title">{{detailData.title}}</div>
        <div class="dataDetail bor_bottom">
          <div class="lineDetail">
            <div><span>发布单位：</span><span>{{detailData.creatorDeptName}}</span></div>
            <div><span>发布人：</span><span>{{detailData.creatorName}}</span></div>
            <div><span>发布时间：</span><span>{{this.$parseTime(detailData.createTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</span></div>
            <div v-if="detailData.signInfo !== undefined && String(detailData.signInfo.signStatus) === '1' && detailData.creatorId !== this.curUser.id"><span>未签收</span><el-button v-if="$isViewBtn('149007')" icon="el-icon-edit-outline" @click="signHandler">签收</el-button></div>
            <div v-if="detailData.signInfo !== undefined && String(detailData.signInfo.signStatus) === '2' && detailData.creatorId !== this.curUser.id"><span>已签收</span><el-button v-if="$isViewBtn('149002') && (detailData.parentId === undefined || detailData.parentId === null || detailData.parentId === '') && curDept.depType === '2'" @click="forwardHandler"><svg-icon icon-class="forward" style="margin-right: 5px;"></svg-icon>转发</el-button></div>
          </div>
          <div class="lineDetail" v-if="detailData.parentId">
            <div><span>转发单位：</span><span>{{detailData.forwardDeptName}}</span></div>
            <div><span>转发人：</span><span>{{detailData.forwardUserName}}</span></div>
            <div><span>转发时间：</span><span>{{this.$parseTime(detailData.forwardTime, '{y}-{m}-{d} {h}:{i}:{s}')}}</span></div>
          </div>
        </div>
        <div v-if="detailData.content && detailData.content !== ''" :style="detailData.content && detailData.content !== '' ? {maxHeight:tableHeight} : ''" class="noticeContent">
          <div v-html="detailData.content" class="e-p-line ql-editor" style="padding: 10px 50px;"></div>
        </div>
        <div class="dataDetail" v-if="detailData.fileList.length > 0">
          <p>通知附件</p>
          <div class="data_list">
            <p v-for="item in detailData.fileList" :key="item.key"><a @click="downFile(item)">{{item.name}}</a><a @click="downFile(item)"><el-button icon="el-icon-download">点击下载</el-button></a></p>
            <!--<p v-for="item in detailData.fileList" :key="item.key"><a :href="item.path" target="_blank" :download="item.name">{{item.name}}</a><a :href="item.path" target="_blank" :download="item.name"><el-button icon="el-icon-download">点击下载</el-button></a></p>-->
          </div>
        </div>
        <div class="dataDetail">
          <p>阅读/签收</p>
          <el-table :data="receiveList" v-loading="receiveListLoading" style="width: 100%;" min-height="78px">
            <el-table-column type="index" width="100" label="序号"></el-table-column>
            <el-table-column label="签收单位">
              <template slot-scope="scope">
                <span :title="scope.row.title" class="ellipsis-word">{{scope.row.receiverDeptName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="receiverName" label="签收人" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.receiverName">{{scope.row.receiverName}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="阅读状态" width="150">
              <template slot-scope="scope">
                <span v-if="String(scope.row.readStatus) === '1'" style="color: #dd4438">未读</span>
                <span v-if="String(scope.row.readStatus) === '2'">已读</span>
              </template>
            </el-table-column>
            <el-table-column prop="readTime" label="查阅时间" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.readTime">{{scope.row.readTime}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="签收状态" width="150">
              <template slot-scope="scope">
                <span v-if="String(scope.row.signStatus) === '1'" style="color: #dd4438">未签收</span>
                <span v-if="String(scope.row.signStatus) === '2'">已签收</span>
              </template>
            </el-table-column>
            <el-table-column prop="receiveTime" label="签收时间" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveTime">{{scope.row.receiveTime}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <span v-if="String(scope.row.signStatus) === '2'">--</span>
                <el-button v-if="String(scope.row.signStatus) === '1' && detailData.creatorId === curUser.id" :disabled="isClick(scope.row)" title="提醒签收" @click="remaindReceive(scope.row)" size="mini" icon="el-icon-warning" type="primary" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="receiveTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange_receive" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange_receive"
                           :page-size="receivePageSize" :current-page="receivePage" :total="receiveTotal" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
        <div class="dataDetail">
          <p>审核记录</p>
          <el-table :data="auditList" v-loading="auditListLoading" style="width: 100%;" min-height="78px">
            <el-table-column type="index" width="100" label="序号"></el-table-column>
            <el-table-column label="审核单位">
              <template slot-scope="scope">
                <span :title="scope.row.title" class="ellipsis-word">{{scope.row.acceptedDeptName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="examineName" label="审核人" width="150"></el-table-column>
            <el-table-column prop="updateTime" label="审核时间" width="220"></el-table-column>
            <el-table-column label="审核状态" width="180">
              <template slot-scope="scope">
                <span v-if="String(scope.row.status) === '0'">未提交</span>
                <span v-if="String(scope.row.status) === '1'">待审核</span>
                <span v-if="String(scope.row.status) === '2'">审核通过</span>
                <span v-if="String(scope.row.status) === '3'">审核通过</span>
                <span v-if="String(scope.row.status) === '4'">审核不通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="审核意见" width="400">
              <template slot-scope="scope">
                <span :title="scope.row.content" class="ellipsis-word">{{scope.row.content}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <!--<el-pagination v-if="auditTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange_audit" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange_audit"-->
                           <!--:page-size="auditPageSize" :current-page="auditPage" :total="auditTotal" style="float:right;">-->
            <!--</el-pagination>-->
          </el-col>
        </div>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
  import VueEditor from '@/components/Editor/VueEditor'
  import Attachment from '@/api/attachment'
  export default {
    name: 'noticeDetail',
    components: {
      VueEditor
    },
    data() {
      return {
        videoDialogVisible: false,
        audioDialogVisible: false,
        documentDialogVisible: false,
        playerDetail: {},
        uploadAction: Attachment.uploadFileUrl,
        id: '',
        callBack: '',
        loading: false,
        curDept: {},
        curUser: {},
        detailData: {
          fileList: [],
          signInfo: {}
        },
        tableHeight: null,
        receiveTotal: 0,
        receivePage: 1,
        receivePageSize: 15,
        auditTotal: 0,
        auditPage: 1,
        auditPageSize: 15,
        receiveList: [],
        receiveListLoading: false,
        auditList: [],
        auditListLoading: false
      }
    },
    methods: {
      downFile(item) {
        const arr = item.path.split('/file')
        const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
        this.$download_http_mg(path, { fileName: item.name })
      },
      isClick(row) {
        if (row.remindTime) {
          const remindTime = new Date(row.remindTime).getTime()
          const now = new Date(row.now).getTime()
          const c = now - remindTime
          return !(c / 1000 / 60 / 60 >= 24)
        } else {
          return false
        }
      },
      callback() {
        if (this.callBack === '') {
          this.$gotoid('/notice/index')
        }
        if (this.callBack === 'home') {
          this.$gotoid('/portal')
        }
      },
      readHandler() {
        const para = {
          id: this.detailData.signInfo.signId,
          userId: this.curUser.id,
          userName: this.curUser.realName,
          readStatus: 2
        }
        this.$update('notice/read', para).then(response => {
          this.receiveQuery()
        })
      },
      signHandler() {
        const para = {
          id: this.detailData.signInfo.signId,
          userId: this.curUser.id,
          userName: this.curUser.realName,
          signStatus: 2
        }
        this.$update('notice/sign', para).then(response => {
          this.$message({
            message: '签收成功',
            type: 'success'
          })
          this.$router.go(0)
        })
      },
      forwardHandler() {
        this.$gotoid('/notice/edit', JSON.stringify({ id: this.id, parentId: this.id }))
      },
      remaindReceive(row) {
        // 提醒签收
        this.loading = true
        const para = {
          title: this.detailData.title,
          creatorName: this.detailData.creatorName,
          creatorDate: this.detailData.createTime,
          userId: this.curUser.id,
          curDeptCode: this.curDept.depCode,
          curDeptName: this.curDept.depName,
          acceptDeptId: row.receiverDeptId,
          signId: row.signId
        }
        this.$update('notice/signRemind', para).then(response => {
          this.$message({
            message: '提醒签收成功',
            type: 'success'
          })
          this.receiveQuery()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      getDetail() {
        this.loading = true
        this.$query('notice/detail/' + this.id, { curDeptId: this.curDept.id }).then(response => {
          this.loading = false
          this.detailData = response.data
          if (response.data.attachements !== undefined && response.data.attachements !== null && response.data.attachements !== '') {
            this.detailData.fileList = JSON.parse(response.data.attachements)
          } else {
            this.detailData.fileList = []
          }
          if (this.detailData.signInfo !== undefined && String(this.detailData.signInfo.readStatus) === '1' && this.$isViewBtn('149007')) {
            this.readHandler()
          } else {
            this.receiveQuery()
          }
        }).catch(() => {
          this.loading = false
        })
      },
      receiveQuery() {
        this.receiveListLoading = true
        this.$query('page/basemessagesign', { messageId: this.id, pageNum: this.receivePage, pageSize: this.receivePageSize }).then(response => {
          this.receiveList = response.data.list
          this.receivePage = response.data.pageNum
          this.receiveTotal = response.data.totalCount
          this.receivePageSize = response.data.pageSize
          this.receiveListLoading = false
        }).catch(() => {
          this.receiveListLoading = false
        })
      },
      auditQuery() {
        this.auditListLoading = true
        this.$query('basemessageflowlsit', { messageId: this.id, pageNum: this.auditPage, pageSize: this.auditPageSize }).then(response => {
          this.auditList = response.data
          // this.auditList = response.data.list
          // this.auditPage = response.data.pageNum
          // this.auditTotal = response.data.totalCount
          // this.auditPageSize = response.data.pageSize
          this.auditListLoading = false
        }).catch(() => {
          this.auditListLoading = false
        })
      },
      handleCurrentChange_receive(currentPage) {
        this.receivePage = currentPage
        this.receiveQuery()
      },
      handleSizeChange_receive(val) {
        this.receivePage = 1
        this.receivePageSize = val
        this.receiveQuery()
      },
      handleCurrentChange_audit(currentPage) {
        this.auditPage = currentPage
        this.auditQuery()
      },
      handleSizeChange_audit(val) {
        this.auditPage = 1
        this.auditPageSize = val
        this.auditQuery()
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - 300 + 'px'
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.from) {
          this.callBack = para.from
        }
        if (para.id) {
          this.id = para.id
          this.getDetail()
          this.auditQuery()
        }
      }
    }
  }
</script>

<style>
  .noticeDetail{
    /*padding: 20px 40px;*/
    display: inline-block;
    width: 100%;
  }
  .noticeDetail .noticeCard{
    width: 100%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .noticeDetail .title{
    color: rgb(32, 160, 255);
    font-size: 26px;
    text-align: center;
    margin-bottom: 20px;
  }
  .noticeDetail div.lineDetail{
    width: 100%;
    padding-left: 20%;
    display: inline-block;
  }
  .noticeDetail .bor_bottom{
    border-bottom: 1px solid #eeeeee;
  }
  .noticeDetail div.lineDetail > div{
    float: left;
    width: 30%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .noticeDetail div.lineDetail > div:nth-child(2){
    width: 25%;
  }
  .noticeDetail div.lineDetail > div:nth-child(3){
    width: 25%;
  }
  .noticeDetail div.lineDetail > div:nth-child(4){
    width: 20%;
    text-align: right;
    padding-right: 20px;
  }
  .noticeDetail div.lineDetail > div:nth-child(4) > span:first-child{
    margin-right: 20px !important;
  }
  .noticeDetail div.lineDetail > div > span:first-child{
    width: 80px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }
  .noticeDetail .noticeContent{
    border-top: 1px solid #eeeeee;
    padding-top: 20px;
    overflow-y: auto;
  }
  .noticeDetail .dataDetail > p{
    display: inline-block;
    width: 100%;
    padding: 15px 5px 2px;
    font-weight: bold;
    border-bottom: 1px solid #eeeeee;
  }
  .noticeDetail .dataDetail .data_list{
    padding: 5px 10px;
  }
  .noticeDetail .dataDetail .data_list > p{
    display: inline-block;
    width: 100%;
  }
  .noticeDetail .dataDetail .data_list > p a:first-child{
    float: left;
    text-decoration: underline;
    cursor: pointer;
  }
  .noticeDetail .dataDetail .data_list > p a:last-child{
    float: right;
  }
  .noticeDetail .ellipsis-word{
    margin-bottom: 0;
    position: relative;
    top: 3px;
  }
  .noticeDetail .toolbar{
    margin-bottom: 2px;
  }
</style>
