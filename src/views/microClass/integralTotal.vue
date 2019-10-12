<template>
  <div class="classRoom_integralTotal">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <p><strong>总积分排名</strong></p>
      <div class="count">
        <span><strong>人数：{{total.systemUserCount}} 人</strong></span>
        <span><strong>我的积分：{{total.systembranchCount}}</strong></span>
        <span><strong>我的排名：{{total.systemOrder}}</strong></span>
      </div>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="totalRecords" v-loading="loading" style="width: 100%;">
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
                       :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
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
        total: {
          systemOrder: 0,
          systemUserCount: 0,
          systembranchCount: 0,
          daybranchCount: 0,
          dayOrder: 0,
          dayUserCount: 0
        },
        totalRecords: [],
        totalCount: 0,
        pageSize: 15,
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
          this.totalRecords = response.data.systemRank.list
          this.totalCount = response.data.systemRank.totalCount
          this.pageNum = response.data.systemRank.pageNum
          this.pageSize = response.data.systemRank.pageSize
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
  .classRoom_integralTotal p{
    margin-top: 35px;
    margin-bottom: 20px;
  }
  .classRoom_integralTotal p:first-child{
    margin-top: 10px;
  }
  .classRoom_integralTotal p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_integralTotal p strong{
    margin-right: 20px;
    font-size: 18px;
  }
  .classRoom_integralTotal .count {
    width: 100%;
    padding: 6px 10px;
    background: rgba(0, 89, 130, 0.7);
  }
  .classRoom_integralTotal .count > span{
    display: inline-block;
    width: 18%;
  }
  .classRoom_integralTotal .count > span:first-child{
    width: 15%;
  }
  .classRoom_integralTotal .count > span strong{
    font-size: 16px;
  }
  .classRoom_integralTotal .el-table__row .cell span{
    display: inline-block;
    width: 40%;
  }
  .classRoom_integralTotal .el-table__header th{
    border-bottom: 1px solid #ebeef5;
  }
</style>
