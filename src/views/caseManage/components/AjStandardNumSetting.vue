<template>
  <section>
    <el-dialog title="案件达标数配置" :visible.sync="dialogSettingVisible" :close-on-click-modal=false class="setting-dialog" @close="close">
      <div class="clearfix">
        <el-date-picker
          v-model="settingYear"
          type="year"
          placeholder="选择年"
          :picker-options="pickerOptions"
          @change="yearChange"
          value-format="yyyy"
          style="float:left;">
        </el-date-picker>
        <el-button type="primary" @click="saveSetting" style="float:right;margin:5px 0 10px;" :loading="settingLoading">保存</el-button>
      </div>
      <el-table :data="settingData" v-loading="settingLoading" style="width: 100%;" max-height="300">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column property="cityName" label="市" min-width="200"></el-table-column>
        <el-table-column property="num" label="案件达标数" min-width="200">
          <template slot-scope="scope">
            <el-form :model="scope.row" size="small" :ref="'caseNum'+scope.$index" :rules="rules">
              <el-form-item prop="num">
                <el-input v-model.trim="scope.row.num" placeholder="请输入" size="mini" maxlength="5" @change="numChange($event,scope.row.cityCode)"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: '',
  props: ['settingShow'],
  data() {
    return {
      dialogSettingVisible: false, // 案件达标数配置弹框
      settingLoading: false, // 弹框上的表格loading
      settingData: [], // 弹框数据
      responseSettingData: {},
      resConfigValue: {},
      settingYear: '', // 年份
      pickerOptions: {
        // 大于当前年份 或者 小于1900年份的禁用掉
        disabledDate(value) {
          return (Number(value.getFullYear()) > Number(new Date().getFullYear())) || (Number(value.getFullYear()) < 1900)
        }
      },
      rules: {
        num: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              const reg = /^[0-9]+$/
              if (!reg.test(value)) {
                callback(new Error('请输入不大于5位的数字'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入案件数量'))
            }
          }
        }]
      }
    }
  },
  methods: {
    yearChange(val) {
      if (val) {
        this.caseStandardSetting()
      } else { // 年份被清空时 清空表格数据
        this.$message({
          message: '请选择年份', type: 'error'
        })
        this.settingData = []
      }
    },
    caseStandardSetting() { // 案件达标数配置
      this.dialogSettingVisible = true
      this.settingLoading = true
      var param = {
        configGroup: 'aj_standard',
        configKey: this.settingYear
      }
      this.$query('standard', param).then((response) => {
        this.settingLoading = false
        this.responseSettingData = response.data
        this.resConfigValue = JSON.parse(response.data.configValue)
        this.settingData = []
        for (const key in this.resConfigValue.cityName) {
          if (this.resConfigValue.cityName.hasOwnProperty(key)) {
            const element = { cityName: this.resConfigValue.cityName[key], cityCode: key }
            for (const key1 in this.resConfigValue) {
              if (this.resConfigValue.hasOwnProperty(key1)) {
                if (key1 === key) {
                  const item = this.resConfigValue[key1]
                  element.num = item
                }
              }
            }
            // console.log(element)
            this.settingData.push(element)
          }
        }
      }).catch(() => {
        this.settingLoading = false
      })
    },
    numChange(val, type) { // change事件，更新对应市的数量
      this.resConfigValue[type] = Number(val)
    },
    saveSetting() { // 保存案件达标数配置
      let numValid = false
      const _this = this
      for (let index = 0; index < this.settingData.length; index++) {
        _this.$refs['caseNum' + index].validate(valid => {
          numValid = valid
        })
        if (!numValid) { // 有验证不通过的 不必要再往下循环验证了
          return
        }
      }
      if (!numValid) {
        return false
      } else {
        this.settingLoading = true
        var param = this.responseSettingData
        param.configValue = JSON.stringify(this.resConfigValue) // 更新后的数据
        param.configKey = this.settingYear // 年份
        this.$update('standard/save', param).then(response => {
          this.settingLoading = false
          if (response.message !== 'OK') { // 有异常
            this.$message({
              message: response.data.message, type: 'error'
            })
          } else {
            this.$message({
              message: '配置保存成功', type: 'success'
            })
            this.dialogSettingVisible = false
            this.$emit('settingShow', false)
          }
        }).catch(() => {
          this.settingLoading = false
        })
      }
    },
    close() {
      this.$emit('settingShow', false)
    }
  },
  mounted() {
    this.settingYear = new Date().getFullYear() + '' // 组件接受的是字符串类型
    this.caseStandardSetting()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.setting-dialog {
  .el-dialog__body {
    padding: 0 20px 30px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .el-form-item--small .el-form-item__error {
    position: absolute;
    right: 5px;
    top: 8px;
    text-align: right;
    width: fit-content;
    left: auto;
  }
  .el-table__header-wrapper {
    border: none;
  }
}
</style>
