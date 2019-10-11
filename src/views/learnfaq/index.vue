<template xmlns="http://www.w3.org/1999/html">
  <div class="intell-count body">
    <div style="width: 100%; height: auto; margin:0 0">
      <div class="event-nav">
        <el-menu :default-active="activeIndex" text-color="#bce8fc" active-text-color="#00a0e9" mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="1">环境</el-menu-item>
          <el-menu-item index="2">食品</el-menu-item>
          <el-menu-item index="3">药品</el-menu-item>
          <el-menu-item index="4">综合</el-menu-item>
          <el-menu-item index="5">在线帮助</el-menu-item>
          <div align="right" style="margin-top: 20px">
            <el-form :inline="true" :model="searchObj">
              <el-form-item>
                <el-input v-model="search" placeholder="请输入主题进行查询" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="keyQuery(false)">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-question" @click="toQuestion">提问</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-date" @click="myQuestion(false)">我的提问</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-menu>
      </div>
      <div ref="help" style="display: none">
        <el-card>
          <div class="list-header">
            <el-row type="flex" justify="space-between">
              <el-col :span="24" style="text-align: center">
                <span>平台使用资料下载</span>
              </el-col>
            </el-row>
          </div>
          <!--在线帮助 资料下载-->
          <el-row>
            <el-col :span="24" style="padding: 15px 10px 0 10px;">
              <div v-for="(item, index) in helpList" :key="index" style="display: inline-block">
                <div style="width: 200px;text-align: center;padding: 0 10px 0 0;">
                  <img style="width: 100px;cursor: pointer;" :src="item.src" @click="download(item.downloadUrl)" />
                  <div style="margin-top: 10px;">{{ item.describe }}</div>
                </div>
              </div>
            </el-col>
            <el-pagination layout="pager" @current-change="helpPageChange"
                            :page-size="helpPageSize" :total="helpTotal" :current-page="helpPage" style="float:right;">
            </el-pagination>
          </el-row>
        </el-card>
      </div>
      <el-card style="margin-top: 5px">
        <div class="event-x tj-event">
          <el-table :data="dataArray" style="width: 100%;" v-loading="detailLoading" class="question-table">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="quType" label="分类" min-width="30" :formatter="typeFormat"></el-table-column>
            <el-table-column prop="quTitle" label="主题" min-width="150">
              <template slot-scope="scope">
                <div class="model-container-span" @click="details(scope.row.id)">{{ scope.row.quTitle }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="creationName" label="提问者">
              <template slot-scope="scope">
                <p>{{scope.row.creationName}}</p>
                <p>{{scope.row.creationTime}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="answerNumber" label="回复/阅读">
              <template slot-scope="scope">
                <p>{{scope.row.answerNumber}}</p>
                <p>{{scope.row.viewNumber}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="lastAnswerUserName" label="最后回复">
              <template slot-scope="scope">
                <p>{{scope.row.lastAnswerUserName}}</p>
                <p>{{scope.row.lastAnswerTime}}</p>
              </template>
            </el-table-column>
            <el-table-column v-if="myflag" label="" width="100">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit-outline" @click="edit(scope.row)"></el-button>
                <el-button v-if="scope.row.answerNumber == 0" type="primary" icon="el-icon-delete" @click="dele(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                       :page-sizes="[10,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" v-if="paginationShow" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
  import {
    getQuestionPage, questionDelete
  } from '@/api/learnfaq'
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'analysis',
    data() {
      return {
        helpShowList: [],
        searchObj: {},
        helpPage: 1,
        search: '',
        helpTotal: 0,
        helpPageSize: 6,
        total: 0,
        page: 1,
        pageSize: 10,
        dataArray: [],
        detailLoading: false,
        activeIndex: '0',
        myflag: false,
        paginationShow: true,
        helpList: [
          {
            src: '/static/image/question_images/handbook.png',
            describe: '系统使用手册',
            downloadUrl: ''
          },
          {
            src: '/static/image/question_images/browser.png',
            describe: '浏览器',
            downloadUrl: ''
          },
          {
            src: '/static/image/question_images/certificate.png',
            describe: 'PKI数字证书',
            downloadUrl: ''
          },
          {
            src: '/static/image/question_images/specification.png',
            describe: '插件安装说明',
            downloadUrl: ''
          }
        ]
      }
    },
    methods: {
      // 主题关键字查询
      keyQuery(flag) {
        var type = this.activeIndex
        const a = JSON.parse(getUserInfo())
        const para = {
          quType: this.myflag !== true && type !== '0' && type !== '5' ? type : null,
          creationId: this.myflag === true ? a.id : null,
          quTitle: this.search,
          currentPage: flag === true ? this.page : 1,
          pageSize: 10
        }
        this.query(para)
      },
      // 资料页码改变事件 查询资料信息
      helpPageChange(currentPage) {
      },
      // 资料下载
      download(url) {
        window.open()
      },
      // 删除
      dele(row) {
        this.detailLoading = true
        const a = JSON.parse(getUserInfo())
        const para = {
          id: row.id,
          lastId: a.id,
          lastName: a.userName
        }
        this.$confirm('问题删除后将无法再找回，确定是否要删除？', '提示', {
          type: 'warning'
        }).then(() => {
          questionDelete(para).then((res) => {
            this.detailLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.init()
          })
        }).catch(() => {
          this.detailLoading = false
        })
      },
      // 编辑
      edit(row) {
        this.$router.push({
          path: '/micro/difficult/save/',
          query: {
            id: row.id,
            page: this.page,
            pageSize: this.pageSize,
            activeIndex: this.myflag === true ? null : this.activeIndex,
            myQuestion: this.myflag === true ? '1' : '0'
          }
        })
      },
      // 分类格式化
      typeFormat(row) {
        switch (row.quType) {
          case 1:
            return '环境'
          case 2:
            return '食品'
          case 3:
            return '药品'
          case 4:
            return '综合'
        }
      },
      // 查询列表
      query(para) {
        this.detailLoading = true
        this.paginationShow = false
        getQuestionPage(para).then((response) => {
          if (response.data) {
            this.detailLoading = false
            this.paginationShow = true
            this.dataArray = response.data.list
            this.pageSize = response.data.pageSize
            this.page = response.data.pageNum
            this.total = response.data.totalCount
          }
        }).catch(() => {
          this.detailLoading = false
          this.paginationShow = true
        })
      },
      // 详情
      details(id) {
        this.$router.push({
          path: '/micro/difficult/detail/' + id,
          query: {
            page: this.page,
            pageSize: this.pageSize,
            activeIndex: this.myflag === true ? null : this.activeIndex,
            myQuestion: this.myflag === true ? '1' : '0',
            quTitle: this.search
          }
        })
      },
      // 分页参数改变
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        const a = JSON.parse(getUserInfo())
        const para = {
          currentPage: this.page,
          pageSize: this.pageSize,
          quType: this.activeIndex !== '0' && this.myflag !== true ? this.activeIndex : null,
          creationId: this.myflag === true ? a.id : null,
          quTitle: this.search
        }
        this.query(para)
      },
      // 我的提问
      myQuestion(flag) {
        this.search = ''
        this.myflag = true
        this.$refs['help'].style.display = 'none'
        const a = JSON.parse(getUserInfo())
        const para = {
          creationId: a.id,
          currentPage: flag ? this.page : 1,
          pageSize: flag ? this.pageSize : 10
        }
        this.query(para)
      },
      // 当前页改变时会触发
      handleCurrentChange(currentPage) {
        this.page = currentPage
        const a = JSON.parse(getUserInfo())
        const para = {
          creationId: this.myflag === true ? a.id : null,
          currentPage: this.page,
          pageSize: this.pageSize,
          quTitle: this.search
        }
        this.query(para)
      },
      // 提问
      toQuestion() {
        this.$router.push({
          path: '/micro/difficult/save',
          query: {
            page: this.page,
            pageSize: this.pageSize,
            activeIndex: this.myflag === true ? null : this.activeIndex,
            myQuestion: this.myflag === true ? '1' : '0',
            quTitle: this.search
          }
        })
      },
      // 导航监听事件
      handleSelect(index, flag) {
        this.search = ''
        this.myflag = false
        var _this = this
        if (index === '5') {
          _this.$refs['help'].style.display = 'block'
          return
        } else {
          _this.$refs['help'].style.display = 'none'
        }
        this.activeIndex = index
        const para = {
          quType: index !== '0' ? index : '',
          currentPage: flag === 1 ? this.page : 1,
          pageSize: flag === 1 ? this.pageSize : 10
        }
        this.query(para)
      },
      // 初始化
      init() {
        var _this = this
        if (this.$route.query.page) {
          this.page = parseInt(this.$route.query.page)
        }
        if (this.$route.query.pageSize) {
          this.pageSize = parseInt(this.$route.query.pageSize)
        }
        if (this.$route.query.quTitle) {
          this.search = this.$route.query.quTitle
          this.keyQuery(true)
        } else if (this.$route.query.activeIndex) {
          this.activeIndex = this.$route.query.activeIndex
          _this.handleSelect(this.activeIndex, 1)
        } else if (this.$route.query.myQuestion === '1') {
          this.myQuestion(true)
        } else {
          _this.handleSelect('0')
        }
      }
    },
    mounted: function() {
      this.init()
    }
  }
</script>

<style scoped>
  @import "./css/index.css";
</style>
