<template>
  <section class="clueList">
   <!--线索列表-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="行政区划">
          <el-tooltip effect="dark" :content="selectCurArea.cityName" placement="top-start" :popper-class="(selectCurArea.cityName&&selectCurArea.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
            <el-cascader :options="areaOptions" :disabled="areaDisabled" :clearable="!areaDisabled && String(curDept.depType) !== '2'" v-model="filters.area" :props="areaProps" change-on-select @change="handleAreaChange" :show-all-levels="false" placeholder="全部" popper-class="caseAssist_cascader"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="接收单位">
          <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
            <el-cascader :options="deptOptions" :disabled="deptDisabled" :clearable="!deptDisabled" v-model="filters.department" :props="deptProps" change-on-select :show-all-levels="false" @change="handleDeptChange" placeholder="全部"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <!-- <el-form-item label="下发日期">
          <el-date-picker v-model="filters.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期"></el-date-picker>
        </el-form-item> -->
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="协查情况">
          <el-select  v-model="filters.qbxsResult" size="small" multiple placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('qbxsfkzt')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线索序号">
          <el-input v-model="filters.serialNumber" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select  v-model="filters.qbxsCategory" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('fllb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- <div class="tableBox"  :style="{maxHeight:tableHeight+'px'}"> -->
      <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" :max-height="tableHeight">
        <el-table-column type="index" width="60" label="序号" ></el-table-column>
        <el-table-column prop="serialNumber"  label='线索序号'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cityName"  label='行政区划'  min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.cityName && scope.row.cityName !== undefined && scope.row.cityName !== null"> {{scope.row.cityName}} </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="receiveDate"  label='下发日期'  min-width="120" show-overflow-tooltip>-->
          <!--<template slot-scope="scope">-->
            <!--{{$parseTime(scope.row.receiveDate, '{y}-{m}-{d}')}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="receiveName"  label='接收单位'  min-width="250" show-overflow-tooltip >
          <template slot-scope="scope">
            <span @click="rowClick(scope.row.receiveName)">{{scope.row.receiveName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qbxsCategory"  label='线索分类'  min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if='scope.row.qbxsCategory'>{{$getDictName(scope.row.qbxsCategory+'','fllb')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qbxsResult"  label='核查情况'  min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if='scope.row.qbxsResult'>{{$getDictName(scope.row.qbxsResult+'','qbxsfkzt')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ysxz"  label='移送行政部门处理（次）'  min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop=""  label='侦办刑事案件' align="center" >
          <el-table-column prop="larqCount"  label='立案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parqCount"  label='破案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zhrys" label="抓获（人）"  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xsjl"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="yjss" label="移诉（人）"   min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column  v-for="(item, index) in tableHead" :key="index" :label="item"   min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="rowClick(scope.row.data[index+1])">{{scope.row.data[index+1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" title="详情" type="primary" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- </div> -->
    <!--工具条-->
    <el-col :span="24" class="toolbar" >
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--线索详情弹出层-->
    <el-dialog title="详情" :visible.sync="clueDetailVisible" @close="closeDialog" :close-on-click-modal="false">
      <clue-detail ref="clueDetail" :row="this.curRow" @closeDialog="closeDialog"></clue-detail>
    </el-dialog>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
import ClueDetail from './clueDetail' // 线索详情
export default {
  name: 'list',
  components: {
    ClueDetail
  },
  data() {
    return {
      filters: {
        area: [],
        department: [],
        time: [],
        assistId: '', // 集群id
        address: '', // 地址
        departName: '', // 接收单位
        qbxsResult: [], // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '' // 分类
      },
      showTitle: '地市',
      showType: '1',
      initArea: [],
      initDepartment: [],
      areaOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      selectCurDep: { name: '' }, // 当前选中的部门
      selectCurArea: { cityName: '' }, // 当前行政区划
      areaProps: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      deptDisabled: false,
      areaDisabled: false,
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      curRow: {}, // 存储当前被点击行数据
      listData: [],
      clueDetailVisible: false, // 详情弹框
      listLoading: false, // 列表加载loading
      total: 0,
      page: 1,
      pageSize: 15,
      tableHeight: null, // 列表外层容器的高度
      tableHead: [], // 表头
      paramFilter: {
        cityCode: '',
        deptCode: ''
      }
    }
  },
  methods: {
    findParentDept(paramCode, type) { // type 1： 部门   2：区域
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (type === 1) {
          if (item.depCode === paramCode) {
            return item
          }
        } else if (type === 2) {
          if (this.paramFilter.deptCode === '') {
            if (item.depCode.substring(0, 6) === paramCode && String(item.depType) === '2') {
              return item
            }
          } else {
            if (item.depCode.substring(0, 6) === paramCode) {
              return item
            }
          }
        }
      }
    },
    initData() {
      if (this.curDept.depType === '1') {
        this.showTitle = '地市'
        this.showType = '1'
      } else if (this.curDept.depType === '2') { // 支队
        this.showTitle = '地市'
        this.showType = '1'
      } else if (this.curDept.depType === '3') { // 大队 派出所
        this.showTitle = '区县'
        this.showType = '2'
      } else if (this.curDept.depType === '4') {
        if (this.curDept.areaCode === '611400') { // 杨凌例外
          this.showTitle = '地市'
          this.showType = '1'
        } else { // 正常的派出所
          this.showTitle = '区县'
          this.showType = '2'
        }
      }
      if (this.$route.query.id) {
        this.filters.assistId = this.$route.query.id
        this.filters.qbxsResult = this.$route.query.type && this.$route.query.type !== '' ? this.$route.query.type.split(',') : [] // 核查情况
        this.paramFilter.cityCode = this.$route.query.cityCode ? this.$route.query.cityCode : '' // 地市
        this.paramFilter.deptCode = this.$route.query.deptCode ? this.$route.query.deptCode : '' // 接收部门
        // if (this.$route.query.receiveDate) {
        //   const date = new Date(this.$route.query.receiveDate)
        //   this.filters.time = [date, date]
        // }
      }
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          const arr = response.data ? response.data : []
          if (String(this.curDept.depType) === '2') {
            arr[0].disabled = true
            for (let i = 0; i < arr[0].children.length; i++) {
              const item = arr[0].children[i]
              if (String(item.cityCode) !== String(this.curDept.areaCode)) {
                item.disabled = true
              }
            }
          }
          this.areaOptions = arr
          let currentArea = []
          if (this.paramFilter.cityCode !== '') {
            if (this.paramFilter.cityCode === '610000') {
              currentArea = ['610000']
            } else {
              const curDept = this.findParentDept(this.paramFilter.cityCode, 2)
              curDept.areaCode = this.paramFilter.cityCode
              if (curDept.depType === '2') { // 支队
                currentArea = ['610000', curDept.areaCode]
              } else if (curDept.depType === '3') { // 大队 派出所
                currentArea = ['610000', curDept.areaCode.substring(0, 4) + '00', curDept.areaCode]
              } else if (curDept.depType === '4') {
                if (curDept.areaCode === '611400') { // 杨凌例外
                  currentArea = ['610000', '611400']
                } else { // 正常的派出所
                  currentArea = ['610000', curDept.areaCode.substring(0, 4) + '00', curDept.areaCode]
                }
              }
              if (this.curDept.depType === '3') { // 大队 派出所
                this.deptDisabled = true
                this.areaDisabled = true
              } else if (this.curDept.depType === '4') {
                this.areaDisabled = true
              }
            }
          } else {
            if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
              currentArea = ['610000']
            } else if (this.curDept.depType === '2') { // 支队
              currentArea = ['610000', this.curDept.areaCode]
            } else if (this.curDept.depType === '3') { // 大队 派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
              this.deptDisabled = true
              this.areaDisabled = true
            } else if (this.curDept.depType === '4') {
              this.areaDisabled = true
              if (this.curDept.areaCode === '611400') { // 杨凌例外
                currentArea = ['610000', '611400']
              } else { // 正常的派出所
                currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
              }
            }
          }
          this.initArea = currentArea
          this.filters.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          let currentDepartment = []
          if (this.paramFilter.deptCode !== '') {
            currentDepartment = [this.paramFilter.deptCode]
            const curDept = this.findParentDept(this.paramFilter.deptCode, 1)
            if (curDept.depType === '-1') { // 省
              currentDepartment = [curDept.depCode]
            } else if (curDept.depType === '1') { // 总队
              currentDepartment = [curDept.parentDepCode, curDept.depCode]
            } else if (curDept.depType === '2') { // 支队
              currentDepartment = [curDept.depCode]
            } else if (curDept.depType === '3') { // 大队
              currentDepartment = [curDept.depCode]
            } else if (curDept.depType === '4') { // 派出所
              currentDepartment = [curDept.parentDepCode, curDept.depCode]
            }
          } else {
            // 此处不默认选中本单位
            // 默认选择本单位
            // if (this.curDept.depType === '-1') { // 省
            //   currentDepartment = [this.curDept.depCode]
            // } else if (this.curDept.depType === '1') { // 总队
            //   currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
            // } else if (this.curDept.depType === '2') { // 支队
            //   currentDepartment = [this.curDept.depCode]
            // } else if (this.curDept.depType === '3') { // 大队
            //   currentDepartment = [this.curDept.depCode]
            // } else if (this.curDept.depType === '4') { // 派出所
            //   currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
            // }
          }
          this.initDepartment = currentDepartment
          this.filters.department = currentDepartment
        }
        this.query(true)
      }).catch(() => {
      })
    },
    handleAreaChange(val) { // 行政区划
      this.selectCurDep = { name: '' } // 当前选中的部门
      this.filters.department = []
      if (val.length > 0) {
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        const param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              var arr = []
              const data = response.data
              for (let i = 0; i < data.length; i++) {
                const obj = data[i]
                if (obj.depType !== '4') { // 不展示派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
              }
              this.deptOptions = getTree(arr) // 机构
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    handleDeptChange(val) { // 单位机构名称鼠标移上去显示全部
      if (val.length > 0) {
        const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.department = []
        this.selectCurDep = { name: '' }
      }
    },
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        address: this.filters.address, // 地址
        qbxsResult: this.filters.qbxsResult.length > 0 ? this.filters.qbxsResult.join(',') : '', // 协查情况
        serialNumber: this.filters.serialNumber, //  序号
        qbxsCategory: this.filters.qbxsCategory, // 分类
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        assistId: this.filters.assistId,
        assistType: this.$route.query.assistType,
        showType: this.showType
      }
      // if (this.filters.time !== undefined && this.filters.time !== null && this.filters.time.length > 1) {
      //   para.startTime = this.filters.time[0] ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : ''
      //   para.endTime = this.filters.time[1] ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : ''
      // }
      para.deptCode = this.filters.department.length > 0 ? this.filters.department[this.filters.department.length - 1] : ''
      para.provinceCode = this.filters.area[0] ? this.filters.area[0] : ''
      para.cityCode = this.filters.area[1] ? this.filters.area[1] : ''
      para.reginCode = this.filters.area[2] ? this.filters.area[2] : ''
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('caseassistclue/feedBackClues', para).then((response) => {
        this.listLoading = false
        this.listData = response.data.list // 列表
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          const titles = response.data.titles // 表头
          this.tableHead = []
          titles.forEach((item, index) => {
            if (index > 0) {
              this.tableHead.push(item) // 表头数据只取序号之后的
            }
          })
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    rowClick(text) {
      this.$alert(text, '内容', {
        confirmButtonText: '关闭'
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    },
    handleDetail(index, row) { // 详情
      if (row.qbxsResult === 1) {
        this.$alert('该线索还未反馈，请于线索反馈列表反馈后，再行查看', '提示')
      } else {
        this.clueDetailVisible = true
        this.curRow = row
        if (this.$refs.clueDetail) {
          this.$refs.clueDetail.setRow(row)
        }
      }
    },
    resetForm() { // 重置
      this.filters = {
        area: this.initArea,
        department: this.initDepartment,
        qbxsResult: [],
        time: [],
        assistId: this.$route.query.id,
        address: '', // 地址
        departName: '', // 接收单位
        xcqk: '', // 协查情况
        sort: '', // 序号
        type: '' // 分类
      }
      this.handleAreaChange(this.initArea)
      this.filters.department = this.initDepartment
      this.query(true)
    },
    toback() { // 返回
      this.$router.back(-1)
    },
    closeDialog() {
      this.clueDetailVisible = false
      this.$refs.clueDetail.initData()
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 320
    this.initData()
  }
}
</script>

<style>
  .clueList .el-dialog{
    width: 60%;
  }
  .clueList .el-dialog__body {
    padding: 10px 20px 15px 20px;
    max-height: 70vh;
    overflow: auto;
  }
  .clueList .el-table--border, .el-table--group {
    border: 0;
  }
  .clueList .el-table--border td, .clueList .el-table--border th, .clueList .el-table__body-wrapper{
    border-right: 0;
  }
  .clueList .el-table--border th, .clueList .el-table__fixed-right-patch {
    border-bottom: 0;
  }

  .clueList .el-table--border::after,
  .clueList .el-table--group::after {
    width: 0;
  }
  .clueList .tableBox{
    width: 100%;
    overflow: auto;
  }
 .el-cascader-menu__item.is-disabled{
  background-color: transparent;
}
</style>
