<template>
  <div class="urge_tab">
    <el-table :data="urgeData" v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="urgent_dept_name" label="发起部门" min-width="10%"></el-table-column>
      <el-table-column prop="urgent_person_name" label="发起人" min-width="6%"></el-table-column>
      <el-table-column label="催办内容" min-width="15%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="400"
            trigger="click">
            {{scope.row.urged_content}}
            <el-button slot="reference" type="text" class="urge_tab_list" style="width:240px">
              {{scope.row.urged_content}}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="催办时间" min-width="6%">
        <template slot-scope="scope">
          {{scope.row.create_time | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" min-width="15%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="400"
            trigger="click">
            {{scope.row.feedback_content}}
            <el-button slot="reference" type="text" class="urge_tab_list" style="width:100%">
              {{scope.row.feedback_content}}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <!--<el-table-column prop="fksj" label="反馈时间" width="100"></el-table-column>-->
      <!--<el-table-column prop="fkr" label="反馈人" width="100"></el-table-column>-->
      <el-table-column prop="urged_dept_name" label="催办部门" min-width="10%"></el-table-column>
      <el-table-column prop="urged_person_name" label="催办责任人" width="100"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">待签收</span>
          <span v-if="scope.row.status === '2'">已签收</span>
          <span v-if="scope.row.status === '3'">已反馈</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1' && Number(scope.row.urged_dept_id) === currentDep && $isViewBtn('100815')"
                     size="small"
                     @click="handleAccept(scope.$index, scope.row)">签收
          </el-button>
          <el-button v-if="scope.row.status === '2' && Number(scope.row.urged_dept_id) === currentDep && $isViewBtn('100816')"
                     size="small" type="primary"
                     @click="showCbDiaCallBack(scope.$index, scope.row)">反馈
          </el-button>
          <el-button v-if="scope.row.status === '1' && Number(scope.row.urgent_dept_id) === currentDep && $isViewBtn('100813')"
                     size="small" type="danger"
                     @click="handleDel(scope.$index, scope.row)">删除
          </el-button>
          <el-button v-if="scope.row.status === '1' && Number(scope.row.urgent_dept_id) === currentDep && $isViewBtn('100814')"
                     size="small" type="danger"
                     @click="showCbDiaEdit(scope.$index, scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" style="padding-bottom: 10px; clear-after: both">
      <el-pagination v-if="listTotal > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog title="下发催办" :visible.sync="dbcbDiaVisible">
      <el-form ref="dbxfcbForm" :model="dbcbBean" :rules="rules" label-width="140px">
        <el-form-item label="发起人">
          {{dbcbBean.cbfar}}
        </el-form-item>
        <el-form-item label="发起部门">
          {{dbcbBean.cbfqbm.depName}}
        </el-form-item>
        <el-form-item label="催办部门" prop="cbbm">
          <el-select v-model="dbcbBean.cbbm" placeholder="请选催办部门" class="db_create_input" clearable value-key="id" @change="deptChange">
            <el-option v-for="item in depData" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="催办责任人" prop="cbzrr">
          <el-select v-model="dbcbBean.cbzrr" placeholder="请选择催办责任人" filterable class="db_create_input" clearable value-key="value">
            <el-option v-for="item in dbcbzrr" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="催办截止日期" prop="cbjzrq">
          <el-date-picker v-model="dbcbBean.cbjzrq" type="date" placeholder="选择日期" class="db_create_input"
                          value-format="yyyy-MM-dd" clearable :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="催办要求" prop="cbyq">
          <el-input type="textarea" v-model="dbcbBean.cbyq" style="width:80%" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="cboperationType==='add'" type="primary" @click="onSubmitAdd"
                     v-loading.fullscreen.lock="dbcbSaveLoading">提 交</el-button>
          <el-button v-if="cboperationType==='edit'" type="primary" @click="onSubmitEdit"
                     v-loading.fullscreen.lock="dbcbSaveLoading">提 交</el-button>
          <el-button @click="cancelDialog(1)">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="催办反馈" :visible.sync="dbcbBackDiaVisible">
      <el-form ref="dbcbBackForm" :model="dbcbBackBean" :rules="rules1" label-width="140px">
        <el-form-item label="催办反馈" prop="cbfk">
          <el-input type="textarea" v-model="dbcbBackBean.cbfk" style="width:80%" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCallBack"
                     v-loading.fullscreen.lock="dbcbSaveLoading">提 交
          </el-button>
          <el-button @click="cancelDialog(2)">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDbCbPage, deleteDbCb, addDbCb, editDbCb, addBusinessSign, getSignList, editDbCbAccept
  } from '@/api/supervise'
  import { parseTime } from '@/utils/index'
  import {
    getUsersByIds
  } from '@/api/depts'

  export default {
    name: 'SuperviseInfo',
    props: ['dbInfoData', 'depts'],
    data() {
      return {
        currentDep: '',
        dbcbDiaVisible: false,
        dbcbBackDiaVisible: false,
        dbcbSaveLoading: false,
        cboperationType: 'add',
        pageSize: 10,
        listTotal: 20,
        page: 1,
        listLoading: false,
        urgeData: [],
        dbcbBean: {
          cbzrr: '',
          cbjzrq: '',
          cbbm: '',
          cbfqbm: '',
          cbyq: '',
          cbfar: '',
          cbfarid: ''
        },
        curDept: {},
        curUser: {},
        dbcb_id: '',
        dbcbBackBean: {
          cbfk: ''
        },
        dbcbzrr: [],
        depData: [],
        rules: {
          cbfqbm: [{
            required: true, message: '请选择发起催办部门', trigger: 'change'
          }],
          cbbm: [{
            required: true, message: '请选择催办部门', trigger: 'change'
          }],
          cbzrr: [{
            required: true, message: '请选择催办责任人', trigger: 'change'
          }],
          cbjzrq: [{
            required: true, message: '请选择催办截止日期', trigger: 'change'
          }],
          cbyq: [{
            required: true, message: '请输入催办要求', trigger: 'blur'
          }, {
            min: 5, max: 500, message: '长度在 5 到 200 个字符', trigger: 'blur'
          }]
        },
        rules1: {
          cbfk: [{
            required: true, message: '请输入反馈内容', trigger: 'blur'
          }, {
            min: 5, max: 500, message: '长度在 5 到 200 个字符', trigger: 'blur'
          }]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - (3600 * 1000 * 24)
          }
        }
      }
    },
    filters: {
      formatDate(time) {
        return parseTime(time, '{y}-{m}-{d}')
      }
    },
    methods: {
      deptChange(val) {
        if (val && val.id) {
          this.getUsers([Number(val.id)])
        }
      },
      handleCurrentChange(val) {
        this.page = val
        this.query()
      },
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          const para = { id: row.id }
          deleteDbCb(para).then((res) => {
            this.listLoading = false
            if (res.code === '000000') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.query()
          })
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleAccept(index, row) {
        this.$confirm('确认执行签收吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.handEditSign(row.id)
        }).catch(() => {
          this.listLoading = false
        })
      },
      handEditSign(id) {
        let bsId
        getSignList({
          businessTable: 'aj_supervise_urgent',
          businessValue: id
        }).then((res) => {
          if (res.code === '000000') {
            if (res.data && res.data.length > 0) {
              bsId = res.data[0]['id']
            }
            const req = {
              id: bsId,
              cbId: id,
              signUserId: this.curUser.id,
              updateUserId: this.curUser.id,
              status: 2,
              bizType: 3,
              action: '签收催办',
              bizId: this.$route.params.id,
              userId: this.curUser.id,
              userName: this.curUser.realName
            }
            editDbCbAccept(req).then((res) => {
              this.listLoading = false
              if (res.code === '000000') {
                this.$message({
                  message: '提交成功', type: 'success'
                })
                this.query()
              }
            }).catch(() => {
              this.dbcbDiaVisible = false
            })
          }
        }).catch(() => {
          this.dbcbDiaVisible = false
        })
      },
      showCbDiaAdd() {
        this.resetForm('dbxfcbForm')
        this.dbcbDiaVisible = true
        this.cboperationType = 'add'
      },
      showCbDiaEdit(index, row) {
        this.resetForm('dbxfcbForm')
        this.dbcbDiaVisible = true
        this.cboperationType = 'edit'
        this.dbInfoData.dbId = row.supervise_id
        this.dbcbBean.id = row.id
        this.dbcbBean.cbfarid = row.urgent_person_id
        this.dbcbBean.cbfar = row.urgent_person_name
        this.dbcbBean.cbfqbm = {
          depName: row.urgent_dept_name,
          id: row.urgent_dept_id
        }
        this.dbcbBean.cbjzrq = row.end_date
        this.dbcbBean.cbzrr = {
          value: Number(row.urged_person_id),
          name: row.urged_person_name
        }
        this.dbcbBean.cbbm = {
          id: Number(row.urged_dept_id),
          name: row.urged_dept_name
        }
        this.dbcbBean.cbyq = row.urged_content
      },
      showCbDiaCallBack(index, row) {
        this.resetForm('dbcbBackForm')
        this.dbcbBackDiaVisible = true
        this.dbcbBean.id = row.id
      },
      onSubmitAdd() {
        this.$refs.dbxfcbForm.validate(valid => {
          if (valid) {
            this.handSave()
          }
        })
      },
      handSave() {
        const req = {
          superviseId: this.$route.params.id,
          urgentPersonId: this.dbcbBean.cbfarid,
          urgentPersonName: this.dbcbBean.cbfar,
          urgentDeptName: this.dbcbBean.cbfqbm.depName,
          urgentDeptId: this.dbcbBean.cbfqbm.id,
          endDate: parseTime(new Date(this.dbcbBean.cbjzrq), '{y}-{m}-{d} {h}:{i}:{s}'),
          urgedPersonId: this.dbcbBean.cbzrr.value,
          urgedPersonName: this.dbcbBean.cbzrr.name,
          urgedDeptId: this.dbcbBean.cbbm.id,
          urgedDeptName: this.dbcbBean.cbbm.name,
          urgedContent: this.dbcbBean.cbyq,
          status: 1,
          bizId: this.$route.params.id,
          bizType: 3,
          action: '下发案件催办',
          userId: this.curUser.id,
          userName: this.curUser.realName
        }
        addDbCb(req).then((res) => {
          this.dbcbDiaVisible = false
          if (res.code === '000000') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.handAddSign(res.data)
            this.query()
          }
        }).catch(() => {
          this.dbcbDiaVisible = false
        })
      },
      handAddSign(id) {
        const req = {
          noticeOrgId: this.dbcbBean.cbbm.id,
          noticeTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          noticeUserId: this.dbcbBean.cbzrr.value,
          qsStatus: 1,
          parentId: this.dbcbBean.cbbm.id,
          businessType: 4,
          deadlineTime: parseTime(new Date(this.dbcbBean.cbjzrq), '{y}-{m}-{d} {h}:{i}:{s}'),
          status: 1,
          businessTable: 't_business_sign',
          businessProperty: 'id',
          businessValue: id
        }
        addBusinessSign(req).then((res) => {
          this.$emit('reTimeList')
        }).catch(() => {
          this.dbcbDiaVisible = false
        })
      },
      onSubmitEdit() {
        this.$refs.dbxfcbForm.validate(valid => {
          if (valid) {
            this.handleEdit()
          }
        })
      },
      handleEdit() {
        const req = {
          id: this.dbcbBean.id,
          superviseId: this.$route.params.id,
          urgentPersonId: this.dbcbBean.cbfarid,
          urgentPersonName: this.dbcbBean.cbfar,
          urgentDeptName: this.dbcbBean.cbfqbm.depName,
          urgentDeptId: this.dbcbBean.cbfqbm.id,
          endDate: parseTime(new Date(this.dbcbBean.cbjzrq), '{y}-{m}-{d} {h}:{i}:{s}'),
          urgedPersonId: this.dbcbBean.cbzrr.value,
          urgedPersonName: this.dbcbBean.cbzrr.name,
          urgedDeptId: this.dbcbBean.cbbm.id,
          urgedDeptName: this.dbcbBean.cbbm.name,
          urgedContent: this.dbcbBean.cbyq
        }
        editDbCb(req).then((res) => {
          this.dbcbDiaVisible = false
          if (res.code === '000000') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.query()
          }
        }).catch(() => {
          this.dbcbDiaVisible = false
        })
      },
      onCallBack() {
        this.$refs.dbcbBackForm.validate(valid => {
          if (valid) {
            const req = {
              id: this.dbcbBean.id,
              feedbackContent: this.dbcbBackBean.cbfk,
              status: 3,
              bizId: this.$route.params.id,
              bizType: 3,
              action: '提交案件催办反馈',
              userId: this.curUser.id,
              userName: this.curUser.realName
            }
            editDbCb(req).then((res) => {
              if (res.code === '000000') {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.query()
                this.dbcbBackDiaVisible = false
              }
            }).catch(() => {
              this.dbcbBackDiaVisible = false
            })
          }
        })
      },
      query() {
        this.listLoading = true
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          superviseId: this.$route.params.id
        }
        getDbCbPage(para).then((response) => {
          this.listLoading = false
          this.urgeData = response.data.list
          this.listTotal = response.data.totalCount
          this.pageSize = response.data.pageSize
          this.$emit('reTimeList')
        }).catch(() => {
          this.listLoading = false
        })
      },
      resetForm(form) {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      cancelDialog(type) {
        if (type === 1) {
          this.resetForm('dbxfcbForm')
          this.dbcbDiaVisible = false
        } else {
          this.resetForm('dbcbBackForm')
          this.dbcbBackDiaVisible = false
        }
      },
      getUsers(ids) {
        this.dbcbzrr = []
        getUsersByIds(ids).then((response) => {
          if (response.data && response.data.length > 0) {
            const data = response.data
            const list = []
            data.forEach((item) => {
              list.push({
                value: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
              })
            })
            this.dbcbzrr = list
          }
        })
      }
    },
    mounted() {
      this.query()
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.dbcbBean.cbfar = this.curUser.realName
      this.dbcbBean.cbfarid = this.curUser.id
      this.dbcbBean.cbzrr = {
        value: Number(this.curUser.id), name: this.curUser.realName
      }
      if (sessionStorage.getItem('depToken')) {
        this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
        this.currentDep = this.curDept.id
        this.dbcbBean.cbfqbm = this.curDept
      }
      this.depData = this.depts
    },
    watch: {
      depts(val) {
        this.depData = val
      }
    }
  }
</script>

<style scoped>

  .urge_tab .db_create_input {
    width: 300px;
  }

  .urge_tab_list {
    text-align: left;
    padding-left: 0;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2; /** 显示的行数 **/
    overflow: hidden; /** 隐藏超出的内容 **/
  }


</style>
