<template>
  <div class="checkMoudle">
    <!-- 随机组卷--选择模块 -->
    <div class="treeStyle" v-loading="listLoading">
      <el-tree
        ref="tree"
        :data="dataList"
        node-key="id"
        show-checkbox
        :expand-on-click-node="false"
        :default-expanded-keys="[2, 1]"
        :default-checked-keys="checkId"
        @check-change="handleCheckChange"
        >
        <span class="MoudleEllipsis" slot-scope="{data}">
          <span :title="data.label">{{ data.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="tabC btnUpLine bottomBtn">
      <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
      <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">确 定</el-button>
    </div>
  </div>
</template>

<script>
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
    isClose: { // 选择试题模块弹框是否被关闭
      type: Boolean,
      default: false
    },
    alreadyCheck: { // 添加试卷模块tree上已经被选择的模块
      type: Array,
      required: false
    }
  },
  data() {
    return {
      listLoading: false, // 页面加载进度条
      listData: [], // 列表数据
      checkId: [], // 复选框选中的列表id
      checkList: [], // 复选框选中的列表项
      dataList: [], // 菜单tree数据
      btnLoading: false // 保存按钮加载进度条
    }
  },
  components: {

  },
  watch: { // 监听state状态变化
    alreadyCheck: {
      handler: function(val, oldeval) {
        this.checkId = this.unique(val)
        this.$refs.tree.setCheckedKeys(this.checkId)
      }
    },
    isClose: {
      handler: function(val, oldeval) {
        if (val) {
          this.checkId = [] // 复选框选中的列表id清空
          this.checkList = [] // 复选框选中的列表项清空
        }
      }
    }
  },
  methods: {
    init() { // 查询试题模块tree数据
      this.checkId = this.unique(this.alreadyCheck)
      this.listLoading = true
      this.$query('examsubjectcategory', {}).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.changeData(response.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNodeClick(data) { // 点击tree节点，获取id，查询对应的菜单详情
      if (data.id) {
        this.menuItemNode = data
        this.query(true, true)
      } else {
        this.menuItemNode = {}
      }
    },
    unique(arr) { // 数组去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) { // 第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    cancel() { // 取消
      this.checkId = [] // 复选框选中的列表id清空
      this.checkList = []
      this.$emit('closesjDialog', false)
    },
    changeData(data) { // tree数据结构改造
      if (data.length > 0) {
        const _this = this
        const newMenuData = []
        data.forEach(item => {
          if (item[_this.parentColName] === _this.parentId) {
            newMenuData.push(_this.buildChildren(_this, item, data))
          }
        })
        var datas = newMenuData[0].children
        datas.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => a.sort - b.sort) // 升序
            if (item.children.children && item.children.children.length > 0) {
              item.children.children.sort((c, d) => c.sort - d.sort) // 升序
            }
          }
        })
        this.dataList = datas
      } else {
        this.dataList = []
      }
      this.$refs.tree.setCheckedKeys(this.checkId)
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
    handleCheckChange(data, checked, indeterminate) { // 节点选中状态发生变化时的回调
      if (checked) {
        this.checkList.push(data)
      } else {
        let i = -1
        this.checkList.forEach((item, index) => {
          if (item.id === data.id) {
            i = index
          }
        })
        if (i > -1) {
          this.checkList.splice(i, 1)
        }
      }
    },
    uniqueList(arr) { // list去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) { // 第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    save() { // 保存添加的模块
      if (this.dataList.length > 0) {
        this.checkList = this.$refs.tree.getCheckedNodes() // 获取所有选中的节点
        if (this.checkList.length > 0) {
          var data = []
          this.checkList.forEach((item) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((it) => {
                if (it.children && it.children.length > 0) {
                  it.children.forEach((its) => {
                    data.push(its)
                  })
                } else {
                  data.push(it)
                }
              })
            } else {
              data.push(item)
            }
          })
          data = this.uniqueList(data)
          // console.log('sjcheckList', JSON.stringify(data))
          this.$emit('sjcheckList', data)
          this.$emit('closesjDialog', false)
        } else {
          this.$message({
            type: 'error',
            message: '请至少选择一个试题模块'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '当前无可选择的试题模块'
        })
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.checkMoudle {
  .treeStyle {
    padding: 10px;
    height: 45vh;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
  }
  .bottomBtn{
    width: 100%;
  }
  .el-tree__empty-block {
    min-height: 40vh;
  }

  .el-tree__empty-text {
    color: #fff;
  }
}
.MoudleEllipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
