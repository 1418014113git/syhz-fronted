<template>
  <div class="guide">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.keyword" placeholder="请输入关键词" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="filters.caseType" placeholder="请选择" clearable>
              <el-option label="食品" value="0"></el-option>
              <el-option label="药品" value="1"></el-option>
              <el-option label="环境" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地域">
            <el-select v-model="filters.caseArea" placeholder="请选择" clearable>
              <el-option label="区内" value="0"></el-option>
              <el-option label="区外" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="getList(source,true)" v-if="$isViewBtn('108001')">查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="add" v-if="$isViewBtn('108002')">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="alzy_tabs">
      <el-tab-pane label="公安内部" name="0"></el-tab-pane>
      <el-tab-pane label="最高法院" name="1"></el-tab-pane>
      <el-tab-pane label="最高检察院" name="2"></el-tab-pane>
      <el-tab-pane label="其他" name="3"></el-tab-pane>
    </el-tabs>
    <div v-loading="loading">
      <el-card shadow="never">
        <div style="overflow:auto;" :style="{maxHeight:tableHeight}">
          <ul v-if="alzydata && alzydata.length > 0">
            <li v-for="(alzy,index) in alzydata" @click='detail(alzy.id)' class="content-li" :key="index">
              <p class="title">{{ alzy.title }}</p>
              <div class="handle">
                第{{ alzy.case_num}}号
                <el-tag v-if="alzy.case_type">{{getCaseTypeText(alzy.case_type)}}</el-tag>
                <div class="clearfix" v-if="source === '0'">
                  <el-button type="danger" icon="el-icon-delete" @click.stop="onDelete(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108008')"></el-button>
                  <el-button type="primary" icon="el-icon-edit" @click.stop="toEdit(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108007')"></el-button>
                </div>
                <div class="clearfix" v-if="source === '1'">
                  <el-button type="danger" icon="el-icon-delete" @click.stop="onDelete(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108004')"></el-button>
                  <el-button type="primary" icon="el-icon-edit" @click.stop="toEdit(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108003')"></el-button>
                </div>
                <div class="clearfix" v-if="source === '2'">
                  <el-button type="danger" icon="el-icon-delete" @click.stop="onDelete(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108006')"></el-button>
                  <el-button type="primary" icon="el-icon-edit" @click.stop="toEdit(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108005')"></el-button>
                </div>
                <div class="clearfix" v-if="source === '3'">
                  <el-button type="danger" icon="el-icon-delete" @click.stop="onDelete(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108010')"></el-button>
                  <el-button type="primary" icon="el-icon-edit" @click.stop="toEdit(alzy.id)"
                            class="btn-float-right btn-mg-lf" v-if="$isViewBtn('108009')"></el-button>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="!alzydata||alzydata.length === 0" style="text-align: center">
            暂无数据
          </div>
        </div>
        <div v-if="alzydata && alzydata.length > 0" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                         :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getCaseGuidePage, delCaseGuide
} from '@/api/handingGuide'

export default {
  data() {
    return {
      alzydata: [],
      filters: {
        keyword: '',
        caseType: '',
        caseArea: ''
      },
      loading: false,
      total: 0,
      page: 1,
      pageSize: 15,
      source: '0', // 资源标签
      activeName: '0', // 当前选中的某一项
      tableHeight: null
    }
  },
  methods: {
    getCaseTypeText(type) {
      if (type === '0') {
        return '食品'
      } else if (type === '1') {
        return '药品'
      } else if (type === '2') {
        return '环境'
      }
    },
    handleClick(tab, event) {
      this.source = tab.index
      this.getList(this.source, true)
    },
    handleChange(val) {
      this.page = val
      this.getList(this.source, false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getList(this.source, false)
    },
    resetSearch() {
      this.filters = {
        keyword: '', caseType: '', caseArea: ''
      }
      this.getList(this.source, true)
    },
    getList(source, flag) {
      this.loading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        source: source,
        keywords: this.filters.keyword,
        caseType: this.filters.caseType,
        caseArea: this.filters.caseArea
      }
      getCaseGuidePage(para).then((res) => {
        this.alzydata = res.data.list
        this.loading = false
        this.total = res.data.totalCount
        this.page = res.data.pageNum
        this.pageSize = res.data.pageSize
      }).catch(() => {
        this.loading = false
      })
    },
    detail(id) {
      this.$router.push({
        path: '/handlingGuide/case/detail', query: {
          id: id
        }
      })
    },
    add() {
      this.$router.push({
        path: '/handlingGuide/case/save'
      })
    },
    onDelete(id) {
      this.loading = true
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          id: id
        }
        delCaseGuide(para).then((res) => {
          this.loading = false
          this.getList(this.source, false)
        })
      }).catch(() => {
        this.loading = false
      })
    },
    toEdit(id) {
      this.$router.push({
        path: '/handlingGuide/case/save', query: {
          id: id
        }
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 300 + 'px'
    if (this.$route.query.source) { // 详情页返回到列表
      var index = this.$route.query.source
      this.getList(index, true)
      this.activeName = index
    } else {
      this.getList(this.source, true)
    }
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 300 + 'px'
  }
}
</script>

<style>
.guide .content-li {
  list-style: none;
  border-bottom: 1px dashed #ccc;
  padding: 10px;
  cursor: pointer;
}

.guide .content-li:hover {
  background-color: rgba(188, 232, 252, 0.1);
}

.guide .title {
  font-weight: bold;
  font-size: 16px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.guide .handle {
  padding-top: 8px;
  overflow: hidden;
}

.guide .el-card__body {
  min-height: 260px;
}

.guide .toolbar {
  height: 33px;
  line-height: 33px;
  margin: 15px 5px 0px;
}

.guide .btn-float-right {
  float: right;
}

.guide .btn-mg-lf {
  margin-left: 5px;
}

.guide .el-tag {
  margin-left: 10px;
}

.guide .el-tabs {
  margin-top: 20px;
}

.guide .clearfix::after {
  clear: both;
  content: "";
  display: block;
}
.alzy_tabs {
  padding: 0 10px;
}
</style>
