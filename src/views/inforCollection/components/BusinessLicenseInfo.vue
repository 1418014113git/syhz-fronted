<template>
  <section>
    <el-row>
      <el-form ref="form" :rules="rules" :model="enterpriseInfo" size="small" label-width="155px" @submit.prevent="onSubmit">
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="TYSHXYDM">
            <el-input size="small" v-model="enterpriseInfo.TYSHXYDM" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="企业类型" prop="DWLB">
            <el-input size="small" v-model="enterpriseInfo.DWLB" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="营业期限自" prop="KYRQ">
            <el-date-picker size="small" type="date" placeholder="选择日期" v-model="enterpriseInfo.KYRQ"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="登记机关" prop="DJDW">
            <el-input size="small" v-model="enterpriseInfo.DJDW" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="登记状态" prop="DJZT">
            <el-select size="small" v-model="enterpriseInfo.DJZT" placeholder="请选择企业状态" style="width: 100%" @change="DJZTSelectChange">
              <el-option v-for="item in stateArr" :key="item.value" :label="item.code_name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业名称" prop="DWMC">
            <el-input size="small" v-model="enterpriseInfo.DWMC" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="ZAFZR">
            <el-input size="small" v-model="enterpriseInfo.ZAFZR" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="营业期限至" prop="TYRQ">
            <el-date-picker size="small" type="date" placeholder="选择日期" v-model="enterpriseInfo.TYRQ"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="成立时间" prop="ZCRQ">
            <el-date-picker size="small" type="date" placeholder="选择日期" v-model="enterpriseInfo.ZCRQ"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="核准日期" prop="FZRQ">
            <el-date-picker size="small" type="date" placeholder="选择日期" v-model="enterpriseInfo.FZRQ"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="营业场所" prop="ZCDZXZ">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="enterpriseInfo.ZCDZXZ" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营范围" prop="JYFWZY">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="enterpriseInfo.JYFWZY" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="add(true)">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getTCode, addCompany, editCompany, getCompany } from '@/api/inforCollection'
export default {
  name: 'BusinessLicenseInfo',
  props: [
    'info',
    'id'
  ],
  data() {
    return {
      stateArr: [],
      enterpriseInfo: {
        TYSHXYDM: this.info.TYSHXYDM,
        DWLB: this.info.DWLB,
        KYRQ: '',
        DJDW: this.info.DJDW,
        DJZT: this.info.DJZT,
        ZCDZXZ: '',
        JYFWZY: this.info.JYFWZY,
        DWMC: this.info.DWMC,
        ZAFZR: '',
        ZCRQ: this.info.ZCRQ,
        TYRQ: '',
        FZRQ: '',
        DWXZ: this.info.DWXZ,
        SWDJH: this.info.SWDJH,
        ZZJGDM: this.info.ZZJGDM,
        MLXZ: this.info.MLXZ,
        FRDBXM: this.info.FRDBXM,
        YYZZBH: this.info.YYZZBH,
        FRDBZJHM: this.info.FRDBZJHM
      },
      DJZTLable: '',
      rules: {
        DWXZ: [{ required: true, message: '请输入企业性质', trigger: 'blur' }],
        DJDW: [{ required: true, message: '请输入登记机关', trigger: 'blur' }],
        MLXZ: [{ required: true, message: '请输入企业详址', trigger: 'blur' }],
        FRDBXM: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
        DJZT: [{ required: true, message: '请输入登记状态', trigger: 'change' }],
        FZRQ: [{ required: true, message: '请选择核准日期', trigger: 'blur' }],
        TYSHXYDM: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入统一社会信用代码'))
            }
            const reg = /^[A-Za-z0-9]+$/
            if (!reg.test(value)) {
              callback(new Error('请输入正确的统一社会信用代码'))
            } else {
              callback()
            }
          }
        }],
        FRDBZJHM: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
        DWMC: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        KYRQ: [
          {
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (new Date(this.enterpriseInfo.TYRQ).getTime() <= new Date(value).getTime()) {
                callback(new Error('起始日期必须小于截止日期'))
              } else {
                callback()
              }
            }
          }
        ],
        TYRQ: [
          {
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (new Date(this.enterpriseInfo.KYRQ).getTime() >= new Date(value).getTime()) {
                callback(new Error('截止日期必须大于起始日期'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
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
      })
    },
    detail() {
      const para = {
        id: this.id
      }
      getCompany(para).then((response) => {
        const data = response.data
        this.enterpriseInfo = {
          id: data.id,
          TYSHXYDM: data.TYSHXYDM,
          DWLB: data.DWLB,
          KYRQ: data.KYRQ,
          DJDW: data.DJDW,
          DJZT: data.DJZT,
          ZCDZXZ: data.ZCDZXZ,
          JYFWZY: data.JYFWZY,
          DWMC: data.DWMC,
          ZAFZR: data.ZAFZR,
          ZCRQ: data.ZCRQ,
          TYRQ: data.TYRQ,
          FZRQ: data.FZRQ,
          DWXZ: data.DWXZ,
          SWDJH: data.SWDJH,
          ZZJGDM: data.ZZJGDM,
          MLXZ: data.MLXZ,
          FRDBXM: data.FRDBXM,
          YYZZBH: data.YYZZBH,
          FRDBZJHM: data.FRDBZJHM
        }
      })
    },
    DJZTSelectChange(val) { // 企业状态
      let obj = {}
      obj = this.stateArr.find((item) => {
        return item.code === val
      })
      this.DJZTLable = obj.code_name
    },
    add(hand) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.enterpriseInfo.DJZTNAME = this.DJZTLable
          this.enterpriseInfo.ZCRQ = this.enterpriseInfo.ZCRQ ? parseTime(this.enterpriseInfo.ZCRQ, '{y}-{m}-{d} {h}:{i}:{s}') : null
          this.enterpriseInfo.KYRQ = this.enterpriseInfo.KYRQ ? parseTime(this.enterpriseInfo.KYRQ, '{y}-{m}-{d} {h}:{i}:{s}') : null
          this.enterpriseInfo.TYRQ = this.enterpriseInfo.TYRQ ? parseTime(this.enterpriseInfo.TYRQ, '{y}-{m}-{d} {h}:{i}:{s}') : null
          this.enterpriseInfo.FZRQ = this.enterpriseInfo.FZRQ ? parseTime(this.enterpriseInfo.FZRQ, '{y}-{m}-{d} {h}:{i}:{s}') : null
          if (hand) {
            this.enterpriseInfo.logFlag = 1
          }
          if (this.id) { // 修改
            this.enterpriseInfo.id = this.id
            editCompany(this.enterpriseInfo).then((res) => {
              this.listLoading = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
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
            }).catch(() => {
              this.listLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.tcode('qyzt')
    if (this.$route.params.id) {
      this.detail()
    }
  }
}
</script>

<style scoped>
</style>
