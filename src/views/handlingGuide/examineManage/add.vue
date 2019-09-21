<template>
  <section class="addQuestion">
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card class="spt_report">
      <div slot="header">
        <span>考试信息</span>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-form :model="examForm" ref="examForm" :rules="rules" label-width="96px" label-position="left">
            <el-col>
              <el-form-item label="考试名称" prop="examinationName">
                <el-input type="text" size="small" v-model="examForm.examinationName" clearable placeholder="请输入" maxlength="50" style="width:calc(100% - 30px)"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startDate" class="clearfix">
                <el-date-picker v-model="examForm.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" class="left" style="width:calc(100% - 50px)"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试开始时间，只有到了开始时间才能进入考试页面进行考试！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="截止时间" prop="endDate" class="clearfix">
                <el-date-picker v-model="examForm.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" class="left" style="width:calc(100% - 30px)"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试截至时间，截止时间以后，警员将不能在进入考试页面进行考试！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
                <el-form-item label="考试时限" prop="totalDate" class="clearfix">
                <el-input type="text" v-model="examForm.totalDate" clearable placeholder="请输入" maxlength="3" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right"  effect="dark" content="请填写考试限定时间，在时间范围内警员可以自主提交答卷，到达限定时间，系统将强制提交答卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="允许次数" prop="permitNumber" class="clearfix">
                <el-input-number v-model="examForm.permitNumber" :min="1" :max="9" label="请输入"></el-input-number>
                <el-tooltip class="right"  effect="dark" content="请填写允许警员重复考试的次数，有多个成绩时，以最高分成绩为准！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="试卷类型" prop="type" class="clearfix">
                <el-select v-model="examForm.type" placeholder="请选择题型" @change="examPaperTypeChange" class="left" style="width:calc(100% - 30px)">
                  <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="请选择试卷类型，重复考试时，人工组卷题目不会变化；随机组卷题目会随机抽取！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="选择试卷" prop="paper" class="clearfix">
                <el-select v-model="examForm.paper" placeholder="请选择题型" class="left" style="width:calc(100% - 30px)">
                  <el-option v-for="item in paperList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="根据您选择的试卷类型，系统自动获取对应试卷列表，您可以选择需要的考卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="分类" prop="examinationType">
                <el-select v-model="examForm.examinationType" placeholder="请选择分类" style="width:calc(100% - 30px)">
                  <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开放单位" prop="openDepts" class="clearfix">
                <!-- 可以多选；只能是本单位或者下级单位，无法选择上级及其他单位 -->
                <el-select v-model="examForm.openDepts" placeholder="请选择题型" multiple class="left" style="width:calc(100% - 30px)">
                  <el-option v-for="item in openDeptsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-tooltip class="right" effect="dark" content="根据实际情况，选择可以参加本次考试的机构单位！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="阅卷老师" prop="openDepts" class="clearfix">
                <!-- 可以多选；只能是本单位或者下级单位，无法选择上级及其他单位 -->
                <el-transfer class="left" style="width:calc(100% - 30px)"
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入关键字检索人员"
                  v-model="examForm.ry"
                  :data="generateData">
                </el-transfer>
                <el-tooltip class="right" effect="dark" content="请选择本次考试主观题的阅卷人员。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="考试须知" class="clearfix" prop="remark">
                <el-input type="textarea" :rows="2" v-model="examForm.remark" maxlength="1000" placeholder="最多可输入1000文字！" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" effect="dark" content="请填写警员在参加考试时的注意事项，事项内容会在进入考试页面时自动弹出！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="24" align="center" style="margin-bottom:10px;">
              <el-button size="mini" @click="cancel()" class="cancelBtn">取消</el-button>
              <el-button size="mini" @click="handleSave()" class="saveBtn">保存</el-button>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import { uploadImg } from '@/utils/editorUpload'
import { questionTypeAll } from '@/utils/codetotext'

export default {
  name: 'add',
  components: {
    VueEditor
  },
  data() {
    return {
      action: '',
      txData: questionTypeAll(),
      paperList: [], // 只能选择本单位组织的试卷
      openDeptsList: [], // 开放单位只能是本单位或者下级单位，无法选择上级及其他单位
      examForm: {
        tx: '2', // 试题类型
        answerDx: []
      },
      editorHeight: '', // 右侧内容的高度
      value3: 'A',
      generateData: [],
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      rules: {
        examinationName: {
          required: true, message: '请输入考试名称', trigger: 'blur'
        },
        startDate: {
          required: true, message: '请输入开始时间', trigger: 'blur'
        },
        endDate: {
          required: true, message: '请输入截止时间', trigger: 'blur'
        },
        totalDate: {
          required: true, message: '请输入考试时限', trigger: 'blur'
        },
        permitNumber: {
          required: true, message: '请输入允许次数', trigger: 'blur'
        },
        type: {
          required: true, message: '请选择试卷类型', trigger: 'blur'
        },
        paper: {
          required: true, message: '请选择试卷', trigger: 'blur'
        },
        examinationType: {
          required: true, message: '请选择分类', trigger: 'change'
        },
        openDepts: {
          required: true, message: '请选择开放单位', trigger: 'blur'
        }
      }
    }
  },
  methods: {
    init() {
      // this.openDeptsList

      // this.generateData = _ => {
      const data = []
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu']
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      this.generateData = data
      // return data
      // }
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    },
    cancel() {
      this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    handleSave() {
      this.$message({
        type: 'success',
        message: '添加成功'
      })
      this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    examPaperTypeChange(val) { // 试卷类型change，只能选择本单位组织的试卷，其他单位的无法选择

    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.init()
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.spt_report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.left {
  float: left;
}
.right {
  float: right;
}
</style>
