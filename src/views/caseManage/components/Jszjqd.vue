<template>
  <div class="Jszjqd">
    <el-card class="cont-card" shadow="never">
      <el-table :data="listData" @row-click="rowClick">
        <el-table-column label="标题" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.WSBT" class="ellipsis-word">{{scope.row.WSBT}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column label="公安局" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.GAJ" class="ellipsis-word">{{scope.row.GAJ}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column prop="WSN" label="年" width="80px"></el-table-column>
        <el-table-column prop="WSZ" label="字" width="80px"></el-table-column>
        <el-table-column prop="WSH" label="号" width="80px"></el-table-column>
        <el-table-column label="案由" min-width="20%">
          <template slot-scope="scope">
            <p :title="scope.row.AY" class="ellipsis-word">{{scope.row.AY}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column prop="CYRXM" label="持有人姓名" width="120px"></el-table-column>
        <el-table-column prop="CZSJ" label="操作时间" width="120px"></el-table-column>
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
          <el-col class="title" :span="4">文书标题：</el-col>
          <el-col :span="7">
            <p :title="rowData.WSBT" class="ellipsis-word">{{rowData.WSBT}}&nbsp;</p>
          </el-col>
          <el-col class="title" :span="2">文书编号：</el-col>
          <el-col :span="7"><span>{{rowData.WSBH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">案件编号：</el-col>
          <el-col :span="7"><span>{{rowData.AJBH}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">公安局：</el-col>
          <el-col :span="7"><span>{{rowData.GAJ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">文书年：</el-col>
          <el-col :span="4"><span>{{rowData.WSN}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">文书字：</el-col>
          <el-col :span="4"><span>{{rowData.WSZ}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">文书号：</el-col>
          <el-col :span="4"><span>{{rowData.WSH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">案由：</el-col>
          <el-col :span="20"><span>{{rowData.AY}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">承办人：</el-col>
          <el-col :span="7"><span>{{rowData.CBR}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">承办日期：</el-col>
          <el-col :span="7"><span>{{rowData.CBRQ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">保存地点：</el-col>
          <el-col :span="7"><span>{{rowData.BCDD}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">持有人姓名：</el-col>
          <el-col :span="7"><span>{{rowData.CYRXM}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">持有人住址详址：</el-col>
          <el-col :span="7"><span>{{rowData.ZZXZ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">持有人工作单位：</el-col>
          <el-col :span="6"><span>{{rowData.CYRDW}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">持有人联系电话：</el-col>
          <el-col :span="7"><span>{{rowData.CYRLXDH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">本库更新时间：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.MERGE_TIME)}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">数据更新时间：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.SYH_SJGXSJ)}}&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getZjqdByAjbh
  } from '@/api/caseManage'

  export default {
    name: 'Jszjqd',
    props: ['ajbh'],
    data() {
      return {
        total: 0,
        pageSize: 4,
        page: 1,
        AJBH: '',
        dataLoading: false,
        listData: [],
        rowData: {}
      }
    },
    methods: {
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      init() {
        this.dataLoading = true
        getZjqdByAjbh({
          ajbh: this.AJBH,
          pageSize: this.pageSize,
          pageNum: this.page
        }).then((res) => {
          this.dataLoading = false
          if (res.code === '000000' && res.data.list) {
            this.listData = res.data.list
            this.total = res.data.totalCount
            if (this.listData.length > 0) {
              this.rowData = this.listData[0]
              this.$emit('jszjqd', this.total)
            }
          }
        }).catch(() => {
          this.dataLoading = false
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
  .Jszjqd .title {
    text-align: right;
  }

  .Jszjqd .row {
    padding: 10px 0;
  }
</style>
