<template>
  <section class="answerDetail" ref="answerDetail">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="backtoList">   <!--返回-->
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-row>
          <el-col :span="24">
            <el-card>
              <!-- 问题的标题 -->
              <el-row>
                <el-col :span="24" class="header-title">
                  <span>{{questionInfo.quTitle}}</span>
                </el-col>
                <el-col :span="24" class="header-question">
                  <span>问题</span>
                </el-col>
              </el-row>
              <!-- 问题的内容，1楼 -->
              <el-card v-if="floorAnswerListPagination.currentPage === 0 || floorAnswerListPagination.currentPage === 1">
                <el-row>
                  <el-col :span="24" class="introduction">
                    <span>{{questionInfo.introduction}}</span>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="end">
                  <el-col :span="1" style="" class="introduction-corner">
                    <span class="introduction-corner-item">1#</span>
                  </el-col>
                  <el-col :span="2" class="introduction-corner">
                    <span class="introduction-corner-item">{{questionInfo.creationName}}</span>
                  </el-col>
                  <el-col :span="4" class="introduction-corner">
                    <span class="introduction-corner-item">{{ formatTime(questionInfo.creationTime) }}</span>
                  </el-col>
                  <el-col :span="2" class="introduction-corner">
                    <span class="introduction-corner-item introduction-corner-reply" @click="handleReplyFloor()">回复</span>
                  </el-col>
                </el-row>
              </el-card>
              <!-- 回答，2楼开始 -->
              <el-row v-for="(item, index) in floorAnswerList" :key="index" :value="item" style="margin-top: 5px">
                <el-col :span="24">
                  <el-card>
                    <el-row>
                      <el-col :span="24" class="introduction">
                        <span>{{item.answerRemark}}</span>
                      </el-col>
                    </el-row>
                    <el-row type="flex" justify="end">
                      <el-col :span="1" class="introduction-corner">
                        <span class="introduction-corner-item">{{ floorNum(index) }}</span>
                      </el-col>
                      <el-col :span="2" class="introduction-corner">
                        <span class="introduction-corner-item">{{item.creationName}}</span>
                      </el-col>
                      <el-col :span="4" class="introduction-corner">
                        <span class="introduction-corner-item">{{ formatTime(item.creationTime) }}</span>
                      </el-col>
                      <el-col :span="2" class="introduction-corner">
                        <span class="introduction-corner-item introduction-corner-reply" @click="handleReplyTier(item)">{{ item | changeReplyLabel }}</span>
                      </el-col>
                    </el-row>
                    <template v-if="item.replyStatus === 1">
                      <child-answer-list :answerList="item.childAnswerList" :questionId="questionId" :answerId="item.id" :answerListSize="item.childAnswerNum" :sensitiveList="sensitiveList"></child-answer-list>
                    </template>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="24" class="toolbar">
            <el-pagination v-if="floorAnswerListPagination.showPagination" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[10,20,50]" @size-change="handleSizeChange"
                            :page-size="floorAnswerListPagination.pageSize" :total="floorAnswerListPagination.total" :current-page="floorAnswerListPagination.currentPage" style="float:right;">
            </el-pagination>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="24">
                <el-col :span="24" style="float: left;font-size: 22px;">
                  <span>发表回复</span>
                </el-col>
                <el-col :span="24">
                  <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="myAnswerData" maxlength="200"></el-input>
                </el-col>
                <el-col :span="24" style="margin-top:10px;text-align: right">
                  <el-button type="primary" v-loading="submitAnswerLoading" size="medium" @click="handleAddAnswer('')">发表回复</el-button>
                </el-col>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import {
    getQuestion, getAnswerWithChild, addAnswer, editQuestionLogViewTime, getSensitive
  } from '@/api/learnfaq'
  import {
    parseTime
  } from '@/utils/index'

  import childAnswerList from './component/childAnswerList'

  // let stopTimeInterval = null

  export default {
    name: 'answerDetail',
    components: {
      childAnswerList
    },
    data() {
      return {
        userInfo: {},
        questionId: '', // 问题ID
        questionInfo: {}, // 问题信息
        floorAnswerList: [], // 楼回答列表（包含5条默认层回答）
        listLoading: false, // 楼回答列表加载
        floorAnswerListPagination: { // 楼回答分页
          total: 0,
          pageSize: 10,
          currentPage: 0,
          showPagination: false
        },
        tierAnswerData: {}, // 层回答列表对象
        myAnswerData: '', // 回答
        submitAnswerLoading: false, // 发表按钮加载
        stopTimeSec: 0, // 停留时长
        sensitiveList: [] // 敏感词库
      }
    },
    filters: {
      changeReplyLabel(item) {
        if (item.childAnswerNum > 0) {
          if (item.replyStatus === 1) {
            return '收起回复'
          } else if (item.replyStatus === 0) {
            return '回复(' + item.childAnswerNum + ')'
          } else {
            return '未知'
          }
        } else {
          if (item.replyStatus === 1) {
            return '收起回复'
          } else if (item.replyStatus === 0) {
            return '回复'
          } else {
            return '未知'
          }
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.floorAnswerListPagination.currentPage = val
        this.handleGetAnswerList()
      },
      handleSizeChange(val) {
        this.floorAnswerListPagination.pageSize = val
        this.handleGetAnswerList()
      },
      // 获取回答列表，默认附带5条层回答
      handleGetAnswerList() {
        const para = {
          questionId: this.questionId,
          currentPage: this.floorAnswerListPagination.currentPage,
          pageSize: this.floorAnswerListPagination.pageSize
        }
        this.listLoading = true
        this.floorAnswerList = []
        const _this = this
        getAnswerWithChild(para).then((response) => {
          _this.listLoading = false
          if (response.code === '000000') {
            const data = response.data.list
            data.forEach(element => {
              // 默认成回复为展开状态
              if (element.childAnswerNum > 0) {
                element.replyStatus = 1
              } else {
                element.replyStatus = 0
              }
              _this.floorAnswerList.push(element)
            })
            _this.floorAnswerListPagination.total = response.data.totalCount
            if (response.data.totalCount > _this.floorAnswerListPagination.pageSize) {
              _this.floorAnswerListPagination.showPagination = true
            } else {
              _this.floorAnswerListPagination.showPagination = false
            }
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 获取问题详情，默认给浏览数+1，给问题日志表中添加一条没有浏览时长的查询记录
      handleGetQuestion() {
        const para = {
          id: this.questionId,
          belongAreaCode: this.userInfo.areaCode,
          belongDepCode: this.userInfo.depCode,
          belongDepName: this.userInfo.depName,
          creationId: this.userInfo.userId,
          creationName: this.userInfo.userName
        }
        getQuestion(para).then((response) => {
          if (response.code === '000000') {
            this.questionInfo = response.data
          } else {
            this.$message({
              message: '获取信息失败',
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '获取信息失败',
            type: 'error'
          })
        })
      },
      // 回答问题，默认给问题日志表中添加一条回答日志记录， viewTime和stopTime计划从前端传入
      handleAddAnswer(answerId) {
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
              parentAnswerId: answerId === '' ? -1 : answerId,
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
                _this.handleGetAnswerList()
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
      handleReplyFloor() {
        const scrollHeight = document.getElementsByClassName('app-main')[0].scrollHeight
        document.querySelector('.app-main').scrollTop = scrollHeight
      },
      handleReplyTier(item) {
        if (item.replyStatus === 0) {
          item.replyStatus = 1
        } else if (item.replyStatus === 1) {
          item.replyStatus = 0
        }
      },
      // 跟新问题日志表中的浏览时长
      updateViewTime() {
        const param = {
          id: this.questionInfo.viewLogId,
          stopTime: this.stopTimeSec
        }
        editQuestionLogViewTime(param).then((response) => {
        })
      },
      // 获取敏感词信息
      getSensitiveList() {
        const param = {
          appId: 1,
          dictType: 'sensitive'
        }
        const _this = this
        this.sensitiveList = []
        getSensitive(param).then((response) => {
          if (response.code === '000000') {
            const data = response.data
            data.forEach(element => {
              _this.sensitiveList.push(element.dictName)
            })
          } else {
            this.$message({
              message: '获取敏感词失败',
              type: 'error'
            })
          }
        })
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
      backtoList() {
        this.$router.push({
          path: '/micro/trainMaterial',
          query: {
            page: this.$route.query.page,
            pageSize: this.$route.query.pageSize,
            activeIndex: this.$route.query.activeIndex,
            myQuestion: this.$route.query.myQuestion
          }
        })
      },
      floorNum(index) {
        let curPageNum = 0
        if (this.floorAnswerListPagination.currentPage > 1) {
          curPageNum = this.floorAnswerListPagination.currentPage - 1
        }
        return (index + this.floorAnswerListPagination.pageSize * curPageNum + 2) + '#'
      },
      formatTime(time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}')
      },
      init() {
        this.stopTimeSec = 1
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
        if (this.$route.params.id) {
          this.questionId = Number(this.$route.params.id)
          this.handleGetQuestion()
          this.handleGetAnswerList()
        }
        if (sessionStorage.getItem('dictData') && sessionStorage.getItem('dictData')['sensitive']) {
          this.sensitiveList = sessionStorage.getItem('dictData')['sensitive']
        } else {
          this.getSensitiveList()
        }
        // const _this = this
        // if (stopTimeInterval) {
        //   clearInterval(stopTimeInterval)
        //   stopTimeInterval = null
        // }
        // stopTimeInterval = setInterval(function() {
        //   _this.stopTimeSec += 1
        //   console.log('this.stopTimeSec', _this.stopTimeSec)
        // }, 1000)
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      // if (stopTimeInterval) {
      //   clearInterval(stopTimeInterval)
      //   stopTimeInterval = null
      // }
      // this.updateViewTime()
    }
  }
</script>

<style scoped>
.answerDetail .header-title {
  text-align: center;
  font-size:20px;
  font-weight: 600;
}
.answerDetail .header-question {
  text-align: center;
  padding: 10px 10px 10px 10px;
  font-size:18px;
  font-weight: 600;
  background-color: #005892;
}
.answerDetail .introduction {
  min-height: 200px;
}
.answerDetail .introduction-corner {
  text-align: right
}
.answerDetail .introduction-corner-item {
  display: inline-block;
  margin-top: 10px;
  font-size: 14px;
  color: #00a0e9;
}
.answerDetail .introduction-corner-reply {
  cursor: pointer;
}
.answerDetail .introduction-corner-reply:hover {
  text-decoration: underline;
}

</style>
