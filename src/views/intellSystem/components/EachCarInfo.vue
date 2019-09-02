<template>
  <div class="EachCarInfo">
    <car-info v-for="item in carInfoList" :key="item.tempId" :index="index" :beanInfo="item" :len="carInfoList.length" :personId="person.id" @doDelCar="doDelCar"></car-info>
  </div>
</template>

<script>
  import CarInfo from '@/views/intellSystem/components/CarInfo'
  export default {
    name: 'EachCarInfo',
    props: ['person', 'index'],
    components: {
      CarInfo
    },
    data() {
      return {
        carInfoList: []
      }
    },
    methods: {
      doDelCar(tempId) {
        for (let i = 0; i < this.carInfoList.length; i++) {
          if (this.carInfoList[i].tempId === tempId) {
            this.carInfoList.splice(i, 1)
          }
        }
      }
    },
    mounted() {
      if (this.person.carInfos) {
        this.carInfoList = this.person.carInfos
      }
    }
  }
</script>

<style scoped>

</style>
