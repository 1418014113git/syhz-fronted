<template>
  <section class="examNotice">
    <el-form
      :inline="true"
      :model="filterQuery"
      size="small"
      label-position="left"
      label-width="76px"
    >
      <el-form-item label="关键词" prop="keywords">
        <el-input
          @change="changeKeyWords"
          type="input"
          clearable
          v-model="filterQuery.keywords"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="发布人" prop="publishPersonName">
        <el-input
          @change="changePublishPersonName"
          type="input"
          clearable
          v-model="filterQuery.publishPersonName"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          @change="onchangeStatus"
          v-model="filterQuery.status"
          clearable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="(item,index) in statusData"
            :value="item.value"
            :label="item.label"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布日期" prop="publishDate">
        <el-date-picker
          v-model="filterQuery.publishDateStart"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="onPublishStartDateChange"
        ></el-date-picker>&nbsp;至
        <el-date-picker
          v-model="filterQuery.publishDateEnd"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="onPublishEndDateChange"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySysNotice(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="clearForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="toAdd">发布</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="publishDate" label="发布时间" min-width="150"  >
             <template slot-scope="scope">
          {{scope.row.publishDate | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="publishPersonName" label="发布人" min-width="100"></el-table-column>
      <el-table-column prop="startDate" label="公告开始时间" min-width="150">
           <template slot-scope="scope">
          {{scope.row.startDate | formatDate}}
        </template>

      </el-table-column>
      <el-table-column prop="endDate" label="公告结束时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.endDate | formatDate}}
        </template>

      </el-table-column>
      <el-table-column prop="content" label="公告内容" min-width="200">
        <template slot-scope="scope">
          <p v-text="scope.row.content" :title="scope.row.content" class="noticeellipsis-words">{{scope.row.content}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="100">
        <template slot-scope="scope">
            <span v-if="scope.row.status==0" >停用</span>
            <span v-if="scope.row.status==1" >启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            title="详情"
            size="mini"
            icon="el-icon-document"
            circle
            plain
            @click="handleDetail(scope.row)"
          ></el-button>
          <el-button type="primary" size="small" v-on:click="toNoticeEdit(scope.row)">修改</el-button>
          <el-button type="primary"  @click="changeStatus(scope.row)" v-if="scope.row.status===1">停用</el-button>
          <el-button type="primary"   @click="changeStatus(scope.row)" v-if="scope.row.status===0">启用</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination
        v-if="total > 0"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15,30,50,100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :total="total"
        :current-page="page"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      loading: false, // 列表loading
      statusData: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        }
      ],

      filterQuery: {
        keywords: '',
        publishPersonName: '',
        publishDateStart: '',
        publishDateEnd: '',
        status: ''
      },
      listData: [],
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },

  methods: {
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.querySysNotice(false)
    },
    handleCurrentChange(val) {
      this.page = val
      this.querySysNotice(false)
    },
    changeKeyWords(val) {
      this.querySysNotice(true)
    },
    changePublishPersonName(val) {
      this.querySysNotice(true)
    },
    onchangeStatus(val) {
      this.querySysNotice(true)
    },
    onPublishStartDateChange(val) {
      this.querySysNotice(true)
    },
    onPublishEndDateChange(val) {
      this.querySysNotice(true)
    },

    querySysNotice(flag) {
      if (!this.filterQuery.publishDateStart && this.filterQuery.publishDateEnd) { // 开始时间为空,结束时间不为空
        this.$message({
          message: '开始时间不能为空', type: 'error'
        })
        return
      } if (this.filterQuery.publishDateStart && !this.filterQuery.publishDateEnd) {
        this.$message({
          message: '结束时间不能为空', type: 'error'
        })
        return
        // 选择了开始时间,结束时间为空
      } if (this.filterQuery.publishDateStart && this.filterQuery.publishDateEnd) { // 开始时间和结束时间均不为空
        if (new Date(this.filterQuery.publishDateStart).getTime() > new Date(this.filterQuery.publishDateEnd).getTime()) {
          this.$message({
            message: '结束时间不能小于开始时间', type: 'error'
          })
          return
        }
      }

      this.loading = true
      this.page = flag ? 1 : this.page
      var param = {
        keywords: this.filterQuery.keywords,
        publishDateStart: this.filterQuery.publishDateStart,
        publishDateEnd: this.filterQuery.publishDateEnd,
        publishPersonName: this.filterQuery.publishPersonName,
        status: this.filterQuery.status,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$query('page/sysnotice', param)
        .then(response => {
          this.loading = false
          // 去除HTML标签
          var reg = /<[^<>]+>/g
          response.data.list.forEach(item => {
            item.content.replace(reg, '')
            item.content = item.content.replace(reg, '')
            item.content = item.content.replace(/&nbsp;/gi, '')
            item.content = item.content.replace(' ', '')
          })
          this.listData = response.data.list
          this.pageSize = response.data.pageSize
          this.page = response.data.pageNum
          this.total = response.data.totalCount
        }).catch(() => {
          this.loading = false
        })
    },
    clearForm() {
      this.filterQuery.keywords = ''
      this.filterQuery.publishPersonName = ''
      this.filterQuery.publishDateStart = ''
      this.filterQuery.publishDateEnd = ''
      this.filterQuery.status = ''
      this.querySysNotice(true)
    },
    toAdd() {
      // 添加
      this.$gotoid('/sysnotice/SysNoticeSave')
    },
    toNoticeEdit(row) {
      // 修改
      this.$gotoid('/sysnotice/SysNoticeEdit', row.id)
    },
    handleDetail(row) {
      this.$gotoid('/sysnotice/SysNoticeDetail/' + row.id)
    },
    // 修改状态
    changeStatus(row) {
      var status
      if (row.status === 1) {
        status = '0'
      } else if (row.status === 0) {
        status = '1'
      }
      this.$update('sysnotice/' + row.id, {
        status: status
      })
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000') {
            this.$message({ message: '状态修改成功', type: 'success' })
            this.querySysNotice(true)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  },
  components: {},

  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.querySysNotice(true)
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.examNoticeContainer .el-dialog__body {
  padding: 30px 20px 30px 10px;
}
.name {
  top: 412px;
  left: 265px;
}

.comment_inner {
  width: 200px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 3; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
#noticecontentdiv {
  font-size: 14px;
}
.noticeellipsis-words {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
