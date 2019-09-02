<template>
  <div class="goodsInfo">
    <el-card class="cont-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>共{{total}}个涉案物品</span>
      </div>
      <el-table ref="goodTable" :data="data" @row-click="rowClick">
        <el-table-column prop="WPBH" label="物品编号"></el-table-column>
        <el-table-column prop="MC" label="物品名称"></el-table-column>
        <el-table-column prop="LX_NAME" label="类型"></el-table-column>
        <el-table-column prop="XZ_NAME" label="性质"></el-table-column>
        <el-table-column prop="BGZT_NAME" label="保管状态"></el-table-column>
        <el-table-column prop="CYR" label="持有人"></el-table-column>
        <el-table-column prop="CZDW_NAME" label="操作单位"></el-table-column>
        <el-table-column label="登记日期">
          <template slot-scope="scope">
            {{formatTime(scope.row.DJRQ)}}
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total > 0">
        <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </div>
    </el-card>
    <el-card class="cont-card" shadow="never" style="margin-top: 10px;">
      <div slot="header" class="clearfix">
        <span>详细</span>
      </div>
      <div>
        <el-row class="row">
          <el-col class="title" :span="3">物品编号：</el-col>
          <el-col :span="5"><span>{{rowData.WPBH}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">案件编号：</el-col>
          <el-col :span="5"><span>{{rowData.AJBH}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">人员编号：</el-col>
          <el-col :span="5"><span>{{rowData.RYBH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="3">类型：</el-col>
          <el-col :span="5"><span>{{rowData.LX_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">性质：</el-col>
          <el-col :span="5"><span>{{rowData.XZ_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">数量：</el-col>
          <el-col :span="5"><span>{{rowData.SL}}{{rowData.SLDW_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="3">名称：</el-col>
          <el-col :span="5"><span>{{rowData.MC}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">保管状态：</el-col>
          <el-col :span="5"><span>{{rowData.BGZT_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">持有人：</el-col>
          <el-col :span="5"><span>{{rowData.CYR}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="3">登记日期：</el-col>
          <el-col :span="5"><span>{{formatTime(rowData.DJRQ)}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">操作单位：</el-col>
          <el-col :span="5"><span>{{rowData.CZDW_NAME}}&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getAJDETAILASSETS
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
        rowData: {
          WPBH: '',
          AJBH: '',
          RYBH: '',
          LX_NAME: '',
          XZ_NAME: '',
          SL: '',
          SLDW_NAME: '',
          MC: '',
          BGZT_NAME: '',
          CYR: '',
          DJRQ: '',
          CZDW_NAME: ''
        },
        AJBH: ''
      }
    },
    methods: {
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      init() {
        getAJDETAILASSETS({
          pageNum: this.page,
          pageSize: this.pageSize,
          AJBH: this.AJBH
        }).then((res) => {
          if (res.code === '000000') {
            this.data = res.data.list
            if (this.data.length > 0) {
              this.rowData = this.data[0]
              this.$emit('goodsInfo', res.data.totalCount)
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val
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
