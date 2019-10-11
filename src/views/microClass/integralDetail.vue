<template>
  <div class="classRoom_integralDetail">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <p><strong>积分明细</strong></p>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="monthRecords" v-loading="loading" style="width: 100%;">
          <el-table-column prop="fractionTime" label="时间"></el-table-column>
          <el-table-column prop="fractionType" label="行为">
            <template slot-scope="scope">
              <span v-if="scope.row.fractionType === 0">登录</span>
              <span v-if="scope.row.fractionType === 1">学习资料</span>
              <span v-if="scope.row.fractionType === 2">资料上传</span>
              <span v-if="scope.row.fractionType === 3">资料下载</span>
              <span v-if="scope.row.fractionType === 4">学习时长</span>
            </template>
          </el-table-column>
          <el-table-column prop="fractionNumber" label="积分">
            <template slot-scope="scope">
              {{scope.row.fractionReckon === 0 ? '+' : '-'}}{{scope.row.fractionNumber}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                       :page-sizes="[10]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="totalCount" :current-page="pageNum" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        monthRecords: [],
        totalCount: 0,
        pageSize: 10,
        pageNum: 1
      }
    },
    methods: {
      // 页数改变事件
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.queryTotal()
      },
      // 页码改变事件
      handleCurrentChange(current) {
        this.pageNum = current
        this.queryTotal()
      },
      queryTotal() {
        this.loading = true
        const para = this.$setCurrentUser({})
        this.$query('page/userfractionlog', { id: para.creationId, pageSize: this.pageSize, pageNum: this.pageNum }).then(response => {
          this.monthRecords = response.data.list
          this.totalCount = response.data.totalCount
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      callback() {
        this.$gotoid('/micro/learningIntegral')
      }
    },
    mounted() {
      this.queryTotal()
    }
  }
</script>
<style>
  .classRoom_integralDetail p{
    margin-top: 10px;
  }
  .classRoom_integralDetail p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_integralDetail p strong{
    margin-right: 20px;
    font-size: 18px;
  }
  .classRoom_integralDetail .el-table__row .cell span{
    display: inline-block;
    width: 40%;
  }
  .classRoom_integralDetail .el-table__header th{
    border-bottom: 1px solid #ebeef5;
  }
</style>
