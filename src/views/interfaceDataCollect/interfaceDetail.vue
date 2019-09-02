<template>
<div>
  <el-row>
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
   <div v-loading="loading" class="boundaryWrap">
    <!-- <el-button @click="goBack" style="font-size:15px;">返回</el-button> -->
    <div v-if="boundaryDetail.title">
      <p style="text-align: center;font-size:24px;">{{boundaryDetail.title}}</p>
      <div class="clearfix">
        <p style="float:right;margin-right:20px;">采集时间：{{boundaryDetail.syhSjldsj}}</p>
      </div>
      <!-- <div v-html="boundaryDetail.content" class="e-p-line ql-editor"></div> -->
      <kind-editor id="editor_id"  :content.sync="boundaryDetail.content"
        pluginsPath="../../../static/kindeditor/plugins/"
        :loadStyleMode="false"></kind-editor>
    </div>
  </div>
</div>
</template>
<script>
import KindEditor from './components/VueEditor'
export default {
  data() {
    return {
      loading: false, // 加载进度条
      boundaryDetail: {
        title: '',
        content: '',
        syhSjldsj: ''
      },
      carryParam: {} // 跳转携带的参数
    }
  },
  components: {
    KindEditor
  },
  methods: {
    init() { // 初始化
      this.loading = true
      const param = {
        id: this.carryParam.id,
        tableName: this.carryParam.tableName
      }
      this.$query('borderbyid?id=' + param.id + '&tableName=' + param.tableName, {}).then((response) => { // 详情接口
        this.loading = false
        this.boundaryDetail = response.data[0]
      }).catch(() => {
        this.loading = false
      })
    },
    goBack() { // 返回列表页
      this.$gotoid('/interfaceDataCollect/interfaceList', this.carryParam.tableName)
    }
  },
  mounted() {
    this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path)) // 从session中取
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.boundaryWrap .ke-container {
  width: 100% !important;
}
// .boundaryWrap .ke-edit {
//   height: auto; 若写死 则下拉失效
// }
// .boundaryWrap .ke-edit .ke-edit-iframe {
//   height: 320px !important;
// }
</style>
