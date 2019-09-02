<template>
  <div class="localAssist">
    <el-row class="row">
      <el-col :span="4" class="title">发起人：</el-col>
      <el-col :span="4" class="cont">{{detail.applyPersonName}}</el-col>
      <el-col :span="4" class="title">发起部门：</el-col>
      <el-col :span="12" class="cont">{{detail.applyDeptName}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">协查级别：</el-col>
      <el-col :span="4" class="cont">
        {{formatType(detail.assistType)}}
      </el-col>
      <el-col :span="4" class="title">发起人电话：</el-col>
      <el-col :span="6" class="cont">{{detail.dutyPersonPhone}}</el-col>
    </el-row>
    <el-row class="row">
      <!--<el-col :span="4" class="title">协查负责人：</el-col>-->
      <!--<el-col :span="4" class="cont">{{detail.dutyPerson}}</el-col>-->

      <el-col :span="4" class="title">协查部门：</el-col>
      <el-col :span="20" class="cont">{{formatDept(detail.assistDept)}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">协查内容：</el-col>
      <el-col :span="20" class="cont">{{detail.assistContent}}</el-col>
    </el-row>
    <el-row class="row" v-if="imgs.length>0">
      <el-col :span="4" class="title">上传附件：</el-col>
      <el-col :span="18" class="cont">
        <div v-for="(item,index) in imgs" :key="index">
          <el-button type="text" v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0"
                     v-preview="item.path" preview-title-enable="true" preview-nav-enable="true">{{item.name}}</el-button>
          <el-button type="text" v-else @click="downFile(item.path)">{{item.name}}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getAssistLevelText
  } from '@/utils/codetotext'
  export default {
    name: 'localAssist',
    props: [
      'detail'
    ],
    components: {},
    data() {
      return {
        imgs: []
      }
    },
    methods: {
      downFile(path) {
        window.open(path)
      },
      formatType(assistType) {
        return getAssistLevelText(assistType)
      },
      formatDept(deptList) {
        if (deptList) {
          return deptList.replace(new RegExp(/,/, 'gm'), '，\n')
        }
        return ''
      }
    },
    mounted() {
    },
    watch: {
      detail(val) {
        if (val.attachment) {
          this.imgs = JSON.parse(this.detail.attachment)
        }
      }
    }
  }
</script>

<style scoped>
  .localAssist .row {
    margin: 1px 10px;
  }

  .localAssist .title {
    text-align: right;
    color: #fff;
    padding: 10px 0;

  }

  .localAssist .cont {
    color: #fff;
    padding: 10px 0 10px 10px;
  }

</style>
