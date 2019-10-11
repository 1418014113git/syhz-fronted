<template>
  <section class="classRoom_filter" :style="uploadFlag ? '' : 'height: 140px;'">
    <!--工具条-->
    <div style="text-align: center; height: 132px;">
      <el-form :inline="true" :model="filters" >
        <el-col :span="24">
          <div class="tabsDiv">
            <el-tabs v-model="activeName">
              <el-tab-pane label="全部" name=""></el-tab-pane>
              <el-tab-pane label="环境" name="3"></el-tab-pane>
              <el-tab-pane label="食品" name="1"></el-tab-pane>
              <el-tab-pane label="药品" name="2"></el-tab-pane>
              <el-tab-pane label="综合" name="4"></el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="24" style="padding: 10px 0px;">
        </el-col>
        <el-col :span="24" style="padding-bottom: 0; margin-left: 4px;">
          <el-form-item style="width: 50%;">
            <el-input size="large" placeholder="关键字搜索课程 （课程名称、上传者）" v-model="filters.search">
              <el-button slot="append" v-if="$isViewBtn('139003')" v-on:click="query(true)" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 30px;background-color: #1e98d2;"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div v-if="uploadFlag" :class="isMore ? 'file_count bottonLine' : 'file_count'">
      <div>
        为您找到了 {{ total }} 部相关的<span v-if="isMore">{{ postfix }}</span>课程
      </div>
      <div>
        <el-button type="primary" v-if="$isViewBtn('139001')" @click="uploadFile" icon="el-icon-upload">上传资料</el-button>
        <el-button type="primary" v-if="$isViewBtn('139002')" @click="myLearning"><svg-icon icon-class="learn" style="width: 14px; height:  14px; margin-right: 5px;"></svg-icon>我的学习</el-button>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: [
      'dataListSize',
      'isMore',
      'postfix',
      'uploadFlag'
    ],
    data() {
      return {
        filters: {
          type: '',
          search: '',
          enType: ''
        },
        loading: false,
        total: this.dataListSize,
        activeName: '0',
        page: 1,
        pageSize: 12,
        videoList: [],
        audioList: [],
        documentList: []
      }
    },
    methods: {
      query(flag, pageNum, pageSize) {
        if (!this.uploadFlag) {
          this.toOnlineClass()
          return false
        }
        this.loading = true
        this.page = flag ? 1 : (pageNum !== undefined && pageNum !== null && pageNum !== '' ? pageNum : this.page)
        const para = {
          pageNum: this.page,
          type: this.filters.type,
          search: this.filters.search,
          enType: this.filters.enType,
          pageSize: pageSize !== undefined && pageSize !== null && pageSize !== '' ? pageSize : this.pageSize
        }
        if (this.isMore) {
          para.pageSize = 12
          this.$query('page/traincourse', para).then((response) => {
            this.loading = false
            if (this.filters.enType === '0') {
              this.documentList = response.data.list
            }
            if (this.filters.enType === '1') {
              this.videoList = response.data.list
            }
            if (this.filters.enType === '2') {
              this.audioList = response.data.list
            }
            this.total = response.data.totalCount
            this.$emit('changeList', this.videoList, this.audioList, this.documentList, response.data.pageNum, response.data.totalCount, this.filters)
          }).catch(() => {
            this.loading = false
          })
        } else {
          para.pageSize = 4
          this.$query('traincourselist', para).then((response) => {
            this.loading = false
            this.videoList = response.data.enType1
            this.audioList = response.data.enType2
            this.documentList = response.data.enType0
            this.total = this.videoList.length + this.audioList.length + this.documentList.length
            this.$emit('changeList', this.videoList, this.audioList, this.documentList, this.filters)
          }).catch(() => {
            this.loading = false
          })
        }
      },
      setFilter(filters) {
        this.filters = filters
      },
      add() {
        this.$router.push({ path: '/handlingGuide/flfg/add' })
      },
      toOnlineClass() {
        this.$gotoid('/micro/onlineClassRoom', JSON.stringify(this.filters))
      },
      uploadFile() {
        const para = {
          param: this.filters,
          jumpType: this.isMore ? (this.filters.enType) : 'online'
        }
        this.$gotoid('/micro/uploadFile', JSON.stringify(para))
      },
      myLearning() {
        const para = {
          param: this.filters,
          jumpType: this.isMore ? (this.filters.enType) : 'online'
        }
        this.$gotoid('/micro/myLearning', JSON.stringify(para))
      }
    }
  }
</script>
<style>
  .classRoom_filter{
    height: 190px;
  }
  .classRoom_filter .el-input-group__append {
    background: #0082e6;
    border: none;
  }
  .classRoom_filter .el-form-item__content {
    width: 100%;
  }
  .classRoom_filter .tabsDiv {
    width: 50%;
    height: auto;
    margin: 0 auto;
    position: relative;
  }
  .classRoom_filter .tabsDiv .el-tabs {
    width: 100%;
    padding: 0 10px;
  }
  .classRoom_filter .file_count{
    height: 50px;
  }
  .classRoom_filter .file_count div{
    display: inline-block;
    float: left;
    height: 50px;
    line-height: 50px;
  }
  .classRoom_filter .file_count div:last-child{
    float: right;
    margin-right: 10px;
  }
  .classRoom_filter .file_count.bottonLine{
    border-bottom: 2px solid #fff;
  }
</style>
