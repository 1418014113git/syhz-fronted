<template>
  <section>
    <el-col v-for="(data,index) in listData" :span="data.span" :key="index">
      <div class="portal_work">
        <!-- <h4>{{data.title}}</h4> -->
        <img class="grdbIcon" :src="data.icon">
        <p v-if="data.data.length > 0" v-for="(child,index2) in data.data" :key="index2">
          <el-button style="color: #303133" type="text" @click="goHandle(index,child)">
            {{child.data_op}}<span class="f_color_F56C6C">{{child.num}}</span>起
          </el-button>
        </p>
        <p v-if="data.data.length === 0">
          <el-button style="color: #303133" type="text">暂无数据</el-button>
        </p>
      </div>
    </el-col>
  </section>
</template>

<script>
  import {
    getSignCount, getWorkGroup, getCBCount
  } from '@/api/portal'

  export default {
    name: 'Work',
    data() {
      return {
        deptId: '',
        listData: [
          {
            'span': 6, 'title': '审核待办', 'icon': './static/image/portal_images/shen.png', 'content': 'work1', 'data': [
              // { 'data_op': '本人发起待审核案件', 'num': '2' },
              // { 'data_op': '被退回案件协查', 'num': '3' },
              // { 'data_op': '案件协查申请', 'num': '1' },
              // { 'data_op': '全国性协查申请', 'num': '8' }
            ]
          },
          {
            'span': 6, 'title': '签收待办', 'icon': './static/image/portal_images/qian.png', 'content': 'work2', 'data': [
              // { 'data_op': '全国性协查待签收', 'num': '1' },
              // { 'data_op': '专项任务通知待签收', 'num': '2' },
              // { 'data_op': '专项任务通知待签收', 'num': '5' },
              // { 'data_op': '案件协查待签收', 'num': '2' }
            ]
          },
          {
            'span': 6, 'title': '催办待办', 'icon': './static/image/portal_images/cui.png', 'content': 'work3', 'data': [
              // { 'data_op': '案件督办', 'num': '3' },
              // { 'data_op': '案件催办', 'num': '1' }
            ]
          },
          {
            'span': 6, 'title': '其他待办', 'icon': './static/image/portal_images/qi.png', 'content': 'work4', 'data': [
              // { 'data_op': '案件处置', 'num': '1' },
              // { 'data_op': '专项任务', 'num': '2' },
              // { 'data_op': '检验鉴定', 'num': '0' },
              // { 'data_op': '全国性协查', 'num': '3' }
            ]
          }
        ]
      }
    },
    methods: {
      goHandle(index, node) {
        if (index === 0) {
          this.$router.push({
            path: '/workflow/index/' + node.type
          })
        }
        if (index === 1) {
          if (node.data_op === '案件认领') {
            this.$router.push({
              path: '/caseManage/ajrl', query: {}
            })
          }
          if (node.data_op === '线索流转' || node.data_op === '案件督办催办' || node.data_op === '案件协查' || node.data_op === '全国性协查' || node.data_op === '案件督办') {
            this.$router.push({
              path: '/businessWork/' + node.business_type, query: {}
            })
          }
        }
        if (index === 2) {
          this.$router.push({
            path: '/caseManage/dblist', query: {}
          })
        }
      },
      getSignCount() {
        const para = {
          noticeOrgId: this.deptId,
          status: 1
        }
        getSignCount(para).then((response) => {
          this.listData[1].data = []
          if (response.data && response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              const data = response.data[i]
              if (data.business_type <= 8) {
                this.listData[1].data.push(data)
              }
            }
          }
        })
      },
      getCBAJCount() {
        const para = {
          deptId: this.deptId
        }
        getCBCount(para).then((response) => {
          this.listData[2].data = []
          if (response.code === '000000' && response.data) {
            if (response.data.num > 0) {
              this.listData[2].data = [{
                data_op: '催办待办', num: response.data.num
              }]
            }
          }
        })
      },
      getWorkFlow() {
        const para = {
          deptId: this.deptId
        }
        getWorkGroup(para).then((response) => {
          this.listData[0].data = []
          if (response.data) {
            for (let i = 0; i < response.data.length; i++) {
              const data = response.data[i]
              let text = ''
              if (data.wd_type === '0001') {
                text = '--'
              }
              if (data.wd_type === '0002') {
                text = '--'
              }
              if (data.wd_type === '0003') {
                text = '督办待审核'
              }
              if (data.wd_type === '0004') {
                text = '全国性协查待审核'
              }
              if (data.wd_type === '0005') {
                text = '协查待审核'
              }
              if (data.wd_type === '0006') {
                text = '检验鉴定审核'
              }
              this.listData[0].data.push({
                data_op: text, num: data.num, type: data.wd_type
              })
            }
          }
        })
      }
    },
    mounted() {
      const currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (currentDep) {
        this.deptId = currentDep.id
        this.getWorkFlow()
        this.getCBAJCount()
      }
      this.getSignCount()
    }
  }
</script>

<style scoped>
  .portal_work {
    text-align: left;
    padding-left: 10px;
    /* border-right: 1px solid #ddd; */
    height: 230px;
  }

  .portal_work p {
    /* text-align: left; */
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }

  .portal_work p span {
    margin: 0 5px;
  }

  .f_color_F56C6C {
    color: #F56C6C;
  }

  .grdbIcon {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
</style>
