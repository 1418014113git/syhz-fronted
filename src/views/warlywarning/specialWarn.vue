<template>
  <div class="specialWarn">
    <el-row>
    <el-col :span="8" class="test" v-for="(item,index) in models" :key="item.id">
      <el-card class="card">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
          <el-button class="rightBtn" icon="el-icon-delete" type="danger" v-if="$isViewBtn('100603')"
                     @click="onDelItem(item.id)" :loading="fullLoading"></el-button>
          <el-button class="rightBtn" icon="el-icon-edit" type="primary" v-if="$isViewBtn('100602')" @click="showEdit(index)"></el-button>
        </div>
        <el-row v-for="(o,index) in item.value" :key="index">
          <el-col :span="6">{{formatCond(o.name)}}</el-col>
          <el-col :span="5">{{formatCondType(o.cond)}}</el-col>
          <el-col :span="13">
              <span v-if="o.name==='whcd'">
                  {{formatWhcd(o.value)}}
                </span>
            <span v-else>
                   {{o.value}}
                </span>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="8" class="test">
      <el-card class="card">
        <el-row>
          <el-button icon="el-icon-plus" class="add-btn" v-if="$isViewBtn('100601')" @click="showAddDia('新增模型','add')"></el-button>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

    <el-dialog :visible.sync="diaAddVisible" class="body-class" @close="cancel(true)">
      <div slot="title">
        {{diaTitle}}
      </div>
      <el-row class="dia-div">
        <el-form :model="condition" :rules="rules" ref="conditionForm" label-width="100px">
          <el-row>
            <el-form-item label="模型名称：" prop="modelName">
              <el-input v-model="condition.modelName" class="input_w"></el-input>
            </el-form-item>
          </el-row>

          <el-row v-for="(item,index) in warnModel.value" :key="item.id" style="border-top:1px solid #CCC; border-bottom: 1px solid #ccc;">
            <el-col :span="4">条件：</el-col>
            <el-col :span="20">
              <el-col :span="6" class="dia-padding">
                {{formatCond(item.name)}}
              </el-col>
              <el-col :span="5" class="dia-padding">
                {{formatCondType(item.cond)}}
              </el-col>
              <el-col :span="5" class="dia-padding">
                <span v-if="item.name==='whcd'">
                  {{formatWhcd(item.value)}}
                </span>
                <span v-else>
                   {{item.value}}
                </span>
              </el-col>
              <el-col :span="5" class="dia-padding">
                <el-button icon="el-icon-edit" type="danger" @click="onEdit(item, index)"></el-button>
                <el-button icon="el-icon-delete" type="danger" @click="onDel(item.id, index)"></el-button>
              </el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-form-item label="类型：" prop="name">
              <el-select v-model="condition.name" placeholder="请选择" @change="conditionChange">
                <el-option v-for="item in warnConds" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="条件：" prop="cond">
              <el-select v-model="condition.cond" placeholder="请选择">
                <el-option v-for="item in warnCondType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值：" prop="value">
              <el-select v-if="condition.name==='whcd'" v-model="condition.value" placeholder="请选择">
                <el-option v-for="item in whcdList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-date-picker v-else-if="condition.name==='fasjsx'" v-model="condition.value" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              <el-input v-else v-model="condition.value" size="small" style="width: 80%"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="text-align: center">
            <el-button type="primary" @click="onSubmit" v-if="$isViewBtn('100601')" :loading="fullLoading">提 交</el-button>
            <el-button @click="cancel(true)">关 闭</el-button>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getWarnCondition, getWarnCondType, getWarnCondText, getWarnCondTypeText, getWhcdList, getWhcdText
  } from '@/utils/codetotext'
  import {
    getSpecialmodeList, delSpecialmode, addSpecialmode, editSpecialmode
  } from '@/api/specialmode'

  export default {
    name: 'specialWarn',
    components: {},
    data() {
      return {
        condItemEditIdx: -1,
        currentUser: {},
        currentDep: {},
        warnConds: getWarnCondition(),
        warnCondType: getWarnCondType(),
        whcdList: getWhcdList(),
        diaAddVisible: false,
        fullLoading: false,
        diaTitle: '',
        oriItemName: '',
        warnModel: {
          id: '', name: '', value: []
        },
        models: [],
        model: {},
        condition: {
          modelName: '', name: '', cond: '', value: ''
        },
        rules: {
          modelName: [{
            required: true, trigger: 'blur', message: '请输入模型名称'
          }],
          name: [{
            required: true, trigger: ['blur', 'change'], message: '请选择类型'
          }],
          cond: [{
            required: true, trigger: ['blur', 'change'], message: '请选择条件'
          }],
          value: [{
            required: true, trigger: 'blur', message: '请输入值'
          }]
        }
      }
    },
    methods: {
      formatWhcd(type) {
        return getWhcdText(type)
      },
      formatCond(type) {
        return getWarnCondText(type)
      },
      formatCondType(type) {
        return getWarnCondTypeText(type)
      },
      showAddDia(title, type) {
        this.diaAddVisible = true
        this.diaTitle = title
        this.warnModel = { id: '', name: '', value: [] }
      },
      onSubmit() {
        this.$refs.conditionForm.validate(valid => {
          if (valid) {
            this.doHandler()
          }
        })
      },
      doHandler() {
        this.warnModel.name = this.condition.modelName
        if (this.condItemEditIdx > -1) {
          if (this.condition.name && this.condition.cond && this.condition.value) {
            this.warnModel.value[this.condItemEditIdx] = {
              name: this.condition.name, cond: this.condition.cond, value: this.condition.value
            }
          }
        } else {
          if (this.condition.name && this.condition.cond && this.condition.value) {
            this.warnModel.value.push({
              name: this.condition.name, cond: this.condition.cond, value: this.condition.value
            })
          }
        }
        this.fullLoading = true
        if (this.warnModel.id) {
          const para = {
            id: this.warnModel.id, name: this.warnModel.name, operateValue: JSON.stringify(this.warnModel.value)
          }
          editSpecialmode(para).then((response) => {
            this.fullLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '提交成功', type: 'success'
              })
              this.condition.name = ''
              this.condition.cond = ''
              this.condition.value = ''
            }
          }).catch(() => {
            this.fullLoading = false
          })
        } else {
          const para = {
            name: this.warnModel.name, operateValue: JSON.stringify(this.warnModel.value),
            createUserId: this.currentUser.id, createUserName: this.currentUser.realName,
            createDeptId: this.currentDep.id, createDeptName: this.currentDep.depName, enable: 1
          }
          addSpecialmode(para).then((response) => {
            this.fullLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '提交成功', type: 'success'
              })
              this.warnModel.id = response.data
              this.condition.name = ''
              this.condition.cond = ''
              this.condition.value = ''
            }
          }).catch(() => {
            this.fullLoading = false
          })
        }
      },
      showEdit(index) {
        this.warnModel = this.models[index]
        this.condition.modelName = this.warnModel.name
        this.diaAddVisible = true
        this.diaTitle = '修改模型'
      },
      onEdit(item, idx) {
        this.condItemEditIdx = idx
        this.condition.name = item.name
        this.condition.cond = item.cond
        this.condition.value = item.value
      },
      onDel(id, index) {
        this.warnModel.value.splice(index, 1)
        this.doHandler()
      },
      onDelItem(id) {
        const para = {
          id: id
        }
        delSpecialmode(para).then((response) => {
          if (response.code === '000000') {
            this.$message({
              message: '删除成功', type: 'success'
            })
            this.cancel(true)
          }
        })
      },
      getListData() {
        const para = {
          deptId: this.currentDep.id, userId: this.currentUser.id
        }
        getSpecialmodeList(para).then((response) => {
          this.models = []
          if (response.data.length > 0) {
            const data = response.data
            const len = data.length
            for (let i = 0; i < len; i++) {
              const b = data[i]
              if (b.value) {
                b.value = JSON.parse(b.value)
              }
              this.models.push(b)
            }
          }
        })
      },
      cancel(refsh) {
        this.warnModel = {
          id: '', name: '', value: []
        }
        if (refsh) {
          this.getListData()
        }
        this.$refs.conditionForm.resetFields()
        this.diaAddVisible = false
      },
      conditionChange(val) {
        if (val === 'whcd') {
          this.condition.con = 1
        }
        if (val === 'fasjsx') {
          this.condition.con = 1
        }
      }
    },
    mounted() {
      this.currentUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.getListData()
    }
  }
</script>

<style scoped>
  .specialWarn .test {
    padding: 5px 10px;
  }
  .specialWarn .card {
    height: 300px;
  }
  .specialWarn .add-btn {
    border: 0;
    font-size: 5em;
    width: 150px;
    height: 150px;
    display: block;
    margin: 55px auto;
  }
  .specialWarn .input_w {
    width: 200px;
  }
  .specialWarn .dia-padding {
    padding: 5px;
  }
  .specialWarn .rightBtn {
    float: right;
    margin-right: 5px;
    padding: 3px;
  }
  .specialWarn .errorText {
    padding-left: 20px; font-size:12px; color: red;
  }
</style>













