<template>
  <section>
    <div class="ImportInfo">
      <!-- <title-pub :title="title" url=""></title-pub> -->
      <el-tabs class="archiveTab" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单位信息" name="first">
          <div slot="label">
            <p v-if="totalDwxx>0">单位信息<span class="circle_number">{{totalDwxx}}</span></p>
            <p v-else class="no_data_title">单位信息</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
          </div>
          <el-table :data="dwxxData" style="width: 100%;" v-loading="dwxxLoading" class="statisticCollect" max-height="156">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="companyName" label="单位名称" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="handleComDetail(scope.row)" style="cursor: pointer;">{{scope.row.companyName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unicode" label="统一社会代码" min-width="120"></el-table-column>
            <el-table-column prop="companyStyleName" label="单位类型" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="companyTel" label="单位电话" width="120"></el-table-column>
            <el-table-column prop="legalPerson" label="法人姓名" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="legalPersonCard" label="身份证号码" min-width="184"></el-table-column>
            <el-table-column prop="personNumber" label="员工人数" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="penaltyNumber" label="行政处罚次数" width="120"></el-table-column>
            <el-table-column prop="involvedCaseNumber" label="涉案次数" width="100"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="totalDwxx > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeDwxx" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeDwxx"
                          :page-size="pageSizeDwxx" :total="totalDwxx" :current-page="pageDwxx" style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="摊贩信息" name="second">
          <div slot="label">
            <p v-if="totalTfxx>0">摊贩信息<span class="circle_number">{{totalTfxx}}</span></p>
            <p v-else class="no_data_title">摊贩信息</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
          </div>
          <el-table :data="tfxxData" style="width: 100%;" v-loading="tfxxLoading" class="statisticCollect" max-height="156">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="name" label="摊贩名称">
              <template slot-scope="scope">
                <span @click="handlePitDetail(scope.row)" style="cursor: pointer;">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="personName" label="负责人"></el-table-column>
            <el-table-column prop="cardNumber" label="身份证号码" width="184"></el-table-column>
            <el-table-column prop="registerNumber" label="备案登记号"></el-table-column>
            <el-table-column prop="type" label="分类等级"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="manageProject" label="经营项目"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="totalTfxx > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeTfxx" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeTfxx"
                          :page-size="pageSizeTfxx" :total="totalTfxx" :current-page="pageTfxx" style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="从业资格证书" name="third">
          <div slot="label">
            <p v-if="totalCyzgz>0">从业资格证书<span class="circle_number">{{totalCyzgz}}</span></p>
            <p v-else class="no_data_title">从业资格证书</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
          </div>
          <el-table :data="cyzgzData" style="width: 100%;" max-height="156">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="zsmc" label="证书名称" min-width="8%"></el-table-column>
            <el-table-column prop="zsbh" label="证书编号" min-width="8%"></el-table-column>
            <el-table-column prop="zsyxqx" label="证书有效期限" min-width="10%"></el-table-column>
            <el-table-column prop="czrname" label="操作人名称" min-width="14%"></el-table-column>
            <el-table-column prop="bz" label="备注" min-width="6%"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="totalCyzgz > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeCyzgz" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeCyzgz"
                          :page-size="pageSizeCyzgz" :total="totalCyzgz" :current-page="pageCyzgz" style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
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
      title: '社保人事',
      activeName: 'first',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '110101199008076340',
      dwxxData: [], // 单位信息
      dwxxLoading: false, // 单位信息loading
      tfxxData: [], // 摊贩信息
      tfxxLoading: false, // 摊贩信息
      cyzgzData: [], // 从业资格证书
      cyzgzLoading: false,
      pageSizeDwxx: 5,
      pageDwxx: 1, // 单位信息
      totalDwxx: 0,
      pageTfxx: 1, // 摊贩信息
      totalTfxx: 0,
      pageSizeTfxx: 5,
      pageCyzgz: 1, // 从业资格证书
      totalCyzgz: 0,
      pageSizeCyzgz: 5,
      socialAllTotal: [], // 三种类型的总数
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.init()
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      this.socialAllTotal = []
      this.handleDwxx(true)
      this.handleTfxx(true)
      this.handleCyzgz(true)
    },
    calculateAll() { // 计算总数
      if (this.socialAllTotal.length === 3) {
        var all = 0
        for (let index = 0; index < this.socialAllTotal.length; index++) {
          const element = this.socialAllTotal[index]
          all += element
        }
        this.$resetSetItem('t8', all) // 将总数存在session中
      } else {
        this.$resetSetItem('t8', 0) // 将总数存在session中
      }
    },
    handleDwxx(flag) { // 单位信息
      this.dwxxLoading = true
      var param = {
        zjhm: this.cardNumber,
        pageSize: this.pageSizeDwxx,
        pageNum: flag ? 1 : this.pageDwxx
      }
      this.$query('page/ajdadwcompany', param).then((res) => {
        this.dwxxLoading = false
        if (res.code === '000000') {
          this.dwxxData = res.data.list
          this.totalDwxx = res.data.totalCount
          this.pageSizeDwxx = res.data.pageSize
          this.socialAllTotal.push(this.totalDwxx)
          this.calculateAll()
        }
      }).catch(() => {
        this.dwxxLoading = false
      })
    },
    handleTfxx(flag) { // 摊贩信息
      this.tfxxLoading = true
      var param = {
        zjhm: this.cardNumber,
        pageSize: this.pageSizeTfxx,
        pageNum: flag ? 1 : this.pageTfxx
      }
      this.$query('page/ajdadwpitchman', param).then((res) => {
        this.tfxxLoading = false
        if (res.code === '000000') {
          this.tfxxData = res.data.list
          this.totalTfxx = res.data.totalCount
          this.pageSizeTfxx = res.data.pageSize
          this.socialAllTotal.push(this.totalTfxx)
          this.calculateAll()
        }
      }).catch(() => {
        this.tfxxLoading = false
      })
    },
    handleCyzgz(flag) { // 从业资格证书
      this.cyzgzLoading = true
      var param = {
        gmsfhm: this.cardNumber,
        pageSize: this.pageSizeCyzgz,
        pageNum: flag ? 1 : this.pageCyzgz
      }
      this.$query('page/ajpersoncertbysfhm', param).then((res) => {
        this.cyzgzLoading = false
        if (res.code === '000000') {
          this.cyzgzData = res.data.list
          this.totalCyzgz = res.data.totalCount
          this.pageSizeCyzgz = res.data.pageSize
          this.socialAllTotal.push(this.totalCyzgz)
          this.calculateAll()
        }
      }).catch(() => {
        this.cyzgzLoading = false
      })
    },
    handleCurrentChangeDwxx(val) { // 单位信息分页
      this.pageDwxx = val
      this.handleDwxx(false)
    },
    handleCurrentChangeTfxx(val) { // 摊贩信息
      this.pageTfxx = val
      this.handleTfxx(false)
    },
    handleCurrentChangeCyzgz(val) { // 从业资格证书
      this.pageCyzgz = val
      this.handleCyzgz(false)
    },
    handleSizeChangeDwxx(val) { // 单位信息条数
      this.pageDwxx = 1
      this.pageSizeDwxx = val
      this.handleDwxx(false)
    },
    handleSizeChangeTfxx(val) { // 摊贩信息条数
      this.pageTfxx = 1
      this.pageSizeTfxx = val
      this.handleTfxx(false)
    },
    handleSizeChangeCyzgz(val) { // 从业资格证书条数
      this.pageCyzgz = 1
      this.pageSizeCyzgz = val
      this.handleCyzgz(false)
    },
    handleComDetail(row) { // 单位详情
      this.$gotoid('/inforCollection/comRegisterDetail', JSON.stringify({ id: row.companyId, type: 'perArchive' }))
    },
    handlePitDetail(row) { // 摊贩信息
      this.$gotoid('/inforCollection/comPedlarDetail', JSON.stringify({ id: row.pitchmanId, type: 'perArchive' }))
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    }

  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.trajectory_wrap {
  width: 100%;
  min-height: 130px;
  white-space: nowrap;
  overflow-x: auto;
}
.trajectory_cell {
  width: 150px;
  text-align: center;
  float: left;
  margin-bottom: 10px;
  p {
    font-size: 13px;
    margin: 3px 0 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .moreText:hover {
    width: fit-content;
    text-align: center;
  }
}
.trajectory_cell .time_color {
  color: #00a0e9;
}
.trajectory_cell .address_color {
  color: #bce8fc;
}
.gjdash {
  float: left;
  margin: 55px 10px 0;
}
.circle_number {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 19px;
  border-radius: 20px;
  color: #ffffff;
  background: #00a0e9;
  font-size: 12px;
  margin-left: 5px;
}
.no_data_title {
  color: #586d7e;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
