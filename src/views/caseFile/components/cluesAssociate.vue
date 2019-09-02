<template>
<!-- 线索关联 -->
<section>
  <div class="cell_title">
    <span class="small_line"></span>
    <span class="text">线索关联</span>
  </div>
  <div class="bg ajInfo">
    <!-- <title-pub :title="title" url=""></title-pub> -->
    <el-tabs class="archiveTab" v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="舆情线索" name="first">
        <div slot="label">
          <p v-if="totalYqxs>0">舆情线索<span class="circle_number">{{totalYqxs}}</span></p>
          <p v-else class="no_data_title">舆情线索</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <el-table :data="yqxsData" @row-click="rowClick" style="position: relative">
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalYqxs > 0" layout="prev, pager, next" @current-change="handleCurrentChangeYqxs"
                        :page-size="pageSize" :total="totalYqxs" :current-page="pageYqxs" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane> -->
      <el-tab-pane label="情报线索" name="second">
        <div slot="label">
          <p v-if="totalQbxs>0">情报线索<span class="circle_number">{{totalQbxs}}</span></p>
          <p v-else class="no_data_title">情报线索</p>
          <img src="static/image/personFile_images/tab_title_line.png" class="tab_title_line" alt="" srcset="">
        </div>
        <el-table :data="qbxsData" style="width: 100%;" v-loading="qbxsLoading" class="statisticCollect" max-height="186">
          <el-table-column prop="XSXXBH" label="线索编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="BT" label="线索标题" show-overflow-tooltip></el-table-column>
          <el-table-column prop="XSXXLY_NAME" label="线索来源" show-overflow-tooltip></el-table-column>
          <el-table-column prop="SSLB_NAME" label="线索分类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JJCD_NAME" label="紧急程度" show-overflow-tooltip></el-table-column>
          <el-table-column prop="XSZT_NAME" label="线索状态" width="120px"></el-table-column>
          <el-table-column label="线索类型" show-overflow-tooltip>
            <template slot-scope="scope">
              {{getLXText(scope.row.XSLX)}}
            </template>
          </el-table-column>
          <el-table-column prop="STATUS" label="完善状态" width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.STATUS===1">已完善</span>
              <span v-else-if="scope.row.STATUS===0">未完善</span>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="totalQbxs > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChangeQbxs"  :page-sizes="[5,10,15,20]" @size-change="handleSizeChangeQbxs"
                        :page-size="pageSizeQbxs" :total="totalQbxs" :current-page="pageQbxs" style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
  </section>
</template>
<script>
import {
  getQbxsByAjId
} from '@/api/caseManage'
import {
  getSYHText
} from '@/utils/codetotext'
export default {
  props: ['ajbh', 'info'],
  name: 'index',
  data() {
    return {
      activeName: 'second',
      ajInfo: {},
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      yqxsData: [], // 舆情线索
      yqxsLoading: false,
      qbxsData: [], // 情报线索
      qbxsLoading: false,
      pageSizeQbxs: 5, // 情报线索条数
      pageYqxs: 1, // 舆情线索
      pageSizeYqxs: 5, // 舆情线索条数
      totalYqxs: 0,
      pageQbxs: 1, // 情报线索
      totalQbxs: 0,
      socialAllTotal: [] // 三种类型的总数
    }
  },
  watch: {
    info(val) {
      if (val.id) {
        this.ajInfo = val
        this.handleQbxs(true) // 情报线索
      }
    },
    ajbh(val) {
      this.ajbh = val
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      // this.handleYqxs(true) // 舆情线索
      if (this.ajInfo && this.ajInfo.id) { // 有案件id 的才能查情报线索
        this.handleQbxs(true) // 情报线索
      }
    },
    // calculateAll() { // 计算总数
    //   if (this.socialAllTotal.length === 3) {
    //     var all = 0
    //     for (let index = 0; index < this.socialAllTotal.length; index++) {
    //       const element = this.socialAllTotal[index]
    //       all += element
    //     }
    //     this.$resetSetItem('t8', all) // 将总数存在session中
    //   } else {
    //     this.$resetSetItem('t8', 0) // 将总数存在session中
    //   }
    // },
    handleYqxs(flag) { // 舆情线索
      // this.yqxsLoading = true
    },
    handleQbxs(flag) { // 情报线索
      this.qbxsLoading = true
      getQbxsByAjId({
        ajId: this.ajInfo.id,
        pageSize: this.pageSizeQbxs,
        pageNum: this.pageQbxs
      }).then((res) => {
        this.qbxsLoading = false
        if (res.code === '000000' && res.data.list) {
          this.qbxsData = res.data.list
          this.totalQbxs = res.data.totalCount
          this.pageSizeQbxs = res.data.pageSize
          this.$resetSetItem('aj7', this.totalQbxs) // 将总数存在session中
        }
      }).catch(() => {
        this.qbxsLoading = false
      })
    },
    handleCurrentChangeYqxs(val) { // 舆情线索
      this.pageYqxs = val
      this.handleYqxs(false)
    },
    handleCurrentChangeQbxs(val) { // 情报线索
      this.pageQbxs = val
      this.handleQbxs(false)
    },
    handleSizeChangeQbxs(val) { // 情报线索条数
      this.pageQbxs = 1
      this.pageSizeQbxs = val
      this.handleQbxs(false)
    },
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
      }
      return ''
    },
    getLXText(type) {
      if (type && type.length > 0) {
        return getSYHText(type.substring(0, 1))
      }
      return ''
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
</style>
