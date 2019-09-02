<!--<template>-->
  <!--<el-row class="dbeditfq" type="flex" justify="center" v-loading="dataLoading">-->
    <!--<el-col :span="18">-->
      <!--<el-card :body-style="{padding:'30px 100px 50px'}" style="min-height: 500px">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span style="font-weight: bold">发起案件督办</span>-->
        <!--</div>-->
        <!--<el-form ref="dbForm" :model="dbBean" :rules="rules" label-width="140px">-->
          <!--<el-form-item label="督办案件" prop="caseId">-->
            <!--<el-select-->
              <!--v-model="dbBean.caseId"-->
              <!--filterable-->
              <!--remote-->
              <!--reserve-keyword-->
              <!--placeholder="输入案件名称搜索"-->
              <!--:remote-method="queryCase"-->
              <!--:loading="caseLoading"-->
              <!--@visible-change="caseVisible"-->
              <!--value-key="id" class="db_create_input">-->
              <!--<el-option-->
                <!--v-for="item in dbajData"-->
                <!--:key="item.id"-->
                <!--:label="item.AJMC+' ('+item.AJBH+')'"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="督办级别" prop="superviseLevel">-->
            <!--<el-select v-model="dbBean.superviseLevel" placeholder="请选择督办级别" class="db_create_input" value-key="code">-->
              <!--<el-option v-for="item in dbjbData"-->
                         <!--:key="item.code"-->
                         <!--:label="item.code_name"-->
                         <!--:value="item.code">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="执行部门" prop="superviseDeptId">-->
            <!--<el-collapse>-->
              <!--<el-collapse-item title="选择部门" name="1">-->
                <!--<div class="dept-tree">-->
                  <!--<el-tree class="filter-tree" :data="depData" :props="{children: 'children',label: 'name'}"-->
                           <!--ref="depTree"-->
                           <!--highlight-current show-checkbox check-strictly @check-change="menuChange" default-expand-all-->
                           <!--:expand-on-click-node="false" node-key="id"-->
                           <!--style="margin-top: 5px;"></el-tree>-->
                <!--</div>-->
              <!--</el-collapse-item>-->
            <!--</el-collapse>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="执行负责人" prop="supervisePersonId">-->
            <!--<el-select v-model="dbBean.supervisePersonId" placeholder="请选择执行负责人" filterable class="db_create_input"-->
                       <!--value-key="value" @change="fzrChange">-->
              <!--<el-option v-for="item in userData" :key="item.id" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="督办说明" prop="superviseDesc">-->
            <!--<el-input type="textarea" :autosize="{minRows: 8, maxRows: 20}" v-model="dbBean.superviseDesc" style="width:80%" maxlength="100"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" @click="onSubmitEdit"-->
                       <!--v-loading.fullscreen.lock="saveLoading">保存-->
            <!--</el-button>-->
            <!--<el-button type="primary" @click="onSubmit"-->
                       <!--v-loading.fullscreen.lock="saveLoading">提交-->
            <!--</el-button>-->
            <!--<el-button @click="cancel">取消</el-button>-->
            <!--<p style="font-size: 12px; color: #ffffff">提交后将不能修改和删除</p>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-card>-->
    <!--</el-col>-->
  <!--</el-row>-->
<!--</template>-->

<!--<script>-->
  <!--import {-->
    <!--editSupervise, getSupervise, getDBCase, addSuperviseDirect, dbOnlySave-->
  <!--} from '@/api/supervise'-->
  <!--import {-->
    <!--getSessionDeptTree, getUsersByDep-->
  <!--} from '@/api/depts'-->
  <!--import {-->
    <!--getDBLevel-->
  <!--} from '@/utils/codetotext'-->

  <!--export default {-->
    <!--props: {-->
      <!--bean: Object-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--dataLoading: false,-->
        <!--caseLoading: false,-->
        <!--saveLoading: false,-->
        <!--dbajData: [],-->
        <!--depData: [],-->

        <!--dbjbData: getDBLevel(),-->
        <!--userData: [],-->
        <!--dbBean: {},-->
        <!--rules: {-->
          <!--caseId: [{-->
            <!--required: true, message: '请选择督办案件', trigger: 'change'-->
          <!--}],-->
          <!--superviseLevel: [{-->
            <!--required: true, message: '请选择督办级别', trigger: 'change'-->
          <!--}],-->
          <!--superviseDeptId: [-->
            <!--{-->
              <!--required: true, trigger: 'change', validator: (rule, value, callback) => {-->
                <!--if (this.selectedDepts.length === 0) {-->
                  <!--callback(new Error('请选择督办部门'))-->
                <!--} else {-->
                  <!--callback()-->
                <!--}-->
              <!--}-->
            <!--}-->
          <!--],-->
          <!--supervisePersonId: [{-->
            <!--required: false, message: '请选择督办部门负责人', trigger: 'change'-->
          <!--}],-->
          <!--superviseDesc: [{-->
            <!--required: true, message: '请输入督办说明', trigger: 'blur'-->
          <!--}, {-->
            <!--min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur'-->
          <!--}]-->
        <!--},-->
        <!--selectedDepts: []-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--fzrChange(val) {-->
        <!--this.userData.forEach((item, i) => {-->
          <!--if (item.id === val) {-->
            <!--this.dbBean.supervisePerson = item.name-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--// dbbmChange(val) {-->
      <!--//   this.depData.forEach((item, i) => {-->
      <!--//     if (item.id === val) {-->
      <!--//       this.dbBean.superviseDept = item.name-->
      <!--//     }-->
      <!--//   })-->
      <!--// },-->
      <!--menuChange(value, isChecked) {-->
        <!--if (isChecked) {-->
          <!--this.selectedDepts.push({-->
            <!--id: value.id, name: value.name-->
          <!--})-->
        <!--} else {-->
          <!--let i = -1-->
          <!--this.selectedDepts.forEach((item, index) => {-->
            <!--if (item.id === value.id) {-->
              <!--i = index-->
            <!--}-->
          <!--})-->
          <!--if (i > -1) {-->
            <!--this.selectedDepts.splice(i, 1)-->
          <!--}-->
        <!--}-->
      <!--},-->
      <!--shbmChange(val) {-->
        <!--this.depData.forEach((item, i) => {-->
          <!--if (item.id === val) {-->
            <!--this.dbBean.superviseExamDept = item.name-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--onSubmitEdit() {-->
        <!--this.$refs.dbForm.validate(valid => {-->
          <!--if (valid) {-->
            <!--this.handleDepts()-->
            <!--if (this.dbBean.id) {-->
              <!--this.handleEdit(0)-->
            <!--} else {-->
              <!--this.handleSave(0)-->
            <!--}-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--onSubmit() {-->
        <!--this.$refs.dbForm.validate(valid => {-->
          <!--if (valid) {-->
            <!--this.handleDepts()-->
            <!--if (this.dbBean.id) {-->
              <!--this.handleEdit(1)-->
            <!--} else {-->
              <!--this.handleSave(1)-->
            <!--}-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--handleEdit(state) {-->
        <!--const req = this.dbBean-->
        <!--req.status = state-->
        <!--if (state === 1) {-->
          <!--req.status = '5' // 待签收-->
        <!--}-->
        <!--this.directEdit(req)-->
      <!--},-->
      <!--directEdit(req) {-->
        <!--editSupervise(req).then((res) => {-->
          <!--this.saveLoading = false-->
          <!--this.returnMsg('提交成功', res)-->
        <!--}).catch(() => {-->
          <!--this.saveLoading = false-->
        <!--})-->
      <!--},-->
      <!--handleSave(state) {-->
        <!--const req = this.dbBean-->
        <!--req.status = state-->
        <!--if (state === 1) {-->
          <!--req.status = '5' // 待签收-->
        <!--}-->
        <!--this.dbBean.category = 'demand'-->
        <!--req.bizType = 3-->
        <!--req.action = '添加督办案件'-->
        <!--if (state === 0) {-->
          <!--this.onlySave(req)-->
        <!--}-->
        <!--if (state === 1) {-->
          <!--this.directSave(req)-->
        <!--}-->
      <!--},-->
      <!--onlySave(req) {-->
        <!--dbOnlySave(req).then((res) => {-->
          <!--this.saveLoading = false-->
          <!--this.returnMsg('提交成功', res)-->
        <!--}).catch(() => {-->
          <!--this.saveLoading = false-->
        <!--})-->
      <!--},-->
      <!--directSave(req) {-->
        <!--addSuperviseDirect(req).then((res) => {-->
          <!--this.saveLoading = false-->
          <!--this.returnMsg('提交成功', res)-->
        <!--}).catch(() => {-->
          <!--this.saveLoading = false-->
        <!--})-->
      <!--},-->
      <!--returnMsg(msg, response) {-->
        <!--if (response.code === '000000') {-->
          <!--this.$message({-->
            <!--message: msg, type: 'success'-->
          <!--})-->
          <!--this.cancel()-->
        <!--}-->
      <!--},-->
      <!--handleDepts() {-->
        <!--for (let i = 0; i < this.selectedDepts.length; i++) {-->
          <!--const data = this.selectedDepts[i]-->
          <!--if (i === 0) {-->
            <!--this.dbBean.superviseDeptId = '[' + data.id + ']'-->
            <!--this.dbBean.superviseDept = data.name-->
          <!--} else {-->
            <!--this.dbBean.superviseDeptId += ',[' + data.id + ']'-->
            <!--this.dbBean.superviseDept += ',' + data.name-->
          <!--}-->
        <!--}-->
      <!--},-->
      <!--cancel() {-->
        <!--this.$router.push({-->
          <!--path: '/caseManage/dblist'-->
        <!--})-->
      <!--},-->
      <!--caseVisible(flag) {-->
        <!--if (!flag) {-->
          <!--this.dbajData = []-->
        <!--}-->
      <!--},-->
      <!--queryCase(val) {-->
        <!--if (!val) {-->
          <!--return false-->
        <!--}-->
        <!--getDBCase({-->
          <!--AJMC: val-->
        <!--}).then((response) => {-->
          <!--if (response.data.length > 0) {-->
            <!--this.dbajData = response.data-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--initEdit() {-->
        <!--this.dataLoading = true-->
        <!--getSupervise({-->
          <!--id: this.$route.params.id-->
        <!--}).then((response) => {-->
          <!--const data = response.data-->
          <!--if (data) {-->
            <!--this.dbBean.id = data.id-->
            <!--this.dbBean.applyPersonId = data.apply_person_id-->
            <!--this.dbBean.applyPersonName = data.apply_person_name-->
            <!--this.dbBean.applyDeptId = data.apply_dept_id-->
            <!--this.dbBean.applyDeptName = data.apply_dept_name-->
            <!--this.dbBean.status = data.status-->
            <!--this.dbBean.superviseLevel = data.supervise_level-->
            <!--this.dbBean.superviseDesc = data.supervise_desc-->
            <!--// this.dbBean.superviseDept = data.supervise_dept-->
            <!--// this.dbBean.superviseDeptId = data.supervise_dept_id-->
            <!--this.dbBean.superviseExamDept = data.supervise_exam_dept-->
            <!--this.dbBean.supervisePersonId = data.supervise_person_id-->
            <!--this.dbBean.supervisePerson = data.supervise_person-->
            <!--this.dbBean.userId = data.apply_person_id-->
            <!--this.dbBean.userName = data.apply_person_name-->
            <!--// if (data.supervise_dept_id) {-->
            <!--//   const selectedData = []-->
            <!--//   const array = data.supervise_dept_id.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')-->
            <!--//   for (let i = 0; i < array.length; i++) {-->
            <!--//     selectedData.push(array[i])-->
            <!--//   }-->
            <!--//   this.$refs.depTree.setCheckedKeys(selectedData)-->
            <!--// }-->
            <!--getDBCase({-->
              <!--caseId: data.case_id-->
            <!--}).then((response) => {-->
              <!--if (response.data) {-->
                <!--this.dbajData = response.data-->
                <!--this.queryCase(this.dbajData[0]['AJMC'])-->
                <!--this.dbBean.caseId = Number(data.case_id)-->
              <!--}-->
              <!--this.dataLoading = false-->
            <!--}).catch(() => {-->
              <!--this.dataLoading = false-->
            <!--})-->
          <!--} else {-->
            <!--this.dataLoading = false-->
          <!--}-->
        <!--}).catch(() => {-->
          <!--this.dataLoading = false-->
        <!--})-->
      <!--},-->
      <!--getUsers(id) {-->
        <!--getUsersByDep(id).then((response) => {-->
          <!--if (response.data && response.data.length > 0) {-->
            <!--const data = response.data-->
            <!--const list = []-->
            <!--data.forEach((item) => {-->
              <!--list.push({-->
                <!--id: item.id + '', name: item.real_name, userName: item.user_name, phone: item.phone-->
              <!--})-->
            <!--})-->
            <!--this.userData = list-->
          <!--}-->
        <!--})-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))-->
      <!--this.dbBean.applyPersonId = userInfo.id-->
      <!--this.dbBean.applyPersonName = userInfo.realName-->
      <!--this.dbBean.userId = userInfo.id-->
      <!--this.dbBean.userName = userInfo.realName-->
      <!--const dept = JSON.parse(sessionStorage.getItem('depToken'))[0]-->
      <!--this.dbBean.applyDeptId = dept.id-->
      <!--this.dbBean.applyDeptName = dept.depName-->
      <!--this.dbBean.category = 'demand'-->
      <!--this.depData = getSessionDeptTree()-->
      <!--if (this.$route.params.id) {-->
        <!--this.initEdit()-->
      <!--}-->
      <!--this.getUsers()-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.dbeditfq .db_create_input {-->
	<!--width: 400px;-->
<!--}-->
<!--.dbeditfq .dept-tree {-->
	<!--max-height: 400px;-->
	<!--overflow-y: auto;-->
	<!--padding: 5px;-->
<!--}-->
<!--</style>-->
