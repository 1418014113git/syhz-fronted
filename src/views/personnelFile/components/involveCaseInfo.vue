<template>
  <section>
    <div class="ImportInfo">
      <title-pub :title="title" :jumpType="0" :url="moreUrl" :param="moreParam"></title-pub>
      <el-table :data="saxxData" style="width: 100%;" v-loading="caseLoading" class="statisticCollect" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="AJBH" label="案件编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.AJBH}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="AJMC" label="案件名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SYH_FLLB" label="案件类别" show-overflow-tooltip></el-table-column>
        <el-table-column label="案件认领单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <p :title="scope.row.orgName">{{scope.row.orgName}}</p> -->
            {{scope.row.orgName}}
          </template>
        </el-table-column>
        <el-table-column prop="AJZT_NAME" label="案件状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="JYAQ" label="简要案情" min-width="100" show-overflow-tooltip>
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
  </section>
</template>
<script>
import titlePub from './titlePub'
import {
  getAJLBText
} from '@/utils/codetotext'
import {
  getSessionDeptSelect
} from '@/api/depts'
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '涉案信息',
      activeName: 'first',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '152224199005230516',
      saxxData: [], // 涉案信息
      caseLoading: false, // 涉案loading
      pageSize: 5,
      page: 1,
      total: 0,
      depts: getSessionDeptSelect(),
      moreUrl: '/caseManage',
      moreParam: '',
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.moreParam = JSON.stringify({ cardId: this.cardNumber })
      this.handleSaxx(true)
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    init() {
      if (this.cardId) {
        this.cardNumber = this.cardId
        this.moreParam = JSON.stringify({ cardId: this.cardId })
      }
      this.handleSaxx(true)
    },
    handleSaxx(flag) {
      this.caseLoading = true
      var param = {
        cardNumber: this.cardNumber,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('page/personallcase', param).then((res) => {
        if (res.code === '000000') {
          this.caseLoading = false
          this.saxxClicked = true
          if (res.code === '000000') {
            this.saxxData = res.data.list
            this.total = res.data.totalCount
            this.pageSize = res.data.pageSize
            this.$resetSetItem('t2', this.total) // 将总数存在session中
            for (let i = 0; i < this.saxxData.length; i++) {
              if (this.saxxData[i]['SYH_FLLB']) {
                this.saxxData[i]['SYH_FLLB'] = this.getFllbName(this.saxxData[i]['SYH_FLLB'])
              }
              if (this.saxxData[i]['notice_org_id']) {
                this.saxxData[i]['orgName'] = this.getDeptName(this.saxxData[i]['notice_org_id'])
              }
            }
          } else {
            this.$resetSetItem('t2', 0) // 将总数存在session中
          }
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    getFllbName(fllb) {
      if (fllb && fllb.indexOf(',') > -1) {
        const array = fllb.split(',')
        let text = ''
        for (let i = 0; i < array.length; i++) {
          text += '，' + getAJLBText(array[i])
        }
        return text.substring(1, text.length)
      } else {
        return getAJLBText(fllb)
      }
    },
    handleCurrentChange(val) { // 涉案信息
      this.page = val
      this.handleSaxx(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.handleSaxx(false)
    },
    getDeptName(id) {
      if (id) {
        for (let i = 0; i < this.depts.length; i++) {
          const dept = this.depts[i]
          if (String(dept.id) === id) {
            return dept['name']
          }
        }
      }
      return ''
    },
    handleAjDetail(index, row) {
      // this.$router.push({ path: '/caseManage/detailSyh/' + row.id })
      this.$router.push({
        path: '/caseFile/index', query: { id: row.id }
      })
    }

  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
