<template>
  <section class="equipStatistical">
   <!--装备信息统计-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" label-width="90px" class="form">
       <el-form-item label="行政区划">
        <el-tooltip effect="dark" :content="selectCurxzqhDep.cityName" placement="top-start" :popper-class="(selectCurxzqhDep.cityName&&selectCurxzqhDep.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="xzqhOptions"
            v-model="area"
            :props="props"
            change-on-select
            @change="handleAreaChange"
            :show-all-levels="false"
            clearable
            placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="单位机构">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            clearable
            placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="装备分类">
        <el-select  v-model="groupId" size="small" placeholder="请选择">
          <el-option v-for="item in zblbList" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      </el-form>
    </el-col>
    <div class="tipText" v-if="isShowQuerytj">
      <i class="el-icon-question" style="color:#00a0e9;"></i> 装备信息只统计到大队，杨凌示范区没有大队只统计到支队！
    </div>

    <!--列表-->
    <el-table :data="tableData"  v-loading="listLoading"  class="mainTable"  style="width: 100%;margin-top: 15px;"  :header-cell-class-name="getRowClass"  :max-height="tableHeight"  :span-method="arraySpanMethod" @header-click="headClick">
      <el-table-column :label="firstCanShow?'省市':'单位机构'" width="260" align="right" fixed>
				<el-table-column prop="label" label="配备项目" width="160"  show-overflow-tooltip>
          <template slot-scope="scope">
            <p style="text-align:center; margin:0;">
              <span>{{scope.row.label}} </span><br>
              <span style="color:#f72929;">{{getTypeName(scope.row.allocateType)}}</span>
            </p>
          </template>
        </el-table-column>
				<el-table-column prop="name" label="" width="100"  align="center" show-overflow-tooltip></el-table-column>
			</el-table-column>
      <el-table-column   v-for="(item,index) in tableHead" :key="index" :label="item.label"  align="center"  min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.nameType === 1"> <!--实配/应配-->
            <span  v-if="Number(scope.row.tableHead[index].sp) >0"   :class="(scope.row.tableHead[index].sp<scope.row.tableHead[index].yp) ? (firstCanShow ? 'noClickerrorColor' :'errorColor'):(firstCanShow ? '' :'linkColor')"   @click="handleDetail(scope.row,scope.row.tableHead[index])">{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
            <span  v-else-if="Number(scope.row.tableHead[index].yp) >0" class="noClickerrorColor">{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
            <span  v-else>{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
          </span>
          <span v-else>
            <span class=""  v-if="scope.row.tableHead[index].gx>0">有</span>
            <span class=""  v-else>--</span>
          </span>
        </template>
      </el-table-column>
    </el-table>

  <!--装备信息明细弹框-->
  <el-dialog title="装备信息明细" :visible.sync="zbmxListDialog">
    <p class="mxTitle">{{mxTitle}}</p>
    <el-table :data="zbmxList"   v-loading="detailLoading" style="width: 100%;"  class="zbmxList" max-height="500">
      <el-table-column type="index" label="序号"  width="70">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseTime" label="采购日期">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.row.purchaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detailNumber" label="配备数量">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.row.detailNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipStatus" label="状态">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{getTypeStatus(scope.row.equipStatus)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </section>
</template>

<script>
import http from '@/api/http'
export default {
  name: 'ajList',
  data() {
    return {
      expands: [],
      area: [],
      department: [],
      listLoading: false, // 列表loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储列表数字当前被点击行第一层数据
      zbmxList: [], // 装备明细列表
      mxTitle: '', // 装备明细列表标题
      curTableHeadRow: {}, // 存储列表数字当前被点击行下的tableHead对应索引的数据（列表第二层数据）
      // exportBtn: false, // 导出按钮显隐
      firstCanShow: true, // 控制 表头显示 省市 还是单位机构 默认是省市
      zbmxListDialog: false, // 是否显示装备信息明细弹框
      detailLoading: false, // 装备信息明细弹框页面loading
      isShowQuerytj: true, // 是否显示列表上方的查询条件 默认是显示
      groupId: '', // 分类id  默认警用车辆
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' }, // 当前选中的部门
      selectCurxzqhDep: { cityName: '' }, // 当前行政区划
      downLoadUrl: http.LoginModuleName, // nginx配置的文件下载
      zblbList: [], // 装备分类下拉列表
      tableHead: [], // 表头
      tableData: [], // 列表
      tableHeight: null, // 列表最大高度
      cityList: ['省厅', '西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市', '杨凌示范区', '西咸新区'],
      tableHeadInit: [ // 表头初始化值
        {
          value: '610000',
          label: '省厅'
        },
        {
          value: '610100',
          label: '西安市'
        },
        {
          value: '610200',
          label: '铜川市'
        },
        {
          value: '610300',
          label: '宝鸡市'
        },
        {
          value: '610400',
          label: '咸阳市'
        },
        {
          value: '610500',
          label: '渭南市'
        },
        {
          value: '610600',
          label: '延安市'
        },
        {
          value: '610700',
          label: '汉中市'
        },
        {
          value: '610800',
          label: '榆林市'
        },
        {
          value: '610900',
          label: '安康市'
        },
        {
          value: '611000',
          label: '商洛市'
        },
        {
          value: '611400',
          label: '杨凌示范区'
        },
        {
          value: '616200',
          label: '西咸新区'
        }
      ],
      tableDataTest: [ // 测试数据
        {
          label: '一般执法执勤用车',
          name: '实配/应配',
          groupId: '1019',
          allocateType: 1,
          tableHead: [
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610000',
              cityName: '省厅'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610100',
              cityName: '西安市'
            },
            {
              sp: 2,
              yp: 3,
              groupId: '1019',
              cityCode: '610200',
              cityName: '铜川市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610300',
              cityName: '宝鸡市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610400',
              cityName: '咸阳市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610500',
              cityName: '渭南市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610600',
              cityName: '延安市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610700',
              cityName: '汉中市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610800',
              cityName: '榆林市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '610900',
              cityName: '安康市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '611000',
              cityName: '商洛市'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '611400',
              cityName: '杨凌示范区'
            },
            {
              sp: 1,
              yp: 1,
              groupId: '1019',
              cityCode: '616200',
              cityName: '西咸新区'
            }
          ]
        },
        {
          label: '一般执法执勤用车',
          name: '需要更新',
          groupId: '1019',
          allocateType: 1,
          tableHead: [
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610000',
              cityName: '省厅'
            },
            {
              gx: 0,
              groupId: '1019',
              cityCode: '610100',
              cityName: '西安市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610200',
              cityName: '铜川市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610300',
              cityName: '宝鸡市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610400',
              cityName: '咸阳市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610500',
              cityName: '渭南市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610600',
              cityName: '延安市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610700',
              cityName: '汉中市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610800',
              cityName: '榆林市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '610900',
              cityName: '安康市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '611000',
              cityName: '商洛市'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '611400',
              cityName: '杨凌示范区'
            },
            {
              gx: 1,
              groupId: '1019',
              cityCode: '616200',
              cityName: '西咸新区'
            }
          ]
        }
      ]
    }
  },
  methods: {
    init() {
      this.listLoading = true
      this.initData()
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
          } else if (this.curDept.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') {
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.handleAreaChange(currentArea) // 查单位机构
          this.handleDeptChange(this.department)
          this.equipgroupselect() // 装备分类下拉框
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAreaChange(val) { // 查单位机构
      this.department = []
      this.selectCurDep = { name: '' } // 当前选中的部门的tooltip信息
      if (val.length > 0) {
        this.xzqhDepChange(val)
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构tooltip信息
        var param = {
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
                if (obj.depType !== '4') { // 去掉派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
              }
              this.deptOptions = this.getTree(arr) // 机构
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    getTree(arr) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = arr.length; i < l; i++) {
        tmpMap[arr[i]['depCode']] = arr[i]
      }
      for (let i = 0, l = arr.length; i < l; i++) {
        const key = tmpMap[arr[i]['parentCode']]
        if (key && key.depType !== '4') { // 去掉派出所的层级 4是派出所
          if (!key['children']) {
            if (arr[i].depType !== '4') {
              key['children'] = []
              key['children'].push(arr[i])
            }
          } else {
            if (arr[i].depType !== '4') {
              key['children'].push(arr[i])
            }
          }
        } else {
          if (arr[i].depType !== '4') {
            r.push(arr[i])
          }
        }
      }
      return r
    },
    xzqhDepChange(val) { // 行政区划获取当前tiptop信息
      if (val.length > 0) {
        if (this.xzqhOptions && this.xzqhOptions[0].children) {
          var xzqhOptions = this.xzqhOptions[0].children
          for (let i = 0; i < xzqhOptions.length; i++) {
            const dept = xzqhOptions[i]
            if (dept.cityCode === val[val.length - 1]) {
              this.selectCurxzqhDep = dept
            } else {
              if (dept.children && dept.children.length > 0) {
                for (let j = 0; j < dept.children.length; j++) {
                  const depts = dept.children[j]
                  if (depts.cityCode === val[val.length - 1]) {
                    this.selectCurxzqhDep = depts
                  }
                }
              }
            }
          }
        }
      } else {
        this.selectCurxzqhDep = { cityName: '' }
      }
    },
    handleDeptChange(val) { // 单位机构
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
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
    query(hand) { // 列表数据查询
      this.listLoading = true
      const para = {
        groupId: this.groupId
      }
      if (this.department && this.department.length > 0) { // 如果选了 筛选条件的单位机构
        para.departCode = this.department[this.department.length - 1] // 部门code
        para.provinceCode = ''
        para.cityCode = ''
      } else if (this.area && this.area.length === 3) { // 区县 大队
        para.reginCode = this.area[this.area.length - 1] // 部门code
        para.departCode = ''
        para.provinceCode = ''
        para.cityCode = ''
      } else if (this.area && this.area.length === 2) { // 市 支队
        para.departCode = ''
        para.provinceCode = ''
        para.cityCode = this.area[this.area.length - 1]
      } else {
        para.provinceCode = '610000'
        para.departCode = ''
        para.cityCode = ''
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$update('basicequip/total', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.tableHead && response.data.tableData) {
          this.tableData = response.data.tableData // 列表
          this.tableHead = response.data.tableHead // 表头
        } else {
          this.tableData = []
        }
        if (para.provinceCode === '610000') {
          this.firstCanShow = true // 控制表头显示省市还是单位机构  true：省市
        } else {
          this.firstCanShow = false // 控制 表头显示 省市 还是单位机构  false: 单位机构
        }
      }).catch(() => {
        this.listLoading = false
        this.tableData = []
      })
    },
    initData() {
      this.tableData = []
      this.tableHead = this.tableHeadInit
    },
    handleDetail(row, datas) { // 装备信息详情页
      this.curRow = row // 列表第一层数据
      this.curTableHeadRow = datas // 列表第二层数据
      this.mxTitle = datas.deptName + ' __ ' + this.curRow.label
      if (datas.deptCode) { // 点击的是机构单位的列表行，
        this.zbmxListDialog = true // 显示装备信息明细
        this.queryDetail(datas)
      } else { // 点击的是地市的列表行
      }
    },
    queryDetail(datas) { // 弹框详情查询
      this.detailLoading = true
      const para = {
        allocateId: datas.allocateId,
        belongDepCode: datas.deptCode
      }
      this.$query('basicequipdetail', para).then((response) => {
        this.detailLoading = false
        this.zbmxList = response.data
      }).catch(() => {
        this.detailLoading = false
      })
    },
    resetForm() { // 重置
      this.area = []
      this.department = []
      this.initData()
      this.init()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    equipgroupselect() { // 装备分类下拉框
      this.$query('equipgroupselect', {}).then((response) => {
        if (response.data.length > 0) {
          this.zblbList = response.data
          this.zblbList.forEach(item => {
            if (item.groupName === '警用车辆') {
              this.groupId = item.groupId
              return
            }
          })
          this.groupId = this.zblbList[0].groupId
        } else {
          this.zblbList = []
        }
        this.query()
      })
    },
    getTypeStatus(val) { // 根据配备状态获取中文名
      var name = ''
      if (val === 1) {
        name = '需要更新'
      } else if (val === 2) {
        name = '无需更新'
      } else if (val === 3) {
        name = '无更新要求'
      }
      return name
    },
    getTypeName(val) { // 获取配备项目类型，
      var name = ''
      if (val === 1) {
        name = '(必)'
      } else if (val === 2) {
        name = '(选)'
      }
      return name
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (this.cityList.indexOf(column.label) > -1) {
        return 'headStyle'
      } else {
        return ''
      }
    },
    headClick(column, event) { // 点击表头，如果是是地市表头，跳转到机构列表
      var cityCode = ''
      this.tableHeadInit.forEach(item => {
        if (item.label === column.label) {
          cityCode = item.value
        }
      })
      this.$router.push({ path: '/basicService/equipDeptStatistical', query: { groupId: Number(this.groupId), cityCode: cityCode }}) // 跳转到当前地市下对应的单位结构列表页
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.init()
  },
  activated() {

  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.equipStatistical{
  .editPerStatus .el-form{
    width: 85%;
    margin: 0 auto;
  }
  .tipText{
    margin: 8px 0;
  }
  .mxTitle{
    font-size: 16px;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  .el-icon-question{
    font-size: 17px;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  //修改表格边框、背景颜色
  .mainTable{
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
    .el-table__body-wrapper tr:nth-child(even),.el-table__body-wrapper tr:nth-child(odd) {
      background-color: #015281;
    }
    .el-table__fixed-body-wrapper {
      background: #015281;
    }
    .el-table--border th.gutter:last-of-type {
      border-bottom: 0 !important;
      border-bottom-width: 0 !important;
    }
  }
  //表头左上角斜线样式
  .el-table thead.is-group th {
    background: none;
  }

  .el-table thead.is-group tr:first-of-type th:first-of-type {
    border-bottom: none;
  }

  .el-table thead.is-group tr:first-of-type th:first-of-type:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 180px;
    top: 0;
    left: 0;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-77deg);
    transform-origin: top;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(2):before {
    content: '';
    position: absolute;
    width: 1px;
    height: 102px;
    bottom: 0;
    right: 0;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-76.2deg);
    transform-origin: bottom;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(1):before {
    content: '';
    position: absolute;
    width: 1px;
    height: 28px;
    top: 0px;
    right: 26px;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-76deg);
    transform-origin: top;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(1) {
    border-right: none;
    position: relative;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(2) {
    border-left: none;
  }

  .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #2f627a;
  }

  .el-table--border, .el-table--group {
    border: 1px solid #2f627a;
  }

  .headStyle{
    .cell{
      color: #00a0e9;
      cursor: pointer;
    }
  }
  .headStyle:hover{
    .cell{
      text-decoration: underline;
    }
  }
  .el-dialog {
    width: 43%;
  }
  .noClickerrorColor{
    color: #f72929;
  }
  .errorColor{
    color: #f72929;
    cursor: pointer;
  }
  .errorColor:hover{
    text-decoration:underline;
  }
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
