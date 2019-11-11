<template>
  <section class="jqzyDisib">
   <!--线索分发-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="接收单位">
          <el-input v-model="filters.departName" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="协查情况">
          <el-select  v-model="filters.xcqk" size="small" placeholder="全部" clearable>
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="线索序号">
          <el-input v-model="filters.sort" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select  v-model="filters.type" size="small" placeholder="全部" clearable>
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('type')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
         <el-form-item label="分发状态">
          <el-select  v-model="filters.status" size="small" placeholder="全部" clearable>
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>

         <el-form-item>
          <el-button type="primary" size="small"  @click="handleCancel">取消分发</el-button>
        </el-form-item>

         <el-form-item>
          <el-button type="primary" size="small"  @click="handleDel">删除线索</el-button>
        </el-form-item>



      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="">
          <span>已选<span style="">{{xsNum}}</span>条线索，</span>
        </el-form-item>
        <el-form-item label="接收单位">
          <el-select  v-model="departNameSelect" size="small" placeholder="请选择" clearable  class="inputW">
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="distribute">线索分发</el-button>
        </el-form-item>
        <el-form-item>
          <el-popover
          placement="right"
          width="300"
          trigger="hover">
            <div>
              <p>线索分发步骤：</p>
              <p>1、列表勾选需要分发线索。</p>
              <p>2、选择线索接收单位。</p>
              <p>3、点击【线索分发】，向接收单位分发线索。</p>
            </div>
            <el-button  type="primary" size="small" slot="reference"><svg-icon icon-class="wenhao"></svg-icon> 分发步骤</el-button>
          </el-popover>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class=""  @select="handleselectRow" @select-all="handleselectAll">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="" align="center" label='线索序号'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='接收单位'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='线索分类'  min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column v-for="(item, index) in tableHead" :key="index" :label="item.label" :prop="item.prop" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" title="取消分发"  type="primary" circle  @click="handleCancel(scope.$index, scope.row)"><svg-icon icon-class="quxiao"></svg-icon></el-button>
          <el-button size="mini" title="删除线索" type="primary" icon="el-icon-delete" circle  @click="handleDel(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

     <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
export default {
  props: ['cardId', 'isShowDialog'],
  name: 'jqzyDisib',
  components: {
  },
  data() {
    return {
      filters: {
        departName: '', // 接收单位
        address: '', // 地址
        xcqk: '', // 核查情况
        sort: '', // 线索序号
        type: '', // 分类
        status: '' // 分发状态
      },
      departNameSelect: '', // 下拉框选择的接收单位
      xsNum: 0, // 选择的线索条数
      checkId: [], // 复选框选中的列表id
      checkIdRow: [], // 存储当前行被点击选中的项
      listData: [], // 线索列表
      listLoading: false, // 列表加载loading
      total: 0,
      page: 1,
      pageSize: 15,
      // xzqhOptions: [], // 行政区划数据
      // deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null,
      tableHead: [ // 表头
        {
          prop: 'para1',
          label: '线索1'
        },
        {
          prop: 'para2',
          label: '线索2'
        }
      ]
    }
  },
  watch: {
    // cardId(val) {
    //   this.cardNumber = val
    // },
    isShowDialog: {
      handler: function(val, oldeval) {
        // this.query(true)
      }
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        address: this.filters.address, // 地址
        departName: this.filters.departName,	// 接收单位
        xcqk: this.filters.xcqk, // 协查情况
        sort: this.filters.sort, //  序号
        type: this.filters.type, // 分类
        status: this.filters.status, // 分发状态
        pageNum: this.page, // 页数
        pageSize: this.pageSize // 条数
      }
      // if (this.area && this.area.length > 0) { // 行政区划
      //   para.provinceCode = this.area[0] || '' // 省code
      //   para.cityCode = this.area[1] || '' // 市code
      //   para.reginCode = this.area[2] || '' // 区code
      // } else {
      //   para.provinceCode = '' // 省code
      //   para.cityCode = '' // 市code
      //   para.reginCode = '' // 区code
      // }
      // if (this.department && this.department.length > 0) { // 单位机构
      //   para.departCode = this.department[this.department.length - 1] || '' // 部门code
      // } else {
      //   para.departCode = ''
      // }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list
          this.$nextTick(function() {
            this.memoryChecked() // 记忆复选框被选中的列表
          })
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.listData = []
    },
    handleDel(index, row) { // 删除线索
      // this.curRow = row
      this.$confirm('确定要删除线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          // equipNumber: row.detailNumber,
          // delFlage: 1,
          // purchaseTime: row.detailNumber ? row.purchaseTime : '',
          // userId: JSON.parse(sessionStorage.getItem('userInfo')).id, // 用户id
          // userName: JSON.parse(sessionStorage.getItem('userInfo')).realName // 用户真实姓名
        }
        this.$update('' + row.dtatilId, param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.initData()
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCancel(index, row) { // 取消分发
      this.$confirm('确定要取消分发到该单位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          // equipNumber: row.detailNumber,
          // delFlage: 1,
          // purchaseTime: row.detailNumber ? row.purchaseTime : '',
          // userId: JSON.parse(sessionStorage.getItem('userInfo')).id, // 用户id
          // userName: JSON.parse(sessionStorage.getItem('userInfo')).realName // 用户真实姓名
        }
        this.$update('' + row.dtatilId, param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          this.initData()
          this.query(true)
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    distribute() { // 线索分发
      if (this.checkId.length > 0 && this.departNameSelect) {
        const param = {

        }
        this.$update('', param).then((response) => {
          this.$confirm('线索分发成功', '', {
            confirmButtonText: '继续分发',
            cancelButtonText: '完成分发',
            type: 'success'
          }).then(() => { // 继续分发

          }).catch(() => { // 完成分发
            this.$emit('closeDialog', false) // 关闭弹
          })
        }).catch(() => {

        })
      } else if (this.checkId.length === 0) { // 未勾选线索列表
        this.$message.error('请选择“线索”后分发线索。')
      } else if (!this.departNameSelect) { // 未选接收单位
        this.$message.error('请选择“线索”后分发线索。')
      }
    },
    // handleDelete(index, row) { // 删除
    //   this.$confirm('是否删除该装备信息！', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.listLoading = true
    //     const param = {
    //       equipNumber: row.detailNumber,
    //       delFlage: 1,
    //       purchaseTime: row.detailNumber ? row.purchaseTime : '',
    //       userId: JSON.parse(sessionStorage.getItem('userInfo')).id, // 用户id
    //       userName: JSON.parse(sessionStorage.getItem('userInfo')).realName // 用户真实姓名
    //     }
    //     this.$update('basicequipdetail/' + row.dtatilId, param).then((response) => {
    //       this.listLoading = false
    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       })
    //       this.initData()
    //       this.query(true)
    //     }).catch(() => {
    //       this.listLoading = false
    //     })
    //   }).catch(() => {
    //     this.listLoading = false
    //     // this.$message({
    //     //   type: 'info',
    //     //   message: '已取消'
    //     // })
    //   })
    // },
    resetForm() { // 重置
      this.filters = {
        address: '', // 地址
        departName: '', // 接收单位
        xcqk: '', // 协查情况
        sort: '', // 序号
        type: '' // 分类
      }
      this.initData()
      this.query(true)
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      this.checkIdRow = []
      if (selection.length > 0) {
        selection.forEach((item, index) => {
          this.checkIdRow.push(item.id)
        })
      }

      if (this.checkId.length === 0 && selection.length > 0) {
        this.checkId.push(row.id)
      } else {
        var checkId_ = this.checkId
        checkId_.forEach((id) => {
          if (row.id === id) {
            this.removeByValue(this.checkId, row.id)
          } else {
            if (!this.temp(row.id)) {
              this.checkId.push(row.id)
            }
          }
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    handleselectAll(selection) {
      var allSelect = selection
      if (selection.length > 0) {
        var checkId_1 = this.checkId
        allSelect.forEach((item, index) => {
          checkId_1.forEach((it, i) => {
            if (it !== item) {
              if (!this.temp(item.id)) {
                this.checkId.push(item.id)
              }
            }
          })
        })
        if (this.checkId.length === 0) {
          allSelect.forEach((item, i) => {
            this.checkId.push(item.id)
          })
        }
      } else {
        this.listData.forEach((item) => {
          this.checkId.forEach((it) => {
            if (item.id === it) {
              this.removeByValue(this.checkId, item.id)
            }
          })
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    removeByValue(arr, val) { // 去重
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
        }
      }
    },
    temp(id) {
      if (this.checkId.indexOf(id) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 记忆函数
    memoryChecked() {
      // console.log('jiyi', JSON.stringify(this.checkId))
      if (this.listData.length > 0) {
        this.listData.forEach((item, index) => {
          if (this.checkId.indexOf(item.id) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.tableHeight = ''
    // this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // this.query(true)
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.jqzyDisib{
  padding: 0 10px;
  .el-dialog__body {
    padding: 10px 0 15px 20px;
  }
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .inputW{
    width: 400px;
  }
}
</style>
