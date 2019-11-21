<template>
  <section class="reportTemplate">
    <!-- 试题管理主页 -->
    <el-row v-loading="listLoading">
      <!-- 左侧树形结构 -->
      <el-col class="leftCont" :span="5" :style="{height:countHeight}">
        <tree
          :tree="dataList"
          :isShowBtn="true"
          :isShowRootNode="false"
          :viewBtnAdd='this.isViewBtnAdd'
          :viewBtnEdit='this.isViewBtnEdit'
          :viewBtnDelete='this.isViewBtnDelete'
          @handleOperation="handleOperation"
          @getNode="getNode"
        >
        </tree>
      </el-col>
      <!-- 右侧列表区 -->
      <el-col :span="18" class="rightCont" :style="{height:countHeight}">
        <el-form :model="addForm" ref="addForm" :rules="rules" :inline="true" v-loading="formLoading" :disabled="formDisable">
          <el-row>
            <el-col :span="10">
              <el-form-item prop="templateName" label="模板名称">
                <el-input v-model="addForm.templateName" maxlength="50" style="width: 300px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" style="position: relative; top: 5px;">
              <i><svg-icon icon-class="wenhao1"></svg-icon></i> 请为您自定义报表设定筛选条件和统计项目！
            </el-col>
            <el-col :span="5" style="text-align: right;">
              <el-form-item>
                <el-button @click="cancelEdit" class="cancelBtn">取 消</el-button>
                <el-button type="primary" @click="save" class="saveBtn" v-loading.fullscreen.lock="btnLoading">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-checkbox :indeterminate="isIndeterminate_search" v-model="isSearch" @change="searchChange">筛选条件</el-checkbox>
            <el-checkbox :indeterminate="isIndeterminate_show" v-model="isShow" @change="showChange">统计项目</el-checkbox>
            <el-checkbox :indeterminate="isIndeterminate_sort" v-model="isSort" @change="sortChange">排序</el-checkbox>
          </el-row>
          <el-table :data="addForm.columnSet">
            <el-table-column align="center" type="index" width="70px" label="序号"></el-table-column>
            <el-table-column align="center" prop="columnDescribe" width="250px" label="项目名称"></el-table-column>
            <el-table-column align="center" prop="isSearch" label="筛选条件" width="130px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isSearch" :disabled="scope.row.disabeld" @change="handleChangeSearch($event, scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="earch" label="条件顺序" width="180px">
              <template slot-scope="scope">
                <el-form-item :prop="'columnSet.' + scope.$index + '.search'" :rules='rules.search'>
                  <el-input :disabled="!scope.row.isSearch" v-model="scope.row.search" type="number"  min="1" max="99" style="width: 100px;"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="isShow" label="统计项目" width="130px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isShow" :disabled="scope.row.disabeld" @change="handleChangeShow($event, scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="show" label="项目顺序" width="180px">
              <template slot-scope="scope">
                <el-form-item :prop="'columnSet.' + scope.$index + '.show'" :rules='rules.show'>
                  <el-input :disabled="!scope.row.isShow" v-model="scope.row.show" type="number"  min="1" max="99" style="width: 100px;"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="isSort" label="排序" width="130px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isSort" @change="handleChange($event, scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序顺序" width="180px">
              <template slot-scope="scope">
                <el-form-item :prop="'columnSet.' + scope.$index + '.sort'" :rules='rules.sort'>
                  <el-input :disabled="!scope.row.isSort" v-model="scope.row.sort" type="number"  min="1" max="99" style="width: 100px;"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="sortType" label="排序类型">
              <template slot-scope="scope">
                <el-select :disabled="!scope.row.isSort" v-model="scope.row.sortType" placeholder="请选择" style="width: 100px;">
                  <el-option label="升序" :value="0"></el-option>
                  <el-option label="降序" :value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import tree from './components/tree'
  export default {
    components: {
      tree
    },
    data() {
      return {
        isIndeterminate_search: true,
        isIndeterminate_show: true,
        isIndeterminate_sort: false,
        isSearch: false,
        isShow: false,
        isSort: false,
        formDisable: false,
        addForm: {
          templateName: '',
          reportType: '',
          deptId: '',
          deptCode: '',
          deptName: '',
          creationId: '',
          creationName: '',
          delAble: 1,
          isDel: 0,
          isAdd: 0,
          columnSet: []
        },
        isSearchArr: [],
        isShowArr: [],
        isSortArr: [],
        countHeight: null, // 左侧模块容器的高度
        dataList: [], // 菜单tree数据
        treeItem: {}, // 存储当前被点击的tree节点的数据
        menuItemNode: {}, // 存储点击菜单节点时菜单数据
        listLoading: false, // 页面加载进度条
        formLoading: false,
        btnLoading: false, // 保存按钮加载进度条
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
        curUser: JSON.parse(sessionStorage.getItem('userInfo')),
        rules: {
          templateName: [ // 模板名称
            {
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入模板名称'))
                } else if (this.$regCode.test(value)) {
                  callback(new Error('请不要输入特殊字符'))
                } else {
                  return this.titleCheckAsyns(callback)
                }
              }
            }
          ],
          search: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              const arr = rule.field.split('.')
              const index = arr[1]
              const row = this.addForm.columnSet[index]
              if (row.isSearch) {
                if (value === undefined || value === null || value === '') {
                  return callback('请输入筛选顺序')
                }
                if (!/^[0-9]+$/.test(value)) {
                  return callback('筛选顺序只能输入整数')
                }
                if (value > this.isSearchArr.length) {
                  return callback('不能大于勾选筛选项目个数')
                }
                for (let i = 0; i < this.addForm.columnSet.length; i++) {
                  const item = this.addForm.columnSet[i]
                  if (item.isSearch && i !== parseInt(index)) {
                    if (parseInt(value) === parseInt(item.search)) {
                      return callback('筛选顺序不可重复')
                    }
                  }
                }
              }
              return callback()
            }
          }],
          show: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              const arr = rule.field.split('.')
              const index = arr[1]
              const row = this.addForm.columnSet[index]
              if (row.isShow) {
                if (value === undefined || value === null || value === '') {
                  return callback('请输入项目顺序')
                }
                if (!/^[0-9]+$/.test(value)) {
                  return callback('项目顺序只能输入整数')
                }
                if (value > this.isShowArr.length) {
                  return callback('不能大于勾选统计项目个数')
                }
                for (let i = 0; i < this.addForm.columnSet.length; i++) {
                  const item = this.addForm.columnSet[i]
                  if (item.isShow && i !== parseInt(index)) {
                    if (parseInt(value) === parseInt(item.show)) {
                      return callback('项目顺序不可重复')
                    }
                  }
                }
              }
              return callback()
            }
          }],
          sort: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              const arr = rule.field.split('.')
              const index = arr[1]
              const row = this.addForm.columnSet[index]
              if (row.isSort) {
                if (value === undefined || value === null || value === '') {
                  return callback('请输入排序顺序')
                }
                if (!/^[0-9]+$/.test(value)) {
                  return callback('排序顺序只能输入整数')
                }
                if (value > this.isSortArr.length) {
                  return callback('不能大于勾选排序项目个数')
                }
                for (let i = 0; i < this.addForm.columnSet.length; i++) {
                  const item = this.addForm.columnSet[i]
                  if (item.isSort && i !== parseInt(index)) {
                    if (parseInt(value) === parseInt(item.sort)) {
                      return callback('排序顺序不可重复')
                    }
                  }
                }
              }
              return callback()
            }
          }],
          sortType: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              const arr = rule.field.split('.')
              const index = arr[1]
              const row = this.addForm.columnSet[index]
              if (row.isSort) {
                if (value === undefined || value === null || value === '') {
                  return callback('请选择排序类型')
                }
              }
              return callback()
            }
          }]
        }
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        // 同步处理
        const response = await this.$updateAsyns('reportTemplate/validName', { templateName: this.addForm.templateName, deptCode: this.curDept.depCode })
        const data = response.data
        if (this.addForm.id !== '') {
          if (data.data === null || data.data.length === 0 || (this.addForm.id === data.data[0].id && data.data.length === 1)) {
            callback = callback()
          } else {
            callback = callback(Error('自定义模板名称与已有的重复！'))
          }
        } else {
          if (data.data === undefined || data.data === null || data.data.length === 0) {
            callback = callback()
          } else {
            callback = callback(Error('自定义模板名称与已有的重复！'))
          }
        }
        return callback
      },
      handleChange(value, row) {
        if (value) {
          this.isSortArr.push(row.columnId)
          row.sortType = 0
        } else {
          this.isSortArr.splice(this.isSortArr.indexOf(row.columnId), 1)
          row.sort = ''
          row.sortType = ''
          this.$refs.addForm.resetFields()
        }
        this.isIndeterminate_sort = this.isSortArr.length > 0 && this.isSortArr.length < this.addForm.columnSet.length
      },
      handleChangeSearch(value, row) {
        if (value) {
          this.isSearchArr.push(row.columnId)
        } else {
          this.isSearchArr.splice(this.isSearchArr.indexOf(row.columnId), 1)
          row.search = ''
        }
      },
      handleChangeShow(value, row) {
        if (value) {
          this.isShowArr.push(row.columnId)
        } else {
          this.isShowArr.splice(this.isShowArr.indexOf(row.columnId), 1)
          row.show = ''
        }
      },
      searchChange(val) {
        const arr = this.addForm.columnSet
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          if (!item.disabeld) {
            item.isSearch = val
            if (val) {
              this.isSearchArr.push(item.columnId)
            } else {
              this.isSearchArr.splice(this.isSearchArr.indexOf(item.columnId), 1)
            }
          }
        }
        this.isIndeterminate_search = this.isSearchArr.length > 0 && this.isSearchArr.length < this.addForm.columnSet.length
      },
      showChange(val) {
        const arr = this.addForm.columnSet
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          if (!item.disabeld) {
            item.isShow = val
            if (val) {
              this.isShowArr.push(item.columnId)
            } else {
              this.isShowArr.splice(this.isShowArr.indexOf(item.columnId), 1)
            }
          }
        }
        this.isIndeterminate_show = this.isShowArr.length > 0 && this.isShowArr.length < this.addForm.columnSet.length
      },
      sortChange(val) {
        const arr = this.addForm.columnSet
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          item.isSort = val
          if (val) {
            this.isSortArr.push(item.columnId)
            item.sortType = 0
          } else {
            this.isSortArr.splice(this.isSortArr.indexOf(item.columnId), 1)
            item.sort = ''
            item.sortType = ''
          }
        }
        this.$refs.addForm.resetFields()
      },
      cancelEdit() {
        this.$confirm('确认是否放弃设置当前自定义模板？', '提示', {
          type: 'warning',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
          this.getTree()
        })
      },
      getTree() { // 查询左侧tree数据
        this.listLoading = true
        this.$query('ajreporttemplate', { deptCode: this.curDept.depCode }).then((response) => {
          this.listLoading = false
          this.dataList = this.buildTreeData(response.data, 0)
          this.getNode(this.dataList[0].children[0].children[0])
        }).catch(() => {
          this.listLoading = false
        })
      },
      buildTreeData(data, parentId) {
        const arr = []
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const leaf = 0
          if (item.parentId === parentId) {
            const json = {
              id: item.id,
              parentId: item.parentId,
              label: item.templateName,
              reportType: item.reportType,
              isAdd: item.isAdd,
              delAble: item.delAble,
              leaf: leaf,
              children: this.buildTreeData(data, item.id)
            }
            arr.push(json)
          }
        }
        return arr
      },
      detail() { // 编辑模块时，查询模块信息
        this.$refs.addForm.resetFields()
        this.formLoading = true
        this.isSortArr = []
        this.isSearchArr = []
        this.isShowArr = []
        this.$query('ajreporttemplatecolumn', { templateId: this.treeItem.id }).then((response) => {
          if (response.data) {
            this.addForm.templateName = this.treeItem.label
            this.addForm.id = this.treeItem.id
            this.addForm.parentId = this.treeItem.parentId
            const data = response.data
            for (let i = 0; i < data.length; i++) {
              const item = data[i]
              item.isSearch = item.isSearch === 1
              item.isShow = item.isShow === 1
              item.isSort = item.isSort === 1
              item.disabeld = item.isNecessary === 1
              if (item.isSort) {
                this.isSortArr.push(item.columnId)
              }
              if (item.isSearch) {
                this.isSearchArr.push(item.columnId)
              }
              if (item.isShow) {
                this.isShowArr.push(item.columnId)
              }
            }
            this.addForm.columnSet = data
            this.formLoading = false
          }
        }).catch(() => {
          this.formLoading = false
        })
      },
      initColumn() {
        this.formLoading = true
        this.isSortArr = []
        this.isSearchArr = []
        this.isShowArr = []
        this.$query('ajreportcolumn', { reportType: this.treeItem.reportType }).then((response) => {
          if (response.data) {
            const data = response.data
            for (let i = 0; i < data.length; i++) {
              const item = data[i]
              if (item.isNecessary === 1) {
                item.isSearch = true
                item.isShow = true
                this.isSearchArr.push(item.columnId)
                this.isShowArr.push(item.columnId)
                if (item.columnSort) {
                  item.search = item.columnSort
                  item.show = item.columnSort
                }
              } else {
                item.isSearch = false
                item.isShow = false
              }
              item.isSort = false
              item.disabeld = item.isNecessary === 1
            }
            this.addForm.columnSet = data
          }
          this.formLoading = false
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
        this.formDisable = false
        this.treeItem = data
        this.addForm = {
          templateName: '',
          parentId: this.treeItem.id,
          reportType: this.treeItem.reportType,
          deptId: this.curDept.id,
          deptCode: this.curDept.depCode,
          deptName: this.curDept.depName,
          creationId: this.curUser.id,
          creationName: this.curUser.realName,
          delAble: 1,
          isDel: 0,
          isAdd: 0,
          columnSet: []
        }
        this.initColumn()
        this.$refs.addForm.resetFields()
      },
      edit(data, node) { // 编辑模块
        this.formDisable = false
        this.treeItem = data
        this.detail()
      },
      delete(data, node) { // 删除模块
        this.$confirm('自定义模板删除后不可恢复，是否删除？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          const param = {
            templateId: data.id
          }
          this.listLoading = true
          this.$update('reportTemplate/delete', param).then((response) => {
            this.loading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTree() // 刷新页面
          }).catch(() => {
            this.listLoading = false
          })
        }).catch(() => {
          this.listLoading = false
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      getNode(data, node) {
        if (data.isAdd === 1 || data.parentId === 0) {
          return
        }
        this.treeItem = data
        this.detail()
        this.formDisable = this.treeItem.delAble === 0 || !this.$isViewBtn('182005')
      },
      isViewBtnAdd(store, data, node) { // “添加”按钮显隐的权限控制
        return data.isAdd === 1 && this.$isViewBtn('182003')
      },
      isViewBtnEdit(store, data, node) { // “编辑”按钮显隐的权限控制
        return data.delAble === 1 && this.$isViewBtn('182005')
      },
      isViewBtnDelete(store, data, node) { // “删除”按钮显隐的权限控制
        return data.delAble === 1 && this.$isViewBtn('182004')
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
      save() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.btnLoading = true
            if (!this.addForm.id) { // 添加
              const para = JSON.parse(JSON.stringify(this.addForm))
              const arr = []
              for (let i = 0; i < this.addForm.columnSet.length; i++) {
                const item = this.addForm.columnSet[i]
                const json = {
                  columnId: item.columnId,
                  isSearch: item.isSearch ? 1 : 0,
                  search: item.search,
                  isShow: item.isShow ? 1 : 0,
                  show: item.show,
                  isSort: item.isSort ? 1 : 0,
                  sort: item.isSort ? item.sort : '',
                  sortType: item.isSort ? item.sortType : ''
                }
                arr.push(json)
              }
              para.columnSet = arr
              this.$save('reportTemplate/save', para).then((response) => {
                const _this = this
                setTimeout(function() {
                  _this.btnLoading = false
                }, 2000)
                this.$message({
                  type: 'success',
                  message: '添加模板成功!'
                })
                this.getTree()
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              const para = JSON.parse(JSON.stringify(this.addForm))
              const arr = []
              for (let i = 0; i < this.addForm.columnSet.length; i++) {
                const item = this.addForm.columnSet[i]
                const json = {
                  id: item.id,
                  templateId: item.templateId,
                  columnId: item.columnId,
                  isSearch: item.isSearch ? 1 : 0,
                  search: item.search,
                  isShow: item.isShow ? 1 : 0,
                  show: item.show,
                  isSort: item.isSort ? 1 : 0,
                  sort: item.isSort ? item.sort : '',
                  sortType: item.isSort ? item.sortType : ''
                }
                arr.push(json)
              }
              para.columnSet = arr
              para.lastId = this.curUser.id
              para.lastName = this.curUser.realName
              this.$update('reportTemplate/update', para).then((response) => {
                const _this = this
                setTimeout(function() {
                  _this.btnLoading = false
                }, 2000)
                this.$message({
                  type: 'success',
                  message: '自定义模板保存成功!'
                })
                this.getTree()
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
      setHeight(height, className) {
        const wrapperHeight = document.documentElement.clientHeight - height
        const collect = document.getElementsByClassName(className)
        const war = collect[0].getElementsByClassName('el-table__body-wrapper')
        war[0].setAttribute('style', 'height: ' + wrapperHeight + 'px')
      }
    },
    mounted() {
      this.countHeight = document.documentElement.clientHeight - 130 + 'px'
      this.setHeight(240, 'reportTemplate')
      this.getTree()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .reportTemplate {
    .leftCont {
      width: 20.83333%;
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
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .el-table__body-wrapper{
      overflow-y: auto;
    }
    .el-form-item--small .el-form-item__error{
      width: 240px;
      text-align: left;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      /*-webkit-appearance: none;*/
    }
    input[type="number"]{
      -moz-appearance: textfield;
    }
  }
</style>
