<template>
  <div class="develop" v-loading="developLoading">
    <!-- 发展变化趋势分析 -->
    <el-form :inline="true" :model="filters" ref="filters" label-width="80px" style="text-align: left;">
      <el-form-item label="立案日期" prop="ltimeType">
        <el-select  v-model="filters.ltimeType" size="small" placeholder="全部" clearable @change="ltimeTypeChange">
          <el-option :label="item.label" :value="item.value" v-for="item in dateOption" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="lstartDate"  label-width="0px">
        <el-date-picker
          v-model="filters.lstartDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions1"
          @change="startDateChange1"
          placeholder="请选择开始时间"
          :disabled="filters.ltimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="lendDate" label-width="36px">
        <el-date-picker
          v-model="filters.lendDate"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="endDateChange1"
          :picker-options="endPickerOptions1"
          placeholder="请选择结束时间"
          :disabled="filters.ltimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件分类" prop="syhFllb">
        <el-cascader v-model="filters.syhFllb" change-on-select :options="fllbList" @change="changeajlxSelect" placeholder="全部" filterable clearable  class="inputw"></el-cascader>
      </el-form-item>
      <el-form-item label="" prop="syhFllbType"  label-width="0px">
        <!-- :disabled="!(filters.syhFllb&&filters.syhFllb.length>0)" -->
        <el-checkbox v-model="filters.syhFllbType" >统计子级</el-checkbox>
        <el-tooltip class="item" effect="dark" content="勾选统计子级时统计当前选中案件分类的子级（包括子级的下级）案件数量。" placement="top-start">
          <!-- <i class="el-icon-question"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
        </el-tooltip>
      </el-form-item>
      <br/>
      <el-form-item label="破案日期" prop="ptimeType">
        <el-select v-model="filters.ptimeType" size="small" placeholder="全部" clearable @change="ptimeTypeChange">
          <el-option :label="item.label" :value="item.value" v-for="item in dateOption" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="pstartDate"  label-width="0px">
        <el-date-picker
          v-model="filters.pstartDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions2"
          @change="startDateChange2"
          placeholder="请选择开始时间"
          :disabled="filters.ptimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="pendDate" label-width="36px">
        <el-date-picker
          v-model="filters.pendDate"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="endDateChange2"
          :picker-options="endPickerOptions2"
          placeholder="请选择结束时间"
          :disabled="filters.ptimeType!=='6'">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDevelopChangeData(true)">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0;">
      <span style="line-height:22px;">
        案件数量统计&nbsp;&nbsp;
        <el-tooltip class="item" effect="dark" content="根据查询条件分析立案、破案、销案、结案符合条件的案件数量。" placement="top-start">
          <!-- <i class="el-icon-question" style="font-size:20px;margin-bottom:0px;"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
        </el-tooltip>
      </span>
      <img src="/static/image/download.png" alt="" srcset="" title="下载" @click="exportTable('1')" style="float:right;width:24px;margin-top: -5px;cursor:pointer;">
    </div>
    <el-table :data="teamData"  style="width: 100%;" :max-height="tableHeight" v-loading="loading1" class="table_th_center"
      :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick"
     ref="teamStatistical" :row-class-name="getRowClass">
     <!-- show-summary :summary-method="getSummaries" -->
      <el-table-column type="expand" width="40" v-if="firstCanJump===false" class-name="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.child||[]" :style="expandTableStyle" v-loading="loading12" max-height="400">
            <el-table-column prop="" label="" width="40"></el-table-column>
            <el-table-column type="index" label="序号" align="center" :width="smallItemWidth"></el-table-column>
            <el-table-column prop="cityName" label="单位机构" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.cityName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList" label="立案">
              <el-table-column prop="z1l1" label="食品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'立案','1')">{{scope.row.totalList.z1l1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z1l2" label="药品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'立案','2')">{{scope.row.totalList.z1l2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z1l3" label="环境" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'立案','3')">{{scope.row.totalList.z1l3}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z1l4" label="总计" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'立案','',true)">{{scope.row.totalList.z1l4}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="" label="破案">
              <el-table-column prop="z2l1" label="食品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'破案','1')">{{scope.row.totalList.z2l1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z2l2" label="药品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'破案','2')">{{scope.row.totalList.z2l2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z2l3" label="环境" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'破案','3')">{{scope.row.totalList.z2l3}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z2l4" label="总计" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'破案','',true)">{{scope.row.totalList.z2l4}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="" label="销案">
              <el-table-column prop="z3l1" label="食品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'销案','1')">{{scope.row.totalList.z3l1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z3l2" label="药品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'销案','2')">{{scope.row.totalList.z3l2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z3l3" label="环境" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'销案','3')">{{scope.row.totalList.z3l3}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z3l4" label="总计" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'销案','',true)">{{scope.row.totalList.z3l4}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="" label="结案">
              <el-table-column prop="z4l1" label="食品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'结案','1')">{{scope.row.totalList.z4l1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z4l2" label="药品" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'结案','2')">{{scope.row.totalList.z4l2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z4l3" label="环境" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'结案','3')">{{scope.row.totalList.z4l3}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="z4l4" label="总计" :min-width="smallItemWidth" align="center">
                <template slot-scope="scope">
                  <span class="canClick" @click="toCaseList(scope.row,'结案','',true)">{{scope.row.totalList.z4l4}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="z5" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'','',true)">{{scope.row.totalList.z5}}</span>
                </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位':'地市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- v-if="scope.row.canClickJump===true"  -->
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalList" label="立案">
        <el-table-column prop="z1l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'立案','1')">{{scope.row.totalList.z1l1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z1l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'立案','2')">{{scope.row.totalList.z1l2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z1l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'立案','3')">{{scope.row.totalList.z1l3}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z1l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'立案','',true)">{{scope.row.totalList.z1l4}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="破案">
        <el-table-column prop="z2l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'破案','1')">{{scope.row.totalList.z2l1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z2l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'破案','2')">{{scope.row.totalList.z2l2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z2l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'破案','3')">{{scope.row.totalList.z2l3}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z2l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'破案','',true)">{{scope.row.totalList.z2l4}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="销案">
        <el-table-column prop="z3l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'销案','1')">{{scope.row.totalList.z3l1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z3l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'销案','2')">{{scope.row.totalList.z3l2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z3l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'销案','3')">{{scope.row.totalList.z3l3}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z3l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'销案','',true)">{{scope.row.totalList.z3l4}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="结案">
        <el-table-column prop="z4l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'结案','1')">{{scope.row.totalList.z4l1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z4l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'结案','2')">{{scope.row.totalList.z4l2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z4l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'结案','3')">{{scope.row.totalList.z4l3}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z4l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'结案','',true)">{{scope.row.totalList.z4l4}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="z5" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            <span class="canClick" @click="toCaseList(scope.row,'总计1','',true)">{{scope.row.totalList.z5}}</span>
          </template>
      </el-table-column>
    </el-table>
    <!-- echart统计图 -->
    <div class="clearfix" style="margin:20px 0;">
      <!-- 饼状图 -->
      <div class="left" style="width:49%;">
        <div>
          <span>{{ajStatusLabel1}}案件类型统计&nbsp;&nbsp;</span>
          <el-tooltip class="item" effect="dark" content="根据查询条件分析指定案件状态案件环境、食品、药品案件数量比例。" placement="top-start">
            <!-- <i class="el-icon-question" style="font-size:20px;"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
          </el-tooltip>
          <span style="margin:0px 10px 0px 30px;">案件状态</span>
          <el-select  v-model="ajZt1" size="small" @change="ajStatusChange1">
            <el-option :label="item.name" :value="item.value" v-for="item in ajZtOption" :key="item.value"></el-option>
          </el-select>
        </div>
        <div id="echartLeft" style="height: 400px;margin:0 0 20px 0;"></div>
      </div>
      <!-- 柱状图 -->
      <div class="right" style="width:49%;">
        <div>
          {{ajStatusLabel2}}案件类型统计&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="根据查询条件分析指定案件状态案件环境、食品、药品案件数量比例。" placement="top-start">
            <!-- <i class="el-icon-question" style="font-size:20px;"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
          </el-tooltip>
          <span style="margin:0px 10px 0px 30px;">案件状态</span>
          <el-select  v-model="ajZt2" size="small" @change="ajStatusChange2">
            <el-option :label="item.name" :value="item.value" v-for="item in ajZtOption" :key="item.value"></el-option>
          </el-select>
        </div>
        <div id="echartRight" style="height: 400px;margin:0 0 20px 0;"></div>
      </div>
    </div>
    <!-- 案件状态统计 -->
    <div style="margin: 10px 0;">
      <span style="line-height:22px;">
        案件状态统计&nbsp;&nbsp;
        <el-tooltip class="item" effect="dark" content="根据查询条件分析案件状态分布情况。" placement="top-start">
          <!-- <i class="el-icon-question" style="font-size:20px;"></i> -->
          <i><svg-icon icon-class="wenhao1"></svg-icon></i>
        </el-tooltip>
      </span>
      <img src="/static/image/download.png" alt="" srcset="" title="下载"  @click="exportTable('2')" style="float:right;width:24px;margin-top: -5px;cursor:pointer;">
    </div>
    <el-table :data="caseStatusTable"  style="width: 100%;" :max-height="tableHeight" v-loading="loading2" class="table_th_center"
      :row-key="getRowKeys" :expand-row-keys="expands2" @expand-change="rowClickCaseStatus"
     ref="teamStatistical" :row-class-name="getRowClass">
     <!-- show-summary :summary-method="getSummaries" -->
      <el-table-column type="expand" width="40" v-if="firstCanJump===false" class-name="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.child||[]" :style="expandTableStyle" v-loading="loading22" max-height="400">
            <el-table-column prop="" label="" width="40"></el-table-column>
            <el-table-column type="index" label="序号" align="center" :width="smallItemWidth"></el-table-column>
            <el-table-column prop="deptName" label="单位机构" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.cityName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z1" label="受理" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'受理','')">{{scope.row.totalList.z1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z2" label="立案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'立案','')">{{scope.row.totalList.z2}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z3" label="破案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'破案','')">{{scope.row.totalList.z3}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z4" label="销案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'销案','')">{{scope.row.totalList.z4}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z5" label="转治安案件" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'转治安案件','')">{{scope.row.totalList.z5}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z6" label="结案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'结案','')">{{scope.row.totalList.z6}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z7" label="归档" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'归档','')">{{scope.row.totalList.z7}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="z8" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="toCaseList(scope.row,'总计','')">{{scope.row.totalList.z8}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位':'地市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- v-if="scope.row.canClickJump===true" class="canClick" @click="goDeptStatistical(scope.row)" -->
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z1" label="受理" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'受理','')">{{scope.row.totalList.z1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z2" label="立案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'立案','')">{{scope.row.totalList.z2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z3" label="破案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'破案','')">{{scope.row.totalList.z3}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z4" label="销案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'销案','')">{{scope.row.totalList.z4}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z5" label="转治安案件" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'转治安案件','')">{{scope.row.totalList.z5}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z6" label="结案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'结案','')">{{scope.row.totalList.z6}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z7" label="归档" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'归档','')">{{scope.row.totalList.z7}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z8" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="canClick" @click="toCaseList(scope.row,'总计2','')">{{scope.row.totalList.z8}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getSYHFLLBList } from '@/utils/codetotext'
import echarts from 'echarts'
export default {
  name: 'developChange',
  data() {
    return {
      smallItemWidth: 60, // 表格最小格子的宽度
      dateOption: [
        { label: '本年', value: '1' },
        { label: '本季', value: '2' },
        { label: '本月', value: '3' },
        { label: '本周', value: '4' },
        { label: '本日', value: '5' },
        { label: '自定义', value: '6' }
      ],
      ajZtOption: [
        // { label: '受理', value: '1' },
        // { label: '立案', value: '2' },
        // { label: '破案', value: '3' },
        // { label: '转治安案件', value: '4' },
        // { label: '结案', value: '5' },
        // { label: '归档', value: '6' }
      ],
      ajStatusLabel1: '立案', // 统计图标题
      ajStatusLabel2: '破案',
      ajZt1: '', // 左边图 默认查立案，接口成功后给赋默认值
      ajZt2: '', // 右边图 默认查破案，接口成功后给赋默认值
      startPickerOptions1: {}, // 立案日期
      endPickerOptions1: {},
      startPickerOptions2: {}, // 破案日期
      endPickerOptions2: {},
      fllbList: getSYHFLLBList(), // 案件类型下拉框数据
      caseStatusTable: [], // 案件状态统计 表格

      filters: {
        ltimeType: '',
        ptimeType: '',
        pstartDate: '',
        pendDate: '',
        lstartDate: '',
        lendDate: '',
        syhFllb: [],
        syhFllbType: true // 默认选中勾选子级
      },
      teamData: [], // 队伍统计
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      firstCanJump: false, // 表格的一级是否可跳转
      tableHeight: null,
      cityData: [], // 盟市统计的
      developLoading: true, // 整个页面加载loading
      loading1: false, // 统计loading
      loading12: false, // 子列表loading
      loading2: false, // 统计loading
      loading22: false, // 子列表loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      showEchart: true,
      selectCurDep: { name: '' },
      expands: [], // 展开的行
      echartAllData: {}, // 三个饼状图的数据源
      screenWidth: '', // 屏幕宽度
      expands2: [],
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      systemTime: '' // 系统时间
    }
  },
  components: {
  },
  methods: {
    ajStatusChange1(val) { // 左侧图形状态change
      if (val) {
        this.ajStatusLabel1 = this.$getLabelByValue(val, this.ajZtOption)
        this.queryDevelopChangeData(true, '', '2') // 2表示左边饼状图查
      }
    },
    ajStatusChange2(val) { // 右侧图形状态change
      if (val) {
        this.ajStatusLabel2 = this.$getLabelByValue(val, this.ajZtOption)
        this.queryDevelopChangeData(true, '', '3') // 3表示右边柱状图查
      }
    },
    changeajlxSelect(val) { // 案件类型change事件
      // if (val.length > 0) {
      //   this.filters.syhFllbType = true
      // } else {
      //   this.filters.syhFllbType = false
      // }
    },
    getRowClass(row) {
      if (row.row.cityName === '总计') { // 合计行 隐藏展开符号 和 序号
        return 'row-expand-cover'
      }
      // if(row.row.departType === '2' || row.row.departType === '3'){

      // }
    },
    getRowKeys(row) {
      return row.departCode
    },
    rowClick(row) { // 案件数量统计  展开
      if (this.expands.indexOf(row.departCode) > -1) { // 展开项中存在
        this.expands.splice(this.expands.indexOf(row.departCode), 1)
      } else { // 展开项中不存在
        this.expands.push(row.departCode)
        if (row.departCode === '610000530000') { // 省厅
          this.queryDevelopChangeData(true, row.departCode, '1') // 根据部门code查
        } else {
          if (row.cityCode) {
            this.queryDevelopChangeData(true, row.cityCode, '1') // 根据盟市code查
          } else {
            //
          }
        }
      }
    },
    rowClickCaseStatus(row) { // 案件状态统计 展开
      if (this.expands2.indexOf(row.departCode) > -1) { // 展开项中存在
        this.expands2.splice(this.expands2.indexOf(row.departCode), 1)
      } else { // 展开项中不存在
        this.expands2.push(row.departCode)
        if (row.departCode === '610000530000') { // 省厅
          this.queryDevelopChangeData(true, row.departCode, '4') // 根据部门code查
        } else {
          if (row.cityCode) {
            this.queryDevelopChangeData(true, row.cityCode, '4') // 根据盟市code查
          } else {
            //
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (this.firstCanJump === true) {
          if (index === 1) {
            sums[index] = '合计'
            return
          }
        } else {
          if (index === 2) {
            sums[index] = '合计'
            return
          }
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
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    initData() { // 初始化筛选条件
      this.getSysTime() // 查询系统时间
      this.developLoading = true
      this.$query('caseajzt', {}).then((response) => {
        this.developLoading = false
        if (response.code === '000000') {
          this.ajZtOption = response.data
          for (let index = 0; index < this.ajZtOption.length; index++) {
            const element = this.ajZtOption[index]
            if (element.name === '立案') {
              this.ajZt1 = element.value
            }
            if (element.name === '破案') {
              this.ajZt2 = element.value
            }
          }
          this.queryDevelopChangeData() // 查询四大块内容
        }
      }).catch(() => {
        this.developLoading = false
      })
    },
    queryDevelopChangeData(hand, city, moduleBox) { // 查询，city 根据市查，moduleBox查第几个模块1，2 3，4
      if (this.filters.ltimeType === '6' && !this.filters.lstartDate && this.filters.lendDate) {
        this.$message.error('立案开始时间不能为空！')
        return false
      }
      if (this.filters.ptimeType === '6' && !this.filters.pstartDate && this.filters.pendDate) {
        this.$message.error('破案开始时间不能为空！')
        return false
      }
      var param = JSON.parse(JSON.stringify(this.filters))
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      if (this.deptInfo.depType === '1') { // 总队 各地市 可展开
        param.provinceCode = '610000'
      } else if (this.deptInfo.depType === '2') { // 支队 本地市 支队+区县大队
        param.cityCode = this.deptInfo.areaCode
      } else if (this.deptInfo.depType === '3') { // 大队 本区县大队
        param.departCode = this.deptInfo.depCode
      } else if (this.deptInfo.depType === '4') { // 派出所
        param.departCode = this.deptInfo.parentDepCode
      }
      if (!param.ltimeType) { // 立案日期类型
        param.ltimeType = '0'
      }
      if (!param.ptimeType) { // 破案日期类型
        param.ptimeType = '0'
      }
      param.syhFllb = param.syhFllb.join(',')
      param.syhFllbType = param.syhFllbType ? '1' : '2' // 筛选条件-是否统计子级
      if (city) { // 点击表格展开的查询
        this.listChildLoading = true
        if (city === '610000530000') { // 省厅
          param.departCode = city
        } else {
          param.cityCode = city
        }
        param.isExpandTable = '1' // 展开表格查询的标志字段
      } else { // 一级表格的查询
        this.expands = [] // 初始化 所有行 均不展开
        this.expands2 = []
      }
      if (moduleBox === '1') { // 查询不同的模块
        this.queryCaseNum(param) // 查询案件数量统计
      } else if (moduleBox === '2') {
        this.queryGraphByType(param, this.ajZt1, 'left') // 查询立案案件类型统计
      } else if (moduleBox === '3') {
        this.queryGraphByType(param, this.ajZt2, 'right') // 查询破案案件类型统计
      } else if (moduleBox === '4') {
        this.queryCaseStatusNum(param) // 查询案件状态统计
      } else {
        this.queryCaseNum(param) // 查询案件数量统计
        this.queryGraphByType(param, this.ajZt1, 'left') // 查询立案案件类型统计
        this.queryGraphByType(param, this.ajZt2, 'right') // 查询破案案件类型统计
        this.queryCaseStatusNum(param) // 查询案件状态统计
      }
      console.log(param)
    },
    queryCaseNum(param) { // 队伍统计
      if (param.isExpandTable === '1') { // 展开的 查询
        this.loading12 = true // 展开表格的loading
        var city = param.departCode || param.cityCode
      } else {
        this.loading1 = true
      }
      this.$queryPost('caseAnalyzeDevel/numTotal', param).then((response) => {
        this.loading1 = false
        this.loading12 = false
        if (response.code === '000000') {
          if (param.isExpandTable === '1') { // 展开的表格
            this.listChildLoading = false
            for (let i = 0; i < this.teamData.length; i++) {
              const item = this.teamData[i]
              if (city === '610000530000') { // 省厅
                if (item.departCode === city) {
                  item.child = response.data
                }
              } else {
                if (item.cityCode === city) {
                  item.child = response.data
                }
              }
            }
          } else { // 一级的表格
            this.teamData = response.data // 如果是全省 返回的是带有list的，如果非全省 直接返回的是机构的列表
            // var canClick = true
            if (param.provinceCode === '610000') { // 查全省
              this.firstCanJump = false
              // canClick = false
            } else {
              this.firstCanJump = true // 控制 表头显示 省市 还是单位机构
              // canClick = true // 一级的表格可跳转
            }
            // for (let index = 0; index < this.teamData.length; index++) {
            //   const element = this.teamData[index]
            //   if (!element.cityName) {
            //     element.cityName = '合计'
            //     element.canClickJump = false // 合计 不能跳转
            //   } else {
            //     element.canClickJump = canClick // 是否可点击跳转
            //   }
            // }
          }
        }
      }).catch(() => {
        this.loading1 = false
        this.loading12 = false
      })
    },
    queryCaseStatusNum(param) { // 查询案件状态统计
      if (param.isExpandTable === '1') {
        var city = param.departCode || param.cityCode
        this.loading22 = true
      } else {
        this.loading2 = true
      }
      this.$queryPost('caseAnalyzeDevel/ajztTotal', param).then((response) => {
        this.loading2 = false
        this.loading22 = false
        if (response.code === '000000') {
          if (param.isExpandTable === '1') {
            for (let i = 0; i < this.caseStatusTable.length; i++) {
              const item = this.caseStatusTable[i]
              if (city === '610000530000') { // 省厅
                if (item.departCode === city) {
                  item.child = response.data
                }
              } else {
                if (item.cityCode === city) {
                  item.child = response.data
                }
              }
            }
          } else {
            this.caseStatusTable = response.data // 如果是全省 返回的是带有list的，如果非全省 直接返回的是机构的列表
            // var canClick = true
            if (param.provinceCode === '610000') { // 查全省
              this.firstCanJump = false
              // canClick = false
            } else {
              this.firstCanJump = true // 控制 表头显示 省市 还是单位机构
              // canClick = true // 一级的表格可跳转
            }
            // for (let index = 0; index < this.caseStatusTable.length; index++) {
            //   const element = this.caseStatusTable[index]
            //   if (!element.cityName) {
            //     element.cityName = '合计'
            //     element.canClickJump = false // 合计 不能跳转
            //   } else {
            //     element.canClickJump = canClick // 是否可点击跳转
            //   }
            // }
          }
        }
      }).catch(() => {
        this.loading2 = false
        this.loading22 = false
      })
    },
    queryGraphByType(param, type, position) {
      var statusParam = JSON.parse(JSON.stringify(param)) // 此处深拷贝 是由于 若直接使用param  则会将ajzt绑定到param上，影响别的查询参数
      statusParam.ajzt = type // 当前选中的案件状态
      this.$queryPost('caseAnalyzeDevel/one', statusParam).then((response) => {
        if (response.code === '000000') {
          if (position === 'left') {
            this.drawChartLeft(response.data) // 左侧饼状图
          }
          if (position === 'right') {
            this.drawChartRight(response.data) // 右侧柱状图
          }
        }
      }).catch(() => {
        this.teamLoading = false
      })
    },
    drawChartLeft(data) { // 左侧 饼状图
      var scoreArr = [
        { value: data.l3, name: '环境' },
        { value: data.l1, name: '食品' },
        { value: data.l2, name: '药品' }
      ]
      var echartLeft = echarts.init(document.getElementById('echartLeft'))
      echartLeft.setOption({
        color: ['#1088F6', '#04E4E4', '#FFDB56', '#F67C4E', '#F84C6E', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: this.ajStatusLabel1 + '案件类型统计',
          textStyle: {
            color: 'rgba(0,0,0,0)'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 66,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: this.ajStatusLabel1 + '案件类型统计保存为图片',
              icon: 'image://static/image/download.png'
              // emphasis: {
              //   icon: 'image://static/image/download_b.png'
              // }
            }
          },
          itemSize: 20,
          iconStyle: {
            emphasis: { color: '#fff' }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          itemGap: 15,
          data: ['环境', '食品', '药品'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['0', '60%'],
            data: scoreArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawChartRight(data) { // 右侧 柱状图
      var seriesData = [data.l3, data.l1, data.l2] // 环境 食品 药品的顺序
      var echartRight = echarts.init(document.getElementById('echartRight'))
      echartRight.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 66,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: this.ajStatusLabel2 + '案件类型统计保存为图片',
              icon: 'image://static/image/download.png'
              // emphasis: {
              //   icon: 'image://static/image/download_b.png'
              // }
            }
          },
          itemSize: 20,
          iconStyle: {
            emphasis: { color: '#fff' }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '7%',
          containLabel: true
        },
        legend: {
          data: ['案件数量'],
          type: 'scroll',
          bottom: 0,
          itemGap: 15,
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['环境', '食品', '药品'],
            axisTick: {
              alignWithLabel: true,
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          }
        ],
        series: [
          {
            name: '案件数量',
            type: 'bar',
            barWidth: '60%',
            data: seriesData
          }
        ]
      })
    },
    getSysTime() {
      this.$query('knowledge/queryTime').then(response => {
        this.systemTime = response.data
      })
    },
    ltimeTypeChange(val) { // 立案时间 change
      this.filters.lstartDate = ''
      this.filters.lendDate = ''
      if (val) {
        this.buildTime('la')
      }
    },
    ptimeTypeChange(val) { // 破案时间change
      this.filters.pstartDate = ''
      this.filters.pendDate = ''
      if (val) {
        this.buildTime('pa')
      }
    },
    buildTime(type) {
      const systemDate = new Date(this.systemTime)
      let startTime = ''
      let endTime = ''
      var timeType = ''
      if (type === 'la') {
        timeType = this.filters.ltimeType
      } else if (type === 'pa') {
        timeType = this.filters.ptimeType
      }
      if (timeType === '1') { // 本年
        startTime = systemDate.getFullYear() + '-01-01'
        const day = new Date(systemDate.getFullYear(), 12, 0)
        endTime = systemDate.getFullYear() + '-12-' + day.getDate()
      }
      if (timeType === '2') { // 本季
        if (systemDate.getMonth() + 1 <= 3) {
          startTime = systemDate.getFullYear() + '-01-01'
          endTime = systemDate.getFullYear() + '-03-31'
        } else if (systemDate.getMonth() + 1 > 3 && systemDate.getMonth() + 1 <= 6) {
          startTime = systemDate.getFullYear() + '-04-01'
          endTime = systemDate.getFullYear() + '-06-30'
        } else if (systemDate.getMonth() + 1 > 6 && systemDate.getMonth() + 1 <= 9) {
          startTime = systemDate.getFullYear() + '-07-01'
          endTime = systemDate.getFullYear() + '-09-30'
        } else if (systemDate.getMonth() + 1 > 9 && systemDate.getMonth() + 1 <= 12) {
          startTime = systemDate.getFullYear() + '-10-01'
          endTime = systemDate.getFullYear() + '-12-31'
        }
      }
      if (timeType === '3') { // 本月
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-01'
        const day = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + day.getDate()
      }
      if (timeType === '4') { // 本周
        systemDate.setDate(systemDate.getDate() - systemDate.getDay() + 1)
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
        systemDate.setDate(systemDate.getDate() + 6)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
      }
      if (timeType === '5') { // 本日
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate()
      }
      if (type === 'la') {
        this.filters.lstartDate = startTime
        this.filters.lendDate = endTime
      } else if (type === 'pa') {
        this.filters.pstartDate = startTime
        this.filters.pendDate = endTime
      }
    },
    toCaseList(row, ajStatus, ajFl) {
      // ishzj 是否点击的是行总计 1总计
      // ajStatus 汉字 遍历找到对应的code码
      var ajzts = '' // 多个案件状态的情况
      if (ajStatus === '总计1') { // 案件数量统计 最右边一列的合计
        for (let index = 0; index < this.ajZtOption.length; index++) {
          const element = this.ajZtOption[index]
          if (element.name === '立案' || element.name === '破案' || element.name === '销案' || element.name === '结案') {
            ajzts += element.value + ','
          }
        }
        ajStatus = '' // 多个案件状态时这个字段置为空
        ajzts = ajzts.substring(0, ajzts.length - 1)
      } else if (ajStatus === '总计2') { // 案件状态统计 最右边一列的合计
        for (let index = 0; index < this.ajZtOption.length; index++) {
          const element = this.ajZtOption[index]
          if (element.name === '受理' || element.name === '立案' || element.name === '破案' || element.name === '销案' ||
            element.name === '转治安案件' || element.name === '结案' || element.name === '归档') {
            ajzts += element.value + ','
          }
        }
        ajStatus = '' // 多个案件状态时这个字段置为空
        ajzts = ajzts.substring(0, ajzts.length - 1)
      } else {
        for (let index = 0; index < this.ajZtOption.length; index++) {
          const element = this.ajZtOption[index]
          if (element.name === ajStatus) {
            ajStatus = element.value
          }
        }
      }
      var para = {
        analysis: true, // 案件分析研判跳转的标志
        larqStart: this.filters.lstartDate || '', // 立案时间
        larqEnd: this.filters.lendDate || '',
        parqStart: this.filters.pstartDate || '', // 破案时间
        parqEnd: this.filters.pendDate || '',
        childFlag: this.filters.syhFllbType ? 'y' : 'n', // 是否统计子级
        ajzt: ajStatus, // 单个案件状态
        ajzts: ajzts // 多个案件状态 针对最后一列总计的跳转
      }
      if (this.filters.syhFllb && this.filters.syhFllb.length > 0) {
        para.syhFllb = this.filters.syhFllb
      } else { // 没有选 筛选条件的分类类别
        if (ajFl) {
          para.syhFllb = [ajFl]
        } else { // 点的是立案/破案...的总计
          para.syhFllb = []
        }
      }
      if (row.dtype === 1) { // 点击的是地市的数字
        para.areaCode = ['610000', row.areaCode]
        para.deptCode = ''
      } else if (row.cityName === '总计') {
        // 总队 大队 的总计不需要特殊处理 传空
        // if (this.deptInfo.depType === '1') { // 总队
        //   para.areaCode = []
        //   para.deptCode = ''
        // }
        if (this.deptInfo.depType === '2') { // 支队
          para.areaCode = ['610000', row.cityCode]
          para.deptCode = ''
        }
      } else { // 点击的是某个部门
        para.deptCode = row.departCode
        const cityCode = row.deptCode.substring(0, 6)
        // const cityCode = row.cityCode
        if (row.departType === '2') { // 支队
          para.areaCode = ['610000', cityCode]
        } else if (row.departType === '3') { // 大队 派出所
          para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
        } else if (row.departType === '4') {
          if (row.areaCode === '611400') { // 杨凌例外
            para.areaCode = ['610000', '611400']
          } else { // 正常的派出所
            para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
          }
        }
      }
      console.log(para)
      this.$gotoid('/caseManage/caseList', JSON.stringify(para))
    },
    goDeptStatistical(row) { // 跳转到机构 页面
      // this.$router.push({ path: '/basicService/deptStatistical', query: { departCode: row.deptCode, departName: row.deptName }})
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    exportTable(type) { // 导出excel
      var exportParam = {
        tableType: type
      }
      if (type === '1') { // 案件数量统计表格
        exportParam.data = this.teamData
      } else if (type === '2') { // 案件状态统计表格
        exportParam.data = this.caseStatusTable
      }
      this.$gotoid('/exportDevelop', JSON.stringify(exportParam))
      // this.$router.push({ path: '/exportTeam', query: param })
    },
    reset() { // 重置
      this.resetForm('filters')
      this.queryDevelopChangeData(true)
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    startDateChange1(val) {
      if (val) {
        // this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filters.lendDate = '' // 结束时间清空
        // this.endDateDisabled = true
        this.startPickerOptions1 = Object.assign({}, 'startPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange1(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions1 = Object.assign({}, 'startPickerOptions1', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions1 = Object.assign({}, 'endPickerOptions1', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    startDateChange2(val) {
      if (val) {
        // this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filters.pendDate = '' // 结束时间清空
        // this.endDateDisabled = true
        this.startPickerOptions2 = Object.assign({}, 'startPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange2(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions2 = Object.assign({}, 'startPickerOptions2', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions2 = Object.assign({}, 'endPickerOptions2', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    this.initData() // 初始化筛选条件数据
    this.$nextTick(() => { // 页面渲染完成后的回调
      this.screenWidth = this.$refs.teamStatistical.$el.clientWidth + 'px'
      this.expandTableStyle = 'width:' + this.screenWidth + ';border-left: none;border-right: none;overflow-x:auto;'
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.develop {
  margin-bottom: 50px;
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  //修改表格边框颜色
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: none;
    border-right: 1px solid #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  .row-expand-cover .xuhao .cell div {
    color: transparent;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.canClick {
  cursor: pointer;
}
.canClick:hover {
  color: #00a0e9;
  text-decoration: underline;
  // text-decoration: underline;
}
.el-table .row-sheng .cell .el-table__expand-icon {
  display: none;
}
.el-table .row-sheng .xuhao {
  // 如果用display none 隐藏了 会整行往左移
  opacity: 0;
  pointer-events: none;
}
.el-table .row-hj .el-table-column--selection {
  // 合计行去掉 复选框
  opacity: 0;
  pointer-events: none;
}
.el-autocomplete-suggestion {
  border: 1px solid #00a0e9;
}
.el-autocomplete-suggestion__wrap {
  background-color: #005982 !important;
  border: 0 !important;
}
.el-autocomplete-suggestion li {
  color: #fff;
}
.el-autocomplete-suggestion.is-loading li:hover,
.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
</style>
