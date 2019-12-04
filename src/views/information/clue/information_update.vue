<template>
  <div>
    <el-row class="information">
      <img src="@/assets/icon/back.png"  class="goBack" @click="backList">   <!--返回-->
    </el-row>
    <el-card class="information">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3>
            <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">情报线索</p>
          </h3>
          <el-form :model="information" size="small" ref="form" :rules="rules" label-width="140px">
            <el-form-item label="填报人员：">
              {{information.submitPersonName}}
            </el-form-item>
            <el-form-item label="填报单位：">
              {{information.submitDeptName}}
            </el-form-item>
            <el-form-item label="填报时间：">
              {{information.submitTime | formatDate}}
            </el-form-item>
            <el-form-item label="线索标题：" prop="clueName">
              <el-input v-model="information.clueName" placeholder="线索标题" size="small" class="input_w" clearable
                        :disabled="noauth" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="线索内容：" prop="clueContent">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="information.clueContent" :disabled="noauth">
              </el-input>
            </el-form-item>
            <el-form-item label="线索分类：" prop="clueSortId">
              <el-select v-model="information.clueSortId" placeholder="请选择" class="input_w" clearable>
                <el-option v-for="item in $getDicts('xsfl')" :label="item.dictName" :value="item.dictKey" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采集类型：" prop="collectionTypeId">
              <el-select v-model="information.collectionTypeId" placeholder="请选择" class="input_w" clearable>
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('cjlx')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采集地点：" prop="examStatus">
              <el-cascader
                ref="myCascader"
                class="input_w"
                :options="xzqhOptions"
                v-model="information.collectionLocation"
                :props="props"
                change-on-select
                :show-all-levels="false"
                @change="collectionLocationChange"
                clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址：" prop="locationDetailed">
              <el-input v-model="information.locationDetailed" placeholder="详细地址" size="small" class="input_w" clearable
                        :disabled="noauth" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="位置信息：" prop="collectionCoordinate">
              <div @click="mapDialog()">
                <el-input v-model="information.collectionCoordinate" placeholder="位置信息" size="small" class="input_w" clearable :disabled="true"></el-input>
              </div>
              <!--<el-dialog @open="mapDialogOpened()" title="位置信息" :visible.sync="dialogVisible" size="small" width="80%">-->
              <div style="max-height: 500px; overflow-y: auto;">
                <div id="Map" style="width:100%; height:300px;border: 0px solid #FF0000;" ></div>
                <div id="popup" class="ol-popup">
                  <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                  <div id="popup-content"></div>
                </div>
              </div>
              <!--</el-dialog>-->
            </el-form-item>
            <el-form-item label="发生时间：" prop="clueTime">
              <el-date-picker v-model="information.clueTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" class="input_w" clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="上传附件：">
              <el-upload class="upload-demo" drag multiple
                         :limit="5"
                         :action="uploadAction"
                         :auto-upload="true"
                         :file-list="uploadImgs"
                         :on-success="imgSuccess"
                         :on-remove="imgRemove"
                         :on-preview="imgPreview"
                         :before-remove="imgBfRemove"
                         :before-upload="beforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText_clue_size}}<br>{{UploadAttachment.tipText_clue_style}}</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="edit()">提交</el-button>
              <el-button size="small" @click="cancelEdit()"  >取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import VueEditor from '@/components/Editor/VueEditor'
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
    name: 'informationEdit',
    components: {
      VueEditor
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
        dialogVisible: false,
        loading: false,
        uploadAction: this.UploadAttachment.uploadFileUrl,
        curUser: {},
        curDept: {},
        selectCurxzqhDep: { cityName: '' }, // 当前行政区划
        xzqhOptions: [], // 行政区划数据
        area: [],
        props: {
          value: 'cityCode',
          label: 'cityName'
        },
        information: {
          id: '',
          clueNumber: '',
          clueName: '',
          clueSortId: '',
          collectionTypeId: '',
          collectionLocation: '',
          collectionLocationLable: '',
          deptAreaCode: '',
          locationDetailed: '',
          collectionCoordinate: '',
          clueTime: '',
          clueContent: '',
          submitDeptId: '',
          submitDeptName: '',
          submitPersonId: '',
          submitPersonName: '',
          submitPersonNumber: '',
          submitTime: '',
          dataStatus: '',
          shareStatus: '',
          attachment: ''
        },
        uploadImgs: [],
        rules: {
          clueName: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regEnCode = this.$regCode
              const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入标题'))
              } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                callback(new Error('标题不能输入特殊字符'))
              } else if (value.length > 50) {
                callback(new Error('标题长度不能超过 50个字符'))
              } else {
                callback()
              }
            }
          }],
          clueContent: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入线索内容'))
              } else if (value.length > 1000) {
                callback(new Error('内容过长请修改内容'))
              } else {
                callback()
              }
            }
          }],
          clueSortId: [{
            required: true, message: '请选择线索分类', trigger: 'change'
          }],
          collectionTypeId: [{
            required: true, message: '请选择采集类型', trigger: 'change'
          }],
          examStatus: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === null || value === '') {
                callback(new Error('请选择采集地点'))
              } else {
                callback()
              }
            }
          }],
          clueTime: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (new Date() < value) {
                callback(new Error('发生时间不能大于当前时间'))
              } else {
                callback()
              }
            }
          }],
          locationDetailed: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入详细地址'))
              } else if (value.length > 100) {
                callback(new Error('详细地址长度不能超过100个字符'))
              } else {
                callback()
              }
            }
          }],
          collectionCoordinate: [{
            required: true, message: '请在地图选择位置信息', trigger: 'blur'
          }]
        },
        noauth: false
      }
    },
    methods: {
      edit() {
        this.loading = true
        this.$refs.form.validate(valid => {
          if (valid) {
            this.handleImg()
            if (this.information.id) { // 修改
              this.$update('clue/update', this.information).then((response) => {
                if (response.success === true) {
                  this.$message({
                    message: '线索修改成功！',
                    type: 'success'
                  })
                  this.timeOutBack()
                }
              }).catch(() => {
                this.loading = false
              })
            } else { // 添加
              this.$save('clue/save', this.information).then((response) => {
                this.$message({
                  message: '线索添加成功！',
                  type: 'success'
                })
                this.timeOutBack()
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            return false
          }
        })
      },
      detail() {
        this.loading = true
        this.$query('clue/getOne/', { id: this.information.id }).then(response => {
          this.information = response.data
          this.information.clueSortId = response.data.clueSortId + ''
          this.information.collectionTypeId = response.data.collectionTypeId + ''
          // 行政区划
          const clArr = response.data.collectionLocation.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')
          this.information.collectionLocation = []
          if (clArr.length > 0) { // 省
            this.information.collectionLocation.push(clArr[0].trim())
          }
          if (clArr.length > 1) { // 市
            this.information.collectionLocation.push(clArr[1].trim())
          }
          if (clArr.length > 2) { // 区
            this.information.collectionLocation.push(clArr[2].trim())
          }
          // 附件
          if (response.data.attachment !== undefined && response.data.attachment !== null && response.data.attachment !== '') {
            this.uploadImgs = JSON.parse(response.data.attachment)
          }
          this.getCoordinates() // 地图显示坐标数据
        }).catch(() => {
          this.loading = false
        })
      },
      mapDialog() { // 输入框点击弹窗
        // this.dialogVisible = true
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
                url: 'http://10.172.1.195/PGIS_S_TileMap/Maps/bjslyx/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=1.0.0', // bjslyx矢量影像叠加 bjsl 矢量 bjyx影像
                tilePixelRatio: 2, // THIS IS IMPORTANT
                minZoom: 5, // 9 级以下没有
                maxZoom: 20, // 15 级以上没有
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
        _that.map.on('click', function(e) { // 地图点击获取坐标
          if (_that.$route.query.id) {
            if (_that.features && _that.features.length > 1) {
              _that.flagLayer.getSource().removeFeature(_that.features[_that.features.length - 1])// 1.在flagLayer中移除最后一个features
              _that.features.splice(_that.features.length - 1, 1)// 2.移除最后一个features
            }
            if (_that.coordinates && _that.coordinates.length > 1) {
              _that.coordinates.splice(_that.coordinates.length - 1, 1)// 3.移除最后一个坐标
            }
          } else {
            if (_that.features && _that.features.length > 0) {
              _that.flagLayer.getSource().removeFeature(_that.features[_that.features.length - 1])// 1.在flagLayer中移除最后一个features
              _that.features.splice(_that.features.length - 1, 1)// 2.移除最后一个features
            }
            if (_that.coordinates && _that.coordinates.length > 0) {
              _that.coordinates.splice(_that.coordinates.length - 1, 1)// 3.移除最后一个坐标
            }
          }
          const xyObj = { x: e.coordinate[0], y: e.coordinate[1], msg: '<p class="pointText"><span>新位置：</span>[' + e.coordinate[0] + ',' + e.coordinate[1] + ']</p>' }
          _that.setMapZoom(e.coordinate[0], e.coordinate[1])
          _that.information.collectionCoordinate = '[' + e.coordinate[0] + ',' + e.coordinate[1] + ']'// 表单输入框内容改变
          _that.coordinates.push(xyObj)// 加入坐标数组
          _that.handleAddBatchFeature()// 循环坐标数组显示图标
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
      init() {
        this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
          if (response.code === '000000') {
            this.xzqhOptions = response.data ? response.data : []
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      collectionLocationChange(item) {
        this.information.collectionLocationLable = this.$refs['myCascader'].currentLabels
      },
      timeOutBack() {
        const _this = this
        setTimeout(function() {
          _this.loading = false
          _this.backList()
        }, 2000)
      },
      imgSuccess(res, file, fileList) {
        this.uploadImgs = fileList
      },
      imgRemove(file, fileList) {
        this.uploadImgs = fileList
      },
      imgPreview(file) {
        console.log(file)
      },
      imgBfRemove(file, fileList) {
        if (file && file.status === 'success') {
          return this.$confirm('确定移除' + file.name + '？')
        }
      },
      beforeUpload(file) {
        const msg = this.UploadAttachment.fileValid_clue(file)
        if (msg.length > 0) {
          this.$message({
            message: msg, type: 'warning'
          })
          return false
        }
      },
      handleImg() {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.information.attachment = JSON.stringify(arr)
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.backList()
        })
      },
      backList() {
        this.$gotoid('/information/clueList')
      }
    },
    mounted() {
      this.information.submitTime = new Date()
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curDept && this.curUser) {
        this.information.submitPersonId = this.curUser.id
        this.information.submitPersonName = this.curUser.realName
        this.information.submitPersonNumber = this.curUser.userName // 警号
        this.information.submitDeptId = this.curDept.id
        this.information.submitDeptName = this.curDept.depName
        this.information.deptAreaCode = this.curDept.areaCode // 单位所属行政区划
      }
      this.init()
      this.initMap() // 初始化地图
      if (this.$route.query.id) {
        this.information.id = this.$route.query.id
        this.detail()
      }
    },
    filters: {
      formatDate: function(value) {
        var date = new Date(value)
        var y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? ('0' + MM) : MM
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + MM + '-' + d
      },
      formatDateTime: function(value) {
        var date = new Date(value)
        var y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? ('0' + MM) : MM
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    }
  }
</script>

<style scoped>
  .information {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .information h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .information .input_w {
    width: 100%;
  }

  .information .dept-tree {
    max-height: 400px;
    overflow-y: auto;
    padding: 5px;
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
