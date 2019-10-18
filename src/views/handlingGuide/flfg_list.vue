<template>
  <section class="flfgList">
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
              <el-checkbox-button label="法律" name="1"></el-checkbox-button>
              <el-checkbox-button label="行政法规" name="2"></el-checkbox-button>
              <el-checkbox-button label="地方性行政法规" name="201"></el-checkbox-button>
              <el-checkbox-button label="部门规章" name="202"></el-checkbox-button>
              <el-checkbox-button label="司法解释" name="3"></el-checkbox-button>
              <el-checkbox-button label="其他规范性文件" name="4"></el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="24" style="padding-bottom: 0;">
          <el-form-item style="width: 43%; margin-left: 1px; padding-left: 9px;">
            <el-input size="large" placeholder="在法规中搜索" v-model="filters.search">
              <el-button slot="append" v-if="$isViewBtn('129001')" v-on:click="query(true,true)" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 30px;background-color: #1e98d2;"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$isViewBtn('129002')" @click="add" style="padding: 12px 35px;">添加</el-button>
          </el-form-item>
        </el-col>
        <!--<el-col :span="24" style="padding-bottom: 0;">-->
          <!--<el-form-item>-->
            <!--<el-radio v-model="filters.category" label="1">按标题检索</el-radio>-->
            <!--<el-radio v-model="filters.category" label="2">按正文检索</el-radio>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="24" style="padding-bottom: 0;">-->
          <!--<el-form-item style="margin-left: 42%">-->
            <!--<el-button type="primary" v-if="$isViewBtn('118002')" @click="add" style="padding: 10px 35px;">添加</el-button>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-form>
    </div>
    <el-col :span="24" v-loading="loading">
      <el-card class="box-card" >
        <div slot="header">
          <span>为您检索到：{{ total }} &nbsp;条相关记录</span>
        </div>
        <div style="overflow:auto;"   :style="{maxHeight:tableHeight}">
          <div v-for="item in dataList" :key="item.value" class="lineStyle" @click='detail(item.id)'>
            <el-col :title="item.title" :span="14" style="word-break: keep-all; text-overflow: ellipsis; font-size: 16px; font-weight: bold; cursor: pointer;">{{ item.title }}</el-col>
            <el-col :title="item.publishOrgName" :span="7" style="word-break: keep-all; text-overflow: ellipsis; color: #c7c7c7; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">颁布机关：{{ item.publishOrgName }}</el-col>
            <el-col :span="3" style="color: #c7c7c7;">施行日期：{{ $parseTime(item.effectiveTime, '{y}-{m}-{d}') }}</el-col>
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
        { name: '法律', key: '1' },
        { name: '行政法规', key: '2' },
        { name: '地方性行政法规', key: '201' },
        { name: '部门规章', key: '202' },
        { name: '司法解释', key: '3' },
        { name: '其他规范性文件', key: '4' }
      ]
    }
  },
  methods: {
    more() {
      window.open('http://10.93.9.163:1011/law/home/begin1.cbs')
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
      this.$update('lawInfo/query', para).then((response) => {
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
      if (this.$isViewBtn('129002')) {
        this.$gotoid('/handlingGuide/flfg/detail', JSON.stringify({ id: id }))
      }
    },
    add() {
      const para = {
        filters: this.filters,
        checkboxGroup1: this.checkboxGroup1,
        activeName: this.activeName
      }
      this.$gotoid('/handlingGuide/flfg/add', JSON.stringify(para))
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
    this.tableHeight = document.documentElement.clientHeight - 439 + 'px'
    this.query(true)
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - 439 + 'px'
  }

}
</script>

<style>
.flfgList .el-card__body {
  padding: 10px 1px;
}
.flfgList .box-card {
  height: auto;
}
.flfgList .lineStyle {
  padding: 3px 50px 5px;
  border-bottom: 1px dotted #1d659b;
  display: inline-block;
  width: 100%;
  cursor: pointer;
}
.flfgList .lineStyle:last-child{
  border-bottom: 0;
}
.flfgList .lineStyle .el-col {
  padding: 5px;
}
.flfgList .el-input-group__append {
  background: #0082e6;
  border: none;
}
.flfgList .el-form-item__content {
  width: 100%;
}
.flfgList .tabsDiv {
  width: 50%;
  height: auto;
  margin: 0 auto;
  position: relative;
}
.flfgList .tabsDiv .el-tabs {
  width: 100%;
  /* margin: 0 auto; */
  padding: 0 10px;
}
</style>
