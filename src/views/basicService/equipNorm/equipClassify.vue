<template>
  <section>
    <el-row class="clearfix">
      <el-button class="right" type="primary" size="small" @click="addEquipClassify" icon="el-icon-plus" style="margin-top:3px;">添加装备分类</el-button>
      <img src="@/assets/icon/back.png" class="goBack" @click="back" style="margin-right: 10px;">
    </el-row>
    <el-table :data="tableList" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="groupName" label="装备分类名称" align="center" width="400"></el-table-column>
      <el-table-column prop="orderIndex" label="显示次序" align="center" width="120"></el-table-column>
      <el-table-column prop="lastTime" label="最新编辑时间" align="center" width="240"></el-table-column>
      <el-table-column prop="remark" label="说明" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" circle icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.groupStatus===1" title="停用" size="mini" type="primary" circle icon="el-icon-minus" @click="handleEnable(scope.$index, scope.row)"></el-button>
          <el-button v-else-if="scope.row.groupStatus===0" title="启用" size="mini" type="primary" circle icon="el-icon-caret-right" @click="handleEnable(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 装备分类信息 -->
    <el-dialog title="装备分类信息" :visible.sync="dialogVisible" size="small" @close="closeDia('equipClassifyInfo')" class="comDialog" :close-on-click-modal="false">
      <el-form ref="equipClassifyInfo" size="small" :rules="rules" :model="equipClassifyInfo" label-width="100px" class="equipProject" v-loading="formLoading">
        <el-row>
          <el-form-item label="装备分类" prop="groupName">
              <el-input v-model.trim="equipClassifyInfo.groupName" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="显示次序" prop="orderIndex">
            <el-input-number v-model.trim="equipClassifyInfo.orderIndex" :min="1" :max="999"></el-input-number>
          </el-form-item>
          <el-form-item label="说明" prop="remark">
            <el-input v-model="equipClassifyInfo.remark" type="textarea" auto-complete="off" maxlength="500" rows="3"></el-input>
          </el-form-item>
          <el-col align="center">
            <el-button @click="cancelEquipClassify('equipClassifyInfo')" class="cancelBtn" :loading="formLoading">取消</el-button>
            <el-button type="primary" @click="submitEquipClassify('equipClassifyInfo')" class="saveBtn" :loading="formLoading">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import { regCn } from '@/utils/validate'
export default {
  name: 'list',
  data() {
    return {
      equipNormForm: {},
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      equipClassifyInfo: {}, // 装备分类信息
      dialogVisible: false, // 添加弹框
      formLoading: false, // 弹框的loading
      tableList: [],
      tableHeight: null,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        groupName: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入装备分类'))
            } else if (!(regCn.test(value))) {
              callback(new Error('请输入汉字'))
            } else {
              this.formLoading = true
              var para = { groupName: value }
              if (this.equipClassifyInfo.id) {
                para.id = this.equipClassifyInfo.id
              }
              this.$query('basicequip', para).then((response) => {
                this.formLoading = false
                if (response.data && response.data.length > 0) {
                  callback(new Error('装备 ' + value + ' 已添加，请确认后重试！'))
                } else {
                  callback()
                }
              }).catch(() => {

              })
            }
          }
        }
      }
    }
  },
  methods: {
    addEquipClassify() { // 添加装备分类信息
      this.dialogVisible = true
      this.equipClassifyInfo = {} // 清空
    },
    queryClassify(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize
        // userId: this.userInfo.id
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/basicequipgroup', para).then((response) => {
        this.listLoading = false
        if (response.data) {
          // && response.data.list.length > 0
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.tableList = response.data.list
        }
      }).catch(() => {
        this.tableList = []
        this.total = 0
        this.listLoading = false
      })
    },
    cancelEquipClassify() { // 装备分类信息 取消
      this.$confirm('是否要放弃当前编辑的装备信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到列表页面
        this.dialogVisible = false
        // this.$router.push({ path: '/basicService/equipNorm/classify', query: { deptId: this.carryParam.deptId }})
      }).catch(() => {
        // 留在编辑页面
      })
    },
    submitEquipClassify(formName) { // 装备分类信息 确定
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = JSON.parse(JSON.stringify(this.equipClassifyInfo))
          // console.log(param)
          this.formLoading = true
          if (this.equipClassifyInfo.id) { // 编辑
            param.lastId = this.userInfo.id
            param.lastName = this.userInfo.userName
            this.$update('basicequipgroup/' + this.equipClassifyInfo.id, param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '装备信息保存成功', type: 'success'
                })
                // 停留2秒跳转到详情页面
                setTimeout(() => {
                  this.dialogVisible = false
                  this.queryClassify(true) // 刷新列表
                }, 2000)
              } else {
                this.$message({
                  message: '装备信息保存失败，请联系管理员！', type: 'error'
                })
              }
            }).catch(() => {
              this.$message({
                message: '装备信息保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          } else { // 添加
            param.groupStatus = 1 // 状态
            param.creationId = this.userInfo.id
            param.creationName = this.userInfo.userName
            this.$save('basicequipgroup', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '装备信息保存成功', type: 'success'
                })
                // 停留2秒
                setTimeout(() => {
                  this.dialogVisible = false
                  this.queryClassify(true) // 刷新列表
                }, 2000)
              } else {
                this.$message({
                  message: '装备信息保存失败，请联系管理员！', type: 'error'
                })
              }
            }).catch(() => {
              this.$message({
                message: '装备信息保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          }
        }
      })
    },
    handleEdit(index, row) { // 编辑
      this.dialogVisible = true
      this.equipClassifyInfo = JSON.parse(JSON.stringify(row))
    },
    handleEnable(index, row) { // 停用 启用
      var tipText = ''
      var param = {
        lastId: this.userInfo.id,
        lastName: this.userInfo.userName
      }
      if (row.groupStatus === 0) {
        param.groupStatus = '1' // 启用
        tipText = '启用'
      } else if (row.groupStatus === 1) {
        param.groupStatus = '0' // 停用
        tipText = '停用'
      }
      this.$confirm('确认' + tipText + '该装备分类吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$update('basicGroupStatus/' + row.id, param).then((response) => {
          this.formLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '装备分类' + tipText + '成功', type: 'success'
            })
            this.queryClassify(true) // 刷新列表
          } else {
            this.$message({
              message: '装备信息保存失败，请联系管理员！', type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '装备信息保存失败，请联系管理员！', type: 'error'
          })
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.queryClassify(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryClassify(true, true)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    closeDia() {
      this.resetForm('equipClassifyInfo')
      this.dialogVisible = false
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight
    // - document.querySelector('.el-form').offsetHeight - 180
    this.queryClassify(true)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.equipProject {
  width: 94%;
  margin: 10px auto 0;
}
</style>
