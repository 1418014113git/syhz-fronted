<template>
  <div class="CarInfo" style="padding-bottom: 30px;">
    <el-form :model="beanInfo" ref="carInfoForm" :rules="rules" size="small"  label-width="140px"> <!--:rules="rules"-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆品牌：" prop="clpp">
            <el-input v-model="beanInfo.clpp" auto-complete="off" maxlength="20" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="号牌号码：" prop="hphm">
            <el-input v-model="beanInfo.hphm" auto-complete="off" maxlength="10" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="号牌种类：" prop="hpzl">
            <el-select v-model="beanInfo.hpzl" placeholder="请选择" @change="hpzlChange">
              <el-option
                v-for="(item,index) in hpzlList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆型号：" prop="clxh">
            <el-input v-model="beanInfo.clxh" auto-complete="off" maxlength="20" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否抵押：" prop="dydj">
            <el-radio v-model="beanInfo.dydj" label="0">未抵押</el-radio>
            <el-radio v-model="beanInfo.dydj" label="1">已抵押</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号：" prop="fdjh">
            <el-input v-model="beanInfo.fdjh" auto-complete="off" maxlength="30" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发动机序号：" prop="fdjxh">
            <el-input v-model="beanInfo.fdjxh" auto-complete="off" maxlength="30" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发证机关：" prop="fzjg">
            <el-select v-model="beanInfo.fzjg" filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in fzjgList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆识别号：" prop="clsbdh">
            <el-input v-model="beanInfo.clsbdh" auto-complete="off" maxlength="50" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车身颜色：" prop="csys">
            <el-select v-model="beanInfo.csys" placeholder="请选择">
              <el-option
                v-for="(item,index) in csysList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证明号码：" prop="sfzmhm">
            <el-input v-model="beanInfo.sfzmhm" auto-complete="off" maxlength="20" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证明名称：" prop="sfzmmc">
            <el-select v-model="beanInfo.sfzmmc" placeholder="请选择">
              <el-option
                v-for="item in sfzmmcList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机动车所有人：" prop="syr">
            <el-input v-model="beanInfo.syr" auto-complete="off" maxlength="20" class="inputw80"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机动车状态：" prop="zt">
            <el-select v-model="beanInfo.zt" placeholder="请选择">
              <el-option
                v-for="item in jdcztsList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="padding-right: 50px; text-align: right;">
        <el-button type="primary" :loading="submitLoading" @click="saveData()">提交</el-button>
        <el-button type="danger" @click="doRemove" v-if="len > 1">删除</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {
    getCarStatus, getSfzmmc, getCsys, getHpzl
  } from '@/utils/codetotext'
  import {
    getFzjg
  } from '@/utils/fzjgList'
  export default {
    name: 'CarInfo',
    props: ['beanInfo', 'len', 'index', 'personId'],
    data() {
      return {
        submitLoading: false,
        jdcztsList: getCarStatus(),
        hpzlList: getHpzl(),
        sfzmmcList: getSfzmmc(),
        csysList: getCsys(),
        fzjgList: getFzjg(),
        rules: {
          hphm: [
            { required: true, message: '请输入号牌号码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      saveData() {
        let valided = false
        this.$refs.carInfoForm.validate(valid => {
          if (valid) { valided = true }
        })
        if (!valided) { return false }
        if (!this.personId) {
          this.$message({ message: '请先提交人员信息', type: 'warning' })
          return false
        }
        this.beanInfo.personId = this.personId
        this.submitLoading = true
        if (this.beanInfo.id) {
          this.$update('personnmcar/' + this.beanInfo.id, this.beanInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '修改成功', type: 'success' })
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$save('personnmcar', this.beanInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '提交成功', type: 'success' })
              this.beanInfo.id = response.data
            }
          }).catch(() => {
            this.submitLoading = false
          })
        }
      },
      doRemove() {
        if (this.beanInfo.id) {
          this.$remove('personnmcar/' + this.beanInfo.id, {}).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '删除成功', type: 'success' })
              this.$emit('doDelCar', this.beanInfo.tempId)
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$emit('doDelCar', this.beanInfo.tempId)
        }
      },
      hpzlChange(val) { // 号牌种类
        let obj = {}
        obj = this.hpzlList.find((item) => {
          return item.value === val
        })
        this.beanInfo.hpzlName = obj.label
      }
    },
    mounted() {
      if (this.beanInfo) {
        if (this.beanInfo.sfzmhm) {
          this.beanInfo.sfzmmc = 'A'
        }
      }
    }
  }
</script>

<style scoped>
  .CarInfo {
    padding: 10px 0;
  }
  .CarInfo .inputw80 {
    width: 80%;
  }
</style>

