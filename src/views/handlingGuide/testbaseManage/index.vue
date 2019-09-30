<template>
  <div class="testbaseManage">
    <!-- 试题管理主页 -->
    <el-row v-loading="listLoading">
      <!-- 左侧树形结构 -->
      <el-col class="leftCont" :span="5" :style="{height:countHeight}">
          <tree-pub
            :tree="dataList"
            :isShowBtn="true"
            :isShowRootNode="false"
            :viewBtnAdd='this.isViewBtnAdd'
            :viewBtnEdit='this.isViewBtnEdit'
            :viewBtnDelete='this.isViewBtnDelete'
            @handleOperation="handleOperation"
            @getNode="getNode"
          >
          </tree-pub>
      </el-col>

      <!-- 右侧列表区 -->
      <el-col :span="18" class="rightCont" :style="{height:countHeight}">
        <table-list :menuItemNode="menuItemNode" :dataList="dataList"></table-list>
      </el-col>
    </el-row>

     <!--添加/编辑模块弹出层-->
    <el-dialog :title="title" :visible.sync="isShowdialog" @close="cancel">
        <el-form :model="addForm" :rules="rules" ref="moduleForm"  class="from"   label-width="100px">
        <el-form-item label="父级模块" prop="">
          <span class="inpW" style="display: inline-block;">{{parentName}}</span>
        </el-form-item>
        <el-form-item label="模块名称" prop="categoryName">
          <el-input v-model.trim="addForm.categoryName"  maxlength="50" placeholder="" clearable class="inpW"></el-input>
        </el-form-item>
        <el-form-item label="显示序列" prop="sort">
          <el-input-number v-model.trim="addForm.sort" :min="1" :max="100" label="显示序列"></el-input-number>
        </el-form-item>
      </el-form>
      <el-row class="tabC">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import TreePub from '@/components/TreePub'
import TableList from './tableList'
import { regEnCode, regCnCode } from '@/utils/validate'
export default {
  data() {
    return {
      addForm: {
        categoryName: '', // 模块名称
        parentId: '', // 父模块id
        sort: 1, // 排序
        deptCode: JSON.parse(sessionStorage.getItem('depToken'))[0].depCode, // 当前部门code
        deptName: JSON.parse(sessionStorage.getItem('depToken'))[0].depName, // 当前部门name
        creator: JSON.parse(sessionStorage.getItem('userInfo')).userName, // 创建人账号
        delAble: 0, // 是否可删除， 默认传0
        logFlag: 1 // 埋点参数
      },
      parentId: '', // 父模块id
      parentName: '', // 父模块名称
      countHeight: null, // 左侧模块容器的高度
      dataList: [], // 菜单tree数据
      treeItem: {}, // 存储当前被点击的tree节点的数据
      menuItemNode: {}, // 存储点击菜单节点时菜单数据
      listLoading: false, // 页面加载进度条
      isShowdialog: false, // 是否显示添加/编辑弹框
      btnLoading: false, // 保存按钮加载进度条
      title: '', // 添加/编辑弹出框标题名称
      dialogType: 0, // 弹框类型
      rules: {
        categoryName: [ // 模块名称
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入模块名称'))
              } else if (regEnCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else if (regCnCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  components: {
    TreePub,
    TableList
  },
  methods: {
    init() { // 查询左侧tree数据
      this.listLoading = true
      this.$query('examsubjectcategory', {}).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.dataList = response.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    detail() { // 编辑模块时，查询模块信息
      this.$query('subjectCategory/' + this.treeItem.id).then((response) => {
        if (response.data) {
          this.parentName = response.data.parentName
          this.parentId = response.data.parentId
          this.addForm.categoryName = response.data.categoryName
          this.addForm.sort = response.data.sort
        }
      })
    },
    handleOperation(val) { // 按钮点击事件，根据methods值，进行对应事件的逻辑处理
      if (val.methods === 'add') {
        this.add(val.data)
      } else if (val.methods === 'edit') {
        this.edit(val.data, val.node)
      } else if (val.methods === 'delete') {
        this.delete(val.data, val.node)
      }
    },
    add(data) { // 添加模块
      this.title = '添加模块'
      this.dialogType = 1
      this.isShowdialog = true
      this.treeItem = data
      this.parentName = this.treeItem.label
      this.addForm.parentId = this.treeItem.id
    },
    edit(data, node) { // 编辑模块
      // 重置表单
      this.title = '编辑模块'
      this.dialogType = 2
      this.isShowdialog = true
      this.treeItem = data
      this.parentName = this.treeItem.label
      this.detail()
    },
    delete(data, node) { // 删除模块
      this.$confirm('如果删除了试题模块，模块下已添加的模块和试题将也会被删除且无法找回，确认是否要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {
          id: data.id
        }
        if (data.leaf === 1) { // 包含子模块,则将模块下的所有子模块一起删除。
          var chidArry = []
          var idString = ''
          if (data.children && data.children.length > 0) {
            var children = data.children
            children.forEach(item => {
              chidArry.push(item.id)
            })
          }
          chidArry.push(data.id)
          idString = chidArry.join(',')
          param.id = idString
        } else {
          this.loading = true
          this.$remove('subjectCategory/delete', param).then((response) => {
            this.loading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.init() // 刷新页面
          }).catch(() => {
            this.loading = false
          })
        }
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getNode(data, node) { // 点击tree节点，获取id，查询对应的菜单详情
      if (data.id) {
        this.menuItemNode = data
      } else {
        this.menuItemNode = {}
      }
    },
    isViewBtnAdd(store, data, node) { // “添加”按钮显隐的权限控制
      // if (this.$isViewBtn('132')) {
      //   if (this.departId) {
      //     return this.checkParentId(node, this.departId)
      //   } else {
      //     return true
      //   }
      // }
      return true
    },
    isViewBtnEdit(store, data, node) { // “编辑”按钮显隐的权限控制
      // if (this.$isViewBtn('133')) {
      //   if (this.departId) {
      //     return this.checkParentId(node, this.departId)
      //   } else {
      //     return true
      //   }
      // }
      return true
    },
    isViewBtnDelete(store, data, node) { // “删除”按钮显隐的权限控制
      // if (this.$isViewBtn('134')) {
      //   if (this.departId === data.id) {
      //     return false
      //   } else if (this.departId) {
      //     return this.checkParentId(node, this.departId)
      //   } else {
      //     return true
      //   }
      // }
      return true
    },
    checkParentId(node, value) {
      if (node.data.parentId !== null && node.data.parentId !== undefined) {
        if (node.data.parentId === value || node.data.id === value) {
          return true
        } else if (node.parent) {
          return this.checkParentId(node.parent, value)
        } else {
          return false
        }
      } else {
        return false
      }
    },
    save() { // 保存添加的模块
      this.$refs.moduleForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.dialogType === 1) { // 添加
            this.$save('subjectCategory/save', this.addForm).then((response) => {
              this.btnLoading = false
              this.isShowdialog = false // 关闭弹框
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.init()
            }).catch(() => {
              this.btnLoading = false
            })
          } else { // 编辑
            const param = {
              id: this.treeItem.id, // 当前模块id
              categoryName: this.addForm.categoryName, // 模块名称
              sort: this.addForm.sort, // 排序
              parentId: this.parentId, // 父模块id
              delAble: 0,
              logFlag: 1 // 埋点参数
            }
            this.$update('subjectCategory/update', param).then((response) => {
              this.btnLoading = false
              this.isShowdialog = false // 关闭弹框
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.init()
            }).catch(() => {
              this.btnLoading = false
            })
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    cancel() { // 取消
      this.isShowdialog = false
      this.initData()
    },
    initData() { // 初始化弹框信息
      // this.addForm = {
      //   moduleName: '', // 模块名称
      //   sorted: 1 // 排序
      // }
      this.$nextTick(() => {
        this.$refs['moduleForm'].resetFields()
      })
      // 重置表单
      // this.resetForm('moduleForm')
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
    }
  },
  mounted() {
    this.countHeight = document.documentElement.clientHeight - 130 + 'px'
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.testbaseManage {
  .leftCont {
    margin-right: 10px;
    padding: 10px 0;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
  }
  .rightCont {
    width: 78%;
    overflow: hidden;
    border: 1px solid #00a0e9;
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
    padding: 20px;
  }
  .from {
    padding-left: 20px;
  }
}
.el-dialog {
  width: 40%;
}
.inpW {
  width: 90%;
}
</style>
