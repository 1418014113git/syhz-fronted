<template>
  <section>
   <el-row class="inspect_edit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="inspect_edit">
      <div class="inspecorg">
        <h3 v-if="$route.params.id === 0">添加全国检验鉴定机构名录</h3>
        <h3 v-else>编辑全国检验鉴定机构名录</h3>
        <el-form :model="form" ref="form" size="small" :rules="rules" label-width="140px" v-loading="loading">
          <el-form-item label="检验机构名称" prop="JGMC">
            <el-input v-model="form.JGMC" auto-complete="off" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属地" prop="citys">
            <el-cascader style="width:100%"
                        v-model="form.citys"
                        :options="options"
                        :props="props"
                        change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="业务范围" prop="YWFW">
            <el-input v-model="form.YWFW" type="textarea" auto-complete="off"
                      maxlength="500" :autosize="{minRows: 6, maxRows: 10}"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="SYH_AVAILABLE_STATUS">
            <el-select v-model="form.SYH_AVAILABLE_STATUS" placeholder="请选择" clearable  class="ipt">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="不启用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="LXDH" class="ipt">
            <el-input v-model="form.LXDH" auto-complete="off" maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item label="开办资金" prop="KBZJ" class="ipt">
            <el-input v-model="form.KBZJ" auto-complete="off" maxlength="20" clearable></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="TYSHXYDM" class="ipt">
            <el-input v-model="form.TYSHXYDM" auto-complete="off" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="法人" prop="FDDBR" class="ipt">
            <el-input v-model="form.FDDBR" auto-complete="off" maxlength="8" clearable></el-input>
          </el-form-item>
          <el-form-item label="管理机构" prop="GLJG" class="ipt">
            <el-input v-model="form.GLJG" auto-complete="off" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="经费来源" prop="JFLY" class="ipt">
            <el-input v-model="form.JFLY" auto-complete="off" maxlength="30" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="DZ">
            <el-input v-model="form.DZ" auto-complete="off" maxlength="80" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-if="$isViewBtn('105005')" v-loading="loading">保 存</el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
import {
  getUserInfo
} from '@/utils/auth'
import {
  getAjCheckOrganizationOne, editAjCheckOrganization, addAjCheckOrganization
} from '@/api/inspectIdent'
import {
  getCityTree
} from '@/api/citys'

export default {
  name: 'edit',
  data() {
    return {
      form: {
        citys: [],
        SYH_AVAILABLE_STATUS: '',
        JGMC: '',
        YWFW: '',
        LXDH: '',
        KBZJ: '',
        TYSHXYDM: '',
        FDDBR: '',
        GLJJ: '',
        JFLY: '',
        DZ: ''
      },
      loading: false,
      options: [],
      props: {
        label: 'cityName',
        value: 'cityCode'
      },
      rules: {
        JGMC: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 50, message: '机构名称不能超过50字', trigger: 'blur' }
        ],
        SSXQ: [
          { required: true, message: '请选择归属地', trigger: 'change' }
        ],
        YWFW: [
          { required: true, message: '请输入机构描述', trigger: 'blur' },
          { max: 500, message: '描述内容不能超过500字', trigger: 'blur' }
        ],
        SYH_AVAILABLE_STATUS: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ],
        LXDH: [
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[1][345678][0-9]{9}$/
              if (!reg.test(value)) {
                callback(new Error('请输入11位正确的手机号码'))
              } else {
                callback()
              }
            }
          }
        ],
        KBZJ: [
          { required: false, trigger: 'blur', message: '开办资金不能为空' },
          { pattern: /^((\d+,\d+)|(\d+))*(\.\d{1,2})?$/, message: '请输入数字' }
        ],
        TYSHXYDM: [
          { required: false, message: '请输入统一社会信用代码', trigger: 'change' },
          { pattern: /^[A-Za-z0-9-]+$/, message: '仅支持英文、数字、短横线' }
        ],
        FDDBR: [
          { required: false, message: '请输入法人', trigger: 'change' },
          { pattern: this.$regEnCnNumber, message: '仅支持中文、英文、数字' }
        ],
        JFLY: [
          { required: false, message: '请输入经费来源', trigger: 'change' }
        ],
        DZ: [
          { required: false, message: '请输入地址', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.form.province = ''
      this.form.city = ''
      this.form.county = ''

      if (this.form.citys.length > 0) {
        const province = this.getCityByCode(this.options, this.form.citys[0])
        this.form.province = province.cityName
        if (this.form.citys.length > 1) {
          const city = this.getCityByCode(province.children, this.form.citys[1])
          this.form.city = city.cityName
          if (this.form.citys.length > 2) {
            const county = this.getCityByCode(city.children, this.form.citys[2])
            this.form.county = county.cityName
          }
        }
      }
      this.form.ssxq = this.form.province + (this.form.city !== '' ? '|' + this.form.city : '') + (this.form.county !== '' ? '|' + this.form.county : '')
      this.form.syhAvailableStatus = this.form.SYH_AVAILABLE_STATUS
      this.form.jgmc = this.form.JGMC
      this.form.ywfw = this.form.YWFW
      this.form.lxdh = this.form.LXDH
      this.form.kbzj = this.form.KBZJ
      this.form.tyshxydm = this.form.TYSHXYDM
      this.form.fddbr = this.form.FDDBR
      this.form.gljg = this.form.GLJG
      this.form.jfly = this.form.JFLY
      this.form.dz = this.form.DZ
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.logFlag = 1 // 手动点击时，添加埋点参数
          this.loading = true
          // 如果存在id就是修改，不存在就添加
          if (this.form.ID) {
            this.form.id = this.form.ID
            editAjCheckOrganization(this.form).then((response) => {
              this.loading = false
              if (response.success === true) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.toList()
              }
            })
          } else {
            const a = JSON.parse(getUserInfo())
            this.form.createUser = a.id
            addAjCheckOrganization(this.form).then((response) => {
              this.loading = false
              if (response.success === true) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.toList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toList() {
      this.$router.push({
        path: '/handlingGuide/inspecorgList'
      })
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.toList()
      })
    },
    getCityByCode(citys, cityCode) {
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].cityCode === cityCode) {
          return citys[i]
        }
      }
    },
    getCityByName(citys, cityName) {
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].cityName === cityName) {
          return citys[i]
        }
      }
    },
    setCitys() {
      this.form.citys = []
      if (this.form.SSXQ) {
        const prov = this.form.SSXQ.split('|')
        const province = this.getCityByName(this.options, prov[0])
        this.form.citys.push(province.cityCode)
        if (prov[1]) {
          const city = this.getCityByName(province.children, prov[1])
          this.form.citys.push(city.cityCode)
          if (prov[2]) {
            const county = this.getCityByName(city.children, prov[2])
            this.form.citys.push(county.cityCode)
          }
        }
      }
    },
    detail() {
      this.loading = true
      const para = {
        id: this.form.id
      }
      getAjCheckOrganizationOne(para).then((response) => {
        response.data.enable = response.data.enable ? '1' : '0'
        this.form = response.data
        this.setCitys()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    cityTree() {
      getCityTree().then((response) => {
        const data = response.data
        this.options = data
        if (this.$route.query.id) {
          this.form.id = this.$route.query.id
          this.detail()
        }
        this.loading = false
      })
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.loading = true
    }
    this.cityTree()
  }
}
</script>

<style scoped>
.inspecorg {
  width: 70%;
  margin: 0 auto;
}

.inspecorg .ipt {
  width: 100%;
}

h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.inspect_edit {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
</style>
