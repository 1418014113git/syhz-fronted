<template>
  <div class="learQuestion caseEdit">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="20">
          <el-form :model="question" size="small" ref="form" :rules="rules" label-width="140px">
            <el-form-item label="分类" prop="quType">
              <el-select v-model="question.quType" :disabled="this.$route.query.id? true: false" placeholder="请选择" class="input_ws">
                <el-option v-for="item in typeArr" :label="item.name" :value="item.code" :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主题" prop="quTitle">
              <el-input v-model="question.quTitle" size="small" class="input_ws" :disabled="this.$route.query.id? true: false"></el-input>
            </el-form-item>
            <el-form-item label="具体问题" prop="introduction">
              <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请输入内容" style="width: 55%;min-width: 400px;"
                        v-model="question.introduction">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="toList">取 消</el-button>
              <el-button v-if="!question.id" type="primary" @click="onAdd" v-loading.fullscreen.lock="loading">发 布
              </el-button>
              <el-button v-else type="primary" @click="edit" v-loading.fullscreen.lock="loading">修 改
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {
    questionSave, getQuestion, questionEdit, getSensitive
  } from '@/api/learnfaq'

  export default {
    name: 'learQuestion',
    components: {},
    data() {
      return {
        sensitiveList: [], // 敏感词库
        typeArr: [
          {
            code: 1,
            name: '环境'
          },
          {
            code: 2,
            name: '食品'
          },
          {
            code: 3,
            name: '药品'
          },
          {
            code: 4,
            name: '综合'
          }
        ],
        id: '',
        currentDep: {},
        question: {},
        loading: false,
        rules: {
          quType: [{
            required: true, message: '请选择分类', trigger: 'change'
          }],
          introduction: [
            {
              required: true, message: '请输入问题', trigger: 'blur'
            },
            {
              min: 1, max: 500, message: '问题长度不能超过500个字', trigger: 'blur'
            }
          ],
          quTitle: [
            {
              required: true, message: '请输入标题', trigger: 'blur'
            },
            {
              min: 1, max: 200, message: '标题长度不能超过200个字', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 判断是否存在敏感词
      validateSensitive() {
        if (this.sensitiveList.length > 0) {
          for (let i = 0; i < this.sensitiveList.length; i++) {
            if (this.question.quTitle.indexOf(this.sensitiveList[i]) !== -1) {
              this.$alert('问题主题中包含敏感词，请修改后再发表', '警告', {
                confirmButtonText: '确定'
              })
              return false
            }
            if (this.question.introduction.indexOf(this.sensitiveList[i]) !== -1) {
              this.$alert('具体问题中包含敏感词，请修改后再发表', '警告', {
                confirmButtonText: '确定'
              })
              return false
            }
          }
        }
        return true
      },
      // 获取敏感词信息
      getSensitiveList() {
        const param = {
          appId: 1,
          dictType: 'sensitive'
        }
        const _this = this
        this.sensitiveList = []
        getSensitive(param).then((response) => {
          if (response.code === '000000') {
            const data = response.data
            data.forEach(element => {
              _this.sensitiveList.push(element.dictName)
            })
          } else {
            this.$message({
              message: '获取敏感词失败',
              type: 'error'
            })
          }
        })
      },
      onAdd() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.validateSensitive()) {
              questionSave(this.question).then((response) => {
                if (response.data) {
                  this.$message({
                    message: '发布成功',
                    type: 'success'
                  })
                  this.toList()
                }
              })
            }
          }
        })
      },
      edit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.validateSensitive()) {
              const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
              const para = {
                id: this.$route.query.id,
                introduction: this.question.introduction,
                lastId: curUser.id,
                lastName: curUser.userName
              }
              questionEdit(para).then((response) => {
                if (response.data) {
                  this.$message({
                    message: '发布成功',
                    type: 'success'
                  })
                  this.toList()
                }
              })
            }
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/micro/difficult',
          query: {
            page: this.$route.query.page,
            pageSize: this.$route.query.pageSize,
            activeIndex: this.$route.query.activeIndex,
            myQuestion: this.$route.query.myQuestion,
            quTitle: this.$route.query.quTitle
          }
        })
      }
    },
    mounted() {
      if (this.$route.query.id) {
        const para = {
          id: this.$route.query.id,
          addViewNumMakr: 0,
          addViewLogMark: 0
        }
        getQuestion(para).then((response) => {
          if (response.data) {
            this.question = response.data
          }
        })
      }
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.question.creationName = curUser.userName
      this.question.creationId = curUser.id
      if (this.currentDep) {
        this.question.belongDepName = this.currentDep.depName
        this.question.belongDepCode = this.currentDep.id
        this.question.belongAreaCode = this.currentDep.areaCode
      }
      if (sessionStorage.getItem('dictData') && sessionStorage.getItem('dictData')['sensitive']) {
        this.sensitiveList = sessionStorage.getItem('dictData')['sensitive']
      } else {
        this.getSensitiveList()
      }
    }
  }
</script>

<style scoped>
  .learQuestion .el-form-item {
    margin-bottom: 26px;
  }
  .input_ws{
    width: 55%;
  }
</style>
