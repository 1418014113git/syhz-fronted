<template>
<div class="WorkMenuMask">
  <div class="WorkMenu">
    <div class="WorkMenuTitle">
      <span>我的工作台</span>
      <span class="edit" @click="edit">编辑</span>
    </div>
    <div class="MenuWrap" v-if="!isShowMenuList">
      <div class="MenuBox">
        <ul class="collectList">  <!--收藏列表区-->
          <li v-for="(item,index) in collectList" :key="index"  @click="clickMenu(item)">
            <div>
              <div class="imgBox">
                <img :src="item.icon | join"  class="collectIcon">
              </div>
              <span>{{item.name}}</span>
            </div>
          </li>
        </ul>
        <!--菜单列表区-->
        <div class="MenuArea">
          <div class="mb10"><!--舆情分析-->
            <p class="MenuTit">舆情分析</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in zhypData" :key="index" @click="clickMenu(item)">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10">  <!--案件管理-->
            <p class="MenuTit">案件管理</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in ajglData" :key="index"  @click="clickMenu(item)">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10"><!--基础业务-->
            <p class="MenuTit">基础业务</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in zxrwData" :key="index"  @click="clickMenu(item)">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10"><!--刑嫌信息-->
            <p class="MenuTit">刑嫌信息</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in jcxxcjData" :key="index"  @click="clickMenu(item)">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10"> <!--检验鉴定-->
            <p class="MenuTit">检验鉴定</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in jyjdData" :key="index"  @click="clickMenu(item)">
                <div >
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10">  <!--教育训练-->
            <p class="MenuTit">教育训练</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in bazyData" :key="index"  @click="clickMenu(item)">
                <div >
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10"> <!--情报管理-->
            <p class="MenuTit">情报管理</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in qbcjfxData" :key="index" @click="clickMenu(item)">
                <div >
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb10"> <!--系统对接-->
            <p class="MenuTit">系统对接</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in xtdjData" :key="index" @click="clickMenu(item)">
                <div >
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="mb20"><!--其他-->
            <p class="MenuTit">其他</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in otherjData"  :key="index" @click="clickMenu(item)">
                <div >
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
       <div class="btnArea"> <!--按钮区-->
        <el-row type="flex" justify="center" class="btnMt">
          <div class="cancel"  @click="close">关闭</div>
        </el-row>
      </div>
    </div>
     <workMenu-edit v-if="isShowMenuList" :collectListData="collectList"></workMenu-edit>
  </div>
</div>
</template>
<script>
import WorkMenuEdit from './WorkMenuEdit'
export default {
  data() {
    return {
      userId: sessionStorage.getItem('userId'), // 获取userId
      collectList: [], // 收藏菜单工作台未展示的剩余菜单
      isShowMenuList: this.$store.state.app.ISshowWorkMenu, // 是否显示工作台编辑菜单，此变量控制工作台菜单页面和菜单编辑页面的显隐状态
      zhypData: [], // 舆情分析
      ajglData: [], // 案件管理
      zxrwData: [], // 刑嫌信息
      jyjdData: [], // 检验鉴定
      bazyData: [], // 教育训练
      qbcjfxData: [], // 情报管理
      jcxxcjData: [], // 刑嫌信息
      otherjData: [], // 其他
      xtdjData: [], // 系统对接
      codeList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'K', 'M'] // 菜单类型编码
    }
  },
  components: {
    WorkMenuEdit
  },
  filters: {
    join(value) {
      return '/static/image/portal_newImg/' + value + '.png'
    }
  },
  computed: {
    getIsShowWorkMenu() {
      return this.$store.state.app.ISshowWorkMenu
    }
  },
  watch: {
    getIsShowWorkMenu(val) { // 监听state状态变化
      // console.log('workval', val)
      this.isShowMenuList = val
      this.init()
    }
  },
  methods: {
    init() { // 查询收藏列表
      this.initData() // 初始化数据
      var params = { userId: this.userId }
      this.$query('follow', params).then((response) => {
        if (response.data && response.data.length > 0) {
          this.dealMenData(response.data) // 如果有收藏菜单，则对菜单进行处理
        }
      })
      this.getAllMenus() // 根据menuCode将其数据遍历后塞入对应的数组中
    },
    initData() {
      this.collectList = []
      this.zhypData = []
      this.ajglData = []
      this.zxrwData = []
      this.jyjdData = []
      this.bazyData = []
      this.qbcjfxData = []
      this.jcxxcjData = []
      this.otherjData = []
    },
    getAllMenus() {
      var datas = this.comData()
      this.getDealAllMenus(datas)
    },
    dealMenData(collectData) { // 有收藏菜单时的数据处理
      var allMenData = this.comData() // 获取处理后的权限菜单列表
      for (var i = 0; i < collectData.length; i++) {
        for (var j = 0; j < allMenData.length; j++) {
          if (collectData[i].menuCode === allMenData[j].menuCode) {
            collectData[i].type = 0 // 设置减号图标
            collectData[i].isShow = true // 显示收藏列表
          }
        }
      }
      this.collectList = collectData
    },
    comData() {
      var allMenData = JSON.parse(sessionStorage.getItem('menusData')) // 获取处理后的权限菜单列表
      var filterData = []
      for (var i = 0; i < allMenData.length; i++) {
        if (this.codeList.indexOf(allMenData[i].menuCode.substring(0, 1)) !== -1) {
          if (allMenData[i].children && allMenData[i].children.length > 0) {
            var children = allMenData[i].children
            for (var j = 0; j < children.length; j++) {
              if (!children[j].icon || this.$store.state.app.menuIcons.indexOf(children[j].icon) === -1) {
                children[j].icon = 'afqs'
              }
              children[j].type = 1 // 默认显示添加图标
              children[j].isShow = true // 默认显示当前列表
              filterData.push(children[j])
            }
          } else {
            allMenData[i].name = allMenData[i].menuName
            allMenData[i].path = allMenData[i].url
            if (!allMenData[i].icon || this.$store.state.app.menuIcons.indexOf(allMenData[i].icon) === -1) {
              allMenData[i].icon = 'afqs'
            }
            allMenData[i].type = 1 // 默认显示添加图标
            allMenData[i].isShow = true // 默认显示当前列表
            filterData.push(allMenData[i])
          }
        }
      }
      return filterData
    },
    getDealAllMenus(datas) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].menuCode.length > 1) {
          if (datas[i].menuCode.substring(0, 1) === 'A') {
            this.zhypData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'B') {
            this.ajglData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'C') {
            this.zxrwData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'E') {
            this.jyjdData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'F') {
            this.bazyData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'G') {
            this.qbcjfxData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'D') {
            this.jcxxcjData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'K') {
            this.otherjData.push(datas[i])
          }
          if (datas[i].menuCode.substring(0, 1) === 'M') {
            this.xtdjData.push(datas[i])
          }
        }
      }
    },
    clickMenu(item) {
      const _this = this
      var menuCode = item.menuCode.substring(0, 1)
      if (menuCode !== 'K') {
        this.$store.dispatch('AppCode', menuCode)
      } else {
        this.$store.dispatch('AppCode', '')
      }

      _this.$router.push({ path: item.path })
    },
    edit() {
      // console.log('编辑')
      if (!this.isShowMenuList) {
        this.$store.dispatch('ISshowWorkMenu', true)
      } else {
        this.$store.dispatch('ISshowWorkMenu', false)
      }
    },
    close() {
      this.$store.dispatch('ClickAll', false)
      this.$store.dispatch('ReReqCollect', true)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.WorkMenuMask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  .WorkMenu {
    width: 80%;
    // height: 90%;
    overflow: hidden;
    margin: 4vh auto 0 auto;
    border-radius: 8px;
    border: 2px solid #00a0e9;
    background: rgba(0, 89, 130, 0.7);
    z-index: 300;
    vertical-align: middle;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    padding-bottom: 10px;
    ul {
      overflow: hidden;
      padding-left: 20px;
    }
    .WorkMenuTitle {
      height: 30px;
      line-height: 30px;
      padding-left: 60px;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      background: url("/static/image/portal_newImg/workMenuTitBg.png") no-repeat
        center center;
      background-size: 98% 100%;
      overflow: hidden;
    }
    li {
      float: left;
      text-align: center;
      // margin: 2px 33px 0 0;
      cursor: pointer;
      div {
        margin: 2px 33px 0 0;
      }
    }
    .imgBox {
      position: relative;
      width: 50px;
      margin: 0 auto;
      .collectIcon {
        width: 30px;
        display: block;
        margin: 0 auto;
      }
    }
    .MenuWrap {
      padding: 0 15px;
      // height: 800px;
      // overflow: auto;
    }
    .MenuBox {
      height: 80vh;
      overflow: auto;
    }
    .MenuArea {
      //  padding: 15px 15px 12px 15px;
      .MenuTit {
        padding: 6px 10px;
        position: relative;
        &::before {
          display: inline-block;
          content: "";
          width: 6px;
          height: 17px;
          background: #00a0e9;
          position: absolute;
          left: 0;
          top: 7px;
        }
      }
    }
    .collectList {
      margin: 0;
      padding: 5px 0;
      //  li{
      //    margin: 2px 28px 0 0;
      //  }
    }
    .btnArea {
      border-top: 2px solid #00a0e9;
      color: #fff;
      padding: 6px 0 0 0;
      .cancel,
      .save {
        width: 100px;
        text-align: center;
        padding: 4px 0;
        background-color: rgba(0, 89, 130, 0.6);
        border-radius: 18px;
        border: solid 1px rgba(0, 160, 233, 0.6);
        cursor: pointer;
      }
      .cancel:hover,
      .save:hover {
        border: solid 1px rgb(0, 160, 233);
        color: #bce8fc;
      }
      .cancel {
        margin-right: 15px;
      }
      .save {
        background-color: rgba(0, 160, 233, 0.6);
      }
      .save:hover {
        background-color: rgb(0, 160, 233);
      }
      .btnMt {
        margin-top: 3px;
      }
    }
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .crowIcon {
    width: 15px !important;
    position: absolute;
    right: -5px;
    top: 0;
  }
  .edit {
    float: right;
    margin-right: 26px;
    cursor: pointer;
  }
}

@media only screen and (max-width: 1367px) {
  .WorkMenu {
    font-size: 12px;
  }
  .WorkMenuMask .WorkMenu {
    // height: 93%;
  }
  .WorkMenuMask .WorkMenu .MenuArea {
    // padding: 0px 12px;
  }
  .WorkMenuMask .WorkMenu .MenuArea .MenuTit {
    padding: 2px 10px;
  }
  .WorkMenuMask .WorkMenu .MenuArea .MenuTit::before {
    width: 5px;
    height: 13px;
    top: 4px;
  }
  .WorkMenuMask .mb20 {
    margin-bottom: 10px;
  }
  .WorkMenuMask .WorkMenu li {
    // margin: 2px 19px 0 0;
  }
  .WorkMenuMask .WorkMenu .imgBox .collectIcon {
    width: 23px;
  }
  .WorkMenuMask .crowIcon {
    width: 10px !important;
    right: 4px;
  }

  .WorkMenuMask .WorkMenu .collectList li {
    // margin: 2px 20px 0 0;
  }
  .WorkMenuMask .edit {
    margin-right: 15px;
  }
  .WorkMenuMask .WorkMenu .MenuWrap {
    // height: 95%;
  }
  .WorkMenuMask .WorkMenu .WorkMenuTitle {
    padding-left: 46px;
  }
  .WorkMenuMask .WorkMenu .MenuBox {
    height: 500px;
  }
}
</style>

