<template>
  <span class='custom-tree-node'>
    <span class='treeLeftCont span-ellipsis'>
      <span class="" :title="DATA.label">{{DATA.label}}</span>
    </span>
    <span class='treeBtn' v-if='ISSHOWBTN'>
      <!--带有按钮权限控制方法的-->
      <el-button  title="添加" class='el-icon-plus' v-if="controlBtnAdd(STORE,DATA,NODE)"  type='success' circle  @click.stop="nodeAdd(STORE,DATA,NODE)"></el-button>
      <el-button  title="编辑" v-if="DATA.deleteable!=='1' && controlBtnEdit(STORE,DATA,NODE)"  class='el-icon-edit-outline' type='warning' circle  @click.stop="nodeEdit(STORE,DATA,NODE)"></el-button>
      <el-button  title="删除" v-if="DATA.deleteable!=='1' && DATA.hasPaper ===0 && controlBtnDelete(STORE,DATA,NODE)"  class='el-icon-delete' type='danger' circle  @click.stop="nodeDel(STORE,DATA,NODE)"></el-button>
    </span>
  </span>
</template>

<script>
export default{
  props: {
    NODE: {
      type: Object,
      required: true
    },
    DATA: {
      type: Object,
      required: true
    },
    STORE: {
      type: Object,
      required: true
    },
    ISSHOWBTN: { // 是否显示所有按钮
      type: Boolean,
      default: false
    },
    ISVIEWBTNADD: { // 添加按钮的权限控制
      type: Function,
      required: true
    },
    ISVIEWBTNEDIT: { // 编辑按钮的权限控制
      type: Function,
      required: true
    },
    ISVIEWBTNDELETE: { // 删除按钮的权限控制
      type: Function,
      required: true
    }
  },
  methods: {
    nodeAdd(s, d, n) { // 新增
      this.$emit('nodeAdd', s, d, n)
    },
    nodeEdit(s, d, n) { // 编辑
      this.$emit('nodeEdit', s, d, n)
    },
    nodeDel(s, d, n) { // 删除
      this.$emit('nodeDel', s, d, n)
    },
    controlBtnAdd(s, d, n) { // 添加按钮的权限控制
      return this.ISVIEWBTNADD(s, d, n)
    },
    controlBtnEdit(s, d, n) { // 编辑按钮的权限控制
      return this.ISVIEWBTNEDIT(s, d, n)
    },
    controlBtnDelete(s, d, n) { // 删除按钮的权限控制
      return this.ISVIEWBTNDELETE(s, d, n)
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
  .el-button+.el-button{
    margin-left: 5px;
  }
  .span-ellipsis{
    max-width: 245px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left:10px;
    color: #fff;
  }
  .el-button--mini, .el-button--small {
    font-size: 12px;
  }
}
.custom-tree-container .el-button + .el-button {
  margin-left: 0px !important;
}
@media screen and (min-width:1368px) and (max-width:1600px){
	.span-ellipsis{
    max-width: 182px !important;
  }
}
@media only screen and (max-width: 1367px) {
  .span-ellipsis{
    max-width: 130px !important;
  }
}
</style>

