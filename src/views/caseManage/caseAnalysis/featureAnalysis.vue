<template>
  <div class="feature" v-loading="featureLoading">
    <!-- 特征信息分析 -->
    <el-form :inline="true" :model="filters" ref="filters" label-width="80px" style="text-align: left;">
      <el-form-item label="立案日期" prop="ltimeType">
        <el-select  v-model="filters.ltimeType" size="small" placeholder="全部" @change="ltimeTypeChange">
          <el-option :label="item.label" :value="item.value" v-for="item in dateOption" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="lstartDate"  label-width="0px">
        <el-date-picker
          v-model="filters.lstartDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions1"
          @change="startDateChange1"
          placeholder="请选择开始时间"
          :disabled="filters.ltimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="lendDate" label-width="36px">
        <el-date-picker
          v-model="filters.lendDate"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="endDateChange1"
          :picker-options="endPickerOptions1"
          placeholder="请选择结束时间"
          :disabled="filters.ltimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件分类" prop="syhFllb">
        <el-cascader v-model="filters.syhFllb" change-on-select :options="fllbList" @change="changeajlxSelect" placeholder="全部" filterable clearable  class="inputw"></el-cascader>
      </el-form-item>
      <el-form-item label="" prop="syhFllbType"  label-width="0px">
        <!-- :disabled="!(filters.syhFllb&&filters.syhFllb.length>0)" -->
        <el-checkbox v-model="filters.syhFllbType" >统计子级</el-checkbox>
        <el-tooltip class="item" effect="dark" content="勾选统计子级时统计当前选中案件分类的子级（包括子级的下级）案件数量。" placement="top-start">
          <!-- <i class="el-icon-question"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
        </el-tooltip>
      </el-form-item>
      <br/>
      <el-form-item label="破案日期" prop="ptimeType">
        <el-select v-model="filters.ptimeType" size="small" placeholder="全部" @change="ptimeTypeChange">
          <el-option :label="item.label" :value="item.value" v-for="item in dateOption" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="pstartDate"  label-width="0px">
        <el-date-picker
          v-model="filters.pstartDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions2"
          @change="startDateChange2"
          placeholder="请选择开始时间"
          :disabled="filters.ptimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="pendDate" label-width="36px">
        <el-date-picker
          v-model="filters.pendDate"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="endDateChange2"
          :picker-options="endPickerOptions2"
          placeholder="请选择结束时间"
          :disabled="filters.ptimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件状态" prop="ajzt">
        <el-select  v-model="filters.ajzt" size="small">
          <el-option :label="item.name" :value="item.value" v-for="item in ajZtOption" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryFeatureData(true)">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 案件类别分析 -->
    <div v-loading="loading1">
      <div style="margin: 10px 0;">
        <span style="line-height:22px;">
          案件类别分析&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="根据查询条件分析全省案件数量排行前12的案件类别。" placement="top-start">
            <i class="el-icon-question" style="font-size:20px;"></i>
          </el-tooltip>
        </span>
        <span class="right canClick" @click="lookMore('1')">更多</span>
        <!-- <img src="/static/image/download.png" alt="" srcset="" title="下载" style="float:right;width:24px;margin-top: -5px;cursor:pointer;"> -->
      </div>
      <div id="echart1" style="height: 400px;margin:0 0 20px 0;"></div>
    </div>
    <!-- 案件罪名分析 -->
    <div>
      <div style="margin: 10px 0;">
        <span style="line-height:22px;">
          案件罪名分析&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="根据查询条件分析全省案件数量排行前12的案件罪名。" placement="top-start">
            <i class="el-icon-question" style="font-size:20px;"></i>
          </el-tooltip>
        </span>
        <span class="right canClick" @click="lookMore('2')">更多</span>
        <!-- <img src="/static/image/download.png" alt="" srcset="" title="下载" style="float:right;width:24px;margin-top: -5px;cursor:pointer;"> -->
      </div>
      <div id="echart2" style="height: 400px;margin:0 0 20px 0;"></div>
    </div>
    <!-- 案件来源分析 -->
    <div>
      <div style="margin: 10px 0;">
        <span style="line-height:22px;">
          案件来源分析&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="根据查询条件分析全省案件数量排行前12的案件来源。" placement="top-start">
            <i class="el-icon-question" style="font-size:20px;"></i>
          </el-tooltip>
        </span>
        <span class="right canClick" @click="lookMore('3')">更多</span>
        <!-- <img src="/static/image/download.png" alt="" srcset="" title="下载" style="float:right;width:24px;margin-top: -5px;cursor:pointer;"> -->
      </div>
      <div id="echart3" style="height: 400px;margin:0 0 20px 0;"></div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
      <el-row>
        <img src="/static/image/download.png" alt="" srcset="" title="下载" @click="downloadTable" style="float:right;width:24px;margin-bottom:5px;cursor:pointer;">
      </el-row>
      <el-table :data="moreList" :style="expandTableStyle" v-loading="tableLoading" max-height="450" class="table_th_center">
        <el-table-column type="index" label="序号" align="center" :width="60"></el-table-column>
        <el-table-column prop="name" label="案件类别" show-overflow-tooltip v-if="curType==='1'"></el-table-column>
        <el-table-column prop="name" label="案件罪名" show-overflow-tooltip v-if="curType==='2'"></el-table-column>
        <el-table-column prop="name" label="案件来源" show-overflow-tooltip v-if="curType==='3'"></el-table-column>
        <el-table-column prop="num" label="数量" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hb" label="环比" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="listTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                      :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;"></el-pagination>
      </el-col>
      <el-row style="text-align:center;margin: 20px 0 0;">
        <el-button type="primary" class="saveBtn" @click="closeDialog" >关 闭</el-button>
      </el-row>
    </el-dialog>
    <!--导出弹出层-->
    <el-dialog title="导出" :visible.sync="isShowdcdialog" class="dcForm">
      <div class="dctitle">
        <i class="el-icon-warning iconStyle"></i>
        <span style="font-weight: bold;">导出{{dcTitle}}</span>
      </div>
      <div class="checkArea">
        <el-radio-group v-model="dcType">
          <el-radio :label="2">全部查询结果</el-radio>
          <el-radio :label="1">当前页面</el-radio>
        </el-radio-group>
        <!-- <el-radio v-model="dcType" :label="1" style="margin-right:45px;">全部查询结果</el-radio> -->
        <!-- <el-radio v-model="dcType" :label="2" :disabled="checkId.length===0">当前页面</el-radio> -->
      </div>
      <el-row class="tabC martop btnUpLine">
        <el-button  @click="canceldc" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="exporttableList"  class="saveBtn">导出</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import importexport from '@/api/importexport'
import { getSYHFLLBList } from '@/utils/codetotext'
import echarts from 'echarts'
export default {
  name: 'featureAnalysis',
  data() {
    return {
      smallItemWidth: 60, // 表格最小格子的宽度
      dateOption: [
        { label: '本年', value: '1' },
        { label: '本季', value: '2' },
        { label: '本月', value: '3' },
        { label: '本周', value: '4' },
        { label: '本日', value: '5' },
        { label: '自定义', value: '6' }
      ],
      ajZtOption: [
        // { label: '受理', value: '1' },
        // { label: '立案', value: '2' },
        // { label: '破案', value: '3' },
        // { label: '转治安案件', value: '4' },
        // { label: '结案', value: '5' },
        // { label: '归档', value: '6' }
      ],
      featureLoading: false, // 全局的laoding
      loading1: false, // loading
      loading2: false, // loading
      loading3: false, // loading
      tableLoading: false, // 更多-表格的loading
      startPickerOptions1: {}, // 立案日期
      endPickerOptions1: {},
      startPickerOptions2: {}, // 破案日期
      endPickerOptions2: {},
      fllbList: getSYHFLLBList(), // 案件类型下拉框数据
      dialogVisible: false, // 更多 弹框是否显示
      filters: {
        ltimeType: '1',
        ptimeType: '1',
        pstartDate: '',
        pendDate: '',
        lstartDate: '',
        lendDate: '',
        syhFllb: [],
        syhFllbType: true, // 默认选中勾选子级
        ajzt: '' // 案件状态
      },
      teamLoading: false, // 统计loading
      showEchart: true,
      expands: [], // 展开的行
      echartAllData: {}, // 三个饼状图的数据源
      screenWidth: '', // 屏幕宽度
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      moreList: [], // 更多 数据
      curType: '', // 当前点击的标志
      dialogTitle: '', // 弹框的标题
      pageSize: 15,
      listTotal: 0,
      page: 1,
      systemTime: '', // 系统时间
      isShowdcdialog: false, // 导出的弹框
      dcType: 2, // 导出弹框的类型，默认是 全部查询结果
      dcTitle: '案件类别分析', // 导出时文字的显示控制
      downLoadUrl: importexport.exportModuleName, // nginx配置的文件下载
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  components: {
  },
  methods: {
    lookMore(type) { // 查看更多
      this.dialogVisible = true
      this.curType = type
      this.pageSize = 15 // 切换类型后 分页设置为初始状态
      this.page = 1
      switch (type) {
        case '1':
          this.dialogTitle = '案件类别分析'
          break
        case '2':
          this.dialogTitle = '案件罪名分析'
          break
        case '3':
          this.dialogTitle = '案件来源分析'
          break
        default:
          break
      }
      this.queryTableData(true, true, type)
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryTableData(false, true, this.curType)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryTableData(false, true, this.curType)
    },
    changeajlxSelect(val) { // 案件类型change事件
      // this.ajlbTooltipname = ''
      // this.ajzmTooltipname = ''
      // if (val && val.length > 0) {
      //   this.isDisable = false // 案件类别、案件罪名可选
      //   if (this.ajlxFirst || this.ajlxFirst !== val[0]) {
      //     this.ajlxFirst = val[0]
      //     this.queryAjlb(this.ajlxFirst) // 案件类别
      //     this.queryAjzm(this.ajlxFirst) // 案件罪名
      //   }
      // } else { // 清空案件类别和案件罪名
      //   this.isDisable = true // 案件类别、案件罪名禁用
      //   this.filters.ajlb = ''
      //   this.filters.ajzm = ''
      //   this.ajlbList = [] // 案件类别下拉框数据
      //   this.ajzmList = [] // 案件罪名下拉框数据
      // }
      // this.query()
    },
    initData() { // 初始化筛选条件
      this.getSysTime() // 查询系统时间
      this.featureLoading = true
      this.$query('caseajzt', {}).then((response) => {
        this.featureLoading = false
        if (response.code === '000000') {
          this.ajZtOption = response.data
          this.queryFeatureData() // 查询三大块内容
        }
      }).catch(() => {
        this.featureLoading = false
      })
    },
    queryFeatureData(hand, city) { // 查询
      if (this.filters.ltimeType === '6' && !this.filters.lstartDate && this.filters.lendDate) {
        this.$message.error('立案开始时间不能为空！')
        return false
      }
      if (this.filters.ptimeType === '6' && !this.filters.pstartDate && this.filters.pendDate) {
        this.$message.error('破案开始时间不能为空！')
        return false
      }
      var param = JSON.parse(JSON.stringify(this.filters))
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      if (this.deptInfo.depType === '1') { // 总队 各地市 可展开
        param.provinceCode = '610000'
      } else if (this.deptInfo.depType === '2') { // 支队 本地市 支队+区县大队
        param.cityCode = this.deptInfo.areaCode
      } else if (this.deptInfo.depType === '3') { // 大队 本区县大队
        param.departCode = this.deptInfo.depCode
      } else if (this.deptInfo.depType === '4') { // 派出所
        param.departCode = this.deptInfo.parentDepCode
      }
      if (!param.ltimeType) { // 立案日期类型
        param.ltimeType = '0'
      } else if (param.ltimeType === '6') { // 接口要求 如果是自定义传空
        param.ltimeType = ''
      }
      if (!param.ptimeType) { // 破案日期类型
        param.ptimeType = '0'
      } else if (param.ptimeType === '6') { // 接口要求 如果是自定义传空
        param.ptimeType = ''
      }
      param.syhFllb = param.syhFllb.join(',') // 案件分类
      param.syhFllbType = param.syhFllbType ? '1' : '2' // 筛选条件-是否统计子级
      this.queryCaseLbfx(param) // 查询案件类别分析
      this.queryCaseZmfx(param) // 查询案件罪名分析
      this.queryCaseLyfx(param) // 查询案件来源分析
    },
    queryCaseLbfx(param) { // 查询案件 类别分析
      this.loading1 = true
      this.$queryPost('caseAnalyzeFeature/ajlbTotal', param).then((response) => {
        this.loading1 = false
        if (response.code === '000000') {
          this.drawEchart(response.data, 'echart1')
        }
      }).catch(() => {
        this.loading1 = false
      })
    },
    queryCaseZmfx(param) { // 查询案件罪名分析
      this.loading2 = true
      this.$queryPost('caseAnalyzeFeature/ajzmTotal', param).then((response) => {
        this.loading2 = false
        if (response.code === '000000') {
          this.drawEchart(response.data, 'echart2')
        }
      }).catch(() => {
        this.loading2 = false
      })
    },
    queryCaseLyfx(param) { // 查询案件来源分析
      this.loading3 = true
      this.$queryPost('caseAnalyzeFeature/ajlyTotal', param).then((response) => {
        this.loading3 = false
        if (response.code === '000000') {
          this.drawEchart(response.data, 'echart3')
        }
      }).catch(() => {
        this.loading3 = false
      })
    },
    drawEchart(data, echartDom) { // 绘制柱状图
      var saveTitle = ''
      if (echartDom === 'echart1') {
        saveTitle = '案件类别分析'
      } else if (echartDom === 'echart2') {
        saveTitle = '案件类别分析'
      } else if (echartDom === 'echart3') {
        saveTitle = '案件类别分析'
      }
      var seriesData = []
      var xAxisData = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        seriesData.push(element.num)
        xAxisData.push(element.name)
      }
      var echart1 = echarts.init(document.getElementById(echartDom))
      echart1.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 66,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: saveTitle + '保存为图片',
              icon: 'image://static/image/download.png'
            }
          },
          itemSize: 20,
          iconStyle: {
            emphasis: { color: '#fff' }
          }
        },
        legend: {
          data: ['案件数量'],
          type: 'scroll',
          top: 0,
          itemGap: 15,
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: -10
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          }
        ],
        series: [
          {
            name: '案件数量',
            type: 'bar',
            barWidth: '60%',
            data: seriesData
          }
        ]
      })
    },
    queryTableData(flag, hand, queryType) { // 查询弹框的表格数据
      if (this.filters.ltimeType === '6' && !this.filters.lstartDate && this.filters.lendDate) {
        this.$message.error('立案开始时间不能为空！')
        return false
      }
      if (this.filters.ptimeType === '6' && !this.filters.pstartDate && this.filters.pendDate) {
        this.$message.error('破案开始时间不能为空！')
        return false
      }
      var param = JSON.parse(JSON.stringify(this.filters))
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      if (this.deptInfo.depType === '1') { // 总队 各地市 可展开
        param.provinceCode = '610000'
      } else if (this.deptInfo.depType === '2') { // 支队 本地市 支队+区县大队
        param.cityCode = this.deptInfo.areaCode
      } else if (this.deptInfo.depType === '3') { // 大队 本区县大队
        param.departCode = this.deptInfo.depCode
      } else if (this.deptInfo.depType === '4') { // 派出所
        param.departCode = this.deptInfo.parentDepCode
      }
      if (!param.ltimeType) { // 立案日期类型
        param.ltimeType = '0'
      } else if (param.ltimeType === '6') { // 接口要求 如果是自定义传空
        param.ltimeType = ''
      }
      if (!param.ptimeType) { // 破案日期类型
        param.ptimeType = '0'
      } else if (param.ptimeType === '6') { // 接口要求 如果是自定义传空
        param.ptimeType = ''
      }
      param.syhFllb = param.syhFllb.join(',') // 案件分类
      param.syhFllbType = param.syhFllbType ? '1' : '2' // 筛选条件-是否统计子级
      this.tableLoading = true
      this.page = flag ? 1 : this.page
      param.pageNum = this.page
      param.pageSize = this.pageSize
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      var requestUrl = ''
      if (queryType === '1') {
        requestUrl = 'caseAnalyzeFeature/ajlbHbTotal'
      } else if (queryType === '2') {
        requestUrl = 'caseAnalyzeFeature/ajzmHbTotal'
      } else if (queryType === '3') {
        requestUrl = 'caseAnalyzeFeature/ajlyHbTotal'
      }
      this.$queryPost(requestUrl, param).then((response) => {
        if (response.code === '000000') {
          this.tableLoading = false
          this.moreList = response.data.list
          this.listTotal = response.data.totalCount
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.tableLoading = false
      })
    },
    ltimeTypeChange(val) { // 立案时间 change
      this.filters.lstartDate = ''
      this.filters.lendDate = ''
      if (val) {
        this.buildTime('la')
      }
    },
    ptimeTypeChange(val) { // 破案时间change
      this.filters.pstartDate = ''
      this.filters.pendDate = ''
      if (val) {
        this.buildTime('pa')
      }
    },
    buildTime(type) {
      const systemDate = new Date(this.systemTime)
      let startTime = ''
      let endTime = ''
      var timeType = ''
      if (type === 'la') {
        timeType = this.filters.ltimeType
      } else if (type === 'pa') {
        timeType = this.filters.ptimeType
      }
      if (timeType === '1') { // 本年
        startTime = systemDate.getFullYear() + '-01-01'
        const day = new Date(systemDate.getFullYear(), 12, 0)
        endTime = systemDate.getFullYear() + '-12-' + day.getDate()
      }
      if (timeType === '2') { // 本季
        if (systemDate.getMonth() + 1 <= 3) {
          startTime = systemDate.getFullYear() + '-01-01'
          endTime = systemDate.getFullYear() + '-03-31'
        } else if (systemDate.getMonth() + 1 > 3 && systemDate.getMonth() + 1 <= 6) {
          startTime = systemDate.getFullYear() + '-04-01'
          endTime = systemDate.getFullYear() + '-06-30'
        } else if (systemDate.getMonth() + 1 > 6 && systemDate.getMonth() + 1 <= 9) {
          startTime = systemDate.getFullYear() + '-07-01'
          endTime = systemDate.getFullYear() + '-09-30'
        } else if (systemDate.getMonth() + 1 > 9 && systemDate.getMonth() + 1 <= 12) {
          startTime = systemDate.getFullYear() + '-10-01'
          endTime = systemDate.getFullYear() + '-12-31'
        }
      }
      if (timeType === '3') { // 本月
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-01'
        const day = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + day.getDate()
      }
      if (timeType === '4') { // 本周
        systemDate.setDate(systemDate.getDate() - systemDate.getDay() + 1)
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
        systemDate.setDate(systemDate.getDate() + 6)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
      }
      if (timeType === '5') { // 本日
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
      }
      if (type === 'la') {
        this.filters.lstartDate = startTime
        this.filters.lendDate = endTime
      } else if (type === 'pa') {
        this.filters.pstartDate = startTime
        this.filters.pendDate = endTime
      }
    },
    getSysTime() {
      this.$query('knowledge/queryTime').then(response => {
        this.systemTime = response.data
        this.buildTime('la') // 默认选择本年
        this.buildTime('pa')
      })
    },
    downloadTable() {
      this.isShowdcdialog = true
      if (this.curType === '1') {
        this.dcTitle = '案件类别分析'
      } else if (this.curType === '2') {
        this.dcTitle = '案件罪名分析'
      } else if (this.curType === '3') {
        this.dcTitle = '案件类来源分析'
      }
    },
    canceldc() {
      this.isShowdcdialog = false
    },
    exporttableList() { // 导出
      var param = JSON.parse(JSON.stringify(this.filters))
      param.provinceCode = '' // 省市部门 先设置为空
      param.cityCode = ''
      param.departCode = ''
      if (this.deptInfo.depType === '1') { // 总队 各地市 可展开
        param.provinceCode = '610000'
      } else if (this.deptInfo.depType === '2') { // 支队 本地市 支队+区县大队
        param.cityCode = this.deptInfo.areaCode
      } else if (this.deptInfo.depType === '3') { // 大队 本区县大队
        param.departCode = this.deptInfo.depCode
      } else if (this.deptInfo.depType === '4') { // 派出所
        param.departCode = this.deptInfo.parentDepCode
      }
      if (!param.ltimeType) { // 立案日期类型
        param.ltimeType = '0'
      } else if (param.ltimeType === '6') { // 接口要求 如果是自定义传空
        param.ltimeType = ''
      }
      if (!param.ptimeType) { // 破案日期类型
        param.ptimeType = '0'
      } else if (param.ptimeType === '6') { // 接口要求 如果是自定义传空
        param.ptimeType = ''
      }
      param.syhFllb = param.syhFllb.join(',') // 案件分类
      param.syhFllbType = param.syhFllbType ? '1' : '2' // 筛选条件-是否统计子级
      param.flag = this.dcType
      param.type = this.curType
      param.pageNum = this.page
      param.pageSize = this.pageSize

      var url = this.downLoadUrl + 'caseAnalyzeFeature/exporFile?flag=' + this.dcType + '&type=' + this.curType +
        '&lstartDate=' + param.lstartDate + '&lendDate=' + param.lendDate + '&pstartDate=' + param.pstartDate + '&pendDate=' + param.pendDate +
        '&ltimeType=' + param.ltimeType + '&ptimeType=' + param.ptimeType + '&syhFllb=' + param.syhFllb + '&syhFllbType=' + param.syhFllbType + '&ajzt=' + param.ajzt +
        '&provinceCode=' + param.provinceCode + '&cityCode=' + param.cityCode + '&departCode=' + param.departCode +
        '&pageNum=' + this.page + '&pageSize=' + this.pageSize
      window.location.href = url
    },
    reset() { // 重置
      this.resetForm('filters')
      this.queryFeatureData(true)
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    startDateChange1(val) {
      if (val) {
        // this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filters.laEndDate = '' // 结束时间清空
        // this.endDateDisabled = true
        this.startPickerOptions1 = Object.assign({}, 'startPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange1(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions1 = Object.assign({}, 'startPickerOptions1', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    startDateChange2(val) {
      if (val) {
        // this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filters.paEndDate = '' // 结束时间清空
        // this.endDateDisabled = true
        this.startPickerOptions2 = Object.assign({}, 'startPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange2(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions2 = Object.assign({}, 'startPickerOptions2', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    this.initData()
    // this.$nextTick(() => { // 页面渲染完成后的回调
    //   this.screenWidth = this.$refs.teamStatistical.$el.clientWidth + 'px'
    //   this.expandTableStyle = 'width:' + this.screenWidth + ';border-left: none;border-right: none;overflow-x:auto;'
    // })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.feature {
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    color: #00a0e9;
    text-decoration: underline;
    // text-decoration: underline;
  }
  .dcForm {
    .el-dialog {
      width: 25%;
    }
    .dcTitle {
      margin-bottom: 20px;
      padding-left: 15px;
    }
    .martop {
      margin-top: 20px;
    }
    .iconStyle {
      color: #e6a23c;
      font-size: 16px;
    }
    .dctitle {
      padding-left: 15px;
      margin-bottom: 15px;
    }
    .checkArea {
      // text-align: center;
    }
  }
}
</style>
