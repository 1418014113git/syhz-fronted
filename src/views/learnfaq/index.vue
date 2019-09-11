<template>
  <div class="faqIndex">
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-row>
          <el-col :span="7" style="padding:5px 15px">
            <el-card>
              <div slot="header">
                <span>问题分类</span>
              </div>
              <div>
                <ul>
                  <li class="menu" @click="toSearch(1)" :class="active === '1'?'activeSpan':''">食品安全</li>
                  <li class="menu" @click="toSearch(2)" :class="active === '2'?'activeSpan':''">药品安全</li>
                  <li class="menu" @click="toSearch(3)" :class="active === '3'?'activeSpan':''">环境相关</li>
                  <li class="menu" @click="toSearch(4)" :class="active === '4'?'activeSpan':''">食药相关</li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="17" style="padding:5px 15px;" v-loading="listLoading">
            <el-card>
              <el-row>
                <el-col :span="3">
                  <el-button icon="el-icon-question" type="primary" @click="toQuestion" v-if="$isViewBtn('109001')">提问</el-button>
                </el-col>
                <el-col :span="16">
                  <el-input placeholder="请输入内容" suffix-icon="el-icon-search"
                            v-model="searchText" clearable
                            style="width:300px;">
                  </el-input>
                  <el-button type="primary" @click="query(true,true)" v-if="$isViewBtn('109002')">搜索</el-button>
                </el-col>
              </el-row>
            </el-card>
            <div style="overflow:auto;" :style="{maxHeight:countHeight}">
              <el-card v-for="item in listData" :key="item.id" class="item">
                <el-row>
                  <el-col class="title">
                    <el-button type="text" @click="toDetail(item.id)" :title="item.title" class="ellipsis-word" style="text-align: left">
                      {{item.title}}
                    </el-button>
                  </el-col>
                  <!--<el-col class="content">都市标题美美的标题</el-col>-->
                  <el-col class="bm">
                    <span><i class="el-icon-view i-icon"></i>{{item.browse_num?item.browse_num:0}}</span>
                    <span>{{item.num}}条回答</span>
                    <span>时间：{{formatTime(item.create_time)}}</span>
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
    getLearningPage
  } from '@/api/learnfaq'
  import {
    parseTime
  } from '@/utils/index'

  export default {
    name: 'faqIndex',
    components: {},
    data() {
      return {
        countHeight: document.documentElement.clientHeight - 240 + 'px',
        active: '1',
        search: {
          category: '',
          pageSize: 15,
          pageNum: 1
        },
        total: 0,
        searchText: '',
        listData: [],
        listLoading: false,
        input21: '',
        value: ''
      }
    },
    methods: {
      formatTime(time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}')
      },
      handleCurrentChange(val) {
        this.search.pageNum = val
        this.query(false, true)
      },
      handleSizeChange(val) {
        this.search.pageNum = 1
        this.search.pageSize = val
        this.query(true, true)
      },
      toSearch(val) {
        this.active = val + ''
        this.search.category = val
        this.search.pageNum = 1
        this.search.pageSize = 15
        this.query(true, true)
      },
      query(flag, hand) {
        if (this.searchText) {
          this.search.title = this.searchText
          this.search.subject = this.searchText
        } else {
          this.search.title = ''
          this.search.subject = ''
        }
        this.search.pageNum = flag ? 1 : this.search.pageNum
        if (hand) { // 手动点击时，添加埋点参数
          this.search.logFlag = 1
        }
        getLearningPage(this.search).then((response) => {
          if (response.data) {
            this.listLoading = false
            this.total = response.data.totalCount
            this.search.pageSize = response.data.pageSize
            // this.search.pageNum = response.data.pageNum
            this.listData = response.data.list
          }
        })
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
      }
    },
    mounted() {
      this.query(true)
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
