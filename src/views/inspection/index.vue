<template>
 <div>
   <el-row>
     <el-col :span="24" class="toolbar">
       <el-form :inline="true" :model="filters">
         <el-row>
           <el-col :span="4">
             <el-form-item>
               <el-input v-model="filters.name" size="small" placeholder="检验物品名称"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="4">
             <el-form-item>
               <el-select v-model="filters.state1" size="small" placeholder="检验状态">
                 <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="4">
             <el-form-item>
               <el-select v-model="filters.state2" size="small" placeholder="物品类型">
                 <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="4">
             <el-form-item>
               <el-select v-model="filters.state3" size="small" placeholder="审核状态">
                 <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="8">
              <el-form-item>
             <el-date-picker
               v-model="filters.date"
               type="daterange"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期" size="small">
             </el-date-picker>
             </el-form-item>
           </el-col>

           <el-col :span="10">
              <el-form-item>
               <el-button type="primary" size="small" v-on:click="getList">查询</el-button>
               <el-button type="primary" size="small" v-on:click="toApply">申请检验鉴定</el-button>
               </el-form-item>
           </el-col>
         </el-row>
       </el-form>
     </el-col>
   </el-row>

   <el-row>
     <el-col>
       <el-table :data="list" border style="width: 100%">
         <el-table-column prop="col1" label="申请单位" width="120"></el-table-column>
         <el-table-column prop="col2" label="申请人" width="100"></el-table-column>
         <el-table-column prop="col3" label="申请时间" width="100" align="center"></el-table-column>
         <el-table-column prop="col4" label="检材名称" width="140"></el-table-column>
         <el-table-column prop="col5" label="检验状态" width="110" align="center"></el-table-column>
         <el-table-column prop="col6" label="送检要求" width="130"></el-table-column>
         <el-table-column prop="col7" label="审批状态" width="100" align="center"></el-table-column>
         <el-table-column prop="col8" label="反馈结果" width="150"></el-table-column>
         <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button type="primary" size="small" v-on:click="toEdit(scope.row.id)">修改</el-button>

             <a :href="''+exportDataUrl+'qbxsjbxx?XSXXBH='+filters.XSXXBH+'&type=2'"  download="t.xlsx"  >
               <el-button type="primary"  >检验鉴定委托书</el-button>
             </a>

             <el-button type="primary" size="small" v-on:click="getList">检验鉴定委托书</el-button>
             <el-button type="primary" size="small" v-on:click="getList">查看详细</el-button>
             <el-button type="primary" size="small" v-on:click="toApproval(scope.row.id)">审批</el-button>
             <el-button type="primary" size="small" v-on:click="toReport(scope.row.id)">鉴定报告</el-button>
             <el-button type="primary" size="small" v-on:click="getList">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-col>
   </el-row>
 </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import importexport from '@/api/importexport'
export default {
  data() {
    return {
      exportDataUrl: importexport.exportDataUrl,
      filters: {
        name: '',
        state1: ' ',
        state2: ' ',
        state3: ' ',
        date: ''
      },
      list: [],
      options: [
        { value: '0', label: '类型1' },
        { value: '1', label: '类型2' }
      ]
    }
  },
  methods: {
    getList() {
      this.list = [
        { id: 12, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 13, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 14, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 15, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 16, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 17, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 18, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' },
        { id: 19, col1: '单位1', col2: '申请人1', col3: '2018-11-11', col4: '检材名称1', col5: '检验状态1', col6: '送检要求1', col7: '审批状态1', col8: '反馈结' }
      ]
    },
    toApply() {
      this.$router.push({ path: '/jyjd/apply' })
    },
    toEdit(id) {
      this.$router.push({ path: '/jyjd/apply', query: { 'id': id }})
    },
    toApproval(id) {
      this.$router.push({ path: '/jyjd/jysp', query: { 'id': id }})
    },
    toReport(id) {
      this.$router.push({ path: '/jyjd/jybg', query: { 'id': id }})
    }

  },
  mounted() {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
