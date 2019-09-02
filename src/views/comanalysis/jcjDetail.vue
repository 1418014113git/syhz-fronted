<template>
  <!--专业人员报名-->
  <section class="signUpWrap">
    <el-form  :model="jcjInfo" ref="jcjInfo" label-width="110px" v-loading="loading" label-position="left">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="接处警" name="1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="接警时间" prop="jjsj">
                <span>{{$handlerDateTime(jcjInfo.jjsj)}}</span>
              </el-form-item>
              <el-form-item label="接警人电话" prop="jjrdh">
                <span>{{jcjInfo.jjrdh}}</span>
              </el-form-item>
              <el-form-item label="报警人" prop="bjr">
                <span>{{jcjInfo.bjr}}</span>
              </el-form-item>
              <el-form-item label="出生日期" prop="bjrcsrq">
                <span>{{$handlerDateTime(jcjInfo.bjrcsrq)}}</span>
              </el-form-item>
              <el-form-item label="户籍地" prop="bjrhjd">
                <span>{{jcjInfo.bjrhjd}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="管辖地" prop="gxdName">
                <span>{{jcjInfo.gxdName}}</span>
              </el-form-item>
              <el-form-item label="报警形式" prop="bjxsName">
                <span>{{jcjInfo.bjxsName}}</span>
              </el-form-item>
              <el-form-item label="性别" prop="bjrxbName">
                <span>{{jcjInfo.bjrxbName}}</span>
              </el-form-item>
              <el-form-item label="国籍" prop="bjrgjName">
                <span>{{jcjInfo.bjrgjName}}</span>
              </el-form-item>
              <el-form-item label="住址" prop="bjrzz">
                <span>{{jcjInfo.bjrzz}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接警人" prop="jjrName">
                <span>{{jcjInfo.jjrName}}</span>
              </el-form-item>
              <el-form-item label="是否涉及手机" prop="sfsjsjName">
                <span>{{jcjInfo.sfsjsjName}}</span>
              </el-form-item>
              <el-form-item label="证件号码" prop="bjrzjhm">
                <span>{{jcjInfo.bjrzjhm}}</span>
              </el-form-item>
              <el-form-item label="联系电话" prop="bjrlxdh">
                <span>{{jcjInfo.bjrlxdh}}</span>
              </el-form-item>
              <el-form-item label="单位" prop="bjrdw">
                <span>{{jcjInfo.bjrdw}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="报警内容" prop="bjnr">
                <el-tooltip class="item" effect="dark" :content="jcjInfo.bjnr" placement="top-start">
                  <span class="beyondTextClass">{{jcjInfo.bjnr}}</span>
                 </el-tooltip>
              </el-form-item>
              <el-form-item label="处警意见" prop="cjyj">
                <el-tooltip class="item" effect="dark" :content="jcjInfo.cjyj" placement="top-start">
                  <span class="beyondTextClass">{{jcjInfo.cjyj}}</span>
                 </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="处警信息" name="2">
          <el-row>
            <el-col :span="8">
              <el-form-item label="警情名称" prop="xzJqmc">
                <span>{{jcjInfo.xzJqmc}}</span>
              </el-form-item>
              <el-form-item label="发生场所" prop="fscsName">
                <span>{{jcjInfo.fscsName}}</span>
              </el-form-item>
              <el-form-item label="出警时间" prop="cjsj">
                <span>{{$handlerDateTime(jcjInfo.cjsj)}}</span>
              </el-form-item>
              <el-form-item label="出动警力数" prop="cdjls">
                <span>{{jcjInfo.cdjls}}</span>
              </el-form-item>
              <el-form-item label="直接经济损失" prop="zjjjssje">
                <span>{{jcjInfo.zjjjssje}}</span>
              </el-form-item>
              <el-form-item label="人员死亡数" prop="rysws">
                <span>{{jcjInfo.rysws}}</span>
              </el-form-item>
              <el-form-item label="留置审查人数" prop="lzscrs">
                <span>{{jcjInfo.lzscrs}}</span>
              </el-form-item>
              <el-form-item label="解救儿童数" prop="jjets">
                <span>{{jcjInfo.jjets}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到达时间" prop="ddxcsj">
                <span>{{$handlerDateTime(jcjInfo.ddxcsj)}}</span>
              </el-form-item>
              <el-form-item label="发生地点" prop="fsdd">
                <span>{{jcjInfo.fsdd}}</span>
              </el-form-item>
              <el-form-item label="出警单位" prop="czhdwName">
                <span>{{jcjInfo.czhdwName}}</span>
              </el-form-item>
              <el-form-item label="出动机动车数" prop="cdjdcs">
                <span>{{jcjInfo.cdjdcs}}</span>
              </el-form-item>
              <el-form-item label="挽回损失金额" prop="whssje">
                <span>{{jcjInfo.whssje}}</span>
              </el-form-item>
              <el-form-item label="人员受伤数" prop="rysss">
                <span>{{jcjInfo.rysss}}</span>
              </el-form-item>
              <el-form-item label="救助伤员数" prop="jzsys">
                <span>{{jcjInfo.jzsys}}</span>
              </el-form-item>
              <el-form-item label="解救人质数" prop="jjrzs">
                <span>{{jcjInfo.jjrzs}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处警结果" prop="cjjgName">
                <span>{{jcjInfo.cjjgName}}</span>
              </el-form-item>
              <el-form-item label="处警类别" prop="cjlbName">
                <span>{{jcjInfo.cjlbName}}</span>
              </el-form-item>
              <el-form-item label="出警人" prop="czhrName">
                <span>{{jcjInfo.czhrName}}</span>
              </el-form-item>
              <el-form-item label="出动船只数" prop="cdczs">
                <span>{{jcjInfo.cdczs}}</span>
              </el-form-item>
              <el-form-item label="救助群众数" prop="jzqzs">
                <span>{{jcjInfo.jzqzs}}</span>
              </el-form-item>
              <el-form-item label="逃跑人犯数" prop="tprfs">
                <span>{{jcjInfo.tprfs}}</span>
              </el-form-item>
              <el-form-item label="解救妇女数" prop="jjfns">
                <span>{{jcjInfo.jjfns}}</span>
              </el-form-item>
              <el-form-item label="是否涉外" prop="sfswName">
                <span>{{jcjInfo.sfswName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="处警情况" prop="cjxq">
                <el-tooltip class="item" effect="dark" :content="jcjInfo.cjxq" placement="top-start">
                  <span class="beyondTextClass">{{jcjInfo.cjxq}}</span>
                 </el-tooltip>
              </el-form-item>
              <el-form-item label="损失情况" prop="ssqk">
                <span>{{jcjInfo.ssqk}}</span>
              </el-form-item>
              <el-form-item label="补充处理结果" prop="bccljg">
                <el-tooltip class="item" effect="dark" :content="jcjInfo.bccljg" placement="top-start">
                  <span class="beyondTextClass">{{jcjInfo.bccljg}}</span>
                 </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="值班领导" prop="zbldName">
                <span>{{jcjInfo.zbldName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批日期" prop="ldpsrq">
                <span>{{$handlerDateTime(jcjInfo.ldpsrq)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </section>
</template>
<script>
// import { getCultureLevelSelect, getCityData } from '@/utils/staticJson'
export default {
  props: ['jcjbh'],
  data() {
    return {
      activeNames: ['1'],
      loading: false,
      jcjInfo: {}
    }
  },
  components: {},
  filters: {},
  watch: {
    jcjbh(val) {
      if (val) {
        this.jcjbh = val
        this.getJcjInfoByJcjbh()
      }
    }
  },
  methods: {
    handleChange(val) {
      // console.log(val)
    },
    getJcjInfoByJcjbh() { // 根据区域code查机构
      this.loading = true
      this.inNumberOptionData = [] // 先清空报名机构列表
      this.$query('queryreceivepolice/' + this.jcjbh, {}).then((response) => {
        this.loading = false
        if (response.code === '000000') {
          this.jcjInfo = response.data
        }
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    if (this.jcjbh) {
      this.getJcjInfoByJcjbh()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-form-item__label {
  color: #cccccc;
}
.beyondTextClass {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
