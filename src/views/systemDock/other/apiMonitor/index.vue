<template>
  <div class="loglist">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="时间范围：">
          <div class="case">
            <el-date-picker v-model="dateRand" type="daterange" @change="dateChange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="操作人：">
          <el-input placeholder="输入名称搜索" v-model="filters.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="IP地址：">
          <el-input placeholder="输入IP地址" v-model="filters.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求方式：">
          <el-select v-model="filters.action" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--
        <el-form-item label="请求参数：">
          <el-input placeholder="输入请求参数" v-model="filters.query" clearable></el-input>
        </el-form-item>
        -->
        <el-form-item >
          <el-button type="primary" size="small" v-on:click="getLogList(true,true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  v-if="$isViewBtn('111003')">Excel导出</el-button>
          <!--<a :href="exportDataUrl+'sysoperatrlog?type=4&name='+filters.name+'&ip='+filters.ip+'&action='+filters.action+'&query='+filters.query+'&startDate='+(dateRand.length>0?dateRand[0]:'')+'&endDate='+(dateRand.length>1?dateRand[1]:'')"  download="t.xlsx"  >
            <el-button type="primary"  v-if="$isViewBtn('111003')">Excel导出</el-button>
            <el-button type="primary"  v-if="$isViewBtn('111003')">备份</el-button>
          </a>
          -->
        </el-form-item>
       <!--
        <el-form-item>
          <el-button type="danger" size="small" v-on:click="toPersonManager">异常情况</el-button>
        </el-form-item>
        -->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="statisticCollect">
      <el-table-column type="index" label="序号" width="56"></el-table-column>
      <el-table-column prop="user_name" label="请求账户" min-width="100"></el-table-column>
      <el-table-column prop="real_name" label="请求人" min-width="100"></el-table-column>
      <el-table-column prop="ip_address" label="IP地址" width="140" ></el-table-column>
      <el-table-column prop="url" label="请求API" min-width="200" ></el-table-column>
      <el-table-column prop="apiMethod" label="请求方式" min-width="200" ></el-table-column>
      <el-table-column prop="apiStatus" label="相应状态" min-width="200" ></el-table-column>
      <el-table-column prop="apiTime" label="耗时(秒)" min-width="200" >
        <template slot-scope="scope">
          <span>{{getApiTime(scope.row)}}S</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数" min-width="200" >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="请求参数"
            width="600"
            trigger="click">
            <el-row style="width:576px; max-height: 600px; overflow-y: auto; word-break: break-all;">
              {{scope.row.args}}
            </el-row>
            <p slot="reference" class="show-word4">{{scope.row.args}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="返回数据" min-width="500" >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="返回数据"
            width="600"
            trigger="click">
            <el-row style="width:576px; max-height: 600px; overflow-y: auto; word-break: break-all;">
              {{scope.row.return_data}}
              <el-button type="primary"
                         v-clipboard:copy="scope.row.return_data"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError">点击复制</el-button>
            </el-row>
            <p slot="reference" class="show-word4">{{scope.row.return_data}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="create_date" label="请求时间" width="170" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import importexport from '@/api/importexport'
export default {
  name: 'ajList',
  data() {
    return {
      exportDataUrl: importexport.exportDataUrl,
      filters: {
        name: '', ip: '', query: '', action: ''
      },
      logs: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      dateRand: [],
      tableHeight: null,
      options: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }]
    }
  },
  methods: {
    getApiTime(row) {
      var apiTime = row.apiTime / 1000
      return apiTime
    },
    onCopy(e) {
      this.$message({
        message: '复制成功', type: 'success'
      })
    },
    onError(e) {
      this.$message({
        message: '复制失败', type: 'success'
      })
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.filters.startDate = val[0]
        this.filters.endDate = val[1]
      } else {
        this.filters.startDate = ''
        this.filters.endDate = ''
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getLogList(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getLogList(false, true)
    },
    getLogList(flag, hand) {
      // var para = {}
      // if (hand) {
      //   para.logFlag = 1 // 是否写日志
      // }
      var listData = [
        {
          'args': '{deptId=1010, pageSize=5, pageNum=1}',
          'http_method': 'DBAJHOME-GET_LIST',
          'user_id': '3010',
          'user_name': 'zhangsan',
          'action': '工作门户-督办进展',
          'apiStatus': '200',
          'apiTime': 2000,
          'real_name': '张行',
          'id': 184426,
          'ip_address': '192.168.87.89',
          'apiMethod': 'GET',
          'return_data': 'Page{count=true, pageNum=1, pageSize=5, startRow=0, endRow=5, total=0, pages=0, reasonable=false, pageSizeZero=false}',
          'create_date': '2019-08-23 11:42:42',
          'url': 'http://api.test.com/syhz/page/dbajhome'
        },
        {
          'args': '{endTime=2019-08-23, startTime=2018-08-23}',
          'http_method': 'TOTALCASE-GET_LIST',
          'user_id': '3010',
          'user_name': 'lishanshan',
          'action': '综合研判-案发趋势',
          'real_name': '李姗姗',
          'id': 184426,
          'apiStatus': '200',
          'apiTime': 4000,
          'ip_address': '192.168.53.2',
          'apiMethod': 'GET',
          'return_data': '[{cityCode=610100, num=21, name=西安市}, {cityCode=610200, num=11, name=宝鸡市}]',
          'create_date': '2019-08-23 11:42:42',
          'url': 'http://api.test.com/syhz/totalcase'
        },
        {
          'args': '{deptId=1010}',
          'http_method': 'WORKGROUP-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangpengwei',
          'action': '工作门户-个人待办',
          'real_name': '王鹏伟',
          'id': 184424,
          'ip_address': '192.168.65.1',
          'return_data': '[]',
          'apiMethod': 'POST',
          'create_date': '2019-08-23 11:42:42',
          'apiStatus': '200',
          'apiTime': 3000,
          'url': 'http://api.test.com/syhz/workgroup'
        },
        {
          'args': '{bizType=7}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'wuting',
          'action': '消息中心-全部分类',
          'real_name': '吴婷',
          'id': 184423,
          'ip_address': '192.168.69.72',
          'return_data': '[{num=3}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '200',
          'apiMethod': 'GET',
          'apiTime': 6000,
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=6}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'liubo',
          'action': '消息中心-全部分类',
          'real_name': '刘博',
          'id': 184422,
          'ip_address': '192.168.78.89',
          'return_data': '[{num=123}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '200',
          'apiTime': 5000,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=5}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'heijiantao',
          'action': '消息中心-全部分类',
          'real_name': '黑键涛',
          'id': 184421,
          'ip_address': '192.168.17.45',
          'return_data': '[{num=104}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '200',
          'apiTime': 8000,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=4}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'duyun',
          'action': '消息中心-全部分类',
          'real_name': '杜云',
          'id': 184420,
          'ip_address': '192.168.83.22',
          'return_data': '[{num=269}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '200',
          'apiTime': 4500,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=3}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangjiahe',
          'action': '消息中心-全部分类',
          'real_name': '王嘉赫',
          'id': 184419,
          'ip_address': '192.168.73.23',
          'return_data': '[{num=303}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '201',
          'apiTime': 5600,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=1}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'yanjing',
          'action': '消息中心-全部分类',
          'real_name': '闫静',
          'id': 184418,
          'ip_address': '192.168.13.21',
          'return_data': '[{num=70}]',
          'create_date': '2019-08-23 11:42:41',
          'apiStatus': '204',
          'apiTime': 4800,
          'apiMethod': 'PUT',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{deptId=1010, pageSize=5, pageNum=1}',
          'http_method': 'DBAJHOME-GET_LIST',
          'user_id': '3010',
          'user_name': 'shaocong',
          'action': '工作门户-督办进展',
          'real_name': '邵聪',
          'id': 184417,
          'ip_address': '192.168.43.29',
          'return_data': 'Page{count=true, pageNum=1, pageSize=5, startRow=0, endRow=5, total=0, pages=0, reasonable=false, pageSizeZero=false}',
          'create_date': '2019-08-23 11:42:30',
          'apiStatus': '200',
          'apiMethod': 'GET',
          'apiTime': 8000,
          'url': 'http://api.test.com/syhz/page/dbajhome'
        },
        {
          'args': '{endTime=2019-08-23, startTime=2018-08-23}',
          'http_method': 'TOTALCASE-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangjiahe',
          'action': '综合研判-案发趋势',
          'real_name': '王嘉赫',
          'id': 184416,
          'ip_address': '192.168.32.90',
          'return_data': '[{cityCode=610100, num=21, name=西安市}, {cityCode=610200, num=11, name=咸阳市}]',
          'create_date': '2019-08-23 11:42:30',
          'apiStatus': '200',
          'apiTime': 6500,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/totalcase'
        },
        {
          'args': '{deptId=1010}',
          'http_method': 'WORKGROUP-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangyi',
          'action': '工作门户-个人待办',
          'real_name': '王一',
          'id': 184415,
          'ip_address': '192.168.56.87',
          'return_data': '[]',
          'create_date': '2019-08-23 11:42:29',
          'apiStatus': '200',
          'apiTime': 3300,
          'apiMethod': 'POST',
          'url': 'http://api.test.com/syhz/workgroup'
        },
        {
          'args': '{bizType=7}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangqiang',
          'action': '消息中心-全部分类',
          'real_name': '王强',
          'id': 184414,
          'ip_address': '192.168.46.65',
          'return_data': '[{num=3}]',
          'create_date': '2019-08-23 11:42:29',
          'apiStatus': '200',
          'apiTime': 1500,
          'apiMethod': 'PUT',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=6}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'wangrui',
          'action': '消息中心-全部分类',
          'real_name': '王瑞',
          'id': 184413,
          'ip_address': '192.168.43.27',
          'return_data': '[{num=123}]',
          'create_date': '2019-08-23 11:42:29',
          'apiStatus': '200',
          'apiTime': 2700,
          'apiMethod': 'DELETE',
          'url': 'http://api.test.com/syhz/messagescount'
        },
        {
          'args': '{bizType=5}',
          'http_method': 'MESSAGESCOUNT-GET_LIST',
          'user_id': '3010',
          'user_name': 'chengxiaolong',
          'action': '消息中心-全部分类',
          'real_name': '程小龙',
          'id': 184412,
          'ip_address': '192.168.43.22',
          'return_data': '[{num=104}]',
          'create_date': '2019-08-23 11:42:29',
          'apiStatus': '200',
          'apiTime': 3600,
          'apiMethod': 'GET',
          'url': 'http://api.test.com/syhz/messagescount'
        }
      ]
      this.total = 10
      this.pageSize = 15
      this.logs = listData
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.filters.name = ''
      this.dateRand = []
      this.dateChange('')
      this.getLogList(true, true)
    },
    toPersonManager() {
      // this.$router.push({ path: '/config/restricted' })
      this.$router.push({ path: '/log/indexAbnormal' })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.getLogList(true)
  }
}

</script>

<style>
.loglist .case .el-date-editor .el-range-separator {
  padding: 0;
}
.loglist .el-button--danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  background-image: linear-gradient(
    0deg,
    rgba(245, 108, 108, 0.5) 0%,
    rgba(240, 162, 162, 0.8) 84%
  );
}
.loglist .show-word4 {
  cursor: default;
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
