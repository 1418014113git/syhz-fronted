<template>
  <div class="ServiceInfo" style="padding-bottom: 30px;">
    <el-form :model="serviceInfo" ref="serverInfoForm" :rules="rules" size="small"  label-width="200px">
      <el-row>
        <el-form-item label="信息分类：" prop="type">
          <el-select v-model="serviceInfo.type" placeholder="请选择">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="账户信息：" prop="zh">
          <el-input v-model="serviceInfo.zh" auto-complete="off" maxlength="50" style="width: 300px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="昵称：" prop="nc">
          <el-input v-model="serviceInfo.nc" auto-complete="off" maxlength="20" style="width: 300px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="serviceInfo.type==='3'" label="运营商：" prop="lxmc">
          <el-select v-model="serviceInfo.lxmc" placeholder="请选择">
            <el-option label="移动" value="移动"></el-option>
            <el-option label="联通" value="联通"></el-option>
            <el-option label="电信" value="电信"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="serviceInfo.type==='7'" label="银行类型：" prop="lxmc">
          <el-input v-model="serviceInfo.lxmc" auto-complete="off" maxlength="100" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item v-else label="所在网站或分类：" prop="lxmc">
          <el-input v-model="serviceInfo.lxmc" auto-complete="off" maxlength="100" style="width: 400px"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="padding-right: 50px; text-align: right;">
          <el-button type="primary" :loading="submitLoading" @click="saveData">提交</el-button>
          <el-button type="danger" @click="doRemove" v-if="len > 1">删除</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {
    getFwlx
  } from '@/utils/codetotext'
  export default {
    name: 'ServiceInfo',
    props: ['beanInfo', 'len', 'index', 'personId'],
    data() {
      return {
        submitLoading: false,
        serviceInfo: {},
        types: getFwlx(),
        rules: {
          rules: {
            type: [
              { required: true, message: '请选择服务分类', trigger: ['blur', 'change'] }
            ],
            zh: [
              { required: true, message: '请输入账户信息', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      saveData() {
        let valided = false
        this.$refs.serverInfoForm.validate(valid => {
          if (valid) { valided = true }
        })
        if (!valided) { return false }
        if (!this.personId) {
          this.$message({ message: '请先提交人员信息', type: 'warning' })
          return false
        }
        this.serviceInfo.personId = this.personId
        this.submitLoading = true
        if (this.serviceInfo.id) {
          this.$update('personnmserviceinfo/' + this.serviceInfo.id, this.serviceInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '修改成功', type: 'success' })
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$save('personnmserviceinfo', this.serviceInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '提交成功', type: 'success' })
              this.serviceInfo.id = response.data
            }
          }).catch(() => {
            this.submitLoading = false
          })
        }
      },
      doRemove() {
        if (this.serviceInfo.id) {
          this.$remove('personnmserviceinfo/' + this.serviceInfo.id, {}).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '删除成功', type: 'success' })
              this.$emit('doDelService', this.serviceInfo.tempId)
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$emit('doDelService', this.serviceInfo.tempId)
        }
      }
    },
    mounted() {
      if (this.beanInfo) {
        this.serviceInfo = this.beanInfo
      }
    }
  }
</script>

<style scoped>
  .ServiceInfo {
    padding: 10px 0;
  }
</style>
