<template>
  <section class="alzyList">
    <!--工具条-->
    <div style="text-align: center;">
      <el-form :inline="true" :model="filters" >
        <el-col :span="24">
          <div class="tabsDiv">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name=""></el-tab-pane>
                <el-tab-pane label="环境" name="3"></el-tab-pane>
                <el-tab-pane label="食品" name="1"></el-tab-pane>
                <el-tab-pane label="药品" name="2"></el-tab-pane>
                <el-tab-pane label="综合" name="4"></el-tab-pane>
              </el-tabs>
          </div>
        </el-col>
        <el-col :span="24" style="padding: 10px 0px;">
          <div>
            <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button label="案例" name="1"></el-checkbox-button>
              <el-checkbox-button label="判例" name="2"></el-checkbox-button>
              <el-checkbox-button label="办案指引" name="3"></el-checkbox-button>
              <el-checkbox-button label="技战法" name="4"></el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="24" style="padding-bottom: 0;">
          <el-form-item style="width: 43%; margin-left: 1px; padding-left: 9px;">
            <el-input size="large" placeholder="在法规中搜索" v-model="filters.search">
              <el-button slot="append" v-if="$isViewBtn('129301')" v-on:click="query(true,true)" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 30px;background-color: #1e98d2;"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$isViewBtn('129302')" @click="add" style="padding: 12px 35px;">添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <el-col :span="24" v-loading="loading">
      <el-card class="box-card" >
        <div slot="header">
          <span>为您检索到：{{ total }} &nbsp;条相关记录</span>
        </div>
        <div style="overflow:auto;"   :style="{maxHeight:tableHeight}">
          <div v-for="item in dataList" :key="item.value" class="lineStyle" @click='detail(item.id)'>
            <el-col :title="item.title" :span="20" style="word-break: keep-all; text-overflow: ellipsis; font-size: 16px; font-weight: bold; cursor: pointer;">{{ item.title }} &nbsp;&nbsp;&nbsp;&nbsp;
              <el-tag v-if="item.articleType === 1" type="success">食品</el-tag>
              <el-tag v-if="item.articleType === 2" type="success">药品</el-tag>
              <el-tag v-if="item.articleType === 3" type="success">环境</el-tag>
              <el-tag v-if="item.articleType === 4" type="success">综合</el-tag>
            </el-col>
            <el-col :title="$parseTime(item.publishTime, '{y}-{m}-{d}')" :span="4" style="word-break: keep-all; text-overflow: ellipsis; color: #c7c7c7; overflow: hidden; white-space: nowrap;">发布日期：{{ $parseTime(item.publishTime, '{y}-{m}-{d}') }}</el-col>
            <!--<el-col :span="20" style="color: #c7c7c7; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">摘要：{{ item.abstract ? item.abstract : '无' }}</el-col>-->
          </div>
        </div>
      </el-card>
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
  </section>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        type: '',
        search: '',
        category: '1'
      },
      checkboxGroup1: [],
      loading: false,
      total: 0,
      page: 1,
      pageSize: 15,
      dataList: [],
      isActive: 0,
      activeName: '0',
      activeCategory: '',
      tableHeight: null,
      categoryOptions: [
        { name: '案例', key: '1' },
        { name: '判例', key: '2' },
        { name: '办案指引', key: '3' },
        { name: '技战法', key: '4' }
      ]
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(true, true)
    },
    query(flag, hand) {
      this.loading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        search: this.filters.search,
        pageSize: this.pageSize
      }
      if (this.checkboxGroup1.length > 0) {
        let a = ''
        this.checkboxGroup1.forEach(item => {
          this.categoryOptions.forEach(item1 => {
            if (item1.name === item) {
              a += item1.key + ','
            }
          })
        })
        para.category = a.substring(0, a.length - 1)
      }
      if (this.activeName !== '0') {
        para.articleType = this.activeName
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$update('caseinfo/query', para).then((response) => {
        this.loading = false
        this.dataList = response.data.list
        this.total = response.data.totalCount
        this.page = response.data.pageNum
        this.pageSize = response.data.pageSize
      }).catch(() => {
        this.loading = false
      })
    },
    handleClick(tab, event) {
      this.checkboxGroup1 = []
      if (tab.name === '9') {
        this.more()
      }
      this.query(true)
    },
    detail(id) {
      if (this.$isViewBtn('129303')) {
        this.$gotoid('/handlingGuide/alzy/detail', JSON.stringify({ id: id }))
      }
    },
    add() {
      const para = {
        filters: this.filters,
        checkboxGroup1: this.checkboxGroup1,
        activeName: this.activeName
      }
      this.$gotoid('/handlingGuide/alzy/add', JSON.stringify(para))
    }
  },
  mounted() {
    if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
      const para = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.filters = para.filters
      this.checkboxGroup1 = para.checkboxGroup1
      this.activeName = para.activeName
      sessionStorage.setItem(this.$route.path, '')
    }
    this.tableHeight = document.documentElement.clientHeight - 429 + 'px'
    this.query(true)
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - 429 + 'px'
  }

}
</script>

<style>
.alzyList .el-card__body {
  padding: 10px 1px;
}
.alzyList .box-card {
  height: auto;
}
.alzyList .lineStyle {
  padding: 3px 50px 5px;
  border-bottom: 1px dotted #1d659b;
  display: inline-block;
  width: 100%;
  cursor: pointer;
}
.alzyList .lineStyle:last-child{
  border-bottom: 0;
}
.alzyList .lineStyle .el-col {
  padding: 5px;
}
.alzyList .el-input-group__append {
  background: #0082e6;
  border: none;
}
.alzyList .el-form-item__content {
  width: 100%;
}
.alzyList .tabsDiv {
  width: 50%;
  height: auto;
  margin: 0 auto;
  position: relative;
}
.alzyList .tabsDiv .el-tabs {
  width: 100%;
  /* margin: 0 auto; */
  padding: 0 10px;
}
</style>
