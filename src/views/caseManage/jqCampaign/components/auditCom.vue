<template>
<!-- 审核弹框 -->
  <div class="auditCom">
    <!-- 省厅审核弹框 -->
    <div class="stshForm" v-if='roleType===1'>
      <el-form ref="stshForm" :rules="rules" :model="stshForm" size="small" label-width="100px">
        <el-form-item label="编号" prop="number">
          <el-input v-model.trim="stshForm.number" clearable maxlength="50" placeholder="请输入"  class="inputW"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker v-model="stshForm.startDate"   type="datetime" format="yyyy-MM-dd HH:mm"  placeholder="请选择开始时间" class="inputW"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate">
          <el-date-picker v-model="stshForm.endDate"   type="datetime" format="yyyy-MM-dd HH:mm"  placeholder="请选择截止时间" class="inputW"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核意见" prop="content">
          <el-input v-model.trim="stshForm.content" type="textarea" :rows="4" clearable  maxlength="500" placeholder="" class="inputW"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="checkstOption(4)" :loading="stbtnLoading" style="margin-right:20px;">不通过</el-button>
        <el-button  type="primary" @click="checkstOption(3)"  class="saveBtn" :loading="stbtnLoading">通过</el-button>
      </el-row>
    </div>

     <!-- 地市审核弹框 -->
     <div class="dsshForm" v-else-if='roleType===2'>
      <el-form ref="dsshForm" :rules="rules" :model="dsshForm" size="small" label-width="100px">
        <el-form-item label="审核意见" prop="content">
          <el-input v-model.trim="dsshForm.content" type="textarea" :rows="4" clearable  maxlength="500" placeholder="" class="inputW"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="checkdsOption(4)" :loading="stbtnLoading" style="margin-right:20px;">不通过</el-button>
        <el-button  type="primary" @click="checkdsOption(6)"  class="saveBtn" :loading="stbtnLoading">通过且向上申请</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import titlePub from './titlePub'
import { getSessionDeptSelect } from '@/api/depts'
export default {
  props: ['id', 'isShowDialog', 'row', 'info'],
  name: 'baseInfo',
  data() {
    return {
      curUser: {}, // sessionStorage获取用户信息
      baseInfo: {}, // 基础信息
      curRow: {}, // 审核列表显示审核按的的当前行的数据
      stshForm: { // 省厅审核
        number: '', // 编号
        startDate: '', // 开始时间
        endDate: '', // 截止时间
        content: '' // 审核意见
      },
      dsshForm: { // 地市审核
        content: '', // 审核意见
        acceptDeptId: '', // 接收部门id
        acceptDeptCode: '', // 接收部门code
        acceptDeptName: ''// 接收部门名称
      },
      sjdwData: [], // 地市审核时,从session获取数据，遍历出省厅的部门id
      bsId: '', // 集群战役id
      contentType: '', // 当前选择的审核状态   3通过，4不通过 6向上申请
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      stbtnLoading: false, // 省厅弹框按钮loading
      rules: {
        number: [{//  编号
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var regNumber = /^[A-Za-z0-9]+$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入编号'))
            } else if (!regNumber.test(value)) {
              callback(new Error('仅支持英文、数字'))
            } else if (value === this.form.number) {
              callback()
            } else {
              this.$query('casecluster/numberValid', { dept: this.curDept.depCode }).then((response) => { // 查询是否重复
                if (response.data.length > 0) {
                  return callback(new Error('编码不能重复'))
                }
                callback()
              })
            }
          }
        }],
        startDate: [ // 开始时间
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [ // 截止时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择截止时间'))
              } else {
                if (this.stshForm.startDate) {
                  if (value < this.stshForm.startDate) {
                    return callback(new Error('截止时间不能小于开始时间！'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          }
        ],
        content: [ // 审核意见校验
          { required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (this.remarkType === 4) { // 不通过
              if (!value) {
                callback(new Error('审核意见不能为空'))
              } else {
                callback()
              }
            } else { // 通过，如果意见栏没有输入意见信息，后台处理自动写入“审核通过”
              callback()
            }
          } }
        ]
      }
    }
  },
  components: {
    titlePub
  },
  computed: {

  },
  watch: {
    id(val) {
      this.bsId = val
      this.baseInfo = this.info
    },
    row(val) {
      this.curRow = val
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        this.initData()
      }
    }
  },
  methods: {
    init() {
      this.initData()
      if (this.id) {
        this.bsId = this.id
        this.baseInfo = this.info
      }
      if (this.row) {
        this.curRow = this.row
      }
    },
    initData() {
      this.remarkType = ''
      this.stbtnLoading = false
      this.resetForm('stshForm')
      this.resetForm('dsshForm')
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    checkstOption(type) { //   省厅审核  type:3通过，4不通过
      this.remarkType = type
      const param = {
        userId: this.curUser.id, // 当前用户id
        userName: this.curUser.realName, // 当前用户名
        status: type, // 审核状态
        curDeptName: this.curDept.depName, // 当前部门名称
        curDeptCode: this.curDept.depCode, // 当前部门code
        curDeptId: this.curDept.id, // 当前部门id
        bsId: this.bsId, // 集群战役id
        flowId: this.curRow.flowId, // 列表返回的wfId
        wdId: this.curRow.wdId // 列表返回的wdId
      }
      this.$refs.stshForm.validate(valid => {
        if (valid) {
          this.stbtnLoading = true // 加载进度条
          if (type === 3) { // 通过
            param.number = this.stshForm.number // 编号
            param.startDate = this.stshForm.startDate // 开始时间
            param.endDate = this.stshForm.endDate // 截止时间
            param.content = this.stshForm.content ? this.stshForm.content : '同意'
          }
          this.$update('casecluster/examine', param).then((response) => {
            this.stbtnLoading = false // 关闭加载条
            this.$emit('closeDialog', false)
          }).catch(() => {
            this.stbtnLoading = false // 关闭加载条
          })
        } else {
          this.stbtnLoading = false // 关闭进度条
          return false
        }
      })
    },
    checkdsOption(type) { //  地市审核 type:4不通过，6向上申请
      this.remarkType = type
      this.$refs.dsshForm.validate(valid => {
        if (valid) {
          this.stbtnLoading = true // 加载进度条
          const param = {
            userId: this.curUser.id, // 当前用户id
            userName: this.curUser.realName, // 当前用户名
            status: type, // 审核状态
            curDeptName: this.curDept.depName, // 当前部门名称
            curDeptCode: this.curDept.depCode, // 当前部门code
            curDeptId: this.curDept.id, // 当前部门id
            bsId: this.bsId, // 集群战役id
            flowId: this.curRow.flowId, // 列表返回的wfId
            wdId: this.curRow.wdId // 列表返回的wdId
          }
          if (type === 6) { // 通过
            param.acceptDeptId = this.dsshForm.acceptDeptId// 接收部门id
            param.acceptDeptCode = this.dsshForm.acceptDeptCode// 接收部门code
            param.acceptDeptName = this.dsshForm.acceptDeptName// 接收部门名称
            param.content = this.dsshForm.content ? this.dsshForm.content : '同意'
          }
          this.$update('casecluster/examine', param).then((response) => {
            this.stbtnLoading = false // 关闭加载条
            this.$emit('closeDialog', false)
          }).catch(() => {
            this.stbtnLoading = false // 关闭加载条
          })
        } else {
          this.stbtnLoading = false // 关闭进度条
          return false
        }
      })
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '-1' || this.curDept.depType === '1') { //  省厅 总队
        this.roleType = 1
      } else if (this.curDept.depType === '2') { // 地市  支队
        this.roleType = 2
        this.sjdwData = getSessionDeptSelect()
        this.sjdwData.forEach(item => {
          if (item.depCode === '610000530000') { // 总队 (地市审核时，向上反馈的接收单位是总队)
            this.dsshForm.acceptDeptId = item.id // 接收部门id
            this.dsshForm.acceptDeptCode = item.depCode // 接收部门code
            this.dsshForm.acceptDeptName = item.name // 接收部门名称
          }
        })
      }
    }
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.auditCom{
  .inputW{
    width: 95%;
  }
}
@media only screen and (max-width: 1367px) {

}
</style>

