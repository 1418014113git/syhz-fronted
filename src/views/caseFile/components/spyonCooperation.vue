<template>
<!-- 侦查协作 -->
<section>
  <div class="cell_title">
    <span class="small_line"></span>
    <span class="text">侦查协作</span>
  </div>
  <div class="bg ajInfo">
    <div class="more_btn" v-if="isMore"  @click="linkMore">更多</div>
    <el-tabs class="archiveTab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="集群战役" name="first">
        <div slot="label">
          <p v-if="totalQgxxc>0">集群战役<span class="circle_number">{{totalQgxxc}}</span></p>
          <p v-else class="no_data_title">集群战役</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="qgxxcData" style="width: 100%;" v-loading="qgxxcLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="qgxxcData" style="width: 100%;" v-loading="qgxxcLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="assist_title" label="标题" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="apply_dept_name" label="申请部门" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="申请时间" show-overflow-tooltip width="180"></el-table-column>
          <el-table-column prop="XYLB_NAME" label="状态" :formatter="formatStatusQgxxc" width="120" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalQgxxc > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeQgxxc" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeQgxxc"
                        :page-size="pageSizeQgxxc" :total="totalQgxxc" :current-page="pageQgxxc" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="案件协查" name="second">
        <div slot="label">
          <p v-if="totalAjxc>0">案件协查<span class="circle_number">{{totalAjxc}}</span></p>
          <p v-else class="no_data_title">案件协查</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="ajxcData" style="width: 100%;" v-loading="ajxcLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="ajxcData" style="width: 100%;" v-loading="ajxcLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="ajbh" label="案件编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ajmc" label="案件名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="DWXZ_NAME" label="立案日期" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.larq">{{$handlerDateTime(scope.row.larq)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ajlbName" label="案件类别" show-overflow-tooltip></el-table-column>
          <el-table-column prop="applyDeptName" label="申请部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="applyPersonName" label="申请人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assistType" label="协查级别" :formatter="formatType" show-overflow-tooltip  width="100"></el-table-column>
          <el-table-column prop="createTime" label="申请时间"  width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{scope.row.createTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="协查状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if='scope.row.status'>{{$getDictName(scope.row.status+'','jqzyzt')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalAjxc > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeAjxc"  :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeAjxc"
                        :page-size="pageSizeAjxc" :total="totalAjxc" :current-page="pageAjxc" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="案件督办" name="third">
        <div slot="label">
          <p v-if="totalAjdb>0">案件督办<span class="circle_number">{{totalAjdb}}</span></p>
          <p v-else class="no_data_title">案件督办</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="ajdbData" style="width: 100%;" v-loading="ajdbLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="ajdbData" style="width: 100%;" v-loading="ajdbLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="ajbh" label="案件编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ajmc" label="案件名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="larq" label="立案日期" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.larq">{{$handlerDateTime(scope.row.larq)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ajlbName" label="案件类别" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="发起时间"  width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{scope.row.createTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dbLevel" label="督办级别" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{$getDictName(scope.row.dbLevel+'','dbjb')}}
            </template>
          </el-table-column>
          <el-table-column prop="dbStatus" label="督办状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
               {{$getDictName(scope.row.dbStatus+'','dbajzt')}}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="截止时间" width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.endTime">{{scope.row.endTime | formatDate}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalAjdb > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeAjdb" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeAjdb"
                        :page-size="pageSizeAjdb" :total="totalAjdb" :current-page="pageAjdb" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="专项任务" name="fourth">
        <div slot="label">
          <p v-if="totalZxrw>0">专项任务<span class="circle_number">{{totalZxrw}}</span></p>
          <p v-else class="no_data_title">专项任务</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="zxrwData" style="width: 100%;" v-loading="zxrwLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="zxrwData" style="width: 100%;" v-loading="zxrwLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="task_name" label="任务名称"></el-table-column>
          <el-table-column prop="AJMC" label="开始时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.start_date">{{scope.row.start_date | filterDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="DWXZ_NAME" label="结束时间" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.end_date">{{scope.row.end_date | filterDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="AJLB_NAME" label="参与部门" show-overflow-tooltip>
            <template slot-scope="scope">
              <p :title="formatDept(scope.row.dept_list)" class="ellipsis-word">{{formatDept(scope.row.dept_list)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="DWXZ_NAME" label="发布部门" show-overflow-tooltip>
            <template slot-scope="scope">
              <p :title="scope.row.create_dept_name" class="ellipsis-word">{{scope.row.create_dept_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="DWXZ_NAME" label="任务状态" :formatter="formatStatusZxrw" show-overflow-tooltip></el-table-column>
          <el-table-column prop="DWXZ_NAME" label="创建时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.create_date">{{scope.row.create_date | filterDate}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalZxrw > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeZxrw" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeZxrw"
                        :page-size="pageSizeZxrw" :total="totalZxrw" :current-page="pageZxrw" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="检验鉴定" name="fiveth">
        <div slot="label">
          <p v-if="totalJyjd>0">检验鉴定<span class="circle_number">{{totalJyjd}}</span></p>
          <p v-else class="no_data_title">检验鉴定</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="jyjdData" style="width: 100%;" v-loading="jyjdLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="jyjdData" style="width: 100%;" v-loading="jyjdLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="AJBH" label="申请单位">
            <template slot-scope="scope">
              <p :title="scope.row.apply_dept_name" class="ellipsis-word">{{scope.row.apply_dept_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="AJMC" label="检材名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <p :title="scope.row.check_name" class="ellipsis-word">{{scope.row.check_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="AJLB_NAME" label="送检要求" show-overflow-tooltip>
            <template slot-scope="scope">
              <p :title="scope.row.check_reason" class="ellipsis-word">{{scope.row.check_reason}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="apply_person_name" label="申请人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="申请时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="statusStr" label="审批状态" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalJyjd > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeJyjd" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeJyjd"
                        :page-size="pageSizeJyjd" :total="totalJyjd" :current-page="pageJyjd" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="案件认领" name="sixth">
        <div slot="label">
          <p v-if="totalAjrl>0">案件认领<span class="circle_number">{{totalAjrl}}</span></p>
          <p v-else class="no_data_title">案件认领</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="ajrlData" style="width: 100%;" v-loading="ajrlLoading" class="statisticCollect" max-height="186"> -->
        <el-table :data="ajrlData" style="width: 100%;" v-loading="ajrlLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="54" fixed></el-table-column>
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="optStr" label="操作" show-overflow-tooltip></el-table-column>
          <el-table-column prop="optOrg" label="操作单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="optPerson" label="操作人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="receiveDept" label="接收单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="revokeReason" label="操作事由" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalAjrl > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeAjrl" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeAjrl"
                        :page-size="pageSizeAjrl" :total="totalAjrl" :current-page="pageAjrl" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
  </section>
</template>
<script>
import { parseTime } from '@/utils/index'
import Bus from '@/utils/bus.js'
import {
  getAssistLevelText, getAssistStatusText
} from '@/utils/codetotext'
export default {
  props: ['ajbh', 'ajid', 'type', 'Rl'],
  name: 'index',
  components: {
  },
  data() {
    return {
      title: '社保人事',
      activeName: 'first',
      curUser: {},
      depToken: {}, // 当前部门
      // cardId: '110101199008076340',
      qgxxcData: [], // 集群战役
      qgxxcLoading: false, // 集群战役loading
      ajxcData: [], // 案件协查
      ajxcLoading: false, // 案件协查loading
      ajdbData: [], // 案件督办
      ajdbLoading: false,
      zxrwData: [], // 专项任务
      zxrwLoading: false,
      jyjdData: [], // 检验鉴定
      jyjdLoading: false,
      ajrlData: [], // 案件认领
      ajrlLoading: false,
      pageSize: 5,
      pageQgxxc: 1, // 集群战役页数
      totalQgxxc: 0,
      pageAjxc: 1, // 案件协查页数
      totalAjxc: 0,
      pageAjdb: 1, // 案件督办页数
      totalAjdb: 0,
      pageZxrw: 1, // 专项任务页数
      totalZxrw: 0,
      pageJyjd: 1, // 检验鉴定页数
      totalJyjd: 0,
      pageAjrl: 1, // 案件认领页数
      totalAjrl: 0,
      moduleAllTotal: [], // 三种类型的总数
      AJBH: '', // 案件编号,
      AJID: '', // 用户页面返回判断使用
      interFaceType: '',
      isRls: '',
      source: 'ajda', // 页面来源，表示该模块是来自案件档案
      isMore: false, // 是否显示更多按钮
      pageSizeQgxxc: 5, // 集群战役条数
      pageSizeAjxc: 5, // 案件协查条数
      pageSizeAjdb: 5, // 案件督办条数
      pageSizeZxrw: 5, // 专项任务条数
      pageSizeJyjd: 5, // 检验鉴定条数
      pageSizeAjrl: 5 // 案件认领条数
    }
  },
  watch: {
    ajbh(val) {
      if (val) {
        this.moduleAllTotal = []
        this.AJBH = val
        this.AJID = this.ajid
        this.interFaceType = this.type
        this.isRls = this.Rl
        this.init()
      }
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    filterDate(date) { // 专项任务中的
      return parseTime(new Date(date), '{y}-{m}-{d}')
    }
  },
  methods: {
    formatStatusQgxxc(row, column) {
      return getAssistStatusText(row.status)
    },
    formatType(row, column) { // 协查级别
      return getAssistLevelText(row.assistType)
    },
    formatDept(deptList) { // 专项任务
      let dept_str = ''
      if (deptList) {
        const deptArr = JSON.parse(deptList)
        deptArr.forEach(function(item, index) {
          dept_str += item.name + (index === deptArr.length - 1 ? '' : '，\r\n')
        })
      }
      return dept_str
    },
    formatStatusZxrw(row, column) { // 专项任务 状态
      if (row.status === '0') {
        return '草稿'
      }
      if (row.status === '1') {
        return '待审核'
      }
      if (row.status === '2') {
        return '审核未通过'
      }
      if (row.status === '3') {
        return '待上级审核'
      }
      if (row.status === '4') {
        return '审核通过'
      }
      if (row.status === '5') {
        return '签收中'
      }
      if (row.status === '6') {
        return '成果上报阶段'
      }
      if (row.status === '7') {
        return '任务结束'
      }
      return ''
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      if (this.AJBH) {
        this.handleQgxxc(true) // 集群战役
        this.handleAjxc(true) // 案件协查
        this.handleAjdb(true) // 案件督办
        this.handleZxrw(true) // 专项任务
        this.handleJyjd(true) // 检验鉴定
        this.handleAjrl(true) // 案件认领
      }
      Bus.$on('bqType', (data) => { // 定位到对应的标签项
        this.activeName = data
      })
    },
    formatStatus(row, column) {
      const s = getAssistStatusText(row.status)
      if (s === '进行中') {
        return '反馈中'
      }
      return s
    },
    calculateAll() { // 计算总数
      if (this.moduleAllTotal.length === 6) {
        var all = 0
        for (let index = 0; index < this.moduleAllTotal.length; index++) {
          const element = this.moduleAllTotal[index]
          all += element
        }
        this.$resetSetItem('aj8', all) // 将总数存在session中
      } else {
        this.$resetSetItem('aj8', 0) // 将总数存在session中
      }
    },
    handleQgxxc(flag) { // 集群战役
      this.qgxxcLoading = true
      var param = {
        curDepId: this.depToken.id,
        ajbh: this.AJBH || '', // 案件编号
        pageSize: this.pageSizeQgxxc,
        pageNum: flag ? 1 : this.pageQgxxc
      }
      this.$query('page/investigation', param).then((res) => {
        this.qgxxcLoading = false
        if (res.code === '000000') {
          this.qgxxcData = res.data.list
          this.totalQgxxc = res.data.totalCount
          this.pageSizeQgxxc = res.data.pageSize
          this.controlBtn('isShowjqbtn', 'jq', this.qgxxcData) // 控制详情页上方的集群按钮显隐
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalQgxxc)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.qgxxcLoading = false
      })
    },
    handleAjxc(flag) { // 案件协查
      this.ajxcLoading = true
      var param = {
        curDepId: this.depToken.id,
        ajbh: this.AJBH || '', // 案件编号
        pageSize: this.pageSizeAjxc,
        pageNum: flag ? 1 : this.pageAjxc
      }
      this.$query('page/caseassist', param).then((res) => {
        this.ajxcLoading = false
        if (res.code === '000000') {
          this.ajxcData = res.data.list
          this.totalAjxc = res.data.totalCount
          this.pageSizeAjxc = res.data.pageSize
          this.controlBtn('isShowxcbtn', 'xc', this.ajxcData) // 控制详情页上方的协查按钮显隐
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalAjxc)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.ajxcLoading = false
      })
    },
    controlBtn(str, type, data) { // 遍历列表信息，控制详情页上方的协查按钮显隐
      Bus.$emit(str, false)
      if (data.length > 0) {
        data.forEach(item => {
          if (type === 'jq' || type === 'xc') { // 集群，协查
            if (item.status && Number(item.status) >= 4) { // 审核通过之后，
              Bus.$emit(str, true)
            }
          } else { // 督办   isShowbdbtn：部督，isShowtdbtn：厅督，isShowsdbtn：市督，

          }
        })
      }
    },
    handleAjdb(flag) { // 案件督办
      this.ajdbLoading = true
      var param = {
        deptId: this.depToken.id,
        departCode: this.depToken.depType === '4' ? this.depToken.parentDepCode : this.depToken.depCode, // 当前部门编号
        ajbh: this.AJBH || '', // 案件编号
        pageSize: this.pageSizeAjdb,
        pageNum: flag ? 1 : this.pageAjxc
      }
      this.$query('page/dbajinfo', param).then((res) => {
        this.ajdbLoading = false
        if (res.code === '000000') {
          this.ajdbData = res.data.list
          this.totalAjdb = res.data.totalCount
          this.pageSizeAjdb = res.data.pageSize
          this.controlBtn('', 'db', this.ajdbData) // 控制详情页上方的督办按钮显隐 （部督、厅督、市督在该方法中分别判断）
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalAjdb)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.ajdbLoading = false
      })
    },
    handleZxrw(flag) { // 专项任务
      this.zxrwLoading = true
      var param = {
        deptId: this.depToken.id,
        ajbh: this.AJBH || '', // 案件编号
        pageSize: this.pageSizeZxrw,
        pageNum: flag ? 1 : this.pageAjxc
      }
      this.$query('page/specialtasksign', param).then((res) => {
        this.zxrwLoading = false
        if (res.code === '000000') {
          this.zxrwData = res.data.list
          this.totalZxrw = res.data.totalCount
          this.pageSizeZxrw = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalZxrw)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.zxrwLoading = false
      })
    },
    handleJyjd(flag) { // 检验鉴定
      this.jyjdLoading = true
      var param = {
        curDepId: this.depToken.id,
        ajbh: this.AJBH || '', // 案件编号
        pageSize: this.pageSizeJyjd,
        pageNum: flag ? 1 : this.pageJyjd
      }
      this.$query('page/authenticate', param).then((res) => {
        this.jyjdLoading = false
        if (res.code === '000000') {
          this.jyjdData = res.data.list
          this.totalJyjd = res.data.totalCount
          this.pageSizeJyjd = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalJyjd)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.jyjdLoading = false
      })
    },
    handleAjrl(flag) { // 案件认领
      this.ajrlData = []
      this.ajrlLoading = true
      const param = {
        ajbh: this.AJBH || '',
        pageSize: this.pageSizeAjrl,
        pageNum: flag ? 1 : this.pageAjrl
      }
      this.$query('page/ajsignlist', param).then(response => {
        this.ajrlLoading = false
        const data = response.data.list
        this.totalAjrl = response.data.totalCount
        this.pageSizeAjrl = response.data.pageSize
        for (let i = 0; i < data.length; i++) {
          const obj = data[i]
          let str = ''
          if (obj.status === '3') {
            str = '待认领'
          }
          if (obj.status === '5') {
            str = '案件认领'
          }
          if (obj.status === '9') {
            if (String(obj.notice_lx) === '1') {
              str = '案件下发'
            }
            if (String(obj.notice_lx) === '2') {
              str = '转回上级'
            }
            if (String(obj.notice_lx) === '3') {
              str = '恢复案件'
            }
          }
          if (obj.status === '10') {
            str = '非环食药案件'
          }
          if (obj.status === '9') {
            let receive = ''
            if (i + 1 < data.length) {
              const next = data[i + 1]
              receive = next.notice_org_name
            }
            this.ajrlData.push({
              time: obj.sign_time,
              optStr: str,
              optOrg: obj.notice_org_name,
              optPerson: obj.sign_user_name,
              receiveDept: receive,
              revokeReason: obj.revoke_reason
            })
          } else {
            this.ajrlData.push({
              time: obj.sign_time,
              optStr: str,
              optOrg: obj.notice_org_name,
              optPerson: obj.sign_user_name,
              receiveDept: '',
              revokeReason: obj.revoke_reason
            })
          }
        }
        this.totalAjrl = this.ajrlData.length
        if (flag) { // 切换条数时 总数不变，不必要重新计算
          this.moduleAllTotal.push(this.totalAjrl)
          this.calculateAll()
        }
      }).catch(() => {
        this.ajrlLoading = false
      })
    },
    handleCurrentChangeQgxxc(val) { // 集群战役分页
      this.pageQgxxc = val
      this.handleQgxxc(false)
    },
    handleSizeChangeQgxxc(val) { // 集群战役条数
      this.pageQgxxc = 1
      this.pageSizeQgxxc = val
      this.handleQgxxc(false)
    },
    handleCurrentChangeAjxc(val) { // 案件协查分页
      this.pageAjxc = val
      this.handleAjxc(false)
    },
    handleSizeChangeAjxc(val) { // 案件协查条数
      this.pageAjxc = 1
      this.pageSizeAjxc = val
      this.handleAjxc(false)
    },
    handleCurrentChangeAjdb(val) { // 案件督办分页
      this.pageAjdb = val
      this.handleAjdb(false)
    },
    handleSizeChangeAjdb(val) { // 案件督办条数
      this.pageAjdb = 1
      this.pageSizeAjdb = val
      this.handleAjdb(false)
    },
    handleCurrentChangeZxrw(val) { // 专项任务分页
      this.pageZxrw = val
      this.handleZxrw(false)
    },
    handleSizeChangeZxrw(val) { // 专项任务条数
      this.pageZxrw = 1
      this.pageSizeZxrw = val
      this.handleZxrw(false)
    },
    handleCurrentChangeJyjd(val) { // 检验鉴定分页
      this.pageJyjd = val
      this.handleJyjd(false)
    },
    handleSizeChangeJyjd(val) { // 检验鉴定条数
      this.pageJyjd = 1
      this.pageSizeJyjd = val
      this.handleJyjd(false)
    },
    handleCurrentChangeAjrl(val) { // 案件认领分页
      this.pageAjrl = val
      this.handleAjrl(false)
    },
    handleSizeChangeAjrl(val) { // 案件认领条数
      this.pageAjrl = 1
      this.pageSizeAjrl = val
      this.handleAjrl(false)
    },

    handleComDetail(row) { // 单位详情
      this.$gotoid('/inforCollection/comRegisterDetail', JSON.stringify({ id: row.companyId, type: 'perArchive' }))
    },
    handlePitDetail(row) { // 案件协查
      this.$gotoid('/inforCollection/comPedlarDetail', JSON.stringify({ id: row.pitchmanId, type: 'perArchive' }))
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    },
    getParam() {
      var param = {}
      if (this.AJID) {
        if (this.isRls) {
          param = { ajbh: this.AJBH, id: this.AJID, source: this.source, isRl: this.isRls } // 跳转到关系挖掘主页传递的参数
        } else {
          param = { ajbh: this.AJBH, id: this.AJID, source: this.source } // 传递案件id
        }
      } else if (this.AJBH) {
        if (this.interFaceType) {
          param = { ajbh: this.AJBH, source: this.source, interfaceType: this.interFaceType } // 传递案件编号
        } else if (this.isRls) {
          param = { ajbh: this.AJBH, source: this.source, isRl: this.isRls } // 传递案件编号
        }
      } else {
        param = { ajbh: this.AJBH }
      }
      return param
    },
    linkMore() {
      var param = this.getParam()
      switch (this.activeName) {
        case 'first':
          // this.$gotoid('/caseManage/investigation', JSON.stringify(param))
          this.$router.push({ path: '/caseManage/investigation', query: param })
          break
        case 'second':
          // this.$gotoid('/caseAssist/list', JSON.stringify(param))
          this.$router.push({ path: '/caseAssist/list', query: param })
          break
        case 'third':
          // this.$gotoid('/caseManage/dblist', JSON.stringify(param))
          this.$router.push({ path: '/caseManage/dblist', query: param })
          break
        case 'fourth':
          // this.$gotoid('/specialTasks', JSON.stringify(param))
          this.$router.push({ path: '/specialTasks', query: param })
          break
        case 'fiveth':
          // this.$gotoid('/inspectIdent/list', JSON.stringify(param))
          this.$router.push({ path: '/inspectIdent/list', query: param })
          break
        case 'sixth':
          // this.$gotoid('/caseManage/ajrl', JSON.stringify(param))
          this.$router.push({ path: '/caseManage/ajrl', query: param })
          break
        default:
          break
      }
    },
    rowClick() {

    }
  },
  mounted() {
    this.depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.depToken.depCode.substring(0, 6) === '150000') {
      this.isMore = true
    }
    if (this.ajbh) {
      this.AJBH = this.ajbh
      this.AJID = this.ajid
      this.interFaceType = this.type
      this.isRls = this.Rl
    }
    // this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.ajInfo {
  position: relative;
}
.more_btn {
  position: absolute;
  top: 8px;
  right: 20px;
  z-index: 1;
  cursor: pointer;
  font-size: 14px;
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
}
@media only screen and (max-width: 1367px) {
  .more_btn {
    right: 10px;
  }
}
</style>
