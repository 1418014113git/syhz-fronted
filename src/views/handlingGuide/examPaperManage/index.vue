<template>
<!--试卷管理列表-->
  <section class="testTableList">
    <!--查询条件-->
    <el-form ref="dbqueryForm" :inline="true" :model="filters">
      <el-form-item label="试卷名称">
        <el-input v-model.trim="filters.paperName"  maxlength="50" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="组卷方式" prop="">
        <el-select  v-model="filters.paperType" size="small" placeholder="请选择">
          <el-option v-for="item in zjOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker  v-model="filters.startTime"  placeholder="请选择开始时间" type="date"  value-format="yyyy-MM-dd"  @change="startTimeChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker  v-model="filters.endTime" placeholder="请选择结束时间" type="date" :disabled="endDateDisabled" value-format="yyyy-MM-dd" @change="endTimeChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="发布状态" prop="">
        <el-select  v-model="filters.paperStatus" size="small" placeholder="请选择" clearable>
          <el-option v-for="item in fbOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="addExamPaper">添加试卷</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;"  class="testList"  :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="paperName" label="试卷名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paperType" label="组卷方式" min-width="100">
        <template slot-scope="scope">
          <span>{{getzjStatus(scope.row.paperType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paperStatus" label="发布状态" min-width="100">
        <template slot-scope="scope">
          <span>{{getfbStatus(scope.row.paperStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" title="修改"  type="primary" icon="el-icon-edit" circle  v-if="scope.row.fbStatus==='0'"   @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="发布"  type="primary" icon="el-icon-bell"  circle  v-if="scope.row.fbStatus==='0'" @click="handleRelease(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="预览"  type="primary" circle  @click="preview(scope.$index, scope.row)">
            <svg-icon icon-class="yulan"></svg-icon>
          </el-button>
          <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  v-if="scope.row.fbStatus==='0'" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
  props: ['menuItemNode'],
  data() {
    return {
      filters: {
        paperName: '', // 试卷名称
        paperType: 1, // 人工组卷/自动组卷
        startTime: '', // 创建时间 开始
        endTime: '', // 创建时间 结束
        paperStatus: '' // 发布状态
      },
      deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      endDateDisabled: true, // 结束时间选择框是否禁用
      tableHeight: null,
      list: [], // 列表数据
      zjOption: [ // 组卷方式
        {
          value: 1,
          label: '人工组卷'
        },
        {
          value: 2,
          label: '随机组卷'
        }
      ],
      fbOption: [ // 发布状态
        {
          value: 1,
          label: '未发布'
        },
        {
          value: 2,
          label: '已发布'
        }
      ]
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        paperName: this.filters.paperName, // 试卷名称
        paperType: this.filters.paperType, // 人工组卷/自动组卷
        startTime: this.filters.startTime, // 创建时间 开始
        endTime: this.filters.endTime, // 创建时间 结束
        paperStatus: this.filters.paperStatus, // 发布状态
        deptCode: this.deptCode// 当前部门code
      }
      if (hand) {
        para.logFlag = 1 // 添加埋点参数
      }
      this.$query('paper/list', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true, true)
    },
    handleEdit(index, row) { // 编辑

    },
    handleDelete(index, row) { // 删除
      this.$confirm('确定要删除该试卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$remove('paper/delete', { id: row.id, logFlag: 1 }).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleRelease(index, row) { // 发布
      this.$confirm('确定要发布该试卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          id: row.id,
          modifier: JSON.parse(sessionStorage.getItem('userInfo')).userName, // 登录人账号
          logFlag: 1
        }
        this.$remove('paper/release', param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    preview(index, row) { // 预览试卷

    },
    addExamPaper() { // 添加试卷
      this.$router.push({ path: '/handlingGuide/addExamPaper' })
    },
    startTimeChange(val) { // 开始时间
      if (val) {
        this.endDateDisabled = false // 激活结束时间选择框
      } else {
        this.endDateDisabled = true // 禁用结束时间选择框
      }
    },
    endTimeChange(val) { // 结束时间
      if (val) {
        if (this.filters.startTime > val) {
          this.$alert('结束时间不能小于开始时间', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {
              this.filters.endTime = ''
            }
          })
          return
        }
        this.filters.endTime = val
      }
    },
    getfbStatus(val) { // 获取发布状态
      var name = ''
      if (val === 1) {
        name = '未发布'
      } else if (val === 2) {
        name = '已发布'
      }
      return name
    },
    getzjStatus(val) { // 获取组卷方式
      var name = ''
      if (val === 1) {
        name = '人工组卷'
      } else if (val === 2) {
        name = '随机组卷'
      }
      return name
    },
    resetForm() { // 重置
      this.filters = {
        paperName: '', // 试卷名称
        startTime: '', // 创建时间 开始
        endTime: '', // 创建时间 结束
        paperStatus: '' // 发布状态
      }
      this.query(true, true)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testTableList{
   height: 100%;
  .addTestQuestion{
    float: right;
    margin-bottom: 10px;
  }
}
</style>
