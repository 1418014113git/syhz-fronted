<template>
  <div>
    <BaseInfo></BaseInfo>
  </div>
</template>

<script>
  import BaseInfo from './components/BaseInfo'

  export default {
    name: 'detail',
    components: {
      BaseInfo
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
  }
</style>
