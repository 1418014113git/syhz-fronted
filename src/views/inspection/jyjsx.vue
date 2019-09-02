<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <h3 style="width:180px; padding-right: 12px; text-align: right">检验鉴定报告</h3>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="jyjsxBean" ref="jybgForm" label-width="180px">
          <el-form-item label="主送">
            <el-input v-model="jyjsxBean.zs" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="送检单位">
            <el-select v-model="jyjsxBean.sjdw" size="small" placeholder="请选择" style="width:200px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检民警">
            <el-input v-model="jyjsxBean.sjmj" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="jyjsxBean.lxdh1" size="small" style="width:200px" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="案件名称">
            <el-input v-model="jyjsxBean.ajmc" size="small" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="检材名称">
            <el-input v-model="jyjsxBean.sjmc" size="small" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="送检要求">
            <el-input v-model="jyjsxBean.sjyq" size="small" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="审批人">
            <el-input v-model="jyjsxBean.spr" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="经办人">
            <el-input v-model="jyjsxBean.jbr" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="jyjsxBean.yxq" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="签发日期">
            <el-input v-model="jyjsxBean.qfrq" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-input v-model="jyjsxBean.fj" size="small"></el-input>
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
          zs: '',
          sjdw: '',
          sjmj: '',
          lxdh1: '',
          ajmc: '',
          sjmc: '',
          sjyq: '',
          spr: '',
          jbr: '',
          yxq: '',
          qfrq: '',
          fj: ''
        }
      }
    },
    methods: {
      getDetail() {
        const id = this.$route.query.id
        if (id) {
          this.jybgBean = {
            zs: 'afd',
            sjdw: 'asdf',
            sjmj: 'adfs',
            lxdh1: 'adf',
            ajmc: 'sdf',
            sjmc: 'sf',
            sjyq: 'asdf',
            spr: 'adsf',
            jbr: 'sdf',
            yxq: 'sdf',
            qfrq: 'sdf',
            fj: ''
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
