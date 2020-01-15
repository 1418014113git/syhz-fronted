<template>
  <!-- 地市签收 -->
  <div class="caseAssist_areaSign pubStyle">
    <div class="titlePub">
      <div slot="header" class="clearfix">
        <span class="letterSpc">{{title}}</span>
      </div>
    </div>
    <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
      <el-table-column type="index" label="序号" width="60" align="center" fixed="left"></el-table-column>
      <el-table-column prop="createDeptName" label="下发单位" width="280" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createDate" label="下发日期" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$parseTime(scope.row.createDate, '{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column prop="clueNum" label="线索数量" align="center">
        <template slot-scope="scope">
          <span class="linkColor" @click="toClueList(scope.row)" v-if="enableTo(scope.row)">{{scope.row.clueNum}}</span>
          <span v-else>{{scope.row.clueNum || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveDeptName" label="接收单位" width="280" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="signStatus" label="签收状态" width="120" align="center">
        <template slot-scope="scope">
          <span v-if='scope.row.signStatus'>{{$getDictName(scope.row.signStatus+'','qszt')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveUserName" label="签收人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveDate" label="签收时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button v-if="$isViewBtn('100907') && String(scope.row.signStatus) !== '2' && signEnable(scope.row)" size="mini" title="签收"  type="primary" circle icon="el-icon-edit-outline" @click="handleSign(scope.$index, scope.row)"></el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
            :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['assistId', 'info', 'showType'],
  name: 'index',
  data() {
    return {
      title: '',
      curUser: {},
      curDept: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 地市签收表
      listLoading: false, // 页面loading
      pageSize: 5,
      page: 1,
      total: 0,
      parentDept: {},
      pcsParentDept: {}, // 派出所的上级部门
      curAssistId: '' // 存储列表传递过来的集群战役id
    }
  },
  watch: {
    assistId(val) {
      this.curAssistId = val
      this.query(true)
    }
  },
  methods: {
    init() {
      if (this.assistId) {
        this.curAssistId = this.assistId
      }
      this.query(true)
    },
    enableTo(row) {
      if (this.info.applyDeptCode === this.curDept.depCode) {
        return true
      }
      if (String(this.info.category) === '2') {
        if (this.info.auditDeptCode === this.curDept.depCode) {
          return true
        }
      }
      if (row.receiveDeptCode === this.curDept.depCode || row.parentCode === this.curDept.depCode) {
        return true
      }
      if (this.curDept.depType === '4') { // 派出所
        if (row.receiveDeptCode === this.curDept.parentDepCode || this.info.applyDeptCode === this.curDept.parentDepCode) {
          return true
        }
      }
      return false
    },
    signEnable(row) {
      if (row.receiveDeptCode === this.curDept.depCode) {
        return true
      }
      if (this.curDept.depType === '4') { // 派出所
        if (row.receiveDeptCode === this.curDept.parentDepCode) {
          return true
        }
      }
      return false
    },
    async getParentDept(paramCode) {
      const response = await this.$queryAsyns('hsyzparentdepart/' + paramCode, {}, 'upms')
      if (response.code === '000000') {
        return response.data.departCode
      }
    },
    findParentDept(paramCode) {
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (item.depCode === paramCode) {
          return item
        }
      }
    },
    query(flag) {
      this.listLoading = true
      if (flag) {
        this.page = 1
      }
      const param = {
        assistId: this.curAssistId,
        deptType: this.curDept.depType,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      if (this.info.cityCode !== this.curDept.areaCode) {
        if (this.curDept.depType === '3') {
          param.deptCode = this.curDept.depCode
        }
      }
      if (String(this.showType) === '2') {
        param.deptCode = this.curDept.depCode
        param.parentCode = this.curDept.depCode
        param.deptType = '2'
      } else {
        if (this.curDept.depType === '-1') { // 省
        } else if (this.curDept.depType === '1') { // 总队
          param.parentCode = this.curDept.parentDepCode
        } else if (this.curDept.depType === '2') { // 支队
          param.curDeptCode = this.curDept.depCode
        } else if (this.curDept.depType === '3') { // 大队
          param.curDeptCode = this.curDept.depCode
        } else if (this.curDept.depType === '4') { // 派出所
          if (this.curDept.areaCode === '611400') {
            param.curDeptCode = this.curDept.parentDepCode
            param.deptType = this.findParentDept(this.curDept.parentDepCode).depType
          } else {
            param.curDeptCode = this.curDept.parentDepCode
            param.deptType = this.findParentDept(this.curDept.parentDepCode).depType
          }
        }
      }
      this.$query('caseAssist/signList', param).then((response) => {
        this.listLoading = false
        const arr = response.data.list
        if (String(this.showType) === '1') {
          this.$emit('setSignBtnVisibleH', false)
        }
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          const paramCode = item.receiveDeptCode
          const dept = this.findParentDept(paramCode)
          item.parentCode = dept.parentCode
          if (this.curDept.depType === '4') {
            if (String(item.signStatus) !== '2' && item.receiveDeptCode === dept.depCode && String(this.showType) === '1') {
              this.$emit('setSignBtnVisibleH', true)
            }
          } else {
            if (String(item.signStatus) !== '2' && item.receiveDeptCode === this.curDept.depCode && String(this.showType) === '1') {
              this.$emit('setSignBtnVisibleH', true)
            }
          }
        }
        this.listData = arr
        this.total = response.data.totalCount
        this.pageSize = response.data.pageSize
        if (String(this.showType) === '1') {
          if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
            this.$resetSetItem('assistT2', this.total) // 将总数存在session中
          } else if (this.curDept.depType === '3') { // 区县
            this.$resetSetItem('assistT2', this.total) // 将总数存在session中
          } else if (this.curDept.depType === '4') {
            if (this.curDept.areaCode === '611400') {
              this.$resetSetItem('assistT2', this.total) // 将总数存在session中
            } else {
              this.$resetSetItem('assistT2', this.total) // 将总数存在session中
            }
          }
        } else {
          this.$resetSetItem('assistT4', this.total)
        }
      }).catch(() => {
        if (String(this.showType) === '1') {
          if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
            this.$resetSetItem('assistT2', 0) // 将总数存在session中
          } else if (this.curDept.depType === '3') { // 区县
            this.$resetSetItem('assistT4', 0) // 将总数存在session中
          } else if (this.curDept.depType === '4') {
            if (this.curDept.areaCode === '611400') {
              this.$resetSetItem('assistT2', 0) // 将总数存在session中
            } else {
              this.$resetSetItem('assistT4', 0) // 将总数存在session中
            }
          }
        } else {
          this.$resetSetItem('assistT4', 0)
        }
        this.listLoading = false
        this.initData()
      })
    },
    initData() {
      this.listData = []
      this.total = 0
      this.pageSize = 5
      this.page = 1
    },
    handleCurrentChange(val) { // 涉案信息
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    toClueList(row) {
      const para = {
        id: this.curAssistId,
        type: '',
        assistType: '1',
        deptCode: '',
        receiveDate: row.createDate,
        cityCode: row.receiveDeptCode.substring(0, 6)
      }
      if (this.curDept.depType === '3' || String(this.showType) !== '1') {
        para.deptCode = row.receiveDeptCode
      }
      this.$router.push({ path: '/caseAssist/clueList', query: para })
    },
    handleSign(index, row) { // 签收
      const param = {
        userId: this.curUser.id,
        userName: this.curUser.realName,
        deptCode: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode,
        assistId: row.assistId, // 协查id
        signId: row.assistSignId // 签收表id
      }
      this.$update('caseAssist/signup', param).then((response) => {
        this.$alert('请尽快反馈线索核查情况', '签收成功', {
          type: 'success',
          confirmButtonText: '知道了',
          callback: action => {
            location.reload()
          }
        })
      }).catch(() => {

      })
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (String(this.showType) === '1') {
      if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
        this.title = '地市'
      } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 区县
        if (this.curDept.areaCode === '611400') { // 杨凌例外
          this.title = '地市'
        } else {
          this.title = '区县'
        }
      }
    } else {
      this.title = '区县'
    }
    this.title += '签收表'
    this.init()
  }
}
</script>
<style>
  .caseAssist_areaSign .titlePub {
    font-size: 17px;
    padding: 6px 18px 16px 5px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url(/static/image/personFile_images/titlePub.png) no-repeat center
    center;
    background-size: 100% 65%;
  }
  .caseAssist_areaSign .titlePub .letterSpc {
    letter-spacing: 3px;
  }
  @media only screen and (max-width: 1367px) {
    .caseAssist_areaSign .titlePub .titlePub {
      padding: 6px 3px 16px 5px;
    }
  }
</style>
