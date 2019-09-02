<template>
  <div class="ast_tab_info" v-loading="ast_tab_load">
    <el-row>
      <el-col :span="4" class="urge_title">
        发起人：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{assistInfoData.applyPersonName}}
      </el-col>
      <el-col :span="4" class="urge_title">
        发起部门：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{assistInfoData.applyDeptName}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        发起时间：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{assistInfoData.startTime}}
      </el-col>
      <el-col :span="4" class="urge_title">
        截止时间：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{assistInfoData.endTime}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        协查级别：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{formatType(assistInfoData.assistType)}}
      </el-col>
      <el-col :span="4" class="urge_title">
        协查状态：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{formatStatus(assistInfoData.status)}}
      </el-col>
    </el-row>
    <el-row>
      <!--<el-col :span="4" class="urge_title">-->
        <!--协查负责人：-->
      <!--</el-col>-->
      <!--<el-col :span="5" class="urge_content">-->
        <!--{{assistInfoData.dutyPerson}}-->
      <!--</el-col>-->
      <el-col :span="4" class="urge_title">
        发起人电话：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{assistInfoData.dutyPersonPhone}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        协查部门：
      </el-col>
      <el-col :span="20" class="urge_content">
        {{formatText(assistInfoData.assistDept)}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        协查内容：
      </el-col>
      <el-col :span="16" class="urge_content">
        {{assistInfoData.assistContent}}
      </el-col>
    </el-row>
    <el-row style="margin: 20px 0">
      <el-col>
        <el-col :span="4" class="urge_title">
          协查附件：
        </el-col>
        <el-col :span="16" class="urge_content">
          <div v-for="(item,index) in attachmentList" :key="index">
            <el-button type="text" v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0"
                       v-preview="item.path" preview-title-enable="true" preview-nav-enable="true">{{item.name}}</el-button>
            <el-button type="text" v-else @click="downFile(item.path)">{{item.name}}</el-button>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getAssistLevelText, getAssistStatusText
  } from '@/utils/codetotext'

  export default {
    name: 'AssistInfoTab',
    props: ['assistInfoData'],
    data() {
      return {
        ast_tab_load: false,
        attachmentList: []
      }
    },
    methods: {
      formatText(str) {
        if (str) {
          return str.replace(new RegExp(/,/, 'gm'), '，')
        }
        return ''
      },
      formatStatus(status) {
        return getAssistStatusText(status)
      },
      formatType(assistType) {
        return getAssistLevelText(assistType)
      },
      downFile(path) {
        window.open(path)
      }
    },
    watch: {
      assistInfoData(val) {
        if (val.attachment) {
          this.attachmentList = JSON.parse(val.attachment)
        }
      }
    }
  }
</script>

<style scoped>
  .ast_tab_info .urge_title {
    padding: 5px;
    text-align: right;
  }

  .ast_tab_info .urge_content {
    padding: 5px;
  }
</style>
