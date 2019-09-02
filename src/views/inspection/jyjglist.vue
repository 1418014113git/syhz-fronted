<template>
 <div>
   <el-row>
     <el-col :span="24" class="toolbar" >
       <el-form :inline="true" :model="filters">
             <el-form-item label="检验机构名称">
               <el-input v-model="filters.name" size="small" placeholder="检验机构名称"></el-input>
             </el-form-item>
             <!--<el-form-item label="">
               <el-date-picker
                 v-model="filters.date"
                 type="daterange"
                 range-separator="至"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期" size="small">
               </el-date-picker>
             </el-form-item>-->
             <el-form-item>
               <el-button type="primary" size="small" v-on:click="getList">查询</el-button>
               <el-button type="primary" size="small" v-on:click="toAdd">增加</el-button>
             </el-form-item>

       </el-form>
     </el-col>
   </el-row>

   <el-row>
     <el-col>
       <el-table :data="list" border style="width: 100%">
         <el-table-column prop="col1" label="名称"></el-table-column>
         <el-table-column prop="col2" label="联系人" ></el-table-column>
         <el-table-column prop="col3" label="机构电话"  align="center"></el-table-column>
         <el-table-column prop="col4" label="联系人电话"></el-table-column>
         <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button type="primary" size="small" v-on:click="getList">查看详细</el-button>
             <el-button type="primary" size="small" v-on:click="toEdit(scope.row.id)">修改</el-button>
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

export default {
  name: 'inspectionList',
  data() {
    return {
      filters: {
        name: '',
        // ,state1:' '
        // ,state2:' '
        // ,state3:' '
        startDate: '',
        endDate: '',
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
        { id: 12, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 13, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 14, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 15, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 16, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 17, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 18, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' },
        { id: 19, col1: '第一鉴定机构', col2: '申请人1', col3: '0471-555555', col4: '13054778888' }
      ]
    },
    toAdd() {
      this.$router.push({ path: '/jyjd/jyjgSave' })
    },
    toEdit(id) {
      this.$router.push({ path: '/jyjd/jyjgSave', query: { 'id': id }})
    },
    toDelete(id) {
      console.log(id)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
