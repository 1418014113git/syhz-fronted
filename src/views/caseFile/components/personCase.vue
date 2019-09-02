<template>
 <!-- 人案关联引擎 -->
  <div class="personCase">
    <el-table :data="personData" tooltip-effect="dark" style="width: 100%" :show-header="showHeader"  v-loading="loading">
      <el-table-column>
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-col :span="3" class="photoWrap">
              <div class="photoBox">
                <div class="photoCount">
                  <img v-if="scope.row.bean.xp" :src="'data:image/jpeg;base64,'+scope.row.bean.xp">
                  <img v-else src="/static/image/personFile_images/defaultUuser.png">
                  <div class="personType1" v-if="scope.row.isKeyPerson">重点人员</div>
                  <div class="personType2" v-else>正常人员</div>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <el-row class="formInfo">
                <el-form ref="form"  size="small" label-width="100px">
                  <el-col :span="12" class="xddw">
                    <div class="personName" style="margin-left:24px;height:32px;">
                      <span class="ajbh" v-if='scope.row.bean.xm' :class="{'pointer':scope.row.bean.gmsfhm}">{{scope.row.bean.xm}}&nbsp;&nbsp;</span>
                      <span class="ajbh pointer" v-if='scope.row.bean.gmsfhm' @click="showTipsC(scope.row.bean.gmsfhm,scope.$index)">( {{scope.row.bean.gmsfhm}} )</span>
                    </div>
                    <el-form-item label="出生日期">
                      <span class="writText" v-if="scope.row.bean.csrq">{{scope.row.bean.csrq | formatDate}}</span>
                    </el-form-item>
                    <el-form-item label="婚姻状况">
                      <span class="writText">{{scope.row.bean.hyzkMc}}</span>
                    </el-form-item>
                    <el-form-item label="职业类别">
                      <span class="writText">{{scope.row.bean.zylbMc}}</span>
                    </el-form-item>
                    <el-form-item label="文化程度">
                      <span class="writText">{{scope.row.bean.whcdMc}}</span>
                    </el-form-item>
                    <card-com v-if="curIndex===scope.$index" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别">
                      <span class="writText">{{scope.row.bean.xbMc}}</span>
                    </el-form-item>
                    <el-form-item label="民族">
                      <span class="writText">{{scope.row.bean.mzMc}}</span>
                    </el-form-item>
                    <el-form-item label="籍贯区划">
                      <el-tooltip class="item" effect="dark" :content="scope.row.bean.jgssxqMc" placement="top-start">
                        <span class="writText beyondText">{{scope.row.bean.jgssxqMc}}</span>
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item label="出生地区划">
                      <el-tooltip class="item" effect="dark" :content="scope.row.bean.csdssxqMc" placement="top-start">
                        <span class="writText beyondText">{{scope.row.bean.csdssxqMc}}</span>
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item label="宗教信仰">
                      <span class="writText">{{scope.row.bean.zjxyMc}}</span>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-col>
            <el-col :span="6" class="recordWrap">
              <el-row type="flex" class="row">
                <el-col :span="12" >
                  <div class="recordBox">
                    <img src="/static/image/caseFile_images/zhpf.png" alt="">
                    <div class="pdtop">
                      <p class="num">{{scope.row.totalScore}}</p>
                      <p class="writText fz14">综合评分</p>
                    </div>
                  </div>
                </el-col>
                 <el-col :span="12" style="margin-right:0;">
                  <div class="recordBox">
                    <img src="/static/image/caseFile_images/tcx.png" alt="">
                    <div class="pdtop">
                      <p class="num">{{scope.row.tcx}}</p>
                      <p class="writText fz14">同出行</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" class="row">
                <el-col :span="12" >
                  <div class="recordBox">
                    <img src="/static/image/caseFile_images/trz.png" alt="">
                    <div class="pdtop">
                      <p class="num">{{scope.row.trz}}</p>
                      <p class="writText fz14">同入住</p>
                    </div>
                  </div>
                </el-col>
                 <el-col :span="12" style="margin-right:0;">
                  <div class="recordBox">
                    <img src="/static/image/caseFile_images/tar.png" alt="">
                    <div class="pdtop">
                      <p class="num">{{scope.row.tar}}</p>
                      <p class="writText fz14">同案人</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-col class="toolbars" type="flex" v-if="total>0">
      <el-pagination  layout="prev, pager, next" @current-change="handleCurrentChange"
        :page-size="pageSize" :total="total" :current-page="page" style="">
      </el-pagination>
      <div class="szqz_btn" v-if="$isViewBtn('100809')" @click="showWeightDia()">设置权重</div>
    </el-col>

     <!-- 设置权重 -->
    <el-dialog title="设置权重" :visible.sync="configDia" width="540px" @close="closeWeightDia">
      <el-form :model="weightBean" :rules="rules" ref="weightForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="同出行：" prop="name">
          <el-input-number v-model="weightBean.tcx" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="同入住：" prop="name">
          <el-input-number v-model="weightBean.trz" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="同案人：" prop="name">
          <el-input-number v-model="weightBean.tar" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
      </el-form>
      <el-row style="padding-left: 130px;">
        <el-button @click="submitQuery()" :loading="configBtn" type="primary">保存</el-button>
        <el-button @click="weightReset()" :loading="configBtn" type="primary">重置</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  name: 'personcase',
  props: ['ajbh'],
  data() {
    return {
      loading: false, // 页面加载进度条
      configDia: false, // 是否显示设置权重弹框
      configBtn: false, // 弹框操作按钮加载loading
      showHeader: false, // 隐藏表头
      AJBH: '', // 案件编号
      curIndex: '', // 存储当前被点击的身份证号索引值
      personData: [], // 人案关联引擎数据
      weightBean: { // 设置权重
        tcx: 1, trz: 1, thjl: 1, tar: 1
      },
      savedWeight: {},
      rules: {},
      pageSize: 3,
      page: 1,
      total: 0
    }
  },
  components: {
    cardCom
  },
  watch: {
    ajbh(val) {
      this.loading = true
      this.personData = []
      this.curIndex = ''
      if (val) {
        this.AJBH = val
        this.ajInfo = this.AjInfo
        this.init(true)
      }
    }
  },
  filters: {
    formatDate(value) {
      var val = ''
      if (value.length === 8) {
        val = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substr(6)
      }
      return val
    }
  },
  methods: {
    init(flag) {
      if (this.ajbh) {
        this.loading = true
        this.AJBH = this.ajbh
        this.ajInfo = this.AjInfo
        const param = {
          ajbh: this.AJBH,
          pageSize: this.pageSize,
          pageNum: flag ? 1 : this.page
        }
        this.$query('personcase', param).then((response) => {
          this.loading = false
          if (response.code === '000000') {
            if (response.data.list && response.data.list.length > 0) {
              var data = response.data.list
              data.forEach(item => {
                this.getzdryhc(item, data)
              })
            } else {
              this.total = 0
              this.$resetSetItem('aj5', 0)
              this.$emit('personCaseNum', 0)
            }
          }
        }).catch(() => {
          this.loading = false
          this.total = 0
          this.$resetSetItem('aj5', 0)
          this.$emit('personCaseNum', 0)
        })
      }
    },
    // 人员重点类型查询
    getzdryhc(item, data) {
      this.personData = data
      if (this.personData.length > 0) {
        this.total = this.personData.length
        this.$resetSetItem('aj5', this.personData.length)
        this.$emit('personCaseNum', this.personData.length)
      } else {
        this.total = 0
        this.$resetSetItem('aj5', 0)
        this.$emit('personCaseNum', 0)
      }
      // var param = {
      //   'XM': '', 'SFZH': item.bean.gmsfhm, 'XB': '', 'CSRQ': '', 'MZ': '',
      //   'ZZ': '', 'QFJG': '', 'YXQX': '', 'HCDD': '', 'HCSJ': '', 'BZ': '', 'HCLY': ''
      // }
      // this.$zdryhc('ryhc', param).then(res => {
      //   // var data1 = {"HJDQH":"","BARDH1":"","ZZ":"","BAR1":"","SSGAJGDM":"","ZDRYBH":"","SQRDWDM":"","SG":"","CSD":"","SSPCS":"","RYLB":"","LBBJ":"","HJDXZ":"","BKJB":"","FWCS":"","HYZK":"","ZDRLY":"","SQSY":"","SFZH":"","ZZXZ":"","XB":"","MZ":"","CSRQ":"","XL":"正常","XM":"","ZZSSXQ":"","HCID":"8ae48ff8684f95ed016b45885fb033d8","ZY":""}
      //   if (res.data) {
      //     var arry = res.data.LBBJ ? res.data.LBBJ.split(',') : []
      //     for (var n = 0; n < arry.length; n++) { // 去掉数组里的空值。
      //       if (arry[n] === '') {
      //         arry.splice(n, 1)
      //         n = n - 1
      //       }
      //     }
      //     var arryLength = arry.length
      //     if (arryLength > 0) {
      //       item.isKeyPerson = true // 重点人员
      //     } else {
      //       item.isKeyPerson = false // 正常人员
      //     }
      //     this.personData = data
      //     if (this.personData.length > 0) {
      //       this.total = this.personData.length
      //       this.$resetSetItem('aj5', this.personData.length)
      //       this.$emit('personCaseNum', this.personData.length)
      //     } else {
      //       this.total = 0
      //       this.$resetSetItem('aj5', 0)
      //       this.$emit('personCaseNum', 0)
      //     }
      //   } else {
      //     this.personData = data
      //     if (this.personData.length > 0) {
      //       this.total = this.personData.length
      //       this.$resetSetItem('aj5', this.personData.length)
      //       this.$emit('personCaseNum', this.personData.length)
      //     } else {
      //       this.total = 0
      //       this.$resetSetItem('aj5', 0)
      //       this.$emit('personCaseNum', 0)
      //     }
      //   }
      // }).catch(() => {
      //   this.personData = data
      //   if (this.personData.length > 0) {
      //     this.total = this.personData.length
      //     this.$resetSetItem('aj5', this.personData.length)
      //     this.$emit('personCaseNum', this.personData.length)
      //   } else {
      //     this.total = 0
      //     this.$resetSetItem('aj5', 0)
      //     this.$emit('personCaseNum', 0)
      //   }
      // })
      // 测试
      // var data1 = { 'HJDQH': '', 'BARDH1': '', 'ZZ': '', 'BAR1': '', 'SSGAJGDM': '', 'ZDRYBH': '', 'SQRDWDM': '', 'SG': '', 'CSD': '', 'SSPCS': '', 'RYLB': '', 'LBBJ': '1', 'HJDXZ': '', 'BKJB': '', 'FWCS': '', 'HYZK': '', 'ZDRLY': '', 'SQSY': '', 'SFZH': '', 'ZZXZ': '', 'XB': '', 'MZ': '', 'CSRQ': '', 'XL': '正常', 'XM': '', 'ZZSSXQ': '', 'HCID': '8ae48ff8684f95ed016b45885fb033d8', 'ZY': '' }
      // if (data1) {
      //   var arry = data1.LBBJ ? data1.LBBJ.split(',') : []
      //   for (var n = 0; n < arry.length; n++) { // 去掉数组里的空值。
      //     if (arry[n] === '') {
      //       arry.splice(n, 1)
      //       n = n - 1
      //     }
      //   }
      //   var arryLength = arry.length
      //   if (arryLength > 0) {
      //     item.isKeyPerson = true // 重点人员
      //   } else {
      //     item.isKeyPerson = false // 正常人员
      //   }
      //   this.personData = data
      //   if (this.personData.length > 0) {
      //     this.total = this.personData.length
      //     this.$resetSetItem('aj5', this.personData.length)
      //     this.$emit('personCaseNum', this.personData.length)
      //   } else {
      //     this.total = 0
      //     this.$resetSetItem('aj5', 0)
      //     this.$emit('personCaseNum', 0)
      //   }
      // } else {
      //   this.personData = data
      //   if (this.personData.length > 0) {
      //     this.total = this.personData.length
      //     this.$resetSetItem('aj5', this.personData.length)
      //     this.$emit('personCaseNum', this.personData.length)
      //   } else {
      //     this.total = 0
      //     this.$resetSetItem('aj5', 0)
      //     this.$emit('personCaseNum', 0)
      //   }
      // }
    },
    submitQuery() {
      const params = this.weightBean
      params.ajbh = this.AJBH
      params.pageSize = 3
      params.pageNum = 1
      this.configBtn = true
      this.loading = true
      this.$query('personcase', params).then((response) => {
        this.loading = false
        this.configBtn = false
        if (response.code === '000000') {
          if (response.data.list && response.data.list.length > 0) {
            var data = response.data.list
            data.forEach(item => {
              this.getzdryhc(item, data)
            })
          } else {
            this.total = 0
            this.$resetSetItem('aj5', 0)
            this.$emit('personCaseNum', 0)
          }
          this.configDia = false
          this.savedWeight = JSON.parse(JSON.stringify(this.weightBean))
        }
      }).catch(() => {
        this.configBtn = false
        this.loading = false
        this.total = 0
        this.$resetSetItem('aj5', 0)
        this.$emit('personCaseNum', 0)
      })
    },
    showWeightDia() {
      this.configDia = true
      if (Object.keys(this.savedWeight).length > 0) {
        this.weightBean = JSON.parse(JSON.stringify(this.savedWeight))
      }
    },
    weightReset() {
      this.weightBean = {
        tcx: 1, trz: 1, thjl: 1, tar: 1
      }
    },
    closeWeightDia() {
      this.weightReset()
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.init()
    },
    showTipsC(val, index) {
      this.curCardId = val
      this.curIndex = index
    },
    clickBlank() {
      this.curIndex = ''
    }
  },
  mounted() {
    if (this.ajbh) {
      this.AJBH = this.ajbh
      this.init(true)
    }
  },
  activated() {
    this.curIndex = ''
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.personCase {
  .photoWrap {
    margin-right: 10px;
    display: flex;
    justify-content: center;
    .photoBox {
      margin-top: 10px;
      .photoCount {
        width: 122px;
        height: 155px;
        border-radius: 4px;
        border: 1px solid 1px #005982;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .personType1,
  .personType2 {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #fff;
    background-color: #ff8a00;
    border-radius: 4px;
    margin-top: 5px;
  }
  .personType1 {
    background-color: #ff8a00;
  }
  .personType2 {
    background-color: #0084e9;
  }
  .recordBox {
    display: flex;
  }
  .writText {
    color: #fff;
  }
  .el-form-item__label {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .personName {
    .el-form-item__label {
      text-decoration: underline;
    }
  }
  .szqz_btn {
    float: right;
    cursor: pointer;
    width: 100px;
    height: 30px;
    line-height: 30px;
    margin-right: 18px;
    font-size: 14px;
    text-align: center;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#51ace0),
      to(#187de0)
    );
    background: linear-gradient(top, #51ace0, #187de0);
    border-radius: 4px;
    margin-top: 2px;
  }
  .recordWrap {
    padding: 6px 0 0 15px;
    .row {
      .el-col {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 85px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin: 0px 18px 15px 0;
      }
    }
    .recordBox {
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
    }
  }
  .el-table__body-wrapper tr:nth-child(even) {
    background-color: transparent;
  }
  .el-table__row {
    border-bottom: 1px solid #00a0e9;
  }
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    border-collapse: collapse;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 9px;
  }
  .el-table--small td,
  .el-table--small th {
    padding: 8px 0 2px 0;
  }
  .num {
    font-size: 18px;
    color: #bce8fc;
    text-shadow: 0 0 3px #fff;
  }
  .toolbars {
    overflow: hidden;
    margin-top: 8px;
  }
  .el-pagination {
    float: right;
  }
  .cardcom {
    position: absolute;
    top: 6px;
    left: 65%;
  }
  .pdtop {
    padding-top: 10px;
  }
}
.beyondText {
  display: inherit;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pointer {
  cursor: pointer;
}
@media only screen and (max-width: 1366px) {
  .personCase .cardcom {
    left: 97%;
  }
  .personCase .recordWrap .recordBox img {
    width: 40px;
    height: 40px;
  }
  .personCase .recordWrap .row .el-col {
    margin: 0px 10px 13px 0;
  }
  .personCase .recordWrap {
    padding: 6px 0 0 12px;
  }
  .recordWrap {
    width: 30%;
  }
  .personCase .pdtop {
    padding-top: 0;
  }
}
</style>
