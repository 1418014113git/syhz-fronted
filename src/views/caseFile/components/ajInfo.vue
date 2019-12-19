<template>
<!-- 案件信息 -->
  <div class="ajInfo" v-loading="loading">
     <!--<div class="title">
        <div class="left">{{ajInfo.AJMC}}</div>
         <div class="right">
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
        </div>
     </div>-->
     <el-row class="pat">
        <el-form ref="form" :model="ajInfo" size="small" label-width="108px" label-position="left">
          <el-col :span="8" class="pdr">
            <!-- <el-form-item label="案件编号">
              <a class="ajbh" @click="showTipsC(ajInfo.AJBH)">{{ajInfo.AJBH}}</a>
            </el-form-item> -->
             <el-form-item label="立案单位">
              <span :title="ajInfo.LADW_NAME" class="whiteColor ellipsis-word">{{ajInfo.LADW_NAME}}</span>
            </el-form-item>
            <el-form-item label="案件类型">
              <span class="whiteColor ajlx" v-for="(item, index) in ajlx" :key="index" :class="item.bg">{{item.lx}}</span>
            </el-form-item>
            <ajbh-com v-if="showAjbhCom" class="ajbhcom" :ajbh="ajInfo.AJBH" :id="AJID"  :interfaceType="interFaceType"  :isRl="isRls"  :source='source'  @close="clickBlank"></ajbh-com>
          </el-col>
          <el-col :span="8" class="pdr">
            <el-form-item label="案件来源">
              <!-- <span  :title="" class="whiteColor ellipsis-word heig">{{}}</span> -->
            </el-form-item>
            <el-form-item label="案件状态">
              <span :class="ajInfo.AJZT_NAME === '破案'?'green':'orange'">{{ajInfo.AJZT_NAME}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件类别">
              <span class="whiteColor lbbg" v-if="ajInfo.AJLB_NAME">{{ajInfo.AJLB_NAME}}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
  </div>
</template>

<script>
import { getAJLBText } from '@/utils/codetotext'
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
      source: 'ajda' // 页面来源，表示该模块是来自案件档案
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
      }
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
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.showAjbhCom = false
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ajInfo {
  width: 100%;
  border: 2px solid rgb(0, 160, 233);
  padding: 0 8px 8px 8px;
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
.lbbg {
  font-size: 14px;
  padding: 2px 6px;
  background-image: linear-gradient(140deg, #177ce0 0%, #54afe0 100%),
    linear-gradient(#ff8547, #ff8547);
  background-blend-mode: normal, normal;
  border-radius: 4px;
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
  left: 50%;
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

