<template>
  <div class="testbaseManage">
    <el-row v-loading="listLoading">
      <!-- 左侧树形结构 -->
      <el-col class="leftCont" :span="5" :style="{maxHeight:countHeight}">
          <tree-pub style="height: 380px; overflow-y: auto;"
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
      <el-col :span="18" class="rightCont">
        <table-list :menuItemNode="menuItemNode"></table-list>
      </el-col>
    </el-row>

     <!--添加/编辑模块弹出层-->
    <el-dialog :title="title" :visible.sync="isShowdialog">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="父级模块：" prop="">
          <el-input  :value="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="模块名称：" prop="moduleName">
          <el-input v-model.trim="addForm.moduleName"  maxlength="64" placeholder="请输入机构全称" clearable></el-input>
        </el-form-item>
        <el-form-item label="显示序列：">
          <el-input-number v-model.trim="addForm.sorted" :min="1" :max="100" label="显示序列"></el-input-number>
        </el-form-item>
      </el-form>
      <el-row style="padding-left: 130px;">
        <el-button  @click="cancel">取 消</el-button>
        <el-button  type="primary" @click="save" :loading="btnLoading">保 存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import TreePub from '@/components/TreePub'
import TableList from './tableList'
export default {
  data() {
    return {
      addForm: {
        moduleName: '', // 模块名称
        sorted: 1 // 排序
      },
      parentName: '', // 父级模块
      countHeight: document.documentElement.clientHeight - 150 + 'px',
      dataList: [], // 菜单tree数据
      treeItem: {}, // 存储当前被点击的tree节点的数据
      menuItemNode: {}, // 存储点击菜单节点时菜单数据
      listLoading: false, // 页面加载进度条
      isShowdialog: false, // 是否显示添加/编辑弹框
      btnLoading: false, // 保存按钮加载进度条
      title: '', // 添加/编辑弹出框标题名称
      rules: {
        moduleName: [ // 模块名称
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
              if (value === '' || value === undefined || value === null) {
                callback(new Error('请输入模块名称'))
              } else if (!reg.test(value)) {
                callback(new Error('只能输入汉字、字母、数字'))
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
      // const params = {

      // }
      // this.listLoading = true
      // this.$query('examsubjectcategory', params).then((response) => {
      //   this.listLoading = false
      //   if (response.data && response.data.length > 0) {
      //     this.dataList = response.data
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
      this.dataList = [
        {
          'deleteable': '1',
          'id': 1,
          'label': '陕西公安厅',
          'sort': 1,
          'parentId': -1
        },
        {
          'deleteable': '1',
          'id': 2,
          'label': '环境',
          'sort': 1,
          'parentId': 1
        },
        {
          'deleteable': '1',
          'id': 3,
          'label': '食品',
          'sort': 2,
          'parentId': 1
        },
        {
          'deleteable': '1',
          'id': 4,
          'label': '药品',
          'sort': 3,
          'parentId': 1
        },
        {
          'deleteable': '1',
          'id': 5,
          'label': '综合',
          'sort': 4,
          'parentId': 1
        },
        {
          'deleteable': '0',
          'id': 6,
          'label': '环境分类二 陕西公安厅陕西公安厅陕西公安厅陕西公安厅陕西公安厅陕西公安厅',
          'sort': 2,
          'parentId': 2
        },
        {
          'deleteable': '0',
          'id': 7,
          'label': '环境分类一',
          'sort': 1,
          'parentId': 2
        }
      ]
    },
    detail() { // 编辑模块时，查询模块信息
      this.$query('' + this.treeItem.id).then((response) => {
        if (response.data) {
          this.addForm.moduleName = response.data.moduleName
          this.addForm.sorted = response.data.sorted
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
      this.initData()
      this.isShowdialog = true
      this.treeItem = data
      this.parentName = this.treeItem.label
    },
    edit(data, node) { // 编辑模块
      this.title = '编辑模块'
      this.isShowdialog = true
      this.parentName = this.treeItem.label
      // this.detail()
    },
    delete(data, node) { // 删除模块
      console.log('删除', data)
      this.$confirm('如果删除了试题模块，模块下已添加的模块和试题将也会被删除且无法找回，确认是否要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (data.leaf === 1) { // 包含子模块
          this.$message({
            type: 'error',
            message: '该模块包含子模块，不允许删除'
          })
          return false
        } else {
          this.loading = true
          this.$remove('' + data.id).then((response) => {
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$save('', this.addForm).then((response) => {
            this.btnLoading = false
            // 关闭弹框
            this.isShowdialog = true
          }).catch(() => {
            this.btnLoading = false
          })
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
      this.addForm = {
        moduleName: '', // 模块名称
        sorted: 1 // 排序
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testbaseManage{
  .leftCont {
    margin-right: 10px;
    padding: 10px 0;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
  }
  .rightCont{
    width: 78%;
    overflow: hidden;
  }
}
</style>
