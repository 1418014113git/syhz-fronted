<template>
  <section>
   <el-row class="inspect_edit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="inspect_edit">
      <div class="inspecorg">
        <h3>添加装备信息</h3>
        <el-form :model="form" ref="form" size="small" :rules="rules" label-width="140px" v-loading="loading">
          <el-form-item label="行政区划" prop="XZQH">
            <el-cascader style="width:100%"
                         v-model="form.citys"
                         :options="options"
                         :props="props"
                         change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="机构名称" prop="JGMC">
            <el-select v-model="form.JGMC" clearable filterable remote reserve-keyword placeholder="请输入关键词搜索" :remote-method="remoteMethodOrg" :loading="orgLoading">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.orgName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装备类型" prop="ZBLX">
            <el-cascader style="width:100%"
                         v-model="form.ZBLX"
                         :options="optionsZblx"
                         :props="propsZblx"
                         change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="装备数量" prop="ZBSL" class="ipt">
            <el-input-number v-model.trim="form.ZBSL" :min="1" :max="10000" label="排序"></el-input-number>
          </el-form-item>
          <el-form-item label="业务范围" prop="MS">
            <el-input v-model="form.MS" type="textarea" auto-complete="off"
                      maxlength="500" :autosize="{minRows: 6, maxRows: 10}"></el-input>
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
      orgLoading: false,
      orgOptions: [],
      form: {
        citys: [],
        JGMC: '',
        ZBSL: '',
        ZBLX: '',
        MS: ''
      },
      loading: false,
      optionsZblx: [],
      propsZblx: {
        label: 'zbName',
        value: 'zbCode'
      },
      options: [],
      props: {
        label: 'cityName',
        value: 'cityCode'
      },
      rules: {
        XZQH: [
          { required: true, message: '请选择行政区划', trigger: 'change' }
        ],
        JGMC: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 50, message: '机构名称不能超过50字', trigger: 'blur' }
        ],
        ZBLX: [
          { required: true, message: '请输入选择装备类型', trigger: 'blur' }
        ],
        ZBSL: [
          { required: true, message: '请输入装备数量', trigger: 'blur' }
        ],
        MS: [
          { required: true, message: '请输入机构描述', trigger: 'blur' },
          { max: 500, message: '描述内容不能超过500字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    remoteMethodOrg(orgName) {
      this.orgLoading = true
      if (orgName !== '') {
        this.orgOptions = [
          { 'orgName': '西安市食药环大队', 'id': 1, 'value': 1 },
          { 'orgName': '莲湖区食药环支队', 'id': 2, 'value': 2 },
          { 'orgName': '高新区食药环支队', 'id': 3, 'value': 3 },
          { 'orgName': '雁塔区食药环支队', 'id': 4, 'value': 4 },
          { 'orgName': '碑林区食药环支队', 'id': 5, 'value': 5 },
          { 'orgName': '未央区食药环支队', 'id': 6, 'value': 6 }
        ]
      } else {
        this.orgOptions = []
      }
      this.orgLoading = false
    },
    onSubmit() {
      var success = true
      if (success === true) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.toList()
      } else {
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
        this.form.logFlag = 1 // 是否写日志
        this.$refs.form.validate(valid => {
          if (valid) {
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
      }
    },
    toList() {
      this.$router.push({
        path: '/basic/equip'
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
    this.optionsZblx = [
      { 'zbName': '单警装备', 'zbCode': 1 },
      { 'zbName': '特勤装备', 'zbCode': 1 }
    ]
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
