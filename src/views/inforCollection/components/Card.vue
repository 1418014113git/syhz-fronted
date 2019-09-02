<template>
  <section>
    <el-col v-for="item in cardData" :key="item.value" :span="item.span">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{item.title}}</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
        </div>

        <timeLine :points="points" v-if="item.content == 'Carousel'"></timeLine>
        <Carousel v-if="item.content == 'Carousel'" :split="item.split"></Carousel>

        <div v-if="item.content == 'relations'" class="relations">
          <span class="img">
              <img :src="relations.img"/>
            </span>
          <span class="content">
              <p>{{ relations.name }}</p>
              <p>{{ relations.id_card }}</p>
              <p>{{ relations.title }}</p>
              <p>{{ relations.content }}</p>
            </span>
        </div>
        <div v-if="item.content == 'vehicle'" class="relations">
          <span class="img">
              <img :src="vehicle.img"/>
            </span>
          <span class="content">
              <p>{{ vehicle.type }}</p>
              <p>{{ vehicle.brand }}</p>
              <p>车牌号</p>
              <p>{{ vehicle.license_plate_number }}</p>
            </span>
        </div>
        <div v-if="item.content == 'Table'" class="relations">
          <el-table :data="list" style="width: 100%;">
            <el-table-column type="address" label="工作地点"></el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
  </section>
</template>

<script>
  import Carousel from './Carousel'
  export default {
    components: {
      Carousel
    },
    name: 'Card',
    props: ['cardData', 'relations', 'vehicle'],
    data() {
      return {
        list: [],
        active: 4,
        points: [
          {
            pointColor: 'red',
            date: '2018-05-11 12:10:10'
          },
          {
            pointColor: 'green',
            date: ' 2018-05-18 12:10:10'
          },
          {
            pointColor: 'green',
            date: ' 2018-05-20 12:10:10'
          },
          {
            pointColor: 'red',
            date: ' 2018-06-01 12:10:10'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    margin: 2px 2px 0 2px;
  }
  .relations span{
    float: left;
  }
  .relations span.img{
    margin-right: 20px;
  }
  .relations span.img img{
    width: 100px;
    height: 120px;
  }
  .relations span.content p{
    height: 30px;
    line-height: 30px;
  }
</style>
