<template>
  <section>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix" style="position: relative">
        <span v-if="$route.params.id > 0">编辑企业</span>
        <span v-else>新建企业</span>
          <!-- <el-button style="position: absolute; right: 145px;top:6px;" size="small" type="primary" @click="add" v-if="$isViewBtn('110009')">保存</el-button> -->
        <!-- <el-button style="position: absolute; right: 20px;" size="small" @click="back">返回</el-button> -->
         <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
      </div>
      <el-row>
        <el-col :span="6">
          <div class="info_collect">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="enterpriseInfo.ATTACHMENT" :src="enterpriseInfo.ATTACHMENT" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!--<el-carousel trigger="click" height="400px">-->
              <!--<el-carousel-item v-for="item in 4" :key="item">-->
                <!--<h3>{{ item }}</h3>-->
              <!--</el-carousel-item>-->
            <!--</el-carousel>-->
          </div>
        </el-col>
        <el-col :span="18" style="padding-right: 20px;">
          <el-form ref="form" :rules="rules"  :model="enterpriseInfo" size="small" label-width="155px" @submit.prevent="onSubmit">
            <el-col :span="12">
              <el-form-item label="统一社会信用代码" prop="TYSHXYDM">
                <el-input size="small" v-model="enterpriseInfo.TYSHXYDM"></el-input>
              </el-form-item>
              <el-form-item label="企业性质" prop="DWXZ">
                <el-select size="small" filterable v-model="enterpriseInfo.DWXZ" placeholder="请选择企业性质" style="width: 100%" @change="DWXZSelectChange">
                  <el-option v-for="item in enterprise_nature" :key="item.value" :label="item.code_name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="登记机关" prop="DJDW">
                <el-input size="small" v-model="enterpriseInfo.DJDW"></el-input>
              </el-form-item>
              <el-form-item label="税务登记号" prop="SWDJH">
                <el-input size="small" v-model="enterpriseInfo.SWDJH"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码证" prop="ZZJGDM">
                <el-input size="small" v-model="enterpriseInfo.ZZJGDM"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名" prop="FRDBXM">
                <el-input size="small" v-model="enterpriseInfo.FRDBXM"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称" prop="DWMC">
                <el-input size="small" v-model="enterpriseInfo.DWMC"></el-input>
              </el-form-item>
              <el-form-item label="企业状态" prop="DJZT">
                <el-select size="small" v-model="enterpriseInfo.DJZT" placeholder="请选择企业状态" style="width: 100%" @change="DJZTSelectChange">
                  <el-option v-for="item in stateArr" :key="item.value" :label="item.code_name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="注册日期" prop="ZCRQ">
                <el-date-picker size="small" type="date" placeholder="选择日期" v-model="enterpriseInfo.ZCRQ" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="营业执照编号" prop="YYZZBH">
                <el-input size="small" v-model="enterpriseInfo.YYZZBH"></el-input>
              </el-form-item>
              <el-form-item label="企业详址" prop="MLXZ">
                <el-input size="small" v-model="enterpriseInfo.MLXZ"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号" prop="FRDBZJHM">
                <el-input size="small" v-model="enterpriseInfo.FRDBZJHM"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="经营范围">
                <el-input type="textarea" size="small" v-model="enterpriseInfo.JYFWZY"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                 <el-button style="float: left;" size="small" type="primary" @click="add" v-if="$isViewBtn('110009')">保存</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <Tab :tabData="tabData" :enterpriseInfo="enterpriseInfo" :id="$route.params.id" :jgbh="jgbh" style="margin-top: 20px;"></Tab>
    </el-card>
  </section>
</template>
<script>
import Tab from './components/Tab'
import {
  getTCode, addCompany, getList, editCompany, getCompany
} from '@/api/inforCollection'
import {
  parseTime
} from '@/utils/index'
import Attachment from '@/api/attachment'
import {
  identityCodeValid
} from '@/utils/validate'

export default {
  data() {
    return {
      initOkNum: 0,
      jgbh: '',
      enterpriseInfo: {
        DWMC: '',
        DWXZ: '',
        DJDW: '',
        SWDJH: '',
        ZZJGDM: '',
        MLXZ: '',
        FRDBXM: '',
        DJZT: '',
        ZCRQ: '',
        YYZZBH: '',
        TYSHXYDM: '',
        FRDBZJHM: '',
        JYFWZY: '',
        ATTACHMENT: ''
      },
      DWXZLable: '',
      DJZTLable: '',
      tabData: [
        { title: '营业执照信息', content: 'BusinessLicenseInfo' },
        // { title: '营业执照信息', content: 'BusinessLicenseInfo' },
        // { title: '变更信息', content: 'ChangeInfo' },
        // { title: '行政许可信息', content: 'AdminLicensingInfo' },
        // { title: '行政处罚信息', content: 'AdminPunishInfo' },
        // { title: '列入高危名录信息', content: 'HighRiskInfo' },
        // { title: '列入黑名单信息', content: 'BlackInfo' },
        { title: '涉案案件', content: 'InvolvedCase' },
        { title: '从业人员', content: 'CompanyPerson' }
        // { title: '查看时间轴', content: 'timeLineSmall' }
      ],
      rules: {
        DWXZ: [{ required: true, message: '请输入企业性质', trigger: 'blur' }],
        DJDW: [{ required: true, message: '请输入登记机关', trigger: 'blur' }],
        MLXZ: [{ required: true, message: '请输入企业详址', trigger: 'blur' }],
        FRDBXM: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
        DJZT: [{ required: true, message: '请输入登记状态', trigger: 'blur' }],
        ZCRQ: [{ required: true, message: '请选择注册时间', trigger: 'blur' }],
        TYSHXYDM: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入统一社会信用代码'))
            }
            const reg = /^[A-Za-z0-9]+$/
            if (!reg.test(value)) {
              callback(new Error('请输入正确的统一社会信用代码'))
            } else {
              callback(this.query())
            }
          }
        }],
        FRDBZJHM: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!this.IdentityCodeValid(value)) {
              callback(new Error('请输入正确的身份证号码'))
            } else {
              callback()
            }
          }
        }],
        DWMC: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
      },
      enterprise_nature: [],
      stateArr: [],
      imageUrl: '',
      uploadAction: Attachment.uploadFileUrl
    }
  },
  components: {
    Tab
  },
  methods: {
    tcode(type) {
      const para = {
        codeLx: type
      }
      getTCode(para).then((response) => {
        if (type === 'qyxz') {
          this.enterprise_nature = response.data
        } else {
          this.stateArr = response.data
        }
        this.initOkNum += 1
      })
    },
    query() {
      const para = {
        TYSHXYDM: this.enterpriseInfo.TYSHXYDM
      }
      getList(para).then((response) => {
        let data = response.data
        if (data.code === '000000' && data.data.length > 0) {
          data = data[0]
          this.enterpriseInfo = {
            DWMC: data.DWMC,
            DWXZ: data.DWXZ,
            DJDW: data.DJDW,
            SWDJH: data.SWDJH,
            ZZJGDM: data.ZZJGDM,
            MLXZ: data.MLXZ,
            FRDBXM: data.FRDBXM,
            DJZT: data.DJZT,
            ZCRQ: data.ZCRQ,
            YYZZBH: data.YYZZBH,
            TYSHXYDM: data.TYSHXYDM,
            FRDBZJHM: data.FRDBZJHM,
            JYFWZY: data.JYFWZY,
            ATTACHMENT: data.ATTACHMENT
          }
        }
      })
    },
    detail() {
      const para = {
        id: this.$route.params.id
      }
      getCompany(para).then((response) => {
        const data = response.data
        this.enterpriseInfo = {
          id: this.$route.params.id,
          DWMC: data.DWMC,
          DWXZ: data.DWXZ,
          DJDW: data.DJDW,
          SWDJH: data.SWDJH,
          ZZJGDM: data.ZZJGDM,
          MLXZ: data.MLXZ,
          FRDBXM: data.FRDBXM,
          DJZT: data.DJZT,
          ZCRQ: data.ZCRQ,
          YYZZBH: data.YYZZBH,
          TYSHXYDM: data.TYSHXYDM,
          FRDBZJHM: data.FRDBZJHM,
          JYFWZY: data.JYFWZY,
          ATTACHMENT: data.ATTACHMENT
        }
        // this.DWXZSelectChange(this.enterpriseInfo.DWXZ)
        // this.DJZTSelectChange(this.enterpriseInfo.DJZT)
        this.detailInitOk = true
        if (data.JGBH) {
          this.jgbh = data.JGBH
        }
      })
    },
    add() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.enterpriseInfo.DWXZNAME = this.DWXZLable
          this.enterpriseInfo.DJZTNAME = this.DJZTLable
          this.enterpriseInfo.logFlag = 1 // 是否写日志
          this.enterpriseInfo.ZCRQ = parseTime(this.enterpriseInfo.ZCRQ, '{y}-{m}-{d} {h}:{i}:{s}')
          if (this.$route.params.id) { // 修改
            this.enterpriseInfo.id = this.$route.params.id
            editCompany(this.enterpriseInfo).then((res) => {
              this.listLoading = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.back()
            }).catch(() => {
              this.listLoading = false
            })
          } else { // 添加
            addCompany(this.enterpriseInfo).then((res) => {
              this.listLoading = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.back()
            }).catch(() => {
              this.listLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.enterpriseInfo.ATTACHMENT = res.data
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 100

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 100MB!')
      // }
      // return isJPG && isLt2M
      // return true
      var name = file.name.split('.')
      var arrayLength = name.length
      var fileType = name[arrayLength - 1]
      const reg = /^(png)|(jpg)$/
      if (!reg.test(fileType)) {
        this.$message({
          message: '上传文件只支持png、jpg',
          type: 'warning'
        })
        return false
      }
    },
    back() {
      this.$router.back(-1)
    },
    IdentityCodeValid(code) {
      return identityCodeValid(code)
    },
    DWXZSelectChange(val) { // 企业性质
      let obj = {}
      obj = this.enterprise_nature.find((item) => {
        return item.code === val
      })
      this.DWXZLable = obj.code_name
    },
    DJZTSelectChange(val) { // 企业状态
      if (val) {
        let obj = {}
        obj = this.stateArr.find((item) => {
          return item.code === val
        })
        this.DJZTLable = obj.code_name
      }
    }
  },
  mounted() {
    this.tcode('qyxz')
    this.tcode('qyzt')
  },
  watch: {
    initOkNum(val) {
      if (val === 2) {
        if (this.$route.params.id) {
          this.detail()
        }
      }
    }
  }
}
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

/* 上传图片 */
.info_collect {
  text-align: center;
}
.info_collect .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.info_collect .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.info_collect .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 350px;
  line-height: 350px;
  text-align: center;
}
.info_collect .avatar {
  width: 300px;
  height: 350px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
