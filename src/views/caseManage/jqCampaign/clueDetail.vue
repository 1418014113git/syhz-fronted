<template>
  <section class="clueDetail">
   <!--线索列表详情-->
      <el-form label-width="120px" class="form" v-loading="listLoading">
        <el-form-item label="核查情况">
          <span v-if="curRow.qbxsResult">{{ $getDictName(curRow.qbxsResult+'', 'qbxsfkzt') }}</span>
        </el-form-item>
        <el-form-item label="处理方式">
          <span v-if="handleResult">{{ getClfsName(handleResult) }}</span>
        </el-form-item>
        <el-form-item label="侦办刑事案件">
          <el-table :data="zblistData" style="width: 100%;" class=""  show-summary :summary-method="getSummaries" sum-text="总计">
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="ajmc" align="center" label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh" align="center" label='案件编号'  min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajztName" align="center" label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
           <el-table-column prop="larq"  label='立案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.larq">{{scope.row.larq}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="parq"  label='破案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.parq">{{scope.row.parq}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="zhrys"  label='抓获（人）'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.zhrys">{{scope.row.zhrys}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.pzdb">{{scope.row.pzdb}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
             <el-table-column prop="yjss" label="移诉（人）"  min-width="100"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if='scope.row.yjss'>{{scope.row.yjss}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.dhwd">{{scope.row.dhwd}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.sajz">{{scope.row.sajz}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="反馈内容" prop="">
          <span v-html="backResult"></span>
        </el-form-item>
        <el-form-item label="附件" prop="">
          <span v-if="backFiles && backFiles.length>0">
              <span v-for="(item, index) in backFiles" :key="index">
                <a @click="downFile(item)" style="text-decoration: underline;">{{item.name}}</a>&nbsp;&nbsp;&nbsp;
            </span>
          </span>
        </el-form-item>

      </el-form>
  </section>
</template>
<script>
export default {
  props: ['row', 'isShowdialog'],
  name: 'clueDetail',
  data() {
    return {
      yslistData: [], // 移送案件列表
      zblistData: [], // 侦办刑事案件列表
      listLoading: false, // 页面加载loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      handleResult: '', // 处理方式
      backResult: '', // 反馈内容
      backFiles: [] // 附件
    }
  },
  watch: { // 监听state状态变化
    row: {
      handler: function(val, oldeval) {
        if (val.fbId) { // 反馈id
          this.curRow = val
          this.detail() // 查详情
        }
      }
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        if (val) {
          this.initData()
        }
      }
    }
  },
  methods: {
    detail() { // 查详情
      this.listLoading = true
      const para = {
        assistId: this.curRow.clusterId, // 集群Id
        type: 'detail', // 操作类型
        fbId: this.curRow.fbId, // 反馈Id
        assistType: 2 // 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.listLoading = false
        this.handleResult = response.data.handleResult || '' // 处理方式
        this.backResult = response.data.backResult || '' // 反馈内容
        this.backFiles = response.data.backFiles ? JSON.parse(response.data.backFiles) : [] // 附件
        this.zblistData = response.data.zbxssList || [] // 侦办案件列表集合
      }).catch(() => {
        this.listLoading = false
      })
    },
    downFile(item) { // 下载附件
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    getClfsName(val) {
      var name = ''
      if (val === 1) {
        name = '立案'
      } else if (val === 2) {
        name = '移送行政部门处理'
      } else if (val === 3) {
        name = '其他处理'
      }
      return name
    },
    initData() {
      this.curRow.qbxsResult = '' // 核查情况
      this.zblistData = [] // 侦办刑事案件列表
    },
    toAjDetail(id) { // 跳转案件档案
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    getSummaries(param) { // 合计
      if (param.data.length > 0) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1 || index === 2 || index === 3) {
            sums[index] = '-'
            return
          }
          if (index === 4 || index === 5) { // 立案日期  破案日期
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
            } else {
              sums[index] = 0
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
          } else {
            sums[index] = ''
          }
        })
        return sums
      }
    }
  },
  mounted() {
    // this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.row.fbId) { // 反馈id
      this.curRow = this.row
      this.detail() // 查详情
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueDetail{
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
   // 动态添加列表行时，需要修改下样式
  .el-table__fixed-footer-wrapper tbody td {
    background: rgba(0, 89, 130, 1);
    border: none;
  }

  // 将滚定条设置到合计行下方
  // .el-table{
  //   overflow: auto;
  // }
  // .el-table__body-wrapper,
  // .el-table__header-wrapper,
  // .el-table__footer-wrapper{
  //   overflow:visible !important;
  // }
  // .el-table::after{
  //   position: relative !important;
  // }
}
</style>
