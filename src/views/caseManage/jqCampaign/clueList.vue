<template>
  <section class="clueList">
   <!--线索列表-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="行政区划">
          <el-tooltip effect="dark" class="input_w" :content="selectCurxzqhDep.cityName" placement="top-start" :popper-class="(selectCurxzqhDep.cityName&&selectCurxzqhDep.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="xzqhOptions"
              v-model="area"
              :props="props"
              change-on-select
              @change="handleAreaChange"
              :show-all-levels="false"
              :disabled="Number(curDept.depType)>2"
              :clearable="Number(curDept.depType)<2"
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="接收单位">
          <el-tooltip effect="dark" class="input_w" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptions"
              v-model="department"
              :props="deptProps"
              change-on-select
              :show-all-levels="false"
              @change="handleDeptChange"
              :disabled="Number(curDept.depType)>2"
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="协查情况">
          <el-select  v-model="filters.qbxsResult" size="small" placeholder="全部" clearable>
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
        <el-table-column prop="cityName"  label='地市'  min-width="180" show-overflow-tooltip></el-table-column>
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
            <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle   @click="handleDetail(scope.$index, scope.row)"></el-button>
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
    <el-dialog title="详情" :visible.sync="isShowdialog">
      <clue-detail :row="curRow" :isShowdialog="isShowdialog"></clue-detail>
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
        address: '', // 地址
        departName: '', // 接收单位
        qbxsResult: '', // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '' // 分类
      },
      applyDeptCode: '', // 列表页传递过来的申请单位code
      passWordForm: {
        queryPwd: ''
      },
      assistId: '', // 集群id
      listData: [],
      expands: [],
      area: [],
      department: [],
      isShowdialog: false, // 详情弹框
      listLoading: false, // 列表加载loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      total: 0,
      page: 1,
      pageSize: 15,
      selectCurDep: { name: '' }, // 当前选中的部门
      selectCurxzqhDep: { cityName: '' }, // 当前行政区划
      tableHeight: null, // 列表外层容器的高度
      dqbmDeptCode: '', // 存储集群列表当前点击行的部门code
      curAreaCode: '', // 存储集群列表当前点击行的areaCode
      curDeptType: '', // 存储集群列表当前点击行的部门类型
      tableHead: [], // 表头
      showTitle: '', // 显示 地市 还是区县
      showType: '' // 显示类型
    }
  },
  methods: {
    init() {
      this.listLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          // this.xzqhOptions = response.data ? response.data[0].children : [] // 获取地市
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          // if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
          //   // currentArea = [this.curDept.areaCode] // 查所有
          //   currentArea = [this.curAreaCode]
          // } else if (this.curDept.depType === '2') { // 支队
          //   currentArea = [this.curAreaCode]
          //   if (this.applyDeptCode === this.dqbmDeptCode) { // 如果支队为申请，下发单位，查全部地市，

          //   } else { // 市支队默认为本地市
          //     for (var i = 0; i < this.xzqhOptions.length; i++) {
          //       const element = this.xzqhOptions[i]
          //       if (element.cityCode === this.curAreaCode) {
          //         this.xzqhOptions[i].disabled = false
          //       } else {
          //         this.xzqhOptions[i].disabled = true
          //       }
          //     }
          //   }
          // } else if (this.curDept.depType === '3') { // 大队
          //   if (this.curAreaCode) {
          //     currentArea = [this.curAreaCode.substring(0, 4) + '00', this.curAreaCode]
          //   }
          // } else if (this.curDept.depType === '4') { // 派出所
          //   if (this.curAreaCode) {
          //     if (this.curAreaCode === '611400') { // 杨凌例外
          //       currentArea = ['611400']
          //     } else { // 正常的派出所
          //       currentArea = [this.curAreaCode.substring(0, 4) + '00', this.curAreaCode]
          //     }
          //   }
          // }
          if (this.curDept.depType === '2') { // 登上来的是支队
            this.xzqhOptions[0].disabled = true
            if (this.applyDeptCode === this.curDept.depCode) { // 如果登上来的支队是申请，下发单位，查全部地市，

            } else { // 市支队默认为本地市
              for (var i = 0; i < this.xzqhOptions[0].children.length; i++) {
                const element = this.xzqhOptions[0].children[i]
                if (element.cityCode === this.curDept.areaCode) {
                  this.xzqhOptions[0].children[i].disabled = false
                } else {
                  this.xzqhOptions[0].children[i].disabled = true
                }
              }
            }
          }
          if (this.curDeptType === -1 || this.curDeptType === 1 || this.curDeptType === '') { // 当前行部门 省 总队
            currentArea = ['610000']
          } else if (this.curDeptType === 2) { // 当前行部门支队
            if (this.curAreaCode) {
              currentArea = ['610000', this.curAreaCode]
            }
          } else if (this.curDeptType === 3) { // 大队
            if (this.curAreaCode) {
              if (this.$route.query.source !== 'mainn') {
                currentArea = ['610000', this.curAreaCode.substring(0, 4) + '00', this.curAreaCode]
              } else {
                currentArea = ['610000', this.curAreaCode]
              }
            }
          } else if (this.curDeptType === 4) { // 派出所
            if (this.curAreaCode) {
              if (this.curAreaCode === '611400') { // 杨凌例外
                currentArea = ['610000', '611400']
              } else { // 正常的派出所
                if (this.$route.query.source !== 'mainn') {
                  currentArea = ['610000', this.curAreaCode.substring(0, 4) + '00', this.curAreaCode]
                } else {
                  currentArea = ['610000', this.curAreaCode]
                }
              }
            }
          }

          this.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          if (this.curDeptType === -1 || this.curDeptType === 1) { // 省厅、总队

          } else if (this.curDeptType === 2) { // 支队
            if (this.dqbmDeptCode && this.$route.query.source !== 'mainn') {
              this.department = [this.dqbmDeptCode]
            }
          } else if (this.curDeptType === 3) { // 大队
            if (this.dqbmDeptCode && this.$route.query.source !== 'mainn') {
              this.department = [this.dqbmDeptCode]
            }
          }
          this.handleDeptChange(this.department)
          this.query(true) // 查询列表
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
    xzqhDepChange(val) { // 地市获取当前tiptop信息
      if (val.length > 0) {
        if (this.xzqhOptions && this.xzqhOptions.length > 0) {
          var xzqhOptions = this.xzqhOptions
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
    handleDeptChange(val) { // 单位机构名称鼠标移上去显示全部
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
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        // receiveName: this.filters.receiveName,	// 接收单位
        address: this.filters.address, // 地址
        qbxsResult: this.filters.qbxsResult, // 协查情况
        serialNumber: this.filters.serialNumber, //  序号
        qbxsCategory: this.filters.qbxsCategory, // 分类
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        assistId: this.assistId, // 集群id
        assistType: this.$route.query.assistType ? 1 : 2, // 1 协查， 2 集群
        showType: this.showType // 是查地市还是区县
      }
      if (this.curAreaCode !== '610000') { // 省厅不传
        if (this.curDeptType !== 2 && this.$route.query.source !== 'mainn') { // 传递过来的当前行部门类型不是支队,并且不是集群列表的内层点击捡来
          para.deptCode = this.applyDeptCode === this.dqbmDeptCode ? '' : this.dqbmDeptCode
        } else {
          para.deptCode = ''
        }
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }

      // if (this.area && this.area.length > 0) { // 行政区划
      //   // para.provinceCode = '610000' // 省code
      //   para.cityCode = this.area[0] || '' // 市code
      //   para.reginCode = this.area[1] || '' // 区code
      // } else {
      //   // para.provinceCode = '610000' // 省code
      //   para.cityCode = '' // 市cod
      //   para.reginCode = '' // 区code
      // }
      if (this.area && this.area.length > 0) { // 行政区划
        para.provinceCode = this.area[0] || '' // 省code
        para.cityCode = this.area[1] || '' // 市code
        para.reginCode = this.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.department && this.department.length > 0) { // 单位机构
        var deptCode = this.department[this.department.length - 1]// 部门code
        para.deptCode = deptCode// 部门code
      }
      this.$query('caseassistclue/feedBackClues', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
          var titles = response.data.titles // 表头
          this.tableHead = []
          titles.forEach((item, index) => {
            if (index > 0) {
              this.tableHead.push(item) // 表头数据只取序号之后的
            }
          })
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    rowClick(text) {
      this.$alert(text, '内容', {
        confirmButtonText: '关闭'
      })
    },
    initData() {
      this.page = 1
      this.total = 0
      this.pageSize = 15
      this.listData = []
      this.tableHead = []
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
      if (row.qbxsResult === 1) { // 待反馈
        this.$alert('该线索还未反馈', '提示', {
          type: 'warning',
          confirmButtonText: '确定'
        })
        return false
      }
      this.isShowdialog = true
      this.curRow = row
    },
    resetForm() { // 重置
      this.filters = {
        address: '', // 地址
        departName: '', // 接收单位
        xcqk: '', // 协查情况
        sort: '', // 序号
        type: '' // 分类
      }
      this.area = []
      this.department = []
      this.initData()
      this.init()
    },
    toback() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 320
    if (this.curDept.depType === '1') { // 总队
      // this.showTitle = '地市'
      this.showType = '1'
    } else if (this.curDept.depType === '2') { // 支队
      // this.showTitle = '地市'
      this.showType = '1'
    } else if (this.curDept.depType === '3') { // 大队 派出所
      // this.showTitle = '区县'
      this.showType = '2'
    } else if (this.curDept.depType === '4') {
      if (this.curDept.areaCode === '611400') { // 杨凌例外
        // this.showTitle = '地市'
        this.showType = '1'
      } else { // 正常的派出所
        // this.showTitle = '区县'
        this.showType = '2'
      }
    }
    if (this.$route.query.id) {
      this.assistId = this.$route.query.id
      this.filters.qbxsResult = this.$route.query.type ? this.$route.query.type : '' // 核查情况
      this.applyDeptCode = this.$route.query.deptCode ? this.$route.query.deptCode : '' // 申请，下发单位code
      this.dqbmDeptCode = this.$route.query.curDeptCode ? this.$route.query.curDeptCode : '' // 存储集群列表当前点击行的部门code
      this.curAreaCode = this.$route.query.curDeptCode ? this.$route.query.curDeptCode.substring(0, 6) : '' // 存储集群列表当前点击行的areaCode
      this.curDeptType = this.$route.query.deptType ? this.$route.query.deptType : '' // 存储集群列表当前点击行的部门类型
      this.init()
    }
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueList{
  .el-dialog{
    width: 70%;
    max-height: 80vh;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 10px 0 15px 20px;
  }
  // .el-table--border th {
  //   border-bottom: 1px solid #2f627a;
  //   border-right: 1px solid #2f627a;
  // }
  // .el-table--border,
  // .el-table--group {
  //   border: 1px solid #2f627a;
  // }
  // .el-table--border td {
  //   // border-right: 1px solid #2f627a;
  //   border-right-color: #2f627a;
  // }
  .el-table--border, .el-table--group {
    border: 0;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper{
    border-right: 0;
  }
  .el-table--border th, .el-table__fixed-right-patch {
    border-bottom: 0;
  }

  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .tableBox{
    width: 100%;
    overflow: auto;
  }
}
 .el-cascader-menu__item.is-disabled{
  background-color: transparent;
}
</style>
