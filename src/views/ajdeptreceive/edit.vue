<template>
<!-- <el-form>

<el-form-item label="选择单位"  prop="deptCode">

          <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>11)?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptions"
              v-model="filterQuery.deptCode"
              :props="deptProps"
              :show-all-levels=false
              change-on-select
              @change="handleDeptChange"
              clearable placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
       <el-form-item label="案件类别">
          <el-select :clearable="true" v-model="filterQuery.ajlb" size="small" placeholder="请选择" filterable>
            <el-option v-for="item in ajlbData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="案件所属区域">
            <el-input  v-model="filterQuery.areaCode" placeholder="请输入案件所属区域编码"></el-input>
        </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="goback" class="cancelBtn">取消</el-button>
              <el-button type="primary" class="saveBtn" @click="submit" :loading="btnLoading">保存</el-button>
            </el-form-item>
</el-form>
 -->

 <div class="ajdeptEdit">
    <el-row class="card_width">
      <img src="@/assets/icon/back.png" class="goBack" @click="goback"/> <!--返回-->
    </el-row>
    <el-card class="card_width">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form ref="casdeptUpdateForm" :model="ajdept" :rules="rules" label-width="200px">
            <el-form-item label="选择单位"  prop="deptCode">
          <!-- <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>11)?'tooltipShow':'tooltipHide'"> -->
            <el-cascader
              :options="deptOptions"
              v-model="ajdept.deptCode"
              :props="deptProps"
              :show-all-levels=false
              change-on-select
              @change="handleDeptChange"
              clearable placeholder="全部">
            </el-cascader>
          <!-- </el-tooltip> -->
        </el-form-item>
        <el-form-item label="案件类别" prop="ajlbCode">
          <el-select :clearable="true" v-model="ajdept.ajlbCode" size="small" placeholder="请选择" filterable @change="ajlbChange">
               <el-option
                v-for="item in ajlbData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="状态：" prop="enable">
            <el-select v-model="ajdept.enable" placeholder="请选择" @change="changeStatus">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>



            <el-form-item label="请输入案件所属区域" prop="areaCode">
              <el-input v-model.trim="ajdept.areaCode" auto-complete="off" clearable maxlength="50"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="goback" class="cancelBtn">取消</el-button>
              <el-button type="primary" class="saveBtn" @click="submit" :loading="btnLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>


</template>

<script>

export default {

  data() {
    return {
      btnLoading: false, // 提交按钮加载loading
      ajdept: {
        id: '',
        deptCode: [],
        ajlbCode: '', // 类别编号
        ajlbName: '', // 类别名称
        deptName: '',
        areaCode: '',
        currDeptCode: '',
        enable: ''
      },
      options: [{ label: '启用', value: '1' }, { label: '停用', value: '0' }],

      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' },
      deptOptions: [], // 部门数据
      curDept: {}, // 当前部门
      ajlbData: [], // 案件类别
      parentDeptCodes: [],

      rules: {
        deptCode: [{
          required: true, trigger: 'blur', message: '请选择部门'
        }],

        ajlbCode: [
          {
            required: true, message: '请选择案件类别', max: 100, trigger: 'blur' }
        ],
        areaCode: [
          {
            required: true, message: '请输入4或6位区域编码', max: 6, trigger: 'blur'
          }
        ]

      }

    }
  },
  methods: {
    /*
    610600370000","610000530000","610000000000"

    ["610000000000","610000530000","610600370000","610626400000"]
    */

    goback() {
      this.$router.go(-1)
    },
    submit() {
      const param = {
        code: this.ajdept.ajlbCode,
        codeDescription: this.ajdept.ajlbName,
        deptCode: this.ajdept.deptCode[this.ajdept.deptCode.length - 1],
        deptName: this.ajdept.deptName,
        areaCode: this.ajdept.areaCode,
        enable: this.ajdept.enable
      }

      this.$refs.casdeptUpdateForm.validate(valid => {
        if (valid) {
          this.$update('ajdeptmapping/' + this.ajdept.id, param).then(res => {
            this.btnLoading = false
            if (res.code === '000000') {
              this.$message({ message: '修改成功', type: 'success' })
              this.$gotoid('/ajdeptreceive/list')
            } else {
              this.$message({ message: '修改失败', type: 'error' })
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    ajlbChange(val) {
      if (val) {
        let obj = {}
        obj = this.ajlbData.find((item) => {
          return item.code === val
        })
        this.ajdept.ajlbName = obj.name
      } else {
        this.ajdept.ajlbName = ''
      }
    },

    handleDeptChange(val) { // 发布单位
      // console.log(val)
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.selectCurDep = { name: '' }
      }
      this.ajdept.deptName = this.selectCurDep.name
    },
    getaParentCodes(deptCode) {
      // 清空

      var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const dept = deptArr[i]
        if (dept.depCode === deptCode) {
          this.selectCurDep = dept
          if (dept.parentCode) {
            this.parentDeptCodes.unshift(dept.parentCode)
            this.getaParentCodes(dept.parentCode)
          }
          break
        }
      }
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['depCode']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parentCode']]
        if (key && key.depType !== '4') { // 去掉派出所的层级
          if (!key['children']) {
            if (treeArray[i].depType !== '4') {
              key['children'] = []
              key['children'].push(treeArray[i])
            }
          } else {
            if (treeArray[i].depType !== '4') {
              key['children'].push(treeArray[i])
            }
          }
        } else {
          if (treeArray[i].depType !== '4') {
            r.push(treeArray[i])
          }
        }
      }
      return r
    },
    // 查询案件类别
    initAjlb() { // 初始化案件类别
      this.$query('AJLBCODE', {}).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbData = response.data
          console.log(this.ajlbData)
        }
      }).catch(() => {
      })
    }

  },
  mounted() {
    var dept = this.getTree(JSON.parse(sessionStorage.getItem('DeptSelect')))
    this.deptOptions = dept

    this.initAjlb()
    var id = sessionStorage.getItem(this.$route.path)
    this.ajdept.id = id
    // 使用ID查询单条数据
    this.$query('ajdeptmapping/' + id)
      .then(res => {
        this.btnLoading = false
        if (res.code === '000000') {
          // 回显
          var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
          for (let i = 0; i < deptArr.length; i++) {
            const dept = deptArr[i]
            if (dept.depCode === res.data.deptCode) {
              this.selectCurDep = dept
              break
            }
          }
          // 清空父部门Code数组
          this.parentDeptCodes = []
          // 查父部门 加到前面
          this.getaParentCodes(res.data.deptCode)
          // 把自己加到末尾
          this.parentDeptCodes.push(res.data.deptCode)
          this.ajdept.deptName = this.selectCurDep.name
          this.ajdept.deptCode = this.parentDeptCodes
          this.ajdept.ajlbCode = res.data.code
          this.ajdept.ajlbName = res.data.caseName
          this.ajdept.deptName = res.data.deptName
          this.ajdept.areaCode = res.data.areaCode
          this.ajdept.enable = res.data.enable + ''
        }
      })
      .catch(() => {
        this.btnLoading = false
      })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.ajdeptEdit .card_width {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.ajdeptEdit .card_width .el-transfer-panel {
  width: 44%;
}
@media only screen and (max-width: 1367px) {
  .el-col-14 {
    width: 85.3% !important;
  }
}
</style>


