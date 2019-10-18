<template>
  <section class="addQuestion">
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
    </el-col>
    <el-form :model="questionForm" ref="questionForm" :rules="rules" label-width="96px" label-position="left" v-loading="formLoading">
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
              <el-input type="textarea" :rows="2" v-model="questionForm.subjectName"  v-if="questionForm.type!=='3'" @focus="itemFocus('subjectName')"  @change="itemFocus('subjectName')" placeholder="请输入题目内容" maxlength="3000"></el-input>
              <el-input type="textarea" :rows="2" v-model="questionForm.subjectName"  v-if="questionForm.type==='3'" @focus="itemFocus('subjectName')" @change="itemFocus('subjectName')" placeholder="请输入题目内容" maxlength="3000" class="left" style="width:calc(100% - 30px)"></el-input>
              <el-tooltip class="right" v-if="questionForm.type==='3'" effect="dark" content="请将需要的填空内容写在[ ]中，在试题中平台会自动将[]变为一个填空。" placement="top">
                <el-button circle><i class="el-icon-question"></i></el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="选项A" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options1">
              <el-input type="text" size="small" v-model="questionForm.options1" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options1')" @change="itemFocus('options1')" ></el-input>
            </el-form-item>
            <el-form-item label="选项B" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options2">
              <el-input type="text" size="small" v-model="questionForm.options2" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options2')" @change="itemFocus('options2')"></el-input>
            </el-form-item>
            <el-form-item label="选项C" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options3">
              <el-input type="text" size="small" v-model="questionForm.options3" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options3')" @change="itemFocus('options3')"></el-input>
            </el-form-item>
            <el-form-item label="选项D" v-if="questionForm.type==='1' || questionForm.type==='2'" prop="options4">
              <el-input type="text" size="small" v-model="questionForm.options4" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options4')" @change="itemFocus('options4')"></el-input>
            </el-form-item>
            <el-form-item label="选项E" v-if="questionForm.type==='2'" prop="options5">
              <el-input type="text" size="small" v-model="questionForm.options5" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options5')" @change="itemFocus('options5')"></el-input>
            </el-form-item>
            <el-form-item label="选项F" v-if="questionForm.type==='2'" prop="options6">
              <el-input type="text" size="small" v-model="questionForm.options6" clearable placeholder="请输入"  maxlength="3000" @focus="itemFocus('options6')" @change="itemFocus('options6')"></el-input>
            </el-form-item>
            <el-form-item label="正确答案" prop="answer" v-if="questionForm.type==='1'">
              <el-radio-group v-model="questionForm.answer">
                <el-radio label="A">A</el-radio>
                <el-radio label="B">B</el-radio>
                <el-radio label="C">C</el-radio>
                <el-radio label="D">D</el-radio>
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
                 <!-- :disabled="!(questionForm.options5)" -->
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
              <el-input type="textarea" v-model="questionForm.analysis"  @focus="itemFocus('analysis')" @change="itemFocus('analysis')" maxlength="3000" clearable placeholder="请输入题目解析"></el-input>
            </el-form-item>
            <el-form-item label="出处" prop="source">
              <el-input type="text" v-model="questionForm.source" maxlength="100" size="small" clearable placeholder="请输入出处"></el-input>
            </el-form-item>
            <el-form-item label="次序" prop="sort">
              <el-input-number v-model="questionForm.sort" :min="0" :max="999"></el-input-number>
            </el-form-item>
          </div>
        </el-col>
        <!-- 富文本编辑器 -->
        <el-col :span="12" :style="{height:editorHeight}" v-if="carryParam.type!=='1'">
          <vue-editor v-model="editorContent" :useCustomImageHandler="false" @imageAdded="handleImageAdded"
                      style="width: 100%; min-width: 500px;height:100%;" @focus="editorFocus" @input="editorChange($event)"></vue-editor>
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
          <el-button size="mini" @click="handleSave('questionForm')" class="saveBtn" :loading="formLoading">保存</el-button>
        </el-col>
      </el-card>
    </el-form>
  </section>
</template>

<script>
import { uploadImg } from '@/utils/editorUpload'
import { questionTypeAll } from '@/utils/codetotext'
import VueEditor from '@/components/Editor/VueEditor'
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
      answerOptions: ['subjectName', 'analysis', 'options1', 'options2', 'options3', 'options4', 'options5', 'options6'], // 题干、解析、选项...
      answerIndex: null,
      questionForm: {
        type: '1', // 试题类型
        sort: 1,
        subjectName: '',
        answer: '',
        answerDx: [],
        options1: '',
        options2: '',
        options3: '',
        options4: '',
        options5: '',
        options6: '',
        analysis: ''
      },
      editorContent: '', // 富文本编辑器内容
      editorHeight: '', // 右侧内容的高度
      formLoading: false, // 表单的loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        subjectName: {
          required: true, message: '请输入题目内容', trigger: 'change'
        },
        answer: {
          required: true, message: '请输入正确答案', trigger: 'change'
        },
        answerDx: {
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (value.length === 0 || value === null || value === undefined) {
              callback(new Error('请选择正确答案'))
            } else if (value.indexOf('E') > -1 && this.questionForm.options5 === '') {
              callback(new Error('请输入E选项的内容，或取消E选项'))
            } else if (value.indexOf('F') > -1 && this.questionForm.options6 === '') {
              callback(new Error('请输入F选项的内容，或取消F选项'))
            } else {
              callback()
            }
          }
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
        },
        options5: {
          required: false, trigger: 'change', validator: (rule, value, callback) => {
            // 无论是否填写 都需要对 正确答案 进行校验
            this.$refs.questionForm.validateField('answerDx', (answerDxError) => {
              if (answerDxError) {
                console.log(answerDxError)
              }
            })
            callback()
          }
        },
        options6: {
          required: false, trigger: 'change', validator: (rule, value, callback) => {
            // 无论是否填写 都需要对 正确答案 进行校验
            this.$refs.questionForm.validateField('answerDx', (answerDxError) => {
              if (answerDxError) {
                console.log(answerDxError)
              }
            })
            callback()
          }
        }
      }
    }
  },
  methods: {
    init() {
      if (this.carryParam.questinoId) {
        this.questionForm.type = this.carryParam.questionType + ''
        this.formLoading = true
        var para = {
          id: this.carryParam.questinoId,
          type: this.carryParam.questionType
        }
        this.$query('questions/questionbyid', para).then((response) => {
          this.formLoading = false
          if (response.data.type === 2) {
            response.data.answerDx = []
          }
          this.questionForm = response.data
          if (this.questionForm.type === 2) {
            this.questionForm.answerDx = this.questionForm.answer.split(',')
          }
          // if (this.questionForm.type === 4) { // 判断题 答案转化
          // }
          if (this.questionForm.points) {
            var points = this.questionForm.points
            for (let index = 0; index < points.length; index++) {
              const element = points[index]
              if (element.point === 'A') {
                this.questionForm.options1 = element.pointValue
              } else if (element.point === 'B') {
                this.questionForm.options2 = element.pointValue
              } else if (element.point === 'C') {
                this.questionForm.options3 = element.pointValue
              } else if (element.point === 'D') {
                this.questionForm.options4 = element.pointValue
              } else if (element.point === 'E') {
                this.questionForm.options5 = element.pointValue
              } else if (element.point === 'F') {
                this.questionForm.options6 = element.pointValue
              }
            }
          }
          this.questionForm.type = this.questionForm.type + '' // type转化为字符串
          this.editorHeight = this.$refs.leftCol.offsetHeight - 12 + 'px'
        }).catch(() => {
          this.formLoading = false
          this.tableData = []
        })
      }
    },
    editorFocus() { // 富文本编辑器获取焦点
      if (this.editorContent) {
        // this.questionForm[this.answerOptions[this.answerIndex]] = this.editorContent
        this.editorContent = this.questionForm[this.answerOptions[this.answerIndex]]
        this.beforeEditorCon = this.editorContent
      }
      // console.log('focus' + this.editorContent)
    },
    editorChange({ editor, html, text }) {
      // console.log(editor, html, text)
      // console.log('change' + this.editorContent)
      // var _this = this
      // Object.defineProperty(this.editorContent, {
      //   get: function() {
      //     return _this.editorContent
      //   },
      //   set: function(newValue) {
      //     _this.editorContent = newValue
      //     console.log('set', newValue)
      //   }
      // })
      if (this.editorContent) {
        this.questionForm[this.answerOptions[this.answerIndex]] = this.editorContent
      }
    },
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
      this.$router.push({ path: '/handlingGuide/testbaseManage', query: { filtersTx: this.carryParam.filtersTx, nodeCategoryId: this.carryParam.nodeCategoryId, nodeCategoryName: this.carryParam.nodeCategoryName }})
    },
    handleSave(formName) { // 保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          this.formLoading = true
          var param = JSON.parse(JSON.stringify(this.questionForm))
          if (param.answerDx && param.answerDx.length > 0) { // 多选
            param.answer = param.answerDx.sort().join(',')
          }
          var optinosArr = {} // 将选项按照接口规定的key value存到数组中
          if (param.options1) {
            optinosArr.pointA = param.options1
          }
          if (param.options2) {
            optinosArr.pointB = param.options2
          }
          if (param.options3) {
            optinosArr.pointC = param.options3
          }
          if (param.options4) {
            optinosArr.pointD = param.options4
          }
          if (param.options5) {
            optinosArr.pointE = param.options5
          }
          if (param.options6) {
            optinosArr.pointF = param.options6
          }
          param.points = optinosArr
          param.deptCode = this.deptInfo.depCode // 当前部门code
          param.deptName = this.deptInfo.depName
          param.creator = this.userInfo.userName
          // console.log(param)
          if (this.carryParam.questinoId) {
            param.subjectCategoryId = this.carryParam.questionCatrgory // 所在模块
            // 编辑
            this.$update('examquestion/' + this.carryParam.questinoId, param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '修改成功', type: 'success'
                })
                this.$router.push({ path: '/handlingGuide/testbaseManage', query: { filtersTx: this.carryParam.filtersTx, nodeCategoryId: this.carryParam.nodeCategoryId, nodeCategoryName: this.carryParam.nodeCategoryName }})
              }
            }).catch(() => {
              this.formLoading = false
            })
          } else {
            // 添加
            param.subjectCategoryId = this.carryParam.nodeCategoryId // 所在模块
            this.$save('question', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$router.push({ path: '/handlingGuide/testbaseManage', query: { filtersTx: this.carryParam.filtersTx, nodeCategoryId: this.carryParam.nodeCategoryId, nodeCategoryName: this.carryParam.nodeCategoryName }})
              }
            }).catch(() => {
              this.formLoading = false
            })
          }
        }
      })
    },
    questionTypeChange(val) { // 试题类型change事件
      var _this = this
      _this.$refs['questionForm'].resetFields()
      _this.questionForm.type = val
      setTimeout(function() {
        _this.editorHeight = _this.$refs.leftCol.offsetHeight - 12 + 'px'
      }, 10)
    },
    itemFocus(type) {
      this.editorContent = ''
      this.answerIndex = this.answerOptions.indexOf(type)
      if (this.questionForm[this.answerOptions[this.answerIndex]] && (this.editorContent === '')) {
        this.editorContent = this.questionForm[this.answerOptions[this.answerIndex]]
      } else {
        this.questionForm[this.answerOptions[this.answerIndex]] = this.editorContent
      }
    },
    subjectFocus(type) {
      this.editorOptions = '2'
      // if (type === 'subjectName') {

      // } else if (type === 'analysis') {

      // }
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.editorHeight = this.$refs.leftCol.offsetHeight - 12 + 'px'
    if (this.$route.query && this.$route.query.filtersTx) {
      this.carryParam = this.$route.query
      this.init()
    }
  },
  activated() {
    this.editorHeight = this.$refs.leftCol.offsetHeight - 12 + 'px'
    if (this.$route.query && this.$route.query.filtersTx) {
      this.carryParam = this.$route.query
      this.init()
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
