<template>
  <div class="InegMapping">
    <el-row>
      <el-col :span="8" style="padding: 5px 10px 20px; max-height: 500px; overflow: auto">
        <el-tree class="filter-tree" :data="deptData" :props="defaultProps" default-expand-all ref="tree"
                 highlight-current :filter-node-method="filterNode" @node-click="getCurrentNode"
                 :default-checked-keys="selectedData" :expand-on-click-node="false" node-key="id"
                 style="margin-top: 5px;">
        </el-tree>
      </el-col>
      <el-col :span="16" style="padding: 5px 20px;">
        <div v-loading="listLoading">
          <el-button type="primary" size="small" @click="openReport" v-if="$isViewBtn('101009') && enableBtn && ifSign && inegState"
                     style="float: right;">关联情报
          </el-button>
          <div class="dept_name">{{deptName}}</div>
          <div class="dept_ineg_num">
            <span>线索总数：{{totalNum}}</span>
            <span>本级关联线索总数：{{currentNum}}</span>
            <span>下级关联线索总数：{{childNum}}</span>
          </div>
          <el-table :data="list" style="width: 100%; margin-top: 5px;">
            <el-table-column prop="BT" label="线索标题"></el-table-column>
            <el-table-column prop="SBDW" label="上报单位"></el-table-column>
            <el-table-column prop="TBDW" label="填报单位"></el-table-column>
            <el-table-column prop="time" label="上报时间"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="pageTotal > 0" layout="prev, pager, next" @current-change="pageChange"
                           :page-size="pageSize" :total="pageTotal" :current-page="page" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
      <el-dialog title="关联情报" :visible.sync="dialogVisible">
        <el-form :inline="true" :model="qbSearch">
          <el-form-item label="标题搜索">
            <el-input size="small" placeholder="输入标题搜索" clearable v-model="qbSearch.BT" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="qbListQuery(true)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="qbMappSave">上报</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="qbData" v-loading="qbLoading" @selection-change="qbSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="线索信息">
            <template slot-scope="scope">
              <div class="qbxs-bt">{{scope.row.BT}}</div>
              <div>{{scope.row.GJC}}</div>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" style="padding:5px 0 10px;">
          <el-pagination v-if="qbSearch.total > 0" layout="prev, pager, next" @current-change="qbPageChange"
                         :page-size="qbSearch.pageSize" :total="qbSearch.total" :current-page="qbSearch.pageNum"
                         style="float:right; padding-right: 0;">
          </el-pagination>
        </el-col>
        <div style="clear: both;"></div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import {
    getSessionDeptSelect
  } from '@/api/depts'
  import {
    getAssistTaskDepts
  } from '@/api/dept'
  import {
    getPageData, getCountNum, saveQbxsMapping
  } from '@/api/inegMapping'
  import {
    getIntellListPage
  } from '@/api/intellSystem'

  export default {
    name: 'InegMapping',
    props: ['deptIds', 'depts', 'state', 'ifSign'],
    data() {
      return {
        enableBtn: false,
        inegState: false,
        caseId: this.$route.params.id,
        qbSearch: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        dialogVisible: false,
        qbLoading: false,
        filterText: '',
        deptData: [],
        deptList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        qbData: [],
        selectedData: [],
        selectedNode: {},
        list: [],
        totalNum: 0,
        currentNum: 0,
        childNum: 0,
        pageSize: 10,
        page: 1,
        pageTotal: 0,
        listLoading: false,
        nodeId: '',
        deptName: '',
        selectedDept: '',
        multipleSelection: [],
        cusDept: {},
        cusUser: {},
        deptIdsStr: ''
      }
    },
    methods: {
      qbPageChange(val) {
        this.qbSearch.pageNum = val
        this.qbListQuery(false)
      },
      pageChange(val) {
        this.page = val
        this.queryList([this.nodeId])
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      getCurrentNode(value, data) {
        this.selectedNode = value
        this.listLoading = true
        this.nodeId = value.id
        this.deptName = value.name
        let arr = []
        if (value.children) {
          arr = this.getArray(value.children)
        } else {
          arr.push(value.id)
        }
        this.selectedDept = arr.toString()
        const all = arr
        all.push(this.nodeId)
        if (value.children && value.children !== null) {
          this.queryList(all)
          getCountNum({
            deptIds: all, caseId: this.caseId
          }).then((response) => {
            this.totalNum = response.data[0].num
            getCountNum({
              deptIds: [this.nodeId], caseId: this.caseId
            }).then((response) => {
              this.listLoading = false
              this.currentNum = response.data[0].num
              this.childNum = this.totalNum - this.currentNum
            })
          })
        } else {
          this.queryList([this.nodeId])
          getCountNum({
            deptIds: [this.nodeId], caseId: this.caseId
          }).then((response) => {
            this.totalNum = response.data[0].num
            this.currentNum = response.data[0].num
            this.childNum = 0
            this.listLoading = false
          })
        }
        if (this.deptIdsStr && this.deptIdsStr.indexOf('[' + this.cusDept.id + ']') > -1 && this.selectedNode.id === this.cusDept.id) {
          this.enableBtn = true
        } else {
          this.enableBtn = false
        }
      },
      queryList(arr) {
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          deptIds: arr,
          caseId: this.caseId,
          category: 2
        }
        getPageData(para).then((response) => {
          this.listLoading = false
          this.list = response.data.list
          this.pageTotal = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      getDepts() {
        this.deptData = getAssistTaskDepts(getSessionDeptSelect(), this.deptList)
      },
      getArray(data) {
        const arr = []
        for (const i in data) {
          arr.push(data[i].id)
          this.getArray(data[i].children)
        }
        return arr
      },
      openReport() {
        this.dialogVisible = true
        this.qbListQuery(true)
      },
      qbSelectionChange(val) {
        this.multipleSelection = val
      },
      qbListQuery(flag) {
        this.qbLoading = true
        this.qbSearch.pageNum = flag ? 1 : this.qbSearch.pageNum
        const para = {
          pageNum: this.qbSearch.pageNum,
          BT: this.qbSearch.BT
        }
        getIntellListPage(para).then((response) => {
          this.qbLoading = false
          this.qbData = response.data.list
          this.qbSearch.total = response.data.totalCount
        }).catch(() => {
          this.qbLoading = false
        })
      },
      qbMappSave() {
        const qbxsIds = []
        this.multipleSelection.forEach((item) => {
          if (item) {
            qbxsIds.push(item.id)
          }
        })
        if (qbxsIds.length === 0) {
          return false
        }
        const para = {
          deptId: this.cusDept.id,
          qbxsIds: qbxsIds,
          caseId: this.caseId,
          enable: 1,
          category: 2,
          createUserId: this.cusUser.id,
          createUserName: this.cusUser.realName,
          bizType: 4,
          action: '相关情报信息关联',
          bizId: this.caseId,
          userId: this.cusUser.id,
          userName: this.cusUser.realName
        }
        saveQbxsMapping(para).then((response) => {
          if (response.success === true) {
            this.$message({
              message: '保存成功', type: 'success'
            })
            this.dialogVisible = false
            this.getCurrentNode(this.selectedNode, '')
          }
        })
      }
    },
    mounted() {
      this.cusUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.cusDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    },
    watch: {
      deptIds(val) {
        this.deptIdsStr = val
      },
      depts(val) {
        this.deptList = val
        this.getDepts()
      },
      state(val) {
        if (val && val !== '') {
          if (Number(val) >= 5 && Number(val) < 7) {
            this.inegState = true
          }
        }
      }
    }
  }
</script>

<style scoped>
  .InegMapping .qbxs-bt {
    font-weight: bold;
    padding-bottom: 8px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .InegMapping .dept_name {
    font-weight: bold;
    font-size: 22px;
  }

  .InegMapping .dept_ineg_num span {
    padding: 5px 35px 5px 0;
  }

  .InegMapping .filter-tree {
    width: 550px;
  }
</style>
