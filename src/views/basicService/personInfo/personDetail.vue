<template>
<!--人员信息详情页 -->
  <div class="personInfoDetail">
      <el-form :model="personForm" size="small" ref="personForm" label-width="170px" v-loading="loading">
        <el-row type="flex" justify="center">
          <el-col :span="9" class="margr">
            <el-form-item label="人员类别">
              <span v-if="personForm.userSort">{{ $getDictName(personForm.userSort+'', 'rylx') }}</span>
            </el-form-item>
            <el-form-item label="警　　号">
              <span>{{personForm.userName}}</span>
            </el-form-item>
             <el-form-item label="身份证号码">
              <span v-if='personForm.userIdNumber'>{{getAfterSix(personForm.userIdNumber)}}</span>
            </el-form-item>
            <el-form-item label="出生日期">
              <span>{{personForm.birthTime}}</span>
            </el-form-item>
            <el-form-item label="民　　族">
              <span v-if="personForm.nation">{{ $getDictName(personForm.nation+'', 'mz') }}</span>
            </el-form-item>
            <el-form-item label="文化程度">
              <span v-if="personForm.cultureDegree">{{ $getDictName(personForm.cultureDegree+'', 'whcd') }}</span>
            </el-form-item>
            <el-form-item label="现任职级">
              <span v-if="personForm.workerGrade">{{ $getDictName(personForm.workerGrade+'', 'xrzj') }}</span>
            </el-form-item>
            <el-form-item label="任职时间">
              <span>{{personForm.workerTime}}</span>
            </el-form-item>
            <el-form-item label="参加公安工作时间">
              <span>{{personForm.joinPoliceTime}}</span>
            </el-form-item>
            <el-form-item label="办公电话">
              <span>{{personForm.workerPhone}}</span>
            </el-form-item>
            <el-form-item label="电脑IP地址">
              <span>{{personForm.ip}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="状　　态">
              <span v-if="personForm.userState">{{ $getDictName(personForm.userState+'', curUserState) }}</span>
            </el-form-item>
            <el-form-item label="姓　　名">
              <span>{{personForm.realName}}</span>
            </el-form-item>
            <el-form-item label="性　　别">
              <span v-if="personForm.userSex+''">{{getSex(personForm.userSex)}}</span>
            </el-form-item>
            <el-form-item label="年　　龄">
              <span>{{personForm.age}}</span>
            </el-form-item>
            <el-form-item label="政治面貌">
              <span v-if="personForm.politicsStatus">{{ $getDictName(personForm.politicsStatus+'', 'zzmm') }}</span>
            </el-form-item>
            <el-form-item label="获得学位">
              <span v-if="personForm.degree">{{ $getDictName(personForm.degree+'', 'xw') }}</span>
            </el-form-item>
            <el-form-item label="现任职务">
              <span v-if="personForm.workerDuty">{{ $getDictName(personForm.workerDuty+'', xrzw) }}</span>
            </el-form-item>
            <el-form-item label="工作岗位">
              <span v-if="personForm.workerPost">{{ $getDictName(personForm.workerPost+'', 'gzgw') }}</span>
            </el-form-item>
            <el-form-item label="参加环食药工作时间">
              <span>{{personForm.joinHsyTime}}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{personForm.phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" >
          <el-col :span="20">
            <el-form-item label="备　　注">
              <span>{{personForm.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'edit',
  data() {
    return {
      personForm: {},
      userInfo: {}, // 当前登录用户信息
      loading: false,
      curUserState: '', // 根据人员类别存储对应的在职状态key值。 'userStatefj': 辅警、工勤, 'userStatemj':民警
      xrzw: '', // 根据当前用户角色是总队，还是支队，存储对应的字典key值， ‘xrzwzod’：总队， 'xrzwzhd':支队
      curUser: {}
    }
  },
  methods: {
    init() {
      // 根据id查详情
      this.loading = true
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
      this.$query('USERMESSAGE/' + id, {}, true).then((response) => {
        this.loading = false
        this.personForm = response.data
        if (this.personForm.userSort) {
          if (this.personForm.userSort === 1) { // 民警
            this.curUserState = 'ryztmj'
          } else { // 辅警，工勤
            this.curUserState = 'ryztfj'
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getSex(val) {
      var name = ''
      if (val === 0) {
        name = '男'
      } else if (val === 1) {
        name = '女'
      } else if (val === 2) {
        name = '未知'
      }
      return name
    },
    getAfterSix(val) {
      var number = ''
      if (val.length === 18) {
        number = val.substring(0, 12) + '******'
      } else if (val.length === 15) {
        number = val.substring(0, 10) + '******'
      }
      return number
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.personInfoDetail{
  .margr{
    margin-right: 8%;
  }
  .inputw{
    width: 100%;
  }
}
@media only screen and (max-width: 1367px) {
  .personInfoDetail{
    .margr{
      margin-right: 75px;
    }
  }
}
</style>
