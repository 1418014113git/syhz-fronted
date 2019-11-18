<template>
<!-- 案件类别与罪名 -->
  <section>
    <!--列表-->
    <el-form :inline="true">
      <el-form-item label="类型" prop="">
        <el-select  v-model="category" size="small" placeholder="请选择">
          <el-option v-for="item in categoryList" :key="item.category" :label="item.categoryName" :value="item.category"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案件类别编号" prop="">
        <el-input v-model="caseCode" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="案件类别名称" prop="">
        <el-input v-model="caseName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="罪名编号" prop="">
        <el-input v-model="chargesCode" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="罪名名称" prop="">
        <el-input v-model="chargesName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryCase()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="reset()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="addCase()" >添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;margin-top: 15px;" >
      <el-table-column  type="index" label="序号" width="70">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="category" width="150" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.category===1">食品</span>
          <span v-if="scope.row.category===2">药品</span>
          <span v-if="scope.row.category===3">环境</span>
        </template>
      </el-table-column>
      <el-table-column  prop="caseCode" width="200" label="案件类别编号" >
        <template slot-scope="scope">
          <span>{{scope.row.caseCode}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="caseName" label="案件类别名称">
        <template slot-scope="scope">
          <span>{{scope.row.caseName}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="chargesCode" width="200" label="罪名编号">
        <template slot-scope="scope">
          <span>{{scope.row.chargesCode}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="chargesName"  label="罪名名称">
        <template slot-scope="scope">
          <span>{{scope.row.chargesName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" title="编辑"  type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete"  circle  @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
          :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    
    <!-- 添加案件类别与罪名 -->
    <el-dialog title="案件类别与罪名" :visible.sync="dialogVisible" size="small" @close="closeDia('equipClassifyInfo')" class="comDialog" :close-on-click-modal="false">
      <el-form ref="equipClassifyInfo" size="small" :rules="rules" :model="equipClassifyInfo" label-width="120px" class="equipClassify" v-loading="formLoading">
        <el-row>
          <el-form-item label="类型" prop="category">
            <el-select  v-model="equipClassifyInfo.category" clearable size="small" placeholder="请选择">
              <el-option v-for="item in categoryList" :key="item.category" :label="item.categoryName" :value="item.category"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="案件类别编号" prop="caseCode">
            <el-input v-model="equipClassifyInfo.caseCode" placeholder="请输入内容" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="案件类别名称" prop="caseName">
            <el-input v-model="equipClassifyInfo.caseName" placeholder="请输入内容" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="罪名编号" prop="chargesCode">
            <el-input v-model="equipClassifyInfo.chargesCode" placeholder="请输入内容" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="罪名名称" prop="chargesName">
            <el-input v-model="equipClassifyInfo.chargesName" placeholder="请输入内容" maxlength="50"></el-input>
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
  name: 'caseType',

  data() {
    return {
      categoryName: '', // 类型
      category: '', // 类型编号
      caseCode: '', // 案件类别编号
      caseName: '', // 案件类别名称
      chargesCode: '', // 罪名编号
      chargesName: '', // 罪名名称
      dialogVisible: false, // 添加弹框
      equipClassifyInfo: {}, // 案件类别与罪名信息
      formLoading: false, // 弹框的loading
      total: 0,
      page: 1,
      pageSize: 15,
      categoryList: [{
        categoryName: '食品',
        category: '1'
      }, {
        categoryName: '药品',
        category: '2'
      }, {
        categoryName: '环境',
        category: '3'
      }],
      tableData: [],
      listLoading: false,
      rules: {
        category: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        caseCode: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入案件类别编号'))
            } else {
              callback()
            }
          }
        },
        caseName: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入案件类别名称'))
            } else if (!(regCn.test(value))) {
              callback(new Error('请输入汉字'))
            } else {
              callback()
            }
          }
        },
        chargesCode: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入罪名编号'))
            } else {
              callback()
            }
          }
        },
        chargesName: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入罪名名称'))
            } else if (!(regCn.test(value))) {
              callback(new Error('请输入汉字'))
            } else {
              callback()
            }
          }
        }
      }
    }
  },
  created() {
    this.queryCase()
  },
  methods: {
    // 案件类别与罪名列表
    queryCase() {
      const param = {
        category: this.category, // 类型编号
        caseCode: this.caseCode, // 案件类别编号
        caseName: this.caseName, // 案件类别名称
        chargesCode: this.chargesCode, // 罪名编号
        chargesName: this.chargesName, // 罪名名称
        pageNum: this.page, // 页数
        pageSize: this.pageSize // 条数
      }
      this.$query('page/SYSCASECHARGES', param).then((response) => {
        if (response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.tableData = response.data.list
        } else {
          this.tableData = []
        }
      })
    },
    // 添加案件类别与罪名
    addCase() {
      this.dialogVisible = true
      this.equipClassifyInfo = {} // 清空
    },
    handleEdit(index, row) { // 编辑
      this.equipClassifyInfo = JSON.parse(JSON.stringify(row))

      if (this.equipClassifyInfo.category) {
        this.equipClassifyInfo.category = this.equipClassifyInfo.category + ''
      }

      this.dialogVisible = true
    },
    handleDelete(index, row) { // 删除
      this.$confirm('是否删除该案件类别与罪名！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$remove('SYSCASECHARGES/' + row.id).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.queryCase(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    closeDia() {
      this.resetForm('equipClassifyInfo')
      this.dialogVisible = false
    },
    submitEquipClassify(formName) { // 案件类别与罪名信息 确定
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = JSON.parse(JSON.stringify(this.equipClassifyInfo))
          param.category = this.equipClassifyInfo.category // 类型编号
          param.caseCode = this.equipClassifyInfo.caseCode // 案件类别编号
          param.caseName = this.equipClassifyInfo.caseName // 案件类别名称
          param.chargesCode = this.equipClassifyInfo.chargesCode // 罪名编号
          param.chargesName = this.equipClassifyInfo.chargesName // 罪名名称
          this.formLoading = true
          if (this.equipClassifyInfo.id) { // 编辑
            this.$update('SYSCASECHARGES/' + this.equipClassifyInfo.id, param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '案件类别与罪名保存成功', type: 'success'
                })
                // 停留2秒跳转到列表页面
                setTimeout(() => {
                  this.dialogVisible = false
                  this.queryCase(true) // 刷新列表
                }, 2000)
              } else {
                this.$message({
                  message: '案件类别与罪名保存失败，请联系管理员！', type: 'error'
                })
              }
            }).catch(() => {
              this.$message({
                message: '案件类别与罪名保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          } else { // 添加
            this.$save('SYSCASECHARGES', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '案件类别与罪名保存成功', type: 'success'
                })
                // 停留2秒
                setTimeout(() => {
                  this.dialogVisible = false
                  this.queryCase(true) // 刷新列表
                }, 2000)
              } else {
                this.$message({
                  message: '案件类别与罪名保存失败，请联系管理员！', type: 'error'
                })
              }
            }).catch(() => {
              this.$message({
                message: '案件类别与罪名保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          }
        }
      })
    },
    cancelEquipClassify() { // 取消
      this.$confirm('是否要放弃当前编辑的信息', '提示', {
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
    reset() { // 重置
      this.category = '' // 类型编号
      this.caseCode = '' // 案件类别编号
      this.caseName = '' // 案件类别名称
      this.chargesCode = '' // 罪名编号
      this.chargesName = '' // 罪名名称
      this.queryCase()
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.queryCase()
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.queryCase()
    }

  },
  mounted() {
  }
}
</script>
<style>

</style>
