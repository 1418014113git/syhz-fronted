<template>
  <section class="equipProject">
    <el-form :model="allocateForm" ref="allocateForm" size="small" :rules="rules" label-width="120px" v-loading="formLoading">
      <el-row>
        <el-col :span="24">
          <el-form-item label="装备分类" prop="groupId">
            <el-select v-model="allocateForm.groupId" clearable filterable remote reserve-keyword placeholder="请输入关键词搜索">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.orgName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配备项目" prop="allocateName">
            <el-select v-model="allocateForm.allocateName" clearable filterable remote reserve-keyword placeholder="请输入关键词搜索">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.orgName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总队（省）" prop="provinceCondition">
            <el-radio-group v-model="allocateForm.provinceCondition">
              <el-radio :label="1">无要求</el-radio>
              <el-radio :label="2">按相关规定配</el-radio>
              <el-radio :label="3">设定数量</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.provinceCondition===3">
              <el-input v-model="allocateForm.provinceValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.provinceValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="支队（市）" prop="cityCondition" class="clearfix">
            <el-radio-group v-model="allocateForm.cityCondition">
              <el-radio :label="1">无要求</el-radio>
              <el-radio :label="2">按相关规定配</el-radio>
              <el-radio :label="3">设定数量</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.cityCondition===3">
              <el-input v-model="allocateForm.cityValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.cityValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="大队（区县）" prop="areaCondition">
            <el-radio-group v-model="allocateForm.areaCondition">
              <el-radio :label="1">无要求</el-radio>
              <el-radio :label="2">按相关规定配</el-radio>
              <el-radio :label="3">设定数量</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.areaCondition===3">
              <el-input v-model="allocateForm.areaValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.areaValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="配备类型" prop="allocateType">
            <el-select v-model="allocateForm.allocateType" clearable filterable placeholder="请选择">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.orgName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新年限" prop="updateYear">
            <el-input-number v-model.trim="allocateForm.updateYear" :min="1" :max="99"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="计量单位" prop="unitType">
            <el-select v-model="allocateForm.unitType" clearable filterable placeholder="请选择">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.orgName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示次序" prop="allocateIndex">
            <el-input-number v-model.trim="allocateForm.allocateIndex" :min="1" :max="999"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明" prop="remark">
            <el-input v-model="allocateForm.remark" type="textarea" auto-complete="off" maxlength="500" :autosize="{minRows: 2, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center" style="margin:14px 0 5px;">
          <el-button size="mini" @click="handleCancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
          <el-button size="mini" @click="handleSave('allocateForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'equippedProject',
  data() {
    return {
      formLoading: false,
      orgOptions: [],
      allocateForm: {
        citys: [],
        JGMC: '',
        ZBSL: '',
        ZBLX: '',
        MS: ''
      },
      loading: false,
      optionsZblx: [],
      options: [],
      rules: {
        groupId: [
          { required: true, message: '请选择装备分类', trigger: 'change' }
        ],
        allocateName: [
          { required: true, message: '请选择配备项目', trigger: 'change' }
        ],
        provinceCondition: [
          { required: true, message: '请选择总队（省）', trigger: 'change' }
        ],
        cityCondition: [
          { required: true, message: '请选择支队（市）', trigger: 'change' }
        ],
        areaCondition: [
          { required: true, message: '请选择大队（区县）', trigger: 'change' }
        ],
        allocateType: [
          { required: true, message: '请选择配备类型', trigger: 'change' }
        ],
        unitType: [
          { required: true, message: '请选择计量单位', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          var param = JSON.parse(JSON.stringify(this.departmentForm))
          if (this.departmentForm.administrative && this.departmentForm.administrative.length > 0) {
            param.provinceCode = this.departmentForm.administrative[0]
            param.cityCode = this.departmentForm.administrative[1] || ''
            param.reginCode = this.departmentForm.administrative[2] || ''
            param.administrative = this.departmentForm.administrative[this.departmentForm.administrative.length - 1] // 为最后一级的code
          }
          param.userId = this.userInfo.id
          // console.log(param)
          this.formLoading = true
          this.$update('hsyzdepart/' + this.carryParam.deptId, param, 'upms').then((response) => {
            this.formLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '装备信息保存成功', type: 'success'
              })
              // 停留2秒跳转到详情页面
              setTimeout(() => {
                // this.$router.push({ path: '/basicService/deptInfo/detail' })
              }, 2000)
            } else {
              this.$message({
                message: '装备信息保存失败，请联系管理员！', type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              message: '装备信息保存失败，请联系管理员！', type: 'error'
            })
            this.formLoading = false
          })
        }
      })
    },
    toList() {
      this.$router.push({
        path: '/basic/equip'
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleCancel() {
      this.$confirm('是否要放弃编辑的装备信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 调父页面的关闭弹框的方法 刷新列表页面
        this.resetForm('allocateForm')
        this.$emit('closeDia', '1')
      }).catch(() => {
        // 留在编辑页面
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
      this.allocateForm.citys = []
      if (this.allocateForm.SSXQ) {
        const prov = this.allocateForm.SSXQ.split('|')
        const province = this.getCityByName(this.options, prov[0])
        this.allocateForm.citys.push(province.cityCode)
        if (prov[1]) {
          const city = this.getCityByName(province.children, prov[1])
          this.allocateForm.citys.push(city.cityCode)
          if (prov[2]) {
            const county = this.getCityByName(city.children, prov[2])
            this.allocateForm.citys.push(county.cityCode)
          }
        }
      }
    },
    detail() {
      this.loading = true
      // const para = {
      //   id: this.allocateForm.id
      // }
      // getAjCheckOrganizationOne(para).then((response) => {
      //   response.data.enable = response.data.enable ? '1' : '0'
      //   this.form = response.data
      //   this.setCitys()
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    cityTree() {

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

<style rel="stylesheet/scss" lang="scss">
.equipProject {
  width: 94%;
  margin: 10px auto 0;
  .el-select,
  .el-input,
  .el-input-number {
    width: 100%;
  }
  .el-radio + .el-radio {
    margin-left: 40px;
  }
}
.deptSetNumWrap {
  float: right;
  .deptSetNumInput {
    width: 80px;
  }
}
</style>
