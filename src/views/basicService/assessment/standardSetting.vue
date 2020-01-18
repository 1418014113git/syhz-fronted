<template>
  <div>
    <el-row class="assessSetting">
      <img src="@/assets/icon/back.png"  class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <el-card class="assessSetting">
      <div class="clearfix" style="background:rgba(105,171,202,0.2);padding: 10px 20px;">
        <div class="topTag" v-for="(item,index) in typeData" :key="index" :class="item.active===1?'activeTag':''"  @click="changeTag(item,index)" >{{item.label}}</div>
        <el-button size="mini" @click="handleSubmit" class="saveBtn right" :loading="loading" v-if="$isViewBtn('103601')">保存</el-button>
      </div>
      <el-form ref="setForm" :inline="true" :rules="rules" :model="setForm">
        <!-- 环境 -->
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='3'">
          <div v-for="(item,index) in standardList.hj" :key="index">
            <p class="level2Text" v-if="item.level===2">{{item.categoryName}}</p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">{{item.categoryName}}</p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :max="999999" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0.0" :step="0.1" :max="99999" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0.0" :step="0.1" :max="99999" :disabled="(item.notSetJfz) || ((!item.notSetDbs)&&(item.targetNumber<=0))"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='1'">
          <!-- 食品 -->
          <div v-for="(item,index) in standardList.sp" :key="index">
            <p class="level2Text" v-if="item.level===2">{{item.categoryName}}</p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">{{item.categoryName}}</p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0" :step="0.1" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0" :step="0.1" :disabled="(item.notSetJfz) || ((!item.notSetDbs)&&(item.targetNumber<=0))"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;" v-loading="loading" v-if="curType==='2'">
          <!-- 药品 -->
          <div v-for="(item,index) in standardList.yp" :key="index">
            <p class="level2Text" v-if="item.level===2">{{item.categoryName}}</p>
            <div class="level3Text clearfix" v-else-if="item.level===3">
              <p class="left leftText">{{item.categoryName}}</p>
              <p class="rightBox">
                <el-form-item label="达标数" class="clearfix" prop="targetNumber">
                  <el-input-number class="left" v-model="item.targetNumber" :min="0" :max="999999" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="加分值" class="clearfix" prop="addValue">
                  <el-input-number class="left" v-model="item.addValue" :min="0" :step="0.1" :max="99999" :disabled="item.notSetDbs"></el-input-number>
                </el-form-item>
                <el-form-item label="减分值" class="clearfix" prop="subtractValue">
                  <el-input-number class="left" v-model="item.subtractValue" :min="0" :step="0.1" :max="99999" :disabled="(item.notSetJfz) || ((!item.notSetDbs)&&(item.targetNumber<=0))"></el-input-number>
                </el-form-item>
              </p>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'standard',
  data() {
    return {
      typeData: [{ label: '环境', value: '3', active: 1 }, { label: '食品', value: '1', active: 0 }, { label: '药品', value: '2', active: 0 }],
      curType: '3', // 当前选择的类型
      loading: false,
      standardList: [],
      setForm: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        // targetNumber: [{
        //   required: true, trigger: 'blur', validator: (rule, value, callback) => {
        //     var reg = /^\d{6}$/
        //     if (value === null || value === undefined || value === '') {
        //       callback(new Error('请输入达标数'))
        //     } else if (reg.test(value)) {
        //       callback()
        //     } else {
        //       callback(new Error('请输入整数'))
        //     }
        //   }
        // }],
        // addValue: [{
        //   required: true, trigger: 'blur', validator: (rule, value, callback) => {
        //     var reg = /^\d*\.{0,1}\d{0,1}$/
        //     if (value === null || value === undefined || value === '') {
        //       callback(new Error('请输入加分值'))
        //     } else if (reg.test(value)) {
        //       callback()
        //     } else {
        //       callback(new Error('请输入加分值'))
        //     }
        //   }
        // }],
        // subtractValue: [{
        //   required: true, trigger: 'blur', validator: (rule, value, callback) => {
        //     var reg = /^\d*\.{0,1}\d{0,1}$/
        //     if (value === null || value === undefined || value === '') {
        //       callback(new Error('请输入减分值'))
        //     } else if (reg.test(value)) {
        //       callback()
        //     } else {
        //       callback(new Error('请输入减分值'))
        //     }
        //   }
        // }]
      }
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
      // this.queryStandard(item.value)
    },
    queryStandard(type) { // 查询考核标准
      this.loading = true
      this.$query('khpb/configDataList/0', {}).then((response) => {
        this.loading = false
        if (response.data) {
          this.standardList = response.data
          for (const key in this.standardList) {
            if (this.standardList.hasOwnProperty(key)) {
              var typeList = this.standardList[key]
              for (let index = 0; index < typeList.length; index++) { // 人员处理情况中的刑拘人数、批捕人数、移诉人数以及其他的窝点、涉案金额暂时不提供设置；
                var element = typeList[index]
                // 加分值和减分值 0转化为0.0
                if (element.addValue === 0) {
                  element.addValue = 0.0
                }
                if (element.subtractValue === 0) {
                  element.subtractValue = 0.0
                }
                if (element.sign === 'xjrs' || element.sign === 'pbrs' || element.sign === 'ysrs' ||
                  element.sign === 'thwd' || element.sign === 'saje' ||
                  element.sign === 'aqwzjbdaj' || element.sign === 'yqwzjbdaj' ||
                  element.sign === 'aqwzjtdaj' || element.sign === 'yqwzjtdaj' ||
                  element.sign === 'aqwzjsdaj' || element.sign === 'yqwzjsdaj' ||
                  element.sign === 'aqwwcjqhcaj' || element.sign === 'aqwwcxcaj') {
                  element.notSetDbs = true // 控制达标数和加分值是否可编辑
                } else {
                  element.notSetDbs = false
                }
                if (element.sign === 'xjrs' || element.sign === 'pbrs' || element.sign === 'ysrs' ||
                  element.sign === 'thwd' || element.sign === 'saje') {
                  element.notSetJfz = true // 控制减分值是否可编辑
                } else {
                  element.notSetJfz = false
                }
              }
            }
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmit() { // 保存
      // this.$refs.setForm.validate(valid => {
      //   if (valid) {
      //     return false
      //   }
      // })
      var reg1 = /^\d{1,6}$/
      var reg2 = /^(\d{1,6}\.\d{1,1}|\d{1,6})$/
      var arr = [this.standardList.sp, this.standardList.yp, this.standardList.hj]
      for (let m = 0; m < arr.length; m++) {
        var item = arr[m]
        for (let index = 0; index < item.length; index++) {
          var element = item[index]
          if (element.level === 3) { // 第三层的所有数据
            if (element.targetNumber === '' || element.addValue === '' || element.subtractValue === '') {
              this.$message.error('达标数、分值均不能为空，可为0')
              return false
            }
            if (!(reg1.test(element.targetNumber))) {
              this.$message.error('达标数需为整数')
              return false
            }
            if (!(reg2.test(element.addValue))) {
              this.$message.error('加分值需为整数或者保留一位小数')
              return false
            }
            if (!(reg2.test(element.subtractValue))) {
              this.$message.error('减分值需为整数或者保留一位小数')
              return false
            }
          }
        }
      }
      var saveParam = [
        {
          categoryType: '1',
          dataList: this.standardList.sp
        },
        {
          categoryType: '2', // 配置项分类 1食品 2药品 3环境
          dataList: this.standardList.yp
        },
        {
          categoryType: '3', // 配置项分类 1食品 2药品 3环境
          dataList: this.standardList.hj
        }
      ]
      this.loading = true
      this.$update('khpb/updateDatas', saveParam).then((response) => {
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
    this.queryStandard('3') // 默认查询环境的
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
