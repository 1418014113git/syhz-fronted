<template>
<!-- 审核弹框 -->
  <div class="auditCom">
    <!-- 省厅审核弹框 -->
    <div class="stshForm" v-if='roleType===1'  v-loading="tshLoading">
      <el-form ref="stshForm" :rules="rules" :model="stshForm" size="small" label-width="100px">
        <el-form-item label="编号" prop="number">
          <el-input v-model.trim="stshForm.number" disabled maxlength="50" placeholder=""  class="inputW"></el-input>
        </el-form-item>
         <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="stshForm.startDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            placeholder=""
            class="inputW"
            >
          </el-date-picker>
        </el-form-item>
         <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="stshForm.endDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            placeholder=""
            class="inputW"
            >
          </el-date-picker>
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
  props: ['id', 'isShowDialog', 'info', 'row'],
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
      tshLoading: false, // 省厅弹框页面loading
      pickerOptions: { // 控制开始时间只能大于等于当前时间
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      rules: {
        number: [{//  编号
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var regNumber = /^[A-Za-z0-9]+$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入编号'))
            } else if (!regNumber.test(value)) {
              callback(new Error('仅支持英文、数字'))
            } else if (value === this.stshForm.number) {
              callback()
            } else {
              this.$query('casecluster/numberValid', { dept: this.curDept.depCode, numStr: value }).then((response) => { // 查询是否重复
                if (!response.data) {
                  return callback(new Error('编码不能重复'))
                }
                callback()
              })
            }
          }
        }],
        startDate: [{ // 开始时间
          required: true, trigger: 'change', message: '请选择开始时间'
        }],
        endDate: [ // 结束时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择结束时间'))
              } else {
                if (this.stshForm.startDate) {
                  var startDate = (new Date(this.stshForm.startDate)).getTime()
                  var endDate = (new Date(value).getTime())
                  if (endDate < startDate) {
                    return callback(new Error('结束时间不能小于开始时间！'))
                  } else if (endDate > startDate && Number(endDate) - Number(startDate) < 172800000) {
                    return callback(new Error('结束时间必须大于开始时间2天以上！'))
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
                callback(new Error('请填写审核意见'))
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
    },
    info(val) {
      if (val.clusterId) {
        this.baseInfo = val
        this.init()
      }
    },
    row(val) {
      this.curRow = val
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.initData()
      if (sessionStorage.getItem('depToken')) {
        this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
        if (this.curDept.depType === '-1' || this.curDept.depType === '1') { //  省厅 总队
          this.roleType = 1
          this.queryNumber() // 查询编号
        } else if (this.curDept.depType === '2') { // 地市  支队
          this.tshLoading = false
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
      if (this.id) {
        this.bsId = this.id
      }
      if (this.info) {
        this.baseInfo = this.info
        this.stshForm.startDate = this.baseInfo.startDate ? this.baseInfo.startDate : this.calculateDate(new Date(), 0, '') // 开始时间
        this.stshForm.endDate = this.baseInfo.endDate ? this.baseInfo.endDate : this.calculateDate(new Date(), 7, '')// 结束时间
      }
      if (this.row) {
        this.curRow = this.row
      }
    },
    initData() {
      this.remarkType = ''
      this.tshLoading = false
      this.stbtnLoading = false
      this.resetForm('stshForm')
      this.resetForm('dsshForm')
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    queryNumber() { // 获取编号
      this.tshLoading = true
      const param = {
        dept: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode // 当前部门code
      }
      this.$query('casecluster/number', param).then((response) => {
        this.tshLoading = false
        if (response.data) {
          this.stshForm.number = response.data
        }
      }).catch(() => {
        this.tshLoading = false
      })
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
        flowId: this.curRow.wfId, // 列表返回的wfId
        wdId: this.curRow.wdId, // 列表返回的wdId
        content: this.dsshForm.content // 审核意见
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
            flowId: this.curRow.wfId, // 列表返回的wfId
            wdId: this.curRow.wdId, // 列表返回的wdId
            content: this.dsshForm.content // 审核意见
          }
          if (type === 6) { // 通过
            param.acceptDeptId = this.dsshForm.acceptDeptId// 接收部门id
            param.acceptDeptCode = this.dsshForm.acceptDeptCode// 接收部门code
            param.acceptDeptName = this.dsshForm.acceptDeptName// 接收部门名称
            param.content = this.dsshForm.content ? this.dsshForm.content : '同意' // 审核意见
          }
          // console.log('this.curRow', JSON.stringify(this.curRow))
          // console.log('param', JSON.stringify(param))
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
    calculateDate(date, days, hours) {
      const d = new Date(date)
      if (days) {
        d.setDate(d.getDate() + days)
      }
      if (hours) {
        d.setHours(d.getHours() + hours)
      }
      const m = d.getMonth() + 1
      return d.getFullYear() + '-' + m + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
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
.el-button--text {
    display: none;
  }
@media only screen and (max-width: 1367px) {

}
</style>

