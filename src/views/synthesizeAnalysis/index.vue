<template>
  <section>
    <div>{{curAppName}}</div>
  </section>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {

  },
  data() {
    return {
      curAppName: localStorage.getItem('curAppName')
    }
  },
  computed: {
    // ...mapGetters([
    //   'curAppName'
    // ])
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
