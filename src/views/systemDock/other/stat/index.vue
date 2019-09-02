<template>

  <div id="mainContainer">
    <el-row style="margin-bottom:10px;">
      数据采集情况统计：
      <el-select v-model="cityValue" placeholder="请选择市"  @change="cityChange" clearable>
        <el-option
          v-for="item in cityOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </el-row>
<!-- <el-select v-model="value" placeholder="总计"  @change="changeRange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select> -->
      <!-- <ul id="infoul">
        <li>总次数：{{total}}</li>
        <li v-if="!options.value">时间：{{TimeStr}}</li>
      </ul> -->
<!-- <el-card> -->
    <el-table :data="tableData" highlight-current-row style="width: 100%;" show-summary>
      <el-table-column type="index" width="60" label="序号"></el-table-column>
       <el-table-column prop="city" label="市" min-width="10%"></el-table-column>
      <el-table-column prop="modeName" label="数据来源" min-width="15%"></el-table-column>
      <el-table-column prop="successNum"  label="成功采集次数"  min-width="10%" ></el-table-column>
      <el-table-column prop="failNum" label="失败采集次数" min-width="10%"></el-table-column>
      <el-table-column prop="lastTime"  label="最后一次采集时间"  min-width="15%" ></el-table-column>
      <el-table-column prop="totalNum"  label="采集总数"  min-width="7%" ></el-table-column>
    </el-table>
<!-- </el-card> -->
</div>
  </template>
  <script>

export default {
  data() {
    return {
      // runTime: new Date().now() - this.basicTime,
      runTime: Number.parseInt(Date.now() - new Date(2018, 6, 21)),
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      TimeStr: '',
      options: [{
        value: 'day',
        label: '日交换量'
      }, {
        value: 'week',
        label: '周交换量'

      }, {
        value: 'month',
        label: '月交换量'
      }, {
        value: 'year',
        label: '年交换量'
      }],
      initData: [
        { 'city': '西安市', 'modeName': '市场监管', 'successNum': 11344, 'failNum': 2, 'lastTime': '2019-08-23 11:21' },
        { 'city': '西安市', 'modeName': '环保', 'successNum': 123, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '西安市', 'modeName': '药监', 'successNum': 233, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '铜川市', 'modeName': '市场监管', 'successNum': 54, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '铜川市', 'modeName': '环保', 'successNum': 23, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '铜川市', 'modeName': '药监', 'successNum': 12, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '宝鸡市', 'modeName': '市场监管', 'successNum': 45, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '宝鸡市', 'modeName': '环保', 'successNum': 342, 'failNum': 19, 'lastTime': '2019-08-23 11:21' },
        { 'city': '宝鸡市', 'modeName': '药监', 'successNum': 4, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '咸阳市', 'modeName': '市场监管', 'successNum': 46, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '咸阳市', 'modeName': '环保', 'successNum': 876, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '咸阳市', 'modeName': '药监', 'successNum': 4, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '渭南市', 'modeName': '市场监管', 'successNum': 234, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '渭南市', 'modeName': '环保', 'successNum': 3, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '渭南市', 'modeName': '药监', 'successNum': 2, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '延安市', 'modeName': '市场监管', 'successNum': 343, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '延安市', 'modeName': '环保', 'successNum': 43, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '延安市', 'modeName': '药监', 'successNum': 73, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '汉中市', 'modeName': '市场监管', 'successNum': 156, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '汉中市', 'modeName': '环保', 'successNum': 564, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '汉中市', 'modeName': '药监', 'successNum': 123, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '榆林市', 'modeName': '市场监管', 'successNum': 98, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '榆林市', 'modeName': '环保', 'successNum': 76, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '榆林市', 'modeName': '药监', 'successNum': 45, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '安康市', 'modeName': '市场监管', 'successNum': 23, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '安康市', 'modeName': '环保', 'successNum': 67, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '安康市', 'modeName': '药监', 'successNum': 23, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '商洛市', 'modeName': '市场监管', 'successNum': 78, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '商洛市', 'modeName': '环保', 'successNum': 23, 'failNum': 0, 'lastTime': '2019-08-23 11:21' },
        { 'city': '商洛市', 'modeName': '药监', 'successNum': 3, 'failNum': 0, 'lastTime': '2019-08-23 11:21' }
      ],
      cityOptions: [{
        value: '西安市',
        label: '西安市'
      }, {
        value: '铜川市',
        label: '铜川市'
      }, {
        value: '宝鸡市',
        label: '宝鸡市'

      }, {
        value: '咸阳市',
        label: '咸阳市'
      }, {
        value: '渭南市',
        label: '渭南市'
      }, {
        value: '延安市',
        label: '延安市'
      }, {
        value: '汉中市',
        label: '汉中市'
      }, {
        value: '榆林市',
        label: '榆林市'
      }, {
        value: '安康市',
        label: '安康市'
      }, {
        value: '商洛市',
        label: '商洛市'
      }],
      value: '',
      cityValue: '',
      total: 0,
      tableData: []
    }
  },
  methods: {
    cityChange(val) {
      if (val) {
        this.tableData = []
        for (let index = 0; index < this.initData.length; index++) {
          const element = this.initData[index]
          if (element.city === val) {
            this.tableData.push(element)
          }
        }
      } else {
        this.tableData = this.initData
      }
      this.tableData.forEach(element => {
        element.totalNum = element.failNum + element.successNum
      })
    }

  },

  mounted() {
    this.tableData = this.initData
    this.tableData.forEach(element => {
      element.totalNum = element.failNum + element.successNum
    })
  }

}
</script>
  <style>
#mainContainer {
  padding-left: 30px;
}
#mainContainer ul li {
  margin-top: 10px;
}
#infoul li {
  float: right;
  margin-left: 50px;
}
</style>
