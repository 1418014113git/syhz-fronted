<template>
<!--试卷管理列表-->
  <section class="testTableList">
    <!--查询条件-->
    <el-form ref="dbqueryForm" :inline="true" :model="filters">
      <el-form-item label="试卷名称">
        <el-input v-model.trim="filters.paperName"  maxlength="50" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="组卷方式" prop="">
        <el-select  v-model="filters.paperType" size="small" placeholder="请选择" @change="paperTypeChange">
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
          <span v-if="scope.row.paperStatus === 1" style="color:#F56C6C;">{{getfbStatus(scope.row.paperStatus)}}</span>
          <span v-else-if="scope.row.paperStatus === 2" style="color:#67C23A;">{{getfbStatus(scope.row.paperStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" title="修改"  type="primary" icon="el-icon-edit" circle  v-if="scope.row.paperStatus===1"   @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="发布"  type="primary"  circle  v-if="scope.row.paperStatus===1" @click="handleRelease(scope.$index, scope.row)">
            <svg-icon icon-class="release"></svg-icon>
          </el-button>
          <el-button size="mini" title="预览"  type="primary" circle  @click="preview(scope.$index, scope.row)">
            <svg-icon icon-class="yulan"></svg-icon>
          </el-button>
          <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  v-if="scope.row.paperStatus===1" @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 预览试卷 -->
    <el-dialog title="试卷预览" :visible.sync="dialogPreviewVisible" size="small" class="previewDia" width="66%">
      <preview-paper :curPaper="curPaperData" :curPaperName='curPaperName'></preview-paper>
    </el-dialog>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'
import previewPaper from './previewPaper'
export default {
  name: 'exampaper',
  props: ['menuItemNode'],
  data() {
    return {
      filters: {
        paperName: '', // 试卷名称
        paperType: '', // 人工组卷/自动组卷
        startTime: '', // 创建时间 开始
        endTime: '', // 创建时间 结束
        paperStatus: '' // 发布状态
      },
      curPaperName: '', // 存储当前被点击的试卷的试卷名称
      deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      endDateDisabled: true, // 结束时间选择框是否禁用
      tableHeight: null,
      list: [], // 列表数据
      dialogPreviewVisible: false, // 预览试卷的弹框
      curPaperData: [], // 预览时的试卷内容
      txData: questionTypeAll(),
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
  components: {
    previewPaper
  },
  methods: {
    query(flag, hand) { // 列表数据查询
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
      if (this.filters.startTime > this.filters.endTime) {
        this.$alert('结束时间不能小于开始时间', '提示', {
          type: 'warning',
          confirmButtonText: '确定'
        })
        return
      }
      this.listLoading = true
      this.$query('paper/list', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        } else {
          this.initData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    initData() {
      this.list = []
      this.total = 0
      this.pageSize = 15
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
      this.$router.push({
        path: '/handlingGuide/editExamPaper', query: { id: row.id, paperType: row.paperType }
      })
    },
    handleDelete(index, row) { // 删除
      this.$confirm('确定要删除该试卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$update('paper/delete', { id: row.id, logFlag: 1 }).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.initData()
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
        this.$update('paper/release', param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.initData()
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
      this.listLoading = true
      this.$query('paper/preview/' + row.id, {}).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          var data = response.data
          this.curPaperName = response.data.paperName
          this.dialogPreviewVisible = true
          this.dealData(data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    dealData(data) { // 处理预览返回的数据
      var _this = this
      var staticArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
      var titleText = ['一', '二', '三', '四', '五', '六', '七']
      _this.curPaperData = []
      for (let index = 0; index < staticArr.length; index++) {
        var element = staticArr[index]
        if (data[element]) {
          data[element].titleCN = titleText[index]
          if (data[element].data && data[element].data.length > 0 && data[element].data[0].type) {
            data[element].typeName = _this.$getLabelByValue(data[element].data[0].type + '', _this.txData)
          } else {
            data[element].typeName = '无'
          }
          if (data[element].data[0].type === 3) { // 填空题，将[] 替换为横线
            for (let k = 0; k < data[element].data.length; k++) {
              var tkelement = data[element].data[k]
              if (tkelement.name.indexOf('[]') > -1) {
                tkelement.name = tkelement.name.replace(/\[/g, '___').replace(/\]/g, '___')
              }
            }
          }
          _this.curPaperData.push(data[element])
        }
      }
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
      this.endDateDisabled = true // 禁用结束时间选择框
      this.initData()
      this.query(true, true)
    },
    paperTypeChange() { // 组卷方式change
      this.initData()
      this.query(true, true)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.testTableList {
  height: 100%;
  .addTestQuestion {
    float: right;
    margin-bottom: 10px;
  }
}
 .previewDia {
    .el-dialog {
      background: #c7eece;
      border: 2px solid #00a0e9;
    }
    .el-dialog__header {
      border-bottom: 2px solid #aaaaaa;
      .el-dialog__title {
        color: #000000;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #000000;
      }
    }
    .el-dialog__body {
      background: #c7eece;
      color: #000000;
      max-height: 75vh !important;
      overflow: auto;
    }
  }
</style>
