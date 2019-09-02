<template>
<!-- 比中推送 -->
  <div class="bzPush">
    <div class="cell_title">
      <span class="small_line"></span>
      <span class="text">比中推送</span>
    </div>
    <div class="bg bzPushCont">
      <el-tabs class="bzPushTab"  v-model="activeName">
        <el-tab-pane label="" name="first">
          <div slot="label">
            <p :class="{'noData':personCaseTotal===0}" class="tabTit">人案关联引擎</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_line" alt="" srcset="">
          </div>
          <person-case  :ajbh="AJBH" @personCaseNum="getPersonCaseTotal"></person-case>
        </el-tab-pane>
      </el-tabs>
     </div>
  </div>
</template>

<script>
import PersonCase from './personCase' // 右侧--比中推送
export default {
  props: ['ajbh'],
  name: 'bzPush',
  data() {
    return {
      activeName: 'first',
      AJBH: '', // 案件编号
      personCaseTotal: 0 // 人案关联引擎数据条数
    }
  },
  components: {
    PersonCase
  },
  watch: {
    ajbh(val) {
      if (val) {
        this.AJBH = val
      }
    }
  },
  methods: {
    init() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
      }
    },
    getPersonCaseTotal(val) {
      this.personCaseTotal = val
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.bzPush{
  width: 100%;
  .bzPushCont{
    border: 2px solid rgb(0, 160, 233);
    padding: 0 10px 8px 10px;
  }
  .el-tabs {
    border: none;
    background: none;
  }
  .el-tabs__header {
    background: url(/static/image/personFile_images/titlePub.png) no-repeat center top;
    background-size: 100% 90%;
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    height: 0;
  }
  .el-tabs .el-tabs__item.is-active,.el-tabs .el-tabs__item.is-active .noData {
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
  }
  .el-tabs__active-bar {
    height: 0;
  }
  .el-tabs .noData {
    color: #586d7e;
    text-shadow: none;
  }
  .el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
}

 .beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tab_line{
  width: 32px;
  position: absolute;
  right: -43px;
  top: -1px;
}
.tabTit{
  height: 33px;
  line-height: 33px;
  padding-left: 10px;
}


@media only screen and (max-width: 1367px){

}
</style>

