<template>
  <section class="big_pictrue" style="position: relative;height: 100%;width: 100%;">
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item label="分类：">
          <el-select v-model="qxx" placeholder="请选择" @change="changeOptions">
            <el-option value="1" label="案件"></el-option>
            <el-option value="2" label="单位"></el-option>
            <el-option value="3" label="人"></el-option>
            <el-option value="4" label="车辆"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <div id="Map1" style="width: 100%; height: 100%;"></div>
    <div v-if="showCase" style="position: fixed;width: 300px;left: 90px;top: 190px;">
      <img src="./images/caseInfo.png" alt="" style="width: 100%;">
    </div>
    <div v-if="showUnit" style="position: fixed;width: 300px;left: 90px;top: 190px;">
      <img src="./images/unitInfo.png" alt="" style="width: 100%;">
    </div>
    <div v-if="showPerson" style="position: fixed;width: 300px;left: 90px;top: 190px;">
      <img src="./images/personInfo.png" alt="" style="width: 100%;">
    </div>
    <div v-if="showCar" style="position: fixed;width: 300px;left: 90px;top: 190px;">
      <img src="./images/carInfo.png" alt="" style="width: 100%;">
    </div>
    <div style="position: fixed;width: 300px;right: 90px;bottom: 30px;">
      <img src="./images/yujing.png" alt="" style="width: 100%;">
    </div>
  </section>
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
  import { defaults as defaultInteractions } from 'ol/interaction.js'
  import { getWidth, getTopLeft } from 'ol/extent.js'
  import { get as getProjection } from 'ol/proj.js'
  import OSM from 'ol/source/OSM.js'
  import WMTS from 'ol/source/WMTS.js'
  import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
  export default {
    name: 'bigPictrue',
    data() {
      return {
        qxx: '1',
        map1: null,
        map2: null,
        map3: null,
        map4: null,
        map5: null,
        showCase: false,
        showUnit: false,
        showPerson: false,
        showCar: false,
        featuresFa: [],
        images: [
          { name: '涉环食药单位/场所', url: '/static/image/syh_images/dw.jpg' },
          { name: '案件', url: '/static/image/syh_images/ajxgr.jpg' },
          { name: '人员', url: '/static/image/syh_images/ry.jpg' },
          { name: '物品', url: '/static/image/syh_images/wp.jpg' }
        ],
        flagLayerFa: null
      }
    },
    methods: {
      changeOptions: function(data) {
        const _this = this
        if (data === '1') {
          _this.showCase = true
          _this.showUnit = false
          _this.showPerson = false
          _this.showCar = false
          _this.setMapCenter([108.911098279, 34.2777998978], '/static/image/tempMap/casePosition.png')
        } else if (data === '2') {
          _this.showCase = false
          _this.showUnit = true
          _this.showPerson = false
          _this.showCar = false
          _this.setMapCenter([108.922098279, 34.2777998978], '/static/image/tempMap/unitPosition.png')
        } else if (data === '3') {
          _this.showPerson = true
          _this.showCase = false
          _this.showUnit = false
          _this.showCar = false
          _this.setMapCenter([108.933098279, 34.2777998978], '/static/image/tempMap/personPositon.png')
        } else if (data === '4') {
          _this.showCar = true
          _this.showCase = false
          _this.showUnit = false
          _this.showPerson = false
          _this.setMapCenter([108.944098279, 34.2777998978], '/static/image/tempMap/carPosition.png')
        }
      },
      setMapCenter(point, src) {
        const _this = this
        var view = new View({
          // 指定地图投影模式
          projection: 'EPSG:4326', // 采用WGS84坐标系
          // 设置地图中心范围
          center: point, // 将当前坐标设置成中心点
          // 定义地图显示层级为16
          zoom: 13, // 1:2000
          // // 限制缩放级别，可以和extent同用限制范围
          maxZoom: 14, // 1:1000
          // 最小级别，越大则面积越大
          minZoom: 5 // 1:500000
        })// 在外面创建一个view
        _this.map1.setView(view)// 把这个view设置给map
        // 循环添加feature
        _this.addFeature(point, src)
      },
      initMap(point) {
        const _that = this
        var projection = getProjection('EPSG:4326')
        var projectionExtent = projection.getExtent()
        var size = getWidth(projectionExtent) / 256
        var resolutions = new Array(14)
        var matrixIds = new Array(14)
        var container = document.getElementById('popup')
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

        var source = new WMTS({
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
        _that.map1 = new Map({
          target: 'Map1',
          controls: defaults({ zoom: true }), // 地图左上角的缩放按钮，默认是zoom:false不显示
          interactions: defaultInteractions({ mouseWheelZoom: false }), // 禁止鼠标缩放地图
          layers: [
            new TileLayer({
              source: new OSM()
            }),
            new TileLayer({
              source: source
            })
          ],
          view: new View({
            // 指定地图投影模式
            projection: 'EPSG:4326', // 采用WGS84坐标系
            // 设置地图中心范围
            center: point, // [108.953098279, 34.2777998978], // 将西安市作为中心点
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
        _that.flagLayerFa = new VectorLayer({
          source: new VectorSource()
        })
        _that.map1.addLayer(_that.flagLayerFa)
      },
      addFeature: function(point, src) {
        const _that = this
        // 添加图层
        const feature = new Feature({
          geometry: new Point(point),
          bjtype: 0 // 0 发案地址
        })
        // 设置ID
        feature.setId(point[0])
        // 设置样式
        feature.setStyle(_that.getStylsFa(feature))
        // 放入features
        _that.featuresFa.push(feature)
        const feature1 = new Feature({
          geometry: new Point(point),
          bjtype: 0 // 0 发案地址
        })
        // 设置ID
        feature1.setId(point[0] + 1)
        // 设置样式
        feature1.setStyle(_that.getStylsFa1(feature1, src))
        // 放入features
        _that.featuresFa.push(feature1)
        // 批量添加feature
        _that.flagLayerFa.getSource().addFeatures(_that.featuresFa)
      },
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
      getStylsFa1(feature1, src) {
        const Styles = []
        Styles.push(
          new Style({
            image: new Icon({
              src: src, // '/static/image/tempMap/unitPosition.png',
              anchor: [0.52, 1.2] // 图标中心
            })
          })
        )
        return Styles
      }
    },
    mounted() {
      const _this = this
      _this.initMap([108.953098279, 34.2777998978])

      _this.showCase = true
      _this.showUnit = false
      _this.showPerson = false
      _this.showCar = false
      _this.setMapCenter([108.911098279, 34.2777998978], '/static/image/tempMap/casePosition.png')
    }
  }
</script>

<style>
  .big_pictrue .el-carousel__container{
    /*height: 500px;*/
    /*height: 960px;*/
    height: 825px;
  }
  .big_pictrue img{
    width: 85%;
  }
  .big_pictrue .pic_div{
    position: relative;
    text-align: center;
  }
  .big_pictrue .pic_div span{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    font-weight: 400;
    opacity: 0.9;
    /*margin-top: 936px;*/
    color: #bce8fc;
    text-shadow: 0px 0px 2px #fff;
    letter-spacing: 2px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
  .big_pictrue .el-carousel__arrow {
    background-color: #0569a291;
  }
</style>
