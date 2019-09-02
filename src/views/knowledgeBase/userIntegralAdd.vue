<template>
  <div>
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form :model="infoForm" size="small" ref="form" :rules="rules" label-width="110px">
            <el-form-item label="积分规则名" prop="title">
              <el-input v-model="infoForm.userIntegralName" size="small" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="syhFllb">
              <el-select v-model="infoForm.syhFllb" placeholder="请选择">
                <el-option label="食品" value="1"></el-option>
                <el-option label="药品" value="2"></el-option>
                <el-option label="环境" value="3"></el-option>
                <el-option label="综合" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="lawCategory">
              <el-select v-model="infoForm.lawCategory" placeholder="请选择">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="infoForm.author" maxlength="50" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="每次积分">
              <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字" style="width: 200px;"></el-input-number>
            </el-form-item>
            <el-form-item label="每日上线">
              <el-input-number v-model="num2" @change="handleChange" :min="1" :max="50" label="描述文字" style="width: 200px;"></el-input-number>
            </el-form-item>
            <el-form-item label="每月上线">
              <el-input-number v-model="num3" @change="handleChange" :min="1" :max="500" label="描述文字" style="width: 200px;"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add" v-loading.fullscreen.lock="loading">保 存
              </el-button>
              <el-button @click="callback">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'userIntegralAdd',
    components: {
    },
    data() {
      return {
        num1: 1,
        num2: 1,
        num3: 1,
        id: '',
        loading: false,
        currentDep: {},
        infoForm: {
          integralName: '',
          syhFllb: '',
          lawCategory: '',
          index: '',
          author: '',
          num: '',
          dayNum: '',
          mouthNum: ''
        },
        categoryOptions: [
          {
            label: '法律', value: '1'
          },
          {
            label: '行政法规', value: '2'
          },
          {
            label: '地方性行政法规', value: '201'
          },
          {
            label: '部门规章', value: '202'
          },
          {
            label: '司法解释', value: '3'
          },
          {
            label: '其他规范性文件', value: '4'
          }
        ],
        rules: {
          title: [
            {
              required: true, message: '请输入标题', trigger: 'change'
            },
            {
              min: 2, max: 100, message: '标题长度应为2到100个字', trigger: 'blur'
            }
          ],
          syhFllb: [
            {
              required: true, message: '请选择类别', trigger: 'change'
            }
          ],
          lawCategory: [
            {
              required: true, message: '请选择分类', trigger: 'change'
            }
          ],
          content: [
            {
              max: 200, message: '内容过长请修改内容', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      callback() {
        this.$router.push('/knowledgeBase/userIntegral')
      },
      add() {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.push('/knowledgeBase/userIntegral')
      },
      handleChange(value) {
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .caseEdit .input_w {
    width: 300px;
  }

  .caseEdit .el-form-item {
    margin-bottom: 16px;
  }
  .caseEdit .el-select,
  .caseEdit .el-date-editor--date {
    width: 100%;
  }
</style>
