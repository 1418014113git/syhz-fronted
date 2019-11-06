<template>
  <section class="deptWrap">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card style="margin-top:10px;">
      <!-- <div slot="header">
        <span>督办批次发布</span>
      </div> -->
      <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="departmentForm" ref="departmentForm" :rules="rules" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="11">
          <el-form-item label="标题" prop="departName">
            <el-input type="text" size="small" v-model.trim="departmentForm.departName" clearable placeholder="请输入" maxlength="50" ></el-input>
          </el-form-item>
          <el-form-item label="开始日期" prop="departLevel" class="clearfix">
            <el-date-picker v-model="departmentForm.foundingTime" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="dateChange" class="left" ></el-date-picker>
          </el-form-item>
          <el-form-item label="督办级别" prop="compileNum" class="clearfix">
            <el-input type="text" size="small" v-model.trim="departmentForm.compileNum" clearable placeholder="请输入" maxlength="3"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所属行政区划" prop="administrative" class="xzqhWrap">
            <el-cascader
              :options="administrativeData"
              v-model="departmentForm.administrative"
              placeholder="请选择行政区划"
              change-on-select
              @change="areaChange"
              :disabled="true"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="成立时间" prop="foundingTime" class="clearfix">
            <el-date-picker v-model="departmentForm.foundingTime" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="dateChange" class="left" ></el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="linkmanPhone" class="clearfix">
            <el-input type="text" v-model="departmentForm.linkmanPhone" clearable placeholder="请输入" maxlength="11" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainLeader" class="clearfix">
            <el-input type="text" v-model.trim="departmentForm.mainLeader" clearable placeholder="请输入" maxlength="20" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="日常联系人" prop="dailyLeader" class="clearfix">
            <el-input type="text" v-model.trim="departmentForm.dailyLeader" clearable placeholder="请输入" maxlength="20" class="left" ></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="文号" prop="departCode" class="clearfix">
            <el-input type="text" v-model.trim="departmentForm.departCode" clearable placeholder="请输入" maxlength="50" class="left" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="截止日期" prop="mainAssignment" class="clearfix">
            <el-date-picker v-model="departmentForm.foundingTime" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="dateChange" class="left" ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="机构设置模式" prop="designMode">
            <el-select v-model="departmentForm.designMode" placeholder="请选择" >
              <el-option v-for="item in $getDicts('jgszms')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item> -->
        </el-col>
        <el-col :span="24">
          <el-form-item label="提醒时限" class="clearfix" prop="remark">
            截至日期前 <el-input-number v-model.trim="departmentForm.designMode" :min="1" :max="999"></el-input-number> 天提醒督办申请单位提交结案报告
          </el-form-item>
          <el-form-item label="正文" class="clearfix" prop="remark">
            <el-input type="textarea" :rows="2" v-model.trim="departmentForm.remark" maxlength="500" placeholder="最多可输入500文字！"></el-input>
          </el-form-item>
          <el-form-item label="附件" class="clearfix" prop="remark">
            <el-input type="textarea" :rows="2" v-model.trim="departmentForm.remark" maxlength="500" placeholder="最多可输入500文字！"></el-input>
          </el-form-item>
          <el-form-item label="督办案件" class="clearfix" prop="remark">
            <div class="clearfix">
              <el-select v-model="departmentForm.departLevel" placeholder="请选择" class="left" style="width:80%">
                <el-option v-for="item in $getDicts('zyzz')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
              </el-select>
              <el-button size="mini" @click="cancel()" class="right">加入列表</el-button>
            </div>
            <el-table :data="dbData" style="width: 100%;" :max-height="tableHeight">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="案件名称" min-width="10%"></el-table-column>
              <el-table-column label="案件编号" min-width="10%">
                <template slot-scope="scope">
                  <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJBH}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="AJLB_NAME" label="案件类别" min-width="10%"></el-table-column>
              <el-table-column prop="AJLB_NAME" label="案件状态" min-width="10%"></el-table-column>
              <el-table-column prop="AJLB_NAME" label="涉案价值" min-width="10%"></el-table-column>
              <el-table-column prop="AJLB_NAME" label="申请单位" min-width="10%"></el-table-column>
              <el-table-column prop="AJLB_NAME" label="操作" min-width="10%">
                <template slot-scope="scope">
                  <el-button title="详情" size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)" icon="el-icon-tickets" circle></el-button>
                  <el-button title="修改" size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center" style="margin-bottom:10px;">
          <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">保存</el-button>
          <el-button size="mini" @click="cancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
          <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">发布</el-button>
        </el-col>
      </el-form>
      <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>
import { regCode } from '@/utils/validate'
// import { getTree } from '@/api/dept'

export default {
  name: 'add',
  data() {
    return {
      departmentForm: {
        administrative: [] // 行政区划
      }, // 机构信息
      formLoading: false, // 表单loading
      carryParam: {}, // 列表带过来的参数
      administrativeData: [], // 行政区划
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      dbData: [],
      tableHeight: 400,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        departName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构全称'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        departCode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构代码'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        departLevel: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择机构级别'))
            } else {
              callback()
            }
          }
        }],
        mainAssignment: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入主要职责任务'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        compileNum: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^[1-9]{1}\d{0,2}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入编制人数'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的编制人数'))
            }
          }
        }],
        administrative: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '' || value === []) {
              callback(new Error('请选择所属行政区划'))
            } else {
              callback()
            }
          }
        }],
        address: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构详细地址'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        foundingTime: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择成立时间'))
            } else {
              callback()
            }
          }
        },
        postcode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^[0-9]{6}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入邮编'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入6位数字'))
            }
          }
        }],
        linkmanPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^1[3|4|5|6|7|8]\d{9}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入联系电话'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的手机号码'))
            }
          }
        }],
        faxNumber: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^(\d{3,4}-)?\d{7,8}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入传真号码'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的传真号码'))
            }
          }
        }],
        mainLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入主要负责人'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        subofficeLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入分管局领导'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        dailyLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入日常联系人'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        designMode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择机构设置模式'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    areaChange(val) { // 行政区划 change事件
      if (val.length > 1) {
        var curCityCode = val[1]
        for (let index = 0; index < this.administrativeData[0].children.length; index++) {
          const element = this.administrativeData[0].children[index]
          if (curCityCode === element.cityCode) {
            this.departmentForm.areaName = element.cityName
            break
          }
        }
      } else {
        this.departmentForm.areaName = ''
      }
    },
    init() {
      // 盟市
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.administrativeData = response.data ? response.data : []
          if (this.carryParam.deptId) {
            // 列表进来的
          } else {
            // 首页进来的
            this.carryParam.deptId = this.deptInfo.id // 将当前机构的id 放到 this.carryParam.deptId
          }
          this.queryDetailById() // 查详情
        }
      })
    },
    queryDetailById() { // 通过id查询详情
      this.formLoading = true
      this.departmentForm.openDepts = []
      this.$query('hsyzdepart/' + this.carryParam.deptId, {}, 'upms').then((response) => {
        this.formLoading = false
        if (response.code === '000000') {
          this.departmentForm = response.data
          if (this.departmentForm.departLevel) { // 机构级别
            this.departmentForm.departLevel = this.departmentForm.departLevel + ''
          }
          if (this.departmentForm.designMode) { // 设置模式
            this.departmentForm.designMode = this.departmentForm.designMode + ''
          }

          this.departmentForm.administrative = [] // 行政区划
          if (response.data.provinceCode) { // 省
            this.departmentForm.administrative.push(response.data.provinceCode)
          }
          if (response.data.cityCode) { // 市
            this.departmentForm.administrative.push(response.data.cityCode)
          }
          if (response.data.reginCode) { // 区
            this.departmentForm.administrative.push(response.data.reginCode)
          }
          if (this.departmentForm.administrative.length > 0) {
            this.areaChange(this.departmentForm.administrative)
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    dateChange(val) {
      if (val) {
        // this.startPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'start')
      } else {
        // this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    cancel() { // 取消
      this.$confirm('是否要放弃编辑机构信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到详情画面
        this.$router.push({ path: '/basicService/deptInfo/detail', query: { deptId: this.carryParam.deptId }})
      }).catch(() => {
        // 留在编辑页面
      })
    },
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
                message: '机构信息保存成功', type: 'success'
              })
              // 停留2秒跳转到详情页面
              setTimeout(() => {
                this.$router.push({ path: '/basicService/deptInfo/detail' })
              }, 2000)
            } else {
              this.$message({
                message: '机构信息保存失败，请联系管理员！', type: 'success'
              })
            }
          }).catch(() => {
            this.$message({
              message: '机构信息保存失败，请联系管理员！', type: 'success'
            })
            this.formLoading = false
          })
        }
      })
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    // this.init()
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.deptWrap {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 40px 40px 20px;
  }
  .el-select,
  .el-input,
  .el-cascader {
    width: 100%;
  }
  .el-cascader__label {
    font-size: 15px;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .clearfix:after {
    clear: both;
    content: "";
    display: block;
  }
  .el-collapse-item__content {
    padding: 0 20px;
  }
  .xzqhWrap .el-cascader__label {
    cursor: not-allowed;
  }
}
</style>
