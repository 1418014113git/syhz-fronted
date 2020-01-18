<template>
  <div>
    <el-row class="assessSetting">
      <img src="@/assets/icon/back.png"  class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <el-card class="assessSetting">
      <div class="clearfix" style="background:rgba(105,171,202,0.2);padding: 10px 20px;">
        <div v-for="(item,index) in typeData" :key="index" class="clearfix left">
          <el-checkbox v-model="item.isChecked" style="float: left;margin:3px 5px 0 0;"  @change="checkboxChange($event,item)"></el-checkbox>
          <div class="topTag" :class="item.active===1?'activeTag':''"  @click="changeTag(item,index)">{{item.label}}</div>
        </div>
        <el-button size="mini" @click="handleSubmit" class="saveBtn right" :loading="loading">保存</el-button>
      </div>
      <el-form :inline="true" >
        <!-- 环境 -->
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='3'">
          <div v-for="(item,index) in standardList.hj" :key="index">
            <p class="level2Text" v-if="item.level===2">
              <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
            </p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">
                <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
              </p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
        <!-- 食品 -->
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='1'">
          <div v-for="(item,index) in standardList.sp" :key="index">
            <p class="level2Text" v-if="item.level===2">
              <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
            </p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">
                <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
              </p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
        <!-- 药品 -->
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='2'">
          <div v-for="(item,index) in standardList.yp" :key="index">
            <p class="level2Text" v-if="item.level===2">
              <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
            </p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">
                <el-checkbox v-model="item.isChecked" style="float: left;margin:0 5px 0 0;" :disabled="item.isDisabled" @change="checkboxChange($event,item)"></el-checkbox>{{item.categoryName}}
              </p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0" :step="0.1" :disabled="true"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <!-- <el-row type="flex" justify="center" v-loading="formLoading">
      <el-form ref="dbForm" :model="dbApplyForm" :rules="rules" label-width="120px" v-loading="formLoading" style="width:90%;">
        <el-col :span="24">
          <el-form-item label="督办案件" prop="caseId" v-if="!(carryParam.type==='up')">
            <el-select v-model="dbApplyForm.caseId" filterable clearable remote reserve-keyword
                       placeholder="请输入案件名称或者案件编号搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible" @change="caseChange"
                       value-key="id" class="db_create_input">
              <el-option v-for="item in dbajData" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办级别" prop="superviseLevel">
            <el-select v-model="dbApplyForm.superviseLevel" placeholder="请选择督办级别" class="db_create_input" :disabled="true">
              <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="督办负责人" prop="supervisePersonId">
            <el-select v-model="dbApplyForm.supervisePersonId" placeholder="请选择督办负责人" filterable class="db_create_input" @change="fzrChange">
              <el-option v-for="(item,index) in userData" :key="index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办联系人" prop="connectionPersonId">
            <el-select v-model="dbApplyForm.connectionPersonId" placeholder="请选择督办联系人" filterable class="db_create_input" @change="lxrChange">
              <el-option v-for="(item,index) in userData" :key="index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="负责人电话" prop="personLiablePhone">
            <el-input v-model="dbApplyForm.personLiablePhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="personConnectionPhone">
            <el-input v-model="dbApplyForm.personConnectionPhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="申请原因" prop="superviseDesc">
            <vue-editor v-model="dbApplyForm.superviseDesc" useCustomImageHandler @imageAdded="handleImageAdded" style="width: 100%; min-width: 500px;"></vue-editor>
          </el-form-item>
          <el-form-item label="附件" prop="attachment">
            <el-upload drag multiple ref="fileUpload" :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadFiles"
                       :on-success="attachmentSuccess"
                       :on-remove="attachmentRemove"
                       :before-remove="attachmentBfRemove"
                       :before-upload="beforeUpload"
                       :limit="10"
                       :on-exceed="handleExceed">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，最多10个</div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="查阅密码" prop="secretCode">
            <el-input v-model="dbApplyForm.secretCode" clearable class="db_create_input" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="审核单位" prop="superviseDeptCode">
            <el-select v-model="dbApplyForm.superviseDeptCode" placeholder="请选择部门" class="db_create_input" @change="deptChange" clearable>
              <el-option v-for="(item,index) in exDeptData" :key="item.id + index" :label="item.departName" :value="item.departCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center">
          <el-form-item>
            <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading" v-if="!(carryParam.type==='up')">保存</el-button>
            <el-button size="mini" @click="handleCancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
            <el-button size="mini" @click="handleSubmit('departmentForm')" class="saveBtn" :loading="formLoading" >申请</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row> -->
</div>
</template>
<script>
export default {
  name: 'standard',
  data() {
    return {
      typeData: [
        { label: '环境', value: '3', category: '3', 'level': 1, sign: 'hj', isChecked: false, active: 1 },
        { label: '食品', value: '1', category: '1', 'level': 1, sign: 'sp', isChecked: false, active: 0 },
        { label: '药品', value: '2', category: '2', 'level': 1, sign: 'yp', isChecked: false, active: 0 }
      ],
      curType: '3', // 当前选择的类型
      loading: false,
      standardList: [],
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadFiles: [], // 附件
      caseLoading: false, // 督办案件
      dbajData: [],
      exDeptData: [], // 审核单位
      userData: [],
      dbApplyForm: {
        caseId: null,
        superviseLevel: null,
        supervisePersonId: null,
        connectionPersonId: null,
        personConnectionPhone: null,
        superviseDesc: '',
        superviseDeptCode: ''
      },
      carryParam: {}, // 跳转传参
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      input: '',
      curDeptParent: {} // 当前部门的父级部门
    }
  },
  methods: {
    changeTag(item, index) {
      console.log(index)
      this.typeData.forEach(element => {
        element.active = 0
      })
      this.typeData[index].active = 1 // 选中的 设置样式
      this.curType = item.value
    },
    queryStandard() { // 查询考核标准
      var queryParam = {
        category: '0', // 查三种类型全部
        userId: this.userInfo.id
      }
      this.loading = true
      this.$queryPost('khpb/configDataListByUser', queryParam).then((response) => {
        this.loading = false
        if (response.data) {
          var data = response.data
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var typeList = data[key]
              for (let index = 0; index < typeList.length; index++) {
                var element = typeList[index]
                if (element.level !== 1) {
                  element.isDisabled = true
                  // element.isChecked = false // 所有的先初始化为false
                }
                if (element.sign === 'hj') { // 环境
                  this.typeData[0].isChecked = element.isinclud === 'in'
                } else if (element.sign === 'sp') { // 食品
                  this.typeData[1].isChecked = element.isinclud === 'in'
                } else if (element.sign === 'yp') { // 药品
                  this.typeData[2].isChecked = element.isinclud === 'in'
                } else {
                  element.isChecked = element.isinclud === 'in' || false
                }
              }
            }
          }
          this.standardList = data
          this.initChecked()
          console.log(this.standardList)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    initChecked() {
      var data = this.standardList
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          var typeList = data[key]
          for (let index = 0; index < typeList.length; index++) {
            var element = typeList[index]
            if (element.isinclud === 'in') {
              this.checkboxChange(true, element)
            }
          }
        }
      }
    },
    checkboxChange(val, item) { // 复选框change
      if (val) {
        if (item.level === 1) {
          for (let index = 0; index < this.standardList[item.sign].length; index++) {
            var element = this.standardList[item.sign][index]
            if (element.sign === 'qt') { // 处理人员情况和其他现在不开放设置
              element.isDisabled = true
            } else if (element.category.substring(0, 1) === item.category && element.level === item.level + 1) {
              element.isDisabled = false
            }
          }
        }
        if (item.level === 2) {
          var list = []
          if (item.category.substring(0, 1) === '1') {
            list = this.standardList.sp
          } else if (item.category.substring(0, 1) === '2') {
            list = this.standardList.yp
          } else if (item.category.substring(0, 1) === '3') {
            list = this.standardList.hj
          }
          for (let index = 0; index < list.length; index++) {
            var element1 = list[index]
            if (element1.category.substring(0, 3) === item.category && element1.level === item.level + 1) {
              element1.isDisabled = false
            }
            if (this.deptInfo.depType === '1') { // 总队
              if (element1.sign === 'sdaj' || element1.sign === 'aqwzjsdaj' || element1.sign === 'yqwzjsdaj') { // 市督相关的三个总队不能编辑
                element1.isDisabled = true
              }
            }
            if (element1.sign === 'xjrs' || element1.sign === 'pbrs' || element1.sign === 'ysrs') { // 处理人员的刑拘人数 批捕人数 移诉人数禁用
              element1.isDisabled = true
            }
          }
        }
      }
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['configId']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parendId']]
        if (key) {
          if (!key['children']) {
            key['children'] = []
            key['children'].push(treeArray[i])
          } else {
            key['children'].push(treeArray[i])
          }
        } else {
          r.push(treeArray[i])
        }
      }
      return r
    },
    saveCheckList(list) {
      var data = this.getTree(list)
      console.log(data)
      if (list.length > 0) {
        if (data.length === 1 && data[0].category.length === 1 && data[0].children[0].category.length === 3 && data[0].children[0].children[0].category.length === 5) {
          return true
        } else {
          this.$message.error('请检查已选择的项目')
          return false
        }
      } else {
        return true
      }
      // return false

      // for (let index = 0; index < list.length; index++) {
      //   var element = list[index]
      //   if (element.category.substring(0, 1) === '1') {
      //     var result = list.some(item => {
      //       if (item.category === '1') {
      //         return true
      //       }
      //     })
      //   }
      //   if (!result) {
      //     this.$message.error('请检查')
      //     return false
      //   }
      // }
    },
    handleSubmit() { // 保存
      var categoryList1 = []
      var categoryList2 = []
      var categoryList3 = []
      if (this.typeData[0].isChecked) {
        this.standardList.hj[0].isinclud = 'in'
        categoryList3.push(this.standardList.hj[0])
      }
      if (this.typeData[1].isChecked) {
        this.standardList.sp[0].isinclud = 'in'
        categoryList1.push(this.standardList.sp[0])
      }
      if (this.typeData[2].isChecked) {
        this.standardList.yp[0].isinclud = 'in'
        categoryList2.push(this.standardList.yp[0])
      }
      for (let index1 = 0; index1 < this.standardList.sp.length; index1++) {
        var element1 = this.standardList.sp[index1]
        if (element1.isChecked) {
          categoryList1.push(element1)
        }
      }
      for (let index2 = 0; index2 < this.standardList.yp.length; index2++) {
        var element2 = this.standardList.yp[index2]
        if (element2.isChecked) {
          categoryList2.push(element2)
        }
      }
      for (let index3 = 0; index3 < this.standardList.hj.length; index3++) {
        var element3 = this.standardList.hj[index3]
        if (element3.isChecked) {
          categoryList3.push(element3)
        }
      }
      if (!(this.saveCheckList(categoryList1) && this.saveCheckList(categoryList2) && this.saveCheckList(categoryList3))) {
        return false
      }
      var saveParam = [
        {
          userId: this.userInfo.id,
          userName: this.userInfo.realName,
          category: '1',
          categoryList: categoryList1
        },
        {
          userId: this.userInfo.id,
          userName: this.userInfo.realName,
          category: '2',
          categoryList: categoryList2
        },
        {
          userId: this.userInfo.id,
          userName: this.userInfo.realName,
          category: '3',
          categoryList: categoryList3
        }
      ]
      this.loading = true
      this.$update('khpb/saveCategoryMaping', saveParam).then((response) => {
        if (response.code === '000000') {
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    cancel() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.queryStandard() // 查询可配置的
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.assessSetting {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 20px 20px 20px;
  }
  .topTag {
    cursor: pointer;
    margin-right: 20px;
    float: left;
    border-radius: 4px;
    padding: 3px 16px;
    border: 1px solid #00a0e9;
    font-size: 14px;
  }
  .activeTag {
    color: #ffffff;
    border: 1px solid #00a0e9;
    background-color: rgba(0, 160, 233, 0.6);
  }
  .level2Text {
    font-size: 16px;
    font-weight: bold;
  }
  .level3Text {
    width: 94%;
    margin: 10px 0 0 5%;
  }
  .leftText {
    margin: 5px 0 10px 0;
  }
  .rightBox {
    float: right;
    .el-form-item {
      margin-bottom: 0px;
      label {
        margin-bottom: 0;
      }
    }
    .el-form-item--small .el-form-item__label {
      line-height: 25px;
    }
    .el-input {
      // width: 100px;
    }
  }
}

.dbedit h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.dbedit .db_create_input {
  width: 100%;
}
.dbedit .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
</style>
