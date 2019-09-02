<template>
  <div class="ineg-Examine">
    <el-table :data="urgeData" v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="dept_name" label="申请部门" width="220"></el-table-column>
      <el-table-column prop="user_name" label="申请人" width="100"></el-table-column>
      <el-table-column prop="create_time" label="申请时间" width="155"></el-table-column>
      <el-table-column prop="update_user" label="审核人" width="100"></el-table-column>
      <el-table-column prop="update_time" label="审核时间" width="155"></el-table-column>
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          {{formatText(scope.row.wd_flow_status)}}
        </template>
      </el-table-column>
      <el-table-column label="驳回原因">
        <template slot-scope="scope">
          <el-popover
          placement="top"
          width="400"
          trigger="click">
          {{scope.row.content}}
          <el-button slot="reference" type="text" class="examine_tab_list" style="width:230px">{{scope.row.content}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="listTotal > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
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
    name: 'InegExamine',
    props: ['id'],
    data() {
      return {
        pageSize: 5,
        listTotal: 0,
        page: 1,
        listLoading: false,
        urgeData: []
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
        const para = {
          pageNum: this.page,
          pageSize: 5,
          type: '0004',
          id: this.id
        }
        getExamineList(para).then((response) => {
          this.listLoading = false
          this.urgeData = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    mounted() {
      if (this.id) {
        this.getData()
      }
    },
    watch: {
      id(val) {
        this.getData()
      }
    }
  }
</script>

<style scoped>
  .ineg-Examine .urge_title {
    padding: 5px;
    text-align: right;
  }

  .ineg-Examine .urge_content {
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
