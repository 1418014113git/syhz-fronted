<template>
  <section class="social_resources_wrap">
    <el-form :inline="true" :model="filters">
      <!-- <el-form-item label="时间">
          <el-date-picker v-model="dateRange" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable></el-date-picker>
        </el-form-item> -->
      <el-form-item label="时间：" prop="startTime">
        <el-date-picker
          v-model="filters.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          placeholder="请选择开始时间"
          @change="dateChange">
        </el-date-picker>
          <el-date-picker
          v-model="filters.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
          @change="dateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="筛选类型：">
        <el-select v-model="filters.type" filterable clearable placeholder="选择筛选类型" @change="queryByType">
          <el-option label="本月" value="month"></el-option>
          <el-option label="本季" value="quarter"></el-option>
          <el-option label="本年" value="year"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$isViewBtn('100401')"  @click="init">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;" show-summary :summary-method="getSummaries" v-loading="listLoading">
      <el-table-column prop="index" label="序号" width="100">
         <template slot-scope="scope">
          <span>{{scope.row.index}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="syhXzqhName" label="单位/市" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resource" label="资源" max-width="50" show-overflow-tooltip>
        <template slot-scope="scope">
            <span @click="handleResourceDateil(scope.row)" :class="scope.row.resource>0?'resource_detail_link':''">{{scope.row.resource}} 类</span>
          </template>
      </el-table-column>
      <el-table-column prop="total" label="数量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$thousSplit(scope.row.total+'')}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 资源详情 -->
    <el-dialog title="资源详情" :visible.sync="dialogVisible" @close="closeDialog">
      <el-table :data="detailData" style="width: 100%;" show-summary :summary-method="getSummariesDetail" v-loading="detailLoading">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="source" label="来源" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="单位" max-width="50" show-overflow-tooltip></el-table-column>
        <el-table-column prop="total" label="数量" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$thousSplit(scope.row.total+'')}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'CommunityDataEchart',
  data() {
    return {
      filters: {
        type: 'year', // 筛选类型
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      tableData: [], // 列表数据
      detailData: [], // 详情数据
      listLoading: false,
      detailLoading: false,
      resourceTotal: 0, // 资源总数合计
      totalSummary: 0, // 数量合计
      totalDetailSummary: 0, // 详情数量合计
      dateRange: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dialogVisible: false, // 弹框是否显示
      yearDate: '', //  年
      quarterDate: '', // 季度
      quarterDisabled: true, // 季度选择框是否禁用
      endDateDisabled: true, // 结束时间选择框是否禁用
      startTime: '',
      endTime: '',
      staticData: [
        {
          syhXzqhName: '食药环侦总队',
          syhXzqh: '610000',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '西安市',
          syhXzqh: '610100',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '铜川市',
          syhXzqh: '610200',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '宝鸡市',
          syhXzqh: '610300',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '咸阳市',
          syhXzqh: '610400',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '渭南市',
          syhXzqh: '610500',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '延安市',
          syhXzqh: '610600',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '汉中市',
          syhXzqh: '610700',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '榆林市',
          syhXzqh: '610800',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '安康市',
          syhXzqh: '610900',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '商洛市',
          syhXzqh: '611000',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '杨凌区',
          syhXzqh: '611100',
          resource: 0,
          total: 0
        }
      ]
    }
  },
  methods: {
    getSummaries() {
      const sums = ['', '合计', '', '']
      sums[2] = this.resourceTotal + ' 类' // 资源合计
      sums[3] = this.$thousSplit(this.totalSummary + '') // 数量合计
      return sums
    },
    getSummariesDetail() {
      const sums = ['', '合计', '', '']
      sums[3] = this.$thousSplit(this.totalDetailSummary + '') // 数量合计
      return sums
    },
    init() {
      if (this.filters.type === '') {
        if (this.filters.startTime === '' && this.filters.endTime !== '') { // 开始时间为空,结束时间不为空
          this.$message({
            message: '开始时间不能为空', type: 'error'
          })
          return false
        } else if (this.filters.startTime !== '' && this.filters.endTime === '') { // 选择了开始时间,结束时间为空
          this.filters.endTime = this.getdate() // 将当前时间赋值给结束时间
        } else if (this.filters.startTime && this.filters.endTime) { // 开始时间和结束时间均不为空
          if (new Date(this.filters.startTime).getTime() > new Date(this.filters.endTime).getTime()) {
            this.$message({
              message: '开始时间不能大于结束时间', type: 'error'
            })
            return false
          }
        }
      }
      this.resourceTotal = 0 // 资源总数合计
      this.totalSummary = 0 // 数量合计
      this.listLoading = true
      // 数据协调记录表
      this.$query('sjxtjlb', this.filters).then((response) => {
        if (response.code === '000000' && response.data) {
          this.listLoading = false
          // this.tableData = response.data 不能直接赋值，需要将资源为0的也拼接再显示
          this.dealData(response.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    dealData(data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        this.resourceTotal += element.resource // 资源总数
        this.totalSummary += element.total // 数量总数
      }
      var diffArr = []
      for (let i = 0; i < this.staticData.length; i++) {
        const item = this.staticData[i]
        var isExit = false
        for (let j = 0; j < data.length; j++) {
          var it = data[j]
          if (item.syhXzqh === it.syhXzqh) {
            isExit = true
            break
          }
        }
        if (!isExit && (item.syhXzqh !== '610000')) { // 如果查出来的结果集没有总队，则不往新数组push
          diffArr.push(item)
        }
      }
      data = data.concat(diffArr)
      if (data[0].syhXzqh === '610000') { // 查询结果 第一条是总队
        for (let m = 0; m < data.length; m++) {
          const element = data[m]
          if (m === 0 && element.syhXzqh === '610000') {
            // m.index = '' // 总队 不显示序号
            this.$set(element, 'index', '')
          } else {
            // m.index = m // 序号，市按照正常序号
            this.$set(element, 'index', m)
          }
        }
      } else {
        for (let m = 0; m < data.length; m++) {
          const element = data[m]
          this.$set(element, 'index', m + 1) // 序号，第一条数据是市的，从1进行排序
        }
        // 若第一条不是总队，则把总队的数据手动放在第一位
        data.unshift(this.staticData[0])
      }
      this.tableData = data
    },
    dateChange() { // 时间change事件
      this.filters.type = ''
    },
    queryByType() { // 查询类型change事件
      this.filters.startTime = ''
      this.filters.endTime = ''
      this.init()
    },
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      // + ' ' + now.toTimeString().substr(0, 8)
    },
    reset() { // 重置
      this.filters = {
        startTime: '', endTime: '', type: 'year'
      }
      this.init()
    },
    handleResourceDateil(row) {
      if (row.resource === 0) {
        return false
      }
      this.dialogVisible = true
      this.resourcesDetailByCity(row)
    },
    resourcesDetailByCity(row) {
      this.dialogVisible = true
      this.detailLoading = true
      var param = {
        syhXzqh: row.syhXzqh, // 行政区划code
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        type: this.filters.type
      }
      this.$query('sjxtjlbdetail', param).then((response) => {
        if (response.code === '000000' && response.data) {
          this.detailLoading = false
          this.detailData = response.data
          this.detailData.forEach(item => {
            this.totalDetailSummary += item.total
          })
        }
      }).catch(() => {
        this.detailLoading = false
      })
    },
    closeDialog() {
      this.totalDetailSummary = 0 // 关闭弹窗后清空合计
      this.detailData = []
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.social_resources_wrap .el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.social_resources_wrap .resource_detail_link {
  cursor: pointer;
  text-decoration: underline;
}
@media only screen and (max-width: 1367px) {
}
</style>
