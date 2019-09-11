<template>
  <section class="curriculumLearn">
    <el-row type="flex" justify="center" >
      <el-col :span="16">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-card style="overflow:auto;" :style="{maxHeight:countHeight}">
              <div slot="header">
                <span>培训资料分类</span>
              </div>
              <div>
                <ul>
                  <li class="menu" @click="toSearch(1,true,true)" :class="active === '1'?'activeSpan':''">食品安全</li>
                  <li class="menu" @click="toSearch(2,true,true)" :class="active === '2'?'activeSpan':''">药品安全</li>
                  <li class="menu" @click="toSearch(3,true,true)" :class="active === '3'?'activeSpan':''">环境相关</li>
                  <li class="menu" @click="toSearch(4,true,true)" :class="active === '4'?'activeSpan':''">食药相关</li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="17" v-loading="listLoading">
            <el-card>
              <div class="contentHeader">
                <span style="font-size: 16px;font-weight: bold;">{{ typeLabel[type] }}</span>
                <div style="display: flex;flex-wrap: nowrap;">
                  <el-input placeholder="请输入查询内容" v-model="searchValue" clearable></el-input>
                  <el-button style="margin-left:5px;" @click="query">查询</el-button>
                </div>
              </div>
            </el-card>
            <div style="overflow:auto;" :style="{maxHeight:countHeight}">
              <el-card v-for="(item, index) in curriculumData" :key="index" :value="item" class="item">
                <el-row>
                  <el-col class="title">
                    <el-button type="text"  :title="item.name" class="ellipsis-word" style="text-align: left">
                      {{item.name}}
                    </el-button>
                  </el-col>
                  <el-col class="content">
                    <span>{{ item.content }}</span>
                  </el-col>
                  <!--<el-col class="content">都市标题美美的标题</el-col>-->
                  <el-col class="bm" :span="20">
                    <span><i class="el-icon-view i-icon"></i>{{item.browse_num?item.browse_num:0}}</span>
                    <span>时间：{{ item.onlineTime }}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-button style="float:right;" @click="handleLearn(index, item)">{{ learnLabel[item.learnStatus] }}</el-button>
                  </el-col>
                </el-row>
              </el-card>
              <el-card v-if="!curriculumData||curriculumData.length===0" style="text-align: center; line-height: 60px; height: 100px;"
                      class="item">
                暂无数据
              </el-card>
            </div>
            <el-pagination v-if="total>0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                           :page-size="search.pageSize" :total="total" :current-page="search.pageNum" style="float:right;">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'curriculumLearn',
  data() {
    return {
      listLoading: false,
      searchValue: '',
      active: '1',
      countHeight: null,
      curriculumData: [],
      type: '',
      search: {
        category: '',
        pageSize: 15,
        pageNum: 1
      },
      total: 0,
      typeLabel: {
        1: '食品安全',
        2: '药品安全',
        3: '环境相关',
        4: '食药相关'
      },
      learnLabel: {
        1: '开始学习',
        2: '继续学习',
        3: '完成学习'
      }
    }
  },
  methods: {
    toSearch(type, flag, hand) {
      this.type = type
      this.listLoading = true
      // var param = {
      //   pageSize: this.search.pageSize,
      //   pageNum: flag ? 1 : this.search.page
      // }
      // if (hand) { // 手动点击时，添加埋点参数
      //   param.logFlag = 1
      // }
      // this.$query('', param).then((response) => {
      //   this.listLoading = false
      //   if (response.data && response.data.list && response.data.list.length > 0) {
      //     this.curriculumData = response.data.list
      //     this.search.page = response.data.totalCount
      //     this.search.pageSize = response.data.pageSize
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
      if (type === 1) {
        this.curriculumData = [
          { name: '食品安全基础知识', type: '食品安全', time: '30分钟', teacher: '张教授', content: '食品营养与卫生、食物中毒及预防、食物的微生物污染、虫鼠害防控基础知识等', provider: '省厅', status: 1, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 3 },
          { name: '食品安全法律法规', type: '食品安全', time: '40分钟', teacher: '王教授', content: '食品生产经营日常监督检查管理办法、食品生产经营风险分级管理办法、食品召回管理办法、进出口食品安全管理办法等', provider: '省厅', status: 2, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 1 },
          { name: '食品生产法律法规', type: '食品安全', time: '90分钟', teacher: '王教授', content: '食品生产许可管理办法', provider: '省厅', status: 3, publish: 2, onlineTime: '2019-04-01 09：00：01', learnStatus: 2 },
          { name: '食品安全标准', type: '食品安全', time: '90分钟', teacher: '王教授', content: '食品添加剂及其管理规定、食品安全标准在食品安全监管中的作用、中外食品安全国家标准比较解读等', provider: '省厅', status: 3, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 3 },
          { name: '综合素质专题', type: '食品安全', time: '30分钟', teacher: '王教授', content: '食品安全事故及应急管理。', provider: '省厅', status: 4, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 3 }
        ]
        this.active = '1'
      } else if (type === 2) {
        this.curriculumData = [
          { name: '药品监管基础知识', type: '药品安全', time: '30分钟', teacher: '李老师', content: '药品概念、药品特性、常见术语的解释', provider: '省厅', status: 1, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 3 },
          { name: '药品的电子监管', type: '药品安全', time: '30分钟', teacher: '赵老师', content: '为配合推进医药卫生体制改革和药品安全专项整治工作，加强基本药物质量监管...', provider: '省厅', status: 2, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 1 },
          { name: '冷冻和冷藏药品的质量管理', type: '药品安全', time: '30分钟', teacher: '赵老师', content: '无', provider: '省厅', status: 3, publish: 1, onlineTime: '2019-04-01 09：00：01', learnStatus: 2 }
        ]
        this.active = '2'
      } else {
        this.curriculumData = []
      }
      this.total = this.curriculumData.length
      this.listLoading = false
    },
    query() {
      // const param = {
      //   value: this.searchValue,
      //   type: this.active,
      //   logFlag: 1 // 手动点击时，添加埋点参数
      // }
    },
    handleCurrentChange(val) {
      this.search.pageNum = val
      this.toSearch(this.active, false, true)
    },
    handleSizeChange(val) {
      this.search.pageNum = 1
      this.search.pageSize = val
      this.toSearch(this.active, true, true)
    },
    handleLearn(index, row) {
      switch (row.learnStatus) {
        case 1:
          this.curriculumData[index].learnStatus = 2
          break
        case 2:
          this.curriculumData[index].learnStatus = 3
          break
        case 3:
          this.curriculumData[index].learnStatus = 3
          break
        default:
          break
      }
      this.$router.push({
        path: '/educational/onlineTraining/beginLearning'
      })
    }
  },
  mounted() {
    this.countHeight = document.documentElement.clientHeight - 180 + 'px'
    this.toSearch(1, true)
  }
}
</script>

<style scoped>
.curriculumLearn .item {
	margin-top: 10px;
}
.curriculumLearn .activeSpan {
  background-color: rgba(0, 160, 233, 0.6);
}
.curriculumLearn .menu {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}
.curriculumLearn .menu:hover {
  background-color: rgba(188, 232, 252, 0.1);
}

.curriculumLearn .menu i {
  font-size: 18px;
  width: 24px;
}
.curriculumLearn .contentHeader {
  display: flex;
  justify-content : space-between;
}
.curriculumLearn .cutOffRule {
  border-bottom: 1px solid #e4e7ed;
  width: 100%;
}
.curriculumLearn .title {
	cursor: pointer;
	padding-bottom: 10px;
}

.curriculumLearn .title button {
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
	font-size: 16px;
	color: #f7f0f0;
	padding: 0;
}
.curriculumLearn .content {
  font-size: 12px;
  color: #f7f0f0;
}
.curriculumLearn .title button:hover {
	color: #1b75ba;
}

.curriculumLearn .bm {
	margin-top: 10px;
	font-size: 12px;
	color: #00a0e9;
}

.curriculumLearn .bm span {
	display: inline-block;
	margin-right: 15px;
}

.curriculumLearn .i-icon {
	margin-right: 5px;
}
</style>
