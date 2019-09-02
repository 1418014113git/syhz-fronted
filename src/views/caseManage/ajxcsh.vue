<!--<template>-->
  <!--<section>-->
    <!--<Inspection></Inspection>-->
    <!--<el-col :span="24">-->
      <!--<el-card class="cont-card">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span>审核</span>-->
        <!--</div>-->
        <!--<div class="xczt_content" style="width: 50%;">-->
          <!--<el-form :model="form" size="small" ref="form" :rules="rules" label-width="120px">-->
            <!--<el-form-item label="审核意见" prop="reviewRemark">-->
              <!--<el-input v-model="form.reviewRemark" auto-complete="off" maxlength="30"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="审核领导" prop="reviewPeople">-->
              <!--<el-input v-model="form.reviewPeople" auto-complete="off" maxlength="30"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="上传附件">-->
              <!--<el-upload class="upload-demo" v-model="form.img" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>-->
                <!--<i class="el-icon-upload"></i>-->
                <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
                <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
              <!--</el-upload>-->
            <!--</el-form-item>-->
            <!--<el-form-item>-->
              <!--<el-button size="small" @click="resetForm('form')">审核不通过</el-button>-->
              <!--<el-button type="primary" @click="edit">审核通过</el-button>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        <!--</div>-->
      <!--</el-card>-->
    <!--</el-col>-->
  <!--</section>-->
<!--</template>-->

<!--<script>-->
  <!--import Inspection from './components/Inspection'-->
  <!--export default {-->
    <!--name: 'ajxcqs',-->
    <!--data() {-->
      <!--return {-->
        <!--form: {-->
          <!--reviewPeople: '无',-->
          <!--reviewRemark: '张三',-->
          <!--img: 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'-->
        <!--},-->
        <!--rules: {-->
          <!--reviewRemark: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],-->
          <!--reviewPeople: [{ required: true, message: '请输入审核领导', trigger: 'blur' }]-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--components: {-->
      <!--Inspection-->
    <!--},-->
    <!--methods: {-->
      <!--edit() {-->

      <!--},-->
      <!--resetForm(formName) {-->
        <!--this.$refs[formName].resetFields()-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.xczt_content > ul > li {-->
	<!--font-size: 14px;-->
	<!--list-style: none;-->
	<!--height: 40px;-->
	<!--line-height: 40px;-->
	<!--padding-left: 50px;-->
<!--}-->
<!--.align_right {-->
	<!--text-align: right;-->
	<!--padding: 10px 0;-->
<!--}-->
<!--</style>-->
