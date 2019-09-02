<template>
  <!-- 右侧区域标题公共部分 -->
  <div class="titlePub">
    <div slot="header" class="clearfix">
      <span class="letterSpc">{{title}}</span>
      <el-button v-if="url"  class="btn" type="text" @click="toMore(jumpType,url,param)">更多</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'jumpType', 'url', 'param'],
  name: 'personnelFile',
  data() {
    return {

    }
  },
  components: {

  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    toMore(jumpType, url, param) {
      // param 需在页面上JSON.stringigy
      if (url && param) {
        if (jumpType === 0) {
          this.$gotoid(url, param)
        } else if (jumpType === 1) {
          this.$router.push({ path: url, query: JSON.parse(param) })
        }
      } else {
        this.$alert('参数不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: '确定'
            })
          }
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.titlePub {
  font-size: 17px;
  padding: 6px 18px 16px 5px;
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  background: url(/static/image/personFile_images/titlePub.png) no-repeat center
    center;
  background-size: 100% 65%;
  .letterSpc {
    letter-spacing: 3px;
  }
  .btn {
    font-size: 14px;
    float: right;
    padding: 3px 0;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    margin-top: 3px;
  }
}
@media only screen and (max-width: 1367px) {
  .titlePub {
    padding: 4px 3px 13px 5px;
  }
}
</style>

