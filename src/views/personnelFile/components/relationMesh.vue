<template>
<!-- 关系挖掘 -->
  <div class="relationMesh" v-loading="loading">
    <title-pub :title="title" :url="url" :jumpType="1" :moreParam="moreParam"></title-pub>
    <div class="mesh">
      <!-- <div class="mesh-toolbar">
        <div>
          <el-select class="mesh-search"
                    v-model="searchParams.typeId"
                    placeholder="请选择类别">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="mesh-search"
                    v-model="searchParams.idCardNo"
                    v-if="showIdCard"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入身份证号"
                    :remote-method="searchUser"
                    :loading="loadingUser">
            <el-option
              v-for="item in userOptions"
              :key="item.gmsfhm"
              :label="item.xm + '(' + item.gmsfhm + ')'"
              :value="item.gmsfhm">
            </el-option>
          </el-select>
          <el-input class="mesh-search" v-model="searchParams.ajbh" v-if="showCase" placeholder="请输入案件编号"></el-input>
          <el-input class="mesh-search" v-model="searchParams.qbxsId" v-if="showCue" placeholder="请输入情报线索编号"></el-input>
          <el-button class="mesh-search-btn" @click="searchData">搜索</el-button>
        </div>
      </div> -->
      <div id="chartColumn"></div>
      <div class="mesh-change-eChart" v-if="isHaveData">
        <div class="eChart-mesh eChart-circle-change z-index-2" @click="clickChangeMenu($event)">
          <img src="static/image/chart_images/change_mesh.png" alt="">
        </div>
        <div class="eChart-ring eChart-circle-change z-index-0" @click="clickChangeMenu($event)">
          <img src="static/image/chart_images/change_ring.png" alt="">
        </div>
        <div class="eChart-time eChart-circle-change z-index-1" @click="clickChangeMenu($event)">
          <img src="static/image/chart_images/change_time.png" alt="">
        </div>
      </div>
      <div class="node-menu" v-if="nodeMenu">
        <div class="node-menu-btns">
          <div>
            <div class="node-menu-btn node-menu-detail" @click="clickDetail"></div>
            <div class="node-menu-btn node-menu-cueMining" @click="clickGoOnCueMining"></div>
          </div>
          <div>
            <span class="node-menu-cancel" @click="clickCancel">取消</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eChart from 'echarts'
import axios from 'axios'
import $ from 'jquery'
import titlePub from './titlePub'
export default {
  props: ['cardId'],
  name: 'relationMesh',
  data() {
    return {
      title: '关系挖掘',
      url: '/mesh',
      // 类型
      typeOptions: [
        {
          id: 1,
          value: '人员挖掘'
        },
        {
          id: 2,
          value: '案件挖掘'
        },
        {
          id: 3,
          value: '线索挖掘'
        }
      ],
      // 详情页面返回类别
      type: 1, // 根据身份证号查询
      // 当前点击的节点
      currentNode: null,
      // 节点菜单是否显示
      nodeMenu: false,
      // 节点集合
      dataArray: [],
      // 关系集合
      linkArray: [],
      // 节点ID的集合，为了验证节点ID是否重复出现
      dataIdArray: [],
      // 带时间节点ID的集合，为了验证节点ID是否重复出现
      dataTimeIdArray: [],
      // 关系集合，为了排除双向关系
      targetSourceArray: [],
      // 用户集合
      userOptions: [],
      // 案件集合
      caseOptions: [],
      // 线索集合
      cueOptions: [],
      // 用户数据加载中效果的控制
      loadingUser: false,
      // 案件数据加载中效果的控制
      loadingCase: false,
      // 线索数据加载中效果的控制
      loadingCue: false,
      // 是否显示用户下拉框
      showIdCard: true,
      // 是否显示案件输入框
      showCase: false,
      // 是否显示线索输入框
      showCue: false,
      // 节点集合
      nodeArray: [],
      // 为了节点的循环计数
      index: 0,
      // 查询字段
      searchParams: {
        typeId: '',
        idCardNo: '',
        ajbh: '',
        qbxsId: ''
      },
      // 样式动画效果需要的参数
      initStart: {
        opacity: '0',
        width: '0',
        height: '0',
        bottom: '20px',
        right: '20px'
      },
      // 样式动画效果需要的参数
      zIndex2: {
        width: '54px',
        height: '54px',
        opacity: '1',
        bottom: '20px',
        right: '20px'
      },
      // 样式动画效果需要的参数
      zIndex1: {
        opacity: '1',
        width: '44px',
        height: '44px',
        bottom: '0',
        right: '100px'
      },
      // 样式动画效果需要的参数
      zIndex0: {
        opacity: '1',
        width: '44px',
        height: '44px',
        bottom: '94px',
        right: '60px'
      },
      loading: null,
      // 1-网状图，2-环形图，3-时间序列图
      eChartType: '1',
      mesh: null,
      moreParam: '', // 跳转到关系挖掘主页传递的参数
      cardNumber: '', // 存储身份证号
      isHaveData: false, // 是否显示切换按钮
      testData: { // 测试数据
        'success': 'true',
        'code': '000000',
        'message': 'OK',
        'data': [
          {
            'id': '150221199601080000',
            'parentId': null,
            'name': '筹集坏2',
            'type': '1',
            'link': null,
            'children': [
              {
                'id': 'J1529004913076100002',
                'parentId': '150221199601080000',
                'name': 'XXXXXX标罪',
                'type': '2',
                'link': '涉案',
                'children': [
                  {
                    'id': '152224199005230516',
                    'parentId': 'J1529004913076100002',
                    'name': 'XXX(13566665555)',
                    'type': '1',
                    'link': '嫌疑人',
                    'children': [
                      {
                        'id': '152224199005230512',
                        'parentId': '152224199005230516',
                        'name': '光和热(13566668888)',
                        'type': '1',
                        'link': '通话联系人',
                        'children': null,
                        'date': '2019-01-24 11:03:03'
                      },
                      {
                        'id': 'J1529230212042600001',
                        'parentId': '152224199005230516',
                        'name': 'XXXXXX公司被合同诈骗案',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      },
                      {
                        'id': 'J1529004913076100002',
                        'parentId': '152224199005230516',
                        'name': 'XXXXXX标罪',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      },
                      {
                        'id': '1071',
                        'parentId': '152224199005230516',
                        'name': '阀手动阀',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1072',
                        'parentId': '152224199005230516',
                        'name': 'asdf ',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1073',
                        'parentId': '152224199005230516',
                        'name': 'fasdfa s',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1074',
                        'parentId': '152224199005230516',
                        'name': '士大夫共撒打发',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1076',
                        'parentId': '152224199005230516',
                        'name': '干哈范围',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1077',
                        'parentId': '152224199005230516',
                        'name': 'asdgasd',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1081',
                        'parentId': '152224199005230516',
                        'name': '撒打发',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1096',
                        'parentId': '152224199005230516',
                        'name': '啊但是发射点',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1097',
                        'parentId': '152224199005230516',
                        'name': '阀手动阀阿三打法阿斯蒂',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1098',
                        'parentId': '152224199005230516',
                        'name': '撒打发',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      },
                      {
                        'id': '1100',
                        'parentId': '152224199005230516',
                        'name': 'qerqwer',
                        'type': '3',
                        'link': '涉事线索',
                        'children': null,
                        'date': null
                      }
                    ],
                    'date': '2013-11-05 00:00:00'
                  },
                  {
                    'id': '152224199005230514',
                    'parentId': 'J1529004913076100002',
                    'name': 'XXX(13566664444)',
                    'type': '1',
                    'link': '嫌疑人',
                    'children': [
                      {
                        'id': '152224199005230512',
                        'parentId': '152224199005230514',
                        'name': '光和热(13566668888)',
                        'type': '1',
                        'link': '通话联系人',
                        'children': null,
                        'date': '2019-01-24 11:02:58'
                      },
                      {
                        'id': 'J1529230212042600001',
                        'parentId': '152224199005230514',
                        'name': 'XXXXXX公司被合同诈骗案',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      },
                      {
                        'id': 'J1529004913076100002',
                        'parentId': '152224199005230514',
                        'name': 'XXXXXX标罪',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      }
                    ],
                    'date': '2013-11-05 00:00:00'
                  },
                  {
                    'id': '150221199601080000',
                    'parentId': 'J1529004913076100002',
                    'name': 'XXX',
                    'type': '1',
                    'link': '嫌疑人',
                    'children': [
                      {
                        'id': 'J1529004913076100002',
                        'parentId': '150221199601080000',
                        'name': 'XXXXXX标罪',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      }
                    ],
                    'date': '2013-11-05 00:00:00'
                  },
                  {
                    'id': '150221199501050000',
                    'parentId': 'J1529004913076100002',
                    'name': 'XXX',
                    'type': '1',
                    'link': '嫌疑人',
                    'children': [
                      {
                        'id': 'J1529004913076100002',
                        'parentId': '150221199501050000',
                        'name': 'XXXXXX标罪',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      }
                    ],
                    'date': '2013-11-05 00:00:00'
                  },
                  {
                    'id': '150221196709160000',
                    'parentId': 'J1529004913076100002',
                    'name': 'XXX',
                    'type': '1',
                    'link': '嫌疑人',
                    'children': [
                      {
                        'id': 'J1529230212042600001',
                        'parentId': '150221196709160000',
                        'name': 'XXXXXX公司被合同诈骗案',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      },
                      {
                        'id': 'J1529004913076100002',
                        'parentId': '150221196709160000',
                        'name': 'XXXXXX标罪',
                        'type': '2',
                        'link': '涉案',
                        'children': null,
                        'date': '2018-07-28 14:41:03'
                      }
                    ],
                    'date': '2013-11-05 00:00:00'
                  }
                ],
                'date': '2018-07-28 14:41:03'
              }
            ],
            'date': '2019-06-11 15:30:41'
          }
        ],
        'endActualClass': []
      }
    }
  },
  components: {
    titlePub
  },
  watch: {
    'searchParams.typeId': function(val, oldVal) {
      var _this = this
      if (val === 1) {
        _this.showIdCard = true
        _this.showCase = false
        _this.showCue = false
        _this.searchParams.idCardNo = ''
        _this.searchParams.ajbh = ''
        _this.searchParams.qbxsId = ''
      } else if (val === 2) {
        _this.showIdCard = false
        _this.showCase = true
        _this.showCue = false
        _this.searchParams.idCardNo = ''
        _this.searchParams.ajbh = ''
        _this.searchParams.qbxsId = ''
      } else if (val === 3) {
        _this.showIdCard = false
        _this.showCase = false
        _this.showCue = true
        _this.searchParams.idCardNo = ''
        _this.searchParams.ajbh = ''
        _this.searchParams.qbxsId = ''
      }
    },
    cardId(val) {
      this.cardNumber = val
      this.init()
    }
  },
  methods: {
    // 点击查看详细
    clickDetail: function() {
      var _this = this
      var params = _this.currentNode
      if (params) {
        var data = params.data
        if (data.type === '1') {
          _this.nodeMenu = false
          _this.$router.push({
            path: '/personnelFile/index', // 升级版人员档案
            query: { cardId: data.id }
          })
        } else if (data.type === '2') {
          _this.nodeMenu = false
          _this.$router.push({
            path: '/caseFile/index', query: { ajbh: data.id, isRl: '1' } // 展示申请督办等按钮
          })
        }
      }
    },
    // 点击继续挖掘
    clickGoOnCueMining: function() {
      var _this = this
      var params = _this.currentNode
      if (params) {
        var parentData = params.data
        var parentIndex = params.dataIndex
        var type = parentData.type
        if (type && type === '1') {
          // 点击人继续挖掘
          _this.nodeMenu = false
          _this.searchDataByIdCardNo(parentData.id, parentData, parentIndex)
        } else if (type && type === '2') {
          // 点击案件继续挖掘
          _this.nodeMenu = false
          _this.searchDataByAjbh(parentData.id, parentData, parentIndex)
        } else if (type && type === '3') {
          // 点击线索继续挖掘
          _this.nodeMenu = false
          parentData.parentId = parentData.id
          _this.searchDataByQBXSBH(parentData.id, parentData, parentIndex)
        }
      }
    },
    // 点击取消
    clickCancel: function() {
      var _this = this
      _this.currentNode = null
      _this.nodeMenu = false
    },
    // 是否显示搜索框
    clickShowToolbar: function() {
      if ($('.mesh-toolbar').hasClass('mesh-search-show')) {
        $('.mesh-toolbar').children('div').css('display', 'none')
        $('.mesh-toolbar').animate({
          opacity: '0',
          width: '0'
        }, 500, function() {
          $('.mesh-toolbar').removeClass('mesh-search-show')
        })
      } else {
        $('.mesh-toolbar').animate({
          opacity: '1',
          width: '500px'
        }, 500, function() {
          $('.mesh-toolbar').addClass('mesh-search-show')
          $('.mesh-toolbar').children('div').css('display', 'block')
        })
      }
    },
    // 点击进行模式切换
    clickChangeMenu: function(e) {
      var _this = this
      var obj = $(e.target).parent()
      if (obj.hasClass('z-index-2')) {
        _this.showOrHideChange()
      } else if (obj.hasClass('z-index-0')) {
        var zIndex1 = $('.z-index-1')
        var zIndex2 = $('.z-index-2')
        _this.changeMenuClass(zIndex1, '1', '0')
        _this.changeMenuClass(zIndex2, '2', '1')
        _this.changeMenuClass(obj, '0', '2')
      } else if (obj.hasClass('z-index-1')) {
        _this.changeMenuClass($('.z-index-0'), '0', '1')
        _this.changeMenuClass($('.z-index-2'), '2', '0')
        _this.changeMenuClass(obj, '1', '2')
      }
    },
    // 修改class,source: 源, target: 目标
    changeMenuClass: function(obj, source, target) {
      var _this = this
      $('.z-index-' + source).animate(_this['zIndex' + target], 300, function() {
        obj.addClass('z-index-' + target + '-show')
        obj.addClass('z-index-' + target)
        obj.removeClass('z-index-' + source + '-show')
        obj.removeClass('z-index-' + source)
        if (target === '2') {
          _this.updateEChartType(obj)
        }
      })
    },
    // 变更eChart类别
    updateEChartType: function(obj) {
      var _this = this
      if (obj.hasClass('eChart-mesh')) {
        _this.eChartType = '1'
      } else if (obj.hasClass('eChart-ring')) {
        _this.eChartType = '2'
      } else if (obj.hasClass('eChart-time')) {
        _this.eChartType = '3'
      }
      _this.init()
    },
    // 展示还是显示右下角的切换菜单详细
    showOrHideChange: function() {
      var _this = this
      if ($('.z-index-1').hasClass('z-index-1-show')) {
        $('.z-index-1').removeClass('z-index-1-show')
        $('.z-index-1').animate(_this.initStart, 400)
      } else {
        $('.z-index-1').animate(_this.zIndex1, 400, function() {
          $('.z-index-1').addClass('z-index-1-show')
        })
      }
      if ($('.z-index-0').hasClass('z-index-0-show')) {
        $('.z-index-0').removeClass('z-index-0-show')
        $('.z-index-0').animate(_this.initStart, 400)
      } else {
        $('.z-index-0').animate(_this.zIndex0, 400, function() {
          $('.z-index-0').addClass('z-index-0-show')
        })
      }
    },
    // 根据身份证号查询人
    searchUser: function(key) {
      var _this = this
      if (key && this.validataIdCard(key)) {
        _this.loadingUser = true
        axios.post('/mesh/qbxsPersonInfo/queryByList?search_EQ_gmsfhm=' + key).then(response => {
          if (response.status === 200) {
            var data = response.data
            if (data && data.code === '000000') {
              _this.loadingUser = false
              _this.userOptions = data.data
            }
          }
        })
      }
    },
    // 查询方法
    searchData: function() {
      var _this = this
      if (_this.searchParams.idCardNo && _this.validataIdCard(_this.searchParams.idCardNo)) {
        _this.searchDataByIdCardNo(_this.searchParams.idCardNo)
      }
      if (_this.searchParams.ajbh) {
        _this.searchDataByAjbh(_this.searchParams.ajbh)
      }
      if (_this.searchParams.qbxsId) {
        _this.searchDataByQBXSBH(_this.searchParams.qbxsId)
      }
    },
    // 验证身份证号
    validataIdCard: function(num) {
      num = num.toUpperCase()
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return false
      }
      var len
      var re
      var arrSplit
      var dtmBirth
      var bGoodDay
      len = num.length
      if (len === 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
        arrSplit = num.match(re)
        dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
        bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
        if (!bGoodDay) {
          return false
        } else {
          var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
          var nTemp = 0
          var i
          num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i]
          }
          num += arrCh[nTemp % 11]
          return true
        }
      }
      if (len === 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
        arrSplit = num.match(re)
        dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
        bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
        if (!bGoodDay) {
          return false
        } else {
          var valnum
          arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
          var nTemp2 = 0
          for (var j = 0; j < 17; j++) {
            nTemp2 += num.substr(j, 1) * arrInt[j]
          }
          valnum = arrCh[nTemp2 % 11]
          if (valnum !== num.substr(17, 1)) {
            return false
          }
          return true
        }
      }
      return false
    },
    // 展示网状图
    showMesh: function(jsonArray) {
      var _this = this
      _this.dataArray = []
      _this.linkArray = []
      if (_this.eChartType === '3') {
        _this.dataArray = _this.getDataTimeArray(_this.dataArray, jsonArray, 0)
        _this.linkArray = _this.getLinkArray(_this.linkArray, jsonArray)
      } else {
        _this.dataArray = _this.getDataArray(_this.dataArray, jsonArray, 0)
        _this.linkArray = _this.getLinkArray(_this.linkArray, jsonArray)
      }
      _this.dataArray = _this.dealDataArray(_this.dataArray)
      _this.linkArray = _this.dealLink(_this.linkArray)
      _this.mesh = eChart.init(document.getElementById('chartColumn'))
      var option = {}
      if (_this.eChartType === '1') {
        option = _this.createMeshOption(option)
      } else if (_this.eChartType === '2') {
        option = _this.createRingOption(option)
      } else if (_this.eChartType === '3') {
        option = _this.createTimeOption(option)
      }
      _this.mesh.setOption(option)
      if (_this.loading) {
        _this.loading.close()
        _this.loading = null
      }
      _this.mesh.off('click')
      _this.mesh.on('click', function(params) {
        if (params.dataType === 'node') {
          _this.currentNode = params
          _this.nodeMenu = true
        }
      })
    },
    // 显示菜单信息
    showNodeMenu: function() {
      var _this = this
      _this.nodeMenu = true
    },
    // 创建网状图的option
    createMeshOption: function(option) {
      var _this = this
      option = {
        title: {
          text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 5000,
              edgeLength: 10
            },
            draggable: true,
            focusNodeAdjacency: true,
            roam: true,
            symbolSize: 80,
            hoverAnimation: true,
            legendHoverLink: true,
            label: {
              normal: {
                show: true,
                color: 'rgba(255, 255, 255, 1)',
                position: ['20%', '110%']
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            data: _this.dataArray,
            links: _this.linkArray,
            lineStyle: {
              normal: {
                opacity: 1,
                width: 1,
                curveness: 0,
                color: '#d5e9fc',
                shadowColor: '#3EDBFF',
                shadowBlur: 5
              }
            },
            itemStyle: {
              normal: {
                color: '#51a9fe',
                shadowColor: '#0b628d',
                shadowBlur: 5
              }
            }
          }
        ]
      }
      return option
    },
    // 创建环状图的option
    createRingOption: function(option) {
      var _this = this
      option = {
        title: {
          text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            draggable: true,
            focusNodeAdjacency: true,
            roam: true,
            symbolSize: 80,
            hoverAnimation: true,
            legendHoverLink: true,
            label: {
              normal: {
                show: true,
                color: 'rgba(255, 255, 255, 1)',
                position: ['20%', '110%']
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            data: _this.dataArray,
            links: _this.linkArray,
            lineStyle: {
              normal: {
                opacity: 1,
                width: 1,
                curveness: 0.3,
                color: '#d5e9fc',
                shadowColor: '#3EDBFF',
                shadowBlur: 5
              }
            },
            itemStyle: {
              normal: {
                color: '#51a9fe',
                shadowColor: '#0b628d',
                shadowBlur: 5
              }
            }
          }
        ]
      }
      return option
    },
    // 创建时间序列图的option
    createTimeOption: function(option) {
      var _this = this
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            axis: 'y',
            snap: true
          }
        },
        legend: {
          data: ['时间轴'],
          y: 'left'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        xAxis: {
          type: 'value',
          show: false,
          position: 'top',
          nameLocation: 'center',
          axisLine: {
            lineStyle: {
              color: '#d5e9fc',
              shadowColor: '#3EDBFF',
              shadowBlur: 5
            }
          }
        },
        yAxis: {
          name: '时间轴',
          type: 'time',
          show: true,
          axisLine: {
            lineStyle: {
              color: '#d5e9fc',
              shadowColor: '#3EDBFF',
              shadowBlur: 5
            }
          }
        },
        series: [{
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          focusNodeAdjacency: true,
          roam: true,
          symbolSize: 80,
          hoverAnimation: true,
          legendHoverLink: true,
          label: {
            normal: {
              show: true,
              color: 'rgba(255, 255, 255, 1)',
              position: ['20%', '110%']
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          data: _this.dataArray,
          links: _this.linkArray,
          lineStyle: {
            normal: {
              opacity: 1,
              width: 1,
              curveness: 0,
              color: '#d5e9fc',
              shadowColor: '#3EDBFF',
              shadowBlur: 5
            }
          },
          itemStyle: {
            normal: {
              color: '#51a9fe',
              shadowColor: '#0b628d',
              shadowBlur: 5
            }
          }
        }]
      }
      return option
    },
    // 处理data的x轴坐标
    dealDataArray: function(dataArray) {
      if (dataArray) {
        $.each(dataArray, function(index, item) {
          if (item.value) {
            item.value[0] = index * 10
          }
        })
      }
      return dataArray
    },
    // 处理linkArray，对于出现双向的关系，需要将关系线弧线显示
    dealLink: function(linkArray) {
      if (linkArray && linkArray.length > 0) {
        $.each(linkArray, function(index, item) {
          var str = item.source + item.target
          $.each(linkArray, function(index2, item2) {
            var str2 = item2.target + item2.source
            if (str === str2) {
              item.lineStyle.normal.curveness = 0.3
              item2.lineStyle.normal.curveness = 0.3
            }
          })
        })
      }
      return linkArray
    },
    addNode: function(data, mesh, parentData, parentIndex) {
      var _this = this
      var options = mesh.getOption()
      // 获得所有节点的数组
      var nodesOption = options.series[0].data
      // 获得所有连接的数组
      var linksOption = options.series[0].links
      var resultArray = []
      var newLinkArray = []
      if (_this.eChartType === '3') {
        resultArray = _this.getDataTimeArray(resultArray, data.data, 0)
      } else {
        resultArray = _this.getDataArray(resultArray, data.data, 0)
      }
      resultArray = _this.dealDataArray(resultArray)
      newLinkArray = _this.getLinkArray(newLinkArray, data.data)
      $.each(resultArray, function(index, item) {
        if (item.id !== parentData.id) {
          nodesOption.push(item)
        }
      })
      $.each(newLinkArray, function(index, item) {
        linksOption.push(item)
      })
      nodesOption[parentIndex].isLeaf = 'false'
      mesh.setOption(options)
      if (_this.loading) {
        _this.loading.close()
        _this.loading = null
      }
    },
    getX: function(x, ao, r) {
      return x + r * Math.cos(ao * Math.PI / 180)
    },
    getY: function(y, ao, r) {
      return y + r * Math.sin(ao * Math.PI / 180)
    },
    // 通过人挖掘
    searchDataByIdCardNo: function(idCardNo, parentData, parentIndex) {
      var _this = this
      var url = '/mesh/cueMining/cueMiningByPerson?idCardNo=' + idCardNo
      _this.queryService(url, parentData, parentIndex)
    },
    // 通过案件挖掘
    searchDataByAjbh: function(ajbh, parentData, parentIndex) {
      var _this = this
      var url = '/mesh/cueMining/cueMiningByCase?ajbh=' + ajbh
      _this.queryService(url, parentData, parentIndex)
    },
    // 通过案件挖掘
    searchDataByQBXSBH: function(qbxsbh, parentData, parentIndex) {
      var _this = this
      var url = '/mesh/cueMining/cueMiningByClue?qbxsbh=' + qbxsbh
      _this.queryService(url, parentData, parentIndex)
    },
    // 查询数据
    queryService: function(url, parentData, parentIndex) {
      var _this = this
      if (parentData && parentData.parentId) {
        url = url + '&parentId=' + parentData.parentId
      } else {
        if (_this.mesh) {
          _this.mesh.clear()
          _this.mesh = null
        }
        // 初始化节点ID的集合和关系集合
        _this.dataTimeIdArray = []
        _this.dataIdArray = []
        _this.targetSourceArray = []
      }
      // type 1-用户、2-案件、3-线索、4-电话、5-车辆
      // _this.loading = _this.showLoading()
      _this.loading = true
      axios.post(url).then(response => {
        if (response.status === 200) {
          _this.loading = false
          var data = response.data
          if (data && data.code === '000000') {
            this.isHaveData = true
            this.$resetSetItem('t5', 1) // 存在session中存储标记，说明关系挖掘有值
            if (parentData && parentData.parentId) {
              _this.addNode(data, _this.mesh, parentData, parentIndex)
            } else {
              _this.showMesh(data.data)
            }
          } else {
            this.isHaveData = false
            if (_this.loading) {
              _this.loading = false
            }
          }
        } else {
          this.isHaveData = false
          if (_this.loading) {
            _this.loading = false
          }
        }
      }).catch(error => {
        _this.loading = false
        // 请求失败
        console.log(error)
      })

      // 测试数据
      // var data = this.testData
      // if (data && data.code === '000000') {
      //   _this.loading = false
      //   sessionStorage.setItem('t5', 1) // 存在session中存储标记，说明关系挖掘有值
      //   if (parentData && parentData.parentId) {
      //     _this.addNode(data, _this.mesh, parentData, parentIndex)
      //   } else {
      //     _this.showMesh(data.data)
      //   }
      // } else {
      //   if (_this.loading) {
      //     _this.loading = false
      //   }
      // }
    },
    // 将字符串的时间，转换为date类型
    fixDate: function(time) {
      if (!document.all) {
        return new Date(time)
      }
      var arr = time.split(time.match(/\D+/g)[2])
      var date
      if (arr[0]) {
        date = arr[0].split('-')
      }
      if (arr[1]) {
        time = arr[1].split(':')
      }
      return new Date(date[0], date[1] - 1, date[2], time[0], time[1])
    },
    // 拆分需要展示的节点type=1:是要画时间轴
    getDataArray: function(dataArray, jsonArray, index) {
      var _this = this
      _this.index = index
      for (var i = 0; i < jsonArray.length; i++) {
        var obj = {
          id: jsonArray[i].id,
          parentId: jsonArray[i].parentId,
          name: jsonArray[i].name,
          type: jsonArray[i].type,
          isLeaf: 'false'
        }
        if (jsonArray[i].type === '1') {
          if (i === 0 && _this.index === 0) {
            obj.symbol = 'image://static/image/chart_images/user_start.png'
          } else {
            obj.symbol = 'image://static/image/chart_images/user.png'
            obj.symbolSize = 60
          }
        } else if (jsonArray[i].type === '2') {
          if (i === 0 && _this.index === 0) {
            obj.symbol = 'image://static/image/chart_images/case_start.png'
          } else {
            obj.symbol = 'image://static/image/chart_images/case.png'
            obj.symbolSize = 60
          }
        } else if (jsonArray[i].type === '3') {
          if (i === 0 && _this.index === 0) {
            obj.symbol = 'image://static/image/chart_images/cue_start.png'
          } else {
            obj.symbol = 'image://static/image/chart_images/cue.png'
            obj.symbolSize = 60
          }
        }
        if (!jsonArray[i].children || jsonArray[i].children.length === 0) {
          obj.isLeaf = 'true'
        }
        if (_this.isContain(dataArray, obj.id) === 'false' && _this.dataIdArray.indexOf(obj.id) < 0) {
          dataArray.push(obj)
          _this.dataIdArray.push(obj.id)
        }
        if (jsonArray[i].children) {
          _this.index = _this.index + 1
          _this.getDataArray(dataArray, jsonArray[i].children, _this.index)
        }
      }
      return dataArray
    },
    // 拆分需要展示的节点type=1:是要画时间轴
    getDataTimeArray: function(dataArray, jsonArray, index) {
      var _this = this
      _this.index = index
      var child2Array = []
      for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].date) {
          var obj = {
            id: jsonArray[i].id,
            parentId: jsonArray[i].parentId,
            name: jsonArray[i].name,
            type: jsonArray[i].type,
            isLeaf: 'false'
          }
          var date = _this.fixDate(jsonArray[i].date)
          var value = [i * _this.index, date]
          obj.value = value
          if (jsonArray[i].type === '1') {
            if (i === 0 && _this.index === 0) {
              obj.symbol = 'image://static/image/chart_images/user_start.png'
            } else {
              obj.symbol = 'image://static/image/chart_images/user.png'
              obj.symbolSize = 60
            }
          } else if (jsonArray[i].type === '2') {
            if (i === 0 && _this.index === 0) {
              obj.symbol = 'image://static/image/chart_images/case_start.png'
            } else {
              obj.symbol = 'image://static/image/chart_images/case.png'
              obj.symbolSize = 60
            }
          } else if (jsonArray[i].type === '3') {
            if (i === 0 && _this.index === 0) {
              obj.symbol = 'image://static/image/chart_images/cue_start.png'
            } else {
              obj.symbol = 'image://static/image/chart_images/cue.png'
              obj.symbolSize = 60
            }
          }
          if (!jsonArray[i].children || jsonArray[i].children.length === 0) {
            obj.isLeaf = 'true'
          }
          if (_this.eChartType === '3') {
            if (_this.isContain(dataArray, obj.id) === 'false' && _this.dataIdArray.indexOf(obj.id) < 0 && jsonArray[i].date) {
              dataArray.push(obj)
              _this.dataTimeIdArray.push(obj.id)
            }
          } else {
            if (_this.isContain(dataArray, obj.id) === 'false' && _this.dataIdArray.indexOf(obj.id) < 0) {
              dataArray.push(obj)
              _this.dataTimeIdArray.push(obj.id)
            }
          }
          if (jsonArray[i].children) {
            _this.index = _this.index + 1
            child2Array.push(jsonArray[i].children)
          }
        }
      }
      // 这样写的意义是，要将集合从外到内解
      if (child2Array && child2Array.length > 0) {
        var data2 = _this.getDataTime2Array(child2Array, _this.index)
        if (data2.dataArray && data2.dataArray.length > 0) {
          dataArray = dataArray.concat(data2.dataArray)
        }
        if (data2.childrenArray) {
          var data3 = _this.getDataTime2Array(data2.childrenArray, _this.index)
          if (data3.dataArray && data3.dataArray.length > 0) {
            dataArray = dataArray.concat(data3.dataArray)
          }
          if (data3.childrenArray) {
            var data4 = _this.getDataTime2Array(data3.childrenArray, _this.index)
            if (data4.dataArray && data4.dataArray.length > 0) {
              dataArray = dataArray.concat(data4.dataArray)
            }
          }
        }
      }
      return dataArray
    },
    getDataTime2Array: function(jsonArray, index) {
      var result = {
        dataArray: [],
        childrenArray: []
      }
      var dataArray = []
      var _this = this
      _this.index = index
      var child3Array = []
      $.each(jsonArray, function(parentIndex, parentItem) {
        if (parentItem && parentItem.length > 0) {
          $.each(parentItem, function(index, item) {
            if (item.date) {
              var obj = {
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                type: item.type,
                isLeaf: 'false'
              }
              var date = _this.fixDate(item.date)
              obj.value = [1, date]
              if (item.type === '1') {
                obj.symbol = 'image://static/image/chart_images/user.png'
              } else if (item.type === '2') {
                obj.symbol = 'image://static/image/chart_images/case.png'
              } else if (item.type === '3') {
                obj.symbol = 'image://static/image/chart_images/cue.png'
              }
              obj.symbolSize = 60
              if (!item.children || item.children.length === 0) {
                obj.isLeaf = 'true'
              }
              if (_this.dataTimeIdArray.indexOf(obj.id) < 0) {
                dataArray.push(obj)
                _this.dataTimeIdArray.push(obj.id)
              }
              if (item.children) {
                _this.index = _this.index + 1
                child3Array.push(item.children)
              }
            }
          })
        }
      })
      result.dataArray = dataArray
      if (child3Array && child3Array.length > 0) {
        result.childrenArray = child3Array
      }
      return result
    },
    // 判断集合是否包含key
    isContain: function(dataArray, key) {
      for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id && dataArray[i].id === key) {
          return 'true'
        }
      }
      return 'false'
    },
    // 拆分关系集合
    getLinkArray: function(linkArray, jsonArray) {
      var _this = this
      for (var i = 0; i < jsonArray.length; i++) {
        var children = jsonArray[i].children
        if (children) {
          var childrenArray = []
          for (var j = 0; j < children.length; j++) {
            var str = jsonArray[i].id + '-' + children[j].id
            var rts = children[j].id + '-' + jsonArray[i].id
            if (_this.targetSourceArray.indexOf(str) < 0 && _this.targetSourceArray.indexOf(rts) < 0) {
              var linkObj = {
                source: jsonArray[i].id,
                target: children[j].id,
                symbolSize: [2, 10],
                label: {
                  normal: {
                    show: true,
                    formatter: children[j].link,
                    color: '#5cadff',
                    fontSize: '14'
                  }
                },
                lineStyle: {
                  normal: {
                    // curveness: 0.2
                  }
                }
              }
              linkArray.push(linkObj)
              _this.targetSourceArray.push(str)
              _this.targetSourceArray.push(rts)
            }
            if (children[j]) {
              childrenArray.push(children[j])
            }
          }
          if (childrenArray && childrenArray.length > 0) {
            _this.getLinkArray(linkArray, childrenArray)
          }
        }
      }
      return linkArray
    },
    // 展示加载中
    showLoading: function() {
      const loading = this.$loading({
        lock: true,
        text: '数据正在加载中,请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    init() {
      var _this = this
      if (_this.cardNumber && _this.type) { // 正式数据
        if (_this.type === 1) {
          // 从详情页面返回的是身份证号码
          _this.searchDataByIdCardNo(_this.cardNumber)
        } else if (_this.type === '2') {
          // 从详情页面返回的是案件编号
          _this.searchDataByAjbh(_this.cardNumber)
        } else if (_this.type === '3') {
          // 从详情页面返回的是线索编号
          _this.searchDataByQBXSBH(_this.cardNumber)
        }
        _this.moreParam = JSON.stringify({ type: 1, bm: _this.cardNumber }) // 跳转到关系挖掘主页传递的参数
      }
      // _this.searchDataByIdCardNo(_this.cardNumber) // 测试数据
    }
  },
  mounted() {
    this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style>
.relationMesh {
  width: 100%;
  border: 2px solid #00a0e9;
  border-radius: 6px;
  padding: 0 12px 8px 8px;
  color: #bce8fc;
  text-shadow: 0 0 1px #fff;
}
.mesh {
  width: 100%;
  height: 350px;
  min-height: 350px;
  overflow: hidden;
  position: relative;
}

.mesh #chartColumn {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.mesh-toolbar {
  height: 62px;
  width: 0;
  background-color: rgba(255, 255, 255, 0.25);
  position: absolute;
  z-index: 1000;
  left: 84px;
  top: 20px;
  border-radius: 6px;
  box-shadow: 0 0 2px 1px #04375d;
  opacity: 0;
}

.mesh-toolbar > div {
  display: none;
}

.mesh-search:first-child {
  margin-left: 15px;
}

.mesh-search {
  margin-top: 12px;
  margin-left: 10px;
  max-width: 178px;
}

.mesh-search .el-select__tags {
  max-width: 170px !important;
}

.mesh-search .el-select__tags input {
  max-width: 190px !important;
  margin-left: 6px !important;
  color: #585858 !important;
}

.mesh-search .el-input__inner {
  width: 178px;
  height: 38px !important;
  border: 0;
  background-color: #fff;
  padding: 0 6px !important;
  color: #585858 !important;
}

.mesh-search .el-input__suffix-inner i {
  color: #585858 !important;
}

.mesh-search .el-input input {
  width: 178px;
  height: 38px !important;
  border: 0;
  background-color: #fff;
  padding: 0 6px !important;
  color: #585858 !important;
}

.mesh-search-btn {
  padding: 10px !important;
  background-color: #5caeff !important;
  background-image: none !important;
  border: 0 !important;
  margin-left: 12px;
  margin-top: 2px;
}

.mesh-search-btn span {
  color: #fff !important;
  padding: 0 18px;
  line-height: 16px;
}

.mesh-search-btn-show {
  background-color: #5caeff !important;
}

.mesh-search-show .mesh-search,
.mesh-search-btn {
  animation: myfirst2 2s;
  -webkit-animation: myfirst2 2s; /* Safari 与 Chrome */
}

.mesh-search-circle-btn {
  padding: 12px !important;
  background-color: rgba(255, 255, 255, 0.25) !important;
  background-image: none !important;
  border: 0 !important;
  position: absolute !important;
  top: 29px;
  left: 20px;
  z-index: 1000;
}

.mesh-search-circle-btn i {
  font-size: 20px;
  color: #fff !important;
}

.mesh-change-eChart {
  display: inline-block;
  position: absolute;
  bottom: 30px;
  right: 30px;
  text-align: center;
}

.eChart-circle-change {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 48px;
  cursor: pointer;
  bottom: 20px;
  right: 20px;
}

.eChart-circle-change:hover {
  width: 40px !important;
  height: 40px !important;
}

.z-index-2 {
  z-index: 1002;
  width: 40px;
  height: 40px;
}

.z-index-1 {
  z-index: 1001;
  opacity: 0;
  width: 0;
  height: 0;
}

.z-index-0 {
  z-index: 1000;
  opacity: 0;
  width: 0;
  height: 0;
}

.eChart-mesh {
  background-color: rgba(255, 255, 255, 0.25);
}

.eChart-ring {
  background-color: rgba(255, 255, 255, 0.25);
}

.eChart-time {
  background-color: rgba(255, 255, 255, 0.25);
}
.eChart-ring img {
  margin-top: 15% !important;
}

.eChart-circle-change img {
  width: 60%;
  height: 60%;
  margin-top: 20%;
}

.node-menu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9998;
}

.cue-mining-show {
  display: block;
}

.node-menu-btns {
  position: absolute;
  top: 50%;
  margin-top: -88.5px;
  left: 50%;
  display: inline-block;
  margin-left: -100px;
  z-index: 9999;
  width: 250px;
}

.node-menu-btns > div {
  width: 100%;
  position: relative;
  float: left;
  text-align: center;
}

.node-menu-btns > div:last-child {
  margin-top: 80px;
}

.node-menu-btn {
  width: 75px;
  height: 75px;
  border-radius: 75px;
  cursor: pointer;
  float: left;
  margin-right: 50px;
}

.node-menu-detail {
  background: url("/static/image/chart_images/detail.png");
}

.node-menu-detail:hover {
  background: url("/static/image/chart_images/detail_hover.png");
}

.node-menu-cueMining {
  background: url("/static/image/chart_images/cue_mining.png");
}

.node-menu-cueMining:hover {
  background: url("/static/image/chart_images/cue_mining_hover.png");
}

.node-menu-cancel {
  font-size: 14px;
  color: #fff;
  font-family: "Microsoft YaHei";
  background-color: #4a88c5;
  padding: 5px 25px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: -45px;
}

.node-menu-cancel:hover {
  background-color: #5494d2;
}
</style>
