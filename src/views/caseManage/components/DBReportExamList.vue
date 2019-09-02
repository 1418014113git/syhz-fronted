<template>
  <div class="examine-list">
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="accepted_dept_name" label="审核部门" min-width="10%"></el-table-column>
      <el-table-column prop="update_user" label="审核人" min-width="4%"></el-table-column>
      <el-table-column prop="update_time" label="审核时间" width="155"></el-table-column>
      <el-table-column label="审核结果" width="100">
        <template slot-scope="scope">
          {{formatText(scope.row.wd_flow_status)}}
        </template>
      </el-table-column>
      <el-table-column label="驳回原因" min-width="15%">
        <template slot-scope="scope">
          <el-popover placement="top" width="400" trigger="click">
          {{scope.row.content}}
          <el-button slot="reference" type="text" class="examine_tab_list">{{scope.row.content}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="listTotal > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-row v-if="commentContent" style="clear: both; padding-bottom: 20px;" type="flex" justify="center">
      <el-col :span="20">
        <div style="text-align: center; font-size: 18px; padding-bottom: 12px;">领导批示</div>
        <div>{{commentContent}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getExamineList
  } from '@/api/workflow'
  import {
    getWFlowStatusText
  } from '@/utils/codetotext'

  export default {
    name: 'examineList',
    props: ['id', 'comment'],
    data() {
      return {
        pageSize: 5,
        listTotal: 0,
        page: 1,
        listLoading: false,
        tableData: [],
        commentContent: ''
      }
    },
    methods: {
      formatText(status) {
        return getWFlowStatusText(status)
      },
      handleCurrentChange(val) {
        this.page = val
        this.getData()
      },
      getData() {
        this.listLoading = true
        getExamineList({
          pageNum: this.page, pageSize: 5, type: '0008', id: this.id
        }).then((res) => {
          this.listLoading = false
          if (res.code === '000000') {
            this.tableData = res.data.list
            this.pageSize = res.data.pageSize
            this.listTotal = res.data.totalCount
          }
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    mounted() {
      if (this.id) {
        this.getData()
      }
      if (this.comment) {
        this.commentContent = this.comment
      }
    },
    watch: {
      id(val) {
        if (this.tableData.length === 0) {
          this.getData()
        }
      },
      comment(val) {
        this.commentContent = val
      }
    }
  }
</script>

<style scoped>
  .examine-list .urge_title {
    padding: 5px;
    text-align: right;
  }

  .examine-list .urge_content {
    padding: 5px;
  }

  .examine_tab_list {
    text-align: left;
    padding-left: 0;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }


</style>
