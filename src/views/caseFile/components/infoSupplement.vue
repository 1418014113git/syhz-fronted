<template>
 <!-- 信息补采 -->
  <section>
    <div class="cell_title">
      <span class="small_line"></span>
      <span class="text">信息补采</span>
    </div>
    <div class="bg ajInfo">
      <!-- <title-pub :title="title" url=""></title-pub> -->
      <el-form ref="form" :model="ajInfo" size="small" label-width="110px" :rules="rules" label-position="left" class="infoSupplement">
        <el-tabs class="archiveTab" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <div slot="label">
              <p>基本信息</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-row>
              <el-col :span="8" class="pdr">
                <el-form-item label="案件类型" prop="fllb" label-width="90px">
                  <el-cascader v-model="ajInfo.fllb" change-on-select filterable :options="fllbList"  :disabled="fllbDisabled"></el-cascader>
                  <el-button type="success" style="margin-left: 10px;" @click="saveFllb()" :loading="saveLoading" v-if="!fllbDisabled">确认</el-button>
                  <img v-if="carryParam && carryParam.isRl==='1'" src="/static/image/caseFile_images/edit.png" alt="" srcset="" class="featureImg" @click="editCaseType">
                </el-form-item>
                <el-form-item label="案件类别1" prop="AJLB1_NAME" class="pdl" label-width="90px">
                  <span class="whiteColor">{{ajInfo.AJLB1_NAME}}</span>
                </el-form-item>
                <el-form-item label="涉案价值" prop="SAJZ" class="pdl">
                  <span class="whiteColor">{{ajInfo.SAJZ}}</span>
                </el-form-item>
                <el-form-item label="危害程度" prop="WHCD_NAME" class="pdl">
                  <span class="whiteColor">{{ajInfo.WHCD_NAME}}</span>
                </el-form-item>
                 <el-form-item label="是否有现场" prop="SFYXC_NAME" class="pdl">
                  <span class="whiteColor">{{ajInfo.SFYXC_NAME}}</span>
                </el-form-item>
                 <el-form-item label="作案人数" prop="ZARS" class="pdl">
                  <span class="whiteColor">{{ajInfo.ZARS}}</span>
                </el-form-item>
                <el-form-item label="案件来源" prop="AJLY_NAME">
                  <span class="whiteColor">{{ajInfo.AJLY_NAME}}</span>
                </el-form-item>
                <el-form-item label="受理时间" prop="SLSJ" class="pdl">
                  <span class="whiteColor" v-if="ajInfo.SLSJ">{{$handlerDateTime(ajInfo.SLSJ)}}</span>
                </el-form-item>
                 <el-form-item label="处置时间" prop="CZSJ" class="pdl">
                  <span class="whiteColor" v-if="ajInfo.CZSJ">{{$handlerDateTime(ajInfo.CZSJ)}}</span>
                </el-form-item>
                 <el-form-item label="破案类型" prop="PALX_NAME" class="pdl">
                  <span class="whiteColor">{{ajInfo.PALX_NAME}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="pdr">
                <el-form-item label="立案日期" prop="" label-width="80px">
                  <el-date-picker v-show="laDateUpdFlag && carryParam.isRl==='1'" v-model="laDate" type="date" value-format="yyyy-MM-dd"
                                  placeholder="选择日期" :disabled="larqDisabled" :picker-options="laPickerOpt" @change="laPickerChange"></el-date-picker>
                  <span class="whiteColor" v-show="!laDateUpdFlag && carryParam.isRl==='1'">{{laDate}}</span>
                  <el-button type="success" style="margin-left: 10px;" @click="saveLAPARQ(1)" :loading="saveLoading" v-if="!larqDisabled">确认</el-button>
                  <img v-if="laDateUpdFlag && carryParam && carryParam.isRl==='1'" src="/static/image/caseFile_images/edit.png" alt="修改" srcset="" class="featureImg" @click="editLarq">
                </el-form-item>
                <el-form-item label="案件类别2" prop="AJLB2_NAME">
                  <span class="whiteColor">{{ajInfo.AJLB2_NAME}}</span>
                </el-form-item>
                <el-form-item label="作案特点" prop="ZATD_NAME">
                  <span class="whiteColor">{{ajInfo.ZATD_NAME}}</span>
                </el-form-item>
                <el-form-item label="破案方式" prop="PAFS_NAME">
                  <span class="whiteColor">{{ajInfo.PAFS_NAME}}</span>
                </el-form-item>
                 <el-form-item label="犯罪主体类型" prop="FZZTLX_NAME">
                  <span class="whiteColor">{{ajInfo.FZZTLX_NAME}}</span>
                </el-form-item>
                <el-form-item label="抓获人员数" prop="ZHRYS">
                  <span class="whiteColor">{{ajInfo.ZHRYS}}</span>
                </el-form-item>
                <el-form-item label="报案人" prop="BARXM">
                  <span class="whiteColor">{{ajInfo.BARXM}}</span>
                </el-form-item>
                <el-form-item label="受理人" prop="SLR_NAME">
                  <span class="whiteColor">{{ajInfo.SLR_NAME}}</span>
                </el-form-item>
                <el-form-item label="处置人名称" prop="CZR_NAME">
                  <span class="whiteColor">{{ajInfo.CZR_NAME}}</span>
                </el-form-item>
                <el-form-item label="破案时间段" prop="PASJD_NAME">
                  <span class="whiteColor">{{ajInfo.PASJD_NAME}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="破案日期" prop="" label-width="80px">
                  <el-date-picker v-show="paDateUpdFlag && carryParam.isRl==='1'" v-model="paDate" type="date" value-format="yyyy-MM-dd"
                                  placeholder="选择日期" :disabled="parqDisabled" :picker-options="paPickerOpt" @change="paPickerChange"></el-date-picker>
                  <span class="whiteColor" v-show="!paDateUpdFlag && carryParam.isRl==='1'">{{paDate}}</span>
                  <el-button type="success" style="margin-left: 10px;" @click="saveLAPARQ(2)" :loading="saveLoading" v-if="!parqDisabled">确认</el-button>
                  <img v-if="paDateUpdFlag && carryParam && carryParam.isRl==='1'" src="/static/image/caseFile_images/edit.png" alt="修改" srcset="" class="featureImg" @click="editParq">
                </el-form-item>
                <el-form-item label="是否单位作案" prop="SFDWZA_NAME">
                  <span class="whiteColor">{{ajInfo.SFDWZA_NAME}}</span>
                </el-form-item>
                <el-form-item label="案件属性" prop="AJSX_NAME">
                  <span class="whiteColor">{{ajInfo.AJSX_NAME}}</span>
                </el-form-item>
                <el-form-item label="作案渠道" prop="ZAQD">
                  <span class="whiteColor">{{ajInfo.ZAQD}}</span>
                </el-form-item>
                <el-form-item label="发案单位名称" prop="FADWMC">
                  <span :title="ajInfo.FADWMC" class="whiteColor ellipsis-word">{{ajInfo.FADWMC}}</span>
                </el-form-item>
                 <el-form-item label="案件集团人数" prop="JTRS">
                  <span class="whiteColor">{{ajInfo.JTRS}}</span>
                </el-form-item>
                <!-- 透明的占位 -->
                <el-form-item label="受理单位" prop="SLDW_NAME" style="opacity:0;">
                  <span :title="ajInfo.SLDW_NAME" class="whiteColor ellipsis-word">{{ajInfo.SLDW_NAME}}</span>
                </el-form-item>
                <el-form-item label="受理单位" prop="SLDW_NAME">
                  <span :title="ajInfo.SLDW_NAME" class="whiteColor ellipsis-word">{{ajInfo.SLDW_NAME}}</span>
                </el-form-item>
                 <el-form-item label="处置单位" prop="CZDW_NAME">
                  <span :title="ajInfo.CZDW_NAME" class="whiteColor ellipsis-word">{{ajInfo.CZDW_NAME}}</span>
                </el-form-item>
                <el-form-item label="破案单位" prop="PADW_NAME">
                  <span :title="ajInfo.PADW_NAME"  class="whiteColor ellipsis-word">{{ajInfo.PADW_NAME}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="破案简况" prop="PAJK">
                  <span v-html="getReplace(ajInfo.PAJK)" class="whiteColor"></span>
                </el-form-item>
                <el-form-item label="作案原因" prop="ZAYY_NAME">
                  <span v-html="getReplace(ajInfo.ZAYY_NAME)" class="whiteColor"></span>
                </el-form-item>
                <el-form-item label="案件综述" prop="AQZS">
                  <span v-html="getReplace(ajInfo.AQZS)" class="whiteColor"></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="作案特点" name="second">
            <div slot="label">
              <p>作案特点</p>
              <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
            </div>
            <el-row>
              <el-col :span="8" class="pdl pdr">
                <el-form-item label="选择时机" prop="XZSJ_NAME">
                  <span class="whiteColor">{{ajInfo.XZSJ_NAME}}</span>
                </el-form-item>
                <el-form-item label="选择对象" prop="XZDX_NAME">
                  <span class="whiteColor">{{ajInfo.XZDX_NAME}}</span>
                </el-form-item>
                <el-form-item label="作案手段" prop="ZASD_NAME">
                  <span class="whiteColor">{{ajInfo.ZASD_NAME}}</span>
                </el-form-item>
                <el-form-item label="专长" prop="FABW_NAME">
                  <span class="whiteColor">{{ajInfo.XZ_ZC_NAME}}</span>
                </el-form-item>
                <el-form-item label="受理日期" prop="FABW_NAME">
                  <span class="whiteColor" v-if="ajInfo.SLSJ">{{$handlerDateTime(ajInfo.SLSJ)}}</span>
                </el-form-item>
                <el-form-item label="操作日期" prop="FABW_NAME">
                  <span class="whiteColor" v-if="ajInfo.CZSJ">{{$handlerDateTime(ajInfo.CZSJ)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8"  class="pdr">
                <el-form-item label="活动地区" prop="XZ_LCDQFW">
                  <span class="whiteColor">{{ajInfo.XZ_LCDQFW}}</span>
                </el-form-item>
                <el-form-item label="选择物品" prop="XZWP_NAME">
                  <span class="whiteColor">{{ajInfo.XZWP_NAME}}</span>
                </el-form-item>
                <el-form-item label="作案特点" prop="ZATD_NAME">
                  <span class="whiteColor">{{ajInfo.ZATD_NAME}}</span>
                </el-form-item>
                <el-form-item label="受理单位" prop="SLDW_NAME">
                  <span class="whiteColor">{{ajInfo.SLDW_NAME}}</span>
                </el-form-item>
                <el-form-item label="操作单位" prop="CZDW_NAME">
                  <span class="whiteColor">{{ajInfo.CZDW_NAME}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销赃方式" prop="XZFS_NAME">
                  <span class="whiteColor">{{ajInfo.XZFS_NAME}}</span>
                </el-form-item>
                <el-form-item label="选择处所" prop="XZCS_NAME">
                  <span class="whiteColor">{{ajInfo.XZCS_NAME}}</span>
                </el-form-item>
                <el-form-item label="作案工具" prop="ZATD_NAME">
                  <span class="whiteColor">{{ajInfo.ZAGJ_NAME}}</span>
                </el-form-item>
                <el-form-item label="受理人" prop="SLR_NAME">
                  <span class="whiteColor">{{ajInfo.SLR_NAME}}</span>
                </el-form-item>
                <el-form-item label="操作人" prop="CZR_NAME">
                  <span class="whiteColor">{{ajInfo.CZR_NAME}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="作案规律" prop="ZAGL">
                  <span class="whiteColor">{{ajInfo.ZAGL}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row style="margin:15px">
              <el-col :span="4" style="text-align: right">贩运方式 :</el-col>
              <el-col :span="6" style="padding-left: 10px;">{{ajInfo.JD_FYFS_NAME}}&nbsp;</el-col>
            </el-row>
            <el-row style="margin:15px">
              <el-col :span="2" style="text-align: right">藏毒方式 :</el-col>
              <el-col :span="4" style="padding-left: 10px;">{{ajInfo.JD_CDFS_NAME}}&nbsp;</el-col>
            </el-row> -->
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </section>
</template>
<script>
import { getSYHFLLBList } from '@/utils/codetotext'
import { getUserInfo } from '@/utils/auth'

import titlePub from './titlePub'
export default {
  props: ['info'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      laDateUpdFlag: false,
      paDateUpdFlag: false,
      larqDisabled: true,
      parqDisabled: true,
      laDate: '',
      paDate: '',
      activeName: 'first',
      ajInfo: {},
      carryParam: {},
      saveLoading: false, // 案件类型修改按钮
      fllbDisabled: true, // 类型是否可编辑
      fllbList: getSYHFLLBList(), // 案件分类类别
      rules: {
        fllb: [{ required: true, message: '请选择案件类型', trigger: 'blur' }]
      },
      laPickerOpt: {},
      paPickerOpt: {}
    }
  },
  watch: {
    info(val) {
      if (val.AJBH) {
        this.ajInfo = val
        this.init()
      }
    }
  },
  methods: {
    laPickerChange(val) {
      if (val) {
        this.paPickerOpt = Object.assign({}, this.paPickerOpt, {
          disabledDate: (time) => {
            return time.getTime() < (new Date(val).getTime() - 86400000)
          }
        })
      } else {
        this.paPickerOpt = this.paPickerOpt = Object.assign({}, this.paPickerOpt, {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    paPickerChange(val) {
      if (val) {
        this.laPickerOpt = Object.assign({}, this.laPickerOpt, {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.laPickerOpt = Object.assign({}, this.laPickerOpt, {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      if (this.ajInfo && this.ajInfo.SYH_FLLB) {
        // 案件详情存在 案件类型
        this.ajInfo.fllb = this.ajInfo.SYH_FLLB.split(',')
      }
      this.laDate = this.$handlerDateTime(this.ajInfo.LARQ)
      this.paDate = this.$handlerDateTime(this.ajInfo.PARQ)
      if (this.$route.query) {
        this.carryParam = this.$route.query
      }
      const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]

      // 杨凌区的派出所,当支队
      if (curDept.parentDepCode === '610403390000') {
        curDept.depCode = curDept.parentDepCode
      }
      // 派出所当父级对待
      if (curDept.depType === '4') {
        curDept.depCode = curDept.parentDepCode
      }

      if ((this.laDate === '' || this.laDate === '0' || (this.laDate && this.laDate.length !== 10)) && this.$route.query.rlDept === curDept.depCode) {
        this.laPickerChange(this.laDate)
        this.laDateUpdFlag = true
      } else {
        this.laDateUpdFlag = false
      }
      if ((this.paDate === '' || this.paDate === '0' || (this.paDate && this.paDate.length !== 10)) && this.$route.query.rlDept === curDept.depCode) {
        this.paPickerChange(this.paDate)
        this.paDateUpdFlag = true
      } else {
        this.paDateUpdFlag = false
      }
      // 是否为厅角色
      const leader = curDept.depCode.substring(0, 4) === '6100'
      if (leader) {
        this.paDateUpdFlag = true
        this.laDateUpdFlag = true
      }
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    },
    saveFllb() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var ajString = JSON.stringify(this.ajInfo)
          ajString = JSON.parse(ajString)
          const b = JSON.parse(getUserInfo())
          const para = {}
          para.bizType = 1
          para.action = '修改案件分类'
          para.bizId = this.ajInfo.id
          para.userId = b.id
          para.userName = b.realName
          para.ajbh = this.ajInfo.AJBH
          para.fllb = ajString.fllb.join(',')
          this.$update('ajeditfllb/' + this.ajInfo.AJBH, para).then((response) => {
            if (response.success === true) {
              this.$message({
                message: '修改成功', type: 'success'
              })
              location.reload()
            }
          })
        }
      })
    },
    rowClick() {
    },
    saveLAPARQ(flag) {
      const params = { id: this.ajInfo.AJBH }
      if (flag === 1) {
        if (!this.laDate) {
          this.$message({
            type: 'error',
            message: '请选择立案日期'
          })
          return false
        }
        params.larq = this.laDate.replace(/-/g, '')
      }
      if (flag === 2) {
        if (!this.paDate) {
          this.$message({
            type: 'error',
            message: '请选择破案日期'
          })
          return false
        }
        params.parq = this.paDate.replace(/-/g, '')
      }
      this.$update('ajrlajtime/' + this.ajInfo.AJBH, params).then((response) => {
        if (response.success === true) {
          // 更新食药环表
          this.$message({
            message: '修改成功', type: 'success'
          })
          // this.detail()
          location.reload()
        }
      })
    },
    detail() {
      // this.$query('ajjbxxsyh/' + this.ajInfo.AJBH, {}).then((response) => {
      //   if (response.code === '000000') {
      //     this.ajInfo = response.data
      //     this.init()
      //   }
      // })
    },
    editLarq() {
      this.larqDisabled = !this.larqDisabled
    },
    editParq() {
      this.parqDisabled = !this.parqDisabled
    },
    editCaseType() { // 修改案件类型
      this.fllbDisabled = !this.fllbDisabled
    },
    getReplace(data) {
      if (data) {
        var item = data.split('/r/n').join('\r\n')
        return item
      }
    }

  },
  mounted() {
    // this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.cardNumber = this.cardId
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.trajectory_wrap {
  width: 100%;
  min-height: 130px;
  white-space: nowrap;
  overflow-x: auto;
}
.trajectory_cell {
  width: 150px;
  text-align: center;
  float: left;
  margin-bottom: 10px;
  p {
    font-size: 13px;
    margin: 3px 0 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .moreText:hover {
    width: fit-content;
    text-align: center;
  }
}
.trajectory_cell .time_color {
  color: #00a0e9;
}
.trajectory_cell .address_color {
  color: #bce8fc;
}
.gjdash {
  float: left;
  margin: 55px 10px 0;
}
.circle_number {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 19px;
  border-radius: 20px;
  color: #ffffff;
  background: #00a0e9;
  font-size: 12px;
  margin-left: 5px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.person_cell {
  float: left;
  text-align: center;
  margin-right: 30px;
  img {
    width: 126px;
    height: 150px;
    border: 1px solid #00a0e9;
    border-radius: 2px;
  }
  p {
    width: 100%;
  }
  .xyr_name {
    cursor: pointer;
    text-shadow: 2px 2px 5px #fff;
  }
}
.infoSupplement {
  .el-tabs__content {
    padding: 10px 0 0 12px;
  }
  .el-form-item.is-required .el-form-item__label:before {
    content: "";
    color: transparent;
  }
}
.pdl {
  padding-left: 4px;
}
.pdr {
  padding-right: 10px;
}
</style>
