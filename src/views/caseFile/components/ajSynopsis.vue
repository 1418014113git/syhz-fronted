<template>
<!-- 案件梗概 -->
  <div class="ajInfo ajgg" v-loading="loading">
    <div class="title">
      <div class="left">案件梗概</div>
    </div>
    <el-row class="xddw zbjl">
      <el-form ref="form" :model="ajInfo" size="small" label-width="108px" label-position="left">
        <el-col :span="24">
          <el-form-item label="案件特征" prop="FABW" class="ajtz_wrap">
            <span v-for="(item,index) in featureData" :class="'bg'+(index%6+1)" :key="index" class="ajlx">{{item.text}}</span>
            <img src="/static/image/caseFile_images/add.png" alt="" srcset="" @click="handleFeatureAdd" class="featureImg">
            <img src="/static/image/caseFile_images/edit.png" alt="" srcset="" @click="handleFeatureEdit" class="featureImg">
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发案部位" prop="FABW_NAME">
            <span class="whiteColor">{{ajInfo.FABW_NAME}}</span>
          </el-form-item>
          <el-form-item label="选择处所" prop="XZCS_NAME">
            <span class="whiteColor">{{ajInfo.XZCS_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作案时机" prop="XZSJ_NAME">
            <span class="whiteColor">{{ajInfo.XZSJ_NAME}}</span>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="发案地域" prop="FADY">
            <span :title="ajInfo.FADY_NAME" class="whiteColor ellipsis-word">{{ajInfo.FADY_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="发案时间" prop="FABW">
            <span   v-if="ajInfo.FASJSX"  class="whiteColor">{{$handlerDateTime(ajInfo.FASJSX)}}&nbsp;至&nbsp;{{$handlerDateTime(ajInfo.FASJXX)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简要案情" prop="JYAQ">
            <span class="whiteColor  breakall">{{ajInfo.JYAQ}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="主办侦察员" prop="ZBR_NAME">
            <span class="whiteColor">{{ajInfo.ZBR_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="主办单位" prop="ZBDW_NAME">
            <span class="whiteColor">{{ajInfo.ZBDW_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="synopsis_bot_wrap clearfix">
          <div class="left clearfix" v-if="carryParam && carryParam.isRl!=='0'">
            <div class="clearfix synopsis_bot_cell">
              <img style="float:left;width:26px;margin:3px 5px 0 0;" src="/static/image/caseFile_images/dbzcrw.png" alt="" srcset="">
              <p style="float:left;">待办侦查任务</p>
            </div>
            <div class="clearfix synopsis_bot_cell">
              <img style="float:left;width:30px;margin:0 5px 0 0;" src="/static/image/caseFile_images/ajxc.png" alt="" srcset="">
              <p style="float:left;">案件协查（<span class="orange_text" @click="handleTaskXc">{{taskInfo.xcNum || 0}}</span>）</p>
            </div>
            <div class="clearfix synopsis_bot_cell">
              <img style="float:left;width:26px;margin:0 5px 0 0;" src="/static/image/caseFile_images/ajdb.png" alt="" srcset="">
              <p style="float:left;">案件督办（<span class="orange_text" @click="handleTaskDb">{{taskInfo.dbNum || 0}}</span>）</p>
            </div>
            <div class="clearfix synopsis_bot_cell">
              <img style="float:left;width:26px;margin:-3px 5px 0 0;" src="/static/image/caseFile_images/jyjd.png" alt="" srcset="">
              <p style="float:left;">检验鉴定（<span class="orange_text" @click="handleTaskJd">{{taskInfo.jdNum || 0}}</span>）</p>
            </div>
          </div>
          <div class="right" style="margin-top: -5px;" v-if="carryParam && carryParam.isRl==='0'">
            <div class="shadow_text right_cell">
              案件类型
              <el-cascader v-model="ajInfo.fllb" change-on-select filterable :options="fllbList" @change="handleChange" clearable class="ajlx_cascader"></el-cascader>
            </div>
            <!-- <el-button type="success" style="margin-left: 20px;" @click="rlsave()" :loading="rlLoading">案件认领</el-button> -->
            <div class="flws_text shadow_text" v-if="flwsInfo.list>0">法律文书（ <span class="orange_text" @click="handleGoFlws('1')">{{flwsInfo.list}}</span> ）</div>
            <div class="flws_text shadow_text" v-else>
              <span @click="handleGoFlws('2')" style="cursor:pointer;">无法律文书&nbsp;&nbsp;</span>
              <span v-if="flwsInfo.examine==='4'" class="orange_text" @click="handleGoFlws('2')">未通过</span>
              <span v-else-if="flwsInfo.examine==='3'" class="green_text" @click="handleGoFlws('2')">审核通过</span>
              <span v-else-if="flwsInfo.examine==='1'||flwsInfo.examine==='2'" class="blue_text" @click="handleGoFlws('2')">审核中</span>
            </div>
            <div class="shadow_text right_cell" v-if="showYear" >
              案件年份
              <el-date-picker  v-model="ajYear" type="year" value-format="yyyy" placeholder="选择年" class="ajgg_date"></el-date-picker>
            </div>
            <div class="shadow_text right_cell" v-show="showLaData"  >
              立案日期
              <el-date-picker v-model="laDate" type="date" value-format="yyyyMMdd"  placeholder="选择日期" class="ajgg_date"
                              :picker-options="laPickerOpt" @change="laPickerChange" :disabled="disableLa"></el-date-picker>
            </div>
            <div class="shadow_text right_cell" v-show="showPaData">
              破案日期
              <el-date-picker v-model="paDate" type="date" value-format="yyyyMMdd" placeholder="选择日期" class="ajgg_date"
                              :picker-options="paPickerOpt" @change="paPickerChange" :disabled="disablePa"></el-date-picker>
            </div>
            <el-button class="case_btn"  v-if ="rlBtn" @click="rlSave()" :loading="rlLoading">案件认领</el-button>
          </div>
          <div class="right" style="margin-top: -5px;" v-if="applyBtnShow">
            <div class="case_btn" @click="applyAjxc()" :loading="rlLoading">申请案件协查</div>
            <div class="case_btn" @click="applyQgxxc()" :loading="rlLoading">申请全国性协查</div>
            <div class="case_btn" @click="applyAjdb()" :loading="rlLoading">申请督办</div>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <!-- 编辑 -->
    <el-dialog title="案件特征列表" :visible.sync="listDialogVisible" width="60%">
      <el-table :data="featureData" style="width: 100%;" v-loading="loading" max-height="700">
        <el-table-column type="index" label="序号" width="52"></el-table-column>
        <el-table-column prop="text" label="名称" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="操作单位" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="操作人"  width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="操作时间" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"  circle @click="handleRowEdit(scope.$index, scope.row)" v-if="scope.row.deptName"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-delete"  circle @click="handleRowDelete(scope.$index, scope.row)" v-if="scope.row.deptName"></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="立案日期" width="170">
          <template slot-scope="scope">
            {{$handlerDateTime(scope.row.larq)}}
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>

  </div>
</template>
<script>
import { getSYHFLLBList } from '@/utils/codetotext'
import { getUserInfo } from '@/utils/auth'
import { addAJJBXXSYHRL, getAJJBXXETLRL } from '@/api/caseManage'
import Bus from '@/utils/bus.js'
export default {
  props: ['info', 'bh', 'ajid', 'type', 'Rl'], // 依次接受父组件的值
  name: 'ajInfo',
  data() {
    return {
      ajztCodes: {},
      ajInfo: {}, // 基础信息 父组件传来的案件信息 父组件根据认领状态查的不同
      ajbh: '',
      curUser: {}, // sessionStorage获取用户信息
      curDept: {},
      loading: false, // 页面加载进度条
      listDialogVisible: false,
      featureData: [], // 特征list
      fllbList: getSYHFLLBList(), // 案件分类类别
      rlLoading: false, // 认领按钮loading
      taskInfo: {}, // 任务数量
      carryParam: {}, // session中 跳转传的值
      AJID: '', // 用户页面返回判断使用
      interFaceType: '',
      isRls: '',
      source: 'ajda',
      applyBtnShow: false, // 三个申请是否显示
      flwsInfo: {}, // 法律文书
      ajYear: '', // 案件年份
      laDate: '', // 立案日期
      paDate: '', // 破案日期
      showLaData: false,
      showPaData: false,
      showYear: true,
      disableLa: false,
      disablePa: false,

      curDeptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前用户的部门
      rlBtn: true,
      tingDeptData:
      {
        code: '610000530000',
        name: '陕西省公安厅环食药总队'
      },

      laPickerOpt: {},
      paPickerOpt: {},
      pcsParentDept: {}
    }
  },
  components: {

  },
  computed: {

  },
  watch: {
    // info(val) {
    //   if (val.id) {
    //     this.ajInfo = val
    //   }
    // },
    bh(val) {
      if (val) {
        this.ajbh = val
        this.AJID = this.ajid
        this.interFaceType = this.type
        this.isRls = this.Rl
        this.ajInfo = this.info
        this.queryAjFeature()
        this.queryTaskNum()
        this.judgeIsShowApplyBtn() // 判断是否显示三个申请按钮
        this.queryFlwsInfo() // 法律文书
        if (this.$route.query) {
          this.carryParam = this.$route.query
        }

        if (this.ajInfo.LARQ && this.ajInfo.LARQ.length === 8) {
          this.disableLa = true

          // var y = this.ajInfo.LARQ.substr(0, 4)
          // var m = this.ajInfo.LARQ.substr(6, 6)
          // var d = this.ajInfo.LARQ.substr(6, 8)

          // this.laDate = y + '-' + m + '-' + d
          this.laDate = this.ajInfo.LARQ

          this.laPickerChange(this.laDate)
        }
        if (this.ajInfo.PARQ && this.ajInfo.PARQ.length === 8) {
          // var y1 = this.ajInfo.PARQ.substr(0, 4)
          // var m1 = this.ajInfo.PARQ.substr(6, 6)
          // var d1 = this.ajInfo.PARQ.substr(6, 8)
          // this.paDate = y1 + '-' + m1 + '-' + d1
          this.disablePa = true
          this.paDate = this.ajInfo.PARQ
          this.paPickerChange(this.paDate)
        }
        if (this.ajInfo.LARQ && this.ajInfo.LARQ.length === 8 && Number(this.ajInfo.LARQ.substr(0, 4)) < 2019) {
          this.showYear = false
        } else {
          this.showYear = true
        }
        this.getAjztCodes()
      }
    }
  },
  methods: {
    laPickerChange(val) {
      if (val) {
        this.paPickerOpt = Object.assign({}, this.paPickerOpt, {
          disabledDate: (time) => {
            return time.getTime() < (new Date(val).getTime() - 86400000)
          }
        })
      } else {
        this.paPickerOpt = this.paPickerOpt = Object.assign({}, this.paPickerOpt, {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    paPickerChange(val) {
      if (val) {
        this.laPickerOpt = Object.assign({}, this.laPickerOpt, {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.laPickerOpt = Object.assign({}, this.laPickerOpt, {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    judgeIsShowApplyBtn() { // 判断是否显示三个申请按钮
      // console.log(this.ajInfo.deptCode)
      if (this.ajInfo && this.ajInfo.deptCode) {
        if (this.curDeptInfo.depCode.substr(0, 4) === '6100') { // 当前部门 前4位 是 6100，表示厅
          this.applyBtnShow = true
        } else if (this.ajInfo.deptCode.substr(0, 4) === this.curDeptInfo.depCode.substr(0, 4)) { // 自己、内设、下级
          this.applyBtnShow = true
        } else {
          this.applyBtnShow = false
        }
      }
    },
    init() {
      if (this.bh) {
        this.ajbh = this.bh
        this.queryAjFeature() // 查询案件特征
        this.queryTaskNum() // 查询任务数量
        this.judgeIsShowApplyBtn() // 判断是否显示三个申请按钮
        this.queryFlwsInfo() // 法律文书
      }
      if (this.$route.query) {
        this.carryParam = this.$route.query
      }
    },
    queryAjFeature() {
      // 查询案件特征
      this.loading = true
      this.$query('ajfeaturebybh', { ajbh: this.ajbh }).then((res) => {
        if (res.code === '000000') {
          this.loading = false
          this.featureData = res.data
          if (this.ajInfo.SFSW + '' === '1') {
            this.featureData.push({ text: '涉外' })
          }
          if (this.ajInfo.MJ + '' === '1') {
            this.featureData.push({ text: '公开' })
          }
          if (this.ajInfo.ZABS + '' === '1') {
            this.featureData.push({ text: '专案' })
          }
          if (this.ajInfo.XZ_SFSY + '' === '1') {
            this.featureData.push({ text: '涉烟' })
          }
          if (this.ajInfo.XZ_SFSK + '' === '1') {
            this.featureData.push({ text: '涉矿' })
          }
          if (this.ajInfo.XZ_SFSN + '' === '1') {
            this.featureData.push({ text: '涉农' })
          }
          if (this.ajInfo.ajsxText) {
            this.featureData.push({ text: this.ajInfo.ajsxText })
          }
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    queryTaskNum() { // 查询待办任务数量
      this.loading = true
      this.$query('archives/toDoItems', { ajbh: this.ajbh, deptId: this.curDept.id }).then((res) => {
        if (res.code === '000000') {
          this.loading = false
          this.taskInfo = res.data
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    queryFlwsInfo() { // 查询法律文书信息
      this.loading = true
      this.$query('flws/status?ajbh=' + this.ajbh, {}).then((res) => {
        if (res.code === '000000') {
          this.loading = false
          // list  大于0 表示有文书 ,等于0  并且 没有examine 这个字段 表示没有申请审核, 有审核了   examine 这个字段就有数字了  和审核列表返回的一样
          this.flwsInfo = res.data
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail() {
      const para = {
        id: this.ajInfo.id
      }
      getAJJBXXETLRL(para).then((response) => {
        this.ajInfo = response.data
        if (this.ajInfo.SYH_FLLB) { // 案件详情存在 案件类型
          // this.ajInfo.fllb = this.ajInfo.SYH_FLLB
          this.ajInfo.fllb = this.ajInfo.SYH_FLLB.split(',')
        }
      })
    },
    handleChange(value) {
      // console.log(value)
    },
    handleFeatureAdd() { // 新增案件特征
      this.$prompt('请输入案件特征', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5]{1,5}$/,
        inputErrorMessage: '特征格式不正确（五个以内的汉字）',
        confirmButtonLoading: false
      }).then(({ value }) => {
        this.$prompt.confirmButtonLoading = true
        this.loading = true
        var para = {
          ajbh: this.ajbh,
          featureText: value,
          deptId: this.curDept.id,
          userId: this.curUser.id,
          userName: this.curUser.realName
        }
        this.$save('ajfeature', para).then((response) => {
          if (response.code === '000000') {
            // confirmButtonLoading = false
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.queryAjFeature()
          }
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleFeatureEdit() { // 展示案件特征列表
      this.listDialogVisible = true
    },
    handleRowEdit(index, row) { // 列表编辑案件特征
      this.$prompt('请输入案件特征', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.text,
        inputPattern: /^[\u4e00-\u9fa5]{1,5}$/,
        inputErrorMessage: '特征格式不正确（五个以内的汉字）'
      }).then(({ value }) => {
        this.loading = true
        var para = {
          id: row.id,
          featureText: value,
          deptId: this.curDept.id,
          userId: this.curUser.id,
          userName: this.curUser.realName
        }
        this.$update('ajfeature/' + row.id, para).then((response) => {
          this.loading = false
          if (response.code === '000000') {
            this.$message({
              message: '修改成功', type: 'success'
            })
            this.queryAjFeature()
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleRowDelete(index, row) {
      this.$confirm('此操作将删除该特征, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$update('ajfeaturedel/' + row.id, {}).then((response) => {
          this.loading = false
          if (response.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.queryAjFeature()
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleTaskXc() { // 案件协查
      if (this.taskInfo.xcNum > 0) {
        var param = this.getparam()
        this.$router.push({ path: '/caseAssist/list', query: param })
        // this.$gotoid('/caseAssist/list', JSON.stringify({ ajbh: this.ajbh }))
      }
    },
    handleTaskDb() { // 案件督办
      if (this.taskInfo.dbNum > 0) {
        var param = this.getparam()
        this.$router.push({ path: '/caseManage/dblist', query: param })
        // this.$gotoid('/caseManage/dblist', JSON.stringify({ ajbh: this.ajbh }))
      }
    },
    handleTaskJd() { // 检验鉴定
      if (this.taskInfo.jdNum > 0) {
        var param = this.getparam()
        this.$router.push({ path: '/inspectIdent/list', query: param })
        // this.$gotoid('/inspectIdent/list', JSON.stringify({ ajbh: this.ajbh }))
      }
    },
    getparam() {
      var param = {}
      if (this.AJID) {
        if (this.isRls) {
          param = { ajbh: this.ajbh, id: this.AJID, source: this.source, isRl: this.isRls } // 跳转到关系挖掘主页传递的参数
        } else {
          param = { ajbh: this.ajbh, id: this.AJID, source: this.source } // 传递案件id
        }
      } else if (this.ajbh) {
        if (this.interFaceType) {
          param = { ajbh: this.ajbh, source: this.source, interfaceType: this.interFaceType } // 传递案件编号
        } else if (this.isRls) {
          param = { ajbh: this.ajbh, source: this.source, isRl: this.isRls } // 传递案件编号
        }
      } else {
        param = { ajbh: this.ajbh }
      }
      return param
    },
    rlSave() {
      if (!this.ajInfo.fllb || this.ajInfo.fllb.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择案件类型'
        })
        return false
      }
      // 案件年份大于2018年  立案后且未破案案件，必须完善立案日期。 已破案案件，必须完善立案日期、破案日期。
      if ((this.ajInfo.LARQ && (Number(this.ajInfo.LARQ.substr(0, 4)) > 2018 && !this.ajYear))) {
        this.$message({
          type: 'error',
          message: '请选择案件年份'
        })
        return false
      }

      if (this.checkCodes(this.ajztCodes['ajrlzt_pajyh'], Number(this.ajInfo.AJZT))) {
        if (this.ajYear && Number(this.ajYear) > 2018) {
          if (!this.laDate) {
            this.$message({
              type: 'error',
              message: '请选择立案日期'
            })
            return false
          }
          if (!this.paDate) {
            this.$message({
              type: 'error',
              message: '请选择破案日期'
            })
            return false
          }

          if (Number(this.laDate) > Number(this.paDate)) {
            this.$message({
              message: '破案日期不能小于立案日期', type: 'error'
            })
            return false
          }
        }
      } else if (this.checkCodes(this.ajztCodes['ajrlzt_lazpa'], Number(this.ajInfo.AJZT))) {
        if (this.ajYear && Number(this.ajYear) > 2018) {
          if (!this.laDate) {
            this.$message({
              type: 'error',
              message: '请选择立案日期'
            })
            return false
          }
        }
      } else if (this.checkCodes(this.ajztCodes['ajrlzt_gd'], Number(this.ajInfo.AJZT))) {
        if (this.ajYear && Number(this.ajYear) > 2018) {
          if (!this.laDate) {
            this.$message({
              type: 'error',
              message: '请选择立案日期'
            })
            return false
          }
        }
      }
      if (this.ajYear) {
        this.ajInfo.syhYear = this.ajYear.replace(/-/g, '')
      }
      if (this.laDate) {
        this.ajInfo.larq = this.laDate.replace(/-/g, '')
      }
      if (this.paDate) {
        this.ajInfo.parq = this.paDate.replace(/-/g, '')
      }
      this.ajInfo.ajzt = this.ajInfo.AJZT
      // 判断案件是否是2019年以前的 2019年以前的不需要有法律文书相关信息
      if (this.ajInfo.larq && Number(this.ajInfo.larq.substr(0, 4)) > 2018) {
        if (!(this.flwsInfo.list > 0)) { // 判断是否有法律文书
          var messageHtml = ''
          if (this.flwsInfo.examine) {
            if (this.flwsInfo.examine === '1' || this.flwsInfo.examine === '2') {
              messageHtml = '<p>无法律文书申请正在审核中，不允许认领案件。请先完成以下工作中的一项。</p><p>1、请关联法律文书</p><p>2、申请无法律文书且审核通过</p>'
            } else if (this.flwsInfo.examine === '4') {
              messageHtml = '<p>无法律文书申请未通过审核，不允许认领案件。请先完成以下工作中的一项。</p><p>1、请关联法律文书</p><p>2、申请无法律文书且审核通过</p>'
            }
          } else {
            messageHtml = '<p>没有法律文书不允许认领案件。请先完成以下工作中的一项。</p><p>1、请关联法律文书</p><p>2、申请无法律文书且审核通过</p>'
          }
          if (messageHtml) {
            this.$alert(messageHtml, '提示', {
              confirmButtonText: '我知道了',
              center: false,
              dangerouslyUseHTMLString: true
            })
            return false
          }
        }
      }
      var ajString = JSON.stringify(this.ajInfo)
      ajString = JSON.parse(ajString)
      // if (ajString.fllb[0] === '1') {
      //   ajString.tDeptCode = this.tingDeptData[0].code
      //   ajString.tDeptName = this.tingDeptData[0].name
      // } else if (ajString.fllb[0] === '2') {
      //   ajString.tDeptCode = this.tingDeptData[1].code
      //   ajString.tDeptName = this.tingDeptData[1].name
      // } else if (ajString.fllb[0] === '3') {
      //   ajString.tDeptCode = this.tingDeptData[2].code
      //   ajString.tDeptName = this.tingDeptData[2].name
      // }
      ajString.tDeptCode = this.tingDeptData.code
      ajString.tDeptName = this.tingDeptData.name

      ajString.status = 5
      const b = JSON.parse(getUserInfo())
      ajString.userId = b.id
      ajString.userName = b.realName
      ajString.ajbh = this.ajInfo.AJBH
      ajString.fllb = ajString.fllb.join(',')
      if (this.carryParam && this.carryParam.rlId) {
        ajString.id = this.carryParam.rlId // 认领列表的id
      } else {
        // this.$message({
        //   message: '认领id不能为空',
        //   type: 'error'
        // })
        // return false
        // console.log('认领id不能为空')
      }
      this.rlLoading = true
      addAJJBXXSYHRL(ajString).then((response) => {
        if (response.success === true) {
          this.rlLoading = false
          this.$message({
            message: '认领成功',
            type: 'success'
          })
          this.$router.push({
            // path: '/caseFile/index', query: { id: response.data, isRl: '1' }
            path: '/caseManage/ajrl'
          })
          // sessionStorage.setItem(this.$route.path, JSON.stringify({ 'isRl': '1', 'ajId': response.data, 'rlId': this.carryParam.rlId })) // 将session中认领标志 改为已认领
          // location.reload()
        }
      }).catch(() => {
        this.rlLoading = false
      })
    },
    applyAjdb() { // 申请督办
      var param = this.getparam()
      param.caseName = this.ajInfo.AJMC
      param.caseId = this.ajInfo.id
      this.$router.push({
        path: '/caseManage/dbedit/apply',
        query: param
        // query: {
        //   caseName: this.ajInfo.AJMC, caseId: this.ajInfo.id
        // }
      })
    },
    applyQgxxc() { // 申请全国性协查
      // var param = {
      //   type: 'approve',
      //   caseName: this.ajInfo.AJMC,
      //   caseId: this.ajInfo.id,
      // }
      var param = this.getparam()
      param.type = 'approve'
      param.caseName = this.ajInfo.AJMC
      param.caseId = this.ajInfo.id
      this.$gotoid('/caseManage/investigation/add', JSON.stringify(param))
    },
    applyAjxc() { // 申请案件协查
      // var param = {
      //   type: 'approve',
      //   caseName: this.ajInfo.AJMC,
      //   caseId: this.ajInfo.id
      // }
      var param = this.getparam()
      param.type = 'approve'
      param.caseName = this.ajInfo.AJMC
      param.caseId = this.ajInfo.id
      this.$gotoid('/caseAssist/add', JSON.stringify(param))
    },
    handleClose() {

    },
    handleGoFlws(type) { // 跳转到引导侦查的法律文书
      this.$store.dispatch('Ajdatotop', 'ydzc') // 页面滚动到 引导侦查
      if (type === '1') { // 法律文书列表
        Bus.$emit('changeActiveTab', '1')
      } else if (type === '2') { // 无文书列表
        Bus.$emit('changeActiveTab', '2')
      }
    },
    getAjztCodes() {
      if (!this.ajInfo.AJZT && this.ajztCodes.success) {
        return false
      }
      this.$query('tcpcode', { codeLxLeft: 'ajrlzt' }).then((res) => {
        if (res.code === '000000') {
          this.ajztCodes['ajrlzt_pajyh'] = []
          this.ajztCodes['ajrlzt_lazpa'] = []
          this.ajztCodes['ajrlzt_lazq'] = []
          this.ajztCodes['ajrlzt_gd'] = []
          for (let i = 0; i < res.data.length; i++) {
            const b = res.data[i]
            this.ajztCodes[b.codeLx].push(Number(b.code))
          }
          if (this.checkCodes(this.ajztCodes['ajrlzt_pajyh'], Number(this.ajInfo.AJZT))) {
            this.showLaData = true
            this.showPaData = true
          } else if (this.checkCodes(this.ajztCodes['ajrlzt_lazpa'], Number(this.ajInfo.AJZT))) {
            this.showLaData = true
          } else if (this.checkCodes(this.ajztCodes['ajrlzt_lazq'], Number(this.ajInfo.AJZT))) {
            this.showLaData = false
            this.showPaData = false
          } else if (this.checkCodes(this.ajztCodes['ajrlzt_gd'], Number(this.ajInfo.AJZT))) {
            this.showLaData = true
            this.showPaData = true
          } else {
            this.showLaData = true
            this.showPaData = true
          }
        }
      })
    },
    checkCodes(array, code) {
      let result = false
      for (let i = 0; i < array.length; i++) {
        if (array[i] === code) {
          result = true
          break
        }
      }
      return result
    }
  },
  created: function() { // 监听 无文书提交申请后 更新案件梗概的状态显示
    Bus.$on('ajgenggai', message => {
      if (this.ajbh) {
        this.queryFlwsInfo()
      }
    })
  },
  // beforeDestroy() {
  //   Bus.$off('ajgenggai')
  // },
  mounted() {
    // alert(JSON.stringify(this.ajInfo))
    // 判断是否有案件认领按钮权限
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))

    if (this.curDept.depType === '4') {
      // 调接口查 派出所的上级
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.pcsParentDept = response.data

          if (this.$route.query.rlDept && this.pcsParentDept.departCode !== this.$route.query.rlDept) {
            this.rlBtn = false
            this.showYear = false
            this.showLaData = false
            this.showPaData = false
          }
        }
      }).catch(() => {
        this.caseLoading = false
      })
    } else {
      if (this.$route.query.rlDept && this.curDept.depCode !== this.$route.query.rlDept) {
        this.rlBtn = false
        this.showYear = false
        this.showLaData = false
        this.showPaData = false
      }
    }

    if (this.bh) {
      this.ajInfo = this.info
      this.ajbh = this.bh
      this.AJID = this.ajid
      this.interFaceType = this.type
      this.isRls = this.Rl
      if (this.ajInfo.LARQ && this.ajInfo.LARQ.length === 8) {
        // var y = this.ajInfo.LARQ.substr(0, 4)
        // var m = this.ajInfo.LARQ.substr(6, 6)
        // var d = this.ajInfo.LARQ.substr(6, 8)

        // ldaDate = y + '-' + m + '-' + d
        this.laDate = this.ajInfo.LARQ
      }
      if (this.ajInfo.PARQ && this.ajInfo.PARQ.length === 8) {
        // var y1 = this.ajInfo.PARQ.substr(0, 4)
        // var m1 = this.ajInfo.PARQ.substr(6, 6)
        // var d1 = this.ajInfo.PARQ.substr(6, 8)
        // this.paDate = y1 + '-' + m1 + '-' + d1
        this.paDate = this.ajInfo.PARQ
      }
      this.getAjztCodes()
    }

    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ajgg {
  .featureImg {
    cursor: pointer;
    margin-top: -4px;
  }
  .orange_text {
    color: #ff8547;
    text-shadow: none;
    cursor: pointer;
  }
  .blue_text {
    color: #00a0e9;
    text-shadow: none;
    cursor: pointer;
  }
  .green_text {
    color: #00ff00;
    text-shadow: none;
    cursor: pointer;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .clearfix:after {
    clear: both;
    display: block;
    content: "";
  }
  // .synopsis_bot_wrap {
  //   width: 96%;
  //   margin: 0 2%;
  // }
  .synopsis_bot_cell {
    float: left;
    margin-right: 20px;
  }
  .right_cell {
    float: left;
  }
  .ajlx_cascader,
  .ajgg_date {
    width: 160px;
    margin-right: 20px;
  }
  .case_btn {
    float: right;
    cursor: pointer;
    // width: 114px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    margin-left: 16px;
    font-size: 14px;
    text-align: center;
    background: linear-gradient(top, #51ace0, #187de0);
    border-radius: 4px;
  }
  .case_btn.el-button:focus,
  .case_btn.el-button:hover {
    color: #ffffff;
  }
  .zbjl {
    padding: 20px 14px 10px 20px;
  }
  .flws_text {
    float: left;
    // margin-left: 20px;
    height: 30px;
    line-height: 30px;
  }
  .shadow_text {
    color: #bce8fc;
    text-shadow: 0 0 1px #fff;
  }
  .el-message-box .el-message-box__btns {
    text-align: right;
  }
}
// 案件认领按钮 被禁止样式重写
// .case_btn.is-disabled {
//   background: #51ace0;
//   border-color: #51ace0;
//   color: #fff;
// }
// .case_btn.is-disabled:hover {
//   background: #51ace0;
//   border-color: #51ace0;
//   color: #cccccc;
// }
</style>


