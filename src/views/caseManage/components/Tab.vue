<template>
  <el-tabs type="border-card">
    <el-tab-pane v-for="(item,index) in tabData" :key="index" :label="item.title">
      <describe v-if="item.content === 'Describe'"></describe>
      <crime_feature v-else-if="item.content === 'CrimeFeature'"></crime_feature>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import Describe from './Describe'
  import CrimeFeature from './CrimeFeature'
  export default {
    name: 'Tab',
    props: [
      'tabData'
    ],
    components: {
      'describe': Describe,
      'crime_feature': CrimeFeature
    }
  }
</script>

<style scoped>

</style>
