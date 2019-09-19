<template>
  <section class="addQuestion">
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
    </el-col>
    <el-form :model="questionForm" ref="questionForm" :rules="rules" label-width="96px" label-position="left">
      <el-col :span="24" type="flex" justify="center">
        <!-- <el-card>
          <div slot="header"><span>试题类型</span></div>
        </el-card> -->
        <el-card>
          <div slot="header">
            <span>试题信息</span>
          </div>
          <el-col :span="12" style="padding-right:20px;">
            <div ref="leftCol">
              <el-form-item label="试题类型" prop="type">
                <el-select v-model="questionForm.type" placeholder="请选择题型" @change="questionTypeChange">
                  <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目内容" class="clearfix" prop="subjectName">
                <el-input type="textarea" :rows="2" v-model="questionForm.subjectName" v-if="questionForm.type!=='3'" @focus="subjectNameFocus" placeholder="请输入题目内容" maxlength="1000"></el-input>
                <el-input type="textarea" :rows="2" v-model="questionForm.subjectName" v-if="questionForm.type==='3'" @focus="subjectNameFocus" placeholder="请输入题目内容" maxlength="1000" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" v-if="questionForm.type==='3'" effect="dark" content="请将需要的填空内容写在[ ]中，在试题中平台会自动将[]变为一个填空。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="选项A" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options1">
                <el-input type="text" size="small" v-model="questionForm.options1" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('1')"></el-input>
              </el-form-item>
              <el-form-item label="选项B" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options2">
                <el-input type="text" size="small" v-model="questionForm.options2" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('2')"></el-input>
              </el-form-item>
              <el-form-item label="选项C" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options3">
                <el-input type="text" size="small" v-model="questionForm.options3" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('3')"></el-input>
              </el-form-item>
              <el-form-item label="选项D" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options4">
                <el-input type="text" size="small" v-model="questionForm.options4" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('4')"></el-input>
              </el-form-item>
              <el-form-item label="选项E" v-if="questionForm.type==='2'" prop="options5">
                <el-input type="text" size="small" v-model="questionForm.options5" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('5')"></el-input>
              </el-form-item>
              <el-form-item label="选项F" v-if="questionForm.type==='2'" prop="options6">
                <el-input type="text" size="small" v-model="questionForm.options6" clearable placeholder="请输入" maxlength="200" @focus="optionFocus('6')"></el-input>
              </el-form-item>
              <el-form-item label="正确答案" prop="answer" v-if="questionForm.type==='1'">
                <el-radio-group v-model="questionForm.answer">
                  <el-radio :label="1">A</el-radio>
                  <el-radio :label="2">B</el-radio>
                  <el-radio :label="3">C</el-radio>
                  <el-radio :label="4">D</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="正确答案" prop="answerDx" v-if="questionForm.type==='2'">
                <el-checkbox-group v-model="questionForm.answerDx">
                  <el-checkbox label="A"></el-checkbox>
                  <el-checkbox label="B"></el-checkbox>
                  <el-checkbox label="C"></el-checkbox>
                  <el-checkbox label="D"></el-checkbox>
                  <el-checkbox label="E"></el-checkbox>
                  <el-checkbox label="F"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="题目答案" prop="answer" v-if="questionForm.type==='3'" class="clearfix">
                <el-input type="" placeholder="请输入题目答案" v-model="questionForm.answer" maxlength="500" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" effect="dark" content="请填写标准答案或者答案关键字，一个空有多个答案或者关键字时，请用中文逗号(“，”)隔开。多空答案之间用“|”隔开。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="题目答案" prop="answer" v-if="questionForm.type==='4'">
                <el-radio-group v-model="questionForm.answer">
                  <el-radio :label="1">正确</el-radio>
                  <el-radio :label="2">错误</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="题目解析">
                <el-input type="textarea" v-model="questionForm.analysis" maxlength="500" clearable placeholder="请输入题目解析"></el-input>
              </el-form-item>
              <el-form-item label="出处" prop="source">
                <el-input type="text" v-model="questionForm.source" maxlength="100" size="small" clearable placeholder="请输入出处"></el-input>
              </el-form-item>
              <el-form-item label="次序" prop="sort">
                <el-input type="text" size="small" v-model="questionForm.sort" maxlength="100" clearable placeholder="请输入次序"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!-- 富文本编辑器 -->
          <el-col :span="12" :style="{height:editorHeight}" v-if="carryParam.type!=='1'">
            <!-- 目前是单选题和多选题 选项可以用富文本编辑器，
            填空题和判断题是题目内容可以用富文本编辑器 -->
            <vue-editor v-model="questionForm[answerOptions[answerIndex]]" useCustomImageHandler @imageAdded="handleImageAdded"
                        v-if="questionForm.type==='1'||questionForm.type==='2'"  style="width: 100%; min-width: 500px;height:100%;"></vue-editor>
            <vue-editor v-model="questionForm.subjectName" useCustomImageHandler @imageAdded="handleImageAdded"
                        v-if="editorOptions==='2' && questionForm.type==='3'||questionForm.type==='4'" style="width: 100%; min-width: 500px;height:100%;"></vue-editor>
                         <!-- v-if="questionForm.type==='3'||questionForm.type==='4'"  -->
          </el-col>
          <!-- <el-form-item  align="right">
            <el-upload  class="upload-demo" drag  multiple  :action="action">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将题干图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传txt、word(doc,docx)、ppt、excel文件，且不超过500M</div>
            </el-upload>
          </el-form-item> -->
          <el-col :span="24" align="center" style="margin-bottom:10px;" v-if="carryParam.type!=='1'">
            <el-button size="mini" @click="cancel()" class="cancelBtn">取消</el-button>
            <el-button size="mini" @click="handleSave('questionForm')" class="saveBtn">保存</el-button>
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
      carryParam: {}, // 携带的参数，type 1详情，2添加，3编辑
      editorOptions: '1', // 显示哪个富文本编辑器
      txData: questionTypeAll(),
      answerOptions: ['options1', 'options2', 'options3', 'options4', 'options5', 'options6'],
      answerIndex: 0,
      questionForm: {
        type: '1', // 试题类型
        subjectName: '',
        answer: '',
        answerDx: [],
        options1: '',
        options2: '',
        options3: '',
        options4: '',
        options5: '',
        options6: ''
      },
      editorHeight: '', // 右侧内容的高度
      value3: 'A',
      xxxx: '',
      rules: {
        subjectName: {
          required: true, message: '请输入题目内容', trigger: 'change'
        },
        answer: {
          required: true, message: '请输入正确答案', trigger: 'change'
        },
        answerDx: {
          required: true, message: '请输入正确答案', trigger: 'change'
        },
        source: {
          required: true, message: '请输入出处', trigger: 'change'
        },
        options1: {
          required: true, message: '请输入选项内容', trigger: 'change'
        },
        options2: {
          required: true, message: '请输入选项内容', trigger: 'change'
        },
        options3: {
          required: true, message: '请输入选项内容', trigger: 'change'
        },
        options4: {
          required: true, message: '请输入选项内容', trigger: 'change'
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
    cancel() {
      this.$router.push({ path: '/handlingGuide/testbaseManage' })
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var para = {}
          // 添加
          this.$save('', para).then((response) => {
            if (response.code === '000000') {
              // confirmButtonLoading = false
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.queryAjFeature()
            }
          }).catch(() => {
            this.listLoading = false
          })

          // 编辑
          this.$update('ajfeature/' + this.carryParam.id, para).then((response) => {
            this.loading = false
            if (response.code === '000000') {
              this.$message({
                message: '修改成功', type: 'success'
              })
              this.queryAjFeature()
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
      // this.$message({
      //   type: 'success',
      //   message: '添加成功'
      // })
      // this.$router.push({ path: '/handlingGuide/testbaseManage' })
    },
    questionTypeChange(val) { // 试题类型change事件
      var _this = this
      _this.$refs['questionForm'].resetFields()
      _this.questionForm.type = val
      setTimeout(function() {
        _this.editorHeight = _this.$refs.leftCol.offsetHeight - 12 + 'px'
      }, 10)
    },
    optionFocus(val) {
      this.editorOptions = '1'
      this.answerIndex = Number(val) - 1
      // if (!this.questionForm[this.answerOptions[this.answerIndex]]) {
      //   this.questionForm[this.answerOptions[this.answerIndex]] = ''
      // }
    },
    subjectNameFocus() {
      this.editorOptions = '2'
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.editorHeight = this.$refs.leftCol.offsetHeight - 12 + 'px'
    if (this.$route.query) {
      this.carryParam = this.$route.query
      console.log(this.carryParam)
    }
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
  .el-select {
    display: initial;
  }
}
</style>
