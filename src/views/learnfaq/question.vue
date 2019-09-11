<template>
  <div class="learQuestion caseEdit">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="20">
          <el-form :model="question" size="small" ref="form" :rules="rules" label-width="140px">
            <el-form-item label="分类" prop="category">
              <el-select v-model="question.category" placeholder="请选择" class="input_ws">
                <el-option label="食品" value="1"></el-option>
                <el-option label="药品" value="2"></el-option>
                <el-option label="环境" value="3"></el-option>
                <el-option label="食药" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="question.title" size="small" class="input_ws"></el-input>
            </el-form-item>
            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="question.keyword" size="small" class="input_ws"></el-input>
              <span>多个关键字以空格分隔如(关键字1 关键字2 关键字3)</span>
            </el-form-item>
            <!--<el-form-item label="自定义分类" prop="customType">-->
              <!--<el-input v-model="question.customType" size="small" style="width:400px;"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="内容" prop="subject">
              <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请输入内容" style="width: 55%;min-width: 400px;"
                        v-model="question.subject">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="!question.id" type="primary" @click="onAdd" v-loading.fullscreen.lock="loading">提 交
              </el-button>
              <el-button @click="toList">取 消</el-button>
              <!--<el-button v-if="question.id" type="primary" @click="onEdit" v-loading.fullscreen.lock="loading">保 存-->
              <!--</el-button>-->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {
    addLearning
  } from '@/api/learnfaq'

  export default {
    name: 'learQuestion',
    components: {},
    data() {
      return {
        id: '',
        currentDep: {},
        question: {},
        loading: false,
        rules: {
          category: [{
            required: true, message: '请选择分类', trigger: 'change'
          }],
          subject: [
            {
              required: true, message: '请输入问题', trigger: 'blur'
            },
            {
              min: 1, max: 500, message: '问题长度不能超过500个字', trigger: 'blur'
            }
          ],
          title: [
            {
              required: true, message: '请输入标题', trigger: 'blur'
            },
            {
              min: 1, max: 200, message: '标题长度不能超过200个字', trigger: 'blur'
            }
          ],
          customType: [{
            max: 100, message: '自定义分类不能超过100字', trigger: 'blur'
          }],
          keyword: [{
            max: 100, message: '关键词不能超过100字', trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      onAdd() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.question.browseNum = 0
            this.question.logFlag = 1 // 手动点击时，添加埋点参数
            addLearning(this.question).then((response) => {
              if (response.data) {
                this.$message({
                  message: '发布成功',
                  type: 'success'
                })
                this.toList()
              }
            })
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/learn/index'
        })
      }
    },
    mounted() {
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.question.createUser = curUser.realName
      this.question.userId = curUser.id
      if (this.currentDep) {
        this.question.createDept = this.currentDep.depName
        this.question.deptId = this.currentDep.id
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
