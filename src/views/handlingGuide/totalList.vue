<template>
  <section class="trainMaterial_totalList">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="content">
            <el-card>
              <el-form :inline="true" :model="filters" label-width="80px">
                <el-form-item label="分类">
                  <el-select v-model="filters.type" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="环境" value="3"></el-option>
                    <el-option label="食品" value="1"></el-option>
                    <el-option label="药品" value="2"></el-option>
                    <el-option label="综合" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发布时间">
                  <el-date-picker v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="筛选条件">
                  <el-select v-model="filters.type" placeholder="请选择">
                    <el-option label="本年" value=""></el-option>
                    <el-option label="本月" value="3"></el-option>
                    <el-option label="食品" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-if="$isViewBtn('139006')" @click="query(true)" icon="el-icon-search">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="curriculumData" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table :data="curriculumDataList" v-loading="listLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                      <el-table-column prop="" width="128"><template slot-scope="scopeEx"></template></el-table-column>
                      <el-table-column prop="name" align="center" class="left" label="单位"></el-table-column>
                      <el-table-column prop="id" align="center" label="法律法规"></el-table-column>
                      <el-table-column prop="id" align="center" label="行业标准"></el-table-column>
                      <el-table-column prop="id" align="center" label="规范制度"></el-table-column>
                      <el-table-column prop="id" align="center" label="学习人次"></el-table-column>
                      <el-table-column prop="id" align="center" label="案例指引"></el-table-column>
                      <el-table-column prop="id" align="center" label="总数"></el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column type="index" width="80"></el-table-column>
                <el-table-column prop="name" align="center" class="left" label="地市"></el-table-column>
                <el-table-column prop="id" align="center" label="法律法规"></el-table-column>
                <el-table-column prop="id" align="center" label="行业标准"></el-table-column>
                <el-table-column prop="id" align="center" label="规范制度"></el-table-column>
                <el-table-column prop="id" align="center" label="学习人次"></el-table-column>
                <el-table-column prop="id" align="center" label="案例指引"></el-table-column>
                <el-table-column prop="id" align="center" label="总数"></el-table-column>
              </el-table>
              <el-table :data="curriculumData" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table :data="curriculumData" v-loading="listLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                      <el-table-column prop="" width="128"><template slot-scope="scopeEx"></template></el-table-column>
                      <el-table-column prop="name" align="center" class="left" label="单位"></el-table-column>
                      <el-table-column prop="id" align="center" label="法律法规"></el-table-column>
                      <el-table-column prop="id" align="center" label="行业标准"></el-table-column>
                      <el-table-column prop="id" align="center" label="规范制度"></el-table-column>
                      <el-table-column prop="id" align="center" label="学习人次"></el-table-column>
                      <el-table-column prop="id" align="center" label="案例指引"></el-table-column>
                      <el-table-column prop="id" align="center" label="总数"></el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column type="index" width="80"></el-table-column>
                <el-table-column prop="name" align="center" class="left" label="地市"></el-table-column>
                <el-table-column prop="id" align="center" label="法律法规"></el-table-column>
                <el-table-column prop="id" align="center" label="行业标准"></el-table-column>
                <el-table-column prop="id" align="center" label="规范制度"></el-table-column>
                <el-table-column prop="id" align="center" label="学习人次"></el-table-column>
                <el-table-column prop="id" align="center" label="案例指引"></el-table-column>
                <el-table-column prop="id" align="center" label="总数"></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  export default {
    name: 'trainMaterial_totalList',
    data() {
      return {
        expands: [],
        filters: {
          type: '',
          belongDepCode: '',
          creationId: '',
          time: [],
          startTime: '',
          endTime: ''
        },
        listLoading: false,
        curriculumData: [{ id: 12, name: '陕西省' }],
        curriculumDataList: [{ id: 12, name: '陕西省环食药总队' }],
        value: '',
        countHeight: null,
        curDept: {},
        curUser: {},
        isNormal: false // true 普通民警， false 审核者
      }
    },
    methods: {
      rowClick(row) {
        if (this.expands.indexOf(row.id) > -1) {
          this.expands.splice(this.expands.indexOf(row.id), 1)
        } else {
          this.expands.push(row.id)
        }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        // if (columnIndex === 0) {
        //   return [0, 0]
        // } else if (columnIndex === 1) {
        //   return [1, 2]
        // }
      },
      getRowKeys(row) {
        return row.id
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '总计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index]
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      query() {
        // this.listLoading = true
        // const para = {
        //   title: this.filters.title,
        //   type: this.filters.type,
        //   auditStatus: this.filters.auditStatus,
        //   creationId: this.filters.creationId,
        //   startTime: this.filters.time ? this.filters.time[0] : '',
        //   endTime: this.filters.time ? this.filters.time[1] : '',
        //   auditDeptCode: this.curDept.depCode
        // }
        // if (this.isNormal) {
        //   para.personId = this.curUser.id
        // }
        // if (this.filters.belongDepCode === '' || this.filters.belongDepCode === this.curDept.depCode) {
        //   para.belongDeptCode = this.curDept.depCode
        // }
        // this.active = this.filters.type
        // this.$query('page/traincourseaudit', para).then((response) => {
        //   this.listLoading = false
        //   // this.curriculumData = response.data.list
        //   // this.total = response.data.totalCount
        //   // this.pageSize = response.data.pageSize
        // }).catch(() => {
        //   this.listLoading = false
        // })
      },
      queryChild() {}
    },
    mounted() {
      this.isNormal = !this.$isViewBtn('129405')
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.countHeight = document.documentElement.clientHeight - 230
      this.filters.belongDepCode = this.curDept.depCode
      this.query()
    }
  }
</script>

<style>
  .trainMaterial_totalList .content {
    padding: 0 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .trainMaterial_totalList .el-card.is-always-shadow .el-card__body > div.all{
    height: 50px;
  }
  .trainMaterial_totalList .el-card.is-always-shadow .el-card__body ul{
    margin-left: 20px;
  }
  .trainMaterial_totalList .el-table__body td.el-table__expanded-cell{
    padding: 0;
  }
  .trainMaterial_totalList .el-table__body td.el-table__expanded-cell > div {
    margin: 0!important;
  }
  .trainMaterial_totalList .el-table_1_column_1.el-table__expand-column{
    width: 100px;
  }
  .trainMaterial_totalList .el-table__body-wrapper .is-center.left{
    text-align: left !important;
  }
  .trainMaterial_totalList .el-table__body-wrapper .el-table__expanded-cell .is-center.left.is-leaf{
    text-align: center !important;
  }
</style>
