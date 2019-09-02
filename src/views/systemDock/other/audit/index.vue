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
          <el-input placeholder="API地址" v-model="filters.ip" clearable></el-input>
        </el-form-item>
        <!--
        <el-form-item label="请求参数：">
          <el-input placeholder="输入请求参数" v-model="filters.query" clearable></el-input>
        </el-form-item>
        -->
        <el-form-item >
          <el-button type="primary" size="small" v-on:click="getLogList(true)">查询</el-button>
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
      <el-table-column prop="user_name" label="操作账户" min-width="100"></el-table-column>
      <el-table-column prop="real_name" label="操作人" min-width="100"></el-table-column>
      <el-table-column prop="ip_address" label="操作人IP地址" width="140" ></el-table-column>
      <el-table-column prop="ip_desc" label="操作人描述" width="140" ></el-table-column>
      <el-table-column prop="url" label="API地址" min-width="200" ></el-table-column>
      <el-table-column prop="apiVersion" label="API版本" min-width="200" ></el-table-column>
      <el-table-column prop="apiNumber" label="API请求次数" min-width="200" ></el-table-column>
      <el-table-column prop="apiTime" label="API平均响应时长(秒)" min-width="200" >
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
      <el-table-column label="相应参数" min-width="500" >
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
      <el-table-column prop="create_date" label="修改时间" width="170" show-overflow-tooltip>
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
        this.getLogList(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getLogList(false)
      },
      getLogList(flag) {
        var listData = [
          {
            'args': '{deptId=1010, pageSize=5, pageNum=1}',
            'http_method': 'DBAJHOME-GET_LIST',
            'user_id': '3010',
            'user_name': 'zhanghang',
            'action': '工作门户-督办进展',
            'apiStatus': '200',
            'real_name': '张行',
            'id': 184426,
            'ip_address': '192.168.43.25',
            'apiMethod': 'GET',
            'return_data': 'Page{count=true, pageNum=1, pageSize=5, startRow=0, endRow=5, total=0, pages=0, reasonable=false, pageSizeZero=false}',
            'create_date': '2019-08-23 11:42:42',
            'ip_desc': '将接口版本由V1.5变更为2.0',
            'apiVersion': 'V2.0',
            'apiNumber': '58323',
            'apiTime': 1800,
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
            'ip_address': '192.168.72.40',
            'apiMethod': 'GET',
            'return_data': '[{cityCode=610100, num=21, name=西安市}, {cityCode=610200, num=11, name=宝鸡市}]',
            'create_date': '2019-08-23 11:42:42',
            'ip_desc': '增加请求参数',
            'apiVersion': 'V2.0',
            'apiNumber': '8323',
            'apiTime': 3000,
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
            'ip_address': '192.168.25.2',
            'return_data': '[]',
            'apiMethod': 'POST',
            'create_date': '2019-08-23 11:42:42',
            'apiStatus': '200',
            'ip_desc': '增加请求参数',
            'apiVersion': 'V2.0',
            'apiNumber': '128876',
            'apiTime': 2800,
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
            'ip_address': '192.168.38.21',
            'return_data': '[{num=3}]',
            'create_date': '2019-08-23 11:42:41',
            'apiStatus': '200',
            'apiMethod': 'GET',
            'ip_desc': '增加请求参数',
            'apiVersion': 'V2.1',
            'apiNumber': 46436,
            'apiTime': 2500,
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
            'ip_address': '192.168.43.2',
            'return_data': 'Page{count=true, pageNum=1, pageSize=5, startRow=0, endRow=5, total=0, pages=0, reasonable=false, pageSizeZero=false}',
            'create_date': '2019-08-23 11:42:30',
            'apiStatus': '200',
            'apiMethod': 'GET',
            'ip_desc': '增加请求参数',
            'apiVersion': 'V1.5',
            'apiNumber': 163453,
            'apiTime': 2800,
            'url': 'http://api.test.com/syhz/page/dbajhome'
          }
        ]
        this.total = 5
        this.pageSize = 15
        this.logs = listData
      },
      reset() {
        this.$refs['filters'].resetFields()
        this.filters.name = ''
        this.dateRand = []
        this.dateChange('')
        this.getLogList(true)
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
