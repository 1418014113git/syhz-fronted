<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item prop="AJMC">
          <el-input v-model="filters.AJMC" size="small" placeholder="案件名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="AJMC">
          <el-select v-model="filters.models" size="small" placeholder="专题模型选择" @change="modeChange" clearable>
            <el-option v-for="item in modelSelect" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="AJBH">
          <el-input v-model="filters.AJBH" size="small" placeholder="案件编号" clearable></el-input>
        </el-form-item>
        <!--<el-form-item prop="value6">-->
          <!--<div class="block case">-->
            <!--<el-date-picker-->
              <!--v-model="value6"-->
              <!--type="daterange"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期"-->
              <!--size="small">-->
            <!--</el-date-picker>-->
          <!--</div>-->
        <!--</el-form-item>-->
        <!--<el-form-item prop="sel_val1">-->
          <!--<el-select v-model="sel_val1" size="small" placeholder="案件状态选择">-->
            <!--<el-option v-for="item in options1" :key="item.label" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" size="small" v-if="$isViewBtn('100501')"  v-on:click="getCase(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-on:click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="案件编号" min-width="5%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" @click="toAjDetail(scope.row.id)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="8%">
        <template slot-scope="scope">
          <a class="ajbh-color ellipsis-word" @click="toAjDetail(scope.row.id)">{{scope.row.AJMC}}</a>
        </template>
      </el-table-column>
      <el-table-column label="简要案情" min-width="16%">
        <template slot-scope="scope">
          <p :title="scope.row.JYAQ" class="ellipsis-word">{{scope.row.JYAQ}}</p>
        </template>
      </el-table-column>
      <el-table-column label="市" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.DISTRICTCODENAME" class="ellipsis-word">{{scope.row.DISTRICTCODENAME}}</p>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="handleAjDetail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
  import {
    getAJJBXXBYMODE
  } from '@/api/caseManage'
  import {
    getSpecialmodeList
  } from '@/api/specialmode'

  export default {
    data() {
      return {
        currentUser: {},
        currentDep: {},
        filters: {
          AJMC: '',
          AJBH: '',
          models: []
        },
        cases: [],
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        sels: [],
        value6: '',
        options1: [
          {
            value: '选项1', label: '已破获'
          },
          {
            value: '选项2', label: '未破获'
          }
        ],
        options2: [
          {
            value: 'true', label: '是'
          },
          {
            value: 'false', label: '否'
          }
        ],
        sel_val1: '',
        sel_val2: '',
        sel_val3: '',
        sel_val4: '',
        models: {},
        modelSelect: [],
        tableHeight: null
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
      },
      handleCurrentChange(val) {
        this.page = val
        this.getCase(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getCase(false)
      },
      getCase(flag) {
        this.page = flag ? 1 : this.page
        const para = this.filters
        para.pageNum = this.page
        para.pageSize = this.pageSize
        this.listLoading = true
        getAJJBXXBYMODE(para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.cases = data.list
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      getSpecialMode() {
        const para = {
          deptId: this.currentDep.id, userId: this.currentUser.id
        }
        getSpecialmodeList(para).then((response) => {
          this.models = {}
          if (response.data.length > 0) {
            const data = response.data
            const len = data.length
            for (let i = 0; i < len; i++) {
              const b = data[i]
              if (b.value) {
                b.value = JSON.parse(b.value)
              }
              this.models[b.id] = b.value
              this.modelSelect.push({
                id: b.id, name: b.name
              })
            }
          }
        })
      },
      reset() {
        this.filters = {
          AJMC: '',
          AJBH: ''
        }
        this.getCase(true)
      },
      handleAjDetail(index, row) {
        // this.$router.push({
        //   path: '/caseManage/detailSyh/' + row.id
        // })
        this.$router.push({
          path: '/caseFile/index', query: { id: row.id }
        })
      },
      modeChange(val) {
        const models = this.models[val]
        if (models) {
          for (let i = 0; i < models.length; i++) {
            const m = models[i]
            const name = m['name']
            const cond = m['cond']
            this.filters[name + cond] = m['value']
          }
        } else {
          this.filters = {
            AJMC: '',
            AJBH: ''
          }
        }
      },
      toAjDetail(id) {
        // this.$router.push({ path: '/caseManage/detailSyh/' + id })
        this.$router.push({
          path: '/caseFile/index', query: { id: id }
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.currentUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.getCase(true)
      this.getSpecialMode()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>
