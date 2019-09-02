<template>
  <div class="db_tab_info" v-loading="db_tab_load">
    <el-row>
      <el-col :span="4" class="urge_title">
        发起人：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{dbInfoData.fqr}}
      </el-col>
      <el-col :span="4" class="urge_title">
        发起部门：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{dbInfoData.fqbm}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        发起时间：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{dbInfoData.fqsj}}
      </el-col>
      <el-col :span="4" class="urge_title">
        结束时间：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{dbInfoData.jssj}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        督办级别：
      </el-col>
      <el-col :span="5" class="urge_content">
        {{formatterLevel(dbInfoData.dbjb)}}
      </el-col>
      <el-col :span="4" class="urge_title">
        督办状态：
      </el-col>
      <el-col :span="11" class="urge_content">
        {{filterStateText(dbInfoData.dbzt)}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="urge_title">
        督办描述：
      </el-col>
      <el-col :span="16" class="urge_content">
        {{dbInfoData.dbms}}
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getDBLevelText, getAssistStatusText
  } from '@/utils/codetotext'
  export default {
    name: 'DBTabInfo',
    props: ['dbInfoData'],
    data() {
      return {
        db_tab_load: false
      }
    },
    methods: {
      formatterLevel(level) {
        return getDBLevelText(level)
      },
      filterStateText(state) {
        return getAssistStatusText(state)
      }
    }
  }
</script>

<style scoped>
  .db_tab_info .urge_title {
    padding: 5px;
    text-align: right;
  }

  .db_tab_info .urge_content {
    padding: 5px;
    word-wrap: break-word;
  }
</style>
