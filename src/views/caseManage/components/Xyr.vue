<template>
  <div class="xyr xddw">
    <el-card class="cont-card" shadow="never">
      <el-table ref="xyrTable" :data="listData" @row-click="rowClick" :row-class-name="tableRowClassName" style="position: relative">
        <el-table-column prop="XM" label="姓名" min-width="5%"></el-table-column>
        <el-table-column label="身份证号码" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.GMSFHM" class="ellipsis-word" @click.stop="showTipsC(scope.row.GMSFHM,scope.$index)">{{scope.row.GMSFHM}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column prop="XB_NAME" label="性别" width="100px"></el-table-column>
        <el-table-column prop="MZ_NAME" label="民族" width="100px"></el-table-column>
        <el-table-column prop="WHCD_NAME" label="文化程度" width="100px"></el-table-column>
        <el-table-column prop="HYZK_NAME" label="婚姻状况" width="100px"></el-table-column>
        <el-table-column label="行政区划" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.XZQH_NAME" class="ellipsis-word">{{scope.row.XZQH_NAME}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column label="户籍地址详址" min-width="10%">
          <template slot-scope="scope">
            <p :title="scope.row.HJDZXZ" class="ellipsis-word">{{scope.row.HJDZXZ}}&nbsp;</p>
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
        <!-- <el-row class="row">
          <el-col class="title" :span="4">嫌疑人编号：</el-col>
          <el-col :span="7">
            <p :title="rowData.XYRBH" class="ellipsis-word">{{rowData.XYRBH}}&nbsp;</p>
          </el-col>
          <el-col class="title" :span="4">案件编号：</el-col>
          <el-col :span="7"><span>{{rowData.AJBH}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">人员编号：</el-col>
          <el-col :span="7"><span>{{rowData.RYBH}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">公民身份号码：</el-col>
          <el-col :span="7"><span @click="handlePersonDetailAll(rowData)" class="ajbh-color">{{rowData.GMSFHM}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">性别：</el-col>
          <el-col :span="6"><span>{{rowData.XB_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="3">出生日期：</el-col>
          <el-col :span="7"><span>{{formatTime(rowData.CSRQ)}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">婚姻状况：</el-col>
          <el-col :span="7"><span>{{rowData.HYZK_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="2">文化程度：</el-col>
          <el-col :span="7"><span>{{rowData.WHCD_NAME}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">籍贯详址：</el-col>
          <el-col :span="7"><span>{{rowData.JGXZ}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">户籍地址详址：</el-col>
          <el-col :span="7"><span>{{rowData.HJDZXZ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">抓获地点：</el-col>
          <el-col :span="7"><span>{{rowData.ZHDD}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">抓获人：</el-col>
          <el-col :span="7"><span>{{rowData.ZHDW}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">抓获单位联系电话：</el-col>
          <el-col :span="7"><span>{{rowData.XZ_ZHDWDH}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">到案时穿着：</el-col>
          <el-col :span="7"><span>{{rowData.DASCZ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">抓获单位：</el-col>
          <el-col :span="7"><span>{{rowData.SJRS_NAME}}&nbsp;</span></el-col>
          <el-col class="title" :span="4">案件名称：</el-col>
          <el-col :span="7"><span>{{rowData.AJMC}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">到案接收人：</el-col>
          <el-col :span="7"><span>{{rowData.DAJSR}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">到案配合工作情况：</el-col>
          <el-col :span="20"><span>{{rowData.DAPHGZQK}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">法律依据：</el-col>
          <el-col :span="20"><span>{{rowData.ZJFLYJ}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">履行方式：</el-col>
          <el-col :span="20"><span>{{rowData.LXFS}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">违法犯罪事实：</el-col>
          <el-col :span="20"><span>{{rowData.WFFZSS}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">嫌疑人处罚情况：</el-col>
          <el-col :span="20"><span>{{rowData.CFQK}}&nbsp;</span></el-col>
        </el-row>
        <el-row class="row">
          <el-col class="title" :span="4">嫌疑人备注：</el-col>
          <el-col :span="20"><span>{{rowData.BZ}}&nbsp;</span></el-col>
        </el-row> -->
         <el-form ref="form" :model="rowData" label-width="200px" size="small">
          <el-col :span="8">
            <el-form-item label="嫌疑人编号：">
              <span :title="rowData.XYRBH" class="ellipsis-word">{{rowData.XYRBH}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="人员编号：">
              <span :title="rowData.RYBH" class="ellipsis-word">{{rowData.RYBH}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="性别：">
              <span>{{rowData.XB_NAME}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="婚姻状况：">
              <span :title="rowData.HYZK_NAME" class="ellipsis-word">{{rowData.HYZK_NAME}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="籍贯详址：">
              <span :title="rowData.JGXZ" class="ellipsis-word">{{rowData.JGXZ}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="抓获地点：">
              <span :title="rowData.ZHDD" class="ellipsis-word">{{rowData.ZHDD}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="抓获单位联系电话：">
              <span>{{rowData.XZ_ZHDWDH}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="抓获单位：">
              <span :title="rowData.SJRS_NAME" class="ellipsis-word">{{rowData.SJRS_NAME}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="到案接收人：">
              <span>{{rowData.DAJSR}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="到案配合工作情况：">
              <span :title="rowData.DAPHGZQK" class="ellipsis-word">{{rowData.DAPHGZQK}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="法律依据：">
              <span :title="rowData.ZJFLYJ" class="ellipsis-word">{{rowData.ZJFLYJ}}&nbsp;</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件编号：">
              <span :title="rowData.AJBH" class="ellipsis-word">{{rowData.AJBH}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="公民身份号码：">
              <span @click="handlePersonDetailAll(rowData)" class="ajbh-color">{{rowData.GMSFHM}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="出生日期：">
              <span>{{rowData.CSRQ}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="文化程度：">
              <span>{{rowData.WHCD_NAME}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="出生日期：">
              <span>{{rowData.CSRQ}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="户籍地址详址：">
              <span :title="rowData.HJDZXZ" class="ellipsis-word">{{rowData.HJDZXZ}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="抓获人：">
              <span>{{rowData.ZHDW}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="到案时穿着：">
              <span>{{rowData.DASCZ}}&nbsp;</span>
            </el-form-item>
             <el-form-item label="案件名称：">
              <span>{{rowData.ZHDW}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="抓获人：">
              <span>{{rowData.ZHDW}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="履行方式：">
              <span>{{rowData.LXFS}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="嫌疑人处罚情况：">
              <span :title="rowData.CFQK" class="ellipsis-word">{{rowData.CFQK}}&nbsp;</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
             <el-form-item label="违法犯罪事实：">
              <span>{{rowData.WFFZSS}}&nbsp;</span>
            </el-form-item>
            <el-form-item label="嫌疑人备注：">
              <span>{{rowData.BZ}}&nbsp;</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getXyrByAjbh
  } from '@/api/caseManage'
  import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
  import $ from 'jquery'
  export default {
    name: 'xyr',
    props: ['ajbh'],
    data() {
      return {
        total: 0,
        pageSize: 4,
        page: 1,
        AJBH: '',
        dataLoading: false,
        listData: [],
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
        getXyrByAjbh({
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
              this.$emit('xyr', this.total)
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
        this.comTop = $('.el-table__row').eq(row.index).position().top + 55 + 'px'
      },
      handlePersonDetailAll(row) {
        this.$router.push({
          path: '/personnelFile/index',
          query: { cardId: row.GMSFHM }
        })
      },
      showTipsC(val, index) {
        this.curCardId = val
        this.curIndex = index
        this.rowIndex = index
      },
      clickBlank() {
        // this.showCardCom = false
        this.curIndex = ''
      },
      tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
        row.index = rowIndex
      }
    },
    mounted() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.init()
      }
    },
    watch: {
      // ajbh(val) {
      //   this.AJBH = val
      //   this.init()
      // }
    }
  }
</script>

<style scoped>
.xyr .title {
	text-align: right;
}

.xyr .row {
	padding: 10px 0;
}
.cardcom{
  position: absolute;
  top: 0;
  left: 23%;
}
@media only screen and (max-width: 1366px) {
  .cardcom {
    left: 26%;
  }
}
</style>
