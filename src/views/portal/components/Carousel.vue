<template>
  <div class="carouselBox">
    <el-carousel v-if="carouselData.length > 0" trigger="click" :autoplay="false" indicator-position="none" arrow="never" class="carouselCont" v-loading="loading">
      <el-carousel-item v-for="(n, nindex) in limit" :key="nindex">
        <ul class="portal_carousel_ul">
          <li v-for="(data,index) in carouselData" v-if="split * nindex <= index && index < n * split" class="portal_carousel_li" :key="index">
            <div class="content">
              <div @click="toAjDetail(data.AJBH)">
                <p @click="toAjDetail(data.AJBH)" class="mainText ellipsis-word"><span v-if="data.AJMC == null || data.AJMC === ''">{{data.AJLB}}</span><span v-else>{{ data.AJMC }}</span></p>
                <!-- <el-button type="text" @click="toAjDetail(data.AJBH)"><span v-if="data.AJMC == null || data.AJMC === ''">{{data.AJLB}}</span><span v-else>{{ data.AJMC }}</span></el-button> -->
              </div>
              <span class="f_color_F23F42 text_ellipsis subTit"><i class="f_color_F23F42"></i> {{data.tips}}
                <el-popover v-if="data.childs.length > 0"
                            placement="bottom"
                            width="400"
                            trigger="hover">
                  <div v-for="(item,index) in data.childs" :key="index">
                    <i class="f_color_F23F42">•</i>
                    <span class="f_color_F23F42">{{item.tips}}</span>
                  </div>
                  <i class="el-icon-more" slot="reference" style="cursor: pointer"></i>
              </el-popover>
              </span>
              <!--<el-collapse v-else v-model="initActiveName" accordion @change="collapseChange">-->
                <!--<el-collapse-item :name="'collapse'+index" class="portal_collapse">-->
                  <!--<template slot="title">-->
                    <!--<span v-if="show === true &&  ((activeName === '' && initActiveName === 'collapse'+index) || activeName === 'collapse'+index)">-->
                      <!--<span class="f_color_F23F42"><i class="f_color_F23F42">•</i> {{data.tips}}</span>-->
                    <!--</span>-->
                    <!--<span v-else>-->
                      <!--<span class="f_color_F23F42 text_ellipsis"><i class="f_color_F23F42">•</i> {{data.tips}} <span class="f_color_F23F42">(共{{data.num + 1}}项)</span></span>-->
                      <!--&lt;!&ndash;<span class="f_color_F23F42 pos_top">(共{{data.num + 1}}项)</span>&ndash;&gt;-->
                    <!--</span>-->
                  <!--</template>-->
                  <!--<div v-for="(item,index) in data.childs" :key="index">-->
                    <!--<i class="f_color_F23F42">•</i>-->
                    <!--<span class="f_color_F23F42">{{item.tips}}</span>-->
                  <!--</div>-->
                <!--</el-collapse-item>-->
              <!--</el-collapse>-->
            </div>
            <div class="btn">
              <el-button class="bor_btn" v-if="data.enable === 1" size="mini" type="primary" round @click="saveConcernCase(data.AJBH , data.cid, data.enable)">已关注</el-button>
              <el-button class="bor_btn" v-else size="mini" type="primary" round @click="saveConcernCase(data.AJBH , data.cid, data.enable)"><span>+</span> 关注</el-button>
            </div>
          </li>
        </ul>
      </el-carousel-item>
    </el-carousel>
    <div v-if="carouselData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
  </div>
</template>

<script>
  import {
    getDYAListPage, geGetAjOne
  } from '@/api/portal'
  import {
    concernCase, cancelConcern
  } from '@/api/common'
  export default {
    name: 'Carousel',
    data() {
      return {
        limit: 0,
        split: 5,
        loading: false,
        carouselData: [],
        initActiveName: 'collapse0',
        activeName: '',
        show: true,
        curUserId: ''
      }
    },
    methods: {
      getLen() {
        if (this.carouselData.length < this.split) {
          this.limit = 1
        } else {
          const s = parseInt(this.carouselData.length / this.split)
          const y = this.carouselData.length % this.split === 0 ? 0 : 1
          this.limit = s + y
        }
      },
      query() {
        const para = {
          pageNum: 1,
          pageSize: 100
        }
        this.loading = true
        getDYAListPage(para).then((response) => {
          if (response.data && response.data.list) {
            const data = response.data.list
            let newData = []
            data.forEach(function(item, index) {
              if (newData.length > 0) {
                let flag = false
                newData.forEach(function(newItem, index) {
                  if (item.AJBH === newItem.AJBH) {
                    newItem.childs.push(item)
                    newItem.num += 1
                    flag = true
                  }
                })
                if (!flag) {
                  item.childs = []
                  item.num = 0
                  newData.push(item)
                }
              } else {
                item.childs = []
                item.num = 0
                newData.push(item)
              }
            })
            if (newData.length > 6) {
              newData = newData.slice(0, 6)
            }
            this.carouselData = newData
            this.loading = false
          }
        })
      },
      collapseChange(val) {
        if (val) {
          this.show = true
          this.activeName = val
        } else {
          this.show = false
          this.activeName = ''
        }
      },
      toAjDetail(bh) {
        if (bh) {
          geGetAjOne({
            ajbh: bh
          }).then((res) => {
            if (res.data) {
              // this.$router.push({
              //   path: '/caseManage/detailSyh/' + res.data.id
              // })
              this.$router.push({
                path: '/caseFile/index', query: { id: res.data.id }
              })
            }
          })
        }
      },
      saveConcernCase(AJBH, cid, enable) {
        if (cid) {
          const flag = enable ? 0 : 1
          const msg = enable ? '取消关注' : '关注成功'
          cancelConcern({
            id: cid, enable: flag
          }).then((res) => {
            if (res.code === '000000') {
              this.$message({
                message: msg,
                type: 'success'
              })
              this.query()
            }
          })
        } else if (!cid && !this.isConcern) {
          concernCase({
            AJBH: AJBH, userId: this.curUserId
          }).then((res) => {
            if (res.code === '000000') {
              this.$message({
                message: '关注成功',
                type: 'success'
              })
              this.query()
            }
          })
        }
      }
    },
    mounted() {
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (curUser) {
        this.curUserId = curUser.id
      }
      this.query()
      this.getLen()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.carouselBox{
  .portal_carousel_ul, .portal_carousel_ul p{
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
  .portal_carousel_ul .portal_carousel_li{
    list-style: none;
    margin-bottom: 8px;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex;
    justify-content: space-between;
  }
  .portal_carousel_ul .portal_carousel_li:last-child{
    margin-bottom: 0;
  }
  .portal_carousel_ul .content{
    width: 90%;
    margin-right: 10px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1; /** 显示的行数 **/
    overflow: hidden;  /** 隐藏超出的内容 **/
    padding-left:25px;
    position: relative;
    &::before{
      display: inline-block;
      content: '';
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #6cbef2;
      position: absolute;
      left: 0;
      top: 3px;
    }
  }
  .portal_carousel_ul .portal_carousel_li div.btn{
    margin-top: 10px;
  }
  .portal_carousel_ul .portal_carousel_li div.btn .bor_btn{
    // background-color: #fff;
    padding: 5px 0;
    color: #fff;
    background-color: rgba(0, 89, 130, 0.6);
	  border-radius: 4px;
	  border: solid 1px rgb(0, 160, 233);
  }
  .portal_carousel_ul .portal_carousel_li div.btn .bor_btn:hover{
    background-color: #c6e2ff;
    color: #1E98D2;
  }
  .portal_carousel_ul .portal_carousel_li span p{
    margin-bottom: 2px;
    color: #333;
    font-size: 12px;
  }
  // .f_color_F23F42{
  //   color: #F23F42;
  // }
  .portal_collapse{
    padding-bottom: 6px;
  }
  .portal_collapse .pos_top{
    /*display: inline-block;*/
    /*position: relative;*/
    top: -6px;
  }
  .text_ellipsis{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    color: #999;
  }
  .mainText{
    color: #fff;
    cursor: pointer;
    &:hover {
      color: #3da1ff
    }
  }
  .subTit{
    color: #00a0e9;
  }
}

  @media only screen and (min-width: 1920px){
    .text_ellipsis{
      width: 83%;
    }
  }
  @media only screen and (min-width: 1800px){
    .text_ellipsis{
      width: 82%;
    }
  }
  @media only screen and (max-width: 1800px){
    .text_ellipsis{
      width: 81%;
    }
  }
  @media only screen and (max-width: 1700px){
    .text_ellipsis{
      width: 80%;
    }
  }
  @media only screen and (max-width: 1600px){
    .text_ellipsis{
      width: 80%;
    }
  }
  @media only screen and (max-width: 1420px){
    .text_ellipsis{
      width: 78%;
    }
  }
  @media only screen and (max-width: 1360px){
    .text_ellipsis{
      width: 78%;
    }
  }
  @media only screen and (max-width: 1330px){
    .text_ellipsis{
      width: 70%;
    }
  }
  @media only screen and (max-width: 1280px){
    .text_ellipsis{
      width: 75%;
    }
  }
  @media only screen and (max-width: 1152px){
    .text_ellipsis{
      width: 70%;
    }
  }
  @media only screen and (max-width: 1024px){
    .text_ellipsis{
      width: 60%;
    }
  }
  @media only screen and (max-width: 800px){
    .text_ellipsis{
      width: 48%;
    }
  }
  .carouselCont .el-button--mini, .carouselCont .el-button--mini.is-round{
    width: 60px;
    padding: 4px 0;
  }
</style>
