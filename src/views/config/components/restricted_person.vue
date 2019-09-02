<template>
  <div class="restricted_per">
    <el-col :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">   <!--返回-->
    </el-col>
    <el-form :inline="true" :model="restrictedQuery">
      <el-form-item label="用户名">
        <el-input v-model="restrictedQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="restrictedQuery.realName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100903')" v-on:click="queryData(true)">查询</el-button>
        <el-button size="small"  @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="showAdd">新增</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button size="small" v-on:click="back">返回</el-button>
      </el-form-item> -->
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="user_name" label="用户名" min-width="40%"></el-table-column>
      <el-table-column prop="real_name" label="姓名" min-width="20%"></el-table-column>
      <el-table-column prop="create_date" label="创建时间" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="$isViewBtn('100903')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handlerDel(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <el-dialog :title="diaTitle" :visible.sync="dialogVisible" width="700px" @close="handleClose(false)">
      <el-form ref="restrictedForm" :model="restrictedBean" :rules="rules" label-width="160px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="restrictedBean.userId" placeholder="请选择" filterable @change="personChange" clearable>
            <el-option v-for="item in personsData" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isViewBtn('100903')" size="small" v-on:click="savePerson" :loading="restrictLoading">提交</el-button>
          <el-button @click="handleClose(false)">取 消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import { getUserExt } from '@/api/depts'
  export default {
    name: 'restricted_per',
    data() {
      return {
        diaTitle: '',
        restrictedQuery: {
          name: ''
        },
        restrictedBean: {
          id: '',
          userName: ''
        },
        listData: [],
        personsData: [],
        page: 1,
        total: 0,
        pageSize: 15,
        listLoading: false,
        restrictLoading: false,
        dialogVisible: false,
        tableHeight: null,
        rules: {
          userId: [{
            required: true, message: '请输入姓名', trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      personChange(val) {
        const len = this.personsData.length
        for (let i = 0; i < len; i++) {
          const bean = this.personsData[i]
          if (bean.id === val) {
            this.restrictedBean.userId = bean.id
            this.restrictedBean.userName = bean.userName
            this.restrictedBean.realName = bean.realName
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
        const para = this.restrictedQuery
        para.pageNum = this.page
        para.pageSize = this.pageSize
        this.listLoading = true
        this.$query('page/trestrictedper', para).then((response) => {
          this.listLoading = false
          this.listData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }).catch(() => {
          this.listLoading = false
        })
      },
      clear() {
        this.restrictedQuery.name = ''
        this.restrictedQuery.realName = ''
        this.queryData(true)
      },
      showAdd() {
        this.diaTitle = '新增'
        this.dialogVisible = true
      },
      back() {
        this.$router.back(-1)
      },
      handlerDel(id) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.$remove('trestrictedper/' + id, {}).then((response) => {
            this.listLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '删除成功', type: 'success'
              })
              this.queryData(false)
            }
          })
        }).catch(() => {
          this.listLoading = false
        })
      },
      hideDialog(flag) {
        this.$refs.restrictedForm.resetFields()
        this.restrictedBean = {
          id: '', userName: ''
        }
        this.dialogVisible = false
        if (flag) {
          this.queryData(false)
        }
      },
      savePerson() {
        this.$refs.restrictedForm.validate(valid => {
          if (valid) {
            this.restrictLoading = true
            this.$save('trestrictedperson', this.restrictedBean).then((response) => {
              this.restrictLoading = false
              if (response.code === '000000') {
                this.handleClose(true)
              }
            }).catch(() => {
              this.restrictLoading = false
            })
          }
        })
      },
      handleClose(flag) {
        this.hideDialog(flag)
      },
      initPerson() {
        getUserExt({}).then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              const len = response.data.length
              for (let i = 0; i < len; i++) {
                const bean = response.data[i]
                this.personsData.push({
                  id: bean.id, userName: bean.user_name, realName: bean.real_name
                })
              }
            }
          }
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.queryData(true)
      this.initPerson()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>

</style>
