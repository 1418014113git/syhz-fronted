<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <h3 style="width:180px; padding-right: 12px; text-align: right">增加检验机构</h3>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="applyBean" ref="applyForm" label-width="180px">
          <el-form-item label="名称">
            <el-input v-model="applyBean.jgmc" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="applyBean.jglxrmc" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="机构电话">
            <el-input v-model="applyBean.jgdh" size="small" style="width:200px" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话">
            <el-input v-model="applyBean.jglxrdh" size="small" style="width:200px" maxlength="11"></el-input>
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
    data() {
      return {
        applyBean: {
          jgmc: '',
          jglxrmc: '',
          jgdh: '',
          jglxrdh: ''
        }
      }
    },
    methods: {
      getDetail() {
        const id = this.$route.query.id
        if (id) {
          this.applyBean = {
            jgmc: '发士大夫啊',
            jglxrmc: '上帝发誓',
            jgdh: '啊的说法',
            jglxrdh: '啊的水分无'
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
