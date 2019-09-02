<template>
  <div>
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="spt_report">
      <!-- 试题库 -->
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-form :inline="true">
            <el-form-item label="题干名称">
              <el-input v-model="questionForm.questionName" auto-complete="off" class="input_w" maxlength="50" placeholder="请输入题干名称"></el-input>
            </el-form-item>
            <el-form-item label="试题类型">
              <el-select v-model="questionForm.questionType" placeholder="请选择试题类型">
                <el-option v-for="item in STLXList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-check" @click="handleSelected()">确认选择</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
        questionForm: {
          questionName: '',
          questionType: ''
        },
        list: [],
        questionList: [],
        STLXList: [],
        listLoading: false,
        tableHeight: null,
        total: 0,
        page: 1,
        pageSize: 15
      }
    },
    methods: {
      toList(index) {
        this.$router.push({
          path: '/handlingGuide/educationalFreeSettings_setting/' + this.$route.params.id,
          query: {
            source: index
          }
        })
      },
      query() {
        this.total = 5
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
          { 'id': '5', 'questionName': '《中华人民共和国大气污染防治法》第十八条 国务院环境保护部门应当建立(    )，(    )，制定统一的监测方法。', 'questionType': '多选' },
          { 'id': '6', 'questionName': '《中华人民共和国节约能源法》第三十八条 各级人民政府应当按照因地制宜、多能互补、综合利用、讲求效益的方针，加强农村能源建设，开发、利用(    )、(    )、(    )、(    )、(    )等可再生能源和新能源。', 'questionType': '多选' },
          { 'id': '7', 'questionName': '《中华人民共和国放射性污染防治法》第十六条　放射性物质和射线装置应当设置明显的(    )说明。', 'questionType': '单选' },
          { 'id': '8', 'questionName': '《中华人民共和国水污染防治法》第十三条　国务院环境保护主管部门根据(    )，制定国家水污染物排放标准。', 'questionType': '单选' },
          { 'id': '9', 'questionName': '《中华人民共和国环境保护税法》第十一条　环境保护税应纳税额按照下列方法计算：(    )', 'questionType': '多选' }
        ]
        this.STLXList = [
          { 'value': '单选题', 'label': '单选题' },
          { 'value': '多选题', 'label': '多选题' },
          { 'value': '填空题', 'label': '填空题' },
          { 'value': '简答题', 'label': '简答题' },
          { 'value': '判断题', 'label': '判断题' }
        ]
      },
      handleSelected(index, row) {
        console.log(this.$route.params.id)
        this.$router.push({
          path: '/handlingGuide/educationalFreeSettings_setting/' + this.$route.params.id,
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
      if (this.$route.params.id) {
        this.list.forEach(function(item, index, dataList) {
          if (this.$route.params.id === item.id) {
            this.settingsForm.freeSettingsForm = item
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
