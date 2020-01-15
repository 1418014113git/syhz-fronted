<template>
  <!-- 右侧区域标题公共部分 -->
  <div class="titlePub">
    <div slot="header" class="clearfix">
      <span class="letterSpc">{{title}}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
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
}
@media only screen and (max-width: 1367px) {
  .titlePub {
    padding: 6px 3px 16px 5px;
  }
}
</style>

