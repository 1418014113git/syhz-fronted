<template>
  <section>
    <div class="report">
      <h3>线索要素信息</h3>
      <div class="report_form">
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="120px">
          <el-form-item label="线索要素" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="要素描述" prop="description" style="margin: 15px 0">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="要素分类" prop="type">
            <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number size="mini" v-model="form.index_number" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="edit">保 存</el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
  import { addKeyWord, editKeyWord, getKeyWord } from '@/api/intellSystem'
  export default {
    name: 'add',
    data() {
      return {
        options: [{
          value: '1', name: '食品'
        }, {
          value: '2', name: '药品'
        }, {
          value: '3', name: '环境'
        }],
        form: {
          name: '',
          description: '',
          index_number: 1,
          type: '',
          wirter_type: '1',
          enable: '1'
        },
        rules: {
          name: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
              const reg = /^[\s\S]*$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的名称'))
              } else {
                callback()
              }
            }
          }],
          description: [{ required: true, message: '请输入正确的描述', trigger: 'blur' }],
          type: [{ required: true, message: '请选择要素分类', trigger: 'blur' }]
        }
      }
    },
    methods: {
      detail() {
        const para = {
          id: this.$route.params.id
        }
        getKeyWord(para).then((response) => {
          const data = response.data
          this.form = {
            name: data.name,
            description: data.description,
            index_number: data.index_number,
            type: { value: data.type, name: data.type_name },
            wirter_type: data.wirter_type ? data.wirter_type : 1,
            enable: data.enable
          }
        })
      },
      edit: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const form = this.form
            const type = this.form.type
            form.type_value = type.value
            form.type_name = type.name
            if (this.$route.params.id) { // 修改
              form.id = this.$route.params.id
              editKeyWord(form).then((res) => {
                this.listLoading = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.toList()
              })
            } else { // 添加
              addKeyWord(form).then((res) => {
                this.listLoading = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.toList()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/intellSystem/keyword'
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.detail()
      }
    }
  }
</script>

<style scoped>
  .report {
    width: 60%;
    margin: 0 auto;
  }
  .report h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .report .report_form{
    width: 80%;
    margin: 0 auto;
  }
</style>
