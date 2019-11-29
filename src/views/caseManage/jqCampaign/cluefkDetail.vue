<template>
  <section class="clueDetail">
   <!--线索反馈详情-->
      <div class="tipText">
        <p style="color: #f56c6c; float:left;">本页面的所有操作均自动保存，不需要手动保存！</p>
        <p style="color: #67C23A; float:right;" v-if="isShowTime">实时保存，保存时间 <span>{{updateTime}}</span></p>
      </div>
      <el-form :model="xsfkForm" size="small" ref="xsfkForm" v-loading="listLoading"  label-width="120px" class="xsfkForm">
        <el-form-item label="核查情况："  class="stxt">
          <el-radio-group v-model="xsfkForm.qbxsResult" @change="changeQbxsResult">
            <el-radio :label="2">查实</el-radio>
            <el-radio :label="3">查否</el-radio>
            <el-popover
            class="qkts"
            placement="right"
            width="300"
            trigger="hover">
            <div>
              <p>线索<span class="redC">查实</span>情况包括：电话、地址准确无误可联系到核查对象、
               被核查对象主动配合、被核查对象否认否买**等；
              </p>
               <p>线索<span class="redC">查否</span>情况包括：电话、地址存在错误<span class="redC">无法联系</span>
               到核查对象。
              </p>
            </div>
            <el-button  type="primary" size="mini" circle slot="reference"><svg-icon icon-class="wenhao"></svg-icon></el-button>
            <svg-icon icon-class="wenhao"></svg-icon>
          </el-popover>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="移送案件">
          <el-select  v-model="ysajbh" size="small" placeholder="请选择..."  class="inputW"  filterable>
            <el-option v-for="(item,index) in ysajSelectData" :key="index" :label="item.ajmc +'('+ item.ajbh + ')'" :value="item.ajbh"></el-option>
          </el-select>
          <el-button type="primary" size="small"  @click="checkaj(1)">选择</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-table :data="yslistData" v-loading="yslistLoading" style="width: 100%;" class="">
            <el-table-column type="index" width="60" label="序号" ></el-table-column>
            <el-table-column prop="ajmc"  label='案件名称'  show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh"  label='案件编号'  show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajlbName"  label='案件类别'  show-overflow-tooltip></el-table-column>
            <el-table-column label="操作"  width="100">
              <template slot-scope="scope">
                <el-button size="mini" title="移除案件"  type="primary" icon="el-icon-delete" circle  @click="handleDel(1, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="侦办刑事案件">
          <el-select  v-model="zbajbh" size="small" placeholder="请选择..."  class="inputW"  filterable>
            <el-option v-for="(item,index) in zbajSelectData" :key="index" :label="item.ajmc +'('+ item.ajbh + ')'" :value="item.ajbh"></el-option>
          </el-select>
          <el-button type="primary" size="small"  @click="checkaj(2)">选择</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-table :data="zblistData" v-loading="zblistLoading" style="width: 100%;" class="">
            <el-table-column type="index" width="60" label="序号" >
              <template slot-scope="scope">
                <span v-if="scope.$index+1<zblistData.length">{{scope.$index+1}}</span>
                <span v-else>总计</span>
              </template>
            </el-table-column>
            <el-table-column prop="ajmc"  label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh"  label='案件编号'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajztName"  label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="larq"  label='立案日期'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parq"  label='破案日期'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="zhrys"  label='抓获（人）'  min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input  v-if="scope.$index+1<zblistData.length" v-model.trim="scope.row.zhrys"  maxlength="11" @keyup.native="number('zhrys',scope.row)" class="textCen"></el-input>
                <span v-else>{{scope.row.zhrys}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb"  label='批捕（人）'  min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input  v-if="scope.$index+1<zblistData.length" v-model.trim="scope.row.pzdb"  maxlength="11" @keyup.native="number('pzdb',scope.row)" class="textCen"></el-input>
                <span v-else>{{scope.row.pzdb}}</span>
              </template>
            </el-table-column>
             <el-table-column prop="yjss" label="移诉（人）"  min-width="80"  show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input  v-if="scope.$index+1<zblistData.length" v-model.trim="scope.row.yjss"  maxlength="11" @keyup.native="number('yjss',scope.row)" class="textCen"></el-input>
                <span v-else>{{scope.row.yjss}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dhwd"  label='捣毁窝点'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input  v-if="scope.$index+1<zblistData.length"  v-model.trim="scope.row.dhwd"  maxlength="11" @keyup.native="number('dhwd',scope.row)" class="textCen"></el-input>
                <span v-else>{{scope.row.dhwd}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-if="scope.$index+1<zblistData.length" v-model.trim="scope.row.sajz"  maxlength="11" @keyup.native="number('sajz',scope.row)" class="textCen"></el-input>
                <span v-else>{{scope.row.sajz}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  width="100" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="scope.$index+1<zblistData.length" size="mini" title="提交"  type="primary" icon="el-icon-check" circle  @click="handleSubmit(scope.row)"></el-button>
                <el-button v-if="scope.$index+1<zblistData.length" size="mini" title="移除案件"  type="primary" icon="el-icon-delete" circle  @click="handleDel(2, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
  </section>
</template>
<script>
export default {
  props: ['row', 'isShowdialog'],
  name: 'clueDetail',
  data() {
    return {
      xsfkForm: {
        qbxsResult: '' // 核查情况
      },
      curDeptName: '', // 当前部门名称
      curDepartId: '', // 当前部门id
      curDeptCode: '', // 当前部门code
      xsfkRow: {}, // 存储线索反馈列表传递过来的当前行的数据
      yslistData: [], // 移送案件列表
      ysajSelectData: [], // 移送案件下拉框数据
      zbajSelectData: [], // 侦办案件下拉框数据
      zblistData: [], // 侦办刑事案件列表
      yslistLoading: false, // 移送案件列表加载loading
      zblistLoading: false, // 侦办刑事案件列表加载loading
      listLoading: false, // 页面加载loading
      isShowTime: false, // 是否显示更新时间
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      updateTime: '', // 存储更新时间
      detailInfo: {}, // 存储详情信息
      ysajbh: '', // 存储下拉选项的移送案件编号
      zbajbh: '' // 存储下拉选项的侦办刑事案件编号
    }
  },
  watch: { // 监听state状态变化
    row: {
      handler: function(val, oldeval) {
        this.xsfkRow = val
      }
    },
    isShowdialog: {
      handler: function(val, oldeval) {
        if (val) {
          this.detail() // 查详情
        }
      }
    }
  },
  methods: {
    detail() { // 查详情
      this.listLoading = true
      this.xsfkForm.qbxsResult = this.xsfkRow.qbxsResult ? this.xsfkRow.qbxsResult : ''
      this.querySelect(1) // 移送案件下拉列表
      this.querySelect(2) // 侦办刑事案件下拉列表
      const para = {
        assistId: this.xsfkRow.clusterId, // 集群Id
        type: 'detail', // 操作类型
        fbId: this.xsfkRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.listLoading = false
        // this.detailInfo = response.data
        if (response.data.zbxss && response.data.zbxss > 0) { // 查询侦办刑事案件列表接口
          this.queryzbxsaj() // 侦办刑事案件列表数据查询
        }
        if (response.data.syajs && response.data.syajs > 0) { // 查询移送案件案件接口
          this.queryysaj() // 移送案件列表数据查询
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryysaj() { // 移送案件列表数据查询
      this.yslistLoading = true
      const para = {
        assistId: this.xsfkRow.clusterId, // 集群Id
        type: 'ys', // 操作类型
        fbId: this.xsfkRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.yslistLoading = false
        this.yslistData = response.data
      }).catch(() => {
        this.yslistLoading = false
        this.yslistData = []
      })
    },
    querySelect(type) { // 移送案件/侦办案件 下拉列表
      const para = {
        type: type, // 1移送案件，2侦办案件
        fbId: this.xsfkRow.fbId, // 反馈Id
        assistId: this.xsfkRow.clusterId, // 集群Id
        deptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/ajSearch', para).then((response) => {
        if (type === 1) { // 移送案件
          this.ysajSelectData = response.data // 移送案件下拉框数据
        } else { // 侦办案件
          this.zbajSelectData = response.data // 侦办案件下拉框数据
        }
      }).catch(() => {
        if (type === 1) { // 移送案件
          this.ysajSelectData = [] // 移送案件下拉框数据
        } else { // 侦办案件
          this.zbajSelectData = [] // 侦办案件下拉框数据
        }
      })
    },
    queryzbxsaj() { // 侦办刑事案件列表数据查询
      this.zblistLoading = true
      const para = {
        assistId: this.xsfkRow.clusterId, // 集群Id
        type: 'zb', // 操作类型
        fbId: this.xsfkRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.zblistLoading = false
        this.zblistData = response.data
      }).catch(() => {
        this.zblistLoading = false
        this.zblistData = []
      })
    },
    getfqDepts() { // 如果登上来的是派出所 发起单位显示他的父级单位
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.curDeptName = response.data.departName // 当前部门名称
          this.curDepartId = response.data.id // 当前部门id
          this.curDeptCode = response.data.departCode // 当前部门code
        }
      }).catch(() => {
      })
    },
    initData() {
      // this.xsfkForm.qbxsResult = '' // 核查情况
      this.yslistData = [] // 移送案件列表
      this.ysajSelectData = [] // 移送案件下拉框数据
      this.zbajSelectData = [] // 侦办案件下拉框数据
      this.zblistData = [] // 侦办刑事案件列表
      this.ysajbh = '' // 存储下拉选项的移送案件编号
      this.zbajbh = '' // 存储下拉选项的侦办刑事案件编号
      this.updateTime = '' // 存储更新时间
      this.isShowTime = false // 隐藏更新时间
    },
    zbajChange(val) { // 侦办案件change事件

    },
    toAjDetail(id) { // 跳转案件档案
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    checkaj(type) { // 选择案件
      if (type === 1) { // 移送案件
        if (!this.ysajbh) {
          this.$message.error('请选择案件')
        } else {
          this.$confirm('确定要添加该案件吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              type: 'saveSyajs',
              assistId: this.xsfkRow.clusterId, // 集群Id
              fbId: this.xsfkRow.fbId, // 反馈Id
              syajs: this.ysajbh, // 案件编号
              userId: this.curUser.id, // 当前用户Id
              userName: this.curUser.realName, // 当前用户真实姓名
              curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
              curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
              assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
            }
            this.$update('caseassistclue/feedBack', param).then((response) => {
              this.listLoading = false
              this.isShowTime = true
              this.updateTime = response.data
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.queryysaj() // 移送案件列表数据查询
            }).catch(() => {
              this.listLoading = false
            })
          }).catch(() => {
            this.listLoading = false
          })
        }
      } else { // 侦办案件
        if (!this.zbajbh) {
          this.$message.error('请选择案件')
        } else {
          this.$confirm('确定要添加该案件吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              type: 'saveZbxss',
              assistId: this.xsfkRow.clusterId, // 集群Id
              fbId: this.xsfkRow.fbId, // 反馈Id
              zbxss: this.zbajbh + ',0,0,0,0,0', // 案件编号，捣毁窝点、涉案金额、批准逮捕、抓获、移诉
              userId: this.curUser.id, // 当前用户Id
              userName: this.curUser.realName, // 当前用户真实姓名
              curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
              curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
              assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
            }
            this.$update('caseassistclue/feedBack', param).then((response) => {
              this.listLoading = false
              this.isShowTime = true
              this.updateTime = response.data
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.queryzbxsaj() // 侦办刑事案件列表数据查询
            }).catch(() => {
              this.listLoading = false
            })
          }).catch(() => {
            this.listLoading = false
          })
        }
      }
    },
    changeQbxsResult(val) { // 查实、查否操作
      var title = ''
      if (val === 3) { // 查否
        title = '查否'
      } else { // 查实
        title = '查实'
      }
      this.$confirm('确定要' + title + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          qbxsId: this.xsfkRow.qbxsId, // 线索id
          type: 'result', // 操作类型
          fbId: this.xsfkRow.fbId, // 反馈Id
          qbxsResult: val, // 核查结果
          assistId: this.xsfkRow.clusterId, // 集群Id
          userId: this.curUser.id, // 当前用户Id
          userName: this.curUser.realName, // 当前用户真实姓名
          curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
          curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
          assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
        }
        this.$update('caseassistclue/feedBack', param).then((response) => {
          this.isShowTime = true
          this.updateTime = response.data
          this.$message({
            message: '核查成功',
            type: 'success'
          })
        }).catch(() => {

        })
      }).catch(() => {

      })
    },
    number(props, row) { // 只能是数字
      var num = row[props].replace(/[^\.\d]/g, '').replace('.', '')
      setTimeout(() => {
        if (num) {
          this.$set(row, props, num)
        } else {
          this.$set(row, props, 0)
        }
      }, 50)
    },
    handleSubmit(row) { // 提交侦办案件当前行数据
      if (row.dhwd === '' || row.dhwd === undefined || row.dhwd === null) {
        this.$message.error('捣毁窝点数量不能为空。')
      } else if (row.pzdb === '' || row.pzdb === undefined || row.pzdb === null) {
        this.$message.error('批捕人数不能为空。')
      } else if (row.sajz === '' || row.sajz === undefined || row.sajz === null) {
        this.$message.error('涉案金额不能为空。')
      } else if (row.zhrys === '' || row.zhrys === undefined || row.zhrys === null) {
        this.$message.error('抓获人数不能为空。')
      } else if (row.yjss === '' || row.yjss === undefined || row.yjss === null) {
        this.$message.error('移诉人数不能为空。')
      } else {
        this.$confirm('确定要提交数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            type: 'saveZbxss',
            assistId: this.xsfkRow.clusterId, // 集群Id
            fbId: this.xsfkRow.fbId, // 反馈Id
            zbxss: row.ajbh + ',' + row.dhwd + ',' + row.sajz + ',' + row.pzdb + ',' + row.zhrys + ',' + row.yjss, // 案件编号，捣毁窝点、涉案金额、批准逮捕、抓获、移诉
            userId: this.curUser.id, // 当前用户Id
            userName: this.curUser.realName, // 当前用户真实姓名
            curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
            curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
            assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
          }
          this.$update('caseassistclue/feedBack', param).then((response) => {
            this.listLoading = false
            this.isShowTime = true
            this.updateTime = response.data
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.queryzbxsaj() // 侦办刑事案件列表数据查询
          }).catch(() => {
            this.listLoading = false
          })
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    handleDel(type, row) { // 移除案件
      this.$confirm('确定要移除该案件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          assistId: this.xsfkRow.clusterId, // 集群Id
          fbId: this.xsfkRow.fbId, // 反馈Id
          userId: this.curUser.id, // 当前用户Id
          userName: this.curUser.realName, // 当前用户真实姓名
          curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
          curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
          assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
        }
        if (type === 1) { // 移送案件
          param.type = 'deleteSyajs'
          param.syajs = row.ajbh
          this.yslistLoading = true // 移送案件列表加载loading
        } else { // 侦办刑事案件
          param.type = 'deleteZbxss'
          param.zbxss = row.ajbh
          this.zblistLoading = true // 侦办刑事案件列表加载loading
        }
        this.$update('caseassistclue/feedBack', param).then((response) => {
          this.yslistLoading = false
          this.zblistLoading = false
          this.$message({
            message: '移除成功',
            type: 'success'
          })
          if (type === 1) { // 移送案件
            this.queryysaj() // 查询移送案件列表
          } else { // 侦办刑事案件
            this.queryzbxsaj() // 查询侦办刑事案件
          }
        }).catch(() => {
          this.yslistLoading = false
          this.zblistLoading = false
        })
      }).catch(() => {
        this.yslistLoading = false
        this.zblistLoading = false
      })
    }
  },
  mounted() {
    this.initData()
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '4') { // 派出所
        this.getfqDepts()
      }
    }
    this.xsfkRow = this.row
    this.detail() // 查详情
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueDetail{
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .stxt{
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
  .tipText{
    padding: 5px 0;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .textCen{
    .el-input__inner{
      text-align: center;
    }
  }
}
.redC{
  color: #f72929;
}
.qkts{
  margin-left: 60px;
  .el-button--mini.is-circle, .el-button--small.is-circle {
    padding: 0;
  }
  .svg-icon[data-v-5d4549d3] {
    width: 1.2em;
    height: 1.2em;
  }
  .inputW{
    width: 400px;
  }
}
</style>
