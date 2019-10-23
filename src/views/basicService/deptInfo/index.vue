<template>
  <section class="deptTableList">
    <el-form :inline="true" :model="filters" ref="filters" label-width="80px" style="text-align: left;">
      <el-form-item label="行政区划" prop="examStatus">
        <el-cascader
          :options="xzqhOptions"
          v-model="filters.area"
          :props="props"
          change-on-select
          @change="handleAreaChange"
          clearable placeholder="全部">
        </el-cascader>
      </el-form-item>
      <el-form-item label="单位机构" prop="examStatus">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>11)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="filters.department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            clearable placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList(true)" v-if="$isViewBtn('169001')">查询</el-button>
        <el-button type="info" @click="reset" v-if="$isViewBtn('169001')">重置</el-button>
        <el-button type="info" @click="exportDeptExcel" v-if="$isViewBtn('169002')">导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="departName" label="机构全称" min-width="160" show-overflow-tooltip>
         <template slot-scope="scope">
            <span class="canClick" @click="handleDetail(scope.$index, scope.row)">{{scope.row.departName}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="departLevel" label="机构级别" width="100" align="center">
        <template slot-scope="scope">
          {{$getDictName(scope.row.departLevel+'', 'zyzz')}}
        </template>
      </el-table-column>
      <el-table-column prop="realityNum" label="实有人数" width="100" align="center"></el-table-column>
      <el-table-column prop="areaName" label="所属行政区划" width="180" align="center"></el-table-column>
      <el-table-column prop="mainLeader" label="主要负责人" width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subofficeLeader" label="分管局领导" width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" circle @click="handleDetail(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑" v-if="scope.row.setFlag===1 && ($isViewBtn('169003'))"></el-button>
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
import { examStatus, examPaperType } from '@/utils/codetotext'
import http from '@/api/http'
import { getTree } from '@/api/dept'

export default {
  data() {
    return {
      downLoadUrl: http.LoginModuleName, // nginx配置的文件下载
      filters: {
        area: [],
        department: []
      },
      tableData: [], // 列表数据
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      ksztData: examStatus(), // 考试状态
      paperType: examPaperType(), // 试卷类型
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
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    handleAreaChange(val) { // 行政区划
      if (val.length > 0) {
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
                arr.push({
                  id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                  depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                })
              }
              this.deptOptions = getTree(arr) // 机构
              if (this.deptInfo.depType === '-1') { // 省
                this.filters.department = [this.deptInfo.depCode]
              } else if (this.deptInfo.depType === '1') { // 总队
                this.filters.department = [this.deptInfo.parentDepCode, this.deptInfo.depCode]
              } else if (this.deptInfo.depType === '2') { // 支队
                this.filters.department = [this.deptInfo.depCode]
              } else if (this.deptInfo.depType === '3') { // 大队
                this.filters.department = [this.deptInfo.depCode]
              } else if (this.deptInfo.depType === '4') { // 派出所
                this.filters.department = [this.deptInfo.parentDepCode, this.deptInfo.depCode]
              }
              this.queryList(true) // 查列表
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    handleDeptChange(val) { // 单位机构
      // console.log(val)
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
        this.selectCurDep = { name: '' }
      }
    },
    initData() { // 初始化筛选条件
      // 行政区划
      this.listLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1') { // 省 总队
            currentArea = [this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '2') { // 支队
            currentArea = ['610000', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '4') {
            if (this.deptInfo.areaCode === '610403') { // 杨凌例外
              currentArea = ['610000', '610403']
            } else { // 正常的派出所
              currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
            }
          }
          this.filters.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryList(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        id: this.deptInfo.id, // 当前部门的id
        pageNum: this.page,
        pageSize: this.pageSize,
        userId: this.userInfo.id
      }
      if (this.filters.area && this.filters.area.length > 0) { // 行政区划
        console.log(this.filters.area)
        para.provinceCode = this.filters.area[0] || '' // 省code
        para.cityCode = this.filters.area[1] || '' // 市code
        para.reginCode = this.filters.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.filters.department && this.filters.department.length > 0) { // 单位机构
        para.departCode = this.filters.department[this.filters.department.length - 1] || '' // 部门code
      } else {
        para.departCode = ''
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/hsyzdepart', para, 'upms').then((response) => {
        this.listLoading = false
        if (response.data) {
          // && response.data.list.length > 0
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.tableData = response.data.list
        }
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.queryList(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.queryList(true, true)
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/basicService/deptInfo/detail', query: { deptId: row.id }})
    },
    handleEdit(index, row) { // 编辑
      // 检查是否可编辑
      var roleFlag = false
      if (sessionStorage.getItem('roles')) {
        var roles = JSON.parse(sessionStorage.getItem('roles'))
        for (let d = 0; d < roles.length; d++) {
          const element = roles[d]
          if (element.roleCode === '1007') { // 具有审核权限的用户
            roleFlag = true
            break
          } else {
            roleFlag = false
          }
        }
      }
      if (roleFlag) {
        this.$router.push({ path: '/basicService/deptInfo/edit', query: { deptId: row.id }})
      } else {
        this.$message.error('此操作您暂时没有权限操作！')
      }
    },
    exportDeptExcel() { // 导出excel
      var para = {
        id: this.deptInfo.id, // 当前部门的id
        logFlag: 1, // 添加埋点参数
        type: 1, // 接口规定的
        userId: this.userInfo.id
      }
      if (this.filters.area && this.filters.area.length > 0) { // 行政区划
        console.log(this.filters.area)
        para.provinceCode = this.filters.area[0] || '' // 省code
        para.cityCode = this.filters.area[1] || '' // 市code
        para.reginCode = this.filters.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.filters.department && this.filters.department.length > 0) { // 单位机构
        para.departCode = this.filters.department[this.filters.department.length - 1] || '' // 部门code
      } else {
        para.departCode = ''
      }
      // /upms/excel/exporFile/hsyzdepart?id=1039&logFlag=1&type=1&userId=3007&provinceCode=610000&cityCode=610100&reginCode=610116&departCode=
      var url = this.downLoadUrl + 'excel/exporFile/hsyzdepart?id=' + this.deptInfo.id + '&type=' + 1 + '&userId=' + this.userInfo.id +
        '&provinceCode=' + para.provinceCode + '&cityCode=' + para.cityCode + '&reginCode=' + para.reginCode + '&departCode=' + para.departCode
      window.open(url)
    },
    reset() { // 重置
      this.filters = {
        area: [],
        department: []
      }
      this.initData()
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 180
    this.initData()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.deptTableList {
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    // color: rgba(0, 160, 233, 0.6);
    text-decoration: underline;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
</style>
