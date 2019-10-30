<template>
<!--装备信息首页-->
  <section class="equipInfo">
    <el-form :inline="true" :model="filters">
      <el-form-item label="装备类别" v-if="isShowfl">
        <el-select  v-model="filters.groupId" size="small" placeholder="全部" clearable  @change="changeSelect">
          <el-option v-for="item in zblbList" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="配备项目">
        <el-select  v-model="filters.allocateId" size="small" placeholder="全部" v-if="isShowfl" clearable>
          <el-option v-for="item in pbxmList" :key="item.allocateId" :label="item.allocateName" :value="item.allocateId"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="装备类型">
        <el-select  v-model="filters.allocateType" size="small" placeholder="全部" clearable>
          <el-option v-for="item in zblxList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;margin-top: 15px;"  border :max-height="tableHeight"  :span-method="objectSpanMethod">
      <el-table-column type="index" label="序号" width="70" align="center">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="装备分类" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="allocateName" label="装备项目" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}"  class="linkStyle"  @click="handleDetail(scope.$index, scope.row)">{{scope.row.allocateName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocateType" label="配备类型" align="center" min-width="100">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{getTypeName(scope.row.allocateType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipNumber" label="配备数量" align="center" min-width="60">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.equipNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unitTypeName" label="单位" align="center" min-width="60">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.unitTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseTime" label="采购日期" align="center" min-width="100">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.purchaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="说明" align="center" min-width="180">
        <template slot-scope="scope">
          <p :title="scope.row.remark" class="ellipsis-twoWords" :class="{'redColor':scope.row.equipStatus === 1}" style="text-align:left;">{{scope.row.remark}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
           <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
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
export default {
  name: 'index',
  data() {
    return {
      filters: {
        groupId: '', // 分类id
        allocateId: '', // 项目id
        allocateType: '' // 配备项类型(1必配 2选配 3按规定配备 )
      },
      total: 0,
      page: 1,
      pageSize: 15,
      isShowfl: false, // 是否显示分类查询框，若分类下拉列表查不出数据，则分类查询框和配备项目查询框都不显示。
      spanArr: [], // 表示某一行所需合并的列数
      zblbList: [], // 装备分类下拉列表
      pbxmList: [], // 配备项目下拉列表
      zblxList: [ // 装备类型下拉列表
        {
          label: '必配',
          value: 1
        },
        {
          label: '选配',
          value: 2
        },
        {
          label: '按规定配备',
          value: 3
        }
      ],
      tableData: [], // 列表数据
      // isShowZbfl: false, // 是否显示装备分类查询项
      listLoading: false,
      tableHeight: null
    }
  },
  methods: {
    init() {
      this.equipgroupselect() // 装备分类下拉框
      this.query(true)
    },
    equipgroupselect() { // 装备分类下拉框
      this.$query('equipgroupselect', {}).then((response) => {
        if (response.data.length > 0) {
          this.isShowfl = true
          this.zblbList = response.data
        } else {
          this.isShowfl = false
          this.zblbList = []
        }
      })
    },
    equipallocateselect(id) { // 配备项目下拉框
      this.$query('equipallocateselect', { groupId: id }).then((response) => {
        this.pbxmList = response.data
      })
    },
    query(flag, hand) { // 列表查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        groupId: this.filters.groupId, // 分类id
        allocateId: this.filters.allocateId, // 项目id
        allocateType: this.filters.allocateType, // 配备项类型(1必配 2选配 3按规定配备 )
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        belongDepCode: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depCode : '' // 部门code
      }
      if (hand) {
        para.logFlag = 1 // 添加埋点参数
      }
      this.$query('page/basicequipinfo', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
          this.getSpanArr(this.tableData)
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    changeSelect(val) { // 装备分类change事件
      if (val) {
        this.equipallocateselect(val)
      } else {
        this.pbxmList = []
        this.filters.allocateId = ''
      }
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true, true)
    },
    initData() {
      this.tableData = []
      this.total = 0
      this.pageSize = 15
    },
    getSpanArr(datas) {
      this.spanArr = []
      for (var i = 0; i < datas.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (datas[i].groupName === datas[i - 1].groupName) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            // 不相等push 1
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) { // 每次走到表格的第二列时给单元格加上rowspan和colspan属性,当columnIndex === 1 找到第二列，实现合并随机出现的行数
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getTypeName(val) { // 根据配备类型获取中文名
      var name = ''
      if (val === 1) {
        name = '必配'
      } else if (val === 2) {
        name = '选配'
      } else if (val === 3) {
        name = '无要求'
      }
      return name
    },
    handleDetail(index, row) { // 详情
      const param = {
        groupId: row.groupId, // 分类id
        allocateId: row.allocateId // 项目id
      }
      this.$router.push({ path: '/basicService/equip/detail', query: param })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.init()
  },
  activated() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.equipInfo{
  .el-year-table td .cell {
    color: #fff;
  }
  .el-table__body-wrapper,.el-table--border td, .el-table--border th {
    border-right: 1px solid #ebeef5;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  .el-table__body-wrapper tr:nth-child(even) {
    background-color: transparent;
  }
  .ellipsis-twoWords {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
  .linkStyle{
    // text-decoration:underline;
    cursor:pointer;
  }
}
</style>
