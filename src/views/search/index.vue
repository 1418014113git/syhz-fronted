<template>
  <section class="searchList">
    <!--工具条-->
    <div style="text-align: center;padding-bottom: 50px">
      <el-row>
        <el-col :span="11" :offset="6">
          <div>
            <el-input size="large" v-model="filters.search">
            </el-input>
          </div>
        </el-col>
        <el-col :span="1">
          <div>
            <el-button type="primary" size="large" @click="query" style="margin-left: 15px;">搜一下</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13" :offset="6">
          <el-menu default-active="0" text-color="#bce8fc" active-text-color="#00a0e9" mode="horizontal" @select="handleSelect">
            <el-menu-item v-for="item in resourceShowList" :key="item.code" :index="item.code">{{ item.label }}</el-menu-item>
            <el-submenu index="" style="margin-left: 10px;" v-if="resourceBlankList.length > 0">
              <template slot="title"></template>
              <el-menu-item v-for="item in resourceBlankList" :key="item.code" :index="item.code">{{ item.label }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <el-col :span="24" v-loading="loading">
      <el-card class="box-card" >
        <div slot="header">
          <span>平台为您找到相关结果约：{{ total.toLocaleString() }}个</span>
        </div>
        <div class="demo">
          <div style="margin: 0 10px 0 10px" v-for="(item, index) in dataList" :key="index + activeIndexLast" :value="item">
            <div style="margin: 0 0 5px 0">
              <span class="title title-span" @click='detail(item)'>{{ delHtmlTag(item.title) }}
              </span>
              <span class="title-span" style="color: #bce8fc;cursor: default;" v-if="activeIndex === '0'">{{ formatType(item.type) }}</span>
            </div>
            <div>
              <span>{{formatDate(item.publishTime)}}</span>
              <span>-</span>
              <span class="content">{{item.content !== '' && item.content ? delHtmlTag(item.content) : delHtmlTag(item.attachment)}}</span>
            </div>
            <hr v-if=isDisplay(index) style="margin: 10px 0 10px 0"/>
          </div>
        </div>
      </el-card>
      <div class="box-card">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </div>
    </el-col>
  </section>
</template>

<script>
  import { parseTime } from '@/utils/index'
  import $ from 'jquery'
  export default {
    data() {
      return {
        activeIndex: '0',
        activeIndexLast: '',
        resourceShowList: [],
        resourceBlankList: [],
        resourceList: [],
        filters: {
          resourceType: '',
          search: '',
          pageSize: '',
          pageNum: ''
        },
        loading: false,
        total: 0,
        page: 1,
        pageSize: 15,
        dataList: [],
        isFlush: false
      }
    },
    methods: {
      // 格式化日期
      formatDate(time) {
        return parseTime(new Date(time), '{y}年{m}月{d}日')
      },
      // 去掉字符串中的HTML标签
      delHtmlTag(str) {
        if (str) {
          return this.intercept(str.replace(/<[^>]+>/g, '')).replace(/\&nbsp;/g, '')
        }
      },
      // 内容截取一百字
      intercept(str) {
        if (str.length > 100) {
          return str.substring(0, 99) + '...'
        } else {
          return str
        }
      },
      // 导航切换
      handleSelect(key, keyPath) {
        const _this = this
        _this.activeIndex = key
        if (this.filters.search !== '') {
          this.activeIndexLast = key
          this.page = 1
          this.pageSize = 15
          this.search()
        } else {
          this.dataList = []
          this.page = 1
          this.pageSize = 15
          this.total = 0
        }
      },
      // 是否显示分割线
      isDisplay(index) {
        if (index === this.dataList.length - 1) {
          return false
        } else {
          return true
        }
      },
      // 页码改变
      handleCurrentChange(val) {
        this.page = val
        this.search()
      },
      // 条数改变
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.search()
      },
      // 详情
      detail(item) {
        const _this = this
        for (var i = 0; i < _this.resourceList.length; i++) {
          if (_this.resourceList[i].code === item.type + '') {
            var para = {}
            if (item.active) {
              para = item
            } else {
              para = { id: item.id }
            }
            _this.$gotoid(
              _this.resourceList[i].router,
              JSON.stringify(para)
            )
          }
        }
      },
      // 点击搜索按钮
      query() {
        this.pageSize = 15
        this.page = 1
        this.search()
      },
      // 搜索
      search() {
        const _this = this
        if (_this.filters.search !== '') {
          _this.dataList = []
          _this.filters.resourceType = _this.activeIndex
          _this.activeIndexLast = _this.activeIndex
          _this.filters.pageSize = _this.pageSize
          _this.filters.pageNum = _this.page
          _this.loading = true
          _this.$query('/oneTouchSearch/query/', _this.filters).then(response => {
            _this.total = response.data.totalCount
            if (response.data.list !== null) {
              _this.dataList = response.data.list
            }
            _this.loading = false
            _this.isFlush = true
          }).catch(() => {
            _this.loading = false
          })
        }
      },
      // 格式化资源分类
      formatType(typeCode) {
        const _this = this
        for (var i = 0; i < _this.resourceList.length; i++) {
          if (_this.resourceList[i].code === typeCode + '') {
            return '_' + _this.resourceList[i].label
          }
        }
      },
      // 初始化导航
      navigationBar() {
        const _this = this
        _this.$query('YJSSCODE/', { codeLx: 'yjss' }).then(response => {
          const dataList = response.data
          for (var i = 0; i < dataList.length; i++) {
            var item = {
              code: dataList[i].code,
              label: JSON.parse(dataList[i].code_name).label,
              show: JSON.parse(dataList[i].code_name).show,
              enabled: JSON.parse(dataList[i].code_name).enabled,
              router: JSON.parse(dataList[i].code_name).router
            }
            if (item.enabled === '1') {
              _this.resourceList.push(item)
              if (item.show === '1') {
                _this.resourceShowList.push(item)
              } else {
                _this.resourceBlankList.push(item)
              }
            }
          }
        })
      },
      // 高亮显示匹配字段
      heghlight() {
        //   页面中需要高亮的容器
        this.clearSelection()
        var searchText = this.filters.search
        if (searchText.length > 0) {
          //  创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；
          var regExp = new RegExp(searchText, 'g')
          $('.demo').find('.title').each(function() {
            var html = $(this).html()
            //   将找到的关键字替换，加上highlight属性；
            var newHtml = html.replace(regExp, "<span class='highlight'>" + searchText + '</span>')
            $(this).html(newHtml)
          })
          $('.demo').find('.content').each(function() {
            var html = $(this).html()
            //   将找到的关键字替换，加上highlight属性；
            var newHtml = html.replace(regExp, "<span class='highlight'>" + searchText + '</span>')
            $(this).html(newHtml)
          })
        }
        this.isFlush = false
      },
      // 清除高亮
      clearSelection() {
        $('.demo').each(function() {
          $(this).find('.highlight').each(function() {
            var thishtml = $(this).html()
            $(this)[0].outerHTML = thishtml
            $(this).replaceWith(thishtml)
          })
        })
      },
      // 初始化
      init() {
        if (this.$route.query.word !== '') {
          this.filters.search = this.$route.query.word
          this.search()
        }
      }
    },
    mounted() {
      this.navigationBar()
      this.dataList = [
        { title: '测试测试', content: '', type: '2', publishTime: 1579329664818, attachment: '测试文档2.docx' },
        { title: '测试测试', type: '2', publishTime: 1579329664818 }
        // { title: '测试测试', content: '213', type: '2', publishTime: 1579329664818, attachment: '测试文档.docx' },
        // { title: '测试测试', content: '123', type: '2', publishTime: 1579329664818, attachment: '测试文档.docx' },
        // { title: '测试测试', content: '', type: '2', publishTime: 1579329664818, attachment: '' }
      ]
    },
    updated() {
      if (this.isFlush) {
        this.heghlight()
      }
    }

  }
</script>


<style>
  .highlight{
    color: red;
  }
</style>

<style scoped>
  .title-span {
    font-size: 18px;
    font-weight: bolder;
    width: 95%;
    cursor: pointer;
  }
  .highlight{
    color: red;
  }
  .searchList .box-card {
    height: auto;
    width: 80%;
    margin: 0 auto;
  }
  .searchList .tabsDiv {
    width: 50%;
    height: auto;
    margin: 0 auto;
    position: relative;
  }
</style>
