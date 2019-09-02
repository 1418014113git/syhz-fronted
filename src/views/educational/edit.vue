<template >
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form>
          <el-row>
            <el-card>
              <div slot="header">
                <span>基本信息</span></div>
              <el-col :span="8" style="padding:5px 15px;" >
                <el-form-item label="题型：">
                  <el-select v-model="value2" placeholder="请选择题型"clearable
                             @change="selectTrigger(value2)">
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="padding:5px 15px;" >
                <el-form-item label="难易程度：">
                  <el-select v-model="value1" placeholder="请选择难易程度"clearable>
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-card>
          </el-row>
          <div style="overflow:auto;padding-top: 10px" ></div>

          <el-row>
            <el-card>
              <div slot="header">
                <span>试题信息</span>
              </div>
              <el-col>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="题干:">
                      <el-input type="textarea" :rows="7" v-model="editForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item  align="right">
                      <el-upload  class="upload-demo" drag  multiple  :action="action">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将题干图片拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传txt、word(doc,docx)、ppt、excel文件，且不超过500M</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="选项A">
                  <el-col :span="18">
                    <el-input type="text"  size="small"clearable  v-model="editForm.as1"> </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="选项B">
                  <el-col :span="18">
                    <el-input type="text" clearable  v-model="editForm.as2"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="选项C">
                  <el-col :span="18">
                    <el-input type="text" size="small"  v-model="editForm.as3"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="选项D">
                  <el-col :span="18">
                    <el-input type="text" size="small" clearable  v-model="editForm.as4"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item >
                  <el-button>
                    + 新增选项
                  </el-button>
                </el-form-item>
                <el-form-item label="正确答案">
                  <el-select v-model="editForm.realAs" clearable>
                    <el-option
                      v-for="item in items"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="答案解析:">
                  <el-input type="textarea"  v-model="editForm.intr"></el-input>
                </el-form-item>
              </el-col>
              <el-col align="center">
                <el-button
                  size="mini"
                  @click="handleEdit()">取消</el-button>
                <el-button
                  size="mini"
                  @click="handleSave()">保存</el-button>
              </el-col>

              <div style="overflow:auto;padding-bottom: 20px" ></div>

            </el-card>
          </el-row>

        </el-form>
      </el-col>
    </el-row>
</template>

<script>
  export default {
    props: ['detail'],
    name: 'edit',
    data() {
      return {
        editForm: {
          no: '1',
          date: '2019-08-22 14:25',
          name: ' 食物发生腐败变质的最主要原因是？',
          type: '单选题',
          grade: '简单',
          deleteable: '1',
          as1: '微生物污染',
          as2: '农药残留',
          as3: '加工方法不合理',
          as4: '没有分类存放',
          realAs: 'B',
          intr: '微生物污染...'
        },
        options1: [{
          value: '1',
          label: '简单'
        }, {
          value: '2',
          label: '中等'
        }, {
          value: '3',
          label: '困难'
        }],
        options2: [{
          value: '选项1',
          label: '单选题'
        }, {
          value: '选项2',
          label: '多选题'
        }, {
          value: '选项3',
          label: '判断题'
        }, {
          value: '选项4',
          label: '填空题'
        }, {
          value: '选项5',
          label: '解答题'
        }],
        value1: '简单',
        value2: '单选题',
        items: [{
          value: '1',
          label: 'A'
        }, {
          value: '2',
          label: 'B'
        }, {
          value: '3',
          label: 'C'
        }, {
          value: '4',
          label: 'D'
        }
        ],
        value3: 'A'

      }
    },
    methods: {
      handleEdit() {
        this.$router.push({ path: '/educational/questionBank/' })
      },
      handleSave() {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.push({ path: '/educational/questionBank/' })
      }
    },
    watch: { // 监听state状态变化
      detail: {
        handler: function(val, oldeval) {
          this.editForm = this.detail
        }
      }
    }
  }
</script>

<style scoped>
</style>
