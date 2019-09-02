<template>
  <section>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="AJBH" label="案件编号" min-width="6%"></el-table-column>
      <el-table-column prop="AJMC" label="案件名称" min-width="10%"></el-table-column>
      <el-table-column prop="JYAQ" label="简要案情" min-width="20%"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import {
  getQyGLAJ
} from '@/api/inforCollection'

export default {
  name: 'InvolvedCase',
  props: [
    'bh'
  ],
  data() {
    return {
      listLoading: false,
      list: []
    }
  },
  methods: {
    getAJList() {
      getQyGLAJ({
        jgbh: this.bh
      }).then((res) => {
        if (res.code === '000000' && res.data.list) {
          this.list = res.data.list
          if (this.list.length === 0) {
            this.$emit('listenCase', '0')
          }
        }
      })
    }
  },
  mounted() {
    if (!this.bh) {
      this.getAJList()
    }
  },
  watch: {
    bh(val) {
      if (val) {
        this.getAJList()
      }
    }
  }
}
</script>

<style scoped>
</style>
