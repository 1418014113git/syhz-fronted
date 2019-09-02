<template>
  <el-row class="examNotice_spe_save">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goToList">   <!--返回-->
    <el-col :span="18" style="margin-top: 24px;">
      <el-form ref="examNoticeForm" :model="notice"  label-width="200px">
        <el-form-item label="表　名：" prop="tableName">
          <el-select v-model="notice.tableName" placeholder="请选择" clearable  style="width: 675px;" @change="changeTableName">
            <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标　题：" prop="title">
          <el-input v-model="notice.title" placeholder="请输入标题" maxlength='500' clearable style="width: 675px;"></el-input>
        </el-form-item>
        <el-form-item label="内　容：" prop="content">
          <kind-editor id="editor_id"  :content.sync="notice.content"
            pluginsPath="../../../static/kindeditor/plugins/"
            :loadStyleMode="false"
            @on-content-change="onContentChange"
            ></kind-editor>
        </el-form-item>
        <span></span>
      </el-form>
    </el-col>
    <el-col :span="14" style="text-align: center;">
      <el-button type="primary" @click="submit" :loading="btnLoading">提交</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
      <!-- <el-button type="primary" @click="goToList">返回</el-button> -->
    </el-col>
  </el-row>
</template>

<script>
import KindEditor from './components/VueEditor'
export default {
  components: {
    KindEditor
  },
  data() {
    return {
      btnLoading: false, // 提交按钮加载loading
      notice: {
        title: '',
        content: '',
        tableName: ''
      },
      selectData: [
        { label: '内蒙工商-广告监督', value: 'd_nmgs_ggjd' },
        { label: '内蒙质监-质量监督', value: 'd_nmzj_zljd' },
        { label: '内蒙农牧业厅-信息公开', value: 'd_nmnmyt_xxgk' },
        { label: '食安-抽检信息', value: 'd_sa_cjxx' },
        { label: '呼和浩特食药局-行政处罚决定书', value: 'd_hhhtsyj_xzcfjds' },
        { label: '内蒙质检-执法监督', value: 'd_nmzj_zfjd' }
      ]
    }
  },
  methods: {
    submit() { // 提交
      this.btnLoading = true
      this.$save('border', this.notice).then((res) => {
        this.btnLoading = false
        if (res.code === '000000') {
          this.$message({ message: '提交成功', type: 'success' })
          this.goToList()
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    onContentChange(val) {
      this.notice.content = val
    },
    changeTableName(val) {
      this.notice.tableName = val
    },
    goToList() { // 返回列表页
      this.$gotoid('/interfaceDataCollect/interfaceList')
    },
    resetForm() { // 重置
      this.notice.title = ''
      this.notice.content = ''
      this.notice.tableName = ''
    }
  },
  mounted() {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@media only screen and (max-width: 1367px) {
  .el-col-14 {
    width: 85.3% !important;
  }
}
</style>

