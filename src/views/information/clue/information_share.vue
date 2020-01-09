<template>
  <div>
    <el-row class="share">
      <img src="@/assets/icon/back.png"  class="goBack" @click="backList">   <!--返回-->
    </el-row>
    <el-card class="share">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h3>
            <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">分享线索</p>
          </h3>
          <el-form :model="share" size="small" ref="form" :rules="rules" label-width="140px" v-loading="loading">
            <el-form-item label="线索标题：">
              {{share.clueName}}
            </el-form-item>
            <el-form-item label="分享时间：">
              {{share.shareTime | formatDate}}
            </el-form-item>
            <el-form-item label="接收单位：" prop="selectedDepts">
              <el-collapse>
                <el-collapse-item name="1">
                  <template slot="title">
                      <div style="position:relative;">
                        <span>选择部门</span>
                        <el-checkbox-group v-model="checkListDeps" style="position:absolute;top: 0;left: 100px;">
                          <!-- 当前登录部门的 所有上级复选框 禁用 -->
                          <!-- <el-checkbox :label="1" :disabled="Number(deptInfo.depType)>1" @change="handleCheckedDepts($event,'1')">总队</el-checkbox> -->
                          <el-checkbox :label="2" :disabled="Number(deptInfo.depType)>2" @change="handleCheckedDepts($event,'2')">支队</el-checkbox>
                          <el-checkbox :label="3" :disabled="Number(deptInfo.depType)>3" @change="handleCheckedDepts($event,'3')">大队</el-checkbox>
                          <el-checkbox :label="4" :disabled="Number(deptInfo.depType)>4" @change="handleCheckedDepts($event,'4')">派出所</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </template>
                  <div class="dept-tree" v-loading="treeLoading">
                     <!-- @check-change="deptChange" -->
                    <el-tree class="filter-tree" ref="depTree1" style="margin-top: 5px;"
                             :data="depData"
                             :props="{children: 'children',label: 'name',value: 'id' }"
                             highlight-current show-checkbox check-strictly
                             node-key="id">
                      <span slot-scope="{ node, data }" @mouseleave="mouseleave(data,$event)" @mouseover="mouseover(data,$event)" style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                        <span>{{data.name}}</span>
                        <span class="node_none">
                          <el-button v-if="data.children && data.children.length>0" size="mini" @click="checkedSonDept(data,$event)" circle icon="el-icon-check" title="选中子部门"></el-button>
                          <el-button v-if="data.children && data.children.length>0" size="mini" @click="noCheckedSonDept(data,$event)" circle icon="el-icon-close" title="取消子部门"></el-button>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
            <el-form-item label="接收人：" prop="receivePersonId">
              <!-- <el-select v-model="receivePersonIds" class="input_w" placeholder="请选择"
                         filterable multiple clearable>
                <el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value + ',' + item.name + ',' + item.deptId"></el-option>
              </el-select> -->
              <el-select v-model="receivePersonIds" filterable multiple clearable remote reserve-keyword
                        placeholder="请输入警号或者真实姓名搜索" :remote-method="queryDeptsUser" :loading="userLoading" @visible-change="userVisible"
                        @change="caseChange($event,scope.$index,scope.row)"
                        value-key="id" class="input_w">
                <el-option v-for="item in userData" :key="item.id" :label="item.id +'---'+item.name+' ('+item.userName+ ')'" :value="item.value + ',' + item.name + ',' + item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item align="center">
              <el-button type="primary" @click="onSubmit()" class="saveBtn">分享</el-button>
              <el-button size="small" @click="cancelEdit()" class="cancelBtn">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getClueShareDepts } from '@/api/dept'
import { getSessionDeptSelect, getUsersByDep } from '@/api/depts'
export default {
  name: 'shareEdit',
  components: {
  },
  data() {
    return {
      depData: [],
      userData: [],
      receivePersonIds: [],
      information: {},
      share: {
        clueId: '',
        clueName: '',
        shareTime: '',
        receiveDeptId: '',
        receivePersonId: '',
        sharePersonId: '',
        sharePersonName: '',
        shareDeptId: '',
        shareDeptName: ''
      },
      treeLoading: false, // 接收单位加载的loading
      checkListDeps: [], // 接收单位复选框的v-model
      loading: false,
      noauth: false,
      selectedDepts: [],
      userLoading: false, // 接收人loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        selectedDepts: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (this.$refs.depTree1.getCheckedNodes().length === 0) {
                callback(new Error('请选择接收单位'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    mouseover(data, $event) {
      // console.log($event)
      $event.currentTarget.firstElementChild.nextElementSibling.setAttribute('class', 'node_block')
    },
    mouseleave(data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.setAttribute('class', 'node_none')
    },
    checkedSonDept(data, $event) { // 选中子部门
      // this.$refs.depTree1.store.nodesMap[data.id].expanded = true // 展开当前部门的子部门
      var checkNodes = this.$refs.depTree1.getCheckedNodes()
      // checkNodes = this.unique(checkNodes.concat([data])) // 包含当前节点
      var newArr = this.unique(checkNodes.concat(data.children))
      this.$refs.depTree1.setCheckedNodes(newArr) // 设置选中的节点
      this.$refs.form.validateField('selectedDepts') // 校验
    },
    noCheckedSonDept(data, $event) { // 取消选中子部门
      var checkedNodes = this.$refs.depTree1.getCheckedNodes() // 获取当前选中的部门
      for (let m = 0; m < data.children.length; m++) { // 当前节点的所有子节点
        const childItem = data.children[m]
        for (let index = 0; index < checkedNodes.length; index++) { // 遍历现有的节点
          const element = checkedNodes[index]
          if (childItem.id === element.id) {
            checkedNodes.splice(index, 1)
            break
          }
        }
      }
      this.$refs.depTree1.setCheckedNodes(checkedNodes) // 设置选中的节点
      this.$refs.form.validateField('selectedDepts') // 校验
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    handleCheckedDepts(value, curType) { // 开放部门checklist变化
      var checkedNodes = this.$refs.depTree1.getCheckedNodes()
      var byTypeArr = []
      this.returnedItem = [] // 递归方法调用前 先将数组置为空
      byTypeArr = this.findByLeafType(this.depData, curType)
      if (value) { // 选中 当前类型的所有部门
        var newArr = this.unique(checkedNodes.concat(byTypeArr))
        this.$refs.depTree1.setCheckedNodes(newArr) // 设置选中的节点
      } else { // 取消 当前类型的所有部门
        for (let q = 0; q < byTypeArr.length; q++) { // 当前类型的所有节点
          const childItem = byTypeArr[q]
          for (let w = 0; w < checkedNodes.length; w++) { // 遍历现有选中的节点
            const element = checkedNodes[w]
            if (childItem.id === element.id) {
              checkedNodes.splice(w, 1)
              break
            }
          }
        }
        this.$refs.depTree1.setCheckedNodes(checkedNodes) // 设置选中的节点
      }
      this.$refs.form.validateField('selectedDepts') // 校验
    },
    findByLeafType(nodes, type) { // 通过type找所有类型相同的部门
      for (let index = 0; index < nodes.length; index++) {
        const item = nodes[index]
        if (item.depType === type) {
          this.returnedItem.push(item)
        } else if (item.children && item.children.length > 0) { // 判断chlidren是否有数据
          this.findByLeafType(item.children, type) // 递归调用
        }
      }
      return this.returnedItem
    },
    // 提交分享
    onSubmit() {
      this.loading = true
      this.share.receivePersonId = []
      this.share.receivePersonId = this.receivePersonIds
      this.share.receiveDeptId = this.$refs.depTree1.getCheckedNodes() // 接受部门赋值
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$save('clue/share', this.share).then((response) => {
            this.loading = false
            if (response.data && response.data.msg) {
              this.$confirm(response.data.msg, '提示', {
                type: 'warning'
              }).then(() => {
                if (response.data.msgId === 1) {
                  return false
                }
                if (response.data.msgId === 2 || response.data.msgId === 3) {
                  // 撤回对此单位中人员的分享
                  this.$update('clue/shareRemove', response.data).then((response) => {
                    if (response.code === '000000') {
                      this.$message({
                        message: '线索撤回成功,请重新分享！',
                        type: 'success'
                      })
                    }
                  })
                  return false
                }
                if (response.data.msgId === 4) {
                  return false
                }
              })
            } else {
              this.timeOutBack()
              this.$message({
                message: '线索分享成功！',
                type: 'success'
              })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    deptChange(value, isChecked) {
      const _this = this
      if (isChecked) {
        if (value.id === _this.information.submitDeptId || value.id === _this.curDept.id) {
          this.$message({
            message: '线索不能分享给原报单位或自己所在单位！',
            type: 'warning'
          })
          value.disabled = true
          return
        }
        // this.selectedDepts.push({ id: value.id, name: value.name })
      } else {
        // this.selectedDepts.forEach((item, index) => {
        //   if (item.id === value.id) {
        //     this.selectedDepts.splice(index, 1)
        //   }
        // })
      }
      this.share.receiveDeptId = []
      this.share.receiveDeptId = this.$refs.depTree1.getCheckedNodes() // 赋值
      this.$refs.form.validateField('selectedDepts') // 校验
      this.getUsers([value.depCode.substring(0, 8)], isChecked, value.id) // 获取所选单位的人员
    },
    getUsers(deptCodes, isChecked, deptId) {
      const _this = this
      getUsersByDep(deptCodes).then((response) => {
        if (response.data && response.data.length > 0) {
          if (isChecked) { // 加人
            response.data.forEach(function(item) {
              _this.userData.push({
                value: item.id, name: item.real_name, userName: item.user_name, deptId: deptId, id: item.id
              })
            })
          } else {
            const _this = this
            response.data.forEach(function(item1) {
              _this.userData.forEach(function(item2, index) {
                if (item2.value === item1.id) {
                  _this.userData.splice(index, 1)
                }
              })
            })
          }
          _this.userData = this.unique(_this.userData)
        }
      })
    },
    detail() {
      this.loading = true
      this.$query('clue/getOne/', { id: this.share.clueId }).then(response => {
        this.loading = false
        this.information = response.data
        this.share.clueName = response.data.clueName
      }).catch(() => {
        this.loading = false
      })
    },
    timeOutBack() {
      const _this = this
      setTimeout(function() {
        _this.loading = false
        _this.backList()
      }, 2000)
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.backList()
      })
    },
    backList() {
      this.$gotoid('/information/clueList')
    },
    initDeptData() {
      var allList = getSessionDeptSelect()
      for (let index = 0; index < allList.length; index++) {
        const element = allList[index]
        if (element.id === this.information.submitDeptId || element.id === this.curDept.id) { // 线索不能分享给原报单位或自己所在单位
          element.disabled = true
        }
      }
      this.depData = getClueShareDepts(allList, this.curDept.parentDepCode, this.curDept.depCode)[0].children
    },
    userVisible(flag) {
      if (!flag) {
        this.userLoading = false
        this.userData = []
      }
    },
    queryDeptsUser(query) {
      var list = this.$refs.depTree1.getCheckedNodes()
      var deptArr = []
      this.userData = [] // 接收人
      if (query !== '' && list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          deptArr.push(element.depCode)
        }
        var param = {
          depts: deptArr,
          name: query
        }
        this.userLoading = true
        var _this = this
        this.$queryPost('api/deptsuser', param, 'upms').then(response => {
          this.userLoading = false
          response.data.forEach(function(item) {
            _this.userData.push({
              value: item.id, name: item.real_name, userName: item.user_name, deptId: item.deptId, id: item.id
            })
          })
        }).catch(() => {
          this.userLoading = false
        })
      } else {
        this.userLoading = false
        this.userData = []
        if (list.length === 0) {
          this.$message({
            message: '请先选择接收单位',
            type: 'warning'
          })
        }
      }
    }
  },
  mounted() {
    this.share.shareTime = new Date()
    // 线索数据查询
    if (this.$route.query.id) {
      this.share.clueId = this.$route.query.id
      this.detail()
    }
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curDept && this.curUser) {
      this.share.sharePersonId = this.curUser.id
      this.share.sharePersonName = this.curUser.realName
      this.share.shareDeptId = this.curDept.id
      this.share.shareDeptName = this.curDept.depName
    }
    this.initDeptData()
  },
  filters: {
    formatDate: function(value) {
      var date = new Date(value)
      var y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + MM + '-' + d
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.share {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .node_block {
    display: inline-block;
  }
  .node_none {
    display: none;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #f2f6fc;
    border-color: #dcdfe6;
  }
}

.share h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}

.share .input_w {
  width: 100%;
}

.share .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
.el-select__input {
  color: #f2f6fc;
}
</style>
