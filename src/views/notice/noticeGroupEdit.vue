<template>
  <div class="noticeGroupEdit">
    <el-row type="flex" justify="center" style="margin-top:15px;">
      <el-col :span="18">
        <el-form :model="noticeGroupForm" ref="noticeGroupForm" :rules="rules" v-loading="loading" label-width="100px" :disabled="isDisabled">
          <el-form-item label="组名" prop="groupName">
            <el-input v-model="noticeGroupForm.groupName" auto-complete="off" :clearable="!isDisabled" maxlength="20" v-loading="titleLoading"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="desc">
            <el-input v-model="noticeGroupForm.desc" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个字符！"></el-input>
          </el-form-item>
          <el-form-item label="组类型" prop="type" v-if="typeVisible">
            <el-radio-group v-model="noticeGroupForm.type" @change="radioChange" :disabled="typeDisabled && noticeGroupForm.type === '1'">
              <el-radio label="2">通知组</el-radio>
              <el-radio label="1">消息组</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="组成员" prop="receiveDept" class="transfer">
            <el-input v-model="searchKey" maxlength="50" size="small" placeholder="请输入关键字" @input="searchKeyChange"></el-input>
            <el-transfer ref="transfer" v-loading="transferLoading" v-model="noticeGroupForm.receiveDept" :titles="title" filterable :filter-method="filterMethod" @change="transferChange" :data="transferData"></el-transfer>
          </el-form-item>
          <el-form-item class="btn" v-if="!isDisabled">
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
    props: [
      'opType',
      'groupId'
    ],
    data() {
      return {
        searchKey: '',
        title: ['单位名称', '单位名称'],
        transferLoading: false,
        titleLoading: false,
        isDisabled: this.opType ? (this.opType === 2) : false,
        typeVisible: false,
        typeDisabled: this.opType !== 0,
        showSave: true,
        transferData: [],
        transferDeptData: [],
        lXRData: [],
        transferLXRData: [],
        loading: false,
        noticeGroupForm: {
          groupName: '',
          desc: '',
          receiveDept: [],
          type: '2' // 1 消息组，2 部门组
        },
        deptList: [],
        errorText: '', // 站内信息校验错误提示
        rules: {
          groupName: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regCnName = this.$regCnName
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入组名'))
              } else if (value.length > 0 && (!regCnName.test(value))) {
                callback(new Error('组名只能输入汉字'))
              } else if (value.length > 20) {
                callback(new Error('组名长度不能超过 20个字符'))
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
          type: [{ required: true, trigger: 'blur', message: '请选择常用组类型' }],
          desc: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              // const regEnCode = this.$regCode
              // const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback()
              } else if (value.length > 500) {
                callback(new Error('组说明不能超过 500个字符'))
              } else {
                return callback()
              }
              // else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
              //   callback(new Error('组说明不能输入特殊字符'))
              // }
            }
          }]
        },
        curDept: {},
        curUser: {},
        titleCheckFlag: false,
        id: ''
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        this.titleLoading = true
        // 同步处理
        const response = await this.$updateAsyns('group/checkGroupNameRepeat', { groupName: this.noticeGroupForm.groupName, creatorId: this.curUser.id })
        const data = response.data
        if (this.id !== '') {
          // if (data.data === null || data.data.length === 0 || (this.id === data.data[0].id && data.data.length === 1)) {
          //   this.titleCheckFlag = true
          //   callback = callback()
          // } else {
          //   this.titleCheckFlag = false
          //   callback = callback(Error('组名不能重复'))
          // }
          if (data.type !== 1) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('组名不能重复'))
          }
        } else {
          // if (data.data === undefined || data.data === null || data.data.length === 0) {
          //   this.titleCheckFlag = true
          //   callback = callback()
          // } else {
          //   this.titleCheckFlag = false
          //   callback = callback(Error('组名不能重复'))
          // }
          if (data.type !== 1) {
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
            if (this.noticeGroupForm.type === '1' && this.noticeGroupForm.receiveDept.length > 50) {
              this.$message({
                message: '添加常用消息组时，人员最多不能超过50人',
                type: 'warning'
              })
              this.loading = false
              return false
            }
            if (this.id) {
              this.noticeGroupForm.modifierId = this.curUser.id
              this.noticeGroupForm.modifierName = this.curUser.realName
              this.noticeGroupForm.deptId = this.curDept.id
              this.noticeGroupForm.deptName = this.curDept.depName
              this.noticeGroupForm.deptCode = this.curDept.depCode
              this.noticeGroupForm.itemCount = this.noticeGroupForm.receiveDept.length
              if (this.noticeGroupForm.type === '2') {
                this.noticeGroupForm.deptIds = this.noticeGroupForm.receiveDept
              } else if (this.noticeGroupForm.type === '1') {
                const data = []
                for (let i = 0; i < this.lXRData.length; i++) {
                  const item = this.lXRData[i]
                  for (let j = 0; j < this.noticeGroupForm.receiveDept.length; j++) {
                    const userId = this.noticeGroupForm.receiveDept[j]
                    if (item.id === userId) {
                      data.push({ id: item.id, name: item.realName })
                    }
                  }
                }
                this.noticeGroupForm.personList = data
              }
              this.$update('group/' + this.id, this.noticeGroupForm).then((response) => {
                this.timeOutBack()
                this.$message({
                  message: '常用组编辑成功！',
                  type: 'success'
                })
              }).catch(() => {
                this.loading = false
              })
            } else {
              this.noticeGroupForm.creatorId = this.curUser.id
              this.noticeGroupForm.creatorName = this.curUser.realName
              this.noticeGroupForm.deptId = this.curDept.id
              this.noticeGroupForm.deptName = this.curDept.depName
              this.noticeGroupForm.deptCode = this.curDept.depCode
              this.noticeGroupForm.itemCount = this.noticeGroupForm.receiveDept.length
              if (this.noticeGroupForm.type === '2') {
                this.noticeGroupForm.deptIds = this.noticeGroupForm.receiveDept
              } else if (this.noticeGroupForm.type === '1') {
                const data = []
                for (let i = 0; i < this.lXRData.length; i++) {
                  const item = this.lXRData[i]
                  for (let j = 0; j < this.noticeGroupForm.receiveDept.length; j++) {
                    const userId = this.noticeGroupForm.receiveDept[j]
                    if (item.id === userId) {
                      data.push({ id: item.id, name: item.realName })
                    }
                  }
                }
                this.noticeGroupForm.personList = data
              }
              this.$save('group', this.noticeGroupForm).then((response) => {
                this.timeOutBack()
                this.$message({
                  message: '常用组保存成功！',
                  type: 'success'
                })
              }).catch(() => {
                this.loading = false
              })
            }
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
        this.transferData = []
        this.id = ''
        this.noticeGroupForm = {
          groupName: '',
          desc: '',
          receiveDept: [],
          type: '2'
        }
        if (this.$refs.noticeGroupForm) {
          this.$refs.noticeGroupForm.resetFields()
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
          this.transferData = JSON.parse(JSON.stringify(tData))
          this.transferLoading = false
        })
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      detail(groupId) {
        if (groupId) {
          this.id = groupId
        }
        this.loading = true
        this.transferLoading = true
        this.$query('group/groupDetail', { groupId: this.id }).then((response) => {
          if (response.code === '000000') {
            this.noticeGroupForm = {
              groupName: response.data.groupName,
              desc: response.data.desc,
              receiveDept: [],
              type: String(response.data.type)
            }
            if (String(response.data.type) === '1') {
              // this.checkLXR()
              this.checkLXR(this.curDept.depCode)
            } else if (String(response.data.type) === '2') {
              this.queryDept()
            }
            if (response.data.items) {
              const arr = []
              for (let i = 0; i < response.data.items.length; i++) {
                const item = response.data.items[i]
                arr.push(item.itemId)

                this.$query('departuser', { type: 0, name: item.itemName }, true).then(response => {
                  for (let k = 0; k < response.data.length; k++) {
                    const item = response.data[k]
                    let flag = true
                    for (let j = 0; j < this.lXRData.length; j++) {
                      const itemJ = this.lXRData[j]
                      if (item.userName === itemJ.userName) {
                        flag = false
                        break
                      }
                    }
                    if (flag) {
                      this.lXRData.unshift(item)
                      this.transferLXRData.unshift({ label: '（' + item.userName + '）' + item.realName, key: item.id })
                      this.transferData = JSON.parse(JSON.stringify(this.transferLXRData))
                    }
                  }
                })
              }
              this.noticeGroupForm.receiveDept = arr
            }
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      radioChange(val) {
        this.transferLoading = true
        this.noticeGroupForm.receiveDept = []
        if (val === '2') {
          this.queryDept()
          this.title = ['单位名称', '单位名称']
        } else if (val === '1') {
          this.checkLXR(this.curDept.depCode)
          this.title = ['人员名称', '人员名称']
        }
      },
      searchKeyChange(value) {
        if (value === undefined || value === null || value === '') {
          this.$refs.transfer.$children['0']._data.query = ''
          return
        }
        this.$refs.transfer.$children['0']._data.query = value
        if (this.noticeGroupForm.type === '1') {
          this.$query('departuser', { type: 0, name: value }, true).then(response => {
            for (let i = 0; i < response.data.length; i++) {
              const item = response.data[i]
              let flag = true
              for (let j = 0; j < this.lXRData.length; j++) {
                const itemJ = this.lXRData[j]
                if (item.userName === itemJ.userName) {
                  flag = false
                  break
                }
              }
              if (flag) {
                this.lXRData.unshift(item)
                this.transferLXRData.unshift({ label: '（' + item.userName + '）' + item.realName, key: item.id })
                this.transferData = JSON.parse(JSON.stringify(this.transferLXRData))
              }
            }
          })
        }
      },
      transferChange(value, direction, movedKeys) {
        this.$refs.noticeGroupForm.validateField('receiveDept')
      },
      checkLXR(departCode) {
        this.$query('departuser', { type: 0, departCode: departCode }, true).then(response => {
          this.lXRData = response.data
          const tData = []
          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i]
            tData.push({ label: '（' + item.userName + '）' + item.realName, key: item.id })
          }
          this.transferLXRData = tData
          this.transferData = JSON.parse(JSON.stringify(tData))
          this.transferLoading = false
        })
      }
    },
    watch: {
      'opType': function(val) {
        this.isDisabled = val ? (val === 2) : false
        this.typeDisabled = val !== 0
        if (val !== undefined && val !== null && val !== '') {
          this.typeVisible = true
        }
      },
      'groupId': function(val) {
        this.id = val
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.isDisabled = this.opType ? (this.opType === 2) : false
      this.id = this.opType ? this.groupId : ''
      if (this.opType) {
        this.detail()
      } else {
        this.queryDept()
      }
      if (this.opType !== undefined && this.opType !== null && this.opType !== '') {
        this.typeVisible = true
      }
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
    margin-bottom: 18px;
  }
  .noticeGroupEdit .transfer .el-form-item__error{
    margin-top: 10px;
  }
  .noticeGroupEdit .transfer .el-transfer-panel__filter.el-input.el-input--small.el-input--prefix {
    display: none;
  }
  .noticeGroupEdit .transfer .el-transfer-panel__list.is-filterable{
    height: 100%;
    padding-top: 6px;
  }
  .noticeGroupEdit .transfer.is-error .el-transfer-panel {
    border-color: #f56c6c;
  }
  .noticeGroupEdit .transfer.is-success .el-transfer-panel {
    border-color: #67c23a;
  }
  .noticeGroupEdit .transfer.is-success .el-input__inner, .noticeGroupEdit .transfer.is-error .el-input__inner{
    border: 1px solid #00a0e9;
  }
</style>
