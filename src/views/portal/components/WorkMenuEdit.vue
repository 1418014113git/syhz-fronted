<template>
  <div class="MenuWrap">
    <div class="MenuBox">
      <ul class="collectList">  <!--收藏列表区-->
        <li v-for="(item,index) in collectList" :key="index"   @click="clickColMenu(item)">
          <transition name="el-fade-in-linear" v-if="item.isShow">
            <div>
              <div class="imgBox">
                <img :src="item.icon | join"  class="collectIcon">
                <img class="crowIcon"  v-if="item.type===0"  src="/static/image/portal_newImg/cancel.png">
              </div>
              <span>{{item.name}}</span>
            </div>
          </transition>
        </li>
      </ul>
     <!--菜单列表区-->
      <div class="MenuArea">
        <div class="mb10"><!--舆情分析-->
          <p class="MenuTit">舆情分析</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in zhypData" :key="index"   @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                    <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                    <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb10">  <!--案件管理-->
          <p class="MenuTit">案件管理</p>
          <ul class="WorkMenuUl"  >
            <li v-for="(item,index) in ajglData" :key="index"  @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div>
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb10"><!--基础业务-->
          <p class="MenuTit">基础业务</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in zxrwData" :key="index"  @click="clickMenu(item)">
              <transition name="el-fade-in-linear"  v-if="item.isShow">
              <div>
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
         <div class="mb10"><!--刑嫌信息-->
            <p class="MenuTit">刑嫌信息</p>
            <ul class="WorkMenuUl">
              <li v-for="(item,index) in jcxxcjData" :key="index"  @click="clickMenu(item)">
                <transition name="el-fade-in-linear"  v-if="item.isShow">
                <div>
                  <div class="imgBox">
                    <img :src="item.icon | join"  class="collectIcon">
                    <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                    <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </transition>
              </li>
            </ul>
          </div>
        <div class="mb10"> <!--检验鉴定-->
          <p class="MenuTit">检验鉴定</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in jyjdData" :key="index"   @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div >
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb10">  <!--教育训练-->
          <p class="MenuTit">教育训练</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in bazyData" :key="index"    @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div >
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb10"> <!--情报管理-->
          <p class="MenuTit">情报管理</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in qbcjfxData"  :key="index" @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div >
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb10"> <!--系统对接-->
          <p class="MenuTit">系统对接</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in xtdjData"  :key="index" @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div >
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="mb20"><!--其他-->
          <p class="MenuTit">其他</p>
          <ul class="WorkMenuUl">
            <li v-for="(item,index) in otherjData"  :key="index"  @click="clickMenu(item)">
              <transition name="el-fade-in-linear" v-if="item.isShow">
              <div >
                <div class="imgBox">
                  <img :src="item.icon | join"  class="collectIcon">
                  <img class="crowIcon"  v-if="item.type===1"  src="/static/image/portal_newImg/add.png">
                  <img class="crowIcon"  v-if="item.type===2"  src="/static/image/portal_newImg/check.png">
                </div>
                <span>{{item.name}}</span>
              </div>
              </transition>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btnArea"> <!--按钮区-->
      <el-row type="flex" justify="center" class="btnMt">
          <div class="cancel"  @click="cancel">关闭</div>
          <!-- <div class="save"  @click="cancel">保存</div> -->
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ['collectListData'],
  data() {
    return {
      userId: sessionStorage.getItem('userId'), // 获取userId
      zhypData: [], // 舆情分析
      ajglData: [], // 案件管理
      zxrwData: [], // 基础业务
      jyjdData: [], // 检验鉴定
      bazyData: [], // 教育训练
      qbcjfxData: [], // 情报管理
      jcxxcjData: [], // 基础信息采集
      otherjData: [], // 其他
      xtdjData: [], // 系统对接
      codeList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'K', 'M'], // 菜单类型编码
      collectList: [] // 手动添加的收藏菜单
    }
  },
  filters: {
    join(value) {
      return '/static/image/portal_newImg/' + value + '.png'
    }
  },
  watch: { // 监听state状态变化
    collectListData: {
      handler: function(val, oldeval) {
        this.init()
      }
    }
  },
  methods: {
    init() { // 查询收藏列表
      this.initData() // 初始化数据
      if (this.collectListData.length > 0) {
        this.dealMenData(this.collectListData) // 如果有收藏菜单，则对菜单进行处理
      } else {
        this.getAllMenus() // 根据menuCode将其数据遍历后塞入对应的数组中
      }
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
    getAllMenus() { // 没有收藏菜单时的数据处理
      var datas = this.comData()
      this.getDealAllMenus(datas)
    },
    dealMenData(collectData) { // 有收藏菜单时的数据处理
      var allMenData = this.comData() // 获取处理后的权限菜单列表
      for (var i = 0; i < collectData.length; i++) {
        for (var j = 0; j < allMenData.length; j++) {
          if (collectData[i].menuCode === allMenData[j].menuCode) {
            allMenData[j].type = 2 // 收藏状态
            allMenData[j].id = collectData[i].id // 将收藏菜单id赋值给菜单id
          }
        }
      }
      this.getDealAllMenus(allMenData)
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
      this.getCollectData()
    },
    getCollectData() {
      var allMenData = this.comData()
      var collectListData = this.collectListData
      for (var t = 0; t < allMenData.length; t++) {
        allMenData[t].isShow = false
        allMenData[t].type = 0
      }
      for (var i = 0; i < collectListData.length; i++) {
        for (var j = 0; j < allMenData.length; j++) {
          if (collectListData[i].menuCode === allMenData[j].menuCode) {
            allMenData[j].isShow = true
            allMenData[j].id = collectListData[i].id
          }
        }
      }
      this.collectList = allMenData
    },
    clickMenu(item) {
      if (item.type === 1) { // 1:代表当前菜单右上角的图标是+号，可以添加到收藏列表中
        item.isShow = false // 点击后当前图标消失，在收藏列表中显示
        for (var i = 0; i < this.collectList.length; i++) {
          if (this.collectList[i].menuCode === item.menuCode) {
            this.collectList[i].isShow = true
            this.collectList[i].type = 0
          }
        }
        var params = {
          name: item.name,
          path: item.path,
          icon: item.icon,
          sort: 0, // 固定不定
          enable: 0, // 固定不定
          userId: this.userId,
          menuCode: item.menuCode
        }
        this.$save('follow', params).then((response) => { // 添加收藏
          // this.$message({
          //   message: '添加收藏',
          //   type: 'success'
          // })
        })
      } else if (item.type === 2) { // 2: 代表当前菜单右上角的图标是对号，表示目前菜单是收藏状态，点击后请求取消收藏接口，取消成功后变成+号
        this.$remove('follow/' + item.id, {}).then((response) => {
          item.type = 1
          // this.$message({
          //   message: '取消收藏',
          //   type: 'success'
          // })
        })
      }
    },
    clickColMenu(item) {
      item.isShow = false
      this.$remove('follow/' + item.id, {}).then((response) => {
        item.type = 1
      })
      for (var i = 0; i < this.zhypData.length; i++) {
        if (item.menuCode === this.zhypData[i].menuCode) {
          this.zhypData[i].isShow = true
          this.zhypData[i].type = 1
          return
        }
      }
      for (var j = 0; j < this.ajglData.length; j++) {
        if (item.menuCode === this.ajglData[j].menuCode) {
          this.ajglData[j].isShow = true
          this.ajglData[j].type = 1
          return
        }
      }
      for (var k = 0; k < this.zxrwData.length; k++) {
        if (item.menuCode === this.zxrwData[k].menuCode) {
          this.zxrwData[k].isShow = true
          this.zxrwData[k].type = 1
          return
        }
      }
      for (var l = 0; l < this.jyjdData.length; l++) {
        if (item.menuCode === this.jyjdData[l].menuCode) {
          this.jyjdData[l].isShow = true
          this.jyjdData[l].type = 1
          return
        }
      }
      for (var m = 0; m < this.bazyData.length; m++) {
        if (item.menuCode === this.bazyData[m].menuCode) {
          this.bazyData[m].isShow = true
          this.bazyData[m].type = 1
          return
        }
      }
      for (var n = 0; n < this.qbcjfxData.length; n++) {
        if (item.menuCode === this.qbcjfxData[n].menuCode) {
          this.qbcjfxData[n].isShow = true
          this.qbcjfxData[n].type = 1
          return
        }
      }
      for (var p = 0; p < this.jcxxcjData.length; p++) {
        if (item.menuCode === this.jcxxcjData[p].menuCode) {
          this.jcxxcjData[p].isShow = true
          this.jcxxcjData[p].type = 1
          return
        }
      }
      for (var q = 0; q < this.otherjData.length; q++) {
        if (item.menuCode === this.otherjData[q].menuCode) {
          this.otherjData[q].isShow = true
          this.otherjData[q].type = 1
          return
        }
      }
      for (var s = 0; s < this.xtdjData.length; s++) {
        if (item.menuCode === this.xtdjData[s].menuCode) {
          this.xtdjData[s].isShow = true
          this.xtdjData[s].type = 1
          return
        }
      }
    },
    cancel() {
      this.$store.dispatch('ClickAll', false)
      this.$store.dispatch('ReReqCollect', true)
      this.$store.dispatch('ISshowWorkMenu', false)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
</style>

