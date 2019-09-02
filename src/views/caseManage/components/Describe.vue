<template>

  <el-form ref="form" :model="caseInfo" label-width="200px" :inline="true" size="small" class="demo-form-inline" @submit.prevent="onSubmit">
    <el-col :span="8">
      <el-form-item label="案件名称">
        <el-input v-model="caseInfo.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="发案单位名称">
        <el-input v-model="caseInfo.unitName" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="是否有现场">
        <el-select v-model="caseInfo.scene" placeholder="请选择">
          <el-option label="绝密" value="绝密"></el-option>
          <el-option label="机密" value="机密"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作案人数">
        <el-input v-model="caseInfo.caseNumber" maxlength="30"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="报案时间">
        <el-date-picker type="date" placeholder="选择日期" v-model="caseInfo.date" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="发案单位类型">
        <el-select v-model="caseInfo.unitType" placeholder="请选择">
          <el-option label="绝密" value="绝密"></el-option>
          <el-option label="机密" value="机密"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="犯罪主体类型">
        <el-input v-model="caseInfo.crimeSubjectType" class="inputw400" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="抓获人数">
        <el-input v-model="caseInfo.captureNumber" maxlength="30"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="报案人">
        <el-input v-model="caseInfo.informant" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="是否单位作案">
        <el-select v-model="caseInfo.unitCase" placeholder="请选择">
          <el-option label="绝密" value="绝密"></el-option>
          <el-option label="机密" value="机密"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否涉外">
        <el-select v-model="caseInfo.concernForeign" placeholder="请选择">
          <el-option label="绝密" value="绝密"></el-option>
          <el-option label="机密" value="机密"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="破案单位">
        <el-input v-model="caseInfo.solveUnit" maxlength="30"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="作案原因">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="caseInfo.reason" maxlength="200"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="简要案情" class="long-width">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="caseInfo.desc" maxlength="200"></el-input>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
    export default {
      name: 'Describe',
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
