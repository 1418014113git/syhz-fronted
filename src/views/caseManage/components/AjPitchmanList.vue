<template>
  <div class="goodsInfo">
    <el-card class="cont-card" shadow="never">
      <el-table ref="goodTable" :data="data">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="摊贩名称">
          <template slot-scope="scope">
            <span @click="handlePitDetail(scope.row)" style="cursor: pointer;">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="负责人"></el-table-column>
        <el-table-column prop="cardNumber" label="身份证号码" width="190px">
          <template slot-scope="scope">
            <p  @click="showTipsC(scope.row.cardNumber)">{{scope.row.cardNumber}}&nbsp;</p>
          </template>
        </el-table-column>
        <el-table-column prop="registerNumber" label="备案登记号"></el-table-column>
        <el-table-column prop="type" label="分类等级"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="manageProject" label="经营项目"></el-table-column>
      </el-table>
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
       <card-com v-if="showCardCom" class="cardcom" :cardId="curCardId" @close="clickBlank"></card-com>
    </el-card>
  </div>
</template>

<script>
import cardCom from '@/components/idCardTips' // 身份证号码点击弹出菜单功能
export default {
  name: 'EnterpriseInfo',
  components: { cardCom },
  props: ['ajbh', 'ajid'],
  data() {
    return {
      page: 1,
      total: 0,
      pageSize: 4,
      data: [],
      rowData: {},
      AJBH: '',
      curCardId: '', // 当前被点击的身份证号
      showCardCom: false // 身份证查询旁的快捷查询组件
    }
  },
  methods: {
    formatTime(time) {
      return this.$handlerDateTime(time)
    },
    init() {
      var param = {
        ajbh: this.AJBH,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$query('page/ajdadwpitchman', param).then((response) => {
        if (response.code === '000000') {
          this.data = response.data.list
          this.total = response.data.totalCount
          if (this.data.length > 0) {
            this.rowData = this.data[0]
            this.$emit('pitchmanList', this.total)
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
    handlePitDetail(row) {
      this.$gotoid('/inforCollection/comPedlarDetail', JSON.stringify({ id: row.pitchmanId, ajId: this.ajid, type: 'ajDetail' }))
    },
    showTipsC(val) {
      this.curCardId = val
      if (!this.showCardCom) {
        this.showCardCom = true
      }
    },
    clickBlank() {
      this.showCardCom = false
    }
  },
  mounted() {
    if (this.ajbh) {
      this.AJBH = this.ajbh
      this.init()
    }
  },
  watch: {
    ajbh(val) {
      this.AJBH = val
      this.init()
    }
  }
}
</script>

<style scoped>
.goodsInfo .title {
  text-align: right;
}

.goodsInfo .row {
  padding: 10px 0;
}
.cardcom{
  position: absolute;
  top: 16px;
  left: 36%;
}
@media only screen and (max-width: 1366px) {
  .cardcom {
    left: 40%;
  }
}
</style>
