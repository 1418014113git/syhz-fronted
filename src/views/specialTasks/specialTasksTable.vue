<template>
 <div class="zxrwtable">
    <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;">
      <el-table-column prop="col1" label="填报项目"  width="131" align="center"></el-table-column>
      <el-table-column prop="col2" label="" width="88" align="center"></el-table-column>
      <template v-for="item in tableHead">
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :key="item.id"
        align="center">
      </el-table-column>
    </template>
    </el-table>
 </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {

  },
  data() {
    return {
      tableHead: [ // 表头数据
        {
          id: '01',
          label: '制售假劣食品案件',
          prop: 'col3'
        },
        {
          id: '02',
          label: '制售假劣药品案件（含化妆品、医疗器械材料案件）',
          prop: 'col4'
        },
        {
          id: '03',
          label: '制售假劣农资案件',
          prop: 'col5'
        },
        {
          id: '04',
          label: '烟草打假打私案件',
          prop: 'col6'
        },
        {
          id: '05',
          label: '制售假劣建材案件',
          prop: 'col7'
        },
        {
          id: '06',
          label: '其他制售假劣商品案件',
          prop: 'col8'
        }
      ],
      tableData: [
        { id: 1, col1: '立案（起）', col2: '行政部门移送案件数' },
        { id: 2, col1: '立案（起）', col2: '本月数' },
        { id: 3, col1: '立案（起）', col2: '累计数' },
        { id: 4, col1: '发起集群战（起）', col2: '本月数' },
        { id: 5, col1: '发起集群战（起）', col2: '累计数' },
        { id: 6, col1: '发起集群战（起）', col2: '线索条数' },
        { id: 7, col1: '参与集群战（起）', col2: '本月数' },
        { id: 8, col1: '', col2: '累计数' },
        { id: 9, col1: '', col2: '线索条数' },
        { id: 10, col1: '抓获人员（人）', col2: '本月数' },
        { id: 11, col1: '抓获人员（人）', col2: '累计数' },
        { id: 12, col1: '抓获人员（人）', col2: '' },
        { id: 13, col1: '刑事拘留人数（人）', col2: '本月数' },
        { id: 14, col1: '刑事拘留人数（人）', col2: '累计数' },
        { id: 15, col1: '刑事拘留人数（人）', col2: '' },
        { id: 16, col1: '批准逮捕（人）', col2: '本月数' },
        { id: 17, col1: '批准逮捕（人）', col2: '累计数' },
        { id: 18, col1: '批准逮捕（人）', col2: '' },
        { id: 19, col1: '移送起诉（人）', col2: '本月数' },
        { id: 20, col1: '移送起诉（人）', col2: '累计数' },
        { id: 21, col1: '移送起诉（人）', col2: '' },
        { id: 22, col1: '涉案金额（万元）', col2: '本月数' },
        { id: 23, col1: '涉案金额（万元）', col2: '累计数' }
      ]
    }
  },
  computed: {
    // ...mapGetters([
    //   'curAppName'
    // ])
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
