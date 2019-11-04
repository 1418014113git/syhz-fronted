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
            placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="exportBtn && $isViewBtn('182002')"  @click="exportList">导出</el-button>
      </el-form-item>
      </el-form>
    </el-col>
    <div class="tipText">
      <i class="el-icon-question" style="color:#00a0e9;"></i> 装备信息只统计到大队，杨凌示范区没有大队只统计到支队！
    </div>

    <!--列表-->
    <el-table :data="tableData"  v-loading="listLoading" style="width: 100%;margin-top: 15px;"  :class="{'tableHj':firstCanShow}" :max-height="tableHeight"  :span-method="arraySpanMethod" :row-key="getRowKeys"  :expand-row-keys="expands" @expand-change="rowClick">
      <el-table-column type="expand" v-if="firstCanShow">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataList"  v-loading="listChildLoading" >
            <el-table-column prop="" width="47"></el-table-column>
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="areaName" align="center" label="机构单位"  width="200"  show-overflow-tooltip></el-table-column>
            <el-table-column  v-for="(itemExpand,index) in tableHead" :key="index" :label="itemExpand.label" align="center">
              <el-table-column v-for="(itChild,indexs) in itemExpand.children" :key="indexs" :label="itChild.label" :prop="itChild.prop" align="center" width="120">
                <template slot-scope="scope">
                  <span class="" v-if="itChild.label==='必配装备'" :class="[{'redColor':(scope.row['value1'+itChild.groupId]<scope.row['value2'+itChild.groupId])},{'linkColor':(itChild.groupId!=='a')}]" @click="handleDetail(itChild,scope.row)">{{scope.row[scope.column.property]}}</span>
                  <span class="" v-else-if="itChild.label==='有待更新'"  :class="[{'redColor':(itChild.label==='有待更新'&& scope.row[scope.column.property]>0)},{'linkColor':(itChild.groupId!=='a')}]" @click="handleDetail(itChild,scope.row)">{{scope.row[scope.column.property]}}</span>
                  <span class="" v-else  :class="{'linkColor':(itChild.groupId!=='a')}" @click="handleDetail(itChild,scope.row)">{{scope.row[scope.column.property]}}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center">
        <template slot-scope="scope">
            <span v-if="scope.$index+1<tableData.length">{{scope.$index+1}}</span>
            <span v-else>合计</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaName" align="center" :label="firstCanShow?'省市':'机构单位'"   min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column   v-for="(item,index1) in tableHead" :key="index1" :label="item.label"  align="center">
        <el-table-column v-for="(it, index2) in item.children" :key="index2" :label="it.label" :prop="it.prop" align="center" min-width="120">
          <template slot-scope="scope">
            <span class="" v-if="it.label==='必配装备' " :class="[{'redColor':(scope.row['value1'+it.groupId]<scope.row['value2'+it.groupId])},{'linkColor':(it.groupId!=='a' && scope.row.cityCode !== 'a' && !firstCanShow)}]" @click="handleDetail(it,scope.row)">{{scope.row[scope.column.property]}}</span>
            <span class="" v-else-if="it.label==='有待更新'"  :class="[{'redColor':(it.label==='有待更新'&& scope.row[scope.column.property]>0)},{'linkColor':(it.groupId!=='a' && scope.row.cityCode !== 'a' && !firstCanShow)}]" @click="handleDetail(it,scope.row)">{{scope.row[scope.column.property]}}</span>
            <span class="" v-else :class="{'linkColor':(it.groupId!=='a' && scope.row.cityCode !== 'a' && !firstCanShow)}" @click="handleDetail(it,scope.row)">{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
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
      listLoading: false,
      listChildLoading: false,
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      exportBtn: false, // 导出按钮显隐
      firstCanShow: true, // 控制 表头显示 省市 还是单位机构 默认是省市
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
      tableHead: [ // 表头
        // {
        //   label: '警用车辆',
        //   children: [
        //     {
        //       prop: 'totalType01019',
        //       label: '必配装备',
        //       groupId: '1019',
        //       allocateType: 1
        //     },
        //     {
        //       prop: 'totalType11019',
        //       label: '选配装备',
        //       groupId: '1019',
        //       allocateType: 2
        //     },
        //     {
        //       prop: 'totalType21019',
        //       label: '有待更新',
        //       groupId: '1019',
        //       allocateType: ''
        //     }
        //   ]
        // },
        // {
        //   label: '指挥通信装备',
        //   children: [
        //     {
        //       prop: 'totalType01020',
        //       label: '必配装备',
        //       groupId: '1020',
        //       allocateType: 1
        //     },
        //     {
        //       prop: 'totalType11020',
        //       label: '选配装备',
        //       groupId: '1020',
        //       allocateType: 2
        //     },
        //     {
        //       prop: 'totalType21020',
        //       label: '有待更新',
        //       groupId: '1020',
        //       allocateType: ''
        //     }
        //   ]
        // },
        // {
        //   label: '防护装备',
        //   children: [
        //     {
        //       prop: 'totalType01021',
        //       label: '必配装备',
        //       groupId: '1021',
        //       allocateType: 1
        //     },
        //     {
        //       prop: 'totalType11021',
        //       label: '选配装备',
        //       groupId: '1021',
        //       allocateType: 2
        //     },
        //     {
        //       prop: 'totalType21021',
        //       label: '有待更新',
        //       groupId: '1021',
        //       allocateType: ''
        //     }
        //   ]
        // },
        // {
        //   label: '合计',
        //   children: [
        //     {
        //       prop: 'totalType0a',
        //       label: '必配装备',
        //       groupId: '',
        //       allocateType: ''
        //     },
        //     {
        //       prop: 'totalType1a',
        //       label: '选配装备',
        //       groupId: '',
        //       allocateType: ''
        //     },
        //     {
        //       prop: 'totalType2a',
        //       label: '有待更新',
        //       groupId: '',
        //       allocateType: ''
        //     }
        //   ]
        // }
      ],
      tableData: [
        // {
        //   'areaCode': '6100',
        //   'p2': 12,
        //   'p3': 0,
        //   'areaName': '省厅',
        //   'departCode': '',
        //   'value11019': 1,
        //   'value21019': 2,
        //   'value31019': 1, // 更新状态：0要更新 1 不需要更新
        //   'value11020': 1,
        //   'value21020': 1,
        //   'value31020': 1, // 更新状态：0要更新 1 不需要更新
        //   'value11021': 1,
        //   'value21021': 1,
        //   'value31021': 0, // 更新状态：0要更新 1 不需要更新
        //   'value1a': 1,
        //   'value2a': 1,
        //   'value3a': 0, // 更新状态：0要更新 1 不需要更新
        //   'totalType01019': '1/2',
        //   'totalType11019': 1,
        //   'totalType21019': 1,
        //   'totalType01020': '1/1',
        //   'totalType11020': 1,
        //   'totalType21020': 1,
        //   'totalType01021': '1/1',
        //   'totalType11021': 1,
        //   'totalType21021': 1,
        //   'totalType0a': '1/1',
        //   'totalType1a': 1,
        //   'totalType2a': 1
        // },
        // {
        //   'areaCode': '6102',
        //   'p2': 12,
        //   'p3': 0,
        //   'areaName': '西安市',
        //   'departCode': '',
        //   'value11019': 1,
        //   'value21019': 1,
        //   'value31019': 1, // 更新状态：0要更新 1 不需要更新
        //   'value11020': 1,
        //   'value21020': 1,
        //   'value31020': 1, // 更新状态：0要更新 1 不需要更新
        //   'value11021': 1,
        //   'value21021': 1,
        //   'value31021': 0, // 更新状态：0要更新 1 不需要更新
        //   'value1a': 1,
        //   'value2a': 1,
        //   'value3a': 0, // 更新状态：0要更新 1 不需要更新
        //   'totalType01019': '1/1',
        //   'totalType11019': 1,
        //   'totalType21019': 1,
        //   'totalType01020': '1/1',
        //   'totalType11020': 1,
        //   'totalType21020': 1,
        //   'totalType01021': '1/1',
        //   'totalType11021': 1,
        //   'totalType21021': 1,
        //   'totalType0a': '1/1',
        //   'totalType1a': 1,
        //   'totalType2a': 1
        // }
      ],
      tableHeight: null
    }
  },
  methods: {
    init() {
      this.listLoading = true
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
            if (this.curDept.areaCode === '610403') { // 杨凌例外
              currentArea = ['610000', '610403']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          if (this.curDept.depType === '3') { // 大队
            this.department = [this.curDept.depCode]
          }
          // if (this.curDept.depType === '-1') { // 省
          //   this.department = [this.curDept.depCode]
          // } else if (this.curDept.depType === '1') { // 总队
          //   this.department = [this.curDept.parentDepCode, this.curDept.depCode]
          // } else if (this.curDept.depType === '2') { // 支队
          //   this.department = [this.curDept.depCode]
          // } else if (this.curDept.depType === '3') { // 大队
          //   this.department = [this.curDept.depCode]
          // } else if (this.curDept.depType === '4') { // 派出所
          //   this.department = []
          // }
          this.handleDeptChange(this.department)
          this.query() // 查询列表
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAreaChange(val) { // 行政区划
      this.department = []
      this.selectCurDep = { name: '' } // 当前选中的部门
      if (val.length > 0) {
        this.xzqhDepChange(val)
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        var param = {
          provinceCode: val[0] || '610000',
          cityCode: val[1] || '',
          departCode: val[2] || ''
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
    // queryHead() { // 查询表头
    //   this.initData()
    //   this.$update('basicequip/th', { th: 1 }).then((response) => {
    //     if (response.data.length > 0) {
    //       this.tableHead = response.data
    //       this.query()
    //     }
    //   })
    // },
    query(hand, cityCode) { // 列表数据查询
      const para = {}
      this.exportBtn = false // 导出按钮 显隐
      if (cityCode) { // 查询展开项里的数据
        if (cityCode === '610000530000') { // 省厅
          para.provinceCode = '' // 省code
          para.cityCode = '' // 市code
          para.departCode = cityCode // 部门code
        } else {
          para.provinceCode = '' // 省code
          para.cityCode = cityCode // 市code
          para.departCode = '' // 部门code
        }
        para.type = 1 // 标识符，传改字段，将不返回合计行。
        this.listChildLoading = true
      } else { // 非展开项列表 即外层列表
        this.expands = [] // 初始化所有行不展开
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
        this.listLoading = true
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$update('basicequip/total', para).then((response) => {
        if (cityCode) {
          this.listChildLoading = false
          if (this.tableData && this.tableData.length > 0) {
            for (let i = 0; i < this.tableData.length; i++) {
              const item = this.tableData[i]
              // if (item.cityCode === cityCode) {
              //   item.tableDataList = response.data.list
              // }

              if (cityCode === '610000530000') { // 省厅
                if (item.departCode === cityCode) {
                  item.tableDataList = response.data.list
                }
              } else {
                if (item.cityCode === cityCode) {
                  item.tableDataList = response.data.list
                }
              }
            }
          } else {
            this.tableData = []
          }
        } else {
          this.listLoading = false
          if (response.data && response.data.list.length > 0 && response.data.th.length > 0) {
            this.tableData = response.data.list
            this.tableHead = response.data.th
          } else {
            this.tableData = []
          }
          if (para.provinceCode === '610000') {
            this.exportBtn = true // 导出按钮显示
            this.firstCanShow = true // 控制 表头显示 省市 还是单位机构
          } else {
            this.firstCanShow = false // 控制 表头显示 省市 还是单位机构
          }
        }
      }).catch(() => {
        this.listLoading = false
        this.listChildLoading = false
        this.tableData = []
      })
    },
    initData() {
      this.tableData = []
    },
    handleDetail(row, datas) { // 装备信息详情页
      if (row.groupId && row.groupId !== 'a' && datas.cityCode !== 'a') { // 合计项以外的才能跳转
        if (row.allocateType) {
          this.$router.push({ path: '/basicService/equip', query: { groupId: Number(row.groupId), allocateType: Number(row.allocateType), belongDepCode: datas.departCode }})
        } else {
          this.$router.push({ path: '/basicService/equip', query: { groupId: Number(row.groupId), allocateType: row.allocateType, belongDepCode: datas.departCode }})
        }
      }
    },
    resetForm() { // 重置
      this.area = []
      this.department = []
      this.initData()
      this.init()
    },
    exportList() { // 导出
      const param = {
        th: this.tableHead,
        list: this.tableData
      }
      this.$gotoid('/exportEquip', JSON.stringify(param))
    },
    getRowKeys(row) {
      // console.log('departCode', JSON.stringify(row.departCode))
      return row.departCode
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1 && row.areaName === '合计') {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    rowClick(row) {
      if (row.departCode) {
        if (this.expands.indexOf(row.departCode) > -1) { // 展开项中存在
          this.expands.splice(this.expands.indexOf(row.departCode), 1)
        } else { // 展开项中不存在
          this.expands.push(row.departCode)
          if (row.departCode === '610000530000') { // 省厅
            this.query(false, row.departCode) // 根据部门code查
          } else {
            if (row.cityCode) {
              this.query(false, row.cityCode) // 根据盟市code查
            }
          }
        }
      }
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.init()
  },
  activated() {
    this.init()
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
  .tableHj{
    .el-table__body-wrapper{
      tbody{
        .el-table__expanded-cell{
          .el-table__body-wrapper{
            .el-table__row:last-child{
              .el-table__expand-icon {
                color: transparent;
              }
              td:nth-child(1){
                border-right: 0;
              }
              td:nth-child(2){
                text-align: center;
                border-left: 0;
                .cell{
                  padding-left: 0;
                }
              }
            }
          }
        }
        .el-table__row:last-child{
          .el-table__expand-icon {
            color: transparent;
          }
          td:nth-child(1){
            border-right: 0;
          }
          td:nth-child(2){
            text-align: left;
            border-left: 0;
            padding-left: 10px;
            .cell{
              padding-left: 0;
            }
          }
        }
      }
    }
  }
  .el-table__body-wrapper{
    tbody{
      .el-table__expanded-cell{
        .el-table__body-wrapper{
          .el-table__row:last-child{
            .el-table__expand-icon {
              color: transparent;
            }
            td:nth-child(1){
              // border-right: 0;
            }
            td:nth-child(2){
              text-align: center;
              // border-left: 1px solid #2f627a;
              border-left:0;
              .cell{
                padding-left: 10px;
              }
            }
          }
        }
      }
      .el-table__row:last-child{
        .el-table__expand-icon {
          color: transparent;
        }
        td:nth-child(1){
          // border-right: 0;
        }
        td:nth-child(2){
          text-align: center;
          // border-left: 1px solid #2f627a;
          border-left:0;
          // padding-left: 10px;
          .cell{
            // padding-left: 0;
          }
        }
      }
    }
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
