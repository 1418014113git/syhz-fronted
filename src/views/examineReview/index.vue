<template>
  <section class="case-trend">
    <el-col>
      <el-card style="margin-bottom: 10px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="按年" prop="yearDate">
            <el-date-picker @change="yearChange"
              v-model="yearDate"
              type="year" value-format="yyyy"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="按季度" prop="quarterDate">
            <el-select v-model="quarterDate" placeholder="请选择" @change="quarterChange" clearable>
              <el-option label="1季度" value="1"></el-option>
              <el-option label="2季度" value="2"></el-option>
              <el-option label="3季度" value="3"></el-option>
              <el-option label="4季度" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按月" prop="monthDate">
            <el-date-picker @change="monthChange"
              v-model="monthDate"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="按时间段">
            <el-date-picker @change="dateRChange"
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$isViewBtn('121001')"  @click="query(true)">查询</el-button>
            <el-button type="primary" v-if="$isViewBtn('121001')"  @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-bottom: 10px;">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="50" label="序号"  align="center" ></el-table-column>
          <el-table-column prop="cityName" label="市" align="center" width="100"></el-table-column>
          <el-table-column label="破获案件数" align="center" >
            <el-table-column prop="sp" label="食品类" width="120"  align="center" ></el-table-column>
            <el-table-column prop="yp" label="药品类" width="120" align="center" ></el-table-column>
            <el-table-column prop="hj" label="资源环境类" width="120" align="center" ></el-table-column>
            <el-table-column prop="num" label="总计案件数" width="120" align="center" ></el-table-column>
          </el-table-column>
          <el-table-column prop="dya" label="侦破大要案件数"  align="center" ></el-table-column>
          <el-table-column prop="jqzy" label="发起全国性协查数"  align="center" ></el-table-column>
          <el-table-column prop="zpbd" label="侦破部督案件数"  align="center" ></el-table-column>
          <el-table-column prop="zptd" label="侦破厅督案件数"  align="center" ></el-table-column>
          <el-table-column prop="wzpbd" label="未破部督案件数"  align="center" ></el-table-column>
          <el-table-column prop="wzptd" label="未破厅督案件数"  align="center" ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </section>
</template>

<script>
import {
  getTjAjKh1, getTjAjKh2, getTjAjKh3, getTjAjKh4, getTjAjKh5
} from '@/api/portal'
export default {
  name: 'Statistical',
  data() {
    return {
      tableData: [
        {
          cityName: '西安市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '铜川市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '宝鸡市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '咸阳市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '渭南市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '延安市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '汉中市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '榆林市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '安康市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        },
        {
          cityName: '商洛市', sp: 0, yp: 0, hj: 0, num: 0, dya: 0, jqzy: 0, zpbd: 0, zptd: 0, wzpbd: 0, wzptd: 0
        }
      ],
      dateRange: [],
      yearDate: null,
      quarterDate: null,
      monthDate: null,
      filters: {
        startTime: '',
        endTime: ''
      },
      loading: false,
      loadFlag: 0
    }
  },
  methods: {
    query(hand) {
      for (let j = 0; j < this.tableData.length; j++) {
        for (const key in this.tableData[j]) {
          if (key !== 'cityName') {
            this.tableData[j][key] = 0
          }
        }
      }
      this.loading = true
      const para = this.filters
      if (hand) {
        para.logFlag = 1 // 是否写日志
      }
      this.syhTjAj(para)
      // 大要案统计
      this.dyaTjAj(para)
      // 全国协查统计
      this.inegTjAj(para)
      // 侦破督办案件
      this.phTjAj(para)
      // 未破获督办案件
      this.wphTjAj(para)
    },
    syhTjAj(para) {
      getTjAjKh1(para).then((response) => {
        if (response.code === '000000' && response.data) {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const b = data[i]
            for (let j = 0; j < this.tableData.length; j++) {
              const tb = this.tableData[j]
              if (tb.cityName.indexOf(b.cityName) > -1) {
                tb.sp = b.sp
                tb.yp = b.yp
                tb.hj = b.hj
                tb.num = b.num
                break
              }
            }
          }
        }
        this.loadFlag++
      }).catch(() => {
        this.loadFlag++
      })
    },
    dyaTjAj(para) {
      getTjAjKh2(para).then((response) => {
        if (response.code === '000000' && response.data) {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const b = data[i]
            for (let j = 0; j < this.tableData.length; j++) {
              const tb = this.tableData[j]
              if (tb.cityName.indexOf(b.cityName) > -1) {
                tb.dya = b.num
                break
              }
            }
          }
        }
        this.loadFlag++
      }).catch(() => {
        this.loadFlag++
      })
    },
    inegTjAj(para) {
      getTjAjKh3(para).then((response) => {
        if (response.code === '000000' && response.data) {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const b = data[i]
            for (let j = 0; j < this.tableData.length; j++) {
              const tb = this.tableData[j]
              if (tb.cityName.indexOf(b.cityName) > -1) {
                tb.jqzy = b.num
                break
              }
            }
          }
        }
        this.loadFlag++
      }).catch(() => {
        this.loadFlag++
      })
    },
    phTjAj(para) {
      getTjAjKh4(para).then((response) => {
        if (response.code === '000000' && response.data) {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const b = data[i]
            for (let j = 0; j < this.tableData.length; j++) {
              const tb = this.tableData[j]
              if (tb.cityName.indexOf(b.cityName) > -1) {
                if (b.suLevel === 3) {
                  tb.zpbd = b.num
                } else {
                  tb.zptd = b.num
                }
                break
              }
            }
          }
        }
        this.loadFlag++
      }).catch(() => {
        this.loadFlag++
      })
    },
    wphTjAj(para) {
      getTjAjKh5(para).then((response) => {
        if (response.code === '000000' && response.data) {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const b = data[i]
            for (let j = 0; j < this.tableData.length; j++) {
              const tb = this.tableData[j]
              if (tb.cityName.indexOf(b.cityName) > -1) {
                if (b.suLevel === 3) {
                  tb.wzpbd = b.num
                } else {
                  tb.wzptd = b.num
                }
                break
              }
            }
          }
        }
        this.loadFlag++
      }).catch(() => {
        this.loadFlag++
      })
    },
    yearChange(val) {
      if (val) {
        this.monthDate = null
        this.dateRange = []
        const date = new Date(val + '-01-01')
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), 0, 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), 12, 0), '{y}-{m}-{d}')
      }
    },
    quarterChange(val) {
      if (val) {
        this.monthDate = null
        this.dateRange = []
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), (val * 3 - 3), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), (val * 3), 0), '{y}-{m}-{d}')
      }
    },
    monthChange(val) {
      if (val) {
        this.yearDate = null
        this.quarterDate = null
        this.dateRange = []
        const date = new Date(val + '-01')
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), date.getMonth(), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), date.getMonth() + 1, 0), '{y}-{m}-{d}')
      }
    },
    dateRChange(val) {
      if (val) {
        this.monthDate = null
        this.yearDate = null
        this.quarterDate = null
        if (val.length === 2) {
          this.filters.startTime = val[0]
          this.filters.endTime = val[1]
        } else {
          this.filters.startTime = ''
          this.filters.endTime = ''
        }
      }
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.query(true)
    }
  },
  mounted() {
    this.query()
  },
  watch: {
    loadFlag(val) {
      if (val === 5) {
        this.loading = false
        this.loadFlag = 0
      }
    }
  }
}
</script>
<style scoped>
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.el-table--border {
  border: 1px solid #ebeef5;
}
.el-year-table td .cell {
  color: #fff !important;
}
</style>
