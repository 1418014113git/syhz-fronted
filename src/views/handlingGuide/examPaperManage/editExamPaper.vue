<template>
<!--编辑试卷-->
<div class="editExamPaper">
  <el-row class="cardWidth">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
  <el-card class="cardWidth" v-loading="listLoading">
    <el-row type="flex" justify="center" style="margin-top:10px;">
      <el-col :span="20" style="margin-bottom:50px;">
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="110px">
          <el-form-item label="试卷名称" prop="paperName">
            <el-input v-model.trim="form.paperName"  maxlength="50" placeholder="请输入试卷名称" clearable class="inputW" ></el-input>
          </el-form-item>
          <el-form-item label="试卷类型" prop="paperType">
            <el-select  v-model="form.paperType" size="small" placeholder="请选择" @change="paperChange" class="inputW" :disabled="true">
              <el-option v-for="item in zjOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试卷选题" prop="checkst" class="stxt">
            <el-button  @click="checkst" style="margin-right:10px;">点击选题</el-button>
            <span v-if="form.paperType==='1'">注：请选择试卷上所需要的试题 ！</span>
            <span v-else >注：请选择抽取随机试题的模块 ！</span>
          </el-form-item>
          <el-form-item label="已选试题" prop="">
             <!--人工组卷列表-->
            <div v-if="form.paperType==='1'">
              <div v-if="this.rgzjList.length>0">
                <el-form  :model="form" :rules="rules">
                  <el-table  :data="rgzjList"   style="width: 100%;"  class="testList">
                    <el-table-column  label="排序" width="180" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="sort">
                          <el-input-number v-model.trim="scope.row.sort" :min="1" :max="7"  @change="sortChange(scope.row)"></el-input-number>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="试题类型" min-width="100" align="center">
                      <template slot-scope="scope">
                        <a class="linkStyle" @click="openstlist('1',scope.row)">{{getstName(scope.row.type)}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="num" label="题量" min-width="100" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.num}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column  label="每道题分值" min-width="100" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="value">
                          <el-input-number v-model.trim="scope.row.value" :min="1" :max="99"  @change="inputChange(scope.$index,scope.row,1)"></el-input-number>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column  label="说明" min-width="100" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="desc">
                          <el-input v-model.trim="scope.row.desc" type="textarea" placeholder="" maxlength="50"  @change="descinputChange(scope.$index,scope.row,1)"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                  </el-form>
                  <!-- <div style="display:none" >{{ exitsValrg }}</div> -->
                  <div style="overflow:hidden;">
                    <p style="float:left;">试卷卷面总分 <span class="redText">{{rgzjTotal}}</span> 分</p>
                    <p style="float:right;cursor:pointer;" @click="preview(1)"><svg-icon icon-class="yulan"></svg-icon>试卷预览</p>
                  </div>
              </div>
              <span  v-else>还没有选择试题</span>
            </div>

             <!--随机组卷列表-->
            <div v-if="form.paperType==='2'">
              <div v-if="this.sjzjList.length>0">
                <el-form :model="form">
                  <el-table :data="sjzjList"  style="width: 100%;"   class="testList">
                    <el-table-column  label="排序" min-width="120" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="sort">
                          <el-input-number v-model.trim="scope.row.sort" :min="1" :max="7" :disabled="sjdisabled" @change="sortChange(scope.row)"></el-input-number>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="试题类型" width="100" align="center">
                      <template slot-scope="scope">
                        <a class="linkStyle" @click="openstlist('2',scope.row)">{{getstName(scope.row.type)}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cateIds" label="试题模块" min-width="100" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{getModuleName(scope.row.data)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="num" label="题量" min-width="100" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="num">
                          <el-input-number v-model.trim="scope.row.num" :min="0" :max="99"  :disabled="sjdisabled" @change="inputChange(scope.$index,scope.row,2)"></el-input-number>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column  label="每道题分值" min-width="100" align="center">
                    <template slot-scope="scope">
                      <el-form-item prop="value">
                        <el-input-number v-model.trim="scope.row.value" :min="0" :max="99" :disabled="sjdisabled"  @change="inputChange(scope.$index,scope.row,2)"></el-input-number>
                      </el-form-item>
                    </template>
                    </el-table-column>
                    <el-table-column  label="说明" min-width="100" align="center">
                      <template slot-scope="scope">
                        <el-form-item prop="">
                          <el-input v-model="scope.row.desc" type="textarea" placeholder="" maxlength="50"  :disabled="sjdisabled" @change="descinputChange(scope.$index,scope.row,2)"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
                <div style="overflow:hidden;">
                  <p style="float:left;">试卷卷面总分 <span class="redText">{{sjzjTotal}}</span>分</p>
                  <p style="float:right;cursor:pointer;" @click="preview(2)"><svg-icon icon-class="yulan"></svg-icon>试卷预览</p>
                </div>
              </div>
              <span  v-else>还没有选择试题</span>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
      <el-row class="tabC btnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
      </el-row>
  </el-card>

  <!--人工组卷选择试题-->
  <div class="rgzjtk">
    <el-dialog title="选择试题" :visible.sync="rgzjDialog" @close="rgcloseDialog">
      <check-list @checkList="getCheckList"  @closergDialog="closergDialog"  :alreadyCheck="rgzjcheckId" :isClear="isClear"></check-list>
    </el-dialog>
  </div>

  <!--人工组卷试题列表 -- 微调时可删除列表项-->
  <el-dialog title="试题列表" :visible.sync="rgzjstListDialog" @close="closestlist">
    <div>
      <el-table :data="rgzjStList"   style="width: 100%;"  class="rgzjStList">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="deptName" label="单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subjectCategoryName" label="模块" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="试题内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="scope.row.name"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  @click="handleDeleterg(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabC btnUpLine bottomBtn">
        <el-button  @click="closestlist" class="cancelBtn">关 闭</el-button>
      </div>
    </div>
  </el-dialog>

  <!--随机组卷选择试题模块 tree结构-->
  <div class="sjzjtk">
    <el-dialog title="试题模块" :visible.sync="sjzjDialog" @close="sjcloseDialog">
      <check-moudle @closesjDialog="closesjDialog" @sjcheckList="getsjCheckList" :alreadyCheck="sjzjcheckId" :isClose="isClose"></check-moudle>
    </el-dialog>
  </div>


  <!--随机组卷试题模块列表 -- 微调时可删除模块列表项-->
  <el-dialog title="选择试题模块" :visible.sync="sjzjstListDialog" @close="closemklist">
    <div>
      <el-table :data="sjzjStList"   style="width: 100%;"  class="sjzjStList">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="deptName" label="单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="label" label="模块" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="60" v-if="!sjdisabled">
          <template slot-scope="scope">
            <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle   @click="handleDeletesj(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabC btnUpLine bottomBtn">
        <el-button  @click="closemklist" class="cancelBtn">关 闭</el-button>
      </div>
    </div>
  </el-dialog>

   <!-- 预览试卷 -->
  <el-dialog title="试卷预览" :visible.sync="dialogPreviewVisible" size="small" class="previewDia" width="70%">
    <preview-paper :curPaper="curPaperData" :isShowSaveBtn='isShowSaveBtn' :previewProSubmit='previewProSubmit'></preview-paper>
  </el-dialog>
</div>
</template>

<script>
import CheckList from './checkst'
import CheckMoudle from './checkMoudle'
import previewPaper from './previewPaper'
import { questionTypeAll } from '@/utils/codetotext'
import { regEnCode, regCnCode } from '@/utils/validate'
export default {
  components: {
    CheckList,
    CheckMoudle,
    previewPaper
  },
  data() {
    return {
      form: {
        paperName: '', // 试卷名称
        paperType: '1' // 人工组卷:"1" , 自动组卷:"2"
      },
      deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
      deptName: JSON.parse(sessionStorage.getItem('depToken'))[0].depName, // 当前部门name
      creator: JSON.parse(sessionStorage.getItem('userInfo')).userName, // 创建人账号
      sjdisabled: true, // 随机组卷初始化时详细信息不能编辑。除非点击试题模块重新选择试题模块
      isClear: false,
      isClose: false,
      zjOption: [ // 组卷方式
        {
          value: '1',
          label: '人工组卷'
        },
        {
          value: '2',
          label: '随机组卷'
        }
      ],
      isShowSaveBtn: false, // 预览弹框里是否显示保存按钮
      dialogPreviewVisible: false, // 是否显示预览弹框
      listLoading: false, // 详情接口请求前的loading
      rgzjDialog: false, // 是否显示人工组卷选择试题弹框
      sjzjDialog: false, // 是否显示随机组卷选择tree结构试题模块弹框
      rgzjstListDialog: false, // 是否显示人工组卷微调试题列表弹框
      sjzjstListDialog: false, // 是否显示随机组卷微调试题模块列表弹框
      ifExistSj: false,
      ifExistRg: false,
      btnLoading: false, // 保存按钮加载进度条
      CurstType: '', // 当前被点击的试题类型
      sjzjstType: '', // 当前被点击的试题类型--随机组卷
      sjzjTotal: 0, // 随机组卷总分值
      rgzjTotal: 0, // 人工组卷总分值
      rgzjList: [], // 人工组卷列表渲染
      rgzjStList: [], // 人工组卷当前点击试题类型后，将该类型已选择的试题存储到当前集合里。
      sjzjStList: [], // 随机组卷当前点击试题类型后，将该类型已选择的试题模块存储到当前集合里。
      previewProSubmit: [], // 将随机组卷试卷预览接口返回的数据传给试卷预览组件，用于试卷预览页面保存时传给后台保存。
      txData: questionTypeAll(),
      curPaperData: [], // 预览时的试卷内容
      arrKey: ['one', 'two', 'three', 'four', 'five', 'six', 'seven'], // 试题题目顺序集合
      isClickxt: false, // 是否点击了选择试题
      // rgzjList: [ // 人工组卷列表渲染
      //   {
      //     type: '1',
      //     num: '',
      //     value: '',
      //     sort: 1,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '2',
      //     num: '',
      //     value: '',
      //     sort: 2,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '3',
      //     num: '',
      //     value: '',
      //     sort: 3,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '4',
      //     num: '',
      //     value: '',
      //     sort: 4,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '5',
      //     num: '',
      //     value: '',
      //     sort: 5,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '6',
      //     num: '',
      //     value: '',
      //     sort: 6,
      //     desc: '',
      //     data:[]
      //   },
      //   {
      //     type: '7',
      //     num: '',
      //     value: '',
      //     sort: 7,
      //     desc: '',
      //     data:[]
      //   }
      // ],
      sjzjcheckId: [], //  将已选择的试题模块id传给试题tree组件，用于显示已选中的的状态。
      rgzjcheckId: [], //  将已选择的试题列表id传给试题选择组卷，用于显示已选中的的状态。
      sjzjListDefault: [ // 随机组卷默认列表，当前试题被删完后，重新点击试题时，重新将默认值赋给sjzjList
        {
          type: '1',
          num: 0,
          value: 0,
          sort: 1,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '2',
          num: 0,
          value: 0,
          sort: 2,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '3',
          num: 0,
          value: 0,
          sort: 3,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '4',
          num: 0,
          value: 0,
          sort: 4,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '5',
          num: 0,
          value: 0,
          sort: 5,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '6',
          num: 0,
          value: 0,
          sort: 6,
          desc: '',
          cateIds: '',
          data: []
        },
        {
          type: '7',
          num: 0,
          value: 0,
          sort: 7,
          desc: '',
          cateIds: '',
          data: []
        }
      ],
      sjzjList: [ // 随机组卷
        // {
        //   type: '1',
        //   num: 0,
        //   value: 0,
        //   sort: 1,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '2',
        //   num: 0,
        //   value: 0,
        //   sort: 2,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '3',
        //   num: 0,
        //   value: 0,
        //   sort: 3,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '4',
        //   num: 0,
        //   value: 0,
        //   sort: 4,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '5',
        //   num: 0,
        //   value: 0,
        //   sort: 5,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '6',
        //   num: 0,
        //   value: 0,
        //   sort: 6,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // },
        // {
        //   type: '7',
        //   num: 0,
        //   value: 0,
        //   sort: 7,
        //   desc: '',
        //   cateIds: '',
        //   data: []
        // }
      ],
      rules: {
        paperName: [ // 试卷名称
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入试卷名称'))
              } else if (regEnCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else if (regCnCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        ],
        desc: [ // 说明
          {
            // required: true, trigger: 'blur', validator: (rule, value, callback) => {
            //   const reg = /[^!@#￥%\^&\*]+$/i
            //   if (this.form.paperType === '1') { // 人工组卷
            //     this.rgzjList.forEach((item, index) => {
            //       if (!item.desc) {
            //         callback(new Error('请输入题目说明'))
            //       } else if (!reg.test(item.desc)) {
            //         callback(new Error('输入内容不能包含以下字符：！@#￥%……&*'))
            //       } else {
            //         callback()
            //       }
            //     })
            //   } else { // 随机组卷
            //     // this.sjzjList.forEach((item, index) => {
            //     //   if (!item.desc) {
            //     //     callback(new Error('请输入题目说明'))
            //     //   } else if (!reg.test(item.desc)) {
            //     //     callback(new Error('输入内容不能包含以下字符：！@#￥%……&*'))
            //     //   } else {
            //     //     callback()
            //     //   }
            //     // })
            //   }
            // }
          }
        ],
        paperType: [{ // 试卷类型
          required: true, message: '请选择试卷类型', trigger: 'change'
        }],
        checkst: [{
          // required: true, trigger: 'blur', validator: (rule, value, callback) => {
          //   if (this.form.paperType === '1') { // 人工组卷
          //     if (this.rgzjList.length > 0) {
          //       callback()
          //     } else {
          //       callback(new Error('请选择试题'))
          //     }
          //   } else { // 随机组卷
          //     if (this.sjzjcheckList.length > 0) {
          //       callback()
          //     } else {
          //       callback(new Error('请选择试题模块'))
          //     }
          //   }
          // }
        }]
      }
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    query() { // 详情查询
      var paperType = this.$route.query.paperType + ''
      this.listLoading = true
      if (paperType === '1') { // 人工组卷
        this.$query('paper/' + this.$route.query.id, {}).then((response) => {
          this.listLoading = false
          if (response.data) {
            var data = response.data
            this.form = data
            this.form.paperType = this.form.paperType + ''
            this.deletdyObject(data, 1)
          }
        }).catch(() => {
          this.listLoading = false
        })
      } else { // 随机组卷
        this.$query('paper/' + this.$route.query.id + '?type=auto ', {}).then((response) => {
          this.listLoading = false
          if (response.data) {
            var data = response.data
            this.form = data
            this.form.paperType = this.form.paperType + ''
            this.deletdyObject(data, 2)
          }
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    deletdyObject(data, type) {
      if (data.choices) {
        data.choices.sort = Number(data.choices.sort)
        data.choices.type = data.choices.type + ''
        data.choices.value = Number(data.choices.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.choices)
        } else { // 随机组卷
          data.choices.num = Number(data.choices.num)
          this.sjzjList.push(data.choices)
        }
      }
      if (data.multiSelect) {
        data.multiSelect.sort = Number(data.multiSelect.sort)
        data.multiSelect.type = data.multiSelect.type + ''
        data.multiSelect.value = Number(data.multiSelect.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.multiSelect)
        } else { // 随机组卷
          data.multiSelect.num = Number(data.multiSelect.num)
          this.sjzjList.push(data.multiSelect)
        }
      }
      if (data.fillGap) {
        data.fillGap.sort = Number(data.fillGap.sort)
        data.fillGap.type = data.fillGap.type + ''
        data.fillGap.value = Number(data.fillGap.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.fillGap)
        } else { // 随机组卷
          data.fillGap.num = Number(data.fillGap.num)
          this.sjzjList.push(data.fillGap)
        }
      }
      if (data.judge) {
        data.judge.sort = Number(data.judge.sort)
        data.judge.type = data.judge.type + ''
        data.judge.value = Number(data.judge.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.judge)
        } else { // 随机组卷
          data.judge.num = Number(data.judge.num)
          this.sjzjList.push(data.judge)
        }
      }
      if (data.shortAnswer) {
        data.shortAnswer.sort = Number(data.shortAnswer.sort)
        data.shortAnswer.type = data.shortAnswer.type + ''
        data.shortAnswer.value = Number(data.shortAnswer.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.shortAnswer)
        } else { // 随机组卷
          data.shortAnswer.num = Number(data.shortAnswer.num)
          this.sjzjList.push(data.shortAnswer)
        }
      }
      if (data.discuss) {
        data.discuss.sort = Number(data.discuss.sort)
        data.discuss.type = data.discuss.type + ''
        data.discuss.value = Number(data.discuss.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.discuss)
        } else { // 随机组卷
          data.discuss.num = Number(data.discuss.num)
          this.sjzjList.push(data.discuss)
        }
      }
      if (data.caseAnalysis) {
        data.caseAnalysis.sort = Number(data.caseAnalysis.sort)
        data.caseAnalysis.type = data.caseAnalysis.type + ''
        data.caseAnalysis.value = Number(data.caseAnalysis.value)
        if (type === 1) { // 人工组卷
          this.rgzjList.push(data.caseAnalysis)
        } else { // 随机组卷
          data.caseAnalysis.num = Number(data.caseAnalysis.num)
          this.sjzjList.push(data.caseAnalysis)
        }
      }
      this.getRgzjNum(type)
    },
    checkst() { // 点击试题
      if (this.form.paperType === '1') { // 人工组卷
        this.rgzjDialog = true
        var rgzjcheckId = []
        if (this.rgzjList.length > 0) {
          this.rgzjList.forEach(item => {
            var datas = item.data
            if (datas.length > 0) {
              datas.forEach(it => {
                rgzjcheckId.push(it.id)
              })
            }
          })
        }
        this.rgzjcheckId = rgzjcheckId
      } else { // 随机组卷
        this.sjzjDialog = true
        var sjzjcheckId = []
        if (this.sjzjList.length > 0) {
          this.sjzjList.forEach(item => {
            var datas = item.data
            if (datas.length > 0) {
              datas.forEach(it => {
                sjzjcheckId.push(it.id)
              })
            }
          })
          this.sjzjcheckId = sjzjcheckId
        }
      }
    },
    goBack() { // 返回
      this.$router.back(-1)
    },
    inputChange(index, row, type) { // 人工组卷/随机组卷分值输入框change事件
      if (type === 1) { // 人工组卷
        if (!row.value) {
          setTimeout(() => {
            this.$set(row, 'value', 1)
          }, 50)
        }
        if (!row.num) {
          setTimeout(() => {
            this.$set(row, 'num', 1)
          }, 50)
        }
      } else { // 随机组卷
        if (!row.value) {
          setTimeout(() => {
            this.$set(row, 'value', 0)
          }, 50)
        }
        if (!row.num) {
          setTimeout(() => {
            this.$set(row, 'num', 0)
          }, 50)
        }
      }
      setTimeout(() => {
        var desc = '每题' + row.value + '分，共' + Number(row.num * row.value) + '分。'
        this.$set(row, 'desc', desc)
        this.getTotalScore(type)
      }, 60)
    },
    sortChange(row) { // 序号发生改变时触发
      if (!row.sort) {
        setTimeout(() => {
          this.$set(row, 'sort', 1)
        }, 50)
      }
    },
    descinputChange(index, row, type) { // 说明输入框发生变化时
      if (!row.desc) {
        var desc = '每题' + row.value + '分，共' + Number(row.num * row.value) + '分。'
        this.$set(row, 'desc', desc)
      }
    },
    getstStatus(val) { // 试题类型
      var name = ''
      if (val === '0') {
        name = '单选类'
      } else if (val === '1') {
        name = '多选类'
      } else if (val === '2') {
        name = '填空类'
      } else if (val === '3') {
        name = '判断类'
      } else if (val === '4') {
        name = '简答类'
      } else if (val === '5') {
        name = '论述类'
      } else if (val === '6') {
        name = '案例分析类'
      }
      return name
    },
    save() { // 保存
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.paperType === '1') { // 人工组卷  choices 选择题，multiSelect 多选题，fillGap 填空题，judge 判断题，shortAnswer简答题，discuss论述题，caseAnalysis案例分析题
            if (this.rgzjList.length === 0) {
              this.$alert('请选择试题', '提示', {
                type: 'error',
                confirmButtonText: '确定'
              })
              return
            }
            this.deletelObj()
            this.rgzjList.sort((a, b) => Number(a.sort) - Number(b.sort)) // 升序
            this.rgzjList.forEach((item, index) => {
              this.delWidthData(item)
            })
            if (Number(this.rgzjTotal) === 100) {
              this.form.deptCode = this.deptCode // 当前部门code
              this.form.deptName = this.deptName // 当前部门name
              this.form.creator = this.creator // 创建人账号
              this.btnLoading = true
              this.$update('paper/update', this.form).then((response) => {
                this.btnLoading = false
                this.isShowdialog = false // 关闭弹框
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$router.push({ path: '/handlingGuide/examPaperManage' })
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              // console.log('人工组卷参数', JSON.stringify(this.form))
              this.$confirm('您的试卷分值是' + this.rgzjTotal + '分，请确认是否保存！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.form.deptCode = this.deptCode // 当前部门code
                this.form.deptName = this.deptName // 当前部门name
                this.form.creator = this.creator // 创建人账号
                this.btnLoading = true
                this.$update('paper/update', this.form).then((response) => {
                  this.btnLoading = false
                  this.isShowdialog = false // 关闭弹框
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$router.push({ path: '/handlingGuide/examPaperManage' })
                }).catch(() => {
                  this.btnLoading = false
                })
              }).catch(() => {
                this.btnLoading = false
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          } else { // 随机组卷
            if (this.sjzjList.length === 0) {
              this.$alert('请选择试题模块', '提示', {
                type: 'error',
                confirmButtonText: '确定'
              })
              return
            }
            var isSave = false
            this.sjzjList.forEach((item, index) => {
              if (item.data.length > 0 && item.sort > 0 && item.num > 0 && item.value > 0 && item.desc) {
                item.isSave = true
                isSave = true
              } else {
                item.isSave = false
              }
            })
            if (isSave) {
              var sjzjList = JSON.parse(JSON.stringify(this.sjzjList))
              var list = []
              sjzjList.forEach((item, i) => {
                if (item.isSave) {
                  list.push(item)
                }
              })
              this.deletelObj()
              list.forEach((item, i) => {
                var modelId = []
                var cateIds = ''
                var data = item.data
                data.forEach((item, index) => {
                  modelId.push(item.id)
                })
                if (modelId.length > 0) {
                  modelId = this.uniqueModelId(modelId) // 去重
                }
                cateIds = modelId.length > 0 ? modelId.join(',') : ''
                item.cateIds = cateIds
                this.delWidthData(item)
              })
              if (Number(this.sjzjTotal) === 100) {
                this.form.deptCode = this.deptCode // 当前部门code
                this.form.deptName = this.deptName // 当前部门name
                this.form.creator = this.creator // 创建人账号
                this.btnLoading = true
                this.$update('paper/random/update', this.form).then((response) => {
                  this.btnLoading = false
                  this.isShowdialog = false // 关闭弹框
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$router.push({ path: '/handlingGuide/examPaperManage' })
                }).catch(() => {
                  this.btnLoading = false
                })
              } else {
                this.$confirm('您的试卷分值是' + this.sjzjTotal + '分，请确认是否保存！', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.form.deptCode = this.deptCode // 当前部门code
                  this.form.deptName = this.deptName // 当前部门name
                  this.form.creator = this.creator // 创建人账号
                  this.btnLoading = true
                  this.$update('paper/random/update', this.form).then((response) => {
                    this.btnLoading = false
                    this.isShowdialog = false // 关闭弹框
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    })
                    this.$router.push({ path: '/handlingGuide/examPaperManage' })
                  }).catch(() => {
                    this.btnLoading = false
                  })
                }).catch(() => {
                  this.btnLoading = false
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
              }
            } else {
              this.$alert('请至少填写一条完整的试题信息', '提示', {
                type: 'error',
                confirmButtonText: '确定'
              })
            }
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    deletelObj() {
      delete this.form.choices
      delete this.form.multiSelect
      delete this.form.fillGap
      delete this.form.judge
      delete this.form.shortAnswer
      delete this.form.discuss
      delete this.form.caseAnalysis
    },
    delWidthData(item) { // 数据处理
      if (item.type === '1') { // 单选题
        this.form.choices = item
      }
      if (item.type === '2') { // 多选题
        this.form.multiSelect = item
      }
      if (item.type === '3') { // 填空题
        this.form.fillGap = item
      }
      if (item.type === '4') { // 判断题
        this.form.judge = item
      }
      if (item.type === '5') { // 简答题
        this.form.shortAnswer = item
      }
      if (item.type === '6') { // 论述题
        this.form.discuss = item
      }
      if (item.type === '7') { // 案例分析题
        this.form.caseAnalysis = item
      }
    },
    getCheckList(val) { // 获取选择的试题列表
      this.initData(1)
      this.getshitiList(val)
    },
    getType(val) {
      this.type = val
    },
    initData(type) {
      if (type === 1) {
        var vals = this.rgzjList // 暂存到临时变量
        this.rgzjList = [] // 初始化数据
        this.rgzjList = vals // 重新赋值
      } else {
        var vals1 = this.sjzjList // 暂存到临时变量
        this.sjzjList = [] // 初始化数据
        this.sjzjList = vals1 // 重新赋值
      }
    },
    // 给array塞值的时候先判断里面是否存在了
    getshitiList(element) {
      var bo = false// 设置element的type不存在
      var _this = this
      for (var i = 0; i < _this.rgzjList.length; i++) {
        if (element.type === _this.rgzjList[i].type) {
          bo = true// 存在
          _this.rgzjList[i].data = _this.rgzjList[i].data.concat(element.data)
        }
      }
      // 如果不存在就直接塞到array中
      if (!bo) {
        _this.rgzjList.push(element)
      }
      _this.getRgzjNum(1)
      // 排序
      _this.sort(_this.rgzjList)
    },
    // 排序并赋值
    sort(element) {
      var _this = this
      element.sort((a, b) => Number(a.type) - Number(b.type)) // 先按type升序
      element.forEach((item, index) => {
        item.sort = Number(index + 1)
      })
      _this.rgzjList = element
      _this.rgzjList = element
    },
    getRgzjNum(type) { // 获取人工组卷题目数和分数/ 最近组卷总分
      var _this = this
      if (type === 1) {
        _this.rgzjList.forEach((item, index) => {
          item.data = _this.unique(item.data) // 去重
          var total = item.data.length
          item.num = total // 题目数量
          item.desc = '每题' + item.value + '分，共' + Number(item.num * item.value) + '分。' // 说明
        })
        _this.getTotalScore(type)
      } else {
        _this.getTotalScore(type)
      }
    },
    cancel() { // 取消
      this.$router.push({ path: '/handlingGuide/examPaperManage' })
    },
    closergDialog(val) { // 关闭人工组卷选择试题弹框
      this.rgzjDialog = val
      // this.$refs.form.validate()
    },
    closesjDialog(val) { // 关闭随机组卷选择试题模块弹框
      this.sjzjDialog = val
      // this.$refs.form.validate()
    },
    rgcloseDialog() { // 人工组卷关闭窗口
      this.isClear = true
    },
    sjcloseDialog() { // 随机组卷关闭窗口
      this.isClose = true
    },
    getstName(type) {
      let typeName = ''
      switch (type) {
        case '1':
          typeName = '单选类'
          break
        case '2':
          typeName = '多选类'
          break
        case '3':
          typeName = '填空类'
          break
        case '4':
          typeName = '判断类'
          break
        case '5':
          typeName = '简答类'
          break
        case '6':
          typeName = '论述类'
          break
        case '7':
          typeName = '案例分析类'
          break
      }
      return typeName
    },
    handleDeleterg(index) { // 删除人工组卷微调试题列表里的列表项
      this.rgzjStList.splice(index, 1)
    },
    closestlist() { // 关闭人工组卷微调试题列表窗口
      this.rgzjstListDialog = false
      this.getCurStList(1)
    },
    closemklist() { // 关闭随机组卷微调试题模块列表窗口
      this.sjzjstListDialog = false
      this.getCurStList(2)
    },
    openstlist(zjType, row) { // 点击试题类型，显示微调试题列表
      this.CurstType = row.type
      if (zjType === '1') { // 人工组卷
        this.rgzjstListDialog = true
        this.sjzjstListDialog = false
        this.rgzjStList = JSON.parse(JSON.stringify(row.data))
        this.rgzjStList = this.unique(this.rgzjStList)
      } else { // 随机组卷
        this.sjzjstListDialog = true
        this.rgzjstListDialog = false
        this.sjzjStList = JSON.parse(JSON.stringify(row.data))
        this.sjzjStList = this.unique(this.sjzjStList)
      }
    },
    unique(arr) { // 数组去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) { // 第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    getCurStList(type) { // 将当前被点击的试题类型对应的试题列表存储到变量里
      if (type === 1) { // 人工组卷
        this.rgzjList.forEach((item, index) => {
          if (item.type === this.CurstType) {
            item.data = this.rgzjStList
            item.num = this.rgzjStList.length
          }
        })

        this.rgzjList.forEach((item, index) => {
          if (item.data.length === 0) {
            this.rgzjList.splice(index, 1)
          }
        })
        // 排序
        this.sort(this.rgzjList)
        this.getRgzjNum(1)
      } else { // 随机组卷
        this.sjzjList.forEach((item, index) => {
          if (item.type === this.CurstType) {
            item.data = this.sjzjStList
          }
        })
        this.sjzjList.forEach((items, indexs) => {
          if (items.data.length === 0) {
            this.sjzjList.splice(indexs, 1)
          }
        })
        // 排序
        this.sort(this.sjzjList)
        this.getRgzjNum(2)
      }
    },
    getsjCheckList(val) { // 获取随机组卷选择的模块tree节点集合
      this.isClickxt = true
      this.initData(2)
      this.sjzjList = this.sjzjListDefault
      this.sjzjList.forEach((item, index) => {
        item.data = this.unique(val) // 去重
        item.desc = '每题' + item.value + '分，共' + Number(item.num * item.value) + '分。' // 说明
      })
      this.sjdisabled = false
    },
    handleDeletesj(index) { // 删除随机组卷微调试题列表里的列表项
      this.sjzjStList.splice(index, 1)
    },
    paperChange(val) {
      this.rgzjList = []
      this.sjzjList = []
      this.rgzjStList = []
      this.sjzjStList = []
    },
    getTotalScore(type) {
      if (type === 1) { // 人工组卷
        this.rgzjTotal = 0
        this.rgzjList.forEach((item, index) => {
          this.rgzjTotal += Number(item.num * item.value)
        })
      } else {
        this.sjzjTotal = 0
        this.sjzjList.forEach((item, index) => {
          this.sjzjTotal += Number(item.num * item.value)
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getModuleName(arry) {
      var name = ''
      var label = []
      if (arry.length > 0) {
        arry.forEach((item, index) => {
          label.push(item.label)
        })
        name = label.join(',')
      }
      return name
    },
    preview(type) { // 预览试卷
      if (type === 1) { // 人工组卷
        this.isShowSaveBtn = false
        this.buildData() // 前端组装数据，传给试卷预览组件
      } else { // 随机组卷
        this.sjPreView() // 调接口获取数据，传给试卷预览组件
      }
    },
    buildData() { // 人工组卷数据组装
      var data = {}
      var rgzjList = this.rgzjList
      rgzjList.sort((a, b) => Number(a.sort) - Number(b.sort)) // 升序
      rgzjList.forEach((item, index) => {
        this.arrKey.forEach((it, indexs) => {
          if (index === indexs) {
            data[it] = item
          }
        })
      })
      this.dealPreViewData(data)
      this.dialogPreviewVisible = true // 显示试卷预览弹框
    },
    sjPreView() { // 随机组卷试卷预览接口
      this.$refs.form.validate(valid => {
        if (valid) {
          var isSave = false
          this.sjzjList.forEach((item, index) => {
            if (item.data.length > 0 && item.sort > 0 && item.num > 0 && item.value > 0 && item.desc) {
              item.isSave = true
              isSave = true
            } else {
              item.isSave = false
            }
          })
          if (isSave) {
            var sjzjList = JSON.parse(JSON.stringify(this.sjzjList))
            var list = []
            sjzjList.forEach((item, i) => {
              if (item.isSave) {
                list.push(item)
              }
            })
            this.deletelObj()
            list.forEach((item, i) => {
              var modelId = []
              var cateIds = ''
              var data = item.data
              data.forEach((it, index) => {
                modelId.push(it.id)
              })
              if (modelId.length > 0) {
                modelId = this.uniqueModelId(modelId) // 去重
              }
              cateIds = modelId.length > 0 ? modelId.join(',') : ''
              item.cateIds = cateIds
              this.delWidthData(item)
            })
            this.form.deptCode = this.deptCode // 当前部门code
            this.form.deptName = this.deptName // 当前部门name
            this.form.creator = this.creator // 创建人账号
            this.listLoading = true
            if (this.isClickxt) { // 如果点击选择试题重新选择模块后并保存，调用的是随机试卷预览接口
              this.$save('paper/random/preView', this.form).then((response) => {
                this.listLoading = false
                this.previewProSubmit = response.data // 存储预览接口数据传给预览组件，预览组件里保存时需要将该数据传给后台进行保存。
                var data = JSON.parse(JSON.stringify(response.data))
                this.reBuildData(data) // 将后台数据处理成和列表预览接口返回的数据格式一致，以便于预览组件能按照一种数据格式渲染。
              }).catch(() => {
                this.listLoading = false
              })
            } else { // 否则，列表点击进来后未做修改操作，调用的是列表的随机试卷预览接口
              this.$query('paper/preview/' + this.$route.query.id, {}).then((response) => {
                this.listLoading = false
                this.previewProSubmit = response.data // 存储预览接口数据传给预览组件，预览组件里保存时需要将该数据传给后台进行保存。
                var data = JSON.parse(JSON.stringify(response.data))
                this.isShowSaveBtn = true
                this.reBuildData(data) // 将后台数据处理成和列表预览接口返回的数据格式一致，以便于预览组件能按照一种数据格式渲染。
              }).catch(() => {
                this.listLoading = false
              })
            }
          } else {
            this.$alert('请至少填写一条完整的试题信息', '提示', {
              type: 'error',
              confirmButtonText: '确定'
            })
          }
        } else {
          return false
        }
      })
    },
    reBuildData(data) { // 随机预览接口数据改造
      var rebuData = data
      var key
      var keyArry = []
      for (key in data.sort) {
        keyArry.push(key)
      }
      keyArry.forEach((it, indexs) => {
        if (rebuData[it]) {
          var val = data.sort[it]
          rebuData[val] = rebuData[it]
        }
      })
      keyArry.forEach((it, indexs) => {
        if (rebuData[it]) {
          delete rebuData[it]
        }
      })
      this.dialogPreviewVisible = true // 显示试卷预览弹框
      this.dealPreViewData(rebuData)
    },
    dealPreViewData(data) { // 处理预览返回的数据
      var _this = this
      var staticArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
      var titleText = ['一', '二', '三', '四', '五', '六', '七']
      _this.curPaperData = []
      for (let index = 0; index < staticArr.length; index++) {
        var element = staticArr[index]
        if (data[element]) {
          data[element].titleCN = titleText[index]
          if (data[element].data && data[element].data.length > 0) {
            data[element].typeName = _this.$getLabelByValue(data[element].type + '', _this.txData)
          } else {
            data[element].typeName = '无'
          }
          if (data[element].type === '3') { // 填空题，将[] 替换为横线
            for (let k = 0; k < data[element].data.length; k++) {
              var tkelement = data[element].data[k]
              if (tkelement.name.indexOf('[]') > -1) {
                tkelement.name = tkelement.name.replace(/\[/g, '___').replace(/\]/g, '___')
              }
            }
          }
          _this.curPaperData.push(data[element])
        }
      }
    },
    uniqueModelId(arr) { // 数组去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) { // 第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    previewListPort(index, row) { // 调用列表的试卷预览接口
      this.$query('paper/preview/' + row.id, {}).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          var data = response.data
          this.dialogPreviewVisible = true
          this.dealData(data)
        }
      })
    }
  },
  activated() {
    this.sjzjTotal = 0
    this.rgzjTotal = 0
  },
  mounted() {
    this.sjzjTotal = 0
    this.rgzjTotal = 0
    this.query()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.editExamPaper{
  .cardWidth {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .el-select {
    width: 100%;
  }
  .redText{
    color: #F56C6C;
    font-size: 17px;
  }
  .svg-icon{
    width: 2em !important;
  }
  .rgzjtk{
    .el-dialog {
      width: 80% !important;
    }
  }
  .sjzjtk{
    .el-dialog {
      width: 35% !important;
    }
  }

  .linkStyle{
    color: #3da1ff;
    text-decoration: underline;
  }
  .el-textarea__inner {
    line-height: 1;
  }
  .testList{
    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
  }
  .stxt{
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
  .inputW{
    width: 60%;
  }
  .el-textarea__inner {
    padding: 5px;
  }
  .previewDia {
    .el-dialog {
      background: #ffffff;
      border: 2px solid #00a0e9;
    }
    .el-dialog__header {
      border-bottom: 2px solid #aaaaaa;
      .el-dialog__title {
        color: #000000;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #000000;
      }
    }
    .el-dialog__body {
      background: #ffffff;
      color: #000000;
    }
  }
}
</style>
