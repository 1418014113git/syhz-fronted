<template>
  <div class="PersonCaseEngine">
    <div style="padding: 16px 0;">
      <el-button v-if="$isViewBtn('100809')" @click="showWeightDia()" type="primary">&nbsp;设&nbsp;置&nbsp;</el-button>
    </div>
    <el-table :data="personData" style="width: 100%">
      <el-table-column label="图片" min-width="10%">
        <template slot-scope="scope">
          <div style="padding: 5px 15px;">
            <img v-if="scope.row.bean.xp" :src="'data:image/jpeg;base64,'+scope.row.bean.xp" :alt="scope.row.bean.xm" width="100%" class="imgStyle">
            <img v-else :src="'data:image/jpeg;base64,'" :alt="scope.row.bean.xm" width="100%" class="imgStyle">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="资料" min-width="30%">
        <template slot-scope="scope">
          <div style="padding: 14px 0;">
            <el-row>
              <el-col :span="4" class="title">姓名：</el-col>
              <el-col :span="9"><span>{{scope.row.bean.xm}}</span>({{scope.row.bean.gmsfhm}})</el-col>
              <el-col :span="3" class="title">性别：</el-col>
              <el-col :span="8">{{scope.row.bean.xb_mc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="title">出生日期：</el-col>
              <el-col :span="8">{{scope.row.bean.csrq}}</el-col>
              <el-col :span="4" class="title">民族：</el-col>
              <el-col :span="8">{{scope.row.bean.mz_mc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="title">婚姻状况：</el-col>
              <el-col :span="8">{{scope.row.bean.hyzk_mc}}</el-col>
              <el-col :span="4" class="title">职业类别：</el-col>
              <el-col :span="8">{{scope.row.bean.zylb_mc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="title">文化程度：</el-col>
              <el-col :span="8">{{scope.row.bean.whcd_mc}}</el-col>
              <el-col :span="4" class="title">宗教信仰：</el-col>
              <el-col :span="8">{{scope.row.bean.zjxy_mc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="title">籍贯区划：</el-col>
              <el-col :span="20">{{scope.row.bean.jgssxq_mc}}</el-col>
            </el-row>
            <el-row>
            <el-col :span="4" class="title">出生地区划：</el-col>
            <el-col :span="20">{{scope.row.bean.csdssxq_mc}}</el-col>
          </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalScore" label="综合评分" min-width="6%"></el-table-column>
      <el-table-column prop="tcx" label="同出行" min-width="6%"></el-table-column>
      <el-table-column prop="trz" label="同入住" min-width="6%"></el-table-column>
      <el-table-column prop="thjl" label="通话记录" min-width="6%"></el-table-column>
      <el-table-column prop="tar" label="同案人" min-width="6%"></el-table-column>
    </el-table>

    <el-dialog title="权重设置" :visible.sync="configDia" width="540px" @close="closeWeightDia">
      <el-form :model="weightBean" :rules="rules" ref="weightForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="同出行：" prop="name">
          <el-input-number v-model="weightBean.tcx" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="同入住：" prop="name">
          <el-input-number v-model="weightBean.trz" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="通话记录：" prop="name">
          <el-input-number v-model="weightBean.thjl" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="同案人：" prop="name">
          <el-input-number v-model="weightBean.tar" :min="0" :max="100" size="mini"></el-input-number>
        </el-form-item>
      </el-form>
      <el-row style="padding-left: 130px;">
        <el-button @click="submitQuery()" :loading="configBtn" type="primary">保存</el-button>
        <el-button @click="weightReset()" :loading="configBtn" type="primary">重置</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'PersonCaseEngine',
    props: ['ajbh'],
    data() {
      return {
        configDia: false,
        configBtn: false,
        AJBH: '',
        personData: [],
        weightBean: {
          tcx: 1, trz: 1, thjl: 1, tar: 1
        },
        savedWeight: {},
        rules: {}
      }
    },
    methods: {
      init() {
        // this.AJBH = 'J1529230212042600001'
        this.$query('personcase', {
          ajbh: this.AJBH
        }).then((response) => {
          if (response.code === '000000') {
            this.personData = response.data
            if (this.personData.length > 0) {
              this.$emit('personCase', this.personData.length)
            }
          }
        })
      },
      submitQuery() {
        const params = this.weightBean
        params.ajbh = this.AJBH
        this.configBtn = true
        this.$query('personcase', params).then((response) => {
          this.configBtn = false
          if (response.code === '000000') {
            this.personData = response.data
            this.configDia = false
            this.savedWeight = JSON.parse(JSON.stringify(this.weightBean))
          }
        }).catch(() => {
          this.configBtn = false
        })
      },
      showWeightDia() {
        this.configDia = true
        if (Object.keys(this.savedWeight).length > 0) {
          this.weightBean = JSON.parse(JSON.stringify(this.savedWeight))
        }
      },
      weightReset() {
        this.weightBean = {
          tcx: 1, trz: 1, thjl: 1, tar: 1
        }
      },
      closeWeightDia() {
        this.weightReset()
      }
    },
    mounted() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.init()
      }
    },
    watch: {
      ajbh(val) {
        this.AJBH = val
        this.init()
      }
    }
  }
</script>

<style scoped>
  .PersonCaseEngine .title {
    text-align: right;
  }
  .PersonCaseEngine .imgStyle {
    border: 1px dashed #d9d9d9; border-radius: 6px; min-height: 100px;
  }
</style>
