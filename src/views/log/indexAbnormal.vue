<template>
<section>
  <div class="restricted_per">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tdyc">
      <el-tab-pane label="统计" name="first">
        <div id="chartColumn" style="width: 90%; min-height: 400px; margin:0 auto"></div>
        <el-table :data="tjData" v-loading="listLoading" style="width: 100%;margin-bottom:20px;" class="statisticCollect" show-summary>
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="cityName" label="区域"></el-table-column>
          <el-table-column prop="num" label="访问异常量（次）"></el-table-column>
          <el-table-column prop="per" label="用户数（人）"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="报警提示" name="second">
        <el-form :inline="true" :model="restrictedQuery">
          <el-form-item label="用户名">
            <el-input v-model="restrictedQuery.name" clearable placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="restrictedQuery.realName" clearable placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-if="$isViewBtn('100903')" v-on:click="queryData(true,true)">查询</el-button>
            <el-button size="small"  @click="clear">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="showAdd">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="statisticCollect" :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" width="56"></el-table-column>
          <el-table-column prop="user_name" label="用户名" min-width="100"></el-table-column>
          <el-table-column prop="real_name" label="姓名" min-width="100"></el-table-column>
          <el-table-column prop="ip" label="IP地址" min-width="100"></el-table-column>
          <el-table-column prop="create_date" label="创建时间" min-width="100"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-if="$isViewBtn('100903')" title="解除异常" size="mini" type="danger" icon="el-icon-news" circle
                        @click="handlerDel(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                        :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="diaTitle" :visible.sync="dialogVisible" width="700px" @close="handleClose(false)">
      <el-form ref="restrictedForm" :model="restrictedBean" :rules="rules" label-width="160px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="restrictedBean.userId" placeholder="请选择" filterable @change="personChange" clearable>
            <el-option v-for="item in personsData" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="savePerson" :loading="restrictLoading">提交</el-button>
          <el-button @click="handleClose(false)">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</section>
</template>

<script>
import echarts from 'echarts'

import { getUserExt } from '@/api/depts'
export default {
  name: 'indexAbnormal',
  data() {
    return {
      activeName: 'first',
      diaTitle: '',
      restrictedQuery: {
        name: ''
      },
      restrictedBean: {
        id: '',
        userName: ''
      },
      listData: [],
      personsData: [],
      page: 1,
      total: 0,
      pageSize: 15,
      listLoading: false,
      restrictLoading: false,
      dialogVisible: false,
      tableHeight: null,
      citys: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
      tjData: [{ cityName: '西安市', num: 200, per: 1000 }, { cityName: '铜川市', num: 40, per: 345 }, { cityName: '宝鸡市', num: 62, per: 1000 },
        { cityName: '咸阳市', num: 23, per: 810 }, { cityName: '渭南市', num: 25, per: 309 }, { cityName: '延安市', num: 76, per: 265 },
        { cityName: '汉中市', num: 135, per: 100 }, { cityName: '榆林市', num: 162, per: 240 }, { cityName: '安康市', num: 32, per: 300 }, { cityName: '商洛市', num: 20, per: 10 }
      ],
      rules: {
        userId: [{
          required: true, message: '请输入姓名', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 3 === 1) {
        return 'warning-row'
      }
      return ''
    },
    initStatistical() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        title: {
          text: '使用情况统计',
          subtext: '纯属虚构',
          textStyle: {
            color: '#bbbbbb'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['访问量']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 14
          },
          data: this.citys,
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          },
          nameTextStyle: {
            fontSize: 14
          }
        },
        barMaxWidth: 30,
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            },
            nameTextStyle: {
              fontSize: 14
            }
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'bar',
            data: [200.0, 40, 62, 23, 25, 76, 135, 162, 32, 20.0],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
            itemStyle: {
              normal: {
                // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    },
    personChange(val) {
      const len = this.personsData.length
      for (let i = 0; i < len; i++) {
        const bean = this.personsData[i]
        if (bean.id === val) {
          this.restrictedBean.userId = bean.id
          this.restrictedBean.userName = bean.userName
          this.restrictedBean.realName = bean.realName
          return false
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryData(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryData(false, true)
    },
    queryData(flag, hand) {
      this.page = flag ? 1 : this.page
      const para = this.restrictedQuery
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (hand) {
        para.logFlag = 1 // 是否写日志
      }
      this.listLoading = true
      var response = { 'success': true, 'code': '000000', 'message': 'OK',
        'data': { 'pageSize': 15, 'pageNum': 1, 'totalCount': 10, 'list': [
          { 'user_id': 1185, 'user_name': '2105320', 'enable': 1, 'real_name': '何家骏', 'id': 2014, 'ip': '192.168.52.104', 'create_date': '2019-08-22 11:51:05' },
          { 'user_id': 1793, 'user_name': '090846', 'enable': 1, 'real_name': '刘洪亮', 'id': 2013, 'ip': '192.168.43.5', 'create_date': '2019-08-07 14:44:24' },
          { 'user_id': 1, 'user_name': 'admin', 'enable': 1, 'real_name': '超级管理员', 'id': 2012, 'ip': '192.168.32.100', 'create_date': '2019-06-06 15:13:09' },
          { 'user_id': 999, 'user_name': 'admin', 'enable': 1, 'real_name': 'admin', 'id': 2011, 'ip': '192.168.5.14', 'create_date': '2019-01-28 10:56:38' },
          { 'user_id': 1000, 'user_name': '010000', 'enable': 1, 'real_name': '老王', 'id': 2010, 'ip': '192.168.43.5', 'create_date': '2019-01-27 19:03:19' },
          { 'user_id': 1185, 'user_name': '2105320', 'enable': 1, 'real_name': '何家骏', 'id': 2014, 'ip': '192.168.52.104', 'create_date': '2019-08-22 11:51:05' },
          { 'user_id': 1793, 'user_name': '090846', 'enable': 1, 'real_name': '张三', 'id': 2013, 'ip': '192.168.3.15', 'create_date': '2019-08-07 14:44:24' },
          { 'user_id': 1, 'user_name': '010000', 'enable': 1, 'real_name': '苗海庭', 'id': 2012, 'ip': '192.168.43.5', 'create_date': '2019-06-06 15:13:09' },
          { 'user_id': 999, 'user_name': 'admin', 'enable': 1, 'real_name': '赵玉和', 'id': 2011, 'ip': '192.168.5.14', 'create_date': '2019-01-28 10:56:38' },
          { 'user_id': 1000, 'user_name': 'kaven', 'enable': 1, 'real_name': '牛建强', 'id': 2010, 'ip': '192.168.43.155', 'create_date': '2019-01-27 19:03:19' }
        ] }
      }
      // this.$query('page/trestrictedper', para).then((response) => {
      this.listLoading = false
      this.listData = response.data.list
      this.total = response.data.totalCount
      this.pageSize = response.data.pageSize
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    clear() {
      this.restrictedQuery.name = ''
      this.restrictedQuery.realName = ''
      this.queryData(true, true)
    },
    showAdd() {
      this.diaTitle = '新增'
      this.dialogVisible = true
    },
    back() {
      this.$router.back(-1)
    },
    handlerDel(id) {
      this.$confirm('确认该记录解除异常吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$remove('trestrictedper/' + id, { logFlag: 1 }).then((response) => {
          this.listLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.queryData(false)
          }
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    hideDialog(flag) {
      this.$refs.restrictedForm.resetFields()
      this.restrictedBean = {
        id: '', userName: ''
      }
      this.dialogVisible = false
      if (flag) {
        this.queryData(false)
      }
    },
    savePerson() {
      this.$refs.restrictedForm.validate(valid => {
        if (valid) {
          this.restrictLoading = true
          this.$save('trestrictedperson', this.restrictedBean).then((response) => {
            this.restrictLoading = false
            if (response.code === '000000') {
              this.handleClose(true)
            }
          }).catch(() => {
            this.restrictLoading = false
          })
        }
      })
    },
    handleClose(flag) {
      this.hideDialog(flag)
    },
    initPerson() {
      getUserExt({}).then((response) => {
        if (response.code === '000000') {
          if (response.data && response.data.length > 0) {
            const len = response.data.length
            for (let i = 0; i < len; i++) {
              const bean = response.data[i]
              this.personsData.push({
                id: bean.id, userName: bean.user_name, realName: bean.real_name
              })
            }
          }
        }
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.queryData(true)
    this.initPerson()
    this.initStatistical()
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.el-table .warning-row td {
  color: #f56c6c;
  .el-button--danger {
    color: #f56c6c;
  }
}
.tdyc.el-tabs {
  padding: 0 20px;
}
</style>
