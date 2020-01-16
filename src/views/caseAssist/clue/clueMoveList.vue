<template>
  <section class="clueMoveList">
      <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" :max-height="tableHeight">
        <el-table-column type="index" width="60" label="序号" ></el-table-column>
        <el-table-column prop="createName" label='操作单位' min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creatorName" label='操作人' min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime"  label='操作时间'  min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optCategory"  label='操作内容'  min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{getClueRecordTypeName(scope.row.optCategory)}}
          </template>
        </el-table-column>
        <el-table-column prop="receiveName" label='接收单位' min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label='原因' min-width="250" show-overflow-tooltip></el-table-column>
      </el-table>
  </section>
</template>

<script>
export default {
  name: 'clueMoveList',
  props: ['assistId', 'qbxsId'],
  data() {
    return {
      curAssistId: this.assistId,
      curQbxsId: this.qbxsId,
      listData: [],
      listLoading: false,
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      tableHeight: null,
      clueRecordTypeArr: []
    }
  },
  watch: {
    assistId: function(assistId) {
      this.curAssistId = assistId
      this.query()
    },
    qbxsId: function(qbxsId) {
      this.curQbxsId = qbxsId
      this.query()
    }
  },
  methods: {
    query() {
      this.listLoading = true
      const para = {
        assistType: 1,
        assistId: this.curAssistId,
        qbxsId: this.curQbxsId
      }
      this.$query('caseassistclue/ajglQbxsRecord', para).then(response => {
        this.listLoading = false
        this.listData = response.data
      }).catch(() => {
        this.listLoading = false
      })
    },
    getClueRecordTypeName(val) {
      for (let i = 0; i < this.clueRecordTypeArr.length; i++) {
        const item = this.clueRecordTypeArr[i]
        if (String(item.code) === String(val)) {
          return item.codeName
        }
      }
    },
    initClueRecordType() {
      this.$query('tcpcode', { codeLx: 'qbxsjl' }).then((response) => {
        this.clueRecordTypeArr = response.data
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 320
    this.initClueRecordType()
    this.query()
  }
}
</script>

<style>
  .clueMoveList .el-table--border, .el-table--group {
    border: 0;
  }
  .clueMoveList .el-table--border td, .clueMoveList .el-table--border th, .clueMoveList .el-table__body-wrapper{
    border-right: 0;
  }
  .clueMoveList .el-table--border th, .clueMoveList .el-table__fixed-right-patch {
    border-bottom: 0;
  }

  .clueMoveList .el-table--border::after,
  .clueMoveList .el-table--group::after {
    width: 0;
  }
  .clueMoveList .tableBox{
    width: 100%;
    overflow: auto;
  }
</style>
