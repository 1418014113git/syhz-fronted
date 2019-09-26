<template>
  <div class="checkMoudle">
    <!-- 随机组卷--选择模块 -->
    <div class="treeStyle" v-loading="listLoading">
      <el-tree
        :data="dataList"
        node-key="id"
        show-checkbox
        :expand-on-click-node="false"
        :default-expanded-keys="[2, 1]"
        @check-change="handleCheckChange"
        >
        <span class="span-ellipsis" slot-scope="{data}">
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
        if (val.length > 0) {
          var data = []
          val.forEach(item => {
            data.push(item.id)
          })
        }
        this.checkId = data
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
      this.listLoading = true
      this.$query('examsubjectcategory', {}).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.changeData(response.data)
        } else {
          this.noData = true
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
    save() { // 保存添加的模块
      var data = []
      this.checkList.forEach((item, index) => {
        if (item.leaf) {
          data.push(item.children)
        } else {
          data.push(item)
        }
      })
      this.$emit('sjcheckList', data)

      // var data = []
      // if (this.listData.length > 0) {
      //   if (this.checkId.length > 0) {
      //     this.listData.forEach((item, index) => {
      //       if (this.checkId.indexOf(item.id) > 0) {
      //         item.subjectCategoryId = this.menuItemNode.id // 当前的模块id
      //         item.subjectCategoryName = this.menuItemNode.label // 当前的模块名称
      //         item.questionsId = item.id // 被选中的试题id
      //         data.push(item)
      //       }
      //     })
      //     var datas = { 'type': this.type, 'sort': Number(this.type), 'data': data }
      //     this.$emit('checkList', datas)
      //     this.$emit('stType', this.type)
      //   } else {
      //     this.$emit('checkList', { 'type': this.type, 'sort': Number(this.type), 'data': [] })
      //     this.$emit('stType', this.type)
      //     this.$message({
      //       type: 'error',
      //       message: '请至少选择一条试题'
      //     })
      //   }
      // } else {
      //   this.$emit('checkList', { 'type': this.type, 'sort': Number(this.type), 'data': [] })
      //   this.$emit('stType', this.type)
      //   this.$message({
      //     type: 'error',
      //     message: '当前无可选择的试题'
      //   })
      // }
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
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
