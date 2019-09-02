<template>
  <div class="ImportCommonData"></div>
</template>

<script>
  import {
    setSessionDeptSelect
  } from '@/api/depts'
  export default {
    name: 'ImportCommonData',
    data() {
      return {}
    },
    methods: {
      getDepts() {
        setSessionDeptSelect({})
      }
    },
    mounted() {
      this.getDepts()
    }
  }
</script>

<style scoped>

</style>
