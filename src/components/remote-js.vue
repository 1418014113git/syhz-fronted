<template>

</template>

<script>
  export default {
    components: {
      'remote-js': {
        render(createElement) {
          return createElement('script', { attrs: { type: 'text/javascript', src: this.src, charset: 'GB2312' }})
        },
        props: { src: { type: String, required: true }}
      }
    }
  }
</script>

<style scoped>

</style>
