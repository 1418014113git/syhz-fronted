<template>
  <section class="addQuestion">
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
    </el-col>
    <el-form :model="filters" ref="filters" :rules="rules" label-width="96px" label-position="left">
      <el-col :span="24">
        <!-- <el-card>
          <div slot="header"><span>试题类型</span></div>
        </el-card> -->
        <el-card>
          <div slot="header">
            <span>试题信息</span>
          </div>
          <el-col :span="12" style="padding-right:20px;">
            <div ref="leftCol">
              <el-form-item label="题型a">
                <el-select v-model="filters.tx" placeholder="请选择题型" @change="selectTrigger" @blur="questionTypeBlur">
                  <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目内容" class="clearfix">
                <el-input type="textarea" :rows="2" v-model="filters.content" v-if="filters.tx!=='3'" placeholder="请输入题目内容"></el-input>
                <el-input type="textarea" :rows="2" v-model="filters.content" v-if="filters.tx==='3'" placeholder="请输入题目内容" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" v-if="filters.tx==='3'" effect="dark" content="请将需要的填空内容写在[ ]中，在试题中平台会自动将[]变为一个填空。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="选项A" v-if="filters.tx==='1' || filters.tx==='2'">
                <el-input type="text"  size="small" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="选项B" v-if="filters.tx==='1' || filters.tx==='2'">
                <el-input type="text" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="选项C" v-if="filters.tx==='1' || filters.tx==='2'">
                <el-input type="text" size="small" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="选项D" v-if="filters.tx==='1' || filters.tx==='2'">
                <el-input type="text" size="small" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="选项E" v-if="filters.tx==='2'">
                <el-input type="text" size="small" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="选项F" v-if="filters.tx==='2'">
                <el-input type="text" size="small" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="正确答案" v-if="filters.tx==='1' || filters.tx==='2'">
                <el-radio-group v-model="filters.radio2" v-if="filters.tx==='1'">
                  <el-radio :label="1">A</el-radio>
                  <el-radio :label="2">B</el-radio>
                  <el-radio :label="3">C</el-radio>
                  <el-radio :label="4">D</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="filters.answerDx" v-if="filters.tx==='2'">
                  <el-checkbox label="A"></el-checkbox>
                  <el-checkbox label="B"></el-checkbox>
                  <el-checkbox label="C"></el-checkbox>
                  <el-checkbox label="D"></el-checkbox>
                  <el-checkbox label="E"></el-checkbox>
                  <el-checkbox label="F"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="题目答案" v-if="filters.tx==='3'" class="clearfix">
                <el-input type="" placeholder="" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" effect="dark" content="请填写标准答案或者答案关键字，一个空有多个答案或者关键字时，请用中文逗号(“，”)隔开。多空答案之间用“|”隔开。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="题目答案" v-if="filters.tx==='4'">
                <el-radio-group v-model="filters.radio2">
                  <el-radio :label="1">正确</el-radio>
                  <el-radio :label="2">错误</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="题目解析">
                <el-input type="textarea" clearable placeholder="请输入题目解析"></el-input>
              </el-form-item>
              <el-form-item label="出处">
                <el-input type="text" size="small" clearable placeholder="请输入出处"></el-input>
              </el-form-item>
              <el-form-item label="次序">
                <el-input type="text" size="small" clearable placeholder="请输入次序"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!-- 富文本编辑器 -->
          <el-col :span="12" :style="{height:editorHeight}">
            <vue-editor v-model="filters.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;height:100%;"></vue-editor>
          </el-col>
          <!-- <el-form-item  align="right">
            <el-upload  class="upload-demo" drag  multiple  :action="action">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将题干图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传txt、word(doc,docx)、ppt、excel文件，且不超过500M</div>
            </el-upload>
          </el-form-item> -->
          <el-col :span="24" align="center" style="margin-bottom:10px;">
            <el-button size="mini" @click="handleEdit()">取消</el-button>
            <el-button size="mini" @click="handleSave()">保存</el-button>
          </el-col>
        </el-card>
      </el-col>
    </el-form>
  </section>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import { uploadImg } from '@/utils/editorUpload'
import { questionTypeAll } from '@/utils/codetotext'

export default {
  name: 'add',
  components: {
    VueEditor
  },
  data() {
    return {
      action: '',
      txData: questionTypeAll(),
      filters: {
        tx: '3', // 试题类型
        answerDx: []
      },
      editorHeight: '', // 右侧内容的高度
      value3: 'A',
      rules: {
        tx: {
          required: true, message: '请输入标题', trigger: 'blur'
        },
        content: {
          required: true, message: '请输入标题', trigger: 'blur'
        }
      }

    }
  },
  methods: {
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    },
    handleEdit() {
      this.$router.push({ path: '/educational/questionBank/' })
    },
    handleSave() {
      this.$message({
        type: 'success',
        message: '添加成功'
      })
      this.$router.push({ path: '/educational/questionBank/' })
    },
    selectTrigger(val) {
      var _this = this
      setTimeout(function() {
        _this.editorHeight = _this.$refs.leftCol.offsetHeight - 12 + 'px'
      }, 10)
    },
    questionTypeBlur(val) {
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.editorHeight = this.$refs.leftCol.offsetHeight - 12 + 'px'
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.addQuestion {
  .quillWrapper .ql-snow.ql-toolbar {
    height: 70px;
  }
  .ql-container {
    height: calc(100% - 68px) !important;
    max-height: calc(100% - 68px) !important;
  }
}
</style>
