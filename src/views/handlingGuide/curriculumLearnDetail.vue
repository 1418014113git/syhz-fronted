<template>
  <section class="curriculumLearnDetail">
    <el-row class="report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="handleBack">   <!--返回-->
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="16" style="border: 1px solid #e4e7ed;z-index:999;">
        <video src="/i/movie.ogg" controls="controls" :height="countHeight" width="100%" :poster="staticImgRrl">
        your browser does not support the video tag
        </video>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'curriculumLearnDetail',
  data() {
    return {
      loading: false,
      countHeight: null,
      staticImgRrl: ''
    }
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: '/educational/onlineTraining/learn'
      })
    }
  },
  mounted() {
    this.countHeight = document.documentElement.clientHeight - 180 + 'px'
  }
}
</script>

<style scoped>
.curriculumLearnDetail .report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
</style>
