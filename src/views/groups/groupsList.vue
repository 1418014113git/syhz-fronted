<template>
  <section class="examNotice">



    <el-form :inline="true" :model="filterQuery" size="small"  label-width="76px">
        <el-row>
          <el-col style="text-align:center">
          <el-form-item>
            <el-input size="large" placeholder="请输入关键字进行检索" v-model="filterQuery.keywords" style="width:700px;margin:0 auto;" @keydown.enter.native="searchFun">
              <el-button slot="append"  v-on:click="queryGroup(true)" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 30px;background-color: #1e98d2;"></el-button>
            </el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align:right">
          <el-form-item>
              <el-button  id ="addbtn" type="primary" @click="toAdd"   >添加组</el-button>
          </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="groupName" label="组名" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemCount" label="组成员" min-width="150"  ></el-table-column>
      <el-table-column prop="createTime" label="建组时间" min-width="150">
           <template slot-scope="scope"  format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss">
          {{scope.row.createTime}}
        </template>

      </el-table-column>

      <el-table-column prop="desc" label="说明" min-width="200">

      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" min-width="100">
        <template slot-scope="scope">
            <span v-if="scope.row.status==0" >停用</span>
            <span v-if="scope.row.status==1" >启用</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            title="详情"
            size="mini"
            icon="el-icon-document"
            circle
            plain
            @click="handleDetail(scope.row)"
          ></el-button>
          <el-button type="primary" title="修改" size="mini" icon="el-icon-edit" circle v-on:click="toNoticeEdit(scope.row)"></el-button>

            <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  @click="handleDel(scope.$index,scope.row)"></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination
        v-if="total > 0"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15,30,50,100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :total="total"
        :current-page="page"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>
<script>

export default {
  data() {
    return {
      loading: false, // 列表loading

      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息

      filterQuery: {
        keywords: ''
      },
      listData: [],
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null
    }
  },

  methods: {
    searchFun(e) {
      var keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.page = 1
        this.queryGroup()
      }
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryGroup(false, true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryGroup(false, true)
    },
    changeKeyWords(val) {
      this.queryGroup(true, true)
    },

    queryGroup(flag, hand) {
      this.loading = true
      this.page = flag ? 1 : this.page
      var param = {
        keywords: this.filterQuery.keywords,
        pageNum: this.page,
        pageSize: this.pageSize,
        creatorId: this.userInfo.id,
        deptCode: this.deptInfo.depCode
      }
      if (hand) {
        param.logFlag = 1 // 是否写日志
      }
      this.$query('group/groupinfopage', param).then(response => {
        this.loading = false
        // 去除HTML标签

        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.page = response.data.pageNum
        this.total = response.data.totalCount
      }).catch(() => {
        this.loading = false
      })
    },
    clearForm() {
      this.filterQuery.keywords = ''
      this.queryGroup(true, true)
    },
    toAdd() {
      // 添加
      this.$gotoid('/groups/groupsSave')
    },
    toNoticeEdit(row) {
      // 修改
      this.$gotoid('/groups/groupsEdit', row.groupId)
    },
    handleDetail(row) {
      this.$gotoid('/groups/groupsDetail', row.groupId)
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          groupId: row.groupId,
          delFlag: 1
        }
        this.$query('group/delgroup', para).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.queryGroup()
        })
      }).catch(() => {
      })
    },
    // 修改状态
    handleDeleGroup(row) {
      // var status
      // if (row.status === 1) {
      //   status = '0'
      // } else if (row.status === 0) {
      //   status = '1'
      // }
      // this.$update('sysnotice/' + row.id, {
      //   status: status,
      //   logFlag: 1 // 是否写日志
      // }).then(res => {
      //   this.btnLoading = false
      //   if (res.code === '000000') {
      //     this.$message({ message: '状态修改成功', type: 'success' })
      //     this.querySysNotice(true)
      //   }
      // }).catch(() => {
      //   this.btnLoading = false
      // })
    }
  },
  components: {},

  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.queryGroup(true)
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.examNoticeContainer .el-dialog__body {
  padding: 30px 20px 30px 10px;
}
.name {
  top: 412px;
  left: 265px;
}

.comment_inner {
  width: 200px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 3; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
#noticecontentdiv {
  font-size: 14px;
}
#addbtn {
  float: right;
}
.noticeellipsis-words {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
