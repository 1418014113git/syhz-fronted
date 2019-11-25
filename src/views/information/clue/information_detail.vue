<template>
  <div>
    <el-row class="detail">
      <img src="@/assets/icon/back.png"  class="goBack" @click="backList">   <!--返回-->
    </el-row>
    <div class="ajInfo">
      <div class="title">
        <div class="left">基本信息</div>
      </div>
      <el-form ref="form" :model="information" size="small" label-width="108px" label-position="left">
        <el-row class="pat">
          <span class="whiteColor ajlx" :class="clueSortLable.bg">{{clueSortLable.lx}}</span>
          <span class="whiteColor ajlx" :class="shareStatusLable.bg">{{shareStatusLable.lx}}</span>
          <span class="whiteColor ajlx" :class="collectionTypeLable.bg">{{collectionTypeLable.lx}}</span>
        </el-row>
        <el-row class="pat">
          <h3>{{information.clueName}}</h3>
        </el-row>
        <el-row class="pat">
          <el-col :span="8" class="pdr">
            <el-form-item label="案件编号：">
              {{information.clueNumber}}
            </el-form-item>
            <el-form-item label="填报人：">
              {{information.submitPersonName}}
            </el-form-item>
          </el-col>
          <el-col :span="8" class="pdr">
            <el-form-item label="发生地行政区划：">
              {{information.collectionLocationLable}}
            </el-form-item>
            <el-form-item label="填报时间：">
              {{information.submitTime}}
            </el-form-item>
          </el-col>
          <el-col :span="8" class="pdr">
            <el-form-item label="发生时间：">
              {{information.clueTime}}
            </el-form-item>
            <el-form-item label="发生地详细址：">
              {{information.locationDetailed}}
            </el-form-item>
            <el-form-item label="填报单位：">
              {{information.submitDeptName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="pat">
          <el-col>
            <el-form-item label="线索内容：">
              {{information.clueContent}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="pat">
          <el-col>
            <el-form-item label="线索附件：">
              <div v-if="attachments.length > 0" class="footer">
                <p v-for="(item,index) in attachments" :key="index">
                  <a @click="downFile(item.path)">{{item.name}}</a>
                </p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="ajInfo" style="margin-top: 20px; height: 300px;">
      <div class="title">
        <div class="left">线索位置信息</div>
      </div>
      <!--<remote-js src="http://10.100.5.116:7001/PGIS_S_TileMap/js/EzMapAPI.js"></remote-js>-->
      <div id="map" style="width:100%; height:90%;border: 0px solid #FF0000;" ></div>
    </div>

    <div class="ajInfo" style="margin-top: 20px;">
      <div class="title">
        <div class="left">分享信息</div>
      </div>
      <section style="margin-top: 10px;">
        <div class="ajParallel">
          <el-table :data="dataDeptList" style="width: 100%;" max-height="156">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="shareTime" label="分享时间"></el-table-column>
            <el-table-column prop="sharePersonName" label="分享人员"></el-table-column>
            <el-table-column prop="shareDeptName" label="分享单位"></el-table-column>
            <el-table-column prop="receiveDeptName" label="接收单位" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="95px">
              <template slot-scope="scope">
                <el-button type="info" icon="el-icon-document" circle title="详请" @click="getShareDetail(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle title="撤回" @click="deptShareDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <el-dialog title="分享信息" :visible.sync="dialogVisible" size="small" width="80%">
        <section style="margin-top: 10px;">
          <div class="ajParallel">
            <el-table :data="dataPsonList" style="width: 100%;" max-height="156">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="shareTime" label="分享时间"></el-table-column>
              <el-table-column prop="sharePersonName" label="分享人员"></el-table-column>
              <el-table-column prop="shareDeptName" label="分享单位"></el-table-column>
              <el-table-column prop="receivePersonName" label="接收人员" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="95px">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" circle title="撤回" @click="psonShareDelete(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </section>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // import remoteJs from '@/components/remote-js'
  export default {
    props: ['type'],
    name: 'shareEdit',
    components: {
      // remoteJs
    },
    data() {
      return {
        _MapApp: null,
        g_overlay: null,
        g_edit: false,
        dataDeptList: [],
        dataPsonList: [],
        clueSortLable: {}, // 存储转换成数组的线索分类
        colorData1: ['bg1', 'bg2', 'bg3', 'bg4'], // 线索分类文字背景颜色默认集合
        shareStatusLable: {}, // 存储转换成数组的线索分享状态
        colorData2: ['bg5', 'bg6'], // 分享状态文字背景颜色默认集合
        collectionTypeLable: {}, // 存储转换成数组的采集类型
        colorData3: ['bg7', 'bg8'], // 采集类型文字背景颜色默认集合
        information: {},
        attachments: [],
        xzqhOptions: [],
        share: {},
        loading: false,
        dialogVisible: false,
        nowDeptRow: {}
      }
    },
    methods: {
      deptShareDelete(row) { // 撤回
        this.$confirm('确认撤回该分享吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true
          var param = {
            id: row.id,
            shareDepartmentId: row.shareDepartmentId
          }
          this.$update('clue/deleteDeptShare/', param).then((response) => {
            this.loading = false
            if (response.code === '000000') {
              this.$message({
                message: '撤回成功', type: 'success'
              })
              this.getShare()
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      },
      psonShareDelete(row) { // 撤回
        this.$confirm('确认撤回该分享吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true
          var param = {
            id: row.id
          }
          this.$update('clue/deletePsonShare/', param).then((response) => {
            this.loading = false
            if (response.code === '000000') {
              this.$message({
                message: '撤回成功', type: 'success'
              })
              this.getShareDetail(this.nowDeptRow)
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      },
      dealWithData() { // 处理类型数据，添加颜色背景
        const _this = this
        this.clueSortLable = { lx: this.getName(this.information.clueSortId, 1), bg: '' }
        this.shareStatusLable = { lx: this.getName(this.information.shareStatus, 2), bg: '' }
        this.collectionTypeLable = { lx: this.getName(this.information.collectionTypeId, 3), bg: '' }
        // debugger
        for (let k = 1; k <= this.colorData1.length; k++) {
          if (this.information.clueSortId === k) {
            this.clueSortLable.bg = _this.colorData1[k - 1]
          }
        }
        for (let k = 0; k < this.colorData2.length; k++) {
          if (this.information.shareStatus === k) {
            this.shareStatusLable.bg = this.colorData2[k]
          }
        }
        for (let k = 1; k <= this.colorData3.length; k++) {
          if (this.information.collectionTypeId === k) {
            this.collectionTypeLable.bg = this.colorData3[k - 1]
          }
        }
      },
      getName(value, labelId) {
        if (labelId === 1) {
          for (const key in this.$getDicts('xsfl')) {
            const item = this.$getDicts('xsfl')[key]
            if (parseInt(item.dictKey) === value) {
              return item.dictName
            }
          }
        }
        if (labelId === 2) {
          if (value === 1) {
            return '分享'
          } else {
            return '原报'
          }
        }
        if (labelId === 3) {
          for (const key in this.$getDicts('cjlx')) {
            const item = this.$getDicts('cjlx')[key]
            if (parseInt(item.dictKey) === value) {
              return item.dictName
            }
          }
        }
      },
      detail() {
        this.loading = true
        this.$query('clue/getOne/', { id: this.$route.query.id }).then(response => {
          this.information = response.data
          if (response.data.attachment) {
            this.attachments = JSON.parse(response.data.attachment)
          }
          if (response.data.collectionLocationLable) {
            const clArr = response.data.collectionLocationLable.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')
            var _collectionLocationLable = ''
            if (clArr.length > 0) {
              _collectionLocationLable += clArr[0].trim()
            }
            if (clArr.length > 1) { // 市
              _collectionLocationLable += clArr[1].trim()
            }
            if (clArr.length > 2) { // 区
              _collectionLocationLable += clArr[2].trim()
            }
            this.information.collectionLocationLable = _collectionLocationLable
          }
          this.dealWithData()
        }).catch(() => {
          this.loading = false
        })
      },
      getShare() {
        this.loading = true
        this.$query('clue/getShareDeptByClueId/', { clueId: this.$route.query.id }).then(response => {
          this.dataDeptList = response.data
        }).catch(() => {
          this.loading = false
        })
      },
      getShareDetail(row) {
        this.loading = true
        this.$query('clue/getSharePsonByDeptId/', { shareDepartmentId: row.id }).then(response => {
          this.dataPsonList = response.data
          this.dialogVisible = true
          this.nowDeptRow = row
        }).catch(() => {
          this.loading = false
        })
      },
      downFile(path) {
        window.open(path)
      },
      // onLoad() { // 地图初始化
      //   if (typeof EzMap === 'undefined') {
      //     setTimeout(this.onLoad(), 10)
      //     return
      //   }
      //   if (_compatIE()) {
      //     this._MapApp = new EzMap(document.getElementById('map'))
      //     // 设置地图中心点及显示级别
      //     this._MapApp.centerAndZoom(new Point(108.93081, 34.35287), 11)
      //     // 构造鹰眼对象
      //     var pOverview = new OverView()
      //     pOverview.width = 200
      //     pOverview.height = 200
      //     pOverview.minLevel = 4
      //     pOverview.maxLevel = 18
      //     this._MapApp.addOverView(pOverview)
      //     this._MapApp.showMapControl()
      //     this._MapApp.showMapServer()
      //   } else if (this._MapApp === null) {
      //     const pEle = document.getElementById('map')
      //     pEle.innerHTML = '<p>目前EzMap地图引擎不支持你使用的浏览器，我们当前支持如下浏览器类型:</p><ul><li><a href=\"http://www.microsoft.com/windows/ie/downloads/default.asp\">IE</a> 5.5+ (Windows)</li>'
      //   }
      // },
      // addMark(x, y, title, strMsg) {
      //   var pIcon = new Icon()
      //   pIcon.image = 'vehicle_motor_active.gif'
      //   pIcon.height = 32
      //   pIcon.width = 32
      //   pIcon.topOffset = 0
      //   pIcon.leftOffset = 0
      //   if (typeof iPos === 'undefined' || iPos === null) iPos = 7
      //   var point = new Point(x + ',' + y)
      //   var marker = new Marker(point, pIcon, new Title(title, 12, iPos, '宋体', null, null, 'red', '2'))
      //   marker.addListener ('click', function() { marker.openInfoWindowHtml(strMsg) })
      //   this._MapApp.addOverlay(marker)
      // },
      // // 地图选中点回调返回经纬度
      // callback(str) {
      //   var title = '标注'
      //   var strMsg = '<html><table><tr><td>' + title + '</td></tr><tr><td>----------</td></tr><tr><td><a href=\"www.baidu.com\">详细信息</a></td></tr></table><html>'
      //   var x = str.split(',')[0]
      //   var y = str.split(',')[1]
      //   // 添加图标
      //   this.addMark(x, y, title, strMsg)
      //   alert('调用回调函数,获取坐标:' + str)
      //   this.information.collectionCoordinate = str
      //   // 与选中点为中心
      //   this._MapApp.centerAndZoom(new Point(x, y), 11)
      // },
      // mapDialog() { // 输入框点击弹窗
      //   this.dialogVisible = true
      //   // 获取坐标添加地图标注
      //   var title = this.information.clueName
      //   var strMsg = '<html><table><tr><td>' + title + '</td></tr><tr><td>----------</td></tr><tr><td><a href=\"www.baidu.com\">详细信息</a></td></tr></table><html>'
      //   var x = this.information.collectionCoordinate.split(',')[0]
      //   var y = this.information.collectionCoordinate.split(',')[1]
      //   this.addMark(x, y, title, strMsg)
      //   // 添加地图的选中点返回经纬度
      //   this._MapApp.changeDragMode('drawPoint', this.callback)
      //   // this._MapApp.changeDragMode('drawPoint', dataInputx, dataInputy, this.callback)
      // },
      backList() {
        this.$gotoid('/information/clueList')
      }
    },
    mounted() {
      // 线索数据查询
      if (this.$route.query.id) {
        this.detail()
        this.getShare()
      }
    },
    filters: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  .detail {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .leftCont {
    width: 14%;
    overflow: auto;
    margin-right: 20px;
  }
  .rightCont {
    width: 84.3%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .marb {
    margin-bottom: 20px;
  }
  .bg {
    background-color: rgba(0, 64, 94, 0.7);
    border-radius: 8px;
  }
  .cell_title {
    margin: 0 0 10px 5px;
    .text {
      line-height: 20px;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      margin-left: 3px;
      font-size: 17px;
    }
    .small_line {
      display: inline-block;
      width: 8px;
      height: 20px;
      background: #00a0e9;
      border-radius: 3px;
      vertical-align: middle;
    }
  }
  .archiveTab.el-tabs {
    border: none;
    background: none;
    .el-tabs__header {
      background: url(/static/image/personFile_images/titlePub.png) no-repeat
      center center;
      background-size: 100% 65%;
      margin: 0;
    }
    .el-tabs__nav-scroll {
      padding: 6px 18px 16px 5px;
    }
    .el-tabs__nav-wrap::after {
      // 去掉tab自带的下划线
      height: 0;
    }
    .el-tabs__active-bar {
      height: 0;
    }
    .el-tabs__item {
      padding: 0 20px;
      height: 20px;
      line-height: 20px;
    }
    .el-tabs__item.is-top:last-child {
      padding-right: 20px;
    }
    .el-tabs__item.is-active {
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      .no_data_title {
        color: #bce8fc;
        text-shadow: 0 0 2px #fff;
      }
    }
    .el-tabs__item {
      color: #00a0e9;
    }
    .tab_title_line {
      // taba页签右边的斜线
      width: 26px;
      position: absolute;
      right: -10px;
      top: -1px;
    }
    .no_data_title {
      color: #586d7e;
      text-shadow: none;
    }
  }
  .goBack {
    margin: 0 10px 5px 0;
  }
  .toolbar {
    margin: 2px 0 0 !important;
  }
  .whiteColor {
    color: #fff;
  }
  .bg1,
  .bg2,
  .bg3,
  .bg4,
  .bg5,
  .bg6,
  .bg7,
  .bg8 {
    padding: 2px 10px;
    background-blend-mode: normal, normal;
    border-radius: 4px;
    margin-right: 6px;
    font-size: 14px;
    word-break: keep-all;
  }
  .bg1 {
    background-image: linear-gradient(140deg, #40a954 0%, #20e1aa 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg2 {
    background-image: linear-gradient(140deg, #dbd33e 0%, #dbd33e 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg3 {
    background-image: linear-gradient(140deg, #db8b30 0%, #db8b30 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg4 {
    background-image: linear-gradient(140deg, #894300 0%, #964b00 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg5 {
    background-image: linear-gradient(140deg, #60adc8 0%, #62d5d4 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg6 {
    background-image: linear-gradient(140deg, #050f39 0%, #0b0e3a 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg7 {
    background-image: linear-gradient(140deg, #6e3ec8 0%, #8f55d5 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .bg8 {
    background-image: linear-gradient(140deg, #bb3e6d 0%, #db4584 100%),
    linear-gradient(#ff8547, #ff8547);
  }
  .ajlx {
    height: 23px;
    line-height: 18px;
    margin-right: 6px;
    font-size: 14px;
    word-break: keep-all;
    display: inline-block;
  }
  .ellipsis-word {
    height: 23px;
  }
  .prt {
    padding-right: 15px;
  }
  .breakall {
    word-break: break-all;
  }
  @media only screen and (max-width: 1367px) {
    .leftCont {
      width: 17%;
    }
    .rightCont {
      width: 80.6%;
    }
  }



  .ajInfo{
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
    border: 2px solid rgb(0, 160, 233);
    padding: 0 8px 8px 8px;
    .el-form-item__label{
      color: #bce8fc;
      text-shadow: 0 0 1px #fff;
    }
    .title{
      width: 100%;
      height: 40px;
      padding: 8px 0 7px 10px;
      border-bottom: 2px solid #00a0e9;
      overflow: hidden;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      font-size: 17px;
      .left{
        float: left;
        letter-spacing: 3px;
      }
      .right{
        float: right;
        font-size: 14px;
        .downLoad{
          width: 16px;
        }
        p{
          display: inline-block;
          margin-left: 15px;
        }
      }
    }
  }

  .beyondTextClass {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .lbbg{
    font-size: 14px;
    padding: 2px 6px;
    background-image: linear-gradient(140deg,
      #177ce0 0%,
      #54afe0 100%),
    linear-gradient(
        #ff8547,
        #ff8547);
    background-blend-mode: normal,
    normal;
    border-radius: 4px;
  }
  .pat{
    padding: 22px 0 0 22px;
  }
  .ajbh{
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    text-decoration:underline;
  }
  .ajbhcom{
    position: absolute;
    top: -5px;
    left:21%;
  }
  .pdr{
    padding-right: 10px;
  }
  .heig{
    height: 22px;
  }
  @media only screen and (max-width: 1367px){
    .ajbhcom{
      left:31%;
    }
  }
  .ajParallel {
    width: 100%;
    border: 2px solid #00a0e9;
    padding: 0 8px 8px 8px;
    border-radius: 8px;
  }
</style>
