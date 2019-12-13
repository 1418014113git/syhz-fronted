<template>
   <!-- 发案地址 -->
   <div class="faAddress">
    <title-pub :title="title" :url="url"></title-pub>
    <div class="xddw" v-loading="loading">
      <div class="curAddress ellipsis-word ">
        <img src="/static/image/caseFile_images/mapbluebj.png">
        <span>发案地址</span>
        <span  :title="faAddress"  class="whiteColor marl onMouse" @click="setMapCenter">{{faAddress}}</span>
      </div>
      <div class="mapCount">
      <div id="Map" style="width: 100%; height: 100%;"></div>
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
        </div>
     </div>
     <div class="rightArea fz14">
       <div style="text-align:right;">
          <img src="/static/image/caseFile_images/mapListzk.png" class="czIcon"  v-show="isShowIcon"  @click="operate">
          <img src="/static/image/caseFile_images/mapListsq.png" class="czIcon" v-show="!isShowIcon" @click="operate">
       </div>
        <div>
          <el-collapse-transition>
            <div class="bg areaCont" v-show="isShowCont" style="margin-bottom:6px;"  v-loading="ajLoading">
              <div>
                <p class="tableTit">
                  <span>案件发生前同类案件</span>
                  <span class="dateTime" v-if='ajInfo.FXSJ'>{{ $handlerDateTime(ajInfo.FXSJ) | formatDateTime }}</span>
                </p>
                <el-table :data="ajData.ajBefore" style="width: 100%;">
                  <el-table-column prop="time" label="时间" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.time">{{scope.row.time}}天</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="city" label="本市" align="center">
                    <template slot-scope="scope">
                      <a class="kdj" v-if="scope.row.city>0"  @click="handleAjList(scope.$index, scope.row,true)">{{scope.row.city}}</a>
                      <span v-else style="color: #7ecefd;">0</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="all" label="全区" align="center">
                    <template slot-scope="scope">
                      <a class="kdj" v-if="scope.row.all>0" @click="handleAjList(scope.$index, scope.row)">{{scope.row.all}}</a>
                      <span v-else style="color: #7ecefd;">0</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ajbh" label="地图分布" align="center">
                    <template slot-scope="scope">
                      <div @click="handAddBj(scope.$index, scope.row,0)" class="bjwz">
                        <img src="/static/image/caseFile_images/mapgraybj.png" class="bj" v-if="!(curIndexBef=== scope.$index && scope.row.all)">
                        <img src="/static/image/caseFile_images/mapbluehandbj.png" class="bj" v-if="curIndexBef === scope.$index && scope.row.all">
                        <a :class="{'onbj':curIndexBef === scope.$index && scope.row.all}">标记</a>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-transition>
          <el-collapse-transition>
            <div class="bg areaCont" v-show="isShowCont"  v-loading="ajLoading">
              <div>
                <p class="tableTit">
                  <span>案件发生后同类案件</span>
                  <span class="dateTime" v-if='ajInfo.FXSJ'>{{ $handlerDateTime(ajInfo.FXSJ) | formatDateTime }}</span>
                </p>
                <el-table :data="ajData.ajAfter" style="width: 100%;">
                  <el-table-column prop="time" label="时间" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.time">{{scope.row.time}}天</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="city" label="本市" align="center">
                    <template slot-scope="scope">
                      <a class="kdj" v-if="scope.row.city>0"  @click="handleAjList(scope.$index, scope.row,true)">{{scope.row.city}}</a>
                      <span v-else style="color: #7ecefd;">0</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="all" label="全区" align="center">
                    <template slot-scope="scope">
                      <a class="kdj" v-if="scope.row.all>0" @click="handleAjList(scope.$index, scope.row)">{{scope.row.all}}</a>
                      <span v-else style="color: #7ecefd;">0</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ajbh" label="地图分布" align="center">
                    <template slot-scope="scope">
                      <div  @click="handAddBj(scope.$index, scope.row,1)" class="bjwz">
                        <img src="/static/image/caseFile_images/mapgraybj.png" class="bj" v-if="!(curIndexAft=== scope.$index && scope.row.all) ">
                        <img src="/static/image/caseFile_images/mapbluehandbj.png" class="bj" v-if="curIndexAft === scope.$index && scope.row.all">
                        <a :class="{'onbj':curIndexAft === scope.$index && scope.row.all}">标记</a>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-transition>
        </div>
     </div>
   </div>
  </div>
</template>

<script>
import titlePub from './titlePub'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Map, View, Feature, Overlay } from 'ol'
import { Style, Icon } from 'ol/style'
// import Text from 'ol/style/Text'
// import Fill from 'ol/style/Fill'
import { Point } from 'ol/geom'
import { defaults } from 'ol/control/util.js'
import { defaults as defaultInteractions } from 'ol/interaction.js'
import { getWidth /* getTopLeft*/ } from 'ol/extent.js'
import { get as getProjection } from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
// import WMTS from 'ol/source/WMTS.js'
// import WMTSTileGrid from 'ol/tilegrid/WMTS.js'

export default {
  props: ['ajbh', 'AjInfo', 'ajid', 'type', 'Rl'],
  data() {
    return {
      title: '发案地址',
      url: '',
      map: null,
      overlay: null,
      x: 0,
      y: 0,
      coordinatesFa: [], // 车辆轨迹地区坐标数据
      coordinatesBj: [], // 企业地区坐标数据
      featuresBj: [], // 存储手动标记点
      featuresFa: [], // 发案地标记点
      flagLayerFa: null,
      flagLayerBj: null,
      loading: false, // 页面加载loading
      ajLoading: false, // 案件发生前/后同类案件加载loading
      AJBH: '', // 案件编号
      isShowCont: true, // 是否显示右侧侧层
      isShowIcon: true, // 默认显示展开图标
      curIndexBef: '', // 存储当前被点击标记的索引值 --案件发生前
      curIndexAft: '', // 存储当前被点击标记的索引值 --案件发生后
      curIndex: '',
      mapCenter: [], // 将呼和浩特市作为中心点
      ajInfo: {}, // 基础信息
      faAddress: '', // 存储拼接后的发案地址
      interFaceType: '',
      isRls: '',
      AJID: '', // 案件id
      source: 'ajda', // 页面来源，表示该模块是来自案件档案
      ajData: {
        ajBefore: [ // 案件发生前同类案件
          {
            time: '3',
            city: 0,
            area: 0,
            fadtType: 'bd3',
            tips: []
          },
          {
            time: '7',
            city: 0,
            all: 0,
            fadtType: 'bd7',
            tips: []
          },
          {
            time: '15',
            city: 0,
            all: 0,
            fadtType: 'bd15',
            tips: []
          }
        ],
        ajAfter: [ // 案件发生后同类案件
          {
            time: '3',
            city: 0,
            all: 0,
            fadtType: 'ad3',
            tips: []
          },
          {
            time: '7',
            city: 0,
            all: 0,
            fadtType: 'ad7',
            tips: []
          },
          {
            time: '15',
            city: 0,
            all: 0,
            fadtType: 'ad15',
            tips: []
          }
        ]
      }
    }
  },
  components: {
    titlePub
  },
  watch: {
    ajbh(val) {
      if (val) {
        // console.log('监听val', val)
        const _that = this
        _that.$nextTick(function() {
          _that.AJBH = val
          _that.ajInfo = _that.AjInfo
          _that.initMap() // 初始化地图
          _that.getCoordinates() // 获取坐标数据
          _that.getajData() // 查询案件发生前/后同类案件数据
        })
      }
    }
  },
  filters: {
    formatDateTime(value) {
      var val = value.substring(0, 4) + '年' + parseInt(value.substring(5, 7)) + '月' + parseInt(value.substring(8, 10)) + '日' + value.substr(10)
      return val
    }
  },
  methods: {
    init() {
      if (this.ajbh) {
        this.loading = true
        this.AJBH = this.ajbh
        this.ajInfo = this.AjInfo
        this.initMap() // 初始化地图
        this.getCoordinates() // 获取坐标数据
        this.getajData() // 查询案件发生前/后同类案件数据
      }
    },
    /**
     * 初始化地图
     */
    initMap() {
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
      _that.overlay = new Overlay({
        // 设置弹出框的容器
        element: container,
        // 是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true
      })

      _that.map = new Map({
        target: 'Map',
        controls: defaults({ zoom: true }), // 地图左上角的缩放按钮，默认是zoom:false不显示
        interactions: defaultInteractions({ mouseWheelZoom: false }), // 禁止鼠标缩放地图
        layers: [
          new TileLayer({
            source: new OSM()
          })
          // new TileLayer({
          //   source: new WMTS({
          //     // url: 'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/', // 测试地址
          //     url: 'http://26.3.12.44:6088/wmts?service=WMTS&request=GetCapabilities', // 公安地图资源服务地址
          //     layer: '0',
          //     matrixSet: 'EPSG:4326',
          //     format: 'image/png',
          //     projection: projection, // 采用WGS84坐标系
          //     tileGrid: new WMTSTileGrid({
          //       origin: getTopLeft(projectionExtent),
          //       resolutions: resolutions,
          //       matrixIds: matrixIds
          //     }),
          //     style: 'default',
          //     wrapX: true
          //   })
          // })
        ],
        view: new View({
          // 指定地图投影模式
          projection: 'EPSG:4326', // 采用WGS84坐标系
          // 设置地图中心范围
          center: [111.66035052, 40.8283188731], // 将呼和浩特市作为中心点
          // 限制地图中心范围，但无法限制缩小范围
          // extent: [110, 26, 114, 30],
          // 定义地图显示层级为16
          zoom: 13, // 1:2000
          // 限制缩放级别，可以和extent同用限制范围
          maxZoom: 14, // 1:1000
          // 最小级别，越大则面积越大
          minZoom: 5 // 1:500000
        })
      })
      _that.map.on('pointermove', function(e) {
        var pixel = _that.map.getEventPixel(e.originalEvent)
        _that.map.forEachFeatureAtPixel(pixel, function(feature) {
          if (feature.values_.address) {
            content.innerHTML = '<p class="ajmcName">' + feature.values_.ajmcName + '</p><p><span>案件编号：</span><span class="ajmcName">' + feature.values_.ajbhcode + '</span></p><p><img src="/static/image/caseFile_images/mapbluebj.png"><span class="address">' + feature.values_.address + '</span></p>'
          } else {
            content.innerHTML = '<p class="ajmcName">' + feature.values_.ajmcName + '</p><p><span>案件编号：</span><span class="ajbh">' + feature.values_.ajbhcode + '</span></p>'
          }
          _that.overlay.setPosition(e.coordinate)
          _that.map.addOverlay(_that.overlay)
        })
      })
      popupCloser.addEventListener('click', function() {
        _that.overlay.setPosition(undefined)
      })
    },
    /**
     * 批量添加车辆轨迹坐标点
     */
    handleAddBatchFeatureFa() {
      const _that = this
      // 设置图层
      _that.flagLayerFa = new VectorLayer({
        source: new VectorSource()
      })
      // 添加图层
      _that.map.addLayer(_that.flagLayerFa)
      // 循环添加feature
      for (let i = 0; i < _that.coordinatesFa.length; i++) {
        // 创建feature
        const feature = new Feature({
          geometry: new Point([_that.coordinatesFa[i].x, _that.coordinatesFa[i].y]),
          ajmcName: _that.coordinatesFa[i].AJMC,
          ajbhcode: _that.coordinatesFa[i].AJBH,
          address: _that.coordinatesFa[i].address,
          bjtype: 0 // 0 发案地址
        })
        // 设置ID
        feature.setId(i)
        // 设置样式
        feature.setStyle(_that.getStylsFa(feature))
        // 放入features
        _that.featuresFa.push(feature)
      } // for 结束
      // 批量添加feature
      _that.flagLayerFa.getSource().addFeatures(_that.featuresFa)
    },
    /**
     * 将手动添加的标记显示在地图上
     */
    handleAddBatchFeatureBj() {
      const _that = this
      // 移除图层  清除上次的标记
      _that.map.removeLayer(_that.flagLayerBj)
      // 设置图层
      _that.flagLayerBj = new VectorLayer({
        source: new VectorSource()
      })
      // 添加图层
      _that.map.addLayer(_that.flagLayerBj)
      // 循环添加feature
      for (let i = 0; i < _that.coordinatesBj.length; i++) {
        // 创建feature
        const feature = new Feature({
          geometry: new Point([_that.coordinatesBj[i].x, _that.coordinatesBj[i].y]),
          ajmcName: _that.coordinatesBj[i].ajmc,
          ajbhcode: _that.coordinatesBj[i].ajbh,
          address: _that.coordinatesBj[i].fadzmlxz ? _that.coordinatesBj[i].fadzmlxz : '',
          bjtype: 1 // 1 是手动添加
        })
        // 设置ID
        feature.setId(i)
        // 设置样式
        feature.setStyle(_that.getStylsBj(feature))
        // 放入features
        _that.featuresBj.push(feature)
      } // for 结束
      // 批量添加feature
      _that.flagLayerBj.getSource().addFeatures(_that.featuresBj)
    },

    /**
     * 获取坐标数据
     */
    getCoordinates() {
      this.loading = false
      this.AJID = this.ajid
      this.interFaceType = this.type
      this.isRls = this.Rl
      var FADZSSXQ_NAME = this.ajInfo.FADZSSXQ_NAME ? this.ajInfo.FADZSSXQ_NAME : ''
      var FADZJLX_NAME = this.ajInfo.FADZJLX_NAME ? this.ajInfo.FADZJLX_NAME : ''
      var FADZMPHZ_NAME = this.ajInfo.FADZMPHZ_NAME ? this.ajInfo.FADZMPHZ_NAME : ''
      var FADZMLXZ = this.ajInfo.FADZMLXZ ? this.ajInfo.FADZMLXZ : ''
      this.faAddress = FADZSSXQ_NAME + '  ' + FADZJLX_NAME + '  ' + FADZMPHZ_NAME + '  ' + FADZMLXZ
      if (this.ajInfo.X && this.ajInfo.Y) {
        var x = parseFloat(this.ajInfo.X)
        var y = parseFloat(this.ajInfo.Y)
        this.mapCenter = [x, y]
        this.coordinatesFa = [
          {
            AJBH: this.AJBH,
            AJMC: this.ajInfo.AJMC,
            x: this.ajInfo.X,
            y: this.ajInfo.Y,
            address: this.faAddress
          }
        ]
        this.setMapCenter()
        this.handleAddBatchFeatureFa()
      }
    },
    /**
     * 设置发案地坐标 Style
     */
    getStylsFa() {
      const Styles = []
      Styles.push(
        new Style({
          image: new Icon({
            src: '/static/image/caseFile_images/mapredbj.png',
            anchor: [1, 1] // 图标中心
          })
        })
      )
      return Styles
    },
    /**
     * 设置手动标记 Style
     */
    getStylsBj(feature) {
      if (feature) {
        const Styles = []
        Styles.push(
          new Style({
            image: new Icon({
              src: '/static/image/caseFile_images/mapbluebj.png',
              anchor: [1, 1] // 图标中心
            })
          })
        )
        return Styles
      }
    },
    operate() { // 右侧区域展开收起操作
      this.isShowCont = !this.isShowCont
      this.isShowIcon = !this.isShowIcon
    },
    handleAjList(index, row, flag) { // 跳转案件列表
      const param = {
        fadtType: row.fadtType, // 类型表示  传获取的字段名,如 ad3, ad15 等
        noAjbh: this.AJBH, // 案件编号
        time: this.ajInfo.FXSJ.substring(0, 8),		// 当前案件FXSJ 前8位
        id: this.AJID, // 案件id
        source: this.source, // 页面来源，表示该模块是来自案件档案
        interfaceType: this.interFaceType,
        isRl: this.isRls,
        ajlb: this.ajInfo.AJLB,
        fadz: true
      }
      if (flag) {
        param.cityCode = this.ajInfo.deptCode.substring(0, 6)
      }
      this.$router.push({
        path: '/caseManage/caseList', query: param
      })
    },
    getajData() { // 查询案件发生前/后同类案件数据
      this.ajLoading = true
      const param = {
        deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
        ajlb: this.ajInfo.AJLB,		// 案件类别  AJLB
        ajbh: this.AJBH,	// 案件编号  AJBH
        time: this.ajInfo.FXSJ	// 发现时间  FXSJ
      }
      this.$query('similarCaseStatistics', param).then((response) => {
        this.ajLoading = false
        if (response.code === '000000' && response.data) {
          var portData = response.data
          // 案件发生前同类案件
          this.ajData.ajBefore[0].city = portData.bd3.city
          this.ajData.ajBefore[0].all = portData.bd3.all
          this.ajData.ajBefore[0].tips = portData.bd3.tips
          this.ajData.ajBefore[1].city = portData.bd7.city
          this.ajData.ajBefore[1].all = portData.bd7.all
          this.ajData.ajBefore[1].tips = portData.bd7.tips
          this.ajData.ajBefore[2].city = portData.bd15.city
          this.ajData.ajBefore[2].all = portData.bd15.all
          this.ajData.ajBefore[2].tips = portData.bd15.tips

          // 案件发生后同类案件
          this.ajData.ajAfter[0].city = portData.ad3.city
          this.ajData.ajAfter[0].all = portData.ad3.all
          this.ajData.ajAfter[0].tips = portData.ad3.tips
          this.ajData.ajAfter[1].city = portData.ad7.city
          this.ajData.ajAfter[1].all = portData.ad7.all
          this.ajData.ajAfter[1].tips = portData.ad7.tips
          this.ajData.ajAfter[2].city = portData.ad15.city
          this.ajData.ajAfter[2].all = portData.ad15.all
          this.ajData.ajAfter[2].tips = portData.ad15.tips
        }
      }).catch(() => {
        this.ajLoading = false
      })
    },
    /**
     * 手动添加标记
     */
    handAddBj(index, row, type) {
      this.overlay.setPosition(undefined)
      if (type === 0) { // 案件发生前同类案件
        this.curIndexBef = index
        this.curIndexAft = ''
      } else { // 案件发生后同类案件
        this.curIndexAft = index
        this.curIndexBef = ''
      }
      this.coordinatesBj = []
      this.featuresBj = []
      this.coordinatesBj = row.tips
      this.handleAddBatchFeatureBj()
    },
    /**
     * 设置地图中心点
     */
    setMapCenter() {
      if (this.ajInfo.X && this.ajInfo.Y) {
        const _this = this
        var view = new View({
          // 指定地图投影模式
          projection: 'EPSG:4326', // 采用WGS84坐标系
          // 设置地图中心范围
          center: _this.mapCenter, // 将当前坐标设置成中心点
          // 定义地图显示层级为16
          zoom: 13, // 1:2000
          // // 限制缩放级别，可以和extent同用限制范围
          maxZoom: 14, // 1:1000
          // 最小级别，越大则面积越大
          minZoom: 5 // 1:500000
        })// 在外面创建一个view
        _this.map.setView(view)// 把这个view设置给map
        view.setCenter(_this.mapCenter)// 重复执行这行代码给地图设置中
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.faAddress {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  color: #bce8fc;
  text-shadow: 0 0 1px #fff;
  .curAddress {
    padding: 0 0 0 5px;
    height: 32px;
    line-height: 35px;
    img {
      width: 13px;
      margin-bottom: 2px;
    }
  }
  .mapCount {
    width: 100%;
    height: 370px;
    overflow: hidden;
  }
  .marl {
    margin-left: 16px;
  }
  .rightArea {
    width: 28%;
    position: absolute;
    top: 50px;
    right: 20px;
    .czIcon {
      text-align: right;
    }
    .areaCont {
      padding: 6px 8px 8px 8px;
      overflow: hidden;
      .tableTit {
        width: 100%;
        border-bottom: 1px solid #00a0e9;
        color: #bce8fc;
        overflow: hidden;
        margin-bottom: 2px;
        .dateTime {
          float: right;
          margin-right: 20px;
        }
      }
    }
  }
  .el-table {
    font-size: 14px;
  }
  .el-table__body-wrapper tr:nth-child(even) {
    background-color: transparent;
  }
  .el-table {
    background-color: transparent;
  }
  .el-table .cell {
    line-height: 20px;
  }
}
.kdj {
  text-decoration: underline;
  color: #7ecefd;
  cursor: pointer;
}
.bjwz {
  text-decoration: underline;
  color: #ffffff;
  cursor: pointer;
}
.onbj {
  color: #6ed2ff !important;
}
.ol-popup {
  position: absolute;
  bottom: 17px;
  left: -115px;
  background-color: rgba(0, 89, 130, 0.8);
  border-radius: 8px;
  border: solid 1px rgba(0, 160, 233, 0.8);
  padding: 5px 8px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
#popup-content {
  color: #fff;
  font-size: 14px;
  p {
    white-space: nowrap;
  }
  .ajbh {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
    text-decoration: underline;
  }
  img {
    width: 10px;
    margin-right: 5px;
  }
  .address {
    opacity: 0.5;
  }
  .ajmcName {
    padding-right: 25px;
  }
}
.onMouse:hover {
  color: #00a0e9;
  cursor: pointer;
}
@media only screen and (max-width: 1367px) {
  .faAddress .rightArea {
    width: 35%;
  }
}
</style>
