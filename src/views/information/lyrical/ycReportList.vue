<template>
  <section class="knowLedgeBase">
    <el-row>
      <el-col :span="4">
        <el-card v-loading="leftLoading" :style="'height:'+clientHeight+'px'">
          <div slot="header"><span>舆情报告</span></div>
          <!--<div class="all">全部（{{ totalData.total }}）</div>-->
          <ul>
            <li class="menu" @click="handleMenuClick('1')" :class="active === '1' ? 'activeSpan' : ''">
              <!-- <i class="el-icon-picture"></i> -->
              <i class="el-icon-document"></i>
              <span>舆情日报（{{ totalData.day }}）</span>
            </li>
          </ul>
          <ul>
            <li class="menu" @click="handleMenuClick('2')" :class="active === '2' ? 'activeSpan' : ''">
              <i class="el-icon-document"></i>
              <span>舆情周报（{{ totalData.week }}）</span>
            </li>
          </ul>
          <ul>
            <li class="menu" @click="handleMenuClick('3')" :class="active === '3' ? 'activeSpan' : ''">
              <i class="el-icon-document"></i>
              <span>舆情月报（{{ totalData.month }}）</span>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="20" class="content">
        <el-card :style="'height:'+clientHeight+'px'" v-loading="rightLoading" >
          <el-form :inline="true" :model="filters" label-width="80px" class="reportForm">
            <el-form-item label="生成时间" prop="createTimeStart">
              <el-date-picker
                class="inputw"
                v-model="filters.createTimeStart"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="createTimeStartPickerOptions"
                placeholder="请选择开始时间"
                @change="createTimeStartChange">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至" prop="createTimeEnd" class="datezhi">
              <el-date-picker
                class="inputw"
                v-model="filters.createTimeEnd"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间"
                :picker-options="createTimeEndPickerOptions"
                @change="createTimeEndChange">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getList">检索</el-button>
            </el-form-item>
          </el-form>
          <div style="margin:15px 0 10px;">
            <el-checkbox v-model="allCheck" style="margin-right:20px;">全部</el-checkbox>
            <el-button type="primary" size="small" @click="getList">批量下载</el-button>
          </div>
          <!-- <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange"> -->
          <div class="file_data_list clearfix" :style="'height:'+(clientHeight-120)+'px;overflow-y:auto;'">
            <div v-for="item in listData" :key="item.key" class="file_data" @click="handlerClick(item)">
              <div>
                <el-checkbox v-model="item.check" class="checkbox"></el-checkbox>
                <img src="/static/image/lyrivalinfo_images/video.png" class="right_img"/>
                <div class="file_name">{{item.title}}</div>
              </div>
              <div class="file_mask"></div>
              <div class="hover_div">
                <i class="el-icon-download" @click="downloadSingle(item.attachment)"></i>
                <i class="el-icon-menu" @click="previewReport(item.attachment)"></i>
              </div>
            </div>
          </div>
          <!-- </el-checkbox-group> -->
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper"  @current-change="handleCurrentChange" :page-sizes="[15, 30, 50, 100]"
              :page-size="pageSize" @size-change="handleSizeChange" :total="total" :current-page="page" style="float:right;"></el-pagination>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  data() {
    return {
      leftLoading: true,
      rightLoading: true,
      clientHeight: 0, // 页面高度
      totalData: [], // 左侧合计数量
      listData: [], // 右边列表
      active: '1', // 默认选中 舆情日报
      createTimeEndPickerOptions: {},
      createTimeStartPickerOptions: {},
      filters: {
        createTimeStart: '',
        createTimeEnd: '',
        category: 1
      },
      pageSize: 15,
      total: 0,
      page: 1,
      allCheck: false,
      checkedCities: []
    }
  },
  watch: {},
  methods: {
    handleCheckedCitiesChange() {

    },
    queryYqList(flag, hand) {
      this.page = flag ? 1 : this.page
      const para = {
        createTimeStart: this.filters.createTimeStart,
        createTimeEnd: this.filters.createTimeEnd,
        category: this.filters.category,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.rightLoading = true
      this.$query('page/yqreport', para).then(response => {
        this.rightLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.listData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        } else {
          this.listData = []
        }
      }).catch(() => {
        this.rightLoading = false
      })
    },
    downloadSingle(item) { // 单个下载
      item = JSON.parse(item)
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    previewReport(item) {
      item = JSON.parse(item)
      window.open(item.path)
    },
    handlerClick() { },
    src() { },
    getList() { },
    handleMenuClick(type) {
      this.filters.category = type
      this.active = type
      this.queryYqList(true)
    },
    createTimeEndChange() { },
    createTimeStartChange() { },
    handleCurrentChange(val) {
      this.page = val
      this.queryYqList()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryYqList()
    },
    queryTotal() {
      this.leftLoading = true
      const para = {}
      this.$query('yqreport/total', para).then(response => {
        this.leftLoading = false
        if (response.data) {
          this.totalData = response.data
        }
      }).catch(() => {
        this.leftLoading = false
      })
    },

    handleRowEdit(index, row) { },
    handleRowDel(index, row) { },

    closeDialog() {
      this.auditDialogVisible = false
      this.auditForm = {
        auditId: '',
        remark: '',
        workId: '',
        documentId: '',
        userId: ''
      }
      this.isBatchAudit = false
      this.$refs.auditForm.resetFields()
    }
  },
  mounted() {
    this.queryTotal() // 查左侧数量
    this.queryYqList() // 查右边列表
    this.clientHeight = document.documentElement.clientHeight - 150
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.file_data {
  // width: 150px;
  width: 18%;
  height: 110px;
  float: left;
  margin: 10px;
  border: 1px solid #00a0e9;
  border-radius: 10px;
  background-color: rgba(0, 63, 94, 0.6);
  cursor: pointer;
  text-align: center;
  position: relative;
  /* background-image: "/static/image/online/hj.jpg"; */
  .checkbox {
    position: absolute;
    top: 2px;
    left: 6px;
    margin: 0;
  }
  .right_img {
    width: 42px;
    position: absolute;
    top: 0;
    right: -1px;
  }
  .file_name {
    line-height: 110px;
  }
  .file_mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    // z-index: 2;
  }
  .hover_div {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // z-index: 3;
    i {
      font-size: 28px;
      line-height: 110px;
      margin: 0 10px;
    }
  }
}
.file_data_list .file_data:nth-child(5n-4) {
  margin-left: 0;
}
.file_data_list .file_data:nth-child(5n) {
  margin-right: 0;
}
.file_data:hover .file_mask,
.file_data:hover .hover_div {
  display: inline-block;
  // border: 2px solid #186ffd;
}
.reportForm {
  border-bottom: 1px dashed #00a0e9;
}

.knowLedgeBase .content {
  padding: 0 10px;
}
.knowLedgeBase .menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}
.knowLedgeBase .menu.activeSpan,
.knowLedgeBase .menu.activeSpan:hover {
  background-color: rgba(0, 160, 233, 0.6);
}
.knowLedgeBase .menu:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
.knowLedgeBase .menu i {
  font-size: 18px;
  width: 24px;
}
// .file_data > p {
//   width: 100%;
//   display: inline-block;
//   height: 40px;
//   line-height: 40px;
//   border-bottom: 2px solid #fff;
// }
/* .file_data > p > span {
  float: left;
}
.file_data > p > span:last-child {
  float: right;
  margin-right: 10px;
  cursor: pointer;
} */
// .file_data .file_data_list:nth-child(4n) {
//   margin-right: 0;
// }
/* .file_data .file_data_list .img {
  position: relative;
  width: 150px;
  height: 200px;
} */
/* .file_data .file_data_list .img > img {
  width: 150px;
  height: 200px;
} */
// .file_data .file_data_list .img .tag {
//   position: absolute;
//   bottom: 0;
//   height: 30px;
//   line-height: 30px;
//   width: 100%;
//   padding-left: 10px;
//   background-color: #000;
//   background-color: rgba(0, 0, 0, 0.6);
//   font-size: 14px;
//   opacity: 0.1;
// }
// .file_data .file_data_list .title {
//   margin: 20px 0 5px;
//   text-overflow: ellipsis;
//   width: 100%;
//   word-break: break-all;
//   overflow: hidden;
//   white-space: nowrap;
// }
// .file_data .file_data_list .time {
//   color: #ccc;
//   font-size: 14px;
//   margin-top: 20px;
// }
// .file_data .file_data_list .time > span {
//   float: left;
// }
// .file_data .file_data_list .time > span:last-child {
//   float: right;
// }
// .file_data > div > div {
//   height: 309px;
//   width: 100%;
//   text-align: center;
//   line-height: 309px;
//   color: #c9edfc;
//   text-shadow: 0 0 2px #fff;
// }
</style>
