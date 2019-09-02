<template>
  <div>
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="20" style="margin-right: 134px;">
          <el-form :model="casezy" size="small" ref="form" :rules="rules" label-width="210px">
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="casezy.title" size="small" maxlength="50" class="input_w"></el-input>
              </el-form-item>
              <el-form-item label="类别" prop="syhFllb">
                <el-select v-model="casezy.syhFllb" placeholder="请选择" @change="lbChange" class="input_w">
                  <!-- <el-option label="食品" value="1000"></el-option>
                  <el-option label="药品" value="2000"></el-option>
                  <el-option label="环境" value="3000"></el-option>
                  <el-option label="综合" value="4000"></el-option> -->
                  <el-option label="国家标准" value="1000"></el-option>
                  <el-option label="行业标准" value="2000"></el-option>
                  <el-option label="企业标准" value="3000"></el-option>
                  <el-option label="地方标准" value="4000"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="standardCategory">
                <el-select v-model="casezy.standardCategory" placeholder="请选择" @change="standardCategoryChange"  class="input_w">
                  <el-option v-for="item in cascaderOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- <el-cascader :options="cascaderOptions" v-model="casezy.standardCategory" @change="handleChange"></el-cascader> -->
              </el-form-item>
              <el-form-item label="施行日期">
                <el-date-picker v-model="casezy.enforcementDate"  type="date" placeholder="施行日期"  class="input_w"></el-date-picker>
              </el-form-item>
              <div v-if="chooseableFlag">
                <el-form-item label="批次" class="batch" prop="batch">
                  <el-input-number v-model="casezy.batch" :min="1" :max="100" label="批次"></el-input-number>
                </el-form-item>
                <el-form-item label="品种类别" prop="varietyCategory" v-if="pzlb">
                  <el-select v-model="casezy.varietyCategory" placeholder="请选择">
                    <el-option label="国内品种" value="2031"></el-option>
                    <el-option label="进口品种" value="2032"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="yffCategoryLabel" prop="yffCategory">
                  <el-input v-model="casezy.yffCategory" :rows="2" placeholder="请输入内容" type="textarea" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="yffNameLabel" prop="yffName">
                  <el-input v-model="casezy.yffName" :rows="2" placeholder="请输入内容" type="textarea" maxlength="100"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="颁布机关">
                <el-input v-model="casezy.establishmentOrgan" maxlength="50" size="small"  class="input_w" ></el-input>
              </el-form-item>
              <el-form-item label="颁布日期">
                <el-date-picker v-model="casezy.issueDate"  type="date" placeholder="颁布日期"  class="input_w"></el-date-picker>
              </el-form-item>
              <el-form-item label="颁布文号">
                <el-input v-model="casezy.enactment" size="small" maxlength="20"  class="input_w"></el-input>
              </el-form-item>
              <el-form-item label="时效性">
                <el-input v-model="casezy.timeliness" size="small" maxlength="100"  class="input_w"></el-input>
              </el-form-item>
              <div v-if="chooseableFlag">
                <el-form-item :label="detectionBaseLabel" prop="detectionBase">
                  <el-input v-model="casezy.detectionBase" :rows="2" placeholder="请输入内容" type="textarea"  class="input_w"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="editorWidth">
              <el-form-item label="正文" prop="content">
                <vue-editor v-model="casezy.content" useCustomImageHandler @imageAdded="handleImageAdded"
                            style="min-width: 500px;"></vue-editor>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onEdit" v-loading.fullscreen.lock="loading">保 存
                </el-button>
                <el-button @click="toList">取 消</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import {
  uploadImg
} from '@/utils/editorUpload'

export default {
  name: 'caseEdit',
  components: {
    VueEditor
  },
  data() {
    return {
      id: '',
      loading: false,
      currentDep: {},
      casezy: {
        syhFllb: '',
        standardCategory: '',
        batch: '',
        yffCategory: '',
        yffName: '',
        detectionBase: '',
        varietyCategory: '',
        establishmentOrgan: '',
        enactment: '',
        issueDate: '',
        enforcementDate: '',
        timeliness: '',
        title: '',
        content: '',
        createUser: ''
      },
      cascaderOptions: [],
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
      optionsSP: [
        {
          value: '1010',
          label: '食品中可能违法添加的非食用物质名单'
        }, {
          value: '1020',
          label: '食品中可能滥用的食品添加剂品种名单'
        },
        {
          value: '1030',
          label: '其它食品标准'
        }
      ],
      optionsYP: [
        {
          value: '2010',
          label: '保健食品中易非法添加的物质和组分及检测依据'
        }, {
          value: '2020',
          label: '化妆品中易非法添加的物质、组分及检测依据'
        }, {
          value: '2030',
          label: '含可待因复方口服溶液品种目录'
          // children: [{
          //   value: '',
          //   label: '出口'
          // }, {
          //   value: 'sketch',
          //   label: '进口'
          // }]
        },
        {
          value: '2040',
          label: '其它药品标准'
        }
      ],
      optionsHJ: [
        {
          value: '3010',
          label: '其它环境标准'
        }

      ],
      pzlb: false,
      chooseableFlag: false,
      yffCategoryLabel: '',
      yffNameLabel: '',
      detectionBaseLabel: '',
      rules: {
        // title: [
        //   {
        //     required: true, message: '请输入标题', trigger: 'change'
        //   },
        //   {
        //     min: 2, max: 100, message: '标题长度应为2到100个字', trigger: 'blur'
        //   }
        // ],
        syhFllb: [
          {
            required: true, message: '请选择类别', trigger: 'change'
          }
        ],
        standardCategory: [
          {
            required: true, message: '请选择分类', trigger: 'change'
          }
        ],
        yffCategory: [
          {
            required: true, message: '不能为空', trigger: 'change'
          }
        ],
        yffName: [
          {
            required: true, message: '不能为空', trigger: 'change'
          }
        ],
        detectionBase: [
          {
            required: true, message: '不能为空', trigger: 'change'
          }
        ],
        content: [
          {
            max: 40000, message: '内容过长请修改内容', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getCategoryData(key) {
      let a = ''
      this.categoryOptions.forEach(item1 => {
        if (item1.value === key) {
          a += item1.label + ','
        }
      })
      return a
    },
    lbChange(val) {
      if (val === '1000') { // 食品
        this.cascaderOptions = this.optionsSP
      } else if (val === '2000') { // 药品
        this.cascaderOptions = this.optionsYP
      } else if (val === '3000') { // 环境
        this.cascaderOptions = this.optionsHJ
      } else if (val === '4000') { // 综合
        this.cascaderOptions = this.optionsYP
      }
      this.casezy.standardCategory = ''
      this.chooseableFlag = false
    },
    standardCategoryChange(val) { // 分类改变
      this.chooseableFlag = true
      this.pzlb = false // 品种类别
      if (val === '1010') { // 食品中可能违法添加的非食用物质名单
        this.yffCategoryLabel = '可能添加的食品品种'
        this.yffNameLabel = '名称'
        this.detectionBaseLabel = '检测方法'
      } else if (val === '1020') { // 食品中可能滥用的食品添加剂品种名单
        this.yffCategoryLabel = '可能适用的添加剂品种'
        this.yffNameLabel = '名称'
        this.detectionBaseLabel = '检测方法'
      } else if (val === '1030') { // 其它食品标准
        this.chooseableFlag = false
      } else if (val === '2010') { // 保健食品中易非法添加的物质和组分及检测依据
        this.yffCategoryLabel = '易非法添加的保健食品产品类别'
        this.yffNameLabel = '易非法添加的物质或组分名称'
        this.detectionBaseLabel = '检测依据'
      } else if (val === '2020') { // 化妆品中易非法添加的物质、组分及检测依据
        this.yffCategoryLabel = '易非法添加的化妆品产品类别'
        this.yffNameLabel = '易非法添加的禁用物质或组分名称'
        this.detectionBaseLabel = '检测依据'
      } else if (val === '2030') { // 含可待因复方口服溶液品种目录
        this.yffCategoryLabel = '品种类别'
        this.yffNameLabel = '药品名称'
        this.detectionBaseLabel = '生产企业名称'
        this.pzlb = true
      } else {
        this.chooseableFlag = false
      }
    },
    // handleChange(value) {
    //   console.log(value)
    // },
    onEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.casezy.enforcementDate = this.casezy.enforcementDate ? this.$parseTime(this.casezy.enforcementDate, '{y}-{m}-{d}') : ''
          this.casezy.issueDate = this.casezy.issueDate ? this.$parseTime(this.casezy.issueDate, '{y}-{m}-{d}') : ''
          if (this.casezy.standardCategory === '1030' || this.casezy.standardCategory === '2040' || this.casezy.standardCategory === '3010') {
            // 选有其他字样
            if (!this.casezy.title) {
              this.loading = false
              this.$message.error('请输入标题')
              return false
            }
          }
          if (sessionStorage.getItem(this.$route.path)) {
            this.casezy.id = this.id
            this.$update('standard/' + this.id, this.casezy).then(response => {
              this.loading = false
              this.$router.push('/handlingGuide/hybzList')
            })
          } else {
            this.$save('standard', this.casezy).then(response => {
              this.loading = false
              this.$router.push('/handlingGuide/hybzList')
            })
          }
        }
      })
    },
    getDetail() {
      this.loading = true
      this.$query('standard/' + this.id, {}).then(response => {
        this.loading = false
        this.casezy = response.data
        this.standardCategoryChange(this.casezy.standardCategory)
        if (this.casezy.standardCategory.charAt(0) === '1') {
          this.cascaderOptions = this.optionsSP
        } else if (this.casezy.standardCategory.charAt(0) === '2') {
          this.cascaderOptions = this.optionsYP
        } else if (this.casezy.standardCategory.charAt(0) === '3') {
          this.cascaderOptions = this.optionsHJ
        } else if (this.casezy.standardCategory.charAt(0) === '4') {
          // this.standardCategory = this.optionsSP

        }
        // this.standardCategory
      }).catch(() => {
        this.loading = false
      })
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
    toList() {
      this.$router.push({ path: '/handlingGuide/hybzList' })
    }
  },
  mounted() {
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.currentDep && curUser) {
      this.casezy.createUser = curUser.realName
    }
    if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
      this.id = sessionStorage.getItem(this.$route.path)
      this.getDetail()
    }
  }
}
</script>

<style>
.caseEdit .input_w {
  width: 300px;
}

.caseEdit .el-form-item {
  margin-bottom: 16px;
}
.caseEdit .batch .el-input--small .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
.caseEdit .el-select,
.caseEdit .el-date-editor--date {
  /* width: 100%; */
}
.editorWidth{
  width: 102.7%;
}
@media only screen and (min-width: 1920px){
.editorWidth{
  width: 93%;
  }
}
</style>
