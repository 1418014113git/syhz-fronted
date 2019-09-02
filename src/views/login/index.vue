<template>
  <div class="pkiLogin-container">
    <!--下载提示层上方的标题 -->
    <div class="TopTitBox" v-show="isShowTopTit">
      <img class="loginbglog"  src="/static/image/login_images/loginbglog.png" alt="">
      <img class="loginbgtit"  src="/static/image/login_images/loginbgtext.png" alt="">
    </div>

    <!--登录页面标题 -->
    <div class="login-box" v-show="isShowLogin">
      <img class="loginbglog"  src="/static/image/login_images/loginbglog.png" alt="">
      <img class="loginbgtit"  src="/static/image/login_images/loginbgtext.png" alt="">
    <el-form class="login-form" autoComplete="on" :model="loginForm" ref="loginForm" label-position="left">
      <div class="login-form-tit">用户登录</div>
      <el-row class="disflex loginbtnbox">
        <el-button type="primary" class="loginbtn" :loading="loading" @click="pkiLogin"><svg-icon icon-class="usb" class="pkiLogo"/>PKI 登录</el-button>
      </el-row>
    </el-form>
    </div>
    <footer class="footer">
      <div class="footerText">
        <p>版权所有： 陕西省公安厅环食药侦总队</p>
        <p>邮政编码： 710000</p>
        <p>技术支持： 西安未来国际信息股份有限公司</p>
      </div>
      <div class="downloadText"  v-show="isShowBotText"   @click="openMask">
        <img src="/static/image/login_images/user_guide.png" alt="">
        <span class="docSpan">浏览器与使用手册下载</span>
      </div>
    </footer>

    <!--下载提示层 -->
    <div class="tipMask" v-show="isShowMask">
      <div class="tipBox">
        <div class="tipTop">
          <div class="disflex">
            <img class="tipsIcon" src="/static/image/login_images/tips.png" alt="">
            <p class="openText">请使用谷歌浏览器打开本系统</p>
          </div>
          <div class="disflex">
            <img class="copyIcon" src="/static/image/login_images/copy.png" alt="">
            <p class="copyText" @click="copylink">(点击复制本站链接)</p>
          </div>
        </div>
        <div class="tipCont">
          <div class="disflex">
            <img class="copyIcon" src="/static/image/login_images/google.png" alt="">
            <p class="tipContText">
              <span>谷歌浏览器</span>
              <span class="clickDown" @click="downloadBrowser">(点击下载)</span>
              <!-- <a class="clickDown" :href="this.downLoadUrl+'谷歌and插件and安装插件说明.zip '" target="_blank">(点击下载)</a> -->
            </p>
          </div>
          <div class="disflex">
            <img class="user_guide" src="/static/image/login_images/user_guide.png" alt="">
            <p class="tipContText">
              <span>使用手册</span>
              <span class="clickDown"  @click="downloadManual" >(点击下载)</span>
              <!-- <a class="clickDown" :href="this.downLoadUrl+'用户使用手册_[公安食药环侦实战应用平台建设].doc'" target="_blank">(点击下载)</a> -->
            </p>
          </div>
        </div>
        <div class="closeBtn" @click="close">关闭</div>
      </div>
      <input id="input" v-model="inputData" style="display:none;">
    </div>
    <div id="tipImg" style="position:absolute; cursor: pointer;" @mouseenter="floatOver()" @mouseleave="floatOut()" @click="floatTipShow">
      <img src="/static/image/login_images/tipmsg.jpg" border="0">
    </div>
    <el-dialog :visible.sync="tipShow">
      <float-tip-msg></float-tip-msg>
    </el-dialog>
  </div>
</template>

<script>
import importexport from '@/api/importexport'
import clip from '@/utils/clipboard'
import FloatTipMsg from '@/views/login/FloatTipMsg'
export default {
  name: 'pkiLogin',
  components: {
    FloatTipMsg
  },
  data() {
    return {
      loginForm: {},
      tipShow: false,
      loading: false,
      isShowMask: false, // 是否显示下载提示页
      isShowLogin: true, // 是否显示登录界面
      isShowTopTit: false, // 是否显示顶部标题
      isShowBotText: true, // 是否显示底部文档下载提示文字
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的下载地址
      inputData: window.location.href,
      randomNum: '',
      JITComVCTKEx: null,
      tipMsg: {
        x: 50,
        y: 60,
        xin: true,
        yin: true,
        step: 1,
        delay: 10,
        obj: {}
      },
      itl: ''
    }
  },
  methods: {
    // PKI登录
    pkiLogin() {
      console.log('PKI登录')
      this.loading = true
      this.$query('uk/random', {}, '0').then((response) => {
        this.randomNum = response.data
        console.info('获取随机数：' + this.randomNum)
        this.doSelectCert()
      }).catch(() => {
        this.loading = false
      })
    },
    doSelectCert() {
      // console.info('获取插件：document.getElementById(\'vctkobj\')')
      this.JITComVCTKEx = document.getElementById('vctkobj')
      // console.info('获取到的插件对象：' + this.JITComVCTKEx)
      const strCertType = 'SC'
      const InitParam = '<?xml version=\'1.0\' encoding=\'utf-8\'?><authinfo><liblist><lib type=\'CSP\' version=\'1.0\' dllname=\'\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib><lib type=\'SKF\' version=\'1.1\' dllname=\'bXRva2VuX2dtMzAwMF9KSVQuZGxs\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib><lib type=\'SKF\' version=\'1.1\' dllname=\'SERfR01DQUlTLmRsbA==\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib><lib type=\'SKF\' version=\'1.1\' dllname=\'U2h1dHRsZUNzcDExXzMwMDBHTS5kbGw=\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib><lib type=\'SKF\' version=\'1.1\' dllname=\'SklUR01LRVlfU0pLMTQyNC5kbGw=\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib><lib type=\'SKF\' version=\'1.1\' dllname=\'U0tGQVBJLmRsbA==\' ><algid val=\'SHA1\' sm2_hashalg=\'sm3\'/></lib></liblist></authinfo>'
      // const InitParam = '<?xml version=\"1.0\" encoding=\"utf-8\"?>\<authinfo><liblist>\<lib type=\"CSP\" version=\"1.0\" dllname=\"\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\<lib type=\"SKF\" version=\"1.1\" dllname=\"bXRva2VuX2dtMzAwMF9KSVQuZGxs\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\<lib type=\"SKF\" version=\"1.1\" dllname=\"SERfR01DQUlTLmRsbA==\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\<lib type=\"SKF\" version=\"1.1\" dllname=\"U2h1dHRsZUNzcDExXzMwMDBHTS5kbGw=\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\<lib type=\"SKF\" version=\"1.1\" dllname=\"SklUR01LRVlfU0pLMTQyNC5kbGw=\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\<lib type=\"SKF\" version=\"1.1\" dllname=\"U0tGQVBJLmRsbA==\" ><algid val=\"SHA1\" sm2_hashalg=\"sm3\"/></lib>\</liblist></authinfo>'
      // console.info('开始执行方法：this.JITComVCTKEx.Initialize(InitParam)')
      this.JITComVCTKEx.Initialize(InitParam)
      // console.info('执行成功')
      // console.info('开始判断：this.JITComVCTKEx.GetErrorCode() 返回：' + this.JITComVCTKEx.GetErrorCode())
      if (this.JITComVCTKEx.GetErrorCode() !== 0) {
        this.loading = false
        alert('初始化失败，错误码：' + this.JITComVCTKEx.GetErrorCode() + ' 错误信息：' + this.JITComVCTKEx.GetErrorMessage(this.JITComVCTKEx.GetErrorCode()))
        return
      }
      // console.info('开始执行方法：this.JITComVCTKEx.SetCertChooseType(1)')
      this.JITComVCTKEx.SetCertChooseType(1)
      // console.info('开始执行方法：this.JITComVCTKEx.SetCert(strCertType, \'\', \'\', \'\', \'\', \'\')')
      this.JITComVCTKEx.SetCert(strCertType, '', '', '', '', '')
      // console.info('开始判断：this.JITComVCTKEx.GetErrorCode() 返回：' + this.JITComVCTKEx.GetErrorCode())
      if (this.JITComVCTKEx.GetErrorCode() !== 0) {
        this.loading = false
        alert('错误码：' + this.JITComVCTKEx.GetErrorCode() + ' 错误信息：' + this.JITComVCTKEx.GetErrorMessage(this.JITComVCTKEx.GetErrorCode()))
        this.JITComVCTKEx.Finalize()
        return 1
      } else {
        // console.info('开始执行方法：this.doDisplayCertInfo()')
        this.doDisplayCertInfo()
      }
      // console.info('开始执行方法：this.JITComVCTKEx.Finalize()')
      this.JITComVCTKEx.Finalize()
      return 0
    },
    doDisplayCertInfo() {
      const strCertType = 'SC'
      const strCertOID = ''
      // console.info('开始执行方法：this.JITComVCTKEx.GetCertInfo(strCertType, 8, strCertOID)')
      // const strCertPEM_CONTENT = this.JITComVCTKEx.GetCertInfo(strCertType, 8, strCertOID)
      // console.info('获取到strCertPEM_CONTENT= ' + strCertPEM_CONTENT)
      // console.info('开始执行方法：this.JITComVCTKEx.GetCertInfo(strCertType, 0, strCertOID)')
      const strCertDN = this.JITComVCTKEx.GetCertInfo(strCertType, 0, strCertOID)
      // console.info('获取到strCertDN= ' + strCertDN)
      // console.info('开始判断：this.JITComVCTKEx.GetErrorCode() 返回：' + this.JITComVCTKEx.GetErrorCode())
      console.info('jitcomvctkex code:' + (this.JITComVCTKEx.GetErrorCode()))
      if (this.JITComVCTKEx.GetErrorCode() !== 0) {
        this.loading = false
        alert('错误码：' + this.JITComVCTKEx.GetErrorCode() + ' 错误信息：' + this.JITComVCTKEx.GetErrorMessage(this.JITComVCTKEx.GetErrorCode()))
      } else {
        // console.info('开始执行方法：this.JITComVCTKEx.DetachSignStr(\'\', this.randomNum)')
        const temp_DSign_Result = this.JITComVCTKEx.DetachSignStr('', this.randomNum)
        // console.info('获取到temp_DSign_Result= ' + temp_DSign_Result)
        // document.getElementById('original_jsp').value = Auth_Content
        // document.getElementById('signed_data').value = strCertPEM_CONTENT
        console.info('开始调用 uk/login 接口，执行UK登录')
        const _this = this
        this.$update('uk/login', { original_jsp: this.randomNum, uk: strCertDN, signed_data: temp_DSign_Result }, '0').then((response) => {
          console.info('接口返回数据：' + JSON.stringify(response))
          this.loading = false
          _this.$store.dispatch('UKLogin', response.data).then(() => {
            this.loading = false
            _this.$store.dispatch('GetInfo').then(() => {
              _this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
            sessionStorage.setItem('uk', strCertDN)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 显示下载提示页面
    openMask() {
      this.isShowMask = true // 显示下载提示页面
      this.isShowTopTit = true // 显示顶部标题
      this.isShowLogin = false // 隐藏登录页面
      this.isShowBotText = false // 隐藏底部文档下载提示文字
    },
    // 关闭下载提示页面
    close() {
      this.isShowMask = false // 隐藏下载提示页面
      this.isShowTopTit = false // 隐藏顶部标题
      this.isShowLogin = true // 隐藏登录页面
      this.isShowBotText = true // 显示底部文档下载提示文字
    },
    // 下载浏览器
    downloadBrowser() {
      this.$confirm('您确定要下载谷歌浏览器吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // window.location.href = this.downLoadUrl + 1
        window.open(this.downLoadUrl + '谷歌and插件and安装插件说明.zip')
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消下载'
        // })
      })
    },
    // 下载使用手册
    downloadManual() {
      this.$confirm('您确定要下载使用手册吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // window.location.href = this.downLoadUrl + 2
        window.open(this.downLoadUrl + '用户使用手册_[公安食药环侦实战应用平台建设].doc')
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消下载'
        // })
      })
    },
    // 复制链接
    copylink(event) {
      clip(this.inputData, event)
      console.log('复制')
    },
    floatTipMsg() {
      const L = 0
      const T = 0
      const R = document.body.clientWidth - this.tipMsg.obj.offsetWidth
      const B = document.body.clientHeight - this.tipMsg.obj.offsetHeight
      this.tipMsg.obj.style.left = (this.tipMsg.x + document.body.scrollLeft) + 'px'
      this.tipMsg.obj.style.top = (this.tipMsg.y + document.body.scrollTop) + 'px'
      this.tipMsg.x = this.tipMsg.x + this.tipMsg.step * (this.tipMsg.xin ? 1 : -1)
      if (this.tipMsg.x < L) {
        this.tipMsg.xin = true
        this.tipMsg.x = L
      }
      if (this.tipMsg.x > R) {
        this.tipMsg.xin = false
        this.tipMsg.x = R
      }
      this.tipMsg.y = this.tipMsg.y + this.tipMsg.step * (this.tipMsg.yin ? 1 : -1)
      if (this.tipMsg.y < T) {
        this.tipMsg.yin = true
        this.tipMsg.y = T
      }
      if (this.tipMsg.y > B) {
        this.tipMsg.yin = false
        this.tipMsg.y = B
      }
    },
    floatOver() {
      clearInterval(this.itl)
    },
    floatOut() {
      this.itl = setInterval(this.floatTipMsg, 20)
    },
    floatTipShow() {
      this.tipShow = true
    }
  },
  mounted() {
    this.tipMsg.obj = document.getElementById('tipImg')
    this.floatOut()
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
