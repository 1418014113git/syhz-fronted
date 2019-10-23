<template>
  <section>
   <!--人员信息列表页-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="97px" class="form">
        <el-form-item label="选择单位 省">
          <el-tooltip class="item" effect="dark" :content="selectCurTingDep.name" placement="top-start" :popper-class="(selectCurTingDep.name&&selectCurTingDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-cascader
              v-model="tingOrgCode"
              :options="tingDep"
              change-on-select
              @change="tingDepChange" :clearable="true"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="地市">
          <el-tooltip class="item" effect="dark" :content="selectCurShiDep.name" placement="top-start" :popper-class="(selectCurShiDep.name&&selectCurShiDep.name.length>4)?'tooltipShow':'tooltipHide'">
            <el-cascader
              v-model="shiOrgCode"
              :options="shiDep"
              change-on-select
              @change="shiDepChange" :clearable="true"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="区县">
          <el-tooltip class="item" effect="dark" :content="selectCurQiDep.name" placement="top-start" :popper-class="(selectCurQiDep.name&&selectCurQiDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-select :clearable="true" v-model="qiOrgCode" size="small" placeholder="请选择" filterable @change="qiDepChange">
              <el-option v-for="item in qiDep" :key="item.id" :label="item.name" :value="item.depCode"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
        <el-autocomplete
          v-model="filters.realName"
          :fetch-suggestions="querySearchAsyncName"
          placeholder="输入关键字检索"
          :trigger-on-focus="false"
          @select="handleSelectName"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="人员类别" prop="userSort">
        <el-select  v-model="filters.userSort" size="small" placeholder="请选择" clearable>
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('rylx')" :key="item.dictKey" @change="rylbChange"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="userState">
        <el-select  v-model="filters.userState" size="small" placeholder="请选择" clearable>
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(curUserState)" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="exportList">导出</el-button>
      </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;"  class="testList"  :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="realName" label="姓名"  show-overflow-tooltip>
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleDetail(scope.$index, scope.row)">{{scope.row.realName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="警号"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="userIdNumber" label="身份证号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userSex" label="性别" >
        <template slot-scope="scope">
          <span>{{getSex(scope.row.userSex)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="现任职级" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{$getDictName(scope.row.workerGrade+'', 'xrzj')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="现任职务" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{$getDictName(scope.row.workerGrade+'', xrzw)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workerPhone" label="办公电话" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="phone" label="手机号码" min-width="200" show-overflow-tooltip></el-table-column>
       <el-table-column prop="userSort" label="人员类别">
        <template slot-scope="scope">
          <span>{{$getDictName(scope.row.userSort,'rylx')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userState" label="状态">
        <template slot-scope="scope">
          <span>{{$getDictName(scope.row.userState,curUserState)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="编辑信息"  type="primary" icon="el-icon-edit" circle   @click="handleEdit(scope.$index, scope.row)"></el-button>
          <!-- <el-button size="mini" title="状态"  type="primary"  circle  v-if="scope.row.paperStatus===1" @click="editStatus(scope.$index, scope.row)">
            <svg-icon icon-class="release"></svg-icon>
          </el-button> -->
           <el-button size="mini" title="编辑状态"  type="primary"  icon="el-icon-edit-outline"  circle  @click="editStatus(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
          :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 状态编辑 -->
    <el-dialog title="编辑人员状态" :visible.sync="isShowEditStatus" size="small" class="editPerStatus">
      <el-form ref="editPerForm" :rules="editPerRules" :model="editPerForm" size="mini" :label-width="formLabelWidth">
        <el-form-item label="姓名" prop="realName" :label-width="formLabelWidth">
          <span>{{curRow.realName}}</span>
        </el-form-item>
        <el-form-item label="身份证号" prop="userIdNumber" :label-width="formLabelWidth">
          <span>{{curRow.userIdNumber}}</span>
        </el-form-item>
        <el-form-item label="排列次序" prop="order" :label-width="formLabelWidth">
          <el-input-number v-model.trim="editPerForm.order" :min="1" :max="999"  @change="inputChange(editPerForm.order)"></el-input-number>
        </el-form-item>
        <el-form-item label="人员状态" prop="userState">
          <el-select  v-model="editPerForm.userState" size="small" placeholder="" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(editPerStatus)" :key="item.dictKey"></el-option>
          </el-select>
      </el-form-item>
      <div class="tipText">
        <i class="el-icon-warning"></i> 状态非“在职”人员，将不能再登录平台及办理相关业务，请务必谨慎设置人员状态！
      </div>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save"  class="saveBtn" :loading="btnLoading">保 存</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import { getSessionDeptSelect } from '@/api/depts'
import { ajrlListDepts, getTree } from '@/api/dept'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {
        realName: '',
        deptId: '',
        userSort: '',
        userState: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tingOrgCode: [],
      shiOrgCode: [],
      qiOrgCode: null,
      tingDep: [],
      shiDep: [],
      qiDep: [],
      selectDepList: getSessionDeptSelect(),
      selectCurTingDep: {}, // 当前选择的机构
      selectCurShiDep: {},
      selectCurQiDep: {},
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      isShowEditStatus: false,
      list: [],
      formLabelWidth: '100px',
      btnLoading: false,
      curRow: {}, // 存储当前被点击行数据
      CurshiOrgCode: [], // 存储从案件统计表跳转进来存在的市code
      curUserState: '', // 根据人员类别存储对应的在职状态key值。 'userStatefj': 辅警、工勤, 'userStatemj':民警
      xrzw: '', // 根据当前用户角色是总队，还是支队，存储对应的字典key值， ‘xrzwzod’：总队， 'xrzwzhd':支队
      cityList: [
        {
          label: '西安市', value: '6101', depCode: '610100000000'
        }, {
          label: '铜川市', value: '6102', depCode: '610200000000'
        }, {
          label: '宝鸡市', value: '6103', depCode: '610300000000'
        }, {
          label: '咸阳市', value: '6104', depCode: '610400000000'
        }, {
          label: '渭南市', value: '6105', depCode: '610500000000'
        }, {
          label: '延安市', value: '6106', depCode: '610600000000'
        }, {
          label: '汉中市', value: '6107', depCode: '610700000000'
        }, {
          label: '榆林市', value: '6108', depCode: '610800000000'
        }, {
          label: '安康市', value: '6109', depCode: '610900000000'
        }, {
          label: '商洛市', value: '6110', depCode: '611000000000'
        }, {
          label: '杨凌区', value: '6111', depCode: '611100000000'
        }
      ],
      editPerForm: {
        order: '', // 排列次序
        userState: '' // 人员状态
      },
      editPerStatus: '', // 点击列表当前行，根据当前行的人员类别， 判断出人员状态的字典key值并存储。
      tableHeight: null,
      editPerRules: {
        sort: [ // 序号
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入序号'))
              } else {
                callback()
              }
            }
          }
        ],
        status: [ // 人员状态
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
      this.page = flag ? 1 : this.page
      var para = JSON.parse(JSON.stringify(this.filters))
      if (this.qiOrgCode) {
        para.deptCode = this.qiOrgCode
      } else {
        if (this.shiOrgCode && this.shiOrgCode.length > 0) {
          if (this.shiOrgCode.length > 1) {
            para.deptCode = this.shiOrgCode[this.shiOrgCode.length - 1]
          } else {
            para.deptCode = this.shiOrgCode[0]
          }
        } else {
          if (this.tingOrgCode && this.tingOrgCode.length > 0) {
            if (this.tingOrgCode.length > 1) {
              para.deptCode = this.tingOrgCode[this.tingOrgCode.length - 1]
            } else {
              para.deptCode = this.tingOrgCode[0]
            }
          } else {
            if (this.curDept.depCode.substr(0, 6) !== '610000') {
              if (this.curDept.depCode.substr(4, 2) !== '00') {
                para.deptCode = this.curDept.depCode
              } else {
                para.deptCode = this.curDept.depCode.substr(0, 4)
              }
            }
          }
        }
      }
      para.curDeptCode = this.curDept.depCode // 当前登录部门code，必传
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      if (hand) {
        para.logFlag = 1 // 添加埋点参数
      }
      this.listLoading = true
      this.$query('paper/list', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        } else {
          this.initData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getTingTree() {
      const tings = ajrlListDepts(getSessionDeptSelect(), '610000530000')
      const arrayTemp = [{
        value: '0000',
        label: '全省',
        depCode: '610000000000'
      }]
      for (let i = 0; i < tings.length; i++) {
        const dept = tings[i]
        dept.value = dept.depCode
        if (dept.depCode === '610000530000') {
          dept.label = '总队'
          dept.parentCode = ''
          arrayTemp.push(dept)
        }
        if (dept.depCode === '610000535300') {
          dept.label = '食品犯罪侦查支队'
          dept.parentCode = '610000530000'
          arrayTemp.push(dept)
        }
        if (dept.depCode === '610000535400') {
          dept.label = '药品犯罪侦查支队'
          dept.parentCode = '610000530000'
          arrayTemp.push(dept)
        }
        if (dept.depCode === '610000535500') {
          dept.label = '环境犯罪侦查支队'
          dept.parentCode = '610000530000'
          arrayTemp.push(dept)
        }
      }
      this.tingDep = getTree(arrayTemp)
      this.getShiArray()
    },
    getShiArray() { // 市array
      this.shiDep = []
      const shiDeptsArray = []
      const reObj = []
      for (let i = 0; i < this.selectDepList.length; i++) {
        const dept = this.selectDepList[i]
        if (dept.parentCode === '610000530000') {
          this.getShiTree(dept, reObj, shiDeptsArray)
        }
      }
      this.shiDep = getTree(shiDeptsArray.concat(this.cityList))
    },
    getShiTree(dept, reObj, shiDeptsArray) {
      dept.value = dept.depCode
      if (dept.depCode.substring(0, 6) === '610600') {
        if (dept.depCode.substring(8, 12) === '0000') {
          // 支队
          if (reObj[dept.depCode.substring(0, 6)]) {
            // 已设置
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = dept.depCode.substring(0, 6) + '000000'
            shiDeptsArray.push(dept)
            reObj[dept.depCode.substring(0, 6)].push(dept.depCode)
          } else {
            // 未设置
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = dept.depCode.substring(0, 6) + '000000'
            shiDeptsArray.push(dept)
            reObj[dept.depCode.substring(0, 6)] = [dept.depCode]
          }
        } else {
          // 内设
          const arr = reObj[dept.depCode.substring(0, 6)]
          for (let j = 0; j < arr.length; j++) {
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = arr[j]
            shiDeptsArray.push(dept)
          }
        }
      } else {
        if (dept.depCode.substring(8, 12) === '0000') {
          // 支队
          dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
          dept.parentCode = dept.depCode.substring(0, 4) + '00000000'
          shiDeptsArray.push(dept)
        } else {
          // 内设
          dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
          dept.parentCode = dept.depCode.substring(0, 8) + '0000'
          shiDeptsArray.push(dept)
        }
      }
    },
    tingDepChange(val) {
      this.shiOrgCode = []
      if (val && val.length > 2) {
        for (let i = 0; i < this.tingDep.length; i++) {
          const dept = this.tingDep[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurTingDep = dept
            break
          }
        }
      } else {
        this.shiOrgCode = []
        this.selectCurTingDep = { name: '' }
      }
    },
    shiDepChange(val) {
      this.qiDep = []
      this.qiOrgCode = null
      if (val && val.length > 0) {
        const depcode = val[0]
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          if (depcode.length > 4 && dept.id === val[val.length - 1]) { // hover展示市的汉字
            this.selectCurShiDep = dept
            break
          }
        }
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          if (dept.parentCode.substring(0, 4) === depcode && dept.depCode.substring(0, 6) !== depcode + '00' && dept.depCode.substring(4, 6) !== '00') {
            this.qiDep.push(dept)
          }
        }
        if (this.CurshiOrgCode[0] === val[0] && val.length === 1) {
          this.shiOrgFlag = true
        } else {
          this.shiOrgFlag = false
        }
      } else {
        this.shiOrgFlag = false
        this.selectCurShiDep = { name: '' }
      }
    },
    qiDepChange(val) {
      if (val) {
        for (let i = 0; i < this.qiDep.length; i++) {
          const dept = this.qiDep[i]
          if (dept.depCode === val) {
            this.selectCurQiDep = dept
            break
          }
        }
      } else {
        this.selectCurQiDep = { name: '' }
      }
    },
    initData() {
      this.list = []
      this.total = 0
      this.pageSize = 15
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true, true)
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/basicService/personInfo', query: { type: 'listDetail', id: row.id }})
    },
    handleEdit(index, row) { // 编辑
      this.$router.push({ path: '/basicService/personInfo', query: { type: 'listEdit', id: row.id }})
    },
    editStatus(index, row) { // 编辑人员状态
      this.curRow = row
      this.editPerForm.userState = row.userState
      this.editPerForm.order = index + 1
      var userSort = this.editPerForm.userSort
      if (userSort === '1') { // 民警
        this.editPerStatus = 'ryztmj'
      } else { // 辅警，工勤
        this.editPerStatus = 'ryztfj'
      }
      this.isShowEditStatus = true
    },
    querySearchAsyncName(queryString, cb) { // 姓名检索
      if (queryString) {
        this.isQueryName = true
        if (this.isQueryName) {
          var param = {
            deptId: this.filters.deptId,
            realName: this.filters.realName
          }
          this.$query('USERNAMERETRIEVAL', param, true).then((response) => {
            var restaurants = response.data
            restaurants.forEach(element => {
              element.value = element.realName
            })
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          })
        }
      } else {
        this.isQueryName = false
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelectName(item) {
      this.filters.realName = item.realName
      this.isQueryName = false
    },
    resetForm() { // 重置
      this.filters = {
        realName: '',
        deptId: '',
        userSort: '',
        userState: ''
      }
      this.initData()
      this.query(true, true)
    },
    exportList() { // 导出

    },
    inputChange(num) {
      if (!num) {
        this.editPerForm.num = 1
      }
    },
    rylbChange(val) { // 人员类别change事件
      if (val) {
        if (val === '1') { // 民警
          this.curUserState = 'ryztmj'
        } else { // 辅警，工勤
          this.curUserState = 'ryztfj'
        }
      }
    },
    save() { // 保存
      this.$refs.editPerForm.validate(valid => {
        if (valid) {
          if (this.editPerForm.userState === '1') { // 在职
            this.saveData()
          } else {
            var status = this.$getDictName(this.editPerForm.userState, this.editPerStatus)
            this.$confirm('是否确定将人员状态设置为' + status + '，设置以后该人员将不能再正常登录系统及办理相关业务！', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(() => {
              this.saveData()
            }).catch(() => {
              this.isShowEditStatus = false
            })
          }
        }
      })
    },
    saveData() {
      this.btnLoading = true
      this.editPerForm.lastId = this.curUser.id // 最后修改人id
      this.editPerForm.lastName = this.curUser.realName // 最后修改人姓名
      this.$update('userState/' + this.curRow.id, this.editPerForm, true).then((response) => {
        this.btnLoading = false
        if (response.code === '000000') {
          this.$message({
            message: '人员状态设置成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.isShowEditStatus = false
          }, 3000)
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    cancel() {
      this.isShowEditStatus = false
    },
    getSex(val) {
      var name = ''
      if (val === '0') {
        name = '男'
      } else if (val === '1') {
        name = '女'
      } else {
        name = '未知'
      }
      return name
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '1') { // 总队
        this.xrzw = 'xrzwzod'
      } else if (this.curDept.depType === '2') { // 支队
        this.xrzw = 'xrzwzhd'
      } else if (this.curDept.depType === '3') { // 大队
        this.xrzw = 'xrzwdd'
      } else if (this.curDept.depType === '4') { // 派出所
        this.xrzw = 'xrzwpcs'
      }
    }
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // this.query(true)
    this.getTingTree()
    this.getShiArray()
  }
}

</script>

<style>
.case .el-date-editor .el-range-separator {
  padding: 0;
}
.el-select-dropdown__list {
  max-width: 600px;
  overflow-x: auto;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.el-cascader--small {
  font-size: 16px;
}
</style>
