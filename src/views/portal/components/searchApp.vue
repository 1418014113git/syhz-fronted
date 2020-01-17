<template>
  <div class="searchApp">
    <el-form :inline="true" :model="filters" size="mini"  @submit.native.prevent>
      <el-row type="flex" justify="center">
        <el-form-item class="word">
          <el-input placeholder="输入关键字"  prefix-icon="el-icon-search"  v-model.trim="filters.word"></el-input>
        </el-form-item>
        <el-form-item>
          <span  class="yjss"  @click="searchs()">一键搜索</span>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'searchApp',
  data() {
    return {
      marqueeText: '',
      curDept: {},
      filters: {
        word: ''
      }
    }
  },
  methods: {
    searchs() {
      this.$router.push({
        path: '/search/index?', query: { word: this.filters.word }
      })
    }

  },
  mounted() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.searchApp {
  height: 30px;
  margin-top: 6px;
  .el-input__inner {
    color: #fff;
    background-color: transparent;
    border-radius: 6px;
    border: solid 1px #21e8ff;
  }
  input::-webkit-input-placeholder{
      color: #21e8ff;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color: #21e8ff;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color: #21e8ff;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color: #21e8ff;
  }
  .el-input__icon {
    color: #21e8ff;
  }
  .yjss{
    color: #21e8ff;
    cursor:pointer;
  }
}

@media only screen and (max-width: 1367px) {
  .searchApp .el-input--mini .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
  .searchApp .yjss {
    font-size: 12px;
  }
  .searchApp .el-input {
    width: 145px;
  }
  .searchApp {
    float: right;
  }
  .top .el-form {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
