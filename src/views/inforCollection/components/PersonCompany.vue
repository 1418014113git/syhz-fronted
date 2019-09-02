<template>
  <div class="PersonCompany">
    <el-table :data="list"  v-loading="listLoading" style="width: 100%;" class="statisticCollect">
      <el-table-column type="index" label="序号" width="54"></el-table-column>
      <el-table-column label="机构单位名称" min-width="10%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row.id)">{{scope.row.DWMC}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="DWDH" label="单位电话" min-width="5%"></el-table-column>
      <el-table-column prop="FRDBXM" label="法人姓名" min-width="5%"></el-table-column>
      <el-table-column prop="ZCDZXZ" label="机构注册地址详址" min-width="10%"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getRYGLQY
} from '@/api/inforCollection'
export default {
  name: 'PersonCompany',
  props: [
    'personId', 'jgbh'
  ],
  data() {
    return {
      list: [],
      listLoading: false,
      JGBH: ''
    }
  },
  methods: {
    getData() {
      this.listLoading = true
      getRYGLQY({
        jgbh: this.JGBH
      }).then((res) => {
        this.listLoading = false
        if (res.code === '000000') {
          this.list = res.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDetail(id) {
      this.$router.push({
        path: '/inforCollection/edit/' + id
      })
    }
  },
  mounted() {
    if (this.jgbh) {
      this.getData()
    }
  },
  watch: {
    jgbh(val) {
      this.JGBH = val
      this.getData()
    }
  }
}
</script>

<style scoped>
</style>
