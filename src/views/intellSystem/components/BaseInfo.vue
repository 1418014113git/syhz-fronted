<template>
  <div class="BaseInfo">
    <el-form :model="personInfo" ref="baseForm" :rules="rules" size="small"  label-width="120px"> <!--:rules="rules"-->
      <el-row>
        <el-col :span="5" style="padding: 0 15px">
          <img :src="'data:image/jpeg;base64,'+personInfo.xp" width="100%" v-if="personInfo.xp"
               style="margin: 0 auto; border: 1px dashed #d9d9d9; min-height: 300px; border-radius: 6px;"/>
          <img :src="'data:image/jpeg;base64,'" width="100%" v-else
               style="margin: 0 auto; border: 1px dashed #d9d9d9; width: 100%; min-height: 300px; border-radius: 6px;"/>
        </el-col>
        <el-col :span="19">
          <el-row>
            <el-col :span="7">
              <el-form-item label="姓名：" prop="xm">
                <el-input v-model="personInfo.xm" auto-complete="off" :disabled="inputEnable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号码：" prop="gmsfhm">
                <el-input v-model="personInfo.gmsfhm" auto-complete="off" :disabled="inputEnable" maxlength="18"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="性别：" prop="xb">
                <el-radio v-model="personInfo.xb" v-for="item in getXBSelectList" :label="item.value" :key="item.value" :disabled="inputEnable">{{item.label}}</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出生日期：" prop="csrq">
                <el-date-picker size="small" type="date" v-model="personInfo.csrq" class="inputw80"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="inputEnable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族：" prop="mz">
                <el-select size="small" v-model="personInfo.mz" placeholder="请选择民族" @change="MZSelectChange" :disabled="inputEnable" class="inputw80">
                  <el-option v-for="item in getMZSelectList" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="婚姻状况：" prop="hyzk">
                <el-select size="small" v-model="personInfo.hyzk" @change="HYZKSelectChange" :disabled="inputEnable" class="inputw80">
                  <el-option v-for="item in getHYZKSelectList" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文化程度：" prop="whcd">
                <el-select size="small" v-model="personInfo.whcd" placeholder="请选择文化程度" @change="WHCDSelectChange" :disabled="inputEnable" class="inputw80">
                  <el-option v-for="item in getWHCDSelectList" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职业类别：" prop="zylb">
                <el-select size="small" filterable v-model="personInfo.zylb" @change="ZYLBSelectChange" :disabled="inputEnable" class="inputw80">
                  <el-option v-for="item in getZYLBSelectList" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="宗教信仰：" prop="zjxy">
                <el-select size="small" filterable v-model="personInfo.zjxy" @change="ZJXYSelectChange" :disabled="inputEnable" class="inputw80">
                  <el-option v-for="item in getZJXYSelectList" :label="item.label" :value="item.value"
                             :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="籍贯区划：" prop="jgssxqMc">
              <el-input v-model="personInfo.jgssxqMc" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" :disabled="inputEnable" class="inputw80"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="出生地区区划：" prop="csdssxqMc">
              <el-input v-model="personInfo.csdssxqMc" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" :disabled="inputEnable" class="inputw80"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="padding-right: 50px; text-align: right;">
            <el-button type="primary" v-if="inputEnable" @click="doEditInfo">编辑</el-button>
            <el-button type="primary" v-else :loading="submitLoading" @click="saveData">提交</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {
    getMZSelect, getWHCDSelect, getHYZKSelect, getZYLBSelect, getXBSelect, getZjxy
  } from '@/utils/codetotext'
  export default {
    name: 'BaseInfo',
    props: ['person'],
    data() {
      return {
        submitLoading: false,
        inputEnable: true,
        getMZSelectList: getMZSelect(), // 民族
        getWHCDSelectList: getWHCDSelect(), // 文化程度
        getHYZKSelectList: getHYZKSelect(), // 婚姻状况
        getZYLBSelectList: getZYLBSelect(), // 职业
        getXBSelectList: getXBSelect(), // 性别
        getZJXYSelectList: getZjxy(),
        personInfo: {},
        rules: {
          xm: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          gmsfhm: [
            { required: true, message: '请输入身份证号码', trigger: 'blur' }
          ]
          // ,
          // xb: [
          //   { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
          // ],
          // csrq: [
          //   { required: true, message: '请选择出生日期', trigger: ['blur', 'change'] }
          // ],
          // mz: [
          //   { required: true, message: '请选择民族', trigger: ['blur', 'change'] }
          // ],
          // hyzk: [
          //   { required: true, message: '请选择婚姻状况', trigger: ['blur', 'change'] }
          // ],
          // whcd: [
          //   { required: true, message: '请选择文化程度', trigger: ['blur', 'change'] }
          // ],
          // zylb: [
          //   { required: true, message: '请选择职业类别', trigger: ['blur', 'change'] }
          // ],
          // zjxy: [
          //   { required: true, message: '请选择宗教信仰', trigger: ['blur', 'change'] }
          // ],
          // jgqh: [
          //   { required: true, message: '请输入籍贯区划', trigger: 'blur' }
          // ],
          // csdqh: [
          //   { required: true, message: '请输入出生地区划', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      saveData() {
        let valided = false
        this.$refs.baseForm.validate(valid => {
          if (valid) { valided = true }
        })
        if (!valided) { return false }
        this.submitLoading = true
        if (this.personInfo.id) {
          this.$update('personnmqbxs/' + this.personInfo.id, this.personInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '修改成功', type: 'success' })
              this.$emit('backId', this.personInfo.gmsfhm)
              this.inputEnable = true
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$save('personnmqbxs', this.personInfo).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '提交成功', type: 'success' })
              this.personInfo.id = response.data
              this.$emit('backId', this.personInfo.gmsfhm)
              this.inputEnable = true
            }
          }).catch(() => {
            this.submitLoading = false
          })
        }
      },
      doEditInfo() {
        this.inputEnable = false
      },
      MZSelectChange(val) { // 民族
        let obj = {}
        obj = this.getMZSelectList.find((item) => {
          return item.value === val
        })
        this.personInfo.mzMc = obj.label
      },
      WHCDSelectChange(val) { // 文化程度
        let obj = {}
        obj = this.getWHCDSelectList.find((item) => {
          return item.value === val
        })
        this.personInfo.whcdMc = obj.label
      },
      HYZKSelectChange(val) { // 婚姻状况
        let obj = {}
        obj = this.getHYZKSelectList.find((item) => {
          return item.value === val
        })
        this.personInfo.hyzkMc = obj.label
      },
      ZYLBSelectChange(val) { // 职业
        let obj = {}
        obj = this.getZYLBSelectList.find((item) => {
          return item.value === val
        })
        this.personInfo.zylbMc = obj.label
      },
      ZJXYSelectChange(val) {
        let obj = {}
        obj = this.getZJXYSelectList.find((item) => {
          return item.value === val
        })
        this.personInfo.zjxyMc = obj.label
      }
    },
    mounted() {
      this.personInfo = this.person
    },
    watch: {
      person(val) {
        this.personInfo = val
      }
    }
  }
</script>

<style scoped>
  .BaseInfo {
    padding: 10px 0;
  }
  .BaseInfo .inputw80 {
    width: 80%;
  }
</style>
