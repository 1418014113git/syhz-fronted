<template>
<div class="waitThing">
  <div class="waitThingTitle">个人待办事项</div>
  <ul class="myWorkUl">
   <template v-for="(item,index) in listData" >
      <template v-if="item.data.length>0">
        <el-dropdown trigger="click" :key="index">
          <li>
            <span class="workTit">{{item.title}}</span>
            <span class="total">{{getTotal(item.data)}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </li>
          <el-dropdown-menu slot="dropdown" v-if="item.data.length>0">
            <el-dropdown-item class="clearfix" v-for="(it,indexs) in item.data" :key="indexs" @click.native="goHandle(index,it)">
              <span>{{it.data_op}}</span>
              <el-badge class="mark" :value="it.num" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <li :key="index">
          <span class="workTit">{{item.title}}</span>
          <span class="total">0</span>
        </li>
      </template>
   </template>

  </ul>
</div>
</template>

<script>
import {
  getSignCount, getWorkGroup, getCBCount, getSignAjrl
} from '@/api/portal'
export default {
  data() {
    return {
      deptId: '',
      listData: [
        {
          'span': 6, 'title': '审核待办：', 'data': [
            // { 'data_op': '本人发起待审核案件', 'num': 2 },
            // { 'data_op': '被退回案件协查', 'num': 3 },
            // { 'data_op': '案件协查申请', 'num': 1 },
            // { 'data_op': '全国性协查申请', 'num': 8 }
          ]
        },
        {
          'span': 6, 'title': '签收待办：', 'data': [
            // { 'data_op': '全国性协查待签收', 'num': 1 },
            // { 'data_op': '专项任务通知待签收', 'num': 2 },
            // { 'data_op': '专项任务通知待签收', 'num': 5 },
            // { 'data_op': '案件协查待签收', 'num': 2 }
          ]
        },
        {
          'span': 6, 'title': '催办待办：', 'data': [
            // { 'data_op': '案件督办', 'num': 3 },
            // { 'data_op': '案件催办', 'num': 1 }
          ]
        },
        {
          'span': 6, 'title': '其他待办：', 'data': [
            // { 'data_op': '案件处置', 'num': 1 },
            // { 'data_op': '专项任务', 'num': 2 },
            // { 'data_op': '检验鉴定', 'num': 0 },
            // { 'data_op': '全国性协查', 'num': 3 }
          ]
        }
      ],
      otherData: {
        ajrl: []
      },
      currentDep: {}
    }
  },
  methods: {
    getTotal(arr) {
      var s = 0
      for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i].num
      }
      return s
    },
    goHandle(index, node) {
      if (index === 0) {
        if (node.type === '0007') {
          localStorage.setItem('curAppCode', '004')
          this.$router.push({
            path: '/specialTasks'
          })
        } else {
          this.$router.push({
            path: '/workflow/index/' + node.type
          })
        }
      }
      if (index === 1) {
        if (node.data_op === '案件认领') {
          localStorage.setItem('curAppCode', '003')
          this.$router.push({
            path: '/caseManage/ajrl', query: {}
          })
        }
        if (node.data_op === '线索流转' || node.data_op === '案件督办催办' || node.data_op === '案件协查' || node.data_op === '全国性协查' || node.data_op === '案件督办' || node.business_type === '10') {
          this.$router.push({
            path: '/businessWork/' + node.business_type, query: {}
          })
        }
        if (node.business_type === '9') {
          localStorage.setItem('curAppCode', '004')
          this.$router.push({
            path: '/specialTasks', query: {}
          })
        }
      }
      if (index === 2) {
        localStorage.setItem('curAppCode', '003')
        this.$router.push({
          path: '/caseManage/dblist', query: {}
        })
      }
      if (index === 3) {
        if (node.business_type === '2') {
          localStorage.setItem('curAppCode', '003')
          this.$router.push({
            path: '/caseManage/ajrl', query: {}
          })
        }
        if (node.business_type === 'djsaj') { // 待接收案件
          localStorage.setItem('curAppCode', '003')
          var param = {
            origin: 'portalOtherTodo', // 表示从首页-其他待办跳转过去的
            type: 'djsaj'
          }
          this.$gotoid('/caseManage', JSON.stringify(param))
        }
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
            if (data.business_type <= 10) {
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
            if (data.wd_type === '0007') {
              text = '专项任务成果上报'
            }
            if (data.wd_type === '0008') {
              text = '督办结案报告审核'
            }
            if (data.wd_type === '0009') {
              text = '无文书待审核'
            }
            this.listData[0].data.push({
              data_op: text, num: data.num, type: data.wd_type
            })
          }
        }
      })
    },
    getAjrl() {
      getSignAjrl({
        businessType: 2,
        noticeOrgId: this.deptId,
        status: 3
      }).then((res) => {
        if (res.code === '000000' && res.data && res.data.length > 0) {
          this.otherData.ajrl = [{
            data_op: '案件认领', num: res.data[0]['num'], business_type: res.data[0]['business_type']
          }]
          for (const i in this.otherData) {
            this.listData[3].data = this.listData[3].data.concat(this.otherData[i])
          }
        }
      })
    },
    getDjsaj() { // 获取待接收案件
      this.$query('bisnoticecount/' + this.currentDep.depCode, {}).then((res) => {
        if (res.code === '000000' && res.data.num > 0) {
          var djsaj = [{
            data_op: '待接收案件', num: res.data.num, business_type: 'djsaj'
          }]
          this.listData[3].data = this.listData[3].data.concat(djsaj[0])
        }
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.currentDep) {
      this.deptId = this.currentDep.id
      this.getWorkFlow()
      this.getCBAJCount()
      this.getSignCount()
      this.getAjrl()
      this.getDjsaj()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.waitThing {
  border-radius: 8px;
  border: 2px solid #00a0e9;
  background: rgba(0, 89, 130, 0.7);
  padding: 3px 0;
  margin-top: 7px;
  .waitThingTitle {
    padding-left: 38px;
    margin-bottom: 3px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url("/static/image/portal_newImg/corwLine.png") no-repeat 3px
      center;
  }
  .myWorkUl {
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    padding: 16px 0;
    li {
      font-size: 15px;
    }
    .workTit {
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
    }
    .total {
      color: #eab247;
    }
  }
  .el-dropdown {
    color: #bce8fc;
  }
  .el-icon--right {
    margin-left: 0;
  }
}
@media only screen and (max-width: 1367px) {
  .waitThing .myWorkUl {
    padding: 16px 0 14px 0;
  }
  .waitThing {
    margin-top: 20px;
    padding: 6px 0;
  }
  .waitThing .myWorkUl li {
    font-size: 12px;
  }
}
.mark {
  background-color: rgba(0, 89, 130, 0.7);
}
</style>

