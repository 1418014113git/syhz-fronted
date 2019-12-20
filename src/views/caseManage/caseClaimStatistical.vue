<template>
  <section class="ajrlStatistical">
   <!--案件认领统计-->
    <el-form :inline="true" :model="filters" ref="filters" label-width="100px" class="form">
      <el-col :span="24">
        <el-form-item label="认领时间">
          <el-select v-model="filters.dType" placeholder="全部" clearable  @change="rlsjChange"  class="inputw">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义时间" prop="rlStartTime">
          <el-date-picker
          class="inputw"
            v-model="filters.rlStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="rlStartPickerOptions"
            placeholder="请选择开始时间"
            :disabled="zdyTimeDisabled"
            @change="startDateChangezdy">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="rlEndTime" class="datezhi">
          <el-date-picker
          class="inputw"
            v-model="filters.rlEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            :picker-options="rlEndPickerOptions"
            :disabled="zdyTimeEndDisabled"
            @change="endDateChangezdy"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="立案日期" prop="larqStart">
          <el-date-picker
          class="inputw"
            v-model="filters.larqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="laStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangeLa">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="larqEnd" class="datezhi">
           <el-date-picker
           class="inputw"
            v-model="filters.larqEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            :picker-options="laEndPickerOptions"
            @change="endDateChangeLa"
            :disabled="endDateDisabledLa">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="破案日期" prop="parqStart">
          <el-date-picker
          class="inputw"
            v-model="filters.parqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="paStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangePa">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="parqEnd"  class="datezhi">
          <el-date-picker
          class="inputw"
            v-model="filters.parqEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="paEndPickerOptions"
            placeholder="请选择结束时间"
            @change="endDateChangePa"
            :disabled="endDateDisabledPa">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案件状态" class="datezhi">
          <el-select  v-model="filters.ajzt" size="small" placeholder="全部" filterable clearable  @change="ajztChange" class="inputw">
            <el-option v-for="item in aztjSelectList" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件分类">
          <el-cascader v-model="filters.fllb" change-on-select :options="fllbList" @change="changeajlxSelect" filterable clearable  class="inputw"></el-cascader>
        </el-form-item>
        <el-form-item label="案件类别" class="datezhi">
          <el-tooltip effect="dark" :content="ajlbTooltipname" placement="top-start" :popper-class="(ajlbTooltipname&&ajlbTooltipname.length>6)===true?'tooltipShow':'tooltipHide'">
            <el-select  v-model="filters.ajlb" size="small" placeholder="全部" filterable clearable  class="inputw" :disabled="isDisable"  @change="changeajlbSelect">
              <el-option v-for="item in ajlbList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="案件罪名">
          <el-tooltip effect="dark" :content="ajzmTooltipname" placement="top-start" :popper-class="(ajzmTooltipname&&ajzmTooltipname.length>6)===true?'tooltipShow':'tooltipHide'">
            <el-select  v-model="filters.ajzm" size="small" placeholder="全部"  filterable clearable  class="inputw" :disabled="isDisable"  @change="changeajzmSelect">
              <el-option v-for="item in ajzmList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!--列表-->
    <el-table :data="caseData" v-loading="listLoading" ref="table" style="width: 100%;" :row-key='getRowKeys' :max-height="tableHeight" :expand-row-keys="expandstab"  @expand-change="handleExpand"
    :row-class-name="getRowClass">
      <!-- 地市下点击展开可查看下属部门 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.subDeptCaseData" v-loading="subLoading" style="width: 100%;">
            <el-table-column prop="" width="48"></el-table-column>
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="单位" min-width="10%" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="claimed" label="已认领（新增案件）" min-width="6%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.claimed>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'2')">{{$thousSplit(sonScope.row.claimed+'')}}</span>
                <span v-else >{{sonScope.row.claimed}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="toClaimed" label="待认领" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.toClaimed>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'1')">{{$thousSplit(sonScope.row.toClaimed+'')}}</span>
                <span v-else >{{sonScope.row.toClaimed}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="downward" label="已下发" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.downward>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'"  @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'3')">{{$thousSplit(sonScope.row.downward+'')}}</span>
                <span v-else >{{sonScope.row.downward}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="forward" label="已转发" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.forward>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'4')">{{$thousSplit(sonScope.row.forward+'')}}</span>
                <span v-else >{{sonScope.row.forward}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="left" label="重复合并" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.left>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkcfhb(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.deptCode,sonScope.row.deptType,'2')">{{$thousSplit(sonScope.row.left+'')}}</span>
                <span v-else >{{sonScope.row.left}}</span>
              </template>
            </el-table-column>
             <el-table-column prop="others" label="其他" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.others>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'5')">{{$thousSplit(sonScope.row.others+'')}}</span>
                <span v-else >{{sonScope.row.others}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="案件总数" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.total>0" :class="sonScope.row.canClickSon?'linkColor':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second',sonScope.row.cityCode,sonScope.row.districtCode,sonScope.row.deptCode,sonScope.row.deptType,'','secondTotal')">{{$thousSplit(sonScope.row.total+'')}}</span>
                <span v-else >{{sonScope.row.total}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index+1<caseData.length">{{scope.$index+1}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="cityName" label="省市" min-width="10%" align="center"></el-table-column>
      <el-table-column prop="claimed" label="已认领" min-width="6%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.claimed>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','2')">{{$thousSplit(scope.row.claimed+'')}}</span>
          <span v-else >{{scope.row.claimed}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="toClaimed" label="待认领" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.toClaimed>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','1')">{{$thousSplit(scope.row.toClaimed+'')}}</span>
          <span v-else >{{scope.row.toClaimed}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="downward" label="已下发" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.downward>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','3')">{{$thousSplit(scope.row.downward+'')}}</span>
          <span v-else >{{scope.row.downward}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="forward" label="已转发" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.forward>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','4')">{{$thousSplit(scope.row.forward+'')}}</span>
          <span v-else >{{scope.row.forward}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="left" label="重复合并" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.left>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkcfhb(scope.row.canClick,'first',scope.row.cityCode,'','','','2')">{{$thousSplit(scope.row.left+'')}}</span>
          <span v-else >{{scope.row.left}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="others" label="其他" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.others>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','5')">{{$thousSplit(scope.row.others+'')}}</span>
          <span v-else >{{scope.row.others}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="案件总数" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.total>0" :class="scope.row.canClick?'linkColor':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,'','','','',scope.row.cityName)">{{$thousSplit(scope.row.total+'')}}</span>
          <span v-else>{{scope.row.total}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 重复合并列表弹框 -->
    <el-dialog title="重复合并案件" :visible.sync="mergeVisible" :modal-append-to-body="false">
      <el-table :data="casesMerge" highlight-current-row v-loading="mergeLoading" style="width: 100%;" max-height="700px">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="案件名称" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件编号" width="230" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajbh}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="ajlbName" label="案件类别" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ajzt" label="案件状态" width="100" align="center">
        <template slot-scope="scope">
          {{getAjztName(scope.row.ajzt)}}
        </template>
      </el-table-column>
      <el-table-column prop="larq" label="立案日期" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.larq">{{$handlerDateTime(scope.row.larq)}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
// import http from '@/api/http'
// import { querySonDeptByCity } from '@/api/dept'
// import { getSessionDeptSelect } from '@/api/depts'
import { getSYHFLLBList } from '@/utils/codetotext'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {
        dType: '', // 认领时间  // 下拉框类型
        larqStart: '', // 立案开始日期
        larqEnd: '', // 立案结束日期
        parqStart: '', // 破案开始日期
        parqEnd: '', // 破案结束日期
        rlStartTime: '', // 自定义开始日期
        rlEndTime: '', // 自定义结束日期
        ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [] // // 案件类型
      },
      caseData: [], // 盟市的列表数据
      subDeptCaseData: [], // 下级部门列表数据
      curAjztName: '', // 当前选择的案件状态中文名称
      fllbList: getSYHFLLBList(), // 案件类型下拉框数据
      expandstab: [], // 设置当前的展开行
      zdyTimeDisabled: true, // 自定义时间输入框默认禁用，当认领时间选择了"自定义"时，可解除禁用
      zdyTimeEndDisabled: true, // 自定义结束时间禁用
      listLoading: false, // 列表加载loading
      subLoading: false, // 子列表loading
      isDisable: true, // 案件类别、案件罪名是否可选，默认不可选，当选择了案件类型时，案件类别、案件罪名可选。
      endDateDisabledLa: true, // 立案结束日期禁用
      endDateDisabledPa: true, // 破案结束日期禁用
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      aztjSelectList: [], // 案件状态下拉框数据
      ajlbList: [], // 案件类别下拉框数据
      ajzmList: [], // 案件罪名下拉框数据
      tableData: [], // 列表数据，
      ajlxFirst: '', // 当前选中的案件类别第一级
      ajlbTooltipname: '', // 案件类别tooltip名称
      ajzmTooltipname: '', // 案件罪名tooltip名称
      typeOption: [ // 认领时间下拉框
        { value: 'week', label: '本周' },
        { value: 'month', label: '本月' },
        { value: 'quarter', label: '本季' },
        { value: 'year', label: '本年' },
        { value: 'zdy', label: '自定义' }
      ],
      staticData: [
        {
          cityName: '省厅',
          cityCode: '610000'
        }, {
          cityName: '西安市',
          cityCode: '610100'
        }, {
          cityName: '铜川市',
          cityCode: '610200'
        }, {
          cityName: '宝鸡市',
          cityCode: '610300'
        }, {
          cityName: '咸阳市',
          cityCode: '610400'
        }, {
          cityName: '渭南市',
          cityCode: '610500'
        }, {
          cityName: '延安市',
          cityCode: '610600'
        }, {
          cityName: '汉中市',
          cityCode: '610700'
        }, {
          cityName: '榆林市',
          cityCode: '610800'
        }, {
          cityName: '安康市',
          cityCode: '610900'
        }, {
          cityName: '商洛市',
          cityCode: '611000'
        }, {
          cityName: '杨凌示范区',
          cityCode: '611400'
        },
        {
          cityName: '西咸新区',
          cityCode: '616200'
        }
      ],
      pickerOptions: { // 控制只能选小于当天的日期
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      laStartPickerOptions: { // 立案开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      laEndPickerOptions: {}, // 立案结束时间的picker限制
      paStartPickerOptions: { // 破案开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      paEndPickerOptions: {}, // 破案结束时间的picker限制
      rlStartPickerOptions: { // 自定义开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rlEndPickerOptions: {}, // 自定义结束时间的picker限制
      ajztAll: [],
      tableHeight: null,
      mergeVisible: false,
      mergeLoading: false,
      casesMerge: [] // 重复合并列表数据
    }
  },
  methods: {
    init() {
      sessionStorage.removeItem('/caseManage/ajrl') // 案件认领
      sessionStorage.removeItem('/caseManage/caseMergeList') // 重复合并
      this.ajStatusSelect() // 案件状态
      this.query()
    },
    query() {
      this.expandstab = []
      const para = JSON.parse(JSON.stringify(this.filters))
      para.ajztName = this.curAjztName // 案件状态（转换后的汉字）
      if (this.filters.fllb.length > 0) {
        para.fllb = this.filters.fllb.join(',')
      } else {
        para.fllb = ''
      }
      this.listLoading = true
      this.$query('ajrl/ajrltj', para).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          if (response.data.length > 0) {
            this.dealData(response.data)
          } else {
            this.initStaticData()
            this.caseData = this.staticData
            this.addSummaryRow() // 增加合计行
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    dealData(resData) { // 将接口返回的数据与静态的12盟市数据进行拼接
      this.totlaYrl = 0 // 已认领合计
      this.totalDrl = 0 // 待认领合计
      this.totalXf = 0 // 已下发合计
      this.totalZf = 0 // 已转发合计
      this.totalcfhb = 0 // 重复合并合计
      this.totalCx = 0 // 其他合计
      this.totalAll = 0 // 总数合计
      for (let i = 0; i < resData.length; i++) {
        const item = resData[i]
        for (let j = 0; j < this.staticData.length; j++) {
          var it = this.staticData[j]
          if (item.cityCode.indexOf(it.cityCode) > -1) {
            it = item
            this.$set(this.staticData, j, it) // 若没有set，则it更新了，但是staticData数组不更新
            break
          }
        }
      }
      this.caseData = Object.assign([], this.staticData)
      for (let index = 0; index < this.caseData.length; index++) {
        const element = this.caseData[index]
        element.total = element.claimed + element.toClaimed + element.others // “案件总数”，等于已认领+待认领+其他案件
        this.totlaYrl += element.claimed // 已认领
        this.totalDrl += element.toClaimed // 待认领
        this.totalXf += element.downward // 已下发
        this.totalZf += element.forward // 已转发
        this.totalcfhb += element.left // 重复合并
        this.totalCx += element.others // 其他
        this.totalAll += element.total // 案件总数
        if (this.curDept.depType === '1') { // 总队
          element.canExpand = true // 可展开
          element.canClick = true // 可点击跳转
        } else if ((this.curDept.depType === '2' && element.cityCode === this.curDept.areaCode) || (this.curDept.depType === '4' && element.cityCode === this.curDept.areaCode === '611400')) { // 地市支队 ,杨凌派出所和杨凌支队同权限
          element.canExpand = true // 可展开
          element.canClick = true // 可点击跳转
        } else if ((this.curDept.depType === '3' && element.cityCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4)) || (this.curDept.depType === '4' && element.cityCode.substring(0, 4) !== '6114' && this.curDept.areaCode.substring(0, 4) !== '6114' && element.cityCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4))) {
          element.canExpand = true // 可展开
          element.canClick = false // 不能点击
        }
      }
      this.addSummaryRow() // 合计行
    },
    addSummaryRow() { // 增加合计行
      const sums = {} // 合计行数据
      if (this.curDept.depType === '1') { // 总队可点击合计，地市区县不可以点击合计
        sums.canClick = true
      } else {
        sums.canClick = false
      }
      sums.canExpand = false
      sums.cityName = '合计'
      sums.claimed = this.totlaYrl
      sums.deptCode = ''
      sums.downward = this.totalXf
      sums.forward = this.totalZf
      sums.others = this.totalCx
      sums.toClaimed = this.totalDrl
      sums.left = this.totalcfhb // 重复合并
      sums.total = this.totalAll
      this.caseData.push(sums)
    },
    getRowClass(row) {
      var num = Number(row.row.claimed + row.row.downward + row.row.forward + row.row.others + row.row.toClaimed + row.row.left + row.row.total)
      if (num === 0 || !row.row.canExpand) {
        return 'row-expand-cover'
      }
    },

    handleExpand(row, expands) {
      if (expands.length) {
        this.expandstab = []
        if (row) {
          this.expandstab.push(row.cityCode)
          this.querySubDeptCaseData(row)
        } else {
          this.expandstab = []
        }
      }
      // if (row.cityCode) {
      //   if (this.expandstab.indexOf(row.cityCode) > -1) { // 展开项中存在
      //     this.expandstab.splice(this.expandstab.indexOf(row.cityCode), 1)
      //   } else { // 展开项中不存在
      //     this.expandstab.push(row.cityCode)
      //     this.querySubDeptCaseData(row)
      //   }
      // }
    },

    querySubDeptCaseData(row) {
      this.expands = [] // 初始化所有行不展开
      this.subLoading = true
      const para = JSON.parse(JSON.stringify(this.filters))
      para.ajztName = this.curAjztName // 案件状态（转换后的汉字）
      if (this.filters.fllb.length > 0) {
        para.fllb = this.filters.fllb.join(',')
      } else {
        para.fllb = ''
      }
      para.cityCode = row.cityCode
      this.$query('ajrl/ajrltj', para).then((response) => {
        if (response.code === '000000') {
          this.subLoading = false
          var sonResData = response.data
          for (let i = 0; i < sonResData.length; i++) {
            sonResData[i].total = 0
          }
          this.subDeptCaseData = sonResData
          for (let index = 0; index < this.subDeptCaseData.length; index++) {
            const element = this.subDeptCaseData[index]
            element.total = element.claimed + element.toClaimed + element.others // “案件总数”，等于已认领+待认领+撤销案件
            if (this.curDept.depType === '1') { // 总队
              element.canClickSon = true // 可点击跳转
            } else if ((this.curDept.depType === '2' && element.cityCode === this.curDept.areaCode) || (this.curDept.depType === '4' && element.cityCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4) === '6114')) { // 地市支队 ,杨凌派出所和杨凌支队同权限
              element.canClickSon = true // 可点击跳转
            } else if ((this.curDept.depType === '3' && element.deptCode === this.curDept.depCode) || (this.curDept.depType === '4' && element.deptCode === this.curDept.parentDepCode)) { // 旗县区只能点击自己, 派出所和他的上级单位同权限
              element.canClickSon = true // 可点击跳转
            } else {
              element.canClickSon = false // 不可点击
            }
            this.$set(this.subDeptCaseData, index, element)

            if (this.caseData && this.caseData.length > 0) {
              for (let i = 0; i < this.caseData.length; i++) {
                const item = this.caseData[i]
                if (item.cityCode === row.cityCode) {
                  item.subDeptCaseData = this.subDeptCaseData
                }
              }
            }
          }
        }
      }).catch(() => {
        this.subLoading = false
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
        // return result
      } else {
        this.curAjztName = ''
        // return ''
      }
      this.query()
    },
    getAjztName(ajzt) { // 取案件状态汉字
      for (let i = 0; i < this.ajztAll.length; i++) {
        const item = this.ajztAll[i]
        if (String(ajzt) === String(item.code)) {
          return item.codeName
        }
      }
    },
    startDateChangeLa(val) { // 立案开始时间change事件
      if (val) {
        this.endDateDisabledLa = false // 立案结束日期可输入
        this.laEndPickerOptions = this.$pickerOptionChange(val, this.laEndPickerOptions, 'end')
      } else {
        this.filters.larqStart = ''
        this.filters.larqEnd = ''
        this.endDateDisabledLa = true // 立案结束日期禁用
        this.laStartPickerOptions = this.$pickerOptionChange('', this.laStartPickerOptions, 'default')
      }
      this.query()
    },
    endDateChangeLa(val) { // 立案结束时间change事件
      if (val) {
        this.laStartPickerOptions = this.$pickerOptionChange(val, this.laStartPickerOptions, 'start')
      } else {
        this.laStartPickerOptions = this.$pickerOptionChange('', this.laStartPickerOptions, 'default')
      }
      this.query()
    },
    startDateChangePa(val) { // 破案开始时间change事件
      if (val) {
        this.endDateDisabledPa = false // 破案结束时间可输入
        this.paEndPickerOptions = this.$pickerOptionChange(val, this.paEndPickerOptions, 'end')
      } else {
        this.filters.parqStart = ''
        this.filters.parqEnd = ''
        this.endDateDisabledPa = true // 破案结束时间禁用
        this.paStartPickerOptions = this.$pickerOptionChange('', this.paStartPickerOptions, 'default')
      }
      this.query()
    },
    endDateChangePa(val) { // 破案结束时间change事件
      if (val) {
        this.paStartPickerOptions = this.$pickerOptionChange(val, this.paStartPickerOptions, 'start')
      } else {
        this.paStartPickerOptions = this.$pickerOptionChange('', this.paStartPickerOptions, 'default')
      }
      this.query()
    },
    startDateChangezdy(val) { // 自定义开始时间
      if (val) {
        this.zdyTimeEndDisabled = false // 自定义结束时间可输入
        this.rlEndPickerOptions = this.$pickerOptionChange(val, this.rlEndPickerOptions, 'end')
      } else {
        this.filters.rlStartTime = ''
        this.filters.rlEndTime = ''
        this.zdyTimeEndDisabled = true // 自定义结束时间禁用
        this.rlStartPickerOptions = this.$pickerOptionChange('', this.rlStartPickerOptions, 'default')
      }
      this.query()
    },
    endDateChangezdy(val) { // 自定义结束时间
      if (val) {
        this.rlStartPickerOptions = this.$pickerOptionChange(val, this.rlStartPickerOptions, 'start')
      } else {
        this.rlStartPickerOptions = this.$pickerOptionChange('', this.rlStartPickerOptions, 'default')
      }
      this.query()
    },
    linkAjrl(canClick, level, cityCode, districtCode, deptCode, deptType, type, isSum) { // 跳转到案件认领列表
      if (!canClick) {
        return false
      }
      var param = JSON.parse(JSON.stringify(this.filters))
      param.origin = 'statistical' // 表示从统计跳转过去的
      param.deptLevel = level // 区分是一级还是二级
      param.cityCode = cityCode // 当前点击的cityCode
      param.districtCode = districtCode // 区县code
      param.deptCode = deptCode// 当前点击的部门code  // 张开项里才有此值
      param.colType = type // 待认领...等  认领状态
      param.ajztName = this.curAjztName // 案件状态中文名称
      param.deptType = deptType // 部门类型

      if (!type) {
        if (isSum === 'secondTotal' || isSum !== '合计') { // 二级列表的案件总数和一级非合计行的案件总数
          param.statusStr = '3,5,10' // 已认领,待认领,其他
        }
      }
      if (param.dType && param.dType !== 'zdy') { // 认领时间筛选框
        param.dType = param.dType // 认领时间筛选值
      }
      this.$gotoid('/caseManage/ajrl', JSON.stringify(param))
    },
    linkcfhb(canClick, level, cityCode, deptCode, deptType, type) { // 跳转重复合并列表
      if (!canClick) {
        return false
      }
      this.mergeVisible = true
      this.casesMerge = []
      const para = JSON.parse(JSON.stringify(this.filters))
      para.ajztName = this.curAjztName // 案件状态（转换后的汉字）
      if (this.filters.fllb.length > 0) {
        para.fllb = this.filters.fllb.join(',')
      } else {
        para.fllb = ''
      }
      if (deptCode) {
        para.deptCode = deptCode
      } else if (cityCode) {
        para.cityCode = cityCode
      }
      this.mergeLoading = true
      this.$query('mergeajjbxxsyh', para).then((response) => {
        if (response.code === '000000') {
          this.mergeLoading = false
          this.casesMerge = response.data
        }
      }).catch(() => {
        this.mergeLoading = false
      })
      // var param = JSON.parse(JSON.stringify(this.filters))
      // param.origin = 'statistical' // 表示从统计跳转过去的
      // param.deptLevel = level // 区分是一级还是二级
      // param.cityCode = cityCode // 当前点击的cityCode
      // param.deptCode = deptCode// 当前点击的部门code  // 张开项里才有此值
      // param.colType = type // 待认领...等  认领状态
      // param.ajztName = this.curAjztName // 案件状态中文名称
      // param.deptType = deptType // 部门类型
      // if (param.dType && param.dType !== 'zdy') { // 认领时间筛选框
      //   param.dType = param.dType // 认领时间筛选值
      // }
      // this.$gotoid('/caseManage/caseMergeList', JSON.stringify(param))
    },
    initStaticData() {
      this.staticData = [
        {
          cityName: '省厅',
          cityCode: '610000'
        }, {
          cityName: '西安市',
          cityCode: '610100'
        }, {
          cityName: '铜川市',
          cityCode: '610200'
        }, {
          cityName: '宝鸡市',
          cityCode: '610300'
        }, {
          cityName: '咸阳市',
          cityCode: '610400'
        }, {
          cityName: '渭南市',
          cityCode: '610500'
        }, {
          cityName: '延安市',
          cityCode: '610600'
        }, {
          cityName: '汉中市',
          cityCode: '610700'
        }, {
          cityName: '榆林市',
          cityCode: '610800'
        }, {
          cityName: '安康市',
          cityCode: '610900'
        }, {
          cityName: '商洛市',
          cityCode: '611000'
        }, {
          cityName: '杨凌示范区',
          cityCode: '611400'
        },
        {
          cityName: '西咸新区',
          cityCode: '616200'
        }
      ]
      for (let index = 0; index < this.staticData.length; index++) { // 初始化地市市数据全为0
        const element = this.staticData[index]
        element.index = index
        element.claimed = 0
        element.toClaimed = 0
        element.downward = 0
        element.forward = 0
        element.others = 0
        element.total = 0
      }
    },
    resetForm() { // 重置
      this.$refs['filters'].resetFields()
      this.filters = {
        type: '', // 认领时间
        larqStart: '', // 立案开始日期
        larqEnd: '', // 立案结束日期
        parqStart: '', // 破案开始日期
        parqEnd: '', // 破案结束日期
        rlStartTime: '', // 自定义开始日期
        rlEndTime: '', // 自定义结束日期
        ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [] // // 案件类型
      }
      this.zdyTimeDisabled = true // 自定义时间输入框默认禁用，当认领时间选择了"自定义"时，可解除禁用
      this.zdyTimeEndDisabled = true // 自定义结束时间禁用
      this.isDisable = true // 案件类别、案件罪名是否可选，默认不可选，当选择了案件类型时，案件类别、案件罪名可选。
      this.endDateDisabledLa = true // 立案结束日期禁用
      this.endDateDisabledPa = true // 破案结束日期禁用
      this.curAjztName = '' // 清空案件名称中文
      this.ajlbTooltipname = '' // 清空案件类别Tooltip
      this.ajzmTooltipname = '' // 清空案件罪名Tooltip
      this.ajlbList = [] // 案件类别下拉框数据
      this.ajzmList = [] // 案件罪名下拉框数据
      this.ajztChange('') // 案件状态的change事件
      this.query()
    },
    getRowKeys(row) {
      return row.cityCode
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
    changeajlbSelect(val) { // 案件类别通过change事件获取Tooltip名称
      if (val) {
        this.ajlbList.forEach(item => {
          if (val === item.code) {
            this.ajlbTooltipname = item.name
          }
        })
      } else {
        this.ajlbTooltipname = ''
      }
      this.query()
    },
    changeajzmSelect(val) { // 案件罪名通过change事件获取Tooltip名称
      if (val) {
        this.ajzmList.forEach(item => {
          if (val === item.code) {
            this.ajzmTooltipname = item.name
          }
        })
      } else {
        this.ajzmTooltipname = ''
      }
      this.query()
    },
    changeajlxSelect(val) { // 案件类型change事件
      this.ajlbTooltipname = ''
      this.ajzmTooltipname = ''
      if (val && val.length > 0) {
        this.isDisable = false // 案件类别、案件罪名可选
        if (this.ajlxFirst || this.ajlxFirst !== val[0]) {
          this.ajlxFirst = val[0]
          this.queryAjlb(this.ajlxFirst) // 案件类别
          this.queryAjzm(this.ajlxFirst) // 案件罪名
        }
      } else { // 清空案件类别和案件罪名
        this.isDisable = true // 案件类别、案件罪名禁用
        this.filters.ajlb = ''
        this.filters.ajzm = ''
        this.ajlbList = [] // 案件类别下拉框数据
        this.ajzmList = [] // 案件罪名下拉框数据
      }
      this.query()
    },
    queryAjlb(category) { // 案件类别
      this.$query('ajlb', { category: category }).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbList = response.data
        }
      })
    },
    queryAjzm(category) { // 案件罪名
      this.$query('ajzm', { category: category }).then(response => {
        if (response.data && response.data.length > 0) {
          this.ajzmList = response.data
        }
      })
    },
    rlsjChange(val) { // 认领时间change事件
      this.filters.rlStartTime = '' // 自定义开始日期
      this.filters.rlEndTime = '' // 自定义结束日期
      if (val === 'zdy') { // 自定义
        this.zdyTimeDisabled = false // 激活自定义时间框
      } else {
        this.zdyTimeDisabled = true // 禁用自定义时间
      }
      this.query()
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detail/' + row.id })
      if (row.status === '5' || row.status === '已认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, rlDept: row.noticeOrgCode, isRl: '1' } // 展示申请督办等按钮
        })
      } else if (row.status === '3' || row.status === '待认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '0', rlId: row.id, rlDept: row.noticeOrgCode } // 展示 待认领按钮
        })
      } else {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
        })
      }
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.initStaticData()
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 290
    if (sessionStorage.getItem('depToken')) { // 当前部门
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
.ajrlStatistical {
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
  .inputw {
    width: 220px;
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
}
@media only screen and (max-width: 1367px) {
}
</style>
