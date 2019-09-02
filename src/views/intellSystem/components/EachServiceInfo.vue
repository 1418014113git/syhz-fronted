<template>
  <div class="EachServiceInfo">
    <service-info v-for="item in serviceInfos" :key="item.tempId" :index="index" :beanInfo="item" :len="serviceInfos.length" :personId="person.id" @doDelService="doDelService"></service-info>
  </div>
</template>

<script>
  import ServiceInfo from '@/views/intellSystem/components/ServiceInfo'
  export default {
    name: 'EachServiceInfo',
    props: ['person', 'index'],
    components: {
      ServiceInfo
    },
    data() {
      return {
        serviceInfos: []
      }
    },
    methods: {
      doDelService(tempId) {
        for (let i = 0; i < this.serviceInfos.length; i++) {
          if (this.serviceInfos[i].tempId === tempId) {
            this.serviceInfos.splice(i, 1)
          }
        }
      }
    },
    mounted() {
      if (this.person.serviceInfos) {
        this.serviceInfos = this.person.serviceInfos
      }
    }
  }
</script>

<style scoped>

</style>
