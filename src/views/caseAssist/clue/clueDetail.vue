<template>
  <section class="clueDetail">
   <!--线索列表详情-->
    <el-form :model="clueFeedBackForm" size="small" ref="clueFeedBackForm" disabled label-width="120px" class="clueFeedBackForm">
      <el-form-item label="核查情况" prop="qbxsResult">
          <span v-if="clueFeedBackForm.qbxsResult === 2">查实</span>
          <span v-if="clueFeedBackForm.qbxsResult === 3">查否</span>
      </el-form-item>
      <el-form-item label="处理方式" prop="handleResult" v-if="handleResultVisible">
        <span v-if="clueFeedBackForm.handleResult === 1">立案</span>
        <span v-if="clueFeedBackForm.handleResult === 2">移送行政部门处理</span>
        <span v-if="clueFeedBackForm.handleResult === 3">其他处理</span>
      </el-form-item>
      <el-form-item label="侦办刑事案件" v-if="zbCaseVisible">
        <el-table :data="zbCaseListData" v-loading="zbCaseListLoading" style="width: 100%;" show-summary :summary-method="getSummaries" sum-text="全部">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column prop="ajmc"  label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ajbh"  label='案件编号'  min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="ajztName"  label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="larq"  label='立案日期'  min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.larq !== undefined && scope.row.larq !== null && scope.row.larq !== '' ? scope.row.larq : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="parq"  label='破案日期'  min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.parq !== undefined && scope.row.parq !== null && scope.row.parq !== '' ? scope.row.parq : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="zhrys"  label='抓获（人）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="yjss" label="移诉（人）"  min-width="100"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="反馈内容" prop="backResult">
        <span class="feed_con" v-html="clueFeedBackForm.backResult"></span>
      </el-form-item>
      <el-form-item label="附件" v-if="uploadImgs.length > 0">
        <div class="data_list">
          <p v-for="(item, index) in uploadImgs" :key="index">
            <a @click="upLoadFile(item)">{{item.name}}</a>&nbsp;&nbsp;&nbsp;
          </p>
        </div>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  export default {
    props: ['row'],
    name: 'clueDetail',
    data() {
      return {
        clueFeedBackForm: {
          qbxsResult: '', // 核查情况
          handleResult: '',
          backResult: '',
          backFiles: [],
          caseNo: '',
          zbxss: []
        },
        uploadImgs: [],
        curRow: {}, // 存储线索反馈列表传递过来的当前行的数据
        handleResultVisible: false,
        zbCaseVisible: false,
        zbCaseLoading: false,
        zbCaseSelectData: [], // 侦办案件下拉框数据
        zbCaseListData: [], // 侦办刑事案件列表
        zbCaseListLoading: false, // 侦办刑事案件列表加载loading
        isShowTime: false, // 是否显示更新时间
        curUser: JSON.parse(sessionStorage.getItem('userInfo')), // 当前登录用户
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前登录的部门
      }
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (index === 1 || index === 2 || index === 3) {
            sums[index] = '-'
            return
          }
          if (index === 4 || index === 5) {
            const values = data.map(item => Date.parse(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + 1
                } else {
                  return prev
                }
              }, 0)
            }
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = this.$thousSplit(sums[index] + '')
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      detail() { // 查详情
        this.listLoading = true
        this.clueFeedBackForm.qbxsResult = this.curRow.qbxsResult !== undefined && this.curRow.qbxsResult !== null && this.curRow.qbxsResult !== '' ? this.curRow.qbxsResult : 2
        const para = {
          assistId: this.curRow.assistId,
          type: 'detail', // 操作类型
          fbId: this.curRow.fbId, // 反馈Id
          assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
        }
        this.$query('caseassistclue/feedBack/detail', para).then((response) => {
          this.listLoading = false
          this.clueFeedBackForm.backResult = response.data.backResult
          this.clueFeedBackForm.handleResult = response.data.handleResult
          this.clueFeedBackForm.zbxss = response.data.zbxss.split(',')
          this.zbCaseListData = response.data.zbxssList
          this.handleResultVisible = this.clueFeedBackForm.qbxsResult === 2
          this.zbCaseVisible = this.clueFeedBackForm.handleResult === 1
          if (response.data.backFiles !== undefined && response.data.backFiles !== null && response.data.backFiles !== '') {
            this.uploadImgs = JSON.parse(response.data.backFiles)
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      toAjDetail(id) { // 跳转案件档案
        this.$router.push({
          path: '/caseFile/index', query: { id: id }
        })
      },
      setRow(curRow) {
        this.curRow = curRow
        this.initData()
        if (this.curDept.depType === '4') { // 派出所
          this.getfqDepts()
        }
        this.detail()
      },
      initData() {
        this.clueFeedBackForm = {
          qbxsResult: '', // 核查情况
          handleResult: '',
          backResult: '',
          backFiles: [],
          caseNo: '',
          zbxss: []
        }
        this.zbCaseSelectData = [] // 侦办案件下拉框数据
        this.zbCaseListData = [] // 侦办刑事案件列表
        this.isShowTime = false // 隐藏更新时间
        this.$refs.clueFeedBackForm.resetFields()
      }
    },
    mounted() {
      this.setRow(this.row)
    }
  }
</script>

<style>
.clueDetail .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
.clueDetail .el-table--border,
.clueDetail .el-table--group {
    border: 1px solid #2f627a;
  }
.clueDetail .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
.clueDetail .el-table--border::after,
.clueDetail .el-table--group::after {
    width: 0;
  }
.clueDetail .el-table__fixed-footer-wrapper tbody td {
  background: none;
  border: none;
}
.clueDetail .el-upload.el-upload--text, .clueDetail .el-upload-dragger{
  width: 100%;
}
.clueDetail .data_list{
  padding: 0 10px 0 0;
}
.clueDetail .data_list > p{
  display: inline-block;
  width: 100%;
}
.clueDetail .data_list > p a:first-child{
  float: left;
  text-decoration: underline;
  cursor: pointer;
}
.clueDetail .feed_con{
  display: inline-block;
  width: 100%;
  max-height: 200px;
  overflow: auto;
}
/*.clueDetail .el-table{*/
  /*overflow: auto;*/
/*}*/
/*.clueDetail .el-table__body-wrapper,*/
/*.clueDetail .el-table__header-wrapper,*/
/*.clueDetail .el-table__footer-wrapper{*/
  /*overflow:visible !important;*/
/*}*/
/*.clueDetail .el-table::after{*/
  /*position: relative !important;*/
/*}*/
</style>
