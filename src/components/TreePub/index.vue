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
import Render from './Render'
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
        this.changeData()
      }
    },
    tree: {
      handler: function(val, oldeval) {
        this.changeData()
      }
    }
  },
  mounted() {
    this.changeData()
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
      return h(Render, {
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
    changeData() { // 数据结构改造
      if (this.tree.length > 0) {
        const _this = this
        const newMenuData = []
        _this.tree.forEach(item => {
          if (item[_this.parentColName] === _this.parentId) {
            newMenuData.push(_this.buildChildren(_this, item, _this.tree))
          }
        })
        newMenuData[0].label = '试题模块'
        var datas = newMenuData[0].children
        datas.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => a.sort - b.sort) // 升序
            if (item.children.children && item.children.children.length > 0) {
              item.children.children.sort((c, d) => c.sort - d.sort) // 升序
            }
          }
        })
        this.datas = newMenuData
      } else {
        this.datas = []
      }
    },
    buildChildren(_this, parent, data) {
      const newChildren = []
      data.forEach(item => {
        if (parent.id === item[_this.parentColName]) {
          newChildren.push(_this.buildChildren(_this, item, data))
        }
      })
      if (newChildren.length > 0) {
        parent.children = newChildren
        parent.leaf = 1
      }
      return parent
    },
    defaultWays() {
      return false
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

