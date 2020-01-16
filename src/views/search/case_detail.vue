<template>
  <div>
    <BaseInfo :data="id"></BaseInfo>
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
      return {
        id: this.$route.query.id
      }
    }
  }
</script>

<style scoped>
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
  }
</style>
