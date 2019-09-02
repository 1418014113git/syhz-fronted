<template>
  <div class="EachRecord">
    <phone-records v-for="item in recordsList" :key="item.tempId" :index="index" :beanInfo="item" :len="recordsList.length" :personId="person.id" @doDelPhoneRecords="doDelPhoneRecords"></phone-records>
  </div>
</template>

<script>
  import PhoneRecords from '@/views/intellSystem/components/PhoneRecords'
  export default {
    name: 'EachRecord',
    props: ['person', 'index'],
    components: {
      PhoneRecords
    },
    data() {
      return {
        recordsList: []
      }
    },
    methods: {
      doDelPhoneRecords(tempId) {
        for (let i = 0; i < this.recordsList.length; i++) {
          if (this.recordsList[i].tempId === tempId) {
            this.recordsList.splice(i, 1)
          }
        }
      }
    },
    mounted() {
      if (this.person.phoneRecords) {
        this.recordsList = this.person.phoneRecords
      }
    }
  }
</script>

<style scoped>

</style>
