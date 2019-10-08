<template>
  <div id="player" class="document">
    <div class="pdf">
      <pdf :src="enPath"
        :page="currentPage"
        @num-pages="pageCount=$event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler">
      </pdf>
      <p class="arrow">
        <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage === 1}">上一页</span>
        {{currentPage}} / {{pageCount}}&nbsp;&nbsp;&nbsp;
        <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage === pageCount}">下一页</span>
      </p>
    </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  export default {
    props: [
      'documentPath'
    ],
    components: {
      pdf
    },
    data() {
      return {
        enPath: this.documentPath,
        currentPage: 0,
        pageCount: 0
      }
    },
    methods: {
      // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
      changePdfPage(val) {
        // console.log(val)
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
          // console.log(this.currentPage)
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
          // console.log(this.currentPage)
        }
      },
      // pdf加载时
      loadPdfHandler(e) {
        this.currentPage = 1 // 加载的时候先加载第一页
      }
    },
    watch: {
      'documentPath': function(documentPath) {
        this.enPath = documentPath
      }
    },
    // created() {
    //   this.detailData.enPath = pdf.createLoadingTask('/down/test.pdf')
    // },
    mounted() {
    }
  }
</script>

<style>
  .document .documentPlayer_txt{
    height: 45px;
    line-height: 45px;
    padding: 0 10px;
    background-image: linear-gradient(to bottom , #f2f2f2, #e5e5e5);
    color: #777777;
    border: 1px solid #ccc;
    text-shadow:0 0 2px #777777;
  }
  .document .documentPlayer_txt ul {
    margin-bottom: 0;
    height: 45px;
    line-height: 45px;
  }
  .document .documentPlayer_txt ul li{
    float: left;
    width: 20%;
  }
  .document .documentPlayer_txt ul li:nth-child(2),
  .document .documentPlayer_txt ul li:nth-child(3){
    width: 27%;
  }
  .document .documentPlayer_txt ul li:last-child{
    width: 5%;
  }
  .document .documentPlayer_txt .el-button.el-button--text.el-button--small{
    color: #777777;
  }
  .document .documentPlayer_txt .el-button.el-button--text.el-button--small:hover{
    color: #00A0E9;
    background-color: rgba(102, 102, 102, 0.3);
    border-radius: 50%;
  }
  .document .documentPlayer_txt .el-icon-download:before{
    font-size: 18px;
    font-weight: bolder;
  }
  .document .documentPlayer_txt svg{
    width: 22px;
    height: 22px;
    position: relative;
    left:  1px;
    top: -1px;
  }
  .document .arrow{
    margin-top: 20px;
    text-align: center;
  }
  .document .arrow span{
    background-color: #005178;
    padding: 4px 15px;
    border: 1px solid #00A0E9;
    border-radius: 4px;
    margin-right: 15px;
    font-size: 14px;
  }
  .document .arrow span:hover{
    background-color: #0077af;
    cursor: pointer;
  }
</style>
