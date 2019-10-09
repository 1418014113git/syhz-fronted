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
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        monthRecords: []
      }
    },
    methods: {
      queryTotal() {
        this.loading = true
        const para = this.$setCurrentUser({})
        this.$query('userfractionlog', { id: para.creationId }).then(response => {
          this.monthRecords = response.data
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
