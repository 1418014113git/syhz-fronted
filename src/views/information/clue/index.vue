<template xmlns="http://www.w3.org/1999/html">
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="填报单位">
        <el-input v-model="filters.submitUnitName" clearable placeholder="关键字检索单位" size="small"></el-input>
      </el-form-item>
      <el-form-item label="填报人">
        <el-input v-model="filters.submitPersonName" clearable placeholder="关键字检索单位" size="small"></el-input>
      </el-form-item>
      <el-form-item label="填报日期">
        <el-date-picker
          v-model="filters.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :default-time="defaultTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="线索分类">
        <el-select v-model="filters.clueSortId" placeholder="请选择">
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('xsfl')" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采集类型">
        <el-select v-model="filters.collectionTypeId" placeholder="请选择">
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('cjlx')" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分享状态">
        <el-select v-model="filters.shareStatus" placeholder="请选择">
          <el-option v-for="item in shareStatusList"
                     :key="item.code" :label="item.label" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="filters.keyword" clearable placeholder="关键字检索标题或者内容" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query">查询</el-button>
        <el-button size="small"  @click="reset">重置</el-button>
        <el-button size="small"  @click="add">添加线索</el-button>
        <el-button size="small"  @click="exportExcel">导出线索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="statisticCollect">
      <el-table-column prop="clueNumber" label="线索编号" min-width="10%"></el-table-column>
      <el-table-column prop="clueName" label="线索标题" min-width="10%"></el-table-column>
      <el-table-column prop="collectionTypeId" label="采集类型" :formatter="collectionTypeFormat" min-width="5%"></el-table-column>
      <el-table-column prop="clueSortId" label="线索分类" :formatter="clueSortFormat" min-width="5%"></el-table-column>
      <el-table-column prop="shareStatus" label="分享状态" :formatter="statusFormat" min-width="5%"></el-table-column>
      <el-table-column prop="submitTime" label="填报日期" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="165">
        <template slot-scope="scope">
          <el-button v-if="shareBtn(scope.row)" title="分享" size="mini" icon="el-icon-document" type="primary" circle
                     @click="handleShare(scope.$index, scope.row)"></el-button>
          <el-button title="详情" size="mini" icon="el-icon-document" type="primary" circle
                     @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button v-if="editBtn(scope.row)" title="编辑" size="mini" type="primary"
                     icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="delBtn(scope.row)" title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {
    getCluePage
  } from '@/api/clue'
  export default {
    name: 'analysis',
    data() {
      return {
        defaultTime: ['00:00:00', '23:59:59'],
        shareStatusList: [
          { code: 0, label: '未分享' },
          { code: 1, label: '已分享' }
        ],
        total: '',
        page: 1,
        pageSize: 15,
        listLoading: '',
        statusData: [],
        filters: {
        },
        listData: [],
        defaultQuery: true
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        if (this.defaultQuery === true) {
          this.init()
        } else {
          this.query(1)
        }
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        if (this.defaultQuery === true) {
          this.init()
        } else {
          this.query(1)
        }
      },
      // 分享按钮控制显示
      shareBtn(row) {
        return row.shareView + '' === '1'
      },
      // 编辑按钮控制显示
      editBtn(row) {
        return row.submitPersonId === JSON.parse(sessionStorage.getItem('userId'))
      },
      // 删除按钮控制显示
      delBtn(row) {
        if (row.shareStatus + '' === '0') {
          // 删除按钮编号
          return (this.$isViewBtn('100821') && row.submitDeptId + '' === JSON.parse(sessionStorage.getItem('depToken'))[0].id + '') || (row.submitPersonId + '' === JSON.parse(sessionStorage.getItem('userId')) + '')
        }
        return false
      },
      // 获取当前单位及下级单位
      getDeptList(topCode) {
        var deptList = JSON.parse(sessionStorage.getItem('DeptSelect'))
        var resultList = []
        if (deptList == null || deptList.length < 1) {
          return resultList
        }
        // 获取当前部门
        var parentId
        deptList.forEach((dept, index) => {
          parentId = dept.depCode
          if (topCode === parentId) {
            resultList.push(dept)
          }
        })
        this.getSubList(topCode, deptList, resultList)
        return resultList
      },
      //  获取子部门
      getSubList(id, deptList, resultList) {
        var childList = []
        var parentId

        // 直接子对象
        deptList.forEach((dept, index) => {
          parentId = dept.parentCode
          if (id === parentId) {
            childList.push(dept)
            resultList.push(dept)
          }
        })

        // 间接子对象
        childList.forEach((dept, index) => {
          this.getSubList(dept.depCode, deptList, resultList)
        })
        // 递归退出条件
        if (childList.length === 0) {
          return
        }
      },
      // 查询
      query(flag) {
        if (flag !== 1) {
          this.page = 1
          this.pageSize = 15
        }
        this.defaultQuery = false
        var param = {
          currentPage: this.page,
          pageSize: this.pageSize,
          deptList: this.getDeptList(JSON.parse(sessionStorage.getItem('depToken'))[0].depCode),
          submitUnitName: this.filters.submitUnitName,
          submitPersonName: this.filters.submitPersonName,
          startTime: this.filters.timeRange ? this.filters.timeRange[0] : null,
          endTime: this.filters.timeRange ? this.filters.timeRange[1] : null,
          clueSortId: this.filters.clueSortId,
          collectionTypeId: this.filters.collectionTypeId,
          shareStatus: this.filters.shareStatus,
          keyword: this.filters.keyword,
          currentDeptId: JSON.parse(sessionStorage.getItem('depToken'))[0].id,
          currentUserId: JSON.parse(sessionStorage.getItem('userId'))
        }
        this.queryRequest(param)
      },
      // 查询请求
      queryRequest(param) {
        this.listLoading = true
        getCluePage(param).then((response) => {
          if (response.data) {
            this.total = response.data.totalCount
            this.listData = response.data.list
            this.page = response.data.pageNum
            this.pageSize = response.data.pageSize
            this.listLoading = false
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 重置
      reset() {
        this.filters = {}
        this.defaultQuery = true
      },
      // 导出
      exportExcel() {
      },
      // 添加
      add() {
      },
      // 分享
      handleShare() {
      },
      // 详情
      handleDetail() {
      },
      // 编辑
      handleEdit() {
      },
      // 删除
      handleDel() {
      },
      // 采集类型格式化
      collectionTypeFormat(row) {
        var list = this.$getDicts('cjlx')
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictKey + '' === row.collectionTypeId + '') {
            return list[i].dictName
          }
        }
      },
      // 线索分类格式化
      clueSortFormat(row) {
        var list = this.$getDicts('xsfl')
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictKey + '' === row.clueSortId + '') {
            return list[i].dictName
          }
        }
      },
      // 分享状态格式化
      statusFormat(row) {
        switch (row.shareStatus) {
          case 0:
            return '未分享'
          case 1:
            return '已分享'
        }
      },
      // 初始化
      init() {
        var param = {
          currentPage: this.page,
          pageSize: this.pageSize,
          submitPersonId: JSON.parse(sessionStorage.getItem('userId')),
          submitDeptId: JSON.parse(sessionStorage.getItem('depToken'))[0].id,
          currentDeptId: JSON.parse(sessionStorage.getItem('depToken'))[0].id,
          currentUserId: JSON.parse(sessionStorage.getItem('userId'))
        }
        this.queryRequest(param)
      }
    },
    mounted: function() {
      this.init()
    }
  }
</script>

