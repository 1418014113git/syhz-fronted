<template>
  <div class="caseAssist_leftNavPer" v-loading="loading">
    <ul class="navList">
      <li v-for="(item,index) in navList" :key="index" :class="{'on':curClass === item.class}" @click="clickNav(item.class,index)" >
        <div>
          <span class="navName" :class="{'gray':item.number === 0 && index!==0}">{{item.name}}</span>
          <span class="number"  v-if="item.number>0 && item.number<99 && index!==0" >{{item.number}}</span>
          <span class="number pdm"  v-else-if="item.number>99 && index!==0">99+</span>
          <span class="numberzw" v-else></span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['assistId'],
  name: 'personnelFile',
  data() {
    return {
      baseInfo: {}, // 基础信息
      curUser: {}, // sessionStorage获取用户信息
      curDept: {}, // sessionStorage获取机构信息
      curIndex: 0, // 菜单当前索引
      curClass: 'baseInfo',
      loading: false, // 页面加载进度条
      navList: [
        { name: '基本信息', number: 0, type: 'assistT0', class: 'baseInfo' },
        { name: '审核信息', number: 0, type: 'assistT1', class: 'auditInfo' },
        { name: '地市签收', number: 0, type: 'assistT2', class: 'signInfo' },
        { name: '地市反馈', number: 0, type: 'assistT3', class: 'feedbackInfo' }
      ]
    }
  },
  computed: {
    getModuleClass() {
      return this.$store.state.app.moduleClass
    }
  },
  watch: {
    getModuleClass(val) {
      this.getCurItem(val)
    },
    assistId(val) {
      this.baseInfo = {}
      if (val) {
        this.cardNumber = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.getItemTotal() // 获取菜单对应的内容条数
    },
    clickNav(selector, index) {
      this.curClass = selector
      this.$store.dispatch('Personeltotop', selector)
    },
    getItemTotal() {
      this.clearSession()
      window.addEventListener('setItem', () => {
        this.navList.forEach(item => {
          const type = item.type
          if (sessionStorage.getItem(type)) {
            item.number = parseInt(sessionStorage.getItem(type))
          }
        })
      })
    },
    getCurItem(val) {
      this.navList.forEach((item, i) => {
        const className = item.class
        if (className === val) {
          this.curClass = val
        }
      })
    },
    clearSession() {
      sessionStorage.removeItem('assistT1')
      sessionStorage.removeItem('assistT2')
      sessionStorage.removeItem('assistT3')
      sessionStorage.removeItem('assistT4')
      sessionStorage.removeItem('assistT5')
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '1') { // 总队
        this.navList[2].name = '地市签收'
        this.navList[3].name = '地市反馈'
      } else if (this.curDept.depType === '2' && this.curDept.areaCode !== '611400' && this.curDept.areaCode !== '616200') { // 支队 并且 不是杨凌 不是西咸
        this.navList.push({ name: '区县签收', number: 0, type: 'assistT4', class: 'signInfo_area' })
        this.navList.push({ name: '区县反馈', number: 0, type: 'assistT5', class: 'feedbackInfo_area' })
      } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 大队，派出所
        this.navList[2].name = '区县签收'
        this.navList[3].name = '区县反馈'
      }
    }
    if (this.assistId) { // 正式
      this.cardNumber = this.assistId
    }
    this.init()
  }
}
</script>
<style>
  .caseAssist_leftNavPer {
    width: 100%;
    max-height: 100%;
    overflow: auto;
    border: 2px solid rgb(0, 160, 233);
    border-radius: 6px;
  }
  .caseAssist_leftNavPer .NameWrap {
    width: 100%;
    padding: 0 15px;
  }
  .caseAssist_leftNavPer .NameWrap .NameBox {
    width: 100%;
    height: 37px;
    padding: 6px 0;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    border-bottom: 2px solid rgb(0, 160, 233);
    overflow: hidden;
  }
  .caseAssist_leftNavPer .NameWrap .NameBox .p1 {
    float: left;
  }
  .caseAssist_leftNavPer .NameWrap .NameBox .p2 {
    float: right;
  }
  .caseAssist_leftNavPer .NameWrap .NameBox .p2 span {
    font-size: 14px;
  }
  .caseAssist_leftNavPer .NamePhoto {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px 0;
  }
  .caseAssist_leftNavPer .NamePhoto .photoBox {
    width: 124px;
    height: 158px;
    border: 1px solid #12acdf;
    margin-bottom: 20px;
  }
  .caseAssist_leftNavPer .NamePhoto .photoBox img {
    width: 100%;
    height: 100%;
  }
  .caseAssist_leftNavPer .NamePhoto .personType1, .caseAssist_leftNavPer .NamePhoto .personType2 {
    width: 126px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: #ff8a00;
    border-radius: 4px;
  }
  .caseAssist_leftNavPer .NamePhoto .personType1 {
    background-color: #ff8a00;
  }
  .caseAssist_leftNavPer .NamePhoto .personType2 {
    background-color: #0084e9;
  }
  .caseAssist_leftNavPer .navList {
    width: 100%;
  }
  .caseAssist_leftNavPer .navList li {
    width: 100%;
    padding: 5px 0;
    cursor: pointer;
  }
  .caseAssist_leftNavPer .navList li div {
    text-align: center;
    height: 26px;
    line-height: 26px;
  }
  .caseAssist_leftNavPer .navList li div .navName {
    letter-spacing: 2px;
    text-shadow: 0 0 2px #fff;
    margin: 0 5px;
    font-weight: 600;
  }
  .caseAssist_leftNavPer .navList li div .number {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background-color: #00a0e9;
    font-size: 12px;
    border-radius: 18px;
    position: relative;
    top: -2px;
    padding-right: 0;
  }
  .caseAssist_leftNavPer .navList li.on div .number {
    background-color: #fff;
    color: #00a0e9;
  }
  .caseAssist_leftNavPer .navList li div .numberzw {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  .caseAssist_leftNavPer .on {
    background-color: #00a0e9;
    color: #fff;
  }
  .caseAssist_leftNavPer .on .gray {
    color: #fff !important;
  }
  .caseAssist_leftNavPer .pdm {
    width: 21px !important;
  }
  .caseAssist_leftNavPer .gray {
    color: rgba(255, 255, 255, 0.5) !important;
    text-shadow: 0 0 0 transparent !important;
  }
  @media only screen and (max-width: 1367px) {
    .caseAssist_leftNavPer .leftCont {
      margin-right: 9px;
    }
  }
</style>

