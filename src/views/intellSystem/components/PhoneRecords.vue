<template>
  <div class="PhoneRecords" style="padding-bottom: 30px;">
    <el-form :model="phoneRecords" ref="phoneRecordsForm" :rules="rules" size="small"  label-width="150px">
      <el-row>
        <el-form-item label="通话类型：" prop="type">
          <el-radio v-model="phoneRecords.type" label="1">主叫</el-radio>
          <el-radio v-model="phoneRecords.type" label="2">被叫</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="本人号码：" prop="brhm">
          <el-input v-model="phoneRecords.brhm" maxlength="15" style="width: 220px;" clearable auto-complete="off"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="对方号码：" prop="dfhm">
          <el-input v-model="phoneRecords.dfhm" maxlength="15" style="width: 220px;" clearable auto-complete="off"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="开始时间：" prop="startDate">
          <el-date-picker v-model="phoneRecords.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="通话时长：" prop="thsc">
          <el-input v-model="hour" maxlength="6" @keydown.native="inputLimit" @blur="handlerHour" style="width: 80px;"></el-input><span class="hms_color">时</span>
          <el-input v-model="minutes " maxlength="6" @keydown.native="inputLimit" @blur="handlerMin" style="width: 80px;"></el-input><span class="hms_color">分</span>
          <el-input v-model="seconds" maxlength="6" @keydown.native="inputLimit" @blur="handlerSec" style="width: 80px;"></el-input><span class="hms_color">秒</span>
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
  export default {
    name: 'PhoneRecords',
    props: ['beanInfo', 'len', 'index', 'personId'],
    data() {
      return {
        hour: 0,
        minutes: 0,
        seconds: 0,
        submitLoading: false,
        phoneRecords: {},
        rules: {
          type: [
            { required: true, message: '请选择服务分类', trigger: ['blur', 'change'] }
          ],
          brhm: [
            {
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                const reg = /^[1][345678][0-9]{9}$/
                if (!reg.test(value)) {
                  callback(new Error('请输入11位正确的手机号码'))
                } else {
                  callback()
                }
              }
            }
          ],
          dfhm: [
            {
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                const reg = /^[1][345678][0-9]{9}$/
                if (!reg.test(value)) {
                  callback(new Error('请输入11位正确的手机号码'))
                } else {
                  callback()
                }
              }
            }
          ],
          startDate: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          thsc: [
            { required: false, message: '请输入通话时长', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      saveData() {
        let valided = false
        this.$refs.phoneRecordsForm.validate(valid => {
          if (valid) { valided = true }
        })
        if (!valided) { return false }
        if (!this.personId) {
          this.$message({ message: '请先提交人员信息', type: 'warning' })
          return false
        }
        this.phoneRecords.personId = this.personId
        this.phoneRecords.thsc = this.hour + ':' + this.minutes + ':' + this.seconds
        this.submitLoading = true
        if (this.phoneRecords.id) {
          this.$update('personnmcallrecords/' + this.phoneRecords.id, this.phoneRecords).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '修改成功', type: 'success' })
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$save('personnmcallrecords', this.phoneRecords).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '提交成功', type: 'success' })
              this.phoneRecords.id = response.data
            }
          }).catch(() => {
            this.submitLoading = false
          })
        }
      },
      doRemove() {
        if (this.phoneRecords.id) {
          this.$remove('personnmcallrecords/' + this.phoneRecords.id, {}).then((response) => {
            this.submitLoading = false
            if (response.code === '000000') {
              this.$message({ message: '删除成功', type: 'success' })
              this.$emit('doDelPhoneRecords', this.phoneRecords.tempId)
            }
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$emit('doDelPhoneRecords', this.phoneRecords.tempId)
        }
      },
      handlerHour() {
        this.hour = Number(this.hour)
      },
      handlerMin() {
        if (this.minutes >= 60) {
          this.hour = parseInt(String(this.minutes / 60))
          this.minutes = this.minutes % 60
        }
        this.minutes = Number(this.minutes)
      },
      handlerSec() {
        if (this.seconds >= 60) {
          this.minutes = parseInt(String(this.seconds / 60))
          if (this.minutes >= 60) {
            this.handlerMin()
          }
          this.seconds = this.seconds % 60
        }
        this.seconds = Number(this.seconds)
      },
      inputLimit(e) {
        const num = e.target.value || ''
        const code = e.which || e.keyCode
        const str = (e.key && e.key !== 'Unidentified') ? e.key : num.substr(num.length - 1)
        if (code === 8) {
          return true
        }
        if (!(/[\d.]/.test(str) || code === 190)) {
          e.returnValue = false
          return false
        }
        if (num.length > 12 ||
          (num.indexOf('.') >= 0 && code === 190) ||
          ((num.indexOf('.') === num.length - 3) && num.length > 3) ||
          (num.length === 0 && code === 190)) {
          e.returnValue = false
          return false
        }
        return true
      }
    },
    mounted() {
      if (this.beanInfo) {
        this.phoneRecords = this.beanInfo
      }
    }
  }
</script>

<style scoped>
  .PhoneRecords {
    padding: 10px 0;
    border-top: 1px dashed #00a0e9;
  }
  .PhoneRecords:first-child{
    border: 0;
  }
  .PhoneRecords .hms_color{
    padding-left: 10px;
    padding-right: 25px;
    color: #FFFFFF;
  }
</style>
