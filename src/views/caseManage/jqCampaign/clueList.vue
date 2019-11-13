<template>
  <section class="clueList">
   <!--线索列表-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="地市">
          <el-tooltip effect="dark">
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
        <el-form-item label="接收单位">
          <el-input v-model="filters.departName" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="协查情况">
          <el-select  v-model="filters.xcqk" size="small" placeholder="全部" clearable>
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="线索序号">
          <el-input v-model="filters.sort" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select  v-model="filters.type" size="small" placeholder="全部" clearable>
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
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
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" :max-height="tableHeight">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="" align="center" label='线索序号'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='地市'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='接收单位'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='分类'  min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='核查情况'  min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='移送行政部门处理（次）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='侦办刑事案件'>
        <el-table-column prop="" align="center" label='立案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label='破案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label='捣毁窝点（个）'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label='刑事拘留（人）'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label='批准逮捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" align="center" label='涉案金额（万元）'  min-width="100" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <el-table-column v-for="(item, index) in tableHead" :key="index" :label="item.label" :prop="item.prop" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--线索详情弹出层-->
    <el-dialog title="详情" :visible.sync="isShowdialog">
      <clue-detail :row="curRow"></clue-detail>
    </el-dialog>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
import ClueDetail from './clueDetail' // 线索列表
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
        xcqk: '', // 协查情况
        sort: '', // 序号
        type: '' // 分类
      },
      passWordForm: {
        queryPwd: ''
      },
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
      exportBtn: false, // 导出按钮显隐
      // firstCanShow: true, // 控制 表头显示 省市 还是单位机构 默认是省市
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
      tableHeight: null,
      tableHead: [ // 表头
        {
          prop: 'para1',
          label: '线索1'
        },
        {
          prop: 'para2',
          label: '线索2'
        }
      ],
      passWordRules: {
        queryPwd: [
          { required: true, message: '请输入查阅密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
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
          if (this.curDept.depType === '-1') { // 省
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '1') { // 总队
            this.department = [this.curDept.parentDepCode, this.curDept.depCode]
          } else if (this.curDept.depType === '2') { // 支队
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '3') { // 大队
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '4') { // 派出所
            this.department = [this.curDept.parentDepCode, this.curDept.depCode]
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
                arr.push({
                  id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                  depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                })
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
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        address: this.filters.address, // 地址
        departName: this.filters.departName,	// 接收单位
        xcqk: this.filters.xcqk, // 协查情况
        sort: this.filters.sort, //  序号
        type: this.filters.type, // 分类
        pageNum: this.page, // 页数
        pageSize: this.pageSize // 条数
      }
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
        para.departCode = this.department[this.department.length - 1] || '' // 部门code
      } else {
        para.departCode = ''
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.list = response.data.list
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.listData = []
    },
    handleDetail(index, row) { // 详情
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
      this.initData()
      this.init()
    },
    restData() {
      this.$refs['passWordForm'].resetFields()
      this.resetPwdForm.queryPwd = ''
    },
    toback() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // this.init()
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
}
</style>
