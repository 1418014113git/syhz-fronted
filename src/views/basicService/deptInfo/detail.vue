<template>
  <section class="deptWrap">
    <el-row>
      <!-- <img src="@/assets/icon/back.png"  class="goBack" @click="back"> -->
      <el-button size="mini" class="right" @click="lookMoreDept" icon="el-icon-menu" style="margin-right:10px;">更多机构信息</el-button>
    </el-row>
    <el-card style="margin-top:10px;">
      <div slot="header">
        <span>机构信息</span>
        <!-- 非本单位机构用户审核权限用户登录 不显示编辑按钮，业务审核人员 只能对本单位的机构信息进行维护 -->
        <el-button style="float: right; padding: 3px 0;font-size:22px;margin-top:-5px;" type="text" icon="el-icon-edit-outline" title="编辑" @click="editDepartment" v-if="editBtnShow && ($isViewBtn('169003'))"></el-button>
      </div>
        <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="departmentForm" ref="departmentForm" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="11">
          <el-form-item label="机构全称" prop="departName">
            {{departmentForm.departName}}
          </el-form-item>
          <el-form-item label="机构级别" prop="departLevel" class="clearfix">
            {{$getDictName(departmentForm.departLevel+'','zyzz')}}
          </el-form-item>
          <el-form-item label="编制人数" prop="compileNum" class="clearfix">
            <span v-if="departmentForm.compileNum > 0">{{departmentForm.compileNum}}人</span>
            <span v-else>0 人</span>
          </el-form-item>
          <el-form-item label="所属行政区划" prop="areaCode" class="clearfix">
            {{departmentForm.areaCode}}
          </el-form-item>
          <el-form-item label="成立时间" prop="foundingTime" class="clearfix">
            {{departmentForm.foundingTime}}
          </el-form-item>
          <el-form-item label="联系电话" prop="linkmanPhone" class="clearfix">
            {{departmentForm.linkmanPhone}}
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainLeader" class="clearfix">
            {{departmentForm.mainLeader}}
          </el-form-item>
          <el-form-item label="日常联系人" prop="dailyLeader" class="clearfix">
            {{departmentForm.dailyLeader}}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="机构代码" prop="departCode" class="clearfix">
            {{departmentForm.departCode}}
          </el-form-item>
          <el-form-item label="主要职责任务" prop="mainAssignment" class="clearfix">
            <span  @click="changeShowAll($event,'showAllzyzzrw')" :class="showAllzyzzrw?'showAll':'showPart'">{{departmentForm.mainAssignment}}</span>
          </el-form-item>
          <el-form-item label="实有人数" prop="realityNum" class="clearfix">
            <span v-if="departmentForm.realityNum > 0">{{departmentForm.realityNum}} 人</span>
            <span v-else>0 人</span>
          </el-form-item>
          <el-form-item label="机构详细地址" prop="address" class="clearfix">
            <span  @click="changeShowAll($event,'showAllXxdz')" :class="showAllXxdz?'showAll':'showPart'">{{departmentForm.address}}</span>
          </el-form-item>
          <el-form-item label="邮编" prop="postcode" class="clearfix">
            {{departmentForm.postcode}}
          </el-form-item>
          <el-form-item label="传真号码" prop="faxNumber" class="clearfix">
            {{departmentForm.faxNumber}}
          </el-form-item>
          <el-form-item label="分管局领导" prop="subofficeLeader" class="clearfix">
            {{departmentForm.subofficeLeader}}
          </el-form-item>
          <el-form-item label="机构设置模式" prop="designMode">
            {{$getDictName(departmentForm.designMode+'','jgszms')}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" class="clearfix" prop="remark">
            {{departmentForm.remark}}
          </el-form-item>
        </el-col>
      </el-form>
        <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>

export default {
  name: 'add',
  data() {
    return {
      departmentForm: {},
      formLoading: false, // 表单loading
      carryParam: {}, // 列表带过来的参数
      showAllzyzzrw: false, // 主要职责任务 是否全部展示
      showAllXxdz: false, // 机构详细地址 是否全部展示
      editBtnShow: false, // 编辑按钮 是否为本部门
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  methods: {
    changeShowAll(e, type) {
      // console.log(e)
      // console.log(e.currentTarget)
      // if (type === 'zyzzrw') {
      //   this.showAllAzyzzrw = !this.showAllAzyzzrw
      // }
      this[type] = !this[type]
    },
    lookMoreDept() { // 更多机构信息
      this.$router.push({ path: '/basicService/deptInfo/index', query: {}})
    },
    editDepartment() { // 编辑部门
      this.$router.push({ path: '/basicService/deptInfo/edit', query: { deptId: this.carryParam.deptId }})
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    init() {
      if (this.carryParam.deptId) {
        // 列表进来的
      } else {
        // 菜单进来的
        this.carryParam.deptId = this.deptInfo.id // 将当前机构的id 放到 this.carryParam.deptId
      }
      if (this.deptInfo.id === this.carryParam.deptId) { // 本单位的人
        this.editBtnShow = true
      } else {
        this.editBtnShow = false
      }
      this.queryDetailById() // 查详情
    },
    queryDetailById() { // 通过id查询详情
      this.formLoading = true
      this.departmentForm.openDepts = []
      this.$query('hsyzdepart/' + this.carryParam.deptId, {}, 'upms').then((response) => {
        this.formLoading = false
        if (response.code === '000000') {
          this.departmentForm = response.data
          this.departmentForm.administrative = [] // 行政区划
          if (response.data.provinceCode) { // 省
            this.departmentForm.administrative.push(response.data.provinceCode)
          }
          if (response.data.cityCode) { // 市
            this.departmentForm.administrative.push(response.data.cityCode)
          }
          if (response.data.reginCode) { // 区
            this.departmentForm.administrative.push(response.data.reginCode)
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    cancel() { // 取消
      this.$confirm('是否要放弃编辑机构信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到详情画面
        this.$router.push({ path: '/basicService/deptInfo/detail', query: { deptId: this.carryParam.deptId }})
      }).catch(() => {
        // 留在编辑页面
      })
      // this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    this.init()
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.deptWrap {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 20px 40px;
  }
  .showPart {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .showAll {
    cursor: pointer;
    width: 100%;
    height: auto;
  }
}
</style>
