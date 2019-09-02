<template>
  <section>
    <div>{{curAppName}}</div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {

  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'curAppName'
    ])
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
