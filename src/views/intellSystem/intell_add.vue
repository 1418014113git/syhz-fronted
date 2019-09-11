<template>
  <div>
    <el-row class="intell_add">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="intell_add">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3><p style="display: inline-block; width: 120px; text-align: right; padding-right: 22px;">情报线索采集</p></h3>
          <el-form :model="form" ref="form" :rules="rules" size="small"  label-width="180px"> <!--:rules="rules"-->
            <el-form-item label="情报线索标题" prop="BT">
              <el-input :disabled="disabled" v-model="form.BT" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="涉事类型" prop="SSLB">
              <el-select :disabled="disabled" v-model="form.SSLB" placeholder="请选择" class="input_w">
                <el-option  v-for="item in sslbList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="紧急程度" prop="JJCD">
              <el-select :disabled="disabled" v-model="form.JJCD" placeholder="请选择" class="input_w">
                <el-option  v-for="item in jjcdList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="正文" prop="XXZW">
              <vue-editor v-model="form.XXZW" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
            </el-form-item>
            <el-form-item label="涉事诱因" prop="SSYY_NAME">
              <el-input :disabled="disabled" type="textarea" v-model="form.SSYY_NAME" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="报告次序" prop="BGCX">
              <el-select :disabled="disabled" v-model="form.BGCX" placeholder="请选择" class="input_w">
                <el-option  v-for="item in bgcxList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表现形式" prop="BXXS">
              <el-select :disabled="disabled" v-model="form.BXXS" placeholder="请选择" class="input_w">
                <el-option  v-for="item in bxxsList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地点类别" prop="ASDDLB">
              <el-select :disabled="disabled" v-model="form.ASDDLB" placeholder="请选择" class="input_w">
                <el-option  v-for="item in asddlbList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="情报线索案(事)时间"  prop="ASSJ">
              <el-date-picker v-model="form.ASSJ" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" class="input_w"
              :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="情报线索填报人" prop="TBR">
              {{form.TBR}}
            </el-form-item>
            <el-form-item label="线索要素类型" prop="XSLX">
              <el-cascader :disabled="disabled" v-model="XSLXTemp" change-on-select filterable :options="xslxList" @change="xslxChange" clearable class="input_w"></el-cascader>
            </el-form-item>
            <el-form-item v-show="!disabled">
              <el-button type="primary" @click="onSubmit" v-if="$isViewBtn('106010')" :loading="loading">提取并提交</el-button>
              <el-button size="small" @click="cancelEdit">取 消</el-button>
              <!-- <el-button size="small" @click="toList">返回</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="analysisData.length > 0" style="margin-top: 20px; padding-top: 30px; border-top: 1px dashed #00a0e9;">
        <qbxs-info :analysisData="analysisData" :qbxsId="qbxsId"></qbxs-info>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAuthenticate, editAuthenticate } from '@/api/inspectIdent'
import { getUserExt } from '@/api/depts'
import VueEditor from '@/components/Editor/VueEditor'
import QbxsInfo from '@/views/intellSystem/components/QbxsInfo'
import { addIntellInfo } from '@/api/intellSystem'
import { getSYHFLLBList, getSslb, getJjcd, getBgcx, getBxxs, getAsddlb, getAJLBText } from '@/utils/codetotext'
import { uploadImg } from '@/utils/editorUpload'
import { toAnalysis } from '@/api/personSearch/personSearch'
export default {
  name: 'edit',
  components: {
    VueEditor, QbxsInfo
  },
  data() {
    return {
      loading: false,
      form: {
        organizationId: '',
        organizationName: '',
        copyDeptId: '',
        copyDeptName: '',
        copyPerson: '',
        copyPerson2: [],
        copyPersonPhone: '',
        caseId: '',
        caseName: '',
        checkName: '',
        checkReason: '',
        cellPersonName: '',
        cellPersonPhone: '',
        approveDept: '',
        dayNum: 1,
        attachement: '',
        status: 1,
        enable: 0,
        copyPersonIds: '',
        STATUS: 1,
        TBR: '',
        XSLX: ''
      },
      XSLXTemp: [],
      sslbList: getSslb(),
      jjcdList: getJjcd(),
      bgcxList: getBgcx(),
      bxxsList: getBxxs(),
      asddlbList: getAsddlb(),
      xslxList: getSYHFLLBList(),
      deptList: [],
      personList: [],
      ajsyhList: [],
      disabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        BT: [
          {
            required: true, message: '请输入标题', trigger: 'blur'
          },
          {
            max: 200, message: '标题不能超过200字', trigger: 'blur'
          }
        ],
        SSLB: [{ required: true, message: '请选择涉事类型', trigger: 'change' }],
        JJCD: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
        XXZW: [
          {
            required: true, message: '请输入正文', trigger: 'blur'
          },
          {
            max: 3000, message: '信息正文不能超过3000字', trigger: 'blur'
          }
        ],
        SSYY_NAME: [
          {
            required: true, message: '请输入涉事诱因', trigger: 'blur'
          },
          {
            max: 250, message: '涉事诱因不能超过250字', trigger: 'blur'
          }
        ],
        BGCX: [{ required: true, message: '请选择报告次序', trigger: 'change' }],
        BXXS: [{ required: true, message: '请选择表现形式', trigger: 'change' }],
        ASDDLB: [{ required: true, message: '请输入情报线索案(事)时间', trigger: 'change' }],
        TBR: [{ required: true, message: '请选择情报线索填报人', trigger: 'change' }],
        XSLX: [{ required: true, message: '请选择线索要素类型', trigger: 'change' }]
      },
      analysisData: {},
      qbxsId: '',
      curUser: {},
      curDept: {}
    }
  },
  methods: {
    xslxChange(val) {
      this.form.XSLX = ''
      this.form.XSLX_NAME = ''
      if (val && val.length > 0) {
        this.form.XSLX = val.join(',')
        let name = ''
        for (let i = 0; i < val.length; i++) {
          if (i > 0) {
            name += ','
          }
          name = getAJLBText(val[i])
        }
        this.form.XSLX_NAME = name
      }
    },
    sortParam() {
      const form = this.form
      this.sslbList.forEach(function(item) {
        if (item.key === form.SSLB) {
          form.SSLB_NAME = item.name
        }
      })
      this.jjcdList.forEach(function(item) {
        if (item.key === form.JJCD) {
          form.JJCD_NAME = item.name
        }
      })
      this.bgcxList.forEach(function(item) {
        if (item.key === form.BGCX) {
          form.BGCX_NAME = item.name
        }
      })
      this.bxxsList.forEach(function(item) {
        if (item.key === form.BXXS) {
          form.BXXS_NAME = item.name
        }
      })
      this.asddlbList.forEach(function(item) {
        if (item.key === form.ASDDLB) {
          form.ASDDLB_NAME = item.name
        }
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.sortParam()
          this.form.CJDW = this.curDept.depName
          this.form.TBRID = this.curUser.id
          this.form.TBR = this.curUser.realName
          // 如果存在id就是修改，不存在就添加
          this.loading = true
          this.form.logFlag = 1 // 手动点击时，添加埋点参数
          if (this.form.id) {
            editAuthenticate(this.form).then((response) => {
              this.loading = false
              if (response.success === true) {
                this.$message({
                  message: '修改成功', type: 'success'
                })
                // this.toList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            addIntellInfo(this.form).then((response) => {
              if (response.code === '000000') {
                this.$message({
                  message: '添加成功', type: 'success'
                })
                this.form.id = response.data
                this.$router.push({ path: '/intellSystem' })
                // this.analysis(response.data)
                // this.toList()
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initList() {
      getUserExt().then((response) => {
        this.personList = response.data
      })
    },
    analysis(id) {
      this.analysisData = []
      toAnalysis({
        input: this.form.XXZW,
        modhod: 'ToAnalysis',
        customTypes: 'mobile,id_card,bank_card,qq',
        relevance: true
      }).then((response) => {
        if (response.code === '000000') {
          this.loading = false
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const bean = data[i]
            if (bean.id_card) {
              const per = {
                gmsfhm: bean.id_card[0]
              }
              if (bean.mobile) {
                if (!per.serviceInfos) {
                  per.serviceInfos = []
                }
                for (let j = 0; j < bean.mobile.length; j++) {
                  per.serviceInfos.push({
                    type: '3',
                    zh: bean.mobile[j]
                  })
                }
              }
              if (bean.bank_card) {
                if (!per.serviceInfos) {
                  per.serviceInfos = []
                }
                for (let k = 0; k < bean.bank_card.length; k++) {
                  per.serviceInfos.push({
                    type: '7',
                    zh: bean.bank_card[k]
                  })
                }
              }
              this.analysisData.push(per)
            }
          }
        }
        if (this.analysisData.length === 0) {
          this.analysisData = [{}]
        }
        this.qbxsId = id
        for (let i = 0; i < this.analysisData.length; i++) {
          this.analysisData[i]['cjdw'] = this.curDept.id
          this.analysisData[i]['cjdwName'] = this.curDept.depName
          this.analysisData[i]['createUser'] = this.curUser.realName
        }
      }).catch(() => {
        if (this.analysisData.length === 0) {
          this.analysisData = [{}]
        }
        this.qbxsId = id
        for (let i = 0; i < this.analysisData.length; i++) {
          this.analysisData[i]['cjdw'] = this.curDept.id
          this.analysisData[i]['cjdwName'] = this.curDept.depName
          this.analysisData[i]['createUser'] = this.curUser.realName
        }
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
    detail(id) {
      // 查询详情
      const para = { id: id }
      getAuthenticate(para).then((response) => {
        if (response.data.organizationId) { this.form.organizationId = response.data.organizationId }
        if (response.data.organizationName) { this.form.organizationName = response.data.organizationName }
        if (response.data.copyDeptId) { this.form.copyDeptId = response.data.copyDeptId }
        if (response.data.copyDeptName) { this.form.copyDeptName = response.data.copyDeptName }
        if (response.data.copyPerson) { this.form.copyPerson = response.data.copyPerson }
        if (response.data.copyPersonPhone) { this.form.copyPersonPhone = response.data.copyPersonPhone }
        if (response.data.caseId) { this.form.caseId = response.data.caseId }
        if (response.data.caseName) { this.form.caseName = response.data.caseName }
        if (response.data.checkName) { this.form.checkName = response.data.checkName }
        if (response.data.checkReason) { this.form.checkReason = response.data.checkReason }
        if (response.data.cellPersonName) { this.form.cellPersonName = response.data.cellPersonName }
        if (response.data.cellPersonPhone) { this.form.cellPersonPhone = response.data.cellPersonPhone }
        if (response.data.approveDept) { this.form.approveDept = response.data.approveDept }
        if (response.data.dayNum) { this.form.dayNum = response.data.dayNum }
        if (response.data.attachement) { this.form.attachement = response.data.attachement }
        if (response.data.status) { this.form.status = response.data.status }
        if (response.data.enable) { this.form.enable = response.data.enable }
        if (response.data.id) { this.form.id = response.data.id }
        if (response.data.copyPersonIds) { this.form.copyPerson2 = response.data.copyPersonIds.split(',') }
        for (let i = 0; i < this.form.copyPerson2.length; i++) {
          this.form.copyPerson2[i] = parseInt(this.form.copyPerson2[i])
        }
      })
    },
    toList() {
      this.$router.push({ path: '/intellSystem' })
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.toList()
      })
    }
  },
  mounted() {
    this.initList()
    if (this.$route.params.id) {
      this.detail(this.$route.params.id)
    }
    if (this.$route.query.disabled) {
      this.disabled = this.$route.query.disabled
    }
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curUser) {
      this.form.TBRID = this.curUser.id
      this.form.TBR = this.curUser.realName
    }
    if (this.curDept) {
      this.form.CJDW = this.curDept.depName
    }
  }
}
</script>

<style scoped>
.intell_add {
  width: 800px;
  margin: 0 auto;
}

.intell_add {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}

.intell_add h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}

.intell_add .input_w {
  width: 100%;
}
</style>
