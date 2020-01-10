<template>
  <div class="portal-tab">
    <div v-if="listData.length < 1" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <div v-else>
      <ul class="dbUl">
        <li class="listCont" v-for="(item,index) in listData" :key="index">
          <p class="flexParent" :title="item.AJMC" style="margin-bottom:6px;">
            <span class="ellipsis-word text ajbh-color" @click="toDetail(item)">{{ item.caseName }}</span>
            <span class="dbLabel bg1" v-if="item.superviseLevel===1">{{$getDictName(item.superviseLevel+'','dbjb').substring(0,2)}}</span>
            <span class="dbLabel bg2" v-if="item.superviseLevel===2">{{$getDictName(item.superviseLevel+'','dbjb').substring(0,2)}}</span>
            <span class="dbLabel bg3" v-if="item.superviseLevel===3">{{$getDictName(item.superviseLevel+'','dbjb').substring(0,2)}}</span>
            <span style="float: right;color:#fff;">{{item.startDate}}</span>
          </p>
          <p class="flexParent" style="">
            <span class="f_color_00a0e9" style="cursor:pointer;" @click="toAjDetail(item.caseId)">{{item.caseNumber}}</span>
            <span class="f_color_e6a23c">{{$getDictName(item.status+'','dbajzt')}}</span>
          </p>
        </li>
      </ul>
    </div>
    <!-- 查阅密码 -->
    <el-dialog title="查阅密码" :visible.sync="checkPasswordVisible" width="30%" @close="passwordCancel">
      <el-form ref="checkForm" :inline="true" :model="checkForm" :rules="rules" label-width="100px" v-loading="formLoading" class="passwordForm">
        <el-form-item label="查阅密码" prop="secretCode">
          <el-input v-model.trim="checkForm.secretCode" clearable type="password" placeholder="请输入查阅密码" size="small" maxlength="8" style="width:100%;"></el-input>
        </el-form-item>
        <el-row class="tabC martop btnUpLine">
          <!-- <el-col :span="24" align="center"> -->
            <el-button size="mini" @click="passwordCancel" class="cancelBtn" :loading="formLoading">取消</el-button>
            <el-button size="mini" @click="passwordCheck" class="saveBtn" :loading="formLoading">验证</el-button>
          <!-- </el-col> -->
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDBAJHome } from '@/api/supervise'
import {
  getAssistStatusText, getDBLevelText
} from '@/utils/codetotext'
import {
  parseTime
} from '@/utils/index'

export default {
  name: 'Tab',
  data() {
    return {
      deptInfo: {},
      listData: [],
      formLoading: false,
      checkForm: {},
      currentDb: {}, // 当前点击的督办
      checkPasswordVisible: false, // 验证密码的弹框
      rules: {
        secretCode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^[a-zA-Z0-9]{6,8}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入查阅密码！'))
            } else if (reg.test(value)) {
              this.formLoading = true
              this.$query('casesupervisecode', { id: this.currentDb.id, secretCode: value }).then((response) => {
                if (response.code === '000000') {
                  this.formLoading = false
                  if (response.data.length > 0) {
                    callback()
                  } else {
                    callback(new Error('查阅密码不正确，请重新输入。'))
                  }
                } else {
                  callback(new Error('查阅密码不正确，请重新输入。'))
                }
              }).catch(() => {
                this.formLoading = false
              })
            } else {
              callback(new Error('密码格式不正确（6-8位的字母或者数字）！'))
            }
          }
        }]
      }
    }
  },
  methods: {
    formatDate(time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
    },
    filterText(status) {
      return getAssistStatusText(status)
    },
    formatterLevel(level) {
      return getDBLevelText(level)
    },
    getData() {
      getDBAJHome({
        deptId: this.deptInfo.id,
        deptCode: this.deptInfo.depCode, // 部门code
        pageSize: 5,
        pageNum: 1
      }).then((res) => {
        if (res.code === '000000' && res.data) {
          this.listData = res.data.list
        }
      })
    },
    toAjDetail(caseId) { // 根据id跳转案件档案
      this.$router.push({ path: '/caseFile/index', query: { id: caseId, isRl: '1' }})
    },
    toDetail(row) {
      // 判断是否有查阅密码
      if (row.secretCode) {
        this.currentDb = row
        this.checkPasswordVisible = true
      } else { // 无查阅密码
        this.$router.push({ path: '/caseManage/dbDetail', query: { dbId: row.id }})
      }
      // localStorage.setItem('curAppCode', 'B')
      // this.$router.push({ path: '/caseManage/dbdetail/' + id })
    },
    passwordCancel() { // 取消验证密码
      this.currentDb = {}
      this.resetForm('checkForm')
      this.checkPasswordVisible = false
    },
    passwordCheck() { // 验证查阅密码
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.checkPasswordVisible = false
          this.$router.push({ path: '/caseManage/dbDetail', query: { dbId: this.currentDb.id }})
        }
      })
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.deptInfo = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.getData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.portal-tab .f_color_e6a23c {
  color: #e6a23c;
}
.portal-tab .f_color_00a0e9 {
  color: #00a0e9;
}
.flexParent {
  display: flex;
  justify-content: space-between;
}
.listCont {
  padding-left: 25px;
  // margin-bottom: 23px;
  position: relative;
  &::before {
    display: inline-block;
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #6cbef2;
    position: absolute;
    left: 0;
    top: 3px;
  }
}
.dbUl .listCont:last-child {
  margin-bottom: 0px;
}
.text {
  width: 66%;
  overflow: hidden;
}
.portal-tab .dbLabel {
  height: 23px;
  line-height: 18px;
  margin-right: 6px;
  font-size: 14px;
  padding: 2px 10px;
  word-break: keep-all;
  display: inline-block;
  border-radius: 4px;
}
.portal-tab .dbLabel.bg1 {
  background-image: linear-gradient(140deg, #d9001b 0%, #e15b6c 100%);
}
.portal-tab .dbLabel.bg2 {
  background-image: linear-gradient(140deg, #ff7a04 0%, #fdbc22 100%);
}
.portal-tab .dbLabel.bg3 {
  background-image: linear-gradient(140deg, #187be0 0%, #54aedf 100%);
}
// 第一个表 案件状态
</style>
