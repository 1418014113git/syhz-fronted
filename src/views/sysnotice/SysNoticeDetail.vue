<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="22">
          <div id="noticetitle" :title="notice.title" style="text-align:center;margin-left:30px;margin-top:0;margin-bottom:0">{{notice.title}}</div>
        </el-col>
        <el-col :span="2">
          <img src="@/assets/icon/back.png" class="goBack" @click="goBack" />
        </el-col>
        <!--返回-->
      </el-row>

      <el-row style="margin-top:15px">
        <el-col :span="12" style="float:left;text-align:left">
          {{notice.publishPersonOrg}} &nbsp;&nbsp;
          <span
            :title="notice.publishDate"
            id="publishDate"
          >{{notice.publishDate | formatDate}}</span>
        </el-col>
        <el-col :span="6" style="float:right;text-align:right">{{viewCount}}&nbsp;&nbsp;次阅读</el-col>
      </el-row>
      <hr id="tophr" />
      <div class="content e-p-line ql-editor" v-html="notice.content"></div>
      <hr id="bottomhr" />

      <el-row style="margin-top:15px;">
        <a
          href="#"
          v-if="prev.id!=''"
          type="primary"
          style="float:left"
          @click="getSysNoticeById(prev.id)"
        >上一篇:&nbsp;{{prev.title}}</a>

        <a
          href="#"
          v-if="next.id!=''"
          type="primary"
          style="float:right"
          @click="getSysNoticeById(next.id)"
        >下一篇:&nbsp;{{next.title}}</a>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      // 存储系统通知明细数据
      noticeinfo: {
        id: '',
        noticeId: '',
        viewPerson: '',
        viewTime: '',
        viewPersonOrg: ''
      },
      notice: {
        id: '',
        title: '',
        content: '',
        publishPerSonId: '',
        publishPersonName: '',
        publishDate: '',
        startDate: '',
        endDate: '',
        status: '',
        viewCount: '',
        publishPersonOrg: ''
      },
      next: {
        id: '',
        title: '',
        content: '',
        publishPerSonId: '',
        publishPersonName: '',
        publishDate: '',
        startDate: '',
        endDate: '',
        status: '',
        viewCount: '',
        publishPersonOrg: ''
      },
      prev: {
        id: '',
        title: '',
        content: '',
        publishPerSonId: '',
        publishPersonName: '',
        publishDate: '',
        startDate: '',
        endDate: '',
        status: '',
        viewCount: '',
        publishPersonOrg: ''
      },
      viewCount: ''
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },
  methods: {
    getSysNoticeById(id) {
      // 使用ID查询单条数据
      this.$query('sysnotice/' + id)
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000' && res.data) {
            this.notice.id = res.data.id
            this.notice.title = res.data.title
            this.notice.status = '' + res.data.status
            this.notice.content = res.data.content
            this.notice.publishDate = res.data.publishDate
            this.notice.publishPersonOrg = res.data.publishPersonOrg
            this.notice.startDate = res.data.startDate
            this.notice.endDate = res.data.endDate
            // this.notice.viewCount = res.data.viewCount

            // 存储系统通知明细表
            this.noticeinfo = {}
            this.noticeinfo.noticeId = id
            this.noticeinfo.viewPerson = sessionStorage.getItem('realName')
            this.noticeinfo.viewTime = parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}')
            this.noticeinfo.viewPersonOrg = JSON.parse(sessionStorage.getItem('depToken'))[0].depName
            this.$save('sysnoticeinfo', this.noticeinfo).then(res => {
              // 分组查询浏览次数
              this.$query('sysnoticeview/' + id).then(res => {
                if (res.code === '000000' && res.data) {
                  this.viewCount = res.data.count
                  // 更新浏览次数
                  this.notice.viewCount = this.viewCount
                  this.$update('sysnotice/' + this.notice.id, this.notice)
                }
              })
            })
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
      this.getPrevSysNoticeById(id)
      this.getNextSysNoticeById(id)
    },
    getNextSysNoticeById(id) {
      // 使用ID查询下一条数据
      this.$query('sysnoticenext/' + id)
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000' && res.data) {
            this.next.id = res.data.id
            this.next.title = res.data.title
            this.next.content = res.data.content
            this.next.viewCount = res.data.viewCount
          } else {
            this.next.id = ''
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    getPrevSysNoticeById(id) {
      // 使用ID查询上一条数据
      this.$query('sysnoticeprev/' + id)
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000' && res.data) {
            this.prev.title = res.data.title
            this.prev.id = res.data.id
            this.prev.content = res.data.content
            this.prev.viewCount = res.data.viewCount
          } else {
            this.prev.id = ''
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    goBack() {
      if (this.$route.query.fromindex) {
        this.$router.push('/portal')
      } else {
        this.$router.push('/sysnotice/SysNoticeList')
      }
    }
  },
  mounted() {
    var id = sessionStorage.getItem(this.$route.path)
    if (id) {
      this.getSysNoticeById(id)
      this.getNextSysNoticeById(id)
      this.getPrevSysNoticeById(id)
    }
  },
  created() {
    var id = this.$route.params.id

    if (id) {
      this.getSysNoticeById(id)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@media only screen and (max-width: 1367px) {
  .el-col-14 {
    width: 85.3% !important;
  }
}
#tophr {
  // border-top: 1px solid #00a0e9;
  border-color: #00a0e9;
}
#bottomhr {
  // border-top: 1px dashed #00a0e9;
  border-style: dashed;
  border-color: #00a0e9;
}
a:hover {
  color: #00a0e9;
}
#noticetitle {
  font-size: 30px;
}
.content {
  margin-left: 50px;
  margin-right: 50px;
}
</style>

