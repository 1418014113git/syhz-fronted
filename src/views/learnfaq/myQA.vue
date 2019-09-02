<template>
  <div class="myqa">
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-row>
          <el-col :span="7" style="padding:5px 5px">
            <el-card>
              <div slot="header">
                <span>问题分类</span>
              </div>
              <div>
                <ul>
                  <li class="menu" @click="toSearch(1)">食品安全</li>
                  <li class="menu" @click="toSearch(2)">药品安全</li>
                  <li class="menu" @click="toSearch(3)">环境相关</li>
                  <li class="menu" @click="toSearch(4)">食药相关</li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="17" style="padding:5px 5px" v-loading="listLoading">
            <el-card>
              <el-row>
                <el-col :span="3">
                  <el-button icon="el-icon-question" type="primary" @click="toQuestion">提问</el-button>
                </el-col>
                <el-col :span="18">
                  <el-select v-model="search.type" placeholder="请选择" style="width:130px" @change="changeType">
                    <el-option label="我的提问" value="1"></el-option>
                    <el-option label="我的回答" value="2"></el-option>
                  </el-select>
                  <el-input placeholder="请输入内容" suffix-icon="el-icon-search"
                            v-model="searchText"
                            style="width:200px;background-color: #f6f6f6">
                  </el-input>
                  <el-button type="primary" @click="query(true)">搜索</el-button>
                </el-col>
              </el-row>
            </el-card>
             <div style="overflow:auto;" :style="{maxHeight:countHeight}">
                <el-card v-if="search.type==='1'" v-for="item in listData" :key="item.id" class="item">
                  <el-row>
                    <el-col class="title">
                      <el-button type="text" @click="toDetail(item.id)">{{item.title}}</el-button>
                    </el-col>
                    <!--<el-col class="content">都市标题美美的标题</el-col>-->
                    <el-col class="bm">
                      <span><i class="el-icon-view i-icon"></i>{{item.browse_num?item.browse_num:0}}</span>
                      <span>{{item.num}}条回答</span>
                      <span>时间：{{formatTime(item.create_time)}}</span>
                    </el-col>
                  </el-row>
              </el-card>
              <el-card v-if="search.type==='2'" v-for="item in listData" :key="item.aid" class="item">
                <el-row>
                  <el-col class="title">
                    <el-button type="text" @click="toDetail(item.id)">{{item.title}}</el-button>
                  </el-col>
                  <el-col class="content">{{item.answer}}</el-col>
                  <el-col class="bm">
                    <span><i class="el-icon-view i-icon"></i>{{item.browse_num?item.browse_num:0}}</span>
                    <span>时间：{{formatTime(item.atime)}}</span>
                  </el-col>
                </el-row>
              </el-card>
              <el-card v-if="!listData||listData.length===0" style="text-align: center; line-height: 60px; height: 100px;"
                      class="item">
                暂无数据
              </el-card>
            </div>
            <el-pagination v-if="total>0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                           :page-size="search.pageSize" :total="total" :current-page="search.pageNum" style="float:right;">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getLearningPage, getMineAnswerPage
  } from '@/api/learnfaq'
  import {
    parseTime
  } from '@/utils/index'

  export default {
    name: 'myqa',
    components: {},
    data() {
      return {
        currentUser: {},
        currentDep: {},
        search: {
          type: '1',
          category: '',
          pageSize: 15,
          pageNum: 1
        },
        total: 0,
        searchText: '',
        listData: [],
        listLoading: false,
        input21: '',
        value: '',
        countHeight: document.documentElement.clientHeight - 240 + 'px'
      }
    },
    methods: {
      formatTime(time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}')
      },
      handleCurrentChange(val) {
        this.search.pageNum = val
        this.query(false)
      },
      handleSizeChange(val) {
        this.search.pageNum = 1
        this.search.pageSize = val
        this.query(false)
      },
      toSearch(val) {
        this.search.category = val
        this.query(true)
      },
      query(flag) {
        if (this.searchText) {
          this.search.title = this.searchText
          this.search.subject = this.searchText
        }
        this.search.pageNum = flag ? 1 : this.search.pageNum
        if (this.search.type === '1') {
          getLearningPage(this.search).then((response) => {
            if (response.data) {
              this.listLoading = false
              this.total = response.data.totalCount
              this.search.pageSize = response.data.pageSize
              this.search.pageNum = response.data.pageNum
              this.listData = response.data.list
            }
          }).catch(() => {
            this.listLoading = false
          })
        } else if (this.search.type === '2') {
          getMineAnswerPage(this.search).then((response) => {
            if (response.data) {
              this.listLoading = false
              this.total = response.data.totalCount
              this.search.pageSize = response.data.pageSize
              this.search.pageNum = response.data.pageNum
              this.listData = response.data.list
            }
          }).catch(() => {
            this.listLoading = false
          })
        }
      },
      toQuestion() {
        this.$router.push({
          path: '/learn/save'
        })
      },
      toDetail(id) {
        this.$router.push({
          path: '/learn/detail/' + id
        })
      },
      changeType(val) {
        this.listData = []
        this.query(true)
      }
    },
    mounted() {
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.currentUser) {
        this.search.userId = curUser.id
      }
      this.query(true)
    }
  }
</script>

<style scoped>
.myqa .item {
	margin-top: 10px;
}

/* .myqa .el-card__header {
    color: #1b75ba;
    background: #f6f9fc;
    border-bottom: 1px solid #3bc0fc;
  } */

.myqa .is-always-shadow {
	-webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.myqa .el-card {
	border-radius: 2px;
}

.myqa .title {
	cursor: pointer;
	padding-bottom: 10px;
}

.myqa .title button {
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
	font-size: 16px;
	color: #1a1a1a;
	padding: 0;
}
.myqa .title button:hover {
	color: #1b75ba;
}

.myqa .content {
	color: #646464;
}

.myqa .bm {
	margin-top: 10px;
	font-size: 12px;
	color: #77839c;
}

.myqa .bm span {
	display: inline-block;
	margin-right: 15px;
}

.myqa .i-icon {
	margin-right: 5px;
}

.myqa .menu {
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
	font-size: 14px;
	/* color: #646464; */
	padding: 10px;
	cursor: pointer;
}

.myqa .menu:hover {
  /* background-color: rgb(233, 245, 251); */
  color: #00a0e9;
  background-color: #01355d;
}
</style>
