<template>
  <section>
    <!--工具条-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="zjhm || AJBH || zbtjType">   <!--返回-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="97px" class="form">
        <el-form-item label="认领单位 厅">
          <el-tooltip class="item" effect="dark" :content="selectCurTingDep.name" placement="top-start" :popper-class="(selectCurTingDep.name&&selectCurTingDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-cascader
              v-model="tingOrgCode"
              :options="tingDep"
              change-on-select
              @change="tingDepChange" :clearable="true"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="市">
          <el-tooltip class="item" effect="dark" :content="selectCurShiDep.name" placement="top-start" :popper-class="(selectCurShiDep.name&&selectCurShiDep.name.length>4)?'tooltipShow':'tooltipHide'">
            <el-cascader
              v-model="shiOrgCode"
              :options="shiDep"
              change-on-select
              @change="shiDepChange" :clearable="true"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="县区">
          <el-tooltip class="item" effect="dark" :content="selectCurQiDep.name" placement="top-start" :popper-class="(selectCurQiDep.name&&selectCurQiDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-select :clearable="true" v-model="qiOrgCode" size="small" placeholder="请选择" filterable @change="qiDepChange">
              <el-option v-for="item in qiDep" :key="item.id" :label="item.name" :value="item.depCode"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="案件状态">
          <el-select :clearable="true" v-model="filters.ajzt" size="small" placeholder="请选择" filterable @change="ajztChange">
            <el-option v-for="item in ajztData" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件类别">
          <el-select :clearable="true" v-model="filters.ajlb" size="small" placeholder="请选择" filterable>
            <el-option v-for="item in ajlbData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件罪名">
          <el-select :clearable="true" v-model="filters.ajzm" size="small" placeholder="请选择" filterable>
            <el-option v-for="item in ajzmData" :key="item.code" :label="item.SYH_AJLB_NAME" :value="item.SYH_AJLB"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="立案日期" prop="startTime">
          <el-date-picker
            v-model="filters.larqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangeLa">
          </el-date-picker>
          <el-date-picker
            v-model="filters.larqEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChangeLa"
            :disabled="endDateDisabledLa">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="破案日期" prop="startTime">
          <el-date-picker
            v-model="filters.parqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangePa">
          </el-date-picker>
          <el-date-picker
            v-model="filters.parqEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChangePa"
            :disabled="endDateDisabledPa">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案件类型">
          <el-cascader v-model="filters.fllb" change-on-select filterable :options="fllbList" @change="handleChange" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="读取状态">
          <el-select :clearable="true" v-model="filters.confirmStatus" size="small" placeholder="请选择" filterable>
            <el-option v-for="item in dqztData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filters.words" size="small" placeholder="请输入关键词" clearable maxlength="50"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" size="small" v-if="$isViewBtn('100101')" v-on:click="getCase(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-on:click="reset()">重置</el-button>
          <el-button type="primary" size="small"  v-on:click="handleAllRead()" v-if="tingDepArr.indexOf(this.curDept.depCode) > -1">一键已读</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;"  class="statisticCollect"  :max-height="tableHeight">
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="简要案情">
              <span>{{ props.row.jyaq }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="52"></el-table-column>
      <el-table-column label="案件名称" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件编号" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajbh}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="ajlbName" label="案件类别" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="fllbName" label="案件类型" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="larq" label="立案日期" width="110" ></el-table-column>
      <el-table-column prop="ajztName" label="案件状态" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="parq" label="破案日期" width="110" ></el-table-column>
      <el-table-column prop="orgName" label="认领单位" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ajzm" label="案件罪名" min-width="200" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="jyaq" label="简要案情" min-width="300" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="confirmStatusName" label="状态" min-width="120" ></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets"  circle @click="handleAjDetail(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { getAJJBXXSYHPage } from '@/api/caseManage'
import { getSessionDeptSelect } from '@/api/depts'
// import { getAjrlDept, getAjrlParentDept, getDeptLevel, ajrlListDepts, getAjrlNSXJ, getTree } from '@/api/dept'
import { getAjrlDept, getDeptLevel, ajrlListDepts, getTree } from '@/api/dept'
import { getSYHFLLBList, getAJLBText } from '@/utils/codetotext'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {
        ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [], // 案件类型
        larqStart: '', // 立案日期
        larqEnd: '',
        parqStart: '', // 破案日期
        parqEnd: '',
        confirmStatus: '' // 上报状态
      },
      ajtjparam: {}, // 案件侦办统计表进来时，请求的参数
      cases: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tingOrgCode: [],
      shiOrgCode: [],
      qiOrgCode: null,
      tingDep: [],
      shiDep: [],
      qiDep: [],
      selectDepList: getSessionDeptSelect(),
      depLevel: 0,
      selectCurTingDep: {}, // 当前选择的机构
      selectCurShiDep: {},
      selectCurQiDep: {},
      ajztData: [], // 案件状态
      ajlbData: [], // 案件类别
      ajzmData: [], // 案件罪名
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      zjhm: '', // 从人员档案跳转过来 携带的身份证
      dqztData: [
        { label: '上报未读', value: '1' },
        { label: '上报已读', value: '2' }
      ],
      fllbList: getSYHFLLBList(), // 案件分类类别
      curAjztName: '', // 当前选择的案件状态
      endDateDisabledLa: true,
      endDateDisabledPa: true,
      isAjda: false, // 是否是从案件档案跳转过来的
      AJBH: '', // 案件编号
      AJID: '', // 案件id
      zbtjType: '', // 存储从案件侦办统计跳转过来传递的类型
      tingDepArr: ['150000535500', '150000535400', '150000535300'], // 有读取状态的权限的三个部门集合，不一定是depLevel===1
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // }
      },
      shiOrgFlag: true, // true表示的是初始化时，从案件统计表进来默认选中的值。若为 false说明值有被change
      CurshiOrgCode: [], // 存储从案件统计表跳转进来存在的市code
      cityList: [
        {
          label: '西安市', value: '1501', depCode: '150100000000'
        }, {
          label: '铜川市', value: '1502', depCode: '150200000000'
        }, {
          label: '宝鸡市', value: '1503', depCode: '150300000000'
        }, {
          label: '咸阳市', value: '1504', depCode: '150400000000'
        }, {
          label: '渭南市', value: '1505', depCode: '150500000000'
        }, {
          label: '延安市', value: '1506', depCode: '150600000000'
        }, {
          label: '汉中市', value: '1507', depCode: '150700000000'
        }, {
          label: '榆林市', value: '1508', depCode: '150800000000'
        }, {
          label: '安康市', value: '1509', depCode: '150900000000'
        }, {
          label: '商洛市', value: '1522', depCode: '152200000000'
        }
      ],
      tableHeight: null
    }
  },
  methods: {
    handleChange(value) {
      // console.log(value)
    },
    handleCurrentChange(val) {
      this.page = val
      this.getCase(false)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCase(true)
    },
    getCase(flag) {
      if (this.filters.larqStart === '' && this.filters.larqEnd !== '') { // 开始时间为空,结束时间不为空
        this.$message({
          message: '立案开始时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.larqStart && this.filters.larqEnd === '') { // 选择了开始时间,结束时间为空
        this.$message({
          message: '立案结束时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.larqStart && this.filters.larqEnd) { // 开始时间和结束时间均不为空
        if (new Date(this.filters.larqStart).getTime() > new Date(this.filters.larqEnd).getTime()) {
          this.$message({
            message: '立案结束时间不能小于开始时间', type: 'error'
          })
          return false
        }
      }
      if (this.filters.parqStart === '' && this.filters.parqEnd !== '') { // 开始时间为空,结束时间不为空
        this.$message({
          message: '破案开始时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.parqStart && this.filters.parqEnd === '') { // 选择了开始时间,结束时间为空
        this.$message({
          message: '破案结束时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.parqStart && this.filters.parqEnd) { // 开始时间和结束时间均不为空
        if (new Date(this.filters.parqStart).getTime() > new Date(this.filters.parqEnd).getTime()) {
          this.$message({
            message: '破案结束时间不能小于开始时间', type: 'error'
          })
          return false
        }
      }
      this.page = flag ? 1 : this.page
      var para = JSON.parse(JSON.stringify(this.filters))
      para.ajzt = this.curAjztName
      para.zjhm = this.zjhm || '' // 身份证号码
      if (this.filters.fllb.length > 0) {
        para.fllb = this.filters.fllb.join(',')
      } else {
        para.fllb = ''
      }
      if (this.qiOrgCode) {
        para.deptCode = this.qiOrgCode
      } else {
        if (this.shiOrgCode && this.shiOrgCode.length > 0) {
          if (this.shiOrgCode.length > 1) {
            para.deptCode = this.shiOrgCode[this.shiOrgCode.length - 1]
          } else {
            para.deptCode = this.shiOrgCode[0]
          }
        } else {
          if (this.tingOrgCode && this.tingOrgCode.length > 0) {
            if (this.tingOrgCode.length > 1) {
              para.deptCode = this.tingOrgCode[this.tingOrgCode.length - 1]
            } else {
              para.deptCode = this.tingOrgCode[0]
            }
          } else {
            if (this.curDept.depCode.substr(0, 6) !== '150000') {
              if (this.curDept.depCode.substr(4, 2) !== '00') {
                para.deptCode = this.curDept.depCode
              } else {
                para.deptCode = this.curDept.depCode.substr(0, 4)
              }
            }
          }
        }
      }
      if (this.$route.query.fadtType && this.$route.query.noAjbh && this.$route.query.time) {
        para.fadtType = this.$route.query.fadtType // fadtType: 类型表示  传获取的字段名,如 ad3, ad15 等
        para.noAjbh = this.$route.query.noAjbh // noAjbh: 案件编号
        para.time = this.$route.query.time // time: 当前案件FXSJ 前8位
        this.AJBH = this.$route.query.noAjbh
        if (this.$route.query.id) {
          this.AJID = this.$route.query.id
        }
      }
      para.curDeptCode = this.curDept.depCode // 当前登录部门code，必传
      para.pageNum = this.page
      para.pageSize = this.pageSize
      this.listLoading = true
      getAJJBXXSYHPage(para).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          const data = response.data
          for (let index = 0; index < data.list.length; index++) {
            const element = data.list[index]
            element.fllbName = this.getFllbName(element.fllb)
            if (element.confirmStatus === null || element.confirmStatus === undefined || element.confirmStatus === 2) {
              element.confirmStatusName = '上报已读'
            } else if (element.confirmStatus === 1) {
              element.confirmStatusName = '上报未读'
            }
          }
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.cases = data.list
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getFllbName(fllb) {
      if (fllb && fllb.indexOf(',') > -1) {
        const array = fllb.split(',')
        let text = ''
        for (let i = 0; i < array.length; i++) {
          text += '，' + getAJLBText(array[i])
        }
        return text.substring(1, text.length)
      } else {
        return getAJLBText(fllb)
      }
    },
    initAll() {
      this.initDept()
      this.initAjzt() // 案件状态
      this.initAjlb() // 案件类别
      this.initAjzm() // 案件罪名
    },
    initDept() {
      this.depLevel = getDeptLevel(this.curDept.depCode)
      // if (this.depLevel === 1) {
      this.getTingTree()
      // } else if (this.depLevel === 2) {
      this.getShiArray()
      // if (this.depLevel === 2) {
      //   if (this.shiOrgCode.length === 0) {
      //     this.shiOrgCode = [this.curDept.depCode.substring(0, 4), this.curDept.depCode]
      //   }
      // }
      this.shiDepChange(this.shiOrgCode)
      // } else if (this.depLevel === 3) {
      if (this.depLevel === 3) {
        // this.qiDep = ajrlListDepts(getSessionDeptSelect(), this.curDept.depCode)
        // this.qiOrgCode = this.curDept.depCode
        this.qiDepChange(this.qiOrgCode)
      }
      // }
      this.deptList = getAjrlDept(getSessionDeptSelect(), this.curDept.depCode)
      // this.parentDeptList = getAjrlParentDept(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
      // this.tjnsxjDeptList = getAjrlNSXJ(getSessionDeptSelect(), this.curDept.depCode)
    },
    getTingTree() {
      const tings = ajrlListDepts(getSessionDeptSelect(), '150000530000')
      const arrayTemp = [{
        value: '0000',
        label: '全省',
        depCode: '150000000000'
      }]
      for (let i = 0; i < tings.length; i++) {
        const dept = tings[i]
        dept.value = dept.depCode
        if (dept.depCode === '150000530000') {
          dept.label = '总队'
          dept.parentCode = ''
          arrayTemp.push(dept)
        }
        if (dept.depCode === '150000535300') {
          dept.label = '食品犯罪侦查支队'
          dept.parentCode = '150000530000'
          arrayTemp.push(dept)
        }
        if (dept.depCode === '150000535400') {
          dept.label = '药品犯罪侦查支队'
          dept.parentCode = '150000530000'
          arrayTemp.push(dept)
        }
        if (dept.depCode === '150000535500') {
          dept.label = '环境犯罪侦查支队'
          dept.parentCode = '150000530000'
          arrayTemp.push(dept)
        }
      }
      this.tingDep = getTree(arrayTemp)
      this.getShiArray()
    },
    getShiArray() { // 市array
      this.shiDep = []
      const shiDeptsArray = []
      const reObj = []
      for (let i = 0; i < this.selectDepList.length; i++) {
        const dept = this.selectDepList[i]
        if (dept.parentCode === '150000530000') {
          this.getShiTree(dept, reObj, shiDeptsArray)
        }
      }
      this.shiDep = getTree(shiDeptsArray.concat(this.cityList))
    },
    getShiTree(dept, reObj, shiDeptsArray) {
      dept.value = dept.depCode
      if (dept.depCode.substring(0, 6) === '150600') {
        if (dept.depCode.substring(8, 12) === '0000') {
          // 支队
          if (reObj[dept.depCode.substring(0, 6)]) {
            // 已设置
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = dept.depCode.substring(0, 6) + '000000'
            shiDeptsArray.push(dept)
            reObj[dept.depCode.substring(0, 6)].push(dept.depCode)
          } else {
            // 未设置
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = dept.depCode.substring(0, 6) + '000000'
            shiDeptsArray.push(dept)
            reObj[dept.depCode.substring(0, 6)] = [dept.depCode]
          }
        } else {
          // 内设
          const arr = reObj[dept.depCode.substring(0, 6)]
          for (let j = 0; j < arr.length; j++) {
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = arr[j]
            shiDeptsArray.push(dept)
          }
        }
      } else {
        if (dept.depCode.substring(8, 12) === '0000') {
          // 支队
          dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
          dept.parentCode = dept.depCode.substring(0, 4) + '00000000'
          shiDeptsArray.push(dept)
        } else {
          // 内设
          dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
          dept.parentCode = dept.depCode.substring(0, 8) + '0000'
          shiDeptsArray.push(dept)
        }
      }
    },
    tingDepChange(val) {
      this.shiOrgCode = []
      if (val && val.length > 2) {
        for (let i = 0; i < this.tingDep.length; i++) {
          const dept = this.tingDep[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurTingDep = dept
            break
          }
        }
      } else {
        this.shiOrgCode = []
        this.selectCurTingDep = { name: '' }
      }
    },
    shiDepChange(val) {
      this.qiDep = []
      this.qiOrgCode = null
      if (val && val.length > 0) {
        const depcode = val[0]
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          // if (dept.id === v) {
          //   depcode = dept.depCode
          //   // break
          // }
          if (depcode.length > 4 && dept.id === val[val.length - 1]) { // hover展示市的汉字
            this.selectCurShiDep = dept
            break
          }
        }
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          if (dept.parentCode.substring(0, 4) === depcode && dept.depCode.substring(0, 6) !== depcode + '00' && dept.depCode.substring(4, 6) !== '00') {
            this.qiDep.push(dept)
          }
        }
        if (this.CurshiOrgCode[0] === val[0] && val.length === 1) {
          this.shiOrgFlag = true
        } else {
          this.shiOrgFlag = false
        }
      } else {
        this.shiOrgFlag = false
        this.selectCurShiDep = { name: '' }
      }
    },
    qiDepChange(val) {
      if (val) {
        for (let i = 0; i < this.qiDep.length; i++) {
          const dept = this.qiDep[i]
          if (dept.depCode === val) {
            this.selectCurQiDep = dept
            break
          }
        }
      } else {
        this.selectCurQiDep = { name: '' }
      }
    },
    initAjzt() { // 初始化案件状态数据源
      this.$query('tcpcode', { codeLx: 'ajzt' }).then((response) => {
        if (response.data && response.data.length > 0) {
          const temp = {}
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            temp[element.codeName] = element.code
          }
          const arr = []
          for (const key in temp) {
            arr.push({ code: temp[key], codeName: key })
          }
          this.ajztData = arr
        }
      }).catch(() => {
      })
    },
    initAjlb() { // 初始化案件类别
      this.$query('getajlb', {}).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbData = response.data
        }
      }).catch(() => {
      })
    },
    initAjzm() { // 案件罪名
      this.$query('ajzmcode', { codeLx: 'ajlb' }).then((response) => {
        // const paramZM = {
        //   startTime: '1900-01-01',
        //   endTime: '2100-01-01'
        // }
        this.$query('ajzmcode', {}).then((response) => {
          if (response.data && response.data.length > 0) {
            this.ajzmData = response.data
          }
        })
      }).catch(() => {
      })
    },
    ajztChange(val) { // 案件状态change事件
      if (val) {
        var result = ''
        this.ajztData.forEach(item => {
          if (item.code === val) {
            result = item.codeName
          }
        })
        this.curAjztName = result
        return result
      } else {
        this.curAjztName = ''
        return ''
      }
    },
    startDateChangeLa(val) { // 立案开始时间change事件
      if (val) {
        this.endDateDisabledLa = false
        // this.pickerOptions = {
        //   disabledDate(time) {
        //     return time.getTime() > Date.now()
        //   }
        // }
      } else {
        this.filters.larqStart = ''
        this.filters.larqEnd = ''
        this.endDateDisabledLa = true
      }
    },
    endDateChangeLa(val) { // 立案结束时间change事件

    },
    startDateChangePa(val) { // 破案开始时间change事件
      if (val) {
        this.endDateDisabledPa = false
      } else {
        this.filters.parqStart = ''
        this.filters.parqEnd = ''
        this.endDateDisabledPa = true
      }
    },
    endDateChangePa(val) { // 破案结束时间change事件

    },
    reset() {
      // this.resetForm('filters')
      this.filters = {
        ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [], // 案件类型
        larqStart: '', // 立案日期
        larqEnd: '',
        parqStart: '', // 破案日期
        parqEnd: '',
        confirmStatus: '' // 上报状态
      }
      this.pageSize = 15
      this.tingOrgCode = [] // 厅
      this.shiOrgCode = [] // 市
      this.qiOrgCode = '' // 旗
      this.ajztChange('')
      this.initAll()
      this.zjhm = '' // 清空身份证号码
      this.zbtjType = '' // 取消统计参数
      this.getCase(true)
    },
    resetForm(form) {
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    },
    handleAjDetail(index, row) { // 厅级别用户查看详情时，有confirmId时 先改案件上报状态
      if (this.tingDepArr.indexOf(this.curDept.depCode) > -1) { // 厅级别用户 初始化的三种部门
        if (row.confirmStatus && row.confirmStatus === 1 && row.confirmId) {
          var para = {
            signUserId: this.curUser.id,
            signUserName: this.curUser.realName,
            status: 2
          }
          this.listLoading = true
          this.$update('bisnotice/' + row.confirmId, para).then((response) => {
            if (response.code === '000000') {
              this.listLoading = false
              this.getCase(false)
              // this.$router.push({ path: '/caseManage/detailSyh/' + row.id })
              this.$router.push({
                path: '/caseFile/index', query: { id: row.id, isRl: '1' }
              })
            }
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          // this.$router.push({ path: '/caseManage/detailSyh/' + row.id })
          this.$router.push({
            path: '/caseFile/index', query: { id: row.id, isRl: '1' }
          })
        }
      } else {
        // this.$router.push({ path: '/caseManage/detailSyh/' + row.id })
        this.$router.push({
          path: '/caseFile/index', query: { id: row.id, isRl: '1' }
        })
      }
    },
    handleAllRead() { // 一键已读
      this.$confirm('是否将全部未读案件标记为已读?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var para = {
          deptId: this.curDept.id, // 部门id
          deptCode: this.curDept.depCode, // 部门code
          userId: this.curUser.id, // 用户id
          userName: this.curUser.realName // 用户姓名
        }
        this.listLoading = true
        this.$save('batchconfirmnotice', para).then((response) => {
          if (response.code === '000000') {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getCase(true)
          }
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    toback() {
      sessionStorage.removeItem('/caseManage')
      // if (this.AJBH) {
      //   if (this.AJID) {
      //     this.$router.push({
      //       path: '/caseFile/index', query: { id: this.AJID, isRl: '1' }
      //     })
      //   } else {
      //     this.$router.push({
      //       path: '/caseFile/index', query: { ajbh: this.AJBH, isRl: '1' }
      //     })
      //   }
      // } else {
      //   this.$router.back(-1)
      // }
      // this.$router.back(-1)
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    },
    noFliter(para) {
      // var flag = false
      // if (this.depLevel === 1) { // 厅，总队
      //   flag = !this.filters.ajzt && !this.filters.ajlb && !this.filters.ajzm && !this.filters.larqStart &&
      //     !this.filters.larqEnd && !this.filters.parqStart && !this.filters.parqEnd && !this.filters.confirmStatus && !this.filters.words &&
      //     this.tingOrgCode.length === 0
      // } else if (this.depLevel === 2) { // 市
      //   flag = !this.filters.ajzt && !this.filters.ajlb && !this.filters.ajzm && !this.filters.larqStart &&
      //     !this.filters.larqEnd && !this.filters.parqStart && !this.filters.parqEnd && !this.filters.confirmStatus && !this.filters.words &&
      //     this.tingOrgCode.length === 0 && !this.qiOrgCode && this.shiOrgFlag
      // } else { // 旗县
      //   flag = !this.filters.ajzt && !this.filters.ajlb && !this.filters.ajzm && !this.filters.larqStart &&
      //     !this.filters.larqEnd && !this.filters.parqStart && !this.filters.parqEnd && !this.filters.confirmStatus && !this.filters.words &&
      //     this.tingOrgCode.length === 0
      // }
      // return flag
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.AJBH = ''
    if (this.$route.query.ajlbName) {
      this.filters.ajlbName = this.$route.query.ajlbName
    }
    if (this.$route.query.startDate && this.$route.query.endDate) {
      this.filters.startDate = this.$route.query.startDate
      this.filters.endDate = this.$route.query.endDate
      this.dateRand = [this.filters.startDate, this.filters.endDate]
    }
    if (sessionStorage.getItem(this.$route.path) && JSON.parse(sessionStorage.getItem(this.$route.path)).cardId) {
      this.zjhm = JSON.parse(sessionStorage.getItem(this.$route.path)).cardId
    }
    if (sessionStorage.getItem(this.$route.path) && JSON.parse(sessionStorage.getItem(this.$route.path)).origin === 'portalOtherTodo') { // 从首页-其他待办跳转过来的
      this.filters.confirmStatus = '1'
    }
    if (this.$route.query.ajzt) { // 从案件侦办统计表-侦办刑事案件数跳转过来的
      this.zbtjType = this.$route.query.ajzt
      this.ajtjparam = this.$route.query
      this.curAjztName = this.ajtjparam.ajzt
      this.filters.parqStart = this.ajtjparam.startTime
      this.filters.parqEnd = this.ajtjparam.endTime
      this.filters.fllb = [this.ajtjparam.fllb]
      if (this.$route.query.cityCode && this.$route.query.cityCode.length > 4) {
        this.CurshiOrgCode = [this.$route.query.cityCode.substr(0, 4)]
        this.shiOrgCode = [this.$route.query.cityCode.substr(0, 4)]
      }
    }
    this.initAll()
    this.getCase(true)
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.AJBH = ''
    this.initAll()
    this.getCase(true)
  }
}

</script>

<style>
.case .el-date-editor .el-range-separator {
  padding: 0;
}
.el-select-dropdown__list {
  max-width: 600px;
  overflow-x: auto;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
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
</style>
