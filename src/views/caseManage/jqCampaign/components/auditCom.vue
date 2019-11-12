<template>
<!-- 审核弹框 -->
  <div class="auditCom">
    <!-- 省厅审核弹框 -->
    <div class="stshForm" v-if='roleType===1'>
      <el-form ref="stshForm" :rules="rules" :model="stshForm" size="small" label-width="100px">
        <el-form-item label="编号" prop="num">
          <el-input v-model.trim="stshForm.num" clearable maxlength="50" placeholder="请输入"  class="inputW"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="stshForm.startTime"   type="datetime" format="yyyy-MM-dd HH:mm"  placeholder="请选择开始时间" class="inputW"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="endTime">
          <el-date-picker v-model="stshForm.endTime"   type="datetime" format="yyyy-MM-dd HH:mm"  placeholder="请选择截止时间" class="inputW"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model.trim="stshForm.remark" type="textarea" :rows="4" clearable  maxlength="500" placeholder="" class="inputW"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="checkstOption(2)" :loading="stbtnLoading" style="margin-right:20px;">不通过</el-button>
        <el-button  type="primary" @click="checkstOption(1)"  class="saveBtn" :loading="stbtnLoading">通过</el-button>
      </el-row>
    </div>

     <!-- 地市审核弹框 -->
     <div class="dsshForm" v-else-if='roleType===2'>
      <el-form ref="dsshForm" :rules="rules" :model="dsshForm" size="small" label-width="100px">
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model.trim="dsshForm.remark" type="textarea" :rows="4" clearable  maxlength="500" placeholder="" class="inputW"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="checkdsOption(2)" :loading="stbtnLoading" style="margin-right:20px;">不通过</el-button>
        <el-button  type="primary" @click="checkdsOption(1)"  class="saveBtn" :loading="stbtnLoading">通过且向上申请</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['cardId', 'isShowDialog'],
  name: 'baseInfo',
  data() {
    return {
      curUser: {}, // sessionStorage获取用户信息
      stshForm: { // 省厅审核
        num: '', // 编号
        startTime: '', // 开始时间
        endTime: '', // 截止时间
        remark: '' // 审核意见
      },
      dsshForm: { // 地市厅审核
        remark: '' // 审核意见
      },
      remarkType: '', // 当前选择的审核状态 1:通过，2不通过
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      stbtnLoading: false, // 省厅弹框按钮loading
      rules: {
        num: [ // 编号
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请输入编号'))
              } else {
                if (this.$regCode.test(value)) {
                  callback(new Error('请不要输入特殊字符'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        startTime: [ // 开始时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择开始时间'))
              } else {
                callback()
              }
            }
          }
        ],
        endTime: [ // 截止时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择截止时间'))
              } else {
                if (this.stshForm.startTime) {
                  if (value < this.stshForm.startTime) {
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
        remark: [ // 审核意见校验
          { required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (this.remarkType === 2) { // 不通过
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
    cardId(val) {
      this.cardNumber = val
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
      // if (this.cardId) {
      //   this.cardNumber = this.cardId
      //   this.detail()
      // }
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
    checkstOption(type) { //   省厅审核  type:1 通过， 2：不通过
      this.remarkType = type
      this.$refs.stshForm.validate(valid => {
        if (valid) {
          this.stbtnLoading = true // 加载进度条
          // this.stshForm.status = type // 审核状态
          if (type === 1) { // 通过
            // this.stshForm.remark ? this.stshForm.remark: '审核通过'  // 审核意见
            this.$update('', this.stshForm).then((response) => {
              this.stbtnLoading = false // 关闭加载条
              this.$emit('closeDialog', false)
            }).catch(() => {
              this.stbtnLoading = false // 关闭加载条
            })
          } else { // 不通过
            this.$update('', this.stshForm).then((response) => {
              this.stbtnLoading = false // 关闭加载条
              this.$emit('closeDialog', false)
            }).catch(() => {
              this.stbtnLoading = false // 关闭加载条
            })
          }
        } else {
          this.stbtnLoading = false // 关闭进度条
          return false
        }
      })
    },
    checkdsOption(type) { //  地市审核 type:1 通过， 2：不通过
      this.remarkType = type
      this.$refs.dsshForm.validate(valid => {
        if (valid) {
          this.stbtnLoading = true // 加载进度条
          // this.dsshForm.status = type // 审核状态
          if (type === 1) { // 通过
            // this.dsshForm.remark ? this.dsshForm.remark: '审核通过'  // 审核意见
            this.$update('', this.dsshForm).then((response) => {
              this.stbtnLoading = false // 关闭加载条
              this.$emit('closeDialog', false)
            }).catch(() => {
              this.stbtnLoading = false // 关闭加载条
            })
          } else { // 不通过
            this.$update('', this.dsshForm).then((response) => {
              this.stbtnLoading = false // 关闭加载条
              this.$emit('closeDialog', false)
            }).catch(() => {
              this.stbtnLoading = false // 关闭加载条
            })
          }
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
      // if (this.curDept.depType === '1') { //  省厅 总队
      //   this.roleType = 1
      // } else if (this.curDept.depType === '2') { //地市  支队
      //   this.roleType = 2
      // }
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

