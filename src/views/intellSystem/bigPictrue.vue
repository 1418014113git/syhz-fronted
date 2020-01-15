<template>
  <section class="big_pictrue" style="position: relative;height: 100%;width: 100%;">
    <div class="box1">
      <el-input placeholder="搜索案件、单位/场所、人员及物品信息" v-model="curKeyword" class="inputwrap" size="medium"  @keyup.enter.native="inputKeyUp">
        <el-select v-model="queryType" slot="prepend" placeholder="请选择" @change="changeOptions">
          <el-option label="案件" value="1"></el-option>
          <el-option label="单位" value="2"></el-option>
          <el-option label="人员" value="3"></el-option>
          <el-option label="物品" value="4"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
      </el-input>
      <!-- 类型 -->
      <el-row class="typewrap" type="flex" justify="center" v-if="isShowUl">
        <ul class="clearfix menu_ul">
          <li class="perLi" v-for="(item, index) in searchMenuList" @click="chooseMenu(index)" :key="index"
              :class="item.active===1?'activeClass':''">
            <svg-icon :style="item.style" :icon-class="item.img" v-if="item.active===0"></svg-icon>
            <svg-icon :style="item.style" :icon-class="item.img + '_b'" v-if="item.active===1"></svg-icon>
            <span class="text"> &nbsp;{{item.text}}</span>
          </li>
        </ul>
      </el-row>
    </div>
    <!-- 结果集 -->
    <div class="resultwrap clearfix">
      <div class="result1" v-if="isShowResult">
        <div class="titlewrap rowText clearfix">
          <div class="halfdivLeft titleText">{{resultTitle1}}</div>
          <div class="halfdivRight titleText">{{resultTitle2}}</div>
        </div>
        <!-- 结果集 -->
        <div v-if="curChooseLabel===0">
          <p style="padding:20px 5px;" v-if="ajData.length===0">没有检索到相关信息！</p>
          <div class="rowText clearfix" v-else-if="ajData.length>1" v-for="(item,index) in ajData" :key="index">
            <div class="halfdivLeft clickClass" @click="lookDetailPanel(item)" :title="curDetail.ajbh">{{item.ajbh}}</div>
            <div class="halfdivRight" :class="curChooseLabel===3?'noClick':'clickClass'" @click="lookDetailPanel(item)" :title="curDetail.ajmc">{{item.ajmc}}</div>
          </div>
        </div>
        <div v-if="curChooseLabel===1">
          <p style="padding:20px 5px;" v-if="dwData.length===0">没有检索到相关信息！</p>
          <div class="rowText clearfix" v-else-if="dwData.length>1" v-for="(item,index) in dwData" :key="index">
            <div class="halfdivLeft clickClass" @click="lookDetailPanel(item)">{{item.yyzzbh}}</div>
            <div class="halfdivRight" :class="curChooseLabel===3?'noClick':'clickClass'"  @click="lookDetailPanel(item)">{{item.dwmc}}</div>
          </div>
        </div>
        <div v-if="curChooseLabel===2">
          <p style="padding:20px 5px;" v-if="ryData.length===0">没有检索到相关信息！</p>
          <div class="rowText clearfix" v-else-if="ryData.length>1" v-for="(item,index) in ryData" :key="index">
            <div class="halfdivLeft clickClass" @click="lookDetailPanel(item)">{{item.xm}}</div>
            <div class="halfdivRight" :class="curChooseLabel===3?'noClick':'clickClass'"  @click="lookDetailPanel(item)">{{item.gmsfhm}}</div>
          </div>
        </div>
        <div v-if="curChooseLabel===3">
          <p style="padding:20px 5px;" v-if="wpData.length===0">没有检索到相关信息！</p>
          <div class="rowText clearfix" v-else-if="wpData.length>1" v-for="(item,index) in wpData" :key="index">
            <div class="halfdivLeft clickClass" @click="lookDetailPanel(item)">{{item.ajbh}}</div>
            <div class="halfdivRight" :class="curChooseLabel===3?'noClick':'clickClass'"  @click="lookDetailPanel(item)">{{item.ajmc}}</div>
          </div>
        </div>
      </div>
      <div class="result2" v-if="isShowDetail">
        <!-- 案件 -->
        <div v-if="curChooseLabel===0">
          <div class="titlewrap rowText clearfix">
            <div class="left bold">{{curDetail.ajmc}}</div>
            <i class="el-icon-circle-close right" style="font-size:19px;margin-top:5px;" @click="closeDetail"></i>
          </div>
          <p class="rowContent"><span class="titleText">案件编号</span><span class="rightText">{{curDetail.ajbh}}</span></p>
          <p class="rowContent"><span class="titleText">发案来源</span><span class="rightText">{{curDetail.ajlyName}}</span></p>
          <p class="rowContent"><span class="titleText">案件类别</span><span class="rightText">{{curDetail.ajlbName}}</span></p>
          <p class="rowContent"><span class="titleText">案件状态</span><span class="rightText">{{curDetail.ajztName}}</span></p>
          <p class="rowContent"><span class="titleText">立案单位</span><span class="rightText">{{curDetail.ladw}}</span></p>
          <p class="rowContent" v-if="curDetail.ajztName==='破案'||curDetail.ajztName==='结案'"><span class="titleText" >破案时间</span><span class="rightText">{{curDetail.parq}}</span></p>
          <p class="rowContent" v-else><span class="titleText">立案时间</span><span class="rightText">{{curDetail.larq}}</span></p>
          <p class="rowContent"><span class="titleText">简要案情</span><span class="rightText rowsText">{{curDetail.jyaq}}</span></p>
        </div>
        <!-- 单位 -->
        <div v-if="curChooseLabel===1" class="company">
          <div class="titlewrap rowText clearfix">
            <div class="left bold">{{curDetail.dwmc}}</div>
            <i class="el-icon-circle-close right" style="font-size:19px;margin-top:5px;" @click="closeDetail"></i>
          </div>
          <p class="rowContent"><span class="titleText">统一信用代码</span><span class="rightText">{{curDetail.yyzzbh}}</span></p>
          <p class="rowContent"><span class="titleText">企业性质</span><span class="rightText">{{curDetail.dwxzName}}</span></p>
          <p class="rowContent"><span class="titleText">法人姓名</span><span class="rightText">{{curDetail.frdbxm}}</span></p>
          <p class="rowContent"><span class="titleText">法人身份证号</span><span class="rightText">{{curDetail.frdbgmsfhm}}</span></p>
          <p class="rowContent"><span class="titleText">法人联系电话</span><span class="rightText">{{curDetail.frdnlxfs}}</span></p>
          <p class="rowContent"><span class="titleText">注册详址</span><span class="rightText">{{curDetail.zcdzxz}}</span></p>
          <p class="rowContent"><span class="titleText">违法犯罪事实</span><span class="rightText">{{curDetail.wffzss}}</span></p>
        </div>
        <!-- 人员 -->
        <div v-if="curChooseLabel===2">
          <div class="titlewrap rowText clearfix">
            <div class="left bold">人员信息</div>
            <i class="el-icon-circle-close right" style="font-size:19px;margin-top:5px;" @click="closeDetail"></i>
          </div>
          <div class="clearfix" style="margin:10px;">
            <img class="avatarImg left" src="/static/image/personFile_images/defaultUuser.png">
            <div class="left baseInfo">
              <p>{{curDetail.xm}}</p>
              <p>{{curDetail.gmsfhm}}</p>
              <p>{{curDetail.xbName}}</p>
              <p>{{curDetail.mzName}}</p>
            </div>
          </div>
          <p class="rowContent"><span class="titleText">户籍地址</span><span class="rightText">{{curDetail.hjdzxz}}</span></p>
          <p class="rowContent"><span class="titleText">现居住地</span><span class="rightText">{{curDetail.zzxz}}</span></p>
          <p class="rowContent"><span class="titleText">职业类别</span><span class="rightText">{{curDetail.zylb}}</span></p>
          <p class="rowContent"><span class="titleText">服务处所</span><span class="rightText">{{curDetail.fwcs}}</span></p>
          <!-- <span class="rowContent"><span class="titleText">人员类型</span><span class="rightText">{{curDetail.}}</span></p> -->
        </div>
        <!-- 物品 -->
        <div v-if="curChooseLabel===3">
          <div class="titlewrap rowText clearfix">
            <div class="left bold">物品信息</div>
            <i class="el-icon-circle-close right" style="font-size:19px;margin-top:5px;" @click="closeDetail"></i>
          </div>
          <p style="margin: 10px;">
            <img src="/static/image/syh_images/car.svg" alt="" style="width:35px;">
            <span class="titleText">车辆</span>
          </p>
          <!-- <p class="rowContent"><span class="titleText">车牌号</span><span class="rightText">{{curDetail.}}</span></p>
          <p class="rowContent"><span class="titleText">车辆品牌</span><span class="rightText">{{curDetail.}}</span></p>
          <p class="rowContent"><span class="titleText">车辆型号</span><span class="rightText">{{curDetail.}}</span></p>
          <p class="rowContent"><span class="titleText">车身颜色</span><span class="rightText">{{curDetail.}}</span></p>
          <p class="rowContent"><span class="titleText">所有人</span><span class="rightText">{{curDetail.}}</span></p> -->
        </div>
      </div>
    </div>

    <div id="Map" style="width: 100%; height: 100%;"></div>
    <div id="tipWarp">
      <div id="tipBoxs" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
    <!-- <div v-if="showCase" style="position: fixed;width: 300px;left: 90px;top: 190px;">
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
    </div> -->
  </section>
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
      isShowDetail: false, // 是否显示详情
      images: [
        { name: '涉环食药单位/场所', url: '/static/image/syh_images/dw.jpg' },
        { name: '案件', url: '/static/image/syh_images/ajxgr.jpg' },
        { name: '人员', url: '/static/image/syh_images/ry.jpg' },
        { name: '物品', url: '/static/image/syh_images/wp.jpg' }
      ],
      flagLayerFa: null,
      ajData: [],
      dwData: [],
      ryData: [],
      wpData: [],
      curKeyword: '',
      queryType: '1', // 查询类型
      curChooseLabel: 0,
      isShowUl: false, // 是否展示类型页签ul
      isShowResult: false, // 是否展示结果类型和一级结果集，0无数据，1有数据
      resultTitle1: '案件编号', // 结果集面板的标题
      resultTitle2: '案件名称',
      curDetail: {}, // 详情面板
      searchMenuList: [
        {
          text: '案件',
          active: 1, // 默认选中的是案件
          img: 'lawcase'
        },
        {
          text: '单位/场所',
          active: 0,
          img: 'company'
        },
        {
          text: '人员',
          active: 0,
          img: 'czrk'
        },
        {
          text: '物品',
          active: 0,
          img: 'all'
          // style: 'font-size:14px;margin-bottom:3px;'
        }
      ],
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      pgisUrl: '' // 存储接口查询出来的pgis地址

    }
  },
  methods: {
    chooseMenu(index) {
      this.isShowResult = true // 默认数据多于两条 显示一级结果列表
      this.isShowDetail = false // 默认数据多于两条 关闭掉详情面板
      this.curChooseLabel = index // 当前选中的标签
      this.searchMenuList.forEach(element => {
        element.active = 0
      })
      this.searchMenuList[index].active = 1 // 选中的 设置样式
      switch (index) {
        case 0:
          if (this.ajData.length === 1) {
            this.isShowResult = false
            this.isShowDetail = true // 详情面板显示
            this.curDetail = this.ajData[0] // 只有一条数据
          } else {
            this.resultTitle1 = '案件编号'
            this.resultTitle2 = '案件名称'
          }
          break
        case 1:
          if (this.dwData.length === 1) {
            this.isShowResult = false
            this.isShowDetail = true // 详情面板显示
            this.curDetail = this.dwData[0] // 只有一条数据
          } else {
            this.resultTitle1 = '统一信用代码'
            this.resultTitle2 = '单位名称'
          }
          break
        case 2:
          if (this.ryData.length === 1) {
            this.isShowResult = false
            this.isShowDetail = true // 详情面板显示
            this.curDetail = this.ryData[0] // 只有一条数据
          } else {
            this.resultTitle1 = '涉案人员'
            this.resultTitle2 = '身份证号'
          }
          break
        case 3:
          if (this.wpData.length === 1) {
            this.isShowResult = false
            this.isShowDetail = true // 详情面板显示
            this.curDetail = this.wpData[0] // 只有一条数据
          } else {
            this.resultTitle1 = '涉案车牌号'
            this.resultTitle2 = '所有人'
          }
          break
        default:
          break
      }
    },
    inputKeyUp() {
      this.handleSearch()
    },
    handleSearch() { // 搜索
      if (!this.curKeyword) {
        this.$message.error('请输入关键字查询')
        return false
      }
      document.getElementById('Map').innerHTML = ''
      var param = {
        type: this.queryType, // 查询的类型
        keyWord: this.curKeyword // 关键字
      }
      if (this.deptInfo.depType === '1') {
        param.provinceCode = '610000'
      } else if (this.deptInfo.depType === '2') {
        param.cityCode = this.deptInfo.areaCode
      } else if (this.deptInfo.depType === '3') {
        param.deptCode = this.deptInfo.depCode
      } else if (this.deptInfo.depType === '4') {
        param.deptCode = this.deptInfo.parentDepCode
      }
      this.$query('HsyPicture/list', param).then((response) => {
        if (response.code === '000000') {
          this.isShowUl = true
          this.isShowResult = true
          this.ajData = response.data.aj || [] // 案件
          this.dwData = response.data.dw || [] // 单位
          this.ryData = response.data.ry || [] // 人员
          this.wpData = response.data.wp || [] // 物品
          this.chooseMenu(Number(this.queryType) - 1) // 检索分类选择了哪一类，信息检索后选中并展示该类信息
          for (let index = 0; index < this.ajData.length; index++) { // 若查出来的案件没有xy 赋值为0
            var element = this.ajData[index]
            if (!element.x) {
              element.x = 0
            }
            if (!element.y) {
              element.y = 0
            }
          }
          this.initMap() // 绘制地图
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    changeOptions(data) {
      // const _this = this
      // if (data === '1') {
      //   _this.showCase = true
      //   _this.showUnit = false
      //   _this.showPerson = false
      //   _this.showCar = false
      //   _this.setMapCenter([108.911098279, 34.2777998978], '/static/image/tempMap/casePosition.png')
      // } else if (data === '2') {
      //   _this.showCase = false
      //   _this.showUnit = true
      //   _this.showPerson = false
      //   _this.showCar = false
      //   _this.setMapCenter([108.922098279, 34.2777998978], '/static/image/tempMap/unitPosition.png')
      // } else if (data === '3') {
      //   _this.showPerson = true
      //   _this.showCase = false
      //   _this.showUnit = false
      //   _this.showCar = false
      //   _this.setMapCenter([108.933098279, 34.2777998978], '/static/image/tempMap/personPositon.png')
      // } else if (data === '4') {
      //   _this.showCar = true
      //   _this.showCase = false
      //   _this.showUnit = false
      //   _this.showPerson = false
      //   _this.setMapCenter([108.944098279, 34.2777998978], '/static/image/tempMap/carPosition.png')
      // }
    },
    lookDetailPanel(item) { // 查看详情
      this.isShowDetail = true
      this.curDetail = Object.assign({}, item)
    },
    closeDetail() { // 关闭右侧详情
      this.isShowDetail = false
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
      if (_that.ajData.length > 0) {
        for (var i = 0; i < _that.ajData.length; ++i) {
          // if (_that.ajData[i].x && _that.ajData[i].y) { // 有 xy的情况
          var coordinates = [Number(_that.ajData[i].x), Number(_that.ajData[i].y)]
          features[i] = new Feature(new Point(coordinates))
          // }
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
              for (let i = 0; i < _that.ajData.length; i++) {
                if (Number(_that.ajData[i].x) === points[0] && Number(_that.ajData[i].y) === points[1]) {
                  count = {
                    Id: _that.ajData[i].id,
                    ajmc: _that.ajData[i].ajmc,
                    ajbh: _that.ajData[i].ajbh,
                    fadz: _that.ajData[i].fadz
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
    const _this = this
    _this.queryPgisUrl() // 查询pgisUrl
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.big_pictrue {
  .box1 {
    position: absolute;
    top: 10px;
    left: 46px;
    // width: 30%;
    width: 460px;
    z-index: 1;
    max-width: 460px;
    .inputwrap {
      // width: 50%;
      .el-input-group__append,
      .el-input-group__prepend {
        background-color: rgba(0, 89, 130, 1);
        .el-input__inner {
          background-color: rgba(0, 89, 130, 1);
          color: #fff;
        }
        .el-button {
          background: transparent;
        }
      }
      .el-input__inner {
        background: rgba(255, 255, 255, 0.9);
        color: rgba(0, 0, 0, 0.8);
        padding: 0 5px;
      }
      .el-input-group__prepend {
        width: 75px;
        padding: 0;
        .el-select {
          margin: -10px 0;
          width: 100%;
          .el-input__inner {
            padding: 0 20px 0 0px;
            text-align: center;
          }
          .el-input__suffix {
            right: 0px;
          }
        }
      }
    }
    .typewrap {
      // width: 50%;
      .menu_ul {
        width: 100%;
        background: rgba(3, 65, 94, 0.9);
        border: 1px solid #00a0e9;
        height: 44px;
        line-height: 44px;
        margin-bottom: 0px;
      }
      .activeClass {
        color: #1e98d2;
        background-color: rgba(188, 232, 252, 0.1);
        border-right-color: #00a0e9;
        border-left-color: #00a0e9;
      }
      .perLi {
        float: left;
        width: 100px;
        text-align: center;
        cursor: pointer;
        width: 24%;
      }
      .perLi:nth-child(2) {
        // 第二个字比较多 所以设置比较大
        width: 28%;
      }
      .svg-icon {
        width: 1em !important;
        height: 1em !important;
        vertical-align: middle;
      }
    }
  }
  // 结果集
  .resultwrap {
    position: absolute;
    top: 90px;
    left: 46px;
    z-index: 1;
    // width: 460px;
    .result1,
    .result2 {
      float: left;
      height: 400px;
      max-height: 400px;
      overflow-y: auto;
      width: 460px;
      max-width: 460px;
      background: linear-gradient(rgba(3, 65, 94, 1), rgba(17, 125, 173, 0.5));
      border: 1px solid rgb(138, 125, 255);
      padding: 0 10px 10px 10px;
      .halfdivLeft {
        float: left;
        width: 49%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .halfdivRight {
        float: right;
        width: 49%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .titlewrap {
        border-bottom: 1px solid #01f9fb;
      }
      .titleText {
        color: #01f9fb;
        font-weight: bold;
      }
      .rowText {
        padding: 12px 10px;
      }
      .rowContent {
        margin: 14px 12px;
        span {
          display: inline-block;
        }
        .titleText {
          float: left;
          width: 90px;
        }
        .rightText {
          float: left;
          width: calc(100% - 90px);
          word-break: break-all;
          // text-overflow: ellipsis;
          // overflow: hidden;
          // white-space: nowrap;
        }
        // 简要案情的可以折行
        // .rightText.rowsText {
        //   text-overflow: initial;
        //   overflow: auto;
        //   white-space: normal;
        // }
      }
      .rowContent:after {
        clear: both;
        display: block;
        content: "";
      }
      .company .titleText {
        // 单位场所标题文字较多
        width: 130px;
      }
      .company .rightText {
        width: calc(100% - 130px);
      }
    }
    .result1 {
      // width: 50%;
    }
    .result2 {
      // width: 49%;
      // margin-left: 1%;
    }
    .baseInfo {
      p {
        margin: 13px 0 11px 0;
      }
    }
    .avatarImg {
      width: 122px;
      height: 155px;
      border-radius: 4px;
      border: 1px solid 1px #005982;
      margin-right: 30px;
    }
  }
  .clickClass {
    cursor: pointer;
  }
  .clickClass:hover {
    color: #00a0e9;
    text-decoration: underline;
  }
  .noClick {
    pointer-events: none;
  }
  .bold {
    font-weight: bold;
  }
}

.big_pictrue .el-carousel__container {
  /*height: 500px;*/
  /*height: 960px;*/
  height: 825px;
}
.big_pictrue img {
  width: 85%;
}
.big_pictrue .pic_div {
  position: relative;
  text-align: center;
}
.big_pictrue .pic_div span {
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
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
.big_pictrue .el-carousel__arrow {
  background-color: #0569a291;
}
.big_pictrue {
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
    .ajbh:hover {
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
}
</style>
