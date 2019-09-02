<template>
  <div>
    <el-row class="intell_add">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <div>
<!--    <el-form :inline="true" :model="filters" size="small">
      <el-form-item>
        <el-input size="small" clearable v-model="filters.DWMC" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" clearable filterable v-model="filters.DWXZ" placeholder="企业性质">
          <el-option v-for="item in enterprise_nature" :key="item.value" :label="item.code_name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" clearable filterable v-model="filters.DWLB" placeholder="企业类型">
          <el-option value="01" label="新闻单位"></el-option>
          <el-option value="02" label="交通枢纽"></el-option>
          <el-option value="03" label="国防科技工业重要产品的研制、生产单位"></el-option>
          <el-option value="04" label="电信、邮政、金融（银行、证券、保险）单位"></el-option>
          <el-option value="05" label="大型能源动力设施、水利设施和城市水电燃气热力供应设施"></el-option>
          <el-option value="06" label="大型物资储备单位和大型商贸中心"></el-option>
          <el-option value="07" label="教育、科研、医疗单位和大型文化、体育场所"></el-option>
          <el-option value="08" label="博物馆、档案馆和重点文物保护单位"></el-option>
          <el-option value="09" label="研制、生产、销售、储存危险物品或者实验、保藏传染性菌、毒种"></el-option>
          <el-option value="10" label="国家重点建设工程单位"></el-option>
          <el-option value="11" label="党政机关单位"></el-option>
          <el-option value="12" label="工矿企业"></el-option>
          <el-option value="13" label="高等院校"></el-option>
          <el-option value="14" label="中小学校、幼儿园"></el-option>
          <el-option value="15" label="敬老院"></el-option>
          <el-option value="16" label="大型储备仓库"></el-option>
          <el-option value="99" label="其它"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>-->
    <!-- <div style="padding: 10px 10px 0; position: relative">
      <el-button type="primary" @click="toList" style="position: absolute; right: 10px; top: 22px; z-index: 999">返回</el-button>
    </div> -->
    <el-tabs  @tab-click="handleClick" style="padding: 10px">
      <el-tab-pane label="企业">
        <el-button   v-if="tasks.length==0" size="mini" plain type="primary" @click="handleCompanylEdit()" >添加</el-button>
        <el-table :data="tasks"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
          <el-table-column prop="DWMC" label="名称"></el-table-column>
          <el-table-column prop="DWXZ" label="企业性质"></el-table-column>
          <el-table-column prop="XYLB" label="行业类别"></el-table-column>
          <el-table-column prop="DWLB" label="企业类型"></el-table-column>
          <el-table-column prop="YYZZBH" label="营业执照编号"></el-table-column>
          <el-table-column prop="FRDBXM" label="法人名称"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                         :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="人员">
        <el-button   v-if="tasks2.length==0" size="mini" plain type="primary" @click="handlePersonnelEdit()" >添加</el-button>
        <el-table :data="tasks2"  v-loading="listLoading2" style="width: 100%;">
          <el-table-column prop="id" label="人员编号"></el-table-column>
          <el-table-column prop="XM" label="人员名称"></el-table-column>
          <el-table-column prop="ZJHM" label="身份证号码"></el-table-column>
          <el-table-column prop="XB" label="性别"></el-table-column>
          <el-table-column prop="MZ" label="民族"></el-table-column>
          <el-table-column prop="HYZK" label="婚姻状况"></el-table-column>
          <el-table-column prop="HJDSSXQ" label="籍贯祥址"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total2 > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange2" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange2"
                         :page-size="pageSize2" :total="total2" :current-page="page2" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
  import { getQbxsJbxxTypeQueryHandlePage } from '@/api/intellSystem'
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'index',
    data() {
      return {
        filters: {
          DWMC: ''
        },
        XSLX: 1,
        total: 0,
        total2: 0,
        page: 1,
        page2: 1,
        pageSize: 15,
        pageSize2: 15,
        listLoading: false,
        listLoading2: false,
        enterprise_nature: [],
        tasks: [],
        tasks2: [],
        cpType: 0,
        tableHeight: null
      }
    },
    methods: {
      formatterBlack(row, index) {
        return row.ENABLE === 1 ? '是' : '否'
      },
      formatterNS(row, index) {
        return row.SFNS === 1 ? '是' : '否'
      },
      handleClick(tab, event) {
        this.cpType = tab.index
        if (tab.index === '0') {
          this.query1()
        }
        if (tab.index === '1') {
          this.query2()
        }
      },
      handlePersonnelEdit() {
        this.$router.push({ path: '/inforCollection/personnelEdit' })
      },
      handleCompanylEdit() {
        this.$router.push({ path: '/inforCollection/add' })
      },
      toList() {
        this.$router.push({ path: '/intellSystem' })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query1()
      },
      handleCurrentChange2(val) {
        this.page2 = val
        this.query2()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query1()
      },
      handleSizeChange2(val) {
        this.page2 = 1
        this.pageSize2 = val
        this.query2()
      },
      query1() {
        const a = JSON.parse(getUserInfo())
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize,
          type: this.XSLX,
          cpType: this.cpType,
          qbxsId: this.qbxsId,
          enable: 1,
          createUserId: a.id,
          createUserName: a.realName
        }
        this.listLoading = true
        getQbxsJbxxTypeQueryHandlePage(para).then((response) => {
          const cData = response.data.cData
          this.total = cData.totalCount
          this.pageSize = cData.pageSize
          this.tasks = cData.list
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      query2() {
        const a = JSON.parse(getUserInfo())
        const para = {
          pageNum: this.page2,
          pageSize: this.pageSize2,
          type: this.XSLX,
          cpType: this.cpType,
          qbxsId: this.qbxsId,
          enable: 1,
          createUserId: a.id,
          createUserName: a.realName
        }
        this.listLoading2 = true
        getQbxsJbxxTypeQueryHandlePage(para).then((response) => {
          const pData = response.data.pData
          this.total2 = pData.totalCount
          this.pageSize2 = pData.pageSize
          this.tasks2 = pData.list
          this.listLoading2 = false
        }).catch(() => {
          this.listLoading2 = false
        })
      },
      queryEle: function() {
        this.cpType = 0
        this.query1()
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - 310
      this.qbxsId = this.$route.params.id
      this.queryEle()
    }
  }
</script>

<style scoped>
  p > span{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
  }
</style>
