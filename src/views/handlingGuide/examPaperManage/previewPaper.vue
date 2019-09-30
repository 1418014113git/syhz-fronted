<template>
  <section class="preview">
    <el-row class="clearfix">
      <el-button v-print="'#previewExamPaper'" class="right" type="primary" plain icon="el-icon-printer">打印</el-button>
      <el-button class="right" type="primary" plain icon="el-icon-check" style="margin-right:10px;" :loading="detailLoading"  v-if="isShowSaveBtn" @click="save">保存</el-button>
    </el-row>
    <div id="previewExamPaper">
      <!-- 填空题 -->
      <div class="question_wrap" v-for="(item,index) in paperData" :key="index">
        <!-- （每题10分，共20分） -->
        <p class="font_b">{{item.titleCN}}、{{item.typeName}}（{{item.desc}}）</p>
        <div class="small_question_wrap clearfix">
          <div v-for="(smallItem,smallIndex) in item.data" :key="smallIndex">
            <p class="question_name clearfix">
              <span class="samllNum">{{smallIndex+1}}、</span>
              <span v-html="smallItem.name" :class="smallItem.name.indexOf('<p>')>-1?'questionContent':'questionContentNoP'"></span>
            </p>
            <!-- 选项 -->
            <div v-if="smallItem.items" class="options_wrap">
              <span v-if="smallItem.items.A">A、{{smallItem.items.A}}</span>
              <span v-if="smallItem.items.B">B、{{smallItem.items.B}}</span>
              <span v-if="smallItem.items.C">C、{{smallItem.items.C}}</span>
              <span v-if="smallItem.items.D">D、{{smallItem.items.D}}</span>
              <span v-if="smallItem.items.E">E、{{smallItem.items.E}}</span>
              <span v-if="smallItem.items.F">F、{{smallItem.items.F}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'

export default {
  name: 'preview',
  props: ['curPaper', 'isShowSaveBtn', 'previewProSubmit'],
  data() {
    return {
      paperData: [], // 试卷数据
      data: {},
      txData: questionTypeAll(),
      detailLoading: false,
      submitData: {} // 预览后保存时提交的数据

    }
  },
  watch: { // 监听state状态变化
    curPaper(val) {
      this.paperData = val
    },
    previewProSubmit(val) {
      this.submitData = val
    }
  },
  methods: {
    dealData() {
      var staticArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
      var titleText = ['一', '二', '三', '四', '五', '六', '七']
      this.paperData = []
      for (let index = 0; index < staticArr.length; index++) {
        var element = staticArr[index]
        if (this.data[element]) {
          this.data[element].titleCN = titleText[index]
          if (this.data[element].data && this.data[element].data.length > 0 && this.data[element].data[0].type) {
            this.data[element].typeName = this.$getLabelByValue(this.data[element].data[0].type + '', this.txData)
          } else {
            this.data[element].typeName = '无'
          }
          if (this.data[element].data[0].type === 3) { // 填空题，将[] 替换为横线
            for (let k = 0; k < this.data[element].data.length; k++) {
              var tkelement = this.data[element].data[k]
              if (tkelement.name.indexOf('[]') > -1) {
                tkelement.name = tkelement.name.replace(/\[/g, '___').replace(/\]/g, '___')
              }
            }
          }
          this.paperData.push(this.data[element])
        }
      }
    },
    save() {
      this.detailLoading = true
      this.$save('paper/random/preViewSave', this.submitData).then((response) => {
        this.detailLoading = false
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.$router.push({ path: '/handlingGuide/examPaperManage' })
      }).catch(() => {
        this.detailLoading = false
      })
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.curPaper) {
        this.paperData = this.curPaper
      }
      if (this.previewProSubmit) {
        this.submitData = this.previewProSubmit
      }
    }, 200)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.preview {
  padding: 0 20px;
  .scoreNumber {
    font-size: 20px;
    color: #f72929;
  }
  .small_question_wrap {
    margin-left: 30px;
    .left {
      width: 80%;
    }
    .right {
      width: 100px;
      text-align: center;
      border: 1px solid #dedede;
      .score_text {
        line-height: 32px;
        border-bottom: 1px solid #bebebe;
        margin-bottom: 0px;
      }
    }
  }
  .font_b {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
  }

  .options_wrap {
    margin: 0 0 8px 10px;
    span {
      display: inline-block;
      min-width: 22%;
    }
  }
  .question_name {
    position: relative;
    .samllNum {
      position: absolute;
      top: 0;
      left: 0;
      width: 22px;
    }
    .questionContentNoP {
      margin-left: 22px;
    }
    .questionContent {
      float: left;
      p {
        text-indent: 20px;
      }
    }
  }
}
</style>
<style media="previewExamPaper" type="text/css">
.noprint {
  display: none;
}
.print {
  margin-left: 25%;
}
@page {
  size: auto;
  margin: 0mm;
}
</style>
