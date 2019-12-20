<template>
  <div class="insideInfoDetail">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <el-card class="caseEdit" v-loading="loading">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <div class="title">{{detailData.artTitle}}</div>
          <div class="insideInfoDetail">
            <div class="lineDetail">
              <div><span>信息分类：</span><span>{{ detailData.artGroup ? getType(String(detailData.artGroup)) : '-' }}</span></div>
              <div><span>信息类型：</span><span>{{ detailData.artType ? getCategory(String(detailData.artType)) : '-' }}</span></div>
              <div><span>来源：</span><span>{{detailData.artSourceUrl}}</span></div>
            </div>
          </div>
          <div v-if="detailData.artContent && detailData.artContent !== ''" :style="detailData.artContent && detailData.artContent !== '' ? {maxHeight:tableHeight} : ''" class="flfgContent">
            <div v-html="detailData.artContent" class="e-p-line ql-editor" style="padding: 10px 50px;"></div>
          </div>
          <div class="dataDetail" v-if="detailData.fileList.length > 0">
            <p>附件</p>
            <div class="data_list">
              <p v-for="item in detailData.fileList" :key="item.key"><a @click="downFile(item)">{{item.name}}</a><a @click="downFile(item)"><el-button icon="el-icon-download">点击下载</el-button></a></p>
              <!--<p v-for="item in detailData.fileList" :key="item.key"><a :href="item.path" target="_blank" :download="item.name">{{item.name}}</a><a :href="item.path" target="_blank" :download="item.name"><el-button icon="el-icon-download">点击下载</el-button></a></p>-->
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'caseEdit',
    components: {
    },
    data() {
      return {
        id: '',
        loading: false,
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
        curUser: JSON.parse(sessionStorage.getItem('userInfo')),
        detailData: {
          fileList: []
        },
        tableHeight: null
      }
    },
    methods: {
      getType(val) {
        if (val === '1') {
          return '食品'
        }
        if (val === '2') {
          return '药品'
        }
        if (val === '3') {
          return '环境'
        }
        if (val === '4') {
          return '综合'
        }
      },
      getCategory(val) {
        if (val === '1') {
          return '安全知识'
        }
        if (val === '2') {
          return '政策法规'
        }
        if (val === '3') {
          return '典型案例'
        }
      },
      callback() {
        this.$router.go(-1)
      },
      getDetail() {
        this.loading = true
        this.$query('reptileinfo/' + this.id, {}).then(response => {
          this.loading = false
          this.detailData = response.data
          this.detailData.fileList = []
        }).catch(() => {
          this.loading = false
        })
      },
      downFile(item) {
        const arr = item.path.split('/file')
        const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
        this.$download_http_mg(path, { fileName: item.name })
      }
    },
    created() {
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - 370 + 'px'
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.id) {
          this.id = para.id
          this.getDetail()
        }
      }
    }
  }
</script>

<style>
  .insideInfoDetail{
    padding: 20px 40px;
    display: inline-block;
    width: 100%;
  }
  .insideInfoDetail > div.lineDetail{
    width: 100%;
    padding: 5px;
    display: inline-block;
  }
  .insideInfoDetail > div.lineDetail > div{
    float: left;
    width: 30%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .insideInfoDetail > div.lineDetail > div > span:first-child{
    width: 80px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }
  .flfgContent{
    border-top: 1px solid #eeeeee;
    padding-top: 20px;
    overflow-y: auto;
  }
  .insideInfoDetail .title{
    color: rgb(32, 160, 255);
    font-size: 26px;
    text-align: center;
  }
  .insideInfoDetail .dataDetail{
    margin-top: 20px;
  }
  .insideInfoDetail .dataDetail .data_list{
    padding: 5px 10px;
  }
  .insideInfoDetail .dataDetail .data_list > p{
    display: inline-block;
    width: 100%;
  }
  .insideInfoDetail .dataDetail .data_list > p a:first-child{
    float: left;
    text-decoration: underline;
    cursor: pointer;
  }
  .insideInfoDetail .dataDetail .data_list > p a:last-child{
    float: right;
  }

</style>
