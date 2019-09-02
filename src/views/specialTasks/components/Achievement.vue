<template>
  <div class="specialReport">
    <el-table :data="reportData" v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="create_dept_name" label="上报部门"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="create_date" label="上报时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary"
                     @click="handleDetail(scope.row)" icon="el-icon-tickets" circle>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                   :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
    </el-pagination>
    <el-dialog title="成果详情" ref="dialogView" :visible.sync="dialogViewVisible">
      <div style=" min-height: 300px;">
        <el-row type="flex" justify="center">
          <el-col :span="18" style="text-align: center;font-size: 18px; color: #fff">{{detail.title}}</el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col v-html="detail.desription" :span="18" style="margin-top: 20px; padding: 0 20px; min-height: 100px;"></el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="18" v-if="detail.attachment" style="font-size: 12px;padding-top: 20px;">
            附件：
            <div v-for="(item,index) in attachmentList" :key="index">
              <p v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0">
                <a v-preview="item.path" preview-title-enable="true" preview-nav-enable="true"  style="font-size: 12px; color: #1b75ba;">{{item.name}}</a>
              </p>
              <p v-else>
                <a @click="downFile(item.path)" style="font-size: 12px; color: #1b75ba;">{{item.name}}</a>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getReportListPage
  } from '@/api/specialTasks'
  export default {
    name: 'specialReport',
    props: [
      'id'
    ],
    data() {
      return {
        attachmentList: [],
        dialogViewVisible: false,
        reportData: [],
        listLoading: false,
        total: 0,
        pageSize: 10,
        page: 1,
        curDeptId: '',
        taskId: '',
        detail: {}
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.query()
      },
      query() {
        if (this.taskId) {
          const para = {
            create_date: '',
            // deptId: this.curDeptId,
            taskId: this.taskId,
            reportStatus: 3
          }
          this.reportData = []
          getReportListPage(para).then((response) => {
            if (response.code === '000000') {
              this.reportData = response.data.list
              this.total = response.data.totalCount
            }
          })
        }
      },
      handleDetail(row) {
        this.dialogViewVisible = true
        this.detail = row
        if (row.attachment) {
          this.attachmentList = JSON.parse(row.attachment)
        } else {
          this.attachmentList = []
        }
      },
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
      const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (curDept) {
        this.curDeptId = curDept.id
        this.query()
      }
    },
    watch: {
      id(val) {
        this.taskId = val
        this.query()
      }
    }
  }
</script>

<style scoped>

</style>
