<template>
  <div>
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png" class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="spt_report">
      <!-- 考试规则 -->
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3>
            <p style="display: inline-block; width: 120px; text-align: right; padding-right: 22px;">考试规则</p>
          </h3>
          <el-form :model="examRuleForm" size="small" ref="examRuleForm" :rules="rules" label-width="140px">
            <el-col :span="8">
              <el-form-item label="考试总分" prop="KSZF">
                <el-input-number v-model="examRuleForm.KSZF" :min="1" :max="100" :step="10" label="请输入考试总分" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="考试及格分" prop="KSJGF">
                <el-input-number v-model="examRuleForm.KSJGF" :min="1" :max="100" :step="10" label="请输入考试及格分" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="允许考试次数" prop="YXKSCS">
                <el-input-number v-model="examRuleForm.YXKSCS" :min="1" :max="100" :step="1" label="请输入最大允许考试次数" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="考试时长" prop="KSSC">
                <el-input-number v-model="examRuleForm.KSSC" :min="1" :max="180" :step="10" label="请输入考试时长" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="试题顺序" prop="STSX">
                <el-select v-model="examRuleForm.STSX" placeholder="请选择试题顺序">
                  <el-option v-for="item in STSXList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="试卷类型" prop="SJLX">
                <el-select v-model="examRuleForm.SJLX" placeholder="请选择试卷类型">
                  <el-option v-for="item in SJLXList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否原题补考" prop="SFSYYTBK">
                <el-select v-model="examRuleForm.SFSYYTBK" placeholder="请选择是否原题补考">
                  <el-option v-for="item in SFList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <!-- 试题规则 -->
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3>
            <p style="display: inline-block; width: 120px; text-align: right; padding-right: 22px;">试题分数规则</p>
            <p style="display: inline-block; width: 400px; text-align: left; padding-right: 22px; font-size: 14px; font-weight: lighter;">（试卷总分 {{examRuleForm.KSZF}} 分，已配置 {{questionsRuleForm.SJZF}} 分，剩余{{questionsRuleForm.SYFS}} 分）</p>
          </h3>
          <el-form :model="examRuleForm" size="small" ref="examRuleForm" :rules="rules" label-width="140px">
            <el-col :span="8">
              <el-form-item label="单选题数量" prop="DXTS">
                <el-input-number v-model="questionsRuleForm.DXTS" :min="1" :max="20" :step="1" label="请输入单选题数量" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每题分值" prop="DXTFZ">
                <el-input-number v-model="questionsRuleForm.DXTFZ" :min="1" :max="100" :step="1" label="请输入每题分值" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单选题总分" prop="DXTZF">
                <el-input v-model="questionsRuleForm.DXTZF" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="多选题数量" prop="DDXTS">
                <el-input-number v-model="questionsRuleForm.DDXTS" :min="1" :max="20" :step="1" label="请输入单选题数量" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每题分值" prop="DDXTFZ">
                <el-input-number v-model="questionsRuleForm.DDXTFZ" :min="1" :max="100" :step="1" label="请输入每题分值" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="多选题总分" prop="DDXTZF">
                <el-input v-model="questionsRuleForm.DDXTZF" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="判断题数量" prop="PDTS">
                <el-input-number v-model="questionsRuleForm.PDTS" :min="1" :max="20" :step="1" label="请输入单选题数量" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每题分值" prop="PDTSFZ">
                <el-input-number v-model="questionsRuleForm.PDTFZ" :min="1" :max="100" :step="1" label="请输入每题分值" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="判断题总分" prop="PDTSZF">
                <el-input v-model="questionsRuleForm.PDTSZF" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简答题数量" prop="JDTS">
                <el-input-number v-model="questionsRuleForm.PDTS" :min="1" :max="20" :step="1" label="请输入单选题数量" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每题分值" prop="JDTFZ">
                <el-input-number v-model="questionsRuleForm.PDTFZ" :min="1" :max="100" :step="1" label="请输入每题分值" style="width: 216px;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简答题总分" prop="JDTZF">
                <el-input v-model="questionsRuleForm.PDTSZF" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保 存</el-button>
                <el-button size="small" @click="cancelEdit">取 消</el-button>
              </el-form-item>
            </el-col>
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
        examRuleForm: {
          KSZF: 100,
          KSJGF: 60,
          YXKSCS: 1,
          KSSC: 120,
          STSX: '',
          SJLX: '',
          SFSYYTBK: ''
        },
        questionsRuleForm: {
          DXTS: 0,
          DXTFZ: 1,
          DXTZF: 0,
          DDXTS: 0,
          DDXTFZ: 1,
          DDXTZF: 0,
          PDTS: 0,
          PDTFZ: 1,
          PDTSZF: 0,
          JDTS: 0,
          JDTFZ: 1,
          JDTZF: 0,
          SJZF: 0,
          SYFS: 100
        },
        STSXList: [],
        SJLXList: [],
        SFList: [],
        rules: {}
      }
    },
    methods: {
      toList(index) {
        this.$router.push({
          path: '/handlingGuide/educationalFreeSettings_setting/' + this.$route.params.id,
          query: {
            source: index
          }
        })
      },
      onSubmit() {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.toList()
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      init() {
        this.STSXList = [
          { 'value': '顺序', 'label': '顺序' },
          { 'value': '题干随机', 'label': '题干随机' },
          { 'value': '选项随机', 'label': '选项随机' },
          { 'value': '题干选项都随机', 'label': '题干选项都随机' }
        ]
        this.SJLXList = [
          { 'value': '固定试卷', 'label': '固定试卷' },
          { 'value': '随机试卷', 'label': '随机试卷' }
        ]
        this.SFList = [
          { 'value': '是', 'label': '是' },
          { 'value': '否', 'label': '否' }
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
