<template>
  <section class="online_classroom">
    <filter-common ref="filterCommon" :isMore="false" :postfix="postfix" @changeList="changeList" :uploadFlag="true"></filter-common>
    <el-row>
      <div class="file_data">
        <p><span>视频（{{ videoList.length }}）</span><span><el-button type="text" icon="el-icon-menu" v-if="$isViewBtn('139004')" @click="more('1')">更多 >></el-button></span></p>
        <div>
          <video-list ref="videoList" :data="videoList" :dataLoading="dataLoading" :filters="filters"></video-list>
        </div>
      </div>
      <div class="file_data">
        <p><span>音频（{{ audioList.length }}）</span><span><el-button type="text" icon="el-icon-menu" v-if="$isViewBtn('139004')" @click="more('2')">更多 >></el-button></span></p>
        <div>
          <audio-list ref="audioList" :data="audioList" :dataLoading="dataLoading" :filters="filters"></audio-list>
        </div>
      </div>
      <div class="file_data">
        <p><span>文档（{{ documentList.length }}）</span><span><el-button type="text" icon="el-icon-menu" v-if="$isViewBtn('139004')" @click="more('0')">更多 >></el-button></span></p>
        <div>
          <document-list ref="documentList" :data="documentList" :dataLoading="dataLoading" :filters="filters"></document-list>
        </div>
      </div>
    </el-row>
  </section>
</template>

<script>
  import filterCommon from './components/filterCommon'
  import videoList from './components/videoList'
  import audioList from './components/audioList'
  import documentList from './components/documentList'
  export default {
    components: {
      filterCommon,
      videoList,
      audioList,
      documentList
    },
    data() {
      return {
        postfix: '',
        activeName: '0',
        videoList: [],
        audioList: [],
        documentList: [],
        dataLoading: true,
        filters: {}
      }
    },
    methods: {
      changeList(arr1, arr2, arr3, filters) {
        this.videoList = arr1
        this.audioList = arr2
        this.documentList = arr3
        if (this.enType === '0') {
          this.$refs.documentList.setList(this.documentList)
        }
        if (this.enType === '1') {
          this.$refs.videoList.setList(this.videoList)
        }
        if (this.enType === '2') {
          this.$refs.audioList.setList(this.audioList)
        }
        this.dataLoading = false
        this.filters = filters
      },
      more(enType) {
        const filters = this.$refs.filterCommon.filters
        filters.enType = enType
        if (enType === '1') {
          this.$gotoid('/micro/moreVideo', JSON.stringify(filters))
        }
        if (enType === '2') {
          this.$gotoid('/micro/moreAudio', JSON.stringify(filters))
        }
        if (enType === '0') {
          this.$gotoid('/micro/moreDocument', JSON.stringify(filters))
        }
      }
    },
    mounted() {
      const param = sessionStorage.getItem(this.$route.path)
      if (param !== undefined && param !== null && param !== '') {
        const filters = JSON.parse(param)
        this.filters = filters
        this.$refs.filterCommon.setFilter(filters)
        sessionStorage.setItem(this.$route.path, '')
      }
      this.$refs.filterCommon.query()
    }
  }
</script>

<style>
  .online_classroom .file_data{
    margin-bottom: 20px;
    /*min-height: 360px;*/
  }
  .online_classroom .file_data > p{
    width: 100%; display: inline-block; height: 40px; line-height: 40px; border-bottom: 2px solid #fff;
  }
  .online_classroom .file_data > p > span{
    float: left;
  }
  .online_classroom .file_data > p > span:last-child{
    float: right;
    margin-right: 10px;
    cursor: pointer;
  }
  .online_classroom .file_data .file_data_list{
    width: 23%;
    float: left;
    margin-right: 38px;
    padding: 15px 15px 10px 15px;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  .online_classroom .file_data .file_data_list:hover, .online_classroom .file_data .file_data_list:active{
    border: 1px solid #00A0E9;
    border-radius: 4px;
    background-color: rgba(0,63,94,0.6);
    cursor: pointer;
  }
  .online_classroom .file_data .file_data_list:nth-child(4n){
    margin-right: 0;
  }
  .online_classroom .file_data .file_data_list .img {
    position: relative;
  }
  .online_classroom .file_data .file_data_list .img > img{
    width: 100%;
    height: 200px;
  }
  .online_classroom .file_data .file_data_list .img .tag{
    position: absolute;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    width: 100%;
    padding-left: 10px;
    background-color: #000;
    background-color: rgba(0,0,0,0.6);
    font-size: 14px;
    /*opacity: 0.1;*/
  }
  .online_classroom .file_data .file_data_list .title{
    margin: 20px 0 5px;
    text-overflow: ellipsis;
    width: 100%;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
  }
  .online_classroom .file_data .file_data_list .time{
    color: #ccc;
    font-size: 14px;
    margin-top: 20px;
  }
  .online_classroom .file_data .file_data_list .time > span {
    float: left;
  }
  .online_classroom .file_data .file_data_list .time > span:last-child {
    float: right;
  }
</style>
