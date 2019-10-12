<template>
  <section v-loading="loading">
    <div v-for="item in videoList" :key="item.key" class="file_data_list" @click="handlerClick(item)">
      <div class="img">
        <img :src="src(item)">
        <div class="tag">
          <span v-if="item.type === 1">食品</span>
          <span v-if="item.type === 2">药品</span>
          <span v-if="item.type === 3">环境</span>
          <span v-if="item.type === 4">综合</span>
          _视频 <span v-if="item.count > 1"> （共{{ item.count}}节）</span>
        </div>
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
        videoList: this.data,
        loading: this.dataLoading,
        commonFilters: this.filters
      }
    },
    watch: {
      'data': function(arr) {
        this.videoList = arr
      },
      'dataLoading': function(loading) {
        this.loading = loading
      },
      'filters': function(filters) {
        this.commonFilters = filters
      }
    },
    methods: {
      src(item) {
        if (item.enIcon) {
          return item.enIcon
        } else {
          if (item.type === 1) {
            return '/static/image/online/sp.jpg'
          }
          if (item.type === 2) {
            return '/static/image/online/yp.jpg'
          }
          if (item.type === 3) {
            return '/static/image/online/hj.jpg'
          }
          if (item.type === 4) {
            return '/static/image/online/zh.jpg'
          }
        }
      },
      handlerClick(row) {
        const para = {
          filters: this.commonFilters,
          enType: '1',
          jumpType: 'online',
          id: row.id
        }
        this.$gotoid('/micro/videoPlayer', JSON.stringify(para))
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
