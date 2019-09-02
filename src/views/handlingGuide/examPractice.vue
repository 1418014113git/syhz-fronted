<template>
  <section>
    <div class="enamPractice">
      <div v-loading="loading">
        <el-card shadow="never">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item, index) in listDataTest" :key="index" :value="item">
              <el-card shadow="never" class="examItem">
                <el-row :gutter="20">
                    <el-col :span="18">
                      <div class="examHeader">{{ item.examName }}</div>
                      <div class="examContent">
                        <span>已完成{{ item.complete }}%</span>
                      </div>
                      <div class="cutOffRule"></div>
                      <div class="examFooter">
                        <div>
                          <i class="el-icon-document"></i>
                          <span>{{ item.titleNum }}题目 </span>
                          <i class="el-icon-view examUser"></i>
                          <!-- <img src="/src/icons/svg/user.svg" alt="" class="examUser"> -->
                          <span>{{ item.peopleNum }} 人</span>
                        </div>
                        <el-button @click="handleLearn(item.examStatus)" >{{ handleGetButtonText_3(item.examStatus) }}</el-button>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div style="display: flex;align-items: center;justify-content : center;flex-direction:column; ">
                        <el-progress type="circle" :percentage="item.accuracy"></el-progress>
                        <span style="margin-top:-50px;">正确率</span>
                      </div>
                    </el-col>
                  </el-row>
              </el-card>
            </el-col>
          </el-row>
          <div v-if="listDataTest && listDataTest.length > 0" class="toolbar">
            <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                          :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
            </el-pagination>
          </div>
        </el-card>
      </div>
      
    </div>
  </section>
</template>

<script>
const listDataTemp_3 = [
  { examName: '新环境保护法知识考试 - 1', examStatus: '2', peopleNum: 20, titleNum: 2, complete: 100, accuracy: 70 },
  { examName: '新环境保护法知识考试 - 2', examStatus: '0', peopleNum: 20, titleNum: 5, complete: 0, accuracy: 0 },
  { examName: '新环境保护法知识考试 - 3', examStatus: '1', peopleNum: 20, titleNum: 1, complete: 20, accuracy: 10 },
  { examName: '新环境保护法知识考试 - 4', examStatus: '1', peopleNum: 20, titleNum: 1, complete: 20, accuracy: 10 },
  { examName: '新环境保护法知识考试 - 5', examStatus: '1', peopleNum: 20, titleNum: 1, complete: 20, accuracy: 10 }
]
export default {
  name: 'enamPractice',
  data() {
    return {
      loading: false,
      listDataTest: [],
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    handleGetButtonText_3(status) {
      let retText = ''
      switch (status) {
        case '0':
          retText = '开始考试'
          break
        case '1':
          retText = '继续考试'
          break
        case '2':
          retText = '完成考试'
          break
        default:
          break
      }
      return retText
    },
    handleLearn(status) {
      this.$router.push({
        path: '/educational/ExamPractice/examDetail', query: { status: status }
      })
    },
    handleChange(val) {
      this.page = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    }
  },
  mounted() {
    this.listDataTest = listDataTemp_3
    this.total = listDataTemp_3.length
  }
}
</script>

<style scoped>
.enamPractice .alzy_tabs {
  padding: 0 10px;
}
.enamPractice .examItem {
  height: 160px;
  margin-bottom: 20px;
}
.enamPractice .examHeader {
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.enamPractice .examContent {
  height: 40px;
  display: flex;
  align-items: center; 
}
.enamPractice .examFooter {
  height: 40px;
  display: flex;
  align-items: center; 
  justify-content : space-between;
}
.enamPractice .cutOffRule {
  border-bottom: 1px solid #e4e7ed;
  width: 100%;
}
.enamPractice .examUser {
  margin-left: 20px;
  width: 20px; 
  height: 20px;
}
.enamPractice >>> .el-progress__text {
  color: #e4e7ed;
}
.enamPractice .toolbar {
  height: 33px;
  line-height: 33px;
  margin: 15px 5px 0px;
}
</style>

