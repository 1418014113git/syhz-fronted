<template>
  <div class="InvolvedCompany xddw">
    <el-card class="cont-card" shadow="never">
      <el-table ref="companyTable" :data="listData" @row-click="rowClick" :row-class-name="tableRowClassName" style="position: relative">
        <el-table-column prop="DWMC" label="单位名称" min-width="10%"></el-table-column>
        <el-table-column prop="DWXZ_NAME" label="单位性质" min-width="5%"></el-table-column>
        <el-table-column prop="DWLX_NAME" label="单位类型" min-width="5%"></el-table-column>
        <el-table-column prop="XYLB_NAME" label="行业类别" min-width="6%"></el-table-column>
        <el-table-column prop="DWDH" label="联系方式" min-width="4%"></el-table-column>
        <el-table-column prop="FRDBXM" label="法人姓名" min-width="4%"></el-table-column>
        <el-table-column prop="FRDBGMSFHM" label="身份证号码" min-width="8%">
          <template slot-scope="scope">
            <p :title="scope.row.FRDBGMSFHM" @click="showTipsC(scope.row.FRDBGMSFHM,scope.$index)">{{scope.row.FRDBGMSFHM}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="CZDW_NAME" label="操作单位" min-width="10%"></el-table-column>
        <el-table-column label="操作时间" width="140px">
          <template slot-scope="scope">
            {{formatTime(scope.row.CZSJ)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
      <card-com v-if="curIndex===rowIndex" class="cardcom" :cardId="curCardId" @close="clickBlank" :style="{top:comTop}"></card-com>
    </el-card>
    <el-card class="cont-card" shadow="never" style="margin-top: 10px;">
      <div slot="header" class="clearfix">
        <span>详细</span>
      </div>
      <div>
        <el-row class="row">
          <el-col class="title" :span="4">税务登记号：</el-col>
          <el-col :span="6"><span>{{rowData.SWDJH}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">涉案金额：</el-col>
          <el-col :span="6"><span>{{rowData.SAJE}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">实际损失金额：</el-col>
          <el-col :span="6"><span>{{rowData.SJSSJE}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">挽回损失金额：</el-col>
          <el-col :span="6"><span>{{rowData.WHSSJE}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">直接责任人：</el-col>
          <el-col :span="6"><span>{{rowData.ZJZRR}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">主管人员：</el-col>
          <el-col :span="6"><span>{{rowData.ZGRY}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">处理方式：</el-col>
          <el-col :span="20"><span>{{rowData.ZXFS_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">违法犯罪事实：</el-col>
          <el-col :span="20"><span>{{rowData.WFFZSS}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">简要说明：</el-col>
          <el-col :span="20"><span>{{rowData.JYSM}}&nbsp;</span></el-col>
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
        <h1 style="border-bottom: 1px solid #CCC; font-size: 14px;">处罚情况</h1>
        <el-row class="row">
          <el-col class="title" :span="4">处罚日期：</el-col>
          <el-col :span="6"><span>{{formatTime(rowData.CFRQ)}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">处罚类型：</el-col>
          <el-col :span="6"><span>{{rowData.CFLX_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">处罚单位：</el-col>
          <el-col :span="6"><span>{{rowData.CFDW_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">办案人：</el-col>
          <el-col :span="6"><span>{{rowData.BAR_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">处罚情况：</el-col>
          <el-col :span="20"><span>{{rowData.CFQK}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">违法证据：</el-col>
          <el-col :span="20"><span>{{rowData.WFZJ}}&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getAjDeptByAjId
  } from '@/api/caseManage'
  import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
  import $ from 'jquery'
  export default {
    name: 'InvolvedCompany',
    props: ['ajbh'],
    data() {
      return {
        total: 0,
        pageSize: 4,
        page: 1,
        dataLoading: false,
        listData: [],
        AJBH: '',
        rowData: {},
        showCardCom: false, // 身份证查询旁的快捷查询组件
        curCardId: '', // 当前被点击的身份证号
        comTop: '',
        curIndex: '',
        rowIndex: 0
      }
    },
    components: {
      cardCom
    },
    methods: {
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      init() {
        this.dataLoading = true
        getAjDeptByAjId({
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
              this.$emit('involvedCompany', this.total)
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
      tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
        row.index = rowIndex
      },
      rowClick(row) {
        this.rowData = row
        this.comTop = $('.el-table__row').eq(row.index).position().top + 55 + 'px'
      },
      showTipsC(val, index) {
        this.curCardId = val
        this.curIndex = index
        this.rowIndex = index
      },
      clickBlank() {
        this.curIndex = ''
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
  .InvolvedCompany .title {
    text-align: right;
  }

  .InvolvedCompany .row {
    padding: 10px 0;
  }
  .cardcom{
    position: absolute;
    top: 55px;
    right: 25%;
  }
@media only screen and (max-width: 1366px) {
  .cardcom {
    right: 22%;
  }
}
</style>
