<template>
  <div class="faqIndex">
    <el-card style="height: 650px;  margin: auto">
      <div slot="header">
        <span>制度列表</span>
      </div>
      <div class="search">
        <el-form :inline="true" :model="infoForm" size="small" label-position="left" label-width="82px">
          <el-form-item label="制度规范:" prop="institutionalName" class="el-from">
            <el-input v-model="infoForm.institutionalName" clearable maxlength="20" placeholder="请输入" class="el-from"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <ul>
        <li @click="click()" class="listyle" with="80%">
          {{dataOne}}
        </li>
        <li @click="click()" class="devstyle" with="10%">
          2018-07-09
        </li>
      </ul>
      <ul>
        <li @click="click()" class="listyle" with="80%">
          {{dateTwo}}
        </li>
        <li @click="click()" class="devstyle"with="10%">
          2018-07-09
        </li>
      </ul>
      <ul>
        <li @click="click()" class="listyle" with="80%">
          {{dateThree}}
        </li>
        <li @click="click()" class="devstyle"with="10%">
          2018-07-09
        </li>
      </ul>
      <ul>
        <li @click="click()" class="listyle" with="80%">
          {{dateFour}}
        </li>
        <li @click="click()" class="devstyle"with="10%">
          2018-07-09
        </li>
      </ul>
      <ul>
        <li @click="click()" class="listyle" with="80%">
          {{dateFive}}
        </li>
        <li @click="click()" class="devstyle"with="10%">
          2018-07-09
        </li>
      </ul>
    </el-card>
    <el-pagination
      :page-sizes="[10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="5"
      style="text-align: right; margin: auto; margin-top: 10px;">
    </el-pagination>
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
        }
      }
    },
    methods: {
      click() {
        this.$router.push({
          path: '/knowledgeBase/institutionalNormsInfo'
        })
      }
    }
  }
</script>

<style scoped>
  .listyle{
    margin-left: 50px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #FFFFFF;
    display: inline-block;
  }
  .listyle:hover {
    cursor:pointer;
    color: #9C160C;
    text-decoration: none;
  }
  .devstyle{
    margin-left: 50px;
    margin-top: 20px;
    font-size: 14px;
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
    margin-top: 20px;
    font-size: 14px;
    margin-top: 20px;
  }
  .el-from {
    font-size: 14px;
  }
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
