<template>
  <div class="faqIndex">
    <el-row>
      <el-col :span="4" style="padding:5px 15px">
        <el-card>
          <div slot="header">
            <span>积分规则分类</span>
          </div>
          <div>
            <ul>
              <li class="menu" @click="">浏览知识</li>
              <li class="menu" @click="">学习知识</li>
              <li class="menu" @click="">点赞知识</li>
              <li class="menu" @click="">分享知识</li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="20" style="padding:5px 15px;">
        <el-card>
          <el-form :inline="true" :model="infoForm" size="small" label-position="left" label-width="82px">
            <el-form-item label="规则名称:" prop="knowledgeName" class="el-from">
              <el-input v-model="infoForm.knowledgeName" clearable maxlength="20" placeholder="请输入资料名称" class="el-from"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query(true,true)">查询</el-button>
              <el-button type="primary" @click="gotoKnowledgeAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top:10px;">
          <el-table :data="tableDataNum"  v-loading="listLoading" :max-height="tableHeight">
            <el-table-column
              align="center"
              prop="index"
              label="序号"
              width="100"
              >
            </el-table-column>
            <el-table-column
              align="center"
              prop="integralName"
              label="积分规则">
            </el-table-column>
            <el-table-column
              align="center"
              prop="author"
              label="创建人">
            </el-table-column>
            <el-table-column
              align="center"
              prop="num"
              label="每次积分">
            </el-table-column>
            <el-table-column
              align="center"
              prop="dayNum"
              label="每日上限">
            </el-table-column>
            <el-table-column
              align="center"
              prop="mouthNum"
              label="每月上限">
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope" align="center">
                <el-button type="primary" title="详情"  size="mini" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
                <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.$index, scope.row)"></el-button>
                <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
          <el-col :span="24" class="toolbar">
            <el-pagination  layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                          :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
            </el-pagination>
          </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'userIntegral', // 知识库管理
    computed: {
      show(enabled) {
        // console.log('1213131313313', enabled)
        this.enabled === '不可读'
      }
    },
    data() {
      return {
        dialogAdd: false, // 添加应用弹出框
        listLoading: false,
        infoForm: {
          knowledgeName: '',
          teacher: ''
        },
        tableHeight: null,
        tableDataNum: [{
          index: '1',
          integralName: '学习超过30分钟',
          author: '-',
          num: '+1',
          dayNum: '5',
          mouthNum: '100'
        }, {
          index: '2',
          integralName: '整个任务全部完成',
          author: '-',
          num: '+5',
          dayNum: '25',
          mouthNum: '500'
        }, {
          index: '3',
          integralName: '学习不超过20分钟',
          author: '-',
          num: '-5',
          dayNum: '无上限',
          mouthNum: '无上限'
        }, {
          index: '5',
          integralName: '完成部分学习任务',
          author: '-',
          num: '+1',
          dayNum: '4',
          mouthNum: '50'
        }, {
          index: '6',
          integralName: '学习不超过30分钟',
          author: '-',
          num: '-7',
          dayNum: '-35',
          mouthNum: '无上限'
        }, {
          index: '6',
          integralName: '未完成当天学习任务',
          author: '-',
          num: '-2',
          dayNum: '-10',
          mouthNum: '无上限'
        }
        ]
      }
    },
    methods: {
      query(flag, hand) {
        // this.listLoading = true
        // var param = {
        //   pageSize: this.pageSize,
        //   pageNum: flag ? 1 : this.page
        // }
        // if (hand) { // 手动点击时，添加埋点参数
        //   param.logFlag = 1
        // }
        // this.$query('', param).then((response) => {
        //   this.listLoading = false
        //   if (response.data && response.data.list && response.data.list.length > 0) {
        //     this.tableDataKnowledge = response.data.list
        //     this.page = response.data.totalCount
        //     this.pageSize = response.data.pageSize
        //   }
        // }).catch(() => {
        //   this.listLoading = false
        // })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query(false, true)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(true, true)
      },
      handleExamine() {
        this.$confirm('确认通过?', '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '驳回',
          type: 'warning'
        }).then(() => {
          // logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
          this.$message({
            type: 'success',
            message: '审核通过'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '已经驳回'
          })
        })
      },
      handleDetail() {
        this.$router.push({
          path: '/knowledgeBase/userIntegralUpdate'
        })
      },
      gotoKnowledgeAdd() {
        this.$router.push({
          path: '/knowledgeBase/userIntegralAdd'
        })
      },
      handleUpdate() {
        this.$router.push({
          path: '/knowledgeBase/userIntegralUpdate'
        })
      },
      handleDelete() {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 280
    }
  }
</script>

<style scoped>
  .faqIndex .item {
    margin-top: 10px;
  }
  .faqIndex .is-always-shadow {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .faqIndex .title {
    cursor: pointer;
    padding-bottom: 10px;
  }

  .faqIndex .title button {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 16px;
    color: #f7f0f0;
    padding: 0;
  }

  .faqIndex .title button:hover {
    color: #1b75ba;
  }

  .faqIndex .content {
    color: #646464;
  }

  .faqIndex .bm {
    margin-top: 10px;
    font-size: 12px;
    color: #00a0e9;
  }

  .faqIndex .bm span {
    display: inline-block;
    margin-right: 15px;
  }

  .faqIndex .i-icon {
    margin-right: 5px;
  }

  .faqIndex .menu {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
  }

  .faqIndex .activeSpan {
    background-color: rgba(0, 160, 233, 0.6);
  }
  .faqIndex .menu:hover {
    background-color: rgba(188, 232, 252, 0.1);
  }
</style>

