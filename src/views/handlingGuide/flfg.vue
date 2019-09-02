<template>
  <section style="text-align: center;">
    <!--工具条-->
    <el-form :inline="true" :model="filters">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="食品" name="1">食品</el-tab-pane>
          <el-tab-pane label="药品" name="2">药品</el-tab-pane>
          <el-tab-pane label="环境" name="3">环境</el-tab-pane>
          <el-tab-pane label="综合" name="4">综合</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item style="width: 50%;">
          <el-input size="large" placeholder="在法规中搜索" v-model="filters.word">
            <el-button slot="append" v-on:click="getFlfg" icon="el-icon-search" style="width: 100px; font-size: 20px; color: #fff; line-height: 35px;"></el-button>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item>
          <el-radio v-model="filters.category" label="1">按标题检索</el-radio>
          <el-radio v-model="filters.category" label="2">按正文检索</el-radio>
        </el-form-item>
      </el-col>
    </el-form>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        filters: {
          type: '',
          word: '',
          category: '1'
        },
        activeName: '0'
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getFlfg()
      },
      getFlfg() {
      },
      handleClick(tab, event) {
      }
    },
    mounted() {
      this.getFlfg()
    }
  }
</script>

<style>
.el-input-group__append {
	background: #0082e6;
	border-radius: 0;
}

.el-form-item__content {
	width: 100%;
}

.flfg_query_list_div {
	margin: auto 0;
	border: 1px solid #ccc;
	text-align: left;
}

.flfg_query_list_div div.flfg_list_div {
	height: 40px;
	line-height: 40px;
	text-align: left;
	padding: 10px 20px;
	border-bottom: 1px solid #ccc;
	color: #fff;
	background-color: dimgrey;
}

.flfg_query_list_div ul {
	padding: 0;
	margin: 0;
}

.flfg_query_list_div li {
	list-style: none;
	padding: 10px 20px;
}

.flfg_query_list_div li p {
	margin: 5px 0;
}

.flfg_query_list_div li p span:first-child {
	margin-right: 50px;
}

.flfg_list_title {
	font-size: 16px;
	font-weight: bold;
}

.flfg_list_content {
	padding: 5px 10px;
	border: 1px dashed #666;
}

.bg {
	background: #eee;
}

.el-tabs {
	width: 50%;
	margin: 0 auto;
}

.el-tabs__content {
	display: none;
}
</style>
