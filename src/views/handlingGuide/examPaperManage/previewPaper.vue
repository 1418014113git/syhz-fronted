<template>
  <section class="preview">
    <el-row class="clearfix">
      <!-- v-print="'#previewExamPaper'" -->
      <el-button class="right" type="primary" plain icon="el-icon-printer" @click="printPaper">打印</el-button>
      <el-button class="right" type="primary" plain icon="el-icon-check" style="margin-right:10px;" :loading="detailLoading"  v-if="isShowSaveBtn" @click="save">保存</el-button>
    </el-row>
    <div id="previewExamPaper" ref="print">
      <p class="curPaperName">{{paperName}}</p>
      <!-- 填空题 -->
      <div class="question_wrap" v-for="(item,index) in paperData" :key="index">
        <!-- （每题10分，共20分） -->
        <p class="font_b">{{item.titleCN}}、{{item.typeName}}（{{item.desc}}）</p>
        <div class="small_question_wrap clearfix">
          <div v-for="(smallItem,smallIndex) in item.data" :key="smallIndex">
            <p class="question_name clearfix richTextWrap">
              <span class="samllNum">{{smallIndex+1}}、</span>
              <span v-html="smallItem.name" :class="smallItem.name.indexOf('<p>')>-1?'questionContent':'questionContentNoP'"></span>
            </p>
            <!-- 选项 -->
            <div v-if="smallItem.items" class="options_wrap">
              <!-- <p v-if="smallItem.items.A" class="option_item">A、<span class="richTextWrap">氨基酸的</span></p>
              <p v-if="smallItem.items.B" class="option_item">B、<span class="richTextWrap">氨基酸的房间阿斯顿发骄傲的房间树大招风啊</span></p>
              <p v-if="smallItem.items.C" class="option_item">C、<span  class="richTextWrap">氨基酸的房间阿斯顿发骄傲的房间啊</span></p>
              <p v-if="smallItem.items.D" class="option_item">D、<span  class="richTextWrap">氨基酸的房间阿斯顿发骄傲的房间啊</span></p>
              <p v-if="smallItem.items.E" class="option_item">E、<span  class="richTextWrap">氨基酸的房间阿斯顿发骄傲的房间啊</span></p>
              <p v-if="smallItem.items.F" class="option_item">F、<span  class="richTextWrap">氨基酸的房间阿斯顿发骄傲的房间啊</span></p> -->
              <p v-if="smallItem.items.A" class="option_item"><span v-html="chaangebq('A、',smallItem.items.A)" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.B" class="option_item"><span v-html="chaangebq('B、',smallItem.items.B)" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.C" class="option_item"><span v-html="chaangebq('C、',smallItem.items.C)" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.D" class="option_item"><span v-html="chaangebq('D、',smallItem.items.D)" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.E" class="option_item"><span v-html="chaangebq('E、',smallItem.items.E)" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.F" class="option_item"><span v-html="chaangebq('F、',smallItem.items.F)" class="richTextWrap"></span></p>
            </div>
            <!-- 判断题 -->
            <div v-if="smallItem.type === 4" class="pd_options_wrap">
              <el-radio-group>
                <span class="option_item"><el-radio label="true">正确</el-radio></span>
                <span class="option_item"><el-radio label="false">错误</el-radio></span>
               </el-radio-group>
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
  props: ['curPaper', 'isShowSaveBtn', 'previewProSubmit', 'zjType', 'curPaperName'],
  data() {
    return {
      paperData: [], // 试卷数据
      data: {},
      txData: questionTypeAll(),
      detailLoading: false,
      submitData: {}, // 预览后保存时提交的数据
      paperName: '' // 试卷名称

    }
  },
  watch: { // 监听state状态变化
    curPaper(val) {
      this.paperData = val
    },
    curPaperName(val) {
      this.paperName = val
    },
    previewProSubmit(val) {
      this.submitData = val
    }
  },
  methods: {
    chaangebq(item, val) {
      if (val.indexOf('<p>') > -1) {
        val = val.replace('<p>', '').replace('</p>', '')
      }
      return item + val
    },
    printPaper() {
      this.$print(this.$refs.print) // 使用
    },
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
      if (this.zjType && this.zjType === 1) {
        this.$update('paper/random/update', this.submitData).then((response) => {
          this.detailLoading = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push({ path: '/handlingGuide/examPaperManage' })
        }).catch(() => {
          this.detailLoading = false
        })
      } else {
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
      if (this.curPaperName) {
        this.paperName = this.curPaperName
      }
    }, 200)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.preview {
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
    // 单选框样式
    .el-radio {
      color: #000000;
    }
    .el-radio__inner {
      background: #fff;
      border: 1px solid #bbbbbb;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #409eff;
      background: #409eff;
    }
    .el-radio-group {
      display: initial;
    }
  }
  .font_b {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
  }

  .options_wrap {
    margin: 5px 0 5px 10px;
    p {
      margin: 0 0 5px;
    }
  }
  .pd_options_wrap {
    margin: 6px 0 0;
    .option_item {
      display: inline-block;
      width: 22%;
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
  .curPaperName{
    padding: 20px 0;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
<style media="print" lang="scss">
@page {
  size: auto;
  margin: 10mm;
}
.curPaperName {
  padding: 20px 0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.richTextWrap img {
  width: 120px;
  height: 80px;
  margin: 0 8px;
}

</style>
