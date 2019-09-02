<template>
  <div class="intells_edit">
    <el-card class="box-card">
      <div>
        <p>
          <span style="margin-right:50px;">基本信息</span>
          <span style="background-color: #67C23A; padding: 1px 10px 5px 10px; margin-right:50px; color: #FFF" v-if="intell.SFSB">{{ intell.SFSB }}</span>
          <span style="background-color: #67C23A; padding: 1px 10px 5px 10px; color: #FFF" v-if="intell.BGCX==='0'">原报</span>
          <span style="background-color: #67C23A; padding: 1px 10px 5px 10px; color: #FFF" v-if="intell.BGCX==='1'">续报</span>
          <!-- <el-button type="text" @click="toList" style="float: right">返回</el-button> -->
          <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
        </p>
        <div class="intell">
          <div class="intell_left">
            <div class="content">
              <div class="intell_title">{{ intell.BT }}</div>
              <div class="intell_no">{{ intell.XSXXBH }}</div>
              <div class="intell_no">线索状态：</div>
              <div class="intell_zt">{{ intell.XSZT_NAME }}</div>
              <div class="card">
                <p class="intell_title_sub">涉事主体：{{ intell.SSZT_NAME }}</p>
                <p>涉事类别：{{ intell.SSLB_NAME }}</p>
                <p>采集时间：{{ formatTime(intell.CJSJ) }}</p>
              </div>
            </div>
            <div class="content">
              <div class="card">
                <p class="intell_title_sub">涉及重大活动：{{ intell.SJZDHD_NAME }}</p>
                <p>涉及敏感时间点：{{ intell.SJMGSD_NAME }}</p>
                <p>线索案(事)时间：{{ formatTime(intell.ASSJ) }}</p>
              </div>
              <div class="card">
                <p class="intell_title_sub">线索评级：{{ intell.XSPJ_NAME }}</p>
                <p>地点类别：{{ intell.ASDDLB_NAME }}</p>
                <p>更新时间：{{ formatTime(intell.SJGXSJ) }}</p>
              </div>
            </div>
          </div>
          <div class="intell_right">
            <p>涉及人数：{{ intell.SJRS }}</p>
            <p>涉及损失：{{ intell.SJSS_NAME }}</p>
            <p>涉事诱因：{{ intell.SSYY_NAME }}</p>
            <p>续报原纪录编号：{{ intell.XBYJLBH }}</p>
            <p>上报单位：{{ intell.SBDW }}</p>
            <p>填报单位：{{ intell.CJDW }}</p>
            <p>发生地所属省市：{{ intell.ASJFSDSSSS_NAME }}</p>
            <p>发生地祥址：{{ intell.ASJFSDXZ }}</p>
          </div>
        </div>
        <div class="intell intell_content">
          <div>线索正文：
            <div class="e-p-line ql-editor" v-html="intell.XXZW"></div>
          </div>
          <div>关键词：
            <div>{{ intell.GJC }}</div>
          </div>
          <div>线索要素：
            <span v-if="form.XSLX">{{getSYHFLLBText(form.XSLX)}}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;">
      <div>
        <p class="card_title">
          <span style="margin-left:22px;">线索地图：</span>
        </p>
        <img src="./images/clueMap.png" alt="" style="width: 100%">
      </div>
    </el-card>
    <el-card class="box-card" style="margin: 20px 0">
      <div>
        <p class="card_title">
          <span style="margin-left:22px;">线索类型：</span>
        </p>
        <el-cascader v-if="!form.XSLX" v-model="form.XSLX" placeholder="设置类型" change-on-select filterable :options="xslxList" clearable></el-cascader>
        <el-button v-if="!form.XSLX" type="primary" size="small" v-on:click="edit">保存</el-button>
        <span v-if="form.XSLX && form.XSLX[0] === '1'">食品</span>
        <span v-else-if="form.XSLX && form.XSLX[0] === '2'">药品</span>
        <span v-else-if="form.XSLX && form.XSLX[0] === '3'">环境</span>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-tabs v-model="activeName" style="padding: 0 5px;">
        <!--<el-tab-pane label="要素信息" name="first">-->
        <!--<el-card class="cont-card b_color_red">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>线索内包含3个企业</span>-->
        <!--</div>-->
        <!--<Carousel :carouselData="carouselData" :split="4"></Carousel>-->
        <!--</el-card>-->
        <!--<el-card class="cont-card b_color_yellow" style="margin-top: 20px;">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>线索内共3个人员</span>-->
        <!--</div>-->
        <!--<Carousel :carouselData="carouselData" :split="4"></Carousel>-->
        <!--</el-card>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="协查信息" name="second">
          <el-table :data="investigationData" v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="apply_dept_name" label="发起单位" min-width="10%"></el-table-column>
            <el-table-column prop="assist_title" label="协查标题" min-width="10%"></el-table-column>
            <el-table-column label="协查单位" min-width="20%">
              <template slot-scope="scope">
                <p v-html="getXcStr(scope.row.partake_dept)"></p>
              </template>
            </el-table-column>
            <el-table-column label="协查负责人" min-width="6%">
              <template slot-scope="scope">
                <p v-html="getXcStr(scope.row.duty_person)"></p>
              </template>
            </el-table-column>
            <el-table-column prop="case_name" label="协查案件" min-width="10%"></el-table-column>
            <el-table-column label="状态" width="100px">
              <template slot-scope="scope">
                {{getStatusText(scope.row.status)}}
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="investigationTotal > 0" layout="prev, pager, next" @current-change="caseCurrentChange"
                           :page-size="20" :total="investigationTotal" :current-page="investigationPage"
                           style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="反馈信息" name="third">
          <clue-result-list></clue-result-list>
        </el-tab-pane>
        <!--暂时屏蔽-->
        <!--<el-tab-pane label="时间轴" name="third">-->
        <!--<time-line-small :caseId="caseId"></time-line-small>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import { getIntell, editIntell, getQbAssist } from '@/api/intellSystem'
  import timeLineSmall from '../common/timeLineSmall'
  import Carousel from './components/Carousel'
  import ClueResultList from './components/ClueResultList'
  import icon from '@/assets/icon/icon.jpg'
  import ClueBackResult from './components/ClueBackResult'
  import {
    getAssistStatusText, getSYHFLLBList, getAJLBText
  } from '@/utils/codetotext'

  export default {
    name: 'edit',
    data() {
      return {
        activeName: 'second',
        investigationTotal: 0,
        investigationPage: 1,
        listLoading: false,
        editBtnLoading: false,
        investigationData: [],
        xslxList: getSYHFLLBList(),
        form: {
          id: this.$route.params.id, XSLX: []
        },
        intell: {},
        points: [
          {
            pointColor: 'red',
            img: 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png',
            text: '增加一个案件嫌疑人',
            date: '2018-05-21 12:10:10',
            reviewPeople: '审核领导：李四',
            reviewRemark: '审核意见：无'
          },
          { pointColor: 'green', text: '对企业发起协查', date: ' 2018-05-18 12:10:10' },
          { pointColor: 'green', text: '对企业发起协查', text1: '对人员发起协查', text2: '对物品检验鉴定', date: ' 2018-05-11 12:10:10' },
          { pointColor: 'green', text: '完善案件信息', text1: '补充案件信息', text2: '认领案件', date: ' 2018-05-01 12:10:10' }
        ],
        carouselData: [
          { id: '1', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: icon },
          { id: '2', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: icon },
          { id: '3', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: icon },
          { id: '4', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: icon },
          { id: '5', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: icon }
        ]
      }
    },
    components: {
      timeLineSmall,
      Carousel,
      ClueResultList,
      ClueBackResult
    },
    methods: {
      getSYHFLLBText(xslx) {
        if (xslx) {
          let text = ''
          for (let i = 0; i < xslx.length; i++) {
            text += i > 0 ? ' > ' : ''
            text += getAJLBText(xslx[i])
          }
          return text
        }
        return ''
      },
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      getXcStr(text) {
        if (text) {
          const array = JSON.parse(text)
          let str = ''
          for (let i = 0; i < array.length; i++) {
            str += '<span style="display: inline-block;width:100%">' + array[i]['name'] + '</span>'
          }
          return str
        }
      },
      getStatusText(text) {
        return getAssistStatusText(text)
      },
      caseCurrentChange(val) {
        this.page = val
        this.query()
      },
      detail() {
        const para = {
          id: this.$route.params.id
        }
        getIntell(para).then((response) => {
          this.intell = response.data
          if (response.data.XSLX) {
            this.form.XSLX = response.data.XSLX.split(',')
          }
        })
      },
      edit() {
        if (this.$route.params.id) {
          this.form.id = this.$route.params.id
          this.editBtnLoading = true
          this.form.XSLX = this.form.XSLX.join(',')
          editIntell(this.form).then((res) => {
            this.editBtnLoading = false
            this.$message({
              message: '修改成功', type: 'success'
            })
          }).catch(() => {
            this.editBtnLoading = false
          })
        }
      },
      getIntellData() {
        this.listLoading = true
        const para = {
          pageNum: this.investigationPage,
          pageSize: 10,
          xsId: this.$route.params.id
        }
        getQbAssist(para).then((response) => {
          this.listLoading = false
          this.investigationData = response.data.list
          this.investigationTotal = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      toList() {
        this.$router.push({
          path: '/intellSystem'
        })
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.detail()
        this.getIntellData()
      }
    }
  }
</script>

<style scoped>
  .box-card {
    margin: 2px 2px 0 2px;
  }

  .box-card .card_title {
    display: inline-block;
    height: 40px;
    line-height: 25px;
  }

  .intell {
    position: relative;
  }

  .intell_left {
    padding-left: 10px;
    width: 64%;
    display: inline-block;
  }

  .intell_left > p {
    line-height: 25px;
  }

  .intell_left .content {
    width: 45%;
    padding: 10px;
    display: inline-block;
  }

  .intell_left .content .intell_title {
    font-size: 18px;
    font-weight: bold;
    line-height: 32px;
  }

  .intell_left .content .intell_no,
  .intell_zt {
    /* color: #888; */
    line-height: 30px;
  }

  .intell_zt {
    /* color: #555; */
    padding-left: 20px;
  }

  .intell_left .content .card {
    border: 1px solid #00a0e9;
    padding: 10px 15px;
    font-size: 16px;
    margin-top: 10px;
    /* color: #888; */
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    /* -webkit-box-shadow: 1px 2px 2px rgb(182, 182, 182);
      box-shadow: 1px 2px 2px rgb(182, 182, 182); */
  }

  .intell_left .content .card .intell_title_sub {
    font-size: 16px;
    font-weight: bold;
    /* color: #555; */
  }

  .intell_left .content .card .intell_title_sub:before {
    content: '\2714';
    margin-right: 10px;
    color: #1e98d2;
  }

  .intell_left .content .card p {
    line-height: 30px;
  }

  .intell_right {
    width: 35%;
    display: inline-block;
    position: absolute;
  }

  .intell_right p {
    line-height: 30px;
  }

  .intell_right p:first-child {
    margin-top: 20px;
  }

  .intell_content,
  .intell_content > div {
    padding: 10px;
  }
</style>
