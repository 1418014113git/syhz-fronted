<template>
  <section>
    <el-form :inline="true" :model="filterQuery" size="small" label-position="left" label-width="76px">
      <el-form-item label="案件类别" prop="ajlbCode">
          <el-select :clearable="true" v-model="filterQuery.ajlbCode" size="small" placeholder="请选择" filterable @change="ajlbChange">
            <el-option v-for="item in ajlbData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="选择单位"  prop="deptCodes">
          <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptions"
              v-model="filterQuery.deptCodes"
              :props="deptProps"
              :show-all-levels=false
              change-on-select
              @change="handleDeptChange"
              clearable placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
      <el-form-item label="状态" prop="enable">
        <el-select @change="onchangeStatus" v-model="filterQuery.enable" clearable placeholder="请选择" size="small">
          <el-option
            v-for="(item,index) in statusData"
            :value="item.value"
            :label="item.label"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域编号" prop="areaCode" label-width="120px">
         <el-input v-model.trim="filterQuery.areaCode" auto-complete="off" clearable maxlength="50"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="clearForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="toAdd">发布</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="loading" style="width: 100%" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="caseName" label="案件类别名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="案件类别编号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deptCode" label="部门编号" min-width="100"></el-table-column>
      <el-table-column prop="deptName" label="部门名称" min-width="150">
      </el-table-column>
      <el-table-column prop="enable" label="状态" min-width="100">
        <template slot-scope="scope">
            <span v-if="scope.row.enable==0" >停用</span>
            <span v-if="scope.row.enable==1" >启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaCode" label="所属区域编号" min-width="100"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">

          <el-button type="primary" size="small" v-on:click="toEdit(scope.row)">修改</el-button>
          <!-- <el-button type="primary"  @click="changeStatus(scope.row)" v-if="scope.row.enable===1">停用</el-button>
          <el-button type="primary"   @click="changeStatus(scope.row)" v-if="scope.row.enable===0">启用</el-button> -->
            <el-button type="primary" size="small" v-on:click="HandleDelete(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-col :span="24" class="toolbar">
      <el-pagination
        v-if="total > 0"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15,30,50,100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :total="total"
        :current-page="page"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  data() {
    return {
      loading: false, // 列表loading
      statusData: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        }
      ],

      filterQuery: {
        deptCode: '',
        enable: '',
        areaCode: '',
        ajlbCode: '',

        deptCodes: []
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' },
      deptOptions: [], // 部门数据
      curDept: {}, // 当前部门
      ajlbData: [], // 案件类别
      listData: [],
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null
    }
  },

  methods: {
    handleDeptChange(val) { // 发布单位
      // console.log(val)
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.selectCurDep = { name: '' }
      }

      this.filterQuery.deptCode = this.selectCurDep.depCode
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['depCode']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parentCode']]
        if (key && key.depType !== '4') { // 去掉派出所的层级
          if (!key['children']) {
            if (treeArray[i].depType !== '4') {
              key['children'] = []
              key['children'].push(treeArray[i])
            }
          } else {
            if (treeArray[i].depType !== '4') {
              key['children'].push(treeArray[i])
            }
          }
        } else {
          if (treeArray[i].depType !== '4') {
            r.push(treeArray[i])
          }
        }
      }
      return r
    },
    initAjlb() { // 初始化案件类别
      this.$query('AJLBCODE', {}).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbData = response.data
        }
      }).catch(() => {
      })
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false, true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    ajlbChange(val) {
      if (val) {
        let obj = {}
        obj = this.ajlbData.find((item) => {
          return item.code === val
        })
        this.filterQuery.ajlbName = obj.name
      } else {
        this.filterQuery.ajlbName = ''
      }
    },

    onchangeStatus(val) {
    },

    query(flag, hand) {
      this.loading = true
      this.page = flag ? 1 : this.page
      var param = {

        code: this.filterQuery.ajlbCode,
        deptCode: this.filterQuery.deptCode,
        areaCode: this.filterQuery.areaCode,
        enable: this.filterQuery.enable,
        pageNum: this.page,
        pageSize: this.pageSize
      }

      if (hand) {
        param.logFlag = 1 // 是否写日志
      }
      this.$query('page/ajdeptmapping', param).then(response => {
        this.loading = false
        this.listData = response.data.list
        this.pageSize = response.data.pageSize
        this.page = response.data.pageNum
        this.total = response.data.totalCount
      }).catch(() => {
        this.loading = false
      })
    },
    clearForm() {
      this.filterQuery = {}
      this.selectCurDep = {}
      this.query(true, true)
    },
    toAdd() {
      // 添加
      this.$gotoid('/ajdeptreceive/save')
    },
    toEdit(row) {
      // 修改
      this.$gotoid('/ajdeptreceive/edit', row.id)
    },
    HandleDelete(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$remove('/ajdeptmapping/' + row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query()
        })
      }).catch(() => {
      })
    }
    // 修改状态
    // changeStatus(row) {
    //   var enable
    //   if (row.enable === 1) {
    //     enable = '0'
    //   } else if (row.enable === 0) {
    //     enable = '1'
    //   }
    //   this.$update('sysnotice/' + row.id, {
    //     enable: enable,
    //     logFlag: 1 // 是否写日志
    //   }).then(res => {
    //     this.btnLoading = false
    //     if (res.code === '000000') {
    //       this.$message({ message: '状态修改成功', type: 'success' })
    //       this.querySysNotice(true)
    //     }
    //   }).catch(() => {
    //     this.btnLoading = false
    //   })
    // }
  },
  components: {},

  mounted() {
    var dept = this.getTree(JSON.parse(sessionStorage.getItem('DeptSelect')))
    this.deptOptions = dept

    this.initAjlb()
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.examNoticeContainer .el-dialog__body {
  padding: 30px 20px 30px 10px;
}
.name {
  top: 412px;
  left: 265px;
}

.comment_inner {
  width: 200px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 3; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
#noticecontentdiv {
  font-size: 14px;
}
.noticeellipsis-words {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
