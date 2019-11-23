<template>
<el-col>
  <div class="custom-tree-container">
  <div class="block">
    <el-tree
      ref="tree"
      :data="datas"
      node-key="id"
      check-strictly
      default-expand-all
      :expand-on-click-node="false"
      :show-checkbox="showCheckbox"
      @node-click="getCheckedKeys"
      :default-expanded-keys="[0]"
      :render-content="renderContent">
    </el-tree>
  </div>
 </div>
</el-col>
</template>

<script>
import treeRender from './treeRender'
export default {
  props: {
    parentId: {
      type: Number,
      required: false,
      default: function() {
        return -1
      }
    },
    parentColName: {
      type: String,
      required: false,
      default: function() {
        return 'parentId'
      }
    },
    tree: {
      type: Array,
      required: false
    },
    showCheckbox: { // 是否显示复选框
      type: Boolean,
      default: false
    },
    isShowRootNode: { // 是否显示根节点
      type: Boolean,
      default: false
    },
    appName: {
      type: String,
      default: '根节点'
    },
    isShowBtn: { // 是否显示所有按钮
      type: Boolean,
      default: false
    },
    viewBtnAdd: { // 添加按钮的权限控制
      type: Function,
      default: (event) => {
        this.default.methods.defaultWays()
      }
    },
    viewBtnEdit: { // 编辑按钮的权限控制
      type: Function,
      default: (event) => {
        this.default.methods.defaultWays()
      }
    },
    viewBtnDelete: { // 删除按钮的权限控制
      type: Function,
      default: (event) => {
        this.default.methods.defaultWays()
      }
    }
  },
  data() {
    return {
      id: 99,
      datas: []
    }
  },
  watch: { // 监听state状态变化
    appName: {
      handler: function(val, oldeval) {
      }
    },
    tree: {
      handler: function(val, oldEval) {
        this.setData()
      }
    }
  },
  mounted() {
  },
  methods: {
    handleAdd(s, d, n) {
      this.$emit('handleOperation', { 'methods': 'add', 'data': d, 'node': n })
    },
    handleEdit(s, d, n) {
      this.$emit('handleOperation', { 'methods': 'edit', 'data': d, 'node': n })
    },

    handleDelete(s, d, n) {
      this.$emit('handleOperation', { 'methods': 'delete', 'data': d, 'node': n })
    },
    renderContent(h, { node, data, store }) {
      return h(treeRender, {
        props: {
          DATA: data, // 节点数据
          NODE: node, // 节点内容
          STORE: store, // 完整树形内容
          ISSHOWBTN: this.isShowBtn, // 是否显示所有按钮
          ISVIEWBTNADD: this.viewBtnAdd, // 添加按钮的权限控制
          ISVIEWBTNEDIT: this.viewBtnEdit, // 编辑按钮的权限控制
          ISVIEWBTNDELETE: this.viewBtnDelete // 删除按钮的权限控制
        },
        on: {// 绑定方法
          nodeAdd: (s, d, n) => this.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => this.handleEdit(s, d, n),
          nodeDel: (s, d, n) => this.handleDelete(s, d, n)
        }
      })
    },
    getCheckedKeys(data, node) { // 获取节点数据
      this.$emit('getNode', data, node)
    },
    defaultWays() {
      return false
    },
    setData() {
      this.datas = this.tree
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.custom-tree-container{
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .el-button--small.is-circle {
      padding: 2px;
    }
    .treeBtn{
      margin-left: 8px;
    }
  }
  .treeLeftCont {
    color: #dfb408;
  }
}
.el-tree-node>.el-tree-node__children{
  overflow: visible;
}
</style>

