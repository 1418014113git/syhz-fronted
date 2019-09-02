<template>
  <div style="width: 100%;height: 100%;">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <img src="./images/caseSpaceAnalysis.png" style="width: 100%;" alt="">
  </div>
</template>
<script>
  export default {
    name: 'caseSpaceAnalysis',
    data() {
      return {}
    },
    methods: {
      toback() {
        window.history.go(-1)
      }
    },
    mounted() {
    }
  }
</script>
<style>

</style>
