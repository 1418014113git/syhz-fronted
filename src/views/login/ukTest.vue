<template>
  <div class="pkiLogin-container">
    <!--登录页面标题 -->
    <div class="login-box">
      <img class="loginbglog"  src="/static/image/login_images/loginbglog.png" alt="">
      <img class="loginbgtit"  src="/static/image/login_images/loginbgtext.png" alt="">
    <el-form class="login-form" autoComplete="on" :model="loginForm" ref="loginForm" label-position="left">
      <div class="login-form-tit">用户登录AAA</div>
      <el-row class="disflex loginbtnbox">
        <el-button type="primary" class="loginbtn" @click="doDisplayCertInfo"><svg-icon icon-class="usb" class="pkiLogo"/>PKI 登录</el-button>
      </el-row>
    </el-form>
    </div>
    <footer class="footer">
      <div class="footerText">
        <p>版权所有： 内蒙古公安厅食药环侦总队</p>
        <p>邮政编码： 010010</p>
        <p>技术支持： 内蒙古慧瑞系统集成有限公司</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'pkiLogin',
  components: {},
  data() {
    return {
      loginForm: {}
    }
  },
  methods: {
    // PKI登录
    doDisplayCertInfo() {
      const _this = this
      console.info('开始调用 uk/login 接口，执行UK登录')
      this.$update('ukTest/login', { sfhm: '150103196410120537' }, '0').then((response) => {
        console.info('接口返回数据：' + JSON.stringify(response))
        this.$store.dispatch('UKLogin', response.data).then(() => {
          this.loading = false
          console.info('接口返回数据：' + JSON.stringify(response))
          _this.$store.dispatch('UKLogin', response.data).then(() => {
            this.loading = false
            _this.$store.dispatch('GetInfo').then(() => {
              _this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      })
    }
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
.login-container {
  .el-input {
    // display: inline-block;
    width: 57%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 45px;
      line-height: 45px;
      // padding: 12px 5px 12px 15px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
        -webkit-text-fill-color: #fff !important;
        box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
      }
    }
  }
  .el-input--small {
    font-size: 14px;
  }
  .el-form-item__content {
    background: #fff;
    border-radius: 4px;
    height: 45px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
  .el-form-item {
    color: #333;
    width: 80%;
    margin: 0 auto 4px auto;
  }
  .el-select {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    .el-input {
      width: 100%;
      .el-input__suffix {
        right: 12px;
      }
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
    }
  }
  .svg-container_login {
    padding: 6px 13px 6px 11px !important;
  }
  .el-form-item--small .el-form-item__error {
    padding-top: 4px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.pkiLogin-container {
  height: 100%;
  width: 100%;
  background: url(/static/image/login_images/loginbg.png) no-repeat center
    center;
  background-size: 100% 100%;
  overflow: hidden;
  .login-box {
    width: 80%;
    margin: 10% 0 0 8%;
    overflow: hidden;

    .loginbglog {
      width: 20%;
      margin: 4% 0 0 0%;
    }
    .loginbgtit {
      width: 43%;
      margin: 7% 0 0 0;
    }
    .login-form {
      width: 30%;
      max-width: 350px;
      float: right;
      height: auto;
      margin: 2% 1% 0 0;
      padding-bottom: 80px;
      background: rgba(0, 0, 0, 0.4);
      　　　filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#66000000,endcolorstr=#66000000);
      border-radius: 5px;
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      -o-border-radius: 5px;
      border: 1px solid #5c6667;
      overflow: hidden;
    }
    .svg-container {
      display: inline-block;
      padding: 6px 14px 6px 15px;
      vertical-align: middle;
      height: 100%;
      &_login {
        font-size: 23px;
        color: #333;
      }
      &_key {
        font-size: 20px;
        color: #333;
      }
    }
    .login-form-tit {
      width: 100%;
      font-size: 22px;
      color: #fff;
      margin-bottom: 35px;
      text-align: center;
      background: #0164b5;
      padding: 10px 0;
    }
    .show-pwd {
      position: absolute;
      top: 7px;
      font-size: 16px;
      color: #333;
      cursor: pointer;
      user-select: none;
    }
    .loginbtnbox {
      font-size: 20px;
      margin: 80px 0 20px 0;

      .pkiLogo {
        margin-right: 10px;
      }
    }
    .loginbtn {
      width: 80%;
      padding: 12px 0;
      margin: 0 auto 0 auto;
      font-size: 16px;
      background: #0162b4 !important;
      border-color: #0162b4 !important;
      border-radius: 3px;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      -o-border-radius: 3px;
      box-shadow: #414a59 1px 1px 3px;
    }
  }
  .TopTitBox {
    width: 65%;
    margin: 2% auto 0 auto;
    overflow: hidden;
    .loginbglog {
      width: 16%;
    }
    .loginbgtit {
      width: 43%;
    }
  }
  .footer {
    width: 100%;
    padding: 20px 0;
    position: absolute;
    left: 0;
    bottom: 0;
    color: #fff;
    font-size: 12px;
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    .footerText {
      max-width: 442px;
      margin-right: 50px;
      text-align: left;
      line-height: 1.3;
    }
  }
  .inputtext {
    padding: 6px 0 0 0;
  }
  .pkiLogin {
    width: 80%;
    margin: 20px auto 0 auto;
    text-align: right;
    color: #fff;
    overflow: hidden;
    .pkiSpan {
      position: relative;
      display: inline-block;
      font-size: 15px;
      &::after {
        display: block;
        content: "";
        width: 100%;
        height: 1px;
        background: #fff;
        box-shadow: #414a59 0px 1px 2px;
        position: absolute;
        top: 20px;
        right: 0;
      }
    }
  }
  .downloadText {
    img {
      width: 20px;
    }
    .docSpan {
      cursor: pointer;
      position: relative;
      font-size: 16px;
      font-weight: bold;
      &::after {
        display: block;
        content: "";
        width: 100%;
        height: 1px;
        background: #fff;
        box-shadow: #414a59 0px 1px 2px;
        position: absolute;
        top: 20px;
        right: 0;
      }
      &:hover {
        color: #e6a23c;
        &::after {
          background: #e6a23c;
        }
      }
    }
  }
  .tipMask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;

    .tipBox {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      box-shadow: 0 0px 3px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      width: 62%;
      height: 60vh;
      padding: 0 25px;
      position: relative;
      letter-spacing: 3px;
      top: 6%;
      .tipTop {
        padding: 18px 10px 16px 12px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d8d8d8;
        .openText {
          font-size: 23px;
          color: #333;
          padding: 5px 0 0 15px;
        }
        .copyText {
          font-size: 16px;
          color: #f77d01;
          padding: 11px 0 0 7px;
          font-weight: bold;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        .copyIcon {
          width: 26px;
          height: 29px;
          margin-top: 8px;
        }
      }
      .tipCont {
        width: 65%;
        margin: 18vh auto 0 auto;
        display: flex;
        justify-content: space-between;
        .tipContText {
          height: 61px;
          line-height: 61px;
          font-size: 20px;
          margin-left: 18px;
          color: #333;
          .clickDown {
            color: #f77d01;
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
          }
        }
        .user_guide {
          width: 52px;
          height: 58px;
        }
      }
      .closeBtn {
        padding: 6px 35px;
        font-weight: 600;
        font-size: 16px;
        color: #0060e5;
        text-align: center;
        border-radius: 20px;
        border: 1px solid #0060e5;
        box-shadow: 0 2px 3px #bfc6c9;
        cursor: pointer;
        background: #fff;
        position: absolute;
        right: 20px;
        bottom: 20px;
        &:hover {
          background: #409eff;
          color: #fff;
        }
      }
    }
  }
}
.disflex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.flexchild {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

@media only screen and (min-width: 1910px) {
  .login-form {
    margin: 6% 8% 0 0 !important;
  }
  .footerText {
    font-size: 14px;
  }
}
@media only screen and (max-width: 1366px) {
  .login-container .tipMask .tipBox .tipCont {
    width: 80%;
  }
}
@media only screen and (max-width: 1280px) {
  .login-container .tipMask .tipBox .tipCont {
    width: 88%;
  }
}
</style>
