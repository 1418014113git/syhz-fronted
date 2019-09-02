<template>
  <div>
    <el-row class="dbedit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div class="mesh">
      <el-button icon="el-icon-search" circle class="mesh-search-circle-btn" @click="clickShowToolbar()"></el-button>
      <div class="mesh-toolbar">
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
      </div>
      <div id="chartColumn">
      </div>
      <div class="mesh-change-eChart">
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

  export default {
    name: 'caseTrend',
    data() {
      return {
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
        // 详情页面返回的值
        bm: this.$route.query.bm,
        // 详情页面返回类别
        type: this.$route.query.type,
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
        mesh: null
      }
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
        if (!_this.searchParams.idCardNo && !_this.searchParams.ajbh && !_this.searchParams.qbxsId) {
          this.init()
        } else {
          this.searchData()
        }
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
        _this.loading = _this.showLoading()
        axios.post(url).then(response => {
          if (response.status === 200) {
            var data = response.data
            if (data && data.code === '000000') {
              if (parentData && parentData.parentId) {
                _this.addNode(data, _this.mesh, parentData, parentIndex)
              } else {
                _this.showMesh(data.data)
              }
            } else {
              if (_this.loading) {
                _this.loading.close()
                _this.loading = null
              }
            }
          } else {
            if (_this.loading) {
              _this.loading.close()
              _this.loading = null
            }
          }
        }).catch(() => {
          _this.loading.close()
        })
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
      toback() {
        if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
          if (this.$route.query.id) {
            if (this.$route.query.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
              })
            } else {
              this.$router.push({
                path: '/caseFile/index', query: { id: this.$route.query.id }
              })
            }
          } else if (this.$route.query.ajbh) {
            if (this.$route.query.interfaceType) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
              })
            } else if (this.$route.query.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
              })
            }
          } else {
            this.$router.back(-1)
          }
        } else {
          this.$router.back(-1)
        }
      },
      init() {
        var _this = this
        if (_this.bm && _this.type) {
          if (_this.type === 1) {
          // 从详情页面返回的是身份证号码
            _this.searchDataByIdCardNo(_this.bm)
          } else if (_this.type === '2') {
          // 从详情页面返回的是案件编号
            _this.searchDataByAjbh(_this.bm)
          } else if (_this.type === '3') {
          // 从详情页面返回的是线索编号
            _this.searchDataByQBXSBH(_this.bm)
          }
        }
      }
    },
    mounted() {
      this.init()
    }
  }

</script>

<style>
  @import "./css/mesh.css";
</style>
