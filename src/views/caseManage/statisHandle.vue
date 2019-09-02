<template>
<!--案件统计表---打击处理人员情况(人员信息列表) -->
  <section>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div class="xddw statisHandle">
      <el-table :data="dataList"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
        <el-table-column type="expand" >
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand"  label-width="110px">
              <el-form-item label="决定结果">
                <span>{{ props.row.jdjgName }}</span>
              </el-form-item>
              <el-form-item label="起始时间">
                <span v-if="props.row.qssj">{{ $handlerDateTime(props.row.qssj) | jqTime }}</span>
              </el-form-item>
              <el-form-item label="决定期限">
                <span>{{ props.row.jdqxName }}</span>
              </el-form-item>
              <el-form-item label="决定金额">
                <span v-if="props.row.jdje">{{ props.row.jdje }}（元）</span>
              </el-form-item>
              <el-form-item label="决定日期">
                <span v-if="props.row.jdrq">{{ $handlerDateTime(props.row.jdrq) | jqTime }}</span>
              </el-form-item>
              <el-form-item label="决定机关">
                <span>{{ props.row.jdjigName }}</span>
              </el-form-item>
              <el-form-item label="文书文号">
                <span>{{ props.row.wswh }}</span>
              </el-form-item>
              <el-form-item label="罪名">
                <span>{{ props.row.zm }}</span>
              </el-form-item>
              <el-form-item label="审批意见">
                <span>{{ props.row.spyj }}</span>
              </el-form-item>
              <el-form-item label="法律依据"  class="flyj" style="width:100%;">
                <span>{{ props.row.flyj}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column prop="xm" label="人员姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gmsfhm" label="证件号码" width="200">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.gmsfhm" @click="showTipsC(scope.row.gmsfhm)">{{scope.row.gmsfhm}}</span> -->
             <span class="zjhm"  @click="handlePersonDetail(scope.row.gmsfhm)">{{scope.row.gmsfhm}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cslbName" label="措施类别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cbdwName" label="承办单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cbrName" label="承办人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cbrq" label="承办日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.cbrq">{{$handlerDateTime(scope.row.cbrq) | jqTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spjgName" label="审批结果" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spbmName" label="审批部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sprName" label="审批人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sprq" label="审批日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sprq">{{$handlerDateTime(scope.row.sprq) | jqTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <card-com v-if="showCardCom" class="cardCom" :cardId="curCardId" @close="clickBlank"></card-com> -->
    </div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  // import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
  export default {
    name: 'index',
    data() {
      return {
        listLoading: false, // 列表加载进度条
        showCardCom: false, // 是否显示身份证查询组件
        total: 0, // 总条数
        page: 1, // 页数
        pageSize: 15, // 每页条数
        tableHeight: null, // 列表最大高度
        curCardId: '', // 身份证号
        dataList: [] // 列表数据
      }
    },
    components: {
      // cardCom
    },
    filters: {
      jqTime(val) {
        var t = val.substring(0, 10)
        return t
      }
    },
    methods: {
      init() {
        this.showCardCom = false
        this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (this.param) {
          this.query(true)
        }
      },
      query(flag) {
        const para = {
          pageNum: flag ? 1 : this.page,
          pageSize: this.pageSize,
          type: this.param.type,
          fllb: this.param.fllb,
          cslb: this.param.cslb,
          cityCode: this.param.cityCode,
          startTime: this.param.startTime,
          endTime: this.param.endTime
        }
        this.listLoading = true
        this.$query('statistics/list/case', para).then((response) => {
          this.listLoading = false
          this.dataList = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCurrentChange(val) { // 分页设置
        this.page = val
        this.query()
      },
      handleSizeChange(val) { // 条数设置
        this.page = 1
        this.pageSize = val
        this.query()
      },
      handlePersonDetail(number) { // 跳转人员档案
        this.$router.push({
          path: '/personnelFile/index', // 升级版人员档案
          query: { cardId: number }
        })
      },
      showTipsC(val) { // 显示身份证查询组件
        this.curCardId = val
        if (!this.showCardCom) {
          this.showCardCom = true
        }
      },
      clickBlank() { // 关闭身份证查询组件
        this.showCardCom = false
      },
      toback() {
        this.$router.back(-1)
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - 180
      this.init()
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - 180
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
p > span {
	display: inline-block;
	height: 30px;
	line-height: 30px;
	margin-right: 20px;
}
.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 100px;
	color: #99a9bf;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 33%;
}
.cardCom{
  position: absolute;
  top: 37px;
  left: 25%;
}
.zjhm {
  cursor: pointer;
}
.zjhm:hover {
  color: #3da1ff;
}
.statisHandle .el-form-item__content{
  width: 80%;
}
.flyj .el-form-item__content{
  width: 93%;
}
@media only screen and (max-width: 1366px) {
  .cardCom{
    left: 31%;
  }
  .statisHandle .el-form-item__content{
    width: 70%;
  }
  .flyj .el-form-item__content{
    width: 89%;
  }
}
</style>
