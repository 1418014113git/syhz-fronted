<template>
  <ul class="portal_rank_ul">
    <li class="portal_rank_li header">
      <span class="num_header"></span>
      <span class="content">机构</span>
      <span class="integral">积分</span>
    </li>
    <li v-for="(data,index) in listData" class="portal_rank_li" :key="index">
      <span v-if="index < 3" class="num b_color_409EFF">{{ index + 1}}</span>
      <span v-else class="num b_color_656565">{{ index + 1}}</span>
      <span class="content">
        {{data.title}}
      </span>
      <span class="integral">
         {{data.integral}}
      </span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'Rank',
    data() {
      return {
        listData: [
          { 'id': '1', 'title': '呼和浩特公安局', 'integral': '10' },
          { 'id': '2', 'title': '呼和浩特公安局', 'integral': '10' },
          { 'id': '3', 'title': '呼和浩特公安局', 'integral': '10' },
          { 'id': '4', 'title': '呼和浩特公安局', 'integral': '10' },
          { 'id': '5', 'title': '呼和浩特公安局', 'integral': '10' }
        ]
      }
    }
  }
</script>

<style scoped>
  .portal_rank_ul, .portal_rank_ul p{
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
  .portal_rank_ul .portal_rank_li{
    width: 100%;
    list-style: none;
    display: inline-block;
    /* margin-bottom: 20px; */
  }
  .portal_rank_ul .portal_rank_li.header{
    font-weight: bold;
    margin-bottom: 2px;
  }
  .portal_rank_ul .portal_rank_li.header span{
    margin-left: 2px;
    margin-bottom: 0px;
  }
  .portal_rank_ul .portal_rank_li > span{
    float: left;
    margin-right: 10px
  }
  .portal_rank_ul .portal_rank_li span.integral{
    float: right;
  }
  .portal_rank_ul .portal_rank_li.header span.num_header{
    margin:1px 15px 0 0;
    width: 16px;
    height: 17px;
  }
  .portal_rank_ul .portal_rank_li span.num{
    color: #fff;
    display: inline-block;
    margin:1px 15px 0 0;
    width: 16px;
    height: 17px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
   -webkit-border-radius: 3px;
   -moz-border-radius: 3px;
   -ms-border-radius: 3px;

    text-shadow: 0 1px 1px rgba(0,0,0,1);
    -webkit-box-shadow: 0 1px 2px rgba(0,0,0,1);
    -moz-box-shadow: 0 1px 2px rgba(0,0,0,1);
    box-shadow: 0 1px 2px rgba(0,0,0,1);
  }
  .portal_rank_ul .portal_rank_li span p{
    margin-bottom: 5px;
  }
  .portal_rank_ul .portal_rank_li span p>span{
    margin-right: 20px;
  }
  .b_color_656565{
    background-color: #656565;
  }
  .b_color_409EFF{
    background-color: #409EFF;
  }
  .f_color_409EFF{
    color: #409EFF;
  }
  .f_color_F56C6C{
    color: #F56C6C;
  }
</style>
