<template>
  <div class="classRoom_integralSet">
    <el-card class="caseEdit">
      <p><strong>积分规则设置</strong></p>
      <el-form :model="ruleForm" ref="ruleForm" :inline="true" :rules="rules">
        <el-row type="flex" justify="center" style="margin-top:15px;">
          <el-table :data="ruleForm.ruleList" style="width: 100%;">
            <el-table-column align="center" prop="ruleName" width="260px" label="积分方式"></el-table-column>
            <el-table-column align="center" prop="ruleDescribe" label="积分要求">
              <template slot-scope="scope">
                <span v-if="scope.row.ruleDescribe.indexOf('*') > -1">
                  {{scope.row.ruleDescribe.split('*')[0]}}
                  <el-form-item :prop="'ruleList.' + scope.$index + '.ruleTime1'" :rules='rules.ruleTime1'>
                    <el-input v-model="scope.row.ruleTime1" type="number" min="1" max="60" style="width: 100px;"></el-input>
                  </el-form-item>
                  分钟
                </span>
                <span v-else>{{scope.row.ruleDescribe.replace('*', (scope.row.ruleTime1 + '分钟')) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="oneNumber" label="单次积分" width="260px">
              <template slot-scope="scope">
                  <el-form-item :prop="'ruleList.' + scope.$index + '.oneNumber'" :rules='rules.oneNumber'>
                    <el-input v-model="scope.row.oneNumber" type="number"  min="1" max="9" style="width: 100px;"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="maxNumber" label="每日最多积分" width="260px">
              <template slot-scope="scope">
                  <el-form-item :prop="'ruleList.' + scope.$index + '.maxNumber'" :rules='rules.maxNumber'>
                    <el-input v-model="scope.row.maxNumber" type="number"  min="1" max="99" style="width: 100px;"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top:15px;">
          <el-button type="primary" @click="add" class="saveBtn" v-loading.fullscreen.lock="loading">保 存</el-button>
          <el-button @click="callback" class="cancelBtn">取 消</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getConfig } from '@/api/trainRuleConfig'
  export default {
    data() {
      return {
        loading: false,
        configList: [],
        ruleForm: {
          ruleList: []
        },
        rules: {
          ruleTime1: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('学习时长不能为空'))
              }
              if (value === 0) {
                return callback(new Error('学习时长不能输入0'))
              }
              if (!/^([1-9]|[1-5][0-9]|60)$/.test(value)) {
                return callback(new Error('单次积分只支持输入1~60的正整数'))
              }
              if (value.length > 2) {
                return callback(new Error('学习时长最多可输入2位数字'))
              }
              return callback()
            }
          }],
          oneNumber: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('单次积分不能为空'))
              }
              if (value === 0) {
                return callback(new Error('单次积分不能输入0'))
              }
              if (!/^[1-9]$/.test(value)) {
                return callback(new Error('单次积分只支持输入1~9的正整数'))
              }
              if (value.length > 1) {
                return callback(new Error('每单次积分最多可输入1位数字'))
              }
              return callback()
            }
          }],
          maxNumber: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('每日最多积分不能为空'))
              }
              if (value === 0) {
                return callback(new Error('每日最多积分不能输入0'))
              }
              if (!/^([1-9]|[1-9][0-9])$/.test(value)) {
                return callback(new Error('每日最多积分只支持输入1~99的正整数'))
              }
              if (value.length > 2) {
                return callback(new Error('每日最多积分最多可输入2位数字'))
              }
              const arr = rule.field.split('.')
              const index = arr[1]
              const lineOne = this.ruleForm.ruleList[index].oneNumber
              if (lineOne > value) {
                return callback(new Error('每日最多积分不能小于单次积分'))
              } else if (value % lineOne !== 0) {
                return callback(new Error('每日最多积分数必须为单次积分整数倍'))
              }
              return callback()
            }
          }]
        }
      }
    },
    methods: {
      queryConfig() {
        this.loading = true
        getConfig({}).then((response) => {
          this.loading = false
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            item.ruleId = item.id
            if (item.ruleType === 4) {
              item.ruleTime1 = item.ruleTime / 60
            }
          }
          this.ruleForm.ruleList = data
        })
      },
      add() {
        this.loading = true
        let flag1 = false
        this.$refs.ruleForm.validate(valid => {
          flag1 = valid
        })
        if (flag1) {
          const data = JSON.parse(JSON.stringify(this.ruleForm))
          for (let i = 0; i < data.ruleList.length; i++) {
            const item = data.ruleList[i]
            if (item.ruleType === 4) {
              item.ruleTime = item.ruleTime1 * 60
            }
          }
          this.$update('trainruleconfig/1', data).then(response => {
            this.loading = false
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.$router.go(0)
          })
        }
      },
      callback() {
        this.$router.go(0)
        // this.$router.push({ path: '/micro/integralSet' })
      }
    },
    mounted() {
      this.queryConfig()
    }
  }
</script>
<style>
  .classRoom_integralSet p{
    margin-top: 10px;
  }
  .classRoom_integralSet p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_integralSet p strong{
    margin-right: 20px;
    font-size: 18px;
  }
  .classRoom_integralSet .el-form-item__label{
    padding: 0;
    margin-right: -30px;
  }
  .classRoom_integralSet .el-form-item--small .el-form-item__error{
    width: 240px;
  }
  .classRoom_integralSet .el-table_1_column_2 .el-form-item__error{
    width: 240px;
    text-align: left;
  }
</style>
