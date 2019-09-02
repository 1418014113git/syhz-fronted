<template>

   <div id="mainContainer">

<el-select v-model="value" placeholder="总计"  @change="changeRange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select>

      <ul id="infoul">
        <li>应用总访问量：{{total}}</li>
        <li v-if="!options.value">系统运行时间：{{TimeStr}}</li>
      </ul>
模块访问量：
<el-card>
    <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="modeName" label="模块名称" min-width="15%"></el-table-column>
      <el-table-column prop="loginNum"  label="访问量"  min-width="7%" ></el-table-column>
    </el-table>
</el-card>
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
        label: '日报'
      }, {
        value: 'week',
        label: '周报'

      }, {
        value: 'month',
        label: '月报'
      }, {
        value: 'year',
        label: '年报'
      }],
      value: '',

      total: 0,
      tableData: [{
        modeName: '舆情分析',
        loginNum: 94124

      }, {
        modeName: '案件管理',
        loginNum: 98898

      }, {
        modeName: '基础业务',
        loginNum: 85643

      }, {
        modeName: '刑嫌信息',
        loginNum: 70078

      }, {
        modeName: '检验鉴定',
        loginNum: 80345

      },
      {
        modeName: '教育训练',
        loginNum: 91544

      }, {
        modeName: '情报管理',
        loginNum: 72161

      }, {
        modeName: '系统对接',
        loginNum: 85271

      },
      {
        modeName: '其他',
        loginNum: 80941

      }],

      tableDataCopy: [{
        modeName: '舆情分析',
        loginNum: 94124

      }, {
        modeName: '案件管理',
        loginNum: 98898

      }, {
        modeName: '基础业务',
        loginNum: 85643

      }, {
        modeName: '刑嫌信息',
        loginNum: 70078

      }, {
        modeName: '检验鉴定',
        loginNum: 80345

      },
      {
        modeName: '教育训练',
        loginNum: 91544

      }, {
        modeName: '情报管理',
        loginNum: 72161

      }, {
        modeName: '系统对接',
        loginNum: 85271

      },
      {
        modeName: '其他',
        loginNum: 80941

      }]
    }
  },
  methods: {
    getTotal() {
      this.tableData.forEach(element => {
        this.total += element.loginNum
      })
    },
    getTime(mss) {
      this.days = parseInt(mss / (1000 * 60 * 60 * 24))
      this.hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = (mss % (1000 * 60)) / 1000
      this.TimeStr = this.days + ' 天 ' + this.hours + ' 小时 ' + this.minutes + ' 分钟 ' + this.seconds + ' 秒 '
    },

    changeRange(val) {
      if (val === 'day') {
        this.total = 0
        // 拷贝原数据

        this.tableData = JSON.parse(JSON.stringify(this.tableDataCopy))
        // 修改值
        this.tableData.forEach(element => {
          element.loginNum = Math.floor(element.loginNum / this.days)

          this.total += element.loginNum
        })

        this.TimeStr = this.hours + ' 小时 ' + this.minutes + ' 分钟 ' + this.seconds + ' 秒 '
      } if (val === 'month') {
        this.total = 0
        // 拷贝原数据
        this.tableData = JSON.parse(JSON.stringify(this.tableDataCopy))
        // 修改值
        this.tableData.forEach(element => {
          element.loginNum = Math.floor(element.loginNum / this.days * 30)
          this.total += element.loginNum
        })
        this.TimeStr = 30 + ' 天'
      } if (val === 'week') {
        this.total = 0
        // 拷贝原数据
        this.tableData = JSON.parse(JSON.stringify(this.tableDataCopy))
        // 修改值
        this.tableData.forEach(element => {
          element.loginNum = Math.floor(element.loginNum / this.days * 7)

          this.total += element.loginNum
        })
        this.TimeStr = 7 + ' 天'
      } if (val === 'year') {
        this.total = 0
        // 拷贝原数据
        this.tableData = JSON.parse(JSON.stringify(this.tableDataCopy))
        // 修改值
        this.tableData.forEach(element => {
          element.loginNum = Math.floor(element.loginNum / this.days * 365)

          this.total += element.loginNum
        })
        this.TimeStr = 365 + ' 天'
      }
    }
  },

  mounted() {
    this.getTotal()
    this.getTime(this.runTime)
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
