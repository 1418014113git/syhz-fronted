<template>
  <div class="analysiskjbh">
   <!--案件分析研判--发展变化态势报表-->
    <el-form :inline="true" :model="filters" ref="filters" label-width="100px" class="form">
      <el-col :span="24">
        <el-form-item label="筛选日期">
           <el-select v-model="filters.selectType" placeholder="">
            <el-option v-for="item in ajType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="filters.selectDateType" placeholder="全部" clearable  @change="rlsjChange">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义时间" prop="startTime">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="startPickerOptions"
            placeholder="请选择开始时间"
            :disabled="zdyTimeDisabled"
            @change="startDateChangezdy">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="endTime" label-width="31px">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            :picker-options="endPickerOptions"
            :disabled="zdyTimeEndDisabled"
            @change="endDateChangezdy"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案件分类">
          <el-cascader v-model="fllb" change-on-select :options="fllbList" filterable clearable></el-cascader>
        </el-form-item>
         <el-form-item label="">
          <el-checkbox v-model="filters.Isinclude">统计子级</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="案件状态" class="">
          <el-select  v-model="ajzt" size="small" placeholder="全部" filterable clearable  @change="ajztChange">
            <el-option v-for="item in aztjSelectList" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-card v-loading="loading">
      <!--案件分布分析-->
      <case-fb  :queryParam="queryParam" class=""></case-fb>
      <!--案件侦办地区分析-->
      <case-zb  :queryData="zhuAndTableData" class="martop"></case-zb>
      <!--发案地域案件统计-->
      <case-area  :queryData="fadyTableData"  :queryParam="queryParam"  class="martop"></case-area>
      <!--发案地域统计-->
      <case-areabar  :queryData="zhuAndTableData"  class="martop"></case-areabar>
    </el-card>
  </div>
</template>

<script>
import { getSYHFLLBList } from '@/utils/codetotext'
import CaseFb from './components/casefb' // 案件分布分析
import CaseZb from './components/casezb' // 案件侦办地区分析
import CaseArea from './components/caseArea' // 发案地域案件统计
import CaseAreabar from './components/caseAreabar' // 发案地域统计
export default {
  name: 'ajList',
  components: {
    CaseFb,
    CaseZb,
    CaseArea,
    CaseAreabar
  },
  data() {
    return {
      filters: {
        selectType: 'la', // 筛选日期 la：立案日期, pa:破案日期
        selectDateType: '', // 筛选日期  // 下拉框类型
        startTime: '', // 自定义开始日期
        endTime: '', // 自定义结束日期
        Isinclude: true // 统计子级  默认勾选
      },
      fllb: [], // // 案件分类
      ajzt: '', // 案件状态code
      queryParam: {}, // 存储查询参数
      mapData: [], // 存储地图数据
      zhuAndTableData: [], // 存储柱状图以及报表数据
      fadyTableData: [], // 发案地域案件统计
      loading: false, // 页面加载进度条
      curAjztName: '', // 当前选择的案件状态中文名称
      fllbList: getSYHFLLBList(), // 案件分类下拉框数据
      zdyTimeDisabled: true, // 自定义时间输入框默认禁用，当认领时间选择了"自定义"时，可解除禁用
      zdyTimeEndDisabled: true, // 自定义结束时间禁用
      curDept: {}, // 当前登录的部门
      aztjSelectList: [], // 案件状态下拉框数据
      totlacx: 0, // 城区总计
      totaljq: 0, // 郊区总计
      totalzhen: 0, // 镇总计
      totalxc: 0, // 乡村总计
      totallq: 0, // 林区总计
      totalother: 0, // 其他总计
      totalAll: 0, // 总计总计
      ajType: [
        { value: 'la', label: '立案日期' },
        { value: 'pa', label: '破案日期' }
      ],
      typeOption: [ // 筛选日期下拉框
        { value: '', label: '全部' },
        { value: 'year', label: '本年' },
        { value: 'quarter', label: '本季' },
        { value: 'month', label: '本月' },
        { value: 'week', label: '本周' },
        { value: 'day', label: '本日' },
        { value: 'other', label: '自定义' }
      ],
      startPickerOptions: { // 自定义开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      endPickerOptions: {}, // 自定义结束时间的picker限制
      ajztAll: []
    }
  },
  methods: {
    init() {
      this.ajStatusSelect() // 案件状态
      this.query()
    },
    query(flag) { // 查询数据
      this.mapData = []
      this.zhuAndTableData = []
      const para = JSON.parse(JSON.stringify(this.filters))
      para.statusName = this.curAjztName // 案件状态中文名称
      para.classfy = this.fllb.length > 0 ? this.fllb.join(',') : '' // 案件分类
      this.queryParam = para // 存储查询参数
      para.deptType = this.curDept.depType === '4' ? (this.curDept.areaCode.substring(0, 4) === '6114' ? 2 : 3) : Number(this.curDept.depType) // 部门类型 如果是杨凌派出所则传支队类型，普通派出所传大队类型
      para.deptCode = this.curDept.areaCode // 区域code

      if (flag) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.loading = true
      this.$queryPost('ajfxyp/dataList', para).then((response) => {
        this.loading = false
        if (response.code === '000000') {
          this.mapData = response.data.mapData
          if (response.data.zhuAndTableData.length > 0) {
            this.zhuAndTableData = response.data.zhuAndTableData
            var data = JSON.parse(JSON.stringify(response.data.zhuAndTableData))
            this.dealData(data)
          }
        }
      }).catch(() => {
        this.loading = false
        this.mapData = []
        this.zhuAndTableData = []
        this.fadyTableData = []
      })
    },
    ajztChange(val) { // 案件状态change事件
      if (val) {
        var result = ''
        this.aztjSelectList.forEach(item => {
          if (item.code === val) {
            result = item.codeName
          }
        })
        this.curAjztName = result
      } else {
        this.curAjztName = ''
      }
    },
    startDateChangezdy(val) { // 自定义开始时间
      if (val) {
        this.zdyTimeEndDisabled = false // 自定义结束时间可输入
        this.endPickerOptions = this.$pickerOptionChange(val, this.endPickerOptions, 'end')
      } else {
        this.filters.startTime = ''
        this.filters.endTime = ''
        this.zdyTimeEndDisabled = true // 自定义结束时间禁用
        this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    endDateChangezdy(val) { // 自定义结束时间
      if (val) {
        this.startPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'start')
      } else {
        this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    resetForm() { // 重置
      this.$refs['filters'].resetFields()
      this.filters = {
        selectType: 'la', // 筛选日期 la：立案日期, pa:破案日期
        selectDateType: '', // 筛选日期  // 下拉框类型
        startTime: '', // 自定义开始日期
        endTime: '', // 自定义结束日期
        Isinclude: true // 统计子级  默认勾选
      }
      this.ajzt = '' // 案件状态code
      this.fllb = [] // // 案件分类
      this.zdyTimeDisabled = true // 自定义时间输入框默认禁用，当筛选日期选择了"自定义"时，可解除禁用
      this.zdyTimeEndDisabled = true // 自定义结束时间禁用
      this.curAjztName = '' // 清空案件状态中文名称
      this.ajztChange('') // 案件状态的change事件
      this.query()
    },
    changefllb() { // 案件分类
      this.query()
    },
    ajStatusSelect() { // 案件状态下拉框内容
      this.$query('tcpcode', { codeLx: 'ajzt' }).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajztAll = response.data // 不去重的案件状态
          const temp = {}
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            temp[element.codeName] = element.code
          }
          const arr = []
          for (const key in temp) {
            arr.push({ code: temp[key], codeName: key })
          }
          this.aztjSelectList = arr
        }
      }).catch(() => {
      })
    },
    rlsjChange(val) { // 筛选日期change事件
      this.filters.startTime = '' // 自定义开始日期
      this.filters.endTime = '' // 自定义结束日期
      if (val === 'other') { // 自定义
        this.zdyTimeDisabled = false // 激活自定义时间框
      } else {
        this.zdyTimeDisabled = true // 禁用自定义时间
      }
    },
    dealData(resData) { // 将接口返回的数据与静态的12盟市数据进行拼接
      this.expandstab = [] // 初始化展开项
      this.totlacx = 0 // 城区总计
      this.totaljq = 0 // 郊区总计
      this.totalzhen = 0 // 镇总计
      this.totalxc = 0 // 乡村总计
      this.totallq = 0 // 林区总计
      this.totalother = 0 // 其他总计
      this.totalAll = 0 // 总计总计
      for (let index = 0; index < resData.length; index++) {
        const element = resData[index]
        this.totlacx += element.chengqu // 城区
        this.totaljq += element.jiaoqu //  郊区
        this.totalzhen += element.zheng // 镇
        this.totalxc += element.xiangcun // 乡村
        this.totallq += element.linqu // 林区
        this.totalother += element.other // 其他
        this.totalAll += element.total // 总计总数
        if (this.curDept.depType === '1') { // 总队
          element.canExpand = true // 可展开
          element.canClick = true // 可点击跳转
        } else if (this.curDept.depType === '2') { // 地市支队
          element.canExpand = false // 不可展开
          element.canClick = true // 可点击跳转
        } else if ((this.curDept.depType === '3' && element.orgCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4)) || (this.curDept.depType === '4' && element.orgCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4))) { // 区县只能点击自己
          element.canExpand = false // 不可展开
          element.canClick = true // 可点击跳转
        }
      }
      this.fadyTableData = resData
      this.addSummaryRow() // 总计行
    },
    addSummaryRow() { // 增加总计行
      const sums = {} // 总计行数据
      sums.canClick = true // 可以点击
      sums.canExpand = false // 不可以展开
      sums.orgCode = ''
      sums.orgName = '总计'
      sums.chengqu = this.totlacx // 城区
      sums.jiaoqu = this.totaljq //  郊区
      sums.zheng = this.totalzhen // 镇
      sums.xiangcun = this.totalxc // 乡村
      sums.linqu = this.totallq // 林区
      sums.other = this.totalother // 其他
      sums.total = this.totalAll // 总计
      this.fadyTableData.push(sums)
    }
  },
  created() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.init()
  },
  activated() {
    this.init()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.analysiskjbh {
  .form{
    display: inline-block;
  }
  .el-table__expanded-cell {
    padding: 0;
  }
  .el-table__body-wrapper
    tbody
    .el-table__row:last-child
    .el-table__expand-icon {
    color: transparent;
  }

  //时间选择框disabled时的颜色
  .el-range-editor.is-disabled {
    background-color: rgba(0, 89, 130, 0.7);
    border-color: rgba(0, 160, 233, 0.6);
  }
  .el-range-editor.is-disabled input {
    background-color: transparent;
  }

  table {
    border: 1px solid #2f627a;
    border-bottom: none;
  }
  thead th {
    border-right: 1px solid #2f627a;
  }
  .el-table__body td {
    border-right: 1px solid #2f627a;
    border-bottom: 1px solid #2f627a;
  }
  .el-table__body-wrapper tr:nth-child(even) {
    background-color: transparent;
  }
  .datezhi {
    .el-form-item__label {
      text-align: center;
    }
  }
  .case-trend .card {
    margin-bottom: 20px;
  }
  .case-claim .el-table__expanded-cell {
    width: 500px;
    margin-left: 100px;
    padding: 0;
  }
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    text-decoration: underline;
  }
  .el-select .el-input--small .el-input__inner {
    height: 25px !important;
  }
  .tooltipShow {
    opacity: 1;
  }
  .tooltipHide {
    opacity: 0;
  }
  .el-cascader--small {
    font-size: 16px;
  }
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  .comTit{
    font-size: 17px;
    font-weight: bold;
    color: #bce8fc;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #bce8fc;
  }
  .el-checkbox__label {
    font-size: 16px;
  }
  .martop{
    margin-top: 15px;
  }
}
.el-popover {
  padding: 5px;
}
@media only screen and (max-width: 1367px) {
}
</style>
