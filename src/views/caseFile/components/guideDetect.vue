<template>
<!-- 引导侦查 -->
<section>
  <div class="cell_title">
    <span class="small_line"></span>
    <span class="text">引导侦查</span>
  </div>
  <div class="bg ajInfo ydzccout">
    <!-- <title-pub :title="title" url=""></title-pub> -->
    <!-- <card-com v-if="gldwCard" class="cardcomajgl" :cardId="curCardId" @close="clickBlank"></card-com> -->
    <el-tabs class="archiveTab xddw" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="嫌疑人" name="first">
        <div slot="label">
          <p v-if="totalXyr>0">嫌疑人<span class="circle_number">{{totalXyr}}</span></p>
          <p v-else class="no_data_title">嫌疑人</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <div  v-loading="xyrLoading">
          <div class="clearfix">
            <p v-if="xyrData.length===0" style="text-align:center;margin: 20px 0;">暂无数据</p>
            <div v-else class="person_cell" v-for="(item,index) in xyrData" :key="index">
              <img v-if="item.xp" :src="'data:image/jpeg;base64,'+item.xp" alt="">
              <img v-else src="/static/image/personFile_images/defaultUuser.png">
              <p class="per_name link_text" @click="handleXyrDetail(item)">{{item.xm}}</p>
              <p class="link_text" @click="showTipsC(item.mgsfhm,index,'xyr')">{{item.mgsfhm}}</p>
              <!-- <card-com v-if="curIndexxyr===index" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com> -->
            </div>
          </div>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="xyrData.length > 0" layout="prev, pager, next" @current-change="handleCurrentChangeXyr"
                          :page-size="pageSize" :total="totalXyr" :current-page="pageXyr" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="受害人" name="second">
        <div slot="label">
          <p v-if="totalShr>0">受害人<span class="circle_number">{{totalShr}}</span></p>
          <p v-else class="no_data_title">受害人</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <div v-loading="shrLoading">
          <div class="clearfix">
            <p v-if="shrData.length===0" style="text-align:center;margin: 20px 0;">暂无数据</p>
            <div v-else class="person_cell" v-for="(item,index) in shrData" :key="index">
              <img v-if="item.xp" :src="'data:image/jpeg;base64,'+item.xp" alt="">
              <img v-else src="/static/image/personFile_images/defaultUuser.png">
              <p class="per_name underLine" @click="handleShrDetail(item)">{{item.xm}}</p>
              <p class="link_text"  @click="showTipsC(item.mgsfhm,index,'shr')">{{item.mgsfhm}}</p>
              <!-- <card-com v-if="curIndexshr===index" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com> -->
            </div>
          </div>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="shrData.length > 0" layout="prev, pager, next" @current-change="handleCurrentChangeShr"
                          :page-size="pageSize" :total="totalShr" :current-page="pageShr" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="案件关联单位" name="third">
        <div slot="label">
          <p v-if="totalDw>0">案件关联单位<span class="circle_number">{{totalDw}}</span></p>
          <p v-else class="no_data_title">案件关联单位</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table ref="companyTable" :data="dwData" class="statisticCollect" v-loading="dwLoading" max-height="186"> -->
        <el-table ref="companyTable" :data="dwData" class="statisticCollect" v-loading="dwLoading">
          <el-table-column prop="DWMC" label="单位名称" show-overflow-tooltip  fixed></el-table-column>
          <el-table-column prop="DWXZ_NAME" label="单位性质" show-overflow-tooltip></el-table-column>
          <el-table-column prop="DWLX_NAME" label="单位类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="XYLB_NAME" label="行业类别" show-overflow-tooltip></el-table-column>
          <el-table-column prop="DWDH" label="联系方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FRDBXM" label="法人姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FRDBGMSFHM" label="身份证号码" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <p :title="scope.row.FRDBGMSFHM" @click="showTipsC(scope.row.FRDBGMSFHM,scope.$index,'ajgl')">{{scope.row.FRDBGMSFHM}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="CZDW_NAME" label="操作单位" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作时间" width="160px">
            <template slot-scope="scope">
              {{formatTime(scope.row.CZSJ)}}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalDw > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeDw" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeDw"
                        :page-size="pageSizeDw" :total="totalDw" :current-page="pageDw" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="涉案物品" name="fourth">
        <div slot="label">
          <p v-if="totalSawp>0">涉案物品<span class="circle_number">{{totalSawp}}</span></p>
          <p v-else class="no_data_title">涉案物品</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table ref="goodTable" :data="sawpData" v-loading="sawpLoading" max-height="186"> -->
        <el-table ref="goodTable" :data="sawpData" v-loading="sawpLoading">
          <el-table-column prop="WPBH" label="物品编号" fixed></el-table-column>
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
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalSawp > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeSawp" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeSawp"
                        :page-size="pageSizeSawp" :total="totalSawp" :current-page="pageSawp" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="接收证据清单" name="fiveth">
        <div slot="label">
          <p v-if="totalZjqd>0">接收证据清单<span class="circle_number">{{totalZjqd}}</span></p>
          <p v-else class="no_data_title">接收证据清单</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <!-- <el-table :data="zjqdData" v-loading="zjqdLoading" max-height="186"> -->
        <el-table :data="zjqdData" v-loading="zjqdLoading">
          <el-table-column label="标题" min-width="10%"  fixed>
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
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalZjqd > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeZjqd" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeZjqd"
                        :page-size="pageSizeZjqd" :total="totalZjqd" :current-page="pageZjqd" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="法律文书" name="sixth" class="flws">
        <div slot="label">
          <p v-if="totalFlwsAll>0">法律文书<span class="circle_number">{{totalFlwsAll}}</span></p>
          <p v-else class="no_data_title">法律文书</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <div class="flws_wrap clearfix">
          <div class="flws_left clearfix">
            <p :class="curFlwsType==='1'?'active_flws':''" @click="switchFlws('1')">法 律 文 书（{{flwsNum}}）</p>
            <p :class="curFlwsType==='2'?'active_flws':''" @click="switchFlws('2')">无文书申请（{{nowsNum}}）</p>
          </div>
          <div class="flws_right clearfix" v-if="AJBH">
            <p class="left" @click="handleFlwsForm('1')">
              <img src="/static/image/caseFile_images/flws_add.png" alt="" class="flws_icon">
              新增文书
            </p>
            <p class="left" @click="handleFlwsForm('2')" v-if="flwsNum===0 && nowsNum===0">
              <!-- v-if="flwsNum===0" -->
              <img src="/static/image/caseFile_images/flws_apply.png" alt="" class="flws_icon">
              无文书申请
            </p>
          </div>
        </div>
        <legal-doc ref="legalDoc" :class="curFlwsType==='1'?'show':'hide'" :ajbh="AJBH" @totalFlws="parentListenFlws" style="width:100%;"></legal-doc>
        <nodoc-apply ref="nodocApply" :class="curFlwsType==='2'?'show':'hide'" :ajbh="AJBH" @totalNows="parentListenNows" @nowsApplyInfo="ListenAginApply" style="width:100%;"></nodoc-apply>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="嫌疑人详情" :visible.sync="xyrDetailDialog" width="70%" class="xyrDialog">
      <xyr-detail :xyrInfoDetail="xyrCurDetail"></xyr-detail>
    </el-dialog>
    <el-dialog :title="flwsDiaTitle" :visible.sync="flwsDialog" width="50%" style="max-height:90%;" :close-on-click-modal="false" @close="closeFlwsDialog">
      <flws-form v-show="flwsDialogType=='1'" :ajbh="AJBH" @changeDialog="ListenFlwsDialog" ref="flwsForm"></flws-form>
      <nows-form v-show="flwsDialogType=='2'" :ajbh="AJBH" @changeDialog="ListenFlwsDialog" :againNowsInfo="againNowsInfo"  ref="nowsForm"></nows-form>
    </el-dialog>
  </div>
  </section>
</template>
<script>
import {
  getAjDeptByAjId, getAJDETAILASSETS, getZjqdByAjbh
} from '@/api/caseManage'
// import { personByCardId } from '@/api/personSearch/personSearch'
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
import XyrDetail from './xyrDetail' // 嫌疑人详情
import legalDoc from './guideLegalDoc' // 法律文书列表
import nodocApply from './guideNodocApply' // 无文书申请列表
import flwsForm from './guideLegalDocForm' // 法律文书新增表单
import nowsForm from './guideNodocForm' // 无文书申请表单
import Bus from '@/utils/bus.js'

export default {
  props: ['ajbh', 'AjInfo'],
  name: 'index',
  components: {
    XyrDetail,
    cardCom,
    legalDoc,
    nodocApply,
    flwsForm,
    nowsForm
  },
  data() {
    return {
      title: '社保人事',
      activeName: 'first',
      ajInfo: {}, // 基础信息
      curUser: {},
      curDept: {}, // 当前登录部门信息
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '110101199008076340',
      xyrData: [], // 嫌疑人
      xyrLoading: false, // 嫌疑人loading
      shrData: [], // 受害人
      shrLoading: false, // 受害人loading
      dwData: [], // 案件关联单位
      dwLoading: false, // 案件关联单位loading
      sawpData: [], // 涉案物品
      sawpLoading: false, // 涉案物品loading
      zjqdData: [], // 接收证据清单
      zjqdLoading: false, // 接收证据清单loading
      pageSize: 5,
      pageXyr: 1, // 嫌疑人
      totalXyr: 0,
      pageShr: 1, // 受害人
      totalShr: 0,
      pageDw: 1, // 案件关联单位
      totalDw: 0,
      pageSawp: 1, // 涉案物品
      totalSawp: 0,
      pageZjqd: 1, // 接收证据清单
      totalZjqd: 0,
      moduleAllTotal: [], // 五种类型的总数
      cardNumber: '', // 存储身份证号
      xyrDetailDialog: false, // 嫌疑人详情弹框 是否显示，默认隐藏
      xyrCurDetail: {},
      curIndexxyr: '', // 存储当前嫌疑人被点击的身份证号索引值
      curIndexshr: '', // 存储当前受害人被点击的身份证号索引值
      AJBH: '', // 案件编号,
      gldwCard: false, // 是否显示案件关联单位身份证组件
      curCardId: '', // 存储当前被点击的身份证号
      pageSizeDw: 5, // 案件关联单位条数
      pageSizeSawp: 5, // 涉案物品条数
      pageSizeZjqd: 5, // 接收证据清单条数
      curFlwsType: '1', // 法律文书默认第一个签
      flwsNum: 0, // 法律文书个数
      nowsNum: 0, // 无文书申请个数
      totalFlwsAll: 0, // 法律文书两个页签 总和
      flwsFlag: 0, // 确保法律文书两个页签 都有值了 再相加
      flwsDialog: false, // 法律文书弹框
      flwsDialogType: '', // 显示法律文书哪个弹框标志
      flwsDiaTitle: '', // 法律文书弹框标题
      againNowsInfo: {}, // 无文书再次申请
      showFlwsBtn: false // 根据当前部门判断 是否展示法律文书的两个申请按钮
    }
  },
  watch: {
    ajbh(val) {
      this.curIndexxyr = ''
      this.curIndexshr = ''
      this.gldwCard = false
      this.moduleAllTotal = []
      this.flwsFlag = 0
      if (val) {
        this.AJBH = val
        this.ajInfo = this.AjInfo
        this.getData()
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      this.curIndexxyr = ''
      this.curIndexshr = ''
      this.gldwCard = false
      if (tab.name === 'sixth') { // 当点击的是 法律文书页签
        if (this.flwsNum > 0) {
          this.switchFlws('1')
        } else if (this.nowsNum > 0) { // 当无文书申请大于0 则优先展示无文书申请列表
          this.switchFlws('2')
        }
      }
    },
    init() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (sessionStorage.getItem('depToken')) {
        this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      }
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.ajInfo = this.AjInfo
        this.getData()
      }
    },
    getData() {
      this.handleXyr(true) // 嫌疑人
      this.handleShr(true) // 受害人
      this.handleDw(true) // 案件关联单位
      this.handleSawp(true) // 涉案物品
      this.handleZjqd(true) // 接收证据清单
      this.$refs.legalDoc.init() // 刷新法律文书列表
      this.$refs.nodocApply.init() // 刷新无文书列表申请
      this.judgeShowFlwsBtn()
    },
    judgeShowFlwsBtn() { // 判断是否展示法律文书的两个按钮
      // 未认领的 有两种情况DISTRICT_CODE前4 或 LADW前4  等于当前部门前4 ；已认领的deptCode 和当前的相等

      /*
      (this.ajInfo.DISTRICT_CODE) && this.ajInfo.DISTRICT_CODE.substr(0, 4) === this.curDept.depCode.substr(0, 4) ||
          ((this.ajInfo.LADW) && this.ajInfo.LADW.substr(0, 4) === this.curDept.depCode.substr(0, 4))
      */
      if (this.ajInfo) {
        if (this.ajInfo.deptCode && (this.ajInfo.deptCode === this.curDept.depCode)) { // 已认领
          this.showFlwsBtn = true
        } else { // 未认领
          if (this.ajInfo.DISTRICT_CODE) {
            if (this.ajInfo.DISTRICT_CODE.substr(0, 4) === this.curDept.depCode.substr(0, 4)) { this.showFlwsBtn = true }
          }
          if (this.ajInfo.LADW) {
            if (this.ajInfo.LADW.substr(0, 4) === this.curDept.depCode.substr(0, 4)) { this.showFlwsBtn = true }
          }
        }
      }
    },
    calculateAll() { // 计算总数
      if (this.moduleAllTotal.length === 6) {
        var all = 0
        for (let index = 0; index < this.moduleAllTotal.length; index++) {
          const element = this.moduleAllTotal[index]
          all += element
        }
        this.$resetSetItem('aj1', all) // 将总数存在session中
      } else {
        this.$resetSetItem('aj1', 0) // 将总数存在session中
      }
    },
    handleXyr(flag) { // 嫌疑人
      this.xyrLoading = true
      var param = {
        ajbh: this.AJBH,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.pageXyr
      }
      this.$query('page/ajxyr', param).then((res) => {
        this.xyrLoading = false
        if (res.code === '000000') {
          var data = res.data.list
          var flag = true
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              const item = data[index]
              if (!item.xp) {
                flag = false
                this.personDetailByCardXyr(item, data, flag)
              } else {
                this.personDetailByCardXyr(item, data, flag)
              }
            }
          } else {
            this.xyrLoading = false
            this.xyrData = []
          }
          this.totalXyr = res.data.totalCount
          this.moduleAllTotal.push(this.totalXyr)
          this.calculateAll()
        }
      }).catch(() => {
        this.xyrLoading = false
        this.moduleAllTotal.push(0)
        this.calculateAll()
      })
    },
    handleShr(flag) { // 受害人
      this.shrLoading = true
      var param = {
        ajbh: this.AJBH,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.pageShr
      }
      this.$query('page/ajshr', param).then((res) => {
        this.shrLoading = false
        if (res.code === '000000') {
          var data = res.data.list
          var flag = true
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              const item = data[index]
              if (!item.xp) {
                flag = false
                this.personDetailByCard(item, data, flag)
              } else {
                this.personDetailByCard(item, data, flag)
              }
            }
          } else {
            this.shrLoading = false
            this.shrData = []
          }
          this.totalShr = res.data.totalCount
          this.moduleAllTotal.push(this.totalShr)
          this.calculateAll()
        }
      }).catch(() => {
        this.shrLoading = false
        this.moduleAllTotal.push(0)
        this.calculateAll()
      })
    },
    personDetailByCardXyr(item, data, flag) {
      // 根据身份证号码查询嫌疑人人员详细信息
      this.xyrLoading = false // 服务资源未申请，暂时显示默认图片
      this.xyrData = data // 服务资源未申请到，暂时显示默认图片
      // if (flag) {  // 服务资源未申请到，暂时屏蔽图片请求资源接口
      //   this.xyrLoading = false
      //   this.xyrData = data
      // } else if (item.mgsfhm) {
      //   const para = {
      //     method: 'Query',
      //     byUserCard: item.mgsfhm,
      //     userCardId: this.curUser.cardNumber,
      //     userCertId: this.curUser.cardNumber,
      //     userDept: this.paramDept,
      //     userName: this.curUser.realName
      //   }
      //   personByCardId(para).then((response) => {
      //     this.xyrLoading = false
      //     if (response.code === '000000') {
      //       item.xp = response.data.xp || ''
      //     }
      //     this.xyrData = data
      //   }).catch(() => {
      //     this.xyrLoading = false
      //     this.xyrData = data
      //   })
      // } else {
      //   this.xyrLoading = false
      //   this.xyrData = data
      // }
    },
    personDetailByCard(item, data, flag) {
      // 根据身份证号码查询受害人人员详细信息
      this.shrLoading = false // 服务资源未申请，暂时显示默认图片
      this.shrData = data // 服务资源未申请，暂时显示默认图片
      // if (flag) { // 服务资源未申请到，暂时屏蔽图片请求资源接口
      //   this.shrLoading = false
      //   this.shrData = data
      // } else if (item.mgsfhm) {
      //   const para = {
      //     method: 'Query',
      //     byUserCard: item.mgsfhm,
      //     userCardId: this.curUser.cardNumber,
      //     userCertId: this.curUser.cardNumber,
      //     userDept: this.paramDept,
      //     userName: this.curUser.realName
      //   }
      //   personByCardId(para).then((response) => {
      //     this.shrLoading = false
      //     if (response.code === '000000') {
      //       item.xp = response.data.xp || ''
      //     }
      //     this.shrData = data
      //   }).catch(() => {
      //     this.shrLoading = false
      //     this.shrData = data
      //   })
      // } else {
      //   this.shrLoading = false
      //   this.shrData = data
      // }
    },
    handleDw(flag) { // 案件关联单位
      this.dwLoading = true
      getAjDeptByAjId({
        ajbh: this.AJBH,
        pageSize: this.pageSizeDw,
        pageNum: this.pageDw
      }).then((res) => {
        this.dwLoading = false
        if (res.code === '000000' && res.data.list) {
          this.dwData = res.data.list
          this.totalDw = res.data.totalCount
          this.pageSizeDw = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalDw)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.dwLoading = false
        this.moduleAllTotal.push(0)
        this.calculateAll()
      })
    },
    handleSawp(flag) { // 涉案物品
      this.sawpLoading = true
      getAJDETAILASSETS({
        pageNum: this.pageSawp,
        pageSize: this.pageSizeSawp,
        AJBH: this.AJBH
      }).then((res) => {
        this.sawpLoading = false
        if (res.code === '000000') {
          this.sawpData = res.data.list
          this.totalSawp = res.data.totalCount
          this.pageSizeSawp = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalSawp)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.sawpLoading = false
        this.moduleAllTotal.push(0)
        this.calculateAll()
      })
    },
    handleZjqd(flag) { // 接收证据清单
      this.zjqdLoading = true
      getZjqdByAjbh({
        ajbh: this.AJBH,
        pageSize: this.pageSizeZjqd,
        pageNum: this.pageZjqd
      }).then((res) => {
        this.zjqdLoading = false
        if (res.code === '000000' && res.data.list) {
          this.zjqdData = res.data.list
          this.totalZjqd = res.data.totalCount
          this.pageSizeZjqd = res.data.pageSize
          if (flag) { // 切换条数时 总数不变，不必要重新计算
            this.moduleAllTotal.push(this.totalZjqd)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.zjqdLoading = false
        this.moduleAllTotal.push(0)
        this.calculateAll()
      })
    },
    handleCurrentChangeXyr(val) { // 嫌疑人
      this.pageXyr = val
      this.handleXyr(false)
    },
    handleCurrentChangeShr(val) { // 受害人
      this.pageShr = val
      this.handleShr(false)
    },
    handleCurrentChangeDw(val) { // 案件关联单位分页
      this.pageDw = val
      this.handleDw(false)
    },
    handleSizeChangeDw(val) { // 案件关联单位条数
      this.pageDw = 1
      this.pageSizeDw = val
      this.handleDw(false)
    },
    handleCurrentChangeSawp(val) { // 涉案物品分页
      this.pageSawp = val
      this.handleSawp(false)
    },
    handleSizeChangeSawp(val) { // 涉案物品条数
      this.pageSawp = 1
      this.pageSizSawp = val
      this.handleSawp(false)
    },
    handleCurrentChangeZjqd(val) { // 接收证据清单分页
      this.pageZjqd = val
      this.handleZjqd(false)
    },
    handleSizeChangeZjqd(val) { // 接收证据清单条数
      this.pageZjqd = 1
      this.pageSizZjqd = val
      this.handleZjqd(false)
    },
    handleXyrDetail(row) { // 嫌疑人详情弹框
      this.xyrDetailDialog = true
      this.xyrCurDetail = row
    },
    handleComDetail(row) { // 单位详情
      this.$gotoid('/inforCollection/comRegisterDetail', JSON.stringify({ id: row.companyId, type: 'perArchive' }))
    },
    handlePitDetail(row) { // 受害人
      this.$gotoid('/inforCollection/comPedlarDetail', JSON.stringify({ id: row.pitchmanId, type: 'perArchive' }))
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    },
    showTipsC(val, index, type) {
      this.curCardId = val
      if (type === 'xyr') { // 嫌疑人
        this.curIndexxyr = index
      } else if (type === 'shr') { // 受害人
        this.curIndexshr = index
      } else { // 关联单位
        if (!this.gldwCard) {
          this.gldwCard = true
        }
      }
    },
    clickBlank() {
      this.curIndexxyr = ''
      this.curIndexshr = ''
      this.gldwCard = false
    },
    switchFlws(type) {
      this.curFlwsType = type
      if (type === '1') { // 法律文书

      } else if (type === '2') { // 无文书申请

      }
    },
    parentListenFlws(val) { // 监听法律文书的数量
      this.flwsNum = val
      this.flwsFlag += 1
      // console.log('1111-' + this.flwsNum + '---' + this.flwsFlag)
      // if (this.flwsFlag === 2) {
      this.totalFlwsAll = this.flwsNum + this.nowsNum
      if (this.flwsNum > 0 && this.nowsNum === 0) {
        this.switchFlws('1')
      }
      if (this.moduleAllTotal.length > 5) {
        this.moduleAllTotal[5] = this.totalFlwsAll // 5是法律文书的顺序  不能改
      } else {
        this.moduleAllTotal.push(this.totalFlwsAll)
      }
      this.calculateAll()
      // }
    },
    parentListenNows(val) { // 监听没有文书申请的数量
      this.nowsNum = val
      this.flwsFlag += 1
      // console.log('2222-' + this.nowsNum + '---' + this.flwsFlag)
      // if (this.flwsFlag === 2) {
      if (this.flwsNum === 0 && this.nowsNum > 0) { // 当法律文书为0 申请不为0时展示无文书标签
        this.switchFlws('2')
      }
      this.totalFlwsAll = this.flwsNum + this.nowsNum
      if (this.moduleAllTotal.length > 5) {
        this.moduleAllTotal[5] = this.totalFlwsAll
      } else {
        this.moduleAllTotal.push(this.totalFlwsAll)
      }
      this.calculateAll()
      // }
    },
    handleFlwsForm(type) { // 无文书申请
      // console.log(this.AJBH)
      this.flwsDialog = true
      this.flwsDialogType = type
      if (type === '1') {
        this.flwsDiaTitle = '新增文书'
      } else if (type === '2') {
        this.flwsDiaTitle = '无文书申请'
      }
    },
    ListenFlwsDialog(val) { // 法律文书 表单提交之后的监听
      this.flwsDialog = val
      if (this.flwsDialogType === '1') {
        this.$refs.legalDoc.init() // 刷新法律文书列表
      } else if (this.flwsDialogType === '2') {
        this.$refs.nodocApply.init() // 刷新无文书列表申请
      }
      Bus.$emit('ajgenggai')
    },
    ListenAginApply(row) { // 再次申请
      this.handleFlwsForm('2')
      this.againNowsInfo = row
      if (this.$refs.nowsForm) {
        this.$refs.nowsForm.init(row)
      }
    },
    closeFlwsDialog() {
      if (this.$refs.flwsForm) {
        this.$refs.flwsForm.reset()
      }
      if (this.$refs.nowsForm) {
        this.$refs.nowsForm.reset()
      }
    },
    handleActiveTab() { // 案件梗概点击后跳转到法律文书
      Bus.$on('changeActiveTab', message => {
        this.activeName = 'sixth'
        this.switchFlws(message)
      })
    }
  },
  created: function() {
    this.handleActiveTab()
  },
  // beforeDestroy() {
  //   Bus.$off('changeActiveTab')
  // },
  mounted() {
    // this.cardNumber = this.cardId
    this.init()
    this.handleActiveTab()
  },
  activated: function() {
    this.init()
    this.handleActiveTab()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.trajectory_wrap {
  width: 100%;
  min-height: 130px;
  white-space: nowrap;
  overflow-x: auto;
}
.trajectory_cell {
  width: 150px;
  text-align: center;
  float: left;
  margin-bottom: 10px;
  p {
    font-size: 13px;
    margin: 3px 0 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .moreText:hover {
    width: fit-content;
    text-align: center;
  }
}
.trajectory_cell .time_color {
  color: #00a0e9;
}
.trajectory_cell .address_color {
  color: #bce8fc;
}
.gjdash {
  float: left;
  margin: 55px 10px 0;
}
.circle_number {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 19px;
  border-radius: 20px;
  color: #ffffff;
  background: #00a0e9;
  font-size: 12px;
  margin-left: 5px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.person_cell {
  float: left;
  text-align: center;
  margin-right: 30px;
  position: relative;
  color: #bce8fc;
  img {
    width: 126px;
    height: 150px;
    border: 1px solid #00a0e9;
    border-radius: 2px;
  }
  p {
    width: 100%;
  }
  .link_text {
    cursor: pointer;
    text-shadow: 2px 2px 5px #fff;
    text-decoration: underline;
  }
  .per_name {
    margin-top: 10px;
  }
  .underLine {
    text-shadow: 2px 2px 5px #fff;
    text-decoration: underline;
  }
}
.cardcom {
  position: absolute;
  top: 60px;
  left: 167px;
}
.cardcomajgl {
  position: absolute;
  top: 37px;
  right: 22%;
}
.ydzccout {
  .xyrDialog {
    .el-dialog {
      margin-top: 8vh !important;
      height: 90%;
      overflow: auto;
    }
  }
  .el-tabs__content {
    padding: 10px 0 0 0;
  }
}
.flws_wrap {
  p {
    cursor: pointer;
  }
  .flws_left {
    float: left;
    border: 1px solid #005892;
    width: 280px;
    p {
      color: #ffffff;
      height: 26px;
      line-height: 26px;
      width: 50%;
      margin: 0;
      font-size: 15px;
      text-align: center;
      float: left;
    }
    .active_flws {
      background: #005892;
    }
  }
  .flws_right {
    float: right;
    .flws_icon {
      width: 22px;
      vertical-align: middle;
    }
    p {
      font-size: 15px;
      margin: 0;
      height: 28px;
      line-height: 28px;
      margin-right: 40px;
      display: inline-block;
    }
  }
}
.flws {
  .show {
    display: inline-block;
  }
  .hide {
    display: none;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
@media only screen and (max-width: 1366px) {
}
</style>
