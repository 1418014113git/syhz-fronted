<template>
  <el-form ref="form" :model="caseInfo" label-width="200px" :inline="true" size="small" class="demo-form-inline" @submit.prevent="onSubmit">
    <el-col :span="8">
      <el-form-item label="作案形式">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="选择处所">
        <el-input v-model="caseInfo.name" class="inputw400" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="特殊手段">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="销赃方式">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="是否涉网">
        <el-select v-model="caseInfo.unitCase" placeholder="请选择">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="选择时机">
        <el-input v-model="caseInfo.name" class="inputw400" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="选择物品">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="作案特点">
        <el-input v-model="caseInfo.name" class="inputw400" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="勾结形式">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="选择对象">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="作案手段">
        <el-input v-model="caseInfo.name" class="inputw400" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="作案工具">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="作案渠道">
        <el-input v-model="caseInfo.solveUnit" maxlength="30"></el-input>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
  export default {
    name: 'CrimeFeature',
    data() {
      return {
        caseInfo: {
          name: '',
          unitName: '',
          scene: '',
          caseNumber: 0,
          date: '',
          crimeSubjectType: '',
          captureNumber: 0,
          unitType: [],
          informant: '',
          unitCase: '',
          concernForeign: '',
          solveUnit: '',
          reason: '',
          desc: ''
        }
      }
    }
  }
</script>

<style scoped>
</style>
