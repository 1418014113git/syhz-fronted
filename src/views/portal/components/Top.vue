<template>
<div class="top">
  <div class="lefArea">
    <span>{{date}}&nbsp;&nbsp;&nbsp;&nbsp;{{week}}</span>
  </div>
  <div class="centerTit" >
    <img src="/static/image/portal_newImg/mainTitle.png" alt="">
  </div>
  <div class="rigCon">
    <search-app></search-app>
  </div>
  <div class="rigArea">
      <span class="nameLeft">用户名：</span>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <span class="userinfo-inner">{{name}}</span>
          <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item  style="font-size:14px;" divided>
            <span style="display:block;" @click="EditPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="isShow()" style="font-size:14px;" divided>
            <span style="display:block;" @click="toUpms">系统管理</span>
          </el-dropdown-item>
          <el-dropdown-item style="font-size:14px;" divided>
            <span style="display:block;" @click="goOut">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="message" :class="{'isMessage':isMessage}" @click="watchMessage">
        <img src="/static/image/portal_newImg/mes.png" alt="">
      </div>
  </div>

   <!--修改密码弹出层-->
  <el-dialog title="修改密码" :visible.sync="isShowdialog">
    <el-form ref="resetPwdForm" :rules="resetPwdFormRules" :model="resetPwdForm" size="mini" :label-width="formLabelWidth">
      <el-form-item label="原密码" prop="loginPwd" :label-width="formLabelWidth">
        <el-input v-model.trim="resetPwdForm.loginPwd" type="password" auto-complete="off" maxlength="20" clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="loginPwdNew" :label-width="formLabelWidth">
        <el-input v-model.trim="resetPwdForm.loginPwdNew" type="password" auto-complete="off" maxlength="20" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPwdNew1" :label-width="formLabelWidth">
        <el-input v-model.trim="resetPwdForm.loginPwdNew1" type="password" auto-complete="off" maxlength="20" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-row class="tabC martop">
      <el-button  @click="handleResetPwdCancel" class="cancelBtn">取 消</el-button>
      <el-button  type="primary" @click="handleResetPwdSubmit" v-loading.fullscreen.lock="loadingFlag" class="saveBtn">保 存</el-button>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
// import { getMessagesCount } from '@/api/messages'
import SearchApp from './searchApp'
export default {
  props: ['upmsUrl'],
  name: '',
  data() {
    return {
      name: sessionStorage.getItem('realName'),
      date: '',
      week: '',
      roles: JSON.parse(sessionStorage.getItem('roles')), // 角色列表
      isMessage: false, // 如果有消息，则设置为true，显示小红点
      curDept: {},
      loadingFlag: false,
      formLabelWidth: '100px',
      isShowdialog: false,
      curUser: {},
      resetPwdForm: {
        id: '',
        loginName: '',
        loginPwd: '',
        loginPwdNew: '',
        loginPwdNew1: ''
      },
      resetPwdFormRules: {
        loginPwd: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
        ],
        loginPwdNew: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
        ],
        loginPwdNew1: [
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' },
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value.length > 0) {
                if (this.resetPwdForm.loginPwdNew !== value) {
                  callback(new Error('新密码设置不一致，请确认后再次输入！'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请输入确认密码'))
              }
            }
          }
        ]
      }
    }
  },
  components: {
    SearchApp
  },
  methods: {
    /* eslint-disable */
    init() {
      this.init = setInterval(() => {
        this.getRealTime()
      }, 1000)
    },
    //获取实时时间
    getRealTime() {
      // 获取当前日期
      const date_time = new Date()
      // 定义星期
      let week
      // switch判断
      switch (date_time.getDay()) {
        case 1: week = '星期一'; break
        case 2: week = '星期二'; break
        case 3: week = '星期三'; break
        case 4: week = '星期四'; break
        case 5: week = '星期五'; break
        case 6: week = '星期六'; break
        default: week = '星期日'; break
      }
      // 年
      let year = date_time.getFullYear()
      // 判断小于10，前面补0
      if (year < 10) {
        year = '0' + year
      }
      // 月
      let month = date_time.getMonth() + 1
      // 判断小于10，前面补0
      // if(month<10){
      //   month="0"+month;
      // }
      // 日
      let day = date_time.getDate()
      // 判断小于10，前面补0
      // if(day<10){
      //  day="0"+day;
      // }
      // 时
      let hours = date_time.getHours()
      // 判断小于10，前面补0
      // if(hours<10){
      //   hours="0"+hours;
      // }
      // 分
      let minutes = date_time.getMinutes()
      // 判断小于10，前面补0
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      // 秒
      let seconds = date_time.getSeconds();
      // 判断小于10，前面补0
      // if(seconds<10){
      //  seconds="0"+seconds;
      // }
      // 上、下午
      let sd = '上午'
      if (hours > 12) {
        hours = hours - 12
        sd = '下午'
      }
      // 拼接年月日时分
      const date_str = year + '年' + month + '月' + day + '日 ' + sd + hours + ':' + minutes
      // var date_str = year + '年' + month + '月' + day + '日 ' + sd + hours + ':' + minutes+ ":"+seconds // 含秒数的
      // let week
      // 显示在id为showtimes的容器里
      this.date = date_str
      this.week = week
    },
    watchMessage() {
      this.$router.push({
        path: '/message/list'
      })
    },
    isShow() {
      var flag = false
      this.roles.forEach(function (item) {
        if (item.roleCode.substring(0, 1) === '1') {
          flag = true
        }
      })
      return flag
    },
    toUpms() {
      if(this.upmsUrl){
        var userToken=sessionStorage.getItem('userToken')
        var address='http://'+this.upmsUrl + '?n=' + userToken
        window.open(address)
      }
    },
    compile(code) { // 参数加密
      var c=String.fromCharCode(code.charCodeAt(0)+code.length)
      for(var i=1;i<code.length;i++){
      c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1))
      }
      return escape(c)
    },
    goOut() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },
    getCount() { // 消息图标是否显示小红点
      this.$query('SYSMESSAGESSTATUS/'+ this.curUser.id, {}).then((response) => {
       if (response.code === '000000' && response.data.messageCount) {
          this.isMessage = response.data.messageCount > 0
        }
      })
    },
    EditPassword(){ // 修改密码
      this.isShowdialog=true
    },
    handleResetPwdSubmit: function(index, row) {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改密码吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.uppwd()
          })
        }
      })
    },
    uppwd: function() { // 保存修改密码
      this.loadingFlag = true
      var param = {
        oldPassWord: this.resetPwdForm.loginPwd,
        passWord: this.resetPwdForm.loginPwdNew
      }
      this.$update('userresetpwd/' + this.curUser.id, param,true).then((response) => {
        this.loadingFlag = false
        if (response.code === '000000') {
           this.$message({
            message: '修改密码成功',
            type: 'success'
          })
          this.isShowdialog=false
        }
      }).catch(() => {
        this.loadingFlag = false
        this.restData()
      })
    },
    handleResetPwdCancel: function() {
      this.isShowdialog=false
      this.restData()
    },
    restData(){
      this.$refs['resetPwdForm'].resetFields();
      this.resetPwdForm.loginPwd = ''
      this.resetPwdForm.loginPwdNew = ''
      this.resetPwdForm.loginPwdNew1 = ''
    },
  },
  created() {
    this.init()
    // window.setInterval('this.init()', 1000)
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getCount()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.top {
  display: flex;
  overflow: hidden;
  text-align: center;
  background: url("/static/image/portal_newImg/topLine.png") no-repeat center bottom;
  background-size: 100%;
  height: 100px;
  .centerTit {
    width: 32%;
    text-align: center;
    padding-top: 18px;
    img{
      width: 380px;
    }
  }
  .lefArea {
    width: 34%;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    text-align: right;
    padding: 40px 120px 0 0;
  }
  .rigArea{
    flex: 1;
    .nameLeft{
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
    }
  }
  .rigCon{
    width: 20%;
    padding-top: 25px;
  }
  .message {
    display: inline-block;
    margin: 0 15px 0 12px;
    position: relative;
    cursor: pointer;
  }
  .isMessage {
    &::before {
      display: inline-block;
      content: "";
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #ff0000;
      position: absolute;
      top: 1px;
      right: -1px;
    }
  }
  .goOut,
  .upms {
    cursor: pointer;
  }

  .avatar-container {
    .avatar-wrapper {
      height: 100%;
      cursor: pointer;
      position: relative;
       .userinfo-inner{
        color: #ffe617;
        text-shadow: 0 0 2px #fff;
        display: inline-block;
        margin-top: 20px;
      }
    // .el-icon-caret-bottom {
    //     position: absolute;
    //     right: -20px;
    //     top: 25px;
    //     font-size: 12px;
    //   }
    }
  }
  .el-dropdown {
    color: #28a8f8 !important;
  }
  .el-dialog{
    width: 30%;
  }
  .el-form{
    width: 90%;
    margin: 0 auto;
  }
  .martop{
    margin-top: 15px;
  }
  .el-dialog__body{
    padding: 20px 0;
  }
}
@media only screen and (max-width: 1367px) {
  .top{
    height: 85px;
  }
  .top .centerTit img{
    width: 340px;
  }
  .top .lefArea{
    padding: 37px 30px 0 0;
  }
  .top .rigArea{
    font-size: 12px;
  }
  .el-input--mini .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
  .top .rigArea[data-v-c8abc34a] {
    text-align: right;
  }
  .top .rigCon{
    width: 18%;
  }
  .el-dropdown {
    font-size: 12px;
  }
  .message img{
    width: 20px;
  }
}
</style>
