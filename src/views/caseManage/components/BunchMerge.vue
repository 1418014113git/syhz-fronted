<template>
  <div class="goodsInfo">
    <el-card class="cont-card" shadow="never">
      <el-table ref="goodTable" :data="data" @row-click="rowClick">
        <el-table-column prop="CBABH" label="串并编号"></el-table-column>
        <el-table-column prop="CAZT_NAME" label="串案状态"></el-table-column>
        <el-table-column prop="CBFXBH" label="分析编号"></el-table-column>
        <el-table-column prop="AJMC" label="案件名称"></el-table-column>
        <el-table-column prop="AJLB_NAME" label="案件类别"></el-table-column>
        <el-table-column prop="CZDW_NAME" label="操作单位"></el-table-column>
        <el-table-column prop="CZR_NAME" label="操作人"></el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="scope">
            {{formatTime(scope.row.CZSJ)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-card>
    <el-card class="cont-card" shadow="never" style="margin-top: 10px;">
      <div slot="header" class="clearfix">
        <span>详细</span>
      </div>
      <div>
        <el-row class="row">
          <el-col class="title" :span="4">串并编号：</el-col>
          <el-col :span="6"><span>{{rowData.CBABH}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">案件编号：</el-col>
          <el-col :span="6"><span>{{rowData.CBAJBH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">串案状态：</el-col>
          <el-col :span="6"><span>{{rowData.CAZT_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">案件类别：</el-col>
          <el-col :span="6"><span>{{rowData.AJLB_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">案件名称：</el-col>
          <el-col :span="6"><span>{{rowData.AJMC}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">发案时间：</el-col>
          <el-col :span="6"><span>{{formatTime(rowData.FASJ)}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">简要案情：</el-col>
          <el-col :span="20"><span>{{rowData.JYAQ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">登记单位：</el-col>
          <el-col :span="6"><span>{{rowData.DJDW_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">操作单位：</el-col>
          <el-col :span="6"><span>{{rowData.CZDW_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">登记人：</el-col>
          <el-col :span="6"><span>{{rowData.DJR_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">操作人：</el-col>
          <el-col :span="6"><span>{{rowData.CZR_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">登记日期：</el-col>
          <el-col :span="6"><span>{{formatTime(rowData.DJRQ)}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">操作时间：</el-col>
          <el-col :span="6"><span>{{formatTime(rowData.CZSJ)}}&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getAJDETAILBUNCH
  } from '@/api/caseManage'

  export default {
    name: 'EnterpriseInfo',
    components: {},
    props: ['ajbh'],
    data() {
      return {
        page: 1,
        total: 0,
        pageSize: 20,
        data: [],
        rowData: {},
        AJBH: ''
      }
    },
    methods: {
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      init() {
        getAJDETAILBUNCH({
          pageNum: this.page,
          pageSize: this.pageSize,
          AJBH: this.AJBH
        }).then((res) => {
          if (res.code === '000000') {
            this.data = res.data.list
            this.total = res.data.totalCount
            if (this.data.length > 0) {
              this.rowData = this.data[0]
              this.$emit('bunchMerge', this.total)
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.init()
      },
      rowClick(row) {
        this.rowData = row
      }
    },
    mounted() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.init()
      }
    },
    watch: {
      ajbh(val) {
        this.AJBH = val
        this.init()
      }
    }
  }
</script>

<style scoped>
  .goodsInfo .title {
    text-align: right;
  }

  .goodsInfo .row {
    padding: 10px 0;
  }
</style>
