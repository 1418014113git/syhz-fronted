<template>
  <section class="clueFeedBackDetail">
   <!--线索反馈详情-->
      <!--<div class="tipText">-->
        <!--<p style="color: #f56c6c; float:left;">本页面的所有操作均自动保存，不需要手动保存！</p>-->
        <!--<p style="color: #67C23A; float:right;" v-if="isShowTime">实时保存，保存时间 <span>{{updateTime}}</span></p>-->
      <!--</div>-->
      <el-form :model="clueFeedBackForm" size="small" ref="clueFeedBackForm" :rules="rules" v-loading="formLoading" label-width="120px" class="clueFeedBackForm">
        <el-form-item label="核查情况" prop="qbxsResult">
          <el-radio-group v-model="clueFeedBackForm.qbxsResult" @change="changeQbxsResult">
            <el-radio :label="2">查实</el-radio>
            <el-radio :label="3">查否</el-radio>
          </el-radio-group>
          <el-popover
            class="qkts"
            placement="right"
            width="300"
            trigger="hover">
            <div>
              <p>线索<span class="redC">查实</span>情况包括：电话、地址准确无误可联系到核查对象、
                被核查对象主动配合、被核查对象否认否买**等；
              </p>
              <p>线索<span class="redC">查否</span>情况包括：电话、地址存在错误<span class="redC">无法联系</span>
                到核查对象。
              </p>
            </div>
            <el-button  type="primary" size="mini" circle slot="reference"><svg-icon icon-class="wenhao1"></svg-icon></el-button>
            <svg-icon icon-class="wenhao1"></svg-icon>
          </el-popover>
        </el-form-item>
        <el-form-item label="处理方式" prop="handleResult" v-if="handleResultVisible">
          <el-radio-group v-model="clueFeedBackForm.handleResult" @change="changeQbxsType">
            <el-radio :label="1">立案</el-radio>
            <el-radio :label="2">移送行政部门处理</el-radio>
            <el-radio :label="3">其他处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="侦办刑事案件" v-if="zbCaseVisible" prop="caseNo" class="case">
          <el-select v-model="clueFeedBackForm.caseNo" filterable clearable remote reserve-keyword placeholder="输入案件名称搜索" :remote-method="queryZbCaseSelect" :loading="zbCaseLoading" @visible-change="caseVisible" value-key="id" style="width:60%">
            <el-option v-for="item in zbCaseSelectData" :key="item.id" :label="item.ajmc+' ('+item.ajbh+')'" :value="item.ajbh"></el-option>
          </el-select>
          <el-button type="primary" size="small"  @click="chooseCase()" style="position: relative; top: -1px;">选择</el-button>
        </el-form-item>
        <el-form-item v-if="zbCaseVisible">
          <el-table :data="zbCaseListData" v-loading="zbCaseListLoading" style="width: 100%;" show-summary :summary-method="getSummaries" sum-text="全部">
            <el-table-column type="index" width="60" label="序号"></el-table-column>
            <el-table-column prop="ajmc"  label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh"  label='案件编号'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.id)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajztName"  label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="larq"  label='立案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.larq !== undefined && scope.row.larq !== null && scope.row.larq !== '' ? scope.row.larq : '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="parq"  label='破案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.parq !== undefined && scope.row.parq !== null && scope.row.parq !== '' ? scope.row.parq : '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="zhrys"  label='抓获（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yjss" label="移诉（人）"  min-width="100"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="zbCaseListData.length > 0" prop="" label="操作" width="55" fixed="right">
              <template slot-scope="scope">
                <!--<el-button size="mini" title="提交"  type="primary" icon="el-icon-check" circle  @click="handleSubmit(scope.row)"></el-button>-->
                <el-button size="mini" title="移除案件"  type="primary" icon="el-icon-delete" circle  @click="handleDel(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="反馈内容" prop="backResult">
          <vue-editor ref="child" v-model="clueFeedBackForm.backResult" useCustomImageHandler @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload class="upload-demo" drag multiple :action="uploadAction" :limit="10"
                     :auto-upload="true"
                     :file-list="uploadImgs"
                     :on-success="imgSuccess"
                     :on-remove="imgRemove"
                     :on-preview="imgPreview"
                     :before-remove="imgBfRemove"
                     :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText_Notice_size}}<br>{{UploadAttachment.tipText_Notice_style}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelEdit" class="cancelBtn" :disabled="formLoading">取 消</el-button>
          <el-button type="primary" class="saveBtn" @click="onSubmit" :loading="saveBtnLoading">反 馈</el-button>
        </el-form-item>
      </el-form>
  </section>
</template>
<script>
  import VueEditor from '@/components/Editor/VueEditor'
  import { uploadImg } from '@/utils/editorUpload'
  export default {
    name: 'clueFeedBackDetail',
    components: {
      VueEditor
    },
    props: ['row'],
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        clueFeedBackForm: {
          qbxsResult: '', // 核查情况
          handleResult: '',
          backResult: '',
          backFiles: [],
          caseNo: '',
          zbxss: []
        },
        formLoading: false,
        saveBtnLoading: false,
        uploadImgs: [],
        curDeptName: '', // 当前部门名称
        curDepartId: '', // 当前部门id
        curDeptCode: '', // 当前部门code
        curRow: {}, // 存储线索反馈列表传递过来的当前行的数据
        handleResultVisible: false,
        zbCaseVisible: false,
        zbCaseLoading: false,
        zbCaseSelectData: [], // 侦办案件下拉框数据
        zbCaseListData: [], // 侦办刑事案件列表
        zbCaseListLoading: false, // 侦办刑事案件列表加载loading
        isShowTime: false, // 是否显示更新时间
        curUser: JSON.parse(sessionStorage.getItem('userInfo')), // 当前登录用户
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前登录的部门
        updateTime: '', // 存储更新时间
        detailInfo: {}, // 存储详情信息
        rules: {
          qbxsResult: [{ required: true, message: '请选择核查情况', trigger: 'change' }],
          handleResult: [{ required: true, message: '请选择处理方式', trigger: 'change' }],
          backResult: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('请输入反馈内容'))
              } else if (value.length > 65000) {
                return callback(new Error('反馈内容长度不能超过 65000个字符'))
              }
              return callback()
            }
          }],
          caseNo: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (this.clueFeedBackForm.zbxss === undefined || this.clueFeedBackForm.zbxss === null || this.clueFeedBackForm.zbxss.length === 0) {
                return callback(new Error('请选择侦办刑事案件'))
              }
              return callback()
            }
          }]
        }
      }
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (index === 1 || index === 2 || index === 3) {
            sums[index] = '-'
            return
          }
          if (index === 4 || index === 5) {
            const values = data.map(item => Date.parse(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + 1
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = 0
            }
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = this.$thousSplit(sums[index] + '')
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      handleImg() {
        if (this.uploadImgs.length > 0) {
          const arr = []
          for (let i = 0; i < this.uploadImgs.length; i++) {
            const img = this.uploadImgs[i]
            if (img.status === 'success') {
              arr.push({
                name: img.name, path: img.path ? img.path : img.response.data
              })
            }
          }
          this.clueFeedBackForm.backFiles = arr
        }
      },
      detail() { // 查详情
        this.listLoading = true
        this.clueFeedBackForm.qbxsResult = this.curRow.qbxsResult !== undefined && this.curRow.qbxsResult !== null && this.curRow.qbxsResult !== '' ? this.curRow.qbxsResult : 2
        const para = {
          assistId: this.curRow.assistId,
          type: 'detail', // 操作类型
          fbId: this.curRow.fbId, // 反馈Id
          assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
        }
        this.$query('caseassistclue/feedBack/detail', para).then((response) => {
          this.listLoading = false
          this.clueFeedBackForm.backResult = response.data.backResult
          this.clueFeedBackForm.handleResult = response.data.handleResult
          if (response.data.zbxss !== undefined && response.data.zbxss !== null && response.data.zbxss !== '') {
            this.clueFeedBackForm.zbxss = response.data.zbxss.split(',')
          }
          this.zbCaseListData = response.data.zbxssList
          this.changeQbxsResult(this.clueFeedBackForm.qbxsResult)
          this.changeQbxsType(this.clueFeedBackForm.handleResult)
          if (this.clueFeedBackForm.handleResult === 1) {
            // 处理案件列表
          }
          if (response.data.backFiles !== undefined && response.data.backFiles !== null && response.data.backFiles !== '') {
            this.uploadImgs = JSON.parse(response.data.backFiles)
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      queryZbCaseSelect(query) { // 移送案件/侦办案件 下拉列表
        if (query) {
          this.zbCaseLoading = true
          const para = {
            ajmc: query,
            type: 2, // 1移送案件，2侦办案件
            fbId: this.curRow.fbId, // 反馈Id
            assistId: this.curRow.assistId, // 集群Id
            deptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
            assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
          }
          this.$query('caseassistclue/ajSearch', para).then((response) => {
            const arr = response.data
            for (let i = 0; i < this.zbCaseListData.length; i++) {
              const item = this.zbCaseListData[i]
              for (let j = 0; j < arr.length; j++) {
                const item_arr = arr[j]
                if (item.ajbh === item_arr.ajbh) {
                  arr.splice(arr.indexOf(item_arr), 1)
                }
              }
            }
            this.zbCaseSelectData = arr
            this.zbCaseLoading = false
          }).catch(() => {
            this.zbCaseSelectData = [] // 侦办案件下拉框数据
            this.zbCaseLoading = false
          })
        } else {
          this.zbCaseSelectData = []
        }
      },
      queryzbxsaj() { // 侦办刑事案件列表数据查询
        this.zbCaseListLoading = true
        const para = {
          assistId: this.curRow.assistId, // 集群Id
          type: 'zb', // 操作类型
          fbId: this.curRow.fbId, // 反馈Id
          assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
        }
        this.$query('caseassistclue/feedBack/detail', para).then((response) => {
          this.zbCaseListLoading = false
          this.zbCaseListData = response.data
        }).catch(() => {
          this.zbCaseListLoading = false
          this.zbCaseListData = []
        })
      },
      getfqDepts() { // 如果登上来的是派出所 发起单位显示他的父级单位
        this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            this.curDeptName = response.data.departName // 当前部门名称
            this.curDepartId = response.data.id // 当前部门id
            this.curDeptCode = response.data.departCode // 当前部门code
          }
        }).catch(() => {
        })
      },
      zbajChange(val) { // 侦办案件change事件

      },
      toAjDetail(id) { // 跳转案件档案
        this.$emit('closeDialog')
        this.$router.push({
          path: '/caseFile/index', query: { id: id }
        })
      },
      chooseCase() {
        if (this.clueFeedBackForm.caseNo === '') {
          this.$message.error('请选择案件')
          return false
        }
        for (let i = 0; i < this.zbCaseSelectData.length; i++) {
          const item = this.zbCaseSelectData[i]
          if (item.ajbh === this.clueFeedBackForm.caseNo) {
            this.zbCaseListData.push(item)
            this.clueFeedBackForm.zbxss.push(item.ajbh)
            break
          }
        }
        this.clueFeedBackForm.caseNo = ''
        this.zbCaseSelectData = []
      },
      number(props, row) { // 只能是数字
        var num = row[props].replace(/[^\.\d]/g, '').replace('.', '')
        setTimeout(() => {
          if (num) {
            this.$set(row, props, num)
          } else {
            this.$set(row, props, 0)
          }
        }, 50)
      },
      handleSubmit(row) { // 提交侦办案件当前行数据
        if (row.dhwd === '' || row.dhwd === undefined || row.dhwd === null) {
          this.$message.error('捣毁窝点数量不能为空。')
        } else if (row.pzdb === '' || row.pzdb === undefined || row.pzdb === null) {
          this.$message.error('批捕人数不能为空。')
        } else if (row.sajz === '' || row.sajz === undefined || row.sajz === null) {
          this.$message.error('涉案金额不能为空。')
        } else if (row.zhrys === '' || row.zhrys === undefined || row.zhrys === null) {
          this.$message.error('抓获人数不能为空。')
        } else if (row.yjss === '' || row.yjss === undefined || row.yjss === null) {
          this.$message.error('移诉人数不能为空。')
        } else {
          this.$confirm('确定要提交数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              type: 'saveZbxss',
              assistId: this.curRow.assistId, // 集群Id
              fbId: this.curRow.fbId, // 反馈Id
              zbxss: row.ajbh + ',' + row.dhwd + ',' + row.sajz + ',' + row.pzdb + ',' + row.zhrys + ',' + row.yjss, // 案件编号，捣毁窝点、涉案金额、批准逮捕、抓获、移诉
              userId: this.curUser.id, // 当前用户Id
              userName: this.curUser.realName, // 当前用户真实姓名
              curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
              curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
              assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
            }
            this.$update('caseassistclue/feedBack', param).then((response) => {
              this.listLoading = false
              this.isShowTime = true
              this.updateTime = response.data
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.queryzbxsaj() // 侦办刑事案件列表数据查询
            }).catch(() => {
              this.listLoading = false
            })
          }).catch(() => {
            this.listLoading = false
          })
        }
      },
      handleDel(row) { // 移除案件
        this.$confirm('确定要移除该案件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.zbCaseListData.splice(this.zbCaseListData.indexOf(row), 1)
          this.clueFeedBackForm.zbxss.splice(this.clueFeedBackForm.zbxss.indexOf(row.ajbh), 1)
          this.$message({
            message: '移除成功',
            type: 'success'
          })
          // const param = {
          //   assistId: this.curRow.assistId, // 集群Id
          //   fbId: this.curRow.fbId, // 反馈Id
          //   userId: this.curUser.id, // 当前用户Id
          //   userName: this.curUser.realName, // 当前用户真实姓名
          //   curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
          //   curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
          //   assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
          // }
          // param.type = 'deleteZbxss'
          // param.zbxss = row.ajbh
          // this.zbCaseListLoading = true // 侦办刑事案件列表加载loading
          // this.$update('caseassistclue/feedBack', param).then((response) => {
          //   this.zbCaseListLoading = false
          //   this.$message({
          //     message: '移除成功',
          //     type: 'success'
          //   })
          //   this.queryzbxsaj() // 查询侦办刑事案件
          // }).catch(() => {
          //   this.zbCaseListLoading = false
          // })
        }).catch(() => {
          this.zbCaseListLoading = false
        })
      },
      changeQbxsResult(val) { // 查实、查否操作
        this.handleResultVisible = val === 2
        if (val === 3) {
          this.clueFeedBackForm.handleResult = ''
          this.changeQbxsType(this.clueFeedBackForm.handleResult)
        }
      },
      changeQbxsType(val) {
        this.zbCaseVisible = val === 1
      },
      imgSuccess(res, file, fileList) {
        this.uploadImgs = fileList
      },
      imgRemove(file, fileList) {
        this.uploadImgs = fileList
      },
      imgBfRemove(file, fileList) {
        if (file && file.status === 'success') {
          return this.$confirm('确定移除' + file.name + '？')
        }
      },
      imgPreview(file) {
        console.log(file)
      },
      beforeUpload(file) {
        const msg = this.UploadAttachment.fileValid(file)
        if (msg.length > 0) {
          this.$message({
            message: msg, type: 'warning'
          })
          return false
        }
      },
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((response) => {
          if (response.code === '000000') {
            Editor.insertEmbed(cursorLocation, 'image', response.data)
            resetUploader()
          }
        }).catch((e) => {})
      },
      contentChange(val) {
        this.$refs.clueFeedBackForm.validateField('backResult')
      },
      onSubmit() {
        this.formLoading = true
        this.saveBtnLoading = true
        this.$refs.clueFeedBackForm.validate(valid => {
          if (valid) {
            this.handleImg()
            if (this.clueFeedBackForm.qbxsResult === 3) {
              this.clueFeedBackForm.handleResult = ''
              this.clueFeedBackForm.zbxss = []
            }
            if (this.clueFeedBackForm.handleResult !== 1) {
              this.clueFeedBackForm.zbxss = []
            }
            const para = {
              fbId: this.curRow.fbId,
              zbxss: this.clueFeedBackForm.zbxss.length > 0 ? this.clueFeedBackForm.zbxss.join(',') : '',
              qbxsResult: this.clueFeedBackForm.qbxsResult,
              handleResult: this.clueFeedBackForm.handleResult,
              backResult: this.clueFeedBackForm.backResult,
              backFiles: this.clueFeedBackForm.backFiles.length > 0 ? JSON.stringify(this.clueFeedBackForm.backFiles) : '',
              assistType: '1',
              assistId: this.curRow.assistId,
              userId: this.curUser.id, // 当前用户Id
              userName: this.curUser.realName, // 当前用户真实姓名
              curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
              curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode // 当前部门code
            }
            this.$update('caseassistclue/feedBack', para).then((response) => {
              this.$message.success('反馈成功')
              const _this = this
              setTimeout(function() {
                _this.formLoading = false
                _this.saveBtnLoading = false
                _this.$emit('closeDialog', true)
              }, 2000)
            }).catch(() => {
              this.formLoading = false
              this.saveBtnLoading = false
            })
          } else {
            this.formLoading = false
            this.saveBtnLoading = false
          }
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit('closeDialog', true)
        })
      },
      caseVisible(flag) {
        if (!flag) {
          this.caseList = []
        }
      },
      setRow(curRow) {
        this.curRow = curRow
        this.initData()
        if (this.curDept.depType === '4') { // 派出所
          this.getfqDepts()
        }
        if (this.curRow.qbxsResult !== 1) {
          this.detail()
        }
      },
      initData() {
        this.clueFeedBackForm = {
          qbxsResult: '', // 核查情况
          handleResult: '',
          backResult: '',
          backFiles: [],
          caseNo: '',
          zbxss: []
        }
        this.uploadImgs = []
        this.zbCaseSelectData = [] // 侦办案件下拉框数据
        this.zbCaseListData = [] // 侦办刑事案件列表
        this.updateTime = '' // 存储更新时间
        this.isShowTime = false // 隐藏更新时间
        this.$refs.clueFeedBackForm.resetFields()
        this.handleResultVisible = false
        this.zbCaseVisible = false
      }
    },
    mounted() {
      this.setRow(this.row)
    }
  }
</script>

<style>
  .clueFeedBackDetail .el-upload.el-upload--text, .clueFeedBackDetail .el-upload-dragger{
    width: 100%;
  }
  .clueFeedBackDetail .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .clueFeedBackDetail .el-table--border,
  .clueFeedBackDetail .el-table--group {
    border: 1px solid #2f627a;
  }
  .clueFeedBackDetail .el-table--border td {
    border-right-color: #2f627a;
  }
  .clueFeedBackDetail .el-table--border::after,
  .clueFeedBackDetail .el-table--group::after {
    width: 0;
  }
  .clueFeedBackDetail .tipText{
    padding: 5px 0;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .clueFeedBackDetail .textCen .el-input__inner{
    text-align: center;
  }
  .clueFeedBackDetail .redC{
    color: #f72929;
  }
  .clueFeedBackDetail .qkts {
    margin-left: 60px;
  }
  .clueFeedBackDetail .qkts.el-button--mini.is-circle, .el-button--small.is-circle {
    padding: 0;
  }
  .clueFeedBackDetail .qkts.svg-icon[data-v-5d4549d3] {
    width: 1.2em;
    height: 1.2em;
  }
  .clueFeedBackDetail .qkts.inputW{
    width: 400px;
  }
  .clueFeedBackDetail .el-table__fixed-footer-wrapper tbody td {
    background: rgba(0, 89, 130, 1);
    border: none;
  }
  .clueFeedBackDetail .case.el-form-item.is-success .el-input__inner, .clueFeedBackDetail .case.el-form-item.is-error .el-input__inner{
    border: 1px solid #00a0e9;
  }
  /*.clueFeedBackDetail .el-table{*/
     /*overflow: auto;*/
   /*}*/
  /*.clueFeedBackDetail .el-table__body-wrapper,*/
  /*.clueFeedBackDetail .el-table__header-wrapper,*/
  /*.clueFeedBackDetail .el-table__footer-wrapper{*/
    /*overflow:visible !important;*/
  /*}*/
  /*.clueFeedBackDetail .el-table::after{*/
    /*position: relative !important;*/
  /*}*/
</style>
