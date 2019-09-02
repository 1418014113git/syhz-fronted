<template>
<!-- 基本信息 -->
  <div class="baseInfo" v-loading="loading">
     <div class="title">
        <div class="left">基本信息</div>
        <!-- <div class="right">
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
     <el-row class="xddw zwbj">
          <el-form ref="form" :model="baseInfo" size="small" label-width="108px" label-position="left">
            <el-col :span="8">
              <el-form-item label="姓名" prop="xm">
                <span class="whiteColor">{{baseInfo.xm}}</span>
              </el-form-item>
              <el-form-item label="曾用名" prop="cym">
                <span class="whiteColor">{{baseInfo.cym}}</span>
              </el-form-item>
              <el-form-item label="民族" prop="mzMc">
                <span class="whiteColor">{{baseInfo.mzMc}}</span>
              </el-form-item>
              <el-form-item label="身高" prop="sg">
                <span class="whiteColor" v-if="baseInfo.sg">{{baseInfo.sg}}(cm)</span>
              </el-form-item>
              <el-form-item label="身份证号" prop="gmsfhm">
                <span class="whiteColor" v-if="baseInfo.gmsfhm" @click.stop="showTipsC">{{baseInfo.gmsfhm}}</span>
                <img v-if="baseInfo.gmsfhm" class="icon"  src="/static/image/personFile_images/sfzhqh.png" @click.stop="showTipsC">
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="xbMc">
                <span class="whiteColor">{{baseInfo.xbMc}}</span>
              </el-form-item>
              <el-form-item label="出生日期" prop="csrq">
                <span class="whiteColor" v-if="baseInfo.csrq">{{baseInfo.csrq  | formatDate}}</span>
              </el-form-item>
              <el-form-item label="婚姻状况" prop="hyzkMc">
                <span class="whiteColor">{{baseInfo.hyzkMc}}</span>
              </el-form-item>
              <el-form-item label="文化程度" prop="whcdMc">
                <span class="whiteColor">{{baseInfo.whcdMc}}</span>
              </el-form-item>
              <el-form-item label="血型" prop="xxMc">
                <span class="whiteColor">{{baseInfo.xxMc}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="人员状态" prop="ryztMc">
                <span class="whiteColor">{{baseInfo.ryztMc}}</span>
              </el-form-item>
              <el-form-item label="职业类型" prop="zylbMc">
                <span class="whiteColor">{{baseInfo.zylbMc}}</span>
              </el-form-item>
              <el-form-item label="宗教信仰" prop="zjxymc">
                <span class="whiteColor">{{baseInfo.zjxyMc}}</span>
              </el-form-item>
              <el-form-item label="籍贯" prop="jgssxqMc">
                <span :title="baseInfo.jgssxqMc" class="whiteColor inlBlock" :class="{'beyondTextClass' :isUnfoldjg}" @click="unfold('isUnfoldjg')">{{baseInfo.jgssxqMc}}</span>
              </el-form-item>
              <el-form-item label="出生地" prop="csdssxqMc">
                <span :title="baseInfo.csdssxqMc" class="whiteColor inlBlock" :class="{'beyondTextClass' :isUnfoldcsd}" @click="unfold('isUnfoldcsd')">{{baseInfo.csdssxqMc}}</span>
              </el-form-item>
            </el-col>
          </el-form>
          <card-com v-if="showCardCom" class="cardcom" :cardId="cardNumber" @close="clickBlank"></card-com>
      </el-row>
  </div>
</template>

<script>
// import { personByCardId } from '@/api/personSearch/personSearch'
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  props: ['cardId'],
  name: 'baseInfo',
  data() {
    return {
      baseInfo: {}, // 基础信息
      curUser: {}, // sessionStorage获取用户信息
      loading: false, // 页面加载进度条
      showCardCom: false, // 身份证查询旁的快捷查询组件
      // paramDept: '010000',
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      cardNumber: '', // 存储身份证号
      isUnfoldcsd: true, // 是否显示出生地隐藏部分
      isUnfoldjg: true // 是否显示籍贯隐藏部分
    }
  },
  components: {
    cardCom
  },
  computed: {

  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.detail()
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        var val = value.substring(0, 4) + '.' + parseInt(value.substring(4, 6)) + '.' + parseInt(value.substr(6))
      }
      return val
    }
  },
  methods: {
    init() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.paramDept = JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode
      if (this.cardId) {
        this.cardNumber = this.cardId
        this.detail()
      }
    },
    detail() {
      this.baseInfo = {}
      // 根据身份证号码查询人员详细信息
      // const para = {
      //   method: 'Query',
      //   byUserCard: this.cardNumber,
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName
      // }
      // this.loading = true
      // personByCardId(para).then((response) => {
      //   this.loading = false
      //   this.baseInfo = response.data
      // }).catch(() => {
      //   this.loading = false
      // })
      const response = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'csrq': '19790713',
          'whcd': '20',
          'gmsfhm': '610111197907130277',
          'zjxy': '00',
          'zylb': null,
          'xxMc': '不明',
          'mzMc': '汉族',
          'whcdMc': '大学本科',
          'csdssxqMc': '陕西省西安市灞桥区',
          'sg': '176',
          'zxlbMc': '',
          'xbMc': '男',
          'zjxyMc': '无宗教信仰',
          'id': 1089,
          'ryztMc': '正常人口',
          'zylbMc': '',
          'hyzkMc': '未婚',
          'jgssxqMc': '陕西省西安市灞桥区',
          'xb': '1',
          'lbsQrrq': '20130704',
          'zxsj': '',
          'mz': '02',
          'hyzk': '10',
          'xm': '张迪',
          'cym': '张迪',
          'xp': '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',
          'createUser': '超级管理员',
          'lbzQrrq': '20130704'
        }
      }
      this.baseInfo = response.data
    },
    showTipsC() {
      this.showCardCom = true
    },
    clickBlank() {
      this.showCardCom = false
    },
    unfold(type) {
      switch (type) {
        case 'isUnfoldcsd':
          this.isUnfoldcsd = !this.isUnfoldcsd
          break
        case 'isUnfoldjg':
          this.isUnfoldjg = !this.isUnfoldjg
          break
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.baseInfo {
  width: 100%;
  border: 2px solid rgb(0, 160, 233);
  border-radius: 6px;
  padding: 0 12px 0 8px;
  .el-form-item__label {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .title {
    width: 100%;
    padding: 7px 0 7px 7px;
    border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    .left {
      float: left;
      letter-spacing: 3px;
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
  .cardcom {
    position: absolute;
    bottom: 1px;
    left: 318px;
  }
}
.icon {
  width: 33px;
  margin: -6px 0 0 6px;
  cursor: pointer;
}
.whiteColor {
  color: #fff;
}
.beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.inlBlock {
  display: inline-block;
  height: 26px;
  line-height: 27px;
}
.zwbj{
  padding: 18px 0 0 45px;
}
@media only screen and (max-width: 1367px) {
  .inlBlock {
    height: 24px;
    line-height: 27px;
  }
  .icon {
    width: 30px;
  }
}
</style>

