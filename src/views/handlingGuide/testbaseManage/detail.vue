<template>
  <section class="detailQuestion">
    <!-- <el-row :span="24">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row> -->
    <el-form :model="questionForm" ref="questionForm" label-width="96px" label-position="left" v-loading="listLoading">
      <!-- <el-card>
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <div ref="leftCol"> -->
      <el-form-item label="试题类型" prop="type">
        <span>{{$getLabelByValue(questionForm.type+'', txData)}}</span>
      </el-form-item>
      <el-form-item label="题目内容" class="clearfix" prop="subjectName">
        <span v-html="questionForm.subjectName"></span>
      </el-form-item>
      <el-form-item label="选项" v-if="questionForm.type===1 || questionForm.type===2">
        <p v-for="(item,index) in questionForm.points" :key="index">
          <span v-html="item.point"></span>、<span v-html="item.pointValue" class="spanP"></span>
        </p>
      </el-form-item>
      <el-form-item label="正确答案" prop="answer">
        {{questionForm.answer}}
      </el-form-item>
      <el-form-item label="题目解析">
        <span v-html="questionForm.analysis"></span>
      </el-form-item>
      <el-form-item label="出处" prop="source">
        <el-tag>{{questionForm.source}}</el-tag>
      </el-form-item>
      <el-form-item label="次序" prop="sort">
        {{questionForm.sort}}
      </el-form-item>
            <!-- </div>
          </el-col>
        </el-row>
      </el-card> -->
    </el-form>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'

export default {
  name: 'detail',
  props: ['questionItem'],
  data() {
    return {
      listLoading: false,
      carryParam: {}, // 携带的参数，type 1详情，2添加，3编辑
      txData: questionTypeAll(),
      questionForm: {}
    }
  },
  watch: { // 监听state状态变化
    questionItem: {
      handler: function(val, oldeval) {
        this.questionDetail()
      }
    }
  },
  methods: {
    questionDetail() {
      this.listLoading = true
      this.questionForm = {}
      var para = {
        id: this.questionItem.id,
        type: this.questionItem.type
      }
      this.$query('questions/questionbyid', para).then((response) => {
        this.listLoading = false
        if (response.data.subjectName.indexOf('[]') > 0) {
          response.data.subjectName = response.data.subjectName.replace(/\[/g, '___').replace(/\]/g, '___')
        }
        this.questionForm = response.data
      }).catch(() => {
        this.listLoading = false
        this.tableData = []
      })
    },
    cancel() {
      this.$router.push({ path: '/handlingGuide/testbaseManage' })
    },
    back() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    // if (this.$route.query) {
    //   this.carryParam = this.$route.query
    // }
    if (this.questionItem) {
      this.questionDetail()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.detailQuestion {
  // width: 80%;
  // min-width: 1200px;
  margin: 0 auto;
  .el-select {
    display: initial;
  }
}
</style>
