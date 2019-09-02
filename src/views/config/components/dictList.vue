<template>
  <div class="dictList">
    <el-form :inline="true" :model="configQuery">
      <el-form-item label="字典配置类型">
      <el-select v-model="configQuery.codeLx" placeholder="字典配置类型" clearable>
        <el-option v-for="item in codeLxList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="configQuery.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100903')" v-on:click="queryData(true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="showAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="codeName" label="名称" min-width="30%"></el-table-column>
      <el-table-column prop="code" label="编号" min-width="10%"></el-table-column>
      <el-table-column prop="codeDesc" label="类型名称" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="$isViewBtn('100903')" title="编辑" size="mini" type="primary"
                     icon="el-icon-edit" circle @click="showEdit(scope.row)"></el-button>
          <el-button v-if="$isViewBtn('100903')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handlerDel(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog :title="diaTitle" :visible.sync="dialogVisible" width="700px" @close="handleClose(false)">
      <el-form ref="dictForm" :model="configBean" :rules="rules" label-width="160px">
        <el-form-item label="字典配置类型" prop="codeLx">
          <el-select v-model="configBean.codeLx" placeholder="字典配置类型" @change="dictChange" clearable>
            <el-option v-for="item in codeLxList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="configBean.name" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    clearable style="width: 80%" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="configBean.code" clearable style="width: 60%" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="saveConfig" :loading="configLoading">新增</el-button>
          <el-button @click="handleClose(false)">取 消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'dictList',
    data() {
      return {
        diaTitle: '',
        codeLxList: [],
        configQuery: {
          codeLx: '', name: ''
        },
        configBean: {
          id: '', code: '', name: '', codeLx: '', codeDesc: ''
        },
        listData: [],
        page: 1,
        total: 0,
        pageSize: 15,
        listLoading: false,
        configLoading: false,
        dialogVisible: false,
        tableHeight: null,
        rules: {
          code: [{
            required: true, message: '请输入编号', trigger: 'blur'
          }],
          name: [{
            required: true, message: '请输入名称', trigger: 'blur'
          }],
          codeLx: [{
            required: true, message: '请选择类型', trigger: ['blur', 'change']
          }]
        }
      }
    },
    methods: {
      dictChange(val) {
        for (let i = 0; i < this.codeLxList.length; i++) {
          const lx = this.codeLxList[i]
          if (lx.value === val) {
            this.configBean.codeDesc = lx.label
            return false
          }
        }
      },
      handleCurrentChange(val) {
        this.page = val
        this.queryData(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.queryData(false)
      },
      queryData(flag) {
        this.page = flag ? 1 : this.page
        const para = this.configQuery
        para.pageNum = this.page
        para.pageSize = this.pageSize
        this.listLoading = true
        this.$query('page/tcpcode', para).then((response) => {
          this.listLoading = false
          this.listData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }).catch(() => {
          this.listLoading = false
        })
      },
      clear() {
        this.configQuery.codeLx = ''
        this.configQuery.name = ''
        this.queryData(true)
      },
      showAdd() {
        this.diaTitle = '新增'
        this.dialogVisible = true
      },
      showEdit(row) {
        this.diaTitle = '修改'
        this.dialogVisible = true
        this.configBean.id = row.id
        this.configBean.code = row.code
        this.configBean.name = row.codeName
        this.configBean.codeLx = row.codeLx
        this.configBean.codeDesc = row.codeDesc
      },
      handlerDel(id) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.$remove('tcpcode/' + id, {}).then((response) => {
            this.listLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '删除成功', type: 'success'
              })
              this.queryData(false)
              const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
              this.$save('trestrictedperson', {
                userName: curUser.userName,
                userId: curUser.id,
                realName: curUser.realName
              }).then((response) => {})
            }
          })
        }).catch(() => {
          this.listLoading = false
        })
      },
      hideDialog(flag) {
        this.$refs.dictForm.resetFields()
        this.configBean = {
          id: '', code: '', name: '', codeLx: '', codeDesc: ''
        }
        this.dialogVisible = false
        if (flag) {
          this.queryData(false)
        }
      },
      saveConfig() {
        this.$refs.dictForm.validate(valid => {
          if (valid) {
            if (this.configBean.id) {
              this.handlerEdit()
            } else {
              this.handlerSave()
            }
          }
        })
      },
      handlerSave() {
        this.configLoading = true
        this.$save('tcpcode', this.configBean).then((response) => {
          this.configLoading = false
          if (response.code === '000000') {
            this.handleClose(true)
          }
        }).catch(() => {
          this.configLoading = false
        })
      },
      handlerEdit() {
        this.configLoading = true
        this.$update('tcpcode/' + this.configBean.id, this.configBean).then((response) => {
          this.configLoading = false
          if (response.code === '000000') {
            this.handleClose(true)
          }
        }).catch(() => {
          this.configLoading = false
        })
      },
      getCodeLx() {
        this.$query('tcpcodelxs', {}).then((response) => {
          if (response.code === '000000') {
            this.codeLxList = response.data
            if (this.codeLxList.length > 0) {
              this.configQuery.codeLx = this.codeLxList[0]['value']
            }
            this.queryData(true)
          }
        })
      },
      handleClose(flag) {
        this.hideDialog(flag)
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.getCodeLx()
    }
  }
</script>

<style scoped>

</style>
