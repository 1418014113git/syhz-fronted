<template>
  <section class="tk">
    <el-row type="flex" >
      <el-col :span="24">
        <el-row>
          <el-col :span="4">
            <el-card style="height: 700px">
              <el-tree :data="leftTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-card>
          </el-col>
          <el-col :span="20" style="padding:0 15px;" v-loading="listLoading" align="center">
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="单选类" name="first"></el-tab-pane>
              <el-tab-pane label="多选类" name="second"></el-tab-pane>
              <el-tab-pane label="填空类" name="third"></el-tab-pane>
              <el-tab-pane label="判断类" name="fourth"></el-tab-pane>
            </el-tabs> -->
            <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
              <el-form-item label="试题类型" prop="AJMC">
                <el-select v-model="filters.tx" placeholder="请选择题型" @change="questionTypeChange">
                  <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="add()" icon="el-icon-plus">添加试题</el-button>
                <a :href="downLoadUrl+'摊位信息模板.xls'"  download="摊位信息模板.xls" style="margin:0 10px;">
                  <el-button type="primary" icon="el-icon-upload2">模板导出</el-button>
                </a>
                <el-button type="primary" @click="importTem('importInfo')" :loading="importLoading" icon="el-icon-download">批量导入</el-button>
              </el-form-item>
            </el-form>
            <!-- <el-card > -->
            <el-table :data="tableData"  v-loading="false">
              <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
              <el-table-column prop="name" label="题目内容"></el-table-column>
              <el-table-column prop="date" label="更新时间" width="200"></el-table-column>
              <el-table-column prop="date" label="类型" width="200"></el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
                  <el-button size="mini" circle @click="handleUpdQus(scope.$index, scope.row)" icon="el-icon-edit" title="编辑"></el-button>
                  <el-button size="mini" circle type="danger" v-if="scope.row.deleteable=='1'" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除"></el-button>
                  <!-- <el-button size="mini" circle type="danger" v-if="scope.row.deleteable=='1'" @click="handleRevord(scope.$index, scope.row)" title="发布">
                    <svg-icon icon-class="audit"></svg-icon>
                  </el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <!-- </el-card> -->
          </el-col>
          <el-col :span="20" class="toolbar">
            <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                          :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog title="题目详情" width="700px" :visible.sync="dialogVisible">
          <el-form :model="detail">
          <el-row>
            <el-form-item label="题目">
              <span>{{detail.name}}</span>
            </el-form-item>
          </el-row>
            <el-row>
              <el-form-item label="A、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row >
              <el-form-item label="B、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="C、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="D、">
                <span>{{detail.as1}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="正确答案">
                <span>{{detail.realAs}}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="试题解析">
                <span>{{detail.intr}}</span>
              </el-form-item>
            </el-row>
          </el-form>
          <el-row>
            <div style="display: flex;justify-content: center;">
              <el-button type="success" @click="cancel()" size="small">关闭</el-button>
            </div>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 导入弹框 -->
    <el-dialog title="导入试题" :visible.sync="dialogImportVisible" size="small" @close="closeDia('importInfo')" class="comDialog">
      <el-form ref="importInfo" size="small" :model="importInfo" label-width="100px" v-loading="importLoading">
        <!-- <el-form-item label="文　　件："> -->
        <el-form-item label="文件：">
          <input type="file" @change="getFile" clearable name="file" id="excelFile"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitImportForm('importInfo')" :loading="importLoading">导 入</el-button>
          <el-button @click="closeDia('importInfo')" :loading="importLoading">返 回</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-dialog width="50%" title="提示信息" :visible.sync="innerErrorInfoVisible" append-to-body>
        <el-table :data="errorData">
          <el-table-column prop="number" label="行数" width="100"></el-table-column>
          <el-table-column prop="des" label="错误信息"></el-table-column>
        </el-table>
      </el-dialog> -->
    </el-dialog>
  </section>
</template>

<script>
/* eslint-disable no-sequences */
import { questionTypeAll } from '@/utils/codetotext'

import qusAdd from './add'
import qusAEdit from './edit'
import importexport from '@/api/importexport'
import axios from 'axios'
export default {
  name: 'questionBank',
  components: {
    qusAdd,
    qusAEdit
  },
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      leftTreeData: [
        {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'first',
      filters: {},
      dialogImportVisible: false, // 导入弹框
      importLoading: false, // 导入弹框loading
      importInfo: {}, // 导入弹框
      fileCon: '', // 导入试题内容
      txData: questionTypeAll('all'),
      page: 1,
      pageSize: 15,
      total: 1,
      countHeight: document.documentElement.clientHeight - 240 + 'px',
      dialogVisible: false,
      detail: {},
      tableData: [],
      searchText: '',
      listLoading: false,
      value1: '',
      value2: '',
      tableData1: [
        {
          no: '1',
          date: '2019-08-22 14:25',
          name: ' 食物发生腐败变质的最主要原因是（）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '微生物污染',
          as2: '农药残留',
          as3: '加工方法不合理',
          as4: '没有分类存放',
          realAs: 'B',
          intr: '微生物污染...'
        }, {
          no: '2',
          date: '2019-08-19 15:25',
          name: '违反《食品安全法》规定，构成犯罪的，依法追究( )',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '道德谴责',
          as2: '民事责任',
          as3: '刑事责任',
          as4: '都不是',
          realAs: 'B',
          intr: '刑事责任...'
        }, {
          no: '3',
          date: '2019-08-20 12:25',
          name: '寄生虫对人体的危害描述，那一项是错误的（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '争夺营养',
          as2: '机械损伤',
          as3: '分泌毒素',
          as4: '急性中毒',
          realAs: '',
          intr: '急性中毒...'
        }, {
          no: '4',
          date: '2019-08-21 13:25',
          name: '食品没有煮熟的四季豆导致中毒的原因是（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '含有皂素',
          as2: '含有秋水仙碱',
          as3: '含有龙葵碱',
          as4: '含有亚硝酸盐',
          realAs: 'A',
          intr: '含有皂素...'
        }, {
          no: '5',
          date: '2019-08-21 13:25',
          name: '以下哪种鱼腐败时产生组胺（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '鲫鱼',
          as2: '草鱼',
          as3: '鲐鱼',
          as4: '青鱼',
          realAs: 'C',
          intr: '鲐鱼...'
        }, {
          no: '6',
          date: '2019-08-22 14:25',
          name: '食品生产企业生产前，必须向质量监督部门获得（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '食品生产许可证',
          as2: '食品流通许可证',
          as3: '餐饮服务许可证',
          as4: '食品卫生许可证',
          realAs: 'A',
          intr: '食品生产许可证...'
        }, {
          no: '7',
          date: '2019-08-19 15:25',
          name: '进口的食品，食品添加剂以及食品相关产品应当符合（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '我国食品安全国家标准',
          as2: '出口国家食品安全标准',
          as3: '美国食品安全标准',
          as4: '双方约定的标准',
          realAs: 'A',
          intr: '我国食品安全国家标准...'
        }, {
          no: '8',
          date: '2019-08-20 12:25',
          name: '食品安全监管部门对食品不得实施（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '抽检',
          as2: '检查',
          as3: '免检',
          as4: '监督',
          realAs: 'C',
          intr: '免检...'
        }, {
          no: '9',
          date: '2019-08-21 13:25',
          name: '在中国境内市场销售的进口食品，必须使用下列那些标识（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '英文',
          as2: '中文',
          as3: '拼音',
          as4: '其他',
          realAs: 'B',
          intr: '中文...'
        }, {
          no: '10',
          date: '2019-08-21 13:25',
          name: '生产经营的食品的得添加（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '药品',
          as2: '中药材',
          as3: '化合剂',
          as4: '增白剂',
          realAs: 'A',
          intr: '药品...'
        }
      ],
      tableData2: [
        {
          no: '1',
          date: '2019-08-22 14:25',
          name: ' 酸雨形成的原因是（）进入时，形成酸性降雨',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '盐酸',
          as2: '二氧化碳',
          as3: '二氧化硫',
          as4: '二氧化硅',
          realAs: 'C',
          intr: '二氧化硫...'
        }, {
          no: '2',
          date: '2019-08-19 15:25',
          name: '臭氧可以吸收太阳光的( )',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '红外线',
          as2: '紫外线',
          as3: '可见光',
          as4: '热量',
          realAs: 'B',
          intr: '紫外线...'
        }, {
          no: '3',
          date: '2019-08-20 12:25',
          name: '人耳感觉到疼痛的声音级别为（）分贝',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '60',
          as2: '90',
          as3: '120',
          as4: '140',
          realAs: 'C',
          intr: '120...'
        }, {
          no: '4',
          date: '2019-08-21 13:25',
          name: '造成温室效应的气体为（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '二氧化碳',
          as2: '二氧化硫',
          as3: '氧气',
          as4: '氮气',
          realAs: 'A',
          intr: '二氧化碳...'
        }, {
          no: '5',
          date: '2019-08-21 13:25',
          name: '中国植树日为每年的（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '2月12',
          as2: '4月12',
          as3: '3月12',
          as4: '5月12',
          realAs: 'C',
          intr: '3月12...'
        }, {
          no: '6',
          date: '2019-08-22 14:25',
          name: '联合国环境划署总部设在（）的首都',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '泰国',
          as2: '瑞士',
          as3: '肯尼亚',
          as4: '美国',
          realAs: 'B',
          intr: '瑞士...'
        }, {
          no: '7',
          date: '2019-08-19 15:25',
          name: '世界最大的哺乳动物为（ ）',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '蓝鲸',
          as2: '长颈鹿',
          as3: '非洲象',
          as4: '鲨鱼',
          realAs: 'A',
          intr: '蓝鲸...'
        }, {
          no: '8',
          date: '2019-08-20 12:25',
          name: '世界最大的丹顶鹤越冬地在（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '俄罗斯',
          as2: '朝鲜',
          as3: '日本',
          as4: '中国',
          realAs: 'D',
          intr: '中国...'
        }, {
          no: '9',
          date: '2019-08-21 13:25',
          name: '中国政府坚定不移的贯彻执行环境保护这项（）',
          type: '单选题',
          grade: '中等',
          deleteable: '1',
          as1: '基本国策',
          as2: '政策',
          as3: '方法',
          as4: '工作',
          realAs: 'A',
          intr: '基本国策...'
        }, {
          no: '10',
          date: '2019-08-21 13:25',
          name: '不属于清洁能源的是（）',
          type: '单选题',
          grade: '困难',
          deleteable: '1',
          as1: '沼气',
          as2: '太阳能',
          as3: '煤炭',
          as4: '风力',
          realAs: 'C',
          intr: '煤炭...'
        }
      ]
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    handleClick() {

    },
    questionTypeChange() {

    },
    handleCurrentChange(val) {
      // this.page = val
      // this.getCase(false, true)
    },
    handleSizeChange(val) {
      // this.page = 1
      // this.pageSize = val
      // this.getCase(false, true)
    },
    importTem() {
      this.dialogImportVisible = true
    },
    getFile() {
      if (event.target.files[0]) {
        this.fileCon = event.target.files[0]
      } else {
        this.fileCon = ''
      }
    },
    submitImportForm(formName) { // 导入弹框提交按钮
      if (this.fileCon === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.importLoading = true
          const formData = new FormData()
          formData.append('file', this.fileCon) // 文件
          formData.append('createDept', this.dept.depName) // 创建部门
          formData.append('createName', this.userInfo.realName) // 创建人
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'userId': this.userInfo.id,
              'userName': this.userInfo.userName
            }
          }
          axios.post(this.ModuleName + 'pitchman/upload', formData, config).then((response) => {
            this.importLoading = false
            if (response.data.message !== 'OK') { // 有异常
              const file = document.getElementById('excelFile')
              file.value = ''
              this.$message({
                message: response.data.message, type: 'error'
              })
              this.fileCon = ''
            } if (response.data.message === 'OK') {
              if (response.data.data.type === 'success') { // 上传成功
                this.$message({
                  message: '保存成功', type: 'success'
                })
                this.dialogImportVisible = false
                this.innerErrorInfoVisible = false
                this.query(true)
              } else if (response.data.data.type !== 'success') {
                this.innerErrorInfoVisible = true
                var errorInfo = []
                for (let index = 0; index < response.data.data.list.length; index++) {
                  const element = JSON.parse(response.data.data.list[index])
                  errorInfo[index] = { number: element[0], des: element[1] }
                }
                this.errorData = errorInfo
              }
            }
          }).catch((response) => {
            this.importLoading = false
            this.$message({
              message: '导入失败', type: 'error'
            })
          })
        }
      })
    },
    closeDia() {
      const file = document.getElementById('excelFile')
      if (file) {
        file.value = ''
      }
      this.dialogImportVisible = false
    },
    toSearch(val) {
      console.log(val)
      switch (val) {
        case 1: this.tableData = this.tableData1
          break
        case 2: this.tableData = this.tableData2
          break
        case 3: this.tableData = this.tableData1
          break
        case 4: this.tableData = this.tableData2
          break
        default:
          this.tableData = this.tableData1
          break
      }
    },
    handleEdit(index, row) {
      this.detail = row
      this.dialogVisible = true
    },
    handleUpdQus(index, row) {
      this.$router.push({ path: '/educational/edit/' })
    },
    handleDelete(index, row) {
      this.$confirm('确定要废除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.deleteable = '2',
        this.$message({
          type: 'success',
          message: '废除成功'
        })
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleRevord(index, row) {
      this.$confirm('确定要恢复吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.deleteable = '1',
        this.$message({
          type: 'success',
          message: '恢复成功'
        })
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    add() {
      // this.$router.push({ path: '/educational/add/' })
    }
  },
  mounted() {
    this.tableData = this.tableData1
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.tk {
  .el-tabs {
    padding: 5px 10px;
  }
  .el-card__body {
    padding: 10px;
  }
}
</style>
