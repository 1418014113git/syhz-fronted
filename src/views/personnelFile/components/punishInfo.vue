<template>
  <section>
    <!-- 行政处罚信息 -->
    <div class="ImportInfo">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="xzcfData" style="width: 100%;" v-loading="punishLoading" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="立案日期" width="170">
          <template slot-scope="scope">
            {{$handlerDateTime(scope.row.larq)}}
          </template>
        </el-table-column>
        <el-table-column prop="ajbh" label="处罚依据" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row.ajmc}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="xzcflbName" label="处罚种类" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xzcfje" label="罚款数额（万元）" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jyaq" label="主要违法行为" show-overflow-tooltip></el-table-column>
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
import { getThousandNum } from '@/utils/public'
export default {
  props: ['cardId'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '行政处罚信息',
      curUser: {},
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      // cardId: '110112199008071856',
      xzcfData: [], // 行政处罚
      punishLoading: false, // 行政处罚loading
      pageSize: 5,
      page: 1,
      total: 0,
      depts: getSessionDeptSelect(),
      cardNumber: '' // 存储身份证号
    }
  },
  watch: {
    cardId(val) {
      this.cardNumber = val
      this.handleXzcf(true)
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    init() {
      this.cardNumber = this.cardId
      this.handleXzcf(true)
    },
    handleXzcf(flag) {
      this.punishLoading = true
      var param = {
        cardNumber: this.cardNumber,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('page/personallxzcf', param).then((res) => {
        if (res.code === '000000') {
          this.punishLoading = false
          if (res.code === '000000') {
            var list = res.data.list
            for (let index = 0; index < list.length; index++) {
              var element = list[index]
              element.xzcfje = getThousandNum((element.xzcfje / 10000).toFixed(2))
            }
            this.xzcfData = list
            this.total = res.data.totalCount
            this.pageSize = res.data.pageSize
            this.$resetSetItem('t3', this.total) // 将总数存在session中
          } else {
            this.$resetSetItem('t3', 0) // 将总数存在session中
          }
        }
      }).catch(() => {
        this.punishLoading = false
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
      this.handleXzcf(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.handleXzcf(false)
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
    formatTime(date) {
      if (date) {
        date = this.$handlerDateTime(date)
        return this.$parseTime(new Date(date), '{y}-{m}-{d} {h}:{i}')
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
