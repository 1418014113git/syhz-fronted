<template>
  <section class="personalSearch">
    <!--工具条-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="isShowBack">   <!--返回-->
    <el-col :span="24" class="searchWrap">
      <el-form :inline="true" :model="filters" size="mini" @submit.native.prevent>
        <el-row type="flex" justify="center">
          <el-form-item class="wordinput">
            <el-input placeholder="输入关键字搜索" v-model.trim="filters.word" clearable :disabled="searchType === '1'" @keyup.enter.native="handleClick"></el-input>
          </el-form-item>
          <el-form-item>
            <el-dropdown split-button type="primary" native-type="submit" @click="handleClick" size="mini" @command="handleCommand">
              {{btnText}}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0" :disabled="!$isViewBtn('120004')" style="font-size:14px;">搜索</el-dropdown-item>
                <el-dropdown-item command="1" :disabled="!$isViewBtn('120004')" style="font-size:14px;">高级搜索</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-button title="配置" type="success" plain v-if="$isViewBtn('120004')"
                       @click="$gotoid('/comanalysis/persetting')">配置
            </el-button>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <ul class="clearfix menu_ul">
            <li class="perLi" v-for="(item, index) in searchMenuList" @click="chooseMenu(index)" :key="index"
                :class="item.active===1?'activeClass':''">
              <svg-icon :style="item.style" :icon-class="item.img" v-if="item.active===0"></svg-icon>
              <svg-icon :style="item.style" :icon-class="item.img + '_b'" v-if="item.active===1"></svg-icon>
              <p>{{item.text}}</p>
            </li>
          </ul>
        </el-row>
      </el-form>
      <!-- 高级搜索  案件 form -->
      <el-form :inline="true" :model="seniorForm" size="mini" v-if="advancedAJFormShow">
        <!-- 默认项 -->
        <el-form-item label="案件编号" v-if="showFields.AJBH">
          <el-input placeholder="" v-model="seniorForm.AJBH" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件状态" v-if="showFields.AJZT">
          <el-select v-model="seniorForm.AJZT" clearable placeholder="请选择" @change="handleChange">
            <el-option v-for="item in getAJZTList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件名称" v-if="showFields.AJMC">
          <el-input placeholder="" v-model="seniorForm.AJMC" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件类别" v-if="showFields.AJLB_NAME">
          <el-input placeholder="" v-model="seniorForm.AJLB_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="立案日期" v-if="showFields.LARQ">
          <el-date-picker v-model="seniorForm.LARQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件分类" v-if="showFields.SYH_FLLB">
          <el-cascader change-on-select filterable :options="SYHFLLBList" v-model="seniorForm.SYH_FLLB"
                       @change="handleChange" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="认领部门" v-if="showFields.RLDW">
          <el-cascader change-on-select filterable :options="SYHRLDWList" v-model="seniorForm.RLDW" :props="RLDWprops"  @change="handleChange"
                       clearable></el-cascader>
        </el-form-item>
        <!-- 可配置项 -->
        <el-form-item label="报案人姓名" v-if="showFields.BARXM">
          <el-input placeholder="" v-model="seniorForm.BARXM" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人别名" v-if="showFields.BARBM">
          <el-input placeholder="" v-model="seniorForm.BARBM" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人性别" v-if="showFields.BARXB_NAME">
          <el-select v-model="seniorForm.BARXB_NAME" placeholder="请选择" clearable  @change="handleChange">
            <el-option v-for="item in XBList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报案人出生日期" v-if="showFields.BARCSRQ">
          <el-date-picker v-model="seniorForm.BARCSRQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="报案人证件号码" v-if="showFields.BARZJHM">
          <el-input placeholder="" v-model="seniorForm.BARZJHM" clearable maxlength="18" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人单位" v-if="showFields.BARDW">
          <el-input placeholder="" v-model="seniorForm.BARDW" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人联系方式" v-if="showFields.BARLXFS">
          <el-input placeholder="" v-model="seniorForm.BARLXFS" clearable maxlength="11" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人户籍所在地省市县区" v-if="showFields.BARHJSZDSSXQ_NAME">
          <!-- <el-cascader :clearable="true" clearable v-model="seniorForm.BARHJSZDSSXQ_NAME" :options="cityOptions" :props="props" change-on-select></el-cascader> -->
          <el-input placeholder="" v-model="seniorForm.BARHJSZDSSXQ_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="报案人实际居住地省市县区" v-if="showFields.BARSJJZDSSXQ_NAME">
          <!-- <el-cascader :clearable="true" clearable v-model="seniorForm.BARSJJZDSSXQ_NAME" :options="cityOptions" :props="props" change-on-select></el-cascader> -->
          <el-input placeholder="" v-model="seniorForm.BARSJJZDSSXQ_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件性质" v-if="showFields.AJXZ_NAME">
          <el-select v-model="seniorForm.AJXZ_NAME" filterable placeholder="请选择" clearable  @change="handleChange">
            <el-option
              v-for="item in AJXZList"
              :key="item.code"
              :label="item.code_name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件属性" v-if="showFields.AJSX_NAME">
          <el-select v-model="seniorForm.AJSX_NAME" filterable placeholder="请选择" clearable  @change="handleChange">
            <el-option
              v-for="item in AJSXList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报案时间" v-if="showFields.BASJ">
          <el-date-picker v-model="seniorForm.BASJ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="受理单位" v-if="showFields.SLDW_NAME">
          <el-input placeholder="" v-model="seniorForm.SLDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="受理时间" v-if="showFields.SLSJ">
          <el-date-picker v-model="seniorForm.SLSJ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="主办单位" v-if="showFields.ZBDW_NAME">
          <el-input placeholder="" v-model="seniorForm.ZBDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="移送单位" v-if="showFields.YSDW_NAME">
          <el-input placeholder="" v-model="seniorForm.YSDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="移送时间" v-if="showFields.YSSJ">
          <el-date-picker v-model="seniorForm.YSSJ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="立案单位" v-if="showFields.LADW_NAME">
          <el-input placeholder="" v-model="seniorForm.LADW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="破案日期" v-if="showFields.PARQ">
          <el-date-picker v-model="seniorForm.PARQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="破案单位" v-if="showFields.PADW_NAME">
          <el-input placeholder="" v-model="seniorForm.PADW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="结案日期" v-if="showFields.JARQ">
          <el-date-picker v-model="seniorForm.JARQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="归档单位" v-if="showFields.GDDW_NAME">
          <el-input placeholder="" v-model="seniorForm.GDDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="归档日期" v-if="showFields.GDRQ">
          <el-date-picker v-model="seniorForm.GDRQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="归档审批单位" v-if="showFields.GDSPDW_NAME">
          <el-input placeholder="" v-model="seniorForm.GDSPDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="所属责任区" v-if="showFields.SSZRQ_NAME">
          <el-input placeholder="" v-model="seniorForm.SSZRQ_NAME" clearable @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件操作单位" v-if="showFields.CZDW_NAME">
          <el-input placeholder="" v-model="seniorForm.CZDW_NAME" clearable @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件调查情况填表单位" v-if="showFields.XZ_DCQKTBDW_NAME">
          <el-input placeholder="" v-model="seniorForm.XZ_DCQKTBDW_NAME" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="涉案价值" v-if="showFields.SAJZ">
          <el-input placeholder="" v-model="seniorForm.SAJZ" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
      </el-form>
      <!-- 高级搜索  嫌疑人 form -->
      <el-form :inline="true" :model="seniorForm" size="mini" v-if="advancedXYRFormShow">
        <el-form-item label="嫌疑人编号" v-if="showFields.XYRBH">
          <el-input placeholder="" v-model="seniorForm.XYRBH" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件编号" v-if="showFields.AJBH">
          <el-input placeholder="" v-model="seniorForm.AJBH" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" v-if="showFields.GMSFHM">
          <el-input placeholder="" v-model="seniorForm.GMSFHM" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="嫌疑人姓名" v-if="showFields.XM">
          <el-input placeholder="" v-model="seniorForm.XM" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" v-if="showFields.CSRQ">
          <el-date-picker v-model="seniorForm.CSRQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="民族" v-if="showFields.MZ">
          <el-input placeholder="" v-model="seniorForm.MZ" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="行政区划" v-if="showFields.XZQH">
          <el-input placeholder="" v-model="seniorForm.XZQH" clearable  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <!-- 可配置项 -->
        <el-form-item label="嫌疑人文化程度" v-if="showFields.WHCD">
          <el-select v-model="seniorForm.WHCD" placeholder="请选择" clearable  @change="handleChange">
            <el-option v-for="item in WHCDList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="嫌疑人婚姻状况" v-if="showFields.HYZK">
          <el-select v-model="seniorForm.HYZK" placeholder="请选择" clearable @change="handleChange">
            <el-option v-for="item in HYZKList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 高级搜索  企业单位 form -->
      <el-form :inline="true" :model="seniorForm" size="mini" v-if="advancedAJGLDWFormShow">
        <el-form-item label="案件编号" v-if="showFields.AJBH">
          <el-input placeholder="" v-model="seniorForm.AJBH" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" v-if="showFields.DWMC">
          <el-input placeholder="" v-model="seniorForm.DWMC" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="单位性质" v-if="showFields.DWXZ_NAME">
          <el-input placeholder="" v-model="seniorForm.DWXZ_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="单位类型" v-if="showFields.DWLX_NAME">
          <el-input placeholder="" v-model="seniorForm.DWLX_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="行业类别" v-if="showFields.XYLB_NAME">
          <el-input placeholder="" v-model="seniorForm.XYLB_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="法人代表公民身份号码" v-if="showFields.FRDBGMSFHM">
          <el-input placeholder="" v-model="seniorForm.FRDBGMSFHM" clearable maxlength="18" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="法人代表姓名" v-if="showFields.FRDBXM">
          <el-input placeholder="" v-model="seniorForm.FRDBXM" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="案件名称" v-if="showFields.AJMC">
          <el-input placeholder="" v-model="seniorForm.AJMC" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <!-- 配置项 -->
        <el-form-item label="单位联系方式" v-if="showFields.DWDH">
          <el-input placeholder="" v-model="seniorForm.DWDH" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="单位税务登记号" v-if="showFields.SWDJH">
          <el-input placeholder="" v-model="seniorForm.SWDJH" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="违法犯罪事实" v-if="showFields.WFFZSS">
          <el-input placeholder="" v-model="seniorForm.WFFZSS" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="单位处罚日期" v-if="showFields.CFRQ">
          <el-date-picker v-model="seniorForm.CFRQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="处罚类型" v-if="showFields.CFLX_NAME">
          <el-input placeholder="" v-model="seniorForm.CFLX_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="处罚情况" v-if="showFields.CFQK">
          <el-input placeholder="" v-model="seniorForm.CFQK" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="处罚单位" v-if="showFields.CFDW_NAME">
          <el-input placeholder="" v-model="seniorForm.CFDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="办案人" v-if="showFields.BAR_NAME">
          <el-input placeholder="" v-model="seniorForm.BAR_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="违法证据" v-if="showFields.WFZJ">
          <el-input placeholder="" v-model="seniorForm.WFZJ" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="直接责任人" v-if="showFields.ZJZRR">
          <el-input placeholder="" v-model="seniorForm.ZJZRR" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="主管人员" v-if="showFields.ZGRY">
          <el-input placeholder="" v-model="seniorForm.ZGRY" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="简要说明" v-if="showFields.JYSM">
          <el-input placeholder="" v-model="seniorForm.JYSM" clearable maxlength="50" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="登记单位" v-if="showFields.DJDW_NAME">
          <el-input placeholder="" v-model="seniorForm.DJDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="登记人" v-if="showFields.DJR_NAME">
          <el-input placeholder="" v-model="seniorForm.DJR_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="登记日期" v-if="showFields.DJRQ">
          <el-date-picker v-model="seniorForm.DJRQ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="操作单位" v-if="showFields.CZDW_NAME">
          <el-input placeholder="" v-model="seniorForm.CZDW_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="操作人" v-if="showFields.CZR_NAME">
          <el-input placeholder="" v-model="seniorForm.CZR_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="操作时间" v-if="showFields.CZSJ">
          <el-date-picker v-model="seniorForm.CZSJ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="实际损失金额" v-if="showFields.SJSSJE">
          <el-input placeholder="" v-model="seniorForm.SJSSJE" clearable maxlength="10"  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="涉案金额" v-if="showFields.SAJE">
          <el-input placeholder="" v-model="seniorForm.SAJE" clearable maxlength="10" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="挽回损失金额" v-if="showFields.WHSSJE">
          <el-input placeholder="" v-model="seniorForm.WHSSJE" clearable maxlength="10" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="执行方式" v-if="showFields.ZXFS_NAME">
          <el-input placeholder="" v-model="seniorForm.ZXFS_NAME" clearable maxlength="10" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
      </el-form>
      <!-- 高级搜索  情报线索 form -->
      <el-form :inline="true" :model="seniorForm" size="mini" v-if="advancedQBXSFormShow">
        <!-- 默认项 -->
        <el-form-item label="情报线索标题" v-if="showFields.BT">
          <el-input placeholder="" v-model="seniorForm.BT" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="信息正文" v-if="showFields.XXZW">
          <el-input placeholder="" v-model="seniorForm.XXZW" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="涉事类别" v-if="showFields.SSLB_NAME">
          <el-input placeholder="" v-model="seniorForm.SSLB_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="时间" v-if="showFields.ASSJ">
          <el-date-picker v-model="seniorForm.ASSJ" type="daterange" range-separator="至" start-placeholder="开始日期"  @change="handleChange"
                          end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="地点类别" v-if="showFields.ASDDLB_NAME">
          <el-input placeholder="" v-model="seniorForm.ASDDLB_NAME" clearable maxlength="20"  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="线索状态" v-if="showFields.XSZT_NAME">
          <el-input placeholder="" v-model="seniorForm.XSZT_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <!-- 可配置项 -->
        <el-form-item label="关键字" v-if="showFields.GJC">
          <el-input placeholder="" v-model="seniorForm.GJC" clearable maxlength="20"  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="线索评级" v-if="showFields.XSPJ">
          <el-input placeholder="" v-model="seniorForm.XSPJ" clearable maxlength="20"  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="线索采集人" v-if="showFields.CJR_NAME">
          <el-input placeholder="" v-model="seniorForm.CJR_NAME" clearable maxlength="20"  @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="发生地所属省市" v-if="showFields.ASJFSDSSSS_NAME">
          <el-input placeholder="" v-model="seniorForm.ASJFSDSSSS_NAME" clearable maxlength="20" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <span>搜索结果：{{ total }} 条</span>&emsp;
          <span>案件：{{ AJTotal }}条</span>&emsp;
          <span>嫌疑人：{{ XYRTotal }}条</span>&emsp;
          <span>单位：{{ AJGLDWTotal }}条</span>&emsp;
          <span>情报线索：{{ QBXSTtotal }}条</span>&emsp;
          <span>警情：{{ JQTtotal }}条</span>&emsp;
          <span>用时：{{ totalTime }}秒</span>
        </div>
        <!-- 高级搜索结果集 -->
        <div>
          <div v-if="!generalResultWrap">
          <!-- 高级搜索 案件 table -->
          <el-table :data="tableAJList" style="width: 100%;" tooltip-effect="dark" v-if="ajTable" :max-height="tableHeight">
            <el-table-column type="index" width="100"></el-table-column>
            <el-table-column prop="AJBH" label="案件编号" show-overflow-tooltip v-if="showColumn.AJBH">
              <template slot-scope="scope">
                <span class="ajbh-color underLine"  @click="handleAjDetailAll(scope.row.AJBH)">{{scope.row.AJBH}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="AJMC" label="案件名称" width="160" show-overflow-tooltip
                             v-if="showColumn.AJMC"></el-table-column>
            <el-table-column prop="AJZT_NAME" label="案件状态" v-if="showColumn.AJZT_NAME"></el-table-column>
            <el-table-column prop="LARQ" label="立案时间" v-if="showColumn.LARQ">
              <template slot-scope="scope">
                <span v-if="scope.row.LARQ && scope.row.LARQ.length>6">{{$handlerDateTime(scope.row.LARQ)}}</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="AJLB_NAME" label="案件类别" v-if="showColumn.AJLB_NAME"></el-table-column>
            <el-table-column prop="RLBM" label="认领部门" v-if="showColumn.RLDW"></el-table-column>
            <el-table-column prop="BASJ" label="报案时间" width="160" v-if="showColumn.BASJ"></el-table-column>
            <el-table-column prop="JARQ" label="结案时间" width="160" v-if="showColumn.JARQ"></el-table-column>
            <el-table-column prop="LADW_NAME" label="立案单位" width="160" v-if="showColumn.LADW_NAME"></el-table-column>
            <el-table-column prop="PARQ" label="破案时间" width="160" v-if="showColumn.PARQ"></el-table-column>
            <el-table-column prop="SAJZ" label="涉案价值" width="160" v-if="showColumn.SAJZ"></el-table-column>
            <el-table-column prop="SLSJ" label="受理时间" width="160" v-if="showColumn.SLSJ"></el-table-column>
            <el-table-column prop="BARXM" label="报案人姓名" width="100" v-if="showColumn.BARXM"></el-table-column>
            <el-table-column prop="BARBM" label="报案人别名" width="100" v-if="showColumn.BARBM"></el-table-column>
            <el-table-column prop="BARXB_NAME" label="报案人性别" width="100" v-if="showColumn.BARXB_NAME"></el-table-column>
            <el-table-column prop="BARCSRQ" label="报案人出生日期" width="160" v-if="showColumn.BARCSRQ"></el-table-column>
            <el-table-column prop="BARZJHM" label="报案人证件号码" width="160" v-if="showColumn.BARZJHM"></el-table-column>
            <el-table-column prop="BARDW" label="报案人单位" width="160" v-if="showColumn.BARDW"></el-table-column>
            <el-table-column prop="BARLXFS" label="报案人联系方式" width="160" v-if="showColumn.BARLXFS"></el-table-column>
            <el-table-column prop="BARHJSZDSSXQ_NAME" label="报案人户籍所在地" width="160"
                             v-if="showColumn.BARHJSZDSSXQ_NAME"></el-table-column>
            <el-table-column prop="BARSJJZDSSXQ_NAME" label="报案人现居住所在地" width="160"
                             v-if="showColumn.BARSJJZDSSXQ_NAME"></el-table-column>
            <el-table-column prop="AJXZ_NAME" label="案件性质" width="160" v-if="showColumn.AJXZ_NAME"></el-table-column>
            <el-table-column prop="AJSX_NAME" label="案件属性" width="160" v-if="showColumn.AJSX_NAME"></el-table-column>
            <el-table-column prop="SLDW_NAME" label="受理单位" width="160" v-if="showColumn.SLDW_NAME"></el-table-column>
            <el-table-column prop="ZBDW_NAME" label="主办单位" width="160" v-if="showColumn.ZBDW_NAME"></el-table-column>
            <el-table-column prop="YSDW_NAME" label="移送单位" width="160" v-if="showColumn.YSDW_NAME"></el-table-column>
            <el-table-column prop="YSSJ" label="移送时间" width="160" v-if="showColumn.YSSJ"></el-table-column>
            <el-table-column prop="PADW_NAME" label="破案单位" width="160" v-if="showColumn.PADW_NAME"></el-table-column>
            <el-table-column prop="GDDW_NAME" label="归档单位" width="160" v-if="showColumn.GDDW_NAME"></el-table-column>
            <el-table-column prop="GDRQ" label="归档时间" width="160" v-if="showColumn.GDRQ"></el-table-column>
            <el-table-column prop="GDSPDW_NAME" label="归档审批单位" width="160"
                             v-if="showColumn.GDSPDW_NAME"></el-table-column>
            <el-table-column prop="SSZRQ_NAME" label="所属责任区" width="160" v-if="showColumn.SSZRQ_NAME"></el-table-column>
            <el-table-column prop="CZDW_NAME" label="案件操作单位" width="160" v-if="showColumn.CZDW_NAME"></el-table-column>
            <el-table-column prop="XZ_DCQKTBDW_NAME" label="案件调查情况填表单位" width="160"
                             v-if="showColumn.XZ_DCQKTBDW_NAME"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button title="详情" type="primary" plain @click="handleAjDetailAll(scope.row.AJBH)"
                           v-if="$isViewBtn('120004')">详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 高级搜索 嫌疑人 table -->
          <div class="xddw">
            <el-table :data="tableXYRList"   style="width: 100%;" tooltip-effect="dark" v-if="xyrTable" :max-height="tableHeight" @row-click="rowClick" :row-class-name="tableRowClassName">
              <el-table-column type="index" width="50"></el-table-column>
              <!-- <el-table-column prop="AJBH" label="案件编号" width="200" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="XYRBH" label="嫌疑人编号" width="160" show-overflow-tooltip
                              v-if="showColumn.XYRBH"></el-table-column>
              <el-table-column prop="XM" label="嫌疑人名称" width="200" v-if="showColumn.XM"></el-table-column>
              <el-table-column prop="GMSFHM" label="身份证号码" width="200" v-if="showColumn.GMSFHM">
                <template slot-scope="scope">
                  <!-- <span @click="showTipsC(scope.$index,scope.row.GMSFHM,'showCardCom1')">{{scope.row.GMSFHM}}&nbsp;</span> -->
                 <span class="zjhm" v-if="scope.row.GMSFHM" @click="handlePersonDetailAll(scope.row.GMSFHM)">{{scope.row.GMSFHM}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="MZ" label="民族" width="160" v-if="showColumn.MZ"></el-table-column>
              <el-table-column prop="CSRQ" label="出生日期" width="160" v-if="showColumn.CSRQ"></el-table-column>
              <el-table-column prop="XZQH" label="行政区划" width="160" v-if="showColumn.XZQH"></el-table-column>
              <el-table-column prop="WHCD" label="文化程度" width="160" v-if="showColumn.WHCD">
                <template slot-scope="scope">
                  {{getSelectLabel(WHCDList,scope.row.WHCD)}}
                </template>
              </el-table-column>
              <el-table-column prop="HYZK" label="婚姻状况" width="160" v-if="showColumn.HYZK">
                <template slot-scope="scope">
                  {{getSelectLabel(HYZKList,scope.row.HYZK)}}
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button title="详情" type="primary" plain @click="$gotoid('/handlingGuide/hybz/detail', scope.row.id)" v-if="$isViewBtn('120004')">详情</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <card-com v-if="showCardCom1" class="cardcom1" :cardId="curCardId" @close="clickBlank"></card-com>
            <!-- <card-com v-if="curIndex1===rowIndex1" class="cardcom1" :cardId="curCardId" @close="clickBlank" :style="{top:comTop}"></card-com> -->
          </div>
          <!-- 高级搜索 企业单位 table -->
          <div class="xddw">
            <el-table :data="tableAJGLDWList" style="width: 100%;" tooltip-effect="dark" v-if="ajgldwTable" :max-height="tableHeight" @row-click="rowClick2" :row-class-name="tableRowClassName">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="AJBH" label="案件编号" width="230" show-overflow-tooltip
                              v-if="showColumn.AJBH">
                <template slot-scope="scope">
                  <span class="ajbh-color underLine"  @click="handleAjDetailAll(scope.row.AJBH)">{{scope.row.AJBH}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="AJMC" label="案件名称" show-overflow-tooltip
                              v-if="showColumn.AJMC"></el-table-column>
              <el-table-column prop="DWMC" label="单位名称" v-if="showColumn.DWMC"></el-table-column>
              <el-table-column prop="FRDBXM" label="法人代表姓名"  v-if="showColumn.FRDBXM"></el-table-column>
              <el-table-column prop="FRDBGMSFHM" label="法人代表公民身份号码" width="200"
                              v-if="showColumn.FRDBGMSFHM">
                <template slot-scope="scope">
                  <!-- <span @click="showTipsC(scope.$index,scope.row.FRDBGMSFHM,'showCardCom2')">{{scope.row.FRDBGMSFHM}}&nbsp;</span> -->
                  <span class="zjhm"  @click="handlePersonDetailAll(scope.row.FRDBGMSFHM)">{{scope.row.FRDBGMSFHM}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="DWXZ_NAME" label="单位性质" width="160" v-if="showColumn.DWXZ_NAME"></el-table-column>
              <el-table-column prop="DWLX_NAME" label="单位类型" width="160" v-if="showColumn.DWLX_NAME"></el-table-column>
              <el-table-column prop="XYLB_NAME" label="行业类别" width="160" v-if="showColumn.XYLB_NAME"></el-table-column>
              <el-table-column prop="DWDH" label="单位联系方式" width="160" v-if="showColumn.DWDH"></el-table-column>
              <el-table-column prop="SWDJH" label="单位税务登记号" width="160" v-if="showColumn.SWDJH"></el-table-column>
              <el-table-column prop="WFFZSS" label="违法犯罪事实" width="160" v-if="showColumn.WFFZSS"></el-table-column>
              <el-table-column prop="CFRQ" label="单位处罚日期" width="160" v-if="showColumn.CFRQ"></el-table-column>
              <el-table-column prop="CFLX_NAME" label="处罚类型" width="160" v-if="showColumn.CFLX_NAME"></el-table-column>
              <el-table-column prop="CFQK" label="处罚情况" width="160" v-if="showColumn.CFQK"></el-table-column>
              <el-table-column prop="CFDW_NAME" label="处罚单位" width="160" v-if="showColumn.CFDW_NAME"></el-table-column>
              <el-table-column prop="BAR_NAME" label="办案人" width="160" v-if="showColumn.BAR_NAME"></el-table-column>
              <el-table-column prop="WFZJ" label="违法证据" width="160" v-if="showColumn.WFZJ"></el-table-column>
              <el-table-column prop="ZJZRR" label="直接责任人" width="160" v-if="showColumn.ZJZRR"></el-table-column>
              <el-table-column prop="ZGRY" label="主管人员" width="160" v-if="showColumn.ZGRY"></el-table-column>
              <el-table-column prop="JYSM" label="简要说明" width="160" v-if="showColumn.JYSM"></el-table-column>
              <el-table-column prop="DJDW_NAME" label="登记单位" width="160" v-if="showColumn.DJDW_NAME"></el-table-column>
              <el-table-column prop="DJR_NAME" label="登记人" width="160" v-if="showColumn.DJR_NAME"></el-table-column>
              <el-table-column prop="DJRQ" label="登记日期" width="160" v-if="showColumn.DJRQ"></el-table-column>
              <el-table-column prop="CZDW_NAME" label="操作单位" width="160" v-if="showColumn.CZDW_NAME"></el-table-column>
              <el-table-column prop="CZR_NAME" label="操作人" width="160" v-if="showColumn.CZR_NAME"></el-table-column>
              <el-table-column prop="CZSJ" label="操作时间" width="160" v-if="showColumn.CZSJ"></el-table-column>
              <el-table-column prop="SJSSJE" label="实际损失金额" width="160" v-if="showColumn.SJSSJE"></el-table-column>
              <el-table-column prop="SAJE" label="涉案金额" width="160" v-if="showColumn.SAJE"></el-table-column>
              <el-table-column prop="WHSSJE" label="挽回损失金额" width="160" v-if="showColumn.WHSSJE"></el-table-column>
              <el-table-column prop="ZXFS_NAME" label="执行方式" width="160" v-if="showColumn.ZXFS_NAME"></el-table-column>
              <!-- <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button title="详情" type="primary" plain @click="$gotoid('/handlingGuide/hybz/detail', scope.row.id)" v-if="$isViewBtn('120004')">详情</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <card-com v-if="showCardCom2" class="cardcom2" :cardId="curCardId" @close="clickBlank"></card-com>
            <!-- <card-com v-if="curIndex2===rowIndex2" class="cardcom2" :cardId="curCardId" @close="clickBlank" :style="{top:comTop2}"></card-com> -->
          </div>
          <!-- 高级搜索 情报线索 table -->
          <el-table :data="tableQBXSList" style="width: 100%;" tooltip-effect="dark" v-if="qbxsTable" :max-height="tableHeight">
            <el-table-column type="index" width="100"></el-table-column>
            <el-table-column prop="BT" label="标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="XXZW" label="正文" show-overflow-tooltip
                             v-if="showColumn.XXZW"></el-table-column>
            <el-table-column prop="SSLB_NAME" label="涉事类别" v-if="showColumn.SSLB_NAME"></el-table-column>
            <el-table-column prop="ASSJ" label="时间" width="180" v-if="showColumn.ASSJ"></el-table-column>
            <el-table-column prop="ASDDLB_NAME" label="地点类别"></el-table-column>
            <el-table-column prop="XSZT_NAME" label="线索状态" v-if="showColumn.XSZT_NAME"></el-table-column>
            <el-table-column prop="XSPJ" label="线索评级" v-if="showColumn.XSPJ"></el-table-column>
            <el-table-column prop="GJC" label="关键字" v-if="showColumn.GJC"></el-table-column>
            <el-table-column prop="XSPJ" label="线索评级" v-if="showColumn.XSPJ"></el-table-column>
            <el-table-column prop="CJR_NAME" label="情报线索采集人"  v-if="showColumn.CJR_NAME"></el-table-column>
            <el-table-column prop="ASJFSDSSSS_NAME" label="发生地所属省市"  show-overflow-tooltip
                             v-if="showColumn.ASJFSDSSSS_NAME"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button title="详情" type="primary" plain @click="handleQbxsDetail(scope.row.ID, scope.row)"
                           v-if="$isViewBtn('120004')">详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 普通搜索结果集 -->
        <div class="searchResultWrap" v-if="generalResultWrap"  :style="{maxHeight:contListHeight}">
          <div v-for="(item,index) in dataList" :key="index"  class="xddw" >
            <!-- 案件 -->
            <div class="clearfix result_cell" v-if="item.condition === 'aj'">
              <el-col :span="2" style="text-align:center;">
                <svg-icon icon-class="lawcase_b"></svg-icon>
              </el-col>
              <el-col :span="8">
                <p  class="pdr" :class="{'beyondTextClass':(isUnfoldajbhIndex===index ? isUnfoldajbh:true)}" @click="unfold('isUnfoldajbh',index)" >{{item.AJMC}}<span class="ajbh-color" v-if="item.AJBH" @click="handleAjDetailAll(item.AJBH)">（{{item.AJBH}}）</span>
                </p>
                <p v-if="item.RLBM">认领单位：{{item.RLBM}}</p>
                <p v-if="item.AJLB_NAME">案件类别：{{item.AJLB_NAME}}</p>
                <p v-if="item.SYH_FLLB">案件细类：{{item.SYH_FLLB_NAME}}</p>
                <!-- 分类 取的 细类数组 的第一个元素 -->
              </el-col>
              <el-col :span="10">
                <p v-if="item.SYH_FLLB">案件分类：{{getFllbName(item.SYH_FLLB)}}</p>
                <p v-if="item.AJZT">案件状态：{{item.AJZT}}</p>
                <p v-if="item.LARQ">立案日期：{{$handlerDateTime(item.LARQ)}}</p>
                <p v-if="item.JYAQ" :class="{'beyondTextClass':(isUnfoldjyajIndex===index ? isUnfoldjyaj:true)}" @click="unfold('isUnfoldjyaj',index)" style="word-break: break-all;">简要案情：{{item.JYAQ}}</p>
              </el-col>
            </div>
            <!-- 嫌疑人 -->
            <div class="clearfix result_cell" v-if="item.condition === 'xyr'">
              <el-col :span="2" style="text-align:center;">
                <svg-icon icon-class="xyr_b"></svg-icon>
              </el-col>
              <el-col :span="8">
                <p>{{item.XM}}<span class="ajbh-color" v-if="item.GMSFHM" @click="handlePersonDetailAll(item.GMSFHM)">（{{item.GMSFHM}}）</span>
                </p>
                <p v-if="item.XYRBH">嫌疑人编号：{{item.XYRBH}}</p>
                <p v-if="item.CSRQ">出生日期：{{item.CSRQ}}</p>
                <p v-if="item.HJDZXZ">户籍详址：{{item.HJDZXZ}}</p>
              </el-col>
              <el-col :span="8">
                <p v-if="item.AJBH">
                  案件编号：<span class="ajbh-color" v-if="item.AJBH" @click="handleAjDetailAll(item.AJBH)">（{{item.AJBH}}）</span>
                </p>
                <p v-if="item.MZ_NAME">民族：{{item.MZ_NAME}}</p>
                <p v-if="item.XZQH_NAME">户籍区划：{{item.XZQH_NAME}}</p>
              </el-col>
              <el-col :span="6">
                <p v-if="item.XB_NAME">性别：{{item.XB_NAME}}</p>
                <p v-if="item.WHCD_NAME">文化程度：{{item.WHCD_NAME}}</p>
                <p v-if="item.HYZK_NAME">婚姻状况：{{item.HYZK_NAME}}</p>
              </el-col>
            </div>
            <!-- 企业单位 -->
            <div class="clearfix result_cell" v-if="item.condition === 'ajgldw'">
              <el-row v-if="item.category==='company'">
                <el-col :span="2" style="text-align:center;">
                  <svg-icon icon-class="company_b"></svg-icon>
                </el-col>
                <el-col :span="8">
                  <p class="pdr" :class="{'beyondTextClass':(isUnfoldcompanyIndex===index ? isUnfoldcompany:true)}" @click="unfold('isUnfoldcompany',index,item)" style="cursor:pointer;">{{item.companyName}}<span class="ajbh-color" v-if="item.unicode">（{{item.unicode}}）</span></p>
                  <p>行政区划：{{item.area}}</p>
                  <p>法人代表姓名：{{item.legalPerson}}</p>
                  <!-- <p>单位电话：{{item.companyTel}}</p> -->
                </el-col>
                <el-col :span="8">
                  <p>行政处罚次数：{{item.penaltyNumber}}</p>
                  <p :class="{'beyondTextClass': (isUnfoldzcdzIndex===index ? isUnfoldzcdz:true)}" @click="unfold('isUnfoldzcdz',index)">注册地址：{{item.registerAddress}}</p>
                  <p v-if="item.legalPersonCard">
                    身份证号码：<span class="zjhm" @click="handlePersonDetailAll(item.legalPersonCard)">{{item.legalPersonCard}}</span>
                  </p>
                  <!-- <p  @click="showTipsC(index,item.legalPersonCard,'showCardCom3')">身份证号码：{{item.legalPersonCard}}</p>
                  <card-com v-if="item.legalPersonCard && curIndex3===index" class="cardcom3" :cardId="curCardId" @close="clickBlank"></card-com> -->
                </el-col>
                <el-col :span="6">
                  <p>涉案次数：{{item.involvedCaseNumber}}</p>
                  <p>员工人数：{{item.personNumber}}</p>
                  <p>联系电话：{{item.legalPersonPhone}}</p>
                </el-col>
                <el-col>
                  <el-col :span="2" style="height:21px;"></el-col>
                  <el-col :span="8">
                    <p>单位电话：{{item.companyTel}}</p>
                  </el-col>
                  <el-col :span="14">
                    <p  :class="{'beyondTextClass': (isUnfoldjyfwIndex===index ? isUnfoldjyfw:true)}" @click="unfold('isUnfoldjyfw',index)">经营范围：{{item.manageScope}}</p>
                  </el-col>
                </el-col>
              </el-row>
              <el-row v-if="item.category==='pitch'">
                <el-col :span="2" style="text-align:center;">
                  <svg-icon icon-class="pedlar_b"></svg-icon>
                </el-col>
                <el-col :span="8">
                  <p class="pdr" :class="{'beyondTextClass': (isUnfoldpitchIndex===index ? isUnfoldpitch:true)}" @click="unfold('isUnfoldpitch',index,item)" style="cursor:pointer;">{{item.name}}</p>
                  <p>行政区划：{{item.area}}</p>
                  <p>负责人：{{item.personName}}</p>
                </el-col>
                <el-col :span="8">
                  <p>摊位位置：{{item.address}}</p>
                  <!-- <p  @click="showTipsC(index,item.cardNumber,'showCardCom4')">身份证号码：{{item.cardNumber}}</p> -->
                  <p v-if="item.cardNumber">
                    身份证号码：<span class="zjhm" @click="handlePersonDetailAll(item.cardNumber)">{{item.cardNumber}}</span>
                  </p>
                  <!-- <card-com v-if="item.cardNumber && curIndex4===index" class="cardcom4" :cardId="curCardId" @close="clickBlank"></card-com> -->
                  <p>风险等级：{{item.grade}}</p>
                </el-col>
                <el-col :span="6">
                  <p>备案登记号：{{item.registerNumber}}</p>
                  <p>分类等级：{{item.type}}</p>
                  <p>联系电话：{{item.phone}}</p>
                </el-col>
                <el-col :span="19" :offset="2">
                  <p :class="{'beyondTextClass': (isUnfoldjyxmIndex===index ? isUnfoldjyxm:true)}" @click="unfold('isUnfoldjyxm',index)">经营项目：{{item.manageProject}}</p>
                </el-col>
              </el-row>
              <el-row v-if="item.DWMC">
                <el-col :span="2" style="text-align:center;">
                  <svg-icon icon-class="company_b"></svg-icon>
                </el-col>
                <el-col :span="8">
                  <p class="pdr" :class="{'beyondTextClass':( isUnfolddwmcIndex===index ?  isUnfolddwmc:true)}" @click="unfold('isUnfolddwmc',index)">{{item.DWMC}}<span class="ajbh-color" v-if="item.SWDJH">（{{item.SWDJH}}）</span></p>
                  <p>行业类别：{{item.XYLB_NAME}}</p>
                  <p v-if="item.FRDBXM">法人代表姓名：{{item.FRDBXM}}</p>
                </el-col>
                <el-col :span="8">
                  <!-- <p v-if="item.AJBH">案件编号：{{item.AJBH}}</p> -->
                  <p v-if="item.AJBH">
                    案件编号：<span class="ajbh-color" v-if="item.AJBH" @click="handleAjDetailAll(item.AJBH)">（{{item.AJBH}}）</span>
                  </p>
                  <p v-if="item.DWDH">联系方式：{{item.DWDH}}</p>
                  <!-- <p v-if="item.FRDBGMSFHM" @click="showTipsC(index,item.FRDBGMSFHM,'showCardCom')"> -->
                  <p v-if="item.FRDBGMSFHM">
                    身份证号码：<span class="zjhm" @click="handlePersonDetailAll(item.FRDBGMSFHM)">{{item.FRDBGMSFHM}}</span>
                  </p>
                  <!-- <card-com v-if="item.AJBH && curIndex===index" class="cardcomsfz" :cardId="curCardId" @close="clickBlank"></card-com> -->
                </el-col>
                <el-col :span="6">
                  <p v-if="item.DWXZ_NAME">单位性质：{{item.DWXZ_NAME}}</p>
                  <p v-if="item.DWLX_NAME">单位类型：{{item.DWLX_NAME}}</p>
                </el-col>
                <el-col :span="20" :offset="2">
                  <p v-if="item.WFFZSS" :class="{'beyondTextClass': ( isUnfoldwffzIndex===index ?  isUnfoldwffz:true)}" @click="unfold('isUnfoldwffz',index)">违法犯罪事实：{{item.WFFZSS}}</p>
                </el-col>
              </el-row>
            </div>
            <!-- 情报线索 -->
            <div class="clearfix result_cell" v-if="item.condition === 'qbxs'">
              <el-col :span="2" style="text-align:center;">
                <svg-icon icon-class="clue_b"></svg-icon>
              </el-col>
              <el-col :span="8">
                <p>
                  <span class="ajbh-color" @click="handleQbxsDetail(index, item)">{{item.BT}}</span>
                </p>
                <p v-if="item.FSZT_NAME">发生状态：{{item.FSZT_NAME}}</p>
                <p v-if="item.ASSJ">发生时间：{{item.ASSJ}}</p>
                <!-- <p v-if="item.XSZT_NAME">线索状态：{{item.XSZT_NAME}}</p> -->
              </el-col>
              <el-col :span="8">
                <p v-if="item.SJRS_NAME">涉及人数：{{item.SJRS_NAME}}</p>
                <p v-if="item.ASDDLB_NAME">地点类别：{{item.ASDDLB_NAME}}</p>
              </el-col>
              <el-col :span="6">
                <p v-if="item.SJSS_NAME">涉及损失：{{item.SJSS_NAME}}</p>
                <p v-if="item.SSLB_NAME">涉事类别：{{item.SSLB_NAME}}</p>
              </el-col>
              <el-col :span="20">
                <p v-if="item.XXZW" v-html="'线索正文：'+ item.XXZW" class="inlineWrap" :class="{'beyondTextClass': ( isUnfoldxszwIndex===index ? isUnfoldxszw:true)}"  @click="unfold('isUnfoldxszw',index)"></p>
              </el-col>
            </div>
            <!-- 警情 -->
            <div class="clearfix result_cell" v-if="item.condition === 'jcj'">
              <el-col :span="2" style="text-align:center;margin-top:36px;">
                <svg-icon icon-class="jq_b" style="font-size:18px;"></svg-icon>
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="8">
                    <p>
                      警情名称：<span class="ajbh-color" @click="handleJcjDetail(index, item)">{{item.xzJqmc}}</span>
                      <el-button type="primary" icon="el-icon-document" circle @click="handleJcjDetail(index, item)"></el-button>
                      <!-- <svg-icon icon-class="company_b"></svg-icon> -->
                    </p>
                    <p>接警人：{{item.jjrName}}</p>
                    <p>出警时间：{{$handlerDateTime(item.cjsj)}}</p>
                  </el-col>
                  <el-col :span="8">
                    <p>接警时间：{{$handlerDateTime(item.jjsj)}}</p>
                    <p>报警人：{{item.bjr}}</p>
                    <p>出警单位：{{item.czhdwName}}</p>
                  </el-col>
                  <el-col :span="6">
                    <p>管辖地：{{item.gxdName}}</p>
                    <!-- <p @click="showTipsC(index,item.bjrzjhm,'showCardCom5')">证件号码：{{item.bjrzjhm}}</p> -->
                    <p v-if="item.bjrzjhm">
                      证件号码：<span class="ajbh-color"  @click="handlePersonDetailAll(item.bjrzjhm)">{{item.bjrzjhm}}</span>
                    </p>
                    <!-- <card-com v-if="item.bjrzjhm && curIndex5===index" class="cardcom5" :cardId="curCardId" @close="clickBlank"></card-com> -->
                    <p >出警人：{{item.czhrName}}</p>
                  </el-col>
                  <el-col :span="24">
                    <p v-if="item.bjnr" v-html="'报警内容：'+ item.bjnr" class="inlineWrap" :class="{'beyondTextClass': ( isUnfoldbjnrIndex===index ? isUnfoldbjnr:true)}"  @click="unfold('isUnfoldbjnr',index)"></p>
                    <p v-if="item.cjxq" v-html="'处警情况：'+ item.cjxq" class="inlineWrap" :class="{'beyondTextClass': ( isUnfoldcjxqIndex===index ? isUnfoldcjxq:true)}"  @click="unfold('isUnfoldcjxq',index)"></p>
                  </el-col>
                </el-row>
              </el-col>
            </div>
            <!--常驻人员-->
            <el-row class="clearfix result_cell" style="border-bottom: 0" v-if="item.condition === 'czrk'">
              <el-col :span="3" v-if="isIdCard">
                <div class="img_wrap">
                  <img :src="'data:image/jpeg;base64,'+item.xp" class="avatar" v-if="item.xp"/>
                </div>
              </el-col>
              <el-col :span="20">
                <el-row class="czrkPline">
                  <el-col :span="10" class="czrkT">{{item.xm}} <span class="ajbh-color"  @click="handlePersonDetailAll(item.gmsfhm)">（{{item.gmsfhm}}）</span></el-col>
                  <el-col :span="2" class="textRight">性别：</el-col>
                  <el-col :span="2">{{item.xbMc}}</el-col>
                  <el-col :span="5" class="textRight">文化程度：</el-col>
                  <el-col :span="5">{{item.whcdMc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="10" class="czrkT">出生日期：{{item.csrq}}</el-col>
                  <el-col :span="2" class="textRight">民族：</el-col>
                  <el-col :span="2">{{item.mzMc}}</el-col>
                  <el-col :span="5" class="textRight">宗教信仰：</el-col>
                  <el-col :span="5">{{item.zjxyMc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="8" class="czrkT">婚姻状况：{{item.hyzkMc}}</el-col>
                  <el-col :span="4" class="textRight">籍贯区划：</el-col>
                  <el-col :span="12">{{item.jgssxqMc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="8" class="czrkT">职业类别：{{item.zylbMc}}</el-col>
                  <el-col :span="4" class="textRight">出生地区划：</el-col>
                  <el-col :span="12">{{item.csdssxqMc}}</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="clearfix result_cell" style="border-bottom: 0" v-if="item.condition === 'czrkList'">
              <el-col :span="3" v-if="isIdCard">
                <div class="img_wrap">
                  <img :src="'data:image/jpeg;base64,'+item.xp" class="avatar" v-if="item.xp"/>
                </div>
              </el-col>
              <el-col :span="20">
                <el-row class="czrkPline">
                  <el-col :span="10" class="czrkT">{{item.xm}} <span class="ajbh-color"  @click="handlePersonDetailAll(item.gmsfhm)">（{{item.gmsfhm}}）</span></el-col>
                  <el-col :span="2" class="textRight">性别：</el-col>
                  <el-col :span="2">{{item.xbmc}}</el-col>
                  <el-col :span="5" class="textRight">文化程度：</el-col>
                  <el-col :span="5">{{item.whcdmc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="10" class="czrkT">出生日期：{{$handlerDateTime(item.csrq)}}</el-col>
                  <el-col :span="2" class="textRight">民族：</el-col>
                  <el-col :span="2">{{item.mzmc}}</el-col>
                  <el-col :span="5" class="textRight">宗教信仰：</el-col>
                  <el-col :span="5">{{item.zjxymc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="8" class="czrkT">婚姻状况：{{item.hyzkmc}}</el-col>
                  <el-col :span="4" class="textRight">籍贯区划：</el-col>
                  <el-col :span="12">{{item.jgssxqmc}}</el-col>
                </el-row>
                <el-row class="czrkPline">
                  <el-col :span="8" class="czrkT">职业类别：{{item.zylbmc}}</el-col>
                  <el-col :span="4" class="textRight">出生地区划：</el-col>
                  <el-col :span="12">{{item.csdssxqmc}}</el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        </div>
      </el-card>
      <el-col :span="24" class="toolbar" v-if="menuCondition !== 6">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
    <!-- 接处警详情 -->
    <el-dialog :visible.sync="jcjDialogVisible" width="78%">
      <jcj-detail :jcjbh="curJcjbh"></jcj-detail>
    </el-dialog>
  </section>
</template>

<script>
// import {
//   personByCardId
// } from '@/api/personSearch/personSearch'
import {
  identityCodeValid
} from '@/utils/validate'
import {
  getSpecialmodeList
} from '@/api/specialmode'
import {
  getAJZTSelect, getHYZKSelect, getWHCDSelect, getXBSelect, getSYHFLLBList, getAJSXList
} from '@/utils/codetotext'
import { getSessionDeptSelect } from '@/api/depts'
import { getGXHTJXJ } from '@/api/dept'
import { getCityTree } from '@/api/citys'
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
import jcjDetail from './jcjDetail'
import $ from 'jquery'
export default {
  name: 'personalSearch',
  data() {
    return {
      searchType: '0', // 默认 一般搜索
      btnText: '搜索',
      menuCondition: 0, // 查询某一类型
      searchMenuList: [
        {
          text: '所有',
          active: 1,
          img: 'all',
          style: 'font-size:14px;margin-bottom:3px;'
        }, {
          text: '案件',
          active: 0,
          img: 'lawcase',
          style: 'font-size:14px;margin-bottom:3px;'
        }, {
          text: '嫌疑人',
          active: 0,
          img: 'xyr'
        }, {
          // text: '单位',
          text: '案件关联单位',
          active: 0,
          img: 'company',
          style: 'font-size:14px;margin-bottom:3px;'
        }, {
          text: '情报线索',
          active: 0,
          img: 'clue',
          style: 'font-size:14px;margin-bottom:3px;'
        }, {
          text: '警情',
          active: 0,
          img: 'jq',
          style: 'font-size:16px;margin-bottom:0px;'
        }, {
          text: '常住人口',
          active: 0,
          img: 'czrk'
        }, {
          text: '外部资源',
          active: 0,
          img: 'usb'
        }],
      hasBatch: 0,
      batchShow: false,
      filters: {
        word: ''
      },
      seniorForm: {},
      showFields: {},
      showColumn: {},
      loading: false,
      total: 0,
      page: 1,
      pageSize: 15,
      totalTime: '',
      dataList: [],
      AJTotal: 0,
      AJGLDWTotal: 0,
      XYRTotal: 0,
      QBXSTtotal: 0,
      JQTtotal: 0,
      tableAJList: [],
      tableXYRList: [],
      tableAJGLDWList: [],
      tableQBXSList: [],
      advancedAJFormShow: false,
      advancedXYRFormShow: false,
      advancedAJGLDWFormShow: false,
      advancedQBXSFormShow: false,
      curUserId: '',
      curUser: {},
      curDept: {},
      ajztOptions: [],
      cascaderOptions: [
        {
          value: '1000',
          label: '食品',
          children: [
            {
              value: '1010',
              label: '食品中可能违法添加的非食用物质名单'
            }, {
              value: '1020',
              label: '食品中可能滥用的食品添加剂品种名单'
            },
            {
              value: '1030',
              label: '其它食品标准'
            }
          ]
        }, {
          value: '2000',
          label: '药品',
          children: [
            {
              value: '2010',
              label: '保健食品中易非法添加的物质和组分及检测依据'
            }, {
              value: '2020',
              label: '化妆品中易非法添加的物质、组分及检测依据'
            }, {
              value: '2030',
              label: '含可待因复方口服溶液品种目录',
              children: [{
                value: '2031',
                label: '国产'
              }, {
                value: '2032',
                label: '进口'
              }]
            },
            {
              value: '2040',
              label: '其它药品标准'
            }
          ]
        }, {
          value: '3000',
          label: '环境',
          children: [{
            value: '01',
            label: '其它环境标准'
          }]
        }, {
          value: '4000',
          label: '综合'
        }],
      ajTable: false,
      xyrTable: false,
      ajgldwTable: false,
      qbxsTable: false,
      cityOptions: [],
      props: {
        label: 'cityName',
        value: 'cityCode'
      },
      RLDWprops: {
        label: 'name',
        value: 'depCode'
      },
      // paramDept: '010000', // 常住人口查下需要传入的部门
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      getAJZTList: getAJZTSelect(), // 案件状态
      XBList: getXBSelect(), // 性别
      WHCDList: getWHCDSelect(), // 文化程度
      HYZKList: getHYZKSelect(), // 婚姻状态
      SYHFLLBList: getSYHFLLBList(), // 案件分类类别
      AJSXList: getAJSXList(), // 案件属性
      AJXZList: [], // 案件性质
      SYHRLDWList: [], // 认领单位
      generalResultWrap: true, // 查询结果集 是否显示，默认true显示普通结果集容器
      isIdCard: false, // 是身份证查询
      isUnfoldjyaj: true, // 简要案情是否添加省略样式类
      isUnfoldzcdz: true, // 注册地址是否添加省略样式类
      isUnfoldjyfw: true, // 经营范围是否添加省略样式类
      isUnfoldjyxm: true, // 经营项目是否添加省略样式类
      isUnfoldwffz: true, // 违法犯罪事实是否添加省略样式类
      isUnfoldxszw: true, // 线索正文是否添加省略样式类
      isUnfoldpitch: true, // 摊位名称是否添加省略样式类
      isUnfoldcompany: true, // 企业名称是否添加省略样式类
      isUnfolddwmc: true, // 单位名称是否添加省略样式类
      isUnfoldajbh: true, // 案件名称是否添加省略样式类
      isUnfoldbjnr: true, // 警情 报警内容
      isUnfoldcjxq: true, // 警情 处警详情
      isUnfoldjyajIndex: 0, // 简要案情当前被点击的索引值，默认是0
      isUnfoldzcdzIndex: 0, // 注册地址当前被点击的索引值，默认是0
      isUnfoldjyfwIndex: 0, // 经营范围当前被点击的索引值，默认是0
      isUnfoldjyxmIndex: 0, // 经营项目当前被点击的索引值，默认是0
      isUnfoldwffzIndex: 0, // 违法犯罪事实当前被点击的索引值，默认是0
      isUnfoldxszwIndex: 0, // 线索正文当前被点击的索引值，默认是0
      isUnfoldpitchIndex: 0, // 摊位名称当前被点击的索引值，默认是0
      isUnfoldcompanyIndex: 0, // 企业名称当前被点击的索引值，默认是0
      isUnfolddwmcIndex: 0, // 单位名称当前被点击的索引值，默认是0
      isUnfoldajbhIndex: 0, // 案件名称当前被点击的索引值，默认是0
      isUnfoldbjnrIndex: 0, // 警情 报警内容
      isUnfoldcjxqIndex: 0, // 警情 处警详情
      showCardCom1: false, // 身份证查询旁的快捷查询组件---高级搜索 嫌疑人 是否显示
      showCardCom2: false, // 身份证查询旁的快捷查询组件---高级搜索 案件关联单位 是否显示
      curIndex: '', // 当前被点击的列表索引--普通搜索案件关联单位-如果有单位名称
      curIndex3: '', // 当前被点击的列表索引--普通搜索案件关联单位-company
      curIndex4: '', // 当前被点击的列表索引--普通搜索案件关联单位-pitch
      curIndex5: '', // 当前被点击的列表索引--普通搜索警情
      curCardId: '', // 当前被点击的身份证号
      isShowBack: false, // 是否显示返回按钮
      curJcjbh: {}, // 当前接处警详情
      jcjDialogVisible: false, // 是否显示接处警详情弹框
      contListHeight: null,
      tableHeight: null,
      rowIndex1: 0,
      comTop: null,
      rowIndex2: 0,
      comTop2: null
    }
  },
  components: {
    cardCom,
    jcjDetail
  },
  methods: {
    handleClick(val) { // 下拉菜单按钮
      this.page = 1 // 切换条件后 页数手动置为1
      this.pageSize = 15 // 切换条件后 条数数手动置为15
      if (this.searchType === '1') {
        this.querySenior(this.menuCondition) // 高级搜索
      } else {
        if (this.filters.word) { // 查询字段 关键字
          this.query(this.menuCondition) // 普通搜索
        } else {
          this.$message.error('关键字不能为空')
        }
      }
    },
    getSelectList(type) {
      const para = {
        codelx: type
      }
      this.$query('CODENAMEQUERY', para).then((response) => {
        if (type === 'ajxz') {
          this.AJXZList = response.data
        }
      })
    },
    handleCommand(command) {
      this.advancedAJFormShow = false
      this.advancedXYRFormShow = false
      this.advancedAJGLDWFormShow = false
      this.advancedQBXSFormShow = false
      this.total = 0
      this.AJTotal = 0
      this.AJGLDWTotal = 0
      this.XYRTotal = 0
      this.QBXSTtotal = 0
      this.JQTtotal = 0
      this.tableAJList = []
      this.tableXYRList = []
      this.tableAJGLDWList = []
      this.tableQBXSList = []
      this.totalTime = ''
      this.dataList = []
      this.filters.word = '' // 清空查询 关键字 input输入框
      if (command === '0') {
        this.searchType = '0'
        this.btnText = '搜索'
        this.generalResultWrap = true
        this.chooseMenu(0) // 普通搜索 默认 所有
      } else if (command === '1') {
        if (this.menuCondition === 5) {
          this.$message.warning('警情不支持高级搜索')
          return false
        }
        if (this.menuCondition === 6) {
          this.$message.warning('常住人口不支持高级搜索')
          return false
        }
        this.searchType = '1'
        this.btnText = '高级搜索'
        this.generalResultWrap = false
        this.getDepts()
        this.chooseMenu(1) // 高级搜索 默认 案件
      }
    },
    chooseMenu(index) {
      this.showCardCom1 = false
      this.showCardCom2 = false
      if (index === 0 && this.searchType === '1') { // 高级搜索不能点击所有
        this.$message.error('高级搜索 不能选择所有')
      } else if (index === 5 && this.searchType === '1') { // 高级搜索不支持警情
        this.$message.error('高级搜索 不能选择警情')
      } else if (index === 6 && this.searchType === '1') { // 高级搜索不支持常住人员
        this.$message.error('高级搜索 不能选择常住人口')
      } else {
        this.searchMenuList.forEach(element => {
          element.active = 0
        })
        this.searchMenuList[index].active = 1 // 选中的 设置样式
        this.menuCondition = index // 更新 menuCondition 的值
        if (this.searchType === '1') { // 高级搜索
          this.advancedAJFormShow = false
          this.advancedXYRFormShow = false
          this.advancedAJGLDWFormShow = false
          this.advancedQBXSFormShow = false
          // 查询form表单
          if (index === 1) {
            this.getSelectField('aj')
            this.advancedAJFormShow = true
          } else if (index === 2) {
            this.getSelectField('xyr')
            this.advancedXYRFormShow = true
          } else if (index === 3) {
            this.getSelectField('ajgldw')
            this.advancedAJGLDWFormShow = true
          } else if (index === 4) {
            this.getSelectField('qbxs')
            this.advancedQBXSFormShow = true
          }
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      if (this.searchType === '0') {
        this.query(this.menuCondition) // 普通查询
      } else if (this.searchType === '1') {
        this.querySenior(this.menuCondition) // 高级搜索
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      if (this.searchType === '0') {
        this.query(this.menuCondition) // 普通查询
      } else if (this.searchType === '1') {
        this.querySenior(this.menuCondition) // 高级搜索
      }
    },
    handleChange(value) {
      this.handleClick()
    },
    getSelectField(menuType) { // 获取 可查询的form表单字段
      this.loading = true
      this.ajTable = false
      this.xyrTable = false
      this.ajgldwTable = false
      this.qbxsTable = false
      // this.dataList = this.dataAJList
      const para = {
        type: '2',
        userid: this.curUser.id,
        condition: menuType
      }
      this.$query('config', para).then((response) => {
        this.showFields = {}
        this.showColumn = {}
        this.loading = false
        if (response.data[0]['config'] === undefined) { // 已配置过
          response.data.forEach(element => {
            this.showFields[element.column_name] = element.is_search
            this.showColumn[element.column_name] = element.is_show
          })
        } else { // 未配置
          if (response.data[0].config === 0) {
            const defaultField = response.data[0].column_name.split(',')
            defaultField.forEach(element => {
              this.showFields[element] = true
              this.showColumn[element] = true
            })
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    query(menuCondition) { // 普通搜索
      this.curIndex = ''
      this.curIndex1 = ''
      this.curIndex2 = ''
      this.curIndex3 = ''
      this.curIndex4 = ''
      this.curIndex5 = ''
      this.curCardId = ''
      this.showCardCom1 = false
      this.showCardCom2 = false
      const sendDate = (new Date()).getTime()
      this.dataList = []
      this.total = 0
      this.AJTotal = 0
      this.AJGLDWTotal = 0
      this.XYRTotal = 0
      this.QBXSTtotal = 0
      this.JQTtotal = 0
      let requestSign = '' // 省市县的标志
      if (this.curDept.depCode === '610000') { // 省厅
        requestSign = 'province'
      } else if (this.curDept.depCode.substring(4, 6) === '00') { // 市
        requestSign = 'city'
      } else { // 旗县
        requestSign = 'area'
      }

      if (menuCondition === 6) { // 常驻人口搜索
        this.queryCZRK(sendDate)
        return true
      }
      const para = {
        pageNum: this.page,
        param: this.filters.word ? this.filters.word : '', // 关键字
        userid: this.curUserId, // 用户id
        condition: menuCondition, // 查询条件
        depCode: this.curDept.depCode, // 所属部门code
        requestSign: requestSign, // 省市县的标志
        pageSize: this.pageSize
      }
      if (menuCondition === 0) {
        para.condition = 'all'
      } else if (menuCondition === 1) { // 案件
        para.condition = 'aj'
      } else if (menuCondition === 2) { // 嫌疑人
        para.condition = 'xyr'
      } else if (menuCondition === 3) { // 案件关联单位
        para.condition = 'ajgldw'
      } else if (menuCondition === 4) { // 情报线索
        para.condition = 'qbxs'
      } else if (menuCondition === 5) { // 警情
        para.condition = 'jcj'
        if (para.param.indexOf('-') || para.param.indexOf(':')) { // 时间库里保存的没有横线 冒号 空格
          para.param = para.param.replace(/\s+/g, '').replace(/-/g, '').replace(/:/g, '')
        }
      }
      this.loading = true
      this.$query('personalized', para).then((response) => {
        this.loading = false
        const receiveDate = (new Date()).getTime()
        const responseTimeMs = receiveDate - sendDate
        this.totalTime = responseTimeMs / 1000
        if (response.data) {
          if (response.data.ALL) { // 所有
            response.data.ALL.forEach(element => {
              if (element.SYH_FLLB) {
                element.SYH_FLLB_NAME = this.getCascaderName(element.SYH_FLLB.split(','))
              }
              if (element.AJZT) {
                element.AJZT = this.getSelectLabel(this.getAJZTList, element.AJZT)
              }
            })
            this.dataList = response.data.ALL
            this.total = response.data.ALLCOUNT // 总条数
            this.AJTotal = response.data.AJCOUNT // 案件条数
            this.AJGLDWTotal = response.data.AJGLDWCOUNT // 企业单位条数
            this.XYRTotal = response.data.XYRCOUNT // 嫌疑人条数
            this.QBXSTtotal = response.data.QBXSCOUNT // 情报线索条数
            this.JQTtotal = response.data.JCJCOUNT // 警情条数
          }
          if (response.data.AJ) { // 案件
            response.data.AJ.forEach(element => {
              if (element.AJZT) {
                element.AJZT = this.getSelectLabel(this.getAJZTList, element.AJZT)
              }
              if (element.SYH_FLLB) {
                element.SYH_FLLB_NAME = this.getCascaderName(element.SYH_FLLB.split(','))
              }
            })
            this.dataList = response.data.AJ
            this.AJTotal = response.data.AJCOUNT // 案件条数
            this.total = response.data.AJCOUNT
          }
          if (response.data.XYR) { // 嫌疑人
            this.dataList = response.data.XYR
            this.XYRTotal = response.data.XYRCOUNT // 嫌疑人条数
            this.total = response.data.XYRCOUNT
          }
          if (response.data.AJGLDW) { // 企业单位
            this.dataList = response.data.AJGLDW
            // 暂时删掉 新企业和摊贩的信息
            for (let index = 0; index < this.dataList.length; index++) {
              const element = this.dataList[index]
              if (element.branchId) {
                this.dataList.splice(index, 1) // 删除下标为i的元素
              }
            }
            // this.AJGLDWTotal = this.dataList.length // 企业单位条数
            // this.total = this.AJGLDWTotal
            this.AJGLDWTotal = response.data.AJGLDWCOUNT // 企业单位条数
            this.total = this.AJGLDWTotal
          }
          if (response.data.QBXS) { // 情报线索
            this.dataList = response.data.QBXS
            this.QBXSTtotal = response.data.QBXSCOUNT // 情报线索条数
            this.total = this.QBXSTtotal
          }
          if (response.data.JCJ) { // 警情
            this.dataList = response.data.JCJ
            this.JQTtotal = response.data.JCJCOUNT // 警情条数
            this.total = this.JQTtotal
          }
          // this.total = this.AJTotal + this.XYRTotal + this.AJGLDWTotal + this.QBXSTtotal // 总结果条数

          //  this.dataList.forEach(element => {
          //    element.issueDate = element.issueDate ? this.$parseTime(element.issueDate, '{y}-{m}-{d}') : ''
          //  })
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
        }
      })
    },
    queryCZRK(sendDate) {
      // const para = {
      //   method: 'Query',
      //   userCardId: this.curUser.cardNumber,
      //   userCertId: this.curUser.cardNumber,
      //   userDept: this.paramDept,
      //   userName: this.curUser.realName
      // }
      // if (this.IdCodeValid(this.filters.word)) {
      //   this.isIdCard = true
      //   para.byUserCard = this.filters.word
      //   this.loading = true
      //   personByCardId(para).then((response) => {
      //     if (response.code === '000000' && response.data) {
      //       const receiveDate = (new Date()).getTime()
      //       const responseTimeMs = receiveDate - sendDate
      //       this.totalTime = responseTimeMs / 1000
      //       this.loading = false
      //       const data = response.data
      //       data['condition'] = 'czrk'
      //       this.total = 1
      //       this.dataList = [data]
      //     }
      //   }).catch(() => {
      //     this.loading = false
      //   })
      // } else {
      //   this.isIdCard = false
      //   para.byUserName = this.filters.word
      //   this.loading = true
      //   personByCardId(para).then((response) => {
      //     if (response.code === '000000' && response.data) {
      //       const receiveDate = (new Date()).getTime()
      //       const responseTimeMs = receiveDate - sendDate
      //       this.totalTime = responseTimeMs / 1000
      //       this.loading = false
      //       const data = response.data
      //       this.total = data.length
      //       for (let i = 0; i < data.length; i++) {
      //         data[i]['condition'] = 'czrkList'
      //       }
      //       this.dataList = data
      //     }
      //   }).catch(() => {
      //     this.loading = false
      //   })
      // }
      const response = {
        'success': true,
        'code': '000000',
        'message': 'OK',
        'data': {
          'csrq': '1979年07月13日',
          'whcd': null,
          'gmsfhm': '610111197907130277',
          'zjxy': '无宗教信仰',
          'zylb': '无',
          'xxMc': '',
          'mzMc': '汉族',
          'whcdMc': '大学本科',
          'csdssxqMc': '陕西省西安市灞桥区',
          'sg': 0,
          'zxlbMc': '',
          'xbMc': '男',
          'zjxyMc': '无宗教信仰',
          'id': 1095,
          'ryztMc': '正常人口',
          'zylbMc': '汽车租赁业',
          'hyzkMc': '已婚',
          'jgssxqMc': '陕西省西安市灞桥区',
          'xb': '1',
          'lbsQrrq': '',
          'zxsj': '',
          'mz': '01',
          'hyzk': '',
          'xm': '张迪',
          'cym': '',
          'xp': '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',
          'createUser': '超级管理员',
          'lbzQrrq': '20180507'
        }
      }
      this.isIdCard = true
      if (response.code === '000000' && response.data) {
        const receiveDate = (new Date()).getTime()
        const responseTimeMs = receiveDate - sendDate
        this.totalTime = responseTimeMs / 1000
        this.loading = false
        const data = response.data
        data['condition'] = 'czrk'
        this.total = 1
        this.dataList = [data]
      }
    },
    querySenior(menuCondition) { // 高级搜索
      this.curIndex = ''
      this.curIndex1 = ''
      this.curIndex2 = ''
      this.curIndex3 = ''
      this.curIndex4 = ''
      this.curIndex5 = ''
      this.curCardId = ''
      this.showCardCom1 = false
      this.showCardCom2 = false
      this.ajTable = false
      this.xyrTable = false
      this.ajgldwTable = false
      this.qbxsTable = false
      this.tableAJList = []
      this.tableXYRList = []
      this.tableAJGLDWList = []
      this.tableQBXSList = []
      const senior = JSON.stringify(this.seniorForm) // 所填条件 表单
      // if (senior === '{}') {
      //   this.$message.error('查询条件不能为空')
      //   return false
      // }
      this.loading = true
      const sendDate = (new Date()).getTime()
      this.total = 0
      this.AJTotal = 0
      this.AJGLDWTotal = 0
      this.XYRTotal = 0
      this.QBXSTtotal = 0
      let requestSign = '' // 省市县的标志
      if (this.curDept.depCode === '610000') { // 省厅
        requestSign = 'province'
      } else if (this.curDept.depCode.substring(4, 6) === '00') { // 市
        requestSign = 'city'
      } else { // 旗县
        requestSign = 'area'
      }
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        // userid: this.curUserId, // 用户id
        // condition: menuCondition, // 查询条件
        seniorForm: JSON.parse(senior)
      }
      para.seniorForm.userid = this.curUserId // 用户id
      para.seniorForm.depCode = this.curDept.depCode // 所在部门code
      para.seniorForm.requestSign = requestSign // 省市县的标志
      if (menuCondition === 0) {
        para.seniorForm.condition = 'all'
      } else if (menuCondition === 1) { // 案件
        para.seniorForm.condition = 'aj'
        if (this.seniorForm.SYH_FLLB) { // 案件分类
          para.seniorForm.SYH_FLLB = this.seniorForm.SYH_FLLB.join(',')
        }
        if (this.seniorForm.RLDW) { // 认领单位
          para.seniorForm.RLDW = (this.seniorForm.RLDW)[this.seniorForm.RLDW.length - 1] // 传最后一级认领单位
        }
        if (this.seniorForm.LARQ) { // 案件 立案日期
          para.seniorForm.LARQstartTime = this.$parseTime(this.seniorForm.LARQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.LARQendTime = this.$parseTime(this.seniorForm.LARQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.LARQ = '' // 传数组报错
        }
        if (this.seniorForm.SLSJ) { // 案件 受理时间
          para.seniorForm.SLSJstartTime = this.$parseTime(this.seniorForm.SLSJ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.SLSJendTime = this.$parseTime(this.seniorForm.SLSJ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.SLSJ = '' // 传数组报错
        }
        if (this.seniorForm.YSSJ) { // 案件 移送时间
          para.seniorForm.YSSJstartTime = this.$parseTime(this.seniorForm.YSSJ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.YSSJendTime = this.$parseTime(this.seniorForm.YSSJ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.YSSJ = '' // 传数组报错
        }
        if (this.seniorForm.BASJ) { // 案件 报案时间
          para.seniorForm.BASJstartTime = this.$parseTime(this.seniorForm.BASJ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.BASJendTime = this.$parseTime(this.seniorForm.BASJ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.BASJ = '' // 传数组报错
        }
        if (this.seniorForm.PARQ) { // 案件 破案日期
          para.seniorForm.PARQstartTime = this.$parseTime(this.seniorForm.PARQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.PARQendTime = this.$parseTime(this.seniorForm.PARQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.PARQ = '' // 传数组报错
        }
        if (this.seniorForm.JARQ) { // 案件 结案日期
          para.seniorForm.JARQstartTime = this.$parseTime(this.seniorForm.JARQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.JARQendTime = this.$parseTime(this.seniorForm.JARQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.JARQ = '' // 传数组报错
        }
        if (this.seniorForm.GDRQ) { // 案件 归档日期
          para.seniorForm.GDRQstartTime = this.$parseTime(this.seniorForm.GDRQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.GDRQendTime = this.$parseTime(this.seniorForm.GDRQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.GDRQ = '' // 传数组报错
        }
        if (this.seniorForm.BARCSRQ) { // 案件 报案人出生日期
          para.seniorForm.BARCSRQstartTime = this.$parseTime(this.seniorForm.BARCSRQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.BARCSRQendTime = this.$parseTime(this.seniorForm.BARCSRQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.BARCSRQ = '' // 传数组报错
        }
      } else if (menuCondition === 2) { // 嫌疑人
        para.seniorForm.condition = 'xyr'
        if (this.seniorForm.CSRQ) { // 嫌疑人出生日期
          para.seniorForm.CSRQstartTime = this.$parseTime(this.seniorForm.CSRQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.CSRQendTime = this.$parseTime(this.seniorForm.CSRQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.CSRQ = '' // 传数组报错
        }
      } else if (menuCondition === 3) { // 企业单位
        para.seniorForm.condition = 'ajgldw'
        if (this.seniorForm.CFRQ) { // 企业单位 处罚日期
          para.seniorForm.CFRQstartTime = this.$parseTime(this.seniorForm.CFRQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.CFRQendTime = this.$parseTime(this.seniorForm.CFRQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.CFRQ = '' // 传数组报错
        }
        if (this.seniorForm.DJRQ) { // 企业单位 登记日期
          para.seniorForm.DJRQstartTime = this.$parseTime(this.seniorForm.DJRQ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.DJRQendTime = this.$parseTime(this.seniorForm.DJRQ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.DJRQ = '' // 传数组报错
        }
        if (this.seniorForm.CZSJ) { // 企业单位 操作时间
          para.seniorForm.CZSJstartTime = this.$parseTime(this.seniorForm.CZSJ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.CZSJendTime = this.$parseTime(this.seniorForm.CZSJ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.CZSJ = '' // 传数组报错
        }
      } else if (menuCondition === 4) { // 情报线索
        para.seniorForm.condition = 'qbxs'
        if (this.seniorForm.ASSJ) { // 情报线索 时间
          para.seniorForm.ASSJstartTime = this.$parseTime(this.seniorForm.ASSJ[0], '{y}-{m}-{d}') || ''
          para.seniorForm.ASSJendTime = this.$parseTime(this.seniorForm.ASSJ[1], '{y}-{m}-{d}') || ''
          para.seniorForm.ASSJ = '' // 传数组报错
        }
      }
      para.seniorForm = JSON.stringify(para.seniorForm)
      this.$query('itemSearch', para).then((response) => {
        const receiveDate = (new Date()).getTime()
        const responseTimeMs = receiveDate - sendDate
        this.loading = false
        // this.ajTable = false
        // this.xyrTable = false
        // this.ajgldwTable = false
        // this.qbxsTable = false
        // this.tableAJList = []
        // this.tableXYRList = []
        // this.tableAJGLDWList = []
        // this.tableQBXSList = []
        if (response.data) {
          if (menuCondition === 1) { // 案件
            this.ajTable = true
            this.AJTotal = response.data.AJCOUNT
            this.total = response.data.AJCOUNT
            if (response.data.AJ) {
              this.tableAJList = response.data.AJ
              response.data.AJ.forEach(element => {
                if (element.AJZT) {
                  element.AJZT = this.getSelectLabel(this.getAJZTList, element.AJZT)
                }
              })
            }
          } else if (menuCondition === 2) { // 嫌疑人
            this.xyrTable = true
            this.tableXYRList = response.data.XYR
            // this.XYRTotal = response.data.XYR.length || 0
            this.XYRTotal = response.data.XYRCOUNT
            this.total = response.data.XYRCOUNT
          } else if (menuCondition === 3) { // 企业单位
            this.ajgldwTable = true
            this.tableAJGLDWList = response.data.AJGLDW
            // this.AJGLDWTotal = response.data.AJGLDW.length || 0
            this.AJGLDWTotal = response.data.AJGLDWCOUNT
            this.total = response.data.AJGLDWCOUNT
          } else if (menuCondition === 4) { // 情报线索
            this.qbxsTable = true
            this.tableQBXSList = response.data.QBXS
            // this.QBXSTtotal = response.data.QBXS.length || 0
            this.QBXSTtotal = response.data.QBXSCOUNT
            this.total = response.data.QBXSCOUNT
          }
          // this.total = this.AJTotal + this.XYRTotal + this.AJGLDWTotal + this.QBXSTtotal // 总结果条数
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          // this.dataList.forEach(element => {
          //   element.issueDate = element.issueDate ? this.$parseTime(element.issueDate, '{y}-{m}-{d}') : ''
          // })
          // this.total = response.data.totalCount
          this.totalTime = responseTimeMs / 1000
        }
      })
    },
    handleAjDetail(row) { // 跳转案件档案，传的是案件id
      // this.$router.push({ path: '/caseManage/detailSyh/' + row.ID })
      this.$router.push({
        path: '/caseFile/index', query: { id: row.ID }
      })
    },
    handleAjDetailAll(ajbh) { // 跳转案件档案，传的是案件编号
      this.$router.push({
        path: '/caseFile/index', query: { ajbh: ajbh, isRl: '1' } // 展示申请督办等按钮
      })
    },
    handleQbxsDetail(index, row) {
      this.$router.push({ path: '/intellSystem/edit/' + row.ID })
    },
    // handleAjGlDwDetail(index, row) { // 案件关联单位详情
    //   this.$router.push({ path: '/inforCollection/detail/' + row.AJBH })
    // },
    detail(id) {
      this.$gotoid('/handlingGuide/hybz/detail', id)
    },
    add() {
      this.$router.push({ path: '/handlingGuide/hybz/add' })
    },
    getSpecialMode() {
      const para = {
        deptId: this.curDept.id, userId: this.curUserId
      }
      getSpecialmodeList(para).then((response) => {
        this.models = {}
        if (response.data.length > 0) {
          const data = response.data
          const len = data.length
          for (let i = 0; i < len; i++) {
            const b = data[i]
            if (b.value) {
              b.value = JSON.parse(b.value)
            }
            this.models[b.id] = b.value
            this.ajztOptions.push({
              id: b.id, name: b.name
            })
          }
        }
      })
    },
    getSelectLabel(array, val) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value === val) {
          return array[i].label
        }
      }
      return '未知'
    },
    getFllbName(fllb) { // 返回的分类类别 是 细类，用逗号隔开的字符串
      if (fllb.indexOf(',') !== -1) {
        fllb = fllb.split(',')[0]
      }
      if (fllb === '1') {
        return '食品'
      } else if (fllb === '2') {
        return '药品'
      } else if (fllb === '3') {
        return '环境'
      } else {
        return '其他'
      }
    },
    getCascaderName(valueArr) { // 案件细类
      let ddd = ''
      this.SYHFLLBList.forEach((firstItem, index) => {
        if (firstItem.value === valueArr[0]) { // 一级
          ddd += firstItem.label
          if (valueArr[1] && firstItem.children) {
            firstItem.children.forEach((secondItem, index1) => { // 二级
              if (secondItem.value === valueArr[1]) {
                ddd += ' - ' + secondItem.label
                if (valueArr[2] && secondItem.children) {
                  secondItem.children.forEach((thirdItem, index2) => { // 三级
                    if (thirdItem.value === valueArr[2]) {
                      ddd += ' - ' + thirdItem.label
                      if (valueArr[3] && thirdItem.children) {
                        thirdItem.children.forEach((fouthItem, index3) => { // 四级
                          if (fouthItem.value === valueArr[3]) {
                            ddd += ' - ' + fouthItem.label
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
      return ddd
    },
    getDepts() {
      this.SYHRLDWList = getGXHTJXJ(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
    },
    handlePersonDetailAll(number) { // 跳转人员档案
      this.$router.push({
        path: '/personnelFile/index', // 升级版人员档案
        query: { cardId: number }
      })
    },
    IdCodeValid(code) {
      return identityCodeValid(code)
    },
    gotoComDetail(row) { // 跳转企业详情
      this.$gotoid('/inforCollection/comRegisterDetail', JSON.stringify({ id: row.companyId, type: 'personalized' }))
    },
    gotoPedlarDetail(row) { // 跳转摊贩详情
      this.$gotoid('/inforCollection/comPedlarDetail', JSON.stringify({ id: row.pitchmanId, type: 'personalized' }))
    },
    unfold(type, index, param) {
      switch (type) {
        case 'isUnfoldjyaj':
          this.isUnfoldjyajIndex = index
          this.isUnfoldjyaj = !this.isUnfoldjyaj
          break
        case 'isUnfoldzcdz':
          this.isUnfoldzcdzIndex = index
          this.isUnfoldzcdz = !this.isUnfoldzcdz
          break
        case 'isUnfoldjyfw':
          this.isUnfoldjyfwIndex = index
          this.isUnfoldjyfw = !this.isUnfoldjyfw
          break
        case 'isUnfoldjyxm':
          this.isUnfoldjyxmIndex = index
          this.isUnfoldjyxm = !this.isUnfoldjyxm
          break
        case 'isUnfoldwffz':
          this.isUnfoldwffzIndex = index
          this.isUnfoldwffz = !this.isUnfoldwffz
          break
        case 'isUnfoldxszw':
          this.isUnfoldxszwIndex = index
          this.isUnfoldxszw = !this.isUnfoldxszw
          break
        case 'isUnfolddwmc':
          this.isUnfolddwmcIndex = index
          this.isUnfolddwmc = !this.isUnfolddwmc
          break
        case 'isUnfoldajbh':
          this.isUnfoldajbhIndex = index
          this.isUnfoldajbh = !this.isUnfoldajbh
          break
        case 'isUnfoldcompany':
          this.isUnfoldcompanyIndex = index
          this.isUnfoldcompany = !this.isUnfoldcompany
          this.gotoComDetail(param) // 单位详情
          break
        case 'isUnfoldpitch':
          this.isUnfoldpitchIndex = index
          this.isUnfoldpitch = !this.isUnfoldpitch
          this.gotoPedlarDetail(param) // 摊位详情
          break
        case 'isUnfoldbjnr':
          this.isUnfoldbjnrIndex = index
          this.isUnfoldbjnr = !this.isUnfoldbjnr
          break
        case 'isUnfoldcjxq':
          this.isUnfoldcjxqIndex = index
          this.isUnfoldcjxq = !this.isUnfoldcjxq
          break
      }
    },
    showTipsC(index, val, type) {
      this.curCardId = val
      if (type) {
        if (type === 'showCardCom1') {
          if (!this.showCardCom1) {
            this.showCardCom1 = true
          }
        } else if (type === 'showCardCom2') {
          if (!this.showCardCom2) {
            this.showCardCom2 = true
          }
        } else if (type === 'showCardCom3') {
          this.curIndex3 = index
        } else if (type === 'showCardCom4') {
          this.curIndex4 = index
        } else if (type === 'showCardCom5') {
          this.curIndex5 = index
        } else if (type === 'showCardCom') {
          this.curIndex = index
        }
      }
    },
    rowClick(row) {
      this.comTop = $('.el-table__row').eq(row.index).position().top + 32 + 'px'
    },
    rowClick2(row) {
      this.comTop2 = $('.el-table__row').eq(row.index).position().top + 'px'
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    clickBlank() {
      this.curIndex = ''
      this.curIndex3 = ''
      this.curIndex4 = ''
      this.curIndex5 = ''
      this.showCardCom1 = false
      this.showCardCom2 = false
    },
    handleJcjDetail(index, row) { // 接处警详情弹框
      this.jcjDialogVisible = true
      this.curJcjbh = row.jcjbh
      // const routeData = this.$router.resolve({
      //   name: '案件',
      //   params: { id: 1 }
      // })
      // window.open(routeData.href, '_blank')
    },
    toback() {
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
      } else {
        this.$router.back(-1)
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem(this.$route.path)
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.searchWrap').offsetHeight - 150
    this.contListHeight = document.documentElement.clientHeight - document.querySelector('.searchWrap').offsetHeight - 150 + 'px'
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curUser) {
      this.curUserId = this.curUser.id
    }
    if (this.filters.word) {
      this.query('all')
    }
    this.getSpecialMode()
    getCityTree().then((response) => {
      const data = response.data
      this.cityOptions = data
    })
    this.AJXZList = this.getSelectList('ajxz') // 案件性质
    var param = sessionStorage.getItem(this.$route.path)
    if (param) { // 从人员详情跳转过来的，根据身份证号查所有类型相关的
      this.filters.word = JSON.parse(param).idCard
      this.isShowBack = true
    } else if (this.$route.query.ajbh) {
      this.filters.word = this.$route.query.ajbh
      this.isShowBack = true
    }
    this.query(this.menuCondition)
    // this.dataList = [{
    //   JJSJ: '1111'
    // }]
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.curIndex = ''
    this.curIndex3 = ''
    this.curIndex4 = ''
    this.curIndex5 = ''
    this.showCardCom1 = false
    this.showCardCom2 = false
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.searchWrap').offsetHeight - 150
    this.contListHeight = document.documentElement.clientHeight - document.querySelector('.searchWrap').offsetHeight - 150 + 'px'
  }
}
</script>

<style>
.personalSearch .clearfix::after {
  clear: both;
  display: block;
  content: "";
}

.personalSearch .wordinput .el-form-item__content {
  width: 400px;
}

.personalSearch .menu_ul {
  margin: 16px auto;
}

.personalSearch .activeClass {
  color: #1e98d2;
}

.personalSearch .perLi {
  float: left;
  width: 100px;
  text-align: center;
  cursor: pointer;
}

.personalSearch .svg-icon {
  width: 2em !important;
  height: 2em !important;
}

.personalSearch .el-dropdown button {
  line-height: 1.15;
}

.personalSearch .result_cell {
  margin: 6px auto 25px;
  border-bottom: 1px dashed #dddddd;
  padding-bottom: 10px;
}

.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.searchResultWrap {
  overflow: auto;
}
.personalSearch .searchResultWrap .svg-icon {
  margin-top: 12px;
}

.personalSearch .ajbh-color {
  color: #1e98d2;
  cursor: pointer;
}

.personalSearch .ajbh-color:hover {
  color: #3da1ff;
}

.personalSearch .beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.personalSearch .inlineWrap p {
  display: inline-block;
}
.personalSearch .textRight {
  text-align: right;
}
.personalSearch .czrkT {
  padding-left: 6%;
}
.personalSearch .czrkPline {
  padding: 10px;
}
.personalSearch .img_wrap {
  width: 130px;
  height: 150px;
  margin-top: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.personalSearch img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.pdr {
  padding-right: 10px;
}
.cardcomsfz {
  position: absolute;
  top: -25px;
  left: 56%;
}
.cardcom1 {
  position: absolute;
  top: -20px;
  left: 33%;
}
.cardcom2 {
  position: absolute;
  top: 60px;
  right: 23%;
}
.cardcom3 {
  position: absolute;
  top: -25px;
  right: 38%;
}
.cardcom4 {
  position: absolute;
  top: -25px;
  right: 38%;
}
.cardcom5 {
  position: absolute;
  top: -20px;
  right: 12%;
}
.goBack {
  width: 105px !important;
  height: 30px !important;
}
.underLine {
  text-decoration: underline;
}
.zjhm {
  cursor: pointer;
}
.zjhm:hover {
  color: #3da1ff;
}
@media only screen and (max-width: 1366px) {
  .cardcomsfz {
    left: 63%;
  }
  .cardcom1 {
    left: 48%;
  }
  .cardcom2 {
    right: 34%;
  }
  .cardcom3,
  .cardcom4 {
    right: 30%;
  }
}
</style>
