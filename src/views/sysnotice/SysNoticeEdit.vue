<template>
<div>
    <el-row class="card_width">
      <img src="@/assets/icon/back.png" class="goBack" @click="goToList"/> <!--返回-->
    </el-row>
    <el-card class="card_width">
      <el-row class="examNotice_spe_save">
      <el-col :span="18" style="margin-top: 24px;">
        <el-form ref="sysNoticeEditForm" :rules="rules" :model="notice" label-width="200px">
          <el-form-item label="标题：" prop="title">
            <el-input
              v-model.trim="notice.title"
              placeholder="请输入标题"
              maxlength="500"
              clearable
              style="width: 675px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布人：" prop="publishPersonName">
            <el-input
              disabled
              v-model="notice.publishPersonName"
              maxlength="500"
              style="width: 675px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间：" prop="publishDate">
            <el-date-picker
              v-model="notice.publishDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsStartDate"
              @change="onPublishDateChange"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="公告开始时间：" prop="startDate">
            <el-date-picker
              v-model="notice.startDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsStartDate"
              @change="onStartDateChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="公告结束时间：" prop="endDate">
            <el-date-picker
              v-model="notice.endDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsEndDate"
              @change="onEndDateChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="notice.status" placeholder="请选择" @change="changeStatus">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请输入内容：" prop="content">
              <vue-editor v-model="notice.content"></vue-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit" :loading="btnLoading">提交</el-button>
            <el-button type="primary" @click="goback">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <el-col :span="14" style="text-align: left;">
        <el-button type="primary" @click="submit" :loading="btnLoading">提交</el-button>
        <el-button type="primary" @click="goback">取消</el-button>
      </el-col> -->
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
      pickerOptionsStartDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptionsEndDate: {
        disabledDate: time => {
          if (this.notice.startDate) {
            return (
              time.getTime() <
              new Date(this.notice.startDate).getTime() - 8.64e7
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },

      btnLoading: false, // 提交按钮加载loading
      notice: {
        id: '',
        title: '',
        content: '',
        publishPerSonId: '',
        publishPersonName: '',
        publishPersonOrg: '',
        publishDate: '',
        startDate: '',
        endDate: '',
        status: ''
      },
      options: [{ label: '启用', value: '1' }, { label: '停用', value: '0' }],
      rules: {
        title: [
          {
            required: true, min: 1, max: 50, message: '标题长度应为1-50个字符', trigger: 'blur'
          }
        ],
        publishPersonName: [{
          required: true, message: '发布人不能为空', trigger: 'blur'
        }],
        publishDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            const publishDate = value
            if (!publishDate) {
              callback(new Error('请选择发布时间'))
            } else {
              if (new Date(value).getTime() < Date.now() - 60 * 1000) {
                callback(new Error('发布时间不能小于当前时间'))
              }
              if (this.notice.startDate && new Date(value).getTime() >
                new Date(this.notice.startDate).getTime()) {
                callback(new Error('发布时间不能晚于公告开始时间'))
              } else {
                callback()
              }
            }
          }
        }],
        startDate: [{
          required: true, message: '请选择开始时间', trigger: 'change', validator: (rule, value, callback) => {
            const start = value
            if (!start) {
              callback(new Error('请选择开始时间'))
            } else {
              callback()
            }
          }
        }],
        endDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            const end = value
            if (!end) {
              callback(new Error('请选择结束时间'))
            } else {
              if (new Date(this.notice.startDate).getTime() >=
                new Date(end).getTime()) {
                callback(new Error('结束时间必须大于开始时间'))
              } else {
                callback()
              }
            }
          }
        }],
        status: [{
          required: true, message: '请选择状态', trigger: 'blur'
        }],
        content: [{
          max: 3000, message: '正文长度不能超过3000字符', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    getTimeNow() {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var Hour = date.getHours()

      var Minutes = date.getMinutes()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (Hour >= 0 && Hour <= 9) {
        Hour = '0' + Hour
      }
      if (Minutes >= 0 && Minutes <= 9) {
        Minutes = '0' + Minutes
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        ' ' +
        Hour +
        ':' +
        Minutes

      this.notice.publishDate = currentdate
      this.notice.startDate = currentdate
    },

    getSysNoticeById(id) {
      // 使用ID查询单条数据
      this.$query('sysnotice/' + id)
        .then(res => {
          this.btnLoading = false
          if (res.code === '000000') {
            // 回显
            this.notice.id = id
            this.notice.title = res.data.title
            this.notice.status = '' + res.data.status
            this.notice.content = res.data.content
            this.notice.publishDate = res.data.publishDate
            this.notice.startDate = res.data.startDate
            this.notice.endDate = res.data.endDate
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    submit() {
      this.$refs.sysNoticeEditForm.validate(valid => {
        if (valid) {
          this.btnLoading = true

          this.$update('sysnotice/' + this.notice.id, this.notice)
            .then(res => {
              this.btnLoading = false
              if (res.code === '000000') {
                this.$message({ message: '修改成功', type: 'success' })
                this.goToList()
              }
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onPublishDateChange(val) {
      this.notice.publishDate = val
    },
    onStartDateChange(val) {
      this.notice.startDate = val
    },
    onEndDateChange(val) {
      this.notice.endDate = val
    },
    onContentChange(val) {
      this.notice.content = val
    },
    changeStatus(val) {
      this.notice.status = val
    },
    goToList() {
      // 返回列表页
      this.$gotoid('/sysnotice/SysNoticeList')
    },
    goback() {
      // 重置
      this.notice.title = ''
      this.notice.content = ''
      this.notice.publishPerSonId = ''
      this.notice.publishPersonName = ''
      this.notice.publishDate = ''
      this.notice.startDate = ''
      this.notice.endDate = ''
      this.notice.status = ''
      this.$router.go(-1)
    }
  },
  mounted() {
    var id = sessionStorage.getItem(this.$route.path)
    this.getSysNoticeById(id)
    this.getTimeNow()
    // 加载session
    this.notice.publishPersonId = sessionStorage.getItem('userId')
    this.notice.publishPersonName = sessionStorage.getItem('realName')
    this.notice.publishPersonOrg = JSON.parse(sessionStorage.getItem('depToken'))[0].depName
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.card_width {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
@media only screen and (max-width: 1367px) {
  .el-col-14 {
    width: 85.3% !important;
  }
}
</style>

