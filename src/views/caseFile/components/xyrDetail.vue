<template>
 <!-- 嫌疑人详情 -->
  <div class="xyr xddw">
    <el-form ref="form" :model="xyrInfo" label-width="146px" size="small" label-position="left">
      <el-row>
        <el-col :span="12" class="prt">
          <el-form-item label="嫌疑人编号">
            <span :title="xyrInfo.XYRBH" class="ellipsis-word">{{xyrInfo.XYRBH}}&nbsp;</span>
          </el-form-item>
            <el-form-item label="人员编号">
              {{xyrInfo.RYBH}}
            <!-- <span :title="xyrInfo.RYBH" class="ellipsis-word">{{xyrInfo.RYBH}}&nbsp;</span> -->
          </el-form-item>
            <el-form-item label="性别">
            <span>{{xyrInfo.XB_NAME}}&nbsp;</span>
          </el-form-item>
            <el-form-item label="婚姻状况">
            <span :title="xyrInfo.HYZK_NAME" class="ellipsis-word">{{xyrInfo.HYZK_NAME}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="籍贯详址">
            <span :title="xyrInfo.JGXZ" class="ellipsis-word">{{xyrInfo.JGXZ}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="抓获地点">
            <span :title="xyrInfo.ZHDD" class="ellipsis-word">{{xyrInfo.ZHDD}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="抓获单位联系电话">
            <span>{{xyrInfo.XZ_ZHDWDH}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="抓获单位">
            <span :title="xyrInfo.SJRS_NAME" class="ellipsis-word">{{xyrInfo.SJRS_NAME}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="到案接收人">
            <span>{{xyrInfo.DAJSR}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="到案配合工作情况">
            <span :title="xyrInfo.DAPHGZQK" class="ellipsis-word">{{xyrInfo.DAPHGZQK}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="法律依据">
            <span :title="xyrInfo.ZJFLYJ" class="ellipsis-word">{{xyrInfo.ZJFLYJ}}&nbsp;</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件编号">
            {{xyrInfo.AJBH}}
            <!-- <span :title="xyrInfo.AJBH" class="ellipsis-word">{{xyrInfo.AJBH}}&nbsp;</span> -->
          </el-form-item>
          <el-form-item label="公民身份号码">
            <span  @click="showTipsC(xyrInfo.GMSFHM)" class="ajbh-color underLine">{{xyrInfo.GMSFHM}}</span>
            <!-- <card-com v-if="showCardCom" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com> -->
          </el-form-item>
          <el-form-item label="出生日期">
            <span v-if="xyrInfo.CSRQ">{{xyrInfo.CSRQ | formatDate}}&nbsp;</span>
          </el-form-item>
            <el-form-item label="文化程度">
            <span>{{xyrInfo.WHCD_NAME}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="户籍地址详址">
            <span :title="xyrInfo.HJDZXZ" class="ellipsis-word">{{xyrInfo.HJDZXZ}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="抓获人">
            <span>{{xyrInfo.ZHDW}}&nbsp;</span>
          </el-form-item>
            <el-form-item label="到案时穿着">
            <span>{{xyrInfo.DASCZ}}&nbsp;</span>
          </el-form-item>
            <el-form-item label="案件名称">
            <span>{{xyrInfo.AJMC}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="履行方式">
            <span>{{xyrInfo.LXFS}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="嫌疑人处罚情况">
            <span :title="xyrInfo.CFQK" class="ellipsis-word">{{xyrInfo.CFQK}}&nbsp;</span>
          </el-form-item>
        </el-col>
        <el-col :span="23">
            <el-form-item label="违法犯罪事实">
            <span>{{xyrInfo.WFFZSS}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="嫌疑人备注">
            <span>{{xyrInfo.BZ}}&nbsp;</span>
          </el-form-item>
        </el-col>

      </el-row>
  </el-form>
</div>
</template>
<script>

import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  name: 'xyr',
  props: ['xyrInfoDetail'],
  data() {
    return {
      showCardCom: false, // 身份证查询旁的快捷查询组件
      curCardId: '', // 身份证号
      xyrInfo: {}
    }
  },
  components: {
    cardCom
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
    showTipsC(val) {
      this.curCardId = val
      if (!this.showCardCom) {
        this.showCardCom = true
      }
    },
    clickBlank() {
      this.showCardCom = false
    }
  },
  mounted() {
    if (this.xyrInfoDetail.AJBH) {
      this.xyrInfo = this.xyrInfoDetail
    }
  },
  watch: {
    xyrInfoDetail(val) {
      this.showCardCom = false
      if (val.AJBH) {
        this.xyrInfo = val
      }
    }
  }
}
</script>

<style>
.xyr{
  padding-left: 50px;
}
.xyr .title {
  text-align: right;
}

.xyr .row {
  padding: 10px 0;
}
.cardcom {
  position: absolute;
  top: 0;
  right: 6%;
}
.underLine {
  text-decoration:underline;
}
.ellipsis-word {
  height: 23px;
}
@media only screen and (max-width: 1366px) {
  .cardcom {
    right: 7%;
  }
}
</style>
