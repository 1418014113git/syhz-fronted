<template>
<!--添加试卷-->
<div class="addExamPaper">
  <el-row class="cardWidth">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
  <el-card class="cardWidth">
    <el-row type="flex" justify="center" style="margin-top:10px;">
      <el-col :span="20" style="margin-bottom:50px;">
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="110px">
          <el-form-item label="试卷名称" prop="paperName">
            <el-input v-model.trim="form.paperName"  maxlength="50" placeholder="请输入试卷名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="试卷类型" prop="paperType">
            <el-select  v-model="form.paperType" size="small" placeholder="请选择">
              <el-option v-for="item in zjOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试卷选题" prop="checkst">
            <el-button  @click="checkst" style="margin-right:10px;">点击选题</el-button>
            <span v-if="form.paperType==='1'"  >注：请选择试卷上所需要的试题 ！</span>
             <span v-else  >注：请选择抽取随机试题的模块 ！</span>
          </el-form-item>
          <el-form-item label="已选试题" prop="">
             <!--人工组卷列表-->
            <div v-if="form.paperType==='1'">
              <div v-if="this.rgzjcheckList.length>0">
                <el-table :data="rgzjList"   style="width: 100%;"  class="testList">
                  <el-table-column prop="sort" label="排序" width="100" align="center">
                    <template slot-scope="scope">
                      <el-form :model="scope.row" :rules="rules">
                        <el-form-item prop="sort">
                          <el-input-number v-model.trim="scope.row.sort" :min="1" :max="4"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="试题类型" min-width="100" align="center">
                    <template slot-scope="scope">
                      <a class="linkStyle" @click="openstlist('1',row)">{{getstName(scope.row.type)}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="题量" min-width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.num}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="每道题分值" min-width="100" align="center">
                    <template slot-scope="scope">
                      <el-form :model="scope.row" :rules="rules">
                        <el-form-item prop="value">
                          <el-input-number v-model.trim="scope.row.sort" :min="1" :max="99" @change="rginputChange(scope.row)"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="desc" label="说明" min-width="100" align="center">
                    <el-form :model="scope.row" :rules="rules">
                      <el-form-item prop="desc">
                        <el-input v-model="scope.row.desc" type="textarea" placeholder="" maxlength="50"></el-input>
                      </el-form-item>
                    </el-form>
                  </el-table-column>
                </el-table>
                  <div style="display:none" >{{ exitsValrg }}</div>
                  <div style="overflow:hidden;">
                    <p style="float:left;">试卷卷面总分 <span class="redText">{{rgzjTotal}}</span> 分</p>
                    <p style="float:right;" @click="preview"><svg-icon icon-class="yulan"></svg-icon>试卷预览</p>
                  </div>
              </div>
              <span  v-else>还没有选择试题</span>
            </div>

             <!--随机组卷列表-->
            <div v-if="form.paperType==='2'">
              <div v-if="this.sjzjcheckList.length>0">
                <el-table :data="sjzjList"  style="width: 100%;"   class="testList">
                  <el-table-column prop="sort" label="排序" width="100" align="center">
                    <template slot-scope="scope">
                      <el-form :model="scope.row" :rules="rules">
                        <el-form-item prop="sort">
                          <el-input-number v-model.trim="scope.row.sort" :min="1" :max="4"></el-input-number>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="试题类型" min-width="100" align="center">
                    <template slot-scope="scope">
                      <a class="linkStyle" @click="openstlist('2',row)">{{getstName(scope.row.type)}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cateIds" label="试题模块" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="num" label="题量" min-width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.num}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="每道题分值" min-width="100" align="center">
                  <template slot-scope="scope">
                    <el-form :model="scope.row" :rules="rules">
                      <el-form-item prop="value">
                        <el-input-number v-model.trim="scope.row.sort" :min="1" :max="99" @change="rginputChange(scope.row)"></el-input-number>
                      </el-form-item>
                    </el-form>
                  </template>
                  </el-table-column>
                  <el-table-column prop="desc" label="说明" min-width="100" align="center">
                    <el-form :model="scope.row" :rules="rules">
                      <el-form-item prop="desc">
                        <el-input v-model="scope.row.desc" type="textarea" placeholder="" maxlength="50"></el-input>
                      </el-form-item>
                    </el-form>
                  </el-table-column>
                </el-table>
                <div style="display:none" >{{ exitsValSj }}</div>
                <div style="overflow:hidden;">
                  <p style="float:left;">试卷卷面总分 <span class="redText">{{sjzjTotal}}</span>分</p>
                  <p style="float:right;cursor:pointer;" @click="preview"><svg-icon icon-class="yulan"></svg-icon>试卷预览</p>
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
    <el-dialog title="选择试题" :visible.sync="rgzjDialog" @close="closeDialog">
      <check-list @checkList="getCheckList" @closergDialog="closergDialog"  :alreadyCheck="rgzjcheckList" :isClear="isClear"></check-list>
    </el-dialog>
  </div>

  <!--人工组卷试题列表 -- 微调时可删除列表项-->
  <el-dialog title="试题列表" :visible.sync="rgzjstListDialog" @close="closestlist">
    <div>
      <el-table :data="rgzjStList"   style="width: 100%;"  class="rgzjStList">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="subjectCategoryName" label="单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subjectCategoryName" label="模块" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="试题内容" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
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
    <el-dialog title="试题模块" :visible.sync="sjzjDialog">
      <check-moudle @closesjDialog="closesjDialog" @sjcheckList="getsjCheckList"></check-moudle>
    </el-dialog>
  </div>


  <!--随机组卷试题模块列表 -- 微调时可删除模块列表项-->
  <el-dialog title="选择试题模块" :visible.sync="sjzjstListDialog" @close="closemklist">
    <div>
      <el-table :data="sjzjcheckList"   style="width: 100%;"  class="sjzjStList">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="deptName" label="单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="label" label="模块" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  @click="handleDeletesj(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabC btnUpLine bottomBtn">
        <el-button  @click="closemklist" class="cancelBtn">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import CheckList from './checkst'
import CheckMoudle from './checkMoudle'
export default {
  components: {
    CheckList,
    CheckMoudle
  },
  data() {
    return {
      form: {
        paperName: '', // 试卷名称
        paperType: '1', // 人工组卷:"1" , 自动组卷:"2"
        deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
        deptName: JSON.parse(sessionStorage.getItem('depToken'))[0].depName, // 当前部门name
        creator: JSON.parse(sessionStorage.getItem('userInfo')).userName // 创建人账号
      },
      isClear: false,
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
      rgzjDialog: false, // 是否显示人工组卷选择试题弹框
      sjzjDialog: true, // 是否显示随机组卷选择tree结构试题模块弹框
      rgzjstListDialog: false, // 是否显示人工组卷微调试题列表弹框
      sjzjstListDialog: false, // 是否显示随机组卷微调试题模块列表弹框
      ifExistSj: false,
      ifExistRg: false,
      btnLoading: false, // 保存按钮加载进度条
      rgzjstType: '', // 当前被点击的试题类型--人工组卷
      sjzjstType: '', // 当前被点击的试题类型--随机组卷
      sjzjTotal: 0, // 随机组卷总分值
      rgzjTotal: 0, // 人工组卷总分值
      rgzjcheckList: [], // 存储 点击“试题维护” 选择的试题列表--人工组卷时
      rgzjList: [], // 人工组卷列表渲染
      rgzjStList: [], // 人工组卷当前点击试题类型后，将该类型已选择的试题存储到当前集合里。
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
      sjzjcheckList: [], // 存储 点击“试题维护” 选择的试题模块tree列表--随机组卷时
      sjzjList: [ // 随机组卷
        {
          type: '1',
          num: '',
          value: '',
          sort: 1,
          desc: '',
          cateIds: ''
        },
        {
          type: '2',
          num: '',
          value: '',
          sort: 2,
          desc: '',
          cateIds: ''
        },
        {
          type: '3',
          num: '',
          value: '',
          sort: 3,
          desc: '',
          cateIds: ''
        },
        {
          type: '4',
          num: '',
          value: '',
          sort: 4,
          desc: '',
          cateIds: ''
        },
        {
          type: '5',
          num: '',
          value: '',
          sort: 5,
          desc: '',
          cateIds: ''
        },
        {
          type: '6',
          num: '',
          value: '',
          sort: 6,
          desc: '',
          cateIds: ''
        },
        {
          type: '7',
          num: '',
          value: '',
          sort: 7,
          desc: '',
          cateIds: ''
        }
      ],
      rules: {
        paperName: [ // 试卷名称
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /[^!@#￥%\^&\*]+$/i
              if (value === '' || value === undefined || value === null) {
                callback(new Error('请输入试卷名称'))
              } else if (!reg.test(value)) {
                callback(new Error('输入内容不能包含以下字符：！@#￥%……&*'))
              } else {
                callback()
              }
            }
          }
        ],
        desc: [ // 说明
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /[^!@#￥%\^&\*]+$/i
              if (value === '' || value === undefined || value === null) {
                callback(new Error('请输入试卷说明'))
              } else if (!reg.test(value)) {
                callback(new Error('输入内容不能包含以下字符：！@#￥%……&*'))
              } else {
                callback()
              }
            }
          }
        ],
        paperType: [{ // 试卷类型
          required: true, message: '请选择试卷类型', trigger: 'change'
        }],
        checkst: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (this.form.paperType === '1') { // 人工组卷
              if (this.rgzjList.length > 0) {
                callback()
              } else {
                callback(new Error('请选择试题'))
              }
            } else { // 随机组卷
              if (this.sjzjcheckList.length > 0) {
                callback()
              } else {
                callback(new Error('请选择试题'))
              }
            }
          }
        }]
      }
    }
  },
  computed: {
    exitsValSj() { // 随机组卷
      this.ifExistSj = Number(Boolean(this.sjzjList[0].num)) + Number(Boolean(this.sjzjList[0].value)) + Number(Boolean(this.sjzjList[1].num)) + Number(Boolean(this.sjzjList[1].value)) +
      Number(Boolean(this.sjzjList[2].num)) + Number(Boolean(this.sjzjList[2].value)) + Number(Boolean(this.sjzjList[3].num)) + Number(Boolean(this.sjzjList[3].value)) + Number(Boolean(this.sjzjList[4].num)) +
      Number(Boolean(this.sjzjList[4].value)) + Number(Boolean(this.sjzjList[5].num)) + Number(Boolean(this.sjzjList[5].value)) + Number(Boolean(this.sjzjList[6].num)) + Number(Boolean(this.sjzjList[6].value))
    },
    exitsValrg() { // 人工组卷
      for (var i = 0; i < this.rgzjList.length; i++) {
        this.ifExistRg += (Number(Boolean(this.rgzjList[i].num)) + Number(Boolean(this.rgzjList[i].value)))
      }
    }
  },
  watch: {
    ifExistSj(newVal, oldVal) {
      if (Number(newVal) >= 1) {
        this.sjzjTotal = Number(this.sjzjList[0].num * this.sjzjList[0].value) + Number(this.sjzjList[1].num * this.sjzjList[1].value) + Number(this.sjzjList[2].num * this.sjzjList[2].value) + Number(this.sjzjList[3].num * this.sjzjList[3].value) +
        Number(this.sjzjList[4].num * this.sjzjList[4].value) + Number(this.sjzjList[5].num * this.sjzjList[5].value) + Number(this.sjzjList[6].num * this.sjzjList[6].value)
      } else if (Number(newVal) === 0) {
        this.sjzjTotal = 0
      }
    }
  },
  methods: {
    checkst() { // 点击试题
      if (this.form.paperType === '1') { // 人工组卷
        this.rgzjDialog = true
      } else { // 随机组卷
        this.sjzjDialog = true
      }
    },
    goBack() { // 返回
      this.$router.back(-1)
    },
    preview() { // 预览

    },
    rginputChange(row) { // 人工组卷分值输入框change事件
      row.desc = '每题' + row.value + '分，共' + Number(row.num * row.value) + '分。'
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
            this.rgzjList.forEach((item, index) => {
              this.delWidthData(item)
            })
            if (Number(this.rgzjTotal) === 100) {
              this.btnLoading = true
              this.$save('paper/save', this.form).then((response) => {
                this.btnLoading = false
                this.isShowdialog = false // 关闭弹框
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.init()
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.$alert('您的试卷分值是' + this.rgzjTotal + '分，请确认是否保存！', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                callback: action => {

                }
              })
            }
          } else { // 随机组卷
            var modelId = []
            var cateIds = ''
            this.sjzjcheckList.forEach((item, index) => {
              modelId.push(item.id)
            })
            cateIds = modelId.join(',')
            this.sjzjList.forEach((item, index) => {
              item.cateIds = cateIds
              this.delWidthData(item)
            })

            if (Number(this.sjzjTotal) === 100) {
              this.btnLoading = true
              this.$save('save/random', this.form).then((response) => {
                this.btnLoading = false
                this.isShowdialog = false // 关闭弹框
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.init()
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.$alert('您的试卷分值是' + this.sjzjTotal + '分，请确认是否保存！', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                callback: action => {

                }
              })
            }
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    delWidthData(item) { // 数据处理
      if (item.type === '1') { // 单选题
        this.form.choices = item
      }
      if (item.type === '2') { // 多选题
        this.form.multiSelect = item
      }
      if (item.type === '3') { // 填空题
        this.form.choices = item
      }
      if (item.type === '4') { // 判断题
        this.form.fillGap = item
      }
      if (item.type === '5') { // 简答题
        this.form.judge = item
      }
      if (item.type === '6') { // 论述题
        this.form.shortAnswer = item
      }
      if (item.type === '7') { // 案例分析题
        this.form.caseAnalysis = item
      }
    },
    getCheckList(val) { // 获取选择的试题列表
      this.rgzjcheckList = val.data
      this.getshitiList(val)
    },
    getType(val) {
      this.type = val
    },
    // 给array塞值的时候先判断里面是否存在了
    getshitiList(element) {
      var bo = false// 设置element的type不存在
      for (var i = 0; i < this.rgzjList.length; i++) {
        this.rgzjList[i].value = '' // 分值
        this.rgzjList[i].desc = '' // 说明
        this.rgzjList[i].num = this.rgzjList[i].data.length
        if (element.type === this.rgzjList[i].type) {
          bo = true// 存在
          this.rgzjList[i].data = this.rgzjList[i].data.concat(element.data)
          // console.log(JSON.stringify(this.rgzjList));
        }
      }
      // 如果不存在就直接塞到array中
      if (!bo) {
        this.rgzjList.push(element)
      }

      // 冒泡排序
      this.sort(this.rgzjList)
    },
    // 排序并赋值
    sort(element) {
      for (var i = 0; i < element.length - 1; i++) {
        for (var j = 0; j < element.length - i - 1; j++) {
          if (element[j].sort > element[j + 1].sort) {
            // 把大的数字放到后面
            var swap = element[j]
            element[j] = element[j + 1]
            element[j + 1] = swap
          }
        }
        // console.log(JSON.stringify(array));
      }
      for (var k = 0; k < element.length; k++) {
        element[k].sort = k + 1
      }
    // console.log(JSON.stringify(array));
    },
    cancel() { // 取消
      this.$router.push({ path: '/handlingGuide/examPaperManage' })
    },
    closergDialog(val) { // 关闭人工组卷选择试题弹框
      this.rgzjDialog = val
    },
    closesjDialog(val) { // 关闭随机组卷选择试题模块弹框
      this.sjzjDialog = val
    },
    closeDialog() { // 人工组卷关闭窗口
      this.isClear = true
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
    handleDelete(index) { // 删除人工组卷微调试题列表里的列表项
      this.rgzjStList.splice(index, 1)
    },
    closestlist() { // 关闭人工组卷微调试题列表窗口
      this.rgzjDialog = false
      this.getCurStList(this.rgzjList)
    },
    closemklist() { // 关闭随机组卷微调试题模块列表窗口
      this.sjzjDialog = false
      this.getCurStList(this.sjzjList)
    },
    openstlist(zjType, row) { // 点击试题类型，微调试题列表
      this.rgzjstType = row.type
      this.rgzjStList = row.data
      if (zjType === '1') { // 人工组卷
        this.rgzjDialog = true
      } else { // 随机组卷
        this.sjzjDialog = true
      }
    },
    getCurStList(data) { // 将当前被点击的试题类型对应的试题列表存储到变量里
      this.rgzjList.forEach((item, index) => {
        if (item.type === this.rgzjstType) {
          item.data = this.rgzjStList
        }
      })
    },
    getsjCheckList(val) { // 获取随机组卷选择的模块tree节点集合
      this.sjzjcheckList = val
    },
    handleDeletesj(index) { // 删除随机组卷微调试题列表里的列表项
      this.sjzjcheckList.splice(index, 1)
    }
  },
  activated() {
    this.sjzjTotal = 0
    this.rgzjTotal = 0
  },
  mounted() {
    this.sjzjTotal = 0
    this.rgzjTotal = 0
    // const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // if (curDept && curUser) {
    //   this.curDept = curDept
    //   this.form.createId = curUser.id
    //   this.form.createName = curUser.realName
    //   this.form.userId = curUser.id
    //   this.form.userName = curUser.realName
    //   this.form.createDeptId = curDept.id
    //   this.form.createDeptName = curDept.depName
    //   this.form.partakePersonJson = [{
    //     id: curUser.id, name: curUser.realName
    //   }]
    //   this.partakePerson = [curUser.id]
    //   this.getDepts()
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.addExamPaper{
  .cardWidth {
    width: 70%;
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
      // width: 80% !important;
    }
  }

  .linkStyle{
    color: #3da1ff;
    text-decoration: underline;
  }
  .linkStyle:hover {
    color: #3da1ff;
  }
}
</style>
