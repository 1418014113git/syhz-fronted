<template>
  <section>
    <div class="report">
      <h2>{{ task_name }}</h2>
      <h3>成果信息</h3>
      <div class="report_content">
        <div class="header_title">{{ form.title }}</div>
        <div class="header_time"><span>申请部门：{{ form.dept }}</span><span>申请时间：{{ form.create_date }}</span></div>
        <div class="content">
          {{ form.desription }}史丹佛阿凡达时间覅第三方考务费，倒是大佛，收到文件法拉伐，爱的色放我就发司法局奥韦解放，奥法文件覅圣佛尔夫，十分骄傲无法辣椒粉
        </div>
        <div class="footer">
          相关下载：
          <p><a>关于打击违法犯罪的文件.doc</a></p>
          <p><a>关于打击违法犯罪的文件.doc</a></p>
          <p><a>关于打击违法犯罪的文件.doc</a></p>
        </div>
      </div>
      <h3>成果审核</h3>
      <div class="report_form">
        <el-form :model="form" ref="form" :rules="rules" size="small" label-width="70px">
          <el-form-item label="是否通过" prop="dept">
            <el-select v-model="form.dept" placeholder="请选择" @change="change">
              <el-option label="通过" value="1"></el-option>
              <el-option label="拒绝" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="visible" label="驳回原因">
            <el-input type="textarea" v-model="form.desription"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">审核</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
  import { getTask, getReport, review } from '@/api/specialTasks'
  export default {
    data() {
      return {
        visible: false,
        task_name: '',
        form: {
          task_id: this.$route.params.taskId,
          title: '',
          dept: '',
          create_date: '',
          desription: '',
          attachment: '',
          enable: '0'
        },
        rules: {
          desription: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
              const reg = /^[\s\S]*$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的成果总结'))
              } else {
                callback()
              }
            }
          }]
        }
      }
    },
    methods: {
      onSubmit: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.id = this.$route.params.id
            review(this.form).then((res) => {
              this.listLoading = false
              this.$message({
                message: '审核成功',
                type: 'success'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      detailTask() {
        const task = this.$route.params.taskId
        const para = {
          id: task
        }
        getTask(para).then((response) => {
          const data = response.data
          this.task_name = data.task_name
        })
      },
      detailReport() {
        const para = {
          id: this.$route.params.id
        }
        getReport(para).then((response) => {
          const data = response.data
          this.form = {
            task_id: this.$route.params.taskId,
            title: data.title,
            dept: data.dept,
            create_date: data.create_date,
            desription: data.desription,
            attachment: data.attachment,
            enable: data.enable
          }
        })
      },
      change(selVal) {
        if (selVal === '0') {
          this.visible = true
        } else {
          this.visible = false
        }
      }
    },
    mounted() {
      this.detailTask()
      if (this.$route.params.id) {
        this.detailReport()
      }
    }
  }
</script>

<style scoped>
.report,
.report div {
	margin: 0 auto;
}
.report {
	width: 60%;
}
.report h2 {
	text-align: center;
	font-weight: bold;
	font-size: 24px;
}
.report h3 {
	font-size: 16px;
	font-weight: bold;
	height: 50px;
	line-height: 50px;
	margin-bottom: 10px;
}
.report .report_content {
	width: 80%;
}
.report .report_form {
	width: 80%;
}
.report .header_title {
	text-align: center;
	font-weight: bold;
	font-size: 22px;
	width: 50%;
	color: #dddddd;
	margin: 0 auto 20px;
}
.report .header_time {
	padding: 20px 0;
	width: 60%;
}
.report .header_time span {
	float: right;
}
.report .header_time span:first-child {
	float: left;
}
.report .content {
	clear: both;
	padding: 20px 0;
	text-indent: 2em;
}
.report .footer {
	font-size: 12px;
}
.report .footer p {
	margin: 3px 0 0 20px;
}
.report .footer p a {
	color: #1b75ba;
	text-decoration: underline;
}
.report .footer p a:hover {
	color: #1e98d2;
}
</style>
