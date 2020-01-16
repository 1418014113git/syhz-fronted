<template>
<section>
  <flfg-detail v-if="fifgShow" :knowData ="knowData"></flfg-detail>
  <grzd-detail v-if="grzdShow"  :knowData ="knowData"></grzd-detail>
  <hybz-detail v-if="hybzShow" :knowData ="knowData"></hybz-detail>
  <alzy-detail v-if="alzyShow" :knowData ="knowData"></alzy-detail>
</section>
</template>

<script>
  import flfgDetail from '@/views/search/flfgDetail'
  import grzdDetail from '@/views/search/gfzdDetail'
  import hybzDetail from '@/views/search/hybzDetail'
  import alzyDetail from '@/views/search/alzyDetail'
  export default {
    name: 'knowManage',
    components: {
      flfgDetail,
      grzdDetail,
      hybzDetail,
      alzyDetail
    },
    data() {
      return {
        knowData: {},
        fifgShow: false,
        grzdShow: false,
        hybzShow: false,
        alzyShow: false
      }
    },
    mounted() {
      const para = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (!para.active) {
        return false
      }
      this.knowData = para
      if (para.active + '' === '1') {
        this.fifgShow = true
        this.grzdShow = false
        this.hybzShow = false
        this.alzyShow = false
      } else if (para.active + '' === '2') {
        this.hybzShow = true
        this.grzdShow = false
        this.fifgShow = false
        this.alzyShow = false
      } else if (para.active + '' === '3') {
        this.grzdShow = true
        this.fifgShow = false
        this.hybzShow = false
        this.alzyShow = false
      } else if (para.active + '' === '4') {
        this.alzyShow = true
        this.grzdShow = false
        this.hybzShow = false
        this.fifgShow = false
      }
    }
  }
</script>

<style scoped>
</style>
