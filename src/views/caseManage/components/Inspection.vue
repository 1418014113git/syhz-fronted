<!--<template>-->
  <!--<section>-->
    <!--<el-col :span="8">-->
      <!--<el-card class="cont-card">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span>协查主体</span>-->
        <!--</div>-->
        <!--<div class="xczt_main">-->
          <!--<table>-->
            <!--<tr>-->
              <!--<td rowspan="4"><img width="100" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531129841139&di=a60b2440c146264381b225f6e6eaa819&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01d25858b69a51a801219c775ba603.png"/></td>-->
              <!--<td>{{data.name}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>{{data.idcard}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>{{data.state}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>{{data.msg}}</td>-->
            <!--</tr>-->
          <!--</table>-->
        <!--</div>-->
      <!--</el-card>-->
    <!--</el-col>-->
    <!--<el-col :span="16">-->
      <!--<el-card class="cont-card">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span>协查内容</span>-->
        <!--</div>-->
        <!--<div class="xczt_content">-->
          <!--<table>-->
            <!--<tr>-->
              <!--<td>协查申请单位：</td>-->
              <!--<td>{{data.xcsqdw}}</td>-->
              <!--<td>协查申请人：</td>-->
              <!--<td>{{data.xcsqr}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>协查单位：</td>-->
              <!--<td>{{data.xcdw}}</td>-->
              <!--<td>联系方式：</td>-->
              <!--<td>{{data.lxfs}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>协查状态：</td>-->
              <!--<td>{{data.xczt}}</td>-->
              <!--<td>协查要求：</td>-->
              <!--<td>{{data.xcyq}}</td>-->
            <!--</tr>-->
          <!--</table>-->
        <!--</div>-->
      <!--</el-card>-->
    <!--</el-col>-->
    <!--<el-col :span="24">-->
      <!--<el-card class="cont-card">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span>协查涉及案件</span>-->
        <!--</div>-->
        <!--<div class="xczt_content">-->
          <!--<p class="align_center">2017121211  呼和浩特三氯氰胺案件</p>-->
        <!--</div>-->
      <!--</el-card>-->
    <!--</el-col>-->
    <!--<el-col :span="24">-->
      <!--<el-card class="cont-card">-->
        <!--<div slot="header" class="clearfix">-->
          <!--<span>时间轴</span>-->
        <!--</div>-->
        <!--<div class="xczt_content">-->
          <!--<timeLine :points="points"></timeLine>-->
        <!--</div>-->
      <!--</el-card>-->
    <!--</el-col>-->
  <!--</section>-->
<!--</template>-->

<!--<script>-->
  <!--import timeLine from './timeLine'-->
  <!--export default {-->
    <!--name: 'xczt',-->
    <!--data() {-->
      <!--return {-->
        <!--data: {-->
          <!--name: '张三',-->
          <!--idcard: '123512312423513123',-->
          <!--state: '已抓获',-->
          <!--msg: '3次前科',-->
          <!--xcsqdw: 'XXX公安局',-->
          <!--xcsqr: '张三',-->
          <!--xcdw: '包头公安局',-->
          <!--lxfs: '13047174475',-->
          <!--xczt: '已签收',-->
          <!--xcyq: '请协助核实情况'-->
        <!--},-->
        <!--points: [-->
          <!--{-->
            <!--pointColor: 'red', // *关键点颜色 可选red yellow green-->
            <!--img: 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png', // 图片地址 可留空-->
            <!--text: '公安厅审核通过', // *时间点内容-->
            <!--date: '2016年06月20日', // 时间点-->
            <!--reviewPeople: '审核领导：李四',-->
            <!--reviewRemark: '审核意见：无'-->
          <!--},-->
          <!--{-->
            <!--pointColor: 'green', // *关键点颜色 可选red yellow green-->
            <!--text: '呼和浩特公安局发起协查', // *时间点内容-->
            <!--date: '2016年10月20日', // 时间点-->
            <!--reviewPeople: '审核领导：张三',-->
            <!--reviewRemark: '审核意见：无'-->
          <!--}-->
        <!--]-->
      <!--}-->
    <!--},-->
    <!--components: {-->
      <!--timeLine-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
  <!--.xczt_main, .xczt_content{-->
    <!--padding-left: 40px;-->
    <!--font-size: 14px;-->
  <!--}-->
  <!--.xczt_main>table td{-->
    <!--padding: 5px 10px;-->
  <!--}-->
  <!--.xczt_content>table td{-->
    <!--padding: 10px 10px;-->
  <!--}-->
  <!--.xczt_content>table td:nth-child(1), .xczt_content>table td:nth-child(3){-->
    <!--text-align: right;-->
  <!--}-->
  <!--.xczt_content>table td:nth-child(2){-->
    <!--padding-right: 50px;-->
  <!--}-->
  <!--.align_center{-->
    <!--text-align: center;-->
    <!--padding: 10px 0;-->
  <!--}-->
<!--</style>-->
