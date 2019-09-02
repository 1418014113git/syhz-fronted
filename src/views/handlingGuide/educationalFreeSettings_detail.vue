<template>
  <el-row class="inspect_apply" type="flex" justify="center">
    <el-col :span="20">
      <el-card>
        <div slot="header" class="clearfix">
          <span>考试管理详情</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="toList">返回</el-button> -->
          <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
        </div>
        <el-row class="line">
          <el-col :span="3" class="title">考试名称：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.KSMC}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">报名方式：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.BMFS}}</el-col>
          <el-col :span="3" class="title">报名时间：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.BMSJ}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">考试类型：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.KSLX}}</el-col>
          <el-col :span="3" class="title">考试时间：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.KSSJ}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">考试范围：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.KSFW}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">报名人数：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.BMRS}}</el-col>
          <el-col :span="3" class="title">考试状态：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.FBZT}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">创建时间：</el-col>
          <el-col :span="8" class="ft_color_999">{{detail.CJSJ}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">考试说明：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.KSSM}}</el-col>
        </el-row>
        <el-row style="padding: 50px;"></el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'edit',
    data() {
      return {
        detail: {
          KSMC: '',
          KSLX: '',
          KSSJ: '',
          BMFS: '',
          BMSJ: '',
          BMRS: '',
          KSSM: '',
          KSFW: '',
          FBZT: '',
          CJSJ: ''
        },
        list: [
          { 'id': '1', 'KSMC': '三月考试', 'KSLX': '正常考试', 'KSSJ': '2018-06-20 至 2018-06-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局食品犯罪侦查大队，西安市公安局药品犯罪侦查大队', 'FBZT': '已结束', 'CJSJ': '2018-06-15' },
          { 'id': '2', 'KSMC': '四月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-06-27 至 2018-06-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '西安市公安局环境犯罪侦查大队', 'FBZT': '已发布', 'CJSJ': '2018-06-15' },
          { 'id': '3', 'KSMC': '五月考试', 'KSLX': '正常考试', 'KSSJ': '2018-07-20 至 2018-07-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局食品犯罪侦查大队，咸阳市陕西省公安局药品犯罪侦查大队', 'FBZT': '进行中', 'CJSJ': '2018-07-15' },
          { 'id': '4', 'KSMC': '六月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-07-27 至 2018-07-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '咸阳市公安局环境犯罪侦查大队', 'FBZT': '草稿', 'CJSJ': '2018-07-15' },
          { 'id': '5', 'KSMC': '七月考试', 'KSLX': '正常考试', 'KSSJ': '2018-08-20 至 2018-08-25', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队食品犯罪侦查支队，陕西省公安厅环境食品药品犯罪侦查总队药品犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' },
          { 'id': '6', 'KSMC': '八月考试', 'KSLX': '知识竞赛', 'KSSJ': '2018-08-27 至 2018-08-28', 'BMFS': '自主报名', 'BMSJ': '2018-06-17 至 2018-06-18', 'BMRS': '10', 'KSSM': '未填写', 'KSFW': '陕西省公安厅环境食品药品犯罪侦查总队环境犯罪侦查支队', 'FBZT': '草稿', 'CJSJ': '2018-08-15' }
        ]
      }
    },
    methods: {
      toList(index) {
        this.$router.push({
          path: '/educational/freeSettings',
          query: {
            source: index
          }
        })
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.$route.params.id) {
        for (const dataObj of this.list) {
          if (this.$route.params.id === dataObj.id) {
            this.detail = dataObj
          }
        }
      }
    }
  }
</script>

<style scoped>
  .inspect_apply h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .inspect_apply .input_w {
    width: 40%;
  }

  .inspect_apply .title {
    text-align: right;
    color: #fff;
  }

  .inspect_apply .line {
    padding: 15px 0;
    border-bottom: 1px dashed #d9d9d9;
  }
</style>
