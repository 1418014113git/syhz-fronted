<template>
  <div class="learnDetail">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-row class="header" type="flex" justify="center">
      <el-col :span="16">
        <el-row>
          <!--<el-col>-->
          <!--<el-button>尤其那</el-button>-->
          <!--<el-button>尤其那</el-button>-->
          <!--<el-button>尤其那</el-button>-->
          <!--<el-button>尤其那</el-button>-->
          <!--</el-col>-->
          <el-col class="header-title">
            <el-col :span="20">
              {{question.title}}
            </el-col>
            <!-- <el-col :span="4" style="text-align: right">
              <el-button type="text" @click="toList">返回列表
              </el-button>
            </el-col> -->
          </el-col>
          <el-col>
            {{question.subject}}
          </el-col>
          <!--<el-col>-->
          <!--<span>-->
          <!--浏览数-->
          <!--</span>-->
          <!--<span>-->
          <!--回答数-->
          <!--</span>-->
          <!--</el-col>-->
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-row>
          <el-card>
            <div class="list-header">
              <el-row v-if="!answerTxt" type="flex" justify="space-between">
                <el-col :span="4">
                  <el-button type="primary" style="padding:8px 20px" @click="showAnswer(1)"><i class="el-icon-edit"></i>写回答
                  </el-button>
                </el-col>
                <el-col :span="18">
                  <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"-->
                  <!--:total="total" style="float:right;">-->
                  <!--</el-pagination>-->
                </el-col>
              </el-row>
              <el-row v-if="answerTxt" style="margin-top: 10px;padding:10px 0;">
                <el-form :model="answer" size="small" ref="form" :rules="rules" label-width="120px">
                  <el-form-item prop="answer" label-width="0">
                    <el-input type="textarea" :autosize="{minRows: 3}" placeholder="请输入内容"
                              style="width: 60%;min-width: 500px; border-radius: 2px"
                              v-model="answer.answer"></el-input>
                  </el-form-item>
                  <el-form-item label-width="0">
                    <el-button type="primary" style="padding:5px 10px" @click="saveAnswer(1)">提 交</el-button>
                    <el-button style="padding:5px 10px" @click="hideAnswer(1)">取 消</el-button>
                  </el-form-item>
                </el-form>
              </el-row>
            </div>
            <div v-for="o in answerData" class="list-item">
              <el-row>
                <el-col class="item-name">{{o.create_user}}</el-col>
              </el-row>
              <el-row style="margin-top: 10px;">
                <el-col>
                  {{o.answer}}
                </el-col>
                <el-col>
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">发布于 {{o.create_time}}</div>
                    <span class="item-time">提交于{{formatTime(o.create_time)}}</span>
                  </el-tooltip>

                </el-col>
              </el-row>
            </div>
            <div class="item-last">
              <el-button v-if="sw" type="text" @click="handleCurrentChange" v-loading.fullscreen.lock="listLoading">
                点击查看更多...
              </el-button>
            </div>
            <div v-if="!sw && answerData.length > 3" class="item-last">
              已到最后一条
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    addAnswer, getAnswerPage, getLearnDetail, editLearnBrows
  } from '@/api/learnfaq'
  import {
    parseTime
  } from '@/utils/index'

  export default {
    name: 'learnDetail',
    components: {},
    data() {
      return {
        questionId: '',
        currentDep: {},
        question: {},
        answer: {},
        answerData: [],
        listLoading: false,
        answerTxt: false,
        sw: true,
        total: 0,
        pageSize: 5,
        page: 1,
        rules: {
          answer: [
            {
              required: true, message: '请输入内容', trigger: 'blur'
            },
            {
              min: 1, max: 500, message: '内容长度不能超过500个字', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleCurrentChange() {
        if (this.page * this.pageSize < this.total) {
          this.page++
          this.getList()
        }
      },
      formatTime(time) {
        return parseTime(time, '{y}-{m}-{d}')
      },
      showAnswer() {
        this.answerTxt = true
        this.answer.answer = ''
      },
      hideAnswer() {
        this.answer.answer = ''
        this.answerTxt = false
      },
      saveAnswer() {
        this.$refs.form.validate(valid => {
          if (valid) {
            addAnswer(this.answer).then((response) => {
              if (response.data) {
                this.$message({
                  message: '发布成功',
                  type: 'success'
                })
                this.hideAnswer()
                this.page = 1
                this.getList()
              }
            })
          }
        })
      },
      getList() {
        const para = {
          learnId: this.questionId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getAnswerPage(para).then((response) => {
          if (response.data) {
            this.listLoading = false
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
            this.page = response.data.pageNum
            if (this.page === 1) {
              this.answerData = response.data.list
            } else {
              this.answerData = this.answerData.concat(response.data.list)
            }
            if (this.page * this.pageSize >= this.total) {
              this.sw = false
            } else {
              this.sw = true
            }
          }
        }).catch(() => {
          this.listLoading = false
        })
        setTimeout(() => {
          editLearnBrows({
            id: this.questionId
          }).then((response) => {
          })
        }, 10000)
      },
      getQuestion() {
        const para = {
          id: this.questionId
        }
        getLearnDetail(para).then((response) => {
          if (response.data) {
            this.question = response.data
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/learn/index'
        })
      }
    },
    mounted() {
      const user = JSON.parse(sessionStorage.getItem('userInfo'))
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.answer.createUser = user.realName
      this.answer.userId = user.id
      if (this.currentDep) {
        this.answer.createDept = this.currentDep.depName
        this.answer.deptId = this.currentDep.id
      }
      if (this.$route.params.id) {
        this.questionId = this.$route.params.id
        this.answer.learnId = this.questionId
        this.getQuestion()
        this.getList()
      }
    }
  }
</script>

<style scoped>

  .learnDetail .header-title {
    margin-top: 12px;
    margin-bottom: 4px;
    font-size: 22px;
    font-weight: 600;
    font-synthesis: style;
    line-height: 32px;
    color: #ffffff;
  }

  .learnDetail .header {
    padding: 5px 25px 20px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 15px;
  }

  .learnDetail .header-detail {
    min-height: 10px;
  }

  .learnDetail .list-header {
    border-bottom: 1px solid #eeeeee;
    padding: 5px 5px 10px;
  }

  .learnDetail .list-item {
    padding: 16px 0;
    border-bottom: 1px solid #eeeeee;
  }

  .learnDetail .item-time {
    display: inline-block;
    margin-top: 10px;
    font-size: 14px;
    color: #00a0e9;
    cursor: pointer;
  }

  .learnDetail .item-time:hover {
    text-decoration: underline;
  }

  .learnDetail .item-name {
    font-weight: bold;
    color: #ffffff;
  }

  .learnDetail .item-last {
    text-align: center;
  }

</style>
