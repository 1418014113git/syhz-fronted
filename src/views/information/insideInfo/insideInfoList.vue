<template>
  <section class="insideInfo">
    <el-form :inline="true" :model="filters" ref="filters" label-width="106px">
      <el-form-item label="信息分类">
        <el-select v-model="filters.artGroup" placeholder="全部" clearable style="width: 222px">
          <el-option label="环境" value="3"></el-option>
          <el-option label="食品" value="1"></el-option>
          <el-option label="药品" value="2"></el-option>
          <el-option label="综合" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信息类别">
        <el-select v-model="filters.artType" placeholder="全部" clearable style="width: 222px">
          <el-option v-for="item in artTypeData" :key="item.index" :label="item.extractName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="确认状态">
        <el-select v-model="filters.status" placeholder="全部" clearable style="width: 222px">
          <el-option label="已确认" value="1"></el-option>
          <el-option label="未确认" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(true, true)" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <div :span="24" v-loading="loading">
      <el-card class="box-card" >
        <div slot="header">
          <span>平台为您找到相关结果约  {{ thousSplit(total) }} 个</span>
        </div>
        <div class="insideInfo_content" style="overflow:auto;" :style="{maxHeight:tableHeight}" v-if="dataList.length > 0">
          <div v-for="item in dataList" :key="item.value" class="lineStyle">
            <div class="title">
              <div @click='detail(item.id)'>{{ item.artTitle }}</div>
              <span :class="'type' + item.artGroup">{{ item.artGroup ? getType(String(item.artGroup)) : '' }}</span><span :style="'background:' + item.extractColor">{{ item.extractName }}</span>
              <div>
                <el-button v-if="String(item.status) === '0' && $isViewBtn('102903')" type="primary" @click="handleConfirm(item)">确认</el-button>
                <el-button v-if="String(item.status) === '1' && $isViewBtn('102902')" type="primary" @click="handlerMove(item)">移动</el-button>
                <el-button v-if="$isViewBtn('102904')" type="primary" @click="handlerRemove(item)">删除</el-button>
              </div>
            </div>
            <div @click='detail(item.id)' class="content content_ellipsis" v-html="item.artContent.replace(/&nbsp;/g, '')"></div>
          </div>
        </div>
        <div v-else style="text-align: center; min-height: 150px; line-height: 150px;">
          暂无数据
        </div>
      </el-card>
      <el-col :span="24" class="toolbar">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                       :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
    <el-dialog title="请选择信息移动目的" :visible.sync="moveDialogVisible" :close-on-click-modal="false" class="move_dialog" @close="closeDialog">
      <el-form :model="moveForm" ref="moveForm" :rules="moveFormRules" label-width="100px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-select v-model="moveForm.moduleName" placeholder="全部" clearable style="width: 100%;" @change="handleChange">
            <el-option label="知识库" value="1"></el-option>
            <el-option label="网上培训" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块类别" prop="moduleType">
          <el-select v-if="moveForm.moduleName === '1'" v-model="moveForm.moduleType" placeholder="全部" clearable style="width: 100%;">
            <el-option label="法律法规" value="1"></el-option>
            <el-option label="行业标准" value="2"></el-option>
            <el-option label="规范制度" value="3"></el-option>
            <el-option label="案例指引" value="4"></el-option>
          </el-select>
          <el-select v-if="moveForm.moduleName === '2'" v-model="moveForm.moduleType" placeholder="全部" clearable style="width: 100%;">
            <el-option label="在线课堂" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="cancelBtn">取消</el-button>
        <el-button type="primary" @click="executeMove" class="saveBtn" :loading="moveBtnLoading">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      filters: {
        artGroup: '',
        artType: '',
        status: ''
      },
      artTypeData: [],
      loading: false,
      total: 0,
      page: 1,
      pageSize: 15,
      dataList: [],
      tableHeight: null,
      moveForm: {
        moduleName: '1',
        moduleType: ''
      },
      moveDialogVisible: false,
      moveBtnLoading: false,
      moveFormRules: {
        moduleName: [{ required: true, message: '请选择模块名称', trigger: 'change' }],
        moduleType: [{ required: true, message: '请选择模块类别', trigger: 'change' }]
      }
    }
  },
  methods: {
    getType(val) {
      if (val === '1') {
        return '食品'
      }
      if (val === '2') {
        return '药品'
      }
      if (val === '3') {
        return '环境'
      }
      if (val === '4') {
        return '综合'
      }
    },
    getCategory(val) {
      if (val === '1') {
        return '安全知识'
      }
      if (val === '2') {
        return '政策法规'
      }
      if (val === '3') {
        return '典型案例'
      }
    },
    thousSplit(val, floatFlag) {
      // if (val.indexOf('.') <= -1) {
      //   val = val + '.00'
      // }
      val = String(val)
      val = val.replace(/\s+/g, '').replace(/[\s|\~|`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\|\[|\]|\{|\}|\;|\:|\"|\'|\。|\,|\<|\，|\>|\/|\?]/g, '')
      const re = /\d{1,3}(?=(\d{3})+$)/g
      const n1 = val.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2, s3) {
        return s1.replace(re, '$&,') + s2
      })
      return n1
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(true, true)
    },
    query(flag, hand) {
      this.loading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        artGroup: this.filters.artGroup,
        artType: this.filters.artType,
        status: this.filters.status,
        pageSize: this.pageSize
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
        $('.insideInfo_content').animate({ scrollTop: 0 }, 0)
      }
      this.$query('page/reptileinfo', para).then(response => {
        this.loading = false
        this.dataList = response.data.list
        this.total = response.data.totalCount
        this.page = response.data.pageNum
        this.pageSize = response.data.pageSize
      }).catch(() => {
        this.loading = false
      })
    },
    detail(id) {
      this.$gotoid('/insideInfo/insideInfoDetail', JSON.stringify({ id: id }))
    },
    handleConfirm(item) {
      this.$update('reptileinfostatus/' + item.id, { status: 1 }).then(response => {
        this.$alert('信息资源《' + item.artTitle + '》已开放并供大家查阅', '温馨提示', {
          confirmButtonText: '知道了',
          callback: action => {
            this.query(false, false)
          }
        })
      })
    },
    handlerMove(item) {
      this.moveDialogVisible = true
      this.moveForm.id = item.id
    },
    handlerRemove(item) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          userId: this.curUser.id
        }
        this.$update('reptileinfoenable/' + item.id, para).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query()
        })
      }).catch(() => {
      })
    },
    closeDialog() {
      this.moveDialogVisible = false
      this.moveForm = {
        moduleName: '1',
        moduleType: ''
      }
      if (this.$refs.moveForm) {
        this.$refs.moveForm.resetFields()
      }
    },
    executeMove() {
      this.moveBtnLoading = true
      this.$refs.moveForm.validate(valid => {
        if (valid) {
          const para = {
            moduleName: this.moveForm.moduleName,
            moduleType: this.moveForm.moduleType,
            moveId: this.moveForm.id,
            source: 'insideInfo',
            filters: this.filters
          }
          this.moveBtnLoading = false
          if (String(this.moveForm.moduleName) === '1') {
            this.closeDialog()
            this.$gotoid('/insideInfo/insideInfoToK', JSON.stringify(para))
          } else {
            this.closeDialog()
            this.$gotoid('/insideInfo/insideInfoToT', JSON.stringify(para))
          }
        } else {
          this.moveBtnLoading = false
        }
      })
    },
    handleChange(val) {
      this.moveForm.moduleType = ''
    },
    queryArtType() {
      this.$query('reptileconfig').then(response => {
        this.artTypeData = response.data
      })
    }
  },
  mounted() {
    if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
      const para = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.filters = para.filters
      sessionStorage.setItem(this.$route.path, '')
    }
    this.tableHeight = document.documentElement.clientHeight - 320 + 'px'
    this.queryArtType()
    this.query(true)
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - 320 + 'px'
  }

}
</script>

<style>
  .insideInfo .el-card__body {
    padding: 10px 1px;
  }
  .insideInfo .box-card {
    height: auto;
  }
  .insideInfo .lineStyle {
    padding: 3px 20px 15px;
    border-bottom: 1px dotted #1d659b;
    display: inline-block;
    width: 100%;
  }
  .insideInfo .lineStyle:last-child{
    border-bottom: 0;
  }
  .insideInfo .lineStyle .title {
    padding: 10px 0;
  }
  .insideInfo .lineStyle .title > div:first-child{
    text-decoration: underline;
    cursor: pointer;
  }
  .insideInfo .lineStyle .title > div{
    display: inline-block;
  }
  .insideInfo .lineStyle .title > span{
    padding: 4px 10px;
    border-radius: 4px;
    margin-left: 20px;
    font-size: 14px;
  }
  .insideInfo .lineStyle .title > div:last-child{
    float: right;
  }
  .insideInfo .lineStyle .content{
    cursor: pointer;
  }
  .insideInfo .lineStyle .content *{
    display: inline;
    font-size: 16px !important;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif !important;
    font-weight: normal !important;
    color: #c7c7c7 !important;
    line-height: 22px !important;
    background: none !important;
  }
  .insideInfo .lineStyle .content img, .insideInfo .lineStyle .content br{
    display: none;
  }
  .insideInfo .content_ellipsis {
    word-break: keep-all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #c7c7c7;
    /*height: 22px;*/
  }
  .insideInfo .type3 {
    background-image: linear-gradient(90deg, #187be0 0%, #54aedf 100%);
  }
  .insideInfo .type1 {
    background-image: linear-gradient(140deg, #40a954 0%, #20e1aa 100%);
  }
  .insideInfo .type2 {
    background-image: linear-gradient(140deg, #ff7a04 0%, #fdbc22 100%);
  }
  .insideInfo .type4 {
    background-image: linear-gradient(140deg, #7b4d12 0%, #926840 100%);
  }
  .insideInfo .category1 {
    background-color: #ec808d;
  }
  .insideInfo .category2 {
    background-color: #facd91;
  }
  .insideInfo .category3 {
    background-color: #c280ff;
  }
  .move_dialog .el-dialog{
    width: 30%;
  }
  .move_dialog .el-dialog__body{
    padding: 15px 20px 0;
  }
</style>
