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
            <el-form-item label="发生地：">
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
            <el-form-item label="详细地址：">
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
                  <!-- <a @click="downFile(item.path)">{{item.name}}</a> -->
                  <a @click="downFile(item)">{{item.name}}</a>
                </p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="ajInfo" style="margin-top: 20px;">
      <div class="title">
        <div class="left">线索位置信息</div>
      </div>
      <div style="max-height: 500px; overflow-y: auto;">
        <div id="Map" style="width:100%; height:300px;border: 0px solid #FF0000;" ></div>
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
      </div>
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
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Map, View, Feature, Overlay } from 'ol'
import { Style, Icon } from 'ol/style'
import { Point } from 'ol/geom'
import { defaults } from 'ol/control/util.js'
import { getWidth } from 'ol/extent.js'
import { get as getProjection } from 'ol/proj.js'
// import OSM from 'ol/source/OSM.js'
import XYZ from 'ol/source/XYZ.js'
export default {
  props: ['type'],
  name: 'shareEdit',
  components: {
  },
  data() {
    return {
      map: null,
      view: null,
      x: 0,
      y: 0,
      coordinates: [], // 地区坐标
      features: [],
      flagLayer: null,
      dataDeptList: [],
      dataPsonList: [],
      clueSortLable: {}, // 存储转换成数组的线索分类
      colorData1: ['bg1', 'bg2', 'bg3', 'bg4'], // 线索分类文字背景颜色默认集合
      shareStatusLable: {}, // 存储转换成数组的线索分享状态
      colorData2: ['bg5', 'bg6'], // 分享状态文字背景颜色默认集合
      collectionTypeLable: {}, // 存储转换成数组的采集类型
      colorData3: ['bg9', 'bg10', 'bg11', 'bg7', 'bg8'], // 采集类型文字背景颜色默认集合
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
        for (const key in this.$getDicts('xsly')) {
          const item = this.$getDicts('xsly')[key]
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
        this.getCoordinates() // 获取坐标数据
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
    downFile(item) {
      // window.open(path)
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    /**
     * 初始化地图
     */
    initMap() {
      // var scaleLineControl = new ScaleLine() // 定义比例尺控件
      const _that = this
      var projection = getProjection('EPSG:4326')
      var projectionExtent = projection.getExtent()
      var size = getWidth(projectionExtent) / 256
      var resolutions = new Array(14)
      var matrixIds = new Array(14)
      var container = document.getElementById('popup')
      var content = document.getElementById('popup-content')
      var popupCloser = document.getElementById('popup-closer')
      for (var z = 0; z < 14; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
      }
      // 设置图层
      _that.flagLayer = new VectorLayer({
        source: new VectorSource()
      })
      var overlay = new Overlay({
        // 设置弹出框的容器
        element: container,
        // 是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true
      })
      _that.view = new View({
        // 指定地图投影模式  采用WGS84坐标系
        projection: 'EPSG:4326',
        // 设置地图中心
        center: [108.9500, 34.22869],
        maxZoom: 15,
        minZoom: 9,
        // extent: [109.40234, 33.59375, 104.96484, 35.38281],
        zoom: 10 // 定义地图显示层级为 9-15
      })
      _that.map = new Map({
        target: 'Map',
        // controls: defaults({ zoom: true }).extend([scaleLineControl]), // 加载比例尺控件(地图左上角的缩放按钮，默认是zoom:false不显示)
        controls: defaults({ zoom: true }), // 地图左上角的缩放按钮，默认是zoom:false不显示
        layers: [
          // new TileLayer({
          //   source: new OSM()
          // }),
          new TileLayer({
            source: new XYZ({
              url: 'http://10.172.1.195/PGIS_S_TileMapServer/Maps/stsl/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=1.0.0', // bjslyx矢量影像叠加 bjsl 矢量 bjyx影像
              tilePixelRatio: 2, // THIS IS IMPORTANT
              minZoom: 1, // 9 级以下没有
              maxZoom: 22, // 15 级以上没有
              projection: 'EPSG:4326' // 采用WGS84坐标系
            })
          }),
          _that.flagLayer
        ],
        view: _that.view
      })
      _that.map.on('pointermove', function(e) {
        var pixel = _that.map.getEventPixel(e.originalEvent)
        _that.map.forEachFeatureAtPixel(pixel, function(feature) {
          var coodinate = e.coordinate
          content.innerHTML = feature.values_.msg
          overlay.setPosition(coodinate)
          _that.map.addOverlay(overlay)
        })
      })
      popupCloser.addEventListener('click', function() {
        overlay.setPosition(undefined)
      })
    },
    /**
     * 地图上显示坐标的信息
     */
    getCoordinates() {
      const _this = this
      const xy = this.information.collectionCoordinate.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')
      const xyObj = { x: xy[0].trim(), y: xy[1].trim(),
        msg: '<p class="pointText"><span>线索标题：</span>' + _this.information.clueName + '</p><p class="pointText"><span>线索编号：</span>' + _this.information.clueNumber + '</p>' }
      this.coordinates.push(xyObj)
      for (var i = 0; i < this.coordinates.length; i++) {
        this.setMapZoom(xy[0].trim(), xy[1].trim())
      }
      this.handleAddBatchFeature()
    },
    /**
     * 设置地图层级
     */
    setMapZoom(x, y) {
      const _this = this
      _this.view.animate({
        center: [x, y],
        duration: 100
      })
    },
    /**
     * 批量添加坐标点
     */
    handleAddBatchFeature() {
      const _that = this
      // 循环添加feature
      for (let i = 0; i < this.coordinates.length; i++) {
        // 创建feature
        const feature = new Feature({
          geometry: new Point([_that.coordinates[i].x, _that.coordinates[i].y]),
          msg: _that.coordinates[i].msg
        })
        // 设置ID
        feature.setId(i)
        // 设置样式
        feature.setStyle(_that.getStyls(feature))
        // 放入features
        _that.features.push(feature)
      } // for 结束
      // 批量添加feature
      _that.flagLayer.getSource().addFeatures(_that.features)
    },
    /**
     * 设置Style
     */
    getStyls(feature) {
      const Styles = []
      Styles.push(
        new Style({
          image: new Icon({
            src: '/static/image/public_images/address.png',
            anchor: [1, 1] // 图标中心
          })
        })
      )
      return Styles
    },
    backList() {
      this.$gotoid('/information/clueList')
    }
  },
  mounted() {
    // 线索数据查询
    this.initMap() // 初始化地图
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
.bg8,
.bg9,
.bg10,
.bg11 {
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
.bg9 {
  background-image: linear-gradient(140deg, #0bd89e 0%, #2cf0b8 100%),
    linear-gradient(#ff8547, #ff8547);
}
.bg10 {
  background-image: linear-gradient(140deg, #e6a120 0%, #fdc762 100%),
    linear-gradient(#ff8547, #ff8547);
}
.bg11 {
  background-image: linear-gradient(140deg, #e17055 0%, #eb917b 100%),
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

.ajInfo {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  border: 2px solid rgb(0, 160, 233);
  padding: 0 8px 8px 8px;
  .el-form-item__label {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .title {
    width: 100%;
    height: 40px;
    padding: 8px 0 7px 10px;
    border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    .left {
      float: left;
      letter-spacing: 3px;
    }
    .right {
      float: right;
      font-size: 14px;
      .downLoad {
        width: 16px;
      }
      p {
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
.lbbg {
  font-size: 14px;
  padding: 2px 6px;
  background-image: linear-gradient(140deg, #177ce0 0%, #54afe0 100%),
    linear-gradient(#ff8547, #ff8547);
  background-blend-mode: normal, normal;
  border-radius: 4px;
}
.pat {
  padding: 22px 0 0 22px;
}
.ajbh {
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  text-decoration: underline;
}
.ajbhcom {
  position: absolute;
  top: -5px;
  left: 21%;
}
.pdr {
  padding-right: 10px;
}
.heig {
  height: 22px;
}
@media only screen and (max-width: 1367px) {
  .ajbhcom {
    left: 31%;
  }
}
.ajParallel {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  border-radius: 8px;
}
.ol-popup {
  position: absolute;
  /* background-color: #eeeeee; */
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 10px 25px 10px 10px;
  border-radius: 10px;
  /* border: 1px solid #cccccc; */
  bottom: 12px;
  left: -50px;
  /* min-width: 280px; */
  /* color: #333; */
  background-color: rgba(0, 89, 130, 0.8);
  border-radius: 8px;
  border: solid 1px rgba(0, 160, 233, 0.8);
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: rgba(0, 89, 130, 0.8);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: rgba(0, 89, 130, 0.8);
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: #fff;
}
.ol-popup-closer:after {
  content: "✖";
}
#popup-content p {
  margin: 0;
}
.pointText {
  white-space: nowrap;
}
.pointText span {
  font-weight: bold;
}
</style>
