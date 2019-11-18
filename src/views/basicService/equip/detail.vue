<template>
<!--装备信息明细-->
  <section class="detail">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    <el-form :inline="true" :model="filters">
      <el-form-item label="装备分类" prop="">
        <el-select  v-model="filters.groupId" size="small" placeholder="请选择" @change="changeSelect">
          <el-option v-for="item in zblbList" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="配备项目" prop="" >
        <el-select  v-model="filters.allocateId" size="small" placeholder="请选择" @change="changeSelectpbxm">
          <el-option v-for="item in pbxmList" :key="item.allocateId" :label="item.allocateName" :value="item.allocateId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="add" v-if="isShowAdd && $isViewBtn('180001')">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;margin-top: 15px;"  :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocateName" label="配备项目" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.allocateName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detailNumber" label="配备数量">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.detailNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseTime" label="采购日期">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{scope.row.purchaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipStatus" label="状态">
        <template slot-scope="scope">
          <span :class="{'redColor':scope.row.equipStatus === 1}">{{getTypeStatus(scope.row.equipStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" title="编辑"  type="primary" icon="el-icon-edit" circle  v-if="$isViewBtn('180003')"  @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  v-if="$isViewBtn('180002')" @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加/编辑配备项目弹出层-->
    <el-dialog :title="title" :visible.sync="isShowDialog"  :close-on-click-modal="false">
      <add-edit  :isShowDialog="isShowDialog"  :curRowData="curRow"  :curType="curType"  @closeDialog="closeDialog"></add-edit>
    </el-dialog>
  </section>
</template>
<script>
import AddEdit from './addEdit'
export default {
  name: 'detail',
  components: {
    AddEdit
  },
  data() {
    return {
      filters: {
        groupId: '', // 分类id
        allocateId: '' // 项目id
      },
      belongDepCode: '',
      curType: '', // 弹框类型  0： 添加， 1：编辑
      title: '',
      zblbList: [], // 装备分类下拉列表
      pbxmList: [], // 配备项目下拉列表
      tableData: [], // 列表数据
      isShowDialog: false, // 是否显示弹框
      curRow: {}, // 存储当前被点击行的row数据
      detailRow: {}, // 存储列表页传递过来的被点击行的row数据
      listLoading: false,
      isShowAdd: false,
      tableHeight: null
    }
  },
  methods: {
    init() {
      this.equipgroupselect() // 装备分类下拉框
      this.equipallocateselect(this.detailRow.groupId, true)
    },
    equipgroupselect() { // 装备分类下拉框
      this.$query('equipgroupselect', {}).then((response) => {
        if (response.data.length > 0) {
          this.zblbList = response.data
        } else {
          this.zblbList = []
        }
        this.filters.groupId = this.detailRow.groupId
      })
    },
    equipallocateselect(id, flag) { // 配备项目下拉框.根据装备分类id查询
      const param = {
        groupId: id,
        departType: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depType : ''
      }
      this.$query('equipallocateselect', param).then((response) => {
        this.pbxmList = response.data
        if (flag) {
          this.filters.allocateId = this.detailRow.allocateId
          this.query(true)
        }
      })
    },
    query(flag, hand) { // 列表查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        groupId: this.filters.groupId, // 分类id
        allocateId: this.filters.allocateId, // 项目id
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        belongDepCode: this.belongDepCode // 部门code
      }
      if (hand) {
        para.logFlag = 1 // 添加埋点参数
      }
      this.$query('page/basicequipdetail', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.tableData = []
      this.total = 0
      this.pageSize = 15
    },
    add() { // 添加
      this.title = '添加配备项目'
      this.curType = 0
      this.isShowDialog = true
      this.curRow = this.filters
    },
    handleEdit(index, row) { // 编辑
      this.title = '编辑配备项目'
      this.curType = 1
      this.isShowDialog = true
      this.curRow = row
    },
    handleDelete(index, row) { // 删除
      this.$confirm('是否删除该装备信息！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          equipNumber: row.detailNumber,
          delFlage: 1,
          purchaseTime: row.detailNumber ? row.purchaseTime : '',
          userId: JSON.parse(sessionStorage.getItem('userInfo')).id, // 用户id
          userName: JSON.parse(sessionStorage.getItem('userInfo')).realName // 用户真实姓名
        }
        this.$update('basicequipdetail/' + row.dtatilId, param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.initData()
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // })
      })
    },
    changeSelect(val) { // 装备分类change事件
      this.pbxmList = []
      this.filters.allocateId = ''
      if (val) {
        this.equipallocateselect(val)
      }
      this.query(true)
    },
    changeSelectpbxm() {
      this.query(true)
    },
    closeDialog(val) { // 关闭弹框
      this.isShowDialog = val
      this.init()
    },
    closeDia() {
      this.resetForm = 'addEditForm'
    },
    getTypeStatus(val) { // 根据配备状态获取中文名
      var name = ''
      if (val === 1) {
        name = '需要更新'
      } else if (val === 2) {
        name = '无需更新'
      } else if (val === 3) {
        name = '无更新要求'
      }
      return name
    },
    toback() { // 返回
      this.$router.back(-1)
      this.filters = {
        groupId: '', // 分类id
        allocateId: '' // 项目id
      }
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.belongDepCode = JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depCode : '' // 部门code
    if (this.$route.query.groupId) {
      this.detailRow = this.$route.query
      this.detailRow.groupId = Number(this.detailRow.groupId)
      this.detailRow.allocateId = Number(this.detailRow.allocateId)
      this.belongDepCode = this.$route.query.belongDepCode
      this.init()
    }
    var depCode = JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depCode : ''
    if (depCode === this.belongDepCode) {
      this.isShowAdd = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 .detail{
    .el-dialog{
      width: 58%;
    }
  }
@media only screen and (max-width: 1367px) {
 .detail{
    .el-dialog{
      width: 65%;
    }
  }
}
@media screen and (min-width: 1920px) {
   .detail{
    .el-dialog{
      width: 50%;
    }
  }
}
</style>
