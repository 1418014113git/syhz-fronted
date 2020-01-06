<template>
  <section style="margin-top:12px;">
    <!-- <el-table ref="goodTable" :data="flwsData" v-loading="flwsLoading" max-height="186" class="statisticCollect" style="width:100%;"> -->
    <el-table ref="goodTable" :data="flwsData" v-loading="flwsLoading" class="statisticCollect" style="width:100%;">
      <el-table-column type="index" label="序号" width="56px" fixed></el-table-column>
      <el-table-column prop="flwsmc" label="名称" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="wh" label="文号" min-width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tfdwName" label="填发单位" min-width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tfrq" label="填发日期" width="110px">
        <template slot-scope="scope">
           <span>{{$handlerDateTime(scope.row.tfrq)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tfrName" label="填发人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sfyxName" label="是否有效" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spbsName" label="审批标识" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sjly" label="来源" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
           <span>{{handlerSjly(scope.row.sjly)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="95px">
        <template slot-scope="scope">
          <el-button type="info" icon="el-icon-document" circle title="详情" @click="handleFlwsDetail(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="handleFlwsDelete(scope.row)" v-if="scope.row.sjly===0"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="totalFlws > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeFlws" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeFlws"
                    :page-size="pageSizeFlws" :total="totalFlws" :current-page="pageFlws" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog title="法律文书详情" :visible.sync="flwsDetailDialog" v-loading="dialogLoading" width="60%">
      <!-- pdf -->
      <iframe v-show="curFlwsDetail.sjly===1 && curFlwsDetail.pdf" :src="iframeSrc" frameborder="0" style="width: 100%; height: 500px;"></iframe>
      <!-- html -->
      <!-- <div v-show="curFlwsDetail.sjly===1 && curFlwsDetail.html" v-html="iframeSrc"></div> -->
      <iframe v-show="curFlwsDetail.sjly===1 && curFlwsDetail.html" :src="iframeSrc" frameborder="0" style="width: 100%; height: 500px;background:#ffffff;"></iframe>
      <!-- 图片和附件 -->
      <div v-show="curFlwsDetail.sjly===0">
        <el-carousel indicator-position="outside"  class="carouselImg" :autoplay="false">
          <el-carousel-item v-for="item in detailImgs" :key="item" style="display: flex;justify-content: center;align-items: center;">
            <img :src="item" alt="" srcset="" style="max-width:100%;max-height:100%;">
          </el-carousel-item>
        </el-carousel>
        <div v-if="detailFiles.length>0">
          <p>附件下载</p>
          <p v-for="(item,index) in detailFiles" :key="index" style="padding-left: 30px;">
            <a :download="item.name" :href="item.path" style="text-decoration: underline;">{{item.name}}</a>
          </p>
        </div>
      </div>
      <p style="text-align:center;">
        <el-button @click="closeDia">关闭</el-button>
      </p>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: ['ajbh'],
  name: 'index',
  data() {
    return {
      flwsData: [],
      flwsLoading: false,
      pageFlws: 1, // 法律文书
      totalFlws: 0,
      pageSizeFlws: 5,
      flwsDetailDialog: false,
      dialogLoading: false,
      curFlwsDetail: {},
      iframeSrc: '',
      detailImgs: [],
      detailFiles: [],
      curDept: {} // 当前部门
    }
  },
  watch: {
    ajbh(val) {
      if (val) {
        this.AJBH = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.queryList(true)
      }
    },
    queryList(flag) {
      this.flwsLoading = true
      var param = {
        ajbh: this.AJBH,
        // ajbh: 'J1504296813050800001',
        pageSize: this.pageSizeFlws,
        pageNum: flag ? 1 : this.pageFlws
      }
      this.$query('page/ajflws', param).then((res) => {
        this.flwsLoading = false
        if (res.code === '000000') {
          this.flwsData = res.data.list
          this.totalFlws = res.data.totalCount
          this.pageSizeFlws = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.$emit('totalFlws', this.totalFlws)
          }
        }
      }).catch(() => {
        this.flwsLoading = false
      })
    },
    handleFlwsDetail(row) { // 法律文书详情
      this.dialogLoading = true
      this.flwsDetailDialog = true
      this.detailImgs = []
      this.iframeSrc = ''
      this.$query('flws/detail/' + row.flwsbh, {}).then((res) => {
        this.dialogLoading = false
        if (res.code === '000000') {
          this.curFlwsDetail = res.data
          if (res.data.sjly === 0) { // 本平台上传的
            this.curFlwsDetail.imgPaths = JSON.parse(this.curFlwsDetail.imgPaths)
            this.detailImgs = this.curFlwsDetail.imgPaths.images.split(',')
            var files = (this.curFlwsDetail.imgPaths.others).split('|')
            this.detailFiles = []
            for (let index = 0; index < files.length; index++) {
              var element = files[index]
              element = JSON.parse(element)
              element.path = '/attachment/' + element.path.substring(element.path.indexOf('file'), element.path.length)
              this.detailFiles.push(element)
            }
          } else if (res.data.sjly === 1) { // pdf 或者 html
            if (res.data.pdf) {
              this.iframeSrc = '/syhz/flws/pdf/' + row.flwsbh
            } else if (res.data.html) {
              this.iframeSrc = '/syhz/flws/html/' + row.flwsbh
            }
          }
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    handleFlwsDelete(row) { // 法律文书删除
      this.$confirm('确认删除该法律文书吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.flwsLoading = true
        var param = {
          ajbh: this.AJBH,
          deptId: this.curDept.id,
          deptCode: this.curDept.depCode
        }
        this.$update('flws/delete/' + row.flwsbh, param).then((response) => {
          this.flwsLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.queryList(false)
          }
        }).catch(() => {
          this.flwsLoading = false
        })
      }).catch(() => {
        this.flwsLoading = false
      })
    },
    handleCurrentChangeFlws(val) { // 法律文书分页
      this.pageFlws = val
      this.queryList(false)
    },
    handleSizeChangeFlws(val) { // 法律文书条数
      this.pageSizeFlws = val
      this.pageFlws = 1
      this.queryList(false)
    },
    handlerSjly(val) {
      var valName = ''
      if (val === 0) {
        valName = '本平台上传'
      } else if (val === 1) {
        valName = '警综'
      }
      return valName
    },
    closeDia() { // 关闭弹框
      this.flwsDetailDialog = false
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.init()
  }

}
</script>
<style  rel="stylesheet/scss" lang="scss">
.carouselImg {
  .el-carousel__item {
    text-align: center;
  }
}
</style>


