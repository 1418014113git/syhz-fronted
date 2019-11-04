<template>
  <section class="addEdit">
    <el-form :model="addEditForm" size="small" ref="addEditForm" :rules="rules" label-width="100px" class="addEditForm">
      <el-row type="flex" justify="space-around">
        <el-col :span='11'>
          <el-form-item label="装备分类" prop="groupId">
            <el-select  v-if='tkType===1'  v-model.trim="addEditForm.groupId" placeholder="请选择" clearable  :disabled="isDisabled(true)"   @change="changeSelect">
              <el-option :label="item.groupName" :value="item.groupId" v-for="item in zbflData" :key="item.groupId"></el-option>
            </el-select>
            <el-select  v-else  v-model.trim="addEditForm.groupId" placeholder="请选择" clearable  :disabled="isDisabled(curInfo.groupId)"   @change="changeSelect">
              <el-option :label="item.groupName" :value="item.groupId" v-for="item in zbflData" :key="item.groupId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配备数量" prop="equipNumber">
            <el-input-number v-model.trim="addEditForm.equipNumber" :min="1" :max="999" label="配备数量"></el-input-number>
            <span class="pbbz">标准: {{standard}}</span>
          </el-form-item>
        </el-col>
        <el-col :span='11'>
          <el-form-item label="配备项目" prop="allocateId">
            <el-select v-if='tkType===1'  v-model.trim="addEditForm.allocateId" placeholder="请选择" clearable :disabled="isDisabled(true)" @change="changeSelectAllocate">
              <el-option :label="item.allocateName" :value="item.allocateId" v-for="item in pbxmData" :key="item.allocateId"></el-option>
            </el-select>
            <el-select v-else  v-model.trim="addEditForm.allocateId" placeholder="请选择" clearable :disabled="isDisabled(curInfo.allocateId)" @change="changeSelectAllocate">
              <el-option :label="item.allocateName" :value="item.allocateId" v-for="item in pbxmData" :key="item.allocateId"></el-option>
            </el-select>
            <span>{{allocateType}}</span>
          </el-form-item>
          <el-form-item label="采购日期" prop="purchaseTime">
            <el-date-picker v-model="addEditForm.purchaseTime" type="date" value-format="yyyy-MM-dd" class="inputw" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-col :span='23' class="sm">
          <el-form-item label="说明:" prop="remark" >
            <el-input v-model.trim="addEditForm.remark" type="textarea"  placeholder="最多输入500个字符" maxlength="500" class="inptW"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tabC btnUpLine" style="margin-top: 20px;">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  export default {
    name: 'addEdit',
    props: ['curRowData', 'curType', 'isShowDialog'],
    data() {
      return {
        addEditForm: {
          groupId: '', // 分类id
          allocateId: '', // 项目id
          equipNumber: '', // 配备数量
          purchaseTime: '', // 采购日期
          remark: '', // 说明
          userId: JSON.parse(sessionStorage.getItem('userInfo')).id, // 用户id
          userName: JSON.parse(sessionStorage.getItem('userInfo')).realName, // 用户真实姓名
          belongAreaCode: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '', // 所属区域code
          belongDepCode: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depCode : '', // 所属部门code
          belongDepName: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depName : '' // 所属部门名称
        },
        equipNumberName: '', // 单位 例如：部/队，给后台传时，只传'部'
        standard: '', // 根据选择的配备项目，存储经过拼接处理后的显示信息。
        allocateType: '', // 根据选择的配备项目，存储配备项类型中文名 (1必配 2选配 3无要求 )
        btnLoading: false, // 加载进度条
        zbflData: [], // 装备分类下拉框
        pbxmData: [], // 配备项目下拉框
        curInfo: {}, // 存储明细页传递过来的装备分类和配备项目的类型
        tkType: '', // 弹框类型  0，添加， 1编辑
        pickerOptions: { // 采购日期不能大于当前日期
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        rules: {
          groupId: [ // 装备分类
            { required: true, message: '请选择装备分类', trigger: 'change' }
          ],
          equipNumber: [ // 配备数量
            { required: true, message: '请输入配备数量', trigger: 'blur' }
          ],
          allocateId: [ // 配备项目
            { required: true, message: '请选择配备项目', trigger: 'change' }
          ],
          purchaseTime: [ // 采购日期
            { required: true, message: '请选择采购日期', trigger: 'change' }
          ]
        }
      }
    },
    watch: { // 监听state状态变化
      curRowData: {
        handler: function(val, oldeval) {
          this.curInfo = val
        }
      },
      curType: {
        handler: function(val, oldeval) {
          this.tkType = val
        }
      },
      isShowDialog: {
        handler: function(val, oldeval) {
          this.init()
        }
      }
    },
    methods: {
      init() {
        this.btnLoading = false
        this.initData()
        this.equipgroupselect() // 装备分类下拉框
        if (this.tkType === 1) { // 编辑  则查详情接口
          this.$query('basicequipdetail/' + this.curInfo.dtatilId, {}).then((response) => {
            if (response.data.id) {
              this.addEditForm.groupId = response.data.groupId ? response.data.groupId : ''
              var allocateId = response.data.allocateId ? response.data.allocateId : ''
              this.addEditForm.equipNumber = response.data.equipNumber ? response.data.equipNumber : 0
              this.addEditForm.purchaseTime = response.data.purchaseTime ? response.data.purchaseTime : ''
              this.addEditForm.remark = response.data.remark ? response.data.remark : ''
              this.equipallocateselect(this.addEditForm.groupId, allocateId)
            }
          })
        } else { // 添加
          this.equipallocateselect(this.curInfo.groupId ? Number(this.curInfo.groupId) : '', this.curInfo.allocateId ? Number(this.curInfo.allocateId) : '')
        }
      },
      initData() {
        this.resetForm('addEditForm')
        this.standard = ''
        this.allocateType = ''
      },
      equipgroupselect() { // 装备分类下拉框
        this.$query('equipgroupselect', {}).then((response) => {
          this.zbflData = response.data
          this.addEditForm.groupId = Number(this.curInfo.groupId)
        })
      },
      inputChange(num) {
        if (!num) {
          this.addEditForm.num = 1
        }
      },
      save() { // 保存
        this.$refs.addEditForm.validate(valid => {
          if (valid) {
            this.btnLoading = true
            if (this.tkType === 0) { // 保存
              this.savePort()
            } else { // 编辑
              this.editPort()
            }
          } else {
            this.btnLoading = false
            return false
          }
        })
      },
      savePort() { // 添加--保存接口
        this.addEditForm.equipNumberName = this.equipNumberName
        this.$save('basicequipdetail', this.addEditForm).then((response) => {
          this.$message({
            message: '装备信息保存成功！',
            type: 'success',
            duration: 2000
          })
          // setTimeout(() => {
          this.btnLoading = false
          this.$emit('closeDialog', false)
          // }, 2000)
        }).catch(() => {
          this.btnLoading = false
        })
      },
      editPort() { // 编辑==保存接口
        const param = {
          equipNumber: this.addEditForm.equipNumber,
          purchaseTime: this.addEditForm.purchaseTime,
          remark: this.addEditForm.remark,
          userId: this.addEditForm.userId,
          userName: this.addEditForm.userName
        }
        this.$update('basicequipdetail/' + this.curInfo.dtatilId, param).then((response) => {
          this.$message({
            message: '装备信息保存成功！',
            type: 'success',
            duration: 2000
          })
          // setTimeout(() => {
          this.btnLoading = false
          this.$emit('closeDialog', false)
          // }, 2000)
        }).catch(() => {
          this.btnLoading = false
        })
      },
      cancel() { // 取消
        this.$confirm('是否要放弃编辑的装备信息？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$emit('closeDialog', false)
        }).catch(() => {

        })
      },
      changeSelect(val) { // 装备分类change事件
        if (val) {
          this.equipallocateselect(val)
        } else {
          this.pbxmData = []
        }
      },
      changeSelectAllocate(val) {
        if (val) {
          this.pbxmData.forEach(element => {
            if (element.allocateId === val) {
              this.changeSelectxm(element)
            }
          })
        }
      },
      changeSelectxm(item) { // 配备项目change事件
        if (this.addEditForm.allocateId) {
          this.allocateType = this.getAllocateType(item.allocateType)
          this.standard = this.getStandard(item)
          this.equipNumberName = item.unitTypeName.substring(0, 1)
        } else {
          this.allocateType = ''
          this.standard = ''
        }
      },
      equipallocateselect(id, val) { // 配备项目下拉框
        this.pbxmData = []
        if (id) {
          const param = {
            groupId: id,
            departType: JSON.parse(sessionStorage.getItem('depToken')) ? JSON.parse(sessionStorage.getItem('depToken'))[0].depType : ''
          }
          this.$query('equipallocateselect', param).then((response) => {
            this.pbxmData = response.data
            if (val) {
              this.addEditForm.allocateId = val
              this.pbxmData.forEach(element => {
                if (element.allocateId === val) {
                  this.changeSelectxm(element)
                }
              })
            }
          })
        }
      },
      getAllocateType(val) { // 根据配备类型获取中文名
        var name = ''
        if (val === 1) {
          name = '必配'
        } else if (val === 2) {
          name = '选配'
        } else if (val === 3) {
          name = '无要求'
        }
        return name
      },
      getStandard(item) {
        var name = ''
        item.num2 = 2
        if (item.num1 > 0 && item.num2 > 0) {
          if (item.num2 === 1) {
            name = item.num1 + ' ' + item.unitTypeName.substring(0, 1) + ' / ' + item.unitTypeName.substring(2)
          } else {
            name = item.num1 + ' ' + item.unitTypeName.substring(0, 1) + ' / ' + item.num2 + ' ' + item.unitTypeName.substring(2)
          }
        } else {
          name = '1' + ' ' + item.unitTypeName
        }
        return name
      },
      isDisabled(val) {
        if (val) {
          return true
        } else {
          return false
        }
      },
      resetForm(formName) { // 重置表单
        this.$refs[formName].resetFields()
      }
    },
    mounted() {
      this.curInfo = this.curRowData
      this.tkType = this.curType
      // this.zbflpbxm = this.flxm
      this.init()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
.addEdit {
  .pbbz{
    margin-left: 20px;
    color: #00a0e9;
  }
  .inptW{
    width: 87.5%;
  }
}
@media only screen and (max-width: 1367px) {
  .addEdit .inptW {
    width: 89.5%;
  }
}
@media screen and (min-width: 1920px) {
  .addEdit .inptW {
    width: 86.2%;
  }
}
</style>
