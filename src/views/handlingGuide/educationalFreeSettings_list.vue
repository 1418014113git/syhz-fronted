<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="考试名称：">
        <el-input v-model="filters.name" placeholder="机构名称" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item  label="考试范围：">
        <el-cascader :clearable="true" v-model="filters.citys" :options="options" :props="props" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="goAdd()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="考试名称" width="250">
        <template slot-scope="scope">
          <p :title="scope.row.KSMC" class="ellipsis-word">{{scope.row.KSMC}}</p>
        </template>
      </el-table-column>
      <el-table-column label="考试类型" width="150">
        <template slot-scope="scope">
          <p :title="scope.row.KSLX" class="ellipsis-word">{{scope.row.KSLX}}</p>
        </template>
      </el-table-column>
      <el-table-column label="考试时间" width="250">
        <template slot-scope="scope">
          <p :title="scope.row.KSSJ" class="ellipsis-word">{{scope.row.KSSJ}}</p>
        </template>
      </el-table-column>
      <el-table-column label="考试范围">
        <template slot-scope="scope">
          <p :title="scope.row.KSFW" class="ellipsis-word">{{scope.row.KSFW}}</p>
        </template>
      </el-table-column>
      <el-table-column label="考试状态" width="150">
        <template slot-scope="scope">
          <p :title="scope.row.FBZT">{{scope.row.FBZT}}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">
          <p :title="scope.row.CJSJ">{{scope.row.CJSJ}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" icon="el-icon-info" circle
                     @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="发布" size="mini" type="primary" icon="el-icon-upload" circle
                     @click="handleRelease(scope.$index, scope.row)" v-if="scope.row.FBZT === '草稿'"></el-button>
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.FBZT === '草稿'"></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)" v-if="scope.row.FBZT === '草稿'"></el-button>
          <el-button title="取消发布" size="mini" type="danger" icon="el-icon-close" circle
                     @click="handleCancel(scope.$index, scope.row)" v-if="scope.row.FBZT === '已发布'"></el-button>
          <el-button title="设置考题" size="mini" type="danger" icon="el-icon-setting" circle
                     @click="handleSetting(scope.$index, scope.row)" v-if="scope.row.FBZT === '草稿'"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  name: 'list',
  data() {
    return {
      filters: {
        citys: []
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      list: [],
      options: [],
      props: {
        label: 'cityName',
        value: 'cityCode'
      },
      tableHeight: null
    }
  },
  methods: {
    handleDetail: function(index, row) {
      this.$router.push({ path: '/handlingGuide/educationalFreeSettings_detail/' + row.id })
    },
    handleCancel: function(index, row) {
      this.$confirm('确认取消发布该考试吗?', '提示', {
        type: 'warning'
      }).then(() => {
        row.FBZT = '草稿'
      })
    },
    handleRelease: function(index, row) {
      this.$confirm('确认发布该考试吗?', '提示', {
        type: 'warning'
      }).then(() => {
        row.FBZT = '已发布'
      })
    },
    handleDel: function(index, row) {
      var _this = this
      this.$confirm('确认删除该考试吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.list.forEach(function(item, index, dataList) {
          if (item.id === row.id) {
            dataList.splice(index, 1)
            _this.total = _this.total - 1
          }
        })
      }).catch(() => {
      })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/handlingGuide/educationalFreeSettings_edit/' + row.id })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query()
    },
    handleSetting(index, row) {
      this.$router.push({ path: '/handlingGuide/educationalFreeSettings_setting/' + row.id })
    },
    query() {
      this.list = [
        { 'id': '1', 'KSMC': '三月考试', 'KSLX': '正常考试', 'KSSJ': '2018-06-20 至 2018-06-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局食品犯罪侦查大队，西安市公安局药品犯罪侦查大队', 'FBZT': '已结束', 'CJSJ': '2018-06-15' },
        { 'id': '2', 'KSMC': '四月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-06-27 至 2018-06-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局环境犯罪侦查大队', 'FBZT': '已发布', 'CJSJ': '2018-06-15' },
        { 'id': '3', 'KSMC': '五月考试', 'KSLX': '正常考试', 'KSSJ': '2018-07-20 至 2018-07-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局食品犯罪侦查大队，咸阳市陕西省公安局药品犯罪侦查大队', 'FBZT': '进行中', 'CJSJ': '2018-07-15' },
        { 'id': '4', 'KSMC': '六月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-07-27 至 2018-07-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局环境犯罪侦查大队', 'FBZT': '草稿', 'CJSJ': '2018-07-15' },
        { 'id': '5', 'KSMC': '七月考试', 'KSLX': '正常考试', 'KSSJ': '2018-08-20 至 2018-08-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队，陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' },
        { 'id': '6', 'KSMC': '八月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-08-27 至 2018-08-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' }
      ]
      this.total = 6
      this.page = 1
      this.pageSize = 15
    },
    search() {
      this.page = 1
      this.query()
    },
    resetSearch() {
      this.filters = {
        name: '', ywfw: '', citys: []
      }
      this.page = 1
      this.query()
    },
    goAdd() {
      this.$router.push({ path: '/handlingGuide/educationalFreeSettings_edit/0' })
    },
    init() {
      this.options = [
        { 'parent': '000000', 'cityCode': '110000', 'cityName': '陕西省公安厅', 'children': [
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队', 'cityCode': '110100', 'children': [
            { 'parent': '110101', 'cityName': '西安市公安局食品犯罪侦查大队', 'cityCode': '110101' },
            { 'parent': '110101', 'cityName': '西安市公安局药品犯罪侦查大队', 'cityCode': '110102' },
            { 'parent': '110101', 'cityName': '西安市公安局环境犯罪侦查大队', 'cityCode': '110103' },
            { 'parent': '110101', 'cityName': '咸阳市公安局食品犯罪侦查大队', 'cityCode': '110104' },
            { 'parent': '110101', 'cityName': '咸阳市公安局药品犯罪侦查大队', 'cityCode': '110105' },
            { 'parent': '110101', 'cityName': '咸阳市公安局环境犯罪侦查大队', 'cityCode': '110106' }]
          },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队情报信息支队', 'cityCode': '110200' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队办公室', 'cityCode': '110300' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队', 'cityCode': '110400' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'cityCode': '110500' },
          { 'parent': '110000', 'cityName': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'cityCode': '110600' }
        ] }
      ]
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query()
    this.init()
  }
}
</script>
<style scoped>
</style>
