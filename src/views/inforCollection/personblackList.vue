<template>
  <section>
    <el-form :inline="true" :model="filters" size="small">
      <el-form-item label="人员姓名">
        <el-input size="small" clearable v-model="filters.XM" placeholder="人员姓名"></el-input>
      </el-form-item>
      <el-form-item label="人员编号">
        <el-input size="small" clearable v-model="filters.CYRYBH" placeholder="人员编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  v-if="$isViewBtn('100301')" v-on:click="query(true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tasks"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand"  label-width="110px">
            <el-form-item label="人员编号">
              <span>{{ props.row.CYRYBH }}</span>
            </el-form-item>
            <el-form-item label="人员姓名">
              <span>{{ props.row.XM }}</span>
            </el-form-item>
            <el-form-item label="加入黑名单原因" label-width="130px">
              <span>{{ props.row.blacklist_reason }}</span>
            </el-form-item>
            <el-form-item label="违法行为">
              <span>{{ props.row.unlaw_act }}</span>
            </el-form-item>
            <el-form-item label="处罚依据">
              <span>{{ props.row.according }}</span>
            </el-form-item>
            <el-form-item label="处罚结果">
              <span>{{ props.row.according_message }}</span>
            </el-form-item>
            <el-form-item label="附件下载">
              <a  v-for="item in props.row.uploadFiles" :href="item.path"
                  style="text-decoration:underline;color: rgb(32, 160, 255);display: block" :download="item.name">{{item.name}}</a>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="CYRYBH" label="人员编号"></el-table-column>
      <el-table-column prop="XM" label="人员姓名"></el-table-column>
      <el-table-column prop="blacklist_reason" label="加入黑名单原因"></el-table-column>
      <el-table-column prop="unlaw_act" label="违法行为"></el-table-column>
      <el-table-column prop="according" label="处罚依据"></el-table-column>
      <el-table-column prop="according_message" label="处罚结果"></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import { getBlankPersonListPage, deleteCompany, getTCode } from '@/api/inforCollection'
  export default {
    name: 'index',
    data() {
      return {
        filters: {
          XM: '',
          CYRYBH: ''
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        enterprise_nature: [],
        tasks: [],
        tableHeight: null
      }
    },
    methods: {
      formatterBlack(row, index) {
        return row.ENABLE === 1 ? '是' : '否'
      },
      formatterNS(row, index) {
        return row.SFNS === 1 ? '是' : '否'
      },
      excelImport() {

      },
      otherImport() {

      },
      handleAdd: function() {
        this.$router.push({ path: '/inforCollection/add' })
      },
      query(flag) {
        this.page = flag ? 1 : this.page
        const para = {
          pageNum: this.page,
          cyrybh: this.filters.CYRYBH,
          xm: this.filters.XM,
          enable: 0,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getBlankPersonListPage(para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.tasks = data.list
          this.tasks.forEach(function(item) {
            if (item.attachment) {
              item.uploadFiles = JSON.parse(item.attachment)
            }
          })
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(false)
      },
      handleDetail: function(index, row) {
        this.$router.push({ path: '/inforCollection/edit/' + row.id })
      },
      handleEdit: function(index, row) {
        this.$router.push({ path: '/inforCollection/edit/' + row.id })
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = { id: row.id }
          deleteCompany(para).then((res) => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.query(false)
          }).catch(() => {
            this.listLoading = false
          })
        }).catch(() => {

        })
      },
      removeBlackList: function(index, row) {
        this.$router.push({ path: '/inforCollection/removeBlackList/' + row.bid })
      },
      addBlack: function(index, row) {
        this.$router.push({
          path: '/inforCollection/addBlack',
          query: {
            id: row.id, DWMC: row.DWMC
          }
        })
      },
      clear() {
        this.filters = {
          DWMC: '', DWXZ: '', DWLB: '', XYLB: '', SFNS: ''
        }
        this.query(true)
      },
      tcode(type) {
        const para = {
          codeLx: type
        }
        getTCode(para).then((response) => {
          if (type === 'qyxz') {
            this.enterprise_nature = response.data
          } else {
            this.stateArr = response.data
          }
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.query(true)
      this.tcode('qyxz')
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
  p > span{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
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
</style>
