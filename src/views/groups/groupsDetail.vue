<template>
  <div class="groupDetail">
    <el-row class="card_width">
      <img src="@/assets/icon/back.png" class="goBack" @click="goToList"/> <!--返回-->
    </el-row>
    <el-card class="card_width">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form ref="groupsDetailForm" :model="group" :rules="rules" v-loading="loading" label-width="120px" disabled>
            <el-form-item label="组名" prop="groupName">
              <el-input v-model.trim="group.groupName" auto-complete="off" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="desc">
              <el-input v-model="group.desc" type="textarea" maxlength="200" placeholder="最多可输入200个字符！"></el-input>
            </el-form-item>
            <el-form-item label="组成员" prop="deptIds" class="clearfix">
              <el-transfer v-model="target" :titles="['单位名称','单位名称']" :data="childDeptArr"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="cancelBtn">取消</el-button>
              <el-button type="primary" class="saveBtn" :loading="btnLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      loading: false,
      groupId: '',
      value: [],
      formLoading: false, // 表单loading
      childDepts: [], // 当前部门和所有子部门
      childDeptArr: [], // 穿梭框绑定的值
      treeLoading: true, // 开放单位加载的loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      target: [], // 当前已选择的部门
      btnLoading: false, // 提交按钮加载loading,
      group: {
        groupName: '', // 组名
        desc: '', // 说明
        deptIds: [], // 组成员Id
        itemCount: 0,
        modifierId: '',
        modifierName: ''

      },
      rules: {
        groupName: [{
          required: true, min: 1, max: 50, trigger: 'blur', validator: (rule, value, callback) => {
            const groupName = value
            if (!groupName) {
              callback(new Error('请输入组名'))
              return
            }
            if (groupName.length > 50) {
              callback(new Error('组名长度应为1-50个字符'))
              return
            }
            this.$update('group/checkGroupNameRepeat', { groupName: groupName, groupId: this.groupId, creatorId: this.userInfo.id }).then(res => {
              this.btnLoading = false
              if (res.code === '000000' && res.data.type === 1) {
                callback(new Error('组名重复，请确认后重新输入！'))
              } else {
                callback()
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        }],
        deptIds: [{ required: true, message: '请选择组成员', trigger: 'blur' }],
        desc: [{ required: false, message: '说明长度应为1-500个字符', max: 500, trigger: 'blur' }]
      }
    }
  },
  methods: {
    goToList() {
      // 返回列表页
      this.$gotoid('/groups/groupsList')
    },
    goback() {
      // 重置
      this.$router.go(-1)
    },
    queryDept() {
      // 获取本单位和下级单位
      this.$query('deptsbyparentdeptcode', { deptCode: this.deptInfo.depCode }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.childDepts = response.data

          this.childDepts.forEach((dept, index) => {
            this.childDeptArr.push({
              label: dept.deptName,
              key: dept.id,
              disabled: true

            })
          })
        } else {
          this.childDepts = []
        }
      }).catch(() => {
        this.childDepts = []
      })
    },
    detail() {
      this.loading = true
      this.$query('group/groupDetail', { groupId: this.groupId }).then((response) => {
        if (response.code === '000000') {
          this.loading = false
          this.target = []
          if (response.data) {
            this.group.groupName = response.data.groupName
            this.group.desc = response.data.desc
          }
          if (response.data && response.data.items) {
            this.group.groupName = response.data.groupName
            this.group.desc = response.data.desc
            response.data.items.forEach((item, index) => {
              // 设置组成员
              this.target.push(item.itemId)
            })
          }
        }
      }).catch(() => {
        this.childDepts = []
        this.loading = false
      })
    }
  },
  mounted() {
    this.groupId = sessionStorage.getItem(this.$route.path)
    this.queryDept()
    this.detail()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .groupDetail .card_width{
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .groupDetail .card_width .el-transfer-panel {
    width: 44%;
  }
  @media only screen and (max-width: 1367px) {
    .el-col-14 {
      width: 85.3% !important;
    }
  }
</style>

