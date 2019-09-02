<template>
   <!-- 危化车辆轨迹分析 -->
   <div style="width: 100%; height: 95%;" v-loading="loading">
     <div id="Map" style="width: 100%; height: 100%;"></div>
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
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
// import Text from 'ol/style/Text'
// import Fill from 'ol/style/Fill'
import { Point } from 'ol/geom'
import { defaults } from 'ol/control/util.js'
// import ScaleLine from 'ol/control/ScaleLine.js'
import { getWidth, getTopLeft } from 'ol/extent.js'
import { get as getProjection } from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import WMTS from 'ol/source/WMTS.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
// import MousePosition from 'ol/control/MousePosition.js'

export default {
  data() {
    return {
      map: null,
      x: 0,
      y: 0,
      coordinatesCar: [], // 车辆轨迹地区坐标
      coordinatesCom: [], // 企业地区坐标
      featuresCar: [],
      featuresCom: [],
      flagLayerCar: null,
      flagLayerCom: null,
      loading: false
    }
  },
  computed: {
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      const _that = this
      // var scaleLineControl = new ScaleLine() // 定义比例尺控件
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
      var overlay = new Overlay({
        // 设置弹出框的容器
        element: container,
        // 是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true
      })
      // 实例化鼠标位置控件
      // var mousePositionControl = new MousePosition({
      //   className: 'custom-mouse-position', // 坐标信息显示样式
      //   // 显示鼠标位置信息的目标容器
      //   target: document.getElementById('mouse-position'),
      //   undefinedHTML: '&nbsp' // 未定义坐标的标记
      // })
      _that.map = new Map({
        target: 'Map',
        // controls: defaults({ zoom: true }).extend([mousePositionControl]), // 加载比例尺控件(地图左上角的缩放按钮，默认是zoom:false不显示)
        controls: defaults({ zoom: true }), // 地图左上角的缩放按钮，默认是zoom:false不显示
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          new TileLayer({
            source: new WMTS({
              url: 'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/', // 测试地址
              // url: 'http://26.3.12.44:6088/wmts?service=WMTS&request=GetCapabilities', // 公安地图资源服务地址
              layer: '0',
              matrixSet: 'EPSG:4326',
              format: 'image/png',
              projection: projection, // 采用WGS84坐标系
              tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
              }),
              style: 'default',
              wrapX: true
            })
          })
        ],
        view: new View({
          // 指定地图投影模式
          projection: 'EPSG:4326', // 采用WGS84坐标系
          // 设置地图中心范围
          center: [108.953098279, 34.2777998978], // 将西安市作为中心点
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
          var coodinate = e.coordinate
          if (feature.values_.iconNameCom) {
            content.innerHTML = '<p class="pointText"><span>企业名称：</span>' + feature.values_.iconNameCom + '</p>'
          } else if (feature.values_.iconNameCar) {
            content.innerHTML = '<p class="pointText"><span>车主名称：</span>' + feature.values_.carPersonName + '</p>' + '<p class="pointText"><span>车牌号：</span>' + feature.values_.iconNameCar + '</p>' + '<p class="pointText"><span>定位时间：</span>' + feature.values_.orientateTime + '</p>'
          } else {
            content.innerHTML = ''
          }

          overlay.setPosition(coodinate)
          _that.map.addOverlay(overlay)
        })
      })
      popupCloser.addEventListener('click', function() {
        overlay.setPosition(undefined)
      })
    },
    /**
     * 批量添加车辆轨迹坐标点
     */
    handleAddBatchFeatureCar() {
      const _that = this
      // 设置图层
      _that.flagLayerCar = new VectorLayer({
        source: new VectorSource()
      })
      // 添加图层
      _that.map.addLayer(_that.flagLayerCar)
      // 循环添加feature
      for (let i = 0; i < this.coordinatesCar.length; i++) {
        // 创建feature
        const feature = new Feature({
          geometry: new Point([_that.coordinatesCar[i].x, _that.coordinatesCar[i].y]),
          iconNameCar: _that.coordinatesCar[i].carNumber,
          carPersonName: _that.coordinatesCar[i].carPersonName,
          orientateTime: _that.coordinatesCar[i].orientateTime
        })
        // 设置ID
        feature.setId(i)
        // 设置样式
        feature.setStyle(_that.getStylsCar(feature))
        // 放入features
        _that.featuresCar.push(feature)
      } // for 结束
      // 批量添加feature
      _that.flagLayerCar.getSource().addFeatures(_that.featuresCar)
    },
    /**
     * 批量添加企业坐标
     */
    handleAddBatchFeatureCom() {
      const _that = this
      // 设置图层
      _that.flagLayerCom = new VectorLayer({
        source: new VectorSource()
      })
      // 添加图层
      _that.map.addLayer(_that.flagLayerCom)
      // 循环添加feature
      for (let i = 0; i < this.coordinatesCom.length; i++) {
        // 创建feature
        const feature = new Feature({
          geometry: new Point([_that.coordinatesCom[i].x, _that.coordinatesCom[i].y]),
          iconNameCom: _that.coordinatesCom[i].QYMC
        })
        // 设置ID
        feature.setId(i)
        // 设置样式
        feature.setStyle(_that.getStylsCom(feature))
        // 放入features
        _that.featuresCom.push(feature)
      } // for 结束
      // 批量添加feature
      _that.flagLayerCom.getSource().addFeatures(_that.featuresCom)
    },

    /**
     * 获取坐标数据
     */
    getCoordinates() {
      this.loading = true
      this.$query('trackcar', {}).then((response) => { // 车辆轨迹
        this.loading = false
        if (response.code === '000000') {
          this.coordinatesCar = response.data
          for (var i = 0; i < this.coordinatesCar.length; i++) {
            var pointer = this.coordinatesCar[i].x.substring(0, 3)
            if (pointer !== '108') { // 如果包含西安市以外的市，则调整地图层级数。
              this.setMapZoom()
            }
          }
          this.handleAddBatchFeatureCar()
        }
      }).catch(() => {
        this.loading = false
      })
      this.$query('trackpwsbqyxx', {}).then((response) => { // 企业信息
        this.loading = false
        if (response.code === '000000') {
          this.coordinatesCom = response.data
          for (var j = 0; j < this.coordinatesCom.length; j++) {
            var pointer = this.coordinatesCom[j].x.substring(0, 3)
            if (pointer !== '108') { // 如果包含西安市以外的市，则调整地图层级数。
              this.setMapZoom()
            }
          }
          this.handleAddBatchFeatureCom()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 设置车辆轨迹 Style
     */
    getStylsCar(feature) {
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
    /**
     * 设置企业轨迹 Style
     */
    getStylsCom(feature) {
      const Styles = []
      Styles.push(
        new Style({
          image: new Icon({
            src: '/static/image/highriskarea/swqy.png',
            anchor: [1, 1] // 图标中心
          })
        })
      )
      return Styles
    },
    /**
     * 设置地图层级
     */
    setMapZoom() {
      const _this = this
      var view = new View({
        // 指定地图投影模式
        projection: 'EPSG:4326', // 采用WGS84坐标系
        // 设置地图中心范围
        center: [108.953098279, 34.2777998978], // 将西安市作为中心点
        // 定义地图显示层级为16
        zoom: 9, // 返回的坐标地址是陕西省多个市的，调整下层级数。
        // 限制缩放级别，可以和extent同用限制范围
        maxZoom: 14, // 1:1000
        // 最小级别，越大则面积越大
        minZoom: 5 // 1:500000
      })// 在外面创建一个view
      _this.map.setView(view)// 把这个view设置给map
    }
  },
  mounted() {
    this.initMap() // 初始化地图
    this.getCoordinates() // 获取坐标数据
  }
}
</script>
<style>
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
    background-color: rgba(0, 89, 130, 0.8);
    border-radius: 8px;
    border: solid 1px rgba(0, 160, 233, 0.8);
    /* min-width: 280px; */
    /* color: #333; */
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
}
.ol-popup-closer:after {
    content: "✖";
}
#popup-content p{
  margin: 0;
}
.pointText{
  white-space:nowrap;
}
.pointText span{
  font-weight: bold;
 }
</style>
