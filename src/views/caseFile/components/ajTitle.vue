<template>
<!-- 案件信息 -->
  <div class="ajTitle" v-loading="loading" style="">
     <div class="title">
        <div class="left">{{ajInfo.AJMC}}<a class="ajbh" @click="showTipsC(ajInfo.AJBH)">({{ajInfo.AJBH}})</a></div>
        <span v-for="(item,index) in bqList" :key="index">
          <span  class="btnStyle"  v-if="item.isShowbtn"  @click="clickbtn(item)">{{item.name}}</span>
        </span>
        <!-- <ajbh-com v-if="showAjbhCom" class="ajbhcom" :ajbh="ajInfo.AJBH" :id="AJID"  :interfaceType="interFaceType"  :isRl="isRls"  :source='source'  @close="clickBlank"></ajbh-com> -->
        <!-- <div class="right">
          <p>
            <img  class="downLoad" src="/static/image/syh_images/">
            <span>关注</span>
          </p>
          <p>
            <img  class="downLoad" src="/static/image/personFile_images/downLoad.png">
            <span>下载档案</span>
          </p>
          <p>
            <span>下载次数:</span>
            <span>0</span>
          </p>
          <p>
            <span>浏览次数:</span>
            <span>0</span>
          </p>
          <p>
            <span>有用</span>
            <img  class="downLoad" src="/static/image/personFile_images/heart.png">
            <span>0</span>
          </p>
        </div> -->
     </div>
  </div>
</template>

<script>
import { getAJLBText } from '@/utils/codetotext'
import Bus from '@/utils/bus.js'
import ajbhCom from '@/components/ajbhTips' // 身份证号码点击弹出菜单功能
export default {
  props: ['AjInfo', 'ajbh', 'ajid', 'type', 'Rl'],
  name: 'ajInfo',
  data() {
    return {
      ajInfo: {}, // 基础信息
      loading: false, // 页面加载进度条
      colorData: ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'], // 案件类型文字背景颜色默认集合
      ajlx: [], // 存储转换成数组的案件类型
      newColorData: [], // 根据类型个数存储对应数量的文字背景颜色集合
      showAjbhCom: false, // 案件编号旁的快捷查询组件是否显示
      AJID: '', // 用户页面返回判断使用
      interFaceType: '',
      isRls: '',
      source: 'ajda', // 页面来源，表示该模块是来自案件档案
      bqList: [ // 快捷标签list
        { name: '部督', type: 'third', isShowbtn: false },
        { name: '厅督', type: 'third', isShowbtn: false },
        { name: '市督', type: 'third', isShowbtn: false },
        { name: '集群', type: 'first', isShowbtn: false },
        { name: '协查', type: 'second', isShowbtn: false }
      ]
    }
  },
  components: {
    ajbhCom
  },
  watch: {
    ajbh(val) {
      this.loading = true
      this.ajInfo = {}
      this.showAjbhCom = false
      if (val) {
        this.ajInfo = this.AjInfo
        this.dealWithData() // 处理案件类型数据，添加颜色背景
      }
    }
  },
  methods: {
    init() {
      if (this.ajbh) {
        this.loading = true
        this.ajInfo = this.AjInfo
        this.dealWithData() // 处理案件类型数据，添加颜色背景
        this.handleBusOnEvent() // 顶部按钮的显隐判断
      }
    },
    handleBusOnEvent() {
      Bus.$on('isShowjqbtn', (data) => { // 集群按钮
        this.contorlBtn('集群', data)
      })
      Bus.$on('isShowxcbtn', (data) => { // 协查按钮
        this.contorlBtn('协查', data)
      })
      Bus.$on('isShowbdbtn', (data) => { // 部督按钮
        this.contorlBtn('部督', data)
      })
      Bus.$on('isShowtdbtn', (data) => { // 厅督按钮
        this.contorlBtn('厅督', data)
      })
      Bus.$on('isShowsdbtn', (data) => { // 市督按钮
        this.contorlBtn('市督', data)
      })
    },
    contorlBtn(name, data) { // 控制当前按钮显隐
      this.bqList.forEach(item => {
        if (item.name === name) { // 审核通过之后，
          item.isShowbtn = data
        }
      })
    },
    dealWithData() { // 处理案件类型数据，添加颜色背景
      this.AJID = this.ajid
      this.interFaceType = this.type
      this.isRls = this.Rl
      this.loading = false
      if (this.ajInfo.SYH_FLLB) {
        const syhfllb = this.getFllbName(this.ajInfo.SYH_FLLB)
        var ajlxArry = syhfllb.split('，')
        var ajlxObject = []
        for (var i = 0; i < ajlxArry.length; i++) {
          var obj = {
            lx: ajlxArry[i],
            bg: ''
          }
          ajlxObject.push(obj)
        }
        this.getColor(ajlxArry.length)
        for (var j = 0; j < ajlxObject.length; j++) {
          for (var k = 0; k < this.newColorData.length; k++) {
            if (j === k) {
              ajlxObject[j].bg = this.newColorData[k]
            }
          }
        }
        this.ajlx = ajlxObject
      }
    },
    getFllbName(fllb) {
      if (!fllb) {
        return ''
      }
      if (fllb && fllb.indexOf(',') > -1) {
        const array = fllb.split(',')
        let text = ''
        for (let i = 0; i < array.length; i++) {
          const lbText = getAJLBText(array[i])
          if (lbText) {
            text += '，' + lbText
          }
        }
        return text.substring(1, text.length)
      } else {
        const lbText = getAJLBText(fllb)
        if (lbText) {
          return getAJLBText(fllb)
        }
        return ''
      }
    },
    getColor(n) {
      const _this = this
      _this.newColorData = _this.newColorData.concat(_this.colorData)
      if (_this.newColorData.length < n) {
        _this.getColor(n)
      } else {
        _this.newColorData = _this.newColorData.slice(0, n)
      }
    },
    showTipsC() {
      this.showAjbhCom = true
    },
    clickBlank() {
      this.showAjbhCom = false
    },
    clickbtn(item) {
      this.$store.dispatch('Ajdatotop', 'zcxz') // 定位到侦查协作
      this.$store.dispatch('AjMouleClass', 'zcxz')
      Bus.$emit('bqType', item.type) // 定位到侦查协作对应的标签项
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.showAjbhCom = false
    // this.handleBusOnEvent() // 顶部按钮的显隐判断
  },
  created() {
    // this.handleBusOnEvent() // 顶部按钮的显隐判断
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ajTitle {
  width: 100%;
  border: 2px solid rgb(0, 160, 233);
  padding: 0 8px 0 8px;
  .el-form-item__label {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .title {
    width: 100%;
    height: 40px;
    padding: 8px 0 7px 10px;
    // border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    .left {
      float: left;
      // letter-spacing: 3px;
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
  .btnStyle {
    margin-left: 10px;
    color: #fff;
    font-size: 15px;
    padding: 2px 12px;
    text-shadow: 0 0 1px #000;
    border-radius: 10px;
    background-image: linear-gradient(90deg, #187be0 0%, #54aedf 100%);
    cursor: pointer;
  }
}

.beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.green {
  color: #00ff00;
}
.orange {
  color: #ff7a04;
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
</style>

