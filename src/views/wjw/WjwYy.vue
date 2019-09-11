<template>
  <div class="WjwYy">
    <el-form :inline="true" :model="query" label-width="100px" ref="YYForm">
      <el-form-item label="医院编号">
        <el-input v-model="query.YYBH" clearable placeholder="医院编号" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="患者姓名">
        <el-input v-model="query.HZXM" clearable placeholder="患者姓名" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input v-model="query.LXRXM" clearable placeholder="患者姓名" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input v-model="query.HZZJHM" clearable placeholder="证件号码" size="small" class="inputw"></el-input>
      </el-form-item>
      <br/>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="query.HZCSRQ" type="date" size="small"
          value-format="yyyy-MM-dd" clearable class="inputw">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="住院日期">
        <el-date-picker
          v-model="query.ZYRQ" type="date" size="small"
          value-format="yyyy-MM-dd" clearable class="inputw">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出院日期">
        <el-date-picker
          v-model="query.CYRQ" type="date" size="small"
          value-format="yyyy-MM-dd" clearable class="inputw">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="query.YYDWMC" clearable placeholder="医院名称" size="small" class="inputw"></el-input>
      </el-form-item>
      <!--<el-form-item label="血型">-->
        <!--<el-select v-model="query.XX" placeholder="请选择通知分类" clearable>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="queryData(true,true)" v-if="$isViewBtn('112001')">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="医院编号" min-width="6%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleDetail(scope.row)">{{scope.row.YYBH}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="HZ_XM" label="患者姓名" min-width="4%"></el-table-column>
      <el-table-column prop="HZ_XB" label="性别" min-width="3%"></el-table-column>
      <el-table-column label="出生日期" min-width="5%">
        <template slot-scope="scope">
          <span v-if="scope.row.HZ_CSRQ">
            {{scope.row.HZ_CSRQ | formatDate}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="HZ_LXDH" label="联系电话" min-width="6%"></el-table-column>
      <el-table-column prop="LXR_XM" label="联系人姓名" min-width="5%"></el-table-column>
      <el-table-column prop="YY_DWMC" label="医院单位名称" min-width="10%"></el-table-column>
      <el-table-column prop="ZYRQ" label="住院日期" min-width="5%"></el-table-column>
      <el-table-column prop="CYRQ" label="出院日期" min-width="5%"></el-table-column>
      <el-table-column prop="XXRKSJ" label="入库时间" min-width="7%"></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle v-if="$isViewBtn('112002')"
                     @click="handleDetail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="pageChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="query.pageSize" :total="total" :current-page="query.pageNum" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {
    parseTime
  } from '@/utils/index'
  import {
    getWjwYyPage
  } from '@/api/xsrcs'

  export default {
    name: 'WjwYy',
    data() {
      return {
        query: {
          pageNum: 1,
          pageSize: 15,
          YYBH: '',
          HZXM: '',
          LXRXM: '',
          HZZJHM: '',
          HZCSRQ: '',
          ZYRQ: '',
          YYDWMC: '',
          CYRQ: ''
        },
        total: 0,
        listData: [],
        listLoading: false,
        qsDateRand: [],
        qfDateRand: [],
        tableHeight: null
      }
    },
    methods: {
      pageChange(val) {
        this.query.pageNum = val
        this.queryData(false, true)
      },
      handleSizeChange(val) {
        this.query.pageNum = 1
        this.query.pageSize = val
        this.queryData(false, true)
      },
      queryData(flag, hand) {
        this.listLoading = true
        this.query.pageNum = flag ? 1 : this.query.pageNum
        if (hand) { // 手动点击时，添加埋点参数
          this.query.logFlag = 1
        }
        getWjwYyPage(this.query).then((res) => {
          this.listLoading = false
          if (res.code === '000000' && res.data) {
            this.listData = res.data.list
            this.total = res.data.totalCount
            this.query.pageSize = res.data.pageSize
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      clear() {
        this.$refs.YYForm.resetFields()
        this.query = {
          pageNum: 1, pageSize: 10, CSYYZMBH: '', HXM: '', HXB: ''
        }
        this.queryData(true, true)
      },
      handleDetail(row) {
        this.$router.push({
          path: '/wjw/yy/' + row.XXZJBH
        })
      }
    },
    filters: {
      formatDate(time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.queryData(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
  .WjwYy .inputw {
    width: 200px;
  }
</style>
