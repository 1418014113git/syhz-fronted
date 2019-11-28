<template>
  <section  class="ajrlList">
    <!--工具条-->
    <!-- <el-button type="primary" size="small"  style="float:right;" v-on:click="backStatistical()" v-if="showBackBtn">返回</el-button> -->
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" v-if="showBackBtn" @click="backStatistical">   <!--返回-->
    </el-col>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="100px">

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
        <el-form-item label="行政区划" prop="examStatus">
        <el-cascader
          :options="xzqhOptions"
          v-model="filters.area"
          :props="props"
          change-on-select
          @change="handleAreaChange"
          :show-all-levels="false"
           placeholder="全部"
          :disabled="curDept.depType>2">
        </el-cascader>
      </el-form-item>
      <el-form-item label="认领单位" prop="examStatus">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="filters.department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            clearable placeholder="全部"
            :disabled="curDept.depType>3">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
        <el-form-item label="案件名称" prop="AJMC">
          <el-input v-model="filters.AJMC" placeholder="请输入案件名称" clearable maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="案件编号" prop="AJBH">
          <el-input v-model="filters.AJBH"  placeholder="请输入案件编号" clearable maxlength="30"></el-input>
        </el-form-item>
         <el-form-item label="案件状态" prop="ajzt">
          <el-select :clearable="true" v-model="filters.ajzt" placeholder="全部" filterable @change="ajztChange">
            <el-option v-for="item in ajztData" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="立案单位" prop="ladw">
          <el-input v-model="filters.ladw"  placeholder="立案单位" clearable maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="立案日期" prop="laDate">
          <el-date-picker
            v-model="filters.larqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="laStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangeLa">
          </el-date-picker>
          </el-form-item>
        <el-form-item label="至">
           <el-date-picker
            v-model="filters.larqEnd"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChangeLa"
            :disabled="endDateDisabledLa">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="破案日期" prop="paDate">
          <el-date-picker
            v-model="filters.parqStart"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="paStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChangePa">
          </el-date-picker>
        </el-form-item>
          <el-form-item label="至">
           <el-date-picker
            v-model="filters.parqEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="paEndPickerOptions"
            placeholder="请选择结束时间"
             @change="endDateChangePa"
            :disabled="endDateDisabledPa">
          </el-date-picker>
        </el-form-item>


         <el-form-item label="认领日期" prop="startTime">
          <el-date-picker
            v-model="filters.rlStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="rlStartPickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChange">
          </el-date-picker>
             </el-form-item>
          <el-form-item label="至">
           <el-date-picker
            v-model="filters.rlEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="rlEndPickerOptions"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="endDateDisabled">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="案件类型" prop="fllb">
                  <el-tooltip effect="dark" :content="selectCurfllb.name" placement="top-start" :popper-class="(selectCurfllb.name&&selectCurfllb.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader v-model="filters.fllb" change-on-select filterable :options="fllbList" @change="handleChange" clearable></el-cascader>
                  </el-tooltip>
        </el-form-item>

                <el-form-item label="案件类别" prop="ajlb">
          <el-select :clearable="true" v-model="filters.ajlb" size="small" placeholder="全部" filterable>
            <el-option v-for="item in ajlbData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件罪名" prop="ajzm">
          <el-select :clearable="true" v-model="filters.ajzm" size="small" placeholder="全部" filterable>
            <el-option v-for="item in ajzmData" :key="item.code" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="时间筛选">
          <el-select v-model="filters.dType" filterable clearable placeholder="全部" @change="queryByType">
            <el-option label="本年" value="year"></el-option>
            <el-option label="本季" value="quarter"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="本周" value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认领状态" prop="qsStatus">
          <el-select :clearable="true" v-model="qsStatus" size="small" placeholder="全部" @change="qsStatusChange">
            <el-option v-for="item in options1" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--$isViewBtn('100701') && -->
          <el-button type="primary" size="small" v-if="queryBtn"  v-on:click="getCase(true,true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-on:click="reset()">重置</el-button>
          <!-- <el-button type="primary" size="small"  v-on:click="backStatistical()" v-if="showBackBtn">返回</el-button> -->
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->

    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column label="案件名称" min-width="10%" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
        <el-table-column label="案件编号" min-width="7%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="larq" label="立案日期" min-width="8%">
            <template slot-scope="scope">
              {{$handlerDateTime(scope.row.larq)}}
          </template>
      </el-table-column>
         <el-table-column prop="ladwName" label="立案单位" min-width="8%">
      </el-table-column>
       <el-table-column prop="parq" label="破案日期" min-width="8%" >
           <template slot-scope="scope">
              {{$handlerDateTime(scope.row.parq)}}
          </template>
      </el-table-column>
        <el-table-column prop="ajztName" label="案件状态" min-width="8%">
      </el-table-column>

      <el-table-column prop="rlTime" label="认领日期" min-width="8%" >
            <template slot-scope="scope">
              {{scope.row.rlTime | formatDate}}
          </template>

      </el-table-column>

       <el-table-column prop="noticeOrgName" label="认领单位" min-width="8%" >

      </el-table-column>
         <el-table-column prop="status"  label="认领状态" width="100" > <!--:formatter="getStatusName"-->
        <template slot-scope="scope">
          <el-tag  :type="scope.row.status==3?'':(scope.row.status==5?'success':(scope.row.status==9?'warning':'danger'))">{{getStatusName(scope.row)}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column  label="操作事由" prop="revoke_reason" :formatter="getResonFormat"  :show-overflow-tooltip="true" width="120" >
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain v-if="scope.row.status!=3 && $isViewBtn('100703')"  @click="handleAjDetail(scope.$index, scope.row)"> 案件详情</el-button>
          <el-button size="small" type="primary" plain v-if="scope.row.status==3 && hasAccess(scope.row) && $isViewBtn('100704')"  :disabled="scope.row.status!=3" @click="handleAjDetail(scope.$index, scope.row)"> 案件认领</el-button>
          <el-button size="small" type="warning" plain v-if="scope.row.status==3 && hasAccess(scope.row) && $isViewBtn('100705') && downBtn"  @click="handleZDGX(0, scope.row, 'ajxfForm')">下发案件</el-button>
          <el-button size="small" type="warning" plain v-if="scope.row.status==3 && hasAccess(scope.row) && $isViewBtn('100705') && upBtn"  @click="handleZDGX(1, scope.row, 'ajzfForm')">转发案件</el-button>
          <el-button size="small" type="danger"  plain v-if="scope.row.status==3  && hasAccess(scope.row) && $isViewBtn('100706')"  @click="handleZDGX(2, scope.row, 'ajcxForm')">撤销案件</el-button>
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
        <el-form-item label="下发单位：" prop="noticeOrgCode">
          <el-select v-model="noticeOrgCode" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="(item, index) in deptList" :key="'xf'+index" :label="item.name" :value="item.depCode"></el-option>
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
        <el-form-item label="转发单位：" prop="noticeOrgCode">
          <el-select v-model="noticeOrgCode" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="item in parentDeptList" :key="'zf'+item.id" :label="item.name" :value="item.depCode"></el-option>
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
      <el-form class="ajInfoForm" style="width: 85%; margin:0 auto" :rules="rules4" :model="ajInfo" ref="ajhfForm" size="small" label-width="120px"
               @submit.prevent="onSubmit">
        <el-form-item label="指定单位：" prop="noticeOrgCode">
          <el-select v-model="noticeOrgCode" placeholder="请选择" style="width:100%" @change="getDeptNameChange">
            <el-option v-for="item in tjnsxjDeptList" :key="'zf'+item.id" :label="item.name" :value="item.depCode"></el-option>
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
// getDeptLevel, ajrlListDepts,
import { getAjrlDept, getAjrlParentDept, getAjrlNSXJ } from '@/api/dept'
import { getUserInfo } from '@/utils/auth'
import {  getSYHFLLBList
  // , getAJLBText
} from '@/utils/codetotext'
import { parseTime } from '@/utils/index'
import { getTree } from '@/api/dept'

export default {
  data() {
    return {
      // tingOrgCode: [],
      // shiOrgCode: [],
      // qiOrgCode: null,
      // tingDep: [],
      // shiDep: [],
      // qiDep: [],
      // cityCode: '',
      // deptProps: {
      //   checkStrictly: true,
      //   label: 'name',
      //   value: 'id'
      // },
      filters: {
        AJMC: '', // 案件名称
        AJBH: '', // 案件编号
        dType: '', // 时间筛选
        rlStartTime: '', // 认领日期
        rlEndTime: '',
        noticeLx: '', // 通知类型，下发，转发，撤销
        larqStart: '', // 立案日期
        larqEnd: '',
        parqStart: '', // 破案日期
        parqEnd: '',
        // ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [], // 分类类别
        departType: '',
        ajztName: '', // 案件状态名称
        ladw: '', // 立案单位，
        department: [], // 部门信息
        area: [], // 地区信息
        status: ''
      },
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      curDept: {},
      qsStatus: null,
      ajztData: [], // 案件状态
      ajlbData: [], // 案件类别
      ajzmData: [], // 案件罪名
      fllbList: getSYHFLLBList(), // 案件分类类别
      curAjztName: '', // 当前选择的案件状态
      xzqhOptions: [], // 行政区划数据
      deptOptions: [],
      queryBtn: true,
      curUser: {},
      ajInfo: {},
      noticeOrgCode: '',
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
      pcsParentDept: {},
      endDateDisabledLa: true,
      endDateDisabledPa: true,
      endDateDisabled: true, // 认领结束时间选择框禁用
      btnLoading: false, // 下发、转发、恢复loading
      cxLoading: false, // 撤销loading
      selectCurDep: {}, // 当前选择的机构
      selectCurfllb: {}, // 當前選擇的案件類型
      rlStartPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      // 认领开始时间的picker限制
      rlEndPickerOptions: {}, // 认领结束时间的picker限制
      laStartPickerOptions: { // 立案开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      laEndPickerOptions: {}, // 立案结束时间的picker限制
      paStartPickerOptions: { // 破案开始时间的picker限制
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      paEndPickerOptions: {}, // 破案结束时间的picker限制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        noticeOrgCode: [{ required: true, message: '请选择单位', trigger: 'change' }]
      },
      rules2: {
        revokeReason: [
          { required: true, message: '请输入撤销原因', trigger: 'blur' },
          { max: 200, message: '原因不能超过200字', trigger: 'blur' }
        ]
      },
      rules3: {
        noticeOrgCode: [{ required: true, message: '请选择单位', trigger: 'change' }],
        revokeReason: [
          { required: true, message: '请输入转发原因', trigger: 'blur' },
          { max: 200, message: '原因不能超过200字', trigger: 'blur' }
        ]
      },
      rules4: {
        noticeOrgCode: [{ required: true, message: '请选择单位', trigger: 'change' }],
        revokeReason: [
          { required: true, message: '请输入恢复原因', trigger: 'blur' },
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
  filters: {
    formatDate(time) {
      if (time) {
        return parseTime(time, '{y}-{m}-{d}')
      } else {
        return ''
      }
    }
  },
  methods: {
    getDeptNameChange(val) {
      this.ajInfo.noticeOrgCode = val
      if (val) {
        for (let i = 0; i < this.selectDepList.length; i++) {
          const dept = this.selectDepList[i]
          if (dept.depCode === val) {
            this.ajInfo.noticeOrgName = dept.name
            break
          }
        }
      } else {
        this.ajInfo.noticeOrgName = ''
      }
    },
    handleDeptChange(val) {
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.selectCurDep = { name: '' }
      }
    },
    handleAreaChange(val) {
      // if(val.length < 3)

      if (val.length === 2 && val[0] === '610000' && val[1] === '610403') {

        // // 调接口查 派出所的上级
        // this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        //   if (response.code === '000000') {
        //     this.pcsParentDept = response.data
        //   }
        // }).catch(() => {
        //   this.caseLoading = false
        // })
        // 当前deptOptions[{ 'id': 1041, 'name': '陕西省西安市公安局高陵分局治安大队', 'depCode': '610126430000', 'parentCode': '610100460000', 'depType': '3' }]
      }

      if (val.length === 1 && this.curDept.depType === '2') {
        this.queryBtn = false
        this.$message({
          message: '请至少选择到市',
          type: 'error'
        })
        return false
      } else {
        this.queryBtn = true
      }
      this.filters.department = []
      if (val.length > 0) {
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        var param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              var arr = []
              const data = response.data
              for (let i = 0; i < data.length; i++) {
                const obj = data[i]
                if (obj.depType !== '4') { // 不展示派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
              }
              this.deptOptions = getTree(arr) // 机构
              // alert('当前deptOptions' + JSON.stringify(this.deptOptions))
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },

    // tingDepChange(val) {
    //   this.cityCode = ''
    //   this.shiOrgCode = []
    //   if (val && val.length > 2) {
    //     for (let i = 0; i < this.tingDep.length; i++) {
    //       const dept = this.tingDep[i]
    //       if (dept.depCode === val[val.length - 1]) {
    //         this.selectCurTingDep = dept
    //         break
    //       }
    //     }
    //   } else {
    //     this.shiOrgCode = []
    //     this.selectCurTingDep = { name: '' }
    //   }
    // },
    handleChange(val) {
      // // 案件类型change
      // if (val.length > 0) {
      //   var fllbs = this.fllbList
      //   for (let i = 0; i < fllbs.length; i++) {
      //     const fllb = fllbs[i]
      //     console.log(i + '' + JSON.stringify(fllb))
      //   }
      // } else {
      //   this.selectCurDep = { name: '' }
      // }
    },
    // shiDepChange(val) {
    //   this.qiDep = []
    //   if (val && val.length > 0) {
    //     const depcode = val[0]
    //     for (let i = 0; i < this.selectDepList.length; i++) {
    //       const dept = this.selectDepList[i]
    //       // if (dept.id === v) {
    //       //   depcode = dept.depCode
    //       //   // break
    //       // }
    //       if (depcode.length > 4 && dept.id === val[val.length - 1]) { // hover展示市的汉字
    //         this.selectCurShiDep = dept
    //         break
    //       }
    //     }
    //     for (let i = 0; i < this.selectDepList.length; i++) {
    //       const dept = this.selectDepList[i]
    //       if (dept.parentCode.substring(0, 4) === depcode && dept.depCode.substring(0, 6) !== depcode + '00' && dept.depCode.substring(4, 6) !== '00') {
    //         this.qiDep.push(dept)
    //       }
    //     }
    //   } else {
    //     this.qiOrgCode = null
    //     this.selectCurShiDep = { name: '' }
    //   }
    //   this.cityCode = ''
    // },
    // qiDepChange(val) {
    //   if (val) {
    //     for (let i = 0; i < this.qiDep.length; i++) {
    //       const dept = this.qiDep[i]
    //       if (dept.id === val) {
    //         this.selectCurQiDep = dept
    //         break
    //       }
    //     }
    //   } else {
    //     this.selectCurQiDep = { name: '' }
    //   }
    // },
    // 认领状态
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

    initAjzt() { // 初始化案件状态数据源
      this.$query('tcpcode', { codeLx: 'ajzt' }).then((response) => {
        if (response.data && response.data.length > 0) {
          const temp = {}
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            temp[element.codeName] = element.code
          }
          const arr = []
          for (const key in temp) {
            arr.push({ code: temp[key], codeName: key })
          }
          this.ajztData = arr
        }
      }).catch(() => {
      })
    },
    initAjlb() { // 初始化案件类别
      this.$query('ajlb', {}).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbData = response.data
        }
      }).catch(() => {
      })
    },
    initAjzm() { // 案件罪名
      this.$query('ajzm', {}).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajzmData = response.data
        }
      }).catch(() => {
      })
    },
    ajztChange(val) { // 案件状态change事件
      if (val) {
        var result = ''
        this.ajztData.forEach(item => {
          if (item.code === val) {
            result = item.codeName
          }
        })
        this.filters.ajztName = result
        return result
      } else {
        this.filters.ajztName = ''
        return ''
      }
    },
    getResonFormat(row) {
      if (row.revokeReason) {
        return row.revokeReason
      } else {
        return ''
      }
    },
    // getJYAQFormat(row) {
    //   if (row.JYAQ) {
    //     return row.JYAQ
    //   } else {
    //     return ''
    //   }
    // },
    getStatusName(row) {
      if (row.status === '3') {
        return '待认领'
      } else if (row.status === '5') {
        return '已认领'
      } else if (row.status === '9') {
        if (row.notice_lx === 2) {
          return '转发案件'
        } if (row.notice_lx === 1) {
          return '下发案件'
        } if (row.notice_lx === 3) {
          return '恢复案件'
        }
      } else if (row.status === '10') {
        return '撤销案件'
      }
      return row.status
    },

    // getajztName(row) {
    //   if (row.ajzt === '001') {
    //     return '未受理'
    //   } else if (row.ajzt === '101') {
    //     return '受理'
    //   } else if (row.ajzt === '102') {
    //     return '立案'
    //   } else if (row.ajzt === '103') {
    //     return '不予立案'
    //   } else if (row.ajzt === '104') {
    //     return '破案'
    //   } else if (row.ajzt === '105') {
    //     return '销案'
    //   } else if (row.ajzt === '106') {
    //     return '转治安案件'
    //   } else if (row.ajzt === '107') {
    //     return '结案'
    //   } else if (row.ajzt === '108') {
    //     return '归档'
    //   } else if (row.ajzt === '109') {
    //     return '移送'
    //   } else if (row.ajzt === '202') {
    //     return '调查取证'
    //   } else if (row.ajzt === '203') {
    //     return '不予处理'
    //   } else if (row.ajzt === '204') {
    //     return '终止调查'
    //   } else if (row.ajzt === '205') {
    //     return '转刑事案件'
    //   } else if (row.ajzt === '208') {
    //     return '调解'
    //   } else if (row.ajzt === '209') {
    //     return '处罚'
    //   } else if (row.ajzt === '300') {
    //     return '复议'
    //   } else if (row.ajzt === '301') {
    //     return '诉讼'
    //   } else if (row.ajzt === '302') {
    //     return '撤销行政处罚'
    //   } else if (row.ajzt === '303') {
    //     return '当场处罚'
    //   } else if (row.ajzt === '304') {
    //     return '简易调解'
    //   }
    //   return row.ajzt
    // },
    zdgxSave(type, formName) {
      this.ajInfo.status = '3'
      this.ajInfo.businessTable = 'aj_jbxx_etl'
      this.ajInfo.businessProperty = 'AJBH'
      this.ajInfo.businessValue = this.ajInfo.ajbh
      this.ajInfo.businessType = '2'
      this.ajInfo.userId = this.curUser.id
      this.ajInfo.userName = this.curUser.realName
      this.ajInfo.noticeType = type
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
      this.noticeOrgCode = ''
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
    startDateChangePa(val) { // 破案开始时间change事件
      if (val) {
        this.endDateDisabledPa = false
        this.paEndPickerOptions = this.$pickerOptionChange(val, this.paEndPickerOptions, 'end')
      } else {
        this.filters.parqStart = ''
        this.filters.parqEnd = ''
        this.endDateDisabledPa = true
        this.paStartPickerOptions = this.$pickerOptionChange('', this.paStartPickerOptions, 'default')
      }
    },
    endDateChangePa(val) { // 破案结束时间change事件
      if (val) {
        this.paStartPickerOptions = this.$pickerOptionChange(val, this.paStartPickerOptions, 'start')
      } else {
        this.paStartPickerOptions = this.$pickerOptionChange('', this.paStartPickerOptions, 'default')
      }
    },

    startDateChangeLa(val) { // 立案开始时间change事件
      if (val) {
        this.endDateDisabledLa = false
        this.laEndPickerOptions = this.$pickerOptionChange(val, this.laEndPickerOptions, 'end')
      } else {
        this.filters.larqStart = ''
        this.filters.larqEnd = ''
        this.endDateDisabledLa = true
        this.laStartPickerOptions = this.$pickerOptionChange('', this.laStartPickerOptions, 'default')
      }
    },
    endDateChangeLa(val) { // 立案结束时间change事件
      if (val) {
        this.laStartPickerOptions = this.$pickerOptionChange(val, this.laStartPickerOptions, 'start')
      } else {
        this.laStartPickerOptions = this.$pickerOptionChange('', this.laStartPickerOptions, 'default')
      }
    },
    getCase(flag, hand) {
      this.page = flag ? 1 : this.page
      var para = JSON.parse(JSON.stringify(this.filters))

      if (this.filters.area.length === 1) {
        para.provinceCode = this.filters.area[0]
      }
      if (this.filters.area.length === 2) {
        para.provinceCode = this.filters.area[0]
        para.cityCode = this.filters.area[1]
      }
      if (this.filters.area.length === 3) {
        para.provinceCode = this.filters.area[0]
        para.cityCode = this.filters.area[1]
        para.reginCode = this.filters.area[2]
      }

      para.department = ''
      para.slsj = '' // 参数的受理时间置为空，分别用startTime endTime表示
      para.pageNum = this.page
      para.pageSize = this.pageSize
      para.area = ''
      if (this.filters.department) {
        para.curDeptCode = this.filters.department[this.filters.department.length - 1]
      } else {
        para.curDeptCode = this.curDept.depCode // 所属部门code
      }

      // para.departType = this.curDept.depType === '4' ? this.pcsParentDept.depType : this.curDept.depType // 当前部门类型

      if (this.curDept.depType === '4') {
        para.departType = this.pcsParentDept.depType
      } else {
        para.departType = this.curDept.depType
      }

      // para.curDeptCode = this.filters.department[this.filters.department.length - 1] // 部门code
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
      // if (this.qiOrgCode) {
      //   this.cityCode = this.qiOrgCode
      // } else {
      //   if (this.shiOrgCode && this.shiOrgCode.length > 0) {
      //     if (this.shiOrgCode.length > 1) {
      //       this.cityCode = this.shiOrgCode[this.shiOrgCode.length - 1]
      //     } else {
      //       this.cityCode = this.shiOrgCode[0]
      //     }
      //   } else {
      //     if (this.tingOrgCode && this.tingOrgCode.length > 0) {
      //       if (this.tingOrgCode.length > 1) {
      //         this.cityCode = this.tingOrgCode[this.tingOrgCode.length - 1]
      //       } else {
      //         this.cityCode = this.tingOrgCode[0]
      //       }
      //     }
      //   }
      // }
      // if (this.filters.slsj && this.filters.slsj.length > 0) {
      //   para.startTime = this.filters.slsj[0]
      //   para.endTime = this.filters.slsj[1]
      // } else {
      //   para.startTime = ''
      //   para.endTime = ''
      // }
      // para.cityCode = this.cityCode
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      //  para.cityCode = this.cityCode
      // para.ajztName = this.curAjztName // 案件状态（转换后的汉字）
      if (this.filters.fllb.length > 0) {
        para.fllb = this.filters.fllb.join(',')
      } else {
        para.fllb = ''
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
      this.filters = {
        AJMC: '', // 案件名称
        AJBH: '', // 案件编号
        dType: '', // 时间筛选
        rlStartTime: '', // 认领日期
        rlEndTime: '',
        noticeLx: '', // 通知类型，下发，转发，撤销
        larqStart: '', // 立案日期
        larqEnd: '',
        parqStart: '', // 破案日期
        parqEnd: '',
        // ajzt: '', // 案件状态
        ajlb: '', // 案件类别
        ajzm: '', // 案件罪名
        fllb: [], // 分类类别
        departType: '',
        ajztName: '', // 案件状态名称
        ladw: '', // 立案单位
        department: [],
        area: [],
        status: ''
      }
      this.qsStatusChange('')
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]

      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180

      this.curUser = JSON.parse(getUserInfo())
      // this.filters.curDeptCode = this.curDept.depCode
      // this.filters.departType = this.curDept.depType
      this.qsStatus = '' // 认领状态设置为空
      this.initList()
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detail/' + row.id })
      if (row.status === '5' || row.status === '已认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, rlDept: row.noticeOrgCode, isRl: '1' } // 展示申请督办等按钮
        })
      } else if (row.status === '3' || row.status === '待认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, interfaceType: 'etl', isRl: '0', rlId: row.id, rlDept: row.noticeOrgCode } // 展示 待认领按钮
        })
      } else {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.AJBH, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
        })
      }
    },
    hasAccess(row) {
      // 判断是否可以操作案件
      if (this.curDept.depType === '4') {
        if (this.pcsParentDept && this.pcsParentDept.departCode === row.noticeOrgCode) {
          return true
        } else {
          return false
        }
      } else {
        if (this.curDept.depCode === row.noticeOrgCode) {
          return true
        } else {
          return false
        }
      }
    },
    initList(hand) {
      // this.depLevel = getDeptLevel(this.curDept.depCode)
      // if (this.depLevel === 1) {
      //   //this.getTingTree()
      // } else if (this.depLevel === 2) {
      //   this.getShiArray()
      //   if (this.shiOrgCode.length === 0) {
      //     this.shiOrgCode = [this.curDept.depCode.substring(0, 4), this.curDept.depCode]
      //   }
      //   this.shiDepChange(this.shiOrgCode)
      // } else if (this.depLevel === 3) {
      //   this.qiDep = ajrlListDepts(getSessionDeptSelect(), this.curDept.depCode)
      //   this.qiOrgCode = this.curDept.depCode
      //   this.qiDepChange(this.qiOrgCode)
      // }

      var _this = this
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
            for (let index = 0; index < this.xzqhOptions[0].children.length; index++) {
              const element = this.xzqhOptions[0].children[index]
              if (element.cityCode === this.curDept.areaCode) {
                _this.xzqhOptions[0].children[index].disabled = false
              } else {
                _this.xzqhOptions[0].children[index].disabled = true
              }
            }
          } else if (this.curDept.depType === '3') { // 大队
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') { // 派出所
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.parentDepCode]
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.filters.area = currentArea

          // curDept.areaCode 610402

          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          if (this.curDept.depType === '-1') { // 省
            this.filters.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '1') { // 总队
            this.filters.department = [this.curDept.parentDepCode, this.curDept.depCode]
          } else if (this.curDept.depType === '2') { // 支队
            this.filters.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '3') { // 大队
            this.filters.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '4') { // 派出所
            this.filters.department = [this.curDept.parentDepCode] // 派出所当作上级处理
            // 调接口查 派出所的上级
            this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
              if (response.code === '000000') {
                this.pcsParentDept = response.data
              }
            }).catch(() => {
              this.caseLoading = false
            })
          }
          this.handleDeptChange(this.filters.department)

          // 可下发的单位
          this.deptList = getAjrlDept(getSessionDeptSelect(), this.curDept.depCode, this.curDept.depType)
          // 可转发
          if (this.curDept.parentDepCode === '611400390000') {
            // 杨凌区下的派出所 可转给总队
            this.parentDeptList = getAjrlParentDept(getSessionDeptSelect(), '610000530000', this.curDept.depCode, '2')
          } else if (this.curDept.depType === '4') {
            // 其他派出所 ，当大队处理， 可转给支队
            var dd = {}
            dd = getAjrlParentDept(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode, '3')

            if (dd) {
              this.parentDeptList = getAjrlParentDept(getSessionDeptSelect(), dd[0].parentCode, this.curDept.depCode, '3')
            }
          } else {
            // 可转发的单位
            this.parentDeptList = getAjrlParentDept(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode, this.curDept.depType)
          }

          // 同及和直属下级部门 恢复
          if (this.curDept.depType === '4') {
            // 是派出所 只能给自己所代表的部门
            this.tjnsxjDeptList = getAjrlNSXJ(getSessionDeptSelect(), this.curDept.parentDepCode, '4')
          } else if (this.curDept.depType === '3') {
            // 是大队 只能给自己
            this.tjnsxjDeptList = getAjrlNSXJ(getSessionDeptSelect(), this.curDept.depCode, '3')
          } else {
            // 给自己和直属下级
            this.tjnsxjDeptList = getAjrlNSXJ(getSessionDeptSelect(), this.curDept.depCode, this.curDept.depType)
          }

          const s1 = this.curDept.depCode.substring(0, 6)
          if (s1 === '610000') {
            // 不可转发
            this.upBtn = false
          }
          if (!this.deptList || this.deptList.length === 0) {
            // 没有大队 隐藏下发按钮
            this.downBtn = false
          }
          if (hand) {
            this.getCase(true, true)
          } else {
            this.getCase(true)
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    // getTingTree() {
    //   const tings = ajrlListDepts(getSessionDeptSelect(), this.curDept.depCode)
    //   const arrayTemp = [{
    //     value: '0000',
    //     label: '全省',
    //     depCode: '610000000000'
    //   }]
    //   for (let i = 0; i < tings.length; i++) {
    //     const dept = tings[i]
    //     dept.value = dept.depCode
    //     if (dept.depCode === '610000530000') {
    //       dept.label = '总队'
    //       dept.parentCode = ''
    //       arrayTemp.push(dept)
    //     }
    //     if (dept.depCode === '610000535300') {
    //       dept.label = '食品犯罪侦查支队'
    //       dept.parentCode = '610000530000'
    //       arrayTemp.push(dept)
    //     }
    //     if (dept.depCode === '610000535400') {
    //       dept.label = '药品犯罪侦查支队'
    //       dept.parentCode = '610000530000'
    //       arrayTemp.push(dept)
    //     }
    //     if (dept.depCode === '610000535500') {
    //       dept.label = '环境犯罪侦查支队'
    //       dept.parentCode = '610000530000'
    //       arrayTemp.push(dept)
    //     }
    //   }
    //   this.tingDep = getTree(arrayTemp)
    //   this.getShiArray()
    // },
    // getShiArray() {
    //   this.shiDep = []
    //   const shiDeptsArray = []
    //   const reObj = {}
    //   for (let i = 0; i < this.selectDepList.length; i++) {
    //     const dept = this.selectDepList[i]
    //     if (dept.parentCode === '610000530000') {
    //       this.getShiTree(dept, reObj, shiDeptsArray)
    //     }
    //   }
    //   const array = getTree(shiDeptsArray.concat(this.cityList))
    //   if (this.depLevel === 2) {
    //     for (let i = 0; i < array.length; i++) {
    //       const dept = array[i]
    //       if (dept.value === this.curDept.depCode.substring(0, 4)) {
    //         this.shiDep.push(dept)
    //         break
    //       }
    //     }
    //   } else {
    //     this.shiDep = array
    //   }
    // },
    // getShiTree(dept, reObj, shiDeptsArray) {
    //   dept.value = dept.depCode
    //   if (dept.depCode.substring(0, 6) === '610600') {
    //     if (dept.depCode.substring(8, 12) === '0000') {
    //       // 支队
    //       if (reObj[dept.depCode.substring(0, 6)]) {
    //         // 已设置
    //         dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
    //         dept.parentCode = dept.depCode.substring(0, 4) + '00000000'
    //         shiDeptsArray.push(dept)
    //         reObj[dept.depCode.substring(0, 6)].push(dept.depCode)
    //       } else {
    //         // 未设置
    //         dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
    //         dept.parentCode = dept.depCode.substring(0, 6) + '000000'
    //         shiDeptsArray.push(dept)
    //         reObj[dept.depCode.substring(0, 6)] = [dept.depCode]
    //       }
    //     } else {
    //       // 内设
    //       const arr = reObj[dept.depCode.substring(0, 6)]
    //       for (let j = 0; j < arr.length; j++) {
    //         dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
    //         dept.parentCode = arr[j]
    //         shiDeptsArray.push(dept)
    //       }
    //     }
    //   } else {
    //     if (dept.depCode.substring(8, 12) === '0000') {
    //       // 支队
    //       dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
    //       dept.parentCode = dept.depCode.substring(0, 4) + '00000000'
    //       shiDeptsArray.push(dept)
    //     } else {
    //       // 内设
    //       dept.label = dept.name.substring(dept.name.indexOf('公安局') + 3, dept.name.length)
    //       dept.parentCode = dept.depCode.substring(0, 8) + '0000'
    //       shiDeptsArray.push(dept)
    //     }
    //   }
    // },
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
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.$route.query.from === 'portal') {
      // 首页过来的查待认领
      this.qsStatusChange('1')
    }
    this.initAjlb()
    this.initAjzt()
    this.initAjzm()
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180

    this.curUser = JSON.parse(getUserInfo())
    this.filters.curDeptCode = this.curDept.depCode
    this.filters.departType = this.curDept.depType
    // alert(JSON.stringify(this.filters))
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))

    //   // if (this.carryParam.origin === 'statistical') {
    //   this.showBackBtn = true // 显示返回按钮
    //   // }
    //   if (this.carryParam.type) {
    //     this.qsStatus = this.carryParam.type
    //     this.qsStatusChange(this.qsStatus)
    //   }
    //   if (this.carryParam.deptCode.substring(0, 6) === '610000') {
    //     if (this.carryParam.deptLevel === 'first') {
    //       this.tingOrgCode = [this.carryParam.deptCode]
    //     } else {
    //       this.tingOrgCode = [this.carryParam.curFirstLevelCode, this.carryParam.deptCode]
    //     }
    //   } else {
    //     if (this.carryParam.deptLevel === 'first') {
    //       this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4)]
    //     } else {
    //       this.shiOrgCode = [this.carryParam.deptCode.substring(0, 4), this.carryParam.deptCode]
    //       if (this.carryParam.deptCode.substring(4, 6) !== '00') {
    //         this.qiOrgCode = this.carryParam.deptCode
    //       }
    //     }
    //   }
    //   this.shiDepChange(this.shiOrgCode)
    //   if (this.carryParam.filtStartTime) { // 开始时间
    //     this.filters.rlStartTime = this.carryParam.filtStartTime
    //   }
    //   if (this.carryParam.filtEndTime) { // 结束时间
    //     this.filters.rlEndTime = this.carryParam.filtEndTime
    //   }
    //   if (this.carryParam.queryType) { // 认领时间筛选类型
    //     this.filters.dType = this.carryParam.queryType
    //   }
    //   // if (this.carryParam.ajbh) { // 案件档案跳转过来的
    //   //   this.filters.AJBH = this.carryParam.ajbh
    //   // }
    // } else if (this.$route.query.ajbh) { // 案件档案跳转过来的
    //   this.filters.AJBH = this.$route.query.ajbh
    //   this.showBackBtn = true // 显示返回按钮
    // } else {
    //   this.showBackBtn = false // 默认隐藏返回按钮
    // }
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

