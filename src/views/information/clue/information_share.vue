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
            <el-form-item label="接收部门：" prop="selectedDepts">
              <el-collapse>
                <el-collapse-item title="选择接收部门" name="1">
                  <div class="dept-tree">
                    <el-tree class="filter-tree" ref="depTree1" style="margin-top: 5px;"
                             :data="depData"
                             :props="{children: 'children',label: 'name'}"
                             highlight-current show-checkbox check-strictly
                             @check-change="deptChange"
                             node-key="id">
                    </el-tree>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
            <el-form-item label="接收人：" prop="receivePersonId">
              <el-select v-model="receivePersonIds" class="input_w" placeholder="请选择"
                         filterable multiple clearable>
                <el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value + ',' + item.name + ',' + item.deptId"></el-option>
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
      rules: {
        selectedDepts: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (this.selectedDepts.length === 0) {
                callback(new Error('请选择接收单位'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      loading: false,
      noauth: false,
      selectedDepts: []
    }
  },
  methods: {
    // 提交分享
    onSubmit() {
      this.loading = true
      this.share.receivePersonId = []
      this.share.receivePersonId = this.receivePersonIds
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
        this.selectedDepts.push({ id: value.id, name: value.name })
      } else {
        this.selectedDepts.forEach((item, index) => {
          if (item.id === value.id) {
            this.selectedDepts.splice(index, 1)
          }
        })
      }
      this.share.receiveDeptId = []
      this.share.receiveDeptId = this.selectedDepts
      this.getUsers([value.depCode.substring(0, 8)], isChecked, value.id) // 获取所选单位的人员
    },
    getUsers(deptCodes, isChecked, deptId) {
      const _this = this
      getUsersByDep(deptCodes).then((response) => {
        if (response.data && response.data.length > 0) {
          if (isChecked) { // 加人
            response.data.forEach(function(item) {
              _this.userData.push({
                value: item.id, name: item.real_name, userName: item.user_name, deptId: deptId
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
      this.depData = getClueShareDepts(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
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

<style scoped>
.share {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
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
</style>
