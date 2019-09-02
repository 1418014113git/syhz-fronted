<template>
  <div class="reportDetail">
    <div class="header_title">{{ form.title }}</div>
    <div class="content">
      {{ form.desription }}
    </div>
    <div class="footer">
      相关下载：
      <p v-for="(item,index) in attachmentList" :key="index">
        <a @click="downFile(item.path)">{{item.name}}</a>
      </p>
    </div>
  </div>
</template>

<script>
  import { getReport } from '@/api/specialTasks'
  export default {
    data() {
      return {
        form: {
          task_id: '',
          title: '',
          dept: '',
          create_date: '',
          desription: '',
          attachment: '',
          enable: '0'
        },
        attachmentList: []
      }
    },
    methods: {
      detailReport() {
        const para = {
          id: this.$route.params.id
        }
        getReport(para).then((response) => {
          const data = response.data
          this.form = {
            task_id: data.task_id,
            title: data.title,
            dept: data.dept,
            create_date: data.create_date,
            desription: data.desription,
            attachment: data.attachment,
            enable: data.enable
          }
          if (this.form.attachment) {
            this.attachmentList = JSON.parse(this.form.attachement)
          }
        })
      },
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
      this.detailReport()
    }
  }
</script>

<style scoped>
  .reportDetail {
    width: 60%;
    min-height: 400px;
  }
  .reportDetail h2{
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }
  .reportDetail h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .reportDetail .header_title{
    margin: 30px auto;
  }
  .reportDetail .content{
    clear: both;
    padding: 20px 0;
    text-indent: 2em;
  }
  .reportDetail .footer{
    font-size: 12px;
  }
  .reportDetail .footer p{
    margin: 3px 0 0 20px;
  }
  .reportDetail .footer p a{
    color: #1b75ba;
    text-decoration: underline;
  }
  .reportDetail .footer p a:hover{
    color: #1e98d2;
  }
</style>
