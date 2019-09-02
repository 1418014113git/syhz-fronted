<template>
  <section style="margin-top:12px;">
    <el-table ref="goodTable" :data="nowsData" v-loading="nowsLoading" max-height="186" class="statisticCollect" style="width:100%;">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="content" label="申请事由" show-overflow-tooltip min-width="140"></el-table-column>
      <el-table-column prop="deptName" label="申请单位" show-overflow-tooltip min-width="140"></el-table-column>
      <el-table-column prop="userName" label="申请人" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip width="170"></el-table-column>
      <el-table-column prop="acptDeptName" label="审核单位" show-overflow-tooltip min-width="140"></el-table-column>
      <el-table-column prop="updateUser" label="审核人" show-overflow-tooltip  width="120"></el-table-column>
      <el-table-column prop="updateTime" label="审核时间" show-overflow-tooltip width="170"></el-table-column>
      <el-table-column prop="status" label="审核结果" show-overflow-tooltip width="100">
        <template slot-scope="scope">
           <span>{{handlerStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedBack" label="审核意见" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="操作" width="60px">
        <template slot-scope="scope" v-if="isThereApproved">
          <el-button type="info" icon="el-icon-check" circle title="再次申请" @click="handleAgainApply(scope.row)"
          v-if="scope.row.status==='4'"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="totalNows > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeNows" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeNows"
                    :page-size="pageSizeNows" :total="totalNows" :current-page="pageNows" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  props: ['ajbh'],
  name: 'index',
  data() {
    return {
      nowsData: [],
      nowsLoading: false, // 没有文书申请loading
      pageNows: 1, // 法律文书
      totalNows: 0,
      pageSizeNows: 5,
      isThereApproved: true // 是否有审核通过的申请
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
    handlerStatus(val) { // 审核状态
      var valName = ''
      if (val === '1' || val === '2') {
        valName = '审核中'
      } else if (val === '3') {
        valName = '审核通过'
      } else if (val === '4') {
        valName = '未通过'
      }
      return valName
    },
    init() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.queryList(true)
      }
    },
    queryList(flag) {
      this.nowsLoading = true
      var param = {
        ajbh: this.AJBH,
        // ajbh: 'J1504296813050800001',
        pageSize: this.pageSizeNows,
        pageNum: flag ? 1 : this.pageNows
      }
      this.$query('page/ajflwsexamines', param).then((res) => {
        this.nowsLoading = false
        if (res.code === '000000') {
          this.nowsData = res.data.list
          this.totalNows = res.data.totalCount
          this.pageSizeNows = res.data.pageSize
          // 若列表已存在审批通过的 则其他被驳回的申请 也不能重新再申请
          for (let index = 0; index < this.nowsData.length; index++) {
            const element = this.nowsData[index]
            if (element.status === '3') { // 有审核通过的，则整个列表再次申请都无需展示
              this.isThereApproved = false
              break
            }
          }
          this.$emit('totalNows', this.totalNows)
        }
      }).catch(() => {
        this.nowsLoading = false
      })
    },
    handleCurrentChangeNows(val) { // 法律文书分页
      this.pageNows = val
      this.queryList(false)
    },
    handleSizeChangeNows(val) { // 法律文书条数
      this.pageSizeNows = val
      this.pageNows = 1
      this.queryList(false)
    },
    handleAgainApply(row) { // 再次申请
      this.$emit('nowsApplyInfo', row)
    }
  },
  mounted() {
    this.init()
  }

}
</script>


