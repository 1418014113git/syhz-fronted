<template>
<div>
    <el-row class="card_width">
      <img src="@/assets/icon/back.png" class="goBack" @click="goToList"/> <!--返回-->
    </el-row>
    <el-card class="card_width">
      <el-row class="examNotice_spe_save">
        <el-col :span="18" style="margin-top: 24px;">
          <el-form ref="groupsSaveForm" :model="group" :rules="rules" label-width="200px">
            <el-form-item label="组名：" prop="groupName">
              <el-input
                v-model.trim="group.groupName"
                placeholder="请输入组名"
                maxlength="500"
                clearable
                style="width: 675px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="desc">
              <el-input
                v-model="group.desc"
                maxlength="500"
                style="width: 675px;"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item label="内　容：" prop="content">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="notice.content"
                @change="onContentChange"
              ></el-input>
            </el-form-item>-->


            <!--<el-input type="text" v-model="group.items" clearable class="left" style="width:360px;" @keyup.enter.native="filterMarkPeople(yjry)" placeholder="请输入关键字，回车键搜索"></el-input>-->
            <el-form-item label="组成员" prop="deptIds" class="clearfix">

                  <!-- filterable
                  :filter-method="filterMethod" -->
                <el-transfer class="left"
                  filter-placeholder="请输入关键字检索人员"
                  v-model="target"
                  :button-texts="['移除', '选中']"
                  :titles="['部门列表','已选中的部门']"
                  :data="childDeptArr"
                  @change="groupDeptChange"
                  >

                </el-transfer>

              </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit" :loading="btnLoading">提交</el-button>
              <el-button type="primary" @click="goback">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <el-col :span="14" style="text-align: center;">
          <el-button type="primary" @click="submit" :loading="btnLoading">提交</el-button>
          <el-button type="primary" @click="goback">取消</el-button>
        </el-col> -->
      </el-row>
    </el-card>
</div>
</template>

<script>

export default {

  data() {
    return {
      value: [],
      formLoading: false, // 表单loading
      childDepts: [], // 当前部门和所有子部门
      childDeptArr: [], // 穿梭框绑定的值
      treeLoading: true, // 开放单位加载的loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      target: [], // 当前已选择的部门
      deptIds: [], // 当前选择的部门Id ，参数之一

      btnLoading: false, // 提交按钮加载loading
      group: {
        groupName: '', // 组名
        desc: '', // 说明
        deptIds: [], // 组成员Id
        itemCount: 0

      },

      rules: {

        groupName: [{
          required: true, min: 1, max: 50, trigger: 'blur', validator: (rule, value, callback) => {
            const groupName = value
            if (!groupName || groupName.length > 50) {
              callback(new Error('组名长度应为1-50个字符'))
              return
            }
            this.$query('/group/checkGroupNameRepeat', { groupName: groupName, creatorId: this.userInfo.id }).then(res => {
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

        deptIds: [
          {
            required: true, message: '请选择组成员', trigger: 'blur'
          }
        ]

      }
    }
  },
  methods: {
    groupDeptChange() {
      // 清空要提交的数据
      this.group.deptIds = []
    },

    submit() {
      // 组成员Ids

      this.group.deptIds = this.target

      // 提交
      // 表单校验
      this.$refs.groupsSaveForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.group.itemCount = this.group.deptIds.length
          this.group.creatorId = this.userInfo.id
          this.group.creatorName = this.userInfo.realName
          this.group.deptCode = this.deptInfo.depCode
          this.group.deptId = this.deptInfo.id
          this.group.deptName = this.deptInfo.depName

          // 组类型为部门
          this.group.type = 2

          this.$save('group', this.group).then(res => {
            this.btnLoading = false
            if (res.code === '000000') {
              this.$message({ message: '常用组保存成功', type: 'success' })
              setTimeout(() => {
                this.goToList()
              }, 3000)
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },

    goToList() {
      // 返回列表页
      this.$gotoid('/groups/groupsList')
    },
    goback() {
      this.$confirm('是否要放弃当前编辑的组信息?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      })

      // 重置
    }
  },

  mounted() {
    // 获取本单位和下级单位
    this.$query('deptsbyparentdeptcode', { deptCode: this.deptInfo.depCode }, 'upms').then((response) => {
      if (response.code === '000000') {
        this.childDepts = response.data

        this.childDepts.forEach((dept, index) => {
          this.childDeptArr.push({
            label: dept.deptName,
            key: dept.id

          })
        })
      } else {
        this.childDepts = []
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

