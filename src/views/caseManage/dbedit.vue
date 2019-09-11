<template>
  <div>
    <el-row class="dbedit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <el-card class="dbedit">
    <el-row type="flex" justify="center" v-loading="dataLoading">
      <el-col :span="18">
        <h3 class="assist_form">
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">案件督办</p>
        </h3>
        <el-form ref="dbForm" :model="dbBean" :rules="rules" label-width="140px">
          <el-form-item label="申请人：">
            {{dbBean.applyPersonName}}
          </el-form-item>
          <el-form-item label="申请部门：">
            {{dbBean.applyDeptName}}
          </el-form-item>
          <el-form-item label="督办案件：" prop="caseId">
            <el-select v-model="dbBean.caseId" filterable clearable remote reserve-keyword
                       placeholder="输入案件名称搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible"
                       value-key="id" class="db_create_input">
              <el-option v-for="item in dbajData" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办名称：" prop="dbName">
            <el-input v-model="dbBean.dbName" auto-complete="off" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="督办级别：">
            {{formatterLevel(dbBean.superviseLevel)}}
            <!--<el-select v-model="dbBean.superviseLevel" placeholder="请选择督办级别" class="db_create_input">-->
              <!--<el-option v-for="item in dbjbData" :key="item.code" :label="item.code_name" :value="item.code"></el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="督办负责人：" prop="supervisePersonId">
            <el-select v-model="dbBean.supervisePersonId" placeholder="请选择督办负责人" filterable class="db_create_input" @change="fzrChange">
              <el-option v-for="(item,index) in userData" :key="item.id + index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人电话：" prop="checkName">
            <el-input v-model="dbBean.personLiablePhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="审核部门：" prop="superviseExamDeptId">
            <el-select v-model="dbBean.superviseExamDeptId" placeholder="请选择部门" class="db_create_input" @change="deptChange">
              <el-option v-for="(item,index) in exDeptData" :key="item.id + index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请原因：" prop="superviseDesc">
            <el-input type="textarea" :autosize="{minRows: 8, maxRows: 20}" v-model="dbBean.superviseDesc" class="db_create_input" maxlength="500"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitEdit" v-loading.fullscreen.lock="saveLoading">保存</el-button>
            <el-button type="primary" @click="onSubmit" v-loading.fullscreen.lock="saveLoading">提交</el-button>
            <el-button @click="cancel">取消</el-button>
            <p style="font-size: 12px; color: #ffffff">提交后将不能修改和删除</p>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
import {
  addSupervise, editSupervise, getSupervise, getDBCase, dbOnlySave, superviseReject
} from '@/api/supervise'
import {
  getUsersByDep, getSessionDeptSelect
} from '@/api/depts'
import {
  getDBLevel, getDBLevelText
} from '@/utils/codetotext'
import {
  getParentDeptArray, getDeptLevel
} from '@/api/dept'

export default {
  props: {
    bean: Object
  },
  data() {
    return {
      dataLoading: false,
      caseLoading: false,
      saveLoading: false,
      dbajData: [],
      exDeptData: [],
      dbjbData: getDBLevel(),
      userData: [],
      dbBean: {
        caseId: null, dbName: null, superviseLevel: null, supervisePersonId: null, superviseExamDeptId: null, superviseDesc: ''
      },
      rules: {
        caseId: [{
          required: true, message: '请选择督办案件', trigger: 'change'
        }],
        superviseLevel: [{
          required: true, message: '请选择督办级别', trigger: 'change'
        }],
        supervisePersonId: [{
          required: false, message: '请选择督办部门负责人', trigger: 'change'
        }],
        superviseExamDeptId: [{
          required: true, message: '请选择审核部门', trigger: 'change'
        }],
        dbName: [{
          required: true, message: '请输入督办名称', trigger: 'blur'
        }, {
          min: 3, max: 100, message: '长度在 3 到 100 个字', trigger: 'blur'
        }],
        superviseDesc: [{
          required: true, message: '请输入督办说明', trigger: 'blur'
        }, {
          min: 5, max: 500, message: '长度在 5 到 500 个字', trigger: 'blur'
        }]
      },
      curDept: {},
      curUser: {}
    }
  },
  methods: {
    formatterLevel(level) {
      return getDBLevelText(level)
    },
    fzrChange(val) {
      this.userData.forEach((item, i) => {
        if (item.id === val) {
          this.dbBean.supervisePerson = item.name
          this.dbBean.personLiablePhone = item.phone
          return true
        }
      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['id']) {
            this.dbBean.superviseExamDept = this.exDeptData[i]['name']
            return true
          }
        }
      } else {
        this.dbBean.superviseExamDept = null
        this.dbBean.superviseExamDeptId = null
      }
    },
    onSubmitEdit() {
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          this.dbBean.logFlag = 1 // 手动点击时，添加埋点参数
          if (this.dbBean.id) {
            this.handleEdit(0)
          } else {
            this.handleSave(0)
          }
        }
      })
    },
    onSubmit() {
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          this.dbBean.logFlag = 1 // 手动点击时，添加埋点参数
          if (this.dbBean.id) {
            this.handleEdit(1)
          } else {
            this.handleSave(1)
          }
        }
      })
    },
    handleEdit(state) {
      const req = this.dbBean
      if (this.dbBean.category === 'apply') {
        this.saveLoading = true
        if (state === 0) {
          this.directEdit(req)
        }
        if (state === 1) {
          req.serverId = req.id
          if (req.status === '2') {
            req.type = '0003'
            req.approveDept = req.superviseExamDeptId
            req.approveDeptName = req.superviseExamDept
            superviseReject(req).then((res) => {
              this.saveLoading = false
              this.returnMsg('提交成功', res)
            }).catch(() => {
              this.saveLoading = false
            })
          } else {
            req.status = 1
            addSupervise(req).then((res) => {
              this.saveLoading = false
              this.returnMsg('提交成功', res)
            }).catch(() => {
              this.saveLoading = false
            })
          }
        }
      }
    },
    directEdit(req) {
      editSupervise(req).then((res) => {
        this.saveLoading = false
        this.returnMsg('提交成功', res)
      }).catch(() => {
        this.saveLoading = false
      })
    },
    handleSave(state) {
      this.saveLoading = true
      const req = this.dbBean
      req.status = state
      if (state === 1) {
        req.skip = 'false'
        addSupervise(req).then((res) => {
          this.saveLoading = false
          this.returnMsg('提交成功', res)
        }).catch(() => {
          this.saveLoading = false
        })
      } else if (state === 0) {
        this.onlySave(req)
      }
    },
    onlySave(req) {
      req.bizType = 3
      req.action = '添加督办案件'
      dbOnlySave(req).then((res) => {
        this.saveLoading = false
        this.returnMsg('提交成功', res)
      }).catch(() => {
        this.saveLoading = false
      })
    },
    cancel() {
      // this.$router.back(-1)
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    },
    returnMsg(msg, response) {
      if (response.code === '000000') {
        this.$message({
          message: msg, type: 'success'
        })
        this.cancel()
      }
    },
    caseVisible(flag) {
      if (!flag) {
        this.dbajData = []
      }
    },
    queryCase(val) {
      if (!val) {
        return false
      }
      this.caseLoading = true
      this.$query('searchsyhaj', {
        ajmc: val,
        depCode: this.curDept.depCode
      }).then((response) => {
        this.caseLoading = false
        if (response.data.length > 0) {
          this.dbajData = response.data
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    initEdit() {
      this.dataLoading = true
      getSupervise({
        id: this.$route.params.id
      }).then((response) => {
        const data = response.data
        if (data) {
          this.dbBean.id = data.id
          this.dbBean.applyPersonId = data.apply_person_id
          this.dbBean.applyPersonName = data.apply_person_name
          this.dbBean.applyDeptId = data.apply_dept_id
          this.dbBean.applyDeptName = data.apply_dept_name
          this.dbBean.status = data.status
          this.dbBean.superviseLevel = data.supervise_level
          this.dbBean.superviseDesc = data.supervise_desc
          this.dbBean.superviseExamDept = data.supervise_exam_dept
          this.dbBean.superviseExamDeptId = Number(data.supervise_exam_dept_id)
          this.dbBean.supervisePersonId = data.supervise_person_id
          this.dbBean.supervisePerson = data.supervise_person
          this.dbBean.userId = data.apply_person_id
          this.dbBean.userName = data.apply_person_name
          this.dbBean.dbName = data.db_name
          this.dbBean.personLiablePhone = data.person_liable_phone
          getDBCase({
            caseId: data.case_id
          }).then((response) => {
            this.dataLoading = false
            if (response.data) {
              this.dbajData = response.data
              this.queryCase(this.dbajData[0]['AJMC'])
              this.dbBean.caseId = Number(data.case_id)
            }
          }).catch(() => {
            this.dataLoading = false
          })
        } else {
          this.dataLoading = false
        }
      }).catch(() => {
        this.dataLoading = false
      })
    },
    getUsers(deptcode) {
      getUsersByDep(deptcode).then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data
          const list = []
          data.forEach((item) => {
            list.push({
              id: item.id + '', name: item.real_name, userName: item.user_name, phone: item.phone
            })
          })
          this.userData = list
        }
      })
    },
    getDepts() {
      this.exDeptData = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
      const level = getDeptLevel(this.curDept.depCode)
      this.dbBean.superviseLevel = String(level + 1)
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    const dept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (userInfo && dept) {
      this.curUser = userInfo
      this.curDept = dept
      this.dbBean.applyPersonId = userInfo.id
      this.dbBean.applyPersonName = userInfo.realName
      this.dbBean.userId = userInfo.id
      this.dbBean.userName = userInfo.realName
      this.dbBean.applyDeptId = dept.id
      this.dbBean.applyDeptName = dept.depName
      this.dbBean.category = 'apply'
    }
    this.getDepts()
    let deptcode = []
    if (Number(this.dbBean.superviseLevel) === 2 || Number(this.dbBean.superviseLevel) === 3) {
      deptcode = [61000053]
    }
    if (Number(this.dbBean.superviseLevel) === 4) {
      deptcode = [this.curDept.parentDepCode.substring(0, 8)]
    }
    if (deptcode) {
      this.getUsers(deptcode)
    }
    if (this.$route.params.id) {
      this.initEdit()
    }
    if (this.$route.query.caseName && this.$route.query.caseId) {
      if (!isNaN(Number(this.$route.query.caseId)) && Number(this.$route.query.caseId) !== 0) {
        getDBCase({
          caseId: this.$route.query.caseId
        }).then((response) => {
          this.dataLoading = false
          if (response.data) {
            this.dbajData = response.data
            this.queryCase(this.$route.query.caseName)
            this.dbBean.caseId = Number(this.$route.query.caseId)
          }
        }).catch(() => {
          this.dataLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>
.dbedit {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}

.dbedit h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.dbedit .db_create_input {
  width: 100%;
}
.dbedit .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
</style>
