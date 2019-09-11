<template>
  <section  class="ajrlList">
    <!--工具条-->
    <!-- <el-button type="primary" size="small"  style="float:right;" v-on:click="backStatistical()" v-if="showBackBtn">返回</el-button> -->
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" v-if="showBackBtn" @click="backStatistical">   <!--返回-->
    </el-col>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="84px">
        <el-form-item label="总队" v-if="depLevel === 1">
          <el-tooltip class="item" effect="dark" :content="selectCurTingDep.name" placement="top-start" :popper-class="(selectCurTingDep.name&&selectCurTingDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-cascader
              v-model="tingOrgCode"
              :options="tingDep"
              change-on-select
              @change="tingDepChange" :clearable="true"></el-cascader>
          </el-tooltip>
        </el-form-item>
        <!--<el-form-item label="市" v-if="depLevel === 1 || depLevel === 2 ">-->
          <!--<el-tooltip class="item" effect="dark" :content="selectCurShiDep.name" placement="top-start" :popper-class="(selectCurShiDep.name&&selectCurShiDep.name.length>11)?'tooltipShow':'tooltipHide'">-->
            <!--<el-cascader-->
              <!--v-model="shiOrgCode"-->
              <!--:options="shiDep"-->
              <!--change-on-select-->
              <!--@change="shiDepChange" :clearable="true"></el-cascader>-->
            <!--&lt;!&ndash;:disabled="depLevel===2"&ndash;&gt;-->
          <!--</el-tooltip>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="县区" v-if="depLevel === 1 || depLevel === 2 || depLevel === 3">-->
          <!--<el-tooltip class="item" effect="dark" :content="selectCurQiDep.name" placement="top-start" :popper-class="(selectCurQiDep.name&&selectCurQiDep.name.length>11)?'tooltipShow':'tooltipHide'">-->
            <!--<el-select :clearable="true" v-model="qiOrgCode" size="small" placeholder="请选择" :disabled="depLevel===3" @change="qiDepChange">-->
              <!--<el-option v-for="item in qiDep" :key="item.id" :label="item.name" :value="item.depCode"></el-option>-->
            <!--</el-select>-->
          <!--</el-tooltip>-->
        <!--</el-form-item>-->
        <el-form-item label="案件名称" prop="AJMC">
          <el-input v-model="filters.AJMC" size="small" placeholder="案件名称" clearable maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="案件编号" prop="AJBH">
          <el-input v-model="filters.AJBH" size="small" placeholder="案件编号" clearable maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="认领状态" prop="qsStatus">
          <el-select :clearable="true" v-model="qsStatus" size="small" placeholder="选择认领状态" @change="qsStatusChange">
            <el-option v-for="item in options1" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认领时间类型" label-width="108px">
          <el-select v-model="filters.dType" filterable clearable placeholder="请选择筛选类型" @change="queryByType">
            <el-option label="本年" value="year"></el-option>
            <el-option label="本季" value="quarter"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="本周" value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受理时间" prop="value6">
          <div class="block case">
            <el-date-picker value-format="yyyy-MM-dd" v-model="filters.slsj" type="daterange" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" size="small" clearable></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="认领时间" prop="startTime">
          <el-date-picker
            v-model="filters.rlStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChange">
          </el-date-picker>
           <el-date-picker
            v-model="filters.rlEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="endDateDisabled">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="督办状态" prop="sel_val3">-->
          <!--<el-select :clearable="true" style="width: 180px" v-model="sel_val3" size="small" placeholder="督办状态选择">-->
            <!--<el-option v-for="item in options3" :key="item.label" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="完善状态" prop="sel_val2">-->
          <!--<el-select :clearable="true" style="width: 177px" v-model="sel_val2" size="small" placeholder="完善状态选择">-->
            <!--<el-option v-for="item in options2" :key="item.label" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" size="small" v-if="$isViewBtn('100701')" v-on:click="getCase(true,true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-on:click="reset()">重置</el-button>
          <!-- <el-button type="primary" size="small"  v-on:click="backStatistical()" v-if="showBackBtn">返回</el-button> -->
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="案件编号" min-width="7%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="10%" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
      <el-table-column label="简要案情" prop="JYAQ" :formatter="getJYAQFormat" min-width="20%" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类别" min-width="8%">
      </el-table-column>
      <!--<el-table-column prop="DISTRICTCODENAME" label="市" width="120" >-->
      <!--</el-table-column>-->
      <el-table-column prop="status"  label="状态" width="80" > <!--:formatter="getStatusName"-->
        <template slot-scope="scope">
          <el-tag  :type="scope.row.status==3?'':(scope.row.status==5?'success':(scope.row.status==9?'warning':'danger'))">{{getStatusName(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作事由" prop="revoke_reason" :formatter="getResonFormat"  :show-overflow-tooltip="true" width="120" >
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain v-if="scope.row.status!=3 && $isViewBtn('100703')"  @click="handleAjDetail(scope.$index, scope.row)"> 查看详情</el-button>
          <el-button size="small" type="primary" plain v-if="scope.row.status==3 && $isViewBtn('100704')"  :disabled="scope.row.status!=3" @click="handleAjDetail(scope.$index, scope.row)"> 案件认领</el-button>
          <el-button size="small" type="warning" plain v-if="scope.row.status==3 && $isViewBtn('100705') && downBtn"  @click="handleZDGX(0, scope.row, 'ajxfForm')">案件下发</el-button>
          <el-button size="small" type="warning" plain v-if="scope.row.status==3 && $isViewBtn('100705') && upBtn"  @click="handleZDGX(1, scope.row, 'ajzfForm')">案件转发</el-button>
          <el-button size="small" type="danger"  plain v-if="scope.row.status==3 && $isViewBtn('100706')"  @click="handleZDGX(2, scope.row, 'ajcxForm')">撤销案件</el-button>
          <el-button size="small" type="danger"  plain v-if="scope.row.status==10 && $isViewBtn('100706')"  @click="handleZDGX(3, scope.row, 'ajhfForm')">恢复案件</el-button>
          <el-button size="small" type="danger"  plain v-if="$isViewBtn('100705')"  @click="handleAJSIGN(scope.row.AJBH)">认领详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--案件下发-->
    <el-dialog title="案件下发" :visible.sync="dialogXFVisible" size="small">
      <el-form class="ajInfoForm" style="margin:0 auto" :rules="rules" :model="ajInfo" ref="ajxfForm" size="small" label-width="110px"
               @submit.prevent="onSubmit">
        <el-form-item label="下发单位：" prop="noticeOrgId">
          <el-select v-model="noticeOrgId" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="(item, index) in deptList" :key="'xf'+index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="medium" :disabled="ajInfo.status==5" @click="zdgxSave(1, 'ajxfForm')" :loading="btnLoading">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--案件转发-->
    <el-dialog title="案件转发" :visible.sync="dialogSBVisible" size="small">
      <el-form class="ajInfoForm" style="margin:0 auto" :rules="rules3" :model="ajInfo" ref="ajzfForm" size="small" label-width="110px"
               @submit.prevent="onSubmit">
        <el-form-item label="转发单位：" prop="noticeOrgId">
          <el-select v-model="noticeOrgId" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="item in parentDeptList" :key="'zf'+item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转发原因："  prop="revokeReason">
          <el-input  type="textarea" v-model="ajInfo.revokeReason" auto-complete="off" maxlength="200"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="medium" :disabled="ajInfo.status==5" @click="zdgxSave(2, 'ajzfForm')" :loading="btnLoading">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="恢复案件" :visible.sync="dialogRecoverVisible" size="small">
      <el-form class="ajInfoForm" style="width: 85%; margin:0 auto" :rules="rules3" :model="ajInfo" ref="ajhfForm" size="small" label-width="120px"
               @submit.prevent="onSubmit">
        <el-form-item label="指定单位：" prop="noticeOrgId">
          <el-select v-model="noticeOrgId" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="item in tjnsxjDeptList" :key="'zf'+item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="恢复原因："  prop="revokeReason">
          <el-input  type="textarea" v-model="ajInfo.revokeReason" auto-complete="off" maxlength="200"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="medium" :disabled="ajInfo.status==5" @click="zdgxSave(3, 'ajhfForm')" :loading="btnLoading">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--撤销案件-->
    <el-dialog title="撤销案件" :visible.sync="dialogRevokeVisible" size="small">
      <el-form class="ajInfoForm" style="width: 85%; margin:0 auto" :rules="rules2" :model="ajInfo" ref="ajcxForm"   size="small" label-width="120px"
               @submit.prevent="onSubmit">
        <el-form-item label="撤销原因："  prop="revokeReason">
          <el-input  type="textarea" v-model="ajInfo.revokeReason" auto-complete="off" maxlength="200"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="medium" :disabled="ajInfo.status==5" @click="revokeSave()" :loading="cxLoading">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="认领详情" :visible.sync="dialogLogVisible" size="small" width="80%">
      <div style="max-height: 500px; overflow-y: auto">
        <el-table :data="ajLogList" highlight-current-row v-loading="logListLoading" style="width: 100%;">
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="optStr" label="操作" width="100"></el-table-column>
          <el-table-column prop="optOrg" label="操作单位" :show-overflow-tooltip="true"  min-width="10%"></el-table-column>
          <el-table-column prop="optPerson" label="操作人" width="140"></el-table-column>
          <el-table-column prop="receiveDept" label="接收单位" :show-overflow-tooltip="true"  min-width="10%" ></el-table-column>
          <el-table-column prop="revokeReason"  label="操作事由" :show-overflow-tooltip="true" min-width="10%" ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { getAJJBXXETLRLPage, addAJJBXXSYHZDGX, editAJJBXXSYH } from '@/api/caseManage'
import { getSessionDeptSelect } from '@/api/depts'
import { getAjrlDept, getAjrlParentDept, getDeptLevel, ajrlListDepts, getAjrlNSXJ, getTree } from '@/api/dept'
import { getUserInfo } from '@/utils/auth'
export default {
  data() {
    return {
      tingOrgCode: [],
      shiOrgCode: [],
      qiOrgCode: null,
      tingDep: [],
      shiDep: [],
      qiDep: [],
      cityCode: '',
      deptProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id'
      },
      qsStatus: null,
      curDept: {},
      curUser: {},
      filters: {
        AJMC: '',
        AJBH: '',
        dType: '',
        rlStartTime: '',
        rlEndTime: ''
      },
      ajInfo: {},
      noticeOrgId: '',
      cases: [],
      ajLogList: [],
      total: 0,
      page: 1,
      pageSize: 15,
      selectDepList: getSessionDeptSelect(),
      listLoading: false,
      logListLoading: false,
      dialogXFVisible: false,
      dialogSBVisible: false,
      dialogRevokeVisible: false,
      dialogRecoverVisible: false,
      dialogLogVisible: false,
      upBtn: true,
      downBtn: true,
      deptList: [],
      parentDeptList: [],
      tjnsxjDeptList: [],
      depLevel: 0,
      sels: [],
      value6: '',
      endDateDisabled: true, // 认领结束时间选择框禁用
      btnLoading: false, // 下发、转发、恢复loading
      cxLoading: false, // 撤销loading
      selectCurTingDep: {}, // 当前选择的机构
      selectCurShiDep: {},
      selectCurQiDep: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        noticeOrgId: [{ required: true, message: '请选择单位', trigger: 'change' }]
      },
      rules2: {
        revokeReason: [
          { required: true, message: '请输入撤销原因', trigger: 'blur' },
          { max: 200, message: '原因不能超过200字', trigger: 'blur' }
        ]
      },
      rules3: {
        noticeOrgId: [{ required: true, message: '请选择单位', trigger: 'change' }],
        revokeReason: [
          { required: true, message: '请输入转发原因', trigger: 'blur' },
          { max: 200, message: '原因不能超过200字', trigger: 'blur' }
        ]
      },
      options1: [
        { value: '1', label: '待认领' },
        { value: '2', label: '已认领' },
        { value: '3', label: '下发案件' },
        { value: '4', label: '转发案件' },
        { value: '5', label: '撤销案件' }
      ],
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
        // {
        //   label: '锡林郭勒盟', value: '1525', depCode: '152500000000'
        // }, {
        //   label: '阿拉善盟', value: '1529', depCode: '152900000000'
        // }
      ],
      sel_val1: '',
      sel_val2: '',
      sel_val3: '',
      sel_val4: '',
      showBackBtn: false, // 是否展示返回按钮（只有从统计跳转过来 才展示返回按钮）
      tableHeight: null
    }
  },
  methods: {
    getDeptNameChange(val) {
      this.ajInfo.noticeOrgId = val
      if (val) {
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          if (dept.id === val) {
            this.ajInfo.noticeOrgName = dept.name
            break
          }
        }
      } else {
        this.ajInfo.noticeOrgName = ''
      }
    },
    tingDepChange(val) {
      this.cityCode = ''
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
      if (val && val.length > 0) {
        const depcode = val[0]
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          // if (dept.id === v) {
          //   depcode = dept.depCode
          //   // break
          // }
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
      } else {
        this.qiOrgCode = null
        this.selectCurShiDep = { name: '' }
      }
      this.cityCode = ''
    },
    qiDepChange(val) {
      if (val) {
        for (let i = 0; i < this.qiDep.length; i++) {
          const dept = this.qiDep[i]
          if (dept.id === val) {
            this.selectCurQiDep = dept
            break
          }
        }
      } else {
        this.selectCurQiDep = { name: '' }
      }
    },
    qsStatusChange(val) {
      this.filters.status = ''
      this.filters.noticeLx = ''
      if (val) {
        if (val === '1') {
          this.filters.status = 3
        }
        if (val === '2') {
          this.filters.status = 5
        }
        if (val === '3') {
          this.filters.status = 9
          this.filters.noticeLx = 1
        }
        if (val === '4') {
          this.filters.status = 9
          this.filters.noticeLx = 2
        }
        if (val === '5') {
          this.filters.status = 10
        }
      }
    },
    getResonFormat(row) {
      if (row.revoke_reason) {
        return row.revoke_reason
      } else {
        return ' '
      }
    },
    getJYAQFormat(row) {
      if (row.JYAQ) {
        return row.JYAQ
      } else {
        return ' '
      }
    },
    getStatusName(row) {
      if (row.status === '3') {
        return '待认领'
      } else if (row.status === '5') {
        return '已认领'
      } else if (row.status === '9') {
        return '已指定'
      } else if (row.status === '10') {
        return '已撤销'
      }
      return row.status
    },
    zdgxSave(type, formName) {
      this.ajInfo.status = '3'
      this.ajInfo.businessTable = 'aj_jbxx_etl'
      this.ajInfo.businessProperty = 'AJBH'
      this.ajInfo.businessValue = this.ajInfo.ajbh
      this.ajInfo.businessType = '2'
      this.ajInfo.userId = this.curUser.id
      this.ajInfo.userName = this.curUser.realName
      this.ajInfo.noticeType = type
      // console.info(formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addAJJBXXSYHZDGX(this.ajInfo).then((response) => {
            if (response.success === true) {
              this.sucReturn(type)
            } else {
              this.btnLoading = false
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    sucReturn(type) {
      let msg = '提交成功'
      if (type === 1) {
        msg = '指定成功'
        this.dialogXFVisible = false
      }
      if (type === 2) {
        msg = '转发成功'
        this.dialogSBVisible = false
      }
      if (type === 3) {
        msg = '恢复成功'
        this.dialogRecoverVisible = false
      }
      this.btnLoading = false
      this.$message({
        message: msg, type: 'success'
      })
      this.getCase(true)
    },
    handleClick(tab, event) { },
    handleZDGX(type, row, formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      this.noticeOrgId = ''
      this.ajInfo.id = row.id
      this.ajInfo.ajbh = row.AJBH
      if (type === 0) {
        this.dialogXFVisible = true
      }
      if (type === 1) {
        this.dialogSBVisible = true
      }
      if (type === 2) {
        this.dialogRevokeVisible = true
      }
      if (type === 3) {
        this.dialogRecoverVisible = true
      }
    },
    handleAJSIGN(ajbh) {
      this.dialogLogVisible = true
      this.ajLogList = []
      this.logListLoading = true
      this.$query('ajsignlist', { ajbh: ajbh }).then(response => {
        this.logListLoading = false
        const data = response.data
        for (let i = 0; i < data.length; i++) {
          const obj = data[i]
          let str = ''
          if (obj.status === '3') {
            str = '待认领'
          }
          if (obj.status === '5') {
            str = '案件认领'
          }
          if (obj.status === '9') {
            if (obj.notice_lx === 1) {
              str = '案件下发'
            }
            if (obj.notice_lx === 2) {
              str = '案件转发'
            }
            if (obj.notice_lx === 3) {
              str = '恢复案件'
            }
          }
          if (obj.status === '10') {
            str = '撤销案件'
          }
          if (obj.status === '9') {
            let receive = ''
            if (i + 1 < data.length) {
              const next = data[i + 1]
              receive = next.notice_org_name
            }
            this.ajLogList.push({
              time: obj.sign_time,
              optStr: str,
              optOrg: obj.notice_org_name,
              optPerson: obj.sign_user_name,
              receiveDept: receive,
              revokeReason: obj.revoke_reason
            })
          } else {
            this.ajLogList.push({
              time: obj.sign_time,
              optStr: str,
              optOrg: obj.notice_org_name,
              optPerson: obj.sign_user_name,
              receiveDept: '',
              revokeReason: obj.revoke_reason
            })
          }
        }
      }).catch(() => {
        this.logListLoading = false
      })
    },
    revokeSave() {
      this.$refs['ajcxForm'].validate(valid => {
        if (valid) {
          this.cxLoading = true
          const b = JSON.parse(getUserInfo())
          const para = {
            id: this.ajInfo.id,
            status: '10',
            userId: b.id,
            revokeReason: this.ajInfo.revokeReason
          }
          editAJJBXXSYH(para).then((response) => {
            if (response.code === '000000') {
              this.cxLoading = false
              this.$message({
                message: '撤销案件成功',
                type: 'success'
              })
              this.dialogRevokeVisible = false
              this.getCase(true)
            } else {
              this.cxLoading = false
            }
          }).catch(() => {
            this.cxLoading = false
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getCase(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getCase(false, true)
    },
    getCase(flag, hand) {
      this.page = flag ? 1 : this.page
      const para = JSON.parse(JSON.stringify(this.filters))
      para.slsj = '' // 参数的受理时间置为空，分别用startTime endTime表示
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (this.filters.dType === '') {
        if (this.filters.rlStartTime === '' && this.filters.rlEndTime) { // 开始时间为空,结束时间不为空
          this.$message({
            message: '开始时间不能为空', type: 'error'
          })
          return false
        } else if (this.filters.rlStartTime && this.filters.rlEndTime === '') { // 选择了开始时间,结束时间为空
          this.$message({
            message: '结束时间不能为空', type: 'error'
          })
          return false
        } else if (this.filters.rlStartTime && this.filters.rlEndTime) { // 开始时间和结束时间均不为空
          if (new Date(this.filters.rlStartTime).getTime() > new Date(this.filters.rlEndTime).getTime()) {
            this.$message({
              message: '结束时间不能小于开始时间', type: 'error'
            })
            return false
          }
        }
      }
      if (this.qiOrgCode) {
        this.cityCode = this.qiOrgCode
      } else {
        if (this.shiOrgCode && this.shiOrgCode.length > 0) {
          if (this.shiOrgCode.length > 1) {
            this.cityCode = this.shiOrgCode[this.shiOrgCode.length - 1]
          } else {
            this.cityCode = this.shiOrgCode[0]
          }
        } else {
          if (this.tingOrgCode && this.tingOrgCode.length > 0) {
            if (this.tingOrgCode.length > 1) {
              this.cityCode = this.tingOrgCode[this.tingOrgCode.length - 1]
            } else {
              this.cityCode = this.tingOrgCode[0]
            }
          }
        }
      }
      if (this.filters.slsj && this.filters.slsj.length > 0) {
        para.startTime = this.filters.slsj[0]
        para.endTime = this.filters.slsj[1]
      } else {
        para.startTime = ''
        para.endTime = ''
      }
      para.cityCode = this.cityCode
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      getAJJBXXETLRLPage(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        this.cases = data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.filters.dType = '' // 认领时间类型清空
      this.tingOrgCode = [] // 厅
      this.shiOrgCode = [] // 市
      this.qiOrgCode = '' // 旗
      this.filters.slsj = []
      this.qsStatusChange('') // 认领状态设置为空
      this.qsStatus = '' // 认领状态设置为空
      this.initList(true)
      // this.getCase(true)
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detail/' + row.id })
      if (row.status === '5' || row.status === '已认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, isRl: '1' } // 展示申请督办等按钮
        })
      } else if (row.status === '3' || row.status === '待认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, interfaceType: 'etl', isRl: '0', rlId: row.id } // 展示 待认领按钮
        })
      } else {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
        })
      }
    },
    initList(hand) {
      this.depLevel = getDeptLevel(this.curDept.depCode)
      if (this.depLevel === 1) {
        this.getTingTree()
      } else if (this.depLevel === 2) {
        this.getShiArray()
        if (this.shiOrgCode.length === 0) {
          this.shiOrgCode = [this.curDept.depCode.substring(0, 4), this.curDept.depCode]
        }
        this.shiDepChange(this.shiOrgCode)
      } else if (this.depLevel === 3) {
        this.qiDep = ajrlListDepts(getSessionDeptSelect(), this.curDept.depCode)
        this.qiOrgCode = this.curDept.depCode
        this.qiDepChange(this.qiOrgCode)
      }
      this.deptList = getAjrlDept(getSessionDeptSelect(), this.curDept.depCode)
      this.parentDeptList = getAjrlParentDept(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
      this.tjnsxjDeptList = getAjrlNSXJ(getSessionDeptSelect(), this.curDept.depCode)
      const s1 = this.curDept.depCode.substring(0, 6)
      if (s1 === '610000') {
        this.upBtn = false
      }
      const s2 = this.curDept.depCode.substring(4, 6)
      if (s2 !== '00') {
        this.downBtn = false
      }
      if (hand) {
        this.getCase(true, true)
      } else {
        this.getCase(true)
      }
    },
    getTingTree() {
      const tings = ajrlListDepts(getSessionDeptSelect(), this.curDept.depCode)
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
    getShiArray() {
      this.shiDep = []
      const shiDeptsArray = []
      const reObj = {}
      for (let i = 0; i < this.selectDepList.length; i++) {
        const dept = this.selectDepList[i]
        if (dept.parentCode === '610000530000') {
          this.getShiTree(dept, reObj, shiDeptsArray)
        }
      }
      const array = getTree(shiDeptsArray.concat(this.cityList))
      if (this.depLevel === 2) {
        for (let i = 0; i < array.length; i++) {
          const dept = array[i]
          if (dept.value === this.curDept.depCode.substring(0, 4)) {
            this.shiDep.push(dept)
            break
          }
        }
      } else {
        this.shiDep = array
      }
    },
    getShiTree(dept, reObj, shiDeptsArray) {
      dept.value = dept.depCode
      if (dept.depCode.substring(0, 6) === '610600') {
        if (dept.depCode.substring(8, 12) === '0000') {
          // 支队
          if (reObj[dept.depCode.substring(0, 6)]) {
            // 已设置
            dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
            dept.parentCode = dept.depCode.substring(0, 4) + '00000000'
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
    queryByType(val) { // 查询类型change事件
      this.filters.rlStartTime = ''
      this.filters.rlEndTime = ''
    },
    startDateChange(val) { // 开始时间change事件
      if (val) {
        this.filters.dType = ''
        this.endDateDisabled = false
      } else {
        this.endDateDisabled = true
      }
    },
    endDateChange(val) { // 结束时间change事件

    },
    backStatistical() {
      // if (this.carryParam.ajbh) { // 返回案件档案
      //   this.$router.back(-1)
      // } else { // 返回统计
      //   var param = {
      //     yearDate: this.carryParam.yearDate || '', // 筛选框的值
      //     quarterDate: this.carryParam.quarterDate || '',
      //     monthDate: this.carryParam.monthDate || '',
      //     queryType: this.carryParam.queryType || '',
      //     startTime: this.carryParam.startTime || '',
      //     endTime: this.carryParam.endTime || ''
      //   }
      //   this.$gotoid('/caseManage/caseClaimStatistical', JSON.stringify(param))
      // }
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else { // 返回统计
        var param = {
          yearDate: this.carryParam.yearDate || '', // 筛选框的值
          quarterDate: this.carryParam.quarterDate || '',
          monthDate: this.carryParam.monthDate || '',
          queryType: this.carryParam.queryType || '',
          startTime: this.carryParam.startTime || '',
          endTime: this.carryParam.endTime || ''
        }
        this.$gotoid('/caseManage/caseClaimStatistical', JSON.stringify(param))
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/ajrl')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(getUserInfo())
    this.filters.curDeptCode = this.curDept.depCode
    if (sessionStorage.getItem(this.$route.path)) {
      this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      // if (this.carryParam.origin === 'statistical') {
      this.showBackBtn = true // 显示返回按钮
      // }
      if (this.carryParam.type) {
        this.qsStatus = this.carryParam.type
        this.qsStatusChange(this.qsStatus)
      }
      if (this.carryParam.deptCode.substring(0, 6) === '610000') {
        if (this.carryParam.deptLevel === 'first') {
          this.tingOrgCode = [this.carryParam.deptCode]
        } else {
          this.tingOrgCode = [this.carryParam.curFirstLevelCode, this.carryParam.deptCode]
        }
      } else {
        if (this.carryParam.deptLevel === 'first') {
          this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4)]
        } else {
          this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4), this.carryParam.deptCode]
          if (this.carryParam.deptCode.substring(4, 6) !== '00') {
            this.qiOrgCode = this.carryParam.deptCode
          }
        }
      }
      this.shiDepChange(this.shiOrgCode)
      if (this.carryParam.filtStartTime) { // 开始时间
        this.filters.rlStartTime = this.carryParam.filtStartTime
      }
      if (this.carryParam.filtEndTime) { // 结束时间
        this.filters.rlEndTime = this.carryParam.filtEndTime
      }
      if (this.carryParam.queryType) { // 认领时间筛选类型
        this.filters.dType = this.carryParam.queryType
      }
      // if (this.carryParam.ajbh) { // 案件档案跳转过来的
      //   this.filters.AJBH = this.carryParam.ajbh
      // }
    } else if (this.$route.query.ajbh) { // 案件档案跳转过来的
      this.filters.AJBH = this.$route.query.ajbh
      this.showBackBtn = true // 显示返回按钮
    } else {
      this.showBackBtn = false // 默认隐藏返回按钮
    }
    this.initList()
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" >
.ajrlList {
  .tooltipShow {
    opacity: 1;
  }
  .tooltipHide {
    opacity: 0;
  }
  .el-cascader--small {
    font-size: 16px;
  }
  .el-button + .el-button {
    margin-left: 0px;
    margin-bottom: 4px;
  }
}
</style>

