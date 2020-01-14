<template>
  <!-- 集群战役详情页 -->
  <div class="jqzyLeftNav" v-loading="loading">
    <ul class="navList">
      <li v-for="(item,index) in navList" :key="index" :class="{'on':curClass === item.class}" @click="clickNav(item.class,index)" >
        <div v-if="item.show">
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
  props: ['info'],
  name: 'personnelFile',
  data() {
    return {
      baseInfo: {}, // 基础信息
      curUser: {}, // sessionStorage获取用户信息
      curDept: {}, // sessionStorage获取机构信息
      curIndex: 0, // 菜单当前索引
      curClass: 'jbxx',
      loading: false, // 页面加载进度条
      navList: [],
      navList1: [ // 总队,杨凌支队，杨凌派出所
        { name: '基本信息', number: 0, type: 't0', class: 'jbxx', show: true },
        { name: '审核信息', number: 0, type: 't1', class: 'shxx', show: false },
        { name: '地市签收', number: 0, type: 't2', class: 'dsqs', show: true },
        { name: '地市反馈', number: 0, type: 't3', class: 'dsfk', show: true }
      ],
      navList2: [ // 大队，派出所
        { name: '基本信息', number: 0, type: 't0', class: 'jbxx', show: true },
        { name: '审核信息', number: 0, type: 't1', class: 'shxx', show: false },
        { name: '区县签收', number: 0, type: 't4', class: 'qxqs', show: true },
        { name: '区县反馈', number: 0, type: 't5', class: 'qxfk', show: true }
      ],
      navList3: [ // 非杨凌的支队
        { name: '基本信息', number: 0, type: 't0', class: 'jbxx', show: true },
        { name: '审核信息', number: 0, type: 't1', class: 'shxx', show: false },
        { name: '地市签收', number: 0, type: 't2', class: 'dsqs', show: true },
        { name: '地市反馈', number: 0, type: 't3', class: 'dsfk', show: true },
        { name: '区县签收', number: 0, type: 't4', class: 'qxqs', show: true },
        { name: '区县反馈', number: 0, type: 't5', class: 'qxfk', show: true }
      ]
    }
  },
  computed: {
    getModuleClass() {
      return this.$store.state.app.jqmoduleClass
    }
  },
  watch: {
    getModuleClass(val) {
      this.getCurItem(val)
    },
    info(val) {
      if (val.clusterId) {
        this.baseInfo = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.navList.forEach(item => {
        if (item.class === 'shxx') { // 如果是下发（部下发）时，隐藏审核（包括导航和页面的签） 1.  部下发 ， 2 下发 ， 3  申请
          if (this.baseInfo.category === 3) {
            item.show = true
          } else {
            item.show = false
          }
        }
      })
      this.getItemTotal() // 获取菜单对应的内容条数
    },
    clickNav(selector, index) {
      // this.curIndex = index
      this.curClass = selector
      this.$store.dispatch('Personeltotop', selector)
    },
    getItemTotal() {
      this.clearSession()
      window.addEventListener('setItem', () => {
        this.navList.forEach(item => {
          var type = item.type
          if (sessionStorage.getItem(type)) {
            item.number = parseInt(sessionStorage.getItem(type))
          }
        })
      })
    },
    getCurItem(val) {
      this.navList.forEach((item, i) => {
        var className = item.class
        if (className === val) {
          // this.curIndex = i
          this.curClass = val
        }
      })
    },
    clearSession() {
      sessionStorage.removeItem('t1')
      sessionStorage.removeItem('t2')
      sessionStorage.removeItem('t3')
      sessionStorage.removeItem('t4')
      sessionStorage.removeItem('t5')
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    var navList = []
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '1' || this.curDept.areaCode.substring(0, 4) === '6114') { // 总队、杨凌支队、杨凌派出所(杨凌派出所和杨凌支队同权限)
        navList = this.navList1 // 显示地市签收、反馈左侧菜单
      } else if (this.curDept.depType === '2' && this.curDept.areaCode.substring(0, 4) !== '6114') { // 非杨凌的支队
        navList = this.navList3 // 显示地市签收、反馈，区县签收、反馈右侧列表
      } else if (this.curDept.depType === '3' || (this.curDept.depType === '4' && this.curDept.areaCode.substring(0, 4) !== '6114')) { // 大队，非杨凌的派出所
        navList = this.navList2 // 显示区县签收、反馈右侧列表
      }
      navList.forEach(item => {
        if (item.class === 'shxx') { // 如果是下发（部下发）时，隐藏审核（包括导航和页面的签） 1.  部下发 ， 2 下发 ， 3  申请
          if (this.baseInfo.category === 3) {
            item.show = true
          } else {
            item.show = false
          }
        }
      })
      this.navList = navList
    }
    if (this.info.clusterId) {
      this.baseInfo = this.info
      this.init()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.jqzyLeftNav {
  width: 100%;
  max-height: 100%;
  // padding-bottom: 25px;
  overflow: auto;
  border: 2px solid rgb(0, 160, 233);
  border-radius: 6px;
  .NameWrap {
    width: 100%;
    padding: 0 15px;
    .NameBox {
      width: 100%;
      height: 37px;
      padding: 6px 0;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      border-bottom: 2px solid rgb(0, 160, 233);
      overflow: hidden;
      .p1 {
        float: left;
      }
      .p2 {
        float: right;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .NamePhoto {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px 0;
    .photoBox {
      width: 124px;
      height: 158px;
      border: 1px solid #12acdf;
      margin-bottom: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .personType1,
    .personType2 {
      width: 126px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      background-color: #ff8a00;
      border-radius: 4px;
    }
    .personType1 {
      background-color: #ff8a00;
    }
    .personType2 {
      background-color: #0084e9;
    }
  }
  // .navList {
  //   width: 100%;
  //   li {
  //     width: 100%;
  //     padding: 5px 0;
  //     cursor: pointer;
  //     div {
  //       text-align: center;
  //       // width: 61%;
  //       // margin: 0 auto;
  //       // display: flex;
  //       // justify-content: space-around;
  //       .navName {
  //         letter-spacing: 2px;
  //         text-shadow: 0 0 2px #fff;
  //         // margin: 0 5px;
  //         font-weight: 600;
  //       }
  //       .number {
  //         // display: inline-block;
  //         // width: 18px;
  //         // height: 17px;
  //         // line-height: 18px;
  //         // text-align: center;
  //         // background-color: #00a0e9;
  //         font-size: 12px;
  //         // border-radius: 18px;
  //         margin-top: 3px;
  //         display: inline-block;
  //         width: 20px;
  //         height: 20px;
  //       }
  //       .numberzw {
  //         display: inline-block;
  //         width: 20px;
  //         height: 20px;
  //       }
  //     }
  //   }
  // }
  .navList {
    width: 100%;
    li {
      width: 100%;
      cursor: pointer;
      div {
        text-align: center;
        padding: 5px 0;
        .navName {
          letter-spacing: 2px;
          text-shadow: 0 0 2px #fff;
          margin: 0 5px;
          font-weight: 600;
        }
        .number {
          display: inline-block;
          width: 18px;
          height: 17px;
          line-height: 18px;
          text-align: center;
          background-color: #00a0e9;
          font-size: 12px;
          border-radius: 18px;
          margin-top: 3px;
        }
        .numberzw {
          display: inline-block;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
.on {
  background-color: #00a0e9;
  color: #fff;
  .gray {
    color: #fff !important;
  }
}
.pdm {
  width: 21px !important;
}
.gray {
  color: rgba(255, 255, 255, 0.5) !important;
  text-shadow: 0 0 0 transparent !important;
}
@media only screen and (max-width: 1367px) {
  .leftCont {
    margin-right: 9px;
  }
}
</style>

