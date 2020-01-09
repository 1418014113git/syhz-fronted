<template>
  <!-- 案件档案升级版 -->
  <div class="leftNav">
    <ul class="navList">
      <li v-for="(item,index) in navList" :key="index" :class="{'on':curClass === item.class}" @click="clickNav(item.class,index)" >
        <div>
          <img :src="item.icon">
          <span class="navName" :class="{'gray':item.number === 0 && index!==0 && index!==2 && index!==3 && index!==4}">{{item.name}}</span>
          <span class="number"  v-if="item.number>0 && item.number<99 && index!==0 && index!==2 && index!==3  && index!==4" >{{item.number}}</span>
          <span class="number pdm"  v-else-if="item.number>99 && index!==0 && index!==2 && index!==3  && index!==4">99+</span>
          <span class="numberzw" v-else></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js'
export default {
  props: ['ajbh'],
  name: 'caseFile',
  data() {
    return {
      curIndex: 0, // 菜单当前索引
      curClass: 'ajgg',
      navList: [
        { icon: '/static/image/caseFile_images/ajgg.png', name: '案件梗概', number: 0, type: 'aj0', class: 'ajgg' },
        { icon: '/static/image/caseFile_images/ydzc.png', name: '引导侦查', number: 0, type: 'aj1', class: 'ydzc' },
        { icon: '/static/image/caseFile_images/fadz.png', name: '发案地址', number: 0, type: 'aj2', class: 'fadz' },
        { icon: '/static/image/caseFile_images/swkx.png', name: '深挖扩线', number: 0, type: 'aj3', class: 'swkx' },
        { icon: '/static/image/caseFile_images/xxbc.png', name: '信息补采', number: 0, type: 'aj4', class: 'xxbc' },
        { icon: '/static/image/caseFile_images/bzts.png', name: '比中推送', number: 0, type: 'aj5', class: 'bzts' },
        { icon: '/static/image/caseFile_images/jcj.png', name: '接处警', number: 0, type: 'aj6', class: 'jcj' },
        // { icon: '/static/image/caseFile_images/xsgl.png', name: '线索关联', number: 0, type: 'aj7', class: 'xsgl' },
        { icon: '/static/image/caseFile_images/zcxz.png', name: '侦查协作', number: 0, type: 'aj8', class: 'zcxz' },
        { icon: '/static/image/caseFile_images/ajcb.png', name: '案件串并', number: 0, type: 'aj9', class: 'ajcb' }
      ]
    }
  },
  computed: {
    getModuleClass() {
      return this.$store.state.app.ajmoduleClass
    }
  },
  watch: {
    getModuleClass(val) {
      this.getCurItem(val)
    },
    ajbh(val) {
      this.getItemTotal() // 获取菜单对应的内容条数
    }
  },
  methods: {
    init() {
      this.getItemTotal() // 获取菜单对应的内容条数
    },
    clickNav(selector, index) {
      // this.curIndex = index
      Bus.$emit('bqType', 'first') // 定位到侦查协作初始化时的状态
      this.curClass = selector
      this.$store.dispatch('Ajdatotop', selector)
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
          this.curClass = className
        }
      })
    },
    clearSession() {
      sessionStorage.removeItem('aj1')
      sessionStorage.removeItem('aj5')
      sessionStorage.removeItem('aj6')
      sessionStorage.removeItem('aj7')
      sessionStorage.removeItem('aj8')
      sessionStorage.removeItem('aj9')
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.leftNav {
  width: 100%;
  max-height: 100%;
  padding: 25px 0;
  overflow: auto;
  border: 2px solid rgb(0, 160, 233);
  border-radius: 8px;
  .navList {
    width: 100%;
    li {
      width: 100%;
      padding: 8px 0;
      cursor: pointer;
      div {
        width: 61%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        img {
          width: 21px;
          height: 21px;
          margin-top: 2px;
        }
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
  // .leftNav .navList li div {
  //   width: 60%;
  // }
}
</style>

