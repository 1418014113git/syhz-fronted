<template>
  <div class="InvolvedClue">
    <el-card class="cont-card" shadow="never">
      <el-table ref="companyTable" :data="listData" @row-click="rowClick">
        <el-table-column prop="XSXXBH" label="线索编号" min-width="10%"></el-table-column>
        <el-table-column label="线索类型" min-width="5%">
          <template slot-scope="scope">
            {{getLXText(scope.row.XSLX)}}
          </template>
        </el-table-column>
        <el-table-column prop="BT" label="线索标题" min-width="5%"></el-table-column>
        <el-table-column prop="XSXXLY_NAME" label="线索来源" min-width="6%"></el-table-column>
        <el-table-column prop="SSLB_NAME" label="线索分类" min-width="4%"></el-table-column>
        <el-table-column prop="JJCD_NAME" label="线索紧急程度" min-width="4%"></el-table-column>
        <el-table-column prop="XSZT_NAME" label="线索状态" width="120px"></el-table-column>
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
          <el-col class="title" :span="4">线索标题：</el-col>
          <el-col :span="7">
            <p :title="rowData.BT" class="ellipsis-word">{{rowData.BT}}&nbsp;</p>
          </el-col>
          <el-col class="title" :span="2">线索编号：</el-col>
          <el-col :span="7"><span>{{rowData.XSXXBH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">线索状态：</el-col>
          <el-col :span="7"><span>{{rowData.XSZT_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">涉及重大活动：</el-col>
          <el-col :span="7"><span>{{rowData.SJZDHD_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">涉及敏感时间点：</el-col>
          <el-col :span="6"><span>{{rowData.SJMGSD_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">线索案(事)时间：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.ASSJ)}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">涉事主体：</el-col>
          <el-col :span="7"><span>{{rowData.SSZT_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">涉事类别：</el-col>
          <el-col :span="7"><span>{{rowData.SSLB_NAME}}&nbsp;</span></el-col>

        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">采集时间：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.CJSJ)}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">线索评级：</el-col>
          <el-col :span="7"><span>{{rowData.XSPJ_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">地点类别：</el-col>
          <el-col :span="7"><span>{{rowData.ASDDLB_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">更新时间：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.SJGXSJ)}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">涉及人数：</el-col>
          <el-col :span="7"><span>{{rowData.SJRS_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">涉及损失：</el-col>
          <el-col :span="7"><span>{{rowData.SJSS_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">续报原记录编号：</el-col>
          <el-col :span="7"><span>{{rowData.XBYJLBH}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">涉事诱因：</el-col>
          <el-col :span="7"><span>{{rowData.SSYY_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">上报单位：</el-col>
          <el-col :span="7">
            <p :title="rowData.SBDW" class="ellipsis-word">{{rowData.SBDW}}&nbsp;</p>
          </el-col>
          <el-col class="title" :span="2">填报单位：</el-col>
          <el-col :span="7">
            <p :title="rowData.TBDW" class="ellipsis-word">{{rowData.TBDW}}&nbsp;</p>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">发生地所属省市：</el-col>
          <el-col :span="7">
            <p :title="rowData.ASJFSDSSSS_NAME" class="ellipsis-word">{{rowData.ASJFSDSSSS_NAME}}&nbsp;</p>
          </el-col>
          <el-col class="title" :span="2">发生地详址：</el-col>
          <el-col :span="7">
            <p :title="rowData.ASJFSDXZ" class="ellipsis-word">{{rowData.ASJFSDXZ}}&nbsp;</p>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">线索正文：</el-col>
          <el-col :span="20"><span>{{rowData.XXZW}}&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getQbxsByAjId
  } from '@/api/caseManage'
  import {
    getSYHText
  } from '@/utils/codetotext'

  export default {
    name: 'InvolvedClue',
    props: ['ajid'],
    data() {
      return {
        total: 0,
        pageSize: 4,
        page: 1,
        ajId: '',
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
        getQbxsByAjId({
          ajId: this.ajId,
          pageSize: this.pageSize,
          pageNum: this.page
        }).then((res) => {
          this.dataLoading = false
          if (res.code === '000000' && res.data.list) {
            this.listData = res.data.list
            this.total = res.data.totalCount
            if (this.listData.length > 0) {
              this.rowData = this.listData[0]
              this.$emit('involvedClue', this.total)
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
      },
      getLXText(type) {
        if (type && type.length > 0) {
          return getSYHText(type.substring(0, 1))
        }
        return ''
      }
    },
    mounted() {
      if (this.ajid) {
        this.ajId = this.ajid
        this.init()
      }
    },
    watch: {
      ajid(val) {
        this.ajId = val
        this.init()
      }
    }
  }
</script>

<style scoped>
  .InvolvedClue .title {
    text-align: right;
  }

  .InvolvedClue .row {
    padding: 10px 0;
  }
</style>
