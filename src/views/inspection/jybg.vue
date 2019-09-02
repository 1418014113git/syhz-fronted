<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <h3 style="width:180px; padding-right: 12px; text-align: right">检验鉴定报告</h3>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="jybgBean" ref="jybgForm" label-width="180px">
          <el-form-item label="反馈人">
            <el-input v-model="jybgBean.fkr" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="鉴定报告">
            <el-input type="textarea" v-model="jybgBean.jybg" size="small"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-input v-model="jybgBean.fj" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="submit">提交</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>


  </div>
</template>

<script>
  export default {
    name: 'inspectionApply',
    data() {
      return {
        jybgBean: {
          fkr: '',
          jybg: '',
          fj: ''
        }
      }
    },
    methods: {
      getDetail() {
        const id = this.$route.query.id
        if (id) {
          this.jybgBean = {
            fkr: 'adsfasdf',
            jybg: 'afdasdfasd',
            fj: 'sadfsafsaf'
          }
        }
      }
    },
    mounted() {
      this.getDetail()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
