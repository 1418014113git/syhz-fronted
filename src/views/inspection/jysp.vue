<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <h3 style="width:180px; padding-right: 12px; text-align: right">申请检验鉴定</h3>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="applyBean" label-width="180px">
          <el-form-item label="主送">
            <el-input v-model="applyBean.zs" size="small" style="width:200px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="送检单位">
            <el-select v-model="applyBean.sjdw" size="small" placeholder="请选择" style="width:200px" :disabled="true">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检民警">
            <el-input v-model="applyBean.sjmj" size="small" style="width:200px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="applyBean.lxdh1" size="small" style="width:200px" :disabled="true" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="案件名称">
            <el-input type="textarea" v-model="applyBean.ajmc" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="检材名称">
            <el-input type="textarea" v-model="applyBean.sjmc" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="送检要求">
            <el-input type="textarea" v-model="applyBean.sjyq" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="applyBean.yxq" size="small" style="width:200px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="公安厅联系人">
            <el-input v-model="applyBean.gatlxr" size="small" style="width:200px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联络电话">
            <el-input v-model="applyBean.lxdh2" size="small" style="width:200px" :disabled="true" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-input v-model="applyBean.fj" size="small"></el-input>
          </el-form-item>
          <el-form-item label="申请单位">
            <el-select v-model="applyBean.sqdw" size="small" placeholder="请选择" style="width:200px" :disabled="true">
              <el-option v-for="item in sqdwSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="applyBean.sqr" size="small" style="width:200px" :disabled="true"></el-input>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <h3>检验鉴定审批</h3>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="applyBean" ref="applyForm" label-width="180px">

          <el-form-item label="是否通过">
            <el-select v-model="applyBean.spsftg" size="small" placeholder="请选择" style="width:200px">
              <el-option v-for="item in spsftgSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审批人">
            <el-input v-model="applyBean.spir" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="驳回理由">
            <el-input type="textarea" v-model="applyBean.spbhly" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="submit">提交申请</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>

  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'

  export default {
    name: 'inspectionApply',
    data() {
      return {
        options: [
          { value: '0', label: '类型1' },
          { value: '1', label: '类型2' }
        ],
        sqdwSelect: [
          { value: '0', label: '内蒙古公安厅' },
          { value: '1', label: '市局' }
        ],
        spsftgSelect: [
          { value: '1', label: '是' },
          { value: '0', label: '否' }
        ],
        applyBean: {
          zs: '',
          sjdw: '',
          sjmj: '',
          lxdh1: '',
          ajmc: '',
          sjmc: '',
          sjyq: '',
          yxq: '',
          gatlxr: '',
          lxdh2: '',
          fj: '',
          sqdw: '',
          sqr: '',
          spsftg: '',
          spir: '',
          spbhly: ''
        }
      }
    },
    methods: {
      toApply() {
        this.$router.push({ path: '/jyjd/apply' })
      },
      getDetail() {
        const id = this.$route.query.id
        if (id) {
          this.applyBean = {
            zs: '主送',
            sjdw: '送检单位',
            sjmj: '送检名称',
            lxdh1: '1213123141',
            ajmc: '名称1',
            sjmc: '名称2',
            sjyq: '灭哦更好啊见到过好贵撒个',
            yxq: '阿达饿啊我发发到付 ',
            gatlxr: '啊放大到个阿嘎多个撒地方',
            lxdh2: '31231241',
            fj: '',
            sqdw: '阿斯蒂芬阿道夫sa',
            sqr: 'afdsfaf'
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
  /*.dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }*/


</style>
