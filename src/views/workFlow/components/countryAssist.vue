<template>
  <div class="countryAssist">
    <el-row class="row">
      <el-col :span="4" class="title">申请人：</el-col>
      <el-col :span="4" class="cont">{{detail.apply_person_name}}</el-col>
      <el-col :span="4" class="title">申请部门：</el-col>
      <el-col :span="10" class="cont">{{detail.apply_dept_name}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">参与部门：</el-col>
      <el-col :span="18" class="cont">
        <p v-for="(item,index) in partakeDepts" :key="item.index">{{item.name}}</p>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">参与人：</el-col>
      <el-col :span="18" class="cont">
        <span v-for="(item,index) in partakePerson" :key="item.index">{{item.name}}</span>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">开始时间：</el-col>
      <el-col :span="4" class="cont">{{$parseTime(detail.start_date, '{y}-{m}-{d}')}}</el-col>
      <el-col :span="4" class="title">截止时间：</el-col>
      <el-col :span="6" class="cont">{{$parseTime(detail.end_date, '{y}-{m}-{d}')}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">协查内容：</el-col>
      <el-col :span="18" class="e-p-line ql-editor" v-html="vhtml" style="max-height: 600px; overflow-y: auto"></el-col>
    </el-row>
    <!--<el-row class="row">-->
      <!--<el-col :span="4" class="title">上传附件：</el-col>-->
      <!--<el-col :span="18" class="cont">-->
        <!--<div v-for="(item,index) in imgs" :key="index" class="img">-->
          <!--<div v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0">-->
            <!--<img v-preview="item.path" :src="item.path" preview-title-enable="true" preview-nav-enable="true"-->
                 <!--width="100%" class="img_file">-->
          <!--</div>-->
          <!--<div v-else @click="downFile(item.path)">-->
            <!--<svg-icon icon-class="file" class="img_file"/>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  export default {
    name: 'countryAssist',
    props: [
      'detail'
    ],
    components: {},
    data() {
      return {
        imgs: [],
        vhtml: '',
        partakeDepts: [],
        partakePerson: []
      }
    },
    methods: {
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
    },
    watch: {
      detail(val) {
        if (this.detail.attachement) {
          this.imgs = JSON.parse(this.detail.attachement)
        }
        this.vhtml = this.detail.assist_content
        if (this.detail.partake_dept) {
          this.partakeDepts = JSON.parse(this.detail.partake_dept)
        }
        if (this.detail.partake_person) {
          this.partakePerson = JSON.parse(this.detail.partake_person)
        }
      }
    }
  }
</script>

<style scoped>
  .countryAssist .row {
    margin: 1px 10px;
  }

  .countryAssist .title {
    text-align: right;
    color: #FFFFFF;
    padding: 10px 0;

  }

  .countryAssist .cont {
    color: #FFFFFF;
    padding: 10px 0 10px 10px;
  }
  /learn/index
  .countryAssist .img {
    margin: 10px;
    vertical-align: top;
    display: inline-block;
    width: 100px;
    height: 120px;
    cursor: pointer;
  }

  .countryAssist .img_file {
    width: 100px;
    height: 120px;
    padding: 3px;
    border: 1px solid #fff;
  }
</style>
