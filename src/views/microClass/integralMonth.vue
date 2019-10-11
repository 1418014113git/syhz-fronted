<template>
  <div class="classRoom_integralMonth">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <p><strong>当月积分排名</strong></p>
      <div class="count">
        <span><strong>人数：{{total.dayUserCount}} 人</strong></span>
        <span><strong>我的积分：{{total.daybranchCount}}</strong></span>
        <span><strong>我的排名：{{total.dayOrder}}</strong></span>
      </div>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="monthRecords" v-loading="loading" style="width: 100%;">
          <el-table-column type="index" label="排名" width="100">
            <template slot-scope="scope">
              {{parseInt(scope.$index + 1) + index}}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="dept" label="所在单位"></el-table-column>
          <el-table-column prop="fractionNumber" label="积分数"></el-table-column>
        </el-table>
      </el-row>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                       :page-sizes="[10,15,30,50,100]" @size-change="handleSizeChange"
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
        index: 0,
        loading: false,
        monthRecords: [],
        total: {
          systemOrder: 0,
          systemUserCount: 0,
          systembranchCount: 0,
          daybranchCount: 0,
          dayOrder: 0,
          dayUserCount: 0
        },
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
        this.$query('fractionlog', { id: para.creationId, pageSize: this.pageSize, pageNum: this.pageNum }).then(response => {
          this.total = response.data.fraction
          this.monthRecords = response.data.monthRank.list
          this.totalCount = response.data.monthRank.totalCount
          this.pageNum = response.data.monthRank.pageNum
          this.pageSize = response.data.monthRank.pageSize
          this.dayFraction = response.data.dayFraction
          this.index = this.pageNum * this.pageSize - this.pageSize
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
  .classRoom_integralMonth p{
    margin-top: 35px;
    margin-bottom: 20px;
  }
  .classRoom_integralMonth p:first-child{
    margin-top: 10px;
  }
  .classRoom_integralMonth p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_integralMonth p strong{
    margin-right: 20px;
    font-size: 18px;
  }
  .classRoom_integralMonth .count {
    width: 100%;
    padding: 6px 10px;
    background: rgba(0, 89, 130, 0.7);
  }
  .classRoom_integralMonth .count > span{
    display: inline-block;
    width: 18%;
  }
  .classRoom_integralMonth .count > span:first-child{
    width: 15%;
  }
  .classRoom_integralMonth .count > span strong{
    font-size: 16px;
  }
  .classRoom_integralMonth .el-table__row .cell span{
    display: inline-block;
    width: 40%;
  }
  .classRoom_integralMonth .el-table__header th{
    border-bottom: 1px solid #ebeef5;
  }
</style>
