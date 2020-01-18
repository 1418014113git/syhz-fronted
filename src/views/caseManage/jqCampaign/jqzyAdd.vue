<template>
 <!--集群战役-- 申请，重新申请，下发都是改页面处理-->
<div class="jqzyAdd">
  <el-row class="report">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
  </el-row>
  <el-card class="report" v-loading="pageLoading">
    <!-- <p  class="tittle">{{pageTitle}}</p> -->
    <el-form :model="form" size="small" ref="form"  :rules="rules"  label-width="120px" style="width:80%;margin:20px auto 0 auto;">
      <el-row type="flex" justify="center" v-if="isShowotherform">
        <el-col :span="23">
          <el-form-item label="标题" prop="clusterTitle">
            <el-input v-model.trim="form.clusterTitle" auto-complete="off" clearable maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="pageType==='xf' || pageType==='bxf' || pageType==='editbxf' || pageType==='editxf'">
        <el-row type="flex" justify="space-around" v-if="isShowotherform">
          <el-col :span="11">
            <el-form-item label="发起单位" prop="applyDeptName">
              <el-input v-model.trim="form.applyDeptName" auto-complete="off"  placeholder="" maxlength="50" disabled></el-input>
            </el-form-item>
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                placeholder=""
                style="width:100%;"
                :disabled="kssjdisableCtrol()"
                @change="startChange"
                >
              </el-date-picker>
            </el-form-item>
              <el-form-item label="发起人" prop="applyPersonName">
                <el-input  v-model.trim="form.applyPersonName" auto-complete="off" clearable placeholder="" maxlength="20" disabled></el-input>
              </el-form-item>
              <el-form-item label="涉及省/市数" prop="clusterCitys">
                <el-input v-model.trim="form.clusterCitys" maxlength="2"  placeholder="" clearable  @keyup.native="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编号" prop="clusterNumber">
                <el-input v-model.trim="form.clusterNumber" maxlength="20"  placeholder="" clearable  :disabled="bhdisableCtrol()"></el-input>
              </el-form-item>
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="form.endDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerOptions"
                  placeholder=""
                  style="width:100%;"
                  >
                </el-date-picker>
               </el-form-item>
              <el-form-item label="发起人电话" prop="applyPersonPhone">
                <el-input v-model.trim="form.applyPersonPhone" auto-complete="off" clearable maxlength="13"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      <div  v-else>
        <el-row type="flex" justify="space-around" v-if="isShowotherform">
          <el-col :span="11">
            <el-form-item label="发起单位" prop="applyDeptName">
              <el-input v-model.trim="form.applyDeptName" auto-complete="off"  placeholder="" maxlength="50" disabled></el-input>
            </el-form-item>
             <el-form-item label="开始日期" prop="startDate" v-if="Number(ajstatus)> 3">
              <el-date-picker
                v-model="form.startDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                placeholder=""
                style="width:100%;"
                :disabled="kssjdisableCtrol()"
                @change="startChange"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发起人" prop="applyPersonName">
              <el-input  v-model.trim="form.applyPersonName" auto-complete="off" clearable placeholder="" maxlength="20" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="涉及省/市数" prop="clusterCitys">
              <el-input v-model.trim="form.clusterCitys" maxlength="2"  placeholder="" clearable  @keyup.native="number"></el-input>
            </el-form-item>
              <el-form-item label="结束日期" prop="endDate" v-if="Number(ajstatus)> 3">
              <el-date-picker
                  v-model="form.endDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerOptions"
                  placeholder=""
                  style="width:100%;"
                  >
              </el-date-picker>
               </el-form-item>
            <el-form-item label="发起人电话" prop="applyPersonPhone">
              <el-input v-model.trim="form.applyPersonPhone" auto-complete="off" clearable maxlength="13"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="23">
          <el-form-item label="涉及线索" prop="" class="stxt" v-if="isShowxsform">
            <el-button  @click="drxs">导入线索</el-button>
            <span class="marl" @click="distribute('0','')">线索总数： <span class="numStyle">  {{xsNum.total}}</span></span>
            <span class="marl" @click="distribute('2','2')">已分发线索： <span class="numStyle">  {{xsNum.distribute}}</span></span>
            <span class="marl" @click="distribute('1','1')">未分发线索： <span class="numStyle">  {{xsNum.total-xsNum.distribute}}</span></span>
            <el-button  class="marl" @click="distribute('0','')">分发</el-button>
          </el-form-item>
          <el-form-item label="涉及单位" prop="" class="stxt" v-if="isShowxsform">
            <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" max-height="400" show-summary>
              <el-table-column type="index" width="60" label="序号" ></el-table-column>
              <el-table-column prop="deptName"  label='单位'  min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="clueCount"  label="线索数量"  width="200">
                <template slot-scope="scope">
                  <span class="linkColor"  @click="distribute('list',scope.row)">{{scope.row.clueCount}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="100">
                <template slot-scope="scope">
                  <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="distribute('list',scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="正文" prop="assistContent"  v-if="isShowotherform" placeholder="请输入正文">
            <vue-editor v-model="form.assistContent" useCustomImageHandler @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
          </el-form-item>
          <el-form-item label="附件" style="margin-top: 15px;"  v-if="isShowotherform">
            <el-upload class="upload-demo" drag multiple  ref="fileUpload"
                :action="uploadAction"
                :auto-upload="true"
                :file-list="attachment"
                :on-success="imgSuccess"
                :on-remove="imgRemove"
                :before-remove="imgBfRemove"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :limit="10"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，最多10个</div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="查阅密码" prop="passKey" v-if="isShowotherform">
            <el-input v-model.trim="form.passKey"  type="password" auto-complete="off" clearable  maxlength="8" placeholder="6~20位大小写字母、数字"></el-input>
          </el-form-item>
          <el-form-item label="审核单位" prop="acceptDeptId"  v-if="isShowotherform && pageType!=='xf' && pageType!=='bxf' && pageType !=='editxf' && pageType!=='editbxf'">
            <el-select v-model="form.acceptDeptId" class="input_w"  @change="deptChange">
              <el-option v-for="(item,index) in exDeptData" :key="index" :label="item.departName" :value="item.acceptDeptId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tabC btnUpLine" style="margin-top: 20px;">
        <el-col :span="20">
          <el-button  @click="cancelEdit" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
          <el-button  type="primary" @click="apply" :loading="btnLoading" class="saveBtn" v-if="isShowApplyBtn">{{btnText}}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <!-- 导入线索弹框-->
  <el-dialog title="导入线索" :visible.sync="isShowdrxsDialog"  class="drxsForm" :close-on-click-modal="false">
    <import-clue  :isShowDialog="isShowdrxsDialog"  @closeDialog="closedrxsDialog" :id="id" @result="getResult"  :xcstatus="ajstatus"></import-clue>
  </el-dialog>

  <!-- 分发线索-->
  <el-dialog title="分发线索" :visible.sync="isShowdrffxsDialog"  class="ffxsForm" :close-on-click-modal="false"  @close="clearChildData">
    <jqzy-disib   ref="ffchild" :isShowDialog="isShowdrffxsDialog"  @closeDialog="closeffxsDialog" :id="id"   :fastatus="qbxsDistribute"  :jsdw="receiveName"  :source="pageType"  @result="getfaResult" :xcstatus="ajstatus" :isDel="isDel"></jqzy-disib>
  </el-dialog>
</div>
</template>

<script>
// import { getSessionDeptSelect } from '@/api/depts'
import { uploadImg } from '@/utils/editorUpload'
// import { getParentDeptArray } from '@/api/dept'
import VueEditor from '@/components/Editor/VueEditor'
import ImportClue from './components/importClue'
import JqzyDisib from './components/jqzyDisib'

export default {
  name: 'jqzyAdd',
  components: {
    VueEditor,
    ImportClue,
    JqzyDisib
  },
  data() {
    return {
      form: {
        clusterTitle: '', // 标题
        applyDeptName: '', // 发起单位
        applyPersonName: '', // 发起人
        clusterCitys: '', // 涉及省/市数
        applyPersonPhone: '', // 发起人电话
        assistContent: '', // 正文
        acceptDeptId: '', // 审核部门Id
        acceptDeptName: '', // 审核部门名称
        acceptDept: '', // 审核部门code
        passKey: '', // 查阅密码
        startDate: '', // 开始时间   下发或部下发时有
        endDate: '', // 结束时间   下发或部下发时有
        clusterNumber: '', // 编号  下发或部下发时有
        userId: '', // 当前用户Id
        userName: '', // 当前用户真实姓名
        curDeptCode: '', // 当前部门code
        curDeptName: '', // 当前部门名称
        curDeptId: '', // 当前部门Id
        attachment: '' // 附件
      },
      curDeptCode: '', // 当前部门code  登录上来是派出所时，存储他的父级单位作为他自己的单位
      curDepartId: '', // 当前部门id   登录上来是派出所时，存储他的父级单位作为他自己的单位
      curDeptName: '', // 当前部门名称   登录上来是派出所时，存储他的父级单位作为他自己的单位
      receiveName: '', // 点击涉及单位当前行时，将涉及单位名称传递给线索列表。
      qbxsDistribute: '', // 点击线索数字时，将数字状态传递给线索列表。
      attachment: [], // 导入的附件集合
      id: '', // 集群id
      editId: '', // 保存成功后返回的id
      listData: [], // 涉及单位列表
      xsNum: { // 线索数
        total: 0, // 线索总数
        distribute: 0 // 已分发线索数
      },
      pickerOptions: { // 控制开始时间只能大于等于当前时间
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      pageType: '', // 页面来源 是从列表上方查询条件按钮点击进来，还是列表行编辑按钮点击进来，还是从详情页点击进来
      pageLoading: false, // 页面加载loading
      listLoading: false, // 涉及单位loading
      btnLoading: false, // 底部按钮loading
      isShowApplyBtn: false, // 初始化时不显示申请/下发按钮，当点击保存成功后，显示申请/下发按钮。
      isShowxsform: false, // 是否显示涉及线索和涉及单位
      isShowotherform: true, // 是否显示涉及线索和涉及单位以外的基础form信息
      isShowdrxsDialog: false, // 是否显示导入线索弹框
      isShowdrffxsDialog: false, // 是否显示分发线索弹出框
      inittype: '', // 初始化时默认是空，当初始化时点击了保存按钮保存成功后， 赋值：inittype=1
      uploadAction: this.UploadAttachment.uploadFileUrl,
      curDept: {},
      curUser: {},
      exDeptData: [], // 审核单位下拉框
      pageTitle: '', // 页面标题
      btnText: '', // 按钮文字
      ajstatus: '', // 列表页传递过来的案件状态
      isDel: false, // 详情页点击重新申请时，传递改参数，则线索分发页面的线索可删除。
      rules: {
        clusterTitle: [{ // 标题
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入标题'))
            } else {
              if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        }],
        applyPersonName: [{ // 发起人
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入发起人姓名'))
            } else {
              if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        }],
        applyPersonPhone: [{ // 发起人电话
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const regMoble = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            var regFixMob = /^([0-9]{3,4}-)?[0-9]{7,8}$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入座机或手机号码，座机格式如：区号-8位座机号码'))
            } else if (this.$regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else if (regMoble.test(value) || regFixMob.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的电话号码,座机格式如：区号-8位座机号码'))
            }
          }
        }],
        clusterCitys: [ //  涉及省/市数
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        applyDeptName: [ //  发起单位
          { required: true, message: '请输入发起单位', trigger: 'blur' }
        ],
        clusterNumber: [{//  编号
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var regNumber = /^[A-Za-z0-9]+$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入编号'))
            } else if (!regNumber.test(value)) {
              callback(new Error('仅支持英文、数字'))
            } else {
              if (this.pageType === 'editbxf' || this.pageType === 'edit' || this.pageType === 'detail' || this.pageType === 'editxf') { // 编辑时，不做重复校验
                callback()
              } else {
                this.$query('casecluster/numberValid', { dept: this.curDept.depCode, numStr: value, id: this.id }).then((response) => { // 查询是否重复
                  if (!response.data) {
                    return callback(new Error('编码不能重复'))
                  }
                  callback()
                })
              }
            }
          }
        }],
        assistContent: [{ // 正文
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入正文内容'))
            } else {
              callback()
            }
          }
        }],
        acceptDeptId: [ //  审核单位
          { required: true, message: '请选择审核单位', trigger: 'change' }
        ],
        startDate: [{ // 开始时间
          required: true, trigger: 'change', message: '请选择开始时间'
        }],
        // startDate: [ // 开始时间
        //   {
        //     required: true, trigger: 'change', validator: (rule, value, callback) => {
        //       if (value === '' || value === undefined || value === null) {
        //         return callback(new Error('请选择开始时间'))
        //       } else {
        //         var curTime = this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
        //         var values = this.$parseTime(new Date(value), '{y}-{m}-{d} {h}:{i}')
        //         if (new Date(values).getTime() < new Date(curTime).getTime()) {
        //           // if (!this.ajstatus) { // 创建时间
        //           //   return callback(new Error('开始时间不能小于当前时间'))
        //           // } else {
        //           //   callback()
        //           // }
        //           return callback(new Error('开始时间不能小于当前时间'))
        //         } else {
        //           callback()
        //         }
        //       }
        //     }
        //   }
        // ],
        endDate: [ // 结束时间
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                return callback(new Error('请选择结束时间'))
              } else {
                if (this.form.startDate) {
                  var startDate = (new Date(this.form.startDate)).getTime()
                  var endDate = (new Date(value).getTime())
                  if (endDate < startDate) {
                    return callback(new Error('结束时间不能小于开始时间'))
                  } else if (endDate > startDate && Number(endDate) - Number(startDate) < 172800000) {
                    return callback(new Error('结束时间必须大于开始时间2天以上'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          }
        ],
        passKey: [ //   查阅密码
          {
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback()
              } else {
                if (!this.$regEnNumber.test(value)) {
                  return callback(new Error('查阅密码只支持输入6~20位英文和数字！'))
                }
              }
              return callback()
            }
          },
          { min: 6, max: 8, message: '长度在6~20位英文和数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    editInit() {
      this.detail()
    },
    detail() { // 查询详情
      this.pageLoading = true
      var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      this.$query('casecluster/' + this.id, {}).then((response) => {
        this.pageLoading = false
        var data = response.data
        this.form.clusterTitle = data.title ? data.title : '' // 标题
        if (this.$route.query.type === 'editbxf') {
          this.form.applyDeptName = '公安部'
        } else {
          this.form.applyDeptName = data.applyDeptName ? data.applyDeptName : '' // 发起单位
        }
        this.form.applyPersonName = data.applyPersonName ? data.applyPersonName : '' // 发起人
        this.form.clusterCitys = data.clusterCitys ? data.clusterCitys : 0 // 涉及省/市数
        this.form.applyPersonPhone = data.applyPersonPhone ? data.applyPersonPhone : '' // 发起人电话
        this.form.assistContent = data.assistContent ? data.assistContent : '' // 正文
        this.form.clusterNumber = data.clusterNumber ? data.clusterNumber : '' // 编号
        this.form.startDate = data.startDate ? data.startDate : '' // 开始时间
        this.form.endDate = data.endDate ? data.endDate : '' // 结束时间
        this.attachment = data.attachment ? JSON.parse(data.attachment) : [] // 附件
        this.form.attachment = data.attachment ? data.attachment : '' // 附件
        this.form.passKey = data.passKey ? data.passKey : '' // 密码
        this.xsNum.total = data.clueTotal// 线索总数
        this.xsNum.distribute = data.clueDistribute // 已分发线索数
        this.form.userId = data.applyPersonId // 发起人Id
        this.form.userName = data.applyPersonName // 发起人姓名
        this.form.curDeptCode = data.applyDeptCode // 发起部门code
        this.form.curDeptName = data.applyDeptName // 发起部门名称
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === data.applyDeptCode) {
            this.form.curDeptId = dept.id // 发起部门id
            break
          }
        }
        this.getDeptsshdw() // 查审核单位
        this.queryList(data.clusterId) // 查询涉及单位对应的列表
      }).catch(() => {
        this.pageLoading = false
        this.listData = []
      })
    },
    clearChildData() {
      this.isShowdrffxsDialog = false
      this.qbxsDistribute = ''
      this.$refs.ffchild.clearData()
      this.queryList(this.id) // 查询涉及单位对应的列表
    },
    queryList(clusterId) { // 查询涉及单位对应的列表
      this.listLoading = true
      this.$query('caseassistclue/simpleList', { assistId: clusterId }).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.listData = response.data
        } else {
          this.listData = []
        }
      }).catch(() => {
        this.listLoading = false
        this.listData = []
      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['acceptDeptId']) {
            this.form.acceptDeptName = this.exDeptData[i]['departName'] // 审核部门名称
            this.form.acceptDept = this.exDeptData[i]['departCode'] // 审核部门code
            return true
          }
        }
      } else {
        this.form.acceptDeptId = null // 审核部门Id
        this.form.acceptDeptName = null // 审核部门名称
        this.form.acceptDept = null // 审核部门code
      }
    },
    toList() {
      this.$router.back(-1)
    },
    delgetDate(strDate) {
      var t = Date.parse(strDate)
      if (!isNaN(t)) {
        return new Date(Date.parse(strDate.replace(/-/g, '/')))
      } else {
        return new Date()
      }
    },
    calculateDate(date, days, hours) {
      const d = new Date(date)
      if (days) {
        d.setDate(d.getDate() + days)
      }
      if (hours) {
        d.setHours(d.getHours() + hours)
      }
      const m = d.getMonth() + 1
      return d.getFullYear() + '-' + m + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.resetForm()
        if (this.pageType === 'detail') {
          this.$router.push({ path: '/jqCampaign/detail', query: { id: this.id }}) // 跳转到详情页
        } else {
          this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
        }
      })
    },
    handleImg() {
      if (this.attachment.length > 0) {
        const arr = []
        for (let i = 0; i < this.attachment.length; i++) {
          const img = this.attachment[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.form.attachment = JSON.stringify(arr)
      }
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.form = {
        clusterTitle: '', // 标题
        applyDeptName: '', // 发起单位
        applyPersonName: '', // 发起人
        clusterCitys: '', // 涉及省/市数
        applyPersonPhone: '', // 发起人电话
        assistContent: '', // 正文
        passKey: '' // 查阅密码
      }
    },
    getDeptsshdw() { // 查询审核单位
      this.form.curDeptType = this.curDept.depType // 部门类型
      var paramCode = ''
      if (this.curDept.depType === '4') { // 派出所
        paramCode = this.form.curDeptCode ? this.form.curDeptCode : this.curDept.parentDepCode
      } else {
        paramCode = this.form.curDeptCode ? this.form.curDeptCode : this.curDept.depCode
      }
      // 查审核单位 自己的上级
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          var exDeptData = {
            departCode: response.data.departCode,
            departName: response.data.departName,
            acceptDeptId: response.data.id
          }
          this.exDeptData = [exDeptData]
        }
      }).catch(() => {
      })
    },
    getfqDepts() { // 如果登上来的是派出所 发起单位显示他的父级单位
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.form.applyDeptName = response.data.departName
          this.curDeptName = response.data.departName // 当前部门名称
          this.curDepartId = response.data.id // 当前部门id
          this.curDeptCode = response.data.departCode // 当前部门code
        }
      }).catch(() => {
      })
    },
    imgSuccess(res, file, fileList) {
      if (res.code !== '000000') {
        this.$alert('上传失败， 请重新上传', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.clearFileList()
          }
        })
        return false
      }
      this.attachment = fileList
    },
    clearFileList() {
      this.$refs.fileUpload.abort()
      const elementArr = document.getElementsByClassName('el-upload-list__item')
      for (let i = 0; i < elementArr.length; i++) {
        const element = elementArr[i]
        if (i === elementArr.length - 1) {
          element.setAttribute('style', 'display: none;')
          element.remove()
        }
      }
    },
    imgRemove(file, fileList) {
      this.attachment = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {

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
      }).catch((e) => { })
    },

    drxs() { // 导入线索
      this.isShowdrxsDialog = true // 显示导入线索谈框
    },
    distribute(type, data) { // 分发
      if (type === 'list') { // 点击涉及单位当前行
        this.receiveName = data.deptName
        this.qbxsDistribute = ''
      } else { // 点击线索数字时，获取当前数字的状态
        this.receiveName = ''
        this.qbxsDistribute = data
      }
      this.isShowdrffxsDialog = true
    },
    closedrxsDialog(val) { // 关闭导入线索弹框
      this.isShowdrxsDialog = val
      this.queryxsNumber() // 查询导入后的线索数量
      this.queryList(this.id) // 查询涉及单位对应的列表
    },
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowdrffxsDialog = val
      this.queryxsNumber() // 查询导入后的线索数量
      this.queryList(this.id) // 查询涉及单位对应的列表
    },
    queryxsNumber() { // 查询导入后的线索数量
      this.$query('caseassistclue/getCluesNum', { assistId: this.id }).then((response) => {
        this.xsNum.attachment = response.data.clueTotal// 线索总数
        this.xsNum.distribute = response.data.clueDistribute // 已分发线索数
      }).catch(() => {
      })
    },
    save() { // 保存
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleImg() // 附件list数据改造，用于编辑时的附件展示使用
          if (this.pageType === 'add' || this.pageType === 'xf' || this.pageType === 'bxf') { // 申请，下发,部下发页面 （添加类）
            this.form.userId = this.curUser.id // 当前用户Id
            this.form.userName = this.curUser.realName // 当前用户真实姓名
            this.form.status = 0 // 协查状态   0 保存（草稿）， 1 申请 （待审核）， 5 下发 （协查中）
            if (this.curDept.depType === '4') { // 派出所 将它的父级单位当成自己单位
              this.form.curDeptName = this.curDeptName // 当前部门名称
              this.form.curDeptCode = this.curDeptCode // 当前部门code
              this.form.curDeptId = this.curDepartId // 当前部门id
            } else {
              this.form.curDeptName = this.curDept.depName // 当前部门名称
              this.form.curDeptCode = this.curDept.depCode // 当前部门code
              this.form.curDeptId = this.curDept.id // 当前部门id
            }
            this.add()
          } else { // 重新申请， （编辑类）
            this.edit()
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    add() {
      this.btnLoading = true
      if (this.isShowotherform) { // 第一次点击保存，涉及线索和涉及单位此时都不显示。
        const param = {
          clusterTitle: this.form.clusterTitle,
          applyDeptName: this.form.applyDeptName,
          applyPersonName: this.form.applyPersonName,
          clusterCitys: this.form.clusterCitys,
          applyPersonPhone: this.form.applyPersonPhone,
          assistContent: this.form.assistContent,
          acceptDeptId: this.form.acceptDeptId,
          acceptDeptName: this.form.acceptDeptName,
          acceptDept: this.form.acceptDept,
          passKey: this.form.passKey,
          userId: this.form.userId, // 当前用户Id
          userName: this.form.userName, // 当前用户真实姓名
          curDeptCode: this.form.curDeptCode, // 当前部门code
          curDeptName: this.form.curDeptName, // 当前部门名称
          curDeptId: this.form.curDeptId, // 当前部门Id
          attachment: this.form.attachment, // 附件
          status: 0, // 协查状态
          operator: 'other'
        }
        if (this.pageType === 'xf' || this.pageType === 'bxf') { // 下发，部下发
          param.startDate = this.form.startDate // 开始时间
          param.endDate = this.form.endDate // 结束时间
          param.clusterNumber = this.form.clusterNumber // 集群战役编号
        }
        if (this.pageType === 'xf') { // 下发
          param.category = 2
        } else if (this.pageType === 'bxf') { // 部下发
          param.category = 1
        } else {
          param.category = 3
        }
        this.$save('casecluster/save', param).then((response) => {
          this.editId = response.data // 保存成功后返回的id
          this.id = response.data // 保存成功后返回的id
          this.btnLoading = false
          this.isShowotherform = false // 保存成功，隐藏基础form信息
          this.isShowxsform = true // 保存成功，显示涉及线索和涉及单位
          this.isShowApplyBtn = true // 保存成功后，显示申请按钮。
        }).catch(() => {
          this.btnLoading = false
        })
      } else { //  初始化时保存成功，此时申请按钮，涉及线索和涉及单位都显示，其他的内容都隐藏。
        this.btnLoading = false
        if (!this.xsNum.total) {
          this.$message({ message: '请导入线索', type: 'error' })
        } else if (this.listData.length === 0) {
          this.$message({ message: '请分发线索', type: 'error' })
        } else {
          this.$message({
            message: '保存成功！',
            type: 'success',
            duration: 2000
          })
          if (this.pageType === 'detail') {
            this.$router.push({ path: '/jqCampaign/detail', query: { id: this.id }}) // 跳转到详情页
          } else {
            this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
          }
          // this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
        }
      }
    },
    edit() {
      this.btnLoading = true
      const param = {
        clusterTitle: this.form.clusterTitle,
        applyDeptName: this.form.applyDeptName,
        applyPersonName: this.form.applyPersonName,
        clusterCitys: this.form.clusterCitys,
        applyPersonPhone: this.form.applyPersonPhone,
        assistContent: this.form.assistContent,
        acceptDeptId: this.form.acceptDeptId,
        acceptDeptName: this.form.acceptDeptName,
        acceptDept: this.form.acceptDept,
        passKey: this.form.passKey,
        userId: this.form.userId, // 当前用户Id
        userName: this.form.userName, // 当前用户真实姓名
        curDeptCode: this.form.curDeptCode, // 当前部门code
        curDeptName: this.form.curDeptName, // 当前部门名称
        curDeptId: this.form.curDeptId, // 当前部门Id
        attachment: this.form.attachment, // 附件
        status: 0, // 协查状态
        operator: 'update'
      }

      if (Number(this.ajstatus) > 3) { // 审核通过之后 总队进来的编辑别的单位申请的线索
        param.status = this.ajstatus
      }
      var curTime = this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
      if (this.form.endDate) {
        var endtime = this.$parseTime(new Date(this.form.endDate), '{y}-{m}-{d} {h}:{i}')
      }
      if ((this.ajstatus === '6' || this.ajstatus === '7') && (this.form.endDate && new Date(endtime).getTime() > new Date(curTime).getTime())) { // 总队编辑处于协查结束或协查超时状态，结束时间调整为当前日期之后时，状态调整为“协查中”。
        param.status = 5 // 协查中
      }
      param.operatorType = param.status === 5 && (this.ajstatus === '5' || this.ajstatus === '6' || this.ajstatus === '7') ? 'update' : 'save'
      if (this.form.startDate) {
        param.startDate = this.form.startDate // 开始时间
      }
      if (this.form.endDate) {
        param.endDate = this.form.endDate // 结束时间
      }
      param.clusterNumber = this.form.clusterNumber ? this.form.clusterNumber : '' // 集群战役编号
      // if (this.pageType === 'editxf' || this.pageType === 'editbxf') { // 编辑下发，编辑部下发
      //   // param.startDate = this.form.startDate // 开始时间
      //   // param.endDate = this.form.endDate // 结束时间
      //   param.clusterNumber = this.form.clusterNumber // 集群战役编号
      // }

      if (this.pageType === 'detail' || this.pageType === 'edit') {
        param.category = 3
      } else if (this.pageType === 'editxf') {
        param.category = 2
      } else if (this.pageType === 'editbxf') {
        param.category = 1
      }

      if (this.isShowotherform) { // 第一次点击保存，涉及线索和涉及单位此时都不显示。
        param.id = this.id
        this.$save('casecluster/save', param).then((response) => {
          this.editId = response.data // 保存成功后返回的id
          this.btnLoading = false
          this.isShowotherform = false // 保存成功，隐藏基础form信息
          this.isShowxsform = true // 保存成功，显示涉及线索和涉及单位
          this.isShowApplyBtn = true // 保存成功后，显示申请按钮。
        }).catch(() => {
          this.btnLoading = false
        })
      } else { //  初始化时保存成功，此时申请按钮，涉及线索和涉及单位都显示，其他的内容都隐藏。
        this.btnLoading = true
        param.id = this.editId
        if (!this.xsNum.total) {
          this.btnLoading = false
          this.$message({ message: '请导入线索', type: 'error' })
        } else if (!this.xsNum.distribute) {
          this.btnLoading = false
          this.$message({ message: '请分发线索', type: 'error' })
        } else {
          this.$save('casecluster/save', param).then((response) => {
            this.$message({
              message: '保存成功！',
              type: 'success',
              duration: 2000
            })
            this.btnLoading = false
            if (this.pageType === 'detail') {
              this.$router.push({ path: '/jqCampaign/detail', query: { id: this.id }}) // 跳转到详情页
            } else {
              this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      }
    },
    apply() { // 申请 或 下发
      this.btnLoading = true
      const param = {
        clusterTitle: this.form.clusterTitle,
        applyDeptName: this.form.applyDeptName,
        applyPersonName: this.form.applyPersonName,
        clusterCitys: this.form.clusterCitys,
        applyPersonPhone: this.form.applyPersonPhone,
        assistContent: this.form.assistContent,
        acceptDeptId: this.form.acceptDeptId,
        acceptDeptName: this.form.acceptDeptName,
        acceptDept: this.form.acceptDept,
        passKey: this.form.passKey,
        userId: this.form.userId, // 当前用户Id
        userName: this.form.userName, // 当前用户真实姓名
        curDeptCode: this.form.curDeptCode, // 当前部门code
        curDeptName: this.form.curDeptName, // 当前部门名称
        curDeptId: this.form.curDeptId, // 当前部门Id
        attachment: this.form.attachment, // 附件
        id: this.editId,
        operator: 'submit'
      }
      if (this.btnText === '申 请') {
        if (this.form.startDate) {
          param.startDate = this.form.startDate // 开始时间
        }
        if (this.form.endDate) {
          param.endDate = this.form.endDate // 结束时间
        }
        param.category = 3
        if (!this.xsNum.total) {
          this.$message({ message: '请导入线索', type: 'error' })
          this.btnLoading = false
        } else if (this.listData.length === 0) {
          this.$message({ message: '请分发线索', type: 'error' })
          this.btnLoading = false
        } else {
          param.status = 1
          var curTime = this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
          if (this.form.endDate) {
            var endtime = this.$parseTime(new Date(this.form.endDate), '{y}-{m}-{d} {h}:{i}')
          }
          if ((this.ajstatus === '6' || this.ajstatus === '7') && (this.form.endDate && new Date(endtime).getTime() > new Date(curTime).getTime())) { // 总队编辑处于协查结束或协查超时状态，结束时间调整为当前日期之后时，状态调整为“协查中”。
            param.status = 5 // 协查中
          }
          if (Number(this.ajstatus) > 3) { // 审核通过之后 总队进来的编辑别的单位申请的线索
            param.status = this.ajstatus
          }
          param.clusterNumber = this.form.clusterNumber ? this.form.clusterNumber : '' // 集群战役编号
          param.operatorType = param.status === 5 && (this.ajstatus === '5' || this.ajstatus === '6' || this.ajstatus === '7') ? 'update' : 'save'
          this.$save('casecluster/save', param).then((response) => {
            this.btnLoading = false
            this.$message({
              message: '申请成功！',
              type: 'success',
              duration: 2000
            })

            if (this.pageType === 'detail') {
              this.$router.push({ path: '/jqCampaign/detail', query: { id: this.id }}) // 跳转到详情页
            } else {
              this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      } else { // 下发
        param.startDate = this.form.startDate // 开始时间
        param.endDate = this.form.endDate // 结束时间
        param.clusterNumber = this.form.clusterNumber // 集群战役编号
        if (this.pageType === 'xf' || this.pageType === 'editxf') { // 下发 或者 编辑时的下发
          param.category = 2
        } else if (this.pageType === 'bxf' || this.pageType === 'editbxf') { // 部下发 或者 编辑时的部下发
          param.category = 1
        }
        if (!this.xsNum.total) {
          this.btnLoading = false
          this.$message({ message: '请导入线索', type: 'error' })
        } else if (this.listData.length === 0) {
          this.btnLoading = false
          this.$message({ message: '请分发线索', type: 'error' })
        } else {
          param.status = 5
          param.operatorType = param.status === 5 && (this.ajstatus === '5' || this.ajstatus === '6' || this.ajstatus === '7') ? 'update' : 'save'
          this.$save('casecluster/save', param).then((response) => {
            this.btnLoading = false
            this.$message({
              message: '下发成功！',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: '/jqcampaign' }) // 跳转到列表页
          }).catch(() => {
            this.btnLoading = false
          })
        }
      }
    },
    number() { // 只能是数字
      var num = this.form.clusterCitys.replace(/[^\.\d]/g, '').replace('.', '')
      this.form.clusterCitys = num
      this.form.clusterCitys = this.form.clusterCitys.replace('.', '')
    },
    handleExceed() { // 上传文件超过最大限制时，提示信息
      this.$message.error(`最多上传10个文件`)
    },
    getResult(val) { // 导入线索页面导入成功后传递的线索数量
      this.xsNum.total = val.clueTotal
      this.xsNum.distribute = val.clueDistribute
    },
    getfaResult(val) { // 分发线索页面执行取消，删除操作后返回的线索数量
      this.xsNum.total = val.clueTotal
      this.xsNum.distribute = val.clueDistribute
    },
    queryNumber() { // 获取编号
      const param = {
        dept: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode // 当前部门code
      }
      this.$query('casecluster/number', param).then((response) => {
        if (response.data) {
          this.form.clusterNumber = response.data
        }
      })
    },
    bhdisableCtrol() { // 编号输入框是否可编辑
      if (this.pageType === 'bxf') { // 部下发 可用
        return false
      } else if (this.pageType === 'editbxf' && (this.ajstatus === '0' || this.ajstatus === '1' || this.ajstatus === '3')) { // 编辑部下发  草稿，待审核，审核不通过 可编辑
        return false
      } else {
        return true
      }
    },
    kssjdisableCtrol() { // 开始时间是否可编辑
      if (this.ajstatus === '5' || this.ajstatus === '6' || this.ajstatus === '7') { // 协查中、协查超时和协查结束时，不可编辑
        return true
      } else {
        return false
      }
    },
    startChange(val) { // 开始时间change事件
      var dates = this.delgetDate(val)
      this.form.startDate = this.calculateDate(dates, 0, '') // 默认当前时间
      this.form.endDate = this.calculateDate(dates, 7, '') // 默认开始时间后7天，
    },
    contentChange(val) {
      this.$refs.form.validateField('assistContent')
    }
  },
  mounted() {
    this.isShowotherform = true // 初始化时，显示涉及线索和涉及单位以外的基础form信息
    this.isShowxsform = false // 初始化时，隐藏涉及线索和涉及单位
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.$route.query.type !== 'bxf' && this.$route.query.type !== 'editbxf') { // 不是'部下发' 或者列表当前点击数据是部下发进来的
        if (this.curDept.depType === '4') { // 派出所
          this.getfqDepts() // 如果登上来的是派出所 发起单位显示成大队
        } else {
          this.form.applyDeptName = this.curDept.depName // 当前登录人单位
        }
      }
    }
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.form.applyPersonName = this.curUser.realName // 当前登录人姓名
    this.form.applyPersonPhone = this.curUser.phone ? this.curUser.phone : '' // 当前登录人电话
    this.pageType = this.$route.query.type
    if (this.$route.query.status) { // 列表页，点击修改跳转过来传递的案件状态
      this.ajstatus = this.$route.query.status // 存储案件状态
    }
    if (this.$route.query.isDel) { // 详情页点击重新申请时，传递该参数，则线索分发页面的线索可删除。
      this.isDel = this.$route.query.isDel
    }

    if (this.$route.query.type === 'add') { // 从列表页面点击“申请”按钮进来的。
      this.pageTitle = '申请集群战役'
      this.btnText = '申 请'
      this.getDeptsshdw() // 查审核单位
    } else if (this.$route.query.type === 'detail' || this.$route.query.type === 'edit') { // 详情页点击“重新申请”按钮进来的，或者主列表点击编辑按钮进来的
      this.isShowotherform = true // 初始化时，显示涉及线索和涉及单位以外的基础form信息
      this.isShowxsform = true // 显示涉及线索和涉及单位
      if (this.$route.query.type === 'detail') {
        this.pageTitle = '申请集群战役'
      } else {
        this.pageTitle = '编辑集群战役'
      }
      this.pageTitle = '编辑集群战役'
      this.btnText = '申 请'
      this.id = this.$route.query.id // 存储集群战役id
      this.editInit() // 编辑页面相关接口查询
      // this.getDeptsshdw() // 查审核单位
    } else if (this.$route.query.type === 'xf') { // 从列表点击“下发”按钮进来的
      this.pageTitle = '下发集群战役'
      this.btnText = '下 发'
      this.form.startDate = this.calculateDate(new Date(), 0, '') // 默认当前时间
      this.form.endDate = this.calculateDate(new Date(), 7, '') // 默认开始时间后7天，
      this.queryNumber() // 获取编号
    } else if (this.$route.query.type === 'bxf') { // 从列表点击“部下发”按钮进来的
      this.pageTitle = '部下发集群战役'
      this.btnText = '下 发'
      this.form.applyDeptName = '公安部'
      this.form.startDate = this.calculateDate(new Date(), 0, '') // 默认当前时间
      this.form.endDate = this.calculateDate(new Date(), 7, '') // 默认开始时间后7天，
    } else if (this.$route.query.type === 'editxf') { // 从主列表点击编辑按钮进来的
      this.isShowxsform = true // 显示涉及线索和涉及单位
      this.id = this.$route.query.id // 存储集群战役id
      this.pageTitle = '编辑集群战役'
      this.btnText = '下 发'
      this.editInit() // 编辑页面相关接口查询
    } else if (this.$route.query.type === 'editbxf') { // 从主列表点击编辑按钮进来的
      this.isShowxsform = true // 显示涉及线索和涉及单位
      this.id = this.$route.query.id // 存储集群战役id
      this.pageTitle = '编辑集群战役'
      this.btnText = '下 发'
      this.form.applyDeptName = '公安部'
      this.editInit() // 编辑页面相关接口查询
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.jqzyAdd {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  .tittle{
    text-align: left;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .input_w {
    width: 100%;
    min-width: 150px;
  }
  .el-collapse-item__header {
    color: #409eff;
  }
  .stxt{
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
  .numStyle{
    cursor: pointer;
    font-weight: bold;
    text-decoration:underline;
  }
  .numStyle:hover{
    color: #00a0e9;
  }
  .marl{
    margin-left: 15px;
  }
  .ffxsForm{
    .el-dialog{
      width: 80%;
      max-height: 80vh;
      overflow: auto;
    }
  }
}
.el-button--text {
    display: none;
}
@media only screen and (max-width: 1367px) {
  .jqzyAdd .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
