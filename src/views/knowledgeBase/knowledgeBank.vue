<template>
  <div class="faqIndex">
    <el-row>
      <el-col :span="4" style="padding:5px 15px">
        <el-card>
          <div slot="header">
            <span>知识分类</span>
          </div>
          <div>
            <ul>
              <li class="menu" @click="">食品知识</li>
              <li class="menu" @click="">药品知识</li>
              <li class="menu" @click="">环境知识</li>
              <li class="menu" @click="">综合知识</li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="20" style="padding:5px 15px;">
        <el-card>
          <el-form :inline="true" :model="infoForm" size="small" label-position="left" label-width="82px">
            <el-form-item label="资料名称:" prop="knowledgeName" class="el-from">
              <el-input v-model="infoForm.knowledgeName" clearable maxlength="20" placeholder="请输入资料名称" class="el-from"></el-input>
            </el-form-item>
            <el-form-item label="教师名称:" prop="teacher" class="el-from">
              <el-input v-model="infoForm.teacher" clearable maxlength="20" placeholder="请输入教师名称" class="el-from"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click='query(true,true)'>查询</el-button>
              <el-button type="primary" @click="gotoKnowledgeAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top:10px;">
          <el-table :data="tableDataKnowledge"  v-loading="listLoading" :max-height="tableHeight">
            <el-table-column
              align="center"
              prop="index"
              label="序号">
            </el-table-column>
            <el-table-column
              align="center"
              prop="meansName"
              label="资料名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="author"
              label="作者名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="time"
              label="时长">
            </el-table-column>
            <el-table-column
              align="center"
              prop="createTime"
              label="出版日期">
            </el-table-column>
            <el-table-column
              align="center"
              prop="enabled"
              label="状态">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" align="center">
                <el-button type="primary" title="预览"  size="mini" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
                <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.$index, scope.row)"></el-button>
                <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
                <el-button title="审核" size="mini" type="primary" icon="el-icon-success" circle @click="handleExamine(scope.$index, scope.row)"></el-button>
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
      name: 'knowledgeBank', // 知识库管理
      computed: {
        show(enabled) {
          // console.log('1213131313313', enabled)
          this.enabled === '不可读'
        }
      },
      data() {
        return {
          newData: {
            index: '',
            meansName: '',
            author: '',
            time: '',
            createTime: '',
            enabled: ''
          },
          total: 0,
          page: 1,
          pageSize: 15,
          dialogAdd: false, // 添加应用弹出框
          listLoading: false,
          countHeight: document.documentElement.clientHeight - 240 + 'px',
          infoForm: {
            knowledgeName: '',
            teacher: ''
          },
          tableHeight: null,
          tableDataKnowledge: [{
            index: '1',
            meansName: '中华人民共和国食品安全法',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '不可读'
          }, {
            index: '2',
            meansName: '法律、法规和食品安全标准',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '3',
            meansName: '食品安全法及其实施条例的规定',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '4',
            meansName: '食品生产许可条例',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '5',
            meansName: '饮餐消费环节监督管理',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '6',
            meansName: '食品检验机构与检验人',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '7',
            meansName: '环境保护法',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '8',
            meansName: '资源环境保护法',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '9',
            meansName: '药物危害安全法律法规',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }, {
            index: '10',
            meansName: '吸食药物法律责任',
            author: '-',
            time: '20分钟',
            createTime: '2019-01-02',
            enabled: '可读'
          }]
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
            path: '/knowledgeBase/knowledgeDetial'
          })
        },
        handleUpdate(index, row) {
          this.$router.push({
            path: '/knowledgeBase/knowledgeUpdate'
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
        },
        gotoKnowledgeAdd() {
          this.$router.push({
            path: '/knowledgeBase/knowledgeAdd'
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
