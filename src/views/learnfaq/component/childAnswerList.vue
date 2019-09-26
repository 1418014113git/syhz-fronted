<template>
  <section>
    <el-card class="childAnswerList">
      <el-row>
        <template v-if="(answerListSize > 0) || (total > 0)">
          <el-col :span="24">
            <el-row v-for="(childItem, index) in childAnswerList" :key="index" :value="childItem" v-loading="loading">
              <el-col :span="24" style="border-bottom: 1px solid #3a6479;font-size:14px;">
                <span style="font-weight: 600;"> {{ childItem.creationName + ':' }} </span>
                <span>{{ childItem.answerRemark }}</span>
                <el-row type="flex" justify="end">
                  <el-col :span="6" style="text-align: right">
                    <span class="item-time">{{ formatTime(childItem.creationTime) }}</span>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <span class="item-time item-reply" @click="handleClickTierAnswer(childItem.creationName)">回复</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="padding: 5px 5px 5px 5px;">
            <template v-if="showChildMore && (answerListSize > 5)">
              <span >{{ '还有' + (answerListSize - 5) + '条回复，'}}</span>
              <span class="item-reply" @click="handleShowMore" style="color: #00a0e9;">{{ '请点击查看' }}</span>
            </template>
            <el-pagination v-if="showChildPagination" small layout="prev, pager, next" @current-change="handleCurrentChange"
              :page-size="pageSize" :total="total" :current-page="currentPage" style="float:left;">
            </el-pagination>
            <el-button style="float:right;" @click="handleClickMyAnswer">我也说一句</el-button>
          </el-col>
        </template>
        <el-col :span="24" v-if="showAnswer">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="myAnswerData" class="myAnswerData" maxlength="200"></el-input>
          <el-button type="primary" style="margin-top:5px;float:right;" @click="handleClickPublish">发表</el-button>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import { getChildAnswer, addAnswer } from '@/api/learnfaq'
import { parseTime } from '@/utils/index'
export default {
  name: 'childAnswerList',
  props: {
    answerList: { // 从父页面传来的默认的5条层回答
      type: Array
    },
    answerListSize: { // 层回答总数
      type: Number
    },
    answerId: { // 楼会带ID
      type: Number
    },
    questionId: { // 问题ID
      type: Number
    },
    sensitiveList: { // 敏感词
      type: Array
    }
  },
  data() {
    return {
      userInfo: {}, // 用户信息
      loading: false,
      childAnswerList: [], // 层回答列表
      myAnswerData: '', // 我的回答
      submitAnswerLoading: false, // 发表按钮加载
      showAnswer: false, // 显示回答区域
      total: 0,
      pageSize: 10,
      currentPage: 0,
      showChildPagination: false, // 层回答分页显示
      showChildMore: false // 显示更多
    }
  },
  methods: {
    init() {
      const user = JSON.parse(sessionStorage.getItem('userInfo'))
      const currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.userInfo.userName = user.userName
      this.userInfo.userId = user.id
      if (currentDep) {
        this.userInfo.depName = currentDep.depName
        this.userInfo.deptId = currentDep.id
        this.userInfo.depCode = currentDep.depCode
        this.userInfo.areaCode = currentDep.areaCode
      }
      this.childAnswerList = this.answerList
      this.showChildPagination = false
      this.showChildMore = true
      this.showAnswer = false
      if (this.answerListSize === 0) {
        this.showAnswer = true
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleGetChildAnswerList()
    },
    handleClickMyAnswer() {
      this.showAnswer = true
      this.myAnswerData = ''
    },
    handleClickTierAnswer(tierName) {
      this.showAnswer = true
      this.myAnswerData = '回复' + tierName + ':'
    },
    handleShowMore() {
      this.showChildPagination = true
      this.showChildMore = false
      this.handleGetChildAnswerList()
    },
    // 获取层回答列表
    handleGetChildAnswerList() {
      const para = {
        questionId: this.questionId,
        parentAnswerId: this.answerId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      const _this = this
      this.showChildPagination = false
      this.loading = true
      getChildAnswer(para).then((response) => {
        _this.loading = false
        if (response.code === '000000') {
          _this.childAnswerList = response.data.list
          _this.total = response.data.totalCount
          if (response.data.totalCount > _this.pageSize) {
            _this.showChildPagination = true
          } else {
            _this.showChildPagination = false
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交层回答
    handleClickPublish() {
      if (this.myAnswerData) {
        if (this.validateSensitive()) {
          const para = {
            questionId: this.questionId,
            answerRemark: this.myAnswerData,
            belongAreaCode: this.userInfo.areaCode,
            belongDepCode: this.userInfo.depCode,
            belongDepName: this.userInfo.depName,
            creationId: this.userInfo.userId,
            creationName: this.userInfo.userName,
            parentAnswerId: this.answerId,
            viewTime: this.formatTime(new Date()),
            stopTime: 100
          }
          const _this = this
          this.submitAnswerLoading = true
          addAnswer(para).then((response) => {
            this.submitAnswerLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '回复成功',
                type: 'success'
              })
              _this.myAnswerData = ''
              _this.handleGetChildAnswerList()
            } else {
              this.$message({
                message: '回复失败',
                type: 'erroe'
              })
            }
          }).catch(() => {
            this.submitAnswerLoading = false
            this.$message({
              message: '回复失败',
              type: 'erroe'
            })
          })
        }
      } else {
        this.$message({
          message: '回复内容不能为空',
          type: 'erroe'
        })
      }
    },
    // 判断是否存在敏感词
    validateSensitive() {
      if (this.sensitiveList.length > 0) {
        for (let i = 0; i < this.sensitiveList.length; i++) {
          if (this.myAnswerData.indexOf(this.sensitiveList[i]) !== -1) {
            this.$alert('回复内容中包含敏感词，请修改后再发表', '警告', {
              confirmButtonText: '确定'
            })
            return false
          }
        }
      }
      return true
    },
    formatTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.childAnswerList{
  background: rgba(0,0,0,0.3);
  color: #d3d3de;
}
.childAnswerList .myAnswerData >>> .el-textarea__inner{
  background-color: rgba(0,0,0,0.3);
}

.childAnswerList .item-time {
  display: inline-block;
  margin-top: 10px;
  font-size: 14px;
  color: #d3d3de;
}
.childAnswerList .item-reply {
  cursor: pointer;
}
</style>
