<template>
  <section class="deptWrap">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card style="margin-top:10px;">
      <div slot="header">
        <span>案件重复合并&nbsp;&nbsp;</span>
        <el-tooltip class="item" effect="dark" :content="headerContent" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px" v-loading="formLoading" class="clearfix">
        <el-table :data="formData.tableData" style="width: 100%;" class="formTableClass">
          <el-table-column label="序号" type="index" width="52" align="center"></el-table-column>
          <el-table-column prop="ajbh" label="案件编号" width="290px" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.editFlag" :prop="'tableData.' + scope.$index + '.ajbh'" :rules='rules.sex' label-width="0">
                <el-select v-model="scope.row.ajbh" filterable clearable remote reserve-keyword
                        placeholder="请输入案件编号搜索" :remote-method="(query)=>queryCase(query,'ajbh')" :loading="caseLoading" @visible-change="caseVisible"
                        @change="caseChange($event,scope.$index,scope.row)"
                        value-key="id" class="db_create_input">
                  <el-option v-for="item in canChooseCase" :key="item.caseId" :label="item.ajbh+'-'+item.ajmc" :value="item.caseId"></el-option>
                </el-select>
              </el-form-item>
              <span v-else @click="clickAjbhSpan">{{scope.row.ajbh}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ajmc" label="案件名称" width="260px" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.editFlag" :prop="'tableData.' + scope.$index + '.ajmc'" :rules='rules.name' label-width="0">
                <el-select v-model="scope.row.ajmc" filterable clearable remote reserve-keyword
                        placeholder="请输入案件名称搜索" :remote-method="(query)=>queryCase(query,'ajmc')" :loading="caseLoading" @visible-change="caseVisible"
                        @change="caseChange($event,scope.$index,scope.row)"
                        value-key="id" class="db_create_input">
                        <!-- :label="item.ajmc+' ('+item.ajbh+')'" -->
                  <el-option v-for="item in canChooseCase" :key="item.caseId" :label="item.ajmc" :value="item.caseId"></el-option>
                </el-select>
              </el-form-item>
              <span v-else>{{scope.row.ajmc}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="noticeDeptName" label="认领单位" min-width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="保留/重复合并" width="150" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.type'" :rules='rules.type' label-width="0">
                <el-select v-model="scope.row.type" placeholder="请选择" @change="caseMergeTypeChange($event,scope.row.ajbh||'')" :disabled="operateType==='3' && !(scope.row.editFlag)">
                  <el-option label="保留案件" value="1">保留案件</el-option>
                  <el-option label="重复合并" value="2">重复合并</el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteData(scope.row,scope.$index)" icon="el-icon-circle-close-outline" title="移除" v-if="scope.row.editFlag" style="font-size:20px;"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <p @click="addData" style="text-align: center;font-size: 22px;border: 1px solid rgb(89, 125, 142);cursor:pointer;">
            <i class="el-icon-plus"></i>
          </p>
          <el-form-item label="接收单位" prop="noticeDeptName" v-if="operateType === '1'">
            <el-input v-model="formData.noticeDeptName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="原因" prop="remarkType">
            <el-select v-model="formData.remarkType" class="form_input" @change="remarkTypeChange" @focus="caseBlur">
              <el-option label="重复录入" value="1"></el-option>
              <el-option label="其他" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="remark">
            <el-input v-model="formData.remark" type="textarea" auto-complete="off" class="form_input" maxlength="500" @focus="caseBlur"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center">
          <el-form-item v-if="operateType==='1'">
            <el-button type="text" @click="close" class="cancelBtn" style="border:1px solid #00a0e9;">取消</el-button>
            <el-button @click="submitData('formData','1')" class="saveBtn" :loading="formLoading">下发</el-button>
          </el-form-item>
          <el-form-item v-if="operateType==='2'">
            <el-button type="text" @click="close" class="cancelBtn" style="border:1px solid #00a0e9;">取消</el-button>
            <el-button @click="submitData('formData','2')" class="saveBtn" v-loading="formLoading">合并</el-button>
          </el-form-item>
          <el-form-item v-if="operateType==='3'">
            <el-button @click="handleIsMerge('formData','3')" class="saveBtn" v-loading="formLoading" style="width:80px;text-align:center;padding: 7px 0 !important;">不合并</el-button>
            <el-button @click="handleIsMerge('formData','2')" class="saveBtn" v-loading="formLoading">合并</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </section>
</template>
<script>
export default {
  name: 'add',
  data() {
    return {
      formLoading: false,
      formData: {
        tableData: [], // 初始化type
        remarkType: '1' // 默认为重复录入
      },
      currentCase: {},
      canChooseCase: [], // 可选择的案件
      caseLoading: false, // 查案件 loading
      headerContent: '', // 标题的解释性文字
      carryParam: {}, // 跳转携带的参数
      operateType: '1', // 表单按钮 展示的判断 1下发 2合并 3是否合并
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        noticeDeptName: [{
          required: true, message: '请填写接收单位', trigger: 'change'
        }],
        remarkType: [{
          required: true, message: '请选择合并原因', trigger: 'change'
        }],
        remark: [{
          required: false, trigger: 'blur', validator: (rule, value, callback) => {
            // 文本域非必填；如果选择“其他”，文本域为必填。
            if (this.formData.reason === '2') { // 选择的是重复录入
              if (value) {
                callback()
              } else {
                callback(new Error('请输入原因'))
              }
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    init() {
      if (this.carryParam.type === 'merge') {
        // 查询当前案件的 认领单位，与当前部门做比较
        this.formLoading = true
        this.$query('mergecase/' + this.currentCase.caseId, {}).then((response) => {
          if (response.code === '000000' && response.data) {
            this.formLoading = false
            if (response.data.status === 1) { // 该案件处于待合并状态
              this.operateType = ''
              this.queryDetailById(response.data.mergeId, 'noEdit') // 查详情
            } else {
              if (this.currentCase) {
                this.currentCase.noticeDeptName = response.data.noticeDeptName // 当前案件的认领单位
                this.currentCase.noticeDeptCode = response.data.noticeDeptCode // 当前案件的认领单位
                this.currentCase.editFlag = false // 当前案件 不能编辑 标志
                this.$set(this.currentCase, 'type', '1') // 默认当前的案件是 保留
                this.formData.tableData.push(this.currentCase)
              }
              if (this.deptInfo.depCode === response.data.noticeDeptCode) { //  案件认领单位 和 当前用户所在单位同一单位  “重复案件合并” -- 取消 合并
                this.operateType = '2'
                this.headerContent = '认可重复合并后，被重复合并案件将不能用于统计或各类业务使用'
              } else { // 案件认领单位 和 当前用户所在单位非同一单位  “下发重复案件合并” -- 取消 下发
                this.operateType = '1'
                this.formData.noticeDeptName = response.data.noticeDeptName // 将认领单位 赋值到 页面上的接收单位
                this.headerContent = '只能合并相同认领单位的案件' // 注释的文字
              }
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      }
      if (this.carryParam.type === 'edit') {
        // 查详情
        this.queryDetailById(this.carryParam.id)
      }
      if (this.carryParam.type === 'isMerge') { // 合并 或 不合并
        this.operateType = '3'
        this.headerContent = '认可重复合并后，被重复合并案件将不能用于统计或各类业务使用'
        this.queryDetailById(this.carryParam.id, 'noEdit')
      }
    },
    queryDetailById(mergeId, isEdit) { // 通过id查询详情
      this.formLoading = true
      this.$query('caseMerge/detail/' + mergeId, {}).then((response) => {
        this.formLoading = false
        if (response.code === '000000') {
          var data = response.data
          data.remarkType = data.remarkType + ''
          this.formData = data
          this.formData.noticeDeptName = data.applyDeptName
          for (let index = 0; index < data.caseList.length; index++) {
            const element = data.caseList[index]
            element.type = element.type + ''
            if (isEdit === 'noEdit') {
              element.editFlag = false
            } else {
              element.editFlag = true
            }
          }
          this.formData.tableData = data.caseList // 案件
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    addData() { // 添加
      // 手动加入后，下拉默认为“重复合并”，同时只能有一条“保留案件”。
      if (this.formData.tableData.length > 0) {
        // 最后一行 案件名称和案件编号 认领单位 都存在
        if (this.formData.tableData[this.formData.tableData.length - 1].ajmc && this.formData.tableData[this.formData.tableData.length - 1].ajbh && this.formData.tableData[this.formData.tableData.length - 1].noticeDeptName) {
          this.formData.tableData.push({
            editFlag: true,
            type: '2'
          })
        } else {
          this.$message({
            type: 'error',
            message: '请不要添加多个空白行!'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '至少有一个保留案件!'
        })
      }
    },
    caseMergeTypeChange(val, ajbh) { // 保留/重复合并 change事件
      if (val && val === '1') {
        // 将其中一个置为“保留案件”时，其他的都变为“重复合并”。
        var data = this.formData.tableData
        for (let index = 0; index < data.length; index++) {
          var element = data[index]
          element.ajbh = element.ajbh || '' // 案件编号 不存在的时候 存空字符串
          if (ajbh !== element.ajbh) {
            this.$set(element, 'type', '2')
          }
        }
      }
    },
    remarkTypeChange(val) { // 原因 change
      this.$refs.formData.validateField('remark') // 校验原因
    },
    close() { // 关闭弹框
      this.$router.back(-1)
    },
    // 确认添加
    confirmAdd(row, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          row.edit = false
        }
      })
    },
    // 修改
    editData(row) {
      row.edit = true
    },
    // 删除
    deleteData(row, index) {
      if (row.editFlag === false) {
        this.$message({
          type: 'error',
          message: '当前案件不能删除!'
        })
        return false
      }
      this.formData.tableData.splice(index, 1)
    },
    caseBlur() { // 校验删除 多余的空白行
      var data = this.formData.tableData
      if (!(data[data.length - 1].ajmc) && !(data[data.length - 1].ajbh)) {
        this.formData.tableData.splice(data.length - 1, 1) // 删除最后一个空的行
      }
    },
    judgeTableData() { // 判断选中的案件是否 符合规则
      const data = this.formData.tableData
      if (data.length > 1) { // 至少有两个案件
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          if (!(element.caseId) || !(element.ajbh) || !(element.ajmc)) {
            this.$message({
              type: 'error',
              message: '请完善案件信息或者删除多余的行!'
            })
            return false
          }
        }
        // 判断至少存在一个保留案件
        const result = data.some(item => { // 这里是判断关键  存在 返回 true
          if (item.type === '1') return true
        })
        if (result) {
          return true
        } else {
          this.$message({
            type: 'error',
            message: '需要至少存在一个保留案件!'
          })
          return false
        }
      } else {
        this.$message({
          type: 'error',
          message: '至少两个案件才可以合并!'
        })
        return false
      }
    },
    submitData(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.judgeTableData()) {
            var param = {
              status: type, // 下发传1  合并传2
              remarkType: this.formData.remarkType,
              remark: this.formData.remark || '',
              creationDeptCode: this.deptInfo.depCode, // 创建单位
              creationDeptName: this.deptInfo.depName,
              userId: this.userInfo.id, // 用户信息
              userName: this.userInfo.userName,
              caseList: this.formData.tableData, // 案件列表
              deptName: this.deptInfo.depName, // 当前操作单位
              deptCode: this.deptInfo.depCode
            }
            this.formLoading = true
            if (this.carryParam.type === 'merge') { // 合并 或 下发
              param.applyDeptCode = this.currentCase.noticeDeptCode // 认领单位
              param.applyDeptName = this.currentCase.noticeDeptName
              this.$save('caseMerge/save', param).then(res => {
                this.formLoading = false
                if (res.code === '000000') {
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$router.push({ path: '/caseManage/caseMergeList' })
                  this
                } else {
                  this.$message({ message: '提交失败', type: 'error' })
                }
              }).catch(() => {
                this.formLoading = false
              })
            } else if (this.carryParam.type === 'edit') { // 编辑  只有下发存在编辑
              param.applyDeptCode = this.formData.applyDeptCode // 认领单位
              param.applyDeptName = this.formData.applyDeptName
              this.$update('caseMerge/update/' + this.carryParam.id, param).then(res => {
                this.formLoading = false
                if (res.code === '000000') {
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$router.push({ path: '/caseManage/caseMergeList' })
                } else {
                  this.$message({ message: '提交失败', type: 'error' })
                }
              }).catch(() => {
                this.formLoading = false
              })
            }
          }
        }
      })
    },
    handleIsMerge(formName, mergeFlag) { // 认领单位 是否合并
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.judgeTableData()) {
            // mergeFlag true合并，false不合并
            var param = JSON.parse(JSON.stringify(this.formData))
            param.userId = this.userInfo.id
            param.userName = this.userInfo.userName
            param.status = mergeFlag // 2合并 3不合并
            param.deptName = this.deptInfo.depName // 当前操作单位
            param.deptCode = this.deptInfo.depCode
            this.formLoading = true
            this.$update('caseMerge/merge/' + this.carryParam.id, param).then(res => {
              this.formLoading = false
              if (res.code === '000000') {
                this.$message({ message: '提交成功', type: 'success' })
                this.$router.push({ path: '/caseManage/caseMergeList' })
              } else {
                this.$message({ message: '提交失败', type: 'error' })
              }
            }).catch(() => {
              this.formLoading = false
            })
          }
        }
      })
    },
    clickAjbhSpan(row) {
      row.editFlag = true
    },
    caseVisible(flag) {
      if (!flag) {
        this.canChooseCase = []
      }
    },
    queryCase(val, type) { // 案件查询
      // type 表示 案件名称或者案件编号
      // console.log(val + '---' + index)
      // if (!val) {
      //   this.canChooseCase[index] = []
      //   return false
      // }
      // this.caseLoading = true
      var param = {}
      if (type === 'ajmc') {
        param.ajmc = val
      } else if (type === 'ajbh') {
        param.ajbh = val
      }
      // if (this.deptInfo.depType === '4') { // 派出所
      //   param.departCode = this.deptInfo.parentDepCode // 父级部门code
      // } else {
      //   param.departCode = this.deptInfo.depCode // 当前部门code
      // }
      if (this.carryParam.type === 'merge') {
        param.departCode = this.currentCase.noticeDeptCode
      } else if (this.carryParam.type === 'edit') {
        param.departCode = this.formData.applyDeptCode
      }
      this.$query('mergecase', param).then((response) => {
        this.caseLoading = false
        this.formLoading = false
        // if (response.data.length > 0) {
        this.canChooseCase = response.data
        // } else {
        //   this.formData.tableData[this.formData.tableData.length - 1] = {
        //     editFlag: true,
        //     type: '2'
        //   }
        // }
      }).catch(() => {
        this.caseLoading = false
        this.formLoading = false
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    judgeCaseRepeat(id) { // 判断是否有重复的案件
      if (!id) return // 判断如果传入对象为空 下面代码不执行
      const arrayObject = this.formData.tableData
      const result = arrayObject.some(item => { // 这里是判断关键  存在 返回 true
        if (item.caseId === id) return true
      })
      if (result) {
        this.$message({
          type: 'error',
          message: '请不要选择重复的案件!'
        })
        return false
      } else {
        return true
      }
    },
    caseChange(val, index, row) { // 案件change
      // 判断是否有重复的
      if (!(this.judgeCaseRepeat(val))) {
        this.formData.tableData[index] = {
          editFlag: true,
          type: '2'
        } // 如果重复  则清空当前行的数据
        return false
      }
      if (val) {
        for (let i = 0; i < this.canChooseCase.length; i++) {
          if (val === this.canChooseCase[i]['caseId']) {
            // var data = JSON.parse(JSON.stringify(this.canChooseCase[i]))
            // data.type = '2'
            // data.editFlag = true
            this.formData.tableData[index] = Object.assign(this.formData.tableData[index], this.canChooseCase[i])
            return true
          }
        }
      } else {
        this.formData.tableData[index] = {
          editFlag: true,
          type: '2'
        } // 如果重复  则清空当前行的数据
        return false
      }
    },
    cancel() { // 取消
      this.$confirm('是否要放弃编辑机构信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到详情画面
        this.$router.push({ path: '/basicService/deptInfo/detail', query: { deptId: this.carryParam.deptId }})
      }).catch(() => {
        // 留在编辑页面
      })
      // this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (sessionStorage.getItem(this.$route.path)) {
      this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (this.carryParam.type === 'merge') {
        this.currentCase = JSON.parse(sessionStorage.getItem(this.$route.path))
      }
      this.init()
    }
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.deptWrap {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 20px 40px;
  }
  .showPart {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .showAll {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    overflow: auto;
  }
  // .mergeForm {
  // width: 96%;
  // margin: 10px auto 0;
  .el-form .form_input,
  .el-form .el-input.el-input--small,
  .el-form .el-select.el-select--small {
    width: 100%;
  }
  .formTableClass .el-form-item--small.el-form-item {
    // 表格里的输入框
    margin-bottom: 0px;
  }
  // }
}
</style>
