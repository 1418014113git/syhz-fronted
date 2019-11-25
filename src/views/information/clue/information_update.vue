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
                <el-input v-model="information.collectionCoordinate" placeholder="位置信息" size="small" class="input_w" clearable :disabled="noauth"></el-input>
              </div>
              <el-dialog title="位置信息" :visible.sync="dialogVisible" size="small" width="80%">
                <div style="max-height: 500px; overflow-y: auto">
                  <!--<remote-js src="http://10.100.5.116:7001/PGIS_S_TileMap/js/EzMapAPI.js"></remote-js>-->
                  <div id="map" style="width:100%; height:90%;border: 0px solid #FF0000;" ></div>
                </div>
              </el-dialog>
              <!--<section>
                <remote-js src="http://10.100.5.116:7001/PGIS_S_TileMap/js/EzMapAPI.js"></remote-js>
                <div id="map" :style="{ height: wrapperHeight + 'px'}">
                  &lt;!&ndash;<img src="/static/image/comanaly_images/area.png" width="100%" height="100%">&ndash;&gt;
                </div>
              </section>-->
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
              <el-button type="primary" @click="edit()"  v-if="$isViewBtn('100908')" >提交</el-button>
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
// import remoteJs from '@/components/remote-js'
// import map from 'http://10.174.64.11:8081/PGIS_S_TileMap/js/EzMapAPI.js'
export default {
  name: 'informationEdit',
  components: {
    VueEditor
    // remoteJs
  },
  data() {
    return {
      _MapApp: null,
      g_overlay: null,
      g_edit: false,
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
        }]/*,
          collectionCoordinate: [{
            required: true, message: '请选择位置信息', trigger: 'blur'
          }]*/
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
          // if (this.$route.params.id) { // 修改
          if (this.information.id) { // 修改
            // this.information.id = this.$route.params.id
            this.$update('clue/update', this.information).then((response) => {
              if (response.success === true) {
                this.timeOutBack()
                this.$message({
                  message: '线索修改成功！',
                  type: 'success'
                })
                this.$gotoid('/information/clueList')
              }
            }).catch(() => {
              this.loading = false
            })
          } else { // 添加
            this.$save('clue/save', this.information).then((response) => {
              this.timeOutBack()
              this.$message({
                message: '线索添加成功！',
                type: 'success'
              })
              this.$gotoid('/information/clueList')
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
      }).catch(() => {
        this.loading = false
      })
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
    init() {
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
          } else if (this.curDept.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') {
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.area = currentArea
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
    if (this.$route.query.id) {
      this.information.id = this.$route.query.id
      this.detail()
    }
    if (this.curDept && this.curUser) {
      this.information.submitPersonId = this.curUser.id
      this.information.submitPersonName = this.curUser.realName
      this.information.submitPersonNumber = this.curUser.userName // 警号
      this.information.submitDeptId = this.curDept.id
      this.information.submitDeptName = this.curDept.depName
      this.information.deptAreaCode = this.curDept.areaCode // 单位所属行政区划
    }
    this.init()
    // this.onLoad()
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
</style>
