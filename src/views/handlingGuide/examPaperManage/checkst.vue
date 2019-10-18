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
          <span class="checkstEllipsis" slot-scope="{data}">
            <span :title="data.label">{{ data.label }}</span>
          </span>
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
        <el-table :data="listData" ref="multipleTable" v-loading="listLoading" style="width: 100%;"  @select="handleselectRow" @select-all="handleselectAll"   :max-height="tableHeight" >
          <el-table-column type="selection" label="选择" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="试题内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="scope.row.name"></span>
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
    alreadyCheck: { // 添加试卷页已经被选择的试题列表id
      type: Array
    },
    alreadyCheckList: { // 添加试卷页已经被选择的试题列表项
      type: Array
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
      txData: questionTypeAll('1'),
      tableHeight: null,
      dataList: [], // 菜单tree数据
      btnLoading: false, // 保存按钮加载进度条
      saveList: [], // 存储所有模块选中的列表项
      checkData: []
    }
  },
  components: {

  },
  watch: { // 监听state状态变化
    alreadyCheck: {
      handler: function(val, oldeval) {
        this.checkId = val
      }
    },
    alreadyCheckList: {
      handler: function(val, oldeval) {
        this.getSelected(val)
      }
    },
    isClear: {
      handler: function(val, oldeval) {
        if (val) {
          this.checkId = [] // 复选框选中的列表id清空
          this.saveList = [] // 复选框选中的列表项清空
          this.checkIdRow = []
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
        } else {
          this.initData()
        }
      }).catch(() => {
        this.listLoading = false
        this.initData()
      })
    },
    questionTypeChange(val) {
      if (this.menuItemNode.id) {
        this.initData()
        this.query(true, true)
      }
    },
    handleNodeClick(data) { // 点击tree节点，获取id，查询对应的菜单详情
      if (data.id) {
        this.menuItemNode = data
        this.initData()
        this.query(true, true)
      } else {
        this.menuItemNode = {}
      }
    },
    getSelected(datas) {
      var saveList = []
      if (datas.length > 0) {
        saveList = this.processingData(datas)
      }
      this.saveList = saveList
      // console.info('this.saveList-----', JSON.stringify(this.saveList))
    },

    // 过滤重复的数据
    FilterProcessingData(data, Name, subjectCategoryId) {
      var dest = []
      for (var i = 0; i < data.length; i++) {
        var ai = data[i]
        if (i === 0) {
          dest.push(ai)
        } else {
          var filterData = dest.filter(function(e) {
            if (e[Name] === ai[Name] && e[subjectCategoryId] === ai[subjectCategoryId]) {
              for (var i = 0; i < ai.data.length; i++) {
                e.data.push(ai.data[i])
              }
              return true
            } else {
              return false
            }
          })
          if (filterData.length === 0) {
            dest.push(ai)
          }
        }
      }
      return dest
    },

    // 将添加页/编辑页 传递过来的数据根据试题类型type和subjectCategoryId进行归类拆分
    processingData(dataS) {
      var stt = []
      var stt1 = []
      for (var i = 0; i < dataS.length; i++) {
        for (var j = 0; j < dataS[i].data.length; j++) {
          dataS[i].data[j].type = dataS[i].type
          stt.push(dataS[i].data[j])
        }
      }
      for (var m = 0; m < stt.length; m++) {
        for (var n = 0; n < dataS.length; n++) {
          if (dataS[n].type === stt[m].type) {
            var s = dataS[n]
            s.subjectCategoryId = stt[m].subjectCategoryId
            s.data = []
            delete stt[m].type
            s.data.push(stt[m])
            stt1.push(JSON.parse(JSON.stringify(s)))
          }
        }
      }
      stt1 = this.FilterProcessingData(stt1, 'type', 'subjectCategoryId')
      return stt1
    },

    getSelect(type, datas, id) {
      this.checkData = datas
      if (this.checkData.length > 0) {
        this.checkData.forEach((item, i) => {
          item.subjectCategoryId = this.menuItemNode.id // 当前的模块id
          item.subjectCategoryName = this.menuItemNode.label // 当前的模块名称
          item.questionsId = item.id // 被选中的试题id
        })
      }
      var item = { type: type, sort: Number(type), num: 0, value: 1, desc: '', subjectCategoryId: id, data: this.checkData }
      this.getshitiList(item)
    },
    getshitiList(element) {
      var bo = false
      var _this = this
      for (var i = 0; i < _this.saveList.length; i++) {
        if (element.type === _this.saveList[i].type) {
          if (element.subjectCategoryId === _this.saveList[i].subjectCategoryId) {
            bo = true
            _this.saveList[i].data = _this.saveList[i].data.concat(element.data)
          }
        }
      }
      // 如果不存在就直接塞到array中
      if (!bo) {
        _this.saveList.push(element)
      }
      // console.log('getshitiList', JSON.stringify(_this.saveList))
    },
    cancel() { // 取消
      this.checkId = [] // 复选框选中的列表id清空
      this.saveList = []
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
      this.checkIdRow = []
      if (selection.length > 0) {
        selection.forEach((item, index) => {
          this.checkIdRow.push(item.id)
        })
      }

      if (this.checkId.length === 0 && selection.length > 0) {
        this.checkId.push(row.id)
      } else {
        var checkId_ = this.checkId
        checkId_.forEach((id) => {
          if (row.id === id) {
            this.removeByValue(this.checkId, row.id)
          } else {
            if (!this.temp(row.id)) {
              this.checkId.push(row.id)
            }
          }
        })
      }
      this.getSelect(this.type, selection, this.menuItemNode.id)
    },
    removeByValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
        }
      }
    },

    temp(id) {
      if (this.checkId.indexOf(id) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 全选函数  点击全选遍历当页数据若无添加,若是反选则删除(判断是否是全选还是反选)
    handleselectAll(selection) {
      var allSelect = selection
      if (selection.length > 0) {
        var checkId_1 = this.checkId
        allSelect.forEach((item, index) => {
          checkId_1.forEach((it, i) => {
            if (it !== item) {
              if (!this.temp(item.id)) {
                this.checkId.push(item.id)
              }
            }
          })
        })
        if (this.checkId.length === 0) {
          allSelect.forEach((item, i) => {
            this.checkId.push(item.id)
          })
        }
      } else {
        this.listData.forEach((item) => {
          this.checkId.forEach((it) => {
            if (item.id === it) {
              this.removeByValue(this.checkId, item.id)
            }
          })
        })
      }
      this.getSelect(this.type, selection, this.menuItemNode.id)
    },
    // 记忆函数
    memoryChecked() {
      // console.log('jiyi', JSON.stringify(this.checkId))
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
    // 保存时数据根据type类型进行分类合并
    filterByName(data, Name) {
      var dest = []
      for (var i = 0; i < data.length; i++) {
        var ai = data[i]
        if (i === 0) {
          dest.push(ai)
        } else {
          var filterData = dest.filter(function(e) {
            if (e[Name] === ai[Name]) {
              for (var i = 0; i < ai.data.length; i++) {
                e.data.push(ai.data[i])
              }
              return true
            } else {
              return false
            }
          })
          if (filterData.length === 0) {
            dest.push(ai)
          }
        }
      }
      return dest
    },
    save() { // 保存添加的模块
      if (this.listData.length > 0) {
        var dataList = []
        // console.log('保存时saveList', JSON.stringify(this.saveList))
        this.saveList.forEach((item, index) => {
          if (item.data.length > 0) {
            dataList.push(item)
          }
        })

        dataList.forEach((item, index) => {
          delete item.subjectCategoryId
        })
        dataList = this.filterByName(dataList, 'type')
        dataList.forEach((item, index) => {
          var datas = this.unique(item.data)
          var newData = []
          datas.forEach((it, i) => {
            if (this.checkId.indexOf(it.id) > -1) {
              newData.push(it)
            }
          })
          item.data = newData
        })
        // console.log('保存时this.checkId', JSON.stringify(this.checkId))
        // console.log('保存时总共选择的列表处理后', JSON.stringify(dataList))
        this.$emit('checkList', dataList)
        this.$emit('closergDialog', false)
      } else {
        this.$message({
          type: 'error',
          message: '当前无可选择的试题'
        })
      }
    },
    unique(arr) { // 数组列表去重
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
    initData() {
      this.listData = []
      this.total = 0
      this.page = 1
      this.pageSize = 15
    }
  },
  mounted() {
    this.checkId = this.alreadyCheck
    this.getSelected(this.alreadyCheckList)
    this.tableHeight = document.querySelector('.rightCont').offsetHeight - 180
    this.init()
  }
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
  .checkstEllipsis{
    max-width: 245px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left:10px;
    color: #fff;
  }
}
</style>
