<template>
<!--人员信息编辑页 -->
  <div class="personInfoEdit">
      <el-form :model="personForm" size="small" ref="personForm" :rules="rules" label-width="170px" v-loading="loading">
        <el-row type="flex" justify="center">
          <el-col :span="10" class="margr">
            <el-form-item label="人员类别" prop="userSort">
              <span v-if="personForm.userSort">{{ $getDictName(personForm.userSort+'', 'rylx') }}</span>
            </el-form-item>
            <el-form-item label="警　　号" prop="userName">
              <span>{{personForm.userName}}</span>
            </el-form-item>
            <el-form-item label="身份证号码" prop="userIdNumber">
              <el-input v-model.trim="personForm.userIdNumber" clearable maxlength="18" placeholder="请输入"  class="inputw"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthTime">
              <el-input v-model.trim="personForm.birthTime" clearable  maxlength="10"  placeholder=""  class="inputw" disabled></el-input>
            </el-form-item>
            <el-form-item label="民　　族" prop="nation">
              <el-select v-model.trim="personForm.nation"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('mz')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文化程度" prop="cultureDegree">
              <el-select v-model.trim="personForm.cultureDegree"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('whcd')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="现任职级" prop="workerGrade">
              <el-select v-model.trim="personForm.workerGrade"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('xrzj')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任职时间" prop="workerTime">
              <el-date-picker v-model="personForm.workerTime" type="date" value-format="yyyy-MM-dd" class="inputw" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="参加公安工作时间" prop="joinPoliceTime">
              <el-date-picker v-model="personForm.joinPoliceTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" class="inputw" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="办公电话" prop="workerPhone">
              <el-input v-model.trim="personForm.workerPhone" clearable maxlength="13" placeholder="区号-固定电话或手机号码"  class="inputw"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状　　态" prop="userState">
              <el-select v-if="personForm.userState" v-model.trim="personForm.userState"  placeholder="请选择" clearable  class="inputw" :disabled="!$isViewBtn('170001')">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(curUserState)" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓　　名" prop="realName">
              <el-input v-model.trim="personForm.realName" clearable maxlength="50" placeholder="请输入"  class="inputw"></el-input>
            </el-form-item>
            <el-form-item label="性　　别" prop="userSex">
              <el-radio v-model="personForm.userSex" :label="0" disabled>男</el-radio>
              <el-radio v-model="personForm.userSex" :label="1" disabled>女</el-radio>
            </el-form-item>
            <el-form-item label="年　　龄" prop="age">
              <el-input v-model.trim="personForm.age" clearable maxlength="3" placeholder="" disabled class="inputw" ></el-input>
            </el-form-item>
            <el-form-item label="政治面貌" prop="politicsStatus">
              <el-select v-model.trim="personForm.politicsStatus"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('zzmm')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="获得学位" prop="degree">
              <el-select v-model.trim="personForm.degree"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('xw')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="现任职务" prop="workerDuty">
              <el-select v-model.trim="personForm.workerDuty"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(xrzw)" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作岗位" prop="workerPost">
              <el-select v-model.trim="personForm.workerPost"  placeholder="请选择" clearable  class="inputw">
                <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('gzgw')" :key="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参加环食药工作时间" prop="joinHsyTime">
              <el-date-picker v-model="personForm.joinHsyTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" class="inputw" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model.trim="personForm.phone" clearable maxlength="11" placeholder="请输入"  class="inputw"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row type="flex" justify="center" >
           <el-col :span="22">
            <el-form-item label="电脑IP地址" prop="ip">
              <el-input v-model.trim="personForm.ip" clearable maxlength="15" placeholder="请输入"  class="inputw"></el-input>
            </el-form-item>
            <el-form-item label="备　　注" prop="remark">
              <el-input v-model.trim="personForm.remark" type="textarea" :rows="2" clearable maxlength="500" placeholder="最多输入500个字符" class="textAreaw"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="tabC btnUpLine" style="margin-top: 20px;">
          <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
        </el-row>
      </el-form>
  </div>
</template>

<script>
import { regIp } from '@/utils/validate'
export default {
  props: ['personId'],
  name: 'edit',
  data() {
    return {
      personForm: {
        // userSort: '',
        // userState: '',
        // cultureDegree: '',
        // workerGrade: '',
        // nation: '',
        // politicsStatus: '',
        // degree: '',
        // workerDuty: '',
        // workerPost: ''
        userSort: '',
        userName: '',
        userIdNumber: '',
        birthTime: '',
        nation: '',
        cultureDegree: '',
        workerGrade: '',
        workerTime: '',
        joinPoliceTime: '',
        workerPhone: '',
        userState: '',
        realName: '',
        userSex: '',
        age: '',
        politicsStatus: '',
        degree: '',
        workerDuty: '',
        workerPost: '',
        joinHsyTime: '',
        phone: '',
        ip: '',
        remark: ''
      },
      userInfo: {}, // 当前登录用户信息
      loading: false,
      btnLoading: false,
      curUserState: '', // 根据人员类别存储对应的在职状态key值。 'userStatefj': 辅警、工勤, 'userStatemj':民警
      xrzw: '', // 根据当前用户角色是总队，还是支队，存储对应的字典key值， ‘xrzwzod’：总队， 'xrzwzhd':支队
      pickerOptions: { // 控制日期只能小于等于当前日期
        disabledDate(time) {
          return time.getTime() >= Date.now()
        }
      },
      rules: {
        userIdNumber: [{ // 身份证号校验
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!value) {
              this.personForm.birthTime = ''
              this.personForm.userSex = ''
              this.personForm.age = ''
              return callback(new Error('请输入身份证号码！'))
            }
            value = value.toUpperCase()
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
              this.personForm.birthTime = ''
              this.personForm.userSex = ''
              this.personForm.age = ''
              return callback(new Error('请输入正确的身份证号码！'))
            }
            // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            // 下面分别分析出生日期和校验位
            var len, re
            len = value.length
            if (len === 15) {
              re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
              var arrSplit = value.match(re)
              // 检查生日日期是否正确
              var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
              var bGoodDay
              bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
              if (!bGoodDay) {
                this.personForm.birthTime = ''
                this.personForm.userSex = ''
                this.personForm.age = ''
                return callback(new Error('请输入正确的身份证号码！'))
              } else {
                // 将15位身份证转成18位
                // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
                var nTemp = 0
                value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6)
                for (var i = 0; i < 17; i++) {
                  nTemp += value.substr(i, 1) * arrInt[i]
                }
                value += arrCh[nTemp % 11]
                this.analyzeIDCard(value)
                return callback()
              }
            }
            if (len === 18) {
              re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
              var arrSplits = value.match(re)
              // 检查生日日期是否正确
              var dtmBirths = new Date(arrSplits[2] + '/' + arrSplits[3] + '/' + arrSplits[4])
              var bGoodDay1
              bGoodDay1 = (dtmBirths.getFullYear() === Number(arrSplits[2])) && ((dtmBirths.getMonth() + 1) === Number(arrSplits[3])) && (dtmBirths.getDate() === Number(arrSplits[4]))
              if (!bGoodDay1) {
                this.personForm.birthTime = ''
                this.personForm.userSex = ''
                this.personForm.age = ''
                return callback(new Error('请输入正确的身份证号码！'))
              } else {
                // 检验18位身份证的校验码是否正确。
                // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum
                var arrInts = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                var arrChs = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
                var nTemps = 0
                for (var j = 0; j < 17; j++) {
                  nTemps += value.substr(j, 1) * arrInts[j]
                }
                valnum = arrChs[nTemps % 11]
                if (valnum !== value.substr(17, 1)) {
                  this.personForm.birthTime = ''
                  this.personForm.userSex = ''
                  this.personForm.age = ''
                  return callback(new Error('请输入正确的身份证号码！'))
                } else {
                  this.analyzeIDCard(value)
                  return callback()
                }
              }
            }
          }
        }],
        nation: [ // 民族
          { required: true, trigger: 'change', message: '请选择民族' }
        ],
        cultureDegree: [ // 文化程度
          { required: true, trigger: 'change', message: '请选择文化程度' }
        ],
        workerGrade: [ // 现任职级
          { required: true, trigger: 'change', message: '请选择现任职级' }
        ],
        workerTime: [ // 任职时间
          { required: true, trigger: 'change', message: '请选择任职时间' }
        ],
        userState: [ // 任职状态
          { required: true, trigger: 'change', message: '请选择任职状态' }
        ],
        joinPoliceTime: [ // 参加公安工作时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择参加公安工作时间'))
              } else {
                if (this.personForm.joinHsyTime) {
                  if (value > this.personForm.joinHsyTime) {
                    return callback(new Error('参加公安工作时间不能大于参加环食药工作时间！'))
                  } else {
                    // this.$refs.personForm.validateField('joinHsyTime', (joinHsyTimeError) => {})
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          }
        ],
        workerPhone: [{ // 办公电话
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const regMoble = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            var regFixMob = /^([0-9]{3,4}-)?[0-9]{7,8}$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入电话号码'))
            } else if (this.$regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else if (regMoble.test(value) || regFixMob.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的电话号码'))
            }
          }
        }],
        ip: [ // IP地址
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请输入电脑IP地址'))
              } else if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else if (!regIp.test(value)) {
                callback(new Error('后期平台将会控制可以访问平台的IP地址，为了后期不影响您的使用，请正确输入您的电脑的IP地址！'))
              } else {
                callback()
              }
            }
          }
        ],
        realName: [ // 姓名
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请输入姓名'))
              } else {
                const reg = this.$regCnName
                if (this.$regCode.test(value)) {
                  callback(new Error('请不要输入特殊字符'))
                } else if (!reg.test(value)) {
                  callback(new Error('请输入真实姓名'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        politicsStatus: [ // 政治面貌
          { required: true, trigger: 'change', message: '请选择政治面貌' }
        ],
        degree: [ // 获得学位
          { required: true, trigger: 'change', message: '请选择学位' }
        ],
        workerDuty: [ // 现任职务
          { required: true, trigger: 'change', message: '请选择现任职务' }
        ],
        workerPost: [ // 工作岗位
          { required: true, trigger: 'change', message: '请选择工作岗位' }
        ],
        joinHsyTime: [ // 参加环食药工作时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择参加环食药工作时间'))
              } else {
                callback()
                // if (this.personForm.joinPoliceTime) {
                //   if (value < this.personForm.joinPoliceTime) {
                //     return callback(new Error('参加环食药工作时间不能小于参加公安工作时间！'))
                //   } else {
                //     this.$refs.personForm.validateField('joinPoliceTime', (joinPoliceTimeError) => {})
                //     callback()
                //   }
                // } else {
                //   callback()
                // }
              }
            }
          }
        ],

        phone: [ // 手机号码
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
              if (rule.required) {
                if (value === '' || value === undefined) {
                  return callback(new Error('请输入手机号'))
                }
              }
              if (value !== '' && value !== undefined) {
                if (value.replace(/\s/g, '') === '') {
                  return callback(new Error('不能输入纯空格'))
                } else if (!reg.test(value)) {
                  return callback(new Error('请输入正确的手机号'))
                } else if (this.$regCode.test(value)) {
                  callback(new Error('请不要输入特殊字符'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }]
      }
    }
  },
  methods: {
    init() {
      if (sessionStorage.getItem('depToken')) {
        this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
        if (this.curDept.depType === '1') { // 总队
          this.xrzw = 'xrzwzod'
        } else if (this.curDept.depType === '2') { // 支队
          this.xrzw = 'xrzwzhd'
        } else if (this.curDept.depType === '3') { // 大队
          this.xrzw = 'xrzwdd'
        } else if (this.curDept.depType === '4') { // 派出所
          this.xrzw = 'xrzwpcs'
        }
      }
      var id = this.$route.query.id ? this.$route.query.id : this.curUser.id
      this.loading = true
      this.$query('USERMESSAGE/' + id, {}, true).then((response) => {
        this.loading = false
        // this.personForm = response.data
        response.data.userSort ? this.personForm.userSort = response.data.userSort + '' : this.personForm.userSort = ''
        response.data.userState ? this.personForm.userState = response.data.userState + '' : this.personForm.userState = ''
        response.data.cultureDegree ? this.personForm.cultureDegree = response.data.cultureDegree + '' : this.personForm.cultureDegree = ''
        response.data.workerGrade ? this.personForm.workerGrade = response.data.workerGrade + '' : this.personForm.workerGrade = ''
        response.data.nation ? this.personForm.nation = response.data.nation + '' : this.personForm.nation = null
        response.data.politicsStatus ? this.personForm.politicsStatus = response.data.politicsStatus + '' : this.personForm.politicsStatus = ''
        response.data.degree ? this.personForm.degree = response.data.degree + '' : this.personForm.degree = ''
        response.data.workerDuty ? this.personForm.workerDuty = response.data.workerDuty + '' : this.personForm.workerDuty = ''
        response.data.workerPost ? this.personForm.workerPost = response.data.workerPost + '' : this.personForm.workerPost = ''
        response.data.userName ? this.personForm.userName = response.data.userName + '' : this.personForm.userName = ''
        response.data.birthTime ? this.personForm.birthTime = response.data.birthTime + '' : this.personForm.birthTime = ''
        response.data.workerTime ? this.personForm.workerTime = response.data.workerTime + '' : this.personForm.workerTime = ''
        response.data.joinPoliceTime ? this.personForm.joinPoliceTime = response.data.joinPoliceTime + '' : this.personForm.joinPoliceTime = ''
        response.data.workerPhone ? this.personForm.workerPhone = response.data.workerPhone + '' : this.personForm.workerPhone = ''
        response.data.realName ? this.personForm.realName = response.data.realName + '' : this.personForm.realName = ''
        response.data.age ? this.personForm.age = response.data.age : this.personForm.age = ''
        response.data.joinHsyTime ? this.personForm.joinHsyTime = response.data.joinHsyTime + '' : this.personForm.joinHsyTime = ''
        response.data.phone ? this.personForm.phone = response.data.phone + '' : this.personForm.phone = ''
        response.data.userIdNumber ? this.personForm.userIdNumber = response.data.userIdNumber + '' : this.personForm.userIdNumber = ''
        response.data.ip ? this.personForm.ip = response.data.ip : this.personForm.ip = sessionStorage.getItem('currentIp')
        response.data.remark ? this.personForm.remark = response.data.remark : this.personForm.remark = ''
        response.data.userSex + '' ? this.personForm.userSex = response.data.userSex : this.personForm.userSex = ''
        if (this.personForm.userSort) {
          if (this.personForm.userSort === '1') { // 民警
            this.curUserState = 'ryztmj'
          } else { // 辅警，工勤
            this.curUserState = 'ryztfj'
          }
        }
        if (this.personForm.userIdNumber) {
          this.analyzeIDCard(this.personForm.userIdNumber)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    save() { // 保存
      this.$refs.personForm.validate(valid => {
        if (valid) {
          var id = this.$route.query.id
          this.personForm.lastId = this.curUser.id // 最后修改人id
          this.personForm.lastName = this.curUser.realName // 最后修改人姓名
          this.btnLoading = true
          this.$update('userMessage/' + id, this.personForm, true).then((response) => {
            this.$message({
              message: '人员信息保存成功！',
              type: 'success'
            })
            setTimeout(() => {
              this.btnLoading = false
              this.$emit('cancelEdit', true)
              // this.$router.push({ path: '/basicService/personList' })
            }, 3000)
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cancel() { // 取消
      this.$confirm('是否要放弃当前编辑的信息？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$emit('cancelEdit', true)
        // this.$router.push({ path: '/basicService/personList' })
      }).catch(() => {

      })
    },
    analyzeIDCard(IDCard) {
      var UUserCard = IDCard
      // 获取出生年月日
      var yearBirth = UUserCard.substring(6, 10)
      var monthBirth = UUserCard.substring(10, 12)
      var dayBirth = UUserCard.substring(12, 14)
      this.personForm.birthTime = yearBirth + '-' + monthBirth + '-' + dayBirth
      // 获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
        this.personForm.userSex = 0 // 男
      } else {
        this.personForm.userSex = 1 // 女
      }
      // 获取年龄
      var myDate = new Date()
      var month = myDate.getMonth() + 1
      var day = myDate.getDate()
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) === month && UUserCard.substring(12, 14) <= day) {
        age++
      }
      this.personForm.age = age
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.personInfoEdit{
  .margr{
    margin-right: 8.5%;
  }
  .inputw{
    width: 270px;
  }
  .textAreaw{
    width: 101%;
  }
  .el-col-22 {
    width: 92%;
  }
}
@media only screen and (max-width: 1367px) {
  .personInfoEdit{
    .textAreaw {
       width: 103%;
    }
  }
}
@media screen and (min-width: 1920px) {
  .personInfoEdit{
    .textAreaw{
      width: 92%;
    }
  }
}

</style>
