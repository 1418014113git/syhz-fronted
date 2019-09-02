<template>
  <div class="instruct" v-loading="InfLoading">
    <el-row type="flex" justify="space-between" style="margin-bottom: 10px;">
      <el-col :span="4"></el-col>
      <el-col :span="4" style="text-align: right;padding-right: 10px;">
        <el-button type="primary" size="small" v-if="(enableBtn || xfBtnState) && ($isViewBtn('101011') && inegState && ifSign)" v-on:click="toInstruct">下发指令</el-button>
      </el-col>
    </el-row>
    <el-row v-if="infbData && infbData.length > 0">
      <el-collapse v-model="activeNames" accordion @change="handleChange">
        <el-collapse-item v-for="(item,index) in infbData" :key="index" :name="item.id">
          <template slot="title">
            <p class="infb-title">
              <span>{{item.receiveDeptName}}</span>
              <span type="warning" v-if="item.status === '0'" style="color:#909399">草稿</span>
              <span type="warning" v-if="item.status === '1'" style="color:#e6a23c">待签收</span>
              <span v-if="item.status === '2'" style="color:#409eff">待反馈</span>
              <span type="success" v-if="item.status === '3'" style="color:#67c23a">已反馈</span>
              <span v-if="Number(item.status) > 1">签收人：{{item.receiveUserName}}</span>
              <span v-if="Number(item.status) > 1">时间：{{item.receiveDate}}</span>
            </p>
          </template>
          <div v-if="item.requiredContent" style="padding:10px 0; color:#fff; border-bottom: 1px solid #00a0e9;">
            <p>指令内容：</p>
            <p style="padding-left: 28px">{{item.requiredContent}}</p>
            <p v-if="item.status==='0'||item.status==='1'" style="text-align: right;padding:10px;">
              <el-button v-if="item.status==='0' && $isViewBtn('101012')" type="primary" size="small" @click.stop="toUpdInstruct(item)" style="">修改</el-button>
              <el-button v-if="item.status==='0' && $isViewBtn('101013')" type="danger" size="small" @click.stop="delInstruct(item.id)" style="">删除</el-button>
              <el-button v-if="item.status==='0' && $isViewBtn('101014')" type="warning" size="small" @click.stop="doInstruct(item)" style="">下发</el-button>
              <el-button v-if="item.status==='1' && item.receiveDeptId === depToken.id && $isViewBtn('101015')" type="primary" size="small" @click.stop="receiver(item)" style="">签收</el-button>
            </p>
            <p v-if="item.status==='2' && item.receiveDeptId === depToken.id && $isViewBtn('101016')" style="text-align: right;padding:10px;">
              <el-button type="primary" size="small" @click.stop="toFeedBack(item)" style="">反馈</el-button>
            </p>
          </div>
          <div v-if="item.investigationContent" style="margin-top: 10px; padding:10px; color: #FFF">
            <p>反馈内容：</p>
            <p style="padding-left: 28px">{{item.investigationContent}}</p>
            <p style="padding-left: 28px">
              <span style="padding-right: 30px">反馈人：{{item.feedbackUserName}}</span>
              <span>时间：{{item.feedbackDate}}</span>
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-row v-else style="padding: 50px; text-align: center">
      暂时没有指令信息
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :before-close = "cleanDialog">
      <div slot="title">
        {{dialogTitle}}
      </div>
      <el-form ref="feedBackForm" :model="infBean" :rules="rules" label-width="140px">
        <el-form-item v-if="handleType==='addRequired'||handleType==='editRequired'" label="指定部门" prop="receiveDeptId">
          <el-select v-model="infBean.receiveDeptId" clearable @change="reqDeptChange">
            <el-option v-for="item in depData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="infTitle" prop="content">
          <el-input type="textarea" :autosize="{minRows: 3, maxRows: 10}" clearable v-model="content" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item style="padding-top: 10px;">
          <el-button v-if="handleType==='addRequired'" type="primary" size="small" v-on:click="saveInstruct(false)">保存</el-button>
          <el-button v-if="handleType==='editRequired'" type="primary" size="small" v-on:click="updateInstruct">保存</el-button>
          <el-button v-if="handleType==='addRequired'||handleType==='editRequired'" type="primary" size="small" v-on:click="directSave">下发</el-button>
          <el-button v-if="handleType==='addFeedBack'" type="primary" size="small" v-on:click="saveFeedBack">提交</el-button>
          <el-button @click="cleanDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageData, saveInstruct, updInstruct, delInstruct, instructNotice, directSave
} from '@/api/instructFeedBack'
export default {
  name: 'InstructFeedBack',
  props: ['deptIds', 'depts', 'state', 'ifSign', 'btnState'],
  data() {
    return {
      enableBtn: false,
      inegState: false,
      xfBtnState: false,
      InfLoading: false,
      caseId: this.$route.params.id,
      activeNames: ['1'],
      content: '',
      infBean: {
        investigationId: '',
        receiveDeptName: '',
        receiveDeptId: ''
      },
      depData: [],
      userInfo: {},
      depToken: {},
      infTitle: '',
      dialogVisible: false,
      dialogTitle: '',
      infbData: [],
      handleType: '',
      page: 1,
      pageSize: 10,
      total: 0,
      deptIdsStr: '',
      rules: {
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
            value = this.content
            const reg = /^[\s\S]*$/
            if (value.length < 1) {
              callback(new Error('请输入指令'))
            } else if (value.length > 100) {
              callback(new Error('指令不能超过100字'))
            } else if (!reg.test(value)) {
              callback(new Error('指令由字母，数字，汉字组成'))
            } else {
              callback()
            }
          }
        }],
        receiveDeptId: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请勾选参与部门'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    reqDeptChange(val) {
      if (val) {
        console.info(this.depData)
        for (let i = 0; i < this.depData.length; i++) {
          if (val === this.depData[i].id) {
            this.infBean.receiveDeptName = this.depData[i].name
          }
        }
      } else {
        this.infBean.receiveDeptName = ''
      }
    },
    handleChange(val) {
      console.info(val)
    },
    queryList(flag) {
      this.InfLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        deptId: this.depToken.id,
        inegId: this.caseId,
        pageNum: this.page
      }
      getPageData(para).then((response) => {
        this.InfLoading = false
        if (response.code === '000000') {
          this.infbData = response.data.list
          this.total = response.data.totalCount
        }
      }).catch(() => {
        this.InfLoading = false
      })
    },
    delInstruct(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.InfLoading = true
        this.infBean.id = id
        delInstruct(this.infBean).then((response) => {
          if (response.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.queryList(true)
          }
        })
      }).catch(() => {
        this.InfLoading = false
      })
    },
    toInstruct() {
      this.dialogVisible = true
      this.dialogTitle = '下发指令'
      this.infTitle = '指令要求内容：'
      this.handleType = 'addRequired'
      this.content = ''
      this.infBean = {}
      this.infBean.investigationId = this.caseId
      this.infBean.userId = this.userInfo.id
      this.infBean.userName = this.userInfo.realName
      this.infBean.bizId = this.caseId
      this.infBean.bizType = 4
      this.infBean.receiveDeptId = ''
      this.infBean.receiveDeptName = ''
      this.infBean.id = ''
      console.info(this.infBean)
    },
    toFeedBack(obj) {
      this.dialogVisible = true
      this.dialogTitle = '反馈指令'
      this.infTitle = '反馈指令内容：'
      this.handleType = 'addFeedBack'
      this.infBean = JSON.parse(JSON.stringify(obj))
      this.content = ''
    },
    toUpdInstruct(item) {
      this.dialogVisible = true
      this.dialogTitle = '修改下发指令'
      this.infTitle = '指令要求内容：'
      this.infBean = JSON.parse(JSON.stringify(item))
      this.content = item.requiredContent
      this.handleType = 'editRequired'
    },
    saveInstruct() {
      this.$refs.feedBackForm.validate(valid => {
        if (valid) {
          this.infBean.requiredContent = this.content
          this.infBean.status = '0'
          this.infBean.createUser = this.userInfo.id
          this.infBean.createUserName = this.userInfo.realName
          this.infBean.createDeptId = this.depToken.id
          this.infBean.createDeptName = this.depToken.depName
          this.infBean.action = '添加下发指令'
          saveInstruct(this.infBean).then((response) => {
            if (response.code === '000000') {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.queryList(true)
            }
          })
        }
      })
    },
    receiver(item) {
      this.infBean = JSON.parse(JSON.stringify(item))
      this.infBean.status = '2'
      this.infBean.type = 'receive'
      this.infBean.receiveUser = this.userInfo.id
      this.infBean.receiveUserName = this.userInfo.realName
      this.infBean.receiveDeptId = this.depToken.id
      this.infBean.action = '签收指令'
      instructNotice(this.infBean).then((response) => {
        if (response.code === '000000') {
          this.$message({
            message: '签收成功',
            type: 'success'
          })
          this.dialogVisible = false
          location.reload()
        }
      })
    },
    doInstruct(item) {
      this.infBean = JSON.parse(JSON.stringify(item))
      this.infBean.status = '1'
      this.infBean.type = 'notice'
      this.infBean.action = '下发指令'
      this.handleUpd('下发成功')
    },
    saveFeedBack() {
      this.$refs.feedBackForm.validate(valid => {
        if (valid) {
          this.$confirm('提交后将无法修改，请认真检查无误后提交?', '提示', {
            type: 'warning'
          }).then(() => {
            this.infBean.inegContent = this.content
            this.infBean.status = '3'
            this.infBean.type = 'feedback'
            this.infBean.feedbackUser = this.userInfo.id
            this.infBean.feedbackUserName = this.userInfo.realName
            this.infBean.action = '添加指令反馈'
            this.handleUpd('反馈成功')
          }).catch(() => {
            this.InfLoading = false
          })
        }
      })
    },
    updateInstruct() {
      this.$refs.feedBackForm.validate(valid => {
        if (valid) {
          this.infBean.requiredContent = this.content
          updInstruct(this.infBean).then((response) => {
            if (response.code === '000000') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.queryList(true)
            }
          })
        }
      })
    },
    directSave() {
      this.$refs.feedBackForm.validate(valid => {
        if (valid) {
          this.$confirm('提交后将无法修改，请认真检查无误后提交?', '提示', {
            type: 'warning'
          }).then(() => {
            this.infBean.requiredContent = this.content
            this.infBean.status = '1'
            this.infBean.createUser = this.userInfo.id
            this.infBean.createUserName = this.userInfo.realName
            this.infBean.createDeptId = this.depToken.id
            this.infBean.createDeptName = this.depToken.depName
            this.infBean.action = '添加并下发指令'
            if (this.infBean.id) {
              this.doInstruct(this.infBean.id)
            } else {
              directSave(this.infBean).then((response) => {
                if (response.code === '000000') {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.queryList(true)
                }
              })
            }
          })
        }
      })
    },
    handleUpd(message) {
      instructNotice(this.infBean).then((response) => {
        if (response.code === '000000') {
          this.$message({
            message: message,
            type: 'success'
          })
          this.dialogVisible = false
          this.queryList(true)
        }
      })
    },
    cleanDialog() {
      this.$refs.feedBackForm.resetFields()
      this.dialogVisible = false
    },
    ifShowBtn() {
      if (this.deptIdsStr && this.deptIdsStr.indexOf('[' + this.depToken.id + ']') > -1) {
        this.enableBtn = true
      } else {
        this.enableBtn = false
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.infBean.investigationId = this.caseId
    this.infBean.userId = this.userInfo.id
    this.infBean.userName = this.userInfo.realName
    this.infBean.bizId = this.caseId
    this.infBean.bizType = 4
    this.queryList(true)
  },
  watch: {
    deptIds(val) {
      this.deptIdsStr = val
      this.ifShowBtn()
    },
    depts(val) {
      this.depData = val
    },
    state(val) {
      if (val && val !== '') {
        if (Number(val) >= 5 && Number(val) < 7) {
          this.inegState = true
        } else {
          this.inegState = true
        }
      }
    },
    btnState(val) {
      if (val && val !== '') {
        this.xfBtnState = val
      }
    }
  }
}
</script>

<style scoped>
.instruct .infb-title span {
  padding-right: 15px;
}
</style>
