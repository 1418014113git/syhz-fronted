<template>
  <div class="db_end_tab_info" v-if="report">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="20" style="text-align: center;font-size: 18px;line-height: 33px">
        {{report.title}}
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="2" class="end_title">
        上报单位：
      </el-col>
      <el-col :span="7" class="end_content">
        {{report.deptName}}
      </el-col>
      <el-col :span="2" class="end_title">
        上报人：
      </el-col>
      <el-col :span="3" class="end_content">
        {{report.userName}}
      </el-col>
      <el-col :span="2" class="end_title">
        上报时间：
      </el-col>
      <el-col :span="6" class="end_content">
        {{report.createTime}}
        <el-button type="primary" @click="toEditReport" v-if="report.deptId === curDeptId && report.reportStatus < 3" style="float: right">修改</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="22" v-html="report.content" class="e-p-line ql-editor"></el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px; padding: 0 15px;">
      <el-col :span="22" v-if="attachmentList.length>0">
        相关下载：
        <p v-for="(item,index) in attachmentList" :key="index" style="padding-left: 30px;">
          <a @click="downFile(item.path)">{{item.name}}</a>
        </p>
      </el-col>
    </el-row>
  </div>
  <div class="db_end_tab_none_info" v-else>
    暂无报告
  </div>
</template>

<script>
  export default {
    name: 'DBEndTabInfo',
    props: ['reportData', 'curDeptId'],
    data() {
      return {
        report: {},
        attachmentList: [],
        dbId: this.$route.params.id
      }
    },
    methods: {
      downFile(path) {
        window.open(path)
      },
      toEditReport() {
        this.$router.push({ path: '/caseManage/dbendreport/' + this.dbId + '/' + this.report.id })
      }
    },
    mounted() {
      if (this.reportData) {
        this.report = this.reportData
        if (this.report.attachment) {
          this.attachmentList = JSON.parse(this.report.attachment)
        }
      }
    },
    watch: {
      reportData(val) {
        if (val) {
          this.report = val
          if (this.report.attachment) {
            this.attachmentList = JSON.parse(this.report.attachment)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .db_end_tab_info .end_title {
    padding: 5px;
    text-align: right;
  }

  .db_end_tab_info .end_content {
    padding: 5px;
  }

  .db_end_tab_info .row-bg {
    margin: 10px;
  }

  .db_end_tab_none_info {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
</style>
