<template>
  <div class="noticeGroupEdit">
    <el-row type="flex" justify="center" style="margin-top:15px;">
      <el-col :span="18">
        <el-form :model="noticeGroupForm" ref="noticeGroupForm" :rules="rules" label-width="100px">
          <el-form-item label="组名" prop="groupName">
            <el-input v-model="noticeGroupForm.groupName" auto-complete="off" clearable maxlength="50" :disabled="isDisabled" v-loading="titleLoading"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="desc">
            <el-input v-model="noticeGroupForm.desc" type="textarea" size="small" maxlength="200" placeholder="最多可输入200个字符！"></el-input>
          </el-form-item>
          <el-form-item label="组成员" prop="receiveDept" class="transfer">
            <el-transfer ref="transfer" v-model="noticeGroupForm.receiveDept" :titles="['单位名称', '单位名称']" filterable :filter-method="filterMethod" :data="transferDeptData"></el-transfer>
          </el-form-item>
          <el-form-item class="btn">
            <el-button @click="cancelEdit" class="cancelBtn">取 消</el-button>
            <el-button type="primary" class="saveBtn" @click="onSubmit()" :loading="loading">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'edit',
    data() {
      return {
        titleLoading: false,
        isDisabled: false,
        showSave: true,
        transferDeptData: [],
        loading: false,
        noticeGroupForm: {
          groupName: '',
          desc: '',
          receiveDept: [],
          type: 2
        },
        deptList: [],
        errorText: '', // 站内信息校验错误提示
        rules: {
          groupName: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regEnCode = this.$regCode
              const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入组名'))
              } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                callback(new Error('组名不能输入特殊字符'))
              } else if (value.length > 50) {
                callback(new Error('组名长度不能超过 50个字符'))
              } else {
                return this.titleCheckAsyns(callback)
              }
            }
          }],
          receiveDept: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value.length === 0) {
                return callback(new Error('请选择接收单位'))
              }
              return callback()
            }
          }],
          desc: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              const regEnCode = this.$regCode
              const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback()
              } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                callback(new Error('组说明不能输入特殊字符'))
              } else if (value.length > 50) {
                callback(new Error('组说明不能超过 50个字符'))
              } else {
                return callback()
              }
            }
          }]
        },
        curDept: {},
        curUser: {},
        titleCheckFlag: false,
        checkFlag: this.$isViewBtn('149007'),
        id: ''
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        this.titleLoading = true
        // 同步处理
        const response = await this.$updateAsyns('notice/validName', { title: this.noticeGroupForm.title, userId: this.curUser.id })
        const data = response.data
        if (this.id !== '') {
          if (data.data === null || data.data.length === 0 || (this.id === data.data[0].id && data.data.length === 1)) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('组名不能重复'))
          }
        } else {
          if (data.data === undefined || data.data === null || data.data.length === 0) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('组名不能重复'))
          }
        }
        this.titleLoading = false
        return callback
      },
      onSubmit() {
        this.loading = true
        this.$refs.noticeGroupForm.validate(valid => {
          if (valid) {
            this.noticeGroupForm.creatorId = this.curUser.id
            this.noticeGroupForm.creatorName = this.curUser.realName
            this.noticeGroupForm.deptId = this.curDept.id
            this.noticeGroupForm.deptName = this.curDept.depName
            this.noticeGroupForm.deptCode = this.curDept.depCode
            this.noticeGroupForm.itemCount = this.noticeGroupForm.receiveDept.length
            this.noticeGroupForm.deptIds = this.noticeGroupForm.receiveDept
            this.$save('/group', this.noticeGroupForm).then((response) => {
              this.timeOutBack()
              this.$message({
                message: '常用组保存成功！',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false
            console.log('error submit!!')
            return false
          }
        })
      },
      cancelEdit() {
        this.$confirm('是否要放弃当前编辑的组信息？', '提示', {
          type: 'warning',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
          this.callBack()
        })
      },
      timeOutBack() {
        const _this = this
        setTimeout(function() {
          _this.loading = false
          _this.callBack()
        }, 2000)
      },
      clear() {
        this.noticeGroupForm = {
          groupName: '',
          desc: '',
          receiveDept: [],
          type: 2
        }
        if (this.$refs.transfer) {
          this.$refs.transfer.clearQuery('left')
          this.$refs.transfer.clearQuery('right')
          this.$refs.transfer.$children['0']._data.checked = []
          this.$refs.transfer.$children['3']._data.checked = []
        }
      },
      callBack() {
        this.clear()
        this.$emit('closeDialog')
      },
      queryDept() {
        this.$query('deptsbyparentdeptcode', { deptCode: this.curDept.depCode }, true).then(response => {
          const tData = []
          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i]
            tData.push({ label: item.deptName, key: item.id })
          }
          this.transferDeptData = tData
        })
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.queryDept()
    }
  }
</script>

<style>
  .noticeGroupEdit .el-upload.el-upload--text, .noticeGroupEdit .el-upload-dragger{
    width: 100%;
  }
  .noticeGroupEdit .content .el-form-item__label:after {
    content: '*';
    color: #f56c6c;
    margin-left: 5px;
  }
  .noticeGroupEdit .noticeCard{
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .noticeGroupEdit p{
    margin: 20px 0 10px;
  }
  .noticeGroupEdit p:first-child{
    margin-top: 0;
  }
  .noticeGroupEdit .el-transfer-panel {
    width: 42%;
  }
  .noticeGroupEdit .noticeCard .ql-image{
    display: none;
  }
  .noticeGroupEdit .content .el-form-item__content{
    margin-bottom: 10px;
  }
  .noticeGroupEdit .content .el-form-item__content > span{
    position: absolute;
  }
  .noticeGroupEdit .content .el-form-item__error {
    margin-top: 10px;
  }
  .noticeGroupEdit .transfer{
    margin-bottom: 30px;
  }
  .noticeGroupEdit .transfer .el-form-item__error{
    margin-top: 10px;
  }
</style>
