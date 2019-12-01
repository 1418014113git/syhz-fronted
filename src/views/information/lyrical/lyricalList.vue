<template>
  <div class="lyricalList">
    <el-form :inline="true" label-width="84px">
      <el-row>
        <el-form-item label="倾向性">
          <el-select clearable v-model="queryForm.orientation" placeholder="全部">
            <el-option v-for="item in $getDicts('qxx')" :key="item.dictKey" :label="item.dictName"
                       :value="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="媒体类型">
          <el-select clearable v-model="queryForm.sourceType" placeholder="全部">
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('mtlx')"
                       :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-radio-group style="margin: 5px 0 0 -20px" v-model="queryForm.time" :max="1">
            <el-radio label="1">24小时</el-radio>
            <el-radio label="2">近3天</el-radio>
            <el-radio label="3">近7天</el-radio>
            <el-radio label="4">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="showDatePicker">
          <el-date-picker type="date" value-format="yyyy-MM-dd"
                          placeholder="请选择开始时间"
                          v-model="timeStart"
          ></el-date-picker>
          <span>至</span>
          <el-date-picker type="date" value-format="yyyy-MM-dd"
                          placeholder="请选择截止时间"
                          v-model="timeEnd"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="区域">
          <el-select clearable v-model="queryForm.area" placeholder="全部">
            <el-option :label="item.dictName" :value="item.dictName" v-for="item in $getDicts('qy')"
                       :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="name">
          <el-input clearable style="width: 340px" v-model="queryForm.keyWord"
                    placeholder="输入关键字检索信息（作者、标题、全文）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="query(true)">检索</el-button>
          <el-button type="info" v-on:click="reset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="list">
      <div style="margin: 0 10px 0 10px" v-for="(item, index) in info">
        <div>
          <img style="margin-bottom: 15px" :src="src(item.orientation)">
          <span class="title-span" @click="handleDetail(item)">{{ delHtmlTag(item.title)}}</span>
        </div>
        <div style="margin: 0 0 5px 0;height: 44px">
          <span style="cursor: pointer;" @click="handleDetail(item)">{{ delHtmlTag(item.summary)}}</span>
        </div>
        <div style="height: 22px">
          <span class="ctime-span">{{ formatTime(item.ctime)}}</span>
          <span class="author-span">{{ item.author}}</span>
          <span class="sourceType-span">{{ formatSourceType(item.sourceType)}}</span>
          <span class="keyWord-span">{{ item.keyWord}}</span>
        </div>
        <hr v-if=isDisplay(index) style="margin: 10px 0 10px 0"/>
      </div>
      <div v-if="total < 1">
        <p style="line-height: 200px; text-align: center">暂无数据</p>
      </div>
    </div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handleCurrentChange"
                     :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>
<script>
  import { getListPage } from '@/api/publicOpinionInformation'

  export default {
    name: 'lyricalList',
    data() {
      return {
        isflag: 0,
        total: 0,
        page: 1,
        pageSize: 15,
        queryForm: {
          orientation: '',
          sourceType: '',
          time: '',
          area: '',
          keyWord: ''
        },
        showDatePicker: false,
        timeStart: '',
        timeEnd: '',
        info: []
      }
    },
    components: {},
    watch: {
      'queryForm.time': function(val) {
        if (val === '4') {
          this.showDatePicker = true
        } else {
          this.showDatePicker = false
          this.timeStart = ''
          this.timeEnd = ''
        }
      }
    },
    methods: {
      handleCurrentChange(currentPage) {
        this.page = currentPage
        this.query()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query()
      },
      // 查看详细
      handleDetail(val) {
        this.$router.push({ path: '/lyrical/lyricalDetail', query: { data: val }})
      },
      // 查询
      query(flag) {
        if (flag) {
          this.page = 1
        }
        var param = 'pageNum=' + this.page + '&pageSize=' + this.pageSize
        if (this.queryForm.orientation !== '') {
          param = param + '&orientation=' + this.queryForm.orientation
        }
        if (this.queryForm.sourceType !== '') {
          param = param + '&sourceType=' + this.queryForm.sourceType
        }
        if (this.queryForm.area !== '') {
          param = param + '&keyWord=' + this.queryForm.area
        }
        if (this.queryForm.keyWord !== '') {
          param = param + '&content=' + this.queryForm.keyWord
        }
        if (this.queryForm.time === '1') {
          param = param + '&startTime=' + (new Date().getTime() - 24 * 60 * 60 * 1000)
          param = param + '&endTime=' + new Date().getTime()
        } else if (this.queryForm.time === '2') {
          param = param + '&startTime=' + (new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
          param = param + '&endTime=' + new Date().getTime()
        } else if (this.queryForm.time === '3') {
          param = param + '&startTime=' + (new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
          param = param + '&endTime=' + new Date().getTime()
        } else {
          if (!this.timeStart) {
            this.$alert('请选择开始时间', '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            })
            return
          }
          if (!this.timeEnd) {
            this.$alert('请选择截止时间', '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            })
            return
          }
          if (new Date(this.timeStart).getTime() - new Date(this.timeEnd).getTime() > 0) {
            this.$alert('开始时间不能大于截止时间', '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            })
            return
          }
          if (new Date(this.timeEnd).getTime() - new Date(this.timeStart).getTime() > 7 * 24 * 60 * 60 * 1000) {
            this.$alert('时间间隔不能大于7天', '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            })
            return
          }
          // 开始时间为选择日期0点 结束时间为选择日期0点
          param = param + '&startTime=' + (new Date(this.timeStart).getTime() - 8 * 60 * 60 * 1000)
          param = param + '&endTime=' + (new Date(this.timeEnd).getTime() - 8 * 60 * 60 * 1000)
        }
        getListPage(param).then((response) => {
          this.info = response.data.content
          this.total = response.data.totalElements
          this.page = response.data.pageable.pageNumber + 1
          this.pageSize = response.data.pageable.pageSize
          if (this.total > 1000) {
            this.$alert('检索数据量过大，请精确检索条件！', '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            })
            return
          }
        })
      },
      // 重置
      reset() {
        this.queryForm.orientation = ''
        this.queryForm.sourceType = ''
        this.queryForm.time = '3'
        this.queryForm.area = ''
        this.queryForm.keyWord = ''
        this.page = 1
        this.pageSize = 15
        this.query()
      },
      // 初始化
      init() {
        // 默认选中近7天
        this.queryForm.time = '3'
        // 初始化查询近3天的舆情信息
        var param = 'pageNum=' + this.page + '&pageSize=' + this.pageSize + '&startTime=' + (new Date().getTime() - 3 * 24 * 60 * 60 * 1000) + '&endTime=' + new Date().getTime()
        getListPage(param).then((response) => {
          this.info = response.data.content
          this.total = response.data.totalElements
          this.page = response.data.pageable.pageNumber + 1
          this.pageSize = response.data.pageable.pageSize
        })
      },
      // 获取倾向性图标
      src(val) {
        if (val === 1) {
          return '/static/image/orientation_images/positive.png'
        } else if (val === 2) {
          return '/static/image/orientation_images/negative.png'
        } else if (val === 3) {
          return '/static/image/orientation_images/neutral.png'
        }
      },
      // 去掉字符串中的HTML标签
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, '')
      },
      // 格式化时间
      formatTime(str) {
        return this.$parseTime(str, '{y}-{m}-{d} {h}:{i}')
      },
      // 格式化媒体类型
      formatSourceType(str) {
        var list = this.$getDicts('mtlx')
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictKey + '' === str + '') {
            return list[i].dictName
          }
        }
      },
      // 是否显示分割线
      isDisplay(index) {
        if (index === this.info.length - 1) {
          return false
        } else {
          return true
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .lyricalList{
    width: 90%;
    margin-left: 5%;
  }
  .list {
    padding: 10px 0;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 64, 94, 0.7);
    border-radius: 8px;
  }

  .title-span {
    font-size: 18px;
    font-weight: bolder;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    display: inline-block;
    cursor: pointer;
  }

  .ctime-span {
    margin-right: 40px;
    width: 8%;
    position: relative;
    bottom: 5px;
  }

  .author-span {
    margin-right: 40px;
    width: 8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    display: inline-block;
  }

  .sourceType-span {
    margin-right: 40px;
    width: 4%;
    position: relative;
    bottom: 5px;
  }

  .keyWord-span {
    margin-right: 40px;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    display: inline-block;
  }
</style>
