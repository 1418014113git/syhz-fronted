<template>
  <section>
    <div class="ImportInfo">
      <!-- <title-pub :title="title" url=""></title-pub> -->
        <el-tabs v-model="activeName" @tab-click="handleClick" class="archiveTab">
          <el-tab-pane label="最近轨迹" name="first">
            <div slot="label">
              <p v-if="trajectoryData.length>0">最近轨迹
                <!-- <span class="circle_number">{{trajectoryData.length}}</span> -->
              </p>
              <p v-else class="no_data_title">最近轨迹</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <div class="trajectory_wrap clearfix" v-loading="zjgjLoading">
              <p v-if="trajectoryData.length===0" style="text-align:center;margin-top:20px;">暂无数据</p>
              <div v-for="(item,index) in trajectoryData" :key="index" class="clearfix" style="display:inline-block;">
                <img src="static/image/personFile_images/gjdash.png" alt="" srcset="" class="gjdash" v-if="index !== 0">
                <!-- 航班订座 -->
                <div class="trajectory_cell" v-if="item.type==='airs'">
                  <img src="static/image/personFile_images/hangban.png" alt="" srcset="" >
                  <p class="time_color">{{item.dateTime}}</p>
                  <p class="address_color" v-if="item.args">{{item.args.qfhzmc}} - {{item.args.ddhzmc}}</p>
                  <p v-if="item.args">航班 {{item.args.hkgsdm}}-{{item.args.hbh}}</p>
                </div>
                <!-- 网吧上网 -->
                <div class="trajectory_cell" v-else-if="item.type==='netbar'">
                  <img src="static/image/personFile_images/wangba.png" alt="" srcset="" >
                  <p class="time_color">{{item.dateTime}}</p>
                  <p class="address_color" v-if="item.args">{{item.args.yycsxzqh}}</p>
                  <p v-if="item.args">{{item.args.yycsmc}}</p>
                </div>
                <!-- 旅店住宿 -->
                <div class="trajectory_cell" v-else-if="item.type==='passengers'">
                  <img src="static/image/personFile_images/jiudian.png" alt="" srcset="" >
                  <p class="time_color">{{item.dateTime}}</p>
                  <p class="address_color" v-if="item.args">{{item.args.xzqh}}</p>
                  <p v-if="item.args" :class="item.args.lgmc.length > 10?'moreText':''">{{item.args.lgmc}}</p>
                </div>
                <!-- 火车订票 -->
                <div class="trajectory_cell" v-else-if="item.type==='train'">
                  <img src="static/image/personFile_images/huoche.png" alt="" srcset="" >
                  <p class="time_color">{{item.dateTime}}</p>
                  <p class="address_color" v-if="item.args">{{item.args.fz}} - {{item.args.dz}}</p>
                  <p v-if="item.args">{{item.args.cc}}次{{item.args.cxh}}车{{item.args.zwh}}号</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="航班订座" name="second">
            <div slot="label">
              <p v-if="totalHbdz>0">航班订座<span class="circle_number">{{totalHbdz}}</span></p>
              <p v-else class="no_data_title">航班订座</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-table :data="hbdzData" style="width: 100%;" v-loading="hbdzLoading" class="statisticCollect" max-height="156">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="hkgsmc" label="航空公司名称" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="hbrqFormat" label="航班日期" width="140"></el-table-column>
              <el-table-column prop="hbh" label="航班号" min-width="100"></el-table-column>
              <el-table-column prop="qfhzmc" label="起飞航站" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ddhzmc" label="到达航站" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="lkzt" label="旅客状态" min-width="100"></el-table-column>
              <el-table-column prop="lkxmYw" label="旅客姓名(英文)" min-width="130" show-overflow-tooltip></el-table-column>
              <el-table-column prop="lkcrjbs" label="出入境标识" min-width="100"></el-table-column>
              <el-table-column prop="lgsj" label="离港时间" min-width="170"></el-table-column>
              <el-table-column prop="jgsj" label="进港时间" min-width="170"></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
              <el-pagination v-if="totalHbdz > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeHbdz" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeHbdz"
                            :page-size="pageSizeHbdz" :total="totalHbdz" :current-page="pageHbdz" style="float:right;">
              </el-pagination>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="网吧上网" name="third">
            <div slot="label">
              <p v-if="totalWbsw>0">网吧上网<span class="circle_number">{{totalWbsw}}</span></p>
              <p v-else class="no_data_title">网吧上网</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-table :data="wbswData" style="width: 100%;" v-loading="wbswLoading" max-height="156">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="yycsmc" label="网吧营业场所名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="yycsxzqh" label="营业场所行政区划" show-overflow-tooltip></el-table-column>
              <el-table-column prop="yycsdz" label="地址" show-overflow-tooltip></el-table-column>
              <el-table-column label="上网开始时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{formatTime(scope.row.swkssjDate)}}
                </template>
              </el-table-column>
              <el-table-column prop="swzdh" label="上网终端号"></el-table-column>
              <el-table-column label="下网时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{formatTime(scope.row.xwsjDate)}}
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
              <el-pagination v-if="totalWbsw > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeWbsw" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeWbsw"
                            :page-size="pageSizeWbsw" :total="totalWbsw" :current-page="pageWbsw" style="float:right;">
              </el-pagination>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="旅店住宿" name="fourth">
            <div slot="label">
              <p v-if="totalLdzs>0">旅店住宿<span class="circle_number">{{totalLdzs}}</span></p>
              <p v-else class="no_data_title">旅店住宿</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-table :data="ldzsData" style="width: 100%;" v-loading="ldzsLoading" max-height="156">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <!-- <el-table-column prop="ssqbmMc" label="省市区" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="lgszdxzqhMc" label="旅店行政区划" show-overflow-tooltip></el-table-column>
              <el-table-column prop="lgmc" label="旅店名称" show-overflow-tooltip></el-table-column>
              <el-table-column label="入住时间" width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{formatTime(scope.row.rzsjDate)}}
                </template>
              </el-table-column>
              <el-table-column prop="rzfh" label="入住房号" width="90"></el-table-column>
              <el-table-column label="退房时间" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{formatTime(scope.row.tfsjDate)}}
                </template>
              </el-table-column>
              <el-table-column prop="lgdz" label="旅店地址" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
              <el-pagination v-if="totalLdzs > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeLdzs" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeLdzs"
                            :page-size="pageSizeLdzs" :total="totalLdzs" :current-page="pageLdzs" style="float:right;">
              </el-pagination>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="火车订票" name="fiveth">
            <div slot="label">
              <p v-if="totalHcdp>0">火车订票<span class="circle_number">{{totalHcdp}}</span></p>
              <p v-else class="no_data_title">火车订票</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-table :data="trainData" style="width: 100%;" v-loading="hcdpLoading" class="statisticCollect" max-height="156">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="ccrq" label="乘车日期" width="120">
                <template slot-scope="scope">
                  {{(scope.row.ccrq).substr(0,10)}}
                </template>
              </el-table-column>
              <el-table-column prop="cc" label="车次"></el-table-column>
              <el-table-column prop="fz" label="发站" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dz" label="到站" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="cxh" label="车厢号"></el-table-column>
              <el-table-column prop="zwh" label="座位号"></el-table-column>
              <el-table-column prop="spc" label="售票处" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ck" label="窗口"></el-table-column>
              <el-table-column prop="spsj" label="售票时间" width="190" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{(scope.row.spsj).substr(0,19)}}
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
              <el-pagination v-if="totalHcdp > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeHcdp" :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeHcdp"
                            :page-size="pageSizeHcdp" :total="totalHcdp" :current-page="pageHcdp" style="float:right;">
              </el-pagination>
            </el-col>
          </el-tab-pane>
        </el-tabs>
    </div>
  </section>
</template>
<script>
// import {
//   netBarByCardId, passengerByCardId,
//   flightInfoByCardId, trainInfoByCardId
// } from '@/api/personSearch/personSearch'
export default {
  props: ['cardId'],
  name: 'index',
  components: {},
  data() {
    return {
      activeName: 'first',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '152224199005230516',
      trajectoryData: [],
      zjgjLoading: false, // 最近轨迹loading
      hbdzData: [], // 航班订座
      hbdzLoading: false, // 航班订座loading
      wbswData: [], // 网吧上网
      wbswLoading: false, // 网吧上网
      ldzsData: [], // 旅店住宿
      ldzsLoading: false,
      trainData: [],
      hcdpLoading: false, // 火车订票
      pageSizeHbdz: 5,
      pageHbdz: 1, // 航班订座
      totalHbdz: 0,
      pageSizeWbsw: 5,
      pageWbsw: 1, // 网吧上网
      totalWbsw: 0,
      pageSizeLdzs: 5,
      pageLdzs: 1, // 旅店住宿
      totalLdzs: 0,
      pageSizeHcdp: 5,
      pageHcdp: 1, // 火车订票
      totalHcdp: 0,
      cardNumber: '', // 存储身份证号
      trajectoryAllTotal: [], // 四种类型的总数
      autoAddNumber: 0
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.init()
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      this.autoAddNumber = 0
      this.trajectoryAllTotal = []
      this.handleHbdz(true) // 航班订座
      this.handleWbsw(true) // 网吧上网
      this.handleLdzs(true) // 旅店住宿
      this.handleHcdp(true) // 火车订票
    },
    autoProcess() {
      this.autoAddNumber += 1
      if (this.autoAddNumber === 4) {
        this.handleZxgj(true) // 最新轨迹
      }
    },
    handleZxgj() { // 最新轨迹
      // this.zjgjLoading = true
      // this.$query('recentajectory', {
      //   zjhm: this.cardNumber
      // }).then((res) => {
      //   this.zjgjLoading = false
      //   if (res.code === '000000') {
      //     const list = res.data
      //     for (let i = 0; i < list.length; i++) {
      //       const bean = list[i]
      //       // var timeArr = bean.dateTime.substr(0, 10).split('-') // 拆分年月日
      //       // bean.dateTime = timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日'
      //       bean.args = JSON.parse(bean.args)
      //     }
      //     this.trajectoryData = list
      //   } else {
      //     this.trajectoryData = []
      //   }
      // }).catch(() => {
      //   this.zjgjLoading = false
      // })
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': [{
          'type': 'train',
          'args': { 'cc': 'D6766', 'cxh': '05', 'fz': '西安', 'dz': '榆林', 'zwh': '018F', 'time': 1557936000000 },
          'dateTime': '2019年05月16日'
        }, {
          'type': 'passengers',
          'args': { 'lgmc': '雅居公寓式酒店(高新四路店)', 'time': 1557827160000, 'rzfh': '413' },
          'dateTime': '2019年05月19日'
        }, {
          'type': 'passengers',
          'args': { 'lgmc': '如家酒店(西影路店)', 'time': 1557827160000, 'rzfh': '413' },
          'dateTime': '2019年05月14日'
        }, {
          'type': 'passengers',
          'args': { 'xzqh': '兴安盟科右前兴安盟科右前', 'lgmc': '布丁酒店(西安大雁塔建筑科技大学店)', 'time': 1557827160000, 'rzfh': '413' },
          'dateTime': '2019年05月11日'
        }, {
          'type': 'passengers',
          'args': { 'lgmc': '布丁酒店(西安大雁塔建筑科技大学店)', 'time': 1557746100000, 'rzfh': '904' },
          'dateTime': '2019年05月03日'
        }, {
          'type': 'passengers',
          'args': { 'lgmc': '世纪王朝酒店有限公司', 'time': 1557746100000, 'rzfh': '414' },
          'dateTime': '2019年04月13日'
        }, {
          'type': 'passengers',
          'args': { 'lgmc': '碧桂园凤凰酒店', 'time': 1557460680000, 'rzfh': '6021' },
          'dateTime': '2019年03月10日'
        }, {
          'type': 'train',
          'args': { 'cc': 'D6760', 'cxh': '06', 'fz': '西安', 'dz': '榆林', 'zwh': '002A', 'time': 1534089600000 },
          'dateTime': '2019年03月13日'
        }, {
          'type': 'train',
          'args': { 'cc': 'D6751', 'cxh': '04', 'fz': '延安', 'dz': '西安', 'zwh': '018F', 'time': 1534089600000 },
          'dateTime': '2018年08月13日'
        }]
      }
      if (res.code === '000000') {
        this.trajectoryData = res.data
      } else {
        this.trajectoryData = []
      }
    },
    handleHbdz(flag) { // 航班订座
      // this.hbdzLoading = true
      // flightInfoByCardId({
      //   method: 'Query',
      //   cardId: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName,
      //   pageSize: this.pageSizeHbdz,
      //   pageNum: flag ? 1 : this.pageHbdz
      // }).then((res) => {
      //   this.autoProcess() // 全局变量自动加1
      //   this.hbdzLoading = false
      //   this.hbcxClicked = true
      //   if (res.code === '000000') {
      //     this.hbdzData = res.data.list
      //     this.totalHbdz = res.data.totalCount
      //     this.pageSizeHbdz = res.data.pageSize
      //     this.trajectoryAllTotal.push(this.totalHbdz)
      //     this.calculateAll() // 计算总数
      //     for (let index = 0; index < this.hbdzData.length; index++) {
      //       const element = this.hbdzData[index]
      //       element.hbh = element.hkgsdm + '-' + element.hbh
      //       element.hbrqFormat = element.hbrq.substr(0, 4) + '年' + element.hbrq.substr(4, 2) + '月' + element.hbrq.substr(6, 2) + '日'
      //     }
      //   }
      // }).catch(() => {
      //   this.hbdzLoading = false
      //   this.autoProcess() // 全局变量自动加1
      // })
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'pageSize': 5,
          'pageNum': 1,
          'totalCount': 3,
          'list': [{
            'lgsj': '2018-07-01 14:35:00',
            'zjlx': '身份证',
            'hkgsmc': '天津航空有限责任公司',
            'hbrq': '20190516',
            'xb': '男',
            'lkzt': '已值机',
            'zjhm': '610111197907130277',
            'lggj': '',
            'lkcrjbs': '国内到国内',
            'hbh': '7618',
            'jggj': '',
            'hkgsdm': 'GS',
            'lkxmYw': 'WANGJIAHE',
            'lkxmZw': '张迪',
            'id': 1108,
            'hbhz': '',
            'ddhzmc': '咸阳',
            'qfhzmc': '杭州萧山',
            'createDate': '2019-06-12 11:41:00'
          }, {
            'lgsj': '2018-03-24 16:55:00',
            'zjlx': '身份证',
            'jgsj': '2018-03-24 19:00:00',
            'hkgsmc': '中国南方航空公司',
            'hbrq': '20180324',
            'xb': '男',
            'lkzt': '已值机',
            'zjhm': '610111197907130277',
            'lggj': '',
            'lkcrjbs': '国内到国内',
            'hbh': '6934',
            'jggj': '',
            'hkgsdm': 'CZ',
            'lkxmYw': 'WANGJIAHE',
            'lkxmZw': '张迪',
            'id': 1105,
            'hbhz': '',
            'ddhzmc': '杭州萧山',
            'qfhzmc': '青岛流亭',
            'createDate': '2019-06-12 11:30:43'
          }, {
            'lgsj': '2018-03-21 19:45:00',
            'zjlx': '身份证',
            'jgsj': '2018-03-21 23:35:00',
            'hkgsmc': '山东航空公司',
            'hbrq': '20180321',
            'xb': '男',
            'lkzt': '已值机',
            'zjhm': '610111197907130277',
            'lggj': '',
            'lkcrjbs': '国内到国内',
            'hbh': '4826',
            'jggj': '',
            'hkgsdm': 'SC',
            'lkxmYw': 'WANGJIAHE',
            'lkxmZw': '张迪',
            'id': 1106,
            'hbhz': '',
            'ddhzmc': '青岛流亭',
            'qfhzmc': '咸阳',
            'createDate': '2019-06-12 11:30:43'
          }]
        }
      }
      this.autoProcess() // 全局变量自动加1
      this.hbdzLoading = false
      this.hbcxClicked = true
      if (res.code === '000000') {
        this.hbdzData = res.data.list
        this.totalHbdz = res.data.totalCount
        this.pageSizeHbdz = res.data.pageSize
        this.trajectoryAllTotal.push(this.totalHbdz)
        this.calculateAll() // 计算总数
        for (let index = 0; index < this.hbdzData.length; index++) {
          const element = this.hbdzData[index]
          element.hbh = element.hkgsdm + '-' + element.hbh
          element.hbrqFormat = element.hbrq.substr(0, 4) + '年' + element.hbrq.substr(4, 2) + '月' + element.hbrq.substr(6, 2) + '日'
        }
      }
    },
    handleWbsw(flag) { // 网吧上网
      // this.wbswLoading = true
      // netBarByCardId({
      //   method: 'Query',
      //   cardId: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName,
      //   pageSize: this.pageSizeWbsw,
      //   pageNum: flag ? 1 : this.pageWbsw
      // }).then((res) => {
      //   this.autoProcess() // 全局变量自动加1
      //   this.wbswLoading = false
      //   this.wbswClicked = true
      //   if (res.code === '000000') {
      //     this.wbswData = res.data.list
      //     this.totalWbsw = res.data.totalCount
      //     this.pageSizeWbsw = res.data.pageSize
      //     this.trajectoryAllTotal.push(this.totalWbsw)
      //     this.calculateAll() // 计算总数
      //     for (let index = 0; index < this.wbswData.length; index++) {
      //       const element = this.wbswData[index]
      //       if (element.yycsmc.indexOf('陕西省') > -1) { // 网吧营业场所名称
      //         element.yycsmc = element.yycsmc.replace(/陕西省/g, '')
      //       }
      //       if (element.yycsxzqh.indexOf('陕西省') > -1) { // 营业场所行政区划
      //         element.yycsxzqh = element.yycsxzqh.replace(/陕西省/g, '')
      //       }
      //       if (element.yycsdz.indexOf('陕西省') > -1) { // 地址
      //         element.yycsdz = element.yycsdz.replace(/陕西省/g, '')
      //       }
      //     }
      //   }
      // }).catch(() => {
      //   this.wbswLoading = false
      //   this.autoProcess() // 全局变量自动加1
      // })
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'pageSize': 5,
          'pageNum': 1,
          'totalCount': 4,
          'list': [{
            'csrq': '19990320',
            'xwsjDate': '2019-05-13 19:36:41',
            'zjlx': '身份证',
            'xb': '男',
            'zjhm': '610111197907130277',
            'yycsmc': '树先生de网咖',
            'yycsdz': '陕西省西安市雁塔区沣惠南路与科技路交叉口杰座广场招商银行二楼',
            'yycsxzqh': '西安市雁塔区',
            'swzdh': '021',
            'swkssjDate': '2018-04-10 19:24:52',
            'id': 1036,
            'swryxm': '张迪',
            'createDate': '2019-06-12 16:33:52'
          }, {
            'csrq': '19990320',
            'xwsjDate': '2018-04-10 19:22:41',
            'yycsmc': '绿树电竞馆(曲江银泰店)',
            'yycsdz': '雁塔南路410号银泰百货F4层C20',
            'zjlx': '身份证',
            'yycsxzqh': '西安市雁塔区',
            'swzdh': '021',
            'xb': '男',
            'id': 1020,
            'zjhm': '610111197907130277',
            'swryxm': '张迪',
            'createDate': '2019-06-12 14:23:43'
          }, {
            'csrq': '19990320',
            'xwsjDate': '2018-04-10 19:20:41',
            'zjlx': '身份证',
            'xb': '男',
            'zjhm': '610111197907130277',
            'yycsmc': '动感网咖(中贸广场店)',
            'yycsdz': '碑林区中贸广场四民巷3号楼1号商铺',
            'yycsxzqh': '西安市碑林区',
            'swzdh': '021',
            'swkssjDate': '2018-04-10 19:16:52',
            'id': 1019,
            'swryxm': '张迪',
            'createDate': '2019-06-12 14:23:43'
          }, {
            'csrq': '19990320',
            'xwsjDate': '2018-04-10 19:16:41',
            'zjlx': '身份证',
            'xb': '男',
            'zjhm': '610111197907130277',
            'yycsmc': '城池网咖',
            'yycsdz': '陕西省西安市碑林区西大街与广济街十字荣民国际饭店负一层(西大街百盛斜对面)',
            'yycsxzqh': '西安市碑林区',
            'swzdh': '021',
            'swkssjDate': '2018-04-10 18:06:52',
            'id': 1018,
            'swryxm': '张迪',
            'createDate': '2019-06-12 14:23:43'
          }]
        }
      }
      this.autoProcess() // 全局变量自动加1
      this.wbswLoading = false
      this.wbswClicked = true
      if (res.code === '000000') {
        this.wbswData = res.data.list
        this.totalWbsw = res.data.totalCount
        this.pageSizeWbsw = res.data.pageSize
        this.trajectoryAllTotal.push(this.totalWbsw)
        this.calculateAll() // 计算总数
        for (let index = 0; index < this.wbswData.length; index++) {
          const element = this.wbswData[index]
          if (element.yycsmc.indexOf('陕西省') > -1) { // 网吧营业场所名称
            element.yycsmc = element.yycsmc.replace(/陕西省/g, '')
          }
          if (element.yycsxzqh.indexOf('陕西省') > -1) { // 营业场所行政区划
            element.yycsxzqh = element.yycsxzqh.replace(/陕西省/g, '')
          }
          if (element.yycsdz.indexOf('陕西省') > -1) { // 地址
            element.yycsdz = element.yycsdz.replace(/陕西省/g, '')
          }
        }
      }
    },
    handleLdzs(flag) { // 旅店住宿
      // this.ldzsLoading = true
      // passengerByCardId({
      //   method: 'Query',
      //   cardId: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName,
      //   pageSize: this.pageSizeLdzs,
      //   pageNum: flag ? 1 : this.pageLdzs
      // }).then((res) => {
      //   this.autoProcess() // 全局变量自动加1
      //   this.ldzsLoading = false
      //   this.ldxxClicked = true
      //   if (res.code === '000000') {
      //     this.ldzsData = res.data.list
      //     this.totalLdzs = res.data.totalCount
      //     this.pageSizeLdzs = res.data.pageSize
      //     this.trajectoryAllTotal.push(this.totalLdzs)
      //     this.calculateAll() // 计算总数
      //     for (let index = 0; index < this.ldzsData.length; index++) {
      //       const element = this.ldzsData[index]
      //       if (element.lgszdxzqhMc.indexOf('陕西省') > -1) { // 旅店行政区划
      //         element.lgszdxzqhMc = element.lgszdxzqhMc.replace(/陕西省/g, '')
      //       }
      //       if (element.lgdz.indexOf('陕西省') > -1) { // 旅店地址
      //         element.lgdz = element.lgdz.replace(/陕西省/g, '')
      //       }
      //     }
      //   }
      // }).catch(() => {
      //   this.ldzsLoading = false
      //   this.autoProcess() // 全局变量自动加1
      // })
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'pageSize': 5,
          'pageNum': 1,
          'totalCount': 5,
          'list': [{
            'tfsjDate': '2019-05-15 14:04:00',
            'csrq': '19790713',
            'ssqbmMc': '陕西省西安市',
            'lgmc': '雅居公寓式酒店(高新四路店)',
            'lgdz': '陕西省西安市雁塔区高新四路城市皇冠小区公寓13层05号',
            'lgszdxzqhMc': '陕西省西安市',
            'zjlx': '11',
            'xb': '1',
            'zjhm': '610111197907130277',
            'xm': '张迪',
            'ssqbm': '152224',
            'lgszdxzqh': '152221',
            'id': 1095,
            'rzsjDate': '2019-05-14 17:46:00',
            'rzfh': '413',
            'createDate': '2019-06-11 17:53:55'
          }, {
            'tfsjDate': '2019-04-10 14:04:00',
            'csrq': '19790713',
            'ssqbmMc': '陕西省西安市',
            'lgmc': '如家酒店(西影路店)',
            'lgdz': '西安市雁塔区西影路301号',
            'lgszdxzqhMc': '陕西省西安市',
            'zjlx': '11',
            'xb': '1',
            'zjhm': '610111197907130277',
            'xm': '张迪',
            'ssqbm': '152224',
            'lgszdxzqh': '152221',
            'id': 1097,
            'rzsjDate': '2019-04-09 20:42:00',
            'rzfh': '113',
            'createDate': '2019-06-11 17:53:55'
          }, {
            'tfsjDate': '2019-03-15 10:04:00',
            'csrq': '19790713',
            'ssqbmMc': '陕西省西安市',
            'lgmc': '布丁酒店(西安大雁塔建筑科技大学店)',
            'lgdz': '西安市未央区明光路凤和路39号大院',
            'lgszdxzqhMc': '陕西省西安市',
            'zjlx': '11',
            'xb': '1',
            'zjhm': '610111197907130277',
            'xm': '张迪',
            'ssqbm': '152224',
            'lgszdxzqh': '152221',
            'id': 1099,
            'rzsjDate': '2019-03-14 21:16:00',
            'rzfh': '413',
            'createDate': '2019-06-11 18:15:48'
          }, {
            'tfsjDate': '2019-01-18 12:04:00',
            'csrq': '19790713',
            'ssqbmMc': '陕西省西安市',
            'lgmc': '布丁酒店(西安大雁塔建筑科技大学店)',
            'lgdz': '西安市碑林区兴庆路南3号(交通大学东南门向南300米)',
            'lgszdxzqhMc': '陕西省西安市',
            'zjlx': '11',
            'xb': '1',
            'zjhm': '610111197907130277',
            'xm': '张迪',
            'ssqbm': '152224',
            'lgszdxzqh': '152221',
            'id': 1100,
            'rzsjDate': '2019-01-17 22:45:00',
            'rzfh': '413',
            'createDate': '2019-06-11 18:15:48'
          }, {
            'tfsjDate': '2018-11-18 17:47:00',
            'csrq': '19790713',
            'ssqbmMc': '陕西省西安市',
            'lgmc': '汉庭酒店(交大店)',
            'lgdz': '西安市碑林区兴庆路南3号(交通大学东南门向南300米)',
            'lgszdxzqhMc': '陕西省西安市',
            'zjlx': '11',
            'xb': '1',
            'zjhm': '610111197907130277',
            'xm': '张迪',
            'ssqbm': '152224',
            'lgszdxzqh': '152221',
            'id': 1096,
            'rzsjDate': '2018-11-14 20:15:00',
            'rzfh': '914',
            'createDate': '2019-06-11 17:53:55'
          }]
        }
      }
      this.autoProcess() // 全局变量自动加1
      this.ldzsLoading = false
      this.ldxxClicked = true
      if (res.code === '000000') {
        this.ldzsData = res.data.list
        this.totalLdzs = res.data.totalCount
        this.pageSizeLdzs = res.data.pageSize
        this.trajectoryAllTotal.push(this.totalLdzs)
        this.calculateAll() // 计算总数
        for (let index = 0; index < this.ldzsData.length; index++) {
          const element = this.ldzsData[index]
          if (element.lgszdxzqhMc.indexOf('陕西省') > -1) { // 旅店行政区划
            element.lgszdxzqhMc = element.lgszdxzqhMc.replace(/陕西省/g, '')
          }
          if (element.lgdz.indexOf('陕西省') > -1) { // 旅店地址
            element.lgdz = element.lgdz.replace(/陕西省/g, '')
          }
        }
      }
    },
    handleHcdp(flag) { // 火车订票
      // this.hcdpLoading = true
      // trainInfoByCardId({
      //   method: 'Query',
      //   cardId: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName,
      //   pageSize: this.pageSizeHcdp,
      //   pageNum: flag ? 1 : this.pageHcdp
      // }).then((res) => {
      //   this.autoProcess() // 全局变量自动加1
      //   this.hcdpLoading = false
      //   this.hbcxClicked = true
      //   if (res.code === '000000') {
      //     this.trainData = res.data.list
      //     this.totalHcdp = res.data.totalCount
      //     this.pageSizeHcdp = res.data.pageSize
      //     this.trajectoryAllTotal.push(this.totalHcdp)
      //     this.calculateAll() // 计算总数
      //   }
      // }).catch(() => {
      //   this.hcdpLoading = false
      //   this.autoProcess() // 全局变量自动加1
      // })
      const res = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'pageSize': 5,
          'pageNum': 1,
          'totalCount': 5,
          'list': [{
            'spsj': '2018-08-06 17:46:00.0',
            'pz': '',
            'zwh': '018F',
            'zjhm': '610111197907130277',
            'sfdXzqh': '610100',
            'cxh': '05',
            'djdwGajgjgdm': '',
            'fz': '西安',
            'djrGmsfhm': '',
            'dz': '榆林',
            'djdwGajgmc': '',
            'bz': '',
            'id': 1026,
            'createDate': '2019-06-24 16:13:23',
            'cc': 'D6766',
            'spc': 'BTC',
            'ck': '11',
            'xb': '男',
            'xxzjbh': 'HTCKSPXX201808062113197781',
            'mddXzqh': '610800',
            'ccrq': '2019-05-16 00:00:00',
            'djrXm': '',
            'xm': '张迪',
            'ph': 'D063395',
            'pj': ''
          }, {
            'spsj': '2018-08-13 12:54:00.0',
            'pz': '',
            'zwh': '002A',
            'zjhm': '610111197907130277',
            'sfdXzqh': '610100',
            'cxh': '06',
            'djdwGajgjgdm': '',
            'fz': '西安',
            'djrGmsfhm': '',
            'dz': '榆林',
            'djdwGajgmc': '',
            'bz': '',
            'id': 1006,
            'createDate': '2019-06-24 16:13:22',
            'cc': 'D6760',
            'spc': 'BTC',
            'ck': '5',
            'xb': '男',
            'xxzjbh': 'HTCKSPXX201808131322554887',
            'mddXzqh': '610800',
            'ccrq': '2018-08-13 00:00:00',
            'djrXm': '',
            'xm': '张迪',
            'ph': 'X058758',
            'pj': ''
          }, {
            'spsj': '2018-08-13 05:56:00.0',
            'pz': '',
            'zwh': '018F',
            'zjhm': '610111197907130277',
            'sfdXzqh': '610100',
            'cxh': '04',
            'djdwGajgjgdm': '',
            'fz': '西安',
            'djrGmsfhm': '',
            'dz': '延安',
            'djdwGajgmc': '',
            'bz': '',
            'id': 1007,
            'createDate': '2019-06-24 16:13:22',
            'cc': 'D6751',
            'spc': 'HHC',
            'ck': '12',
            'xb': '男',
            'xxzjbh': 'HTCKSPXX201808130627481163',
            'mddXzqh': '610200',
            'ccrq': '2018-08-13 00:00:00',
            'djrXm': '',
            'xm': '张迪',
            'ph': 'D091032',
            'pj': ''
          }, {
            'spsj': '2018-06-04 10:50:00.0',
            'pz': '',
            'zwh': '006F',
            'zjhm': '610111197907130277',
            'sfdXzqh': '610900',
            'cxh': '05',
            'djdwGajgjgdm': '',
            'fz': '安康',
            'djrGmsfhm': '',
            'dz': '西安',
            'djdwGajgmc': '',
            'bz': '',
            'id': 1016,
            'createDate': '2019-06-24 16:13:22',
            'cc': 'D6773',
            'spc': 'HHC',
            'ck': '8',
            'xb': '男',
            'xxzjbh': 'HTCKSPXX2018060411345477',
            'mddXzqh': '610100',
            'ccrq': '2018-06-04 00:00:00',
            'djrXm': '',
            'xm': '张迪',
            'ph': 'M005584',
            'pj': ''
          }, {
            'spsj': '2018-06-04 20:12:00.0',
            'pz': '',
            'zwh': '0008',
            'zjhm': '610111197907130277',
            'sfdXzqh': '610100',
            'cxh': '05',
            'djdwGajgjgdm': '',
            'fz': '西安',
            'djrGmsfhm': '',
            'dz': '安康',
            'djdwGajgmc': '',
            'bz': '',
            'id': 1017,
            'createDate': '2019-06-24 16:13:23',
            'cc': 'K196',
            'spc': 'BTC',
            'ck': '49',
            'xb': '男',
            'xxzjbh': 'HTCKSPXX20180604210319893',
            'mddXzqh': '610900',
            'ccrq': '2018-06-04 00:00:00',
            'djrXm': '',
            'xm': '张迪',
            'ph': 'D057719',
            'pj': ''
          }]
        }
      }
      this.autoProcess() // 全局变量自动加1
      this.hcdpLoading = false
      this.hbcxClicked = true
      if (res.code === '000000') {
        this.trainData = res.data.list
        this.totalHcdp = res.data.totalCount
        this.pageSizeHcdp = res.data.pageSize
        this.trajectoryAllTotal.push(this.totalHcdp)
        this.calculateAll() // 计算总数
      }
    },
    calculateAll() { // 计算总数
      if (this.trajectoryAllTotal.length === 4) {
        var all = 0
        for (let index = 0; index < this.trajectoryAllTotal.length; index++) {
          const element = this.trajectoryAllTotal[index]
          all += element
        }
        this.$resetSetItem('t4', all) // 将总数存在session中
      } else {
        this.$resetSetItem('t4', 0) // 将总数存在session中
      }
    },
    handleCurrentChangeHbdz(val) { // 航班订座分页
      this.pageHbdz = val
      this.handleHbdz(false)
    },
    handleCurrentChangeWbsw(val) { // 网吧上网分页
      this.pageWbsw = val
      this.handleWbsw(false)
    },
    handleCurrentChangeLdzs(val) { // 旅店住宿分页
      this.pageLdzs = val
      this.handleLdzs(false)
    },
    handleCurrentChangeHcdp(val) { // 火车订票分页
      this.pageHcdp = val
      this.handleHcdp(false)
    },
    handleSizeChangeHbdz(val) { // 航班订座条数
      this.pageHbdz = 1
      this.pageSizeHbdz = val
      this.handleHbdz(false)
    },
    handleSizeChangeWbsw(val) { // 网吧上网条数
      this.pageWbsw = 1
      this.pageSizeWbsw = val
      this.handleWbsw(false)
    },
    handleSizeChangeLdzs(val) { // 旅店住宿条数
      this.pageLdzs = 1
      this.pageSizeLdzs = val
      this.handleLdzs(false)
    },
    handleSizeChangeHcdp(val) { // 火车订票条数
      this.pageHcdp = 1
      this.pageSizeHcdp = val
      this.handleHcdp(false)
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
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
.no_data_title {
  color: #586d7e;
  text-shadow: none;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
