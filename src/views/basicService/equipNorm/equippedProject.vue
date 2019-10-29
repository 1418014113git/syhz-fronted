<template>
  <section class="equipProject">
    <el-form :model="allocateForm" ref="allocateForm" size="small" :rules="rules" label-width="120px" v-loading="formLoading">
      <el-row>
        <el-col :span="24">
          <el-form-item label="装备分类" prop="groupId">
            <el-select v-model="allocateForm.groupId" clearable filterable placeholder="请选择" :disabled="equipItem.id?true:false">
              <el-option v-for="item in classifyOptions" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配备项目" prop="allocateName">
            <el-input v-model="allocateForm.allocateName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="总队（省）" prop="provinceCondition">
            <el-radio-group v-model="allocateForm.provinceCondition">
              <el-radio  v-for="(item,index) in equipCondition" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.provinceCondition===3">
              <el-input v-model="allocateForm.provinceValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.provinceValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="支队（市）" prop="cityCondition" class="clearfix">
            <el-radio-group v-model="allocateForm.cityCondition">
              <el-radio  v-for="(item,index) in equipCondition" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.cityCondition===3">
              <el-input v-model="allocateForm.cityValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.cityValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="大队（区县）" prop="areaCondition">
            <el-radio-group v-model="allocateForm.areaCondition">
              <el-radio  v-for="(item,index) in equipCondition" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            <div class="deptSetNumWrap" v-if="allocateForm.areaCondition===3">
              <el-input v-model="allocateForm.areaValue1" class="deptSetNumInput"></el-input>&nbsp;&nbsp;/&nbsp;&nbsp;<el-input v-model="allocateForm.areaValue2" class="deptSetNumInput"></el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="配备类型" prop="allocateType">
            <el-select v-model="allocateForm.allocateType" clearable filterable placeholder="请选择">
              <el-option v-for="item in $getDicts('zblx')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新年限" prop="updateYear">
            <el-input-number v-model.trim="allocateForm.updateYear" :min="1" :max="99"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="计量单位" prop="unitType">
            <el-select v-model="allocateForm.unitType" clearable filterable placeholder="请选择">
              <el-option v-for="item in $getDicts('zbjl')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
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
import { regCn } from '@/utils/validate'
export default {
  name: 'equippedProject',
  props: {
    equipItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formLoading: false,
      classifyOptions: [], // 装备分类的数据源
      orgOptions: [],
      allocateForm: {}, // 表单信息
      loading: false,
      options: [],
      equipCondition: [{ value: 1, label: '无要求' }, { value: 2, label: '按相关规定配' }, { value: 3, label: '设定数量' }], // 不同部门配备的设置
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        groupId: [
          { required: true, message: '请选择装备分类', trigger: 'change' }
        ],
        allocateName: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入配备项目'))
            } else if (!(regCn.test(value))) {
              callback(new Error('请输入汉字'))
            } else {
              this.formLoading = true
              var para = { allocateName: value }
              if (this.allocateForm.id) {
                para.id = this.allocateForm.id
              }
              this.$query('equipgroup', para).then((response) => {
                this.formLoading = false
                if (response.data && response.data.length > 0) {
                  callback(new Error('项目 ' + value + ' 已添加，请确认后重试！'))
                } else {
                  callback()
                }
              }).catch(() => {

              })
            }
          } }
        ],
        provinceCondition: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('请选择总队（省）'))
              } else if (value === 3) {
                if (this.allocateForm.provinceValue1 && this.allocateForm.provinceValue2) {
                  callback()
                } else {
                  callback(new Error('请填写设定数量，须为数字'))
                }
              } else {
                callback()
              }
            }
          }
        ],
        cityCondition: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('请选择支队（市）'))
              } else if (value === 3) {
                if (this.allocateForm.cityValue1 && this.allocateForm.cityValue2) {
                  callback()
                } else {
                  callback(new Error('请填写设定数量，须为数字'))
                }
              } else {
                callback()
              }
            }
          }
        ],
        areaCondition: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('请选择大队（区县）'))
              } else if (value === 3) {
                if (this.allocateForm.areaValue1 && this.allocateForm.areaValue2) {
                  callback()
                } else {
                  callback(new Error('请填写设定数量，须为数字'))
                }
              } else {
                callback()
              }
            }
          }
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
  watch: {
    equipItem: {
      immediate: true,
      handler(val) {
        console.log('watch:' + JSON.stringify(val))
        this.allocateForm = JSON.parse(JSON.stringify(val)) || {}
        if (val) {
          this.initData()
        }
      }
    }
  },
  methods: {
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = JSON.parse(JSON.stringify(this.allocateForm))
          this.formLoading = true
          if (this.equipItem.id) { // 编辑
            param.lastId = this.userInfo.id
            param.lastName = this.userInfo.userName // 用户名
            this.$update('basicEquipAllocate/' + this.equipItem.id, param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '装备信息保存成功', type: 'success'
                })
                // 停留2秒跳转到详情页面
                setTimeout(() => {
                  this.$emit('closeDia', '1')
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
          } else { // 添加
            param.creationId = this.userInfo.id
            param.creationName = this.userInfo.userName // 用户名
            param.enabled = 1 // 默认启用
            this.$save('basicEquipAllocate', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '装备信息保存成功', type: 'success'
                })
                // 停留2秒跳转到详情页面
                setTimeout(() => {
                  this.$emit('closeDia', '1')
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
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
        this.allocateForm = {}
      }
    },
    handleCancel() {
      this.$confirm('是否要放弃编辑的装备信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 调父页面的关闭弹框的方法 刷新列表页面
        // this.resetForm('allocateForm')
        this.$emit('closeDia', '1')
      }).catch(() => {
        // 留在编辑页面
      })
    },
    initData() {
      this.formLoading = true
      this.$query('basicequipgroup', {}).then((response) => {
        this.formLoading = false
        if (response.data) {
          this.classifyOptions = response.data
        }
      }).catch(() => {
        this.classifyOptions = []
        this.formLoading = false
      })
      if (this.equipItem.unitType) {
        this.allocateForm.unitType = this.allocateForm.unitType + ''
      }
      if (this.equipItem.allocateType) {
        this.allocateForm.allocateType = this.allocateForm.allocateType + ''
      }
    }

  },
  mounted() {
    console.log('mounted:' + JSON.stringify(this.equipItem))
    if (this.equipItem) {
      this.allocateForm = this.equipItem
      this.initData()
    }
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
