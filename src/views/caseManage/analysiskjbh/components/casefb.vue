<template>
   <!-- 案件分布分析 -->
   <div class="casefb" v-loading="loading">
    <div>
      <p class="comTit">案件分布分析</p>
      <div class="mapCount" id="mapCount">
        <div id="Map" style="width: 100%; height: 100%;"></div>
      </div>
      <div id="tipWarp">
        <div id="tipBoxs" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
      </div>
   </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
// import VectorSource from 'ol/source/Vector'
// import Cluster from 'ol/source/Vector'
import { Cluster, Vector as VectorSource } from 'ol/source'
// import Cluster from 'ol/source'
import { Map, View, Feature, Overlay } from 'ol'
// import { Style, Icon } from 'ol/style'
// import Text from 'ol/style/Text'
// import Fill from 'ol/style/Fill'
import { Point } from 'ol/geom'
import { defaults } from 'ol/control/util.js'
import { defaults as defaultInteractions } from 'ol/interaction.js'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text } from 'ol/style'
// import { getWidth /* getTopLeft*/ } from 'ol/extent.js'
// import { get as getProjection } from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import XYZ from 'ol/source/XYZ.js'
export default {
  props: ['queryParam'],
  data() {
    return {
      map: null,
      overlay: null,
      coordinatesFa: [], // 案件分布地区坐标数据
      succeed: false,
      loading: false, // 页面加载进度条
      curParam: {},
      curDept: {},
      pgisUrl: '', // 存储接口查询出来的pgis地址
      testData: [ // 测试数据
      //   {
      //     'deptName': '西安市公安局环食药支队',
      //     'ajbh': '1832',
      //     'parq': '20190903',
      //     'larq': '20190612',
      //     'fllb': '2',
      //     'ajmc': 'XXX山地破坏案件，串并XXX山林毁坏案。',
      //     'zjzt': '107',
      //     'zjtzName': '结案',
      //     'x': '109.101117',
      //     'y': '34.187363',
      //     'Id': 1981,
      //     'deptCode': '610100460000',
      //     'fadz': ''
      //   },
      //   {
      //     'deptName': '西安市公安局环食药支队',
      //     'ajbh': '1833',
      //     'parq': '20190903',
      //     'larq': '20190612',
      //     'fllb': '2',
      //     'ajmc': 'XXX山地破坏案件，串并XXX山林毁坏案。',
      //     'zjzt': '107',
      //     'zjtzName': '结案',
      //     'x': '109.022929',
      //     'y': '34.553499',
      //     'Id': 1982,
      //     'deptCode': '610100460000',
      //     'fadz': ''
      //   }
      ]
    }
  },
  watch: {
    queryParam(val) {
      this.curParam = val
      this.query()
    }
  },
  methods: {
    init() {
      // console.log('初始化')
    },
    query() { // 查询数据
      this.loading = true
      this.coordinatesFa = []
      document.getElementById('Map').innerHTML = ''
      const para = JSON.parse(JSON.stringify(this.curParam))
      para.deptType = this.curDept.depType === '4' ? (this.curDept.areaCode.substring(0, 4) === '6114' ? 2 : 3) : Number(this.curDept.depType) // 部门类型 如果是杨凌派出所则传支队类型，普通派出所传大队类型
      para.deptCode = this.curDept.areaCode // 区域code
      this.$queryPost('ajfxyp/dataList', para).then((response) => {
        if (response.code === '000000') {
          this.coordinatesFa = response.data.mapData
          this.queryPgisUrl() // 查询pgisUrl
        }
      }).catch(() => {
        this.coordinatesFa = []
        this.queryPgisUrl() // 查询pgisUrl
      })
    },
    queryPgisUrl() { // 查询pgisUrl
      this.$query('sysconfigbykey/pgisUrl', {}).then((response) => {
        this.loading = false
        if (response.data && response.data.configValue) {
          this.pgisUrl = response.data.configValue
        }
        this.initMap()
      }).catch(() => {
        this.loading = false
        this.initMap()
      })
    },
    /**
     * 初始化地图
     */
    initMap() {
      const _that = this
      var container = document.getElementById('tipBoxs')
      var content = document.getElementById('popup-content')
      var popupCloser = document.getElementById('popup-closer')
      if (!container) {
        var tipWarp = document.getElementById('tipWarp')
        tipWarp.innerHTML = ' <div id="tipBoxs" class="ol-popup"><a href="#" id="popup-closer" class="ol-popup-closer"></a><div id="popup-content"></div></div>'
        container = document.getElementById('tipBoxs')
        content = document.getElementById('popup-content')
        popupCloser = document.getElementById('popup-closer')
      }
      var features = []
      if (_that.coordinatesFa.length > 0) {
        for (var i = 0; i < _that.coordinatesFa.length; ++i) {
          var coordinates = [Number(_that.coordinatesFa[i].x), Number(_that.coordinatesFa[i].y)]
          features[i] = new Feature(new Point(coordinates))
        }
      }
      var source = new VectorSource({
        features: features
      })

      var clusterSource = new Cluster({
        source: source
      })
      var styleCache = {}
      var clusters = new VectorLayer({
        source: clusterSource,
        style: function(feature) {
          var size = feature.get('features').length
          if (size > 1) { // 聚合数字>1时，显示聚合点样式
            var style = styleCache[size]
            if (!style) {
              style = new Style({
                image: new CircleStyle({
                  radius: 15,
                  stroke: new Stroke({
                    color: '#fff'
                  }),
                  fill: new Fill({
                    color: '#E6A23C'
                  })
                }),
                text: new Text({
                  text: size.toString(),
                  fontSize: 20,
                  fill: new Fill({
                    color: '#fff'
                  })
                })
              })
              styleCache[size] = style
            }
            return style
          } else { // 显示地标样式
            feature.setStyle(_that.getStylsFa(feature))
          }
        }
      })
      var raster = null
      if (this.pgisUrl) {
        raster = new TileLayer({
          source: new XYZ({ // 正式地址
            url: 'http://10.172.1.195/PGIS_S_TileMapServer/Maps/stsl/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=1.0.0', // bjslyx矢量影像叠加 bjsl 矢量 bjyx影像
            tilePixelRatio: 2, // THIS IS IMPORTANT
            minZoom: 1, // 9 级以下没有
            maxZoom: 22, // 15 级以上没有
            projection: 'EPSG:4326' // 采用WGS84坐标系
          })
        })
      } else {
        raster = new TileLayer({
          source: new OSM() // 测试地址
        })
      }

      _that.map = new Map({
        target: 'Map',
        controls: defaults({ zoom: true }), // 地图左上角的缩放按钮，默认是zoom:false不显示
        interactions: defaultInteractions({ mouseWheelZoom: false }), // 禁止鼠标缩放地图
        layers: [raster, clusters],
        view: new View({
          // 指定地图投影模式
          projection: 'EPSG:4326', // 采用WGS84坐标系
          // 设置地图中心范围
          center: [108.9500, 34.22869], // 中心点是 西安市
          zoom: 9, // 定义地图显示层级为 9-15
          // 限制缩放级别，可以和extent同用限制范围
          maxZoom: 22,
          // // 最小级别，越大则面积越大
          minZoom: 5
        })
      })
      _that.overlay = new Overlay({
        // 设置弹出框的容器
        element: container,
        // 是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true
      })

      _that.map.on('pointermove', function(e) {
        var pixel = _that.map.getEventPixel(e.originalEvent)
        _that.map.forEachFeatureAtPixel(pixel, function(feature) {
          if (feature && feature.values_.features.length > 0) {
            if (feature.values_.features.length === 1) {
              var points = feature.values_.geometry.flatCoordinates
              var count = {}
              for (let i = 0; i < _that.coordinatesFa.length; i++) {
                if (Number(_that.coordinatesFa[i].x) === points[0] && Number(_that.coordinatesFa[i].y) === points[1]) {
                  count = {
                    Id: _that.coordinatesFa[i].Id,
                    ajmc: _that.coordinatesFa[i].ajmc,
                    ajbh: _that.coordinatesFa[i].ajbh,
                    fadz: _that.coordinatesFa[i].fadz
                  }
                }
              }
              content.innerHTML = '<p class="ajmcName">' + count.ajmc + '</p><p><span>案件编号：</span><span  id="ajbh" class="ajbh">' + count.ajbh + '</span></p><p><img src="/static/image/caseFile_images/mapbluebj.png"><span class="address">' + count.fadz + '</span></p>'
              if (document.getElementById('tipBoxs')) {
                var ajbh = document.getElementById('ajbh')
                ajbh.onclick = function(e) {
                  _that.$router.push({ // 跳到案件档案页面
                    path: '/caseFile/index', query: { id: count.Id }
                  })
                  e.stopPropagation() // 阻止冒泡到父级的点击事件
                }
              }
            } else {
              content.innerHTML = '<p class="ajmcName">双击数字查看更多</p>'
            }
            _that.overlay.setPosition(e.coordinate)
            _that.map.addOverlay(_that.overlay)
          }
        })
      })

      if (popupCloser) {
        popupCloser.addEventListener('click', function() {
          _that.overlay.setPosition(undefined)
        })
      }
    },
    /**
     * 设置坐标 Style
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
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.casefb {
  width: 100%;
  .mapCount {
    width: 100%;
    height: 450px;
    overflow: hidden;
  }
  .marl {
    margin-left: 16px;
  }
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
    cursor: pointer;
  }
  .ajbh:hover{
    color: #00a0e9;
  }
  img {
    width: 10px;
    margin-right: 5px;
  }
  .fadz {
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

}
</style>
