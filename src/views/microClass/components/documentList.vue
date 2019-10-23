<template>
  <section v-loading="loading">
    <div v-for="item in documentList" :key="item.key" class="file_data_list" @click="handlerClick(item)">
      <div class="img">
        <img :src="item.enIcon ? item.enIcon : (item.enClass.indexOf('doc') > -1 ? '/static/image/online/word.jpg' : (item.enClass.indexOf('ppt') > -1 ? '/static/image/online/ppt.jpg' : '/static/image/online/pdf.jpg'))">
        <div class="tag">
          <span v-if="item.type === 1">食品</span>
          <span v-if="item.type === 2">药品</span>
          <span v-if="item.type === 3">环境</span>
          <span v-if="item.type === 4">综合</span>
          _{{ item.enClass }}文档</div>
      </div>
      <p class="title">{{ item.count > 1 ? item.title : item.enName }}</p>
      <div class="time">
        <span>{{ item.creationName }}</span>
        <span>{{ item.creationTime }}</span>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: [
      'data',
      'dataLoading',
      'filters'
    ],
    data() {
      return {
        documentList: this.data,
        loading: this.dataLoading,
        commonFilters: this.filters
      }
    },
    watch: {
      'data': function(arr) {
        this.documentList = arr
      },
      'dataLoading': function(loading) {
        this.loading = loading
      },
      'filters': function(filters) {
        this.commonFilters = filters
      }
    },
    methods: {
      handlerClick(row) {
        const para = {
          filters: this.commonFilters,
          enType: '0',
          jumpType: 'online',
          id: row.id
        }
        this.$gotoid('/micro/documentPlayer', JSON.stringify(para))
      },
      setList(arr) {
        this.videoList = arr
      }
    },
    mounted() {
    }
  }
</script>

<style>
</style>
