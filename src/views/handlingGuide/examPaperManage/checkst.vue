<template>
  <div class="checkst" v-loading="pageloading">
    <!-- 人工组卷--选择试题 -->
    <el-row>
      <!-- 左侧树形结构 -->
      <el-col class="leftCont" :span="5">
        <el-tree
          :data="dataList"
          node-key="id"
          :expand-on-click-node="false"
          :default-expanded-keys="[2, 1]"
          @node-click="handleNodeClick"
          >
        </el-tree>
      </el-col>

      <!-- 右侧列表区 -->
      <el-col :span="18" class="rightCont">
        <el-form :inline="true"  ref="filters" label-width="84px" style="text-align: left;">
          <el-form-item label="试题类型">
            <el-select v-model="type" placeholder="请选择题型" @change="questionTypeChange">
              <el-option v-for="item in txData" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="listData" ref="multipleTable" v-loading="listLoading" style="width: 100%;" @select="handleselectRow" @select-all="handleselectAll"  :max-height="tableHeight" >
          <el-table-column type="selection" label="选择" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="70" class-name="tabC"></el-table-column>
          <el-table-column prop="name" label="试题内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="scope.row.name" class="richTextWrap"></span>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar clearfix">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                        :current-page="page" :total="total" style="float:right;">
          </el-pagination>
        </el-col>
        <div class="tabC btnUpLine bottomBtn">
          <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">确 定</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'
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
    isClear: { // 选择试题弹框是否被关闭
      type: Boolean,
      default: false
    },
    alreadyCheck: { // 添加试卷页已经被选择的试题
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pageloading: false, // 页面加载进度条
      listLoading: false, // 列表加载进度条
      total: 0,
      page: 1,
      pageSize: 15,
      menuItemNode: {}, // 存储当前被点击的tree节点数据
      listData: [], // 列表数据
      type: '1', // 筛选条件
      checkId: [], // 复选框选中的列表id
      checkIdRow: [], // 存储当前行被点击选中的项
      checkList: [], // 复选框选中的列表项
      txData: questionTypeAll('1'),
      tableHeight: null,
      dataList: [], // 菜单tree数据
      btnLoading: false // 保存按钮加载进度条
    }
  },
  components: {

  },
  watch: { // 监听state状态变化
    alreadyCheck: {
      handler: function(val, oldeval) {
        this.checkId = val
        this.memoryChecked()
      }
    },
    isClear: {
      handler: function(val, oldeval) {
        if (val) {
          this.checkId = [] // 复选框选中的列表id清空
          this.checkList = [] // 复选框选中的列表项清空
        }
      }
    }
  },
  methods: {
    init() { // 查询左侧tree数据
      this.pageloading = true
      this.$query('examsubjectcategory', {}).then((response) => {
        this.pageloading = false
        if (response.data && response.data.length > 0) {
          this.changeData(response.data)
        } else {
          this.noData = true
        }
      }).catch(() => {
        this.pageloading = false
      })
    },
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        type: this.type,
        subjectCategoryId: this.menuItemNode.id,
        logFlag: 1 // 添加埋点参数
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('paper/questionList', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.listData = response.data.list
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData.forEach(element => {
            if (element.name.indexOf('[]') > 0) { // 填空题的[] 展示的时候替换为下横线
              element.name = element.name.replace(/\[/g, '__').replace(/\]/g, '__')
            }
          })
          this.$nextTick(function() {
            this.memoryChecked()
          })
        }
      }).catch(() => {
        this.listLoading = false
        this.listData = []
      })
    },
    questionTypeChange(val) {
      this.listData = []
      this.total = 0
      this.page = 1
      this.pageSize = 15
      if (this.menuItemNode.id) {
        this.query(true, true)
      }
    },
    handleNodeClick(data) { // 点击tree节点，获取id，查询对应的菜单详情
      if (data.id) {
        this.menuItemNode = data
        this.listData = []
        this.query(true, true)
      } else {
        this.menuItemNode = {}
      }
    },

    cancel() { // 取消
      this.checkId = [] // 复选框选中的列表id清空
      this.checkList = []
      this.$emit('closergDialog', false)
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
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true, true)
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      if (this.checkIdRow[row.id]) {
        delete this.checkIdRow[row.id]
      } else {
        this.checkIdRow[row.id] = row.id
      }
      this.checkId = this.checkIdRow
    },
    // 全选函数  点击全选遍历当页数据若无添加,若是反选则删除(判断是否是全选还是反选)
    handleselectAll(selection) {
      this.listData.forEach((item, index) => {
        if (this.checkId.hasOwnProperty(item.id)) {
          selection.length ? null : delete this.checkId[item.id]
        } else {
          this.checkId[item.id] = item.id
        }
      })
    },
    // 记忆函数
    memoryChecked() {
      if (this.listData.length > 0) {
        this.listData.forEach((item, index) => {
          if (this.checkId.indexOf(item.id) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      }
    },
    save() { // 保存添加的模块
      var checkData = this.$refs.multipleTable.selection // 当前被选中的列表项
      if (this.listData.length > 0) {
        if (checkData.length > 0) {
          checkData.forEach((item, index) => {
            item.subjectCategoryId = this.menuItemNode.id // 当前的模块id
            item.subjectCategoryName = this.menuItemNode.label // 当前的模块名称
            item.questionsId = item.id // 被选中的试题id
          })
          var dataList = { type: this.type, sort: Number(this.type), num: 0, value: 1, desc: '', data: checkData }
          this.$emit('checkList', dataList)
          this.$emit('stType', this.type)
          this.$emit('closergDialog', false)
        } else {
          this.$message({
            type: 'error',
            message: '请至少选择一条试题'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '当前无可选择的试题'
        })
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
    }
  },
  mounted() {
    this.tableHeight = document.querySelector('.rightCont').offsetHeight - 180
    this.init()
  }
  // activated() {
  //   this.init()
  // }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.checkst {
  .leftCont {
    height: 70vh;
    margin-right: 10px;
    padding: 10px 0;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
  }
  .rightCont {
    width: 78%;
    height: 70vh;
    overflow: hidden;
    border: 1px solid #00a0e9;
    background: rgba(0, 89, 130, 0.7);
    border-radius: 8px;
    padding: 20px;
    position: relative;
  }
  .from {
    padding-left: 20px;
  }
  .bottomBtn{
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
  .el-tree__empty-block {
    min-height: 60vh;
  }
}
</style>
