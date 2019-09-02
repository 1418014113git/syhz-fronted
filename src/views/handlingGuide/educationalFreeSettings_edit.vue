<template>
  <div>
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="spt_report">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3>
            <p style="display: inline-block; width: 120px; text-align: right; padding-right: 22px;">考试管理</p>
          </h3>
          <el-form :model="freeSettingsForm" size="small" ref="freeSettingsForm" :rules="rules" label-width="140px">
            <el-form-item label="考试名称" prop="KSMC">
              <el-input v-model="freeSettingsForm.KSMC" auto-complete="off" class="input_w" maxlength="50" placeholder="请输入考试名称"></el-input>
            </el-form-item>
            <el-form-item  label="报名方式" prop="BMFS">
              <el-select v-model="freeSettingsForm.BMFS" placeholder="请选择报名方式" style="width: 100%;">
                <el-option v-for="item in BMFSList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报名时间" prop="BMSJRand">
              <el-date-picker v-model="freeSettingsForm.BMSJ" type="daterange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" @change="BMSJChange"
                              value-format="yyyy-MM-dd" clearable class="input_w"></el-date-picker>
            </el-form-item>
            <el-form-item  label="考试类型" prop="KSLX">
              <el-select v-model="freeSettingsForm.KSLX" placeholder="请选择考试类型" style="width: 100%;">
                <el-option v-for="item in KSLXList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考试时间" prop="KSSJRand">
              <el-date-picker v-model="freeSettingsForm.KSSJ" type="daterange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" @change="KSSJChange"
                              value-format="yyyy-MM-dd" clearable class="input_w"></el-date-picker>
            </el-form-item>
            <el-form-item  label="考试范围" prop="KSFW">
              <el-select v-model="freeSettingsForm.KSFW" placeholder="请选择考试范围" multiple style="width: 100%;">
                <el-option v-for="item in KSFWList" :key="item.cityName" :label="item.cityName" :value="item.cityName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报名人数" class="ipt" prop="BMRS">
              <el-input-number v-model="freeSettingsForm.BMRS" :min="1" :max="100" :step="1" label="报名人数" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="考试说明" class="ipt">
              <el-input type="textarea" :rows="2" placeholder="请输入考试说明" v-model="freeSettingsForm.KSSM">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保 存</el-button>
              <el-button size="small" @click="cancelEdit">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'add',
    data() {
      return {
        BMSJRand: [],
        KSSJRand: [],
        BMFSList: [],
        KSLXList: [],
        KSFWList: [],
        freeSettingsForm: {
          KSMC: '',
          KSLX: '',
          BMFS: '',
          KSFW: [],
          BMRS: 1,
          KSSJ: [],
          BMSJ: [],
          KSSM: ''
        },
        filters: {
          citys: []
        },
        options: [],
        props: {
          label: 'cityName',
          value: 'cityCode'
        },
        list: [],
        rules: {
          KSMC: [
            { required: true, message: '请输入考试名称', trigger: 'blur' },
            { max: 50, message: '考试名称不能超过50字', trigger: 'blur' }
          ],
          KSLX: [
            { required: true, message: '请选择考试类型', trigger: 'blur' }
          ],
          BMFS: [
            { required: true, message: '请选择报名方式', trigger: 'blur' }
          ],
          KSFW: [
            { required: true, message: '请选择考试范围', trigger: 'blur' }
          ],
          BMRS: [
            { required: true, message: '报名人数不能为空', trigger: 'blur' },
            { type: 'number', message: '报名人数必须为数字值', trigger: 'blur' }
          ],
          BMSJRand: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.BMSJRand || this.BMSJRand.length < 2) {
                callback(new Error('请选择报名时间范围'))
              } else {
                callback()
              }
            }
          }],
          KSSJRand: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.KSSJRand || this.KSSJRand.length < 2) {
                callback(new Error('请选择考试时间范围'))
              } else {
                callback()
              }
            }
          }]
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.freeSettingsForm.validate(valid => {
          if (valid) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.toList()
          }
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      toList(index) {
        this.$router.push({
          path: '/educational/freeSettings',
          query: {
            source: index
          }
        })
      },
      KSSJChange(val) {
        this.KSSJRand.push(val[0])
        this.KSSJRand.push(val[1])
      },
      BMSJChange(val) {
        this.BMSJRand.push(val[0])
        this.BMSJRand.push(val[1])
      },
      init() {
        this.BMFSList = [
          { 'value': '自主报名', 'label': '自主报名' },
          { 'value': '团体报名', 'label': '团体报名' }
        ]
        this.KSLXList = [
          { 'value': '模拟考试', 'label': '模拟考试' },
          { 'value': '正常考试', 'label': '正常考试' },
          { 'value': '知识竞赛', 'label': '知识竞赛' }
        ]
        this.KSFWList = [
          { 'parent': '000000', 'cityCode': '110000', 'cityName': '陕西省公安厅' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队', 'cityCode': '110100' },
          { 'parent': '110101', 'cityName': '西安市公安局食品犯罪侦查大队', 'cityCode': '110101' },
          { 'parent': '110101', 'cityName': '西安市公安局药品犯罪侦查大队', 'cityCode': '110102' },
          { 'parent': '110101', 'cityName': '西安市公安局环境犯罪侦查大队', 'cityCode': '110103' },
          { 'parent': '110101', 'cityName': '咸阳市公安局食品犯罪侦查大队', 'cityCode': '110104' },
          { 'parent': '110101', 'cityName': '咸阳市公安局药品犯罪侦查大队', 'cityCode': '110105' },
          { 'parent': '110101', 'cityName': '咸阳市公安局环境犯罪侦查大队', 'cityCode': '110106' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队情报信息支队', 'cityCode': '110200' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队办公室', 'cityCode': '110300' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队', 'cityCode': '110400' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'cityCode': '110500' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'cityCode': '110600' }
        ]
        this.list = [
          { 'id': '1', 'KSMC': '三月考试', 'KSLX': '正常考试', 'KSSJ': '2018-06-20 至 2018-06-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局食品犯罪侦查大队，西安市公安局药品犯罪侦查大队', 'FBZT': '已结束', 'CJSJ': '2018-06-15' },
          { 'id': '2', 'KSMC': '四月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-06-27 至 2018-06-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局环境犯罪侦查大队', 'FBZT': '已发布', 'CJSJ': '2018-06-15' },
          { 'id': '3', 'KSMC': '五月考试', 'KSLX': '正常考试', 'KSSJ': '2018-07-20 至 2018-07-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局食品犯罪侦查大队，咸阳市陕西省公安局药品犯罪侦查大队', 'FBZT': '进行中', 'CJSJ': '2018-07-15' },
          { 'id': '4', 'KSMC': '六月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-07-27 至 2018-07-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局环境犯罪侦查大队', 'FBZT': '草稿', 'CJSJ': '2018-07-15' },
          { 'id': '5', 'KSMC': '七月考试', 'KSLX': '正常考试', 'KSSJ': '2018-08-20 至 2018-08-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队，陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' },
          { 'id': '6', 'KSMC': '八月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-08-27 至 2018-08-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' }
        ]
      }
    },
    mounted() {
      this.init()
      if (this.$route.params.id) {
        for (const dataObj of this.list) {
          if (this.$route.params.id === dataObj.id) {
            this.freeSettingsForm = dataObj
          }
        }
      }
    }
  }
</script>

<style scoped>
  .spt_report {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .spt_report h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .spt_report .input_w {
    width: 100%;
  }

  .spt_report .dept-tree {
    max-height: 400px;
    overflow-y: auto;
    padding: 5px;
  }
</style>
