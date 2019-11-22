<template>
<!-- 接警处 -->
  <div class="ajInfo jjccout">
    <title-pub title="接处警" url=""></title-pub>
    <el-table :data="jcjData" style="width: 100%;" v-loading="jcjLoading" class="statisticCollect" max-height="156">
      <el-table-column type="index" label="序号" width="52"></el-table-column>
      <el-table-column prop="BJR" label="报警人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BJNR" label="报警内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="JJSJ" label="接警时间"  width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.JJSJ">{{$handlerDateTime(scope.row.JJSJ)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="JJR_NAME" label="接警人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CJSJ" label="出警时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.CJSJ">{{$handlerDateTime(scope.row.CJSJ)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CZHR_NAME" label="出警人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CZHDW_NAME" label="出警单位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CJXQ" label="处警情况" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets"  circle @click="handleDetail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="totalJcj > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeJcj" :page-sizes="[5,10,15,20]"  @size-change="handleSizeChange"
                :page-size="pageSize" :total="totalJcj" :current-page="pageJcj" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="接警处详情" :visible.sync="detailDialog" width="65%">
      <police-detail :jjcInfo="jjcCurDetail"></police-detail>
    </el-dialog>
  </div>

</template>
<script>
import titlePub from './titlePub'
import PoliceDetail from './policeDetail'
export default {
  props: ['ajbh'],
  name: 'index',
  components: {
    titlePub,
    PoliceDetail
  },
  data() {
    return {
      jcjData: [],
      jcjLoading: false,
      detailDialog: false,
      pageSize: 5,
      pageJcj: 1, // 接处警
      totalJcj: 0,
      AJBH: '',
      jjcCurDetail: {} // 当前被点击的列表信息
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
      if (this.AJBH) {
        this.handleJcj(true)
      }
    },
    handleJcj(flag) { // 接处警
      this.jcjLoading = true
      var param = {
        AJBH: this.AJBH,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.pageJcj
      }
      this.$query('page/ajdetailreceive', param).then((response) => {
        this.jcjLoading = false
        if (response.code === '000000') {
          this.jcjLoading = false
          this.jcjData = response.data.list
          this.totalJcj = response.data.totalCount
          this.pageSize = response.data.pageSize
          this.$resetSetItem('aj6', this.totalJcj) // 将总数存在session中
        }
      }).catch(() => {
        this.jcjLoading = false
      })
    },
    handleCurrentChangeJcj(val) { // 接处警分页
      this.pageJcj = val
      this.handleJcj(false)
    },
    handleSizeChangej(val) { // 接处警条数
      this.pageJcj = 1
      this.pageSize = val
      this.handleJcj(false)
    },
    handleDetail(row) { // 接警处详情弹框
      this.detailDialog = true
      this.jjcCurDetail = row
    }

  },
  mounted() {
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.jjccout {
  .el-dialog {
    margin-top: 8vh !important;
    height: 90%;
    overflow: auto;
  }
}
</style>
