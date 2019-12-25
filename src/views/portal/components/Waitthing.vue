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
            <el-dropdown-item class="clearfix" v-for="(it,indexs) in item.data" :key="indexs" @click.native="goHandle(item.defaultPx,it)">
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
  getSignCount, getWorkGroup, getSignAjrl
} from '@/api/portal'
export default {
  data() {
    return {
      pcsDeptCode: '', // 派出所父Code
      listData: [
        {
          'span': 6, 'title': '审核待办：', 'num': 0, defaultPx: 0, 'data': [
            // { 'data_op': '全国性协查申请', 'num': 8 }
          ]
        },
        {
          'span': 6, 'title': '签收待办：', 'num': 0, defaultPx: 1, 'data': [
            // { 'data_op': '案件协查待签收', 'num': 2 }
          ]
        },
        {
          'span': 6, 'title': '催办待办：', 'num': 0, defaultPx: 2, 'data': [
            // { 'data_op': '案件督办', 'num': 3 }
          ]
        },
        {
          'span': 6, 'title': '其他待办：', 'num': 0, defaultPx: 3, 'data': [
            // { 'data_op': '案件处置', 'num': 1 },
          ]
        }
      ],
      otherData: {
        ajrl: []
      },
      currentDep: {},
      pcsParentDept: {},
      globalCount0: 0,
      globalCount1: 0,
      globalCount2: 0,
      globalCount3: 0 // 全局计数器
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
    getCompare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value2 - value1
      }
    },
    sortByIndex(index) {
      // console.log(this.globalCount0 + '-' + this.globalCount1 + '-' + this.globalCount2 + '-' + this.globalCount3 + '-')
      this.listData[index].data = this.listData[index].data.sort(this.getCompare('num')) // 展开项根据num排序
      this.listData[index].num = this.getTotal(this.listData[index].data) // 合计 计算一级的num
      // 所有的接口 请求完成后 再将 listData 排序
      if (this.globalCount0 === 1 && this.globalCount1 === 3 && this.globalCount2 === 1 && this.globalCount3 === 4) {
        this.listData = this.listData.sort(this.getCompare('num')) // listData 根据num排序
      }
    },
    goHandle(index, node) {
      // index 指的是 listData的defaultPx
      // B案件管理 F教育训练 C基础业务
      if (index === 0) { // 审核待办
        if (node.type === '0003') { // 督办待审核
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({
            path: '/caseManage/dbList', query: { origin: 'portal', status: '1' } // 来源，状态
          })
        } else if (node.type === '0008') { // 督办结案报告待审核
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({
            path: '/caseManage/dbList', query: { origin: 'portal', jabgStatus: '1' } // 来源，状态
          })
        } else if (node.type === '0007') {
          localStorage.setItem('curAppCode', 'W')
          this.$router.push({
            path: '/specialTasks'
          })
        } else if (node.type === '9010') {
          localStorage.setItem('curAppCode', 'F')
          this.$gotoid('/handlingGuide/knowLedgeBase', JSON.stringify({ noCheck: true }))
        } else if (node.type === '9011') {
          localStorage.setItem('curAppCode', 'F')
          this.$gotoid('/micro/trainMaterial', JSON.stringify({ noCheck: true }))
        } else if (node.type === '0010') {
          localStorage.setItem('curAppCode', 'C')
          this.$gotoid('/notice/index', JSON.stringify({ messageStatus: '1' }))
        } else if (node.type === '0004') { // 集群战役待审核
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({
            path: '/jqcampaign', query: { noCheck: 'noCheck' } // 跳转集群战役列表  传递协查状态：待审核
          })
        } else if (node.type === '0005') { // 案件协查审核
          localStorage.setItem('curAppCode', 'B')
          this.$gotoid('/caseAssist/list', JSON.stringify({ noCheck: true }))
        } else {
          this.$router.push({
            path: '/workflow/index/' + node.type
          })
        }
      }
      if (index === 1) { // 签收待办
        if (node.data_op === '案件认领') {
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({
            path: '/caseManage/ajrl', params: { source: 'portal' }
          })
        }
        if (node.data_op === '线索流转' || node.data_op === '案件督办催办' || node.data_op === '案件协查' || node.data_op === '全国性协查' || node.data_op === '案件督办' || node.business_type === '10') {
          this.$router.push({
            path: '/businessWork/' + node.business_type, query: {}
          })
        }
        if (node.business_type === '9') {
          localStorage.setItem('curAppCode', 'W')
          this.$router.push({
            path: '/specialTasks', query: {}
          })
        }
        if (node.business_type === '9012') {
          localStorage.setItem('curAppCode', 'C')
          this.$gotoid('/notice/index', JSON.stringify({ signStatus: '1' }))
        }

        if (node.business_type === 1) { // 案件协查
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({ path: '/caseAssist/list' }) // 案件协查列表
        }

        if (node.business_type === 2) { // 集群战役
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({ path: '/jqcampaign' }) // 集群战役列表
        }
      }
      if (index === 2) { // 催办待办
        localStorage.setItem('curAppCode', 'B')
        if (node.data_op === '案件催办反馈待办') {
          this.$router.push({
            path: '/caseManage/dbList', query: { origin: 'portal', qsStatus: '1' } // 来源，签收状态标志
          })
        }
      }
      if (index === 3) { // 其他待办
        if (node.business_type === '2') {
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({
            path: '/caseManage/ajrl?from=portal', param: {}
          })
        }
        if (node.business_type === 'djsaj') { // 待接收案件
          localStorage.setItem('curAppCode', 'B')
          var param = {
            origin: 'portalOtherTodo', // 表示从首页-其他待办跳转过去的
            type: 'djsaj'
          }
          this.$gotoid('/caseManage', JSON.stringify(param))
        }
        if (node.business_type === 1) { // 案件协查
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({ path: '/caseAssist/list' }) // 案件协查列表
        }

        if (node.business_type === 2) { // 集群战役
          localStorage.setItem('curAppCode', 'B')
          this.$router.push({ path: '/jqcampaign' }) // 集群战役列表
        }
        if (node.business_type === 'cfajhb') { // 重复案件合并
          localStorage.setItem('curAppCode', 'B')
          var mergeParam = {
            origin: 'portal'
          }
          this.$gotoid('/caseManage/caseMergeList', JSON.stringify(mergeParam)) // 重复案件合并列表
        }
      }
    },
    getWorkFlow() {
      const para = {
        deptId: this.currentDep.id
      }
      getWorkGroup(para).then((response) => { // 审核待办
        this.listData[0].data = []
        const param = this.$setCurrentUser({})
        this.$query('trainworkorderwaitaudit', { belongDeptCode: param.belongDepCode }).then(res => {
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
              if (data.wd_type === '0010') {
                if (!this.$isViewBtn('149005')) {
                  continue
                }
                text = '站内通知审核待办'
              }
              if (data.wd_type === '0004') {
                if (!this.$isViewBtn('101908')) { // 没有审核权限的
                  continue
                }
                text = '集群战役待审核'
              }
              this.listData[0].data.push({
                data_op: text, num: data.num, type: data.wd_type
              })
            }
          }
          for (let j = 0; j < res.data.length; j++) {
            const item = res.data[j]
            if (item.type === 1 && this.$isViewBtn('129405')) {
              this.listData[0].data.push({
                data_op: '知识库待审核', num: item.count, type: '9010'
              })
            } else if (item.type === 2 && this.$isViewBtn('139010')) {
              this.listData[0].data.push({
                data_op: '培训资料待审核', num: item.count, type: '9011'
              })
            }
          }
          this.globalCount0++ // 计数器加1
          this.sortByIndex(0) // 排序
        })
      })
    },
    getSignCount() { // 签收待办
      const para = {
        noticeOrgId: this.currentDep.depCode, // 12 25改为code
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
        this.globalCount1++ // 计数器加1
        this.sortByIndex(1) // 排序
      })
      if (this.$isViewBtn('149007')) {
        const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
        this.$query('basemessagesigncount/' + curDept.id, {}).then(response => {
          const item = response.data
          if (item.num > 0) {
            this.listData[1].data.push({
              data_op: '站内通知签收待办', num: item.num, business_type: '9012'
            })
          }
          this.globalCount1++ // 计数器加1
          this.sortByIndex(1) // 排序
        })
      } else {
        this.globalCount1++ // 计数器加1
        this.sortByIndex(1) // 排序
      }

      if (this.$isViewBtn('101907')) { // 集群战役或协查签收待办数量 有签收权限
        this.queryjqzyxcdqs() // 查询集群战役或协查签收待办数量
      } else {
        this.globalCount1++ // 计数器加1
        this.sortByIndex(1) // 排序
      }
    },
    queryjqzyxcdqs() { // 查询集群战役或协查签收待办数量
      var deptCode = this.currentDep.depType === '4' ? this.pcsDeptCode : this.currentDep.depCode
      this.$query('ajglqbxssignhome', { deptCode: deptCode }).then(response => {
        const data = response.data
        if (data.length > 0) {
          data.forEach(item => {
            if (item.num > 0) {
              if (item.assistType === 1) { // 1案件协查
                this.listData[1].data.push({
                  data_op: '协查签收待办', num: item.num, business_type: 1
                })
              } else { // 2集群战役
                this.listData[1].data.push({
                  data_op: '集群战役签收待办', num: item.num, business_type: 2
                })
              }
            }
          })
        }
        this.globalCount1++ // 计数器加1
        this.sortByIndex(1) // 排序
      })
    },
    getCBAJCount() {
      const para = {
        deptCode: this.currentDep.depType === '4' ? this.pcsDeptCode : this.currentDep.depCode
      }
      this.$query('dbcbajnum/' + para.deptCode, {}).then((response) => {
        if (response.code === '000000') {
          this.listData[2].data = []
          if (response.code === '000000' && response.data) {
            if (response.data.num > 0) {
              this.listData[2].data = [{
                data_op: '案件催办反馈待办', num: response.data.num
              }]
            }
          }
          this.globalCount2++ // 计数器加1
          this.sortByIndex(2) // 排序
        }
      }).catch(() => {
      })
    },
    getOtherCount() { // 其他待办 下的数据获取 this.listData[3] 加数据
      var para = {
        businessType: 2,
        status: 3,
        noticeOrgId: this.currentDep.depType === '4' ? this.pcsDeptCode : this.currentDep.depCode
      }
      getSignAjrl(para).then((res) => {
        if (res.code === '000000') {
          if (res.data && res.data.length > 0) {
            this.otherData.ajrl = [{
              data_op: '案件认领', num: res.data[0]['num'], business_type: res.data[0]['business_type']
            }]
            for (const i in this.otherData) {
              this.listData[3].data = this.listData[3].data.concat(this.otherData[i])
            }
          }
          this.globalCount3++ // 计数器加1
          this.sortByIndex(3) // 排序
        }
      })

      if (this.$isViewBtn('101910')) { // 集群战役或协查待反馈数量 有反馈权限
        this.queryjqzydfk() // 查询集群战役或协查待反馈数量
      } else {
        this.globalCount3++ // 计数器加1
        this.sortByIndex(3) // 排序
      }
      // 查案件合并待办
      var deptCode = this.currentDep.depType === '4' ? this.pcsDeptCode : this.currentDep.depCode
      this.$query('caseMerge/wait', { deptCode: deptCode }).then(response => {
        const data = response.data
        if (data.num > 0) {
          this.listData[3].data.push({
            data_op: '重复案件合并', num: data.num, business_type: 'cfajhb' // 重复案件合并
          })
        }
        this.globalCount3++ // 计数器加1
        this.sortByIndex(3) // 排序
      })
      // 待接收案件
      this.getDjsaj()
    },
    queryjqzydfk() { // 查询集群战役或协查待反馈数量
      var deptCode = this.currentDep.depType === '4' ? this.pcsDeptCode : this.currentDep.depCode
      this.$query('caseassistclue/assistNeedFeedBack', { deptCode: deptCode }).then(response => {
        const data = response.data
        if (data.length > 0) {
          data.forEach(item => {
            if (item.num > 0) {
              if (item.assistType === 1) { // 1案件协查
                this.listData[3].data.push({
                  data_op: '协查待反馈', num: item.num, business_type: 1
                })
              } else { // 2集群战役
                this.listData[3].data.push({
                  data_op: '集群战役待反馈', num: item.num, business_type: 2
                })
              }
            }
          })
        }
        this.globalCount3++ // 计数器加1
        this.sortByIndex(3) // 排序
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
        this.globalCount3++ // 计数器加1
        this.sortByIndex(3) // 排序
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.globalCount0 = 0 // 计数器清零
    this.globalCount1 = 0
    this.globalCount2 = 0
    this.globalCount3 = 0
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (this.currentDep) {
      if (this.currentDep.depType === '4') { // 派出所，案件部分 需要当作父级处理
        // 调接口查 派出所的上级
        this.$query('hsyzparentdepart/' + this.currentDep.depCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            this.pcsParentDept = response.data
            this.pcsDeptCode = this.pcsParentDept.departCode
            this.getSignCount() // listData[1]
            this.getCBAJCount() // listData[2]
            this.getOtherCount()// listData[3]
          }
        }).catch(() => {
        })
      } else { // 非派出所
        this.getSignCount() // listData[1]
        this.getCBAJCount() // listData[2]
        this.getOtherCount() // listData[3]
      }
    }
    this.getWorkFlow() // listData[0]
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.waitThing {
  border-radius: 8px;
  padding: 3px 8px;
  margin-top: 7px;
  .waitThingTitle {
    padding: 6px 0 0 38px;
    margin-bottom: 3px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url("/static/image/portal_newImg/corwLine.png") no-repeat 3px
      center;
    border-top: 1px dashed #5b8dd8;
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
    margin-top: 15px;
  }
  .waitThing .myWorkUl li {
    font-size: 12px;
  }
}
.mark {
  background-color: rgba(0, 89, 130, 0.7);
}
</style>

