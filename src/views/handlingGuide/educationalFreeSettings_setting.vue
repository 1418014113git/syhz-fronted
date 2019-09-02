<template>
  <div>
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="spt_report">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <h3>
            <p style="display: inline-block; width: 100%;">考题设置</p>
          </h3>
        </el-col>
        <el-col :span="6">
          <h3>
            <p style="display: inline-block; width: 100%;">考试名称：{{settingsForm.freeSettingsForm.KSMC}}</p>
          </h3>
        </el-col>
        <el-col :span="6">
          <h3>
            <p style="display: inline-block; width: 100%;">考试时间：{{settingsForm.freeSettingsForm.KSSJ}}</p>
          </h3>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-form :inline="true">
            <el-form-item label="题干名称">
              <el-input v-model="settingsForm.questionName" auto-complete="off" class="input_w" maxlength="50" placeholder="请输入题干名称"></el-input>
            </el-form-item>
            <el-form-item label="试题类型">
              <el-select v-model="settingsForm.questionType" placeholder="请选择试题类型">
                <el-option v-for="item in STLXList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" size="large" icon="el-icon-search" @click="handleShowSTK()">题库选题</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" icon="el-icon-delete" @click="handleRemoveList()">删除选题</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" icon="el-icon-setting" @click="handleRuleSetting()">设置规则</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 已选试题表格 -->
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-table :data="questionList" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="试题名称">
              <template slot-scope="scope">
                <p :title="scope.row.KSMC" class="ellipsis-word">{{scope.row.questionName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="试题类型" width="100">
              <template slot-scope="scope">
                <p :title="scope.row.KSLX" class="ellipsis-word">{{scope.row.questionType}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button title="删除" size="mini" type="primary" icon="el-icon-delete" circle
                           @click="handleRemoveOne(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                           :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
            </el-pagination>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'add',
    data() {
      return {
        list: [],
        STLXList: [],
        settingsForm: {
          questionName: '',
          questionType: '',
          freeSettingsForm: {}
        },
        total: 0,
        page: 1,
        pageSize: 15,
        questionList: [],
        listLoading: false,
        tableHeight: null,
        multipleSelection: [],
        stk: 0
      }
    },
    methods: {
      toList(index) {
        this.$router.push({
          path: '/educational/freeSettings',
          query: {
            source: index
          }
        })
      },
      query() {
        this.total = 4
        this.page = 1
        this.pageSize = 15
      },
      init() {
        this.list = [
          { 'id': '1', 'KSMC': '三月考试', 'KSLX': '正常考试', 'KSSJ': '2018-06-20 至 2018-06-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局食品犯罪侦查大队，西安市公安局药品犯罪侦查大队', 'FBZT': '已结束', 'CJSJ': '2018-06-15' },
          { 'id': '2', 'KSMC': '四月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-06-27 至 2018-06-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局环境犯罪侦查大队', 'FBZT': '已发布', 'CJSJ': '2018-06-15' },
          { 'id': '3', 'KSMC': '五月考试', 'KSLX': '正常考试', 'KSSJ': '2018-07-20 至 2018-07-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局食品犯罪侦查大队，咸阳市陕西省公安局药品犯罪侦查大队', 'FBZT': '进行中', 'CJSJ': '2018-07-15' },
          { 'id': '4', 'KSMC': '六月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-07-27 至 2018-07-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局环境犯罪侦查大队', 'FBZT': '草稿', 'CJSJ': '2018-07-15' },
          { 'id': '5', 'KSMC': '七月考试', 'KSLX': '正常考试', 'KSSJ': '2018-08-20 至 2018-08-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队，陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' },
          { 'id': '6', 'KSMC': '八月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-08-27 至 2018-08-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' }
        ]
        this.questionList = [
          { 'id': '1', 'questionName': '《中华人民共和国环境噪声污染防治法》的立法目标是(    )', 'questionType': '单选' },
          { 'id': '2', 'questionName': '《中华人民共和国环境保护法》第六十三条 违法排放水污染物等行为之一，尚不构成犯罪的，由公安机关对直接负责的主管人员和其他直接责任人员处(    )的拘留', 'questionType': '单选' },
          { 'id': '3', 'questionName': '《中华人民共和国大气污染防治法》第二十四条 炼制石油、生产合成氨、煤气和煤炭焦化、有色金属冶炼过程中排放含有硫化物气体的，应当配备(    )脱硫措施。', 'questionType': '单选' },
          { 'id': '4', 'questionName': '《中华人民共和国海洋环境保护法》第二十一条 含有机物和营养物质的工业废水、生活污水，应当控制向(    )的海域排放，防止海水富营养化。', 'questionType': '单选' }
        ]
        this.STLXList = [
          { 'value': '1', 'label': '单选题' },
          { 'value': '2', 'label': '多选题' },
          { 'value': '3', 'label': '填空题' },
          { 'value': '4', 'label': '简答题' },
          { 'value': '5', 'label': '判断题' }
        ]
      },
      handleShowSTK(index, row) {
        this.$router.push({
          path: '/handlingGuide/educationalFreeSettings_stk/' + this.$route.params.id,
          query: {
            source: index
          }
        })
      },
      handleRuleSetting(index, row) {
        this.$router.push({
          path: '/handlingGuide/educationalFreeSettings_rule/' + this.$route.params.id,
          query: {
            source: index
          }
        })
      },
      handleRemoveOne(index, row) {
        var _this = this
        this.$confirm('确认删除该试题吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.questionList.forEach(function(item, index, dataList) {
            if (item.id === row.id) {
              dataList.splice(index, 1)
              _this.total = _this.total - 1
            }
          })
        }).catch(() => {
        })
      },
      handleRemoveList(index, row) {
        const _this = this
        if (_this.multipleSelection.length > 0) {
          this.$confirm('确认删除选中的试题吗?', '提示', {
            type: 'warning'
          }).then(() => {
            _this.multipleSelection.forEach(function(checkedItem, checkedIndex, checkedList) {
              _this.questionList.forEach(function(sourceItem, sourceIndex, sourceList) {
                if (checkedItem.id === sourceItem.id) {
                  sourceList.splice(sourceIndex, 1)
                }
              })
            })
          }).catch((e) => {
          })
        } else {
          this.$alert('请选择删除的试题', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
        this.query()
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    },
    mounted() {
      this.init()
      var _this = this
      if (this.$route.params.id) {
        this.list.forEach(function(item, index, dataList) {
          if (_this.$route.params.id === item.id) {
            _this.settingsForm.freeSettingsForm = item
          }
        })
      }
      this.query()
    }
  }
</script>

<style scoped>
  .spt_report {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .spt_report h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .spt_report .input_w {
    width: 100%;
  }

  .spt_report .dept-tree {
    max-height: 400px;
    overflow-y: auto;
    padding: 5px;
  }
</style>
