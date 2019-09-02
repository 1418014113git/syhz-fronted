<template>
  <div class="config_sets">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 10px">
      <el-tab-pane label="配置管理" name="configs">
        <dict-list ref="configs"></dict-list>
      </el-tab-pane>
      <el-tab-pane label="文件管理" name="file">
        <img-list ref="file"></img-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import DictList from '@/views/config/components/dictList'
  import imgList from '@/views/config/components/imgList'
  export default {
    name: 'config_sets',
    components: {
      DictList, imgList
    },
    data() {
      return {
        activeName: 'configs',
        configQuery: {}
      }
    },
    methods: {
      handleClick(tab, event) {
        this.$refs[tab.name].queryData(true)
      }
    }
  }
</script>

<style scoped>

</style>
