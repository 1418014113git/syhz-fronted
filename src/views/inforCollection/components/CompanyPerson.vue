<template>
  <div class="CmpanyPerson">
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-input size="small" clearable v-model="xm" placeholder="姓名" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true,true)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list"  v-loading="listLoading" style="width: 100%;" class="statisticCollect">
      <el-table-column type="index" label="序号" width="54"></el-table-column>
      <el-table-column prop="XM" label="姓名" min-width="5%"></el-table-column>
      <el-table-column prop="XB_NAME" label="性别" min-width="3%"></el-table-column>
      <el-table-column prop="MZ_NAME" label="民族" min-width="3%"></el-table-column>
      <el-table-column prop="ZJHM" label="证件号码" min-width="7%">
        <template slot-scope="scope">
          <span class="zjhm" v-if="scope.row.ZJHM" @click="handlePersonDetailAll(scope.row.ZJHM)">{{scope.row.ZJHM}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="LXDH" label="联系电话" min-width="5%"></el-table-column>
      <el-table-column prop="HJDSSXQ_NAME" label="户籍地区" min-width="10%"></el-table-column>
      <el-table-column prop="HJDXZ" label="人员户籍地详址" min-width="15%"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle @click="handleDetail(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                   :page-size="pageSize" :total="total" :current-page="pageNum" style="float:right;">
    </el-pagination>
  </div>
</template>

<script>
import {
  getQyGLRY
} from '@/api/inforCollection'
export default {
  name: 'CmpanyPerson',
  props: [
    'bh'
  ],
  data() {
    return {
      list: [],
      listLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      xm: ''
    }
  },
  methods: {
    getData(hand) {
      this.listLoading = true
      var param = {
        jgbh: this.bh,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        XM: this.xm
      }
      if (hand) {
        param.logFlag = 1
      }
      getQyGLRY(param).then((res) => {
        this.listLoading = false
        if (res.code === '000000') {
          this.list = res.data.list
          this.total = res.data.totalCount
          if (this.list.length === 0) {
            this.$emit('listenPer', '0')
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData(true)
    },
    query(flag, hand) {
      if (flag) {
        this.pageNum = 1
      }
      this.getData(hand)
    },
    handleDetail(id) {
      this.$router.push({
        path: '/inforCollection/personnelEdit',
        query: {
          id: id
        }
      })
    },
    handlePersonDetailAll(number) { // 跳转人员档案
      this.$router.push({
        path: '/personnelFile/index', // 升级版人员档案
        query: { cardId: number }
      })
    }
  },
  mounted() {
    if (!this.bh) {
      this.getData()
    }
  },
  watch: {
    bh(val) {
      if (val) {
        this.getData()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.zjhm {
  cursor: pointer;
}
.zjhm:hover {
  color: #3da1ff;
}
</style>
