<template>
  <section>
    <!-- 地市反馈 -->
    <div class="areaBack pubStyle">
      <title-pub :title="title"></title-pub>
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="" max-height="260"  show-summary :summary-method="getSummaries">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="AJMC" label="单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AJZT_NAME" label="线索总数（条）" align="center">
          <template slot-scope="scope">
            <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.AJZT_NAME}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="JYAQ" label="线索核查核实情况（条）" align="center" show-overflow-tooltip>
          <el-table-column prop="JYAQ" label="查实" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.AJZT_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="JYAQ" label="查否" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.AJZT_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="JYAQ" label="未核查" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"  @click="gotoxslist(scope.row)">{{scope.row.AJZT_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="JYAQ" label="核查率" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="AJZT_NAME" label="移送行政部门处理（次）" align="center"></el-table-column>
        <el-table-column prop="JYAQ" label="侦办刑事案件" align="center" show-overflow-tooltip>
          <el-table-column prop="JYAQ" label="立案（起）" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JYAQ" label="破案（起）" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JYAQ" label="捣毁窝点（个）" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JYAQ" label="刑事拘留（人）" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JYAQ" label="批准逮捕（人）" align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="JYAQ" label="涉案金额（万元）" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="AJZT_NAME" label="评价打分" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
           <el-button size="mini" title="线索分发"  type="primary" circle  @click="handlefenfa(scope.$index, scope.row)"><svg-icon icon-class="fenfa"></svg-icon></el-button>
           <el-button size="mini" title="反馈"  type="primary" circle  @click="handlefankui(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
           <el-button size="mini" title="评价打分"  type="primary" circle  @click="handledafen(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
           <el-button size="mini" title="评价详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 评价打分 -->
      <el-dialog title="评价打分" :visible.sync="isShowpjdf" size="small" class="pjdfForm">
        <el-form ref="pjdfForm" :rules="rules" :model="pjdfForm" size="small" label-width="90px">
          <el-form-item label="打分" prop="score">
            <el-rate v-model="pjdfForm.score"></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="evaluate">
            <el-input v-model.trim="pjdfForm.evaluate" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save"  class="saveBtn" :loading="btnLoading">完 成</el-button>
        </el-row>
      </el-dialog>

       <!-- 评价打分详情 -->
      <el-dialog title="评价详情" :visible.sync="isShowpjdfdetail" size="small" class="pjdfForm">
        <el-form :model="pjdfDetailForm" size="small" label-width="90px">
          <el-form-item label="打分" prop="score">
            <el-rate v-model="pjdfDetailForm.score" disabled></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="evaluate">
            <el-input v-model.trim="pjdfDetailForm.evaluate" type="textarea" :rows="4" disabled maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '地市线索协查战果反馈表',
      pjdfForm: { // 评价打分
        score: '',
        evaluate: ''
      },
      pjdfDetailForm: { // 评价打分详情
        score: '',
        evaluate: ''
      },
      curUser: {},
      curRow: {},
      listData: [], // 地市线索协查战果反馈表
      listLoading: false, // 页面loading
      isShowpjdf: false, // 评价打分弹出框
      isShowpjdfdetail: false, // 评价打分弹出框
      btnLoading: false, // 评价打分按钮loading
      pageSize: 5,
      page: 1,
      total: 0,
      cardNumber: '', // 存储身份证号
      rules: {
        score: [ // 评价打分
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请打分'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      // this.query(true)
    }
  },
  methods: {
    init() {
      if (this.cardId) {
        this.cardNumber = this.cardId
      }
      this.query(true)
    },
    query(flag) {
      this.listLoading = true
      var param = {
        cardNumber: this.cardNumber,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('', param).then((res) => {
        this.listLoading = false
        this.listData = res.data.list
        this.total = res.data.totalCount
        this.pageSize = res.data.pageSize
        this.$resetSetItem('t3', this.total) // 将总数存在session中
      }).catch(() => {
        this.listLoading = false
        this.$resetSetItem('t3', 0) // 将总数存在session中
        this.initData()
      })
    },
    initData() {
      this.listData = []
      this.total = 0
      this.pageSize = 5
      this.page = 1
    },
    handleCurrentChange(val) { // 涉案信息
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true)
    },
    gotoxslist(row) {
      this.$router.push({
        path: ' /jqcampaign/clueList', query: { id: row.id } // 线索列表页面
      })
    },
    handlefenfa(index, row) { // 线索分发
      this.curRow = row
    },
    handlefankui(index, row) { // 线索反馈
      this.curRow = row
    },
    handledafen(index, row) { // 评价打分
      this.isShowpjdf = true
      this.curRow = row
    },
    handleDetail(index, row) { // 评价详情
      this.isShowpjdfdetail = true
    },
    getSummaries(param) { // 总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
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
          sums[index] = '--'
        }
      })
    },
    save() { // 保存
      this.$refs.pjdfForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$update('' + this.curRow.id, this.pjdfForm).then((response) => {
            this.$message({
              message: '打分成功！',
              type: 'success',
              duration: 2000
            })
            this.btnLoading = false
            this.isShowpjdf = false
            this.query(true)
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    restFrom() {
      this.pjdfForm = {
        score: '',
        evaluate: ''
      }
    },
    cancel() {
      this.isShowpjdf = false
      this.restFrom()
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.areaBack{
  //修改表格边框颜色
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
  .pjdfForm{
    .el-dialog{
      width: 35%;
    }
  }
  .el-form{
    padding: 10px 20px;
  }
  textarea{
    // min-height: 80px;
  }
}
</style>
