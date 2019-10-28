<template>
<div>
    <el-row class="card_width">
      <img src="@/assets/icon/back.png" class="goBack" @click="goToList"/> <!--返回-->
    </el-row>
    <el-card class="card_width">
      <el-row class="examNotice_spe_save">
        <el-col :span="18" style="margin-top: 24px;">
          <el-form ref="groupsDetailForm"  label-width="200px" :rules="rules">
            <el-form-item label="组名：" prop="groupName" >
              <el-input
                v-model.trim="groupName"
                maxlength="500"
                clearable
                disabled
                style="width: 675px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="desc">
              <el-input
              disabled
                v-model="desc"
                maxlength="500"
                style="width: 675px;"
              ></el-input>
            </el-form-item>

            <el-form-item label="组成员"  class="clearfix" prop="deptIds">
                <el-transfer class="left"
                  filter-placeholder="请输入关键字检索人员"
                  v-model="target"

                  :button-texts="['移除', '选中']"
                  :titles="['部门列表','已选中的部门']"
                  :data="childDeptArr"
                  >
                </el-transfer>
              </el-form-item>
                 <el-form-item style="text-align:right">

              <el-button type="primary"  disabled>取消</el-button>
              <el-button type="primary"   disabled :loading="btnLoading">保存</el-button>
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
      groupId: '',
      groupName: '',
      desc: '',
      value: [],
      formLoading: false, // 表单loading
      childDepts: [], // 当前部门和所有子部门
      childDeptArr: [], // 穿梭框绑定的值
      treeLoading: true, // 开放单位加载的loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      target: [], // 当前已选择的部门
      deptIds: [], // 当前选择的部门Id ，参数之一
      btnLoading: false, // 提交按钮加载loading,
      rules: {
        groupName: [
          {
            required: true, min: 1, max: 50, message: '组名长度应为1-50个字符', trigger: 'blur'

          }
        ],

        deptIds: [
          {
            required: true, message: '请选择组成员', trigger: 'blur'
          }
        ]

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
    }
  },
  mounted() {
    this.groupId = sessionStorage.getItem(this.$route.path)

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

    // 查当前组的详情

    this.$query('group/groupDetail', { groupId: this.groupId }).then((response) => {
      if (response.code === '000000') {
        this.target = []
        if (response.data) {
          this.groupName = response.data.groupName
          this.desc = response.data.desc
        }
        if (response.data && response.data.items) {
          this.groupName = response.data.groupName
          this.desc = response.data.desc
          response.data.items.forEach((item, index) => {
            // 设置组成员
            this.target.push(item.itemId)
          })
        }
      }
    }).catch(() => {
      this.childDepts = []
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.card_width {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.el-transfer-panel {
  width: 360px;
}

@media only screen and (max-width: 1367px) {
  .el-col-14 {
    width: 85.3% !important;
  }
}
</style>

