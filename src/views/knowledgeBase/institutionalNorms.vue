<template>
  <div class="faqIndex">
    <el-card>
      <div slot="header">
        <span>制度列表</span>
      </div>
      <div class="search">
        <el-form :inline="true" :model="infoForm" size="small" label-position="left" label-width="82px">
          <el-form-item label="制度规范:" prop="institutionalName" class="el-from">
            <el-input v-model="infoForm.institutionalName" clearable maxlength="20" placeholder="请输入" class="el-from"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round icon="el-icon-search" @click="query(true,true)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="listLoading" :style="{maxHeight:contListHeight}" class="ulWrap">
        <ul  v-for="(item,index) in list" :key="index" class="ul">
          <li @click="click()" class="listyle" style="width:80%;">
            {{item.name}}
          </li>
          <li @click="click()" class="" width="10%">
             {{item.dateTime}}
          </li>
        </ul>
      </div>
    </el-card>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: 'institutionalNorms', // 制度规范
    data() {
      return {
        dataOne: '中华人民共和国环境影响评价法(2018修正)',
        dateTwo: '中华人民共和国环境噪声污染防治法(2018修正)',
        dateThree: '中华人民共和国大气污染防治法(2018修正)',
        dateFour: '中华人民共和国环境保护税法(2018修正)',
        dateFive: '中华人民共和国防沙治沙法(2018修正)',
        infoForm: {
          institutionalName: ''
        },
        list: [
          {
            name: '中华人民共和国环境影响评价法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国环境噪声污染防治法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国大气污染防治法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国环境保护税法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          },
          {
            name: '中华人民共和国防沙治沙法(2018修正)',
            dateTime: '2018-07-09'
          }
        ],
        listLoading: false,
        contListHeight: null,
        total: 0,
        page: 1,
        pageSize: 15
      }
    },
    methods: {
      query(flag, hand) {
        // this.listLoading = true
        // this.infoForm.pageNum = flag ? 1 : this.page
        // this.infoForm.pageSize = this.pageSize
        // if (hand) { // 手动点击时，添加埋点参数
        //   this.infoForm.logFlag = 1
        // }
        // this.$query('', this.infoForm).then((res) => {
        //   this.flwsLoading = false
        //   if (res.data && res.data.list && res.data.list > 0) {
        //     this.list = res.data.list
        //   }
        // }).catch(() => {
        //   this.listLoading = false
        // })
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
        this.query(false, true)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(true, true)
      },
      click() {
        this.$router.push({
          path: '/knowledgeBase/institutionalNormsInfo'
        })
      }
    },
    mounted() {
      this.contListHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 280 + 'px'
      this.query(true)
    }
  }
</script>

<style scoped>
  .ulWrap{
    overflow: auto;
  }
  .ul{
    display: flex;
    justify-content: space-around;
  }
  .ul li{
    padding:2px 0;
  }
  .listyle:hover {
    cursor:pointer;
    color: #3da1ff;
    text-decoration: none;
  }
  .devstyle{
    margin-left: 50px;
    margin-top: 20px;
    font-size: 16px;
    float:right;
    margin-right: 50px;
    color: #FFFFFF;
  }
  .mian {
    width: 885px;
    height: 1000px;
    margin: auto;
  }
  .search {
    margin-left: 50px;
    /* font-size: 14px; */
  }
  /* .el-from {
    font-size: 14px;
  } */
  .faqIndex .item {
    margin-top: 10px;
  }
  .faqIndex .is-always-shadow {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .faqIndex .title {
    cursor: pointer;
    padding-bottom: 10px;
  }

  .faqIndex .title button {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 16px;
    color: #f7f0f0;
    padding: 0;
  }

  .faqIndex .title button:hover {
    color: #1b75ba;
  }

  .faqIndex .content {
    color: #646464;
  }

  .faqIndex .bm {
    margin-top: 10px;
    font-size: 12px;
    color: #00a0e9;
  }

  .faqIndex .bm span {
    display: inline-block;
    margin-right: 15px;
  }

  .faqIndex .i-icon {
    margin-right: 5px;
  }

  .faqIndex .menu {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
  }

  .faqIndex .activeSpan {
    background-color: rgba(0, 160, 233, 0.6);
  }
  .faqIndex .menu:hover {
    background-color: rgba(188, 232, 252, 0.1);
  }
</style>
