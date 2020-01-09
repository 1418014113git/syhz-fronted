<template>
  <section>
    <!-- 案件串并 -->
    <div class="cell_title">
      <span class="small_line"></span>
      <span class="text">案件串并</span>
    </div>
    <div class="bg ajParallel">
      <!-- <title-pub :title="title" url=""></title-pub> -->
      <el-tabs class="archiveTab" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="案件串并" name="first">
          <div slot="label">
            <p v-if="totalAjcb>0">案件串并<span class="circle_number">{{totalAjcb}}</span></p>
            <p v-else class="no_data_title">案件串并</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
          </div>
          <!-- <el-table :data="dataList" style="width: 100%;" v-loading="loading" max-height="156"> -->
          <el-table :data="dataList" style="width: 100%;" v-loading="loading">
            <el-table-column type="index" label="序号" width="52" fixed></el-table-column>
            <el-table-column prop="CBABH" label="串并编号"></el-table-column>
            <el-table-column prop="CAZT_NAME" label="串案状态"></el-table-column>
            <el-table-column prop="CBFXBH" label="分析编号"></el-table-column>
            <el-table-column prop="AJMC" label="案件名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AJLB_NAME" label="案件类别" ></el-table-column>
            <el-table-column prop="CZDW_NAME" label="操作单位" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CZR_NAME" label="操作人"></el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                <span v-if="scope.row.CZSJ">{{formatTime(scope.row.CZSJ)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="totalAjcb > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeAjcb"  :page-sizes="[5,10,15,20]"  @size-change="handleSizeChangeAjcb"
                :page-size="pageSizeAjcb" :total="totalAjcb" :current-page="pageAjcb" style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="重复合并" name="second">
          <div slot="label">
            <p v-if="totalCfhb>0">重复合并<span class="circle_number">{{totalCfhb}}</span></p>
            <p v-else class="no_data_title">重复合并</p>
            <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
          </div>
          <!-- <el-table :data="mergeList" style="width: 100%;" v-loading="loading" max-height="156"> -->
          <el-table :data="mergeList" style="width: 100%;" v-loading="loading">
            <el-table-column type="index" label="序号" width="52" fixed></el-table-column>
            <el-table-column prop="ajbh" label="案件编号" show-overflow-tooltip>
              <template slot-scope="props">
                <a class="ajbh-color" @click="handleAjDetail(props.$index, props.row)">{{props.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajmc" label="案件名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajzt" label="案件状态"></el-table-column>
            <el-table-column prop="larq" label="立案日期"></el-table-column>
            <el-table-column prop="ajlb" label="案件类别" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="重复合并原因" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.remark">{{$getDictName(scope.row.remarkType+'','hbyy')}}（{{scope.row.remark}}）</span>
                <span v-else>{{$getDictName(scope.row.remarkType+'','hbyy')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applyDeptName" label="操作单位" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateName" label="操作人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="操作时间" width="170"></el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button v-if="(deptInfo.depCode===scope.row.applyDeptCode) && $isViewBtn('103101')"
                  size="small" plain circle @click="handleCaseRemove(scope.$index, scope.row)" icon="el-icon-close" title="移除"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="totalCfhb > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeCfhb"  :page-sizes="[5,10,15,20]"  @size-change="handleSizeChangeCfhb"
                :page-size="pageSizeCfhb" :total="totalCfhb" :current-page="pageCfhb" style="float:right;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import { getAJDETAILBUNCH } from '@/api/caseManage'
export default {
  props: ['ajbh'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '案件串并',
      activeName: 'first',
      loading: false, // 页面加载loading
      pageAjcb: 1, // 案件串并
      totalAjcb: 0,
      pageSizeAjcb: 5,
      dataList: [], // 案件串并列表
      mergeList: [], // 重复合并列表
      pageCfhb: 1, // 重复合并
      totalCfhb: 0,
      pageSizeCfhb: 5,
      allTotalAjcb: [], // 存放每个模块的数量
      AJBH: '', // 案件编号
      AJID: '', // 案件id
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: {
    ajbh(val) {
      this.loading = true
      this.initData() // 初始化数据
      if (val) {
        this.AJBH = val
        this.init(true)
      }
    }
  },
  methods: {
    calculateAll() { // 计算总数
      if (this.allTotalAjcb.length === 2) {
        var all = 0
        for (let index = 0; index < this.allTotalAjcb.length; index++) {
          const element = this.allTotalAjcb[index]
          all += element
        }
        this.$resetSetItem('aj9', all) // 将总数存在session中
      } else {
        this.$resetSetItem('aj9', 0) // 将总数存在session中
      }
    },
    init(flag) {
      if (this.ajbh) {
        this.loading = true
        this.AJBH = this.ajbh
        this.queryCaseCb(true) // 案件串并
        this.queryMergeList(true) // 查重复合并
      }
    },
    initData() { // 初始化数据
      this.dataList = []
      this.pageAjcb = 1
      this.totalAjcb = 0
      this.pageSizeAjcb = 5
      this.mergeList = []
      this.pageCfhb = 1
      this.totalCfhb = 0
      this.pageSizeCfhb = 5
    },
    queryCaseCb(flag) { // 案件串并
      getAJDETAILBUNCH({
        pageNum: flag ? 1 : this.pageAjcb,
        pageSize: this.pageSizeAjcb,
        AJBH: this.AJBH
      }).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.dataList = res.data.list
          this.totalAjcb = res.data.totalCount
          this.pageSizeAjcb = res.data.pageSize
          if (flag) {
            this.allTotalAjcb.push(this.totalAjcb)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    queryMergeList(flag, hand) {
      this.page = flag ? 1 : this.page
      var param = {
        ajbh: this.AJBH, // 案件编号
        pageNum: this.pageCfhb,
        pageSize: this.pageSizeCfhb
      }
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      this.loading = true
      this.$query('caseMerge/caseMergeList', param).then((response) => {
        if (response.code === '000000') {
          this.loading = false
          const data = response.data
          this.totalCfhb = data.totalCount
          this.pageSizeCfhb = data.pageSize
          this.mergeList = data.list
          if (flag) {
            this.allTotalAjcb.push(this.totalCfhb)
            this.calculateAll()
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    formatTime(time) {
      return this.$handlerDateTime(time)
    },
    handleCurrentChangeAjcb(val) {
      this.pageAjcb = val
      this.queryCaseCb(true)
    },
    handleSizeChangeAjcb(val) {
      this.pageSizeAjcb = val
      this.pageAjcb = 1
      this.queryCaseCb(true)
    },
    handleCurrentChangeCfhb(val) {
      this.pageAjcb = val
      this.queryMergeList(true)
    },
    handleSizeChangeCfhb(val) {
      this.pageSizeAjcb = val
      this.pageAjcb = 1
      this.queryMergeList(true)
    },
    handleCaseRemove(index, row) { // 重复合并--移除
      this.$confirm('确定要将此案件移除合并', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        var param = JSON.parse(JSON.stringify(row))
        param.userId = this.userInfo.id
        param.userName = this.userInfo.realName
        param.deptName = this.deptInfo.depName
        param.deptCode = this.deptInfo.depCode
        this.loading = true
        this.$update('caseMerge/noMerge', param).then(res => {
          this.loading = false
          if (res.code === '000000') {
            this.$message({ message: '移除成功', type: 'success' })
            location.reload()
          } else {
            this.$message({ message: '移除失败', type: 'error' })
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        // 留在此页面
      })
    },
    handleClick() { // 点击tab切换
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detail/' + row.id })
      if (row.status === '5' || row.status === '已认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, rlDept: row.noticeOrgCode, isRl: '1' } // 展示申请督办等按钮
        })
      } else if (row.status === '3' || row.status === '待认领') {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '0', rlId: row.id, rlDept: row.noticeOrgCode } // 展示 待认领按钮
        })
      } else {
        this.$router.push({
          path: '/caseFile/index', query: { ajbh: row.ajbh, interfaceType: 'etl', isRl: '2' } // 不待认领按钮，不展示申请督办等按钮
        })
      }
    }
  },
  mounted() {
    this.init(true)
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.ajParallel {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  // border-radius: 8px;
}
</style>
